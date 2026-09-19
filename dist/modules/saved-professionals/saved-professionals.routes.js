"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const saved_professionals_controller_js_1 = require("./saved-professionals.controller.js");
const auth_middleware_js_1 = require("../../middlewares/auth.middleware.js");
const router = (0, express_1.Router)();
router.post('/toggle', auth_middleware_js_1.authenticate, saved_professionals_controller_js_1.SavedProfessionalsController.toggleSave);
router.get('/', auth_middleware_js_1.authenticate, saved_professionals_controller_js_1.SavedProfessionalsController.getMySaved);
exports.default = router;
