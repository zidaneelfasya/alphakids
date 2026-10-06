'use server';

import { db, certificates, profiles, programs } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { assertAdminMutation, requireAuth } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';

export interface IssueCertificateInput {
  userId: string;
  programId: string;
  recipientName?: string;
  certificateUrl?: string;
}

export async function issueCertificateAction(data: IssueCertificateInput) {
  await assertAdminMutation();
  const { user: adminUser } = await requireAuth();

  // 1. Fetch user profile
  const [student] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, data.userId));

  if (!student) {
    throw new Error('Peserta tidak ditemukan.');
  }

  // 2. Fetch program
  const [prog] = await db
    .select()
    .from(programs)
    .where(eq(programs.id, data.programId));

  if (!prog) {
    throw new Error('Program tidak ditemukan.');
  }

  // 3. Check if certificate already issued for this user & program
  const [existing] = await db
    .select()
    .from(certificates)
    .where(
      and(
        eq(certificates.userId, data.userId),
        eq(certificates.programId, data.programId)
      )
    );

  if (existing) {
    throw new Error(
      `Sertifikat untuk peserta ${student.fullName} pada program "${prog.title}" sudah pernah diterbitkan (${existing.certificateNumber}).`
    );
  }

  // 4. Generate Certificate Number: AK-{YEAR}-{RANDOM}
  const year = new Date().getFullYear();
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const certNumber = `AK-${year}-${randomSuffix}`;

  const recipientName = data.recipientName?.trim() || student.fullName;
  const recipientEmail = student.email || '-';

  const [cert] = await db
    .insert(certificates)
    .values({
      certificateNumber: certNumber,
      userId: student.id,
      programId: prog.id,
      issuedBy: adminUser.id,
      recipientNameSnapshot: recipientName,
      recipientEmailSnapshot: recipientEmail,
      programNameSnapshot: prog.title,
      certificateUrl: data.certificateUrl?.trim() || null,
    })
    .returning();

  revalidatePath('/admin/certificates');
  revalidatePath('/dashboard/certificates');

  return {
    success: true,
    message: `Sertifikat ${certNumber} berhasil diterbitkan untuk ${recipientName}`,
    certificate: cert,
  };
}

export async function revokeCertificateAction(certificateId: string) {
  await assertAdminMutation();

  await db.delete(certificates).where(eq(certificates.id, certificateId));

  revalidatePath('/admin/certificates');
  revalidatePath('/dashboard/certificates');

  return {
    success: true,
    message: 'Sertifikat berhasil dicabut',
  };
}
