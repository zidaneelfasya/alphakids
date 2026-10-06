import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { db, programs, categories, programContents, programAccess } from '@/lib/db';
import { eq, and, asc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/guards';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatRupiah } from '@/lib/utils';
import {
  Calendar,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ProgramDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProgramDetailPageProps) {
  const { slug } = await params;
  const [program] = await db
    .select({ title: programs.title, description: programs.description })
    .from(programs)
    .where(and(eq(programs.slug, slug), eq(programs.isActive, true)))
    .limit(1);

  if (!program) {
    return { title: 'Program Tidak Ditemukan' };
  }

  return {
    title: `${program.title} | Alpha Kids`,
    description: (program.description || '').slice(0, 160),
  };
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = await params;

  // 1. Fetch Program details with category via Drizzle
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

  // 2. Fetch PUBLIC ONLY program contents (strictly prevent member links leak)
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

  // 3. Check enrollment if user is logged in
  const auth = await getCurrentUser();
  let isEnrolled = false;

  if (auth?.user) {
    const [access] = await db
      .select({ id: programAccess.id })
      .from(programAccess)
      .where(
        and(
          eq(programAccess.userId, auth.user.id),
          eq(programAccess.programId, program.id),
          eq(programAccess.status, 'active')
        )
      )
      .limit(1);

    isEnrolled = !!access;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <SiteNavbar />

      <main className="flex-1 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/programs" className="hover:text-amber-600 transition-colors">
              Katalog Program
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate max-w-xs">
              {program.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Details & Public Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Cover Image / Hero Header */}
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-gradient-to-br from-amber-400/20 via-orange-400/10 to-amber-100 flex items-center justify-center">
                {program.coverImage ? (
                  <Image
                    src={program.coverImage}
                    alt={program.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-amber-700/60 p-6 text-center">
                    <GraduationCap className="w-16 h-16" />
                    <span className="font-heading font-bold text-xl text-amber-900/60">
                      Alpha Kids Digital Program
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Meta */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {program.categoryName && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-none font-semibold">
                      {program.categoryName}
                    </Badge>
                  )}
                  {program.level && (
                    <Badge variant="outline" className="border-slate-300 text-slate-700 font-medium">
                      Level: {program.level}
                    </Badge>
                  )}
                  {program.ageRange && (
                    <Badge variant="outline" className="border-amber-200 text-amber-800 bg-amber-50 font-medium">
                      Usia: {program.ageRange}
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
                  {program.title}
                </h1>
              </div>

              {/* Description */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h2 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Tentang Program Ini
                </h2>
                <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {program.description || 'Deskripsi program akan segera diperbarui.'}
                </div>
              </div>

              {/* Public Curriculum / Preview Sections */}
              {publicContents.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                  <h2 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    Silabus & Informasi Publik
                  </h2>
                  <div className="space-y-3">
                    {publicContents.map((content, idx) => (
                      <div
                        key={content.id}
                        className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-semibold text-sm text-slate-800">
                            {content.title}
                          </h3>
                          {content.content && (
                            <p className="text-xs text-slate-500 leading-relaxed">
                              {content.content}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Action & Pricing Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <Card className="rounded-3xl border-slate-200/80 shadow-md overflow-hidden bg-white">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Investasi Pembelajaran
                    </span>
                    <div className="text-3xl font-extrabold font-heading text-amber-600">
                      {formatRupiah(program.price)}
                    </div>
                  </div>

                  {isEnrolled ? (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Anda sudah terdaftar dalam program ini!</span>
                      </div>
                      <Button
                        asChild
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl py-6 text-sm"
                      >
                        <Link href={`/dashboard/programs/${program.slug}`}>
                          <span>Akses Ruang Kelas Saya</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      asChild
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl py-6 text-base shadow-lg shadow-amber-500/25 active:scale-[0.99] transition-all"
                    >
                      <Link href={`/checkout/${program.slug}`}>
                        <span>Daftar Sekarang</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  )}

                  <div className="border-t border-slate-100 pt-5 space-y-3 text-xs text-slate-500">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Pembayaran aman (Midtrans & Mayar)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span>Akses materi langsung terbuka setelah bayar</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span>Dapat sertifikat resmi Alpha Kids</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
