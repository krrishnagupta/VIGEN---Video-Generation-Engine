"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { VIDEO_STYLES } from "@/lib/constants/video-style-data"
import { Check } from "lucide-react"

interface VideoStyleSelectionProps {
  onUpdate: (data: { videoStyleId?: string }) => void
  selectedStyleId: string | null
}

export function VideoStyleSelection({ 
  onUpdate, 
  selectedStyleId 
}: VideoStyleSelectionProps) {

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Video Style</h2>
        <p className="text-zinc-500 mt-2">Choose the aesthetic style for your series. This style will dictate the look of your generated videos.</p>
      </div>

      {/* Horizontal Scroll List */}
      <div className="relative">
        {/* Subtle fade edges for the scroll container if desired, but native scroll is usually fine */}
        <div className="flex overflow-x-auto gap-4 pb-6 pt-2 px-2 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {VIDEO_STYLES.map((style) => {
            const isSelected = selectedStyleId === style.id

            return (
              <div 
                key={style.id}
                onClick={() => onUpdate({ videoStyleId: style.id })}
                className={cn(
                  "group relative flex-none w-[200px] sm:w-[240px] cursor-pointer rounded-2xl transition-all duration-300 snap-center",
                  isSelected 
                    ? "ring-2 ring-purple-600 ring-offset-4 ring-offset-white scale-[1.02]" 
                    : "hover:scale-[1.02]"
                )}
              >
                {/* 9:16 Aspect Ratio Container */}
                <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={style.image} 
                    alt={style.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
                    <h3 className="text-white font-bold text-lg drop-shadow-md">
                      {style.name}
                    </h3>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-purple-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white animate-in zoom-in duration-200">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </div>
                  )}
                  
                  {/* Unselected Hover State */}
                  {!isSelected && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Instruction text */}
        <div className="text-center mt-2">
           <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase">Swipe to see more styles</p>
        </div>
      </div>
      
      {/* Global CSS for hiding scrollbar added inline for portability, 
          though usually better in globals.css. */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  )
}
