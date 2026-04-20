import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'
import { inngest } from "@/lib/inngest/client";

export async function POST(req: Request, { params }: { params: Promise<{ videoId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId } = await params;
    const supabase = await createClient();

    // 1. Fetch video to make sure it belongs to a series we own, and get series_id
    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .select('series_id')
      .eq('id', videoId)
      .single();

    if (videoError || !videoData) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // 2. Delete existing video assets
    const { error: deleteError } = await supabase
      .from('video_assets')
      .delete()
      .eq('video_id', videoId);

    if (deleteError) {
      throw new Error(`Failed to delete old assets: ${deleteError.message}`);
    }

    // 3. Update status back to generating
    const { error: updateError } = await supabase
      .from('videos')
      .update({ status: 'generating' })
      .eq('id', videoId);

    if (updateError) {
      throw new Error(`Failed to update video status: ${updateError.message}`);
    }

    // 4. Trigger the Inngest pipeline again
    await inngest.send({
      name: "video/generate",
      data: { 
        seriesId: videoData.series_id,
        videoId: videoId
      }
    });

    return NextResponse.json({ success: true, message: 'Series regeneration started' })
  } catch (error: any) {
    console.error('API Route regenerate POST Error:', error)
    return NextResponse.json(
      { error: 'Failed to start regeneration', details: error.message },
      { status: 500 }
    )
  }
}
