import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'
import { VOICES } from '@/lib/constants/language-voice-data';

export async function PATCH(req: Request, { params }: { params: Promise<{ videoId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId } = await params;
    const body = await req.json();
    const { scene_number, script_text, series_id } = body;

    const supabase = await createClient();

    // 1. Fetch series data to know the voice configuration
    const { data: seriesData, error: seriesError } = await supabase
      .from('series')
      .select('*')
      .eq('id', series_id)
      .single();

    if (seriesError || !seriesData) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    // 2. Generate Voice
    const selectedVoice = VOICES.find(v => v.id === seriesData.voice_id);
    if (!selectedVoice) throw new Error("Voice configuration not found");

    let audioBuffer: ArrayBuffer;
    if (selectedVoice.provider === 'deepgram') {
      if (!process.env.DEEPGRAM_API_KEY) throw new Error("DEEPGRAM_API_KEY missing");
      let deepgramModel = 'aura-asteria-en';
      const name = selectedVoice.modelName.toLowerCase();
      if (name === 'arcas') deepgramModel = 'aura-arcas-en';
      else if (selectedVoice.gender === 'male') deepgramModel = 'aura-orion-en';

      const response = await fetch(`https://api.deepgram.com/v1/speak?model=${deepgramModel}`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: script_text })
      });
      if (!response.ok) throw new Error(`Deepgram API error: ${await response.text()}`);
      audioBuffer = await response.arrayBuffer();
    } else {
      if (!process.env.FONADALAB_API_KEY) throw new Error("FONADALAB_API_KEY missing");
      const langMap: Record<string, string> = {
        'hi-IN': 'Hindi', 'ta-IN': 'Tamil', 'te-IN': 'Telugu',
        'en-US': 'English', 'mr-IN': 'Marathi', 'kn-IN': 'Kannada',
        'bn-IN': 'Bengali', 'ml-IN': 'Malayalam', 'gu-IN': 'Gujarati', 'pa-IN': 'Punjabi'
      };
      const response = await fetch('https://api.fonada.ai/tts/generate-audio-large', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.FONADALAB_API_KEY}`
        },
        body: JSON.stringify({
          input: script_text,
          voice: selectedVoice.modelName,
          language: langMap[selectedVoice.lang] || 'English'
        })
      });
      if (!response.ok) throw new Error(`Fonadalabs API error: ${await response.text()}`);
      audioBuffer = await response.arrayBuffer();
    }

    // Upload Audio
    const fileName = `${series_id}/scene-${scene_number}-edit-${Date.now()}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from('series_assets')
      .upload(fileName, audioBuffer, { contentType: 'audio/mpeg', upsert: true });

    if (uploadError) throw new Error(`Upload error: ${uploadError.message}`);
    const { data: publicUrlData } = supabase.storage.from('series_assets').getPublicUrl(fileName);
    const audioUrl = publicUrlData.publicUrl;

    // 3. Generate Captions
    const capResponse = await fetch('https://api.deepgram.com/v1/listen?smart_format=true&model=nova-3', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: audioUrl })
    });
    if (!capResponse.ok) throw new Error(`Deepgram caption error: ${await capResponse.text()}`);
    const capData = await capResponse.json();
    const words = capData.results?.channels?.[0]?.alternatives?.[0]?.words || [];
    const captions_json = words.map((w: any) => ({
      text: w.punctuated_word || w.word,
      start: w.start,
      end: w.end
    }));

    // 4. Save to DB
    const { error: dbError } = await supabase
      .from('video_assets')
      .update({ script_text, voice_url: audioUrl, captions_json })
      .eq('video_id', videoId)
      .eq('scene_number', scene_number);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, data: { script_text, voice_url: audioUrl, captions_json } })
  } catch (error: any) {
    console.error('API Route script PATCH Error:', error)
    return NextResponse.json({ error: 'Failed to update script', details: error.message }, { status: 500 })
  }
}
