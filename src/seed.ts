import { db } from './config/firebase.js';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  console.log('[Seed] Populating initial categories, skills, sample artisans, and work portfolios into Firestore...');

  // 1. Categories
  const categories = [
    {
      id: 'cat_generator_repair',
      slug: 'generator_repair',
      name: 'Generator Repair',
      description: 'Diagnosis, troubleshooting, and repair for petrol and diesel power generators.',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cat_clothing_alteration',
      slug: 'clothing_alteration',
      name: 'Clothing Alteration',
      description: 'Garment resizing, waist adjustments, zipper replacements, and hem repairs.',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cat_device_repair',
      slug: 'device_repair',
      name: 'Device Repair',
      description: 'Smartphone, tablet, and electronics screen, battery, and charging port repairs.',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cat_tailor',
      slug: 'tailor',
      name: 'Tailor & Fashion Design',
      description: 'Bespoke suit making, native attire tailoring, and custom dress design.',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const cat of categories) {
    await db.collection('categories').doc(cat.id).set(cat);
  }

  // 2. Skills
  const skills = [
    { id: 'sk_gen_diag', name: 'Generator Diagnostics', slug: 'generator_diagnostics', categoryId: 'cat_generator_repair' },
    { id: 'sk_gen_start', name: 'Starting Problems', slug: 'generator_starting_problems', categoryId: 'cat_generator_repair' },
    { id: 'sk_fuel_sys', name: 'Fuel System Repair', slug: 'fuel_system_repair', categoryId: 'cat_generator_repair' },
    { id: 'sk_elec_fault', name: 'Electrical Faults', slug: 'electrical_faults', categoryId: 'cat_generator_repair' },
    { id: 'sk_waist_alt', name: 'Waist Alteration', slug: 'waist_alteration', categoryId: 'cat_clothing_alteration' },
    { id: 'sk_zip_rep', name: 'Zip Replacement', slug: 'zip_replacement', categoryId: 'cat_clothing_alteration' },
    { id: 'sk_dress_adj', name: 'Dress Adjustment', slug: 'dress_adjustment', categoryId: 'cat_clothing_alteration' },
    { id: 'sk_screen_rep', name: 'Screen Replacement', slug: 'screen_replacement', categoryId: 'cat_device_repair' },
    { id: 'sk_battery_rep', name: 'Battery Replacement', slug: 'battery_replacement', categoryId: 'cat_device_repair' },
    { id: 'sk_port_rep', name: 'Charging Port Repair', slug: 'charging_port_repair', categoryId: 'cat_device_repair' },
  ];

  for (const sk of skills) {
    await db.collection('skills').doc(sk.id).set(sk);
  }

  const passHash = await bcrypt.hash('Password123!', 10);

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
  await db.collection('users').doc(adminUser.id).set(adminUser);

  // 4. Sample Professional 1: Generator Master (Emeka)
  const profUser1 = {
    id: 'usr_emeka',
    email: 'emeka@generators.com',
    passwordHash: passHash,
    firstName: 'Emeka',
    lastName: 'Okonkwo',
    phone: '+2348012345678',
    role: 'PROFESSIONAL',
    location: 'Ikeja, Lagos',
    latitude: 6.5965,
    longitude: 3.3421,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.collection('users').doc(profUser1.id).set(profUser1);

  const profProfile1 = {
    id: 'prof_usr_emeka',
    userId: 'usr_emeka',
    categoryId: 'cat_generator_repair',
    displayName: 'Emeka Generator Works',
    bio: '10 years of master level experience in Tiger, Sumec Firman, and Elepaq generator repairs. Specialist in starting failure and carburetor cleaning.',
    experienceYears: 10,
    skills: ['generator_diagnostics', 'generator_starting_problems', 'fuel_system_repair'],
    services: ['Generator Troubleshooting', 'Coil Replacement'],
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
    reviewCount: 14,
    completedJobsCount: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.collection('professional_profiles').doc(profProfile1.id).set(profProfile1);

  // Work sample for Emeka
  const sample1 = {
    id: 'ws_emeka_1',
    professionalId: 'prof_usr_emeka',
    title: 'Sumec Firman 3.5KVA Starter Coil Repair',
    categoryId: 'cat_generator_repair',
    problemDescription: 'Generator turned on but died after 2 minutes due to faulty coil overheating.',
    workDescription: 'Replaced copper coil winding, cleaned carburetor jet, and recalibrated oil sensor.',
    resultDescription: 'Generator now runs continuously for 8+ hours without power drop.',
    imageUrls: ['https://kairo-media-uploads.s3.amazonaws.com/samples/generator_repair_1.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.collection('work_samples').doc(sample1.id).set(sample1);

  // 5. Sample Professional 2: Bisi Tailoring
  const profUser2 = {
    id: 'usr_bisi',
    email: 'bisi@tailors.com',
    passwordHash: passHash,
    firstName: 'Bisi',
    lastName: 'Adeleke',
    phone: '+2348098765432',
    role: 'PROFESSIONAL',
    location: 'Victoria Island, Lagos',
    latitude: 6.4281,
    longitude: 3.4219,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.collection('users').doc(profUser2.id).set(profUser2);

  const profProfile2 = {
    id: 'prof_usr_bisi',
    userId: 'usr_bisi',
    categoryId: 'cat_clothing_alteration',
    displayName: 'Bisi Stitches & Alterations',
    bio: 'Expert tailor specializing in designer dress resizing, suit slimming, zipper replacements, and delicate fabric adjustments.',
    experienceYears: 6,
    skills: ['waist_alteration', 'zip_replacement', 'dress_adjustment'],
    services: ['Dress Fitting', 'Suit Alteration'],
    location: 'Victoria Island, Lagos',
    latitude: 6.4281,
    longitude: 3.4219,
    serviceRadiusKm: 20,
    availabilityStatus: 'AVAILABLE',
    profileCompleteness: 90,
    isPublished: true,
    isVerified: true,
    verificationLevel: 'BASIC',
    isPro: false,
    ratingAverage: 4.7,
    reviewCount: 9,
    completedJobsCount: 11,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.collection('professional_profiles').doc(profProfile2.id).set(profProfile2);

  console.log('[Seed] Database successfully populated with initial categories, skills, and sample professionals.');
}

if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase().catch(console.error);
}
