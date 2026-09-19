import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.patch('/location', authenticate, UsersController.updateLocation);

export default router;
