'use server';

import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { assertAdminMutation, requireAuth } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';

export async function updateUserRoleAction(userId: string, newRole: 'admin' | 'user') {
  await assertAdminMutation();
  const { user } = await requireAuth();

  if (userId === user.id && newRole !== 'admin') {
    throw new Error('Anda tidak dapat mencabut akses admin dari akun Anda sendiri.');
  }

  await db
    .update(profiles)
    .set({
      role: newRole,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, userId));

  revalidatePath('/admin/users');
  return {
    success: true,
    message: `Role pengguna berhasil diubah menjadi ${newRole}`,
  };
}
