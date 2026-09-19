import { Response } from 'express';
import { db } from '../../config/firebase.js';
import { uploadToStorage, getPresignedUploadUrl } from '../../config/aws.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { WorkSample, ProfessionalProfile } from '../../types/index.js';

export class WorkSamplesController {
  /**
   * Upload work sample with image attachments via AWS S3 / Object Storage
   */
  static async createWorkSample(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { title, categoryId, problemDescription, workDescription, resultDescription } = req.body;

      if (!title || !problemDescription || !workDescription || !resultDescription) {
        return sendError(res, 'title, problemDescription, workDescription, and resultDescription are required.');
      }

      // Fetch professional profile
      const profQuery = await db.collection('professional_profiles').where('userId', '==', userId).get();
      if (profQuery.empty) {
        return sendError(res, 'Only registered professionals can upload work samples.', 403);
      }

      const professional: ProfessionalProfile = profQuery.docs[0].data();
      const files = req.files as Express.Multer.File[];
      const imageUrls: string[] = [];

      // Process uploaded image files using AWS S3
      if (files && files.length > 0) {
        for (const file of files) {
          const url = await uploadToStorage(file.buffer, file.originalname, file.mimetype);
          imageUrls.push(url);
        }
      }

      const sampleId = 'ws_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

      const workSample: WorkSample = {
        id: sampleId,
        professionalId: professional.id,
        title,
        categoryId: categoryId || professional.categoryId,
        problemDescription,
        workDescription,
        resultDescription,
        imageUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.collection('work_samples').doc(sampleId).set(workSample);

      return sendSuccess(res, workSample, 'Work sample uploaded and added to professional portfolio.', 201);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to create work sample.', 500);
    }
  }

  /**
   * Get AWS S3 Presigned URL for frontend direct upload (Requirement #12 & AWS integration)
   */
  static async getPresignedUrl(req: AuthenticatedRequest, res: Response) {
    try {
      const { fileName, mimeType } = req.body;
      if (!fileName || !mimeType) {
        return sendError(res, 'fileName and mimeType are required.');
      }

      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedMimeTypes.includes(mimeType)) {
        return sendError(res, `File type ${mimeType} not allowed. Only JPEG, PNG, and WebP are supported.`);
      }

      const result = await getPresignedUploadUrl(fileName, mimeType);
      return sendSuccess(res, result, 'AWS S3 presigned upload URL generated.');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to generate presigned URL.', 500);
    }
  }

  static async getByProfessionalId(req: AuthenticatedRequest, res: Response) {
    try {
      const { professionalId } = req.params;
      const snapshot = await db.collection('work_samples').where('professionalId', '==', professionalId).get();
      const samples: WorkSample[] = snapshot.docs.map((doc: any) => doc.data());
      return sendSuccess(res, samples, 'Work samples retrieved.');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch work samples.', 500);
    }
  }
}
