import { inngest } from "./client";
import { createAdminClient } from "@/utils/supabase/admin";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    // Wait for 1 second simulating a background job initialization
    await step.sleep("wait-a-moment", "1s");
    
    // Return to mark process success natively on dashboard
    return {
      message: `Hello ${event.data?.email || "World"}!`,
      status: "Background check passed!"
    };
  }
);

export const generateVideo = inngest.createFunction(
  { id: "generate-video", triggers: [{ event: "video/generate" }] },
  async ({ event, step }) => {
    // 1. Fetch Series data from supabase
    const seriesData = await step.run("fetch-series-data", async () => {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .eq('id', event.data.seriesId)
        .single();
        
      if (error) {
        throw new Error(`Failed to fetch series: ${error.message}`);
      }
      return data;
    });

    // 2. Generate Video Script using AI
    // 2. Generate Video Script using AI
    const scriptData = await step.run("generate-video-script", async () => {
      let imagePromptCountInstruction = '5-6 scenes';
      if (seriesData.video_duration === '30-50') {
        imagePromptCountInstruction = '4-5 scenes';
      } else if (seriesData.video_duration === '60-90') {
        imagePromptCountInstruction = '5-6 scenes';
      } else if (seriesData.video_duration === '120-180') {
        imagePromptCountInstruction = '8-12 scenes';
      }

      const systemPrompt = `You are an AI Video Script Generator with multi-model fallback capability.

TASK:
Generate a structured JSON response for a video generation pipeline.

INPUT:
* Video Niche: ${seriesData.niche_id}
* Duration: ${seriesData.video_duration}
* Video Style: ${seriesData.video_style_id}
* Language: ${seriesData.language}

OUTPUT RULES:
1. Return ONLY valid JSON.
2. Do NOT include any explanation, markdown, or extra text.
3. Output must be directly usable in code (machine-readable).
4. Script must be natural, human-like, and suitable for voiceover.

STRUCTURE:
{
  "title": "string",
  "duration": "string",
  "niche": "string",
  "style": "string",
  "scenes": [
    {
      "scene": number,
      "voiceover": "string",
      "image_prompt": "string"
    }
  ]
}

SCENE RULES:
* The duration requires ${imagePromptCountInstruction}. Ensure exactly this many scenes are generated.

SCRIPT RULES:
* Hook -> Build -> Climax -> Ending
* Voiceover must feel natural and conversational
* Each scene: 1-3 lines max
* No repetition

IMAGE PROMPT RULES:
Each image prompt must include:
* subject
* environment
* lighting
* mood
* camera style
FORMAT: "Highly detailed cinematic scene of [subject], in [environment], with [lighting], [mood], shot using [camera style], ultra realistic, 4k"

FINAL OUTPUT:
Return ONLY JSON. No extra text under any condition.`;

      const extractJson = (text: string) => {
        let cleanText = text.trim();
        if (cleanText.startsWith('```json')) cleanText = cleanText.substring(7);
        else if (cleanText.startsWith('```')) cleanText = cleanText.substring(3);
        if (cleanText.endsWith('```')) cleanText = cleanText.substring(0, cleanText.length - 3);
        return JSON.parse(cleanText.trim());
      };

      const tryGemini = async () => {
        const { GoogleGenAI } = await import('@google/genai');
        if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: systemPrompt,
          config: { responseMimeType: "application/json" }
        });
        if (!response.text) throw new Error("Empty response");
        return extractJson(response.text);
      };

      const tryOpenRouter = async () => {
        if (!process.env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY missing");
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}` },
          body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct",
            messages: [{ role: "user", content: systemPrompt }],
            response_format: { type: "json_object" }
          })
        });
        if (!res.ok) throw new Error(`OpenRouter error: ${await res.text()}`);
        const data = await res.json();
        return extractJson(data.choices[0].message.content);
      };

      // 1. Try Gemini (with 1 retry, so 2 attempts total)
      for (let i = 0; i < 2; i++) {
        try {
          return await tryGemini();
        } catch (e) {
          console.error(`Gemini attempt ${i + 1} failed:`, e);
        }
      }

      // 2. Try OpenRouter (1 attempt)
      try {
        return await tryOpenRouter();
      } catch (e) {
        console.error("OpenRouter fallback failed:", e);
      }

      throw new Error("All models failed to generate video script.");
    });

    // 3. Generate Voice using TTS model
    const voiceData = await step.run("generate-voice", async () => {
      const { VOICES } = await import('@/lib/constants/language-voice-data');
      const selectedVoice = VOICES.find(v => v.id === seriesData.voice_id);
      
      if (!selectedVoice) {
        throw new Error(`Voice configuration not found for id: ${seriesData.voice_id}`);
      }

      const supabase = createAdminClient();
      // Ensure bucket exists so we don't blow up Inngest state limit
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(b => b.name === 'series_assets')) {
        await supabase.storage.createBucket('series_assets', { public: true });
      }

      const generatedAudios = [];

      for (const sceneInfo of scriptData.scenes) {
        if (!sceneInfo.voiceover || sceneInfo.voiceover.trim() === '') continue;

        let audioBuffer: ArrayBuffer;

        if (selectedVoice.provider === 'deepgram') {
          if (!process.env.DEEPGRAM_API_KEY) throw new Error("DEEPGRAM_API_KEY is not set.");
          
          // Deepgram only has specific Aura models natively available.
          // Map placeholders to valid Deepgram Aura models:
          let deepgramModel = 'aura-asteria-en'; // default female
          const name = selectedVoice.modelName.toLowerCase();
          
          if (name === 'arcas') deepgramModel = 'aura-arcas-en';
          else if (selectedVoice.gender === 'male') deepgramModel = 'aura-orion-en';
          else deepgramModel = 'aura-asteria-en';

          const response = await fetch(`https://api.deepgram.com/v1/speak?model=${deepgramModel}`, {
            method: 'POST',
            headers: {
              'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: sceneInfo.voiceover })
          });

          if (!response.ok) {
            throw new Error(`Deepgram API error: ${await response.text()}`);
          }
          audioBuffer = await response.arrayBuffer();
        } 
        else if (selectedVoice.provider === 'fonadalab') {
          if (!process.env.FONADALAB_API_KEY) throw new Error("FONADALAB_API_KEY is not set.");

          // Map language code to Fonadalab language name
          const langMap: Record<string, string> = {
            'hi-IN': 'Hindi',
            'ta-IN': 'Tamil',
            'te-IN': 'Telugu',
            'en-US': 'English',
            'mr-IN': 'Marathi',
            'kn-IN': 'Kannada',
            'bn-IN': 'Bengali',
            'ml-IN': 'Malayalam',
            'gu-IN': 'Gujarati',
            'pa-IN': 'Punjabi'
          };
          const languageReq = langMap[selectedVoice.lang] || 'English';

          const response = await fetch('https://api.fonada.ai/tts/generate-audio-large', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.FONADALAB_API_KEY}`
            },
            body: JSON.stringify({
              input: sceneInfo.voiceover,
              voice: selectedVoice.modelName,
              language: languageReq
            })
          });

          if (!response.ok) {
            throw new Error(`Fonadalabs API error: ${await response.text()}`);
          }
          audioBuffer = await response.arrayBuffer();
        } else {
          throw new Error("Unknown TTS provider");
        }

        // Upload to Supabase Storage
        const fileName = `${event.data.seriesId}/scene-${sceneInfo.scene}-${Date.now()}.mp3`;
        const { error: uploadError } = await supabase
          .storage
          .from('series_assets')
          .upload(fileName, audioBuffer, {
            contentType: 'audio/mpeg',
            upsert: true
          });

        if (uploadError) {
          throw new Error(`Failed to upload audio to Supabase Storage: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage.from('series_assets').getPublicUrl(fileName);

        generatedAudios.push({
          scene: sceneInfo.scene,
          audioUrl: publicUrlData.publicUrl
        });
      }

      return { audios: generatedAudios };
    });

    // 4. Generate Caption using Model
    const captionData = await step.run("generate-captions", async () => {
      if (!process.env.DEEPGRAM_API_KEY) {
        throw new Error("DEEPGRAM_API_KEY is not set.");
      }

      const generatedCaptions = [];

      for (const audio of voiceData.audios) {
        const response = await fetch('https://api.deepgram.com/v1/listen?smart_format=true&model=nova-3', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url: audio.audioUrl })
        });

        if (!response.ok) {
          throw new Error(`Deepgram transcription error: ${await response.text()}`);
        }

        const data = await response.json();
        const words = data.results?.channels?.[0]?.alternatives?.[0]?.words || [];
        
        const formattedCaptions = words.map((w: any) => ({
          text: w.punctuated_word || w.word,
          start: w.start,
          end: w.end
        }));

        generatedCaptions.push({
          scene: audio.scene,
          captions: formattedCaptions
        });
      }

      return { captions: generatedCaptions };
    });

    // 5. Generate Images from image prompt generated data from step 2
    const imageData = await step.run("generate-images", async () => {
      const Replicate = (await import('replicate')).default;
      if (!process.env.REPLICATE_API_TOKEN) {
        throw new Error("REPLICATE_API_TOKEN is not set.");
      }
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      });

      const generatedImages = [];
      const supabase = createAdminClient();

      for (const sceneInfo of scriptData.scenes) {
        if (!sceneInfo.image_prompt) continue;

        let imageBuffer: ArrayBuffer | null = null;
        let lastError: any = null;

        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            console.log(`Generating image for scene ${sceneInfo.scene}, attempt ${attempt}`);
            const output: any = await replicate.run(
              "bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe",
              {
                input: {
                  prompt: sceneInfo.image_prompt,
                  num_outputs: 1,
                  scheduler: "K_EULER",
                  num_inference_steps: 4,
                  guidance_scale: 0
                }
              }
            );

            if (typeof output[0].arrayBuffer === 'function') {
              imageBuffer = await output[0].arrayBuffer();
            } else {
              const res = await fetch(typeof output[0] === 'string' ? output[0] : output[0].url());
              imageBuffer = await res.arrayBuffer();
            }
            break; // success
          } catch (err) {
            lastError = err;
            console.error(`Replicate image generation attempt ${attempt} failed:`, err);
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          }
        }

        if (!imageBuffer) {
          throw new Error(`Failed to generate image after 3 attempts: ${lastError?.message}`);
        }

        const fileName = `${event.data.seriesId}/scene-${sceneInfo.scene}-img-${Date.now()}.png`;
        let uploadSuccess = false;
        
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            console.log(`Uploading image for scene ${sceneInfo.scene}, attempt ${attempt}`);
            const { error: uploadError } = await supabase
              .storage
              .from('series_assets')
              .upload(fileName, imageBuffer, {
                contentType: 'image/png',
                upsert: true
              });

            if (uploadError) {
              throw new Error(uploadError.message);
            }
            uploadSuccess = true;
            break;
          } catch (err) {
            lastError = err;
            console.error(`Supabase upload attempt ${attempt} failed:`, err);
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          }
        }

        if (!uploadSuccess) {
          throw new Error(`Failed to upload image to Supabase Storage after 3 attempts: ${lastError?.message}`);
        }

        const { data: publicUrlData } = supabase.storage.from('series_assets').getPublicUrl(fileName);

        generatedImages.push({
          scene: sceneInfo.scene,
          imageUrl: publicUrlData.publicUrl
        });
      }

      return { images: generatedImages };
    });

    // 6. Save everything to database
    const saveResult = await step.run("save-to-database", async () => {
      const supabase = createAdminClient();
      
      // 1. Update the main video record linked to the series
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .update({
          title: scriptData.title,
          status: 'pending_review'
        })
        .eq('id', event.data.videoId)
        .select()
        .single();
        
      if (videoError || !videoData) {
        throw new Error(`Failed to save video record: ${videoError?.message}`);
      }

      // 2. Prepare the relational assets for each scene
      const assetsToInsert = scriptData.scenes.map((scene: any) => {
        const sceneAudio = voiceData.audios.find((a: any) => a.scene === scene.scene);
        const sceneImage = imageData.images.find((i: any) => i.scene === scene.scene);
        const sceneCaption = captionData.captions.find((c: any) => c.scene === scene.scene);

        return {
          video_id: videoData.id,
          scene_number: scene.scene,
          script_text: scene.voiceover,
          voice_url: sceneAudio ? sceneAudio.audioUrl : null,
          image_url: sceneImage ? sceneImage.imageUrl : null,
          captions_json: sceneCaption ? sceneCaption.captions : null
        };
      });

      // 3. Bulk insert the assets
      if (assetsToInsert.length > 0) {
        const { error: assetsError } = await supabase
          .from('video_assets')
          .insert(assetsToInsert);

        if (assetsError) {
          throw new Error(`Failed to save video assets: ${assetsError.message}`);
        }
      }
      
      return { success: true, savedVideoId: videoData.id };
    });

    return { 
      success: true, 
      message: "Video generation completed", 
      data: { seriesId: event.data.seriesId } 
    };
  }
);

