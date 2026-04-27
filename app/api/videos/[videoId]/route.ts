import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient as createClient } from '@/utils/supabase/admin';

export async function DELETE(
  req: Request,
  context: { params: Promise<{ videoId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { videoId } = await context.params;
    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const supabase = createClient();

    // Verify ownership
    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .select('series_id, series(user_id)')
      .eq('id', videoId)
      .single();

    if (videoError || !videoData) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // @ts-ignore
    if (videoData.series?.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized to delete this video' }, { status: 403 });
    }

    // Delete the video
    const { error: deleteError } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (deleteError) {
      throw new Error(`Failed to delete video: ${deleteError.message}`);
    }

    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error: any) {
    console.error('API Route DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete video', details: error.message },
      { status: 500 }
    );
  }
}
