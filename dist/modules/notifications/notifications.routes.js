"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notifications_controller_js_1 = require("./notifications.controller.js");
const auth_middleware_js_1 = require("../../middlewares/auth.middleware.js");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_js_1.authenticate, notifications_controller_js_1.NotificationsController.getMyNotifications);
router.patch('/:id/read', auth_middleware_js_1.authenticate, notifications_controller_js_1.NotificationsController.markAsRead);
exports.default = router;
