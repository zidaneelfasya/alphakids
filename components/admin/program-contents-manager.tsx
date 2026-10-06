'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  createProgramContentAction,
  updateProgramContentAction,
  deleteProgramContentAction,
  ProgramContentInput,
} from '@/lib/actions/admin-contents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  ExternalLink,
  Lock,
  Globe,
  Loader2,
} from 'lucide-react';

interface ContentItem {
  id: string;
  programId: string;
  title: string;
  contentType: string;
  url: string | null;
  content: string | null;
  visibility: 'public' | 'member';
  sortOrder: number;
}

interface ProgramContentsManagerProps {
  programId: string;
  programTitle: string;
  contents: ContentItem[];
}

export function ProgramContentsManager({
  programId,
  programTitle,
  contents,
}: ProgramContentsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('whatsapp_group');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'member'>('member');
  const [sortOrder, setSortOrder] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateDialog = () => {
    setEditingContent(null);
    setTitle('');
    setContentType('whatsapp_group');
    setUrl('');
    setContent('');
    setVisibility('member');
    setSortOrder(String(contents.length + 1));
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: ContentItem) => {
    setEditingContent(item);
    setTitle(item.title);
    setContentType(item.contentType);
    setUrl(item.url || '');
    setContent(item.content || '');
    setVisibility(item.visibility);
    setSortOrder(String(item.sortOrder));
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Judul konten wajib diisi');
      return;
    }

    setIsSubmitting(true);
    const payload: ProgramContentInput = {
      programId,
      title: title.trim(),
      contentType,
      url: url.trim() || null,
      content: content.trim() || null,
      visibility,
      sortOrder: parseInt(sortOrder, 10) || 0,
    };

    try {
      if (editingContent) {
        const res = await updateProgramContentAction(
          editingContent.id,
          programId,
          payload
        );
        if (res.success) {
          toast.success(res.message);
          setIsDialogOpen(false);
        }
      } else {
        const res = await createProgramContentAction(payload);
        if (res.success) {
          toast.success(res.message);
          setIsDialogOpen(false);
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan konten');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const res = await deleteProgramContentAction(deletingId, programId);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus konten');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/programs"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Program
          </Link>
          <h2 className="text-base font-semibold font-sans text-slate-900 dark:text-white">
            Kelola Konten & Tautan Kelas: {programTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Atur tautan grup WhatsApp, ruang tatap muka Zoom/Meet, dan modul Google Drive.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-[#21b1db] hover:bg-[#1da0c7] text-white font-semibold text-xs rounded-xl shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Tambah Konten
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
              <th className="py-3 px-4 w-12 text-center">Urutan</th>
              <th className="py-3 px-4">Judul Konten</th>
              <th className="py-3 px-4">Tipe</th>
              <th className="py-3 px-4">Visibilitas</th>
              <th className="py-3 px-4">Tautan / Keterangan</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Belum ada konten atau link yang ditambahkan untuk program ini.
                </td>
              </tr>
            ) : (
              contents.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                    {item.sortOrder}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {item.title}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">
                      {item.contentType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {item.visibility === 'member' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                        <Lock className="w-3 h-3" />
                        Khusus Member
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <Globe className="w-3 h-3" />
                        Publik
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#21b1db] hover:underline inline-flex items-center gap-1"
                      >
                        <span className="truncate max-w-[180px]">{item.url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    ) : (
                      item.content || '-'
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-xs">
                        <DropdownMenuItem onClick={() => openEditDialog(item)}>
                          <Pencil className="w-3.5 h-3.5 mr-2" />
                          Edit Konten
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => setDeletingId(item.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Hapus Konten
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Content Form Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">
              {editingContent ? 'Edit Konten' : 'Tambah Konten / Tautan'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="contTitle" className="text-xs font-semibold">
                Judul Konten
              </Label>
              <Input
                id="contTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Grup WhatsApp Angkatan 1"
                className="text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="contType" className="text-xs font-semibold">
                  Tipe Konten
                </Label>
                <select
                  id="contType"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#21b1db]/20 focus:border-[#21b1db]"
                >
                  <option value="whatsapp_group">WhatsApp Group Link</option>
                  <option value="zoom_link">Zoom / Live Session Link</option>
                  <option value="google_drive">Google Drive / Resource</option>
                  <option value="lesson">Modul / Silabus</option>
                  <option value="text">Catatan / Teks Panduan</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contVis" className="text-xs font-semibold">
                  Visibilitas
                </Label>
                <select
                  id="contVis"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as 'public' | 'member')}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#21b1db]/20 focus:border-[#21b1db]"
                >
                  <option value="member">Khusus Member (Berbayar)</option>
                  <option value="public">Publik (Katalog Umum)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contUrl" className="text-xs font-semibold">
                Tautan URL (Opsional)
              </Label>
              <Input
                id="contUrl"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://chat.whatsapp.com/... atau https://zoom.us/..."
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contBody" className="text-xs font-semibold">
                Keterangan / Panduan (Opsional)
              </Label>
              <textarea
                id="contBody"
                rows={2}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Petunjuk penggunaan atau jadwal sesi..."
                className="w-full p-2.5 rounded-md border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#21b1db]/20 focus:border-[#21b1db]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contSort" className="text-xs font-semibold">
                Nomor Urutan
              </Label>
              <Input
                id="contSort"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#21b1db] hover:bg-[#1da0c7] text-white font-semibold rounded-xl text-xs shadow-sm"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                {editingContent ? 'Simpan Perubahan' : 'Tambah Konten'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg">
              Hapus Konten Ini?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              Tautan dan konten ini akan dihapus secara permanen dari halaman program dan ruang kelas member.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="rounded-xl text-xs">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
