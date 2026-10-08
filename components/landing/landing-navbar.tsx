'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import {
  Navbar,
  NavBody,
  NavMenu,
  NavMenuItem,
  NavHoveredLink,
  NavProductItem,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';

import { formatRupiah } from '@/lib/utils';
import { formatWhatsAppUrl } from '@/lib/cms-types';

export interface NavbarProgramItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  price: number;
  coverImage?: string | null;
  ageRange?: string | null;
  level?: string | null;
}

interface LandingNavbarProps {
  user?: {
    id: string;
    email?: string | null;
  } | null;
  programs?: NavbarProgramItem[];
  whatsappNumber?: string;
  supportEmail?: string;
}

export function LandingNavbar({
  user,
  programs = [],
  whatsappNumber,
  supportEmail = 'halo@alphakids.id',
}: LandingNavbarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Take top 3 featured programs for the sleek 3-column popover
  const displayPrograms = programs.slice(0, 3);
  const whatsappUrl = formatWhatsAppUrl(
    whatsappNumber,
    'Halo Admin Alpha Kids, saya ingin bertanya seputar program belajar anak.'
  );

  return (
    <Navbar>
      {/* 1. Desktop Resizable Navbar with Morphing Animated Hover Dropdowns */}
      <NavBody>
        {/* Official Alpha Kids Logo */}
        <NavbarLogo href="/" />

        {/* Center Hover Menu with Smooth Aceternity Animated Popovers */}
        <NavMenu setActive={setActiveMenu}>
          {/* 1. Beranda */}
          <NavMenuItem
            setActive={setActiveMenu}
            active={activeMenu}
            item="Beranda"
            href="/"
          />

          {/* 2. Program (Click -> /programs, Hover -> Preview Classes) */}
          <NavMenuItem
            setActive={setActiveMenu}
            active={activeMenu}
            item="Program"
            href="/programs"
          >
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#21b1db]">
                  Katalog Kelas Digital Unggulan
                </span>
                <Link
                  href="/programs"
                  className="text-xs font-semibold text-slate-500 hover:text-[#21b1db] transition-colors"
                >
                  Buka Semua Kelas ({programs.length}) &rarr;
                </Link>
              </div>

              {/* Grid of Program Product Cards */}
              {displayPrograms.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {displayPrograms.map((prog) => (
                    <NavProductItem
                      key={prog.id}
                      title={prog.title}
                      description={
                        prog.description ||
                        'Kurikulum interaktif dengan proyek langsung dan bimbingan mentor.'
                      }
                      href={`/programs/${prog.slug}`}
                      src={
                        prog.coverImage ||
                        '/assets/img/hero1.png'
                      }
                      badge={prog.ageRange || prog.level || 'Semua Usia'}
                      price={
                        prog.price === 0 ? 'Gratis' : formatRupiah(prog.price)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="py-6 px-8 text-center text-xs text-slate-500">
                  Belum ada program aktif yang tersedia saat ini.
                </div>
              )}
            </div>
          </NavMenuItem>

          {/* 3. Blog (Click -> /blog, Hover -> Topik Pilihan) */}
          <NavMenuItem
            setActive={setActiveMenu}
            active={activeMenu}
            item="Blog"
            href="/blog"
          >
            <div className="flex flex-col space-y-1.5 w-64 text-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ef599a] px-2.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                Artikel & Edukasi Digital
              </span>
              <NavHoveredLink
                href="/blog"
                badge="Semua"
                description="Panduan belajar & inspirasi era digital"
              >
                Kumpulan Artikel
              </NavHoveredLink>
              <NavHoveredLink
                href="/blog?category=Gamifikasi"
                badge="Populer"
                description="Belajar seru lewat game dan teka-teki"
              >
                Gamifikasi & Logika
              </NavHoveredLink>
              <NavHoveredLink
                href="/blog?category=Aktivitas+Seru"
                description="Ide eksperimen & aktivitas anak di rumah"
              >
                Aktivitas Seru
              </NavHoveredLink>
              <NavHoveredLink
                href="/blog?category=Parenting+Digital"
                description="Tips mendampingi buah hati di era AI"
              >
                Parenting Digital
              </NavHoveredLink>
            </div>
          </NavMenuItem>

          {/* 4. Bantuan (Click -> /bantuan, Hover -> Opsi Bantuan Langsung) */}
          <NavMenuItem
            setActive={setActiveMenu}
            active={activeMenu}
            item="Bantuan"
            href="/bantuan"
          >
            <div className="flex flex-col space-y-1.5 w-60 text-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#21b1db] px-2.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                Pusat Bantuan & Layanan
              </span>
              <NavHoveredLink
                href="/bantuan"
                badge="Lengkap"
                description="Pertanyaan umum seputar kelas & sertifikat"
              >
                Pusat Bantuan & FAQ
              </NavHoveredLink>
              <NavHoveredLink
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                badge="Admin"
                description="Chat langsung dengan tim kami"
              >
                WhatsApp Admin
              </NavHoveredLink>
              <NavHoveredLink
                href={`mailto:${supportEmail}`}
                description="Kirim pertanyaan via email resmi"
              >
                Email Dukungan
              </NavHoveredLink>
            </div>
          </NavMenuItem>
        </NavMenu>

        {/* Right CTA / Auth Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <NavbarButton href="/dashboard" variant="primary">
              <LayoutDashboard className="size-3.5" />
              <span>Dashboard</span>
            </NavbarButton>
          ) : (
            <>
              <NavbarButton href="/auth/login" variant="ghost">
                Masuk
              </NavbarButton>
              <NavbarButton href="/auth/sign-up" variant="primary">
                <span>Daftar</span>
                <ArrowRight className="size-3.5" />
              </NavbarButton>
            </>
          )}
        </div>
      </NavBody>

      {/* 2. Mobile Responsive Drawer */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo href="/" />
          <MobileNavToggle
            isOpen={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <div className="flex flex-col w-full space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-[#E8F8FA] hover:text-[#21b1db]"
            >
              Beranda
            </Link>
            <Link
              href="/programs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-[#E8F8FA] hover:text-[#21b1db]"
            >
              Program ({programs.length})
            </Link>
            {displayPrograms.length > 0 && (
              <div className="flex flex-col pl-3 space-y-1 py-0.5 border-l-2 border-[#E8F8FA] ml-3">
                {displayPrograms.map((prog) => (
                  <Link
                    key={prog.id}
                    href={`/programs/${prog.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-[#E8F8FA] hover:text-[#21b1db] flex items-center justify-between transition-colors"
                  >
                    <span className="truncate">{prog.title}</span>
                    <span className="text-[10px] text-[#ef599a] font-semibold shrink-0 ml-2">
                      {prog.price === 0 ? 'Gratis' : formatRupiah(prog.price)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-[#E8F8FA] hover:text-[#21b1db]"
            >
              Blog & Artikel
            </Link>
            <Link
              href="/bantuan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-[#E8F8FA] hover:text-[#21b1db]"
            >
              Bantuan & FAQ
            </Link>
          </div>

          <div className="flex w-full flex-col gap-2 pt-3 border-t border-slate-100">
            {user ? (
              <NavbarButton
                href="/dashboard"
                variant="primary"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="size-3.5" />
                <span>Buka Dashboard</span>
              </NavbarButton>
            ) : (
              <>
                <NavbarButton
                  href="/auth/login"
                  variant="outline"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Masuk Akun
                </NavbarButton>
                <NavbarButton
                  href="/auth/sign-up"
                  variant="primary"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Daftar Sekarang
                </NavbarButton>
              </>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
