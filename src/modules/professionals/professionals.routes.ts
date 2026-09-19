import { Router } from 'express';
import { ProfessionalsController } from './professionals.controller';
import { authenticate, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/me', authenticate, requireRole(['PROFESSIONAL', 'ADMIN']), ProfessionalsController.getMyProfile);
router.get('/:id', ProfessionalsController.getProfileById);
router.patch('/me', authenticate, requireRole(['PROFESSIONAL', 'ADMIN']), ProfessionalsController.updateProfile);
router.post('/parse-profile', ProfessionalsController.parseProfileDescription);

export default router;
