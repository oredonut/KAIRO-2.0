export type UserRole = 'CUSTOMER' | 'PROFESSIONAL' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  authProviderId?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalProfile {
  id: string;
  userId: string;
  categoryId: string;
  displayName: string;
  bio: string;
  experienceYears: number;
  skills: string[]; // Skill IDs or normalized skill names
  services: string[]; // Service IDs or names
  brands?: string[];
  location: string;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  availabilityStatus: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  profileCompleteness: number; // 0 - 100
  isPublished: boolean;
  isVerified: boolean; // Must NEVER be true by default on creation
  verificationLevel?: 'BASIC' | 'DOCUMENT_VERIFIED' | 'BACKGROUND_CHECKED';
  isPro: boolean;
  ratingAverage: number;
  reviewCount: number;
  completedJobsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string; // e.g. tailor, clothing_alteration, generator_repair, device_repair
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

export interface WorkSample {
  id: string;
  professionalId: string;
  title: string;
  categoryId: string;
  problemDescription: string;
  workDescription: string;
  resultDescription: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProblemInputType = 'TEXT' | 'VOICE' | 'IMAGE';

export interface ProblemRequest {
  id: string;
  customerId: string;
  rawInput: string;
  inputType: ProblemInputType;
  categoryId?: string;
  problemSummary?: string;
  requiredSkills: string[];
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  location?: string;
  latitude?: number;
  longitude?: number;
  status: 'PENDING_ANALYSIS' | 'ANALYZED' | 'ENQUIRED' | 'COMPLETED' | 'CANCELLED';
  aiConfidence?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MissingInformationItem {
  key: string;
  question: string;
}

export interface ProblemAnalysis {
  id: string;
  problemRequestId: string;
  categoryId: string;
  problemSummary: string;
  requiredSkills: string[];
  missingInformation: MissingInformationItem[];
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  possibleServiceTypes: string[];
  aiModel: string;
  aiVersion: string;
  createdAt: string;
}

export type EnquiryStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';

export interface Enquiry {
  id: string;
  problemRequestId: string;
  customerId: string;
  professionalId: string;
  status: EnquiryStatus;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  enquiryId: string;
  customerId: string;
  professionalId: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface SavedProfessional {
  id: string;
  customerId: string;
  professionalId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ENQUIRY' | 'SYSTEM' | 'REVIEW' | 'VERIFICATION';
  isRead: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  professionalId: string;
  plan: 'FREE' | 'PRO_MONTHLY' | 'PRO_ANNUAL';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  expiresAt: string;
  createdAt: string;
}
