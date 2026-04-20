import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'
import { inngest } from "@/lib/inngest/client";

export async function GET(req: Request, { params }: { params: Promise<{ videoId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId } = await params;
    const supabase = await createClient()

    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .select(`
        *,
        series (*),
        video_assets (*)
      `)
      .eq('id', videoId)
      .single()

    if (videoError || !videoData) {
      return NextResponse.json({ error: videoError?.message || 'Video not found' }, { status: 404 })
    }

    // Sort assets by scene number
    videoData.video_assets.sort((a: any, b: any) => a.scene_number - b.scene_number);

    return NextResponse.json({ success: true, data: videoData })
  } catch (error: any) {
    console.error('API Route GET Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video review data', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ videoId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId } = await params;
    const body = await req.json();
    const { action } = body;

    const supabase = await createClient();

    if (action === 'approve') {
      const { error: updateError } = await supabase
        .from('videos')
        .update({ status: 'approved' })
        .eq('id', videoId);

      if (updateError) throw updateError;

      // Trigger final generation
      await inngest.send({
        name: "video/generate-final",
        data: { videoId }
      });

      return NextResponse.json({ success: true, message: 'Video approved and pipeline triggered' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('API Route POST Error:', error)
    return NextResponse.json(
      { error: 'Failed to process review action', details: error.message },
      { status: 500 }
    )
  }
}
