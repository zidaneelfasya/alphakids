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
  Sparkles,
  ArrowRight,
  PanelLeftClose,
} from 'lucide-react';
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
import { NavUser } from '@/components/nav-user';
import { getDicebearMoodsAvatar } from '@/lib/avatar';

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
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const [user, setUser] = React.useState({
    name: 'Administrator',
    email: 'admin@alphakids.id',
    avatar: getDicebearMoodsAvatar('admin@alphakids.id'),
  });

  React.useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          const userName =
            (data.user.user_metadata?.name as string) ||
            (data.user.user_metadata?.full_name as string) ||
            'Admin Alpha Kids';
          const userEmail = data.user.email || 'admin@alphakids.id';
          const customAvatar = data.user.user_metadata?.avatar_url as string | undefined;

          setUser({
            name: userName,
            email: userEmail,
            avatar:
              customAvatar && !customAvatar.includes('Simbol Tutor')
                ? customAvatar
                : getDicebearMoodsAvatar(userEmail),
          });
        }
      });
    });
  }, []);

  const handleSidebarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCollapsed) return;

    const target = e.target as HTMLElement;

    // If clicked on or inside an interactive menu link, user trigger, or dropdown:
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
      {/* 1. SIDEBAR HEADER                                                   */}
      {/* Expanded: Logo + Alpha Kids Admin + Internal Close Button          */}
      {/* Collapsed: Centered Logo Card (Clicking opens sidebar)             */}
      {/* =================================================================== */}
      <SidebarHeader className={`${isCollapsed ? 'p-3 flex justify-center items-center' : 'p-3'}`}>
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
          /* Expanded State: Logo + Title + Admin Badge + Internal Close Button */
          <div className="flex items-center justify-between w-full px-1">
            <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
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
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-semibold text-base font-sans tracking-tight text-white">
                    Alpha Kids
                  </span>
                  <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">
                    ADMIN
                  </span>
                </div>
                <span className="truncate text-[11px] text-white/75 font-normal">
                  Pusat Manajemen
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
      {/* 2. ADMIN NAVIGATION ITEMS                                           */}
      {/* Expanded: White Capsule Pill for Active, White Outline for Inactive */}
      {/* Collapsed: Centered size-12 Card for Active, Centered White Icons   */}
      {/* =================================================================== */}
      <SidebarContent className={`py-3 ${isCollapsed ? 'px-0' : 'px-1'}`}>
        <SidebarGroup className={isCollapsed ? 'p-0 flex flex-col items-center' : ''}>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase font-semibold tracking-wider text-white/60 px-3.5 mb-1">
              Menu Manajemen
            </SidebarGroupLabel>
          )}

          <SidebarMenu className={isCollapsed ? 'space-y-2.5 px-0 flex flex-col items-center w-full' : 'space-y-1 px-2'}>
            {adminMenuItems.map((item) => {
              const isActive =
                item.url === '/admin'
                  ? pathname === '/admin'
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

        {/* Quick Switch to User / Member View */}
        <SidebarGroup className="mt-auto pt-3">
          <SidebarMenu className={isCollapsed ? 'px-0 flex flex-col items-center w-full' : 'px-2'}>
            <SidebarMenuItem className={isCollapsed ? 'flex justify-center w-full' : ''}>
              <SidebarMenuButton
                asChild
                tooltip="Buka Sisi Peserta"
                data-slot="sidebar-nav-item"
                className={`rounded-2xl text-xs bg-white/15 text-white hover:bg-white/25 font-semibold border border-white/20 ${
                  isCollapsed ? '!size-12 !min-w-12 !min-h-12 justify-center !p-0 mx-auto' : 'h-10 px-3.5'
                }`}
              >
                <Link
                  href="/dashboard"
                  onClick={(e) => {
                    if (isCollapsed) e.stopPropagation();
                  }}
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center size-full' : 'justify-between w-full'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className={isCollapsed ? '!size-6 text-white' : 'size-4.5 text-white'} />
                    {!isCollapsed && <span>Sisi Peserta</span>}
                  </span>
                  {!isCollapsed && <ArrowRight className="size-3.5 text-white/80" />}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* =================================================================== */}
      {/* 3. ADMIN PROFILE FOOTER                                             */}
      {/* =================================================================== */}
      <SidebarFooter className={`${isCollapsed ? 'p-2 flex justify-center items-center' : 'p-2'}`}>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

