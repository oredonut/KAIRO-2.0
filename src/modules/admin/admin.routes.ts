import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';

const router = Router();

router.patch('/professionals/:professionalId/verify', authenticate, requireRole(['ADMIN']), AdminController.verifyProfessional);
router.get('/metrics', authenticate, requireRole(['ADMIN']), AdminController.getDashboardMetrics);

export default router;
