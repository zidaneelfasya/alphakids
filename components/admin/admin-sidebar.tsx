'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Palette,
  Ticket,
  CreditCard,
  Users,
  Award,
  Settings,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { NavUser } from '@/components/nav-user';

const adminMenuItems = [
  {
    title: 'Ringkasan Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Kelola Program',
    url: '/admin/programs',
    icon: BookOpen,
  },
  {
    title: 'Kelola Kategori',
    url: '/admin/categories',
    icon: FolderTree,
  },
  {
    title: 'CMS & Landing Page',
    url: '/admin/cms',
    icon: Palette,
  },
  {
    title: 'Kelola Voucher',
    url: '/admin/vouchers',
    icon: Ticket,
  },
  {
    title: 'Daftar Transaksi',
    url: '/admin/transactions',
    icon: CreditCard,
  },
  {
    title: 'Kelola Pengguna',
    url: '/admin/users',
    icon: Users,
  },
  {
    title: 'Penerbitan Sertifikat',
    url: '/admin/certificates',
    icon: Award,
  },
  {
    title: 'Gateway Pembayaran',
    url: '/admin/settings/payment',
    icon: Settings,
  },
];

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [user, setUser] = React.useState({
    name: 'Administrator',
    email: 'admin@alphakids.id',
    avatar: '/assets/img/Simbol Tutor AlphaKids_revisi0.png',
  });

  React.useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setUser({
            name:
              (data.user.user_metadata?.name as string) ||
              (data.user.user_metadata?.full_name as string) ||
              'Admin Alpha Kids',
            email: data.user.email || 'admin@alphakids.id',
            avatar: '/assets/img/Simbol Tutor AlphaKids_revisi0.png',
          });
        }
      });
    });
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* 1. Header with prominent "Alpha Kids Admin" Marker */}
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-amber-500/10 border border-amber-500/25">
              <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-amber-500 text-white p-1 shadow-sm">
                <Image
                  src="/assets/img/Simbol Piala AlphaKids_revisi0.png"
                  alt="Alpha Kids Logo"
                  width={26}
                  height={26}
                  className="object-contain"
                />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-extrabold text-sm font-heading tracking-tight text-slate-900 dark:text-white">
                    Alpha Kids
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-500 text-white px-1.5 py-0.2 rounded-md shadow-xs">
                    ADMIN
                  </span>
                </div>
                <span className="truncate text-[10px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  Management Center
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* 2. Admin Dedicated Navigation Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3">
            Menu Manajemen
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-0.5 px-2">
            {adminMenuItems.map((item) => {
              const isActive =
                item.url === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.url);

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className={`rounded-xl text-xs font-semibold transition-all h-9 ${
                      isActive
                        ? 'bg-amber-500 text-white hover:bg-amber-600 hover:text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-2.5">
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Quick Switch to User / Member View */}
        <SidebarGroup className="mt-auto border-t border-sidebar-border pt-3">
          <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3">
            Sisi Peserta
          </SidebarGroupLabel>
          <SidebarMenu className="px-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 h-9"
              >
                <Link href="/dashboard" className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-2.5 font-medium">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Lihat Sisi Peserta</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* 3. Admin Profile Footer */}
      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
