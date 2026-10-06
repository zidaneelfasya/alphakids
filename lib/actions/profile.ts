'use server';

import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';

export async function updateUserProfileAction(data: {
  fullName: string;
  phone?: string;
}) {
  const { user } = await requireAuth();

  if (!data.fullName.trim()) {
    throw new Error('Nama lengkap tidak boleh kosong');
  }

  await db
    .update(profiles)
    .set({
      fullName: data.fullName.trim(),
      phone: data.phone?.trim() || null,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, user.id));

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/profile');

  return {
    success: true,
    message: 'Profil berhasil diperbarui',
  };
}
