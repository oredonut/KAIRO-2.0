import { Router } from 'express';
import { WorkSamplesController } from './work-samples.controller.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';

const router = Router();

router.post(
  '/',
  authenticate,
  requireRole(['PROFESSIONAL', 'ADMIN']),
  upload.array('images', 5),
  WorkSamplesController.createWorkSample
);

router.post('/presigned-url', authenticate, WorkSamplesController.getPresignedUrl);
router.get('/professional/:professionalId', WorkSamplesController.getByProfessionalId);

export default router;
