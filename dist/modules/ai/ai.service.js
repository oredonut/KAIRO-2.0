"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = exports.ProfileParseSchema = exports.ProblemAnalysisSchema = void 0;
const zod_1 = require("zod");
const firebase_js_1 = require("../../config/firebase.js");
// Zod Schema for Problem Analysis output (Requirement #16)
exports.ProblemAnalysisSchema = zod_1.z.object({
    categorySlug: zod_1.z.string().min(1),
    problemSummary: zod_1.z.string().min(5),
    requiredSkills: zod_1.z.array(zod_1.z.string()).min(1),
    missingInformation: zod_1.z.array(zod_1.z.object({
        key: zod_1.z.string(),
        question: zod_1.z.string(),
    })),
    urgency: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY']).default('MEDIUM'),
    possibleServiceTypes: zod_1.z.array(zod_1.z.string()).default([]),
    aiConfidence: zod_1.z.number().min(0).max(1).default(0.85),
});
// Zod Schema for Artisan Profile Parser output
exports.ProfileParseSchema = zod_1.z.object({
    suggestedCategorySlug: zod_1.z.string(),
    bio: zod_1.z.string(),
    experienceYears: zod_1.z.number().min(0).default(1),
    extractedSkills: zod_1.z.array(zod_1.z.string()),
    profileCompleteness: zod_1.z.number().min(0).max(100).default(70),
});
class AIService {
    /**
     * Analyzes customer problem description with schema validation, retry & safe fallback handling.
     */
    static async analyzeProblem(rawInput) {
        let attempts = 0;
        const maxAttempts = 2;
        let parsedResult = null;
        // Fetch existing categories and skills from Firestore database for context
        const categoriesSnapshot = await firebase_js_1.db.collection('categories').get();
        const existingCategories = categoriesSnapshot.docs.map((doc) => doc.data());
        while (attempts < maxAttempts && !parsedResult) {
            attempts++;
            try {
                const rawAiOutput = await AIService.callLlmProblemAnalyzer(rawInput, existingCategories);
                const validation = exports.ProblemAnalysisSchema.safeParse(rawAiOutput);
                if (validation.success) {
                    parsedResult = validation.data;
                }
                else {
                    console.warn(`[AI Validation Warning] Attempt ${attempts} failed schema validation:`, validation.error.format());
                }
            }
            catch (err) {
                console.error(`[AI Error] Attempt ${attempts} encountered error:`, err);
            }
        }
        // Controlled fallback if LLM calls or validations fail (Requirement #16)
        if (!parsedResult) {
            console.log('[AI Fallback] Returning controlled fallback response for problem analysis.');
            parsedResult = AIService.generateProblemFallback(rawInput, existingCategories);
        }
        // Match or create category object from parsed slug
        let targetCategory = existingCategories.find((c) => c.slug === parsedResult.categorySlug);
        if (!targetCategory) {
            targetCategory = existingCategories[0] || {
                id: 'cat_generator_repair',
                slug: 'generator_repair',
                name: 'Generator Repair',
                description: 'Generator diagnostics & repair services',
                isActive: true,
                createdAt: new Date().toISOString(),
            };
        }
        return {
            category: targetCategory,
            problemSummary: parsedResult.problemSummary,
            requiredSkills: parsedResult.requiredSkills,
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
    static async parseArtisanProfile(rawDescription) {
        try {
            const rawOutput = await AIService.callLlmProfileParser(rawDescription);
            const validation = exports.ProfileParseSchema.safeParse(rawOutput);
            if (validation.success) {
                return validation.data;
            }
        }
        catch (err) {
            console.warn('[AI Profile Parser Error] Falling back to structured heuristic parser:', err);
        }
        // Fallback heuristic profile parser
        return AIService.generateProfileFallback(rawDescription);
    }
    static async callLlmProblemAnalyzer(input, categories) {
        const textLower = input.toLowerCase();
        // Context aware heuristic simulator / LLM provider wrapper
        if (textLower.includes('generator') || textLower.includes('tiger') || textLower.includes('sumec') || textLower.includes('start')) {
            return {
                categorySlug: 'generator_repair',
                problemSummary: 'Generator starts but shuts down after several minutes.',
                requiredSkills: ['generator_diagnostics', 'generator_starting_problems'],
                missingInformation: [
                    { key: 'generator_model', question: 'What is the model of your generator?' },
                    { key: 'fuel_type', question: 'Is it petrol or diesel powered?' },
                ],
                urgency: 'HIGH',
                possibleServiceTypes: ['Generator Troubleshooting', 'Carburetor Cleaning'],
                aiConfidence: 0.94,
            };
        }
        if (textLower.includes('cloth') || textLower.includes('dress') || textLower.includes('zip') || textLower.includes('alter')) {
            return {
                categorySlug: 'clothing_alteration',
                problemSummary: 'Garment adjustment or zipper repair required.',
                requiredSkills: ['waist_alteration', 'zip_replacement'],
                missingInformation: [
                    { key: 'garment_type', question: 'What type of clothing item requires alteration?' },
                ],
                urgency: 'MEDIUM',
                possibleServiceTypes: ['Tailoring', 'Zipper Replacement'],
                aiConfidence: 0.90,
            };
        }
        if (textLower.includes('phone') || textLower.includes('screen') || textLower.includes('battery') || textLower.includes('charging')) {
            return {
                categorySlug: 'device_repair',
                problemSummary: 'Mobile device screen or hardware component issue.',
                requiredSkills: ['screen_replacement', 'charging_port_repair'],
                missingInformation: [
                    { key: 'device_brand', question: 'What is the brand and model of your device?' },
                ],
                urgency: 'MEDIUM',
                possibleServiceTypes: ['Screen Repair', 'Port Diagnostics'],
                aiConfidence: 0.92,
            };
        }
        // Default structured LLM response template
        return {
            categorySlug: categories[0]?.slug || 'generator_repair',
            problemSummary: input,
            requiredSkills: ['general_diagnostics'],
            missingInformation: [
                { key: 'additional_details', question: 'Can you provide more details about the issue?' },
            ],
            urgency: 'MEDIUM',
            possibleServiceTypes: ['General Repair'],
            aiConfidence: 0.75,
        };
    }
    static generateProblemFallback(input, categories) {
        return {
            categorySlug: categories[0]?.slug || 'generator_repair',
            problemSummary: input.length > 80 ? input.substring(0, 80) + '...' : input,
            requiredSkills: ['general_diagnostics'],
            missingInformation: [
                { key: 'problem_details', question: 'Could you share a bit more detail on what happens when the issue occurs?' },
            ],
            urgency: 'MEDIUM',
            possibleServiceTypes: ['General Technical Service'],
            aiConfidence: 0.60,
        };
    }
    static async callLlmProfileParser(description) {
        const textLower = description.toLowerCase();
        if (textLower.includes('generator')) {
            return {
                suggestedCategorySlug: 'generator_repair',
                bio: 'Experienced generator specialist with deep expertise in starting problems, carburetor overhauls, and coil diagnostics.',
                experienceYears: 5,
                extractedSkills: ['generator_diagnostics', 'generator_starting_problems', 'fuel_system_repair', 'electrical_faults'],
                profileCompleteness: 85,
            };
        }
        if (textLower.includes('tailor') || textLower.includes('cloth') || textLower.includes('sew')) {
            return {
                suggestedCategorySlug: 'tailor',
                bio: 'Skilled fashion tailor specializing in custom garment fitting, dress adjustments, and premium zipper replacements.',
                experienceYears: 4,
                extractedSkills: ['waist_alteration', 'zip_replacement', 'dress_adjustment'],
                profileCompleteness: 80,
            };
        }
        return {
            suggestedCategorySlug: 'device_repair',
            bio: 'Professional electronics technician specializing in smartphone screen replacements, charging port repairs, and battery diagnostics.',
            experienceYears: 3,
            extractedSkills: ['screen_replacement', 'battery_replacement', 'charging_port_repair'],
            profileCompleteness: 75,
        };
    }
    static generateProfileFallback(description) {
        return {
            suggestedCategorySlug: 'generator_repair',
            bio: description.substring(0, 150),
            experienceYears: 2,
            extractedSkills: ['general_diagnostics'],
            profileCompleteness: 50,
        };
    }
}
exports.AIService = AIService;
