import { Response } from 'express';
import { db } from '../../config/firebase';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { Enquiry, Notification } from '../../types';

export class EnquiriesController {
  static async createEnquiry(req: AuthenticatedRequest, res: Response) {
    try {
      const customerId = req.user?.id || 'guest_user';
      const {
        problemRequestId,
        professionalId,
        artisanId,
        customerName,
        customerPhone,
        problemText,
        serviceLabel,
        brand,
        location,
        when,
        message,
        matchReasons,
      } = req.body;

      const targetProfId = professionalId || artisanId;

      if (!targetProfId) {
        return sendError(res, 'professionalId or artisanId is required.');
      }

      const enquiryId = 'req-' + Date.now();

      const enquiry: Enquiry = {
        id: enquiryId,
        problemRequestId: problemRequestId || 'pr_' + Date.now(),
        customerId,
        customerName: customerName || (req.user ? `${req.user.firstName} ${req.user.lastName}` : 'Customer'),
        customerPhone: customerPhone || req.user?.phone || '',
        professionalId: targetProfId,
        artisanId: targetProfId,
        problemText: problemText || message || 'Service enquiry requested.',
        serviceLabel: serviceLabel || 'Technical Repair',
        brand: brand || '',
        location: location || '',
        when: when || 'Today',
        status: 'new',
        statusText: 'New Enquiry',
        message: message || problemText || 'Service enquiry requested.',
        matchReasons: matchReasons || ['Category match', 'Verified artisan'],
        dateSent: 'Just now',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.collection('enquiries').doc(enquiryId).set(enquiry);

      // Fetch professional to get userId for notification
      const profDoc = await db.collection('professional_profiles').doc(targetProfId).get();
      if (profDoc.exists) {
        const profData = profDoc.data();
        const notification: Notification = {
          id: 'notif-' + Date.now(),
          userId: profData.userId,
          artisanId: targetProfId,
          title: 'New Customer Enquiry Received!',
          message: `${enquiry.customerName} sent an enquiry for ${enquiry.serviceLabel} in ${enquiry.location || 'your area'}.`,
          type: 'ENQUIRY',
          isRead: false,
          time: 'Just now',
          enquiryId,
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

      const normalizedStatus = (status || '').toLowerCase();
      const statusTexts: Record<string, string> = {
        new: 'New Enquiry',
        pending: 'New Enquiry',
        accepted: 'Accepted',
        'in-progress': 'In Progress',
        in_progress: 'In Progress',
        completed: 'Completed',
        declined: 'Declined',
        cancelled: 'Cancelled',
      };

      if (!statusTexts[normalizedStatus]) {
        return sendError(res, 'Invalid enquiry status.');
      }

      const doc = await db.collection('enquiries').doc(id).get();
      if (!doc.exists) {
        return sendError(res, 'Enquiry not found.', 404);
      }

      const existing: Enquiry = doc.data();
      const updated = {
        status: normalizedStatus as any,
        statusText: statusTexts[normalizedStatus],
        updatedAt: new Date().toISOString(),
      };

      await db.collection('enquiries').doc(id).update(updated);

      // Increment completedJobs if completed
      if (normalizedStatus === 'completed') {
        const targetProfId = existing.professionalId || existing.artisanId;
        if (targetProfId) {
          const profDoc = await db.collection('professional_profiles').doc(targetProfId).get();
          if (profDoc.exists) {
            const prof = profDoc.data();
            await db.collection('professional_profiles').doc(targetProfId).update({
              completedJobsCount: (prof.completedJobsCount || 0) + 1,
            });
          }
        }
      }

      return sendSuccess(res, { ...existing, ...updated }, `Enquiry status updated to ${statusTexts[normalizedStatus]}.`);
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
