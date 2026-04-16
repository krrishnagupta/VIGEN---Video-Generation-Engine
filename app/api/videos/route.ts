import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // 1. Fetch user's series
    const { data: userSeries, error: seriesError } = await supabase
      .from('series')
      .select('id')
      .eq('user_id', userId);

    if (seriesError) {
       throw new Error(`Failed to fetch series: ${seriesError.message}`);
    }

    const seriesIds = userSeries?.map(s => s.id) || [];

    if (seriesIds.length === 0) {
       return NextResponse.json({ success: true, data: [] });
    }

    // 2. Fetch all videos matching those series IDs
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select(`
        *,
        video_assets (
           image_url
        )
      `)
      .in('series_id', seriesIds)
      .order('created_at', { ascending: false });

    if (videosError) {
      console.error('Supabase error fetching videos:', videosError)
      return NextResponse.json({ error: videosError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: videos || [] })
  } catch (error: any) {
    console.error('API Route GET Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos', details: error.message },
      { status: 500 }
    )
  }
}
