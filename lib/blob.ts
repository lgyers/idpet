import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { mkdir } from 'fs/promises';

export async function uploadUserPhoto(
  userId: string,
  buffer: Buffer,
  filename: string,
  contentType: string = 'image/jpeg'
): Promise<string> {
  try {
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.]/g, '_');

    // Check if Vercel Blob token is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const key = `uploads/${userId}/${timestamp}_${sanitizedFilename}`;
      const blob = await put(key, buffer, {
        contentType,
        access: 'public',
      });
      return blob.url;
    } else {
      // Fallback to local storage
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', userId);
      await mkdir(uploadDir, { recursive: true });

      const localFilename = `${timestamp}_${sanitizedFilename}`;
      const filePath = path.join(uploadDir, localFilename);

      fs.writeFileSync(filePath, buffer);

      // Return local URL
      return `/uploads/${userId}/${localFilename}`;
    }
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw new Error('Failed to upload file');
  }
}

export async function uploadGeneratedPhoto(
  userId: string,
  buffer: Buffer,
  filename: string,
  contentType: string = 'image/jpeg'
): Promise<string> {
  try {
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.]/g, '_');

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const key = `generations/${userId}/${timestamp}_${sanitizedFilename}`;
      const blob = await put(key, buffer, {
        contentType,
        access: 'public',
      });
      return blob.url;
    } else {
      // Fallback to local storage
      const uploadDir = path.join(process.cwd(), 'public', 'generations', userId);
      await mkdir(uploadDir, { recursive: true });

      const localFilename = `${timestamp}_${sanitizedFilename}`;
      const filePath = path.join(uploadDir, localFilename);

      fs.writeFileSync(filePath, buffer);

      return `/generations/${userId}/${localFilename}`;
    }
  } catch (error) {
    console.error('Failed to upload generated photo:', error);
    throw new Error('Failed to upload generated file');
  }
}