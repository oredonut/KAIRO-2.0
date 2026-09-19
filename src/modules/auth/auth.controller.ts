import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../config/firebase';
import { ENV } from '../../config/env';
import { sendSuccess, sendError } from '../../utils/response';
import { User, UserRole } from '../../types/index';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, phone, role, location, latitude, longitude } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return sendError(res, 'Email, password, firstName, and lastName are required.');
      }

      const assignedRole: UserRole = ['CUSTOMER', 'PROFESSIONAL', 'ADMIN'].includes(role) ? role : 'CUSTOMER';

      // Check existing user in Firestore
      const existingQuery = await db.collection('users').where('email', '==', email.toLowerCase()).get();
      if (!existingQuery.empty) {
        return sendError(res, 'User with this email already exists.');
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

      const newUser: User = {
        id: userId,
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phone: phone || '',
        role: assignedRole,
        location: location || '',
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.collection('users').doc(userId).set(newUser);

      // If registered as PROFESSIONAL, initialize ProfessionalProfile (isVerified defaults strictly to FALSE per Requirement #7)
      if (assignedRole === 'PROFESSIONAL') {
        const profId = 'prof_' + userId;
        await db.collection('professional_profiles').doc(profId).set({
          id: profId,
          userId,
          categoryId: 'cat_generator_repair',
          displayName: `${firstName} ${lastName}`,
          bio: 'Professional skilled artisan on KAIRO.',
          experienceYears: 1,
          skills: [],
          services: [],
          location: location || '',
          latitude: latitude ? Number(latitude) : 6.5244,
          longitude: longitude ? Number(longitude) : 3.3792,
          serviceRadiusKm: 25,
          availabilityStatus: 'AVAILABLE',
          profileCompleteness: 30,
          isPublished: false,
          isVerified: false, // Rule #7: isVerified must NEVER be automatically true upon profile creation
          isPro: false,
          ratingAverage: 0,
          reviewCount: 0,
          completedJobsCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role, firstName: newUser.firstName, lastName: newUser.lastName },
        ENV.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Never expose password hash (Requirement #5)
      const { passwordHash: _, ...safeUser } = newUser;

      return sendSuccess(res, { user: safeUser, token }, 'User registered successfully.', 201);
    } catch (err: any) {
      return sendError(res, err.message || 'Registration failed.', 500);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendError(res, 'Email and password are required.');
      }

      const query = await db.collection('users').where('email', '==', email.toLowerCase()).get();

      if (query.empty) {
        return sendError(res, 'Invalid credentials.', 401);
      }

      const userDoc = query.docs[0];
      const user: User = userDoc.data();

      if (!user.passwordHash) {
        return sendError(res, 'Invalid credentials.', 401);
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return sendError(res, 'Invalid credentials.', 401);
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
        ENV.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Exclude password hash (Requirement #5)
      const { passwordHash: _, ...safeUser } = user;

      return sendSuccess(res, { user: safeUser, token }, 'Login successful.');
    } catch (err: any) {
      return sendError(res, err.message || 'Login failed.', 500);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        return sendError(res, 'User not found.', 404);
      }

      const user: User = userDoc.data();
      const { passwordHash: _, ...safeUser } = user;

      return sendSuccess(res, safeUser, 'User profile fetched.');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch user.', 500);
    }
  }
}
