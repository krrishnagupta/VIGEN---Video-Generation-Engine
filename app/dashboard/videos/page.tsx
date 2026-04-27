"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Video, Calendar, Eye, Download, PlayCircle, Loader2, FileEdit, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface VideoAsset {
  image_url: string | null;
}

interface VideoData {
  id: string;
  series_id: string;
  title: string;
  status: string;
  created_at: string;
  video_url?: string | null;
  video_assets: VideoAsset[];
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`/api/videos?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
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

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(videoId);
    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setVideos(videos.filter(v => v.id !== videoId));
        toast.success("Video deleted successfully");
      } else {
        toast.error(data.error || 'Failed to delete video');
      }
    } catch (err) {
      toast.error('Error connecting to the server while deleting');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDownload = async (videoUrl: string, title: string) => {
    try {
      const toastId = toast.loading('Starting download...');
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${title ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'video'}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download complete', { id: toastId });
    } catch (error) {
      console.error("Download failed", error);
      toast.error('Direct download failed, opening in new tab instead...');
      window.open(videoUrl, '_blank');
    }
  };

  useEffect(() => {
    fetchVideos();

    // Setup polling to refresh videos periodically if there are any generating videos
    const interval = setInterval(() => {
      setVideos(prev => {
        const hasGenerating = prev.some(v => v.status === 'generating' || v.status === 'generating_video');
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
      {playingVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setPlayingVideoUrl(null)}>
          <button className="absolute top-6 right-6 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-full px-4 py-2 font-medium transition-colors" onClick={() => setPlayingVideoUrl(null)}>
            Close
          </button>
          <video
            src={playingVideoUrl}
            controls
            autoPlay
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl bg-black border border-white/10"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

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
            const isGenerating = video.status === 'generating' || video.status === 'generating_video';
            const thumbnail = video.video_assets && video.video_assets.length > 0
              ? video.video_assets[0].image_url
              : null;

            return (
              <div
                key={video.id}
                className="group flex flex-col bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow relative"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-[4/5] w-full bg-zinc-100 overflow-hidden flex items-center justify-center">
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

                  {!isGenerating && video.video_url && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => setPlayingVideoUrl(video.video_url!)}
                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/50"
                      >
                        <PlayCircle className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  )}

                  {/* Status Pill */}
                  <div className="absolute top-3 right-3 z-20">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${isGenerating
                        ? 'bg-purple-100 text-purple-700 border-purple-200'
                        : video.status === 'failed'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : video.status === 'pending_review'
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}>
                      {video.status.replace('_', ' ')}
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
                    {video.status === 'failed' ? (
                       <button
                         disabled
                         className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-red-50 text-red-700 font-medium text-xs border border-red-200 opacity-80 cursor-not-allowed"
                       >
                         Generation Failed
                       </button>
                    ) : video.status === 'pending_review' ? (
                      <Link href={`/dashboard/videos/${video.id}/review`} className="flex-1">
                        <button className="w-full flex items-center justify-center gap-2 h-9 rounded-lg bg-orange-50 text-orange-700 font-medium text-xs hover:bg-orange-100 transition-colors border border-orange-200">
                          <FileEdit className="w-3.5 h-3.5" /> Review
                        </button>
                      </Link>
                    ) : (
                      <button
                        disabled={isGenerating}
                        onClick={() => video.video_url && setPlayingVideoUrl(video.video_url)}
                        className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-zinc-900 text-white font-medium text-xs hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    )}
                    <button
                      disabled={isGenerating || video.status === 'pending_review' || !video.video_url}
                      onClick={() => {
                        if (!video.video_url) return;
                        handleDownload(video.video_url, video.title);
                      }}
                      title="Download"
                      className="p-2 h-9 w-9 flex items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={isGenerating || isDeleting === video.id}
                      onClick={() => handleDelete(video.id)}
                      title="Delete Video"
                      className="p-2 h-9 w-9 flex items-center justify-center rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting === video.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
