import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { assertAdminMutation } from '@/lib/auth/guards';

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request: NextRequest) {
  try {
    // 1. Verify admin privilege
    await assertAdminMutation();

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'cms';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada berkas yang dipilih.' },
        { status: 400 }
      );
    }

    // 3. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Format berkas "${file.type}" tidak didukung. Harap unggah PNG, JPG, WEBP, SVG, atau GIF.`,
        },
        { status: 400 }
      );
    }

    // 4. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `Ukuran berkas (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal 15 MB.`,
        },
        { status: 400 }
      );
    }

    // 5. Convert File to ArrayBuffer & Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 6. Generate sanitized unique filename
    const originalName = file.name || 'image';
    const ext = originalName.split('.').pop()?.toLowerCase() || 'png';
    const baseName = originalName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 40);
    const uniqueFileName = `${Date.now()}-${baseName}.${ext}`;

    // 7. Upload to Supabase Storage via Service Role Admin
    const supabaseAdmin = createAdminClient();
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(uniqueFileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('[Upload API] Supabase storage upload failed:', uploadError);
      return NextResponse.json(
        { success: false, error: `Gagal mengunggah ke storage: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 8. Retrieve Public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(uniqueFileName);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      filename: uniqueFileName,
      size: file.size,
    });
  } catch (error: unknown) {
    console.error('[Upload API] Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server saat mengunggah.';
    const status = message.includes('Unauthorized') || message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
