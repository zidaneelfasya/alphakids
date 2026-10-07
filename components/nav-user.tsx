"use client"

import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              data-slot="user-avatar-trigger"
              onClick={(e) => e.stopPropagation()}
              className="text-white hover:bg-white/12 data-[state=open]:bg-white/15 rounded-xl transition-colors cursor-pointer group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!min-w-12 group-data-[collapsible=icon]:!min-h-12 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto"
            >
              <Avatar className="h-9 w-9 group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!w-10 rounded-full ring-2 ring-white/30 bg-white shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full bg-white text-[#21b1db] font-semibold text-xs">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight text-white group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold text-sm">{user.name}</span>
                <span className="truncate text-xs text-white/70">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-white/70 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl p-2 shadow-xl border border-slate-200 dark:border-slate-800"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2.5 px-2 py-2 text-left text-sm">
                <Avatar className="h-9 w-9 rounded-full ring-1 ring-slate-200">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-full bg-cyan-100 text-[#21b1db] font-semibold text-xs">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-slate-900 dark:text-white">{user.name}</span>
                  <span className="truncate text-xs text-slate-500">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <a href="/dashboard/profile" className="flex items-center gap-2">
                  <BadgeCheck className="size-4 text-slate-500" />
                  <span>Profil Akun</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <a href="/dashboard/transactions" className="flex items-center gap-2">
                  <CreditCard className="size-4 text-slate-500" />
                  <span>Riwayat Transaksi</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40 rounded-lg cursor-pointer flex items-center gap-2"
              onClick={async () => {
                const { createClient } = await import('@/lib/supabase/client');
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = '/auth/login';
              }}
            >
              <LogOut className="size-4 text-red-600" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
