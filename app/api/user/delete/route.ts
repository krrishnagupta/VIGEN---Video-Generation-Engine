import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'

export async function DELETE() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // 1. Fetch user's series
    const { data: series } = await supabase.from('series').select('id').eq('user_id', userId);
    const seriesIds = series?.map((s: any) => s.id) || [];

    if (seriesIds.length > 0) {
      // 2. Fetch all videos belonging to those series
      const { data: videos } = await supabase.from('videos').select('id').in('series_id', seriesIds);
      const videoIds = videos?.map((v: any) => v.id) || [];

      if (videoIds.length > 0) {
        // 3. Delete video assets
        await supabase.from('video_assets').delete().in('video_id', videoIds);
        // 4. Delete videos
        await supabase.from('videos').delete().in('id', videoIds);
      }
      
      // 5. Delete series
      await supabase.from('series').delete().in('id', seriesIds);
    }

    // 6. Delete social connections
    await supabase.from('user_social_connections').delete().eq('user_id', userId);

    // 7. Finally, delete user from Clerk 
    const { createClerkClient } = await import('@clerk/nextjs/server');
    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error("CLERK_SECRET_KEY is missing from environment variables.");
    }
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    await clerkClient.users.deleteUser(userId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Account Deletion Error:", error);
    return NextResponse.json(
      { error: "Failed to irreversibly delete account", details: error.message },
      { status: 500 }
    );
  }
}
