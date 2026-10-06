import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/guards';
import { db, programs, programContents } from '@/lib/db';
import { eq, asc } from 'drizzle-orm';
import { AdminShell } from '@/components/admin/admin-shell';
import { ProgramContentsManager } from '@/components/admin/program-contents-manager';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function AdminProgramContentsPage({ params }: PageProps) {
  await requireAdmin('/admin/programs');
  const { id } = await params;

  const [prog] = await db
    .select()
    .from(programs)
    .where(eq(programs.id, id));

  if (!prog) {
    notFound();
  }

  const contents = await db
    .select()
    .from(programContents)
    .where(eq(programContents.programId, id))
    .orderBy(asc(programContents.sortOrder));

  return (
    <AdminShell
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Kelola Program', href: '/admin/programs' },
        { label: 'Konten & Link' },
      ]}
    >
      <div className="max-w-5xl mx-auto">
        <ProgramContentsManager
          programId={prog.id}
          programTitle={prog.title}
          contents={contents}
        />
      </div>
    </AdminShell>
  );
}
