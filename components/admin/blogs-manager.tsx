'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Calendar,
  Clock,
  User,
  Sparkles,
  ArrowRight,
  BookOpen,
  Filter,
  Check,
  Loader2,
  Save,
  Tag,
  PenLine,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CmsImageUpload } from '@/components/admin/cms-image-upload';
import {
  createBlogItemAction,
  updateBlogItemAction,
  deleteBlogItemAction,
} from '@/lib/actions/admin-blogs';
import type { BlogItem } from '@/lib/cms-types';

interface BlogsManagerProps {
  initialItems: BlogItem[];
}

const CATEGORY_TAGS = [
  'Semua',
  'Gamifikasi',
  'Aktivitas Seru',
  'Seni Digital',
  'Robotika',
  'Parenting Digital',
];

const TAG_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  Gamifikasi: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/60',
    text: 'text-[#21b1db]',
    border: 'border-cyan-200/60 dark:border-cyan-800/60',
  },
  'Aktivitas Seru': {
    bg: 'bg-pink-50 dark:bg-pink-950/60',
    text: 'text-[#ef599a]',
    border: 'border-pink-200/60 dark:border-pink-800/60',
  },
  'Seni Digital': {
    bg: 'bg-purple-50 dark:bg-purple-950/60',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200/60 dark:border-purple-800/60',
  },
  Robotika: {
    bg: 'bg-amber-50 dark:bg-amber-950/60',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200/60 dark:border-amber-800/60',
  },
  'Parenting Digital': {
    bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200/60 dark:border-emerald-800/60',
  },
};

