"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, message, statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}
function sendError(res, error, statusCode = 400, details) {
    return res.status(statusCode).json({
        success: false,
        error,
        details,
    });
}
