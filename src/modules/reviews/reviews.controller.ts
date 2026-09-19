import { Response } from 'express';
import { db } from '../../config/firebase.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { Review, ProfessionalProfile } from '../../types/index.js';

export class ReviewsController {
  static async createReview(req: AuthenticatedRequest, res: Response) {
    try {
      const customerId = req.user?.id;
      const { enquiryId, professionalId, rating, comment } = req.body;

      if (!professionalId || !rating) {
        return sendError(res, 'professionalId and numerical rating (1-5) are required.');
      }

      const numRating = Number(rating);
      if (numRating < 1 || numRating > 5) {
        return sendError(res, 'Rating must be between 1 and 5.');
      }

      const reviewId = 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

      const review: Review = {
        id: reviewId,
        enquiryId: enquiryId || '',
        customerId: customerId || 'guest_user',
        professionalId,
        rating: numRating,
        comment: comment || '',
        createdAt: new Date().toISOString(),
      };

      await db.collection('reviews').doc(reviewId).set(review);

      // Recalculate ProfessionalProfile average rating and review count
      const reviewsSnapshot = await db.collection('reviews').where('professionalId', '==', professionalId).get();
      const allReviews: Review[] = reviewsSnapshot.docs.map((doc: any) => doc.data());
      const reviewCount = allReviews.length;
      const totalSum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
      const ratingAverage = Math.round((totalSum / reviewCount) * 10) / 10;

      await db.collection('professional_profiles').doc(professionalId).update({
        ratingAverage,
        reviewCount,
      });

      return sendSuccess(res, { review, updatedRatingAverage: ratingAverage, reviewCount }, 'Review submitted.', 201);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to submit review.', 500);
    }
  }

  static async getByProfessionalId(req: AuthenticatedRequest, res: Response) {
    try {
      const { professionalId } = req.params;
      const snapshot = await db.collection('reviews').where('professionalId', '==', professionalId).get();
      const reviews: Review[] = snapshot.docs.map((doc: any) => doc.data());
      return sendSuccess(res, reviews, 'Reviews retrieved.');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch reviews.', 500);
    }
  }
}
