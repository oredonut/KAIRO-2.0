"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notifications_controller_1 = require("./notifications.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authenticate, notifications_controller_1.NotificationsController.getMyNotifications);
router.patch('/:id/read', auth_middleware_1.authenticate, notifications_controller_1.NotificationsController.markAsRead);
exports.default = router;
