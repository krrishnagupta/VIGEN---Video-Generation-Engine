import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SeriesForm, FormData } from '@/components/create-series/series-form'

interface EditSeriesPageProps {
  params: Promise<{ id: string }>
}

export default async function EditSeriesPage({ params }: EditSeriesPageProps) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { id } = await params;
  const supabase = await createClient()

  const { data: series, error } = await supabase
    .from('series')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error || !series) {
    redirect('/dashboard?error=series-not-found');
  }

  // Map database model back to FormData structure
  const initialData: FormData = {
    nicheId: series.niche_id || null,
    language: series.language || "English (United States)",
    voiceId: series.voice_id || null,
    videoStyleId: series.video_style_id || null,
    backgroundMusics: series.background_musics || [],
    captionStyleId: series.caption_style_id || null,
    seriesDetails: {
      seriesName: series.series_name || "",
      videoDuration: series.video_duration || "",
      platforms: series.platforms || [],
      publishTime: series.publish_time || "",
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Edit Series</h1>
        <p className="text-zinc-500 mt-2 font-medium">Update the details and schedule for your existing series.</p>
      </div>
      <SeriesForm initialData={initialData} seriesId={id} />
    </div>
  )
}