export const generateFinalVideo = inngest.createFunction(
  { id: "generate-final-video", triggers: [{ event: "video/generate-final" }] },
  async ({ event, step }) => {
    // 1. Mark status as "generating_video"
    await step.run("update-status-to-generating", async () => {
      const supabase = createAdminClient();
      await supabase
        .from('videos')
        .update({ status: 'generating_video' })
        .eq('id', event.data.videoId);
    });

    // 2. Fetch video assets
    const assets = await step.run("fetch-video-assets", async () => {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('video_assets')
        .select('*')
        .eq('video_id', event.data.videoId)
        .order('scene_number', { ascending: true });
        
      if (error) throw new Error("Failed to fetch video assets");
      return data;
    });

    // 3. Process WAN generation
    const processedData = await step.run("process-wan-generation", async () => {
      const supabase = createAdminClient();
      const Replicate = (await import('replicate')).default;
      const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

      const finalScenes = [];
      const FPS = 30;
      let globalStartFrame = 0;

      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        
        let type = 'fallback';
        let wanVideoUrl: string | null = null;

        // Select scenes for WAN (e.g., alternating scenes starting with the first one)
        const shouldUseWan = i % 2 === 0;

        if (shouldUseWan && asset.image_url) {
          try {
            console.log(`Generating WAN video for scene ${asset.scene_number}`);
            
            // Generate video via Replicate using the specified model and options
            const output: any = await replicate.run(
              "wan-video/wan-2.2-i2v-fast",
              {
                input: {
                  image: asset.image_url,
                  prompt: asset.script_text || "Cinematic motion scene",
                  variant: "base",
                  target_resolution: "480"
                }
              }
            );
            
            const videoUrl = Array.isArray(output) ? output[0] : output;
            
            if (typeof videoUrl === 'string') {
              // Upload to Supabase Storage
              const res = await fetch(videoUrl);
              const buffer = await res.arrayBuffer();
              const fileName = `final/${event.data.videoId}/scene-${asset.scene_number}-wan-${Date.now()}.mp4`;
              
              await supabase.storage.from('series_assets').upload(fileName, buffer, { contentType: 'video/mp4' });
              
              const { data: publicUrlData } = supabase.storage.from('series_assets').getPublicUrl(fileName);
              wanVideoUrl = publicUrlData.publicUrl;
              type = 'wan';
              console.log(`WAN video success: ${wanVideoUrl}`);
            }
          } catch (error) {
            console.error(`WAN generation failed for scene ${asset.scene_number}`, error);
            type = 'fallback'; 
          }
        }
        
        // Calculate scene duration. Find audio duration using captions, or fallback to 5s
        let durationInSeconds = 5;
        if (asset.captions_json && Array.isArray(asset.captions_json) && asset.captions_json.length > 0) {
          const sortedCaptions = [...asset.captions_json].sort((a: any, b: any) => a.end - b.end);
          const lastWord = sortedCaptions[sortedCaptions.length - 1];
          // Pad the end of audio slightly
          durationInSeconds = lastWord.end + 1.0; 
        }
        
        const MathCeil = Math.ceil;
        const durationInFrames = MathCeil(durationInSeconds * FPS);

        finalScenes.push({
          scene_id: asset.scene_number,
          startFrame: globalStartFrame,
          durationInFrames,
          type,
          image_url: asset.image_url,
          wan_video_url: wanVideoUrl,
          voiceover_url: asset.voice_url,
          captions: asset.captions_json
        });

        globalStartFrame += durationInFrames;
      }
      
      return { scenes: finalScenes, totalDurationInFrames: globalStartFrame };
    });

    // 4. Trigger Remotion Lambda
    const renderData = await step.run("trigger-remotion-lambda", async () => {
      // Lazy load Lambda Client
      const { renderMediaOnLambda, getRenderProgress } = await import("@remotion/lambda/client");
      
      const region = process.env.REMOTION_AWS_REGION || "us-east-1";
      const functionName = process.env.REMOTION_FUNCTION_NAME || "remotion-render-function";
      const serveUrl = process.env.REMOTION_SERVE_URL;

      if (!serveUrl || !process.env.AWS_ACCESS_KEY_ID) {
         console.warn("AWS / Remotion environment variables are missing. Rendering will fail if not configured.");
      }

      console.log('Initiating Lambda Render...', {
        region, functionName, serveUrl
      });
      
      const { renderId, bucketName } = await renderMediaOnLambda({
        region: region as any,
        functionName,
        serveUrl: serveUrl as string,
        composition: "MainComposition",
        inputProps: processedData,
        codec: "h264",
        imageFormat: "jpeg",
        maxRetries: 1,
        privacy: "public",
      });

      console.log('Lambda Render Started:', renderId);

      // Poll Progress
      let finalUrl: string | null = null;
      // Safety limit of 120 polling iterations (10 minutes max assuming 5s breaks)
      for (let attempt = 0; attempt < 120; attempt++) {
        const progress = await getRenderProgress({ 
          renderId, 
          bucketName, 
          functionName, 
          region: region as any 
        });
        
        if (progress.done && progress.outputFile) {
          finalUrl = progress.outputFile;
          break;
        }
        
        if (progress.fatalErrorEncountered) {
          throw new Error("Remotion Lambda Rendering failed: " + progress.errors[0]?.message);
        }
        
        // Wait 5 seconds before checking again
        await new Promise(r => setTimeout(r, 5000));
      }

      if (!finalUrl) {
         throw new Error("Render timed out waiting for progress");
      }

      return { finalUrl };
    });

    // 5. Mark status as "completed" and save URL
    await step.run("update-status-to-completed", async () => {
      const supabase = createAdminClient();
      await supabase
        .from('videos')
        .update({ 
          status: 'completed',
          // Note: If 'video_url' is the correct column name in your database.
          // Fallback to storing in metadata or elsewhere if the schema is different
          video_url: renderData.finalUrl 
        })
        .eq('id', event.data.videoId);
    });

    // 6. Send email notification via Plunk
    await step.run("send-email-notification", async () => {
      const supabase = createAdminClient();
      
      // Get video details & series details
      const { data: videoData } = await supabase
        .from('videos')
        .select(`
          id, title, status, video_url, series_id,
          video_assets (
            image_url
          )
        `)
        .eq('id', event.data.videoId)
        .single();
        
      if (!videoData) return;
      
      const { data: seriesData } = await supabase
        .from('series')
        .select('user_id')
        .eq('id', videoData.series_id)
        .single();
        
      if (!seriesData?.user_id) return;
      
      // Get user email using Clerk backend SDK
      const { createClerkClient } = await import('@clerk/nextjs/server');
      const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      const user = await clerkClient.users.getUser(seriesData.user_id);
      const email = user.emailAddresses[0]?.emailAddress;
      
      if (!email) return;

      // Extract thumbnail
      const thumbnailInfo = videoData.video_assets?.find((a: any) => a.image_url) || videoData.video_assets?.[0];
      const thumbnailUrl = thumbnailInfo?.image_url || 'https://via.placeholder.com/600x400?text=Video+Thumbnail';
      const videoUrl = videoData.video_url || renderData.finalUrl;
      const downloadUrl = `${videoUrl}?download=true`;
      
      // Need a proper deployment URL for dashboard if possible, otherwise generic
      const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/videos` : 'https://vigen.app/dashboard/videos';

      // HTML template with modern premium styling (dark theme, gradients, clean UI)
      const htmlBody = `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #030712; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); padding: 40px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Your Video is Ready! 🎉</h1>
            <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 16px;">The AI pipeline has successfully rendered your content.</p>
          </div>
          <div style="padding: 32px 24px; text-align: center;">
            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 24px; color: #f9fafb;">
              "${videoData.title || 'Untitled Video'}"
            </h2>
            
            <div style="margin-bottom: 32px; border-radius: 12px; overflow: hidden; border: 1px solid #1f2937; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); background-color: #111827;">
               <img src="${thumbnailUrl}" alt="${videoData.title || 'Video'} Thumbnail" style="width: 100%; max-height: 400px; display: block; object-fit: contain;" />
            </div>
            
            <p style="font-size: 16px; line-height: 1.5; color: #9ca3af; margin-bottom: 32px;">
              Your high-quality video is now ready. You can download it directly or view it in your dashboard gallery.
            </p>

            <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
               <a href="${dashboardUrl}" style="background: linear-gradient(to right, #8b5cf6, #3b82f6); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; flex: 1; min-width: 150px; max-width: 200px; text-align: center; box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.3);">View Gallery</a>
               <a href="${downloadUrl}" style="background-color: #1f2937; color: #f9fafb; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; border: 1px solid #374151; flex: 1; min-width: 150px; max-width: 200px; text-align: center;">Download Video</a>
            </div>
          </div>
          <div style="background-color: #111827; padding: 20px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #1f2937;">
            <p style="margin: 0;">© ${new Date().getFullYear()} ViGen AI. All rights reserved.</p>
          </div>
        </div>
      `;

      if (process.env.PLUNK_API_KEY) {
        try {
          const response = await fetch('https://api.useplunk.com/v1/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.PLUNK_API_KEY}`
            },
            body: JSON.stringify({
              to: email,
              subject: 'Your AI Video is Ready! 🎉',
              body: htmlBody
            })
          });
          
          if (!response.ok) {
             const errorText = await response.text();
             console.error("Plunk email error:", errorText);
             throw new Error(`Failed to send email: ${errorText}`);
          } else {
             console.log(`Successfully sent notification email to ${email}`);
          }
        } catch (e) {
          console.error("Exception sending plunk email:", e);
          // Non-fatal, just log
        }
      } else {
        console.log("No PLUNK_API_KEY provided in env variables. Skipping email notification.");
      }
    });

    return { 
      success: true, 
      message: "Final video generation completed", 
      finalUrl: renderData.finalUrl 
    };
  }
);

