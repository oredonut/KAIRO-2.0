import { Router } from 'express';
import { SubscriptionsController } from './subscriptions.controller';
import { authenticate, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/upgrade', authenticate, requireRole(['PROFESSIONAL']), SubscriptionsController.subscribePro);
router.get('/my', authenticate, requireRole(['PROFESSIONAL']), SubscriptionsController.getMySubscription);

export default router;
