import { db, cmsSections } from '@/lib/db';
import { eq } from 'drizzle-orm';
import {
  DEFAULT_HERO,
  DEFAULT_FEATURES,
  DEFAULT_STORY,
  DEFAULT_MENTORS,
  DEFAULT_FAQ,
  DEFAULT_BLOGS,
  DEFAULT_CTA,
  DEFAULT_CONTACT,
  HeroSectionContent,
  FeaturesSectionContent,
  StorySectionContent,
  MentorsSectionContent,
  BlogSectionContent,
  FaqSectionContent,
  CtaSectionContent,
  ContactSectionContent,
} from './cms-types';

export * from './cms-types';

// -----------------------------------------------------------------------------
// Server Data Fetchers
// -----------------------------------------------------------------------------

export async function getCmsSection<T>(sectionKey: string, fallback: T): Promise<T> {
  try {
    const rows = await db
      .select()
      .from(cmsSections)
      .where(eq(cmsSections.sectionKey, sectionKey))
      .limit(1);

    if (rows.length > 0 && rows[0].content) {
      return { ...fallback, ...(rows[0].content as object) } as T;
    }
    return fallback;
  } catch (error) {
    console.error(`[getCmsSection] Error fetching section ${sectionKey}:`, error);
    return fallback;
  }
}

export async function getAllCmsData() {
  const [hero, features, story, mentors, blogs, faq, cta, contact] = await Promise.all([
    getCmsSection<HeroSectionContent>('hero', DEFAULT_HERO),
    getCmsSection<FeaturesSectionContent>('features', DEFAULT_FEATURES),
    getCmsSection<StorySectionContent>('story', DEFAULT_STORY),
    getCmsSection<MentorsSectionContent>('mentors', DEFAULT_MENTORS),
    getCmsSection<BlogSectionContent>('blogs', DEFAULT_BLOGS),
    getCmsSection<FaqSectionContent>('faq', DEFAULT_FAQ),
    getCmsSection<CtaSectionContent>('cta', DEFAULT_CTA),
    getCmsSection<ContactSectionContent>('contact', DEFAULT_CONTACT),
  ]);

  return { hero, features, story, mentors, blogs, faq, cta, contact };
}
