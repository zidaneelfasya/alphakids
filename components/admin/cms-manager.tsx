'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Save,
  ExternalLink,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
import { saveCmsSectionAction } from '@/lib/actions/admin-cms';
import type {
  HeroSectionContent,
  FeaturesSectionContent,
  StorySectionContent,
  MentorsSectionContent,
  BlogSectionContent,
  BlogItem,
  FaqSectionContent,
  CtaSectionContent,
  FaqItem,
  CmsSectionContent,
} from '@/lib/cms';

interface CmsManagerProps {
  initialData: {
    hero: HeroSectionContent;
    features: FeaturesSectionContent;
    story: StorySectionContent;
    mentors: MentorsSectionContent;
    blogs: BlogSectionContent;
    faq: FaqSectionContent;
    cta: CtaSectionContent;
  };
}

export function CmsManager({ initialData }: CmsManagerProps) {
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);

  // Section States
  const [hero, setHero] = useState<HeroSectionContent>(initialData.hero);
  const [features, setFeatures] = useState<FeaturesSectionContent>(initialData.features);
  const [story, setStory] = useState<StorySectionContent>(initialData.story);
  const [mentors, setMentors] = useState<MentorsSectionContent>(initialData.mentors);
  const [blogs, setBlogs] = useState<BlogSectionContent>(initialData.blogs);
  const [faq, setFaq] = useState<FaqSectionContent>(initialData.faq);
  const [cta, setCta] = useState<CtaSectionContent>(initialData.cta);

  // Modal Deletion States
  const [deletingBlogIdx, setDeletingBlogIdx] = useState<number | null>(null);
  const [deletingFaqIdx, setDeletingFaqIdx] = useState<number | null>(null);

  const handleSave = async (sectionKey: string, content: CmsSectionContent) => {
    setIsSaving(true);
    try {
      const res = await saveCmsSectionAction(sectionKey, content);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan data CMS');
    } finally {
      setIsSaving(false);
    }
  };

  // Blog Handlers
  const addBlogItem = () => {
    setBlogs((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        {
          id: Date.now().toString(),
          title: 'Judul Artikel Baru',
          slug: 'judul-artikel-baru',
          excerpt: 'Ringkasan singkat tentang topik artikel yang dibahas.',
          imageUrl: '/assets/img/kid-tablet.png',
          tag: 'Edukasi',
          readTime: '3 mnt baca',
        },
      ],
    }));
    toast.success('Artikel baru ditambahkan ke daftar');
  };

  const confirmRemoveBlogItem = () => {
    if (deletingBlogIdx === null) return;
    setBlogs((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== deletingBlogIdx),
    }));
    setDeletingBlogIdx(null);
    toast.success('Artikel dihapus dari formulir. Klik Simpan untuk memperbarui database.');
  };

  const updateBlogItem = (index: number, field: keyof BlogItem, value: string) => {
    setBlogs((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  // FAQ Handlers
  const addFaqItem = () => {
    setFaq((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          question: 'Pertanyaan baru?',
          answer: 'Jawaban penjelasan untuk pertanyaan tersebut.',
        },
      ],
    }));
    toast.success('Pertanyaan baru ditambahkan ke daftar');
  };

  const confirmRemoveFaqItem = () => {
    if (deletingFaqIdx === null) return;
    setFaq((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== deletingFaqIdx),
    }));
    setDeletingFaqIdx(null);
    toast.success('Pertanyaan dihapus dari formulir. Klik Simpan untuk memperbarui database.');
  };

  const updateFaqItem = (index: number, field: keyof FaqItem, value: string) => {
    setFaq((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const renderSaveButton = (sectionKey: string, content: CmsSectionContent) => (
    <Button
      onClick={() => handleSave(sectionKey, content)}
      disabled={isSaving}
      className="bg-[#21b1db] hover:bg-[#1ca0c7] text-white font-semibold text-xs rounded-xl shadow-xs transition-all"
    >
      {isSaving ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
          Menyimpan...
        </>
      ) : (
        <>
          <Save className="w-3.5 h-3.5 mr-1.5" />
          Simpan Perubahan
        </>
      )}
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* 1. Clean Professional Header (Senada dengan admin menu lain) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/70 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold font-sans text-slate-900 dark:text-white">
            Kelola Konten Halaman Depan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">
            Atur teks, materi unggulan, artikel, profil mentor, dan FAQ halaman depan secara langsung.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="rounded-xl text-xs font-semibold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#21b1db] hover:border-[#21b1db]/40"
          asChild
        >
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Pratinjau Halaman
          </a>
        </Button>
      </div>

      {/* 2. Text-Only Segmented Tabs (Anti-Slop: Tanpa icon dekoratif berlebih) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-2xl flex flex-wrap gap-1 h-auto border border-slate-200/80 dark:border-slate-700/80">
          <TabsTrigger
            value="hero"
            className="rounded-xl text-xs font-semibold px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-[#21b1db] data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-900"
          >
            Hero Section
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="rounded-xl text-xs font-semibold px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-[#21b1db] data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-900"
          >
            3 Kartu Fitur
          </TabsTrigger>
          <TabsTrigger
            value="story"
            className="rounded-xl text-xs font-semibold px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-[#21b1db] data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-900"
          >
            Keunggulan
          </TabsTrigger>
          <TabsTrigger
            value="blogs"
            className="rounded-xl text-xs font-semibold px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-[#21b1db] data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-900"
          >
            Blog & Artikel
          </TabsTrigger>
          <TabsTrigger
            value="mentors"
            className="rounded-xl text-xs font-semibold px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-[#21b1db] data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-900"
          >
            Kakak Mentor
          </TabsTrigger>
          <TabsTrigger
            value="faq"
            className="rounded-xl text-xs font-semibold px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-[#21b1db] data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-900"
          >
            FAQ
          </TabsTrigger>
          <TabsTrigger
            value="cta"
            className="rounded-xl text-xs font-semibold px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-[#21b1db] data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-900"
          >
            Call To Action
          </TabsTrigger>
        </TabsList>

        {/* ================================================================= */}
        {/* TAB 1: HERO SECTION                                               */}
        {/* ================================================================= */}
        <TabsContent value="hero">
          <Card className="border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Pengaturan Hero Section
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Teks headline, subjudul, tombol aksi utama, dan metrik kepercayaan di bagian atas halaman.
                </CardDescription>
              </div>
              {renderSaveButton('hero', hero)}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Grup: Headline & Teks */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Headline & Teks Utama
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Badge Atas</Label>
                    <Input
                      value={hero.badgeText}
                      onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
                      placeholder="Contoh: Platform Belajar Digital Anak #1"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Teks Stempel Lingkar</Label>
                    <Input
                      value={hero.stampText}
                      onChange={(e) => setHero({ ...hero, stampText: e.target.value })}
                      placeholder="ALPHA KIDS • LEARNING & DISCOVERY"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Judul Bagian 1</Label>
                    <Input
                      value={hero.titlePart1}
                      onChange={(e) => setHero({ ...hero, titlePart1: e.target.value })}
                      placeholder="Tempat terbaik untuk"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Kata Highlight (Aksen)</Label>
                    <Input
                      value={hero.titleHighlight}
                      onChange={(e) => setHero({ ...hero, titleHighlight: e.target.value })}
                      placeholder="belajar dan berkarya"
                      className="text-xs font-semibold text-[#21b1db]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Judul Bagian 2</Label>
                    <Input
                      value={hero.titlePart2}
                      onChange={(e) => setHero({ ...hero, titlePart2: e.target.value })}
                      placeholder="anak hebat"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Subjudul / Deskripsi Lengkap</Label>
                  <Textarea
                    rows={3}
                    value={hero.subtitle}
                    onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                    placeholder="Deskripsi singkat yang menjelaskan nilai platform..."
                    className="text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Grup: Tombol Aksi (CTA) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Tombol Aksi (Call To Action)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Teks Tombol Utama</Label>
                    <Input
                      value={hero.ctaPrimaryText}
                      onChange={(e) => setHero({ ...hero, ctaPrimaryText: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Tautan Tombol Utama (URL)</Label>
                    <Input
                      value={hero.ctaPrimaryLink}
                      onChange={(e) => setHero({ ...hero, ctaPrimaryLink: e.target.value })}
                      className="text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Teks Tombol Sekunder</Label>
                    <Input
                      value={hero.ctaSecondaryText}
                      onChange={(e) => setHero({ ...hero, ctaSecondaryText: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Tautan Tombol Sekunder (WA URL)</Label>
                    <Input
                      value={hero.ctaSecondaryLink}
                      onChange={(e) => setHero({ ...hero, ctaSecondaryLink: e.target.value })}
                      className="text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Grup: Metrik Kepercayaan */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Metrik & Bukti Sosial
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Angka Statistik</Label>
                    <Input
                      value={hero.statsCount}
                      onChange={(e) => setHero({ ...hero, statsCount: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Label Statistik</Label>
                    <Input
                      value={hero.statsLabel}
                      onChange={(e) => setHero({ ...hero, statsLabel: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Skor Rating</Label>
                    <Input
                      value={hero.ratingScore}
                      onChange={(e) => setHero({ ...hero, ratingScore: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Ulasan Orang Tua</Label>
                    <Input
                      value={hero.ratingReviewCount}
                      onChange={(e) => setHero({ ...hero, ratingReviewCount: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================= */}
        {/* TAB 2: 3 KARTU FITUR                                              */}
        {/* ================================================================= */}
        <TabsContent value="features">
          <Card className="border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Pengaturan 3 Kartu Fitur Unggulan
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Teks pembuka dan 3 kartu fitur interaktif (Quiz, Aktivitas Kreatif, Belajar dengan Game).
                </CardDescription>
              </div>
              {renderSaveButton('features', features)}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Header Bagian */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Badge Bagian</Label>
                    <Input
                      value={features.badge}
                      onChange={(e) => setFeatures({ ...features, badge: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs font-medium">Judul Utama</Label>
                    <Input
                      value={features.title}
                      onChange={(e) => setFeatures({ ...features, title: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Subjudul Bagian</Label>
                  <Textarea
                    rows={2}
                    value={features.subtitle}
                    onChange={(e) => setFeatures({ ...features, subtitle: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* 3 Kartu Sub-item (Flat Neutral Surfaces) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Konten Kartu Interaktif
                </h3>

                {/* Kartu 1 */}
                <div className="p-4.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Kartu 1: Quiz & Misi
                    </span>
                    <span className="text-[11px] text-slate-400">Aksen Alpha Cyan</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Judul</Label>
                      <Input
                        value={features.card1Title}
                        onChange={(e) => setFeatures({ ...features, card1Title: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Tag / Keterangan</Label>
                      <Input
                        value={features.card1Tag}
                        onChange={(e) => setFeatures({ ...features, card1Tag: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Deskripsi</Label>
                    <Textarea
                      rows={2}
                      value={features.card1Desc}
                      onChange={(e) => setFeatures({ ...features, card1Desc: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Kartu 2 */}
                <div className="p-4.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Kartu 2: Coding & Robotika
                    </span>
                    <span className="text-[11px] text-slate-400">Aksen Alpha Pink</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Judul</Label>
                      <Input
                        value={features.card2Title}
                        onChange={(e) => setFeatures({ ...features, card2Title: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Tag / Keterangan</Label>
                      <Input
                        value={features.card2Tag}
                        onChange={(e) => setFeatures({ ...features, card2Tag: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Deskripsi</Label>
                    <Textarea
                      rows={2}
                      value={features.card2Desc}
                      onChange={(e) => setFeatures({ ...features, card2Desc: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Kartu 3 */}
                <div className="p-4.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Kartu 3: Belajar dengan Game
                    </span>
                    <span className="text-[11px] text-slate-400">Aksen Alpha Yellow</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Judul</Label>
                      <Input
                        value={features.card3Title}
                        onChange={(e) => setFeatures({ ...features, card3Title: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Tag / Keterangan</Label>
                      <Input
                        value={features.card3Tag}
                        onChange={(e) => setFeatures({ ...features, card3Tag: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Deskripsi</Label>
                    <Textarea
                      rows={2}
                      value={features.card3Desc}
                      onChange={(e) => setFeatures({ ...features, card3Desc: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================= */}
        {/* TAB 3: KEUNGGULAN (STORY)                                         */}
        {/* ================================================================= */}
        <TabsContent value="story">
          <Card className="border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Pengaturan Bagian Keunggulan (Story)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Headline materi menyenangkan, narasi deskripsi, dan 4 poin keunggulan utama.
                </CardDescription>
              </div>
              {renderSaveButton('story', story)}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Badge</Label>
                    <Input
                      value={story.badge}
                      onChange={(e) => setStory({ ...story, badge: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Judul Utama</Label>
                    <Input
                      value={story.title}
                      onChange={(e) => setStory({ ...story, title: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Kata Highlight (Loop Kuning)</Label>
                    <Input
                      value={story.titleHighlight}
                      onChange={(e) => setStory({ ...story, titleHighlight: e.target.value })}
                      className="text-xs font-semibold text-[#ef599a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Paragraf 1</Label>
                    <Textarea
                      rows={3}
                      value={story.desc1}
                      onChange={(e) => setStory({ ...story, desc1: e.target.value })}
                      className="text-xs leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Paragraf 2</Label>
                    <Textarea
                      rows={3}
                      value={story.desc2}
                      onChange={(e) => setStory({ ...story, desc2: e.target.value })}
                      className="text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* 4 Poin Keunggulan */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  4 Poin Keunggulan Utama
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Poin 1</Label>
                    <Input
                      value={story.point1}
                      onChange={(e) => setStory({ ...story, point1: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Poin 2</Label>
                    <Input
                      value={story.point2}
                      onChange={(e) => setStory({ ...story, point2: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Poin 3</Label>
                    <Input
                      value={story.point3}
                      onChange={(e) => setStory({ ...story, point3: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Poin 4</Label>
                    <Input
                      value={story.point4}
                      onChange={(e) => setStory({ ...story, point4: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================= */}
        {/* TAB 4: BLOG & ARTIKEL                                             */}
        {/* ================================================================= */}
        <TabsContent value="blogs">
          <Card className="border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Pengaturan Bagian Blog & Artikel
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Daftar artikel edukasi dan panduan belajar untuk orang tua.
                </CardDescription>
              </div>
              {renderSaveButton('blogs', blogs)}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Header Bagian */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Badge Bagian</Label>
                    <Input
                      value={blogs.badge}
                      onChange={(e) => setBlogs({ ...blogs, badge: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Judul Bagian Depan</Label>
                    <Input
                      value={blogs.titlePart1}
                      onChange={(e) => setBlogs({ ...blogs, titlePart1: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Judul Highlight</Label>
                    <Input
                      value={blogs.titleHighlight}
                      onChange={(e) => setBlogs({ ...blogs, titleHighlight: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Subjudul Deskripsi</Label>
                  <Textarea
                    rows={2}
                    value={blogs.subtitle}
                    onChange={(e) => setBlogs({ ...blogs, subtitle: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Daftar Artikel Blog */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Daftar Artikel ({blogs.items?.length || 0})
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Kelola kartu artikel yang tampil di bagian blog.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addBlogItem}
                    className="rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-[#21b1db] hover:text-[#21b1db]"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Tambah Artikel
                  </Button>
                </div>

                {(!blogs.items || blogs.items.length === 0) ? (
                  <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                    Belum ada artikel yang ditambahkan. Klik tombol di atas untuk membuat artikel baru.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {blogs.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              Artikel #{idx + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingBlogIdx(idx)}
                              className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 h-7 w-7 p-0"
                              title="Hapus artikel"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Judul Artikel</Label>
                            <Input
                              placeholder="Judul artikel..."
                              value={item.title}
                              onChange={(e) => updateBlogItem(idx, 'title', e.target.value)}
                              className="text-xs"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Kategori / Tag</Label>
                              <Input
                                placeholder="Edukasi"
                                value={item.tag || ''}
                                onChange={(e) => updateBlogItem(idx, 'tag', e.target.value)}
                                className="text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Waktu Baca</Label>
                              <Input
                                placeholder="3 mnt baca"
                                value={item.readTime || ''}
                                onChange={(e) => updateBlogItem(idx, 'readTime', e.target.value)}
                                className="text-xs"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Path Gambar</Label>
                            <Input
                              placeholder="/assets/img/kid-tablet.png"
                              value={item.imageUrl}
                              onChange={(e) => updateBlogItem(idx, 'imageUrl', e.target.value)}
                              className="text-xs font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Ringkasan / Excerpt</Label>
                            <Textarea
                              rows={3}
                              placeholder="Ringkasan isi artikel..."
                              value={item.excerpt}
                              onChange={(e) => updateBlogItem(idx, 'excerpt', e.target.value)}
                              className="text-xs leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================= */}
        {/* TAB 5: KAKAK MENTOR                                               */}
        {/* ================================================================= */}
        <TabsContent value="mentors">
          <Card className="border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Pengaturan Bagian Kakak Mentor
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Informasi profil mentor ahli yang mendampingi siswa di Alpha Kids.
                </CardDescription>
              </div>
              {renderSaveButton('mentors', mentors)}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Header Bagian */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Badge Bagian</Label>
                    <Input
                      value={mentors.badge}
                      onChange={(e) => setMentors({ ...mentors, badge: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Judul Utama</Label>
                    <Input
                      value={mentors.title}
                      onChange={(e) => setMentors({ ...mentors, title: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Subjudul Bagian</Label>
                  <Textarea
                    rows={2}
                    value={mentors.subtitle}
                    onChange={(e) => setMentors({ ...mentors, subtitle: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* 3 Profil Mentor */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Profil Mentor Utama
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Mentor 1 */}
                  <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                    <div className="pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Mentor 1</span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Nama Lengkap</Label>
                      <Input
                        value={mentors.mentor1Name}
                        onChange={(e) => setMentors({ ...mentors, mentor1Name: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Peran / Keahlian</Label>
                      <Input
                        value={mentors.mentor1Role}
                        onChange={(e) => setMentors({ ...mentors, mentor1Role: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Keterangan / Tag</Label>
                      <Input
                        value={mentors.mentor1Tag}
                        onChange={(e) => setMentors({ ...mentors, mentor1Tag: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Mentor 2 */}
                  <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                    <div className="pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Mentor 2</span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Nama Lengkap</Label>
                      <Input
                        value={mentors.mentor2Name}
                        onChange={(e) => setMentors({ ...mentors, mentor2Name: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Peran / Keahlian</Label>
                      <Input
                        value={mentors.mentor2Role}
                        onChange={(e) => setMentors({ ...mentors, mentor2Role: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Keterangan / Tag</Label>
                      <Input
                        value={mentors.mentor2Tag}
                        onChange={(e) => setMentors({ ...mentors, mentor2Tag: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Mentor 3 */}
                  <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                    <div className="pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Mentor 3</span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Nama Lengkap</Label>
                      <Input
                        value={mentors.mentor3Name}
                        onChange={(e) => setMentors({ ...mentors, mentor3Name: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Peran / Keahlian</Label>
                      <Input
                        value={mentors.mentor3Role}
                        onChange={(e) => setMentors({ ...mentors, mentor3Role: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Keterangan / Tag</Label>
                      <Input
                        value={mentors.mentor3Tag}
                        onChange={(e) => setMentors({ ...mentors, mentor3Tag: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================= */}
        {/* TAB 6: FAQ                                                        */}
        {/* ================================================================= */}
        <TabsContent value="faq">
          <Card className="border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Pengaturan Tanya Jawab (FAQ)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Daftar pertanyaan dan jawaban yang sering diajukan orang tua.
                </CardDescription>
              </div>
              {renderSaveButton('faq', faq)}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Header Bagian */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Badge</Label>
                    <Input
                      value={faq.badge}
                      onChange={(e) => setFaq({ ...faq, badge: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Judul Utama</Label>
                    <Input
                      value={faq.title}
                      onChange={(e) => setFaq({ ...faq, title: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Subjudul Bagian</Label>
                  <Textarea
                    rows={2}
                    value={faq.subtitle}
                    onChange={(e) => setFaq({ ...faq, subtitle: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Daftar Pertanyaan */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Daftar Pertanyaan ({faq.items.length})
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Pertanyaan akan ditampilkan berurutan sesuai urutan di bawah.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFaqItem}
                    className="rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-[#21b1db] hover:text-[#21b1db]"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Tambah Pertanyaan
                  </Button>
                </div>

                <div className="space-y-3">
                  {faq.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Pertanyaan #{idx + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingFaqIdx(idx)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 h-7 w-7 p-0"
                          title="Hapus pertanyaan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Pertanyaan</Label>
                        <Input
                          placeholder="Masukkan pertanyaan..."
                          value={item.question}
                          onChange={(e) => updateFaqItem(idx, 'question', e.target.value)}
                          className="text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Jawaban</Label>
                        <Textarea
                          rows={2}
                          placeholder="Masukkan jawaban..."
                          value={item.answer}
                          onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                          className="text-xs leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================= */}
        {/* TAB 7: CALL TO ACTION                                             */}
        {/* ================================================================= */}
        <TabsContent value="cta">
          <Card className="border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Pengaturan Call To Action (CTA)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Banner ajakan penutup sebelum bagian footer.
                </CardDescription>
              </div>
              {renderSaveButton('cta', cta)}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Badge</Label>
                    <Input
                      value={cta.badge}
                      onChange={(e) => setCta({ ...cta, badge: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Judul Utama</Label>
                    <Input
                      value={cta.title}
                      onChange={(e) => setCta({ ...cta, title: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Subjudul / Pesan Penutup</Label>
                  <Textarea
                    rows={2}
                    value={cta.subtitle}
                    onChange={(e) => setCta({ ...cta, subtitle: e.target.value })}
                    className="text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Teks Tombol Utama</Label>
                    <Input
                      value={cta.btnText}
                      onChange={(e) => setCta({ ...cta, btnText: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Tautan Tombol Utama (URL)</Label>
                    <Input
                      value={cta.btnLink}
                      onChange={(e) => setCta({ ...cta, btnLink: e.target.value })}
                      className="text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Tautan WhatsApp Konsultasi</Label>
                    <Input
                      value={cta.consultationLink}
                      onChange={(e) => setCta({ ...cta, consultationLink: e.target.value })}
                      className="text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* =================================================================== */}
      {/* DIALOG KONFIRMASI HAPUS (ANTI-SLOP: Modal Dialog Standar)           */}
      {/* =================================================================== */}

      {/* 1. Modal Hapus Artikel Blog */}
      <AlertDialog
        open={deletingBlogIdx !== null}
        onOpenChange={(open) => !open && setDeletingBlogIdx(null)}
      >
        <AlertDialogContent className="rounded-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold">
              Hapus Artikel?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              Artikel ini akan dihapus dari daftar. Jangan lupa klik &quot;Simpan Perubahan&quot; pada tab Blog agar pembaruan tersimpan ke server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl text-xs">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveBlogItem}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold"
            >
              Hapus Artikel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 2. Modal Hapus FAQ */}
      <AlertDialog
        open={deletingFaqIdx !== null}
        onOpenChange={(open) => !open && setDeletingFaqIdx(null)}
      >
        <AlertDialogContent className="rounded-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold">
              Hapus Pertanyaan FAQ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              Pertanyaan ini akan dihapus dari daftar FAQ. Jangan lupa klik &quot;Simpan Perubahan&quot; pada tab FAQ agar pembaruan tersimpan ke server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl text-xs">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveFaqItem}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold"
            >
              Hapus Pertanyaan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
