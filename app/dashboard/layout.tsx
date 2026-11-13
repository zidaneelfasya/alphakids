import * as React from 'react';
import { requireAuth } from '@/lib/auth/guards';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { BreadcrumbTitleProvider } from '@/components/breadcrumb-title-context';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth('/auth/login');

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
        <AppSidebar />
        <SidebarInset className="bg-[#FFFDF9] dark:bg-slate-950 min-h-screen">
          <DashboardHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </BreadcrumbTitleProvider>
  );
}
