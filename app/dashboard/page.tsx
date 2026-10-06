import Image from 'next/image';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth/guards';
import { db, programAccess, orders, programs } from '@/lib/db';
import { eq, and, desc, count } from 'drizzle-orm';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { GraduationCap, CreditCard, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDicebearMoodsAvatar } from '@/lib/avatar';

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

  const userName =
    profile?.full_name ||
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    user.email?.split('@')[0] ||
    'Peserta';

  // DiceBear Moods Avatar resolution
  const userAvatar =
    (profile?.avatar_url && !profile.avatar_url.includes('Simbol Tutor')
      ? profile.avatar_url
      : null) || getDicebearMoodsAvatar(user.email || userName);

  return (
    <DashboardShell breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ================================================================= */}
        {/* CREATIVE WELCOME CARD (NO GAUDY GRADIENTS, NO EMOJIS)             */}
        {/* Left: DiceBear Moods Avatar + Greeting; Right: Alpha Kids Objects */}
        {/* ================================================================= */}
        <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm overflow-hidden">
          {/* Subtle warm backdrop circles */}
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 size-64 rounded-full bg-[#E8F8FA]/60 dark:bg-cyan-950/20 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-10 right-32 size-48 rounded-full bg-[#FEF9C3]/50 dark:bg-amber-950/20 blur-2xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left Column: Avatar & Greeting */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 max-w-xl">
              {/* DiceBear Moods Avatar Frame */}
              <div className="relative size-20 sm:size-24 rounded-full ring-4 ring-[#E8F8FA] dark:ring-cyan-950/80 border-2 border-[#21b1db] shadow-md overflow-hidden bg-[#E8F8FA] shrink-0">
                <Image
                  src={userAvatar}
                  alt={userName}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db] px-3 py-1 rounded-full mb-2">
                  Ruang Belajar Digital
                </span>
                <h1 className="text-2xl sm:text-3xl font-semibold font-sans tracking-tight text-slate-900 dark:text-white leading-tight">
                  Halo, {userName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-normal">
                  Mulai jelajahi materi pembelajaran seru si kecil, ikuti sesi interaktif, dan kumpulkan pencapaian hebat hari ini.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href="/programs"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#21b1db] hover:bg-[#1da0c7] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#21b1db]/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Jelajahi Program</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                  <Link
                    href="/dashboard/programs"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#21b1db] hover:text-[#21b1db] font-semibold text-xs sm:text-sm transition-colors"
                  >
                    <span>Program Saya</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Collage of Alpha Kids Learning Objects */}
            <div
              aria-hidden="true"
              className="hidden lg:flex items-center justify-end relative h-40 w-72 shrink-0 select-none pointer-events-none"
            >
              {/* Object 1: Trophy Centerpiece */}
              <div className="absolute right-6 top-3 size-24 drop-shadow-lg z-10 transition-transform duration-300 hover:scale-105">
                <Image
                  src="/assets/img/Simbol Piala AlphaKids_revisi0.png"
                  alt="Piala Prestasi"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Object 2: Purple Star Ornament (Top-left of cluster) */}
              <div className="absolute right-28 top-0 size-14 drop-shadow-md z-20 -rotate-12">
                <Image
                  src="/assets/img/Ornamen Bintang Ungu AlphaKids_revisi0.png"
                  alt="Bintang Ungu"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Object 3: Yellow Puzzle Ornament (Bottom-left of cluster) */}
              <div className="absolute right-24 bottom-1 size-14 drop-shadow-md z-20 rotate-12">
                <Image
                  src="/assets/img/Ornamen Puzzle Kuning AlphaKids_revisi0.png"
                  alt="Puzzle Kuning"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Object 4: Concentric rings decorative outline */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 size-36 rounded-full border border-dashed border-[#21b1db]/30 dark:border-cyan-800/30 -z-0" />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* QUICK STATS CARDS (ALPHA KIDS THEMED TRIAD ACCENTS)               */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Program Aktif (Alpha Cyan Accent) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
                Program Aktif
              </span>
              <span className="text-3xl font-semibold font-sans text-slate-900 dark:text-white">
                {enrolledCount}
              </span>
              <span className="text-[11px] text-[#21b1db] font-medium block mt-1">
                Sedang berjalan
              </span>
            </div>
            <div className="size-14 rounded-2xl bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db] flex items-center justify-center shrink-0 shadow-xs">
              <GraduationCap className="size-7 stroke-[1.75]" />
            </div>
          </div>

          {/* Card 2: Total Pesanan (Alpha Pink Accent) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
                Total Transaksi
              </span>
              <span className="text-3xl font-semibold font-sans text-slate-900 dark:text-white">
                {ordersCount}
              </span>
              <span className="text-[11px] text-[#ef599a] font-medium block mt-1">
                Pesanan terdaftar
              </span>
            </div>
            <div className="size-14 rounded-2xl bg-[#FDF0F5] dark:bg-pink-950/60 text-[#ef599a] flex items-center justify-center shrink-0 shadow-xs">
              <CreditCard className="size-7 stroke-[1.75]" />
            </div>
          </div>

          {/* Card 3: Status Akun (Alpha Yellow/Green Accent) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
                Status Akun
              </span>
              <span className="text-xl sm:text-2xl font-semibold font-sans text-slate-900 dark:text-white flex items-center gap-2">
                Terverifikasi
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block mt-1">
                Akses penuh platform
              </span>
            </div>
            <div className="size-14 rounded-2xl bg-[#FEF9C3] dark:bg-amber-950/60 text-amber-700 dark:text-[#FFCC07] flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="size-7 stroke-[1.75]" />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RECENT ENROLLED PROGRAMS (CLEAN CARD LIST)                        */}
        {/* ================================================================= */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold font-sans text-slate-900 dark:text-white">
                Program Belajar Terbaru
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                Kelas digital yang sedang aktif diikuti oleh si kecil.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-[#21b1db] hover:text-[#1da0c7] hover:bg-[#E8F8FA] dark:hover:bg-cyan-950/40 rounded-full">
              <Link href="/dashboard/programs" className="flex items-center gap-1.5">
                <span>Lihat Semua</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          {recentEnrollments.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <BookOpen className="size-8 mx-auto text-[#21b1db] mb-2" />
              <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                Belum ada program aktif
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Temukan program pelatihan seru di{' '}
                <Link href="/programs" className="text-[#21b1db] font-semibold hover:underline">
                  katalog program kami
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentEnrollments.map((prog) => (
                <div
                  key={prog.id}
                  className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-[#21b1db]/50 hover:bg-[#E8F8FA]/30 dark:hover:bg-cyan-950/20 transition-all flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    {prog.ageRange && (
                      <span className="text-[11px] font-semibold text-[#21b1db] block mb-1">
                        Usia {prog.ageRange}
                      </span>
                    )}
                    <h3 className="text-sm font-semibold font-sans text-slate-900 dark:text-white line-clamp-1">
                      {prog.title}
                    </h3>
                    {prog.level && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-normal block mt-0.5 capitalize">
                        Level: {prog.level}
                      </span>
                    )}
                  </div>
                  <Button asChild size="sm" className="bg-[#21b1db] hover:bg-[#1da0c7] text-white text-xs rounded-full font-semibold shadow-xs shrink-0">
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
