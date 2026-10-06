'use client';

import { useState } from 'react';
import {
  Award,
  Calendar,
  Sparkles,
  ExternalLink,
  Printer,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import Link from 'next/link';

export interface MemberCertificate {
  id: string;
  certificateNumber: string;
  recipientNameSnapshot: string;
  programNameSnapshot: string;
  certificateUrl: string | null;
  issuedAt: Date | string;
}

interface MemberCertificatesViewProps {
  certificates: MemberCertificate[];
}

export function MemberCertificatesView({
  certificates,
}: MemberCertificatesViewProps) {
  const [selectedCert, setSelectedCert] = useState<MemberCertificate | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold font-sans text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="size-6 text-[#21b1db]" />
          Sertifikat Saya
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
          Daftar piagam penghargaan dan bukti kelulusan program yang telah diselesaikan.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center shadow-sm space-y-4">
          <div className="size-16 rounded-2xl bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db] flex items-center justify-center mx-auto">
            <Award className="size-8 stroke-[1.75]" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-sans">
              Belum Ada Sertifikat yang Diterbitkan
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Ikuti dan selesaikan seluruh sesi program kelas si kecil. Instruktur dan admin Alpha Kids akan menerbitkan sertifikat resmi setelah program berakhir.
            </p>
          </div>
          <Button asChild className="bg-[#21b1db] hover:bg-[#1da0c7] text-white font-semibold text-xs rounded-full shadow-md shadow-[#21b1db]/20">
            <Link href="/dashboard/programs">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              Buka Program Saya
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:border-[#21b1db]/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Terverifikasi
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {cert.certificateNumber}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold font-sans text-slate-900 dark:text-white line-clamp-2">
                    {cert.programNameSnapshot}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Atas nama:{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cert.recipientNameSnapshot}
                    </span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(cert.issuedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>

                <Button
                  size="sm"
                  onClick={() => setSelectedCert(cert)}
                  className="bg-[#21b1db] hover:bg-[#1da0c7] text-white text-xs font-semibold rounded-full h-8 px-4"
                >
                  Lihat Sertifikat
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Viewer Modal */}
      <Dialog
        open={!!selectedCert}
        onOpenChange={(open) => !open && setSelectedCert(null)}
      >
        <DialogContent className="rounded-3xl max-w-xl p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
          {selectedCert && (
            <div>
              {/* Certificate Border Frame */}
              <div
                id="printable-certificate"
                className="p-8 border-4 border-[#21b1db]/20 m-3 rounded-2xl relative text-center space-y-5 bg-[#FFFDF9] dark:bg-slate-950"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8FA] dark:bg-cyan-950 text-[#21b1db] text-[11px] font-semibold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  Piagam Penghargaan Resmi
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold font-sans text-slate-900 dark:text-white tracking-tight">
                    SERTIFIKAT KELULUSAN
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Nomor: {selectedCert.certificateNumber}
                  </p>
                </div>

                <div className="space-y-1 py-3">
                  <p className="text-xs text-slate-500">Diberikan dengan bangga kepada:</p>
                  <h4 className="text-2xl font-semibold text-[#21b1db] font-sans">
                    {selectedCert.recipientNameSnapshot}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Telah berhasil menyelesaikan seluruh kurikulum pembelajaran dan praktik pada program:
                </p>

                <div className="font-semibold text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 inline-block">
                  {selectedCert.programNameSnapshot}
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="text-left">
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">
                      Tanggal Terbit
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {new Date(selectedCert.issuedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">
                      Penyelenggara
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Alpha Kids Academy
                    </span>
                  </div>
                </div>

                {selectedCert.certificateUrl && (
                  <div className="pt-2">
                    <a
                      href={selectedCert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#21b1db] hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Unduh Berkas Asli (PDF/Drive)
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Action Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="rounded-full text-xs font-semibold"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Cetak / Simpan PDF
                </Button>
                <Button
                  size="sm"
                  onClick={() => setSelectedCert(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold px-4"
                >
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
