import { requireAdmin } from '@/lib/auth/guards';
import { db, categories } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { AdminShell } from '@/components/admin/admin-shell';
import { CategoriesManager } from '@/components/admin/categories-manager';

export const metadata = {
  title: 'Kelola Kategori — Admin Alpha Kids',
  description: 'Kelola kategori program bimbingan dan pelatihan Alpha Kids.',
};

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  await requireAdmin('/dashboard');

  const categoryList = await db
    .select()
    .from(categories)
    .orderBy(desc(categories.createdAt));

  return (
    <AdminShell
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Kelola Kategori' },
      ]}
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">
            Kelola Kategori Program
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Atur taksonomi dan pengelompokan program untuk memudahkan eksplorasi wali murid di katalog.
          </p>
        </div>

        <CategoriesManager categories={categoryList} />
      </div>
    </AdminShell>
  );
}
