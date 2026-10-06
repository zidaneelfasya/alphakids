'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  setActivePaymentGatewayAction,
  updatePaymentGatewayConfigAction,
} from '@/lib/actions/admin-payment';
import { PaymentProvider } from '@/lib/payment/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Copy, Check, Loader2 } from 'lucide-react';

interface GatewayConfigRow {
  id: string;
  provider: string;
  isActive: boolean;
  config: unknown;
}

interface PaymentSettingsViewProps {
  configs: GatewayConfigRow[];
  siteUrl: string;
}

export function PaymentSettingsView({ configs, siteUrl }: PaymentSettingsViewProps) {
  const activeProvider = (configs.find((c) => c.isActive)?.provider as PaymentProvider) || null;

  // Midtrans config state
  const midtransDbConfig = (configs.find((c) => c.provider === 'MIDTRANS')?.config || {}) as Record<string, unknown>;
  const [midtransServerKey, setMidtransServerKey] = useState(
    (midtransDbConfig.serverKey as string) || (midtransDbConfig.server_key as string) || ''
  );
  const [midtransClientKey, setMidtransClientKey] = useState(
    (midtransDbConfig.clientKey as string) || (midtransDbConfig.client_key as string) || ''
  );
  const [midtransIsProduction, setMidtransIsProduction] = useState<boolean>(
    Boolean(midtransDbConfig.isProduction)
  );

  // Mayar config state
  const mayarDbConfig = (configs.find((c) => c.provider === 'MAYAR')?.config || {}) as Record<string, unknown>;
  const [mayarApiKey, setMayarApiKey] = useState(
    (mayarDbConfig.apiKey as string) || (mayarDbConfig.api_key as string) || ''
  );
  const [mayarWebhookSecret, setMayarWebhookSecret] = useState(
    (mayarDbConfig.webhookSecret as string) || (mayarDbConfig.webhook_secret as string) || ''
  );
  const [mayarBaseUrl, setMayarBaseUrl] = useState(
    (mayarDbConfig.baseUrl as string) || (mayarDbConfig.base_url as string) || 'https://api.mayar.id'
  );
  const [mayarIsProduction, setMayarIsProduction] = useState<boolean>(
    mayarDbConfig.isProduction !== undefined ? Boolean(mayarDbConfig.isProduction) : true
  );

  // UI state
  const [pendingProviderSwitch, setPendingProviderSwitch] = useState<PaymentProvider | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isSavingMidtrans, setIsSavingMidtrans] = useState(false);
  const [isSavingMayar, setIsSavingMayar] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const midtransWebhookUrl = `${siteUrl}/api/webhooks/midtrans`;
  const mayarWebhookUrl = `${siteUrl}/api/webhooks/mayar`;

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('Webhook URL berhasil disalin');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleConfirmSwitch = async () => {
    if (!pendingProviderSwitch) return;
    setIsSwitching(true);

    try {
      const res = await setActivePaymentGatewayAction(pendingProviderSwitch);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error('Gagal mengganti gateway');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengganti gateway');
    } finally {
      setIsSwitching(false);
      setPendingProviderSwitch(null);
    }
  };

  const handleSaveMidtrans = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMidtrans(true);

    try {
      const res = await updatePaymentGatewayConfigAction('MIDTRANS', {
        serverKey: midtransServerKey.trim(),
        clientKey: midtransClientKey.trim(),
        isProduction: midtransIsProduction,
      });
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan konfigurasi Midtrans');
    } finally {
      setIsSavingMidtrans(false);
    }
  };

  const handleSaveMayar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMayar(true);

    try {
      const res = await updatePaymentGatewayConfigAction('MAYAR', {
        apiKey: mayarApiKey.trim(),
        webhookSecret: mayarWebhookSecret.trim(),
        baseUrl: mayarBaseUrl.trim(),
        isProduction: mayarIsProduction,
      });
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan konfigurasi Mayar');
    } finally {
      setIsSavingMayar(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Overview Card: Active Gateway Switcher */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
        <div>
          <h2 className="text-base font-bold font-heading text-slate-900">
            Payment Gateway Aktif
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih penyedia gerbang pembayaran yang digunakan untuk memproses transaksi saat checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Midtrans Card */}
          <div
            className={`p-5 rounded-xl border transition-all ${
              activeProvider === 'MIDTRANS'
                ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-slate-900">Midtrans</span>
              {activeProvider === 'MIDTRANS' ? (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Aktif
                </span>
              ) : (
                <span className="text-xs text-slate-400">Non-aktif</span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Integrasi pembayaran via Snap API (QRIS, VA Bank, GoPay, Kartu Kredit).
            </p>
            {activeProvider !== 'MIDTRANS' && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold"
                onClick={() => setPendingProviderSwitch('MIDTRANS')}
              >
                Aktifkan Midtrans
              </Button>
            )}
          </div>

          {/* Mayar Card */}
          <div
            className={`p-5 rounded-xl border transition-all ${
              activeProvider === 'MAYAR'
                ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-slate-900">Mayar</span>
              {activeProvider === 'MAYAR' ? (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Aktif
                </span>
              ) : (
                <span className="text-xs text-slate-400">Non-aktif</span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Integrasi pembayaran via Headless API V2 (Invoice Link, QRIS, E-Wallet).
            </p>
            {activeProvider !== 'MAYAR' && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold"
                onClick={() => setPendingProviderSwitch('MAYAR')}
              >
                Aktifkan Mayar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Midtrans Settings Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold font-heading text-slate-900">
            Kredensial Midtrans
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dapatkan Server Key dan Client Key di Midtrans Dashboard → Settings → Access Keys.
          </p>
        </div>

        <form onSubmit={handleSaveMidtrans} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="midtransServerKey" className="text-xs font-semibold">
                Server Key
              </Label>
              <Input
                id="midtransServerKey"
                type="password"
                placeholder="SB-Mid-server-..."
                value={midtransServerKey}
                onChange={(e) => setMidtransServerKey(e.target.value)}
                className="text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="midtransClientKey" className="text-xs font-semibold">
                Client Key
              </Label>
              <Input
                id="midtransClientKey"
                type="text"
                placeholder="SB-Mid-client-..."
                value={midtransClientKey}
                onChange={(e) => setMidtransClientKey(e.target.value)}
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              id="midtransProduction"
              type="checkbox"
              checked={midtransIsProduction}
              onChange={(e) => setMidtransIsProduction(e.target.checked)}
              className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
            />
            <Label htmlFor="midtransProduction" className="text-xs font-medium cursor-pointer">
              Gunakan Lingkungan Production (Centang jika akun live, hapus centang untuk Sandbox)
            </Label>
          </div>

          {/* Webhook endpoint notification */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-700 block">Webhook Notification URL:</span>
              <span className="text-slate-500 font-mono text-[11px]">{midtransWebhookUrl}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(midtransWebhookUrl)}
              className="text-xs text-slate-600 hover:text-slate-900"
            >
              {copiedUrl === midtransWebhookUrl ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              Salin URL
            </Button>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={isSavingMidtrans}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
            >
              {isSavingMidtrans ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Simpan Pengaturan Midtrans
            </Button>
          </div>
        </form>
      </div>

      {/* Mayar Settings Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold font-heading text-slate-900">
            Kredensial Mayar
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dapatkan API Key di Mayar Dashboard → Integrasi → API Keys.
          </p>
        </div>

        <form onSubmit={handleSaveMayar} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="mayarApiKey" className="text-xs font-semibold">
                Mayar API Key
              </Label>
              <Input
                id="mayarApiKey"
                type="password"
                placeholder="key_live_..."
                value={mayarApiKey}
                onChange={(e) => setMayarApiKey(e.target.value)}
                className="text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mayarWebhookSecret" className="text-xs font-semibold">
                Webhook Secret (Opsional)
              </Label>
              <Input
                id="mayarWebhookSecret"
                type="text"
                placeholder="Token rahasia webhook"
                value={mayarWebhookSecret}
                onChange={(e) => setMayarWebhookSecret(e.target.value)}
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mayarBaseUrl" className="text-xs font-semibold">
              API Base URL
            </Label>
            <Input
              id="mayarBaseUrl"
              type="text"
              value={mayarBaseUrl}
              onChange={(e) => setMayarBaseUrl(e.target.value)}
              placeholder="https://api.mayar.id"
              className="text-xs font-mono"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              id="mayarProduction"
              type="checkbox"
              checked={mayarIsProduction}
              onChange={(e) => setMayarIsProduction(e.target.checked)}
              className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
            />
            <Label htmlFor="mayarProduction" className="text-xs font-medium cursor-pointer">
              Lingkungan Production (Centang untuk api.mayar.id, hapus centang untuk sandbox)
            </Label>
          </div>

          {/* Webhook endpoint notification */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-700 block">Webhook Notification URL:</span>
              <span className="text-slate-500 font-mono text-[11px]">{mayarWebhookUrl}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(mayarWebhookUrl)}
              className="text-xs text-slate-600 hover:text-slate-900"
            >
              {copiedUrl === mayarWebhookUrl ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              Salin URL
            </Button>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={isSavingMayar}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
            >
              {isSavingMayar ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Simpan Pengaturan Mayar
            </Button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal Dialog */}
      <AlertDialog
        open={!!pendingProviderSwitch}
        onOpenChange={(open) => !open && setPendingProviderSwitch(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg">
              Ganti Gateway Pembayaran Aktif?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              Transaksi checkout baru akan langsung diproses menggunakan{' '}
              <strong className="text-slate-900">{pendingProviderSwitch}</strong>. Pastikan Anda
              telah mengisi kredensial dan mendaftarkan URL webhook pada dashboard provider terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSwitching} className="rounded-xl text-xs">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSwitch}
              disabled={isSwitching}
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold"
            >
              {isSwitching ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Ya, Aktifkan {pendingProviderSwitch}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
