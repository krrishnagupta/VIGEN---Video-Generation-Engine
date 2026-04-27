import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('user_social_connections')
      .select('platform')
      .eq('user_id', userId);

    if (error) {
      if (error.code === '42P01') {
         // table doesn't exist yet => user hasn't run the sql snippet
         return NextResponse.json({ platforms: [] });
      }
      throw new Error(error.message);
    }

    return NextResponse.json({ platforms: data.map(d => d.platform) });
  } catch (error: any) {
    console.error("GET Connections Error:", error);
    return NextResponse.json({ error: "Failed to fetch connections", details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { platform } = await req.json();
    if (!platform) return NextResponse.json({ error: 'Platform required' }, { status: 400 });

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUri = `${appBaseUrl}/api/auth/${platform}/callback`;

    let authUrl = '';

    if (platform === 'youtube') {
      // YouTube / Google OAuth
      // Requires: youtube.upload scope
      if (!process.env.YOUTUBE_CLIENT_ID) {
        return NextResponse.json({ error: 'YouTube OAuth not configured' }, { status: 400 });
      }
      const params = new URLSearchParams({
        client_id: process.env.YOUTUBE_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/youtube.upload',
        access_type: 'offline', // Required to get a refresh token
        prompt: 'consent' // Forces consent screen to ensure refresh token is provided
      });
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      
    } else if (platform === 'instagram') {
      if (!process.env.INSTAGRAM_CLIENT_ID) {
        return NextResponse.json({ error: 'Instagram OAuth not configured' }, { status: 400 });
      }
      const params = new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'instagram_basic,instagram_content_publish' // Update scopes based on Meta app config
      });
      authUrl = `https://api.instagram.com/oauth/authorize?${params.toString()}`;
      
    } else if (platform === 'tiktok') {
      if (!process.env.TIKTOK_CLIENT_KEY) {
        return NextResponse.json({ error: 'TikTok OAuth not configured' }, { status: 400 });
      }
      const params = new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'video.upload', // Standard TikTok upload scope
        state: 'tiktok_auth'
      });
      authUrl = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
    } else {
      return NextResponse.json({ error: 'Invalid platform selected' }, { status: 400 });
    }

    // Return the generated authorization URL to the frontend
    return NextResponse.json({ success: true, url: authUrl });
  } catch (error: any) {
    console.error("POST Connection Error:", error);
    return NextResponse.json({ error: "Failed to connect platform", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { platform } = await req.json();
    if (!platform) return NextResponse.json({ error: 'Platform required' }, { status: 400 });

    const supabase = createAdminClient();
    
    const { error } = await supabase
      .from('user_social_connections')
      .delete()
      .eq('user_id', userId)
      .eq('platform', platform);

    if (error) throw error;

    return NextResponse.json({ success: true, platform });
  } catch (error: any) {
    console.error("DELETE Connection Error:", error);
    return NextResponse.json({ error: "Failed to disconnect platform", details: error.message }, { status: 500 });
  }
}
