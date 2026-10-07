import { requireAdmin } from '@/lib/auth/guards';
import { getAllCmsData } from '@/lib/cms';
import { AdminShell } from '@/components/admin/admin-shell';
import { CmsManager } from '@/components/admin/cms-manager';

export const metadata = {
  title: 'CMS & Landing Page — Admin Alpha Kids',
  description: 'Kelola konten publik, hero, fitur unggulan, mentor, dan FAQ platform Alpha Kids.',
};

export const dynamic = 'force-dynamic';

export default async function AdminCmsPage() {
  await requireAdmin('/admin/cms');

  const cmsData = await getAllCmsData();

  return (
    <AdminShell
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'CMS & Landing Page' },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <CmsManager initialData={cmsData} />
      </div>
    </AdminShell>
  );
}
