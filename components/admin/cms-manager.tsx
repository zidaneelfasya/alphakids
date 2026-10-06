'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Save,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  HelpCircle,
  Users,
  Layout,
  BookOpen,
  Newspaper,
  MousePointerClick,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  };

  const removeBlogItem = (index: number) => {
    setBlogs((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
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
  };

  const removeFaqItem = (index: number) => {
    setFaq((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateFaqItem = (index: number, field: keyof FaqItem, value: string) => {
    setFaq((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-purple-50 via-white to-amber-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/80 text-purple-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Content Management System (CMS)
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">
            Kelola Konten Landing Page
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Ubah teks, judul, statistik, ulasan, mentor, dan FAQ halaman depan secara dinamis tanpa perlu deploy ulang.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50"
            asChild
          >
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Lihat Halaman Utama
            </a>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100/80 p-1.5 rounded-2xl flex flex-wrap gap-1 h-auto border border-slate-200/80">
          <TabsTrigger
            value="hero"
            className="rounded-xl text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
          >
            <Layout className="w-4 h-4 mr-1.5" />
            Hero Section
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="rounded-xl text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            3 Kartu Fitur
          </TabsTrigger>
          <TabsTrigger
            value="story"
            className="rounded-xl text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
          >
            <BookOpen className="w-4 h-4 mr-1.5" />
            Mengapa Alpha Kids
          </TabsTrigger>
          <TabsTrigger
            value="blogs"
            className="rounded-xl text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-sm"
          >
            <Newspaper className="w-4 h-4 mr-1.5" />
            Blog / Artikel
          </TabsTrigger>
          <TabsTrigger
            value="mentors"
            className="rounded-xl text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
          >
            <Users className="w-4 h-4 mr-1.5" />
            Kakak Mentor
          </TabsTrigger>
          <TabsTrigger
            value="faq"
            className="rounded-xl text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
          >
            <HelpCircle className="w-4 h-4 mr-1.5" />
            FAQ
          </TabsTrigger>
          <TabsTrigger
            value="cta"
            className="rounded-xl text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
          >
            <MousePointerClick className="w-4 h-4 mr-1.5" />
            Call To Action
          </TabsTrigger>
        </TabsList>

        {/* 1. HERO TAB */}
        <TabsContent value="hero">
          <Card className="border-purple-100 rounded-2xl shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Bagian Utama (Hero Section)
                  </CardTitle>
                  <CardDescription>
                    Pintu gerbang utama landing page dengan tipografi asimetris, CTA, dan elemen visual.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => handleSave('hero', hero)}
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Hero'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Badge Atas</label>
                  <Input
                    value={hero.badgeText}
                    onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
                    placeholder="Contoh: ⭐ Platform Belajar Digital Anak #1..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Teks Stamp Lingkar Berputar</label>
                  <Input
                    value={hero.stampText}
                    onChange={(e) => setHero({ ...hero, stampText: e.target.value })}
                    placeholder="ALPHA KIDS • LEARNING & DISCOVERY • "
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Judul Bagian 1</label>
                  <Input
                    value={hero.titlePart1}
                    onChange={(e) => setHero({ ...hero, titlePart1: e.target.value })}
                    placeholder="Petualangan Seru"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-purple-700">Kata Highlight (Warna Ungu/Kuning)</label>
                  <Input
                    value={hero.titleHighlight}
                    onChange={(e) => setHero({ ...hero, titleHighlight: e.target.value })}
                    placeholder="Belajar & Berkarya"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Judul Bagian 2</label>
                  <Input
                    value={hero.titlePart2}
                    onChange={(e) => setHero({ ...hero, titlePart2: e.target.value })}
                    placeholder="Masa Depan Hebat!"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Subjudul / Deskripsi Utama</label>
                <Textarea
                  rows={3}
                  value={hero.subtitle}
                  onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                  placeholder="Deskripsi singkat yang menggugah..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Teks Tombol Utama</label>
                  <Input
                    value={hero.ctaPrimaryText}
                    onChange={(e) => setHero({ ...hero, ctaPrimaryText: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Link Tombol Utama</label>
                  <Input
                    value={hero.ctaPrimaryLink}
                    onChange={(e) => setHero({ ...hero, ctaPrimaryLink: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Teks Tombol Sekunder (WA)</label>
                  <Input
                    value={hero.ctaSecondaryText}
                    onChange={(e) => setHero({ ...hero, ctaSecondaryText: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Link Tombol Sekunder (WA URL)</label>
                  <Input
                    value={hero.ctaSecondaryLink}
                    onChange={(e) => setHero({ ...hero, ctaSecondaryLink: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Angka Statistik</label>
                  <Input
                    value={hero.statsCount}
                    onChange={(e) => setHero({ ...hero, statsCount: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Label Statistik</label>
                  <Input
                    value={hero.statsLabel}
                    onChange={(e) => setHero({ ...hero, statsLabel: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Skor Rating</label>
                  <Input
                    value={hero.ratingScore}
                    onChange={(e) => setHero({ ...hero, ratingScore: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Ulasan Orang Tua</label>
                  <Input
                    value={hero.ratingReviewCount}
                    onChange={(e) => setHero({ ...hero, ratingReviewCount: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. 3 CARDS FITUR */}
        <TabsContent value="features">
          <Card className="border-purple-100 rounded-2xl shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    3 Kartu Fitur Unggulan (WonderKids Style)
                  </CardTitle>
                  <CardDescription>
                    Tiga kartu warna-warni kontras (Cyan/Lavender, Royal Purple, Sunny Yellow).
                  </CardDescription>
                </div>
                <Button
                  onClick={() => handleSave('features', features)}
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Fitur'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Badge Bagian</label>
                  <Input
                    value={features.badge}
                    onChange={(e) => setFeatures({ ...features, badge: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Judul Utama</label>
                  <Input
                    value={features.title}
                    onChange={(e) => setFeatures({ ...features, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Subjudul</label>
                <Textarea
                  rows={2}
                  value={features.subtitle}
                  onChange={(e) => setFeatures({ ...features, subtitle: e.target.value })}
                />
              </div>

              {/* Card 1 */}
              <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-100 space-y-3">
                <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">
                  Kartu 1 (Cyan / Lavender — Quiz & Misi)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Judul Kartu 1"
                    value={features.card1Title}
                    onChange={(e) => setFeatures({ ...features, card1Title: e.target.value })}
                  />
                  <Input
                    placeholder="Tag (contoh: #MisiSeru)"
                    value={features.card1Tag}
                    onChange={(e) => setFeatures({ ...features, card1Tag: e.target.value })}
                  />
                </div>
                <Textarea
                  rows={2}
                  placeholder="Deskripsi Kartu 1"
                  value={features.card1Desc}
                  onChange={(e) => setFeatures({ ...features, card1Desc: e.target.value })}
                />
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-3">
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                  Kartu 2 (Deep Royal Purple — Coding & Kreativitas)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Judul Kartu 2"
                    value={features.card2Title}
                    onChange={(e) => setFeatures({ ...features, card2Title: e.target.value })}
                  />
                  <Input
                    placeholder="Tag (contoh: #KreatorMuda)"
                    value={features.card2Tag}
                    onChange={(e) => setFeatures({ ...features, card2Tag: e.target.value })}
                  />
                </div>
                <Textarea
                  rows={2}
                  placeholder="Deskripsi Kartu 2"
                  value={features.card2Desc}
                  onChange={(e) => setFeatures({ ...features, card2Desc: e.target.value })}
                />
              </div>

              {/* Card 3 */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-3">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Kartu 3 (Sunny Yellow — Sertifikat & Portofolio)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Judul Kartu 3"
                    value={features.card3Title}
                    onChange={(e) => setFeatures({ ...features, card3Title: e.target.value })}
                  />
                  <Input
                    placeholder="Tag (contoh: #JuaraAlpha)"
                    value={features.card3Tag}
                    onChange={(e) => setFeatures({ ...features, card3Tag: e.target.value })}
                  />
                </div>
                <Textarea
                  rows={2}
                  placeholder="Deskripsi Kartu 3"
                  value={features.card3Desc}
                  onChange={(e) => setFeatures({ ...features, card3Desc: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. MENGAPA ALPHA KIDS (STORY) */}
        <TabsContent value="story">
          <Card className="border-purple-100 rounded-2xl shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Mengapa Alpha Kids (Story & Value Proposition)
                  </CardTitle>
                  <CardDescription>
                    Penjelasan mendalam dengan loop highlight kuning dan 4 poin keunggulan utama.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => handleSave('story', story)}
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Story'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Badge</label>
                  <Input
                    value={story.badge}
                    onChange={(e) => setStory({ ...story, badge: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Judul Utama</label>
                  <Input
                    value={story.title}
                    onChange={(e) => setStory({ ...story, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-600">Kata Highlight Kuning</label>
                  <Input
                    value={story.titleHighlight}
                    onChange={(e) => setStory({ ...story, titleHighlight: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Paragraf 1</label>
                  <Textarea
                    rows={3}
                    value={story.desc1}
                    onChange={(e) => setStory({ ...story, desc1: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Paragraf 2</label>
                  <Textarea
                    rows={3}
                    value={story.desc2}
                    onChange={(e) => setStory({ ...story, desc2: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">4 Poin Keunggulan Utama</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <Input
                      value={story.point1}
                      onChange={(e) => setStory({ ...story, point1: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <Input
                      value={story.point2}
                      onChange={(e) => setStory({ ...story, point2: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <Input
                      value={story.point3}
                      onChange={(e) => setStory({ ...story, point3: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <Input
                      value={story.point4}
                      onChange={(e) => setStory({ ...story, point4: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3.5. READ OUR BLOG */}
        <TabsContent value="blogs">
          <Card className="border-pink-100 rounded-2xl shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Read Our Blog (Artikel & Berita)
                  </CardTitle>
                  <CardDescription>
                    Bagian artikel edukasi dan tips belajar dengan tema warna Alpha Pink di bawah Cerita Kami.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => handleSave('blogs', blogs)}
                  disabled={isSaving}
                  className="bg-[#ef599a] hover:bg-[#df488a] text-white rounded-xl shadow-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Blog'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Badge Bagian</label>
                  <Input
                    value={blogs.badge}
                    onChange={(e) => setBlogs({ ...blogs, badge: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Judul Bagian Depan</label>
                  <Input
                    value={blogs.titlePart1}
                    onChange={(e) => setBlogs({ ...blogs, titlePart1: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Judul Highlight (Pink)</label>
                  <Input
                    value={blogs.titleHighlight}
                    onChange={(e) => setBlogs({ ...blogs, titleHighlight: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Subjudul Deskripsi</label>
                <Textarea
                  rows={2}
                  value={blogs.subtitle}
                  onChange={(e) => setBlogs({ ...blogs, subtitle: e.target.value })}
                />
              </div>

              {/* Daftar Artikel Blog */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Daftar Artikel ({blogs.items?.length || 0})
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addBlogItem}
                    className="rounded-xl border-dashed border-pink-300 text-[#ef599a] hover:bg-pink-50"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Tambah Artikel
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(blogs.items || []).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3 relative group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                          <span className="text-xs font-bold text-[#ef599a]">
                            Artikel #{idx + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBlogItem(idx)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-slate-600">Judul Artikel</label>
                          <Input
                            placeholder="Judul artikel..."
                            value={item.title}
                            onChange={(e) => updateBlogItem(idx, 'title', e.target.value)}
                            className="text-xs font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-slate-600">Kategori / Tag</label>
                            <Input
                              placeholder="Tag..."
                              value={item.tag || ''}
                              onChange={(e) => updateBlogItem(idx, 'tag', e.target.value)}
                              className="text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-slate-600">Waktu Baca</label>
                            <Input
                              placeholder="3 mnt baca"
                              value={item.readTime || ''}
                              onChange={(e) => updateBlogItem(idx, 'readTime', e.target.value)}
                              className="text-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-slate-600">Path Gambar / Foto</label>
                          <Input
                            placeholder="/assets/img/kid-tablet.png"
                            value={item.imageUrl}
                            onChange={(e) => updateBlogItem(idx, 'imageUrl', e.target.value)}
                            className="text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-slate-600">Ringkasan / Excerpt</label>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. MENTORS */}
        <TabsContent value="mentors">
          <Card className="border-purple-100 rounded-2xl shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Bagian Kakak Mentor (Solid Purple Block)
                  </CardTitle>
                  <CardDescription>
                    Menampilkan mentor inspiratif dengan avatar bulat, deskripsi, dan badge keahlian.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => handleSave('mentors', mentors)}
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Mentor'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Badge Bagian</label>
                  <Input
                    value={mentors.badge}
                    onChange={(e) => setMentors({ ...mentors, badge: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Judul Utama</label>
                  <Input
                    value={mentors.title}
                    onChange={(e) => setMentors({ ...mentors, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Subjudul</label>
                <Textarea
                  rows={2}
                  value={mentors.subtitle}
                  onChange={(e) => setMentors({ ...mentors, subtitle: e.target.value })}
                />
              </div>

              {/* Mentor 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <span className="text-xs font-bold text-purple-700 uppercase">Mentor 1</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Nama Lengkap"
                    value={mentors.mentor1Name}
                    onChange={(e) => setMentors({ ...mentors, mentor1Name: e.target.value })}
                  />
                  <Input
                    placeholder="Peran / Keahlian"
                    value={mentors.mentor1Role}
                    onChange={(e) => setMentors({ ...mentors, mentor1Role: e.target.value })}
                  />
                  <Input
                    placeholder="Keterangan Tag"
                    value={mentors.mentor1Tag}
                    onChange={(e) => setMentors({ ...mentors, mentor1Tag: e.target.value })}
                  />
                </div>
              </div>

              {/* Mentor 2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <span className="text-xs font-bold text-purple-700 uppercase">Mentor 2</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Nama Lengkap"
                    value={mentors.mentor2Name}
                    onChange={(e) => setMentors({ ...mentors, mentor2Name: e.target.value })}
                  />
                  <Input
                    placeholder="Peran / Keahlian"
                    value={mentors.mentor2Role}
                    onChange={(e) => setMentors({ ...mentors, mentor2Role: e.target.value })}
                  />
                  <Input
                    placeholder="Keterangan Tag"
                    value={mentors.mentor2Tag}
                    onChange={(e) => setMentors({ ...mentors, mentor2Tag: e.target.value })}
                  />
                </div>
              </div>

              {/* Mentor 3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <span className="text-xs font-bold text-purple-700 uppercase">Mentor 3</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Nama Lengkap"
                    value={mentors.mentor3Name}
                    onChange={(e) => setMentors({ ...mentors, mentor3Name: e.target.value })}
                  />
                  <Input
                    placeholder="Peran / Keahlian"
                    value={mentors.mentor3Role}
                    onChange={(e) => setMentors({ ...mentors, mentor3Role: e.target.value })}
                  />
                  <Input
                    placeholder="Keterangan Tag"
                    value={mentors.mentor3Tag}
                    onChange={(e) => setMentors({ ...mentors, mentor3Tag: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. FAQ */}
        <TabsContent value="faq">
          <Card className="border-purple-100 rounded-2xl shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Tanya Jawab (FAQ)
                  </CardTitle>
                  <CardDescription>
                    Kelola daftar pertanyaan yang sering diajukan orang tua.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => handleSave('faq', faq)}
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Menyimpan...' : 'Simpan FAQ'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Badge</label>
                  <Input
                    value={faq.badge}
                    onChange={(e) => setFaq({ ...faq, badge: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Judul Utama</label>
                  <Input
                    value={faq.title}
                    onChange={(e) => setFaq({ ...faq, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Subjudul</label>
                <Textarea
                  rows={2}
                  value={faq.subtitle}
                  onChange={(e) => setFaq({ ...faq, subtitle: e.target.value })}
                />
              </div>

              {/* Items List */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Daftar Pertanyaan ({faq.items.length})
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFaqItem}
                    className="rounded-xl border-dashed border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Tambah Pertanyaan
                  </Button>
                </div>

                {faq.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-700">
                        Pertanyaan #{idx + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFaqItem(idx)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Masukkan pertanyaan..."
                      value={item.question}
                      onChange={(e) => updateFaqItem(idx, 'question', e.target.value)}
                    />
                    <Textarea
                      rows={2}
                      placeholder="Masukkan jawaban..."
                      value={item.answer}
                      onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. CALL TO ACTION */}
        <TabsContent value="cta">
          <Card className="border-purple-100 rounded-2xl shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Call To Action (CTA Akhir)
                  </CardTitle>
                  <CardDescription>
                    Banner penutup di bagian bawah halaman sebelum footer.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => handleSave('cta', cta)}
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Menyimpan...' : 'Simpan CTA'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Badge</label>
                  <Input
                    value={cta.badge}
                    onChange={(e) => setCta({ ...cta, badge: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Judul Utama</label>
                  <Input
                    value={cta.title}
                    onChange={(e) => setCta({ ...cta, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Subjudul / Pesan Penutup</label>
                <Textarea
                  rows={2}
                  value={cta.subtitle}
                  onChange={(e) => setCta({ ...cta, subtitle: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Teks Tombol Utama</label>
                  <Input
                    value={cta.btnText}
                    onChange={(e) => setCta({ ...cta, btnText: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Link Tombol Utama</label>
                  <Input
                    value={cta.btnLink}
                    onChange={(e) => setCta({ ...cta, btnLink: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Link Konsultasi WhatsApp</label>
                  <Input
                    value={cta.consultationLink}
                    onChange={(e) => setCta({ ...cta, consultationLink: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
