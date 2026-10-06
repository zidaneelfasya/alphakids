'use server';

import { db, categories } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { assertAdminMutation } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';

export async function createCategoryAction(data: {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}) {
  await assertAdminMutation();

  const [category] = await db
    .insert(categories)
    .values({
      name: data.name.trim(),
      slug: data.slug.trim().toLowerCase(),
      description: data.description?.trim() || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    })
    .returning();

  revalidatePath('/admin/categories');
  revalidatePath('/programs');
  return { success: true, message: 'Kategori berhasil ditambahkan', category };
}

export async function updateCategoryAction(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
  }
) {
  await assertAdminMutation();

  await db
    .update(categories)
    .set({
      ...(data.name && { name: data.name.trim() }),
      ...(data.slug && { slug: data.slug.trim().toLowerCase() }),
      ...(data.description !== undefined && { description: data.description.trim() || null }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id));

  revalidatePath('/admin/categories');
  revalidatePath('/programs');
  return { success: true, message: 'Kategori berhasil diperbarui' };
}

export async function deleteCategoryAction(id: string) {
  await assertAdminMutation();

  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath('/admin/categories');
  revalidatePath('/programs');
  return { success: true, message: 'Kategori berhasil dihapus' };
}
