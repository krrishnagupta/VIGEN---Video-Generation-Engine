"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { NicheSelection } from "@/components/create-series/niche-selection"
import { LanguageVoiceSelection } from "@/components/create-series/language-voice-selection"
import { VideoStyleSelection } from "@/components/create-series/video-style-selection"
import { BackgroundMusicSelection, SelectedMusicParams } from "@/components/create-series/background-music-selection"
import { CaptionStyleSelection } from "@/components/create-series/caption-style-selection"
import { SeriesDetails, SeriesDetailsData } from "@/components/create-series/series-details"
import { StepFooter } from "@/components/create-series/step-footer"
import { cn } from "@/lib/utils"

const TOTAL_STEPS = 6

export interface FormData {
  nicheId: string | null
  language: string | null
  voiceId: string | null
  videoStyleId: string | null
  backgroundMusics: SelectedMusicParams[]
  captionStyleId: string | null
  seriesDetails: SeriesDetailsData
}

interface SeriesFormProps {
  initialData?: FormData
  seriesId?: string
}

export function SeriesForm({ initialData, seriesId }: SeriesFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const [formData, setFormData] = React.useState<FormData>(initialData || {
    nicheId: null,
    language: "English (United States)", // Default
    voiceId: null,
    videoStyleId: null,
    backgroundMusics: [],
    captionStyleId: null,
    seriesDetails: {
      seriesName: "",
      videoDuration: "",
      platforms: [],
      publishTime: "",
    }
  })

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleUpdateForm = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === TOTAL_STEPS) {
      setIsSubmitting(true)
      try {
        const isEdit = !!seriesId;
        const endpoint = isEdit ? `/api/series/${seriesId}` : '/api/series';
        const method = isEdit ? 'PUT' : 'POST';

        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        const result = await response.json();

        if (response.ok) {
          router.push('/dashboard')
          router.refresh();
        } else {
          console.error("Failed to save series data", result)
        }
      } catch (error) {
        console.error("Error saving series data:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canContinue = () => {
    if (currentStep === 1) return !!formData.nicheId
    if (currentStep === 2) return !!formData.language && !!formData.voiceId
    if (currentStep === 3) return !!formData.videoStyleId
    if (currentStep === 4) return true // Optional, user can proceed with no music selected
    if (currentStep === 5) return !!formData.captionStyleId
    if (currentStep === 6) {
      const { seriesName, videoDuration, platforms, publishTime } = formData.seriesDetails
      return !!seriesName && !!videoDuration && platforms.length > 0 && !!publishTime
    }
    return true
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="flex gap-2 mb-12">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
          const stepNumber = i + 1
          const isActive = stepNumber <= currentStep
          return (
            <div key={i} className="flex-1 space-y-2">
              <div className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                isActive ? "bg-gradient-to-r from-purple-600 to-blue-600" : "bg-zinc-200"
              )} />
              <div className="flex justify-between items-center px-1">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  isActive ? "text-purple-600" : "text-zinc-400"
                )}>
                  Step {stepNumber}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white border border-zinc-100 rounded-[32px] p-8 md:p-12 shadow-sm min-h-[500px] flex flex-col">
        {/* Step Content */}
        <div className="flex-1">
          {currentStep === 1 && (
            <NicheSelection
              onSelect={(nicheId) => handleUpdateForm({ nicheId })}
              selectedNiche={formData.nicheId}
            />
          )}

          {currentStep === 2 && (
            <LanguageVoiceSelection
              onUpdate={handleUpdateForm}
              selectedLanguage={formData.language}
              selectedVoiceId={formData.voiceId}
            />
          )}

          {currentStep === 3 && (
            <VideoStyleSelection
              onUpdate={handleUpdateForm}
              selectedStyleId={formData.videoStyleId}
            />
          )}

          {currentStep === 4 && (
            <BackgroundMusicSelection
              onUpdate={handleUpdateForm}
              selectedMusics={formData.backgroundMusics}
            />
          )}

          {currentStep === 5 && (
            <CaptionStyleSelection
              onUpdate={handleUpdateForm}
              selectedStyleId={formData.captionStyleId}
            />
          )}

          {currentStep === 6 && (
            <SeriesDetails
              onUpdate={(details) => handleUpdateForm({ seriesDetails: { ...formData.seriesDetails, ...details } })}
              data={formData.seriesDetails}
            />
          )}

          {currentStep > 6 && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold font-plus-jakarta">
                {seriesId ? "Updating Series..." : "Generating Series..."}
              </h2>
              <p className="text-zinc-500 mt-2 font-inter">
                {seriesId ? "Your series changes are being saved." : "Your series is being scheduled."}
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <StepFooter
          onNext={handleNext}
          onBack={handleBack}
          canNext={canContinue() && !isSubmitting}
          canBack={currentStep > 1 && !isSubmitting}
          nextLabel={
            isSubmitting 
              ? (seriesId ? "Updating..." : "Scheduling...") 
              : currentStep === TOTAL_STEPS 
                ? (seriesId ? "Update Series" : "Schedule") 
                : "Continue"
          }
        />
      </div>
    </div>
  )
}
