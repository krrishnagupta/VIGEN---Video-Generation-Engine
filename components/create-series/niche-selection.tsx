"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Ghost,
  Flame,
  Lightbulb,
  History,
  Binary,
  HeartPulse,
  Globe,
  Coins,
  Plus
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

const niches = [
  {
    id: "scary-stories",
    title: "Scary Stories",
    description: "Bone-chilling urban legends and paranormal encounters for thrill-seekers.",
    icon: Ghost,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: "motivations",
    title: "Motivations",
    description: "Inspiring speeches and quotes to fuel productivity and positive mindset.",
    icon: Flame,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    id: "life-hacks",
    title: "Life Hacks",
    description: "Clever solutions and productivity tips for everyday challenges.",
    icon: Lightbulb,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    id: "historical-facts",
    title: "Historical Facts",
    description: "Intriguing stories and obscure events from the annals of history.",
    icon: History,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: "tech-trends",
    title: "Tech Trends",
    description: "Latest breakthroughs in AI, gadgets, and the digital world.",
    icon: Binary,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    id: "health-wellness",
    title: "Health & Wellness",
    description: "Holistic tips for physical fitness and mental well-being.",
    icon: HeartPulse,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    id: "global-news",
    title: "Global News",
    description: "Quick bites of trending stories from around the world.",
    icon: Globe,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: "finance-tips",
    title: "Finance Tips",
    description: "Smart advice on investing, saving, and wealth management.",
    icon: Coins,
    color: "text-amber-600",
    bg: "bg-amber-50",
  }
]

interface NicheSelectionProps {
  onSelect: (nicheId: string) => void
  selectedNiche: string | null
}

export function NicheSelection({ onSelect, selectedNiche }: NicheSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-md mx-auto mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Select your niche</h2>
        <p className="text-zinc-500 mt-2">Choose a predefined niche or create your own custom one to start generating content.</p>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="bg-zinc-100 p-1 h-12 rounded-xl">
            <TabsTrigger value="available" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Available Niche
            </TabsTrigger>
            <TabsTrigger value="custom" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Custom Niche
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="available" className="mt-0">
          <ScrollArea className="h-[420px] pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {niches.map((niche) => {
                const isSelected = selectedNiche === niche.id
                return (
                  <button
                    key={niche.id}
                    onClick={() => onSelect(niche.id)}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-2xl border transition-all text-left group",
                      isSelected
                        ? "border-purple-600 bg-purple-50/50 ring-1 ring-purple-600"
                        : "border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-xl shrink-0 transition-colors",
                      isSelected ? "bg-white" : niche.bg
                    )}>
                      <niche.icon className={cn("h-6 w-6", niche.color)} />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900">{niche.title}</h3>
                      <p className="text-sm text-zinc-500 mt-1 line-clamp-1">{niche.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="custom" className="mt-0">
          <div className="p-8 border border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-6 w-6 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Define your custom niche</h3>
            <p className="text-zinc-500 max-w-xs mx-auto mt-2 mb-6">
              Enter the details of the niche you want to explore. Our AI will adapt to your specific requirements.
            </p>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="e.g. Rare Deep Sea Creatures"
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all"
              />
              <button className="mt-4 w-full h-11 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors">
                Set Custom Niche
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
