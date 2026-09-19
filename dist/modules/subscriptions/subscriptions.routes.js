"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptions_controller_js_1 = require("./subscriptions.controller.js");
const auth_middleware_js_1 = require("../../middlewares/auth.middleware.js");
const router = (0, express_1.Router)();
router.post('/upgrade', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.requireRole)(['PROFESSIONAL']), subscriptions_controller_js_1.SubscriptionsController.subscribePro);
router.get('/my', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.requireRole)(['PROFESSIONAL']), subscriptions_controller_js_1.SubscriptionsController.getMySubscription);
exports.default = router;
