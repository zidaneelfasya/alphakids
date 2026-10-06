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
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#21b1db] bg-[#E8F8FA] dark:bg-cyan-950/60 px-3 py-1 rounded-full mb-2">
              <ShieldCheck className="size-3.5 text-[#21b1db]" />
              Alpha Kids Management Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold font-sans text-slate-900 dark:text-white">
              Ringkasan Operasional Platform
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
              Pantau performa penjualan program, status peserta, dan aktivitas transaksi terbaru.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button asChild size="sm" variant="outline" className="text-xs rounded-full font-semibold">
              <Link href="/admin/settings/payment">
                <Settings className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                Gateway Pembayaran
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-[#21b1db] hover:bg-[#1da0c7] text-white font-semibold text-xs rounded-full shadow-md shadow-[#21b1db]/20">
              <Link href="/admin/programs">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Kelola Program
              </Link>
            </Button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Pendapatan
              </span>
              <div className="size-10 rounded-2xl bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db] flex items-center justify-center">
                <DollarSign className="size-5 stroke-[1.8]" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold font-sans text-slate-900 dark:text-white">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </div>
              <span className="text-[11px] text-[#21b1db] font-medium mt-1 block">
                Dari {paidOrdersCount} pesanan lunas
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Akses Aktif
              </span>
              <div className="size-10 rounded-2xl bg-[#FDF0F5] dark:bg-pink-950/60 text-[#ef599a] flex items-center justify-center">
                <GraduationCap className="size-5 stroke-[1.8]" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold font-sans text-slate-900 dark:text-white">
                {activeEnrollmentsCount}
              </div>
              <span className="text-[11px] text-[#ef599a] font-medium mt-1 block">
                Siswa aktif di ruang kelas
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Akun Terdaftar
              </span>
              <div className="size-10 rounded-2xl bg-[#FEF9C3] dark:bg-amber-950/60 text-amber-700 dark:text-[#FFCC07] flex items-center justify-center">
                <Users className="size-5 stroke-[1.8]" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold font-sans text-slate-900 dark:text-white">
                {totalUsersCount}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
                Pengguna terdaftar platform
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Program Publik
              </span>
              <div className="size-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <BookOpen className="size-5 stroke-[1.8]" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold font-sans text-slate-900 dark:text-white">
                {totalProgramsCount}
              </div>
              <span className="text-[11px] text-slate-400 font-normal mt-1 block">
                Tayang di katalog publik
              </span>
            </div>
          </div>
        </div>

        {/* Quick Operations Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/programs"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#21b1db]/40 hover:bg-[#E8F8FA]/20 dark:hover:bg-cyan-950/20 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">Program Kelas</span>
              <span className="text-[11px] text-slate-400 font-normal">Atur silabus & harga</span>
            </div>
            <ArrowRight className="size-4 text-slate-400" />
          </Link>

          <Link
            href="/admin/categories"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#21b1db]/40 hover:bg-[#E8F8FA]/20 dark:hover:bg-cyan-950/20 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">Kategori Program</span>
              <span className="text-[11px] text-slate-400 font-normal">Klasifikasi minat anak</span>
            </div>
            <ArrowRight className="size-4 text-slate-400" />
          </Link>

          <Link
            href="/admin/vouchers"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#21b1db]/40 hover:bg-[#E8F8FA]/20 dark:hover:bg-cyan-950/20 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">Kode Promo / Voucher</span>
              <span className="text-[11px] text-slate-400 font-normal">Atur diskon belanja</span>
            </div>
            <ArrowRight className="size-4 text-slate-400" />
          </Link>

          <Link
            href="/admin/settings/payment"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#21b1db]/40 hover:bg-[#E8F8FA]/20 dark:hover:bg-cyan-950/20 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">Payment Gateway</span>
              <span className="text-[11px] text-slate-400 font-normal">Midtrans & Mayar</span>
            </div>
            <ArrowRight className="size-4 text-slate-400" />
          </Link>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold font-sans text-slate-900 dark:text-white">
                Aktivitas Transaksi Terbaru
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                5 transaksi terakhir yang tercatat di platform.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-[#21b1db] hover:text-[#1da0c7] hover:bg-[#E8F8FA] dark:hover:bg-cyan-950/40 rounded-full">
              <Link href="/admin/transactions" className="flex items-center gap-1.5">
                <span>Lihat Semua</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">No. Pesanan</th>
                  <th className="py-2.5 px-3">Peserta</th>
                  <th className="py-2.5 px-3">Program</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-normal">
                      Belum ada transaksi di platform.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                        {o.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 dark:text-white block line-clamp-1">
                          {o.user.fullName || 'Tanpa Nama'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {o.user.email || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                        {o.orderItems?.[0]?.program?.title || '-'}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white font-mono">
                        Rp {o.total.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3">
                        {o.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            Lunas
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-[#FEF9C3] dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full capitalize">
                            {o.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 dark:text-slate-400 font-mono text-[11px]">
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
