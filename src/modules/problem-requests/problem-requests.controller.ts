import { Request, Response } from 'express';
import { db } from '../../config/firebase.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { ProblemRequest, ProblemAnalysis } from '../../types/index.js';
import { AIService } from '../ai/ai.service.js';

export class ProblemRequestsController {
  /**
   * AI Problem Analysis Endpoint (Requirement #15)
   * POST /api/problem-requests/analyze
   */
  static async analyzeInput(req: AuthenticatedRequest, res: Response) {
    try {
      const { input, latitude, longitude } = req.body;
      const customerId = req.user?.id || 'guest_user';

      if (!input || typeof input !== 'string') {
        return sendError(res, 'Input natural language problem string is required.');
      }

      // Step 1: Run AI analysis pipeline with Zod schema validation & retries (Requirement #16)
      const analysisResult = await AIService.analyzeProblem(input);

      // Step 2: Save ProblemRequest entity to Firestore (Requirement #13)
      const problemRequestId = 'pr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

      const problemRequest: ProblemRequest = {
        id: problemRequestId,
        customerId,
        rawInput: input,
        inputType: 'TEXT',
        categoryId: analysisResult.category.id,
        problemSummary: analysisResult.problemSummary,
        requiredSkills: analysisResult.requiredSkills,
        urgency: (analysisResult.urgency as any) || 'MEDIUM',
        location: '',
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        status: 'ANALYZED',
        aiConfidence: analysisResult.aiConfidence,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.collection('problem_requests').doc(problemRequestId).set(problemRequest);

      // Step 3: Save structured AI ProblemAnalysis entity (Requirement #14)
      const analysisId = 'pa_' + problemRequestId;
      const problemAnalysis: ProblemAnalysis = {
        id: analysisId,
        problemRequestId,
        categoryId: analysisResult.category.id || '',
        problemSummary: analysisResult.problemSummary,
        requiredSkills: analysisResult.requiredSkills,
        missingInformation: analysisResult.missingInformation,
        urgency: (analysisResult.urgency as any) || 'MEDIUM',
        possibleServiceTypes: [],
        aiModel: analysisResult.aiModel,
        aiVersion: analysisResult.aiVersion,
        createdAt: new Date().toISOString(),
      };

      await db.collection('problem_analyses').doc(analysisId).set(problemAnalysis);

      // Step 4: Return response conforming exactly to Requirement #15 specification
      return sendSuccess(
        res,
        {
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
        },
        'Problem input analyzed successfully.'
      );
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to analyze problem request.', 500);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const requestDoc = await db.collection('problem_requests').doc(id).get();

      if (!requestDoc.exists) {
        return sendError(res, 'Problem request not found.', 404);
      }

      const problemRequest: ProblemRequest = requestDoc.data();
      const analysisDoc = await db.collection('problem_analyses').doc('pa_' + id).get();

      return sendSuccess(
        res,
        {
          ...problemRequest,
          analysis: analysisDoc.exists ? analysisDoc.data() : null,
        },
        'Problem request retrieved.'
      );
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch problem request.', 500);
    }
  }

  static async getMyRequests(req: AuthenticatedRequest, res: Response) {
    try {
      const customerId = req.user?.id;
      const snapshot = await db.collection('problem_requests').where('customerId', '==', customerId).get();
      const requests: ProblemRequest[] = snapshot.docs.map((doc: any) => doc.data());
      return sendSuccess(res, requests, 'User problem requests retrieved.');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch requests.', 500);
    }
  }
}
