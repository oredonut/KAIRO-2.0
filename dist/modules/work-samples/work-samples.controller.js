"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkSamplesController = void 0;
const firebase_js_1 = require("../../config/firebase.js");
const aws_js_1 = require("../../config/aws.js");
const response_js_1 = require("../../utils/response.js");
class WorkSamplesController {
    /**
     * Upload work sample with image attachments via AWS S3 / Object Storage
     */
    static async createWorkSample(req, res) {
        try {
            const userId = req.user?.id;
            const { title, categoryId, problemDescription, workDescription, resultDescription } = req.body;
            if (!title || !problemDescription || !workDescription || !resultDescription) {
                return (0, response_js_1.sendError)(res, 'title, problemDescription, workDescription, and resultDescription are required.');
            }
            // Fetch professional profile
            const profQuery = await firebase_js_1.db.collection('professional_profiles').where('userId', '==', userId).get();
            if (profQuery.empty) {
                return (0, response_js_1.sendError)(res, 'Only registered professionals can upload work samples.', 403);
            }
            const professional = profQuery.docs[0].data();
            const files = req.files;
            const imageUrls = [];
            // Process uploaded image files using AWS S3
            if (files && files.length > 0) {
                for (const file of files) {
                    const url = await (0, aws_js_1.uploadToStorage)(file.buffer, file.originalname, file.mimetype);
                    imageUrls.push(url);
                }
            }
            const sampleId = 'ws_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
            const workSample = {
                id: sampleId,
                professionalId: professional.id,
                title,
                categoryId: categoryId || professional.categoryId,
                problemDescription,
                workDescription,
                resultDescription,
                imageUrls,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            await firebase_js_1.db.collection('work_samples').doc(sampleId).set(workSample);
            return (0, response_js_1.sendSuccess)(res, workSample, 'Work sample uploaded and added to professional portfolio.', 201);
        }
        catch (err) {
            return (0, response_js_1.sendError)(res, err.message || 'Failed to create work sample.', 500);
        }
    }
    /**
     * Get AWS S3 Presigned URL for frontend direct upload (Requirement #12 & AWS integration)
     */
    static async getPresignedUrl(req, res) {
        try {
            const { fileName, mimeType } = req.body;
            if (!fileName || !mimeType) {
                return (0, response_js_1.sendError)(res, 'fileName and mimeType are required.');
            }
            const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedMimeTypes.includes(mimeType)) {
                return (0, response_js_1.sendError)(res, `File type ${mimeType} not allowed. Only JPEG, PNG, and WebP are supported.`);
            }
            const result = await (0, aws_js_1.getPresignedUploadUrl)(fileName, mimeType);
            return (0, response_js_1.sendSuccess)(res, result, 'AWS S3 presigned upload URL generated.');
        }
        catch (err) {
            return (0, response_js_1.sendError)(res, err.message || 'Failed to generate presigned URL.', 500);
        }
    }
    static async getByProfessionalId(req, res) {
        try {
            const { professionalId } = req.params;
            const snapshot = await firebase_js_1.db.collection('work_samples').where('professionalId', '==', professionalId).get();
            const samples = snapshot.docs.map((doc) => doc.data());
            return (0, response_js_1.sendSuccess)(res, samples, 'Work samples retrieved.');
        }
        catch (err) {
            return (0, response_js_1.sendError)(res, err.message || 'Failed to fetch work samples.', 500);
        }
    }
}
exports.WorkSamplesController = WorkSamplesController;
