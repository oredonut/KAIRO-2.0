"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const matching_controller_1 = require("./matching.controller");
const router = (0, express_1.Router)();
router.post('/find-professionals', matching_controller_1.MatchingController.findProfessionals);
exports.default = router;
