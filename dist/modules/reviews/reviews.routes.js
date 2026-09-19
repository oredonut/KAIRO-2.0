"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_controller_1 = require("./reviews.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authenticate, reviews_controller_1.ReviewsController.createReview);
router.get('/professional/:professionalId', reviews_controller_1.ReviewsController.getByProfessionalId);
exports.default = router;
