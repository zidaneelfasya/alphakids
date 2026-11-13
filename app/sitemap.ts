import type { MetadataRoute } from 'next';
import { db, programs } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getCmsSection, DEFAULT_BLOGS, BlogSectionContent } from '@/lib/cms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://alphakids.id');

  // 1. Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bantuan`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // 2. Dynamic Program Routes
  let programRoutes: MetadataRoute.Sitemap = [];
  try {
    const activePrograms = await db
      .select({ slug: programs.slug, updatedAt: programs.updatedAt })
      .from(programs)
      .where(eq(programs.isActive, true));

    programRoutes = activePrograms.map((p) => ({
      url: `${baseUrl}/programs/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));
  } catch (err) {
    console.error('[Sitemap] Failed to fetch dynamic programs:', err);
  }

  // 3. Dynamic Blog Article Routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogData = await getCmsSection<BlogSectionContent>('blogs', DEFAULT_BLOGS);
    blogRoutes = (blogData.items || []).map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    }));
  } catch (err) {
    console.error('[Sitemap] Failed to fetch blog articles:', err);
  }

  return [...staticRoutes, ...programRoutes, ...blogRoutes];
}
