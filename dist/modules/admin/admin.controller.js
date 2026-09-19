"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const firebase_1 = require("../../config/firebase");
const response_1 = require("../../utils/response");
class AdminController {
    /**
     * Set or update Professional Profile verification status (Requirement #7: Admin exclusive control)
     */
    static async verifyProfessional(req, res) {
        try {
            const { professionalId } = req.params;
            const { isVerified, verificationLevel } = req.body;
            if (isVerified === undefined) {
                return (0, response_1.sendError)(res, 'isVerified boolean flag is required.');
            }
            const doc = await firebase_1.db.collection('professional_profiles').doc(professionalId).get();
            if (!doc.exists) {
                return (0, response_1.sendError)(res, 'Professional profile not found.', 404);
            }
            const updateData = {
                isVerified: Boolean(isVerified),
                verificationLevel: verificationLevel || 'DOCUMENT_VERIFIED',
                updatedAt: new Date().toISOString(),
            };
            await firebase_1.db.collection('professional_profiles').doc(professionalId).update(updateData);
            return (0, response_1.sendSuccess)(res, { professionalId, ...updateData }, `Professional verification status set to ${isVerified ? 'VERIFIED' : 'UNVERIFIED'}.`);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to update verification status.', 500);
        }
    }
    /**
     * Overall platform analytics dashboard metrics
     */
    static async getDashboardMetrics(req, res) {
        try {
            const usersSnap = await firebase_1.db.collection('users').get();
            const profsSnap = await firebase_1.db.collection('professional_profiles').get();
            const reqsSnap = await firebase_1.db.collection('problem_requests').get();
            const enqsSnap = await firebase_1.db.collection('enquiries').get();
            const verifiedProfs = profsSnap.docs.filter((d) => d.data().isVerified).length;
            const completedJobs = enqsSnap.docs.filter((d) => d.data().status === 'COMPLETED').length;
            return (0, response_1.sendSuccess)(res, {
                totalUsers: usersSnap.size,
                totalProfessionals: profsSnap.size,
                verifiedProfessionals: verifiedProfs,
                totalProblemRequests: reqsSnap.size,
                totalEnquiries: enqsSnap.size,
                completedJobsCount: completedJobs,
            }, 'Admin dashboard metrics generated.');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to generate metrics.', 500);
        }
    }
}
exports.AdminController = AdminController;
