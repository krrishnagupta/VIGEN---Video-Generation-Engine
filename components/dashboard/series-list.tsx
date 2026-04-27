"use client";

import { useEffect, useState, useRef } from "react";
import { VIDEO_STYLES } from "@/lib/constants/video-style-data";
import { MoreVertical, Edit2, Play, Calendar, PlayCircle, Eye, Pause, Trash2, Loader2, Youtube, Instagram } from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Series {
  id: string;
  series_name: string;
  video_style_id: string;
  status: string;
  created_at: string;
  platforms?: string[];
}

export function SeriesList() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const router = useRouter();

  // Popover state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch('/api/series');
        const data = await response.json();

        if (data.success) {
          setSeriesList(data.data);
        } else {
          setError(data.error || 'Failed to fetch series');
        }
      } catch (err) {
        setError('Error connecting to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'paused' ? 'active' : 'paused';
      const response = await fetch('/api/series', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await response.json();

      if (data.success) {
        setSeriesList(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
    } finally {
      setActiveMenuId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
        {error}
      </div>
    );
  }

  if (seriesList.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
        <div className="p-8 text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 flex items-center justify-center mx-auto mb-4">
            <Play className="h-6 w-6 text-zinc-300" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900">Start your first video series</h3>
          <p className="text-zinc-500 max-w-xs mx-auto mt-2">
            Generate AI-powered short videos and schedule them across your channels automatically.
          </p>
          <a href="/dashboard/create" className="mt-8 inline-flex h-10 px-6 items-center justify-center rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors">
            Create Series
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {seriesList.map((series) => {
        const styleData = VIDEO_STYLES.find(s => s.id === series.video_style_id);
        const imageUrl = styleData ? styleData.image : "/video-style/video-style/realistic.png";

        return (
          <div key={series.id} className="group flex flex-col bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow relative">

            {/* Thumbnail Header */}
            <div className="relative aspect-video w-full bg-zinc-100 overflow-hidden">
              <img
                src={imageUrl}
                alt={series.series_name || 'Series Thumbnail'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Top Right Edit Button */}
              <Link
                href={`/dashboard/series/${series.id}/edit`}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors border border-white/10"
                title="Edit Series"
              >
                <Edit2 className="w-4 h-4" />
              </Link>

              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md text-white text-xs font-medium border border-white/10 capitalize">
                  {series.status || 'Active'}
                </span>
                
                {series.platforms && series.platforms.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {series.platforms.map(p => {
                      if (p === 'youtube') return <div key={p} className="w-6 h-6 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10"><Youtube className="w-3 h-3" /></div>;
                      if (p === 'instagram') return <div key={p} className="w-6 h-6 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10"><Instagram className="w-3 h-3" /></div>;
                      if (p === 'tiktok') return <div key={p} className="w-6 h-6 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10"><TikTokIcon className="w-3 h-3" /></div>;
                      return null;
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2 relative">
                <div>
                  <h3 className="font-semibold text-lg text-zinc-900 line-clamp-1">
                    {series.series_name || "Untitled Series"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(series.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>

                {/* Popover Menu Trigger */}
                <div className="relative" ref={activeMenuId === series.id ? menuRef : null}>
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === series.id ? null : series.id)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-md hover:bg-zinc-100 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {/* Popover Menu */}
                  {activeMenuId === series.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-zinc-200 py-1.5 z-10 animate-in fade-in slide-in-from-top-2">
                      <Link href={`/dashboard/series/${series.id}/edit`} className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2">
                        <Edit2 className="w-4 h-4" /> Edit Series
                      </Link>
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                        onClick={() => handleToggleStatus(series.id, series.status)}
                      >
                        {series.status === 'paused' ? <PlayCircle className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        {series.status === 'paused' ? 'Resume' : 'Pause'}
                      </button>
                      <div className="h-px bg-zinc-100 my-1.5"></div>
                      <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-6 space-y-3">
                <button
                  disabled={generatingId === series.id}
                  onClick={async () => {
                    try {
                      setGeneratingId(series.id);
                      const res = await fetch(`/api/series/${series.id}/generate`, { method: 'POST' });
                      const data = await res.json();
                      if (data.success) {
                        router.refresh();
                        router.push(`/dashboard/videos/${data.videoId}/review`);
                      } else {
                        alert('Failed to trigger generation');
                      }
                    } catch (err) {
                      console.error('Error triggering generation', err);
                      alert('Error triggering generation');
                    } finally {
                      setGeneratingId(null);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-purple-50 text-purple-700 font-medium text-sm hover:bg-purple-100 transition-colors border border-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingId === series.id ? (
                    <Loader2 className="w-4 h-4 text-purple-700 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 fill-purple-700" />
                  )}
                  {generatingId === series.id ? "Triggering..." : "Trigger Generation"}
                </button>
                <Link href="/dashboard/videos" className="w-full">
                  <button className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-white text-zinc-600 font-medium text-sm hover:bg-zinc-50 transition-colors border border-zinc-200">
                    <Eye className="w-4 h-4" /> View Generated Videos
                  </button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
