"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsController = void 0;
const firebase_js_1 = require("../../config/firebase.js");
const response_js_1 = require("../../utils/response.js");
class SubscriptionsController {
    static async subscribePro(req, res) {
        try {
            const userId = req.user?.id;
            const { plan } = req.body; // 'PRO_MONTHLY' | 'PRO_ANNUAL'
            const profQuery = await firebase_js_1.db.collection('professional_profiles').where('userId', '==', userId).get();
            if (profQuery.empty) {
                return (0, response_js_1.sendError)(res, 'Professional profile not found.', 404);
            }
            const profId = profQuery.docs[0].id;
            const subId = 'sub_' + Date.now();
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + (plan === 'PRO_ANNUAL' ? 12 : 1));
            const subscription = {
                id: subId,
                professionalId: profId,
                plan: plan === 'PRO_ANNUAL' ? 'PRO_ANNUAL' : 'PRO_MONTHLY',
                status: 'ACTIVE',
                expiresAt: expiresAt.toISOString(),
                createdAt: new Date().toISOString(),
            };
            await firebase_js_1.db.collection('subscriptions').doc(subId).set(subscription);
            await firebase_js_1.db.collection('professional_profiles').doc(profId).update({ isPro: true });
            return (0, response_js_1.sendSuccess)(res, subscription, 'Professional subscription activated to PRO tier.', 201);
        }
        catch (err) {
            return (0, response_js_1.sendError)(res, err.message || 'Subscription failed.', 500);
        }
    }
    static async getMySubscription(req, res) {
        try {
            const userId = req.user?.id;
            const profQuery = await firebase_js_1.db.collection('professional_profiles').where('userId', '==', userId).get();
            if (profQuery.empty)
                return (0, response_js_1.sendError)(res, 'Profile not found.', 404);
            const profId = profQuery.docs[0].id;
            const snapshot = await firebase_js_1.db.collection('subscriptions').where('professionalId', '==', profId).get();
            const subs = snapshot.docs.map((doc) => doc.data());
            return (0, response_js_1.sendSuccess)(res, subs[0] || null, 'Subscription details retrieved.');
        }
        catch (err) {
            return (0, response_js_1.sendError)(res, err.message, 500);
        }
    }
}
exports.SubscriptionsController = SubscriptionsController;
