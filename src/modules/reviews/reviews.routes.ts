import { Router } from 'express';
import { ReviewsController } from './reviews.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticate, ReviewsController.createReview);
router.get('/professional/:professionalId', ReviewsController.getByProfessionalId);

export default router;
