import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ThemeSwitcher } from '@/components/theme-switcher';

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbSegment[];
}

export function DashboardShell({
  children,
  breadcrumbs = [{ label: 'Dashboard', href: '/dashboard' }],
}: DashboardShellProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "5.25rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="bg-[#FFFDF9] dark:bg-slate-950 min-h-screen">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200/70 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 lg:px-6 sticky top-0 z-10">
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
                    <span key={crumb.label} className="inline-flex items-center gap-1.5">
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
