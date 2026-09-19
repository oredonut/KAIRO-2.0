"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const saved_professionals_controller_1 = require("./saved-professionals.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/toggle', auth_middleware_1.authenticate, saved_professionals_controller_1.SavedProfessionalsController.toggleSave);
router.get('/', auth_middleware_1.authenticate, saved_professionals_controller_1.SavedProfessionalsController.getMySaved);
exports.default = router;
