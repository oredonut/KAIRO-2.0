import { Response } from 'express';
import { db } from '../../config/firebase';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { Enquiry, Notification } from '../../types/index';

export class EnquiriesController {
  static async createEnquiry(req: AuthenticatedRequest, res: Response) {
    try {
      const customerId = req.user?.id;
      const { problemRequestId, professionalId, message } = req.body;

      if (!problemRequestId || !professionalId) {
        return sendError(res, 'problemRequestId and professionalId are required.');
      }

      const enquiryId = 'enq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

      const enquiry: Enquiry = {
        id: enquiryId,
        problemRequestId,
        customerId: customerId || 'guest_user',
        professionalId,
        status: 'PENDING',
        message: message || 'I would like to enquire about your services for my problem.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.collection('enquiries').doc(enquiryId).set(enquiry);

      // Fetch professional to get userId for notification
      const profDoc = await db.collection('professional_profiles').doc(professionalId).get();
      if (profDoc.exists) {
        const profData = profDoc.data();
        const notification: Notification = {
          id: 'notif_' + Date.now(),
          userId: profData.userId,
          title: 'New Customer Enquiry',
          message: `A customer has sent you an enquiry for problem request #${problemRequestId.substring(0, 8)}.`,
          type: 'ENQUIRY',
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        await db.collection('notifications').doc(notification.id).set(notification);
      }

      return sendSuccess(res, enquiry, 'Enquiry created successfully.', 201);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to create enquiry.', 500);
    }
  }

  static async updateEnquiryStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED', 'CANCELLED'].includes(status)) {
        return sendError(res, 'Invalid enquiry status.');
      }

      const doc = await db.collection('enquiries').doc(id).get();
      if (!doc.exists) {
        return sendError(res, 'Enquiry not found.', 404);
      }

      const existing: Enquiry = doc.data();
      const updated = { status, updatedAt: new Date().toISOString() };
      await db.collection('enquiries').doc(id).update(updated);

      // If status is COMPLETED, increment completedJobsCount on ProfessionalProfile
      if (status === 'COMPLETED') {
        const profDoc = await db.collection('professional_profiles').doc(existing.professionalId).get();
        if (profDoc.exists) {
          const prof = profDoc.data();
          await db.collection('professional_profiles').doc(existing.professionalId).update({
            completedJobsCount: (prof.completedJobsCount || 0) + 1,
          });
        }
      }

      return sendSuccess(res, { ...existing, ...updated }, `Enquiry status updated to ${status}.`);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update enquiry status.', 500);
    }
  }

  static async getMyEnquiries(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const role = req.user?.role;

      let snapshot;
      if (role === 'PROFESSIONAL') {
        const profQuery = await db.collection('professional_profiles').where('userId', '==', userId).get();
        if (profQuery.empty) {
          return sendSuccess(res, [], 'No professional profile found.');
        }
        const profId = profQuery.docs[0].id;
        snapshot = await db.collection('enquiries').where('professionalId', '==', profId).get();
      } else {
        snapshot = await db.collection('enquiries').where('customerId', '==', userId).get();
      }

      const enquiries: Enquiry[] = snapshot.docs.map((doc: any) => doc.data());
      return sendSuccess(res, enquiries, 'Enquiries retrieved.');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch enquiries.', 500);
    }
  }
}
