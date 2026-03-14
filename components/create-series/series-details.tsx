"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface SeriesDetailsData {
  seriesName: string
  videoDuration: string
  platforms: string[]
  publishTime: string
}

interface SeriesDetailsProps {
  onUpdate: (data: Partial<SeriesDetailsData>) => void
  data: SeriesDetailsData
}

const PLATFORMS = [
  {
    id: "tiktok",
    name: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-black">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.36 6.34 6.34 0 0 0 6.25-6.36V7.94a8.32 8.32 0 0 0 3.16.63V5.13a4.7 4.7 0 0 1-1.09.13V6.69z" />
      </svg>
    ),
    color: "group-hover:ring-black",
    bg: "bg-white border-black/10"
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-[#FF0000]">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    color: "group-hover:ring-[#FF0000]",
    bg: "bg-white border-[#FF0000]/20"
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-[#E1306C]">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    color: "group-hover:ring-[#E1306C]",
    bg: "bg-white border-[#E1306C]/20"
  },
  {
    id: "email",
    name: "Email",
    icon: <Mail className="h-6 w-6 text-blue-500" />,
    color: "group-hover:ring-blue-500",
    bg: "bg-white border-blue-500/20"
  }
]

export function SeriesDetails({ 
  onUpdate, 
  data 
}: SeriesDetailsProps) {

  const togglePlatform = (platformId: string) => {
    onUpdate({
      platforms: data.platforms.includes(platformId)
        ? data.platforms.filter(id => id !== platformId)
        : [...data.platforms, platformId]
    })
  }

  // Set default publish time to +4 hours if empty to give user a good starting point
  React.useEffect(() => {
    if (!data.publishTime) {
      const date = new Date()
      date.setHours(date.getHours() + 4)
      // Format as YYYY-MM-DDThh:mm required by datetime-local input
      const formatted = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      onUpdate({ publishTime: formatted })
    }
  }, [data.publishTime, onUpdate])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Series Details</h2>
        <p className="text-zinc-500 mt-2">Finalize your series name and set up your publishing schedule across platforms.</p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Series Name */}
        <div className="space-y-2">
          <label htmlFor="seriesName" className="text-sm font-semibold text-zinc-700 ml-1">Series Name</label>
          <Input 
            id="seriesName"
            type="text"
            placeholder="e.g. Daily Tech News, Motivational Mornings"
            className="h-12 bg-zinc-50 border-zinc-200 focus:bg-white focus:ring-purple-600/20 rounded-xl"
            value={data.seriesName}
            onChange={(e) => onUpdate({ seriesName: e.target.value })}
          />
        </div>

        {/* Video Duration */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 ml-1">Video Duration</label>
          <Select 
            value={data.videoDuration} 
            onValueChange={(val) => onUpdate({ videoDuration: val })}
          >
            <SelectTrigger className="w-full h-12 rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-purple-600/20 transition-all font-medium">
              <SelectValue placeholder="Select video length" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
              <SelectItem value="30-50">30 - 50 sec</SelectItem>
              <SelectItem value="60-90">1 - 1.5 min</SelectItem>
              <SelectItem value="120-180">2 - 3 min</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Platforms */}
        <div className="space-y-3 pt-2">
          <label className="text-sm font-semibold text-zinc-700 ml-1">Publish to Platforms</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLATFORMS.map((platform) => {
              const isSelected = data.platforms.includes(platform.id)
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={cn(
                    "group relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer h-24",
                    isSelected 
                      ? "border-purple-600 bg-purple-50/50 scale-[1.02] shadow-sm" 
                      : cn("border-transparent hover:scale-105", platform.bg)
                  )}
                >
                  <div className={cn(
                    "transition-transform duration-300", 
                    isSelected ? "scale-110" : ""
                  )}>
                    {platform.icon}
                  </div>
                  <span className={cn(
                    "mt-2 text-xs font-bold transition-colors",
                    isSelected ? "text-purple-700" : "text-zinc-600"
                  )}>
                    {platform.name}
                  </span>
                  
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 bg-purple-600 text-white rounded-full p-0.5">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Time to publish */}
        <div className="space-y-2 pt-2">
          <label htmlFor="publishTime" className="text-sm font-semibold text-zinc-700 ml-1">Time to Publish</label>
          <div className="relative">
            <Input 
              id="publishTime"
              type="datetime-local"
              className="h-12 bg-zinc-50 border-zinc-200 focus:bg-white focus:ring-purple-600/20 rounded-xl px-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
              value={data.publishTime}
              onChange={(e) => onUpdate({ publishTime: e.target.value })}
            />
          </div>
          <div className="flex items-start gap-2 mt-2 ml-1 p-2.5 bg-blue-50/50 rounded-lg text-xs leading-relaxed text-blue-800">
             <div className="h-4 w-1.5 bg-blue-500 rounded-full mt-0.5 shrink-0" />
             <p className="font-medium">
               Video will generate <strong className="font-bold text-blue-900">3-6 hours</strong> before video publish. Please schedule it at least that far in advance.
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
