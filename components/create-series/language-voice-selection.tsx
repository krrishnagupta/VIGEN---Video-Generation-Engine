"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LANGUAGES, VOICES } from "@/lib/constants/language-voice-data"
import { 
  Check, 
  Play, 
  Pause, 
  Globe, 
  User, 
  ChevronRight,
  Headphones,
  Sparkles
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface LanguageVoiceSelectionProps {
  onUpdate: (data: { language?: string; voiceId?: string }) => void
  selectedLanguage: string | null
  selectedVoiceId: string | null
}

export function LanguageVoiceSelection({ 
  onUpdate, 
  selectedLanguage, 
  selectedVoiceId 
}: LanguageVoiceSelectionProps) {
  const [playingId, setPlayingId] = React.useState<string | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  const filteredVoices = React.useMemo(() => {
    if (!selectedLanguage) return []
    const langObj = LANGUAGES.find(l => l.language === selectedLanguage)
    if (!langObj) return []
    
    return VOICES.filter(v => 
      v.lang === langObj.modelLangCode || 
      v.lang.startsWith(langObj.modelLangCode.split('-')[0])
    )
  }, [selectedLanguage])

  const handlePlayPreview = (e: React.MouseEvent, voiceId: string, previewUrl: string) => {
    e.stopPropagation()
    setLoadError(null)
    
    if (playingId === voiceId) {
      audioRef.current?.pause()
      setPlayingId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.src = previewUrl
        audioRef.current.load()
        const playPromise = audioRef.current.play()
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlayingId(voiceId)
            })
            .catch((error) => {
              console.error("Audio play error:", error)
              setLoadError(error.message || "Failed to load audio")
              setPlayingId(null)
            })
        }
      }
    }
  }

  React.useEffect(() => {
    const audio = new Audio()
    audio.onended = () => setPlayingId(null)
    audio.onerror = () => {
      setLoadError("Failed to load audio")
      setPlayingId(null)
    }
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header - Consistent with Step 1 */}
      <div className="text-center max-w-md mx-auto mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Language & Voice</h2>
        <p className="text-zinc-500 mt-2">Select the language and the voice that will narrate your series.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 ml-1">Target Language</label>
          <Select 
            value={selectedLanguage || ""} 
            onValueChange={(val) => onUpdate({ language: val, voiceId: undefined })}
          >
            <SelectTrigger className="w-full h-12 rounded-xl border-zinc-200 bg-white focus:ring-2 focus:ring-purple-600/20 transition-all font-medium">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-zinc-100 shadow-xl max-h-[300px]">
              {LANGUAGES.map((lang) => (
                <SelectItem 
                  key={lang.language} 
                  value={lang.language}
                  className="rounded-lg focus:bg-purple-50 focus:text-purple-700 py-2.5 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img src={lang.countryFlag} className="h-4 w-6 object-cover rounded shadow-sm border border-zinc-100" alt="" />
                    <span className="font-medium">{lang.language}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voice Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-semibold text-zinc-700">Available Voices</label>
            {selectedLanguage && (
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {filteredVoices.length} Narrators Found
              </span>
            )}
          </div>

          {!selectedLanguage ? (
            <div className="h-[400px] flex flex-col items-center justify-center p-8 bg-zinc-50/50 border border-dashed border-zinc-200 rounded-3xl text-center">
              <div className="h-16 w-16 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center mb-4 shadow-sm">
                <Headphones className="h-8 w-8 text-zinc-300" />
              </div>
              <p className="text-zinc-500 text-sm font-medium">Please select a language first to see available voices.</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4 -mr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                {filteredVoices.map((voice) => {
                  const isSelected = selectedVoiceId === voice.id
                  const isPlaying = playingId === voice.id

                  return (
                    <button
                      key={voice.id}
                      onClick={() => onUpdate({ voiceId: voice.id })}
                      className={cn(
                        "group relative flex flex-col p-4 rounded-2xl border transition-all text-left",
                        isSelected 
                          ? "border-purple-600 bg-purple-50/50 ring-1 ring-purple-600" 
                          : "border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                            isSelected ? "bg-purple-600 text-white" : "bg-zinc-100 text-zinc-400 group-hover:bg-purple-50 group-hover:text-purple-600"
                          )}>
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                             <h4 className="font-bold text-zinc-900 leading-tight">
                               {voice.modelName.charAt(0).toUpperCase() + voice.modelName.slice(1)}
                             </h4>
                             <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                                  {voice.provider}
                                </span>
                                <span className="h-0.5 w-0.5 rounded-full bg-zinc-300" />
                                <span className="text-[10px] font-medium text-zinc-400 capitalize">
                                  {voice.gender}
                                </span>
                             </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => handlePlayPreview(e, voice.id, voice.preview)}
                          className={cn(
                            "h-9 w-9 rounded-full flex items-center justify-center transition-all",
                            isPlaying 
                              ? "bg-zinc-900 text-white" 
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-900 hover:text-white"
                          )}
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4 fill-current" />
                          ) : (
                            <Play className="h-4 w-4 ml-0.5 fill-current" />
                          )}
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                          <div className={cn(
                            "flex items-center gap-1.5 text-xs font-bold transition-all",
                            isSelected ? "text-purple-600" : "text-zinc-300 group-hover:text-zinc-500"
                          )}>
                             {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                             {isSelected ? "Selected" : "Select Voice"}
                          </div>
                          <ChevronRight className={cn(
                              "h-3.5 w-3.5 transition-transform",
                              isSelected ? "text-purple-400 rotate-90" : "text-zinc-200 group-hover:translate-x-0.5 group-hover:text-purple-300"
                          )} />
                      </div>

                      {/* Subtle wave visualizer when playing */}
                      {isPlaying && (
                        <div className="absolute inset-x-4 bottom-0 h-0.5 flex items-end gap-[1px] overflow-hidden opacity-50">
                           {[...Array(12)].map((_, i) => (
                             <div 
                               key={i} 
                               className="flex-1 bg-purple-500 rounded-t-sm animate-pulse" 
                               style={{ 
                                 height: `${30 + Math.random() * 70}%`,
                                 animationDelay: `${i * 0.05}s`
                               }} 
                             />
                           ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  )
}
