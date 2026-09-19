"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemRequestsController = void 0;
const firebase_js_1 = require("../../config/firebase.js");
const response_js_1 = require("../../utils/response.js");
const ai_service_js_1 = require("../ai/ai.service.js");
class ProblemRequestsController {
    /**
     * AI Problem Analysis Endpoint (Requirement #15)
     * POST /api/problem-requests/analyze
     */
    static async analyzeInput(req, res) {
        try {
            const { input, latitude, longitude } = req.body;
            const customerId = req.user?.id || 'guest_user';
            if (!input || typeof input !== 'string') {
                return (0, response_js_1.sendError)(res, 'Input natural language problem string is required.');
            }
            // Step 1: Run AI analysis pipeline with Zod schema validation & retries (Requirement #16)
            const analysisResult = await ai_service_js_1.AIService.analyzeProblem(input);
            // Step 2: Save ProblemRequest entity to Firestore (Requirement #13)
            const problemRequestId = 'pr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
            const problemRequest = {
                id: problemRequestId,
                customerId,
                rawInput: input,
                inputType: 'TEXT',
                categoryId: analysisResult.category.id,
                problemSummary: analysisResult.problemSummary,
                requiredSkills: analysisResult.requiredSkills,
                urgency: analysisResult.urgency || 'MEDIUM',
                location: '',
                latitude: latitude ? Number(latitude) : undefined,
                longitude: longitude ? Number(longitude) : undefined,
                status: 'ANALYZED',
                aiConfidence: analysisResult.aiConfidence,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            await firebase_js_1.db.collection('problem_requests').doc(problemRequestId).set(problemRequest);
            // Step 3: Save structured AI ProblemAnalysis entity (Requirement #14)
            const analysisId = 'pa_' + problemRequestId;
            const problemAnalysis = {
                id: analysisId,
                problemRequestId,
                categoryId: analysisResult.category.id || '',
                problemSummary: analysisResult.problemSummary,
                requiredSkills: analysisResult.requiredSkills,
                missingInformation: analysisResult.missingInformation,
                urgency: analysisResult.urgency || 'MEDIUM',
                possibleServiceTypes: [],
                aiModel: analysisResult.aiModel,
                aiVersion: analysisResult.aiVersion,
                createdAt: new Date().toISOString(),
            };
            await firebase_js_1.db.collection('problem_analyses').doc(analysisId).set(problemAnalysis);
            // Step 4: Return response conforming exactly to Requirement #15 specification
            return (0, response_js_1.sendSuccess)(res, {
                problemRequestId,
                category: {
                    id: analysisResult.category.id,
                    name: analysisResult.category.name,
                    slug: analysisResult.category.slug,
                },
                problemSummary: analysisResult.problemSummary,
                requiredSkills: analysisResult.requiredSkills,
                missingInformation: analysisResult.missingInformation,
                aiConfidence: analysisResult.aiConfidence,
            }, 'Problem input analyzed successfully.');
        }
        catch (err) {
            return (0, response_js_1.sendError)(res, err.message || 'Failed to analyze problem request.', 500);
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const requestDoc = await firebase_js_1.db.collection('problem_requests').doc(id).get();
            if (!requestDoc.exists) {
                return (0, response_js_1.sendError)(res, 'Problem request not found.', 404);
            }
            const problemRequest = requestDoc.data();
            const analysisDoc = await firebase_js_1.db.collection('problem_analyses').doc('pa_' + id).get();
            return (0, response_js_1.sendSuccess)(res, {
                ...problemRequest,
                analysis: analysisDoc.exists ? analysisDoc.data() : null,
            }, 'Problem request retrieved.');
        }
        catch (err) {
            return (0, response_js_1.sendError)(res, err.message || 'Failed to fetch problem request.', 500);
        }
    }
    static async getMyRequests(req, res) {
        try {
            const customerId = req.user?.id;
            const snapshot = await firebase_js_1.db.collection('problem_requests').where('customerId', '==', customerId).get();
            const requests = snapshot.docs.map((doc) => doc.data());
            return (0, response_js_1.sendSuccess)(res, requests, 'User problem requests retrieved.');
        }
        catch (err) {
            return (0, response_js_1.sendError)(res, err.message || 'Failed to fetch requests.', 500);
        }
    }
}
exports.ProblemRequestsController = ProblemRequestsController;
