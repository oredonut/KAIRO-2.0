"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptions_controller_1 = require("./subscriptions.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/upgrade', auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(['PROFESSIONAL']), subscriptions_controller_1.SubscriptionsController.subscribePro);
router.get('/my', auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(['PROFESSIONAL']), subscriptions_controller_1.SubscriptionsController.getMySubscription);
exports.default = router;
