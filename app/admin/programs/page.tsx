import { requireAdmin } from '@/lib/auth/guards';
import { db, programs, categories } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { AdminShell } from '@/components/admin/admin-shell';
import { ProgramsManager } from '@/components/admin/programs-manager';

export const metadata = {
  title: 'Kelola Program — Admin Alpha Kids',
  description: 'Kelola seluruh program bimbingan dan kelas intensif Alpha Kids.',
};

export const dynamic = 'force-dynamic';

export default async function AdminProgramsPage() {
  await requireAdmin('/dashboard');

  // Fetch programs with categories
  const programList = await db
    .select({
      id: programs.id,
      title: programs.title,
      slug: programs.slug,
      description: programs.description,
      price: programs.price,
      ageRange: programs.ageRange,
      level: programs.level,
      coverImage: programs.coverImage,
      categoryId: programs.categoryId,
      categoryName: categories.name,
      isActive: programs.isActive,
      createdAt: programs.createdAt,
    })
    .from(programs)
    .leftJoin(categories, eq(programs.categoryId, categories.id))
    .orderBy(desc(programs.createdAt));

  // Fetch category options for select
  const categoryOptions = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.name);

  return (
    <AdminShell
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Kelola Program' },
      ]}
    >
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">
            Kelola Program Pelatihan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tambah, sunting, dan atur kurikulum serta materi kelas untuk setiap program.
          </p>
        </div>

        <ProgramsManager programs={programList} categories={categoryOptions} />
      </div>
    </AdminShell>
  );
}
