"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingController = void 0;
const matching_service_js_1 = require("./matching.service.js");
const response_js_1 = require("../../utils/response.js");
class MatchingController {
    static async findProfessionals(req, res) {
        try {
            const { problemRequestId, latitude, longitude, maxRadiusKm } = req.body;
            if (!problemRequestId) {
                return (0, response_js_1.sendError)(res, 'problemRequestId is required for matching.');
            }
            const matches = await matching_service_js_1.MatchingService.findMatchingProfessionals(problemRequestId, latitude ? Number(latitude) : undefined, longitude ? Number(longitude) : undefined, maxRadiusKm ? Number(maxRadiusKm) : 35);
            return (0, response_js_1.sendSuccess)(res, {
                problemRequestId,
                matchedCount: matches.length,
                professionals: matches,
            }, 'Matching professionals found and ranked by composite trust score.');
        }
        catch (err) {
            return (0, response_js_1.sendError)(res, err.message || 'Matching process failed.', 500);
        }
    }
}
exports.MatchingController = MatchingController;
