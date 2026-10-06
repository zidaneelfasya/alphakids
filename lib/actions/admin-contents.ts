'use server';

import { db, programContents } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { assertAdminMutation } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';

export interface ProgramContentInput {
  programId: string;
  title: string;
  contentType: string; // 'whatsapp_group' | 'zoom_link' | 'google_drive' | 'lesson' | 'text' | 'file'
  url?: string | null;
  content?: string | null;
  visibility: 'public' | 'member';
  sortOrder?: number;
}

export async function createProgramContentAction(data: ProgramContentInput) {
  await assertAdminMutation();

  const [content] = await db
    .insert(programContents)
    .values({
      programId: data.programId,
      title: data.title.trim(),
      contentType: data.contentType,
      url: data.url?.trim() || null,
      content: data.content?.trim() || null,
      visibility: data.visibility,
      sortOrder: data.sortOrder || 0,
    })
    .returning();

  revalidatePath(`/admin/programs/${data.programId}/contents`);
  revalidatePath('/dashboard/programs');
  return { success: true, message: 'Konten berhasil ditambahkan', content };
}

export async function updateProgramContentAction(
  id: string,
  programId: string,
  data: Partial<ProgramContentInput>
) {
  await assertAdminMutation();

  await db
    .update(programContents)
    .set({
      ...(data.title && { title: data.title.trim() }),
      ...(data.contentType && { contentType: data.contentType }),
      ...(data.url !== undefined && { url: data.url?.trim() || null }),
      ...(data.content !== undefined && { content: data.content?.trim() || null }),
      ...(data.visibility && { visibility: data.visibility }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      updatedAt: new Date(),
    })
    .where(eq(programContents.id, id));

  revalidatePath(`/admin/programs/${programId}/contents`);
  revalidatePath('/dashboard/programs');
  return { success: true, message: 'Konten berhasil diperbarui' };
}

export async function deleteProgramContentAction(id: string, programId: string) {
  await assertAdminMutation();

  await db.delete(programContents).where(eq(programContents.id, id));

  revalidatePath(`/admin/programs/${programId}/contents`);
  revalidatePath('/dashboard/programs');
  return { success: true, message: 'Konten berhasil dihapus' };
}
