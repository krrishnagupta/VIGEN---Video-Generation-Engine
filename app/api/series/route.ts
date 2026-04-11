import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) { 
  try { 
    const { userId } = await auth(); 
     
    if (!userId) { 
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) 
    } 

    // ✅ 1. After parsing request body
    const body = await req.json() 
    console.log("BODY:", body)   // 👈 HERE

    const supabase = await createClient()

    const payload = {
      user_id: userId,
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
      status: 'active'
    }

    const { data, error } = await supabase
      .from('series')
      .insert([payload])
      .select()

    if (error) {
      console.error('Supabase error inserting series:', error.message, error.details, error.hint)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('API Route POST Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error fetching series:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (error: any) {
    console.error('API Route GET Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch series', details: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('series')
      .update({ status })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error updating series:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('API Route PATCH Error:', error)
    return NextResponse.json(
      { error: 'Failed to update series', details: error.message },
      { status: 500 }
    )
  }
}
