export interface ProgramActivationEmailParams {
  toEmail: string;
  recipientName: string;
  programTitle: string;
  orderNumber: string;
  accessUrl: string;
}

export async function sendProgramAccessActivationEmail(
  params: ProgramActivationEmailParams
) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(
      `[EMAIL NOTIFICATION MOCK] To: ${params.toEmail} | Subject: Akses Kelas ${params.programTitle} Telah Aktif! | Order: ${params.orderNumber} | Link: ${params.accessUrl}`
    );
    return { success: true, mocked: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Alpha Kids <no-reply@alphakids.id>',
        to: [params.toEmail],
        subject: `🎉 Akses Kelas "${params.programTitle}" Si Kecil Telah Aktif!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 16px;">
            <h2 style="color: #d97706;">Selamat Datang di Alpha Kids!</h2>
            <p>Halo <strong>${params.recipientName}</strong>,</p>
            <p>Pembayaran untuk pesanan <strong>#${params.orderNumber}</strong> telah berhasil diverifikasi. Akses ke program <strong>${params.programTitle}</strong> kini telah aktif di akun Anda.</p>
            <div style="margin: 24px 0;">
              <a href="${params.accessUrl}" style="background-color: #f59e0b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Buka Ruang Kelas Sekarang
              </a>
            </div>
            <p style="color: #64748b; font-size: 12px;">Anda dapat mengakses tautan grup WhatsApp kelas, jadwal Zoom, dan modul belajar langsung melalui dashboard Alpha Kids Anda.</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('[EMAIL ERROR] Failed to send email via Resend:', errBody);
      return { success: false, error: errBody };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error('[EMAIL ERROR] Exception sending email:', err);
    return { success: false, error: err };
  }
}
