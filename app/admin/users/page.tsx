import { requireAdmin } from '@/lib/auth/guards';
import { db, profiles, programAccess } from '@/lib/db';
import { desc, sql } from 'drizzle-orm';
import { AdminShell } from '@/components/admin/admin-shell';
import { UsersManager, AdminUserItem } from '@/components/admin/users-manager';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const { user } = await requireAdmin('/admin/users');

  // Fetch all profiles and count of active enrollments
  const allUsers = await db
    .select({
      id: profiles.id,
      fullName: profiles.fullName,
      email: profiles.email,
      role: profiles.role,
      createdAt: profiles.createdAt,
      enrollmentCount: sql<number>`count(${programAccess.id})::int`,
    })
    .from(profiles)
    .leftJoin(
      programAccess,
      sql`${profiles.id} = ${programAccess.userId} AND ${programAccess.status} = 'active'`
    )
    .groupBy(profiles.id)
    .orderBy(desc(profiles.createdAt));

  const formattedUsers: AdminUserItem[] = allUsers.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    role: u.role as 'admin' | 'user',
    createdAt: u.createdAt,
    enrollmentCount: u.enrollmentCount || 0,
  }));

  return (
    <AdminShell
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Kelola Pengguna' },
      ]}
    >
      <div className="max-w-5xl mx-auto">
        <UsersManager users={formattedUsers} currentUserId={user.id} />
      </div>
    </AdminShell>
  );
}
