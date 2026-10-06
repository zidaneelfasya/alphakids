'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/lib/actions/admin-categories';
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
import { MoreHorizontal, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
}

interface CategoriesManagerProps {
  categories: CategoryRow[];
}

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deletion modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateDialog = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setIsActive(true);
    setIsDialogOpen(true);
  };

  const openEditDialog = (cat: CategoryRow) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setIsActive(cat.isActive);
    setIsDialogOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
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
    if (!name.trim() || !slug.trim()) {
      toast.error('Nama dan slug kategori wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const res = await updateCategoryAction(editingCategory.id, {
          name,
          slug,
          description,
          isActive,
        });
        if (res.success) {
          toast.success(res.message);
          setIsDialogOpen(false);
        }
      } else {
        const res = await createCategoryAction({
          name,
          slug,
          description,
          isActive,
        });
        if (res.success) {
          toast.success(res.message);
          setIsDialogOpen(false);
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan kategori');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const res = await deleteCategoryAction(deletingId);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus kategori');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold font-heading text-slate-900">
            Daftar Kategori
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {categories.length} kategori program terdaftar.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Tambah Kategori
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
              <th className="py-3 px-4">Nama Kategori</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Deskripsi</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Belum ada kategori yang dibuat.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {cat.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {cat.slug}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                    {cat.description || '-'}
                  </td>
                  <td className="py-3.5 px-4">
                    {cat.isActive ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        Aktif
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                        Non-aktif
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
                        <DropdownMenuItem onClick={() => openEditDialog(cat)}>
                          <Pencil className="w-3.5 h-3.5 mr-2" />
                          Edit Kategori
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => setDeletingId(cat.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Hapus Kategori
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

      {/* Form Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">
              {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="catName" className="text-xs font-semibold">
                Nama Kategori
              </Label>
              <Input
                id="catName"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: Olimpiade Matematika"
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="catSlug" className="text-xs font-semibold">
                Slug URL
              </Label>
              <Input
                id="catSlug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="olimpiade-matematika"
                className="text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="catDesc" className="text-xs font-semibold">
                Deskripsi (Opsional)
              </Label>
              <Input
                id="catDesc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Keterangan singkat kategori"
                className="text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="catActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
              />
              <Label htmlFor="catActive" className="text-xs font-medium cursor-pointer">
                Kategori Aktif & Ditampilkan di Katalog
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
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                {editingCategory ? 'Simpan Perubahan' : 'Buat Kategori'}
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
              Hapus Kategori?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              Kategori yang dihapus tidak dapat dipulihkan. Program yang terhubung dengan kategori ini akan berubah menjadi tanpa kategori.
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
