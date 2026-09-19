"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_js_1 = require("./users.controller.js");
const auth_middleware_js_1 = require("../../middlewares/auth.middleware.js");
const router = (0, express_1.Router)();
router.patch('/location', auth_middleware_js_1.authenticate, users_controller_js_1.UsersController.updateLocation);
exports.default = router;
