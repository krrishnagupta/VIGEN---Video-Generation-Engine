import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Layers,
  Video,
  BookOpen,
  CreditCard,
  Settings,
  Zap,
  User,
  Plus
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const menuItems = [
  { title: "Series", icon: Layers, url: "/dashboard/series" },
  { title: "Videos", icon: Video, url: "/dashboard/videos" },
  { title: "Guides", icon: BookOpen, url: "/dashboard/guides" },
  { title: "Billing", icon: CreditCard, url: "/dashboard/billing" },
  { title: "Settings", icon: Settings, url: "/dashboard/settings" },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" className="border-r border-zinc-200 bg-white" {...props}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-1 px-2">
          <div className="relative w-8 h-8 overflow-hidden rounded-lg">
            <Image src="/VIGEN_Icon.png" alt="VIGEN Logo" className="object-contain" fill />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">VIGEN</span>
        </div>
        <div className="mt-6 px-2">
          <Button variant="default" className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-medium h-11 rounded-xl shadow-sm">
            <Plus className="h-5 w-5" />
            <span>Create New Series</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 mt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    className="text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors my-1 px-4"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5 mr-3" />
                      <span className="text-base font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-zinc-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="text-zinc-600 hover:bg-zinc-100 hover:text-orange-600 transition-colors my-1 px-4"
            >
              <Link href="/dashboard/upgrade">
                <Zap className="h-5 w-5 mr-3 text-orange-500" />
                <span className="text-base font-medium">Upgrade</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors my-1 px-4"
            >
              <Link href="/dashboard/settings">
                <User className="h-5 w-5 mr-3" />
                <span className="text-base font-medium">Profile Setting</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
