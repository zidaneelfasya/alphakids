import * as React from 'react';
import { requireAdmin } from '@/lib/auth/guards';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { BreadcrumbTitleProvider } from '@/components/breadcrumb-title-context';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin('/admin');

  return (
    <BreadcrumbTitleProvider>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '16rem',
            '--sidebar-width-icon': '5.25rem',
          } as React.CSSProperties
        }
      >
        <AdminSidebar />
        <SidebarInset className="bg-[#FFFDF9] dark:bg-slate-950 min-h-screen">
          <AdminHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </BreadcrumbTitleProvider>
  );
}
