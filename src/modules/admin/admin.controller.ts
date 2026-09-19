import { Response } from 'express';
import { db } from '../../config/firebase';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class AdminController {
  /**
   * Set or update Professional Profile verification status (Requirement #7: Admin exclusive control)
   */
  static async verifyProfessional(req: AuthenticatedRequest, res: Response) {
    try {
      const { professionalId } = req.params;
      const { isVerified, verificationLevel } = req.body;

      if (isVerified === undefined) {
        return sendError(res, 'isVerified boolean flag is required.');
      }

      const doc = await db.collection('professional_profiles').doc(professionalId).get();
      if (!doc.exists) {
        return sendError(res, 'Professional profile not found.', 404);
      }

      const updateData = {
        isVerified: Boolean(isVerified),
        verificationLevel: verificationLevel || 'DOCUMENT_VERIFIED',
        updatedAt: new Date().toISOString(),
      };

      await db.collection('professional_profiles').doc(professionalId).update(updateData);

      return sendSuccess(
        res,
        { professionalId, ...updateData },
        `Professional verification status set to ${isVerified ? 'VERIFIED' : 'UNVERIFIED'}.`
      );
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update verification status.', 500);
    }
  }

  /**
   * Overall platform analytics dashboard metrics
   */
  static async getDashboardMetrics(req: AuthenticatedRequest, res: Response) {
    try {
      const usersSnap = await db.collection('users').get();
      const profsSnap = await db.collection('professional_profiles').get();
      const reqsSnap = await db.collection('problem_requests').get();
      const enqsSnap = await db.collection('enquiries').get();

      const verifiedProfs = profsSnap.docs.filter((d: any) => d.data().isVerified).length;
      const completedJobs = enqsSnap.docs.filter((d: any) => d.data().status === 'COMPLETED').length;

      return sendSuccess(
        res,
        {
          totalUsers: usersSnap.size,
          totalProfessionals: profsSnap.size,
          verifiedProfessionals: verifiedProfs,
          totalProblemRequests: reqsSnap.size,
          totalEnquiries: enqsSnap.size,
          completedJobsCount: completedJobs,
        },
        'Admin dashboard metrics generated.'
      );
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to generate metrics.', 500);
    }
  }
}
