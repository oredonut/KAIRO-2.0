import { Router } from 'express';
import { ProblemRequestsController } from './problem-requests.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/analyze', ProblemRequestsController.analyzeInput);
router.get('/my-requests', authenticate, ProblemRequestsController.getMyRequests);
router.get('/:id', ProblemRequestsController.getById);

export default router;
