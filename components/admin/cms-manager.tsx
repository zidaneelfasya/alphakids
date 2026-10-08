'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Save,
  ExternalLink,
  Plus,
  Trash2,
  Loader2,
  Columns2,
  Eye,
  FileEdit,
  ArrowRight,
  BookOpen,
  ChevronDown,
  Check,
  Layout,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CmsPreviewCanvas,
  type DeviceType,
  type PreviewScope,
  type CmsPreviewData,
} from '@/components/admin/cms-preview-canvas';
import { CmsPreviewModal } from '@/components/admin/cms-preview-modal';
import { CmsImageUpload } from '@/components/admin/cms-image-upload';
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
  ContactSectionContent,
  FaqItem,
  CmsSectionContent,
} from '@/lib/cms-types';
import { DEFAULT_CONTACT, DEFAULT_STORY, formatWhatsAppUrl } from '@/lib/cms-types';
import { YellowLoop } from '@/components/landing/wonder-decorations';

interface CmsManagerProps {
  initialData: {
    hero: HeroSectionContent;
    features: FeaturesSectionContent;
    story: StorySectionContent;
    mentors: MentorsSectionContent;
    blogs: BlogSectionContent;
    faq: FaqSectionContent;
    cta: CtaSectionContent;
    contact?: ContactSectionContent;
  };
}

