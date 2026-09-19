import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.patch('/location', authenticate, UsersController.updateLocation);

export default router;
