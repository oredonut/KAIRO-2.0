import { db } from '../../config/firebase.js';
import { ProfessionalProfile, User, WorkSample, ProblemRequest } from '../../types/index.js';
import { calculateDistanceKm } from '../../utils/distance.js';

export interface MatchResult {
  professionalId: string;
  user: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    phone?: string;
  };
  displayName: string;
  bio: string;
  ratingAverage: number;
  reviewCount: number;
  completedJobsCount: number;
  isVerified: boolean;
  verificationLevel?: string;
  isPro: boolean;
  distanceKm: number;
  skillMatchPercentage: number;
  compositeScore: number;
  matchingSkills: string[];
  workSamples: WorkSample[];
  matchReasons: string[]; // Trust signals explaining why this professional matched
}

export class MatchingService {
  /**
   * Finds and ranks relevant professionals for a customer's problem request.
   */
  static async findMatchingProfessionals(
    problemRequestId: string,
    customerLat?: number,
    customerLng?: number,
    maxRadiusKm = 35
  ): Promise<MatchResult[]> {
    // 1. Fetch Problem Request document from Firestore
    const requestDoc = await db.collection('problem_requests').doc(problemRequestId).get();

    if (!requestDoc.exists) {
      throw new Error(`ProblemRequest with ID ${problemRequestId} not found.`);
    }

    const problemRequest: ProblemRequest = requestDoc.data();
    const reqLat = customerLat ?? problemRequest.latitude;
    const reqLng = customerLng ?? problemRequest.longitude;

    // 2. Fetch all published professional profiles
    const profilesSnapshot = await db.collection('professional_profiles').where('isPublished', '==', true).get();
    const profiles: ProfessionalProfile[] = profilesSnapshot.docs.map((doc: any) => doc.data());

    // 3. Fetch user records and work samples
    const usersSnapshot = await db.collection('users').get();
    const usersMap = new Map<string, User>();
    usersSnapshot.docs.forEach((doc: any) => {
      const u = doc.data();
      usersMap.set(u.id, u);
    });

    const samplesSnapshot = await db.collection('work_samples').get();
    const samplesByProf = new Map<string, WorkSample[]>();
    samplesSnapshot.docs.forEach((doc: any) => {
      const sample: WorkSample = doc.data();
      const existing = samplesByProf.get(sample.professionalId) || [];
      existing.push(sample);
      samplesByProf.set(sample.professionalId, existing);
    });

    const results: MatchResult[] = [];

    for (const prof of profiles) {
      // Filter by category if matched
      if (problemRequest.categoryId && prof.categoryId !== problemRequest.categoryId) {
        continue;
      }

      // Distance calculation
      const distKm = calculateDistanceKm(reqLat, reqLng, prof.latitude, prof.longitude);

      // Check service radius boundary
      if (reqLat && reqLng && distKm > (prof.serviceRadiusKm || maxRadiusKm)) {
        continue;
      }

      // Skill overlap
      const requiredSkills = problemRequest.requiredSkills || [];
      const profSkills = prof.skills || [];
      const matchingSkills = requiredSkills.filter((sk) =>
        profSkills.some((pSk) => pSk.toLowerCase() === sk.toLowerCase())
      );

      const skillMatchScore = requiredSkills.length > 0 ? matchingSkills.length / requiredSkills.length : 0.8;

      // Composite match score calculation
      const ratingScore = (prof.ratingAverage || 0) / 5;
      const verificationBonus = prof.isVerified ? 0.15 : 0;
      const proBonus = prof.isPro ? 0.10 : 0;
      const proximityScore = Math.max(0, 1 - distKm / (prof.serviceRadiusKm || 30));

      const compositeScore = Math.round(
        (skillMatchScore * 0.4 + ratingScore * 0.25 + proximityScore * 0.1 + verificationBonus + proBonus) * 100
      );

      // Trust signals derivation
      const trustSignals: string[] = [];

      if (matchingSkills.length > 0) {
        trustSignals.push(`Matches ${matchingSkills.length} of ${requiredSkills.length} required skills (${matchingSkills.join(', ')})`);
      } else {
        trustSignals.push(`Expert in category with relevant technical experience`);
      }

      if (prof.isVerified) {
        trustSignals.push(`Verified Professional (${prof.verificationLevel || 'DOCUMENT_VERIFIED'})`);
      }

      if (prof.ratingAverage > 0) {
        trustSignals.push(`${prof.ratingAverage.toFixed(1)} ★ Rating from ${prof.reviewCount} customer reviews`);
      }

      if (prof.completedJobsCount > 0) {
        trustSignals.push(`Successfully completed ${prof.completedJobsCount} jobs on KAIRO`);
      }

      if (reqLat && reqLng) {
        trustSignals.push(`Located ${distKm.toFixed(1)} km away within your service zone`);
      }

      const user = usersMap.get(prof.userId);

      results.push({
        professionalId: prof.id,
        user: {
          firstName: user?.firstName || 'Artisan',
          lastName: user?.lastName || '',
          avatarUrl: user?.avatarUrl,
          phone: user?.phone,
        },
        displayName: prof.displayName,
        bio: prof.bio,
        ratingAverage: prof.ratingAverage,
        reviewCount: prof.reviewCount,
        completedJobsCount: prof.completedJobsCount,
        isVerified: prof.isVerified,
        verificationLevel: prof.verificationLevel,
        isPro: prof.isPro,
        distanceKm: distKm,
        skillMatchPercentage: Math.round(skillMatchScore * 100),
        compositeScore,
        matchingSkills,
        workSamples: samplesByProf.get(prof.id) || [],
        matchReasons: trustSignals,
      });
    }

    // Sort by highest composite match score
    return results.sort((a, b) => b.compositeScore - a.compositeScore);
  }
}
