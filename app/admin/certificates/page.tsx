import { requireAdmin } from '@/lib/auth/guards';
import { db, certificates, programs, profiles } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import { AdminShell } from '@/components/admin/admin-shell';
import {
  CertificatesManager,
  CertificateItem,
} from '@/components/admin/certificates-manager';

export const dynamic = 'force-dynamic';

export default async function AdminCertificatesPage() {
  await requireAdmin('/admin/certificates');

  const allCerts = await db
    .select()
    .from(certificates)
    .orderBy(desc(certificates.issuedAt));

  const allPrograms = await db
    .select({
      id: programs.id,
      title: programs.title,
    })
    .from(programs)
    .where(eq(programs.isActive, true))
    .orderBy(programs.title);

  const allStudents = await db
    .select({
      id: profiles.id,
      fullName: profiles.fullName,
      email: profiles.email,
    })
    .from(profiles)
    .orderBy(profiles.fullName);

  const formattedCerts: CertificateItem[] = allCerts.map((c) => ({
    id: c.id,
    certificateNumber: c.certificateNumber,
    recipientNameSnapshot: c.recipientNameSnapshot,
    recipientEmailSnapshot: c.recipientEmailSnapshot,
    programNameSnapshot: c.programNameSnapshot,
    certificateUrl: c.certificateUrl,
    issuedAt: c.issuedAt,
  }));

  return (
    <AdminShell
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Penerbitan Sertifikat' },
      ]}
    >
      <div className="max-w-5xl mx-auto">
        <CertificatesManager
          certificates={formattedCerts}
          programs={allPrograms}
          students={allStudents}
        />
      </div>
    </AdminShell>
  );
}
