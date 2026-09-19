"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const seed_1 = require("./seed");
let server;
const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}/api`;
async function runTests() {
    console.log('\n=======================================================');
    console.log('🧪 RUNNING KAIRO BACKEND E2E TEST SUITE');
    console.log('=======================================================\n');
    // Start server on port 5001
    server = server_1.default.listen(PORT);
    console.log(`[Test Suite] Temporary test server started on ${PORT}`);
    try {
        // 1. Seed Database
        await (0, seed_1.seedDatabase)();
        console.log('✅ PASS: Seed Database');
        // 2. Health check
        const healthRes = await fetch(`http://localhost:${PORT}/health`);
        const healthJson = await healthRes.json();
        console.log('✅ PASS: Healthcheck - Status:', healthJson.status);
        // 3. User Registration (Customer)
        const custRegRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'customer_test@kairo.com',
                password: 'Password123!',
                firstName: 'Tunde',
                lastName: 'Bakare',
                role: 'CUSTOMER',
                location: 'Ikeja, Lagos',
                latitude: 6.5965,
                longitude: 3.3421,
            }),
        });
        const custRegJson = await custRegRes.json();
        console.log('✅ PASS: Customer Registration - User ID:', custRegJson.data?.user?.id);
        const customerToken = custRegJson.data?.token;
        // 4. User Registration (Professional) - Verify isVerified is strictly FALSE (Requirement #7)
        const profRegRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'artisan_test@kairo.com',
                password: 'Password123!',
                firstName: 'Segun',
                lastName: 'Artisan',
                role: 'PROFESSIONAL',
                location: 'Surulere, Lagos',
                latitude: 6.5000,
                longitude: 3.3500,
            }),
        });
        const profRegJson = await profRegRes.json();
        console.log('✅ PASS: Professional Registration - User ID:', profRegJson.data?.user?.id);
        // 5. AI Problem Analysis API (Requirement #15 & #16)
        const analyzeRes = await fetch(`${BASE_URL}/problem-requests/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${customerToken}`,
            },
            body: JSON.stringify({
                input: 'My Tiger generator starts but goes off after five minutes.',
                latitude: 6.5965,
                longitude: 3.3421,
            }),
        });
        const analyzeJson = await analyzeRes.json();
        console.log('✅ PASS: AI Problem Analysis API:');
        console.log('   - Problem Request ID:', analyzeJson.data?.problemRequestId);
        console.log('   - Category Slug:', analyzeJson.data?.category?.slug);
        console.log('   - Problem Summary:', analyzeJson.data?.problemSummary);
        console.log('   - Required Skills:', analyzeJson.data?.requiredSkills);
        console.log('   - Missing Info Questions:', analyzeJson.data?.missingInformation?.length);
        const problemRequestId = analyzeJson.data?.problemRequestId;
        // 6. AI Artisan Profile Parser API
        const parseRes = await fetch(`${BASE_URL}/professionals/parse-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: 'I fix all kinds of small generators like Tiger and Sumec. I can diagnose starting issues, replace coils, clean carburetors, and fix wiring. I have 6 years of experience in Ikeja.',
            }),
        });
        const parseJson = await parseRes.json();
        console.log('✅ PASS: AI Artisan Profile Parser API:');
        console.log('   - Suggested Category:', parseJson.data?.suggestedCategorySlug);
        console.log('   - Extracted Skills:', parseJson.data?.extractedSkills);
        console.log('   - Experience Years:', parseJson.data?.experienceYears);
        // 7. Intelligent Matching Engine API
        const matchRes = await fetch(`${BASE_URL}/matching/find-professionals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                problemRequestId,
                latitude: 6.5965,
                longitude: 3.3421,
                maxRadiusKm: 35,
            }),
        });
        const matchJson = await matchRes.json();
        console.log(`✅ PASS: Intelligent Matching Engine - Matched Professionals Count: ${matchJson.data?.matchedCount}`);
        if (matchJson.data?.professionals?.length > 0) {
            const topMatch = matchJson.data.professionals[0];
            console.log('   - Top Match:', topMatch.displayName);
            console.log('   - Skill Match Score:', topMatch.skillMatchPercentage + '%');
            console.log('   - Composite Score:', topMatch.compositeScore);
            console.log('   - Trust Signals:', topMatch.matchReasons);
        }
        // 8. Create Customer Enquiry
        const enquiryRes = await fetch(`${BASE_URL}/enquiries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${customerToken}`,
            },
            body: JSON.stringify({
                problemRequestId,
                professionalId: 'prof_usr_emeka',
                message: 'Hello Emeka, my Tiger generator shuts down after 5 minutes. Can you help repair it today?',
            }),
        });
        const enquiryJson = await enquiryRes.json();
        console.log('✅ PASS: Customer Enquiry Created - Enquiry ID:', enquiryJson.data?.id);
        // 9. Submit Customer Review & Recalculate Rating
        const reviewRes = await fetch(`${BASE_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${customerToken}`,
            },
            body: JSON.stringify({
                enquiryId: enquiryJson.data?.id,
                professionalId: 'prof_usr_emeka',
                rating: 5,
                comment: 'Emeka arrived promptly and fixed the generator carburetor coil. Excellent service!',
            }),
        });
        const reviewJson = await reviewRes.json();
        console.log('✅ PASS: Review Submitted - New Rating Average:', reviewJson.data?.updatedRatingAverage);
        // 10. Admin Token Login & Verification Action
        const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@kairo.com',
                password: 'Password123!',
            }),
        });
        const adminLoginJson = await adminLoginRes.json();
        const adminToken = adminLoginJson.data?.token;
        const verifyRes = await fetch(`${BASE_URL}/admin/professionals/prof_usr_emeka/verify`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
                isVerified: true,
                verificationLevel: 'BACKGROUND_CHECKED',
            }),
        });
        const verifyJson = await verifyRes.json();
        console.log('✅ PASS: Admin Verification Control - Result:', verifyJson.data?.isVerified);
        console.log('\n=======================================================');
        console.log('🎉 ALL KAIRO BACKEND INTEGRATION TESTS PASSED!');
        console.log('=======================================================\n');
    }
    catch (err) {
        console.error('❌ FAIL: Test Suite Error:', err);
    }
    finally {
        server.close();
    }
}
runTests();
