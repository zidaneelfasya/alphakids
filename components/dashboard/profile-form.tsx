'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateUserProfileAction } from '@/lib/actions/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Loader2 } from 'lucide-react';

interface ProfileFormProps {
  initialData: {
    fullName: string;
    email: string | null;
    phone: string | null;
    role: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialData.fullName || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Nama lengkap wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updateUserProfileAction({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
      });

      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memperbarui profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        <div className="space-y-1.5">
          <Label htmlFor="profName" className="text-xs font-semibold text-slate-800">
            Nama Lengkap / Nama Anak
          </Label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="profName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Muhammad Zidane"
              className="pl-9 text-xs"
              required
            />
          </div>
          <span className="text-[11px] text-slate-400">
            Nama ini akan dicantumkan pada sertifikat dan grup kelas.
          </span>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profEmail" className="text-xs font-semibold text-slate-800">
            Alamat Email
          </Label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="profEmail"
              value={initialData.email || '-'}
              disabled
              className="pl-9 text-xs bg-slate-50 text-slate-500 font-mono"
            />
          </div>
          <span className="text-[11px] text-slate-400">
            Email terhubung dengan sistem autentikasi dan tidak dapat diubah dari formulir ini.
          </span>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profPhone" className="text-xs font-semibold text-slate-800">
            Nomor WhatsApp / Telepon
          </Label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="profPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081234567890"
              className="pl-9 text-xs font-mono"
            />
          </div>
          <span className="text-[11px] text-slate-400">
            Digunakan oleh tim instruktur untuk koordinasi kelas dan konfirmasi darurat.
          </span>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Status Akun:</span>
            <span className="font-semibold text-slate-800 capitalize bg-slate-100 px-2 py-0.5 rounded-full text-[10px]">
              {initialData.role}
            </span>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
