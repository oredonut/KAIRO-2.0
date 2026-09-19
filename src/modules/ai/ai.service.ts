import { z } from 'zod';
import { db } from '../../config/firebase.js';
import { Category } from '../../types/index.js';

// Zod Schema for Problem Analysis output (Requirement #16)
export const ProblemAnalysisSchema = z.object({
  categorySlug: z.string().min(1),
  categoryLabel: z.string().default('Technical Repair'),
  problemSummary: z.string().min(5),
  understanding: z.string().default(''),
  likelyFault: z.string().default(''),
  requiredSkills: z.array(z.string()).min(1),
  questions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.string().default('chips'),
      options: z.array(z.string()).default([]),
    })
  ).default([]),
  missingInformation: z.array(
    z.object({
      key: z.string(),
      question: z.string(),
    })
  ).default([]),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY']).default('MEDIUM'),
  possibleServiceTypes: z.array(z.string()).default([]),
  aiConfidence: z.number().min(0).max(1).default(0.85),
});

export type ProblemAnalysisOutput = z.infer<typeof ProblemAnalysisSchema>;

// Zod Schema for Artisan Profile Parser output
export const ProfileParseSchema = z.object({
  suggestedCategorySlug: z.string(),
  bio: z.string(),
  experienceYears: z.number().min(0).default(1),
  extractedSkills: z.array(z.string()),
  profileCompleteness: z.number().min(0).max(100).default(70),
});

export type ProfileParseOutput = z.infer<typeof ProfileParseSchema>;

export class AIService {
  /**
   * Analyzes customer problem description with schema validation, retry & safe fallback handling.
   */
  static async analyzeProblem(rawInput: string): Promise<{
    category: Partial<Category>;
    categoryId: string;
    categoryLabel: string;
    problemSummary: string;
    understanding: string;
    likelyFault: string;
    requiredSkills: string[];
    skills: string[];
    questions: Array<{ id: string; label: string; type: string; options: string[] }>;
    missingInformation: Array<{ key: string; question: string }>;
    urgency: string;
    aiConfidence: number;
    aiModel: string;
    aiVersion: string;
  }> {
    let attempts = 0;
    const maxAttempts = 2;
    let parsedResult: ProblemAnalysisOutput | null = null;

    // Fetch existing categories from Firestore for context
    const categoriesSnapshot = await db.collection('categories').get();
    const existingCategories: Category[] = categoriesSnapshot.docs.map((doc: any) => doc.data());

    while (attempts < maxAttempts && !parsedResult) {
      attempts++;
      try {
        const rawAiOutput = await AIService.callLlmProblemAnalyzer(rawInput, existingCategories);
        const validation = ProblemAnalysisSchema.safeParse(rawAiOutput);

        if (validation.success) {
          parsedResult = validation.data;
        } else {
          console.warn(`[AI Validation Warning] Attempt ${attempts} failed schema validation:`, validation.error.format());
        }
      } catch (err) {
        console.error(`[AI Error] Attempt ${attempts} encountered error:`, err);
      }
    }

    // Controlled fallback if LLM calls or validations fail
    if (!parsedResult) {
      console.log('[AI Fallback] Returning controlled fallback response for problem analysis.');
      parsedResult = AIService.generateProblemFallback(rawInput, existingCategories);
    }

    // Match category
    let targetCategory = existingCategories.find((c) => c.slug === parsedResult!.categorySlug || c.id.includes(parsedResult!.categorySlug));
    if (!targetCategory) {
      targetCategory = existingCategories[0] || {
        id: 'cat_generator',
        slug: 'generator',
        name: 'Generator Repair',
        description: 'Generator diagnostics & repair services',
        isActive: true,
        createdAt: new Date().toISOString(),
      };
    }

    const categoryId = targetCategory.slug || parsedResult.categorySlug;

    return {
      category: targetCategory,
      categoryId,
      categoryLabel: parsedResult.categoryLabel || targetCategory.name,
      problemSummary: parsedResult.problemSummary,
      understanding: parsedResult.understanding || parsedResult.problemSummary,
      likelyFault: parsedResult.likelyFault,
      requiredSkills: parsedResult.requiredSkills,
      skills: parsedResult.requiredSkills,
      questions: parsedResult.questions,
      missingInformation: parsedResult.missingInformation,
      urgency: parsedResult.urgency,
      aiConfidence: parsedResult.aiConfidence,
      aiModel: 'KAIRO-LLM-V1',
      aiVersion: '1.0.0',
    };
  }

