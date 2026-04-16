"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Video, Calendar, Eye, Download, PlayCircle, Loader2 } from "lucide-react";

interface VideoAsset {
  image_url: string | null;
}

interface VideoData {
  id: string;
  series_id: string;
  title: string;
  status: string;
  created_at: string;
  video_assets: VideoAsset[];
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.data);
      } else {
        setError(data.error || 'Failed to fetch videos');
      }
    } catch (err) {
      setError('Error connecting to the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();

    // Setup polling to refresh videos periodically if there are any generating videos
    const interval = setInterval(() => {
       setVideos(prev => {
          const hasGenerating = prev.some(v => v.status === 'generating');
          if (hasGenerating) fetchVideos();
          return prev;
       });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-purple-600">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="font-medium text-sm text-zinc-600">Loading videos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Your Videos</h1>
        <p className="text-zinc-500 mt-1 font-medium">Manage and view all your requested and generated video assets.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      {videos.length === 0 && !error ? (
        <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden py-24 px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 flex items-center justify-center mx-auto mb-4">
            <Video className="h-6 w-6 text-zinc-300" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900">No videos generated yet</h3>
          <p className="text-zinc-500 max-w-sm mx-auto mt-2">
            Go to your Series tab and trigger a video generation to see it appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {videos.map((video) => {
             const isGenerating = video.status === 'generating';
             const thumbnail = video.video_assets && video.video_assets.length > 0 
                               ? video.video_assets[0].image_url 
                               : null;

             return (
              <div 
                key={video.id} 
                className="group flex flex-col bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow relative"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-[9/16] w-full bg-zinc-100 overflow-hidden flex items-center justify-center">
                  {isGenerating ? (
                    <div className="absolute inset-0 bg-zinc-900/5 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-pulse">
                       <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-3" />
                       <span className="text-sm font-semibold text-zinc-700 bg-white/80 px-3 py-1 rounded-full border border-zinc-200 shadow-sm">Generating Pipeline...</span>
                    </div>
                  ) : thumbnail ? (
                    <img 
                      src={thumbnail} 
                      alt={video.title || 'Video Thumbnail'} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-zinc-400">
                      <Video className="h-8 w-8 mb-2 opacity-50" />
                      <span className="text-xs font-medium">No Thumbnail</span>
                    </div>
                  )}

                  {!isGenerating && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/50">
                        <PlayCircle className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  )}

                  {/* Status Pill */}
                  <div className="absolute top-3 right-3 z-20">
                     <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                       isGenerating 
                         ? 'bg-purple-100 text-purple-700 border-purple-200'
                         : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                     }`}>
                        {video.status}
                     </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-[15px] leading-tight text-zinc-900 line-clamp-2 max-h-11">
                    {video.title || "Untitled Generation"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{format(new Date(video.created_at), 'MMM d, yyyy h:mm a')}</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <button 
                       disabled={isGenerating}
                       className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-zinc-900 text-white font-medium text-xs hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <button 
                       disabled={isGenerating}
                       className="p-2 h-9 w-9 flex items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
             );
          })}
        </div>
      )}
    </div>
  );
}
