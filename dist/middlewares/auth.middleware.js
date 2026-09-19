"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
const response_js_1 = require("../utils/response.js");
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return (0, response_js_1.sendError)(res, 'Unauthorized: No token provided.', 401);
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_js_1.ENV.JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
        };
        next();
    }
    catch (err) {
        return (0, response_js_1.sendError)(res, 'Unauthorized: Invalid or expired token.', 401);
    }
}
function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return (0, response_js_1.sendError)(res, 'Unauthorized.', 401);
        }
        if (!allowedRoles.includes(req.user.role)) {
            return (0, response_js_1.sendError)(res, `Forbidden: Access requires one of the following roles: [${allowedRoles.join(', ')}]`, 403);
        }
        next();
    };
}
