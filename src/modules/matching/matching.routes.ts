import { Router } from 'express';
import { MatchingController } from './matching.controller.js';

const router = Router();

router.post('/find-professionals', MatchingController.findProfessionals);

export default router;
