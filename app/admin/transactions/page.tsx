import { requireAdmin } from '@/lib/auth/guards';
import { db, orders } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { AdminShell } from '@/components/admin/admin-shell';
import {
  TransactionsManager,
  AdminOrderItem,
} from '@/components/admin/transactions-manager';

export const dynamic = 'force-dynamic';

export default async function AdminTransactionsPage() {
  await requireAdmin('/admin/transactions');

  const rawOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    with: {
      user: true,
      orderItems: {
        with: {
          program: true,
        },
      },
      payments: true,
      voucher: true,
    },
  });

  const formattedOrders: AdminOrderItem[] = rawOrders.map((o) => {
    const programTitle =
      o.orderItems?.[0]?.program?.title || 'Program Tidak Diketahui';
    const latestPayment = o.payments?.[0] || null;

    return {
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status as AdminOrderItem['status'],
      subtotal: o.subtotal,
      discountTotal: o.discountTotal,
      total: o.total,
      createdAt: o.createdAt,
      user: {
        id: o.user.id,
        fullName: o.user.fullName,
        email: o.user.email,
      },
      programTitle,
      payment: latestPayment
        ? {
            provider: latestPayment.provider,
            providerTransactionId: latestPayment.providerTransactionId,
            paymentMethod: latestPayment.paymentMethod,
            status: latestPayment.status,
            paidAt: latestPayment.paidAt,
          }
        : null,
      voucherCode: o.voucher?.code || null,
    };
  });

  return (
    <AdminShell
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Daftar Transaksi' },
      ]}
    >
      <div className="max-w-6xl mx-auto">
        <TransactionsManager orders={formattedOrders} />
      </div>
    </AdminShell>
  );
}
