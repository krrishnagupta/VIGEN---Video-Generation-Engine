import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="light">
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-zinc-50/50">
          <AppSidebar />
          <SidebarInset className="flex flex-col bg-transparent">
            <DashboardHeader />
            <main className="flex-1 p-6 lg:p-10">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
