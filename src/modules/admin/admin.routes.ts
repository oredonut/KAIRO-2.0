import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.patch('/professionals/:professionalId/verify', authenticate, requireRole(['ADMIN']), AdminController.verifyProfessional);
router.get('/metrics', authenticate, requireRole(['ADMIN']), AdminController.getDashboardMetrics);
router.get('/reports', authenticate, requireRole(['ADMIN']), AdminController.getModerationReports);
router.post('/reports/:id/action', authenticate, requireRole(['ADMIN']), AdminController.actionModerationReport);

export default router;
