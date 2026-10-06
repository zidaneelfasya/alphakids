"use client";

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
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import Link from "next/link";

export default function ResizableNavbarDemo() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-[#FFFDF9] dark:bg-slate-950 font-sans">
      <Navbar>
        {/* Desktop Resizable Navigation Bar */}
        <NavBody>
          {/* Brand Logo */}
          <NavbarLogo href="/" />

          {/* Center Hover Menu with Smooth Morphing Dropdowns */}
          <NavMenu setActive={setActiveMenu}>
            {/* 1. Beranda (Direct link) */}
            <NavMenuItem
              setActive={setActiveMenu}
              active={activeMenu}
              item="Beranda"
              href="/"
            />

            {/* 2. Program Belajar (Dropdown showcasing Product Cards - like User's Image 2) */}
            <NavMenuItem
              setActive={setActiveMenu}
              active={activeMenu}
              item="Program"
            >
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#21b1db]">
                    Katalog Program Unggulan
                  </span>
                  <Link
                    href="/programs"
                    className="text-xs font-semibold text-slate-500 hover:text-[#21b1db] transition-colors"
                  >
                    Lihat Semua &rarr;
                  </Link>
                </div>

                {/* Grid of Program Product Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <NavProductItem
                    title="Junior Game Developer"
                    description="Belajar logika pemrograman & buat game visual 2D sendiri."
                    href="/programs"
                    src="/assets/img/kid-tablet.png"
                    badge="Usia 7–12 Thn"
                    price="Rp 299.000"
                  />
                  <NavProductItem
                    title="Sains & Robotika Pintar"
                    description="Eksperimen sensor, sirkuit aman, dan robotika cerdas anak."
                    href="/programs"
                    src="/assets/img/alpha-kids-hero.jpg"
                    badge="Usia 8–15 Thn"
                    price="Rp 349.000"
                  />
                  <NavProductItem
                    title="Seni Digital & Animasi"
                    description="Kembangkan imajinasi karakter dan ilustrasi kreatif si kecil."
                    href="/programs"
                    src="/assets/img/kid-teddy.png"
                    badge="Usia 5–10 Thn"
                    price="Rp 249.000"
                  />
                </div>
              </div>
            </NavMenuItem>

            {/* 3. Keunggulan (Vertical Submenu - like User's Image 1) */}
            <NavMenuItem
              setActive={setActiveMenu}
              active={activeMenu}
              item="Keunggulan"
            >
              <div className="flex flex-col space-y-1.5 w-64 text-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#21b1db] px-2.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                  Metode Belajar
                </span>
                <NavHoveredLink
                  href="#fitur"
                  badge="Interaktif"
                  description="Kuis gamifikasi & poin petualang seru"
                >
                  Gamifikasi & Kuis
                </NavHoveredLink>
                <NavHoveredLink
                  href="#keunggulan"
                  badge="Praktik"
                  description="Kurikulum berbasis proyek karya nyata"
                >
                  Proyek Langsung
                </NavHoveredLink>
                <NavHoveredLink
                  href="#mentor"
                  description="Didampingi mentor ramah & bersertifikat"
                >
                  Kakak Mentor Ahli
                </NavHoveredLink>
                <NavHoveredLink
                  href="#faq"
                  description="Pertanyaan seputar metode & kelas"
                >
                  Tanya Jawab (FAQ)
                </NavHoveredLink>
              </div>
            </NavMenuItem>

            {/* 4. Kontak & Dukungan */}
            <NavMenuItem
              setActive={setActiveMenu}
              active={activeMenu}
              item="Bantuan"
            >
              <div className="flex flex-col space-y-1.5 w-56 text-sm">
                <NavHoveredLink
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  badge="24/7"
                  description="Hubungi customer service orang tua"
                >
                  Konsultasi WhatsApp
                </NavHoveredLink>
                <NavHoveredLink
                  href="mailto:halo@alphakids.id"
                  description="Kirim pesan bantuan via email"
                >
                  Email Dukungan
                </NavHoveredLink>
              </div>
            </NavMenuItem>
          </NavMenu>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <NavbarButton href="/auth/login" variant="ghost">
              Masuk
            </NavbarButton>
            <NavbarButton href="/auth/sign-up" variant="primary">
              Daftar Sekarang
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation Drawer */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo href="/" />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex flex-col w-full space-y-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-[#F4EFF7] hover:text-[#21b1db]"
              >
                Beranda
              </Link>
              <Link
                href="/programs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-[#F4EFF7] hover:text-[#21b1db]"
              >
                Katalog Program
              </Link>
              <Link
                href="#fitur"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-[#F4EFF7] hover:text-[#21b1db]"
              >
                Fitur Unggulan
              </Link>
              <Link
                href="#mentor"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-[#F4EFF7] hover:text-[#21b1db]"
              >
                Kakak Mentor
              </Link>
              <Link
                href="#faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-[#F4EFF7] hover:text-[#21b1db]"
              >
                FAQ
              </Link>
            </div>

            <div className="flex w-full flex-col gap-2 pt-3 border-t border-slate-100">
              <NavbarButton
                href="/auth/login"
                variant="outline"
                className="w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Masuk Akun
              </NavbarButton>
              <NavbarButton
                href="/auth/sign-up"
                variant="primary"
                className="w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Daftar Peserta Baru
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Demo Body Content to test scroll resizing */}
      <div className="max-w-5xl mx-auto px-6 pt-36 pb-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 mb-4">
          Alpha Kids Resizable Navbar dengan Animasi Hover
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto mb-12">
          Cobalah arahkan kursor (*hover*) ke menu <strong>Program</strong>, <strong>Keunggulan</strong>, atau <strong>Bantuan</strong> di atas untuk melihat animasi morphing dropdown yang mulus. Gulir ke bawah halaman untuk melihat transisi ukuran navbar menjadi pil melayang (*resizable on scroll*).
        </p>

        {/* Scroll dummy cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-white border border-[#EDE4F2] shadow-sm space-y-3"
            >
              <div className="size-10 rounded-2xl bg-[#EDE4F2] text-[#21b1db] font-semibold flex items-center justify-center">
                {i}
              </div>
              <h3 className="font-semibold text-lg text-slate-900">
                Fitur Eksplorasi {i}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Gulir ke bawah untuk memicu efek penyusutan navbar menjadi kapsul melayang (*floating pill*) dengan bayangan ungu khas Alpha Kids.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
