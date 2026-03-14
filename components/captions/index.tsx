"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CaptionPreviewProps {
  styleId: string
  text?: string
  className?: string
}

// Custom hook to handle continuous looping of logic for the previews
function useLoopingAnimation(durationMs: number = 3000) {
  const [tick, setTick] = React.useState(0)
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, durationMs)
    return () => clearInterval(interval)
  }, [durationMs])
  
  return tick
}

export function CaptionPreview({ styleId, text = "Unleash your creativity", className }: CaptionPreviewProps) {
  const words = text.split(" ")
  const tick = useLoopingAnimation(3000) // Re-trigger animations every 3s
  
  // We use `tick` as a key or dependency to force CSS animations to restart
  
  switch (styleId) {
    case "cs_pop":
      return (
        <div key={tick} className={cn("flex flex-wrap items-center justify-center gap-1.5 font-bold text-xl", className)}>
          {words.map((word, i) => (
            <span 
              key={i} 
              className="inline-block animate-in zoom-in spin-in-2 fill-mode-both"
              style={{ animationDelay: `${i * 150}ms`, animationDuration: '300ms' }}
            >
              <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ WebkitTextStroke: '1px black' }}>
                {word}
              </span>
            </span>
          ))}
        </div>
      )
      
    case "cs_fade":
      return (
        <div key={tick} className={cn("flex flex-wrap items-center justify-center gap-1.5 font-serif text-xl italic tracking-wide", className)}>
          {words.map((word, i) => (
            <span 
              key={i} 
              className="inline-block animate-in fade-in fill-mode-both text-yellow-50 drop-shadow-md"
              style={{ animationDelay: `${i * 300}ms`, animationDuration: '800ms' }}
            >
              {word}
            </span>
          ))}
        </div>
      )
      
    case "cs_slide":
      return (
        <div key={tick} className={cn("flex flex-wrap items-center justify-center gap-1.5 font-black text-xl uppercase", className)}>
          {words.map((word, i) => (
            <div key={i} className="overflow-hidden pb-1">
              <span 
                className="inline-block animate-in slide-in-from-bottom-full fill-mode-both text-white"
                style={{ 
                  animationDelay: `${i * 150}ms`, 
                  animationDuration: '400ms',
                  textShadow: '2px 2px 0 #8b5cf6, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>
      )
      
    case "cs_highlight":
      return (
        <div key={tick} className={cn("flex flex-wrap items-center justify-center gap-1.5 font-bold text-xl", className)}>
          {words.map((word, i) => (
            <span 
              key={i} 
              className="relative inline-block px-1 py-0.5"
            >
              <span 
                 className="absolute inset-0 bg-yellow-400 rounded-sm -z-10 animate-in fade-in zoom-in-95 fill-mode-both"
                 style={{ animationDelay: `${i * 250}ms`, animationDuration: '200ms' }}
              />
              <span 
                className="relative z-10 text-white animate-in text-black fill-mode-both"
                style={{ animationDelay: `${i * 250}ms`, animationDuration: '200ms', color: 'transparent' }} // Fallback trick, or just let CSS handle it
              >
                 <span style={{ 
                   animation: `textHighlight 200ms ${i * 250}ms forwards`,
                   color: 'white',
                   textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                 }}>
                   {word}
                 </span>
              </span>
            </span>
          ))}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes textHighlight {
              to { color: black; text-shadow: none; }
            }
          `}} />
        </div>
      )
      
    case "cs_typewriter":
      const letters = text.split("")
      return (
        <div key={tick} className={cn("inline-block font-mono text-xl text-emerald-400 font-bold drop-shadow-md", className)}>
          {letters.map((char, i) => (
            <span 
              key={i} 
              className="inline-block animate-in fade-in fill-mode-both"
              style={{ animationDelay: `${i * 50}ms`, animationDuration: '10ms' }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
          <span className="inline-block w-2 bg-emerald-400 h-5 ml-1 animate-pulse align-middle" />
        </div>
      )
      
    case "cs_karaoke":
      return (
        <div key={tick} className={cn("flex flex-wrap items-center justify-center gap-2 font-black text-2xl uppercase", className)}>
          {words.map((word, i) => (
            <span 
              key={i} 
              className="relative inline-block text-zinc-400/50"
              style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}
            >
              {word}
              <span 
                className="absolute inset-0 overflow-hidden text-fuchsia-500"
                style={{ 
                  WebkitTextStroke: '1px #d946ef',
                  animation: `karaokeFill 400ms ${i * 300}ms linear both` 
                }}
              >
                {word}
              </span>
            </span>
          ))}
           <style dangerouslySetInnerHTML={{__html: `
            @keyframes karaokeFill {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}} />
        </div>
      )
      
    default:
      return (
        <div className={cn("text-white font-medium", className)}>
          {text}
        </div>
      )
  }
}
