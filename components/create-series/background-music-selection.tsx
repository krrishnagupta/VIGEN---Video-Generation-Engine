"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { BACKGROUND_MUSIC } from "@/lib/constants/background-music-data"
import { 
  Check, 
  Play, 
  Pause, 
  Music, 
  VolumeX,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"

export interface SelectedMusicParams {
  id: string
  url: string
  startTime: number
  endTime: number
}

interface BackgroundMusicSelectionProps {
  onUpdate: (data: { backgroundMusics: SelectedMusicParams[] }) => void
  selectedMusics: SelectedMusicParams[]
}

export function BackgroundMusicSelection({ 
  onUpdate, 
  selectedMusics 
}: BackgroundMusicSelectionProps) {
  const [playingId, setPlayingId] = React.useState<string | null>(null)
  // Store audio duration per track so we can use it in the slider (max prop)
  const [durations, setDurations] = React.useState<Record<string, number>>({})
  const audioRefs = React.useRef<{ [key: string]: HTMLAudioElement }>({})
  const selectedMusicsRef = React.useRef(selectedMusics)

  React.useEffect(() => {
    selectedMusicsRef.current = selectedMusics
  }, [selectedMusics])

  // Handle selection of a track
  const toggleSelection = (id: string, url: string) => {
    const isSelected = selectedMusics.some((m) => m.id === id)
    let newSelections: SelectedMusicParams[]

    if (isSelected) {
      newSelections = selectedMusics.filter((m) => m.id !== id)
    } else {
      // Default crop: start at 0, end at duration (or 30 if duration isn't loaded yet)
      const duration = durations[id] || 30
      newSelections = [...selectedMusics, { id, url, startTime: 0, endTime: duration }]
    }

    onUpdate({ backgroundMusics: newSelections })
  }

  // Handle no music opt-out
  const handleNoMusic = () => {
    // Clear selections and implicitly pass an empty array, or maybe add a specific "none" marker if desired.
    // For now, empty array means no music.
    onUpdate({ backgroundMusics: [] })
  }

  // Handle Play/Pause
  const handlePlayPreview = (e: React.MouseEvent, id: string, url: string) => {
    e.stopPropagation()
    
    // Stop currently playing
    if (playingId && playingId !== id && audioRefs.current[playingId]) {
      audioRefs.current[playingId].pause()
      audioRefs.current[playingId].currentTime = 0
    }

    if (playingId === id) {
      // Pause
      if (audioRefs.current[id]) {
        audioRefs.current[id].pause()
      }
      setPlayingId(null)
    } else {
      // Play
      let audio = audioRefs.current[id]
      if (!audio) {
        audio = new Audio(url)
        
        // Listen to duration metadata so we can render bounds
        audio.addEventListener('loadedmetadata', () => {
          setDurations((prev) => ({ ...prev, [id]: audio.duration }))
          // Update the endpoint of the selection if it was already selected and duration was unknown
          const selection = selectedMusicsRef.current.find(m => m.id === id)
          if (selection && selection.endTime === 30 && audio.duration !== 30) {
            const updated = selectedMusicsRef.current.map(m => 
              m.id === id ? { ...m, endTime: audio.duration } : m
            )
            onUpdate({ backgroundMusics: updated })
          }
        })

        audio.addEventListener('ended', () => {
          setPlayingId(null)
        })

        // Also if we have trim settings, we might want to respect them during playback?
        // Let's just play from the start for preview purposes or from the trim start.
        audio.addEventListener('timeupdate', () => {
          const selection = selectedMusicsRef.current.find(m => m.id === id)
          if (selection && audio.currentTime >= selection.endTime) {
            audio.pause()
            audio.currentTime = selection.startTime
            setPlayingId(null)
          }
        })

        audioRefs.current[id] = audio
      }

      // If it's selected, start from the trimmed startTime
      const selection = selectedMusics.find(m => m.id === id)
      audio.currentTime = selection ? selection.startTime : 0

      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlayingId(id)
          })
          .catch((error) => {
            console.error("Audio play error:", error)
            setPlayingId(null)
          })
      }
    }
  }

  const handleSliderChange = (id: string, values: number[]) => {
    let finalStart = values[0]
    let finalEnd = values[1]

    const updated = selectedMusics.map(m => {
      if (m.id === id) {
        // Enforce a minimum duration of 1 second so thumbs don't overlap completely
        let [start, end] = values
        if (end - start < 1) {
           if (start === m.startTime) {
             end = start + 1
           } else {
             start = end - 1
           }
        }
        finalStart = start
        finalEnd = end
        return { ...m, startTime: start, endTime: end }
      }
      return m
    })
    onUpdate({ backgroundMusics: updated })

    // Adjust playback if currently playing
    if (playingId === id && audioRefs.current[id]) {
       const audio = audioRefs.current[id];
       if (audio.currentTime < finalStart || audio.currentTime >= finalEnd - 0.1) {
         audio.currentTime = finalStart;
       }
    }
  }

  // Preload durations optionally, or just fetch them when selecting/playing
  React.useEffect(() => {
    // Only fetch durations for selected ones to save network?
    // Let's create Audio objects for selected items if they don't exist to get their lengths.
    selectedMusics.forEach((m) => {
      if (!durations[m.id] && !audioRefs.current[m.id]) {
        const audio = new Audio(m.url)
        audio.addEventListener('loadedmetadata', () => {
          setDurations((prev) => ({ ...prev, [m.id]: audio.duration }))
        })
        audioRefs.current[m.id] = audio
      }
    })
  }, [selectedMusics])

  // Cleanup audios
  React.useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause()
        audio.removeAttribute('src')
        audio.load()
      })
    }
  }, [])

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = Math.floor(seconds % 60)
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Background Music</h2>
        <p className="text-zinc-500 mt-2">Select the background tracks for your series. You can select multiple and trim them.</p>
      </div>

      <div className="space-y-4">
        {/* Top actions */}
        <div className="flex justify-end px-1">
           <button
             onClick={handleNoMusic}
             className={cn(
               "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
               selectedMusics.length === 0
                 ? "bg-rose-50 border-rose-200 text-rose-700"
                 : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
             )}
           >
             <VolumeX className="w-4 h-4" />
             {selectedMusics.length === 0 ? "No Music Selected" : "Skip Music"}
           </button>
        </div>

        {/* List of music */}
        <ScrollArea className="h-[460px] pr-4 -mr-4">
          <div className="grid grid-cols-1 gap-3 pb-4">
            {BACKGROUND_MUSIC.map((track) => {
              const selection = selectedMusics.find(m => m.id === track.id)
              const isSelected = !!selection
              const isPlaying = playingId === track.id
              const duration = durations[track.id] || 30 // fallback to 30s until loaded

              return (
                <div 
                  key={track.id}
                  className={cn(
                    "group relative flex flex-col p-4 rounded-2xl border transition-all",
                    isSelected 
                      ? "border-purple-600 bg-purple-50/30 ring-1 ring-purple-600 shadow-sm" 
                      : "border-zinc-200 bg-white hover:border-purple-300 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => toggleSelection(track.id, track.url)}
                    >
                      {/* Checkbox / Play Indicator */}
                      <div className="relative flex items-center justify-center shrink-0">
                        <div className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                          isSelected ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600 group-hover:bg-purple-200"
                        )}>
                          <Music className="h-6 w-6" />
                        </div>
                        {isSelected && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                            <div className="bg-purple-600 rounded-full p-0.5">
                              <Check className="h-3 w-3 text-white stroke-[3]" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Track Info */}
                      <div className="flex-1">
                         <h4 className="font-bold text-zinc-900 leading-tight">
                           {track.name}
                         </h4>
                         <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            {track.tags?.map((tag, i) => (
                              <React.Fragment key={tag}>
                                <span className="text-[10px] font-bold text-purple-600/70 uppercase tracking-tighter bg-purple-100/50 px-2 py-0.5 rounded-full">
                                  {tag}
                                </span>
                              </React.Fragment>
                            ))}
                         </div>
                      </div>
                    </div>
                    
                    {/* Play/Pause Button */}
                    <div className="ml-4 pl-4 border-l border-zinc-100 flex items-center">
                      <button
                        onClick={(e) => handlePlayPreview(e, track.id, track.url)}
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center transition-all shadow-sm border",
                          isPlaying 
                            ? "bg-zinc-900 text-white border-zinc-900" 
                            : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900"
                        )}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4 fill-current" />
                        ) : (
                          <Play className="h-4 w-4 ml-0.5 fill-current" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Trim UI - Only visible when selected */}
                  {isSelected && selection && (
                    <div className="mt-4 pt-4 border-t border-purple-200/50 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center justify-between text-xs font-medium text-purple-900/70">
                        <span>Trim Music</span>
                        <span>{formatTime(selection.endTime - selection.startTime)} selected</span>
                      </div>
                      
                      <div className="px-2">
                        <Slider 
                           value={[selection.startTime, selection.endTime]}
                           min={0}
                           max={duration}
                           step={0.1}
                           onValueChange={(values) => handleSliderChange(track.id, values)}
                           className="py-1"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-400">
                        <span>{formatTime(selection.startTime)}</span>
                        <span>{formatTime(selection.endTime)}</span>
                      </div>
                    </div>
                  )}

                  {/* Subtle visualizer when playing but not selected */}
                  {isPlaying && !isSelected && (
                     <div className="absolute inset-x-4 bottom-0 h-0.5 flex items-end gap-[1px] overflow-hidden opacity-30 rounded-b-2xl">
                        {[...Array(20)].map((_, i) => (
                          <div 
                            key={i} 
                            className="flex-1 bg-purple-500 rounded-t-sm animate-pulse" 
                            style={{ 
                              height: `${20 + Math.random() * 80}%`,
                              animationDelay: `${i * 0.05}s`
                            }} 
                          />
                        ))}
                     </div>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