export function BlogsManager({ initialItems }: BlogsManagerProps) {
  const [items, setItems] = useState<BlogItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('Semua');

  // Sheet & Editor States
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<BlogItem | null>(null);
  const [formState, setFormState] = useState<BlogItem>({
    id: '',
    title: '',
    slug: '',
    tag: 'Gamifikasi',
    author: 'Tim Kurikulum Alpha Kids',
    publishedAt: '',
    readTime: '4 mnt baca',
    imageUrl: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/hero1.png',
    excerpt: '',
    content: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(null);

  // Filtered Articles List
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.author || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag =
        selectedTag === 'Semua' ||
        (item.tag || '').toLowerCase() === selectedTag.toLowerCase();

      return matchesSearch && matchesTag;
    });
  }, [items, searchQuery, selectedTag]);

  // Dirty State Detection (User Requirement: Button only enabled when data is modified)
  const isFormDirty = useMemo(() => {
    if (isCreating) {
      return formState.title.trim().length > 0;
    }
    if (!selectedArticle) return false;

    return (
      formState.title !== selectedArticle.title ||
      formState.slug !== selectedArticle.slug ||
      formState.tag !== selectedArticle.tag ||
      formState.author !== selectedArticle.author ||
      formState.publishedAt !== selectedArticle.publishedAt ||
      formState.readTime !== selectedArticle.readTime ||
      formState.imageUrl !== selectedArticle.imageUrl ||
      formState.excerpt !== selectedArticle.excerpt ||
      formState.content !== selectedArticle.content
    );
  }, [formState, selectedArticle, isCreating]);

  // Open Article Detail Drawer
  const handleOpenDetail = (article: BlogItem) => {
    setIsCreating(false);
    setSelectedArticle(article);
    setFormState({ ...article });
    setIsSheetOpen(true);
  };

  // Open Create Article Drawer
  const handleOpenCreate = () => {
    setIsCreating(true);
    setSelectedArticle(null);
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    setFormState({
      id: '',
      title: '',
      slug: '',
      tag: 'Gamifikasi',
      author: 'Tim Kurikulum Alpha Kids',
      publishedAt: today,
      readTime: '3 mnt baca',
      imageUrl: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/hero1.png',
      excerpt: '',
      content: '## Pengantar\n\nTulis isi konten artikel di sini...\n\n## Poin Utama\n\n1. Poin pertama\n2. Poin kedua\n',
    });
    setIsSheetOpen(true);
  };

  // Auto-generate Slug on Title change
  const handleTitleChange = (newTitle: string) => {
    const generatedSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setFormState((prev) => ({
      ...prev,
      title: newTitle,
      slug: isCreating || !selectedArticle?.slug ? generatedSlug : prev.slug,
    }));
  };

  // Save / Update Article Handler
  const handleSaveArticle = async () => {
    if (!formState.title.trim()) {
      toast.error('Judul artikel wajib diisi.');
      return;
    }
    if (!formState.excerpt.trim()) {
      toast.error('Ringkasan / excerpt artikel wajib diisi.');
      return;
    }

    try {
      setIsSaving(true);

      if (isCreating) {
        const res = await createBlogItemAction(formState);
        if (res.success && res.item) {
          toast.success('Artikel baru berhasil diterbitkan!');
          setItems((prev) => [res.item!, ...prev]);
          setSelectedArticle(res.item);
          setIsCreating(false);
          setIsSheetOpen(false);
        }
      } else {
        const res = await updateBlogItemAction(formState);
        if (res.success && res.item) {
          toast.success('Artikel berhasil diperbarui!');
          setItems((prev) =>
            prev.map((item) => (item.id === res.item!.id ? res.item! : item))
          );
          setSelectedArticle(res.item);
          setFormState({ ...res.item });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan artikel.';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Article Handler
  const handleConfirmDelete = async () => {
    if (!deletingArticleId) return;

    try {
      const res = await deleteBlogItemAction(deletingArticleId);
      if (res.success) {
        toast.success('Artikel berhasil dihapus.');
        setItems((prev) => prev.filter((b) => b.id !== deletingArticleId));
        if (selectedArticle?.id === deletingArticleId) {
          setIsSheetOpen(false);
          setSelectedArticle(null);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus artikel.';
      toast.error(msg);
    } finally {
      setDeletingArticleId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* =================================================================== */}
      {/* 1. HEADER SECTION (Alpha Kids Branding & Quick Actions)            */}
      {/* =================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold font-sans tracking-tight text-slate-900 dark:text-white">
              Kelola Artikel & Blog
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#21b1db] bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-200/60 dark:border-cyan-800/60">
              
              {items.length} Artikel Terbit
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola publikasi materi bacaan edukasi digital anak, tips parenting era AI, dan panduan belajar.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/blog"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#21b1db] hover:border-[#21b1db] transition-all shadow-xs cursor-pointer"
          >
            <span>Buka Blog Publik</span>
            <ExternalLink className="size-3.5" />
          </Link>

          <Button
            type="button"
            onClick={handleOpenCreate}
            className="rounded-xl text-xs font-semibold px-4 py-2 bg-[#ef599a] hover:bg-[#df488a] text-white shadow-md shadow-[#ef599a]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="size-4 mr-1.5 stroke-[2.5]" />
            Tulis Artikel Baru
          </Button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. SEARCH & CATEGORY FILTER BAR                                    */}
      {/* =================================================================== */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul, ringkasan, atau penulis..."
            className="pl-9 text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>

        {/* Category Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {CATEGORY_TAGS.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#21b1db] text-white shadow-sm shadow-black/10'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. LIST OF ARTICLE CARDS (User Requirement: List Berupa Card)      */}
      {/* =================================================================== */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="size-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center text-[#21b1db] mx-auto">
            <BookOpen className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Tidak ada artikel yang ditemukan
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `Tidak ada artikel yang cocok dengan kata kunci "${searchQuery}".`
                : 'Belum ada artikel di kategori ini.'}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedTag('Semua');
            }}
            className="rounded-xl text-xs"
          >
            Reset Filter
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((article) => {
            const tagStyle = TAG_COLOR_MAP[article.tag || ''] || {
              bg: 'bg-slate-100 dark:bg-slate-800',
              text: 'text-slate-700 dark:text-slate-300',
              border: 'border-slate-200 dark:border-slate-700',
            };

            return (
              <div
                key={article.id}
                onClick={() => handleOpenDetail(article)}
                className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#21b1db]/60 dark:hover:border-[#21b1db]/60 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Image Banner */}
                <div className="relative w-full aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <Image
                    src={article.imageUrl || '/assets/img/hero1.png'}
                    alt={article.title}
                    fill
                    className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
                    unoptimized
                  />

                  {/* Category Tag Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${tagStyle.bg} ${tagStyle.text} ${tagStyle.border} shadow-xs`}
                    >
                      {article.tag || 'Edukasi'}
                    </span>
                  </div>

                  {/* Read Time Badge */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white">
                      <Clock className="size-3" />
                      {article.readTime || '3 mnt baca'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold font-sans tracking-tight text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#21b1db] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Card Meta & Action Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                      <User className="size-3 text-slate-400 shrink-0" />
                      <span className="truncate">{article.author || 'Tim Alpha Kids'}</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[#21b1db] font-semibold group-hover:translate-x-0.5 transition-transform">
                      <span>Buka Detail</span>
                      <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. DETAIL ARTIKEL DRAWER / SLIDE-OVER SHEET                        */}
      {/* =================================================================== */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl w-full p-0 flex flex-col h-full bg-[#FFFDF9] dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl"
        >
          {/* Drawer Header */}
          <SheetHeader className="px-6 py-4.5 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-20">
            <div className="flex items-center justify-between pr-8">
              <div>
                <SheetTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <PenLine className="size-4 text-[#21b1db]" />
                  {isCreating ? 'Tulis Artikel Baru' : 'Detail & Edit Artikel'}
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-500 mt-0.5">
                  {isCreating
                    ? 'Isi formulir lengkap untuk mempublikasikan artikel edukasi baru.'
                    : `ID: ${selectedArticle?.id} • Slug: /blog/${selectedArticle?.slug}`}
                </SheetDescription>
              </div>

              {!isCreating && selectedArticle && (
                <Link
                  href={`/blog/${selectedArticle.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#21b1db] hover:underline"
                >
                  <span>Lihat di Web</span>
                  <ExternalLink className="size-3" />
                </Link>
              )}
            </div>
          </SheetHeader>

          {/* Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Foto Sampul Artikel via CmsImageUpload */}
            <CmsImageUpload
              label="Foto Sampul Artikel (Cover Banner)"
              description="Unggah foto berkualitas tinggi untuk kartu artikel dan header artikel blog. Disimpan langsung ke Supabase Storage."
              value={formState.imageUrl}
              onChange={(url) => setFormState({ ...formState, imageUrl: url })}
              aspectRatio="landscape"
            />

            {/* Judul Artikel */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Judul Artikel <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formState.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Misal: Learning with Games? Why not!"
                className="text-xs bg-white dark:bg-slate-900"
              />
            </div>

            {/* Slug URL & Kategori / Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Slug URL (SEO)
                </Label>
                <Input
                  value={formState.slug}
                  onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                  placeholder="learning-with-games-why-not"
                  className="text-xs font-mono bg-white dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Kategori / Tag
                </Label>
                <Input
                  value={formState.tag || ''}
                  onChange={(e) => setFormState({ ...formState, tag: e.target.value })}
                  placeholder="Gamifikasi / Aktivitas Seru"
                  className="text-xs bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            {/* Penulis & Tanggal / Read Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Penulis (Author)
                </Label>
                <Input
                  value={formState.author || ''}
                  onChange={(e) => setFormState({ ...formState, author: e.target.value })}
                  placeholder="Tim Kurikulum Alpha Kids"
                  className="text-xs bg-white dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Tanggal Terbit
                </Label>
                <Input
                  value={formState.publishedAt || ''}
                  onChange={(e) => setFormState({ ...formState, publishedAt: e.target.value })}
                  placeholder="8 Okt 2026"
                  className="text-xs bg-white dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Estimasi Waktu Baca
                </Label>
                <Input
                  value={formState.readTime || ''}
                  onChange={(e) => setFormState({ ...formState, readTime: e.target.value })}
                  placeholder="4 mnt baca"
                  className="text-xs bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            {/* Ringkasan / Excerpt */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Ringkasan / Excerpt <span className="text-red-500">*</span>
              </Label>
              <Textarea
                rows={2}
                value={formState.excerpt}
                onChange={(e) => setFormState({ ...formState, excerpt: e.target.value })}
                placeholder="Ringkasan singkat isi artikel yang menarik perhatian pembaca di kartu blog..."
                className="text-xs leading-relaxed bg-white dark:bg-slate-900"
              />
            </div>

            {/* Konten Lengkap Artikel (Markdown) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Konten Lengkap Artikel (Markdown)
                </Label>
                <span className="text-[11px] font-mono text-slate-400">
                  Mendukung ## Heading, **bold**, - list
                </span>
              </div>
              <Textarea
                rows={12}
                value={formState.content || ''}
                onChange={(e) => setFormState({ ...formState, content: e.target.value })}
                placeholder="## Pengantar&#10;&#10;Tulis isi artikel di sini..."
                className="text-xs font-mono leading-relaxed bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          {/* Drawer Sticky Footer with Dirty State Update Button */}
          <div className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 sticky bottom-0 z-20 flex items-center justify-between gap-3">
            {!isCreating && selectedArticle ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDeletingArticleId(selectedArticle.id)}
                className="rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <Trash2 className="size-3.5 mr-1.5" />
                Hapus Artikel
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSheetOpen(false)}
                className="rounded-xl text-xs font-semibold"
              >
                Tutup
              </Button>

              {/* DYNAMIC UPDATE BUTTON: ONLY ENABLED WHEN DATA HAS BEEN MODIFIED */}
              <Button
                type="button"
                disabled={!isFormDirty || isSaving}
                onClick={handleSaveArticle}
                className={`rounded-xl text-xs font-semibold px-4 transition-all duration-200 ${
                  isFormDirty && !isSaving
                    ? 'bg-[#ef599a] hover:bg-[#df488a] text-white shadow-md shadow-[#ef599a]/25 hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-transparent'
                }`}
              >
                {isSaving ? (
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Save className="size-3.5 mr-1.5" />
                )}
                <span>
                  {isCreating
                    ? 'Terbitkan Artikel Baru'
                    : isFormDirty
                    ? 'Update Artikel'
                    : 'Tidak Ada Perubahan'}
                </span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* =================================================================== */}
      {/* 5. MODAL KONFIRMASI HAPUS ARTIKEL                                  */}
      {/* =================================================================== */}
      <AlertDialog
        open={deletingArticleId !== null}
        onOpenChange={(open) => !open && setDeletingArticleId(null)}
      >
        <AlertDialogContent className="rounded-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold">
              Hapus Artikel?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              Artikel ini akan dihapus secara permanen dari basis data dan tidak lagi tampil di halaman blog publik maupun landing page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl text-xs">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold"
            >
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
