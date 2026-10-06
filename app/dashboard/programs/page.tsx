import Link from 'next/link';
import { requireAuth } from '@/lib/auth/guards';
import { db, programAccess, programs } from '@/lib/db';
import { eq, and, desc } from 'drizzle-orm';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { GraduationCap, ArrowRight, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function MemberProgramsPage() {
  const { user } = await requireAuth('/dashboard/programs');

  // Fetch user's active program access via Drizzle
  const activePrograms = await db
    .select({
      id: programAccess.id,
      status: programAccess.status,
      grantedAt: programAccess.grantedAt,
      programId: programs.id,
      title: programs.title,
      slug: programs.slug,
      description: programs.description,
      coverImage: programs.coverImage,
      ageRange: programs.ageRange,
      level: programs.level,
    })
    .from(programAccess)
    .innerJoin(programs, eq(programAccess.programId, programs.id))
    .where(and(eq(programAccess.userId, user.id), eq(programAccess.status, 'active')))
    .orderBy(desc(programAccess.grantedAt));

  return (
    <DashboardShell
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Program Saya' },
      ]}
    >
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">
            Program Belajar Saya
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Akses materi, rekaman, tautan pertemuan live, dan grup komunitas program Anda.
          </p>
        </div>

        {activePrograms.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center max-w-lg mx-auto shadow-sm my-8">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db] flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 stroke-[1.75]" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 font-sans">
              Belum Ada Program Terdaftar
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-normal">
              Anda belum terdaftar dalam program pelatihan Alpha Kids. Temukan program seru yang sesuai dengan minat dan usia si kecil sekarang!
            </p>
            <Button asChild className="bg-[#21b1db] hover:bg-[#1da0c7] font-semibold text-white rounded-full shadow-md shadow-[#21b1db]/20">
              <Link href="/programs">
                <BookOpen className="w-4 h-4 mr-2" />
                Jelajahi Katalog Program
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                <div className="h-32 bg-slate-50 dark:bg-slate-800/60 p-5 flex flex-col justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      Akses Aktif
                    </span>
                    {prog.level && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-600">
                        {prog.level}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-normal">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Terdaftar:{' '}
                      {new Date(prog.grantedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {prog.ageRange && (
                      <span className="text-xs font-semibold text-[#21b1db] block mb-1">
                        Usia {prog.ageRange}
                      </span>
                    )}
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-[#21b1db] transition-colors line-clamp-2">
                      {prog.title}
                    </h3>
                    {prog.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-normal">
                        {prog.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      asChild
                      className="w-full bg-[#21b1db] hover:bg-[#1da0c7] text-white font-semibold text-xs rounded-full shadow-xs"
                    >
                      <Link href={`/dashboard/programs/${prog.slug}`}>
                        <span>Masuk Ruang Kelas</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
