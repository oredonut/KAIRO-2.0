"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const firebase_1 = require("./config/firebase");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function seedDatabase() {
    console.log('[Seed] Populating initial categories, skills, sample artisans, and work portfolios into Firestore...');
    // 1. Categories matching frontend slugs
    const categories = [
        {
            id: 'cat_generator',
            slug: 'generator',
            name: 'Generator Repair',
            description: 'Diagnosis, troubleshooting, and repair for petrol and diesel power generators.',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            id: 'cat_alteration',
            slug: 'alteration',
            name: 'Clothing Alterations',
            description: 'Garment resizing, waist adjustments, zipper replacements, and hem repairs.',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            id: 'cat_device',
            slug: 'device',
            name: 'Device Repair',
            description: 'Smartphone, tablet, and electronics screen, battery, and charging port repairs.',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            id: 'cat_plumbing',
            slug: 'plumbing',
            name: 'Plumbing & Pipe Repair',
            description: 'Water leak detection, pipe replacement, drain unclogging, and pump maintenance.',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            id: 'cat_electrical',
            slug: 'electrical',
            name: 'Electrical & Solar Installation',
            description: 'House wiring, circuit breaker troubleshooting, solar inverter installation, and lighting.',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
    ];
    for (const cat of categories) {
        await firebase_1.db.collection('categories').doc(cat.id).set(cat);
    }
    // 2. Skills
    const skills = [
        { id: 'sk_gen_diag', name: 'Generator diagnostics', slug: 'generator_diagnostics', categoryId: 'cat_generator' },
        { id: 'sk_gen_shut', name: 'Shutdown fault repair', slug: 'generator_shutdown', categoryId: 'cat_generator' },
        { id: 'sk_fuel_sys', name: 'Carburetor servicing', slug: 'carburetor_servicing', categoryId: 'cat_generator' },
        { id: 'sk_waist_alt', name: 'Waist adjustment', slug: 'waist_adjustment', categoryId: 'cat_alteration' },
        { id: 'sk_zip_rep', name: 'Zip replacement', slug: 'zip_replacement', categoryId: 'cat_alteration' },
        { id: 'sk_screen_rep', name: 'Screen replacement', slug: 'screen_replacement', categoryId: 'cat_device' },
        { id: 'sk_port_rep', name: 'Charging port repair', slug: 'charging_port_repair', categoryId: 'cat_device' },
        { id: 'sk_leak_rep', name: 'Pipe leak repair', slug: 'pipe_leak_repair', categoryId: 'cat_plumbing' },
        { id: 'sk_solar_inst', name: 'Solar inverter installation', slug: 'solar_inverter_installation', categoryId: 'cat_electrical' },
    ];
    for (const sk of skills) {
        await firebase_1.db.collection('skills').doc(sk.id).set(sk);
    }
    const passHash = await bcryptjs_1.default.hash('Password123!', 10);
    // 3. Admin User
    const adminUser = {
        id: 'usr_admin',
        email: 'admin@kairo.com',
        passwordHash: passHash,
        firstName: 'KAIRO',
        lastName: 'Admin',
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await firebase_1.db.collection('users').doc(adminUser.id).set(adminUser);
    // 4. Sample Professional 1: Emeka Generator Works (matching art-1 in frontend mockData)
    const profUser1 = {
        id: 'usr_emeka',
        email: 'emeka@generators.com',
        passwordHash: passHash,
        firstName: 'Emeka',
        lastName: 'Okonkwo',
        phone: '+2348012345678',
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&auto=format',
        role: 'PROFESSIONAL',
        location: 'Ikeja, Lagos',
        latitude: 6.5965,
        longitude: 3.3421,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await firebase_1.db.collection('users').doc(profUser1.id).set(profUser1);
    const profProfile1 = {
        id: 'art-1',
        userId: 'usr_emeka',
        categoryId: 'generator',
        displayName: 'Emeka Generator Works',
        bio: 'Ten years fixing Sumec Firman, Tiger, and Elepaq generators in Ikeja. Specialised in sudden shutdown, starting failure, and carburetor jet overhauls.',
        experienceYears: 10,
        skills: ['Generator diagnostics', 'Shutdown fault repair', 'Carburetor servicing', 'Coil replacement', 'Oil sensor bypass'],
        services: ['Generator Troubleshooting', 'Coil Replacement', 'Carburetor Jet Servicing'],
        brands: ['Sumec Firman', 'Tiger', 'Elepaq', 'Elemax', 'Honda'],
        location: 'Ikeja, Lagos',
        latitude: 6.5965,
        longitude: 3.3421,
        serviceRadiusKm: 30,
        availabilityStatus: 'AVAILABLE',
        profileCompleteness: 95,
        isPublished: true,
        isVerified: true,
        verificationLevel: 'DOCUMENT_VERIFIED',
        isPro: true,
        ratingAverage: 4.9,
        reviewCount: 47,
        completedJobsCount: 82,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await firebase_1.db.collection('professional_profiles').doc(profProfile1.id).set(profProfile1);
    // Work sample for Emeka
    const sample1 = {
        id: 'ws-1',
        professionalId: 'art-1',
        title: 'Sumec Firman 3.5KVA Shutdown Repair',
        categoryId: 'generator',
        problemDescription: 'Generator starts normally then cuts off after 3-5 minutes of running',
        workDescription: 'Cleaned clogged carburetor jet, flushed dirty fuel tank, replaced oil alert sensor',
        resultDescription: 'Runs continuously for 6+ hours under full load without shutting down',
        imageUrls: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop&auto=format'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await firebase_1.db.collection('work_samples').doc(sample1.id).set(sample1);
    // 5. Sample Professional 2: Ada Alterations Studio (matching art-5 in frontend mockData)
    const profUser2 = {
        id: 'usr_ada',
        email: 'ada@alterations.com',
        passwordHash: passHash,
        firstName: 'Ada',
        lastName: 'Nwosu',
        phone: '+2348098765432',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format',
        role: 'PROFESSIONAL',
        location: 'Surulere, Lagos',
        latitude: 6.5000,
        longitude: 3.3500,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await firebase_1.db.collection('users').doc(profUser2.id).set(profUser2);
    const profProfile2 = {
        id: 'art-5',
        userId: 'usr_ada',
        categoryId: 'alteration',
        displayName: 'Ada Alterations Studio',
        bio: 'Six years of clothing alteration work. Handle all types of adjustments — waist, hem, zip replacement, resizing. Fast turnaround, often same day.',
        experienceYears: 6,
        skills: ['Waist adjustment', 'Zip replacement', 'Length alteration', 'Resizing', 'Invisible zip fitting'],
        services: ['Waist adjustment', 'Zip replacement', 'Length adjustment', 'General alterations'],
        brands: ['Ankara', 'Lace', 'Corporate', 'Casual wear'],
        location: 'Surulere, Lagos',
        latitude: 6.5000,
        longitude: 3.3500,
        serviceRadiusKm: 25,
        availabilityStatus: 'AVAILABLE',
        profileCompleteness: 90,
        isPublished: true,
        isVerified: true,
        verificationLevel: 'BASIC',
        isPro: false,
        ratingAverage: 4.7,
        reviewCount: 38,
        completedJobsCount: 55,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await firebase_1.db.collection('professional_profiles').doc(profProfile2.id).set(profProfile2);
    // 6. Sample Professional 3: Ojo Plumbing & Pipe Services
    const profUser3 = {
        id: 'usr_ojo',
        email: 'ojo@plumbing.com',
        passwordHash: passHash,
        firstName: 'Ojo',
        lastName: 'Adeleke',
        phone: '+2348033334444',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format',
        role: 'PROFESSIONAL',
        location: 'Lekki, Lagos',
        latitude: 6.4698,
        longitude: 3.5852,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await firebase_1.db.collection('users').doc(profUser3.id).set(profUser3);
    const profProfile3 = {
        id: 'art-6',
        userId: 'usr_ojo',
        categoryId: 'plumbing',
        displayName: 'Ojo Plumbing & Pipe Services',
        bio: 'Expert plumber with 8 years of experience fixing leaks, unclogging drains, and installing water pump systems across Lekki & Victoria Island.',
        experienceYears: 8,
        skills: ['Pipe leak repair', 'Drain unclogging', 'Water pump installation', 'Tap replacement', 'Bathroom fitting'],
        services: ['Leak Repair', 'Drainage Unclogging', 'Water Pump Servicing'],
        brands: ['PPR', 'PVC', 'Standard Plumbing Fixtures'],
        location: 'Lekki, Lagos',
        latitude: 6.4698,
        longitude: 3.5852,
        serviceRadiusKm: 30,
        availabilityStatus: 'AVAILABLE',
        profileCompleteness: 92,
        isPublished: true,
        isVerified: true,
        verificationLevel: 'DOCUMENT_VERIFIED',
        isPro: true,
        ratingAverage: 4.8,
        reviewCount: 29,
        completedJobsCount: 64,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await firebase_1.db.collection('professional_profiles').doc(profProfile3.id).set(profProfile3);
    // 7. Sample Professional 4: Kazeem Electrical & Solar Works
    const profUser4 = {
        id: 'usr_kazeem',
        email: 'kazeem@electrical.com',
        passwordHash: passHash,
        firstName: 'Kazeem',
        lastName: 'Bello',
        phone: '+2348022225555',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format',
        role: 'PROFESSIONAL',
        location: 'Yaba, Lagos',
        latitude: 6.5181,
        longitude: 3.3831,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await firebase_1.db.collection('users').doc(profUser4.id).set(profUser4);
    const profProfile4 = {
        id: 'art-7',
        userId: 'usr_kazeem',
        categoryId: 'electrical',
        displayName: 'Kazeem Electrical & Solar Works',
        bio: 'Certified electrician specializing in household wiring, DB box troubleshooting, and solar inverter installations in Yaba and Surulere.',
        experienceYears: 9,
        skills: ['Solar inverter installation', 'Conduit wiring', 'Circuit breaker repair', 'Short circuit tracing', 'Light fixture fitting'],
        services: ['Solar Inverter Setup', 'House Conduit Wiring', 'Circuit Breaker Repair'],
        brands: ['Schneider', 'Felicity Solar', 'Luminous', 'Must Solar'],
        location: 'Yaba, Lagos',
        latitude: 6.5181,
        longitude: 3.3831,
        serviceRadiusKm: 25,
        availabilityStatus: 'AVAILABLE',
        profileCompleteness: 95,
        isPublished: true,
        isVerified: true,
        verificationLevel: 'DOCUMENT_VERIFIED',
        isPro: true,
        ratingAverage: 4.9,
        reviewCount: 41,
        completedJobsCount: 78,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await firebase_1.db.collection('professional_profiles').doc(profProfile4.id).set(profProfile4);
    console.log('[Seed] Database successfully populated with frontend-aligned categories, skills, and mock professionals.');
}
if (process.argv[1]?.includes('seed')) {
    seedDatabase().catch(console.error);
}
