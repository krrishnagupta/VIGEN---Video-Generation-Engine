import { NextResponse, NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  try {
    const { userId } = await auth();
    // In OAuth, we need to ensure the user is still authenticated (Clerk session cookie required)
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    const { provider } = await params;
    
    // Parse redirect URL parameters
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    // Where do we redirect to after?
    const redirectSettingsUrl = new URL('/dashboard/settings', req.url);

    if (errorParam) {
      console.error(`OAuth Error from ${provider}:`, errorParam);
      redirectSettingsUrl.searchParams.set('error', 'auth_denied');
      return NextResponse.redirect(redirectSettingsUrl);
    }

    if (!code) {
      redirectSettingsUrl.searchParams.set('error', 'no_code');
      return NextResponse.redirect(redirectSettingsUrl);
    }

    // Prepare credentials based on provider
    let accessToken = '';
    let refreshToken = '';
    let accountName = `${provider} Account`;

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUri = `${appBaseUrl}/api/auth/${provider}/callback`;

    if (provider === 'youtube') {
      // Exchange code for Google/YouTube tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.YOUTUBE_CLIENT_ID!,
          client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        console.error("Google Token Exchange Failed", tokenData);
        throw new Error("Failed to exchange Google code");
      }

      accessToken = tokenData.access_token;
      refreshToken = tokenData.refresh_token || ''; // Google sometimes only returns refresh token on first auth prompt
      
    } else if (provider === 'instagram') {
      // Logic for Instagram token exchange
      // https://api.instagram.com/oauth/access_token
      const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.INSTAGRAM_CLIENT_ID!,
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) throw new Error("Failed to exchange Instagram code");
      accessToken = tokenData.access_token;
      // Note: Meta has Short-Lived and Long-Lived tokens. You might need logic to exchange for Long-Lived.
      
    } else if (provider === 'tiktok') {
      // Logic for TikTok token exchange
      const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_key: process.env.TIKTOK_CLIENT_KEY!,
          client_secret: process.env.TIKTOK_CLIENT_SECRET!,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) throw new Error("Failed to exchange TikTok code");
      accessToken = tokenData.access_token;
      refreshToken = tokenData.refresh_token || '';
      
    } else {
      throw new Error("Unsupported provider");
    }

    // Save tokens securely in Supabase utilizing Admin Client
    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from('user_social_connections')
      .upsert({
        user_id: userId,
        platform: provider,
        account_name: accountName,
        access_token: accessToken,
        refresh_token: refreshToken
      }, { onConflict: 'user_id, platform' });

    if (dbError) throw dbError;

    // Successfully connected!
    redirectSettingsUrl.searchParams.set('connected', provider);
    return NextResponse.redirect(redirectSettingsUrl);

  } catch (error: any) {
    console.error(`OAuth Callback Error for:`, error);
    const redirectSettingsUrl = new URL('/dashboard/settings', req.url);
    redirectSettingsUrl.searchParams.set('error', 'server_error');
    return NextResponse.redirect(redirectSettingsUrl);
  }
}
