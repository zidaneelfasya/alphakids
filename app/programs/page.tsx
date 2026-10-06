import { db, programs, categories } from '@/lib/db';
import { eq, and, desc, ilike } from 'drizzle-orm';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { ProgramCard } from '@/components/programs/program-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface ProgramsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}

export const metadata = {
  title: 'Katalog Program — Alpha Kids',
  description: 'Temukan bimbingan OSN, webinar edukasi, dan kelas intensif terbaik untuk anak Anda.',
};

export default async function ProgramsPage({ searchParams }: ProgramsPageProps) {
  const { category: categorySlug, q: searchQuery } = await searchParams;

  // 1. Fetch Categories
  const categoryList = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.name);

  // 2. Build Programs query
  const conditions = [eq(programs.isActive, true)];

  if (searchQuery) {
    conditions.push(ilike(programs.title, `%${searchQuery}%`));
  }

  if (categorySlug) {
    const selectedCategory = categoryList.find((c) => c.slug === categorySlug);
    if (selectedCategory) {
      conditions.push(eq(programs.categoryId, selectedCategory.id));
    }
  }

  const programList = await db
    .select({
      id: programs.id,
      title: programs.title,
      slug: programs.slug,
      description: programs.description,
      price: programs.price,
      coverImage: programs.coverImage,
      ageRange: programs.ageRange,
      level: programs.level,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(programs)
    .leftJoin(categories, eq(programs.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(programs.createdAt));

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <SiteNavbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              Program Pembelajaran Digital
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              Eksplorasi Kelas & Bimbingan Terbaik
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Pilih program yang dirancang khusus untuk membangun fondasi logika, sains, dan keterampilan masa depan anak Anda.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <Button
                asChild
                variant={!categorySlug ? 'default' : 'outline'}
                size="sm"
                className={`rounded-full text-xs font-semibold ${
                  !categorySlug
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'text-slate-600 border-slate-200'
                }`}
              >
                <Link href={searchQuery ? `/programs?q=${searchQuery}` : '/programs'}>
                  Semua Kategori
                </Link>
              </Button>

              {categoryList.map((cat) => (
                <Button
                  key={cat.id}
                  asChild
                  variant={categorySlug === cat.slug ? 'default' : 'outline'}
                  size="sm"
                  className={`rounded-full text-xs font-semibold flex-shrink-0 ${
                    categorySlug === cat.slug
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'text-slate-600 border-slate-200'
                  }`}
                >
                  <Link
                    href={`/programs?category=${cat.slug}${
                      searchQuery ? `&q=${searchQuery}` : ''
                    }`}
                  >
                    {cat.name}
                  </Link>
                </Button>
              ))}
            </div>

            {/* Search Input */}
            <form className="relative w-full md:w-72" action="/programs" method="GET">
              {categorySlug && (
                <input type="hidden" name="category" value={categorySlug} />
              )}
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                name="q"
                defaultValue={searchQuery}
                placeholder="Cari program..."
                className="pl-9 pr-4 py-2 text-xs rounded-full border-slate-200 focus-visible:ring-amber-500"
              />
            </form>
          </div>

          {/* Programs Grid */}
          {programList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading mb-1">
                Program Tidak Ditemukan
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Tidak ada program yang sesuai dengan kata kunci pencarian atau filter kategori yang dipilih.
              </p>
              <Button asChild variant="outline" size="sm" className="rounded-full text-xs">
                <Link href="/programs">Reset Filter</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programList.map((prog) => (
                <ProgramCard
                  key={prog.id}
                  id={prog.id}
                  name={prog.title}
                  slug={prog.slug}
                  description={prog.description || ''}
                  price={prog.price}
                  thumbnailUrl={prog.coverImage}
                  categoryName={prog.categoryName || undefined}
                  startAt={null}
                  endAt={null}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
