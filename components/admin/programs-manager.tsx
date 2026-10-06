'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  createProgramAction,
  updateProgramAction,
  deleteProgramAction,
  ProgramInput,
} from '@/lib/actions/admin-programs';
import { formatRupiah } from '@/lib/utils';
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
import { MoreHorizontal, Plus, Pencil, Trash2, FolderOpen, Loader2 } from 'lucide-react';

interface ProgramListItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  ageRange: string | null;
  level: string | null;
  coverImage: string | null;
  categoryId: string | null;
  categoryName: string | null;
  isActive: boolean;
  createdAt: Date;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface ProgramsManagerProps {
  programs: ProgramListItem[];
  categories: CategoryOption[];
}

export function ProgramsManager({ programs, categories }: ProgramsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramListItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('0');
  const [ageRange, setAgeRange] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateDialog = () => {
    setEditingProgram(null);
    setTitle('');
    setSlug('');
    setCategoryId('');
    setPrice('0');
    setAgeRange('');
    setLevel('');
    setDescription('');
    setCoverImage('');
    setIsActive(true);
    setIsDialogOpen(true);
  };

  const openEditDialog = (prog: ProgramListItem) => {
    setEditingProgram(prog);
    setTitle(prog.title);
    setSlug(prog.slug);
    setCategoryId(prog.categoryId || '');
    setPrice(String(prog.price));
    setAgeRange(prog.ageRange || '');
    setLevel(prog.level || '');
    setDescription(prog.description || '');
    setCoverImage(prog.coverImage || '');
    setIsActive(prog.isActive);
    setIsDialogOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingProgram) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      toast.error('Judul dan slug program wajib diisi');
      return;
    }

    const numericPrice = parseInt(price, 10);
    if (isNaN(numericPrice) || numericPrice < 0) {
      toast.error('Harga program tidak valid');
      return;
    }

    setIsSubmitting(true);
    const payload: ProgramInput = {
      title,
      slug,
      categoryId: categoryId || null,
      price: numericPrice,
      ageRange,
      level,
      description,
      coverImage,
      isActive,
    };

    try {
      if (editingProgram) {
        const res = await updateProgramAction(editingProgram.id, payload);
        if (res.success) {
          toast.success(res.message);
          setIsDialogOpen(false);
        }
      } else {
        const res = await createProgramAction(payload);
        if (res.success) {
          toast.success(res.message);
          setIsDialogOpen(false);
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan program');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const res = await deleteProgramAction(deletingId);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus program');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold font-sans text-slate-900 dark:text-white">
            Daftar Program Pelatihan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Total {programs.length} program pembelajaran aktif dan arsip.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-[#21b1db] hover:bg-[#1da0c7] text-white font-semibold text-xs rounded-xl shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Tambah Program
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
              <th className="py-3 px-4">Nama Program</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Harga</th>
              <th className="py-3 px-4">Usia / Level</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {programs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Belum ada program yang dibuat.
                </td>
              </tr>
            ) : (
              programs.map((prog) => (
                <tr key={prog.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                    {prog.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {prog.categoryName || '-'}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    {formatRupiah(prog.price)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {prog.ageRange ? `Usia ${prog.ageRange}` : '-'}
                    {prog.level ? ` • ${prog.level}` : ''}
                  </td>
                  <td className="py-3.5 px-4">
                    {prog.isActive ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        Aktif
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                        Draft
                      </span>
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
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/programs/${prog.id}/contents`}>
                            <FolderOpen className="w-3.5 h-3.5 mr-2" />
                            Kelola Konten & Link
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(prog)}>
                          <Pencil className="w-3.5 h-3.5 mr-2" />
                          Edit Program
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => setDeletingId(prog.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Hapus Program
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

      {/* Program Form Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">
              {editingProgram ? 'Edit Program' : 'Tambah Program Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="progTitle" className="text-xs font-semibold">
                Judul Program
              </Label>
              <Input
                id="progTitle"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Contoh: Bimbingan Intensif OSN Matematika SD"
                className="text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="progSlug" className="text-xs font-semibold">
                  Slug URL
                </Label>
                <Input
                  id="progSlug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="osn-matematika-sd"
                  className="text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="progCategory" className="text-xs font-semibold">
                  Kategori
                </Label>
                <select
                  id="progCategory"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#21b1db]/20 focus:border-[#21b1db]"
                >
                  <option value="">-- Tanpa Kategori --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="progPrice" className="text-xs font-semibold">
                  Harga (Rp)
                </Label>
                <Input
                  id="progPrice"
                  type="number"
                  min="0"
                  step="1000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="progAge" className="text-xs font-semibold">
                  Rentang Usia
                </Label>
                <Input
                  id="progAge"
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  placeholder="7-12 Tahun"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="progLevel" className="text-xs font-semibold">
                  Tingkat / Level
                </Label>
                <Input
                  id="progLevel"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  placeholder="Pemula / Lanjutan"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="progCover" className="text-xs font-semibold">
                URL Gambar Sampul (Opsional)
              </Label>
              <Input
                id="progCover"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="progDesc" className="text-xs font-semibold">
                Deskripsi Program
              </Label>
              <textarea
                id="progDesc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan kurikulum, target capaian, dan keunggulan program..."
                className="w-full p-3 rounded-md border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#21b1db]/20 focus:border-[#21b1db]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="progActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-[#21b1db] focus:ring-[#21b1db]/30"
              />
              <Label htmlFor="progActive" className="text-xs font-medium cursor-pointer">
                Publikasikan Program di Katalog Publik
              </Label>
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
                {editingProgram ? 'Simpan Perubahan' : 'Buat Program'}
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
              Hapus Program?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              Program yang dihapus akan menghapus seluruh konten terkait. Pesanan yang telah selesai tidak dapat dihapus jika merujuk ke program ini.
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
