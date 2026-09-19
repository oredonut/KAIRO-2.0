"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsController = void 0;
const firebase_js_1 = require("../../config/firebase.js");
const response_js_1 = require("../../utils/response.js");
class ReviewsController {
    static async createReview(req, res) {
        try {
            const customerId = req.user?.id;
            const { enquiryId, professionalId, rating, comment } = req.body;
            if (!professionalId || !rating) {
                return (0, response_js_1.sendError)(res, 'professionalId and numerical rating (1-5) are required.');
            }
            const numRating = Number(rating);
            if (numRating < 1 || numRating > 5) {
                return (0, response_js_1.sendError)(res, 'Rating must be between 1 and 5.');
            }
            const reviewId = 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
            const review = {
                id: reviewId,
                enquiryId: enquiryId || '',
                customerId: customerId || 'guest_user',
                professionalId,
                rating: numRating,
                comment: comment || '',
                createdAt: new Date().toISOString(),
            };
            await firebase_js_1.db.collection('reviews').doc(reviewId).set(review);
            // Recalculate ProfessionalProfile average rating and review count
            const reviewsSnapshot = await firebase_js_1.db.collection('reviews').where('professionalId', '==', professionalId).get();
            const allReviews = reviewsSnapshot.docs.map((doc) => doc.data());
            const reviewCount = allReviews.length;
            const totalSum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
            const ratingAverage = Math.round((totalSum / reviewCount) * 10) / 10;
            await firebase_js_1.db.collection('professional_profiles').doc(professionalId).update({
                ratingAverage,
                reviewCount,
            });
            return (0, response_js_1.sendSuccess)(res, { review, updatedRatingAverage: ratingAverage, reviewCount }, 'Review submitted.', 201);
        }
        catch (err) {
            return (0, response_js_1.sendError)(res, err.message || 'Failed to submit review.', 500);
        }
    }
    static async getByProfessionalId(req, res) {
        try {
            const { professionalId } = req.params;
            const snapshot = await firebase_js_1.db.collection('reviews').where('professionalId', '==', professionalId).get();
            const reviews = snapshot.docs.map((doc) => doc.data());
            return (0, response_js_1.sendSuccess)(res, reviews, 'Reviews retrieved.');
        }
        catch (err) {
            return (0, response_js_1.sendError)(res, err.message || 'Failed to fetch reviews.', 500);
        }
    }
}
exports.ReviewsController = ReviewsController;
