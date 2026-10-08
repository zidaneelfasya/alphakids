import { createClient } from '@/lib/supabase/server';
import { db, programs } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import {
  MessageCircle,
  Mail,
  GraduationCap,
  ArrowUpRight,
  Sparkles,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { LandingFooter } from '@/components/landing/landing-footer';
import { HelpExplorer } from '@/components/bantuan/help-explorer';
import {
  getCmsSection,
  DEFAULT_CONTACT,
  DEFAULT_FAQ,
  ContactSectionContent,
  FaqSectionContent,
  formatWhatsAppUrl,
} from '@/lib/cms';

export const metadata = {
  title: 'Pusat Bantuan & Layanan — Alpha Kids',
  description:
    'Pusat informasi, panduan pendaftaran kelas, sistem pembayaran, akses materi, serta layanan konsultasi resmi WhatsApp Admin Alpha Kids.',
};

export const dynamic = 'force-dynamic';

export default async function HelpPage() {
  // 1. Supabase auth session
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Fetch Active Programs for Navbar popover
  const activePrograms = await db.query.programs.findMany({
    where: eq(programs.isActive, true),
    orderBy: [desc(programs.createdAt)],
    with: {
      category: true,
    },
  });

  // 3. Fetch Contact and FAQ CMS sections
  const [contact, faq] = await Promise.all([
    getCmsSection<ContactSectionContent>('contact', DEFAULT_CONTACT),
    getCmsSection<FaqSectionContent>('faq', DEFAULT_FAQ),
  ]);

  const whatsappUrl = formatWhatsAppUrl(
    contact.whatsappNumber,
    contact.whatsappDefaultText
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-white selection:bg-cyan-200 selection:text-cyan-900">
      {/* 1. Official Floating Capsule Navbar with dynamic WhatsApp info */}
      <LandingNavbar
        user={user}
        programs={activePrograms}
        whatsappNumber={contact.whatsappNumber}
        supportEmail={contact.supportEmail}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          {/* Header Section (Restrained, disciplined typography) */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold text-[#0e7490] ">
              Pusat Informasi & Dukungan Orang Tua
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold font-sans tracking-tight text-slate-900 dark:text-white leading-[1.2] mt-4">
              Pusat{' '}
              <span className="font-sans font-semibold text-[#21b1db]">
                bantuan
              </span>{' '}
              & layanan ramah
            </h1>

            <p className="mt-3.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Temukan jawaban lengkap seputar kurikulum, proses pendaftaran,
              akses materi belajar, atau hubungi langsung admin kami melalui WhatsApp.
            </p>
          </div>

          {/* 3 Contact Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: WhatsApp Admin Langsung (Dominant Cyan) */}
            <div className="group rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="size-12 rounded-2xl bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <MessageCircle className="size-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    WhatsApp Admin Resmi
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Chat WhatsApp
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  Konsultasikan minat si kecil, panduan pendaftaran, atau konfirmasi pembayaran secara langsung dengan tim admin Alpha Kids.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Clock className="size-3.5 text-slate-400 shrink-0" />
                  <span>{contact.operatingHours}</span>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn w-full inline-flex items-center justify-between pl-5 pr-2 py-2 rounded-full bg-[#21b1db] hover:bg-[#1da0c7] text-white font-semibold text-xs shadow-md shadow-[#21b1db]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="tracking-tight">Hubungi Admin ({contact.whatsappNumber})</span>
                  <span className="size-7 rounded-full bg-white text-[#21b1db] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover/btn:scale-105 group-hover/btn:rotate-12">
                    <ArrowUpRight className="size-3.5 stroke-[2.5]" />
                  </span>
                </a>
              </div>
            </div>

            {/* Card 2: Email Resmi (Alpha Pink) */}
            <div className="group rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="size-12 rounded-2xl bg-[#FDF0F5] dark:bg-pink-950/60 text-[#ef599a] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Mail className="size-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-[#ef599a] uppercase tracking-wider">
                    Surat Elektronik
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Email Dukungan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  Untuk pertanyaan seputar kemitraan sekolah, permohonan sertifikat cetak, atau saran pengembangan kurikulum belajar.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {contact.supportEmail}
                </div>

                <a
                  href={`mailto:${contact.supportEmail}`}
                  className="group/btn w-full inline-flex items-center justify-between pl-5 pr-2 py-2 rounded-full bg-[#ef599a] hover:bg-[#df488a] text-white font-semibold text-xs shadow-md shadow-[#ef599a]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="tracking-tight">Kirim Pesan Email</span>
                  <span className="size-7 rounded-full bg-white text-[#ef599a] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover/btn:scale-105 group-hover/btn:rotate-12">
                    <ArrowUpRight className="size-3.5 stroke-[2.5]" />
                  </span>
                </a>
              </div>
            </div>

            {/* Card 3: Ruang Kelas & Akun (Alpha Yellow) */}
            <div className="group rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="size-12 rounded-2xl bg-[#FEF9C3] dark:bg-amber-950/60 text-[#ca8a04] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <GraduationCap className="size-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-[#ca8a04] dark:text-[#FFCC07] uppercase tracking-wider">
                    Ruang Belajar Mandiri
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Dashboard Kelas
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  Akses langsung materi video, modul proyek anak, tautan grup mentoring, dan riwayat sertifikat yang telah diselesaikan.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="text-[11px] text-slate-400">
                  Tersedia untuk semua murid terdaftar
                </div>

                <Link
                  href="/dashboard"
                  className="group/btn w-full inline-flex items-center justify-between pl-5 pr-2 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="tracking-tight">Buka Dashboard Saya</span>
                  <span className="size-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover/btn:scale-105 group-hover/btn:rotate-12">
                    <ArrowUpRight className="size-3.5 stroke-[2.5]" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div className="pt-6">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold font-sans tracking-tight text-slate-900 dark:text-white">
                Pertanyaan yang Sering Diajukan (FAQ)
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Pilih topik di bawah atau ketik kata kunci untuk menemukan solusi cepat.
              </p>
            </div>

            <HelpExplorer faqItems={faq.items || []} />
          </div>

          {/* Bottom Consultation Banner */}
          <div className="rounded-3xl border border-cyan-100 dark:border-cyan-950 bg-gradient-to-br from-[#E8F8FA] via-[#FDF0F5] to-[#FEF9C3]/50 dark:from-slate-900 dark:via-cyan-950/40 dark:to-slate-900 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xs">
           
            <h3 className="text-xl sm:text-2xl font-semibold font-sans tracking-tight text-slate-900 dark:text-white mb-2">
              Masih Memerlukan Bantuan Khusus?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-6 leading-relaxed">
              Tim edukasi kami dengan senang hati membantu Anda memilih program yang paling pas dengan minat dan usia anak.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-[#ef599a] hover:bg-[#df488a] text-white font-semibold text-xs sm:text-sm shadow-xl shadow-[#ef599a]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Chat WhatsApp Admin Sekarang</span>
              <span className="size-8 rounded-full bg-white text-[#ef599a] flex items-center justify-center shrink-0 shadow-md">
                <ArrowUpRight className="size-4 stroke-[2.5]" />
              </span>
            </a>
          </div>
        </div>
      </main>

      {/* 3. Branded Multi-Column Footer */}
      <LandingFooter />
    </div>
  );
}
