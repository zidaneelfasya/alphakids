'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  createVoucherAction,
  updateVoucherAction,
  deleteVoucherAction,
  VoucherInput,
} from '@/lib/actions/admin-vouchers';
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
  Ticket,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface VoucherItem {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
  createdAt: Date | string;
}

interface VouchersManagerProps {
  vouchers: VoucherItem[];
}

export function VouchersManager({ vouchers }: VouchersManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<VoucherItem | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateDialog = () => {
    setEditingVoucher(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    setIsActive(true);
    setIsDialogOpen(true);
  };

  const openEditDialog = (voucher: VoucherItem) => {
    setEditingVoucher(voucher);
    setCode(voucher.code);
    setDiscountType(voucher.discountType);
    setDiscountValue(String(voucher.discountValue));
    setIsActive(voucher.isActive);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Kode voucher wajib diisi');
      return;
    }

    const val = parseInt(discountValue, 10);
    if (isNaN(val) || val <= 0) {
      toast.error('Nilai diskon harus berupa angka lebih besar dari 0');
      return;
    }

    if (discountType === 'percentage' && val > 100) {
      toast.error('Diskon persentase tidak boleh lebih dari 100%');
      return;
    }

    setIsSubmitting(true);
    const payload: VoucherInput = {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: val,
      isActive,
    };

    try {
      if (editingVoucher) {
        const res = await updateVoucherAction(editingVoucher.id, payload);
        if (res.success) {
          toast.success(res.message);
          setIsDialogOpen(false);
        }
      } else {
        const res = await createVoucherAction(payload);
        if (res.success) {
          toast.success(res.message);
          setIsDialogOpen(false);
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan voucher');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (voucher: VoucherItem) => {
    try {
      const res = await updateVoucherAction(voucher.id, { isActive: !voucher.isActive });
      if (res.success) {
        toast.success(`Voucher ${voucher.code} ${!voucher.isActive ? 'diaktifkan' : 'dinonaktifkan'}`);
      }
    } catch {
      toast.error('Gagal memperbarui status voucher');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const res = await deleteVoucherAction(deletingId);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus voucher');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold font-sans text-slate-900 dark:text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#21b1db]" />
            Kelola Voucher Diskon
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Buat dan atur kode promo untuk checkout program Alpha Kids.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-[#21b1db] hover:bg-[#1da0c7] text-white font-semibold text-xs rounded-xl shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Tambah Voucher
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
              <th className="py-3 px-4">Kode Voucher</th>
              <th className="py-3 px-4">Tipe Diskon</th>
              <th className="py-3 px-4">Nilai Potongan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vouchers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Belum ada voucher yang dibuat. Klik tombol di atas untuk menambahkan voucher baru.
                </td>
              </tr>
            ) : (
              vouchers.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tracking-wider">
                    {item.code}
                  </td>
                  <td className="py-3.5 px-4 capitalize">
                    {item.discountType === 'percentage' ? 'Persentase (%)' : 'Potongan Tetap (Rp)'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {item.discountType === 'percentage'
                      ? `${item.discountValue}%`
                      : `Rp ${item.discountValue.toLocaleString('id-ID')}`}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-colors ${
                        item.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100/70'
                          : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200/60'
                      }`}
                    >
                      {item.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Aktif
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-slate-400" />
                          Nonaktif
                        </>
                      )}
                    </button>
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
                          Edit Voucher
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => setDeletingId(item.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Hapus Voucher
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

      {/* Voucher Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">
              {editingVoucher ? 'Edit Voucher' : 'Tambah Voucher Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="vCode" className="text-xs font-semibold">
                Kode Voucher
              </Label>
              <Input
                id="vCode"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Contoh: ALPHAJUARA"
                className="text-xs font-mono uppercase tracking-wider"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vType" className="text-xs font-semibold">
                Tipe Diskon
              </Label>
              <select
                id="vType"
                value={discountType}
                onChange={(e) =>
                  setDiscountType(e.target.value as 'percentage' | 'fixed')
                }
                className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#21b1db]/20 focus:border-[#21b1db]"
              >
                <option value="percentage">Persentase (%)</option>
                <option value="fixed">Potongan Tetap Nominal (Rp)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vValue" className="text-xs font-semibold">
                {discountType === 'percentage'
                  ? 'Nilai Diskon (1 - 100 %)'
                  : 'Nilai Diskon Nominal (Rp)'}
              </Label>
              <Input
                id="vValue"
                type="number"
                min="1"
                max={discountType === 'percentage' ? 100 : undefined}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === 'percentage' ? '20' : '50000'}
                className="text-xs"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="vActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-[#21b1db] focus:ring-[#21b1db]/30 h-4 w-4"
              />
              <Label htmlFor="vActive" className="text-xs font-medium cursor-pointer">
                Aktifkan voucher ini segera
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
                {editingVoucher ? 'Simpan Perubahan' : 'Buat Voucher'}
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
              Hapus Voucher Ini?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              Voucher ini akan dihapus permanen dan tidak dapat lagi digunakan oleh peserta di halaman checkout.
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
