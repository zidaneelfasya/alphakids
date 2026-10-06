import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';
import {
  db,
  orders,
  programs,
  programAccess,
  profiles,
} from '@/lib/db';
import { eq, desc, sql, count } from 'drizzle-orm';
import { AdminShell } from '@/components/admin/admin-shell';
import {
  DollarSign,
  GraduationCap,
  Users,
  BookOpen,
  ArrowRight,
  Settings,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await requireAdmin('/admin');

  // 1. Metric: Total Revenue (from paid orders)
  const [revenueResult] = await db
    .select({
      totalRevenue: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
      paidOrdersCount: count(),
    })
    .from(orders)
    .where(eq(orders.status, 'paid'));

  const totalRevenue = revenueResult?.totalRevenue || 0;
  const paidOrdersCount = revenueResult?.paidOrdersCount || 0;

  // 2. Metric: Total Active Enrollments
  const [activeEnrollmentsResult] = await db
    .select({ count: count() })
    .from(programAccess)
    .where(eq(programAccess.status, 'active'));

  const activeEnrollmentsCount = activeEnrollmentsResult?.count || 0;

  // 3. Metric: Total Users
  const [usersResult] = await db.select({ count: count() }).from(profiles);
  const totalUsersCount = usersResult?.count || 0;

  // 4. Metric: Total Programs
  const [programsResult] = await db
    .select({ count: count() })
    .from(programs)
    .where(eq(programs.isActive, true));

  const totalProgramsCount = programsResult?.count || 0;

  // 5. Recent 5 Orders
  const recentOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    limit: 5,
    with: {
      user: true,
      orderItems: {
        with: {
          program: true,
        },
      },
      payments: true,
    },
  });

  return (
    <AdminShell breadcrumbs={[{ label: 'Admin', href: '/admin' }]}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-300/60 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              Alpha Kids Admin Center
            </div>
            <h1 className="text-2xl font-bold font-heading text-slate-900">
              Ringkasan Operasional Platform
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pantau performa penjualan program, status peserta, dan aktivitas transaksi terbaru.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="text-xs rounded-xl">
              <Link href="/admin/settings/payment">
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Gateway Pembayaran
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl">
              <Link href="/admin/programs">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Kelola Program
              </Link>
            </Button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Pendapatan
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Dari {paidOrdersCount} pesanan lunas
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Akses Program Aktif
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900">
              {activeEnrollmentsCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Siswa aktif mengikuti program
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Akun Terdaftar
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900">
              {totalUsersCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Total pengguna di sistem
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Program Aktif
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900">
              {totalProgramsCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Tayang di katalog publik
            </span>
          </div>
        </div>

        {/* Quick Operations Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/programs"
            className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/20 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-slate-900 block">Program Kelas</span>
              <span className="text-[11px] text-slate-400">Atur silabus & harga</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            href="/admin/categories"
            className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/20 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-slate-900 block">Kategori Program</span>
              <span className="text-[11px] text-slate-400">Klasifikasi minat anak</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            href="/admin/vouchers"
            className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/20 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-slate-900 block">Kode Promo / Voucher</span>
              <span className="text-[11px] text-slate-400">Atur diskon belanja</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            href="/admin/settings/payment"
            className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/20 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-slate-900 block">Payment Gateway</span>
              <span className="text-[11px] text-slate-400">Midtrans & Mayar</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-heading text-slate-900">
                Aktivitas Transaksi Terbaru
              </h2>
              <p className="text-xs text-slate-500">
                5 transaksi terakhir yang tercatat di platform.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-amber-700 hover:text-amber-800">
              <Link href="/admin/transactions">
                <span>Lihat Semua Transaksi</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3">No. Pesanan</th>
                  <th className="py-2.5 px-3">Peserta</th>
                  <th className="py-2.5 px-3">Program</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      Belum ada transaksi di platform.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {o.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 block line-clamp-1">
                          {o.user.fullName || 'Tanpa Nama'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {o.user.email || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 max-w-[200px] truncate">
                        {o.orderItems?.[0]?.program?.title || '-'}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 font-mono">
                        Rp {o.total.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3">
                        {o.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Lunas
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 capitalize">
                            {o.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 font-mono text-[11px]">
                        {new Date(o.createdAt).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
