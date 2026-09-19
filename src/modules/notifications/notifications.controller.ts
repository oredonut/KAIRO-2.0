import { Response } from 'express';
import { db } from '../../config/firebase';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { Notification } from '../../types/index';

export class NotificationsController {
  static async getMyNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const snapshot = await db.collection('notifications').where('userId', '==', userId).get();
      const notifications: Notification[] = snapshot.docs.map((doc: any) => doc.data());
      return sendSuccess(res, notifications, 'Notifications retrieved.');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch notifications.', 500);
    }
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      await db.collection('notifications').doc(id).update({ isRead: true });
      return sendSuccess(res, { id, isRead: true }, 'Notification marked as read.');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update notification.', 500);
    }
  }
}
