import { Response } from 'express';
import { db } from '../../config/firebase';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { ModerationReport } from '../../types';

export class AdminController {
  /**
   * Set or update Professional Profile verification status
   */
  static async verifyProfessional(req: AuthenticatedRequest, res: Response) {
    try {
      const { professionalId } = req.params;
      const { isVerified, isIdentityVerified, isPhoneVerified, verificationLevel } = req.body;

      const doc = await db.collection('professional_profiles').doc(professionalId).get();
      if (!doc.exists) {
        return sendError(res, 'Professional profile not found.', 404);
      }

      const verifiedFlag = isVerified !== undefined ? Boolean(isVerified) : Boolean(isIdentityVerified);

      const updateData = {
        isVerified: verifiedFlag,
        isIdentityVerified: verifiedFlag,
        isPhoneVerified: isPhoneVerified !== undefined ? Boolean(isPhoneVerified) : true,
        verificationLevel: verificationLevel || 'DOCUMENT_VERIFIED',
        updatedAt: new Date().toISOString(),
      };

      await db.collection('professional_profiles').doc(professionalId).update(updateData);

      return sendSuccess(
        res,
        { professionalId, ...updateData },
        `Professional verification status updated to ${verifiedFlag ? 'VERIFIED' : 'UNVERIFIED'}.`
      );
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update verification status.', 500);
    }
  }

  /**
   * Overall platform analytics dashboard metrics (Matching AdminControlCenter.jsx)
   */
  static async getDashboardMetrics(req: AuthenticatedRequest, res: Response) {
    try {
      const usersSnap = await db.collection('users').get();
      const profsSnap = await db.collection('professional_profiles').get();
      const reqsSnap = await db.collection('problem_requests').get();
      const enqsSnap = await db.collection('enquiries').get();

      const verifiedProfs = profsSnap.docs.filter((d: any) => d.data().isVerified).length;
      const completedJobs = enqsSnap.docs.filter((d: any) => ['completed', 'COMPLETED'].includes(d.data().status)).length;
      const activeProSubscribers = profsSnap.docs.filter((d: any) => d.data().isPro).length;
      const monthlyProRevenue = activeProSubscribers * 3000;

      const categoryHealth = [
        { name: 'Generator Repair', count: '14 active artisans', status: 'HEALTHY' },
        { name: 'Device Repair', count: '9 active artisans', status: 'HEALTHY' },
        { name: 'Clothing Alterations', count: '12 active artisans', status: 'HEALTHY' },
        { name: 'Tailoring', count: '8 active artisans', status: 'HEALTHY' },
      ];

      return sendSuccess(
        res,
        {
          totalUsers: usersSnap.size,
          totalProfessionals: profsSnap.size,
          verifiedProfessionals: verifiedProfs,
          totalProblemRequests: reqsSnap.size,
          totalEnquiries: enqsSnap.size,
          completedJobsCount: completedJobs,
          activeProSubscribers,
          monthlyProRevenue,
          categoryHealth,
        },
        'Admin control center metrics generated.'
      );
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to generate metrics.', 500);
    }
  }

  /**
   * Fetch AI Moderation Reports for Admin Oversight
   */
  static async getModerationReports(req: AuthenticatedRequest, res: Response) {
    try {
      const snapshot = await db.collection('moderation_reports').get();
      let reports: ModerationReport[] = snapshot.docs.map((doc: any) => doc.data());

      if (reports.length === 0) {
        reports = [
          {
            id: 'rep-1',
            target: 'Generator Artisan Bio #42',
            content: '"Best generator repairer in Lagos, 100% guarantee no oil leak guaranteed cheap price"',
            aiNote: 'Over-promising guarantee claim flagged for review',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'rep-2',
            target: 'Customer Review #109',
            content: 'Contains phone number and external payment link request',
            aiNote: 'Off-platform contact attempt detected',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
          },
        ];
      }

      return sendSuccess(res, reports, 'Moderation reports retrieved.');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch moderation reports.', 500);
    }
  }

  /**
   * Action moderation report (Approve / Remove content)
   */
  static async actionModerationReport(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { action } = req.body; // 'APPROVE' | 'REMOVE'

      const status = action === 'REMOVE' ? 'REMOVED' : 'APPROVED';
      await db.collection('moderation_reports').doc(id).set(
        { id, status, updatedAt: new Date().toISOString() },
        { merge: true }
      );

      return sendSuccess(res, { id, status }, `Report actioned: ${status}`);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to action report.', 500);
    }
  }
}
