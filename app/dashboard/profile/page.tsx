import { requireAuth } from '@/lib/auth/guards';
import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardProfilePage() {
  const { user } = await requireAuth('/dashboard/profile');

  const [currentProfile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id));

  return (
    <DashboardShell
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Profil Saya' },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <User className="w-6 h-6 text-amber-500" />
            Pengaturan Profil Akun
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data diri dan kontak orang tua untuk komunikasi kelas belajar si kecil.
          </p>
        </div>

        <ProfileForm
          initialData={{
            fullName: currentProfile?.fullName || '',
            email: currentProfile?.email || user.email || null,
            phone: currentProfile?.phone || null,
            role: currentProfile?.role || 'user',
          }}
        />
      </div>
    </DashboardShell>
  );
}
