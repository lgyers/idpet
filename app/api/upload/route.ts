import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadUserPhoto } from '@/lib/blob';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 4MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(new Uint8Array(arrayBuffer));

    // Process image with sharp
    try {
      // Resize if too large (max 2048px on longest side)
      const metadata = await sharp(buffer).metadata();
      if (metadata.width && metadata.height) {
        const maxDimension = 2048;
        if (metadata.width > maxDimension || metadata.height > maxDimension) {
          const processedBuffer = await sharp(buffer)
            .resize(maxDimension, maxDimension, {
              fit: 'inside',
              withoutEnlargement: true,
            })
            .jpeg({ quality: 90 })
            .toBuffer();
          buffer = Buffer.from(processedBuffer);
        }
      }

      // Ensure it's a JPEG for consistency
      if (file.type !== 'image/jpeg') {
        const processedBuffer = await sharp(buffer)
          .jpeg({ quality: 90 })
          .toBuffer();
        buffer = Buffer.from(processedBuffer);
      }
    } catch (error) {
      console.error('Image processing error:', error);
      return NextResponse.json(
        { error: 'Failed to process image' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const url = await uploadUserPhoto(userId, buffer, file.name);

    return NextResponse.json({
      success: true,
      url: url,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
