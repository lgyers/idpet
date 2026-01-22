import { put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

/**
 * 上传用户照片
 * 优先使用 Vercel Blob，如果未配置则使用本地存储
 */
export async function uploadUserPhoto(
  userId: string,
  buffer: Buffer,
  filename: string,
  contentType: string = 'image/jpeg'
): Promise<string> {
  try {
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.]/g, '_');

    // 优先使用 Vercel Blob Storage（如果已配置）
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const key = `uploads/${userId}/${timestamp}_${sanitizedFilename}`;
      const blob = await put(key, buffer, {
        contentType,
        access: 'public',
      });
      return blob.url;
    }

    // 回退到本地存储（自托管/Docker 部署）
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', userId);
    await fs.mkdir(uploadDir, { recursive: true });

    const localFilename = `${timestamp}_${sanitizedFilename}`;
    const filePath = path.join(uploadDir, localFilename);

    await fs.writeFile(filePath, buffer);

    // 返回本地访问路径
    return `/uploads/${userId}/${localFilename}`;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * 上传 AI 生成的照片
 * 优先使用 Vercel Blob，如果未配置则使用本地存储
 */
export async function uploadGeneratedPhoto(
  userId: string,
  buffer: Buffer,
  filename: string,
  contentType: string = 'image/jpeg'
): Promise<string> {
  try {
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.]/g, '_');

    // 优先使用 Vercel Blob Storage（如果已配置）
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const key = `generations/${userId}/${timestamp}_${sanitizedFilename}`;
      const blob = await put(key, buffer, {
        contentType,
        access: 'public',
      });
      return blob.url;
    }

    // 回退到本地存储（自托管/Docker 部署）
    const uploadDir = path.join(process.cwd(), 'public', 'generations', userId);
    await fs.mkdir(uploadDir, { recursive: true });

    const localFilename = `${timestamp}_${sanitizedFilename}`;
    const filePath = path.join(uploadDir, localFilename);

    await fs.writeFile(filePath, buffer);

    // 返回本地访问路径
    return `/generations/${userId}/${localFilename}`;
  } catch (error) {
    console.error('Failed to upload generated photo:', error);
    throw new Error('Failed to upload generated file');
  }
}