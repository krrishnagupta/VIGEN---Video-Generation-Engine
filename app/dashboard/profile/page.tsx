"use client"

import { UserProfile } from "@clerk/nextjs"

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Your Profile</h1>
        <p className="text-zinc-500 mt-1 font-medium">Manage your personal information and account security.</p>
      </div>
      
      <div className="flex justify-start">
        <UserProfile 
          appearance={{
            elements: {
              rootBox: "w-full max-w-full shadow-sm rounded-2xl border border-zinc-200 overflow-hidden",
              card: "shadow-none border-none rounded-none w-full max-w-full",
              navbar: "border-r border-zinc-100 bg-zinc-50/50 hidden md:block",
              headerTitle: "text-lg font-bold text-zinc-900 tracking-tight",
              headerSubtitle: "text-zinc-500",
              profileSectionTitle: "text-sm font-semibold text-zinc-900 uppercase tracking-wider",
              profileSectionTitleText: "text-sm font-semibold text-zinc-900",
            }
          }}
        />
      </div>
    </div>
  )
}
