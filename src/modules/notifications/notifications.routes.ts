import { Router } from 'express';
import { NotificationsController } from './notifications.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, NotificationsController.getMyNotifications);
router.patch('/:id/read', authenticate, NotificationsController.markAsRead);

export default router;
