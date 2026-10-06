import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth/guards';
import { db, programs, programAccess, programContents } from '@/lib/db';
import { eq, and, asc } from 'drizzle-orm';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Button } from '@/components/ui/button';
import {
  MessageCircle,
  Video,
  FileText,
  ExternalLink,
  Lock,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface MemberProgramDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function MemberProgramDetailPage({
  params,
}: MemberProgramDetailPageProps) {
  const { slug } = await params;
  const { user } = await requireAuth(`/dashboard/programs/${slug}`);

  // 1. Fetch Program via Drizzle
  const [program] = await db
    .select()
    .from(programs)
    .where(eq(programs.slug, slug))
    .limit(1);

  if (!program) {
    notFound();
  }

  // 2. Verify Program Access
  const [access] = await db
    .select()
    .from(programAccess)
    .where(
      and(
        eq(programAccess.userId, user.id),
        eq(programAccess.programId, program.id),
        eq(programAccess.status, 'active')
      )
    )
    .limit(1);

  // If user does not have active access, show restricted access banner
  if (!access) {
    return (
      <DashboardShell
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Program Saya', href: '/dashboard/programs' },
          { label: program.title },
        ]}
      >
        <div className="max-w-lg mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
          <div className="size-16 rounded-2xl bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db] flex items-center justify-center mx-auto mb-4">
            <Lock className="size-8 stroke-[1.75]" />
          </div>
          <h2 className="text-xl font-semibold font-sans text-slate-900 dark:text-white mb-2">
            Akses Belum Aktif
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-normal">
            Anda belum terdaftar atau pembayaran untuk program &quot;{program.title}&quot; belum selesai diproses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" className="rounded-full text-xs font-semibold">
              <Link href="/dashboard/programs">Kembali ke Program Saya</Link>
            </Button>
            <Button asChild className="bg-[#21b1db] hover:bg-[#1da0c7] font-semibold text-white rounded-full shadow-md shadow-[#21b1db]/20">
              <Link href={`/checkout/${program.slug}`}>Daftar & Bayar Program</Link>
            </Button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  // 3. Fetch program contents (both public & member-only)
  const allContents = await db
    .select()
    .from(programContents)
    .where(eq(programContents.programId, program.id))
    .orderBy(asc(programContents.sortOrder));

  const whatsappContents = allContents.filter(
    (c) => c.contentType === 'whatsapp_group'
  );
  const zoomContents = allContents.filter((c) => c.contentType === 'zoom_link');
  const driveContents = allContents.filter(
    (c) => c.contentType === 'google_drive' || c.contentType === 'file'
  );

  return (
    <DashboardShell
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Program Saya', href: '/dashboard/programs' },
        { label: program.title },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Akses Penuh Aktif
            </span>
            {program.level && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                Level: {program.level}
              </span>
            )}
            {program.ageRange && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E8F8FA]/20 text-cyan-200">
                Usia {program.ageRange}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold font-sans text-white mb-2">
            {program.title}
          </h1>

          {program.description && (
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
              {program.description}
            </p>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-4 h-4 text-[#21b1db]" />
            <span>
              Akses dibuka sejak{' '}
              {new Date(access.grantedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Quick Action Cards: WhatsApp & Live Zoom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* WhatsApp Community Box */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-950 dark:text-emerald-200 font-sans">
                  Grup Komunitas WhatsApp
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-400 mt-1 leading-relaxed font-normal">
                  Bergabunglah dengan grup wali murid & instruktur untuk diskusi harian, konsultasi, dan pengumuman kelas.
                </p>
              </div>
            </div>

            <div className="mt-5">
              {whatsappContents.length > 0 && whatsappContents[0].url ? (
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-full shadow-sm">
                  <a href={whatsappContents[0].url} target="_blank" rel="noopener noreferrer">
                    <span>Gabung Grup WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </a>
                </Button>
              ) : (
                <div className="text-xs text-emerald-700 dark:text-emerald-400 italic bg-white/60 dark:bg-slate-900/40 p-2.5 rounded-xl text-center">
                  Tautan grup WhatsApp akan segera diumumkan oleh admin
                </div>
              )}
            </div>
          </div>

          {/* Zoom / Live Session Box */}
          <div className="bg-[#E8F8FA]/60 dark:bg-cyan-950/20 border border-[#21b1db]/20 dark:border-cyan-900/60 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#21b1db] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-cyan-200 font-sans">
                  Ruang Pertemuan Live (Zoom)
                </h3>
                <p className="text-xs text-slate-600 dark:text-cyan-400 mt-1 leading-relaxed font-normal">
                  Ikuti sesi interaktif tatap muka bersama mentor sesuai jadwal sesi live program.
                </p>
              </div>
            </div>

            <div className="mt-5">
              {zoomContents.length > 0 && zoomContents[0].url ? (
                <Button asChild className="w-full bg-[#21b1db] hover:bg-[#1da0c7] text-white font-semibold text-xs rounded-full shadow-sm">
                  <a href={zoomContents[0].url} target="_blank" rel="noopener noreferrer">
                    <span>Masuk Sesi Zoom</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </a>
                </Button>
              ) : (
                <div className="text-xs text-slate-600 dark:text-cyan-400 italic bg-white/60 dark:bg-slate-900/40 p-2.5 rounded-xl text-center">
                  Jadwal dan tautan Zoom akan diperbarui menjelang sesi dimulai
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Learning Materials & Modules Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold font-sans text-slate-900 dark:text-white">
                Materi Belajar & Modul Digital
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                Semua bahan materi, worksheet, dan panduan praktik mandiri si kecil.
              </p>
            </div>
            {driveContents.length > 0 && driveContents[0].url && (
              <Button asChild variant="outline" size="sm" className="text-xs font-semibold rounded-full">
                <a href={driveContents[0].url} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-[#21b1db]" />
                  Buka Folder Google Drive
                </a>
              </Button>
            )}
          </div>

          {allContents.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-400">
              Materi program sedang disiapkan oleh instruktur.
            </div>
          ) : (
            <div className="space-y-3">
              {allContents.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#21b1db]/40 hover:bg-[#E8F8FA]/20 dark:hover:bg-cyan-950/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300 text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {item.title}
                      </h4>
                      {item.content && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.content}</p>
                      )}
                    </div>
                  </div>

                  {item.url ? (
                    <Button asChild size="sm" variant="ghost" className="text-xs font-semibold text-[#21b1db] hover:text-[#1da0c7] hover:bg-[#E8F8FA]/60 rounded-full">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <span>Akses</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  ) : (
                    <span className="text-xs text-slate-400">Tersedia di kelas</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
