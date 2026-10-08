'use client';

import React from 'react';
import Link from 'next/link';
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Maximize2,
  X,
  MessageCircle,
  Mail,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { LandingHero } from '@/components/landing/landing-hero';
import { LandingInteractiveFeatures } from '@/components/landing/landing-interactive-features';
import { LandingStorySection } from '@/components/landing/landing-story-section';
import { LandingBlogSection } from '@/components/landing/landing-blog-section';
import { LandingMentorsBlock } from '@/components/landing/landing-mentors-block';
import { LandingFaq } from '@/components/landing/landing-faq';
import { LandingFinalCta } from '@/components/landing/landing-final-cta';
import { formatWhatsAppUrl } from '@/lib/cms-types';
import type {
  HeroSectionContent,
  FeaturesSectionContent,
  StorySectionContent,
  MentorsSectionContent,
  BlogSectionContent,
  FaqSectionContent,
  CtaSectionContent,
  ContactSectionContent,
} from '@/lib/cms-types';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type PreviewScope = 'section' | 'full';

export interface CmsPreviewData {
  hero: HeroSectionContent;
  features: FeaturesSectionContent;
  story: StorySectionContent;
  mentors: MentorsSectionContent;
  blogs: BlogSectionContent;
  faq: FaqSectionContent;
  cta: CtaSectionContent;
  contact: ContactSectionContent;
}

interface CmsPreviewCanvasProps {
  data: CmsPreviewData;
  activeTab: string;
  device: DeviceType;
  scope: PreviewScope;
  onDeviceChange: (device: DeviceType) => void;
  onScopeChange: (scope: PreviewScope) => void;
  onClose?: () => void;
  onOpenModal?: () => void;
  isModal?: boolean;
}

const TAB_NAMES: Record<string, string> = {
  hero: 'Hero Section',
  features: '3 Kartu Fitur',
  story: 'Section Story',
  blogs: 'Blog & Artikel',
  mentors: 'Kakak Mentor',
  faq: 'Tanya Jawab (FAQ)',
  cta: 'Call To Action',
  contact: 'Kontak & WhatsApp',
};

