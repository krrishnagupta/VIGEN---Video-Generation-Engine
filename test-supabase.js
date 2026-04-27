import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://szzlelagqoklsnwjsqyo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6emxlbGFncW9rbHNud2pzcXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzE5MzgsImV4cCI6MjA4ODQ0NzkzOH0.7gGD4NxX1zBhfJ7Wh5BG8D3zvg-gAb7CfUXqmyZa5PM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
    .from('user_social_connections')
    .upsert({
      user_id: 'test_user',
      platform: 'youtube',
      account_name: 'test Account',
      access_token: 'test_access',
      refresh_token: 'test_refresh'
    }, { onConflict: 'user_id, platform' });

  if (error) {
    console.error("UPSERT ERROR:", error)
  } else {
    console.log("UPSERT SUCCESS:", data)
  }
}

test()
