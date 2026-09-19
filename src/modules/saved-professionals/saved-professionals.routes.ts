import { Router } from 'express';
import { SavedProfessionalsController } from './saved-professionals.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/toggle', authenticate, SavedProfessionalsController.toggleSave);
router.get('/', authenticate, SavedProfessionalsController.getMySaved);

export default router;
