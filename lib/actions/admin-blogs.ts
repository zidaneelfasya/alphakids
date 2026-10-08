'use server';

import { db, cmsSections } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { assertAdminMutation } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';
import type { BlogItem, BlogSectionContent } from '@/lib/cms-types';
import { DEFAULT_BLOGS } from '@/lib/cms-types';

async function getStoredBlogSection(): Promise<BlogSectionContent> {
  const rows = await db
    .select()
    .from(cmsSections)
    .where(eq(cmsSections.sectionKey, 'blogs'))
    .limit(1);

  if (rows.length > 0 && rows[0].content) {
    return { ...DEFAULT_BLOGS, ...(rows[0].content as object) } as BlogSectionContent;
  }
  return DEFAULT_BLOGS;
}

async function saveStoredBlogSection(content: BlogSectionContent) {
  await db
    .insert(cmsSections)
    .values({
      sectionKey: 'blogs',
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

  revalidatePath('/admin/blogs');
  revalidatePath('/admin/cms');
  revalidatePath('/blog');
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/');
}

export async function createBlogItemAction(data: Omit<BlogItem, 'id'>) {
  await assertAdminMutation();

  const currentSection = await getStoredBlogSection();
  const newId = String(Date.now());
  const newItem: BlogItem = {
    id: newId,
    title: data.title.trim(),
    slug: (data.slug || data.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, ''),
    excerpt: data.excerpt.trim(),
    imageUrl: data.imageUrl || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/hero1.png',
    tag: data.tag?.trim() || 'Gamifikasi',
    readTime: data.readTime?.trim() || '4 mnt baca',
    publishedAt: data.publishedAt?.trim() || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    author: data.author?.trim() || 'Tim Kurikulum Alpha Kids',
    content: data.content?.trim() || '',
  };

  const updatedItems = [newItem, ...(currentSection.items || [])];
  const updatedSection: BlogSectionContent = {
    ...currentSection,
    items: updatedItems,
  };

  await saveStoredBlogSection(updatedSection);

  return { success: true, message: 'Artikel baru berhasil diterbitkan!', item: newItem };
}

export async function updateBlogItemAction(item: BlogItem) {
  await assertAdminMutation();

  if (!item.id) {
    throw new Error('ID artikel tidak valid.');
  }

  const currentSection = await getStoredBlogSection();
  const existingItems = currentSection.items || [];
  const index = existingItems.findIndex((b) => b.id === item.id);

  if (index === -1) {
    throw new Error(`Artikel dengan ID "${item.id}" tidak ditemukan.`);
  }

  const updatedItem: BlogItem = {
    ...existingItems[index],
    title: item.title.trim(),
    slug: item.slug
      ? item.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : existingItems[index].slug,
    excerpt: item.excerpt.trim(),
    imageUrl: item.imageUrl,
    tag: item.tag?.trim() || existingItems[index].tag || 'Gamifikasi',
    readTime: item.readTime?.trim() || existingItems[index].readTime || '4 mnt baca',
    publishedAt: item.publishedAt?.trim() || existingItems[index].publishedAt || '',
    author: item.author?.trim() || existingItems[index].author || 'Tim Kurikulum Alpha Kids',
    content: item.content !== undefined ? item.content : existingItems[index].content,
  };

  const updatedItems = [...existingItems];
  updatedItems[index] = updatedItem;

  const updatedSection: BlogSectionContent = {
    ...currentSection,
    items: updatedItems,
  };

  await saveStoredBlogSection(updatedSection);

  return { success: true, message: 'Artikel berhasil diperbarui!', item: updatedItem };
}

export async function deleteBlogItemAction(id: string) {
  await assertAdminMutation();

  const currentSection = await getStoredBlogSection();
  const updatedItems = (currentSection.items || []).filter((b) => b.id !== id);

  const updatedSection: BlogSectionContent = {
    ...currentSection,
    items: updatedItems,
  };

  await saveStoredBlogSection(updatedSection);

  return { success: true, message: 'Artikel berhasil dihapus.' };
}
