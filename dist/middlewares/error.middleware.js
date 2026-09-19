"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error('[Error Handler]', err);
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal server error.';
    return res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    });
}
