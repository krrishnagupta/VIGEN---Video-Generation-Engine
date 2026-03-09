import { UserButton } from "@clerk/nextjs"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
      </div>
      <div className="flex items-center gap-4">
        <UserButton 
          afterSignOutUrl="/" 
          appearance={{
            elements: {
              avatarBox: "h-9 w-9"
            }
          }}
        />
      </div>
    </header>
  )
}
