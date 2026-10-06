import Link from 'next/link';
import { requireAuth } from '@/lib/auth/guards';
import { db, programAccess, orders, programs } from '@/lib/db';
import { eq, and, desc, count } from 'drizzle-orm';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { GraduationCap, CreditCard, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { user, profile } = await requireAuth('/dashboard');

  // 1. Fetch count of active enrollments
  const [enrolledResult] = await db
    .select({ total: count() })
    .from(programAccess)
    .where(and(eq(programAccess.userId, user.id), eq(programAccess.status, 'active')));

  const enrolledCount = enrolledResult?.total || 0;

  // 2. Fetch count of orders
  const [ordersResult] = await db
    .select({ total: count() })
    .from(orders)
    .where(eq(orders.userId, user.id));

  const ordersCount = ordersResult?.total || 0;

  // 3. Fetch up to 2 recent active programs
  const recentEnrollments = await db
    .select({
      id: programAccess.id,
      grantedAt: programAccess.grantedAt,
      programId: programs.id,
      title: programs.title,
      slug: programs.slug,
      ageRange: programs.ageRange,
      level: programs.level,
    })
    .from(programAccess)
    .innerJoin(programs, eq(programAccess.programId, programs.id))
    .where(and(eq(programAccess.userId, user.id), eq(programAccess.status, 'active')))
    .orderBy(desc(programAccess.grantedAt))
    .limit(2);

  return (
    <DashboardShell breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Selamat Datang di Alpha Kids
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Halo, {profile?.full_name || user.email?.split('@')[0] || 'Peserta'}! 👋
            </h1>
            <p className="text-sm text-amber-50 mt-2 leading-relaxed">
              Mulai jelajahi materi pembelajaran seru si kecil atau temukan program pelatihan digital terbaru untuk mendukung tumbuh kembangnya.
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Program Aktif</span>
              <span className="text-2xl font-extrabold text-slate-900 font-heading">
                {enrolledCount}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Total Pesanan</span>
              <span className="text-2xl font-extrabold text-slate-900 font-heading">
                {ordersCount}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Status Akun</span>
              <span className="text-sm font-bold text-emerald-700 capitalize">
                Terverifikasi
              </span>
            </div>
          </div>
        </div>

        {/* Recent Enrolled Programs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-slate-900">
              Program Belajar Terbaru
            </h2>
            <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-amber-700 hover:text-amber-800">
              <Link href="/dashboard/programs">
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          {recentEnrollments.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              Belum ada program aktif. Temukan program menarik di{' '}
              <Link href="/programs" className="text-amber-600 font-semibold hover:underline">
                katalog program kami
              </Link>
              .
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentEnrollments.map((prog) => (
                <div
                  key={prog.id}
                  className="p-4 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/20 transition-all flex items-center justify-between"
                >
                  <div>
                    {prog.ageRange && (
                      <span className="text-[11px] font-semibold text-amber-600 block mb-0.5">
                        Usia {prog.ageRange}
                      </span>
                    )}
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {prog.title}
                    </h3>
                  </div>
                  <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800 text-white text-xs rounded-xl font-semibold">
                    <Link href={`/dashboard/programs/${prog.slug}`}>
                      Buka Kelas
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
