import { currentUser } from "@clerk/nextjs/server"
import { syncUser } from "@/lib/sync-user"
import { 
  Plus, 
  Video, 
  TrendingUp, 
  Clock, 
  Play
} from "lucide-react"

export default async function DashboardPage() {
  const user = await syncUser();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Welcome back, {user.firstName || user.username || "Creator"}!
          </h1>
          <p className="text-zinc-500 mt-1 font-medium">
            Here's what's happening with your video series today.
          </p>
        </div>
        <button className="h-11 px-6 rounded-xl bg-zinc-900 text-white font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shadow-sm">
          <Plus className="h-5 w-5" />
          <span>New Video</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Video className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-zinc-600 uppercase tracking-wider">Total Videos</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-zinc-900">12</span>
            <span className="text-sm font-medium text-emerald-600 mb-1">+2 this week</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-zinc-600 uppercase tracking-wider">Engagement</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-zinc-900">4.8k</span>
            <span className="text-sm font-medium text-emerald-600 mb-1">+12%</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-zinc-600 uppercase tracking-wider">Watch Time</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-zinc-900">124h</span>
            <span className="text-sm font-medium text-emerald-600 mb-1">+5h</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">Recent Projects</h2>
        <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
          <div className="p-8 text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 flex items-center justify-center mx-auto mb-4">
              <Play className="h-6 w-6 text-zinc-300" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Start your first video series</h3>
            <p className="text-zinc-500 max-w-xs mx-auto mt-2">
              Generate AI-powered short videos and schedule them across your channels automatically.
            </p>
            <button className="mt-8 h-10 px-6 rounded-lg bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors">
              Get Started Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
