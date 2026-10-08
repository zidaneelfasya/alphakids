'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, Loader2, X } from 'lucide-react';
import {
  CmsPreviewCanvas,
  CmsPreviewData,
  DeviceType,
  PreviewScope,
} from './cms-preview-canvas';

interface CmsPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CmsPreviewData;
  activeTab: string;
  device: DeviceType;
  scope: PreviewScope;
  onDeviceChange: (device: DeviceType) => void;
  onScopeChange: (scope: PreviewScope) => void;
  onSaveCurrentTab?: () => void;
  isSaving?: boolean;
}

export function CmsPreviewModal({
  isOpen,
  onClose,
  data,
  activeTab,
  device,
  scope,
  onDeviceChange,
  onScopeChange,
  onSaveCurrentTab,
  isSaving = false,
}: CmsPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="!max-w-[96vw] !w-[96vw] !h-[94vh] !max-h-[94vh] p-0 flex flex-col rounded-3xl overflow-hidden border border-slate-700/60 bg-slate-950 shadow-2xl focus:outline-none"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Pratinjau Langsung CMS Alpha Kids</DialogTitle>
          <DialogDescription>
            Lihat perubahan komponen halaman depan secara langsung dengan pengalih perangkat desktop, tablet, dan mobile.
          </DialogDescription>
        </DialogHeader>

        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm tracking-tight text-white">
              Pratinjau Imersif Alpha Kids
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Mode simulasi tampilan publik sebelum disimpan ke database
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onSaveCurrentTab && (
              <Button
                type="button"
                onClick={onSaveCurrentTab}
                disabled={isSaving}
                className="h-8.5 px-4 rounded-xl text-xs font-semibold bg-[#21b1db] hover:bg-[#1ca0c7] text-white shadow-xs cursor-pointer gap-1.5"
              >
                {isSaving ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5" />
                )}
                <span>Simpan Perubahan</span>
              </Button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="size-8.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Tutup Modal"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Embedded Canvas */}
        <div className="flex-1 overflow-hidden p-2 sm:p-3 bg-slate-950">
          <CmsPreviewCanvas
            data={data}
            activeTab={activeTab}
            device={device}
            scope={scope}
            onDeviceChange={onDeviceChange}
            onScopeChange={onScopeChange}
            onClose={onClose}
            isModal={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
