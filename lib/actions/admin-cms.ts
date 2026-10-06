'use server';

import { db, cmsSections } from '@/lib/db';
import { assertAdminMutation } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';
import type { CmsSectionContent } from '@/lib/cms';

export async function saveCmsSectionAction(sectionKey: string, content: CmsSectionContent) {
  await assertAdminMutation();

  if (!sectionKey || typeof sectionKey !== 'string') {
    throw new Error('Key bagian CMS tidak valid.');
  }

  await db
    .insert(cmsSections)
    .values({
      sectionKey: sectionKey.trim().toLowerCase(),
      content,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: cmsSections.sectionKey,
      set: {
        content,
        updatedAt: new Date(),
      },
    });

  revalidatePath('/');
  revalidatePath('/admin/cms');

  return { success: true, message: `Bagian "${sectionKey}" berhasil disimpan!` };
}
