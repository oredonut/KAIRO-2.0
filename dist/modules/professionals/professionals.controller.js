"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalsController = void 0;
const firebase_1 = require("../../config/firebase");
const response_1 = require("../../utils/response");
const ai_service_1 = require("../ai/ai.service");
class ProfessionalsController {
    static async getMyProfile(req, res) {
        try {
            const userId = req.user?.id;
            const snapshot = await firebase_1.db.collection('professional_profiles').where('userId', '==', userId).get();
            if (snapshot.empty) {
                return (0, response_1.sendError)(res, 'Professional profile not found.', 404);
            }
            const profile = snapshot.docs[0].data();
            return (0, response_1.sendSuccess)(res, profile, 'Profile fetched successfully.');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to fetch profile.', 500);
        }
    }
    static async getProfileById(req, res) {
        try {
            const { id } = req.params;
            const doc = await firebase_1.db.collection('professional_profiles').doc(id).get();
            if (!doc.exists) {
                return (0, response_1.sendError)(res, 'Professional profile not found.', 404);
            }
            const profile = doc.data();
            return (0, response_1.sendSuccess)(res, profile, 'Profile details retrieved.');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to fetch profile.', 500);
        }
    }
    static async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            const snapshot = await firebase_1.db.collection('professional_profiles').where('userId', '==', userId).get();
            if (snapshot.empty) {
                return (0, response_1.sendError)(res, 'Professional profile not found.', 404);
            }
            const profileDoc = snapshot.docs[0];
            const existingProfile = profileDoc.data();
            const { displayName, bio, categoryId, experienceYears, skills, services, location, latitude, longitude, serviceRadiusKm, availabilityStatus, isPublished, } = req.body;
            // Calculate profile completeness score dynamically
            let completeness = 30;
            if (bio && bio.length > 20)
                completeness += 25;
            if (skills && skills.length > 0)
                completeness += 25;
            if (experienceYears && experienceYears > 0)
                completeness += 10;
            if (location)
                completeness += 10;
            const updatedProfile = {
                displayName: displayName || existingProfile.displayName,
                bio: bio !== undefined ? bio : existingProfile.bio,
                categoryId: categoryId || existingProfile.categoryId,
                experienceYears: experienceYears !== undefined ? Number(experienceYears) : existingProfile.experienceYears,
                skills: Array.isArray(skills) ? skills : existingProfile.skills,
                services: Array.isArray(services) ? services : existingProfile.services,
                location: location || existingProfile.location,
                latitude: latitude !== undefined ? Number(latitude) : existingProfile.latitude,
                longitude: longitude !== undefined ? Number(longitude) : existingProfile.longitude,
                serviceRadiusKm: serviceRadiusKm !== undefined ? Number(serviceRadiusKm) : existingProfile.serviceRadiusKm,
                availabilityStatus: availabilityStatus || existingProfile.availabilityStatus,
                isPublished: isPublished !== undefined ? Boolean(isPublished) : existingProfile.isPublished,
                profileCompleteness: Math.min(completeness, 100),
                updatedAt: new Date().toISOString(),
                // IMPORTANT Rule #7: isVerified CANNOT be overwritten by artisan! Keep existing value.
                isVerified: existingProfile.isVerified,
            };
            await firebase_1.db.collection('professional_profiles').doc(existingProfile.id).update(updatedProfile);
            return (0, response_1.sendSuccess)(res, { ...existingProfile, ...updatedProfile }, 'Professional profile updated successfully.');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to update profile.', 500);
        }
    }
    /**
     * AI Artisan Profile Parser (Requirement #1 & #15)
     */
    static async parseProfileDescription(req, res) {
        try {
            const { description } = req.body;
            if (!description || typeof description !== 'string') {
                return (0, response_1.sendError)(res, 'Description string is required.');
            }
            const parsedResult = await ai_service_1.AIService.parseArtisanProfile(description);
            return (0, response_1.sendSuccess)(res, parsedResult, 'Profile description parsed into structured skills & details.');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to parse artisan profile.', 500);
        }
    }
}
exports.ProfessionalsController = ProfessionalsController;