export function CmsManager({ initialData }: CmsManagerProps) {
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);

  // Preview States
  const [viewMode, setViewMode] = useState<'form' | 'split'>('form');
  const [previewDevice, setPreviewDevice] = useState<DeviceType>('desktop');
  const [previewScope, setPreviewScope] = useState<PreviewScope>('section');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Section States
  const [hero, setHero] = useState<HeroSectionContent>(initialData.hero);
  const [features, setFeatures] = useState<FeaturesSectionContent>(initialData.features);
  const [story, setStory] = useState<StorySectionContent>({
    ...DEFAULT_STORY,
    ...initialData.story,
  });
  const [mentors, setMentors] = useState<MentorsSectionContent>(initialData.mentors);
  const [blogs, setBlogs] = useState<BlogSectionContent>(initialData.blogs);
  const [faq, setFaq] = useState<FaqSectionContent>(initialData.faq);
  const [cta, setCta] = useState<CtaSectionContent>(initialData.cta);
  const [contact, setContact] = useState<ContactSectionContent>(
    initialData.contact || DEFAULT_CONTACT
  );

  // Modal Deletion States
  const [deletingFaqIdx, setDeletingFaqIdx] = useState<number | null>(null);

  // Live Preview Data Aggregation (Uncommitted State)
  const previewData: CmsPreviewData = {
    hero,
    features,
    story,
    mentors,
    blogs,
    faq,
    cta,
    contact,
  };

  const getCurrentTabData = (): { key: string; data: CmsSectionContent } => {
    switch (activeTab) {
      case 'hero': return { key: 'hero', data: hero };
      case 'features': return { key: 'features', data: features };
      case 'story': return { key: 'story', data: story };
      case 'blogs': return { key: 'blogs', data: blogs };
      case 'mentors': return { key: 'mentors', data: mentors };
      case 'faq': return { key: 'faq', data: faq };
      case 'cta': return { key: 'cta', data: cta };
      case 'contact': return { key: 'contact', data: contact };
      default: return { key: 'hero', data: hero };
    }
  };

  const handleSaveCurrentTab = () => {
    const current = getCurrentTabData();
    handleSave(current.key, current.data);
  };

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

  // Note: Blog article CRUD is now centralized at /admin/blogs
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

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dropdown Mode Tampilan CMS (Default: Formulir) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-semibold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#21b1db] hover:border-[#21b1db]/40 bg-white dark:bg-slate-900 shadow-xs gap-2"
                title="Pilih mode tampilan CMS"
              >
                <Layout className="w-3.5 h-3.5 text-[#21b1db]" />
                <span>Tampilan</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium border border-slate-200/50 dark:border-slate-700/50">
                  {viewMode === 'form' ? 'Formulir' : 'Split View'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-2xl p-1.5 shadow-lg border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <DropdownMenuLabel className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-2.5 py-1.5">
                Mode Tampilan CMS
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => setViewMode('form')}
                className={`rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer flex items-center justify-between ${
                  viewMode === 'form'
                    ? 'bg-cyan-50 dark:bg-cyan-950/60 text-[#21b1db] font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileEdit className="w-4 h-4 text-[#21b1db]" />
                  <div>
                    <p className="font-semibold text-xs leading-none">Formulir</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Mode edit penuh (Default)</p>
                  </div>
                </div>
                {viewMode === 'form' && <Check className="w-3.5 h-3.5 text-[#21b1db]" />}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setViewMode('split')}
                className={`rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer flex items-center justify-between ${
                  viewMode === 'split'
                    ? 'bg-cyan-50 dark:bg-cyan-950/60 text-[#21b1db] font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Columns2 className="w-4 h-4 text-[#21b1db]" />
                  <div>
                    <p className="font-semibold text-xs leading-none">Split View</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Form & pratinjau samping</p>
                  </div>
                </div>
                {viewMode === 'split' && <Check className="w-3.5 h-3.5 text-[#21b1db]" />}
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 border-slate-100 dark:border-slate-800" />

              <DropdownMenuItem
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-[#ef599a]" />
                  <div>
                    <p className="font-semibold text-xs leading-none">Layar Penuh</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Pratinjau pop-up interaktif</p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-semibold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#21b1db] hover:border-[#21b1db]/40"
            asChild
          >
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Halaman Asli
            </a>
          </Button>
        </div>
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
            Section Story
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
          <TabsTrigger
            value="contact"
            className="rounded-xl text-xs font-semibold px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-[#21b1db] data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-900"
          >
            Kontak & WhatsApp
          </TabsTrigger>
        </TabsList>

        <div className={viewMode === 'split' ? 'grid grid-cols-1 xl:grid-cols-12 gap-6 items-start' : 'space-y-6'}>
          <div className={viewMode === 'split' ? 'xl:col-span-6 space-y-6 min-w-0' : 'space-y-6'}>
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
                  Teks headline utama, aksen warna, subjudul, tombol aksi, dan foto siswa pada bagian paling atas halaman.
                </CardDescription>
              </div>
              {renderSaveButton('hero', hero)}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Grup: Headline Utama (3 Baris Sesuai Desain Asli) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Headline Utama (3 Baris)
                  </h3>
                 
                </div>

                {/* Baris 1: Tempat terbaik untuk */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                  <div className="sm:col-span-8 space-y-1.5">
                    <Label className="text-xs font-medium">Baris 1 - Kalimat Awal</Label>
                    <Input
                      value={hero.titleLine1 || ''}
                      onChange={(e) => setHero({ ...hero, titleLine1: e.target.value })}
                      placeholder="Tempat terbaik"
                      className="text-xs"
                    />
                  </div>
                  <div className="sm:col-span-4 space-y-1.5">
                    <Label className="text-xs font-medium">Sisipan Puzzle</Label>
                    <Input
                      value={hero.titleLine1Suffix || ''}
                      onChange={(e) => setHero({ ...hero, titleLine1Suffix: e.target.value })}
                      placeholder="untuk"
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Baris 2: belajar (Cyan) dan berkarya (Pink) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                  <div className="sm:col-span-5 space-y-1.5">
                    <Label className="text-xs font-medium text-[#21b1db]">
                      Baris 2 - Aksen Cyan
                    </Label>
                    <Input
                      value={hero.titleHighlightCyan || ''}
                      onChange={(e) => setHero({ ...hero, titleHighlightCyan: e.target.value })}
                      placeholder="belajar"
                      className="text-xs font-semibold text-[#21b1db]"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-medium">Penghubung</Label>
                    <Input
                      value={hero.titleConjunction || ''}
                      onChange={(e) => setHero({ ...hero, titleConjunction: e.target.value })}
                      placeholder="dan"
                      className="text-xs text-center"
                    />
                  </div>
                  <div className="sm:col-span-5 space-y-1.5">
                    <Label className="text-xs font-medium text-[#ef599a]">
                      Baris 2 - Aksen Pink (Garis Kuning)
                    </Label>
                    <Input
                      value={hero.titleHighlightPink || ''}
                      onChange={(e) => setHero({ ...hero, titleHighlightPink: e.target.value })}
                      placeholder="berkarya"
                      className="text-xs font-semibold text-[#ef599a]"
                    />
                  </div>
                </div>

                {/* Baris 3: anak hebat */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Baris 3 - Penutup Headline</Label>
                  <Input
                    value={hero.titleLine3 || ''}
                    onChange={(e) => setHero({ ...hero, titleLine3: e.target.value })}
                    placeholder="anak hebat"
                    className="text-xs font-semibold"
                  />
                </div>

                {/* Subjudul / Deskripsi */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Subjudul / Deskripsi Lengkap</Label>
                  <Textarea
                    rows={3}
                    value={hero.subtitle || ''}
                    onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                    placeholder="Deskripsi singkat yang menjelaskan nilai platform..."
                    className="text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Grup: Tombol Aksi (CTA) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Tombol Aksi Utama (Signature Pink Pill)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Teks Tombol</Label>
                    <Input
                      value={hero.ctaText || ''}
                      onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                      placeholder="Mulai Petualangan"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Tautan Tombol (Anchor / URL)</Label>
                    <Input
                      value={hero.ctaLink || ''}
                      onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })}
                      placeholder="#programs"
                      className="text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Grup: Foto Karakter Siswa */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Foto Karakter Siswa Pendamping
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CmsImageUpload
                    label="Foto Sisi Kiri"
                    description="Foto pada Hero sebelah Kiri"
                    value={hero.heroImageLeft}
                    onChange={(url) => setHero({ ...hero, heroImageLeft: url })}
                    aspectRatio="square"
                  />
                  <CmsImageUpload
                    label="Foto Sisi Kanan"
                    description="Foto pada hero sebelah kanan"
                    value={hero.heroImageRight}
                    onChange={(url) => setHero({ ...hero, heroImageRight: url })}
                    aspectRatio="square"
                  />
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
                  Teks judul utama dan isi 3 kartu interaktif (Quiz, Aktivitas Kreatif, Belajar dengan Game).
                </CardDescription>
              </div>
              {renderSaveButton('features', features)}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Header Bagian: Fitur interaktif unggulan kami */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Judul Utama Bagian
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Kata Pembuka</Label>
                    <Input
                      value={features.titlePart1 || ''}
                      onChange={(e) => setFeatures({ ...features, titlePart1: e.target.value })}
                      placeholder="Fitur"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#21b1db]">
                      Kata Aksen (Cyan Miring)
                    </Label>
                    <Input
                      value={features.titleHighlight || ''}
                      onChange={(e) => setFeatures({ ...features, titleHighlight: e.target.value })}
                      placeholder="interaktif"
                      className="text-xs font-semibold text-[#21b1db]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Kata Penutup</Label>
                    <Input
                      value={features.titlePart2 || ''}
                      onChange={(e) => setFeatures({ ...features, titlePart2: e.target.value })}
                      placeholder="unggulan kami"
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 3 Kartu Interaktif */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Konten 3 Kartu Interaktif
                </h3>

                {/* Kartu 1: Alpha Cyan */}
                <div className="p-4.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Kartu 1 (Alpha Cyan #21b1db)
                    </span>
                    <span className="text-[11px] font-semibold text-[#21b1db]">Ikon Quiz</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Judul</Label>
                      <Input
                        value={features.card1Title || ''}
                        onChange={(e) => setFeatures({ ...features, card1Title: e.target.value })}
                        placeholder="Quiz"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Kata Aksen (Miring)</Label>
                      <Input
                        value={features.card1TitleHighlight || ''}
                        onChange={(e) => setFeatures({ ...features, card1TitleHighlight: e.target.value })}
                        placeholder="Interaktif"
                        className="text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Deskripsi</Label>
                    <Textarea
                      rows={2}
                      value={features.card1Desc || ''}
                      onChange={(e) => setFeatures({ ...features, card1Desc: e.target.value })}
                      placeholder="Uji pemahaman si kecil..."
                      className="text-xs leading-relaxed"
                    />
                  </div>
                </div>

                {/* Kartu 2: Alpha Pink */}
                <div className="p-4.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Kartu 2 (Alpha Pink #ef599a)
                    </span>
                    <span className="text-[11px] font-semibold text-[#ef599a]">Ikon Ide / Lampu</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Judul</Label>
                      <Input
                        value={features.card2Title || ''}
                        onChange={(e) => setFeatures({ ...features, card2Title: e.target.value })}
                        placeholder="Aktivitas"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Kata Aksen (Miring)</Label>
                      <Input
                        value={features.card2TitleHighlight || ''}
                        onChange={(e) => setFeatures({ ...features, card2TitleHighlight: e.target.value })}
                        placeholder="Kreatif"
                        className="text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Deskripsi</Label>
                    <Textarea
                      rows={2}
                      value={features.card2Desc || ''}
                      onChange={(e) => setFeatures({ ...features, card2Desc: e.target.value })}
                      placeholder="Eksplorasi coding visual..."
                      className="text-xs leading-relaxed"
                    />
                  </div>
                </div>

                {/* Kartu 3: Alpha Yellow */}
                <div className="p-4.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Kartu 3 (Alpha Yellow #FFCC07)
                    </span>
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Ikon Gamepad</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Judul</Label>
                      <Input
                        value={features.card3Title || ''}
                        onChange={(e) => setFeatures({ ...features, card3Title: e.target.value })}
                        placeholder="Belajar dengan"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Kata Aksen (Miring)</Label>
                      <Input
                        value={features.card3TitleHighlight || ''}
                        onChange={(e) => setFeatures({ ...features, card3TitleHighlight: e.target.value })}
                        placeholder="Game"
                        className="text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Deskripsi</Label>
                    <Textarea
                      rows={2}
                      value={features.card3Desc || ''}
                      onChange={(e) => setFeatures({ ...features, card3Desc: e.target.value })}
                      placeholder="Metode gamifikasi modern..."
                      className="text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================= */}
        {/* TAB 3: SECTION STORY                                              */}
        {/* ================================================================= */}
        <TabsContent value="story">
          <Card className="border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Pengaturan Section Story (Materi Menyenangkan)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Atur teks headline 4-baris, kata highlight dengan lingkaran kuning dinamis, subjudul, tombol aksi, dan gambar piramida bertingkat.
                </CardDescription>
              </div>
              {renderSaveButton('story', story)}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Pratinjau Interaktif Langsung */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-slate-50/80 dark:from-slate-950 dark:to-slate-900 border border-cyan-100 dark:border-slate-800 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#0e7490] dark:text-cyan-400 uppercase tracking-wider bg-[#E8F8FA] dark:bg-cyan-950/60 px-3 py-1 rounded-full mb-4">
                  Pratinjau Langsung Headline & Lingkaran Kuning
                </span>

                <div className="py-2 max-w-xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-sans tracking-tight text-slate-900 dark:text-white leading-[1.3]">
                    <span className="inline-block">{story.titleLine1 || 'Materi belajar yang'}</span>{' '}
                    <br />
                    <span>{story.titleLine2 || 'disediakan'}</span>{' '}
                    <br />
                    <span className="relative inline-flex items-center justify-center align-baseline whitespace-nowrap mx-1.5 my-1.5 px-3.5 py-1">
                      <span className="relative z-10 font-sans italic font-normal text-[#ef599a]">
                        {story.titleHighlight || 'menyenangkan'}
                      </span>
                      <YellowLoop
                        size={story.loopSize || 'normal'}
                        scale={story.loopScale ?? 100}
                      />
                    </span>{' '}
                    <br />
                    <span>{story.titleLine3 || 'untuk anak'}</span>
                  </h2>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                  {story.subtitle ||
                    story.desc1 ||
                    'Jangan khawatir! Buah hati Anda akan menikmati setiap sesi pembelajaran dengan materi interaktif yang mudah dipahami, aplikatif, dan menyenangkan.'}
                </p>

                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#21b1db] text-white text-xs font-semibold shadow-md shadow-[#21b1db]/20">
                    <span>{story.ctaText || 'Pelajari Lebih Lanjut'}</span>
                    <ExternalLink className="size-3.5" />
                  </span>
                </div>
              </div>

              {/* Grup 1: Headline 4 Baris & Kata Highlight */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Headline 4-Baris & Kata Highlight
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Baris 1 Headline</Label>
                    <Input
                      value={story.titleLine1}
                      onChange={(e) => setStory({ ...story, titleLine1: e.target.value })}
                      placeholder="Materi belajar yang"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Baris 2 Headline</Label>
                    <Input
                      value={story.titleLine2}
                      onChange={(e) => setStory({ ...story, titleLine2: e.target.value })}
                      placeholder="disediakan"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Kata Highlight (Dilingkari Kuning)</Label>
                      <span className="text-[10px] text-[#ef599a] font-semibold">Teks Pink Miring</span>
                    </div>
                    <Input
                      value={story.titleHighlight}
                      onChange={(e) => setStory({ ...story, titleHighlight: e.target.value })}
                      placeholder="menyenangkan"
                      className="text-xs font-semibold text-[#ef599a]"
                    />
                    <p className="text-[11px] text-slate-400">
                      Kata ini akan dilingkari oleh goresan lingkaran kuning Alpha Kids.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Baris 4 (Akhir Headline)</Label>
                    <Input
                      value={story.titleLine3}
                      onChange={(e) => setStory({ ...story, titleLine3: e.target.value })}
                      placeholder="untuk anak"
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Grup 2: Pengaturan Dinamis Lingkaran Kuning (Yellow Loop) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Pengaturan Lingkaran Kuning (Dinamis)
                  </h3>
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/60">
                    Menyesuaikan Panjang Teks
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                  {/* Preset Ukuran */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Preset Ukuran Lingkaran</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'compact', label: 'Kompak / Pas' },
                        { id: 'normal', label: 'Standar' },
                        { id: 'spacious', label: 'Longgar' },
                      ].map((preset) => {
                        const isSelected = (story.loopSize || 'normal') === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() =>
                              setStory({
                                ...story,
                                loopSize: preset.id as 'compact' | 'normal' | 'spacious',
                              })
                            }
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                              isSelected
                                ? 'bg-white dark:bg-slate-900 border-[#FFCC07] text-amber-950 dark:text-amber-300 shadow-sm'
                                : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white/50'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Pilih proporsi ruang antara goresan lingkaran dan teks kata highlight.
                    </p>
                  </div>

                  {/* Skala Persentase Lingkaran */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Skala Halus (Perbesaran)</Label>
                      <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {story.loopScale ?? 100}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="140"
                      step="5"
                      value={story.loopScale ?? 100}
                      onChange={(e) =>
                        setStory({ ...story, loopScale: parseInt(e.target.value, 10) })
                      }
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FFCC07]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>80% (Kecil)</span>
                      <span>100% (Normal)</span>
                      <span>140% (Besar)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grup 3: Subjudul / Deskripsi */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <Label className="text-xs font-medium">Subjudul / Deskripsi Lengkap</Label>
                <Textarea
                  rows={3}
                  value={story.subtitle || story.desc1 || ''}
                  onChange={(e) =>
                    setStory({ ...story, subtitle: e.target.value, desc1: e.target.value })
                  }
                  placeholder="Jangan khawatir! Buah hati Anda akan menikmati setiap sesi..."
                  className="text-xs leading-relaxed"
                />
              </div>

              {/* Grup 4: Tombol Aksi (CTA) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Tombol Aksi (Call To Action)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Teks Tombol</Label>
                    <Input
                      value={story.ctaText}
                      onChange={(e) => setStory({ ...story, ctaText: e.target.value })}
                      placeholder="Pelajari Lebih Lanjut"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Tautan Tombol (URL / Anchor)</Label>
                    <Input
                      value={story.ctaLink}
                      onChange={(e) => setStory({ ...story, ctaLink: e.target.value })}
                      placeholder="#programs"
                      className="text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Grup 5: Gambar Piramida Bertingkat di Sisi Kanan */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Gambar Piramida 3 Tingkat (Sisi Kanan)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CmsImageUpload
                    label="Tingkat 1 (Piramida Atas)"
                    description="Foto strip cyan paling atas "
                    value={story.tier1Image}
                    onChange={(url) => setStory({ ...story, tier1Image: url })}
                    aspectRatio="square"
                  />
                  <CmsImageUpload
                    label="Tingkat 2 (Piramida Tengah)"
                    description="Foto strip pink tengah "
                    value={story.tier2Image}
                    onChange={(url) => setStory({ ...story, tier2Image: url })}
                    aspectRatio="square"
                  />
                  <CmsImageUpload
                    label="Tingkat 3 (Piramida Bawah)"
                    description="Foto strip kuning paling bawah "
                    value={story.tier3Image}
                    onChange={(url) => setStory({ ...story, tier3Image: url })}
                    aspectRatio="square"
                  />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Judul Bagian Depan</Label>
                    <Input
                      value={blogs.titlePart1 || ''}
                      onChange={(e) => setBlogs({ ...blogs, titlePart1: e.target.value })}
                      placeholder="Read our"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#ef599a]">Judul Highlight (Pink Miring)</Label>
                    <Input
                      value={blogs.titleHighlight || ''}
                      onChange={(e) => setBlogs({ ...blogs, titleHighlight: e.target.value })}
                      placeholder="blog"
                      className="text-xs font-semibold text-[#ef599a]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Subjudul Deskripsi</Label>
                  <Textarea
                    rows={2}
                    value={blogs.subtitle || ''}
                    onChange={(e) => setBlogs({ ...blogs, subtitle: e.target.value })}
                    placeholder="Temukan artikel pilihan..."
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Daftar Kartu Artikel Blog (Tampilan Card Bersih & Navigasi ke Halaman Kelola Blog) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-pink-50/70 via-white to-pink-50/40 dark:from-pink-950/20 dark:via-slate-900 dark:to-pink-950/10 border border-pink-200/60 dark:border-pink-900/40">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center size-6 rounded-lg bg-[#ef599a] text-white">
                        <BookOpen className="size-3.5" />
                      </span>
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                        Daftar Kartu Artikel ({blogs.items?.length || 0})
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xl">
                      Kartu artikel aktif yang tampil di landing page. Untuk menulis artikel baru, mengubah isi teks/markdown, atau menghapus artikel, silakan buka menu khusus artikel.
                    </p>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="rounded-xl bg-[#ef599a] hover:bg-[#df488a] text-white text-xs font-semibold shrink-0 shadow-sm"
                  >
                    <Link href="/admin/blogs">
                      <span>Kelola di Halaman Blog</span>
                      <ArrowRight className="size-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>

                {(!blogs.items || blogs.items.length === 0) ? (
                  <div className="p-10 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 space-y-2">
                    <BookOpen className="size-8 mx-auto text-slate-300 dark:text-slate-700" />
                    <p>Belum ada artikel yang dipublikasikan.</p>
                    <Button variant="outline" size="sm" asChild className="rounded-xl text-xs mt-2">
                      <Link href="/admin/blogs">Tambah Artikel Baru</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {blogs.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 flex flex-col justify-between overflow-hidden shadow-xs hover:border-[#ef599a]/40 hover:shadow-md transition-all duration-200"
                      >
                        <div className="space-y-3">
                          {/* Image Thumbnail */}
                          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#FDF0F5] dark:bg-slate-800">
                            <Image
                              src={item.imageUrl || '/assets/img/hero1.png'}
                              alt={item.title || 'Artikel'}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            {item.tag && (
                              <div className="absolute top-2.5 left-2.5">
                                <span className="bg-[#ef599a] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                                  {item.tag}
                                </span>
                              </div>
                            )}
                            {(item.readTime || item.publishedAt) && (
                              <div className="absolute top-2.5 right-2.5">
                                <span className="bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs">
                                  {item.readTime || item.publishedAt}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#ef599a] transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {item.excerpt || 'Tidak ada ringkasan.'}
                            </p>
                          </div>
                        </div>

                        {/* Footer Card */}
                        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="truncate max-w-[120px] font-medium text-slate-600 dark:text-slate-300">
                            {item.author || 'Tim Alpha Kids'}
                          </span>
                          <Link
                            href="/admin/blogs"
                            className="inline-flex items-center text-[11px] font-semibold text-[#ef599a] hover:underline"
                          >
                            Kelola Detail →
                          </Link>
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
                  Kalimat visi misi pendidikan dan profil 4 kakak mentor pendamping siswa.
                </CardDescription>
              </div>
              {renderSaveButton('mentors', mentors)}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Header Bagian: Visi Misi */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Kalimat Misi Utama (Section Heading)
                </h3>
                <div className="space-y-3 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Baris 1 - Pembuka</Label>
                    <Input
                      value={mentors.titlePart1 || ''}
                      onChange={(e) => setMentors({ ...mentors, titlePart1: e.target.value })}
                      placeholder="Misi kami adalah membantu anak"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      Baris 2 - Aksen Kuning Miring
                    </Label>
                    <Input
                      value={mentors.titleHighlight || ''}
                      onChange={(e) => setMentors({ ...mentors, titleHighlight: e.target.value })}
                      placeholder="menemukan kegembiraan belajar kreatif"
                      className="text-xs font-semibold text-amber-700 dark:text-amber-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Baris 3 - Penutup</Label>
                    <Input
                      value={mentors.titlePart2 || ''}
                      onChange={(e) => setMentors({ ...mentors, titlePart2: e.target.value })}
                      placeholder="dan tumbuh menjadi generasi juara."
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 4 Profil Mentor */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Profil 4 Mentor Utama
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Mentor 1 */}
                  <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                    <div className="pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Mentor 1</span>
                    </div>
                    <CmsImageUpload
                      label="Foto Profil"
                      value={mentors.mentor1Avatar}
                      onChange={(url) => setMentors({ ...mentors, mentor1Avatar: url })}
                      aspectRatio="square"
                    />
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Nama Lengkap</Label>
                      <Input
                        value={mentors.mentor1Name || ''}
                        onChange={(e) => setMentors({ ...mentors, mentor1Name: e.target.value })}
                        placeholder="Kak Budi Prasetyo"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Peran / Keahlian</Label>
                      <Input
                        value={mentors.mentor1Role || ''}
                        onChange={(e) => setMentors({ ...mentors, mentor1Role: e.target.value })}
                        placeholder="Eksplorasi Sains & Robotika"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Mentor 2 */}
                  <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                    <div className="pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Mentor 2</span>
                    </div>
                    <CmsImageUpload
                      label="Foto Profil"
                      value={mentors.mentor2Avatar}
                      onChange={(url) => setMentors({ ...mentors, mentor2Avatar: url })}
                      aspectRatio="square"
                    />
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Nama Lengkap</Label>
                      <Input
                        value={mentors.mentor2Name || ''}
                        onChange={(e) => setMentors({ ...mentors, mentor2Name: e.target.value })}
                        placeholder="Kak Sarah Amelia"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Peran / Keahlian</Label>
                      <Input
                        value={mentors.mentor2Role || ''}
                        onChange={(e) => setMentors({ ...mentors, mentor2Role: e.target.value })}
                        placeholder="Spesialis Koding & Game Dev"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Mentor 3 */}
                  <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                    <div className="pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Mentor 3</span>
                    </div>
                    <CmsImageUpload
                      label="Foto Profil"
                      value={mentors.mentor3Avatar}
                      onChange={(url) => setMentors({ ...mentors, mentor3Avatar: url })}
                      aspectRatio="square"
                    />
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Nama Lengkap</Label>
                      <Input
                        value={mentors.mentor3Name || ''}
                        onChange={(e) => setMentors({ ...mentors, mentor3Name: e.target.value })}
                        placeholder="Kak Nadia Utami"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Peran / Keahlian</Label>
                      <Input
                        value={mentors.mentor3Role || ''}
                        onChange={(e) => setMentors({ ...mentors, mentor3Role: e.target.value })}
                        placeholder="Seni Digital & Animasi"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Mentor 4 */}
                  <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                    <div className="pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Mentor 4</span>
                    </div>
                    <CmsImageUpload
                      label="Foto Profil"
                      value={mentors.mentor4Avatar}
                      onChange={(url) => setMentors({ ...mentors, mentor4Avatar: url })}
                      aspectRatio="square"
                    />
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Nama Lengkap</Label>
                      <Input
                        value={mentors.mentor4Name || ''}
                        onChange={(e) => setMentors({ ...mentors, mentor4Name: e.target.value })}
                        placeholder="Kak Jacob Rama"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Peran / Keahlian</Label>
                      <Input
                        value={mentors.mentor4Role || ''}
                        onChange={(e) => setMentors({ ...mentors, mentor4Role: e.target.value })}
                        placeholder="Logika & Matematika Kreatif"
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
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Judul Utama</Label>
                  <Input
                    value={cta.title || ''}
                    onChange={(e) => setCta({ ...cta, title: e.target.value })}
                    placeholder="Mulai Petualangan Belajar Digital Buah Hati Anda!"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Subjudul / Pesan Penutup</Label>
                  <Textarea
                    rows={2}
                    value={cta.subtitle || ''}
                    onChange={(e) => setCta({ ...cta, subtitle: e.target.value })}
                    placeholder="Konsultasikan bidang dan program belajar..."
                    className="text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Teks Tombol Utama</Label>
                    <Input
                      value={cta.btnText || ''}
                      onChange={(e) => setCta({ ...cta, btnText: e.target.value })}
                      placeholder="Daftar Sekarang"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Tautan Tombol Utama (URL)</Label>
                    <Input
                      value={cta.btnLink || ''}
                      onChange={(e) => setCta({ ...cta, btnLink: e.target.value })}
                      placeholder="#programs"
                      className="text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Teks Tombol WhatsApp</Label>
                    <Input
                      value={cta.btnSecondaryText || ''}
                      onChange={(e) => setCta({ ...cta, btnSecondaryText: e.target.value })}
                      placeholder="Tanya di WhatsApp"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Tautan WhatsApp Konsultasi</Label>
                    <Input
                      value={cta.consultationLink || ''}
                      onChange={(e) => setCta({ ...cta, consultationLink: e.target.value })}
                      className="text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <CmsImageUpload
                    label="Foto Ilustrasi Siswa CTA (Sisi Kiri)"
                    description="Foto cutout siswa dengan ransel dan lingkaran aura pink (cta.png). Disarankan PNG transparan."
                    value={cta.ctaImage}
                    onChange={(url) => setCta({ ...cta, ctaImage: url })}
                    aspectRatio="portrait"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================= */}
        {/* TAB 8: KONTAK & WHATSAPP ADMIN                                    */}
        {/* ================================================================= */}
        <TabsContent value="contact">
          <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Kontak Layanan & WhatsApp Admin
                </CardTitle>
                <CardDescription className="text-xs">
                  Atur nomor WhatsApp resmi, pesan otomatis, email dukungan, dan jam operasional platform Alpha Kids.
                </CardDescription>
              </div>
              {renderSaveButton('contact', contact)}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Nomor WhatsApp Admin</Label>
                  <Input
                    placeholder="6281234567890"
                    value={contact.whatsappNumber}
                    onChange={(e) => setContact({ ...contact, whatsappNumber: e.target.value })}
                    className="text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-400">
                    Gunakan format internasional tanpa spasi atau tanda plus (contoh: <strong>6281234567890</strong>).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Email Dukungan Resmi</Label>
                  <Input
                    placeholder="halo@alphakids.id"
                    value={contact.supportEmail}
                    onChange={(e) => setContact({ ...contact, supportEmail: e.target.value })}
                    className="text-xs"
                  />
                  <p className="text-[11px] text-slate-400">
                    Alamat email yang ditampilkan di navbar, footer, dan pusat bantuan.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Pesan Otomatis WhatsApp (Greeting / Template)</Label>
                <Textarea
                  rows={2}
                  placeholder="Halo Admin Alpha Kids, saya ingin tanya seputar program belajar anak..."
                  value={contact.whatsappDefaultText}
                  onChange={(e) => setContact({ ...contact, whatsappDefaultText: e.target.value })}
                  className="text-xs leading-relaxed"
                />
                <p className="text-[11px] text-slate-400">
                  Teks yang otomatis terisi ketika orang tua atau calon peserta membuka obrolan WhatsApp.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Jam Layanan & Operasional</Label>
                <Input
                  placeholder="Senin - Sabtu: 08.00 - 20.00 WIB"
                  value={contact.operatingHours}
                  onChange={(e) => setContact({ ...contact, operatingHours: e.target.value })}
                  className="text-xs"
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Pratinjau Tautan WhatsApp:
                  </span>
                  <a
                    href={formatWhatsAppUrl(contact.whatsappNumber, contact.whatsappDefaultText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline underline-offset-4"
                  >
                    <span>Uji Coba Tautan Langsung</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
                <p className="text-[11px] font-mono text-slate-500 break-all bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  {formatWhatsAppUrl(contact.whatsappNumber, contact.whatsappDefaultText)}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
          </div>

          {/* Right Column: Sticky Live Preview Canvas in Split View */}
          {viewMode === 'split' && (
            <div className="xl:col-span-6 xl:sticky xl:top-20 xl:h-[calc(100vh-6.5rem)] min-w-0 flex flex-col">
              <CmsPreviewCanvas
                data={previewData}
                activeTab={activeTab}
                device={previewDevice}
                scope={previewScope}
                onDeviceChange={setPreviewDevice}
                onScopeChange={setPreviewScope}
                onOpenModal={() => setIsModalOpen(true)}
                onClose={() => setViewMode('form')}
              />
            </div>
          )}
        </div>
      </Tabs>

      {/* =================================================================== */}
      {/* DIALOG KONFIRMASI HAPUS (ANTI-SLOP: Modal Dialog Standar)           */}
      {/* =================================================================== */}


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

      {/* 3. Modal Pratinjau Layar Penuh Interaktif */}
      <CmsPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={previewData}
        activeTab={activeTab}
        device={previewDevice}
        scope={previewScope}
        onDeviceChange={setPreviewDevice}
        onScopeChange={setPreviewScope}
        onSaveCurrentTab={handleSaveCurrentTab}
        isSaving={isSaving}
      />
    </div>
  );
}
