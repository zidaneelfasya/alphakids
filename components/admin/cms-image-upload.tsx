'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Trash2,
  RefreshCw,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CmsImageUploadProps {
  label: string;
  description?: string;
  value?: string;
  onChange: (url: string) => void;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide' | 'auto';
  className?: string;
  bucket?: string;
}

export function CmsImageUpload({
  label,
  description,
  value,
  onChange,
  aspectRatio = 'auto',
  className = '',
  bucket = 'cms',
}: CmsImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Berkas harus berupa gambar (PNG, JPG, WEBP, SVG, dsb).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error('Ukuran berkas melebihi batas 15 MB.');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengunggah berkas.');
      }

      onChange(data.url);
      toast.success('Foto berhasil diunggah ke Supabase Storage!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengunggah foto.';
      toast.error(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Adjust preview container height based on aspect ratio
  const getHeightClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'h-64 sm:h-72';
      case 'portrait':
        return 'h-72 sm:h-80';
      case 'landscape':
        return 'h-52 sm:h-60';
      case 'wide':
        return 'h-48 sm:h-56';
      default:
        return 'h-60 sm:h-68';
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Label and Helper Text */}
      <div className="space-y-0.5">
        <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </Label>
        {description && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            {description}
          </p>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* When Image Exists: Large, Modern, Clean Showcase Card */}
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all duration-300">
          {/* Large Image Showcase Area with transparent radial backdrop */}
          <div
            className={`relative w-full ${getHeightClass()} flex items-center justify-center p-4 overflow-hidden bg-slate-50/70 dark:bg-slate-950/60`}
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(148, 163, 184, 0.22) 1.2px, transparent 1.2px)',
              backgroundSize: '14px 14px',
            }}
          >
            {/* Subtle multi-color ambient glow behind image cutout */}
            <div
              aria-hidden="true"
              className="absolute inset-8 bg-gradient-to-tr from-[#21b1db]/10 via-[#ef599a]/10 to-[#FFCC07]/10 rounded-full blur-2xl pointer-events-none"
            />

            {/* Display Image with Contain Fitting and Micro-Hover Motion */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={value}
                alt={label}
                fill
                className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                unoptimized
              />
            </div>

            {/* Top-Right Floating Status Pill */}
            

            {/* Uploading Spinner Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs gap-2 z-20">
                <Loader2 className="w-7 h-7 animate-spin text-[#21b1db]" />
                <span className="text-xs font-medium tracking-wide">
                  Mengunggah berkas baru...
                </span>
              </div>
            )}
          </div>

          {/* Sleek Bottom Control Bar */}
          <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="size-6 rounded-md bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center text-[#21b1db] shrink-0 border border-cyan-100 dark:border-cyan-900/50">
                <ImageIcon className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                Foto Aktif
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl text-xs font-semibold h-8 px-3 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#21b1db] hover:text-[#21b1db] hover:bg-cyan-50/50 dark:hover:bg-cyan-950/30 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Ganti Gambar
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isUploading}
                onClick={() => onChange('')}
                className="rounded-xl text-xs font-semibold h-8 px-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all cursor-pointer"
                title="Hapus foto ini"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="sr-only">Hapus</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* When No Image: Elegant, Clean Drag & Drop Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-[#21b1db] bg-[#21b1db]/10 scale-[1.01]'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/70 hover:border-[#21b1db]/60 dark:hover:border-[#21b1db]/60'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2.5 py-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#21b1db]" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Mengunggah gambar ke Supabase Storage...
              </span>
            </div>
          ) : (
            <>
              <div className="size-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-100 dark:border-cyan-800 flex items-center justify-center text-[#21b1db] shadow-xs">
                <UploadCloud className="w-6 h-6 stroke-[2.2]" />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Klik untuk unggah atau seret berkas ke sini
                </p>
                <p className="text-[11px] text-slate-400">
                  Mendukung PNG, JPG, WEBP, SVG (Maksimal 15 MB)
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-semibold h-8 px-4 border-slate-200 dark:border-slate-700 pointer-events-none mt-1"
              >
                Pilih Berkas
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
