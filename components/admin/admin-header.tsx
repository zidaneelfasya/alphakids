'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useBreadcrumbTitle } from '@/components/breadcrumb-title-context';

export function AdminHeader() {
  const pathname = usePathname();
  const { customTitle } = useBreadcrumbTitle();

  const breadcrumbs = React.useMemo(() => {
    const crumbs: Array<{ label: string; href?: string }> = [
      { label: 'Admin', href: '/admin' },
    ];

    if (pathname === '/admin' || pathname === '/admin/') {
      return [{ label: 'Admin' }];
    }

    if (pathname.startsWith('/admin/programs')) {
      crumbs.push({
        label: 'Kelola Program',
        href: pathname === '/admin/programs' ? undefined : '/admin/programs',
      });
      if (pathname.includes('/contents')) {
        crumbs.push({ label: customTitle || 'Kelola Materi & Kurikulum' });
      }
    } else if (pathname.startsWith('/admin/categories')) {
      crumbs.push({ label: 'Kelola Kategori' });
    } else if (pathname.startsWith('/admin/cms')) {
      crumbs.push({ label: 'CMS & Landing Page' });
    } else if (pathname.startsWith('/admin/blogs')) {
      crumbs.push({ label: 'Kelola Artikel & Blog' });
    } else if (pathname.startsWith('/admin/vouchers')) {
      crumbs.push({ label: 'Kelola Voucher' });
    } else if (pathname.startsWith('/admin/transactions')) {
      crumbs.push({ label: 'Daftar Transaksi' });
    } else if (pathname.startsWith('/admin/users')) {
      crumbs.push({ label: 'Kelola Pengguna' });
    } else if (pathname.startsWith('/admin/certificates')) {
      crumbs.push({ label: 'Penerbitan Sertifikat' });
    } else if (pathname.startsWith('/admin/settings/payment')) {
      crumbs.push({ label: 'Gateway Pembayaran' });
    } else {
      const segments = pathname.replace('/admin', '').split('/').filter(Boolean);
      segments.forEach((seg, idx) => {
        const isLast = idx === segments.length - 1;
        const formatted = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
        crumbs.push({
          label: isLast && customTitle ? customTitle : formatted,
          href: isLast ? undefined : `/admin/${seg}`,
        });
      });
    }

    return crumbs;
  }, [pathname, customTitle]);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200/70 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 lg:px-6 sticky top-0 z-20 shadow-sm shadow-slate-900/[0.04] dark:shadow-black/25">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-slate-700 dark:text-slate-300 md:hidden" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4 md:hidden"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <span key={`${crumb.label}-${idx}`} className="inline-flex items-center gap-1.5">
                  {idx > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                  <BreadcrumbItem className={!isLast ? 'hidden md:block' : ''}>
                    {isLast || !crumb.href ? (
                      <BreadcrumbPage className="font-semibold text-slate-900 dark:text-white">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </span>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
      </div>
    </header>
  );
}
