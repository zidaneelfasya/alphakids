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
  User,
  ArrowRight,
  PanelLeftClose,
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
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from '@/components/ui/sidebar';
import { getDicebearMoodsAvatar } from '@/lib/avatar';

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
};

export function AppSidebar({
  user: userProp,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: { name: string; email: string; avatar?: string };
}) {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const [isAdmin, setIsAdmin] = React.useState(false);
  const [user, setUser] = React.useState({
    name: userProp?.name || sampleUser.name,
    email: userProp?.email || sampleUser.email,
    avatar:
      userProp?.avatar ||
      getDicebearMoodsAvatar(userProp?.email || userProp?.name || sampleUser.name),
  });

  React.useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          const userName =
            (data.user.user_metadata?.full_name as string) ||
            (data.user.user_metadata?.name as string) ||
            data.user.email?.split('@')[0] ||
            'Peserta';
          const userEmail = data.user.email || '';
          const customAvatar = data.user.user_metadata?.avatar_url as string | undefined;

          setUser({
            name: userName,
            email: userEmail,
            avatar:
              customAvatar && !customAvatar.includes('Simbol Tutor')
                ? customAvatar
                : getDicebearMoodsAvatar(userEmail || userName),
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

  const handleSidebarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCollapsed) return;

    const target = e.target as HTMLElement;

    // If clicked on or inside an interactive menu link, admin link, or user dropdown:
    // let that element handle its action and do NOT expand the sidebar.
    if (
      target.closest('a, [data-slot="sidebar-nav-item"], [data-slot="user-avatar-trigger"], [role="menuitem"], [role="button"]')
    ) {
      return;
    }

    // Otherwise, user clicked on empty space / sidebar background / padding -> expand sidebar!
    toggleSidebar();
  };

  return (
    <Sidebar
      collapsible="icon"
      onClick={handleSidebarClick}
      className={`border-r-0 [&_[data-sidebar=sidebar]]:!bg-[#21b1db] [&_[data-sidebar=sidebar]]:!text-white [&_[data-sidebar=sidebar]]:border-r-0 [&_[data-slot=sidebar-container]]:border-r-0 ${
        isCollapsed ? 'cursor-pointer select-none' : ''
      }`}
      title={isCollapsed ? 'Klik di luar item untuk membuka menu sidebar' : undefined}
      {...props}
    >
      {/* =================================================================== */}
      {/* SIDEBAR HEADER                                                      */}
      {/* Expanded: Logo + Brand Name on left, Internal Collapse on right     */}
      {/* Collapsed: Centered logo card (Clicking expands sidebar)           */}
      {/* =================================================================== */}
      <SidebarHeader className={`border-b border-white/15 ${isCollapsed ? 'p-3 flex justify-center items-center' : 'p-3'}`}>
        {isCollapsed ? (
          /* Collapsed State: Logo button only (clicking opens sidebar) */
          <div className="flex justify-center items-center py-1">
            <button
              type="button"
              data-slot="sidebar-logo-btn"
              onClick={toggleSidebar}
              className="size-12 rounded-2xl bg-white hover:bg-white/95 active:scale-95 flex items-center justify-center p-2 transition-all cursor-pointer shadow-md shadow-black/10 group"
              title="Buka menu sidebar"
              aria-label="Buka menu sidebar"
            >
              <Image
                src="/assets/img/logo.png"
                alt="Alpha Kids Logo"
                width={36}
                height={36}
                className="size-8 object-contain transition-transform group-hover:scale-105"
                priority
              />
            </button>
          </div>
        ) : (
          /* Expanded State: Logo + Title + Internal Close Button */
          <div className="flex items-center justify-between w-full px-1">
            <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
              <div className="size-10 rounded-2xl bg-white flex items-center justify-center p-1.5 shrink-0 shadow-sm">
                <Image
                  src="/assets/img/logo.png"
                  alt="Alpha Kids Logo"
                  width={32}
                  height={32}
                  className="size-7 object-contain"
                  priority
                />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold text-base font-sans tracking-tight text-white">
                  Alpha Kids
                </span>
                <span className="truncate text-[11px] text-white/75 font-normal">
                  Program Platform
                </span>
              </div>
            </Link>

            {/* Internal Collapse Button (Disappears when collapsed) */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="size-8 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
              title="Tutup menu sidebar"
              aria-label="Tutup menu sidebar"
            >
              <PanelLeftClose className="size-4.5" />
            </button>
          </div>
        )}
      </SidebarHeader>

      {/* =================================================================== */}
      {/* SIDEBAR NAVIGATION ITEMS                                            */}
      {/* Expanded: White Capsule Pill for Active, White Outline for Inactive */}
      {/* Collapsed: Centered size-12 Card for Active, Centered White Icons   */}
      {/* =================================================================== */}
      <SidebarContent className={`py-3 ${isCollapsed ? 'px-0' : 'px-1'}`}>
        <SidebarGroup className={isCollapsed ? 'p-0 flex flex-col items-center' : ''}>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase font-semibold tracking-wider text-white/60 px-3.5 mb-1">
              Menu Utama
            </SidebarGroupLabel>
          )}

          <SidebarMenu className={isCollapsed ? 'space-y-2.5 px-0 flex flex-col items-center w-full' : 'space-y-1 px-2'}>
            {memberNavigation.map((item) => {
              const isActive =
                item.url === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.url);

              return (
                <SidebarMenuItem key={item.url} className={isCollapsed ? 'flex justify-center w-full' : ''}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    data-slot="sidebar-nav-item"
                    className={`transition-all ${
                      isCollapsed
                        ? `!size-12 !min-w-12 !min-h-12 !rounded-2xl !p-0 justify-center mx-auto ${
                            isActive
                              ? '!bg-white !text-[#21b1db] shadow-md shadow-black/10 font-semibold'
                              : '!text-white/85 hover:!text-white hover:!bg-white/15'
                          }`
                        : `rounded-2xl text-xs sm:text-sm font-semibold h-10 px-3.5 ${
                            isActive
                              ? '!bg-white !text-[#21b1db] shadow-md font-semibold'
                              : '!text-white/85 hover:!text-white hover:!bg-white/12 font-medium'
                          }`
                    }`}
                  >
                    <Link
                      href={item.url}
                      onClick={(e) => {
                        if (isCollapsed) {
                          e.stopPropagation();
                        }
                      }}
                      className={`flex items-center ${
                        isCollapsed ? 'justify-center size-full' : 'gap-3 w-full'
                      }`}
                    >
                      <item.icon
                        className={`${
                          isCollapsed ? '!size-6 shrink-0' : 'size-4.5 shrink-0'
                        } ${isActive ? 'text-[#21b1db]' : 'text-white'}`}
                      />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* If user is admin, show a discrete button to switch to Admin Center */}
        {isAdmin && (
          <SidebarGroup className="mt-auto border-t border-white/15 pt-3">
            <SidebarMenu className={isCollapsed ? 'px-0 flex flex-col items-center w-full' : 'px-2'}>
              <SidebarMenuItem className={isCollapsed ? 'flex justify-center w-full' : ''}>
                <SidebarMenuButton
                  asChild
                  tooltip="Buka Panel Admin"
                  data-slot="sidebar-nav-item"
                  className={`rounded-2xl text-xs bg-white/15 text-white hover:bg-white/25 font-semibold border border-white/20 ${
                    isCollapsed ? '!size-12 !min-w-12 !min-h-12 justify-center !p-0 mx-auto' : 'h-10 px-3.5'
                  }`}
                >
                  <Link
                    href="/admin"
                    onClick={(e) => {
                      if (isCollapsed) e.stopPropagation();
                    }}
                    className={`flex items-center ${
                      isCollapsed ? 'justify-center size-full' : 'justify-between w-full'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className={isCollapsed ? '!size-6 text-white' : 'size-4.5 text-white'} />
                      {!isCollapsed && <span>Panel Admin</span>}
                    </span>
                    {!isCollapsed && <ArrowRight className="size-3.5 text-white/80" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* =================================================================== */}
      {/* SIDEBAR FOOTER (USER PROFILE & QUICK ACTIONS)                       */}
      {/* =================================================================== */}
      <SidebarFooter className={`border-t border-white/15 ${isCollapsed ? 'p-2 flex justify-center items-center' : 'p-2'}`}>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