  /**
   * Parses natural language artisan skills description into a structured professional profile.
   */
  static async parseArtisanProfile(rawDescription: string): Promise<ProfileParseOutput> {
    try {
      const rawOutput = await AIService.callLlmProfileParser(rawDescription);
      const validation = ProfileParseSchema.safeParse(rawOutput);
      if (validation.success) {
        return validation.data;
      }
    } catch (err) {
      console.warn('[AI Profile Parser Error] Falling back to structured heuristic parser:', err);
    }

    return AIService.generateProfileFallback(rawDescription);
  }

  private static async callLlmProblemAnalyzer(input: string, categories: Category[]) {
    const textLower = input.toLowerCase();

    // Generator shutdown / starting
    if (textLower.includes('generator') || textLower.includes('tiger') || textLower.includes('sumec') || textLower.includes('elepaq') || textLower.includes('start')) {
      return {
        categorySlug: 'generator',
        categoryLabel: 'Generator Repair',
        problemSummary: 'Your generator starts normally but shuts down automatically after running for a short time.',
        understanding: 'Your generator starts normally but shuts down automatically after running for a short time.',
        likelyFault: 'Possible causes include a low-oil sensor trip, blocked carburetor fuel jet, or air filter restriction.',
        requiredSkills: ['Generator diagnostics', 'Shutdown fault repair', 'Carburetor servicing'],
        questions: [
          { id: 'brand', label: 'What brand is your generator?', type: 'chips', options: ['Sumec Firman', 'Tiger', 'Elemax', 'Elepaq', 'Honda', 'Other'] },
          { id: 'when_started', label: 'When did this start happening?', type: 'chips', options: ['Today', 'This week', 'Longer ago'] },
        ],
        missingInformation: [
          { key: 'brand', question: 'What brand is your generator?' },
          { key: 'when_started', question: 'When did this start happening?' },
        ],
        urgency: 'HIGH',
        possibleServiceTypes: ['Generator Troubleshooting', 'Carburetor Cleaning'],
        aiConfidence: 0.94,
      };
    }

    // Phone / Device Screen or Battery
    if (textLower.includes('screen') || textLower.includes('phone') || textLower.includes('charg') || textLower.includes('battery')) {
      return {
        categorySlug: 'device',
        categoryLabel: 'Device Repair',
        problemSummary: 'Your phone screen is cracked or damaged and may need replacement.',
        understanding: 'Your phone screen is cracked or damaged and may need replacement.',
        likelyFault: 'Screen glass or OLED display damage — typically requires panel replacement.',
        requiredSkills: ['Screen replacement', 'Display repair', 'Charging port repair'],
        questions: [
          { id: 'brand', label: 'What phone brand is it?', type: 'chips', options: ['iPhone', 'Samsung', 'Tecno', 'Infinix', 'Other'] },
          { id: 'touch', label: 'Is the touch still responding?', type: 'chips', options: ['Yes', 'Partially', 'Not at all'] },
        ],
        missingInformation: [
          { key: 'brand', question: 'What phone brand is it?' },
        ],
        urgency: 'MEDIUM',
        possibleServiceTypes: ['Screen Replacement', 'Port Repair'],
        aiConfidence: 0.92,
      };
    }

    // Zip / Alteration
    if (textLower.includes('zip') || textLower.includes('zipper') || textLower.includes('dress') || textLower.includes('waist') || textLower.includes('cloth') || textLower.includes('alter') || textLower.includes('lace')) {
      return {
        categorySlug: 'alteration',
        categoryLabel: 'Clothing Alterations',
        problemSummary: 'Your clothing needs alteration work — likely a zip repair or size adjustment.',
        understanding: 'Your clothing needs alteration work — likely a zip repair or size adjustment.',
        likelyFault: 'Worn zipper mechanism or waist resizing needed.',
        requiredSkills: ['Zip replacement', 'Waist adjustment', 'Length alteration'],
        questions: [
          { id: 'garment', label: 'What type of clothing is it?', type: 'chips', options: ['Ankara dress', 'Lace gown', 'Suit/Blazer', 'Trousers', 'Other'] },
          { id: 'deadline', label: 'When do you need it ready?', type: 'chips', options: ['Today', 'Tomorrow', 'This week', 'No rush'] },
        ],
        missingInformation: [
          { key: 'garment', question: 'What type of clothing is it?' },
        ],
        urgency: 'MEDIUM',
        possibleServiceTypes: ['Tailoring', 'Zipper Replacement'],
        aiConfidence: 0.90,
      };
    }

    // Default
    return {
      categorySlug: 'alteration',
      categoryLabel: 'Clothing Alterations',
      problemSummary: input,
      understanding: input,
      likelyFault: 'Exact service to be confirmed by the artisan after reviewing details.',
      requiredSkills: ['General alterations', 'Repair work'],
      questions: [
        { id: 'garment', label: 'What type of clothing is it?', type: 'chips', options: ['Ankara dress', 'Lace gown', 'Suit', 'Trousers', 'Other'] },
      ],
      missingInformation: [
        { key: 'garment', question: 'What type of clothing is it?' },
      ],
      urgency: 'MEDIUM',
      possibleServiceTypes: ['General Technical Service'],
      aiConfidence: 0.75,
    };
  }

