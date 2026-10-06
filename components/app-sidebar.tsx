'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Award,
  BookOpen,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  User,
  ArrowRight,
} from 'lucide-react';

import { NavUser } from '@/components/nav-user';
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

const memberNavigation = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Program Saya',
    url: '/dashboard/programs',
    icon: GraduationCap,
  },
  {
    title: 'Katalog Program',
    url: '/programs',
    icon: BookOpen,
  },
  {
    title: 'Riwayat Transaksi',
    url: '/dashboard/transactions',
    icon: CreditCard,
  },
  {
    title: 'Sertifikat',
    url: '/dashboard/certificates',
    icon: Award,
  },
  {
    title: 'Profil Saya',
    url: '/dashboard/profile',
    icon: User,
  },
];

const sampleUser = {
  name: 'Peserta Alpha Kids',
  email: 'peserta@alphakids.id',
  avatar: '/assets/img/Simbol Tutor AlphaKids_revisi0.png',
};

export function AppSidebar({
  user: userProp,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: { name: string; email: string; avatar?: string };
}) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [user, setUser] = React.useState({
    name: userProp?.name || sampleUser.name,
    email: userProp?.email || sampleUser.email,
    avatar: userProp?.avatar || sampleUser.avatar,
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
              data.user.email?.split('@')[0] ||
              'Peserta',
            email: data.user.email || '',
            avatar: '/assets/img/Simbol Tutor AlphaKids_revisi0.png',
          });

          // Check if admin
          supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single()
            .then(({ data: profileData }) => {
              if ((profileData as { role?: string } | null)?.role === 'admin') {
                setIsAdmin(true);
              }
            });
        }
      });
    });
  }, [userProp]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary/20 text-primary p-1 border border-primary/30">
                  <Image
                    src="/assets/img/Simbol Piala AlphaKids_revisi0.png"
                    alt="Alpha Kids Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-bold text-base font-heading tracking-tight text-foreground flex items-center gap-1.5">
                    Alpha Kids
                    <Sparkles className="size-3.5 text-primary fill-primary" />
                  </span>
                  <span className="truncate text-xs text-muted-foreground font-medium">
                    Program Platform
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-0.5 px-2">
            {memberNavigation.map((item) => {
              const isActive =
                item.url === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.url);

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className={`rounded-xl text-xs font-semibold transition-all h-9 ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* If user is admin, show a discrete button to switch to Admin Center */}
        {isAdmin && (
          <SidebarGroup className="mt-auto border-t border-sidebar-border pt-3">
            <SidebarMenu className="px-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="rounded-xl text-xs bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold border border-amber-200/60 h-9"
                >
                  <Link href="/admin" className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Buka Panel Admin</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
