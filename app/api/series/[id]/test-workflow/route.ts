import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'
import { inngest } from '@/lib/inngest/client'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params;

    const supabase = await createClient()

    // Verify series belongs to user
    const { data: series, error: seriesError } = await supabase
      .from('series')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (seriesError || !series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    // Insert a new video record
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .insert([{
        series_id: id,
        status: 'generating'
      }])
      .select()
      .single()

    if (videoError) {
      throw new Error(`Failed to create video record: ${videoError.message}`)
    }

    // Trigger Inngest pipeline with test flag
    await inngest.send({
      name: "video/generate",
      data: {
        seriesId: id,
        videoId: video.id,
        isTest: true
      }
    });

    return NextResponse.json({ success: true, videoId: video.id })
  } catch (error: any) {
    console.error('API Route POST Error:', error)
    return NextResponse.json(
      { error: 'Failed to trigger test generation', details: error.message },
      { status: 500 }
    )
  }
}
