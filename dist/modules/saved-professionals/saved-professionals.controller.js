"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedProfessionalsController = void 0;
const firebase_1 = require("../../config/firebase");
const response_1 = require("../../utils/response");
class SavedProfessionalsController {
    static async toggleSave(req, res) {
        try {
            const customerId = req.user?.id;
            const { professionalId } = req.body;
            if (!professionalId) {
                return (0, response_1.sendError)(res, 'professionalId is required.');
            }
            const query = await firebase_1.db
                .collection('saved_professionals')
                .where('customerId', '==', customerId)
                .where('professionalId', '==', professionalId)
                .get();
            if (!query.empty) {
                // Unsave / remove bookmark
                const docId = query.docs[0].id;
                await firebase_1.db.collection('saved_professionals').doc(docId).delete();
                return (0, response_1.sendSuccess)(res, { isSaved: false }, 'Professional removed from saved list.');
            }
            else {
                // Save professional
                const id = 'sp_' + Date.now();
                const item = {
                    id,
                    customerId: customerId,
                    professionalId,
                    createdAt: new Date().toISOString(),
                };
                await firebase_1.db.collection('saved_professionals').doc(id).set(item);
                return (0, response_1.sendSuccess)(res, { isSaved: true, saved: item }, 'Professional saved successfully.', 201);
            }
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to toggle saved professional.', 500);
        }
    }
    static async getMySaved(req, res) {
        try {
            const customerId = req.user?.id;
            const snapshot = await firebase_1.db.collection('saved_professionals').where('customerId', '==', customerId).get();
            const items = snapshot.docs.map((doc) => doc.data());
            // Fetch professional profiles for each item
            const profs = [];
            for (const item of items) {
                const pDoc = await firebase_1.db.collection('professional_profiles').doc(item.professionalId).get();
                if (pDoc.exists) {
                    profs.push(pDoc.data());
                }
            }
            return (0, response_1.sendSuccess)(res, profs, 'Saved professionals retrieved.');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to fetch saved professionals.', 500);
        }
    }
}
exports.SavedProfessionalsController = SavedProfessionalsController;
