"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesController = void 0;
const firebase_1 = require("../../config/firebase");
const response_1 = require("../../utils/response");
class CategoriesController {
    static async getAllCategories(req, res) {
        try {
            const snapshot = await firebase_1.db.collection('categories').where('isActive', '==', true).get();
            const categories = snapshot.docs.map((doc) => doc.data());
            return (0, response_1.sendSuccess)(res, categories, 'Categories retrieved.');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to fetch categories.', 500);
        }
    }
    static async getSkillsByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const snapshot = await firebase_1.db.collection('skills').where('categoryId', '==', categoryId).get();
            const skills = snapshot.docs.map((doc) => doc.data());
            return (0, response_1.sendSuccess)(res, skills, 'Skills retrieved.');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to fetch skills.', 500);
        }
    }
    static async getServicesByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const snapshot = await firebase_1.db.collection('services').where('categoryId', '==', categoryId).get();
            const services = snapshot.docs.map((doc) => doc.data());
            return (0, response_1.sendSuccess)(res, services, 'Services retrieved.');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to fetch services.', 500);
        }
    }
    static async createCategory(req, res) {
        try {
            const { name, slug, description } = req.body;
            if (!name || !slug) {
                return (0, response_1.sendError)(res, 'Category name and slug are required.');
            }
            const id = 'cat_' + slug.toLowerCase();
            const category = {
                id,
                name,
                slug: slug.toLowerCase(),
                description: description || '',
                isActive: true,
                createdAt: new Date().toISOString(),
            };
            await firebase_1.db.collection('categories').doc(id).set(category);
            return (0, response_1.sendSuccess)(res, category, 'Category created.', 201);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to create category.', 500);
        }
    }
}
exports.CategoriesController = CategoriesController;
