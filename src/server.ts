import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { ENV } from './config/env.js';
import { errorHandler } from './middlewares/error.middleware.js';

// Import Feature Modules
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import professionalsRoutes from './modules/professionals/professionals.routes.js';
import categoriesRoutes from './modules/categories/categories.routes.js';
import problemRequestsRoutes from './modules/problem-requests/problem-requests.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import matchingRoutes from './modules/matching/matching.routes.js';
import workSamplesRoutes from './modules/work-samples/work-samples.routes.js';
import enquiriesRoutes from './modules/enquiries/enquiries.routes.js';
import reviewsRoutes from './modules/reviews/reviews.routes.js';
import savedProfessionalsRoutes from './modules/saved-professionals/saved-professionals.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';
import subscriptionsRoutes from './modules/subscriptions/subscriptions.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve media uploads statically (Local AWS S3 Fallback)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'HEALTHY',
    service: 'KAIRO Backend API',
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
  });
});

// Register Modular REST Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/professionals', professionalsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/problem-requests', problemRequestsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/work-samples', workSamplesRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/saved-professionals', savedProfessionalsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(ENV.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 KAIRO Backend Infrastructure running on port ${ENV.PORT}`);
    console.log(`📍 Environment: ${ENV.NODE_ENV}`);
    console.log(`🔥 Firebase Firestore Database: Active`);
    console.log(`☁️  AWS Services (S3 Storage): Active`);
    console.log(`=======================================================`);
  });
}

export default app;
