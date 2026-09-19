import { Router } from 'express';
import { EnquiriesController } from './enquiries.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, EnquiriesController.createEnquiry);
router.get('/my', authenticate, EnquiriesController.getMyEnquiries);
router.patch('/:id/status', authenticate, EnquiriesController.updateEnquiryStatus);

export default router;
