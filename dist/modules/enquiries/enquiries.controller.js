"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiriesController = void 0;
const firebase_1 = require("../../config/firebase");
const response_1 = require("../../utils/response");
class EnquiriesController {
    static async createEnquiry(req, res) {
        try {
            const customerId = req.user?.id || 'guest_user';
            const { problemRequestId, professionalId, artisanId, customerName, customerPhone, problemText, serviceLabel, brand, location, when, message, matchReasons, } = req.body;
            const targetProfId = professionalId || artisanId;
            if (!targetProfId) {
                return (0, response_1.sendError)(res, 'professionalId or artisanId is required.');
            }
            const enquiryId = 'req-' + Date.now();
            const enquiry = {
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
            await firebase_1.db.collection('enquiries').doc(enquiryId).set(enquiry);
            // Fetch professional to get userId for notification
            const profDoc = await firebase_1.db.collection('professional_profiles').doc(targetProfId).get();
            if (profDoc.exists) {
                const profData = profDoc.data();
                const notification = {
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
            const normalizedStatus = (status || '').toLowerCase();
            const statusTexts = {
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
                return (0, response_1.sendError)(res, 'Invalid enquiry status.');
            }
            const doc = await firebase_1.db.collection('enquiries').doc(id).get();
            if (!doc.exists) {
                return (0, response_1.sendError)(res, 'Enquiry not found.', 404);
            }
            const existing = doc.data();
            const updated = {
                status: normalizedStatus,
                statusText: statusTexts[normalizedStatus],
                updatedAt: new Date().toISOString(),
            };
            await firebase_1.db.collection('enquiries').doc(id).update(updated);
            // Increment completedJobs if completed
            if (normalizedStatus === 'completed') {
                const targetProfId = existing.professionalId || existing.artisanId;
                if (targetProfId) {
                    const profDoc = await firebase_1.db.collection('professional_profiles').doc(targetProfId).get();
                    if (profDoc.exists) {
                        const prof = profDoc.data();
                        await firebase_1.db.collection('professional_profiles').doc(targetProfId).update({
                            completedJobsCount: (prof.completedJobsCount || 0) + 1,
                        });
                    }
                }
            }
            return (0, response_1.sendSuccess)(res, { ...existing, ...updated }, `Enquiry status updated to ${statusTexts[normalizedStatus]}.`);
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
