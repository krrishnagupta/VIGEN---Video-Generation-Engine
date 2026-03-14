"use client"

import * as React from "react"
import { ArrowRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StepFooterProps {
  onNext: () => void
  onBack: () => void
  canNext?: boolean
  canBack?: boolean
  nextLabel?: string
  backLabel?: string
}

export function StepFooter({
  onNext,
  onBack,
  canNext = true,
  canBack = true,
  nextLabel = "Continue",
  backLabel = "Back"
}: StepFooterProps) {
  return (
    <div className="mt-12 pt-8 border-t border-zinc-100 flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={!canBack}
        className="rounded-xl px-6 h-12 text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
      >
        <ChevronLeft className="mr-2 h-5 w-5" />
        {backLabel}
      </Button>

      <Button
        onClick={onNext}
        disabled={!canNext}
        className="rounded-xl px-8 h-12 bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
      >
        <span>{nextLabel}</span>
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  )
}
