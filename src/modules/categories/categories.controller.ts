import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { sendSuccess, sendError } from '../../utils/response';
import { Category, Skill, Service } from '../../types/index';

export class CategoriesController {
  static async getAllCategories(req: Request, res: Response) {
    try {
      const snapshot = await db.collection('categories').where('isActive', '==', true).get();
      const categories: Category[] = snapshot.docs.map((doc: any) => doc.data());
      return sendSuccess(res, categories, 'Categories retrieved.');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch categories.', 500);
    }
  }

  static async getSkillsByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const snapshot = await db.collection('skills').where('categoryId', '==', categoryId).get();
      const skills: Skill[] = snapshot.docs.map((doc: any) => doc.data());
      return sendSuccess(res, skills, 'Skills retrieved.');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch skills.', 500);
    }
  }

  static async getServicesByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const snapshot = await db.collection('services').where('categoryId', '==', categoryId).get();
      const services: Service[] = snapshot.docs.map((doc: any) => doc.data());
      return sendSuccess(res, services, 'Services retrieved.');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch services.', 500);
    }
  }

  static async createCategory(req: Request, res: Response) {
    try {
      const { name, slug, description } = req.body;
      if (!name || !slug) {
        return sendError(res, 'Category name and slug are required.');
      }

      const id = 'cat_' + slug.toLowerCase();
      const category: Category = {
        id,
        name,
        slug: slug.toLowerCase(),
        description: description || '',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      await db.collection('categories').doc(id).set(category);
      return sendSuccess(res, category, 'Category created.', 201);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to create category.', 500);
    }
  }
}
