'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface BlogShareBarProps {
  title: string;
}

export function BlogShareBar({ title }: BlogShareBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Tautan artikel berhasil disalin!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Gagal menyalin tautan');
    }
  };

  const handleShareWhatsApp = () => {
    const text = `${encodeURIComponent(title)} - ${encodeURIComponent(window.location.href)}`;
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="flex items-center gap-2 pt-6 mt-8 border-t border-slate-100 dark:border-slate-800">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mr-2">
        <Share2 className="size-3.5 text-[#ef599a]" />
        Bagikan:
      </span>

      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-[#ef599a] hover:text-[#ef599a] transition-all cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400">Tersalin</span>
          </>
        ) : (
          <>
            <Copy className="size-3.5" />
            <span>Salin Link</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleShareWhatsApp}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all cursor-pointer"
      >
        <span>WhatsApp</span>
      </button>
    </div>
  );
}
