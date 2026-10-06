import { requireAdmin } from '@/lib/auth/guards';
import { db, paymentGatewayConfigs } from '@/lib/db';
import { AdminShell } from '@/components/admin/admin-shell';
import { PaymentSettingsView } from '@/components/admin/payment-settings-view';

export const metadata = {
  title: 'Pengaturan Gateway Pembayaran — Admin Alpha Kids',
  description: 'Kelola penyedia pembayaran Midtrans dan Mayar untuk platform Alpha Kids.',
};

export const dynamic = 'force-dynamic';

export default async function AdminPaymentSettingsPage() {
  await requireAdmin('/dashboard');

  // Fetch all payment gateway configs via Drizzle ORM
  const configs = await db.select().from(paymentGatewayConfigs);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <AdminShell
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Pengaturan' },
        { label: 'Gateway Pembayaran' },
      ]}
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">
            Pengaturan Gateway Pembayaran
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi Midtrans dan Mayar. Pilih penyedia aktif yang digunakan untuk memproses checkout pelanggan.
          </p>
        </div>

        <PaymentSettingsView configs={configs} siteUrl={siteUrl} />
      </div>
    </AdminShell>
  );
}
