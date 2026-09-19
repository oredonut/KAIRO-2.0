import { Router } from 'express';
import { SavedProfessionalsController } from './saved-professionals.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/toggle', authenticate, SavedProfessionalsController.toggleSave);
router.get('/', authenticate, SavedProfessionalsController.getMySaved);

export default router;
