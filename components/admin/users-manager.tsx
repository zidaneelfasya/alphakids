'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateUserRoleAction } from '@/lib/actions/admin-users';
import {
  Users,
  Search,
  ShieldCheck,
  User,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export interface AdminUserItem {
  id: string;
  fullName: string | null;
  email: string | null;
  role: 'admin' | 'user';
  createdAt: Date | string;
  enrollmentCount: number;
}

interface UsersManagerProps {
  users: AdminUserItem[];
  currentUserId: string;
}

export function UsersManager({ users, currentUserId }: UsersManagerProps) {
  const [search, setSearch] = useState('');
  const [pendingChange, setPendingChange] = useState<{
    user: AdminUserItem;
    targetRole: 'admin' | 'user';
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredUsers = users.filter((u) => {
    return (
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.fullName && u.fullName.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleConfirmRoleChange = async () => {
    if (!pendingChange) return;
    setIsUpdating(true);

    try {
      const res = await updateUserRoleAction(
        pendingChange.user.id,
        pendingChange.targetRole
      );
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memperbarui role');
    } finally {
      setIsUpdating(false);
      setPendingChange(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            Kelola Pengguna
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar akun peserta dan administrator platform Alpha Kids.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            <span className="text-slate-400 font-medium">Total Akun: </span>
            <span className="font-bold text-slate-900">{users.length}</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl shadow-sm">
            <span className="text-amber-700 font-medium">Admin: </span>
            <span className="font-bold text-amber-900">
              {users.filter((u) => u.role === 'admin').length}
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pengguna berdasarkan nama atau email..."
            className="pl-9 text-xs h-9"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
              <th className="py-3 px-4">Pengguna</th>
              <th className="py-3 px-4">Role Saat Ini</th>
              <th className="py-3 px-4">Program Diikuti</th>
              <th className="py-3 px-4">Terdaftar Sejak</th>
              <th className="py-3 px-4 text-right">Ubah Hak Akses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Tidak ditemukan pengguna yang sesuai.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 block">
                      {u.fullName || 'Tanpa Nama'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {u.email}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-300/60">
                        <ShieldCheck className="w-3 h-3 text-amber-700" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        <User className="w-3 h-3 text-slate-400" />
                        Peserta
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      {u.enrollmentCount} Program
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {u.id === currentUserId ? (
                      <span className="text-[11px] text-slate-400 italic">Akun Anda</span>
                    ) : u.role === 'admin' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPendingChange({ user: u, targetRole: 'user' })
                        }
                        className="text-xs h-8 text-slate-600 hover:text-red-700 hover:border-red-200"
                      >
                        Cabut Admin
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPendingChange({ user: u, targetRole: 'admin' })
                        }
                        className="text-xs h-8 text-amber-700 hover:text-amber-800 hover:border-amber-300"
                      >
                        Jadikan Admin
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Role Change Modal */}
      <AlertDialog
        open={!!pendingChange}
        onOpenChange={(open) => !open && setPendingChange(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg">
              {pendingChange?.targetRole === 'admin'
                ? 'Jadikan Pengguna Sebagai Admin?'
                : 'Cabut Hak Akses Admin?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              {pendingChange?.targetRole === 'admin'
                ? `Pengguna ${pendingChange.user.email} akan memiliki akses penuh ke manajemen program, gateway pembayaran, voucher, dan transaksi platform.`
                : `Pengguna ${pendingChange?.user.email} tidak akan lagi memiliki hak akses ke panel manajemen admin.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating} className="rounded-xl text-xs">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRoleChange}
              disabled={isUpdating}
              className={`rounded-xl text-xs font-bold ${
                pendingChange?.targetRole === 'admin'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              {pendingChange?.targetRole === 'admin' ? 'Konfirmasi Admin' : 'Cabut Akses'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
