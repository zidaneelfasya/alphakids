import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import {
  db,
  programs,
  categories,
  programContents,
  programAccess,
} from '@/lib/db';
import { eq, and, desc, asc, ne } from 'drizzle-orm';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { LandingFooter } from '@/components/landing/landing-footer';
import { ProgramCard } from '@/components/programs/program-card';
import { formatRupiah } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  Users,
  MessageCircle,
  Award,
} from 'lucide-react';
import {
  getCmsSection,
  DEFAULT_CONTACT,
  ContactSectionContent,
  formatWhatsAppUrl,
} from '@/lib/cms';

interface ProgramDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [program] = await db
    .select({ title: programs.title, description: programs.description })
    .from(programs)
    .where(and(eq(programs.slug, slug), eq(programs.isActive, true)))
    .limit(1);

  if (!program) {
    return { title: 'Program Tidak Ditemukan — Alpha Kids' };
  }

  return {
    title: `${program.title} — Alpha Kids`,
    description: (program.description || '').slice(0, 160),
  };
}

export default async function ProgramDetailPage({
  params,
}: ProgramDetailPageProps) {
  const { slug } = await params;

  // 1. Supabase auth session
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Fetch all active programs for Navbar dropdown & bottom recommendations
  const allActivePrograms = await db.query.programs.findMany({
    where: eq(programs.isActive, true),
    orderBy: [desc(programs.createdAt)],
    with: {
      category: true,
    },
  });

  // 3. Find current program details
  const [program] = await db
    .select({
      id: programs.id,
      title: programs.title,
      slug: programs.slug,
      description: programs.description,
      price: programs.price,
      coverImage: programs.coverImage,
      ageRange: programs.ageRange,
      level: programs.level,
      isActive: programs.isActive,
      publishedAt: programs.publishedAt,
      createdAt: programs.createdAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(programs)
    .leftJoin(categories, eq(programs.categoryId, categories.id))
    .where(and(eq(programs.slug, slug), eq(programs.isActive, true)))
    .limit(1);

  if (!program) {
    notFound();
  }

  // 4. Fetch PUBLIC ONLY program contents (silabus / kurikulum)
  const publicContents = await db
    .select()
    .from(programContents)
    .where(
      and(
        eq(programContents.programId, program.id),
        eq(programContents.visibility, 'public')
      )
    )
    .orderBy(asc(programContents.sortOrder));

  // 5. Check enrollment status if user is logged in
  let isEnrolled = false;
  if (user) {
    const [access] = await db
      .select({ id: programAccess.id })
      .from(programAccess)
      .where(
        and(
          eq(programAccess.userId, user.id),
          eq(programAccess.programId, program.id),
          eq(programAccess.status, 'active')
        )
      )
      .limit(1);

    isEnrolled = !!access;
  }

  // 6. Other recommended programs (limit 3, exclude current)
  const otherPrograms = allActivePrograms
    .filter((p) => p.slug !== program.slug)
    .slice(0, 3);

  // 7. Fetch Contact settings (dynamic WhatsApp number)
  const contact = await getCmsSection<ContactSectionContent>(
    'contact',
    DEFAULT_CONTACT
  );

  const fallbackCover = '/assets/img/hero1.png';

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-white selection:bg-cyan-200 selection:text-cyan-900">
      {/* 1. Official Floating Capsule Navbar */}
      <LandingNavbar
        user={user}
        programs={allActivePrograms}
        whatsappNumber={contact.whatsappNumber}
        supportEmail={contact.supportEmail}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-8 font-medium"
          >
            <Link
              href="/"
              className="hover:text-[#21b1db] dark:hover:text-cyan-300 transition-colors"
            >
              Beranda
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Link
              href="/programs"
              className="hover:text-[#21b1db] dark:hover:text-cyan-300 transition-colors"
            >
              Katalog Program
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-white font-semibold truncate max-w-xs sm:max-w-md">
              {program.title}
            </span>
          </nav>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Cover, Details, Syllabus & Guarantees */}
            <div className="lg:col-span-8 space-y-8">
              {/* Cover Image Banner */}
              <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-950/[0.03]">
                <Image
                  src={program.coverImage || fallbackCover}
                  alt={program.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />

                {/* Badges on Top of Cover */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 pointer-events-none">
                  {program.ageRange ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFCC07] text-amber-950 shadow-xs">
                      {program.ageRange.toLowerCase().startsWith('usia')
                        ? program.ageRange
                        : `Usia ${program.ageRange}`}
                    </span>
                  ) : (
                    <span />
                  )}

                  {program.categoryName && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-[#0e7490] dark:text-cyan-300 border border-cyan-100 dark:border-cyan-900/50 backdrop-blur-xs shadow-xs">
                      {program.categoryName}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Meta Info */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {program.level && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-xs">
                      <Layers className="size-3 text-[#21b1db]" />
                      <span>Level: <strong className="font-semibold text-slate-900 dark:text-white">{program.level}</strong></span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-[#21b1db]/20 bg-[#E8F8FA] dark:bg-cyan-950/40 text-[#0e7490] dark:text-cyan-300 shadow-xs">
                    
                    <span>Metode Gamifikasi Interaktif</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-xs">
                    

                    <span>Mentor Bersertifikat</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-sans tracking-tight text-slate-900 dark:text-white leading-[1.25]">
                  {program.title}
                </h1>
              </div>

              {/* Description Card */}
              <section className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-[#0e7490] dark:text-cyan-300">
                  <Sparkles className="size-4 text-[#21b1db]" />
                  <span>Tentang Program Ini</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {program.description ||
                    'Kurikulum dirancang secara khusus untuk memperkenalkan logika pemrograman, robotika, dan kreasi digital kepada anak-anak melalui pendekatan bermain yang seru dan berpusat pada karya.'}
                </div>
              </section>

              {/* Public Syllabus / Curriculum Sections */}
              {publicContents.length > 0 && (
                <section className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-[#0e7490] dark:text-cyan-300">
                    <Calendar className="size-4 text-[#21b1db]" />
                    <span>Silabus & Informasi Pembelajaran</span>
                  </div>

                  <div className="space-y-3">
                    {publicContents.map((content, idx) => (
                      <div
                        key={content.id}
                        className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors flex items-start gap-3.5"
                      >
                        <span className="size-7 rounded-full bg-[#E8F8FA] dark:bg-cyan-950/70 text-[#0e7490] dark:text-cyan-300 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          {idx + 1}
                        </span>
                        <div className="flex-1 space-y-1 min-w-0">
                          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                            {content.title}
                          </h3>
                          {content.content && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              {content.content}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Value Guarantees / Keunggulan */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                  <div className="size-9 rounded-xl bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db] flex items-center justify-center mb-3">
                    <Sparkles className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                      Proyek Nyata
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Anak belajar sambil menghasilkan karya nyata seperti game dan animasi.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                  <div className="size-9 rounded-xl bg-[#FDF0F5] dark:bg-pink-950/60 text-[#ef599a] flex items-center justify-center mb-3">
                    <Users className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                      Mentor Ahli & Ramah
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Didampingi kakak mentor bersertifikat dengan pendekatan sabar dan menyenangkan.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                  <div className="size-9 rounded-xl bg-[#FEF9C3] dark:bg-amber-950/60 text-[#ca8a04] flex items-center justify-center mb-3">
                    <Award className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                      Sertifikat Kelulusan
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Setiap peserta yang menuntaskan program memperoleh sertifikat resmi Alpha Kids.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Sticky Pricing & Action Pill Button Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-md shadow-slate-950/[0.03] space-y-6">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Investasi Pembelajaran
                  </span>
                  <div className="text-3xl sm:text-4xl font-semibold font-sans text-slate-900 dark:text-white">
                    {program.price === 0 ? 'Gratis' : formatRupiah(program.price)}
                  </div>
                </div>

                {isEnrolled ? (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                      <span>Anda sudah terdaftar dalam program ini!</span>
                    </div>

                    <Link
                      href={`/dashboard/programs/${program.slug}`}
                      className="group w-full inline-flex items-center justify-between pl-6 pr-2 py-2.5 rounded-full bg-[#21b1db] hover:bg-[#1da0c7] text-white font-semibold text-sm shadow-xl shadow-[#21b1db]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="tracking-tight">Buka Ruang Kelas</span>
                      <span className="size-9 rounded-full bg-white text-[#21b1db] flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 group-hover:scale-105 group-hover:rotate-12">
                        <ArrowUpRight className="size-4 stroke-[2.5]" />
                      </span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Alpha Kids Signature Pill Button (Alpha Pink CTA) */}
                    

                    {/* WhatsApp Consultation Link (Admin Dynamic Number) */}
                    <a
                      href={formatWhatsAppUrl(
                        contact.whatsappNumber,
                        `Halo Admin Alpha Kids, saya ingin tanya tentang program ${program.title}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#21b1db] dark:hover:text-cyan-300 w-full py-2.5 rounded-full border border-slate-200/80 dark:border-slate-800 hover:border-[#21b1db]/40 transition-colors"
                    >
                      <MessageCircle className="size-4 text-[#21b1db]" />
                      <span>Konsultasi via WhatsApp</span>
                    </a>
                    <Link
                      href={`/checkout/${program.slug}`}
                      className="group w-full inline-flex items-center justify-between pl-6 sm:pl-7 pr-2 sm:pr-2.5 py-2.5 rounded-full bg-[#ef599a] hover:bg-[#df488a] text-white font-semibold text-sm sm:text-base shadow-xl shadow-[#ef599a]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="tracking-tight">Daftar Sekarang</span>
                      <span className="size-9 sm:size-10 rounded-full bg-white text-[#ef599a] flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 group-hover:scale-105 group-hover:rotate-12">
                        <ArrowUpRight className="size-4 sm:size-5 stroke-[2.5]" />
                      </span>
                    </Link>
                  </div>
                )}

                {/* Guarantees Checklist */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                    <span>Pembayaran aman </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="size-4 text-[#ef599a] shrink-0" />
                    <span>Akses materi langsung aktif setelah bayar</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="size-4 text-[#21b1db] shrink-0" />
                    <span>Dapat sertifikat resmi Alpha Kids</span>
                  </div>
                </div>
              </div>

              {/* Back to Catalog Link */}
              <div className="text-center">
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#21b1db] dark:text-slate-400 dark:hover:text-cyan-300 transition-colors"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Kembali ke Katalog Program</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Section: Other Recommended Programs */}
          {otherPrograms.length > 0 && (
            <div className="mt-20 pt-12 border-t border-slate-200/80 dark:border-slate-800 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold font-sans tracking-tight text-slate-900 dark:text-white">
                    Program Pilihan Lainnya
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Jelajahi kelas belajar digital lainnya yang diminati anak-anak hebat.
                  </p>
                </div>

                <Link
                  href="/programs"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ef599a] hover:text-[#df488a] transition-colors"
                >
                  <span>Lihat Semua Program</span>
                  <ArrowUpRight className="size-3.5 stroke-[2.5]" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {otherPrograms.map((other) => (
                  <ProgramCard
                    key={other.id}
                    id={other.id}
                    name={other.title}
                    slug={other.slug}
                    description={other.description || ''}
                    price={other.price}
                    thumbnailUrl={other.coverImage}
                    categoryName={other.category?.name}
                    ageRange={other.ageRange}
                    level={other.level}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. Branded Multi-Column Footer */}
      <LandingFooter />
    </div>
  );
}
