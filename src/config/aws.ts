import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ENV } from './env.js';
import fs from 'fs';
import path from 'path';

let s3Client: S3Client | null = null;

if (ENV.AWS_ACCESS_KEY_ID && ENV.AWS_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: ENV.AWS_REGION,
    credentials: {
      accessKeyId: ENV.AWS_ACCESS_KEY_ID,
      secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
    },
  });
  console.log('[AWS] Initialized AWS S3 client for region:', ENV.AWS_REGION);
} else {
  console.log('[AWS] AWS credentials missing in env. S3 Service will use local media storage emulator.');
}

/**
 * Uploads file to AWS S3 bucket, or writes to local disk if AWS keys are omitted.
 */
export async function uploadToStorage(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const sanitizeFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  if (s3Client && ENV.AWS_S3_BUCKET) {
    try {
      const command = new PutObjectCommand({
        Bucket: ENV.AWS_S3_BUCKET,
        Key: `uploads/${sanitizeFileName}`,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await s3Client.send(command);
      const s3Url = `https://${ENV.AWS_S3_BUCKET}.s3.${ENV.AWS_REGION}.amazonaws.com/uploads/${sanitizeFileName}`;
      console.log(`[AWS S3] Uploaded file successfully to ${s3Url}`);
      return s3Url;
    } catch (err) {
      console.error('[AWS S3] Error uploading to S3, falling back to local storage:', err);
    }
  }

  // Local storage fallback
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, sanitizeFileName);
  fs.writeFileSync(filePath, fileBuffer);

  return `/uploads/${sanitizeFileName}`;
}

/**
 * Generates AWS S3 Presigned Upload URL for direct frontend uploads.
 */
export async function getPresignedUploadUrl(
  fileName: string,
  mimeType: string
): Promise<{ uploadUrl: string; fileUrl: string }> {
  const sanitizeFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  if (s3Client && ENV.AWS_S3_BUCKET) {
    const key = `uploads/${sanitizeFileName}`;
    const command = new PutObjectCommand({
      Bucket: ENV.AWS_S3_BUCKET,
      Key: key,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const fileUrl = `https://${ENV.AWS_S3_BUCKET}.s3.${ENV.AWS_REGION}.amazonaws.com/${key}`;
    return { uploadUrl, fileUrl };
  }

  return {
    uploadUrl: `/api/upload/direct`,
    fileUrl: `/uploads/${sanitizeFileName}`,
  };
}
