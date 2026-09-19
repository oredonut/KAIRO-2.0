"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToStorage = uploadToStorage;
exports.getPresignedUploadUrl = getPresignedUploadUrl;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const env_js_1 = require("./env.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let s3Client = null;
if (env_js_1.ENV.AWS_ACCESS_KEY_ID && env_js_1.ENV.AWS_SECRET_ACCESS_KEY) {
    s3Client = new client_s3_1.S3Client({
        region: env_js_1.ENV.AWS_REGION,
        credentials: {
            accessKeyId: env_js_1.ENV.AWS_ACCESS_KEY_ID,
            secretAccessKey: env_js_1.ENV.AWS_SECRET_ACCESS_KEY,
        },
    });
    console.log('[AWS] Initialized AWS S3 client for region:', env_js_1.ENV.AWS_REGION);
}
else {
    console.log('[AWS] AWS credentials missing in env. S3 Service will use local media storage emulator.');
}
/**
 * Uploads file to AWS S3 bucket, or writes to local disk if AWS keys are omitted.
 */
async function uploadToStorage(fileBuffer, fileName, mimeType) {
    const sanitizeFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    if (s3Client && env_js_1.ENV.AWS_S3_BUCKET) {
        try {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: env_js_1.ENV.AWS_S3_BUCKET,
                Key: `uploads/${sanitizeFileName}`,
                Body: fileBuffer,
                ContentType: mimeType,
            });
            await s3Client.send(command);
            const s3Url = `https://${env_js_1.ENV.AWS_S3_BUCKET}.s3.${env_js_1.ENV.AWS_REGION}.amazonaws.com/uploads/${sanitizeFileName}`;
            console.log(`[AWS S3] Uploaded file successfully to ${s3Url}`);
            return s3Url;
        }
        catch (err) {
            console.error('[AWS S3] Error uploading to S3, falling back to local storage:', err);
        }
    }
    // Local storage fallback
    const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path_1.default.join(uploadsDir, sanitizeFileName);
    fs_1.default.writeFileSync(filePath, fileBuffer);
    return `/uploads/${sanitizeFileName}`;
}
/**
 * Generates AWS S3 Presigned Upload URL for direct frontend uploads.
 */
async function getPresignedUploadUrl(fileName, mimeType) {
    const sanitizeFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    if (s3Client && env_js_1.ENV.AWS_S3_BUCKET) {
        const key = `uploads/${sanitizeFileName}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: env_js_1.ENV.AWS_S3_BUCKET,
            Key: key,
            ContentType: mimeType,
        });
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 3600 });
        const fileUrl = `https://${env_js_1.ENV.AWS_S3_BUCKET}.s3.${env_js_1.ENV.AWS_REGION}.amazonaws.com/${key}`;
        return { uploadUrl, fileUrl };
    }
    return {
        uploadUrl: `/api/upload/direct`,
        fileUrl: `/uploads/${sanitizeFileName}`,
    };
}
