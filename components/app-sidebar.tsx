"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
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
  { title: "Series", icon: Layers, url: "/dashboard" },
  { title: "Videos", icon: Video, url: "/dashboard/videos" },
  { title: "Guides", icon: BookOpen, url: "/dashboard/guides" },
  { title: "Billing", icon: CreditCard, url: "/dashboard/billing" },
  { title: "Settings", icon: Settings, url: "/dashboard/settings" },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" className="border-r border-zinc-200 bg-white" {...props}>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-1 px-2 hover:opacity-80 transition-opacity">
          <div className="relative w-8 h-8 overflow-hidden rounded-lg">
            <Image src="/VIGEN_Icon.png" alt="VIGEN Logo" className="object-contain" fill sizes="32px" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">VIGEN</span>
        </Link>
        <div className="mt-6 px-2">
          <Link href="/dashboard/create" className="block w-full">
            <Button variant="default" className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-medium h-11 rounded-xl shadow-sm">
              <Plus className="h-5 w-5" />
              <span>Create New Series</span>
            </Button>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 mt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = item.url === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname?.startsWith(item.url)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      isActive={isActive}
                      className={`transition-all my-1 px-4 border ${isActive
                        ? "border-violet-900 bg-violet-100 text-zinc-900 font-semibold shadow-sm"
                        : "border-transparent text-zinc-600 hover:bg-violet-100 hover:border-violet-200 hover:text-violet-900"
                        }`}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-5 w-5 mr-3" />
                        <span className="text-base font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
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
              isActive={pathname?.startsWith("/dashboard/upgrade")}
              className={`transition-all my-1 px-4 border ${pathname?.startsWith("/dashboard/upgrade")
                ? "border-orange-200 bg-orange-50 text-orange-700 font-semibold shadow-sm"
                : "border-transparent text-zinc-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600"
                }`}
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
              isActive={pathname?.startsWith("/dashboard/profile")}
              className={`transition-all my-1 px-4 border ${pathname?.startsWith("/dashboard/profile")
                ? "border-violet-900 bg-violet-100 text-zinc-900 font-semibold shadow-sm"
                : "border-transparent text-zinc-600 hover:bg-violet-100 hover:border-violet-200 hover:text-violet-900"
                }`}
            >
              <Link href="/dashboard/profile">
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
