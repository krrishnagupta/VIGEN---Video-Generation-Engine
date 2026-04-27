import React from "react";
import { 
  PlayCircle, 
  Layers, 
  Wand2, 
  Film, 
  CheckCircle2, 
  Settings2, 
  UploadCloud, 
  Download,
  BookOpen
} from "lucide-react";
import Link from "next/link";

export default function GuidesPage() {
  const steps = [
    {
      title: "1. Create Your Video Series",
      description: "Start by defining the core concept of your videos. Head over to the 'Create New Series' page to pick your topic, select an AI persona/voice, and choose a visual style (e.g., Realistic, Anime, Watercolor).",
      icon: <Layers className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50 border-purple-100",
      iconBg: "bg-purple-100",
      action: { label: "Create Series", url: "/dashboard/create" }
    },
    {
      title: "2. Trigger AI Generation",
      description: "Once your series is configured, click the 'Trigger Generation' button on your series card. Our AI will automatically write a compelling script, generate a lifelike voiceover, and create distinct visuals for every scene.",
      icon: <Wand2 className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50 border-blue-100",
      iconBg: "bg-blue-100",
      action: { label: "View Series", url: "/dashboard" }
    },
    {
      title: "3. Review & Refine",
      description: "Before final rendering, you enter the Review stage. Here you can read through the AI-generated script, preview the generated scene images, and request targeted AI regenerations if a specific scene needs a different vibe.",
      icon: <Settings2 className="w-6 h-6 text-orange-600" />,
      color: "bg-orange-50 border-orange-100",
      iconBg: "bg-orange-100",
    },
    {
      title: "4. Final Render & Download",
      description: "Once you approve the assets, our system merges the audio, images, and dynamic captions into a final, high-quality HD video. You can download it directly to your device or auto-publish it to your connected social channels.",
      icon: <Film className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-100",
      iconBg: "bg-emerald-100",
      action: { label: "View Videos", url: "/dashboard/videos" }
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 text-zinc-800/50">
          <BookOpen className="w-64 h-64 rotate-12" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-wider mb-6">
            <PlayCircle className="w-4 h-4" /> Getting Started
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Master the AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Video Pipeline
            </span>
          </h1>
          <p className="text-lg text-zinc-400 font-medium leading-relaxed mb-8 max-w-xl">
            Learn how to transform a simple prompt into a fully-produced, viral-ready short video in just four simple steps.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/create">
              <button className="h-12 px-8 bg-white text-zinc-900 rounded-xl font-bold hover:bg-zinc-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Start Creating Now
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Step-by-Step Workflow</h2>
          <div className="flex-1 h-px bg-zinc-200 ml-4"></div>
        </div>

        <div className="grid gap-6">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl border transition-all duration-300 hover:shadow-lg bg-white border-zinc-200 group`}
            >
              {/* Decorative Background Element */}
              <div className={`absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 rounded-full opacity-50 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${step.color}`}></div>

              <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
                <div className={`shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl ${step.iconBg} border border-white/50 shadow-sm`}>
                  {step.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-zinc-500 font-medium leading-relaxed max-w-3xl">
                    {step.description}
                  </p>
                </div>

                {step.action && (
                  <div className="shrink-0 pt-2 md:pt-0">
                    <Link href={step.action.url}>
                      <button className="h-10 px-5 rounded-xl bg-zinc-900 text-white font-medium text-sm hover:bg-zinc-800 transition-colors shadow-sm whitespace-nowrap">
                        {step.action.label}
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-200">
          <div className="w-12 h-12 bg-white rounded-xl border border-zinc-200 flex items-center justify-center mb-6 shadow-sm">
            <UploadCloud className="w-6 h-6 text-zinc-700" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Connect Socials</h3>
          <p className="text-sm text-zinc-600 leading-relaxed mb-4">
            Head to the settings page to connect your YouTube, Instagram, and TikTok accounts. Once connected, your approved videos can be automatically published without manual downloads.
          </p>
          <Link href="/dashboard/settings" className="text-sm font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1">
            Go to Integrations &rarr;
          </Link>
        </div>

        <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-200">
          <div className="w-12 h-12 bg-white rounded-xl border border-zinc-200 flex items-center justify-center mb-6 shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-zinc-700" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Prompting Tips</h3>
          <p className="text-sm text-zinc-600 leading-relaxed mb-4">
            When creating a series, be as descriptive as possible in your topic. Include details like pacing, mood, or specific keywords you want the AI to emphasize during script writing.
          </p>
          <Link href="/dashboard/create" className="text-sm font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1">
            Try creating one &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
