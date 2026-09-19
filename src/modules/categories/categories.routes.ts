import { Router } from 'express';
import { CategoriesController } from './categories.controller';
import { authenticate, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', CategoriesController.getAllCategories);
router.get('/:categoryId/skills', CategoriesController.getSkillsByCategory);
router.get('/:categoryId/services', CategoriesController.getServicesByCategory);
router.post('/', authenticate, requireRole(['ADMIN']), CategoriesController.createCategory);

export default router;
