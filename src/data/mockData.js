// ─── Mock Data — KAIRO MVP (4 categories) ────────────────────────────────

export const CATEGORIES = [
  { id: 'generator', label: 'Generator Repair',          icon: 'Zap',      color: '#FEF3C7', textColor: '#92400E' },
  { id: 'device',    label: 'Device Repair',             icon: 'Smartphone',color: '#EFF6FF', textColor: '#1E40AF' },
  { id: 'tailoring', label: 'Tailoring',                 icon: 'Scissors', color: '#FDF4FF', textColor: '#7E22CE' },
  { id: 'alteration',label: 'Clothing Alterations',      icon: 'Shirt',    color: '#FFF7ED', textColor: '#C2410C' },
];

export const ARTISANS = [
  // ── Generator Techs ────────────────────────────────────────────────────
  {
    id: 'art-1',
    name: 'Emeka Generator Repairs',
    ownerName: 'Emeka Okafor',
    category: 'generator',
    categoryLabel: 'Generator Repair Technician',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&h=200&fit=crop&auto=format',
    rating: 4.8,
    reviewCount: 34,
    completedJobs: 47,
    yearsExp: 7,
    workSamplesCount: 18,
    isIdentityVerified: true,
    isPhoneVerified: true,
    location: 'Yaba, Lagos',
    serviceArea: 'Yaba, Surulere, Ebute Metta',
    availability: 'Available today',
    responseTime: '~20 mins',
    bio: 'Seven years repairing generators across Lagos. Specialize in shutdown faults, carburetor issues, and full engine servicing for Sumec, Tiger, and Elemax brands.',
    skills: ['Generator diagnostics', 'Carburetor servicing', 'Shutdown fault repair', 'Engine overhaul', 'Electrical faults'],
    brands: ['Sumec Firman', 'Tiger', 'Elemax', 'Elepaq', 'Honda'],
    services: ['Generator not starting', 'Shutting down problems', 'Unusual noise', 'Routine servicing', 'Smoke issues'],
    matchReasons: {
      generator_shutdown: [
        { label: 'Problem match', detail: 'Specializes in generator startup and shutdown faults — exact match for this problem.' },
        { label: 'Relevant work', detail: '18 work samples, most involving shutdown and fuel system problems.' },
        { label: 'Experience', detail: '7 years repairing generators in Lagos.' },
        { label: 'Location', detail: 'Serves Yaba and surrounding areas.' },
        { label: 'Availability', detail: 'Available today.' },
      ],
      default: [
        { label: 'Category match', detail: 'Certified generator repair technician.' },
        { label: 'Experience', detail: '7 years, 47 completed jobs.' },
        { label: 'Rating', detail: '4.8 from 34 verified reviews.' },
      ]
    },
    subRatings: { quality: 4.9, professionalism: 4.7, communication: 4.8, value: 4.8 },
    workSamples: [
      {
        id: 'ws-1',
        problem: 'Generator would not start after extended period of storage',
        work: 'Fuel system flush, carburetor cleaning, fresh oil and spark plug replacement',
        result: 'Generator restored to full operation',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop&auto=format',
        date: '3 days ago',
      },
      {
        id: 'ws-2',
        problem: 'Generator shutting down 5 minutes after starting',
        work: 'Low-oil sensor replacement, fuel line inspection, carburetor adjustment',
        result: 'Generator running continuously without shutdown',
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop&auto=format',
        date: '1 week ago',
      },
    ],
    reviews: [
      { id: 'r-1', name: 'Chidi N.', rating: 5, date: 'Yesterday', jobType: 'Generator shutdown repair', text: 'Emeka came within the hour. Diagnosed the problem immediately — it was the low oil sensor. Fixed it in 45 minutes. Very professional.' },
      { id: 'r-2', name: 'Mrs. Adeyemi', rating: 5, date: '5 days ago', jobType: 'Generator servicing', text: 'Thorough and explained everything before charging. Will definitely use again.' },
      { id: 'r-3', name: 'Tunde O.', rating: 4, date: '2 weeks ago', jobType: 'Carburetor cleaning', text: 'Good work. Arrived a bit late but got the job done properly.' },
    ],
  },
  {
    id: 'art-2',
    name: 'Bashir Power Services',
    ownerName: 'Bashir Abubakar',
    category: 'generator',
    categoryLabel: 'Generator Repair Technician',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format',
    rating: 4.5,
    reviewCount: 21,
    completedJobs: 29,
    yearsExp: 4,
    workSamplesCount: 11,
    isIdentityVerified: true,
    isPhoneVerified: true,
    location: 'Surulere, Lagos',
    serviceArea: 'Surulere, Yaba, Mushin',
    availability: 'Available tomorrow',
    responseTime: '~1 hour',
    bio: 'Four years of generator repair experience. Handle most common brands and fault types. Available for same-day and scheduled servicing.',
    skills: ['Generator diagnostics', 'Electrical faults', 'Engine servicing', 'AVR replacement'],
    brands: ['Sumec Firman', 'Elepaq', 'Haier Thermocool'],
    services: ['Generator not starting', 'Shutting down', 'Routine servicing'],
    matchReasons: {
      generator_shutdown: [
        { label: 'Problem match', detail: 'Has repaired generator shutdown faults across multiple brands.' },
        { label: 'Location', detail: 'Serves Surulere — adjacent to Yaba.' },
        { label: 'Experience', detail: '4 years of generator repair.' },
      ],
      default: [
        { label: 'Category match', detail: 'Generator repair technician.' },
        { label: 'Experience', detail: '4 years, 29 completed jobs.' },
      ]
    },
    subRatings: { quality: 4.5, professionalism: 4.4, communication: 4.5, value: 4.7 },
    workSamples: [
      { id: 'ws-3', problem: 'Generator making unusual knocking noise', work: 'Piston and connecting rod inspection, replaced worn components', result: 'Noise eliminated, generator running smoothly', image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&h=400&fit=crop&auto=format', date: '2 weeks ago' },
    ],
    reviews: [
      { id: 'r-4', name: 'Amara S.', rating: 5, date: '3 days ago', jobType: 'Generator repair', text: 'Very affordable and got the job done same day.' },
      { id: 'r-5', name: 'Ibrahim K.', rating: 4, date: '10 days ago', jobType: 'Engine noise', text: 'Solid work. Communicates well throughout.' },
    ],
  },

  // ── Device Techs ────────────────────────────────────────────────────────
  {
    id: 'art-3',
    name: 'TechDoctor Tunde',
    ownerName: 'Tunde Bakare',
    category: 'device',
    categoryLabel: 'Device Repair Technician',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format',
    rating: 4.9,
    reviewCount: 51,
    completedJobs: 89,
    yearsExp: 6,
    workSamplesCount: 31,
    isIdentityVerified: true,
    isPhoneVerified: true,
    location: 'Computer Village, Ikeja',
    serviceArea: 'Ikeja, Maryland, Agege',
    availability: 'Available today',
    responseTime: '< 10 mins',
    bio: 'Six years repairing phones and laptops at Computer Village. Use only OEM-quality parts. Specialize in iPhone, Samsung, and HP laptops.',
    skills: ['Screen replacement', 'Charging port soldering', 'Battery replacement', 'Motherboard repair', 'Water damage recovery'],
    brands: ['Apple iPhone', 'Samsung Galaxy', 'Tecno', 'Infinix', 'HP', 'Dell'],
    services: ['Phone not charging', 'Broken screen', 'Battery problems', 'Laptop problems', 'Speaker fault', 'Camera repair'],
    matchReasons: {
      device_screen: [
        { label: 'Problem match', detail: 'Specializes in screen replacement and charging port repair — exact match.' },
        { label: 'Parts quality', detail: 'Uses OEM-quality parts with 90-day warranty.' },
        { label: 'Speed', detail: 'Most repairs completed same day, often within 1–2 hours.' },
        { label: 'Location', detail: 'Based at Computer Village, Ikeja.' },
        { label: 'Availability', detail: 'Available today with quick response.' },
      ],
      default: [
        { label: 'Category match', detail: 'Certified device repair technician.' },
        { label: 'Experience', detail: '6 years, 89 completed jobs.' },
        { label: 'Rating', detail: '4.9 from 51 verified reviews.' },
      ]
    },
    subRatings: { quality: 5.0, professionalism: 4.8, communication: 4.9, value: 4.8 },
    workSamples: [
      { id: 'ws-4', problem: 'iPhone 13 screen shattered after fall', work: 'Original OLED display replacement, tested face ID and touch response', result: 'Fully functional screen restored', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop&auto=format', date: '2 days ago' },
      { id: 'ws-5', problem: 'Samsung Galaxy charging intermittently', work: 'USB-C port IC replacement via micro-soldering', result: 'Charging works perfectly', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&auto=format', date: '1 week ago' },
    ],
    reviews: [
      { id: 'r-6', name: 'Kalu E.', rating: 5, date: '3 days ago', jobType: 'iPhone screen replacement', text: 'Replaced my screen while I waited. 45 minutes. Touch ID works perfectly. Tunde is the real deal.' },
      { id: 'r-7', name: 'Funmi A.', rating: 5, date: '1 week ago', jobType: 'Charging port repair', text: 'Fixed the charging issue I\'d had for 3 months. Very transparent about what the problem was.' },
    ],
  },

  // ── Tailors ─────────────────────────────────────────────────────────────
  {
    id: 'art-4',
    name: 'Fatimah Couture',
    ownerName: 'Fatimah Bello',
    category: 'tailoring',
    categoryLabel: 'Tailor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&auto=format',
    rating: 4.9,
    reviewCount: 42,
    completedJobs: 68,
    yearsExp: 9,
    workSamplesCount: 24,
    isIdentityVerified: true,
    isPhoneVerified: true,
    location: 'Yaba, Lagos',
    serviceArea: 'Yaba, Surulere, Ebute Metta',
    availability: 'Available today',
    responseTime: '< 15 mins',
    bio: 'Nine years of bespoke tailoring. Specialize in Ankara and lace custom garments, bridal outfits, and emergency alterations. Same-day service available.',
    skills: ['Custom dress making', 'Ankara designs', 'Lace gown fitting', 'Bridal wear', 'Corporate attire'],
    brands: ['Native wears', 'Lace & Aso-ebi', 'Corporate suits'],
    services: ['Custom dress making', 'Dress repairs', 'Clothing alterations', 'Bridal outfit fitting'],
    matchReasons: {
      default: [{ label: 'Category match', detail: 'Expert tailor with 9 years of experience.' }]
    },
    subRatings: { quality: 5.0, professionalism: 4.9, communication: 4.9, value: 4.8 },
    workSamples: [
      { id: 'ws-6', problem: 'Custom Ankara ballgown needed for graduation', work: 'Full pattern cut, hand-sewn embellishments, 3 fittings', result: 'Perfect-fitting gown delivered 2 days early', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop&auto=format', date: '5 days ago' },
    ],
    reviews: [
      { id: 'r-8', name: 'Blessing O.', rating: 5, date: '6 days ago', jobType: 'Custom Ankara gown', text: 'I cried when I wore it. Exactly what I described, but better. Fatimah is a genius.' },
    ],
  },

  // ── Alteration Specialists ───────────────────────────────────────────────
  {
    id: 'art-5',
    name: 'Ada Alterations Studio',
    ownerName: 'Ada Nwosu',
    category: 'alteration',
    categoryLabel: 'Clothing Alteration Specialist',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format',
    rating: 4.7,
    reviewCount: 38,
    completedJobs: 55,
    yearsExp: 6,
    workSamplesCount: 19,
    isIdentityVerified: true,
    isPhoneVerified: true,
    location: 'Surulere, Lagos',
    serviceArea: 'Surulere, Yaba, Iponri',
    availability: 'Available today',
    responseTime: '~30 mins',
    bio: 'Six years of clothing alteration work. Handle all types of adjustments — waist, hem, zip replacement, resizing. Fast turnaround, often same day.',
    skills: ['Waist adjustment', 'Zip replacement', 'Length alteration', 'Resizing', 'Invisible zip fitting'],
    brands: ['Ankara', 'Lace', 'Corporate', 'Casual wear'],
    services: ['Waist adjustment', 'Zip replacement', 'Length adjustment', 'General alterations'],
    matchReasons: {
      alteration_zip: [
        { label: 'Problem match', detail: 'Expert in invisible zip replacement — exact match for this problem.' },
        { label: 'Speed', detail: 'Same-day alterations available.' },
        { label: 'Location', detail: 'Serves Surulere and Yaba.' },
      ],
      default: [{ label: 'Category match', detail: 'Alteration specialist with 6 years experience.' }]
    },
    subRatings: { quality: 4.8, professionalism: 4.7, communication: 4.6, value: 4.8 },
    workSamples: [
      { id: 'ws-7', problem: 'Ankara dress too wide at waist, zip stuck', work: 'Waist taken in by 3 inches, old zip removed and replaced with metal invisible zip', result: 'Perfect fit, clean finish', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop&auto=format', date: '3 days ago' },
    ],
    reviews: [
      { id: 'r-9', name: 'Ngozi C.', rating: 5, date: '4 days ago', jobType: 'Waist alteration & zip', text: 'Fixed my dress the same day. She\'s fast, precise, and reasonable. Highly recommend.' },
    ],
  },
];

// ─── Scalable Natural Language AI Problem Interpreter & Artisan Matcher ─────
export function generateAIDiagnosis(text) {
  const rawText = (text || '').trim();
  const t = rawText.toLowerCase();

  // 1. Dynamic Category & Artisan Requirement Classification
  let categoryId = 'general';
  let categoryLabel = 'General Repair & Services';
  let requiredArtisan = 'Local Service Specialist';
  let understanding = `You described a service issue: "${rawText}".`;
  let likelyFault = 'KAIRO has analyzed your request and identified qualified local professionals.';

  if (t.match(/cloth|dress|wear|tear|sew|tailor|waist|pocket|sleeve|alter|zip|zipper|ankara|lace|outfit|pant|trousers|suit|skirt|hem|button/)) {
    categoryId = 'alteration';
    categoryLabel = 'Clothing Repair & Alterations';
    requiredArtisan = 'Tailor & Clothing Alteration Specialist';
    if (t.includes('tear') || t.includes('pocket') || t.includes('sleeve')) {
      understanding = 'Your request involves clothing repair (such as tears, seam fixing, or pocket repairs) and size adjustment.';
      likelyFault = 'Requires fabric restitching, seam reinforcement, or custom tailoring adjustments.';
    } else if (t.includes('waist') || t.includes('alter') || t.includes('fit') || t.includes('size')) {
      understanding = 'Your garment needs resizing, waist adjustment, or length alteration for a better fit.';
      likelyFault = 'Requires measurement check, waist taking in/out, or hem trimming.';
    } else if (t.includes('zip') || t.includes('zipper')) {
      understanding = 'Your garment has a broken, stuck, or worn zipper mechanism.';
      likelyFault = 'Requires zipper slider replacement or installing a new invisible metal zip.';
    } else {
      understanding = 'Your clothing requires custom tailoring, fitting adjustments, or garment repair.';
      likelyFault = 'Specialist tailoring work required for proper garment finish.';
    }
  } else if (t.match(/laptop|screen|phone|iphone|samsung|display|crack|battery|charg|tecno|infinix|motherboard|device|computer|macbook|ipad|touch/)) {
    categoryId = 'device';
    categoryLabel = 'Device & Phone Repair';
    requiredArtisan = 'Device & Phone Repair Specialist';
    if (t.includes('screen') || t.includes('crack') || t.includes('display') || t.includes('glass')) {
      understanding = 'Your device display screen is cracked or malfunctioning and requires panel repair or replacement.';
      likelyFault = 'OLED display or glass damage requiring original replacement assembly.';
    } else if (t.includes('charg') || t.includes('battery') || t.includes('power')) {
      understanding = 'Your device is having charging difficulties, battery drain, or power power issues.';
      likelyFault = 'Faulty charging IC, loose USB/Lightning port, or degraded battery cell.';
    } else {
      understanding = 'Your electronic device needs hardware diagnostics and component repair.';
      likelyFault = 'Requires precision micro-soldering or hardware component replacement.';
    }
  } else if (t.match(/generator|gen|carburetor|firman|elepaq|tiger|starting|shutdown|go off|stops|light|power|engine|sumec|elemax|oil/)) {
    categoryId = 'generator';
    categoryLabel = 'Generator Repair & Servicing';
    requiredArtisan = 'Generator Repair Technician';
    if (t.includes('off') || t.includes('shut') || t.includes('stop') || t.includes('cut')) {
      understanding = 'Your generator starts normally but shuts down automatically after running for a few minutes.';
      likelyFault = 'Possible low-oil sensor trip, clogged carburetor fuel jet, or overheating protection.';
    } else if (t.includes('start') || t.includes('dead') || t.includes('won\'t start')) {
      understanding = 'Your generator is failing to start or turning over without firing.';
      likelyFault = 'Flooded carburetor, fouled spark plug, weak battery, or ignition coil fault.';
    } else {
      understanding = 'Your generator needs routine engine servicing or mechanical fault repair.';
      likelyFault = 'Carburetor cleaning, oil change, and general engine tuning required.';
    }
  } else if (t.match(/plumb|pipe|sink|leak|water|tap|toilet|pump|drain|sewage|block/)) {
    categoryId = 'plumbing';
    categoryLabel = 'Plumbing & Pipe Repair';
    requiredArtisan = 'Plumber & Pipe Specialist';
    understanding = 'You have a plumbing issue involving water leaks, pipe drainage, or fixture repair.';
    likelyFault = 'Worn pipe joint seal, valve damage, or drainage line obstruction.';
  } else if (t.match(/electric|wiring|solar|inverter|breaker|socket|circuit|light|conduit|db board/)) {
    categoryId = 'electrical';
    categoryLabel = 'Electrical & Solar Installation';
    requiredArtisan = 'Electrician & Solar Technician';
    understanding = 'Your request involves electrical wiring, power distribution, or solar inverter systems.';
    likelyFault = 'Tripped circuit breaker, loose wiring connection, or inverter system fault.';
  }

  // 2. Dynamic Artisan Matching Algorithm (Rank registered artisans by relevance to user text)
  const queryWords = t.split(/\W+/).filter(w => w.length > 2);
  
  const matchedArtisansWithScores = ARTISANS.map(artisan => {
    let score = 0;

    // Category match
    if (artisan.category === categoryId) score += 50;

    // Search keywords in artisan bio, skills, brands, services, work samples
    const artisanText = [
      artisan.name,
      artisan.categoryLabel,
      artisan.bio,
      ...(artisan.skills || []),
      ...(artisan.brands || []),
      ...(artisan.services || []),
      ...(artisan.workSamples ? artisan.workSamples.map(w => `${w.problem} ${w.work} ${w.result}`) : [])
    ].join(' ').toLowerCase();

    queryWords.forEach(word => {
      if (artisanText.includes(word)) score += 10;
    });

    return { id: artisan.id, score };
  });

  // Sort by score descending
  matchedArtisansWithScores.sort((a, b) => b.score - a.score);
  
  // Pick top matched artisans (or fallback to default category artisans if all 0)
  let matchedIds = matchedArtisansWithScores.filter(a => a.score > 0).map(a => a.id);
  if (matchedIds.length === 0) {
    matchedIds = ARTISANS.filter(a => a.category === categoryId).map(a => a.id);
  }
  if (matchedIds.length === 0) {
    matchedIds = ['art-4', 'art-5', 'art-3', 'art-1']; // Fallback general list
  }

  return {
    originalText: rawText,
    categoryId,
    categoryLabel,
    requiredArtisan,
    understanding,
    likelyFault,
    matchedArtisans: matchedIds,
  };
}

export function getArtisanById(id) {
  return ARTISANS.find(a => a.id === id);
}

export function getArtisansByIds(ids) {
  return ids.map(id => getArtisanById(id)).filter(Boolean);
}
