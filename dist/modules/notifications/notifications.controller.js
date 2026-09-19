"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const firebase_1 = require("../../config/firebase");
const response_1 = require("../../utils/response");
class NotificationsController {
    static async getMyNotifications(req, res) {
        try {
            const userId = req.user?.id;
            const snapshot = await firebase_1.db.collection('notifications').where('userId', '==', userId).get();
            const notifications = snapshot.docs.map((doc) => doc.data());
            return (0, response_1.sendSuccess)(res, notifications, 'Notifications retrieved.');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to fetch notifications.', 500);
        }
    }
    static async markAsRead(req, res) {
        try {
            const { id } = req.params;
            await firebase_1.db.collection('notifications').doc(id).update({ isRead: true });
            return (0, response_1.sendSuccess)(res, { id, isRead: true }, 'Notification marked as read.');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to update notification.', 500);
        }
    }
}
exports.NotificationsController = NotificationsController;
