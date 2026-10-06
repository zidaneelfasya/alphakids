'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  issueCertificateAction,
  revokeCertificateAction,
} from '@/lib/actions/admin-certificates';
import {
  Award,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  Eye,
  Loader2,
  Sparkles,
} from 'lucide-react';
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

export interface CertificateItem {
  id: string;
  certificateNumber: string;
  recipientNameSnapshot: string;
  recipientEmailSnapshot: string;
  programNameSnapshot: string;
  certificateUrl: string | null;
  issuedAt: Date | string;
}

export interface ProgramOption {
  id: string;
  title: string;
}

export interface StudentOption {
  id: string;
  fullName: string;
  email: string | null;
}

interface CertificatesManagerProps {
  certificates: CertificateItem[];
  programs: ProgramOption[];
  students: StudentOption[];
}

export function CertificatesManager({
  certificates,
  programs,
  students,
}: CertificatesManagerProps) {
  const [search, setSearch] = useState('');
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [customRecipientName, setCustomRecipientName] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview Dialog State
  const [previewCert, setPreviewCert] = useState<CertificateItem | null>(null);

  // Revoke Dialog State
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const filteredCerts = certificates.filter((c) => {
    return (
      c.certificateNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.recipientNameSnapshot.toLowerCase().includes(search.toLowerCase()) ||
      c.programNameSnapshot.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    const found = students.find((s) => s.id === studentId);
    if (found) {
      setCustomRecipientName(found.fullName);
    }
  };

  const openIssueDialog = () => {
    setSelectedProgramId(programs[0]?.id || '');
    setSelectedStudentId(students[0]?.id || '');
    setCustomRecipientName(students[0]?.fullName || '');
    setCertificateUrl('');
    setIsIssueDialogOpen(true);
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgramId || !selectedStudentId) {
      toast.error('Pilih program dan peserta penerima');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await issueCertificateAction({
        programId: selectedProgramId,
        userId: selectedStudentId,
        recipientName: customRecipientName,
        certificateUrl: certificateUrl.trim() || undefined,
      });

      if (res.success) {
        toast.success(res.message);
        setIsIssueDialogOpen(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menerbitkan sertifikat');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeConfirm = async () => {
    if (!revokingId) return;
    setIsRevoking(true);
    try {
      const res = await revokeCertificateAction(revokingId);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal mencabut sertifikat');
    } finally {
      setIsRevoking(false);
      setRevokingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Penerbitan Sertifikat
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Terbitkan dan kelola sertifikat kelulusan digital resmi untuk peserta program Alpha Kids.
          </p>
        </div>

        <Button
          onClick={openIssueDialog}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Terbitkan Sertifikat
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari no. sertifikat, nama anak, atau program..."
            className="pl-9 text-xs h-9"
          />
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
                <th className="py-3 px-4">No. Sertifikat</th>
                <th className="py-3 px-4">Nama Penerima</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">Tanggal Terbit</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCerts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada sertifikat yang diterbitkan.
                  </td>
                </tr>
              ) : (
                filteredCerts.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-700">
                      {cert.certificateNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {cert.recipientNameSnapshot}
                      <span className="block text-[11px] text-slate-400 font-normal font-mono">
                        {cert.recipientEmailSnapshot}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {cert.programNameSnapshot}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(cert.issuedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewCert(cert)}
                        className="h-8 text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Lihat
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRevokingId(cert.id)}
                        className="h-8 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Cabut
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Certificate Dialog */}
      <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">
              Terbitkan Sertifikat Baru
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleIssueSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="cProgram" className="text-xs font-semibold">
                Program Pelatihan
              </Label>
              <select
                id="cProgram"
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                required
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cStudent" className="text-xs font-semibold">
                Pilih Peserta
              </Label>
              <select
                id="cStudent"
                value={selectedStudentId}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                required
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.email || 'Tanpa Email'})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cName" className="text-xs font-semibold">
                Nama Anak / Penerima di Sertifikat
              </Label>
              <Input
                id="cName"
                value={customRecipientName}
                onChange={(e) => setCustomRecipientName(e.target.value)}
                placeholder="Nama lengkap yang dicetak pada piagam..."
                className="text-xs font-medium"
                required
              />
              <span className="text-[11px] text-slate-400">
                Nama ini akan dicetak secara permanen pada dokumen piagam sertifikat.
              </span>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cUrl" className="text-xs font-semibold">
                Tautan File Dokumen / PDF (Opsional)
              </Label>
              <Input
                id="cUrl"
                value={certificateUrl}
                onChange={(e) => setCertificateUrl(e.target.value)}
                placeholder="https://drive.google.com/... atau tautan PDF eksternal"
                className="text-xs font-mono"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsIssueDialogOpen(false)}
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
                Terbitkan Sekarang
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Certificate Preview Modal */}
      <Dialog
        open={!!previewCert}
        onOpenChange={(open) => !open && setPreviewCert(null)}
      >
        <DialogContent className="rounded-3xl max-w-xl p-0 overflow-hidden bg-white border border-amber-200 shadow-xl">
          {previewCert && (
            <div>
              {/* Certificate Border Frame */}
              <div className="p-8 border-8 border-amber-100/60 m-3 rounded-2xl relative text-center space-y-5 bg-gradient-to-b from-amber-50/30 to-white">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  Piagam Penghargaan Resmi
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
                    SERTIFIKAT KELULUSAN
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Nomor: {previewCert.certificateNumber}
                  </p>
                </div>

                <div className="space-y-1 py-3">
                  <p className="text-xs text-slate-500">Diberikan dengan bangga kepada:</p>
                  <h4 className="text-2xl font-extrabold text-amber-600 font-heading">
                    {previewCert.recipientNameSnapshot}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Telah berhasil menyelesaikan seluruh kurikulum pembelajaran dan praktik pada program:
                </p>

                <div className="font-bold text-sm text-slate-900 bg-white py-2 px-4 rounded-xl border border-slate-200 inline-block">
                  {previewCert.programNameSnapshot}
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="text-left">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Tanggal Penerbitan
                    </span>
                    <span className="font-medium text-slate-800">
                      {new Date(previewCert.issuedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Penyelenggara
                    </span>
                    <span className="font-bold text-slate-900">
                      Alpha Kids Academy
                    </span>
                  </div>
                </div>

                {previewCert.certificateUrl && (
                  <div className="pt-2">
                    <a
                      href={previewCert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Buka Tautan Dokumen Eksternal
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation Modal */}
      <AlertDialog
        open={!!revokingId}
        onOpenChange={(open) => !open && setRevokingId(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg">
              Cabut Sertifikat Ini?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              Sertifikat akan dihapus permanen dari sistem dan tidak lagi dapat diakses oleh peserta di dashboard mereka.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking} className="rounded-xl text-xs">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeConfirm}
              disabled={isRevoking}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
            >
              {isRevoking ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Cabut Sertifikat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