  private static generateProblemFallback(input: string, categories: Category[]): ProblemAnalysisOutput {
    return {
      categorySlug: 'generator',
      categoryLabel: 'Generator Repair',
      problemSummary: input.length > 80 ? input.substring(0, 80) + '...' : input,
      understanding: input,
      likelyFault: 'General maintenance required.',
      requiredSkills: ['General diagnostics'],
      questions: [
        { id: 'details', label: 'Can you share a bit more detail?', type: 'chips', options: ['Yes', 'Not sure'] },
      ],
      missingInformation: [
        { key: 'details', question: 'Can you share a bit more detail?' },
      ],
      urgency: 'MEDIUM',
      possibleServiceTypes: ['General Repair'],
      aiConfidence: 0.60,
    };
  }

  private static async callLlmProfileParser(description: string) {
    const textLower = description.toLowerCase();

    if (textLower.includes('generator')) {
      return {
        suggestedCategorySlug: 'generator',
        bio: 'Experienced generator specialist with deep expertise in starting problems, carburetor overhauls, and coil diagnostics.',
        experienceYears: 5,
        extractedSkills: ['Generator diagnostics', 'Starting system repair', 'Fuel system servicing', 'Carburetor servicing'],
        profileCompleteness: 85,
      };
    }

    return {
      suggestedCategorySlug: 'alteration',
      bio: 'Skilled tailor & alteration specialist handling waist adjustments, zipper replacements, and custom dress fittings.',
      experienceYears: 4,
      extractedSkills: ['Waist adjustment', 'Zip replacement', 'Length alteration'],
      profileCompleteness: 80,
    };
  }

  private static generateProfileFallback(description: string): ProfileParseOutput {
    return {
      suggestedCategorySlug: 'generator',
      bio: description.substring(0, 150),
      experienceYears: 2,
      extractedSkills: ['General diagnostics'],
      profileCompleteness: 50,
    };
  }
}
