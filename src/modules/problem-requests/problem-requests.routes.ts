import { Router } from 'express';
import { ProblemRequestsController } from './problem-requests.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/analyze', ProblemRequestsController.analyzeInput);
router.get('/my-requests', authenticate, ProblemRequestsController.getMyRequests);
router.get('/:id', ProblemRequestsController.getById);

export default router;
