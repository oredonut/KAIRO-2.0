import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { ENV } from './config/env';
import { errorHandler } from './middlewares/error.middleware';

// Import Feature Modules
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import professionalsRoutes from './modules/professionals/professionals.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import problemRequestsRoutes from './modules/problem-requests/problem-requests.routes';
import aiRoutes from './modules/ai/ai.routes';
import matchingRoutes from './modules/matching/matching.routes';
import workSamplesRoutes from './modules/work-samples/work-samples.routes';
import enquiriesRoutes from './modules/enquiries/enquiries.routes';
import reviewsRoutes from './modules/reviews/reviews.routes';
import savedProfessionalsRoutes from './modules/saved-professionals/saved-professionals.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import subscriptionsRoutes from './modules/subscriptions/subscriptions.routes';
import adminRoutes from './modules/admin/admin.routes';

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

if (process.env.NODE_ENV !== 'test' && !process.env.TEST_MODE) {
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
