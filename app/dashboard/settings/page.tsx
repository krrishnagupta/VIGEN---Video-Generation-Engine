"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Trash2, X, Loader2, Check } from "lucide-react"

const SOCIAL_PLATFORMS = [
  {
    id: "youtube",
    name: "YouTube",
    description: "Connect your YouTube channel to post videos and shorts directly.",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-[#FF0000]">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    activeColor: "bg-red-50 text-red-600 border-red-200"
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Connect your Instagram to automatically share Reels from generation.",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-[#E1306C]">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    activeColor: "bg-pink-50 text-pink-600 border-pink-200"
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Link TikTok creator profile to publish immediately on scheduled times.",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-black">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.36 6.34 6.34 0 0 0 6.25-6.36V7.94a8.32 8.32 0 0 0 3.16.63V5.13a4.7 4.7 0 0 1-1.09.13V6.69z" />
      </svg>
    ),
    activeColor: "bg-zinc-100 text-zinc-900 border-zinc-300"
  }
]

export default function SettingsPage() {
  const router = useRouter()
  const [connections, setConnections] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(true)
  const [connectingId, setConnectingId] = React.useState<string | null>(null)

  // Danger Zone states
  const [showDangerModal, setShowDangerModal] = React.useState(false)
  const [timeLeft, setTimeLeft] = React.useState(10)
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    fetchConnections()
  }, [])

  React.useEffect(() => {
    let timer: NodeJS.Timeout
    if (showDangerModal && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [showDangerModal, timeLeft])

  const fetchConnections = async () => {
    try {
      const res = await fetch("/api/settings/connections")
      if (res.ok) {
        const data = await res.json()
        setConnections(data.platforms || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (platformId: string) => {
    setConnectingId(platformId)
    try {
      const res = await fetch("/api/settings/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: platformId })
      })
      
      const data = await res.json()
      
      if (res.ok && data.url) {
        // Redirect user to the OAuth provider's consent screen
        window.location.href = data.url
      } else {
        alert(data.error || "Failed to initiate connection")
        setConnectingId(null)
      }
    } catch (e) {
      console.error("Connect error:", e)
      alert("Error establishing connection.")
      setConnectingId(null)
    }
  }

  const handleDisconnect = async (platformId: string) => {
    setConnectingId(platformId)
    try {
      const res = await fetch("/api/settings/connections", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: platformId })
      })
      if (res.ok) {
        setConnections((prev) => prev.filter(p => p !== platformId))
      }
    } catch (e) {
      console.error("Disconnect error:", e)
    } finally {
      setConnectingId(null)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" })
      if (res.ok) {
        window.location.href = "/" // Clerk will redirect to sign-in since user is gone
      } else {
        const err = await res.json()
        alert(err.error || "Failed to delete account")
        setIsDeleting(false)
        setShowDangerModal(false)
      }
    } catch (e) {
      alert("Encountered unexpected error.")
      setIsDeleting(false)
      setShowDangerModal(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Settings</h1>
        <p className="text-zinc-500 mt-1 font-medium">Manage your social integrations and account preferences.</p>
      </div>

      {/* Social Integrations Section */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50">
          <h2 className="text-lg font-semibold text-zinc-900">Social Connections</h2>
          <p className="text-sm text-zinc-500">Connect your channels to enable automated background publishing.</p>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className="grid gap-4">
              {SOCIAL_PLATFORMS.map((platform) => {
                const isConnected = connections.includes(platform.id)
                const isProcessing = connectingId === platform.id

                return (
                  <div key={platform.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors bg-white">
                    <div className="flex items-start sm:items-center gap-4 mb-4 sm:mb-0">
                      <div className="shrink-0 p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                        {platform.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-zinc-900">{platform.name}</h3>
                          {isConnected && (
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${platform.activeColor}`}>
                              Connected
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-500 mt-0.5 max-w-sm leading-relaxed">{platform.description}</p>
                      </div>
                    </div>

                    <div className="shrink-0 pt-2 sm:pt-0 border-t border-zinc-100 sm:border-0 pl-0 sm:pl-4">
                      {isConnected ? (
                        <button
                          disabled={isProcessing}
                          onClick={() => handleDisconnect(platform.id)}
                          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 hover:text-zinc-900 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isProcessing ? "Disconnecting..." : "Disconnect"}
                        </button>
                      ) : (
                        <button
                          disabled={isProcessing}
                          onClick={() => handleConnect(platform.id)}
                          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 rounded-lg transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                        >
                          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          Connect Account
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-2xl overflow-hidden mt-8 max-w-3xl">
        <div className="px-6 py-5 border-b border-red-200/60 bg-red-100/50 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h2 className="text-lg font-bold text-red-900 tracking-tight">Danger Zone</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-red-700 max-w-xl mb-6 leading-relaxed font-medium">
            <strong className="text-red-900">WARNING:</strong> If you click the delete button, it will irrevocably delete absolutely all your data — videos, series, social connections, settings, and remaining credits. Action cannot be undone.
          </p>
          <button 
            onClick={() => {
              setTimeLeft(10)
              setShowDangerModal(true)
            }}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account Permanently
          </button>
        </div>
      </div>

      {/* Target Deletion Modal */}
      {showDangerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-start">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="font-bold text-lg text-zinc-900">Confirm Deletion</h3>
              </div>
              <button 
                onClick={() => setShowDangerModal(false)}
                disabled={isDeleting}
                className="text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 bg-zinc-50 space-y-4">
              <p className="text-sm text-zinc-600">
                You are about to securely wipe your trace from ViGen. 
                Are you completely sure you want to end your journey with us?
              </p>
              
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-1">Action Active In</p>
                <div className="text-4xl font-black text-red-700 tabular-nums font-mono">{timeLeft}s</div>
              </div>
            </div>

            <div className="p-6 flex flex-col-reverse sm:flex-row gap-3 bg-white">
              <button
                disabled={isDeleting}
                onClick={() => setShowDangerModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={timeLeft > 0 || isDeleting}
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {isDeleting ? "Deleting..." : "Erase Everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
