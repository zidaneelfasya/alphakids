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
        <h1 className="text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" />
          Sertifikat Saya
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Daftar piagam penghargaan dan bukti kelulusan program yang telah diselesaikan.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60">
            <Award className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Belum Ada Sertifikat yang Diterbitkan
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ikuti dan selesaikan seluruh sesi program kelas si kecil. Instruktur dan admin Alpha Kids akan menerbitkan sertifikat resmi setelah program berakhir.
            </p>
          </div>
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl">
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
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-amber-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Terverifikasi
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {cert.certificateNumber}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold font-heading text-slate-900 line-clamp-2">
                    {cert.programNameSnapshot}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Atas nama:{' '}
                    <span className="font-semibold text-slate-800">
                      {cert.recipientNameSnapshot}
                    </span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
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
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl h-8"
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
        <DialogContent className="rounded-3xl max-w-xl p-0 overflow-hidden bg-white border border-amber-200 shadow-2xl">
          {selectedCert && (
            <div>
              {/* Certificate Border Frame */}
              <div
                id="printable-certificate"
                className="p-8 border-8 border-amber-100/70 m-3 rounded-2xl relative text-center space-y-5 bg-gradient-to-b from-amber-50/40 to-white"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  Piagam Penghargaan Resmi
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
                    SERTIFIKAT KELULUSAN
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Nomor: {selectedCert.certificateNumber}
                  </p>
                </div>

                <div className="space-y-1 py-3">
                  <p className="text-xs text-slate-500">Diberikan dengan bangga kepada:</p>
                  <h4 className="text-2xl font-extrabold text-amber-600 font-heading">
                    {selectedCert.recipientNameSnapshot}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Telah berhasil menyelesaikan seluruh kurikulum pembelajaran dan praktik pada program:
                </p>

                <div className="font-bold text-sm text-slate-900 bg-white py-2 px-4 rounded-xl border border-slate-200 inline-block">
                  {selectedCert.programNameSnapshot}
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="text-left">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Tanggal Terbit
                    </span>
                    <span className="font-medium text-slate-800">
                      {new Date(selectedCert.issuedAt).toLocaleDateString('id-ID', {
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

                {selectedCert.certificateUrl && (
                  <div className="pt-2">
                    <a
                      href={selectedCert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Unduh Berkas Asli (PDF/Drive)
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Action Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="rounded-xl text-xs font-semibold"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Cetak / Simpan PDF
                </Button>
                <Button
                  size="sm"
                  onClick={() => setSelectedCert(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
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
