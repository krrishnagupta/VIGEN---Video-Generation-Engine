"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CAPTION_STYLES } from "@/lib/constants/caption-styles-data"
import { CaptionPreview } from "@/components/captions"
import { Check } from "lucide-react"

interface CaptionStyleSelectionProps {
  onUpdate: (data: { captionStyleId?: string }) => void
  selectedStyleId: string | null
}

export function CaptionStyleSelection({ 
  onUpdate, 
  selectedStyleId 
}: CaptionStyleSelectionProps) {

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Caption Style</h2>
        <p className="text-zinc-500 mt-2">Choose how your captions will be animated across the generated video.</p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CAPTION_STYLES.map((style) => {
          const isSelected = selectedStyleId === style.id

          return (
            <div 
              key={style.id}
              onClick={() => onUpdate({ captionStyleId: style.id })}
              className={cn(
                "group relative flex flex-col cursor-pointer rounded-2xl transition-all duration-300 overflow-hidden border",
                isSelected 
                  ? "border-purple-600 ring-1 ring-purple-600 shadow-md bg-purple-50/10" 
                  : "border-zinc-200 bg-white hover:border-purple-300 hover:shadow-sm"
              )}
            >
              {/* Preview Window - Dark background for high contrast with bright text */}
              <div className="relative h-32 w-full bg-zinc-900 overflow-hidden flex items-center justify-center p-4">
                {/* Fallback subtle background pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
                
                <CaptionPreview styleId={style.id} text="Unleash your creativity" />

                {/* Selected Indicator inside preview area */}
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-purple-600 text-white p-1 rounded-full shadow-lg border-2 border-zinc-900 animate-in zoom-in duration-200">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="p-4 flex flex-col">
                <h3 className={cn(
                  "font-bold text-base transition-colors",
                  isSelected ? "text-purple-700" : "text-zinc-900"
                )}>
                  {style.name}
                </h3>
                <p className="text-sm text-zinc-500 mt-0.5">
                  {style.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
