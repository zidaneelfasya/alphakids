import Image from 'next/image';
import { requireAuth } from '@/lib/auth/guards';
import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { getDicebearMoodsAvatar } from '@/lib/avatar';

export const dynamic = 'force-dynamic';

export default async function DashboardProfilePage() {
  const { user } = await requireAuth('/dashboard/profile');

  const [currentProfile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id));

  const userName = currentProfile?.fullName || user.email?.split('@')[0] || 'Peserta';
  const userAvatar =
    (currentProfile?.avatarUrl && !currentProfile.avatarUrl.includes('Simbol Tutor')
      ? currentProfile.avatarUrl
      : null) || getDicebearMoodsAvatar(user.email || userName);

  return (
    <DashboardShell
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Profil Saya' },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative size-16 rounded-full ring-4 ring-[#E8F8FA] dark:ring-cyan-950/80 border-2 border-[#21b1db] shadow-md overflow-hidden bg-[#E8F8FA] shrink-0">
            <Image
              src={userAvatar}
              alt={userName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold font-sans text-slate-900 dark:text-white">
              Pengaturan Profil Akun
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Kelola data diri dan kontak orang tua untuk komunikasi kelas belajar si kecil.
            </p>
          </div>
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
