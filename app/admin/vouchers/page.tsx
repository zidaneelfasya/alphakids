import { requireAdmin } from '@/lib/auth/guards';
import { db, vouchers } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { AdminShell } from '@/components/admin/admin-shell';
import { VouchersManager } from '@/components/admin/vouchers-manager';

export const dynamic = 'force-dynamic';

export default async function AdminVouchersPage() {
  await requireAdmin('/admin/vouchers');

  const allVouchers = await db
    .select()
    .from(vouchers)
    .orderBy(desc(vouchers.createdAt));

  return (
    <AdminShell
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Kelola Voucher' },
      ]}
    >
      <div className="max-w-5xl mx-auto">
        <VouchersManager vouchers={allVouchers} />
      </div>
    </AdminShell>
  );
}