export function CmsPreviewCanvas({
  data,
  activeTab,
  device,
  scope,
  onDeviceChange,
  onScopeChange,
  onClose,
  onOpenModal,
  isModal = false,
}: CmsPreviewCanvasProps) {
  // Device viewport width constraints
  const getDeviceWidthClass = () => {
    switch (device) {
      case 'mobile':
        return 'w-[375px] max-w-[375px] my-4 rounded-[2rem] border-[5px] border-slate-800 dark:border-slate-700 shadow-2xl overflow-hidden';
      case 'tablet':
        return 'w-[768px] max-w-[768px] my-3 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-xl overflow-hidden';
      case 'desktop':
      default:
        return 'w-full max-w-full';
    }
  };

  const currentTabName = TAB_NAMES[activeTab] || 'Section Aktif';

  return (
    <div className="flex flex-col h-full bg-slate-900/95 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden text-slate-100">
      {/* =================================================================== */}
      {/* 1. MOCKUP BROWSER TOPBAR / TOOLBAR                                  */}
      {/* =================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-800/90 dark:bg-slate-900 border-b border-slate-700/60 select-none shrink-0">
        {/* Left: Window Controls & Mock URL */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-500/90" />
            <span className="size-2.5 rounded-full bg-amber-400/90" />
            <span className="size-2.5 rounded-full bg-emerald-500/90" />
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/60 border border-slate-700/60 text-[11px] text-slate-300 font-mono">
            
            <span>https://www.alphakids.id/</span>
            <span className="text-slate-500">
              {scope === 'full' ? '/live-preview' : `#${activeTab}`}
            </span>
          </div>

        
        </div>

        {/* Center: Device Switcher (Desktop, Tablet, Mobile) */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-700/60">
          <button
            type="button"
            onClick={() => onDeviceChange('desktop')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              device === 'desktop'
                ? 'bg-[#21b1db] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Desktop (1200px)"
          >
            <Monitor className="size-3.5" />
            <span className="hidden md:inline text-[11px]">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange('tablet')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              device === 'tablet'
                ? 'bg-[#21b1db] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Tablet (768px)"
          >
            <Tablet className="size-3.5" />
            <span className="hidden md:inline text-[11px]">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange('mobile')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              device === 'mobile'
                ? 'bg-[#21b1db] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Mobile (375px)"
          >
            <Smartphone className="size-3.5" />
            <span className="hidden md:inline text-[11px]">Mobile</span>
          </button>
        </div>

        {/* Right: Scope Toggle & Window Actions */}
        <div className="flex items-center gap-2">
          {/* Scope Switcher: Section vs Full */}
          <div className="flex items-center bg-slate-950/70 p-0.5 rounded-xl border border-slate-700/60 text-[11px]">
            <button
              type="button"
              onClick={() => onScopeChange('section')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                scope === 'section'
                  ? 'bg-white/15 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="truncate max-w-[90px] inline-block">{currentTabName}</span>
            </button>
            <button
              type="button"
              onClick={() => onScopeChange('full')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                scope === 'full'
                  ? 'bg-white/15 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Section
            </button>
          </div>

          {/* Fullscreen Modal trigger (if in split view) */}
          {!isModal && onOpenModal && (
            <button
              type="button"
              onClick={onOpenModal}
              className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Buka Pratinjau Layar Penuh"
            >
              <Maximize2 className="size-3.5" />
            </button>
          )}

          {/* Close / Collapse button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-rose-500/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Tutup Pratinjau"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. PREVIEW VIEWPORT AREA                                            */}
      {/* =================================================================== */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-950/40 p-2 sm:p-4 flex justify-center items-start">
        <div
          className={`transition-all duration-300 bg-[#FFFDF9] dark:bg-slate-950 text-slate-900 dark:text-white shadow-2xl ${getDeviceWidthClass()}`}
        >
          {scope === 'full' ? (
            /* RENDER ALL SECTIONS IN LANDING PAGE ORDER */
            <div className="space-y-0">
              <LandingHero content={data.hero} />
              <LandingInteractiveFeatures content={data.features} />
              <LandingStorySection content={data.story} />
              <LandingBlogSection content={data.blogs} />
              <LandingMentorsBlock content={data.mentors} />
              <LandingFaq content={data.faq} />
              <LandingFinalCta content={data.cta} />
            </div>
          ) : (
            /* RENDER ACTIVE TAB SECTION ONLY */
            <div>
              {activeTab === 'hero' && <LandingHero content={data.hero} />}
              {activeTab === 'features' && (
                <LandingInteractiveFeatures content={data.features} />
              )}
              {activeTab === 'story' && (
                <LandingStorySection content={data.story} />
              )}
              {activeTab === 'blogs' && (
                <LandingBlogSection content={data.blogs} />
              )}
              {activeTab === 'mentors' && (
                <LandingMentorsBlock content={data.mentors} />
              )}
              {activeTab === 'faq' && <LandingFaq content={data.faq} />}
              {activeTab === 'cta' && <LandingFinalCta content={data.cta} />}
              {activeTab === 'contact' && (
                <div className="py-14 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
                  <div className="text-center max-w-lg mx-auto">
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#0e7490] dark:text-cyan-300 border border-[#21b1db]/25 shadow-xs mb-3">
                      Pratinjau Kontak & WhatsApp
                    </span>
                    <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                      Kanal Komunikasi Resmi
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                      Tampilan kartu kontak yang ditampilkan di pusat bantuan dan navbar.
                    </p>
                  </div>

                  {/* WhatsApp Admin Card Mockup */}
                  <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-2xl bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db] flex items-center justify-center shrink-0">
                        <MessageCircle className="size-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            WhatsApp Admin Resmi
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                          +{data.contact.whatsappNumber || '6281234567890'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          &ldquo;{data.contact.whatsappDefaultText || 'Halo Admin Alpha Kids...'}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3" />
                            {data.contact.operatingHours || 'Senin - Sabtu'}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Mail className="size-3" />
                            {data.contact.supportEmail || 'halo@alphakids.id'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={formatWhatsAppUrl(
                        data.contact.whatsappNumber,
                        data.contact.whatsappDefaultText
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 shrink-0"
                    >
                      <MessageCircle className="size-4" />
                      <span>Chat WhatsApp</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
