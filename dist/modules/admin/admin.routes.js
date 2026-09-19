"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_js_1 = require("./admin.controller.js");
const auth_middleware_js_1 = require("../../middlewares/auth.middleware.js");
const router = (0, express_1.Router)();
router.patch('/professionals/:professionalId/verify', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.requireRole)(['ADMIN']), admin_controller_js_1.AdminController.verifyProfessional);
router.get('/metrics', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.requireRole)(['ADMIN']), admin_controller_js_1.AdminController.getDashboardMetrics);
exports.default = router;
