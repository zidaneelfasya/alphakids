import { requireAdmin } from '@/lib/auth/guards';
import { getCmsSection, DEFAULT_BLOGS, BlogSectionContent } from '@/lib/cms';
import { AdminShell } from '@/components/admin/admin-shell';
import { BlogsManager } from '@/components/admin/blogs-manager';

export const metadata = {
  title: 'Kelola Artikel & Blog — Admin Alpha Kids',
  description: 'Tulis, kelola, dan terbitkan artikel edukasi digital untuk anak dan orang tua.',
};

export const dynamic = 'force-dynamic';

export default async function AdminBlogsPage() {
  await requireAdmin('/admin/blogs');

  const blogData = await getCmsSection<BlogSectionContent>('blogs', DEFAULT_BLOGS);

  return (
    <AdminShell
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Kelola Artikel & Blog' },
      ]}
    >
      <div className="max-w-7xl 2xl:max-w-[1700px] mx-auto space-y-6">
        <BlogsManager initialItems={blogData.items || []} />
      </div>
    </AdminShell>
  );
}
