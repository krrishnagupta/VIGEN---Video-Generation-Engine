import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'

export async function PATCH(req: Request, { params }: { params: Promise<{ videoId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId } = await params;
    const body = await req.json();
    const { action, scene_number, prompt, image_base64, series_id } = body;

    const supabase = await createClient();
    let imageBuffer: ArrayBuffer | Buffer;

    if (action === 'generate') {
      if (!prompt) throw new Error("Prompt is required for generation");
      const Replicate = (await import('replicate')).default;
      if (!process.env.REPLICATE_API_TOKEN) throw new Error("REPLICATE_API_TOKEN missing");
      
      const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
      let lastError: any = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const output: any = await replicate.run(
            "bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe",
            {
              input: {
                prompt: prompt,
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
      if (!imageBuffer!) {
        throw new Error(`Failed to generate image after 3 attempts: ${lastError?.message}`);
      }
    } else if (action === 'upload') {
      if (!image_base64) throw new Error("Base64 string required for upload");
      // Strip out data URL prefix if present e.g. data:image/png;base64,
      const base64Data = image_base64.replace(/^data:image\/\w+;base64,/, "");
      imageBuffer = Buffer.from(base64Data, "base64");
    } else {
      throw new Error("Invalid action. Must be 'generate' or 'upload'");
    }

    // Upload to Supabase Storage
    const fileName = `${series_id}/scene-${scene_number}-img-edit-${Date.now()}.png`;
    let uploadSuccess = false;
    let uploadErrorObj: any = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const { error: uploadError } = await supabase.storage
          .from('series_assets')
          .upload(fileName, imageBuffer!, { contentType: 'image/png', upsert: true });
        
        if (uploadError) throw new Error(uploadError.message);
        uploadSuccess = true;
        break;
      } catch (err) {
        uploadErrorObj = err;
        console.error(`Supabase upload attempt ${attempt} failed:`, err);
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }

    if (!uploadSuccess) throw new Error(`Image upload failed after 3 attempts: ${uploadErrorObj?.message}`);
    const { data: publicUrlData } = supabase.storage.from('series_assets').getPublicUrl(fileName);
    const imageUrl = publicUrlData.publicUrl;

    // Update Database
    const { error: dbError } = await supabase
      .from('video_assets')
      .update({ image_url: imageUrl })
      .eq('video_id', videoId)
      .eq('scene_number', scene_number);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, data: { image_url: imageUrl } })
  } catch (error: any) {
    console.error('API Route image PATCH Error:', error)
    return NextResponse.json({ error: 'Failed to update image', details: error.message }, { status: 500 })
  }
}
