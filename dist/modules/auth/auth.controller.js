"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const firebase_1 = require("../../config/firebase");
const env_1 = require("../../config/env");
const response_1 = require("../../utils/response");
class AuthController {
    static async register(req, res) {
        try {
            const { email, password, firstName, lastName, phone, role, location, latitude, longitude } = req.body;
            if (!email || !password || !firstName || !lastName) {
                return (0, response_1.sendError)(res, 'Email, password, firstName, and lastName are required.');
            }
            const assignedRole = ['CUSTOMER', 'PROFESSIONAL', 'ADMIN'].includes(role) ? role : 'CUSTOMER';
            // Check existing user in Firestore
            const existingQuery = await firebase_1.db.collection('users').where('email', '==', email.toLowerCase()).get();
            if (!existingQuery.empty) {
                return (0, response_1.sendError)(res, 'User with this email already exists.');
            }
            const passwordHash = await bcryptjs_1.default.hash(password, 10);
            const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
            const newUser = {
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
            await firebase_1.db.collection('users').doc(userId).set(newUser);
            // If registered as PROFESSIONAL, initialize ProfessionalProfile (isVerified defaults strictly to FALSE per Requirement #7)
            if (assignedRole === 'PROFESSIONAL') {
                const profId = 'prof_' + userId;
                await firebase_1.db.collection('professional_profiles').doc(profId).set({
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
            const token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email, role: newUser.role, firstName: newUser.firstName, lastName: newUser.lastName }, env_1.ENV.JWT_SECRET, { expiresIn: '7d' });
            // Never expose password hash (Requirement #5)
            const { passwordHash: _, ...safeUser } = newUser;
            return (0, response_1.sendSuccess)(res, { user: safeUser, token }, 'User registered successfully.', 201);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Registration failed.', 500);
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return (0, response_1.sendError)(res, 'Email and password are required.');
            }
            const query = await firebase_1.db.collection('users').where('email', '==', email.toLowerCase()).get();
            if (query.empty) {
                return (0, response_1.sendError)(res, 'Invalid credentials.', 401);
            }
            const userDoc = query.docs[0];
            const user = userDoc.data();
            if (!user.passwordHash) {
                return (0, response_1.sendError)(res, 'Invalid credentials.', 401);
            }
            const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
            if (!isMatch) {
                return (0, response_1.sendError)(res, 'Invalid credentials.', 401);
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }, env_1.ENV.JWT_SECRET, { expiresIn: '7d' });
            // Exclude password hash (Requirement #5)
            const { passwordHash: _, ...safeUser } = user;
            return (0, response_1.sendSuccess)(res, { user: safeUser, token }, 'Login successful.');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Login failed.', 500);
        }
    }
    static async getMe(req, res) {
        try {
            const userId = req.user?.id;
            const userDoc = await firebase_1.db.collection('users').doc(userId).get();
            if (!userDoc.exists) {
                return (0, response_1.sendError)(res, 'User not found.', 404);
            }
            const user = userDoc.data();
            const { passwordHash: _, ...safeUser } = user;
            return (0, response_1.sendSuccess)(res, safeUser, 'User profile fetched.');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message || 'Failed to fetch user.', 500);
        }
    }
}
exports.AuthController = AuthController;
