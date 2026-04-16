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

        let imageBuffer: ArrayBuffer;
        if (typeof output[0].arrayBuffer === 'function') {
          imageBuffer = await output[0].arrayBuffer();
        } else {
          // Fallback if returned value is just a URL string
          const res = await fetch(typeof output[0] === 'string' ? output[0] : output[0].url());
          imageBuffer = await res.arrayBuffer();
        }

        const fileName = `${event.data.seriesId}/scene-${sceneInfo.scene}-img-${Date.now()}.png`;
        const { error: uploadError } = await supabase
          .storage
          .from('series_assets')
          .upload(fileName, imageBuffer, {
            contentType: 'image/png',
            upsert: true
          });

        if (uploadError) {
          throw new Error(`Failed to upload image to Supabase Storage: ${uploadError.message}`);
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
          status: 'completed'
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
