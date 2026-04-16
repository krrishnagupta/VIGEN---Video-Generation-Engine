import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { inngest } from '@/lib/inngest/client';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const supabase = createAdminClient();
    
    // Insert a placeholder video record to display loading state
    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .insert({
        series_id: id,
        title: 'Generating Video...',
        status: 'generating'
      })
      .select()
      .single();

    if (videoError || !videoData) {
      throw new Error(`Failed to create video placeholder: ${videoError?.message}`);
    }

    await inngest.send({
      name: 'video/generate',
      data: {
        seriesId: id,
        userId: userId,
        videoId: videoData.id
      }
    });

    return NextResponse.json({ success: true, message: 'Video generation triggered', videoId: videoData.id });
  } catch (error: any) {
    console.error('Trigger Generation API Error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger video generation', details: error.message },
      { status: 500 }
    );
  }
}
