'use server';

import { db, programs } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { assertAdminMutation } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';

export interface ProgramInput {
  title: string;
  slug: string;
  categoryId?: string | null;
  description?: string;
  price: number;
  ageRange?: string;
  level?: string;
  coverImage?: string;
  isActive?: boolean;
}

export async function createProgramAction(data: ProgramInput) {
  await assertAdminMutation();

  const [program] = await db
    .insert(programs)
    .values({
      title: data.title.trim(),
      slug: data.slug.trim().toLowerCase(),
      categoryId: data.categoryId || null,
      description: data.description?.trim() || null,
      price: Math.max(0, Math.round(data.price)),
      ageRange: data.ageRange?.trim() || null,
      level: data.level?.trim() || null,
      coverImage: data.coverImage?.trim() || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    })
    .returning();

  revalidatePath('/admin/programs');
  revalidatePath('/programs');
  return { success: true, message: 'Program berhasil dibuat', program };
}

export async function updateProgramAction(id: string, data: Partial<ProgramInput>) {
  await assertAdminMutation();

  await db
    .update(programs)
    .set({
      ...(data.title && { title: data.title.trim() }),
      ...(data.slug && { slug: data.slug.trim().toLowerCase() }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId || null }),
      ...(data.description !== undefined && { description: data.description.trim() || null }),
      ...(data.price !== undefined && { price: Math.max(0, Math.round(data.price)) }),
      ...(data.ageRange !== undefined && { ageRange: data.ageRange.trim() || null }),
      ...(data.level !== undefined && { level: data.level.trim() || null }),
      ...(data.coverImage !== undefined && { coverImage: data.coverImage.trim() || null }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      updatedAt: new Date(),
    })
    .where(eq(programs.id, id));

  revalidatePath('/admin/programs');
  revalidatePath(`/admin/programs/${id}`);
  revalidatePath('/programs');
  return { success: true, message: 'Program berhasil diperbarui' };
}

export async function deleteProgramAction(id: string) {
  await assertAdminMutation();

  await db.delete(programs).where(eq(programs.id, id));

  revalidatePath('/admin/programs');
  revalidatePath('/programs');
  return { success: true, message: 'Program berhasil dihapus' };
}
