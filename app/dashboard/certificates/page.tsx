import { requireAuth } from '@/lib/auth/guards';
import { db, certificates } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { MemberCertificatesView } from '@/components/dashboard/member-certificates-view';

export const dynamic = 'force-dynamic';

export default async function MemberCertificatesPage() {
  const { user } = await requireAuth('/dashboard/certificates');

  const myCerts = await db
    .select({
      id: certificates.id,
      certificateNumber: certificates.certificateNumber,
      recipientNameSnapshot: certificates.recipientNameSnapshot,
      programNameSnapshot: certificates.programNameSnapshot,
      certificateUrl: certificates.certificateUrl,
      issuedAt: certificates.issuedAt,
    })
    .from(certificates)
    .where(eq(certificates.userId, user.id))
    .orderBy(desc(certificates.issuedAt));

  return (
    <DashboardShell
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Sertifikat' },
      ]}
    >
      <div className="max-w-5xl mx-auto">
        <MemberCertificatesView certificates={myCerts} />
      </div>
    </DashboardShell>
  );
}
