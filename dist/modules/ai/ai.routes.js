"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_service_1 = require("./ai.service");
const response_1 = require("../../utils/response");
const router = (0, express_1.Router)();
router.post('/analyze-problem', async (req, res) => {
    try {
        const { input } = req.body;
        if (!input)
            return (0, response_1.sendError)(res, 'Input string is required.');
        const result = await ai_service_1.AIService.analyzeProblem(input);
        return (0, response_1.sendSuccess)(res, result, 'AI analysis complete.');
    }
    catch (err) {
        return (0, response_1.sendError)(res, err.message, 500);
    }
});
router.post('/parse-artisan', async (req, res) => {
    try {
        const { description } = req.body;
        if (!description)
            return (0, response_1.sendError)(res, 'Description string is required.');
        const result = await ai_service_1.AIService.parseArtisanProfile(description);
        return (0, response_1.sendSuccess)(res, result, 'Artisan profile parsed.');
    }
    catch (err) {
        return (0, response_1.sendError)(res, err.message, 500);
    }
});
exports.default = router;
