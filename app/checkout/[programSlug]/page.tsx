import { notFound, redirect } from 'next/navigation';
import { db, programs, programAccess } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/guards';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { CheckoutView } from '@/components/checkout/checkout-view';

interface CheckoutPageProps {
  params: Promise<{
    programSlug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { programSlug } = await params;
  const { user, profile } = await requireAuth(`/checkout/${programSlug}`);

  // 1. Fetch Program via Drizzle
  const [program] = await db
    .select()
    .from(programs)
    .where(and(eq(programs.slug, programSlug), eq(programs.isActive, true)))
    .limit(1);

  if (!program) {
    notFound();
  }

  // 2. Check if user already has active access
  const [access] = await db
    .select()
    .from(programAccess)
    .where(
      and(
        eq(programAccess.userId, user.id),
        eq(programAccess.programId, program.id),
        eq(programAccess.status, 'active')
      )
    )
    .limit(1);

  if (access) {
    redirect(`/dashboard/programs/${program.slug}?notice=already_enrolled`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <SiteNavbar />
      <main className="flex-1 py-8">
        <CheckoutView
          program={{
            id: program.id,
            title: program.title,
            slug: program.slug,
            price: program.price,
            age_range: program.ageRange,
            level: program.level,
            cover_image: program.coverImage,
          }}
          user={{
            name: profile?.full_name || user.email?.split('@')[0] || 'Peserta',
            email: user.email || '',
            phone: profile?.phone,
          }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
