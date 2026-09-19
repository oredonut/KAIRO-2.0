import { Response } from 'express';
import { db } from '../../config/firebase.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { Subscription } from '../../types/index.js';

export class SubscriptionsController {
  static async subscribePro(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { plan } = req.body; // 'PRO_MONTHLY' | 'PRO_ANNUAL'

      const profQuery = await db.collection('professional_profiles').where('userId', '==', userId).get();
      if (profQuery.empty) {
        return sendError(res, 'Professional profile not found.', 404);
      }

      const profId = profQuery.docs[0].id;
      const subId = 'sub_' + Date.now();

      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + (plan === 'PRO_ANNUAL' ? 12 : 1));

      const subscription: Subscription = {
        id: subId,
        professionalId: profId,
        plan: plan === 'PRO_ANNUAL' ? 'PRO_ANNUAL' : 'PRO_MONTHLY',
        status: 'ACTIVE',
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      };

      await db.collection('subscriptions').doc(subId).set(subscription);
      await db.collection('professional_profiles').doc(profId).update({ isPro: true });

      return sendSuccess(res, subscription, 'Professional subscription activated to PRO tier.', 201);
    } catch (err: any) {
      return sendError(res, err.message || 'Subscription failed.', 500);
    }
  }

  static async getMySubscription(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const profQuery = await db.collection('professional_profiles').where('userId', '==', userId).get();
      if (profQuery.empty) return sendError(res, 'Profile not found.', 404);

      const profId = profQuery.docs[0].id;
      const snapshot = await db.collection('subscriptions').where('professionalId', '==', profId).get();
      const subs: Subscription[] = snapshot.docs.map((doc: any) => doc.data());
      return sendSuccess(res, subs[0] || null, 'Subscription details retrieved.');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }
}
