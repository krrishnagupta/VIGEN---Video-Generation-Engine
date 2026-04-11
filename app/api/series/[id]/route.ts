import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(
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

    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Supabase error fetching single series:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('API Route GET Single Series Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch series', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params;
    const body = await req.json()
    console.log("PUT BODY:", body)

    const supabase = await createClient()

    const payload = {
      niche_id: body.nicheId,
      language: body.language,
      voice_id: body.voiceId,
      video_style_id: body.videoStyleId,
      background_musics: body.backgroundMusics || [],
      caption_style_id: body.captionStyleId,
      series_name: body.seriesDetails?.seriesName,
      video_duration: body.seriesDetails?.videoDuration,
      platforms: body.seriesDetails?.platforms || [],
      publish_time: body.seriesDetails?.publishTime || null,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('series')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()

    if (error) {
      console.error('Supabase error updating series:', error.message, error.details, error.hint)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('API Route PUT Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    )
  }
}
