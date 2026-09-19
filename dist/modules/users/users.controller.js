"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const firebase_js_1 = require("../../config/firebase.js");
const response_js_1 = require("../../utils/response.js");
class UsersController {
    static async updateLocation(req, res) {
        try {
            const userId = req.user?.id;
            const { location, latitude, longitude } = req.body;
            if (latitude === undefined || longitude === undefined) {
                return (0, response_js_1.sendError)(res, 'Latitude and longitude are required.');
            }
            const updateData = {
                location: location || '',
                latitude: Number(latitude),
                longitude: Number(longitude),
                updatedAt: new Date().toISOString(),
            };
            await firebase_js_1.db.collection('users').doc(userId).update(updateData);
            // If user is a professional, update professional location as well
            const profQuery = await firebase_js_1.db.collection('professional_profiles').where('userId', '==', userId).get();
            if (!profQuery.empty) {
                const profId = profQuery.docs[0].id;
                await firebase_js_1.db.collection('professional_profiles').doc(profId).update(updateData);
            }
            return (0, response_js_1.sendSuccess)(res, updateData, 'User location updated successfully.');
        }
        catch (err) {
            return (0, response_js_1.sendError)(res, err.message || 'Location update failed.', 500);
        }
    }
}
exports.UsersController = UsersController;
