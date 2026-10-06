import Link from 'next/link';
import { requireAuth } from '@/lib/auth/guards';
import { db, orders, orderItems, programs, payments } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { formatRupiah } from '@/lib/utils';
import { CheckCircle2, Clock, XCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
  const { user } = await requireAuth('/dashboard/transactions');

  // Fetch user orders with order items, programs, and payments via Drizzle
  const transactionList = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      subtotal: orders.subtotal,
      discountTotal: orders.discountTotal,
      total: orders.total,
      createdAt: orders.createdAt,
      programTitle: programs.title,
      programSlug: programs.slug,
      paymentProvider: payments.provider,
      paymentStatus: payments.status,
      paymentMethod: payments.paymentMethod,
      paidAt: payments.paidAt,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .leftJoin(programs, eq(orderItems.programId, programs.id))
    .leftJoin(payments, eq(payments.orderId, orders.id))
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt));

  return (
    <DashboardShell
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Riwayat Transaksi' },
      ]}
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">
            Riwayat Transaksi & Pembayaran
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Daftar seluruh pesanan program Alpha Kids beserta status verifikasi pembayaran Anda.
          </p>
        </div>

        {transactionList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-sm my-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2 font-heading">
              Belum Ada Riwayat Transaksi
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Anda belum pernah melakukan pemesanan program di Alpha Kids.
            </p>
            <Button asChild className="bg-amber-500 hover:bg-amber-600 font-bold text-white shadow-md shadow-amber-500/20">
              <Link href="/programs">Pilih Program Sekarang</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {transactionList.map((order) => {
              let statusBadge = (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                  <Clock className="w-3.5 h-3.5" />
                  Menunggu Pembayaran
                </span>
              );

              if (order.status === 'paid') {
                statusBadge = (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Lunas
                  </span>
                );
              } else if (order.status === 'failed') {
                statusBadge = (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-800">
                    <XCircle className="w-3.5 h-3.5" />
                    Gagal
                  </span>
                );
              } else if (order.status === 'expired') {
                statusBadge = (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    <Clock className="w-3.5 h-3.5" />
                    Kedaluwarsa
                  </span>
                );
              }

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {order.orderNumber}
                      </span>
                      {statusBadge}
                      {order.paymentProvider && (
                        <span className="text-[11px] font-semibold text-slate-400">
                          via {order.paymentProvider}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">
                      {order.programTitle || 'Program Alpha Kids'}
                    </h3>

                    <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                      <span>
                        Tanggal:{' '}
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {order.discountTotal > 0 && (
                        <span className="text-emerald-600 font-medium">
                          Diskon: {formatRupiah(order.discountTotal)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-3">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 block">Total Bayar</span>
                      <span className="font-extrabold text-slate-900 text-lg">
                        {formatRupiah(order.total)}
                      </span>
                    </div>

                    {order.status === 'paid' && order.programSlug && (
                      <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800 text-white text-xs rounded-xl font-semibold">
                        <Link href={`/dashboard/programs/${order.programSlug}`}>
                          <span>Buka Ruang Kelas</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </Button>
                    )}

                    {order.status === 'pending' && order.programSlug && (
                      <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-xl font-semibold shadow-sm">
                        <Link href={`/checkout/${order.programSlug}`}>
                          <span>Lanjutkan Bayar</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
