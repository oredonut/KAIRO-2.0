"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiriesController = void 0;
const firebase_1 = require("../../config/firebase");
const response_1 = require("../../utils/response");
class EnquiriesController {
    static async createEnquiry(req, res) {
        try {
            const customerId = req.user?.id;
            const { problemRequestId, professionalId, message } = req.body;
            if (!problemRequestId || !professionalId) {
                return (0, response_1.sendError)(res, 'problemRequestId and professionalId are required.');
            }
            const enquiryId = 'enq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
            const enquiry = {
                id: enquiryId,
                problemRequestId,
                customerId: customerId || 'guest_user',
                professionalId,
                status: 'PENDING',
                message: message || 'I would like to enquire about your services for my problem.',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            await firebase_1.db.collection('enquiries').doc(enquiryId).set(enquiry);
            // Fetch professional to get userId for notification
            const profDoc = await firebase_1.db.collection('professional_profiles').doc(professionalId).get();
            if (profDoc.exists) {
                const profData = profDoc.data();
                const notification = {
                    id: 'notif_' + Date.now(),
                    userId: profData.userId,
                    title: 'New Customer Enquiry',
                    message: `A customer has sent you an enquiry for problem request #${problemRequestId.substring(0, 8)}.`,
                    type: 'ENQUIRY',
                    isRead: false,
                    createdAt: new Date().toISOString(),
                };
                await firebase_1.db.collection('notifications').doc(notification.id).set(notification);
            }
            return (0, response_1.sendSuccess)(res, enquiry, 'Enquiry created successfully.', 201);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to create enquiry.', 500);
        }
    }
    static async updateEnquiryStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!['PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED', 'CANCELLED'].includes(status)) {
                return (0, response_1.sendError)(res, 'Invalid enquiry status.');
            }
            const doc = await firebase_1.db.collection('enquiries').doc(id).get();
            if (!doc.exists) {
                return (0, response_1.sendError)(res, 'Enquiry not found.', 404);
            }
            const existing = doc.data();
            const updated = { status, updatedAt: new Date().toISOString() };
            await firebase_1.db.collection('enquiries').doc(id).update(updated);
            // If status is COMPLETED, increment completedJobsCount on ProfessionalProfile
            if (status === 'COMPLETED') {
                const profDoc = await firebase_1.db.collection('professional_profiles').doc(existing.professionalId).get();
                if (profDoc.exists) {
                    const prof = profDoc.data();
                    await firebase_1.db.collection('professional_profiles').doc(existing.professionalId).update({
                        completedJobsCount: (prof.completedJobsCount || 0) + 1,
                    });
                }
            }
            return (0, response_1.sendSuccess)(res, { ...existing, ...updated }, `Enquiry status updated to ${status}.`);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to update enquiry status.', 500);
        }
    }
    static async getMyEnquiries(req, res) {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;
            let snapshot;
            if (role === 'PROFESSIONAL') {
                const profQuery = await firebase_1.db.collection('professional_profiles').where('userId', '==', userId).get();
                if (profQuery.empty) {
                    return (0, response_1.sendSuccess)(res, [], 'No professional profile found.');
                }
                const profId = profQuery.docs[0].id;
                snapshot = await firebase_1.db.collection('enquiries').where('professionalId', '==', profId).get();
            }
            else {
                snapshot = await firebase_1.db.collection('enquiries').where('customerId', '==', userId).get();
            }
            const enquiries = snapshot.docs.map((doc) => doc.data());
            return (0, response_1.sendSuccess)(res, enquiries, 'Enquiries retrieved.');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to fetch enquiries.', 500);
        }
    }
}
exports.EnquiriesController = EnquiriesController;
