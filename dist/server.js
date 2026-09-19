"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const env_js_1 = require("./config/env.js");
const error_middleware_js_1 = require("./middlewares/error.middleware.js");
// Import Feature Modules
const auth_routes_js_1 = __importDefault(require("./modules/auth/auth.routes.js"));
const users_routes_js_1 = __importDefault(require("./modules/users/users.routes.js"));
const professionals_routes_js_1 = __importDefault(require("./modules/professionals/professionals.routes.js"));
const categories_routes_js_1 = __importDefault(require("./modules/categories/categories.routes.js"));
const problem_requests_routes_js_1 = __importDefault(require("./modules/problem-requests/problem-requests.routes.js"));
const ai_routes_js_1 = __importDefault(require("./modules/ai/ai.routes.js"));
const matching_routes_js_1 = __importDefault(require("./modules/matching/matching.routes.js"));
const work_samples_routes_js_1 = __importDefault(require("./modules/work-samples/work-samples.routes.js"));
const enquiries_routes_js_1 = __importDefault(require("./modules/enquiries/enquiries.routes.js"));
const reviews_routes_js_1 = __importDefault(require("./modules/reviews/reviews.routes.js"));
const saved_professionals_routes_js_1 = __importDefault(require("./modules/saved-professionals/saved-professionals.routes.js"));
const notifications_routes_js_1 = __importDefault(require("./modules/notifications/notifications.routes.js"));
const subscriptions_routes_js_1 = __importDefault(require("./modules/subscriptions/subscriptions.routes.js"));
const admin_routes_js_1 = __importDefault(require("./modules/admin/admin.routes.js"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Serve media uploads statically (Local AWS S3 Fallback)
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Health Check Endpoint
app.get('/health', (req, res) => {
    return res.status(200).json({
        status: 'HEALTHY',
        service: 'KAIRO Backend API',
        timestamp: new Date().toISOString(),
        environment: env_js_1.ENV.NODE_ENV,
    });
});
// Register Modular REST Routes
app.use('/api/auth', auth_routes_js_1.default);
app.use('/api/users', users_routes_js_1.default);
app.use('/api/professionals', professionals_routes_js_1.default);
app.use('/api/categories', categories_routes_js_1.default);
app.use('/api/problem-requests', problem_requests_routes_js_1.default);
app.use('/api/ai', ai_routes_js_1.default);
app.use('/api/matching', matching_routes_js_1.default);
app.use('/api/work-samples', work_samples_routes_js_1.default);
app.use('/api/enquiries', enquiries_routes_js_1.default);
app.use('/api/reviews', reviews_routes_js_1.default);
app.use('/api/saved-professionals', saved_professionals_routes_js_1.default);
app.use('/api/notifications', notifications_routes_js_1.default);
app.use('/api/subscriptions', subscriptions_routes_js_1.default);
app.use('/api/admin', admin_routes_js_1.default);
// Global Error Handler
app.use(error_middleware_js_1.errorHandler);
if (process.env.NODE_ENV !== 'test') {
    app.listen(env_js_1.ENV.PORT, () => {
        console.log(`=======================================================`);
        console.log(`🚀 KAIRO Backend Infrastructure running on port ${env_js_1.ENV.PORT}`);
        console.log(`📍 Environment: ${env_js_1.ENV.NODE_ENV}`);
        console.log(`🔥 Firebase Firestore Database: Active`);
        console.log(`☁️  AWS Services (S3 Storage): Active`);
        console.log(`=======================================================`);
    });
}
exports.default = app;
