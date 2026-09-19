import { Router } from 'express';
import { SubscriptionsController } from './subscriptions.controller.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/upgrade', authenticate, requireRole(['PROFESSIONAL']), SubscriptionsController.subscribePro);
router.get('/my', authenticate, requireRole(['PROFESSIONAL']), SubscriptionsController.getMySubscription);

export default router;
