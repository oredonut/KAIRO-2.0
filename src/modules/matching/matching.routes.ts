import { Router } from 'express';
import { MatchingController } from './matching.controller';

const router = Router();

router.post('/find-professionals', MatchingController.findProfessionals);

export default router;
