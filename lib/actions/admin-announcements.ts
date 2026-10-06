'use server';

import { db, announcements } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { assertAdminMutation } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';

export interface AnnouncementInput {
  programId?: string | null;
  title: string;
  content: string;
  isPublished?: boolean;
}

export async function createAnnouncementAction(data: AnnouncementInput) {
  await assertAdminMutation();

  const [announcement] = await db
    .insert(announcements)
    .values({
      programId: data.programId || null,
      title: data.title.trim(),
      content: data.content.trim(),
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    })
    .returning();

  revalidatePath('/dashboard/programs');
  return {
    success: true,
    message: 'Pengumuman berhasil dipublikasikan',
    announcement,
  };
}

export async function deleteAnnouncementAction(id: string) {
  await assertAdminMutation();

  await db.delete(announcements).where(eq(announcements.id, id));

  revalidatePath('/dashboard/programs');
  return {
    success: true,
    message: 'Pengumuman berhasil dihapus',
  };
}
