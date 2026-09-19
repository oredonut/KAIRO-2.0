import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin, Clock, Camera, Edit2, Upload, AlertCircle, FileText, Plus, X, Phone, KeyRound, Sparkles } from 'lucide-react';
import KairoIcon, { KairoLogo } from '../../components/KairoIcon';

// Dynamic AI Parsing Helper for Artisan Bio Raw Input (Section 8)
const parseBioText = (raw) => {
  const text = raw.toLowerCase();

  // 1. Identify Category & Label dynamically from user input keywords
  let category = 'general';
  let categoryLabel = 'Skilled Trade Specialist';

  if (text.match(/gen|generator|carburetor|firman|elepaq|tiger|starting issue|shutdown|sumec/)) {
    category = 'generator';
    categoryLabel = 'Generator Repair Technician';
  } else if (text.match(/phone|iphone|samsung|screen|battery|charging|tecno|infinix|laptop|macbook|computer|ipad|device/)) {
    category = 'device_repair';
    categoryLabel = 'Device & Phone Repair Specialist';
  } else if (text.match(/electric|wiring|solar|inverter|circuit|breaker|socket|light|conduit|db board/)) {
    category = 'electrical';
    categoryLabel = 'Electrical & Solar Specialist';
  } else if (text.match(/plumb|pipe|water|leak|tap|sink|toilet|pump|drain|sewage/)) {
    category = 'plumbing';
    categoryLabel = 'Plumbing & Water System Specialist';
  } else if (text.match(/tailor|sew|cloth|dress|fashion|ankara|lace|suit|alteration|zipper|measurement/)) {
    category = 'tailoring';
    categoryLabel = 'Fashion Designer & Tailor';
  } else if (text.match(/mechanic|car|auto|brake|transmission|vehicle|motor|engine|suspension|radiator/)) {
    category = 'mechanic';
    categoryLabel = 'Auto Repair & Mechanic Specialist';
  } else if (text.match(/fridge|refrigerator|freezer|washing machine|microwave|oven|appliance|tv/)) {
    category = 'appliance';
    categoryLabel = 'Home Appliance Technician';
  } else if (text.match(/carpenter|wood|furniture|cabinet|door|lock|chair|table|roofing/)) {
    category = 'carpentry';
    categoryLabel = 'Carpentry & Furniture Specialist';
  } else if (text.match(/paint|wall|pop|screed|decor/)) {
    category = 'painting';
    categoryLabel = 'Painting & Decorating Specialist';
  }

  // 2. Extract Stated Experience (Years) dynamically using Regex & word number lookup
  let yearsExp = '5'; // reasonable fallback if unstated
  const numberWords = {
    'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
    'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
    'fifteen': '15', 'twenty': '20'
  };

  const yearMatch = text.match(/(?:(\d+)|(one|two|three|four|five|six|seven|eight|nine|ten|fifteen|twenty))\s*(?:\+|\s*plus)?\s*(?:years?|yrs?|yr)/i);
  if (yearMatch) {
    if (yearMatch[1]) {
      yearsExp = yearMatch[1];
    } else if (yearMatch[2] && numberWords[yearMatch[2].toLowerCase()]) {
      yearsExp = numberWords[yearMatch[2].toLowerCase()];
    }
  } else {
    const digitMatch = text.match(/(\d+)\s*\+/);
    if (digitMatch) {
      yearsExp = digitMatch[1];
    }
  }

  // 3. Extract Brands Mentioned dynamically
  const knownBrands = [
    // Generator
    'Honda', 'Sumec Firman', 'Sumec', 'Firman', 'Tiger', 'Elepaq', 'Elemax', 'Lister', 'Perkins', 'Mikano',
    // Devices
    'Apple', 'iPhone', 'Samsung', 'Tecno', 'Infinix', 'HP', 'Dell', 'Lenovo', 'iPad', 'MacBook', 'Xiaomi', 'Oppo', 'Itel',
    // Electrical / Solar
    'Schneider', 'Felicity', 'Luminous', 'Must', 'Prag',
    // Tailoring
    'Ankara', 'Lace', 'Cashmere', 'Singer', 'Butterfly',
    // Appliance / Auto
    'Haier Thermocool', 'Thermocool', 'LG', 'Panasonic', 'Hisense', 'Toyota', 'Mercedes', 'Nissan', 'Hyundai'
  ];

  const extractedBrands = [];
  knownBrands.forEach(brand => {
    if (text.includes(brand.toLowerCase())) {
      if (brand === 'Sumec' || brand === 'Firman') {
        if (!extractedBrands.includes('Sumec Firman')) extractedBrands.push('Sumec Firman');
      } else if (!extractedBrands.includes(brand)) {
        extractedBrands.push(brand);
      }
    }
  });

  // 4. Extract Dynamic Skills directly from input text & patterns
  const extractedSkills = [];

  const skillKeywords = [
    { pattern: /servicing|service/, label: 'Servicing & maintenance' },
    { pattern: /starting issue|starting problem|hard to start|wont start/, label: 'Starting fault resolution' },
    { pattern: /shutdown|goes off|cutting off/, label: 'Shutdown & power loss repair' },
    { pattern: /carburetor|fuel system/, label: 'Carburetor & fuel system tuning' },
    { pattern: /screen|cracked display|lcd/, label: 'Screen & display replacement' },
    { pattern: /battery|charging port|not charging/, label: 'Battery & power diagnostics' },
    { pattern: /water damage|board repair|motherboard|soldering/, label: 'Logic board & soldering repair' },
    { pattern: /wiring|conduit|db box|short circuit/, label: 'Electrical wiring & DB installation' },
    { pattern: /solar|inverter|battery bank/, label: 'Solar & inverter setup' },
    { pattern: /leak|pipe blockage|water pump|toilet/, label: 'Pipe leak & blockage repair' },
    { pattern: /alteration|fitting|sewing|measurement/, label: 'Custom fitting & alterations' },
    { pattern: /engine|brake|transmission|oil change/, label: 'Engine & mechanical diagnostics' },
    { pattern: /fridge|gas refill|cooling issue/, label: 'Compressor & gas refilling' },
    { pattern: /cabinet|door lock|furniture assembly/, label: 'Custom woodworking & lock installation' },
    { pattern: /pop|screeding|wall paint/, label: 'Wall screeding & painting finish' }
  ];

  skillKeywords.forEach(sk => {
    if (sk.pattern.test(text) && !extractedSkills.includes(sk.label)) {
      extractedSkills.push(sk.label);
    }
  });

  // Extract explicit lists if separated by commas in user's typed bio
  const sentences = raw.split(/[\n.;]/);
  sentences.forEach(s => {
    if (s.includes(',')) {
      const parts = s.split(',');
      parts.forEach(p => {
        const cleaned = p.trim().replace(/^(and|i do|i handle|also|like|i fix|specializing in)\s+/i, '');
        if (cleaned.length >= 4 && cleaned.length <= 36) {
          const formatted = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
          if (extractedSkills.length < 6 && !extractedSkills.some(es => es.toLowerCase() === formatted.toLowerCase())) {
            extractedSkills.push(formatted);
          }
        }
      });
    }
  });

  if (extractedSkills.length === 0) {
    extractedSkills.push(`${categoryLabel} Services`, 'General Fault Troubleshooting', 'Preventative Maintenance');
  }

  // 5. Construct personalized dynamic AI summary
  const brandMention = extractedBrands.length > 0 ? ` with specialization in ${extractedBrands.join(', ')}` : '';
  const skillMention = extractedSkills.length > 0 ? ` Expert in ${extractedSkills.slice(0, 3).join(', ')}.` : '';
  const aiSummary = `Skilled ${categoryLabel} with ${yearsExp} years of experience in local diagnostics, repair, and customer support${brandMention}.${skillMention}`;

  return {
    category,
    categoryLabel,
    yearsExp,
    skills: extractedSkills,
    brands: extractedBrands,
    aiSummary
  };
};

export default function ArtisanOnboarding({ initialData, onCompleteOnboarding }) {
  const [step, setStep] = useState(1); // 1 to 6

  // Form Data starts user-editable (Section 7 requirement!)
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    businessName: initialData?.businessName || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    location: initialData?.location || '',
    serviceArea: initialData?.serviceArea || '',
    category: 'general',
    categoryLabel: 'Skilled Trade Specialist',
    yearsExp: '5',
    bioRaw: '', // STARTS EMPTY with PLACEHOLDER text! (Section 8 requirement)
    skills: [],
    brands: [],
    availability: 'Available today',
    workSamples: [],
    smsCode: '',
    phoneVerified: false,
    idDocumentUploaded: false,
    idDocType: 'NIN'
  });

  const [customSkillInput, setCustomSkillInput] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [customBrandInput, setCustomBrandInput] = useState('');
  const [showAddBrand, setShowAddBrand] = useState(false);

  // New Work Sample form state (Section 10)
  const [newSample, setNewSample] = useState({
    problem: '',
    work: '',
    result: '',
    image: null
  });

  const [aiStructured, setAiStructured] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isEditingSummary, setIsEditingSummary] = useState(false);

  // Handle AI Structuring of Artisan's Own Input (Dynamic Extraction based on user input text)
  const handleRunAIStructure = () => {
    const raw = formData.bioRaw.trim();
    if (!raw) return;

    // KAIRO AI dynamically parses the user's exact input text
    const parsed = parseBioText(raw);

    setFormData(prev => ({
      ...prev,
      category: parsed.category,
      categoryLabel: parsed.categoryLabel,
      yearsExp: parsed.yearsExp,
      skills: parsed.skills,
      brands: parsed.brands
    }));

    setAiSummary(parsed.aiSummary);
    setAiStructured(true);
    setIsEditingSummary(false);
  };

  const handleAddCustomSkill = () => {
    if (customSkillInput.trim() && !formData.skills.includes(customSkillInput.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, customSkillInput.trim()] }));
      setCustomSkillInput('');
      setShowAddSkill(false);
    }
  };

  const handleRemoveSkill = (sk) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== sk) }));
  };

  const handleAddCustomBrand = () => {
    if (customBrandInput.trim() && !formData.brands.includes(customBrandInput.trim())) {
      setFormData(prev => ({ ...prev, brands: [...prev.brands, customBrandInput.trim()] }));
      setCustomBrandInput('');
      setShowAddBrand(false);
    }
  };

  const handleRemoveBrand = (b) => {
    setFormData(prev => ({ ...prev, brands: prev.brands.filter(brand => brand !== b) }));
  };

  const handleSaveWorkSample = () => {
    if (!newSample.problem.trim()) return;
    const sampleItem = {
      id: 'ws-' + Date.now(),
      problem: newSample.problem.trim(),
      work: newSample.work.trim() || 'Servicing & repair performed',
      result: newSample.result.trim() || 'Restored to full operation',
      image: newSample.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&fit=crop'
    };
    setFormData(prev => ({ ...prev, workSamples: [...prev.workSamples, sampleItem] }));
    setNewSample({ problem: '', work: '', result: '', image: null });
  };

  // Dynamic Profile Strength Calculation (Section 14)
  const calculateProfileStrength = () => {
    let score = 20; // Account created
    if (formData.location.trim()) score += 15;
    if (formData.bioRaw.trim()) score += 20;
    if (formData.skills.length > 0) score += 15;
    if (formData.workSamples.length > 0) score += 15;
    if (formData.phoneVerified) score += 10;
    if (formData.idDocumentUploaded) score += 5;
    return Math.min(score, 100);
  };

  // Dynamic Trust Score Calculation (Section 12)
  const calculateTrustScore = () => {
    let trust = 30; // Base score
    if (formData.phoneVerified) trust += 20;
    if (formData.idDocumentUploaded) trust += 25;
    if (formData.workSamples.length > 0) trust += 15 * Math.min(formData.workSamples.length, 3);
    return Math.min(trust, 100);
  };

  const totalSteps = 6;
  const currentStrength = calculateProfileStrength();
  const currentTrust = calculateTrustScore();

  return (
    <div style={{ background: 'var(--warm-cream)', minHeight: '100vh', padding: '40px 24px 80px' }}>
      <div className="page-wrapper animate-fade-in" style={{ maxWidth: 880 }}>
        
        {/* Top Header Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <KairoLogo size={32} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--deep-evergreen)' }}>
              Step {step} of {totalSteps}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  style={{
                    width: i === step ? 24 : 8,
                    height: 8,
                    borderRadius: 100,
                    background: i <= step ? 'var(--kairo-green)' : 'var(--border-color)',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── STEP 1: PERSONAL & LOCATION DETAILS ─────────────────────────────────── */}
        {step === 1 && (
          <div className="card card-lg animate-slide-up" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>STEP 1: IDENTITY & LOCATION</span>
            <h2 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>
              Create your informal trade CV & identity
            </h2>
            <p className="supporting-text" style={{ marginBottom: 28 }}>
              KAIRO creates an evidence-based digital profile showcasing your skills to local customers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
              <div>
                <label className="label">Full Name</label>
                <input
                  className="input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Business Name (Optional)</label>
                <input
                  className="input"
                  placeholder="e.g. Emeka Generator Repairs"
                  value={formData.businessName}
                  onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Phone Number</label>
                <input
                  className="input"
                  placeholder="e.g. 0803 123 4567"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Primary Location (Area / City)</label>
                <input
                  className="input"
                  placeholder="e.g. Yaba, Lagos"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label className="label">Service Area (Neighborhoods where you accept jobs)</label>
              <input
                className="input"
                placeholder="e.g. Yaba, Surulere, Ebute Metta"
                value={formData.serviceArea}
                onChange={e => setFormData({ ...formData, serviceArea: e.target.value })}
              />
              <div className="small-metadata" style={{ marginTop: 6 }}>
                Note: We request service areas rather than home addresses to protect your privacy.
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.name.trim() || !formData.location.trim()}
              className="btn btn-primary btn-lg btn-block"
            >
              Continue to AI Profile Builder
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* ── STEP 2: AI ARTISAN PROFILE BUILDER (Section 8) ──────────────────────── */}
        {step === 2 && (
          <div className="card card-lg animate-slide-up" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>STEP 2: AI PROFILE BUILDER</span>
            <h2 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>
              Describe your trade in your own words
            </h2>
            <p className="supporting-text" style={{ marginBottom: 24 }}>
              Tell KAIRO about the work you do, the problems you solve, and the kind of customers you usually help. KAIRO AI will dynamically extract your trade skills, brands, experience, and category.
            </p>

            <div style={{ marginBottom: 24 }}>
              <label className="label">Describe Your Trade & Work</label>
              <textarea
                className="input"
                rows={5}
                // STARTS EMPTY WITH PLACEHOLDER TEXT! (Section 8 requirement)
                placeholder="Tell KAIRO about the work you do, the problems you solve, and the kind of customers you usually help. (e.g. I have been repairing phones and laptops for 6 years. I handle iPhone screen replacement, Samsung battery replacement, and motherboard soldering...)"
                value={formData.bioRaw}
                onChange={e => {
                  setFormData({ ...formData, bioRaw: e.target.value });
                  if (aiStructured) setAiStructured(false); // reset structured preview when user edits bio text
                }}
              />
            </div>

            {!aiStructured ? (
              <button
                onClick={handleRunAIStructure}
                disabled={!formData.bioRaw.trim()}
                className="btn btn-gold btn-lg btn-block"
                style={{ marginBottom: 20 }}
              >
                <Sparkles size={18} /> Structure My Profile with KAIRO AI
              </button>
            ) : (
              <div className="ai-surface animate-fade-in" style={{ marginBottom: 24, padding: 22, border: '1.5px solid var(--warm-gold)', borderRadius: 16, background: 'var(--gold-bg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span className="badge badge-gold">
                    <Sparkles size={13} /> KAIRO AI Extracted Profile · Based on your input text
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingSummary(!isEditingSummary)}
                    style={{ background: 'none', border: 'none', color: 'var(--deep-evergreen)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Edit2 size={13} /> {isEditingSummary ? 'Done Editing' : 'Edit Summary'}
                  </button>
                </div>

                {/* Professional Summary */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Extracted Professional Summary
                  </div>
                  {isEditingSummary ? (
                    <textarea
                      className="input"
                      rows={3}
                      style={{ marginTop: 6, fontSize: '14px' }}
                      value={aiSummary}
                      onChange={e => setAiSummary(e.target.value)}
                    />
                  ) : (
                    <div style={{ fontSize: '15px', color: 'var(--main-text)', fontStyle: 'italic', marginTop: 6, lineHeight: '1.5', background: 'var(--white)', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border-color)' }}>
                      "{aiSummary}"
                    </div>
                  )}
                </div>

                {/* Dynamic Category & Experience Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <div style={{ background: 'var(--white)', padding: 12, borderRadius: 10, border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>Extracted Category</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-evergreen)', marginTop: 2 }}>{formData.categoryLabel}</div>
                  </div>

                  <div style={{ background: 'var(--white)', padding: 12, borderRadius: 10, border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>Extracted Experience</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-evergreen)', marginTop: 2 }}>{formData.yearsExp} Years</div>
                  </div>
                </div>

                {/* Extracted Skills & Brands Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 6 }}>
                      Extracted Trade Skills ({formData.skills.length})
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {formData.skills.map(sk => (
                        <span key={sk} className="badge badge-green" style={{ fontSize: '12.5px' }}>✓ {sk}</span>
                      ))}
                    </div>
                  </div>

                  {formData.brands.length > 0 && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 6 }}>
                        Extracted Brands Mentioned ({formData.brands.length})
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {formData.brands.map(b => (
                          <span key={b} className="badge badge-gold" style={{ fontSize: '12.5px' }}>{b}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--secondary-text)', marginTop: 14 }}>
                  💡 KAIRO AI extracted these details directly from your text. You can add more or refine them in Step 3.
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(1)} className="btn btn-ghost">Back</button>
              <button onClick={() => setStep(3)} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                Confirm & Continue to Skills
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: SKILLS AND BRAND SPECIALIZATION (Section 9) ──────────────────── */}
        {step === 3 && (
          <div className="card card-lg animate-slide-up" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>STEP 3: SKILLS & BRANDS</span>
            <h2 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>
              Refine your skills and brand specialisation
            </h2>
            <p className="supporting-text" style={{ marginBottom: 24 }}>
              Select suggested skills or add your own custom skills and brand handled. KAIRO assists you — you decide your digital identity.
            </p>

            {/* Editable Skills Tags */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label className="label" style={{ margin: 0 }}>Trade Skill Tags</label>
                <button
                  type="button"
                  onClick={() => setShowAddSkill(!showAddSkill)}
                  style={{ background: 'none', border: 'none', color: 'var(--kairo-green)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Plus size={15} /> Add skill
                </button>
              </div>

              {showAddSkill && (
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <input
                    className="input"
                    placeholder="Enter custom skill (e.g. Inverter troubleshooting)"
                    value={customSkillInput}
                    onChange={e => setCustomSkillInput(e.target.value)}
                  />
                  <button type="button" onClick={handleAddCustomSkill} className="btn btn-primary btn-sm">Add</button>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {formData.skills.length === 0 ? (
                  <div style={{ fontSize: '13.5px', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
                    No skills tags added yet. Click "+ Add skill" above or return to Step 2 to generate skills with KAIRO AI.
                  </div>
                ) : (
                  formData.skills.map((sk) => (
                    <span key={sk} className="badge badge-green" style={{ fontSize: '14px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>✓ {sk}</span>
                      <button type="button" onClick={() => handleRemoveSkill(sk)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)' }}>
                        <X size={13} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Editable Brand Tags */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label className="label" style={{ margin: 0 }}>Brands Handled</label>
                <button
                  type="button"
                  onClick={() => setShowAddBrand(!showAddBrand)}
                  style={{ background: 'none', border: 'none', color: 'var(--kairo-green)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Plus size={15} /> Add brand
                </button>
              </div>

              {showAddBrand && (
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <input
                    className="input"
                    placeholder="Enter brand name (e.g. Haier Thermocool)"
                    value={customBrandInput}
                    onChange={e => setCustomBrandInput(e.target.value)}
                  />
                  <button type="button" onClick={handleAddCustomBrand} className="btn btn-primary btn-sm">Add</button>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {formData.brands.length === 0 ? (
                  <div style={{ fontSize: '13.5px', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
                    No specific brand tags added yet. Click "+ Add brand" above to add brands you specialize in.
                  </div>
                ) : (
                  formData.brands.map((b) => (
                    <span key={b} className="badge badge-gold" style={{ fontSize: '14px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{b}</span>
                      <button type="button" onClick={() => handleRemoveBrand(b)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)' }}>
                        <X size={13} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(2)} className="btn btn-ghost">Back</button>
              <button onClick={() => setStep(4)} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                Continue to Work Evidence
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: WORK EXPERIENCE & PROOF OF WORK (Section 10 & 11) ───────────── */}
        {step === 4 && (
          <div className="card card-lg animate-slide-up" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>STEP 4: PROOF OF WORK EVIDENCE</span>
            <h2 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>
              Add your own work evidence samples
            </h2>
            <p className="supporting-text" style={{ marginBottom: 24 }}>
              Upload real photos of past work and describe the problem, work performed, and final result.
            </p>

            {/* List of uploaded work samples */}
            {formData.workSamples.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                {formData.workSamples.map(sample => (
                  <div key={sample.id} style={{ background: 'var(--warm-cream)', border: '1px solid var(--border-color)', borderRadius: 14, padding: 18, display: 'flex', gap: 16, alignItems: 'center' }}>
                    <img src={sample.image} alt="Sample" style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--main-text)' }}>"{sample.problem}"</div>
                      <div style={{ fontSize: '13.5px', color: 'var(--secondary-text)' }}>{sample.work}</div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--kairo-green)' }}>Result: {sample.result}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form to add a new work sample */}
            <div style={{ background: 'var(--mint-mist)', border: '1.5px solid var(--soft-sage)', borderRadius: 16, padding: 20, marginBottom: 28 }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-evergreen)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Camera size={18} /> Add New Work Sample
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label className="label">What was the problem?</label>
                  <input
                    className="input"
                    placeholder="e.g. Generator starting but shutting down after 5 minutes"
                    value={newSample.problem}
                    onChange={e => setNewSample({ ...newSample, problem: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">What work did you perform?</label>
                  <input
                    className="input"
                    placeholder="e.g. Carburetor servicing, fuel system flush, low oil sensor check"
                    value={newSample.work}
                    onChange={e => setNewSample({ ...newSample, work: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">What was the outcome / result?</label>
                  <input
                    className="input"
                    placeholder="e.g. Generator running smoothly without shutting off"
                    value={newSample.result}
                    onChange={e => setNewSample({ ...newSample, result: e.target.value })}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveWorkSample}
                  disabled={!newSample.problem.trim()}
                  className="btn btn-outline btn-sm"
                  style={{ alignSelf: 'flex-start' }}
                >
                  Save Sample to Profile
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(3)} className="btn btn-ghost">Back</button>
              <button onClick={() => setStep(5)} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                Continue to Verification
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: INTERACTIVE VERIFICATION (Section 13) ────────────────────────── */}
        {step === 5 && (
          <div className="card card-lg animate-slide-up" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>STEP 5: INTERACTIVE VERIFICATION</span>
            <h2 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>
              KAIRO Evidence-Based Verification
            </h2>
            <p className="supporting-text" style={{ marginBottom: 24 }}>
              Verify your phone number via SMS code and upload an identity document. KAIRO clearly distinguishes <strong>Uploaded</strong> from <strong>Verified</strong>.
            </p>

            {/* Interactive Phone SMS Verification */}
            <div style={{ background: 'var(--warm-cream)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Phone size={20} color="var(--deep-evergreen)" />
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--main-text)' }}>SMS Phone Verification</div>
                    <div style={{ fontSize: '13.5px', color: 'var(--secondary-text)' }}>Number: {formData.phone || '0803 123 4567'}</div>
                  </div>
                </div>

                {formData.phoneVerified ? (
                  <span className="badge badge-green">✓ Verified</span>
                ) : (
                  <span className="badge badge-gold">Pending Code</span>
                )}
              </div>

              {!formData.phoneVerified && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <KeyRound size={16} color="var(--secondary-text)" style={{ position: 'absolute', left: 12, top: 14 }} />
                    <input
                      className="input"
                      placeholder="Enter 6-digit SMS Code [ 8 4 9 2 0 1 ]"
                      style={{ paddingLeft: 38, letterSpacing: '0.1em' }}
                      value={formData.smsCode}
                      onChange={e => setFormData({ ...formData, smsCode: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, phoneVerified: true })}
                    className="btn btn-primary btn-sm"
                  >
                    Verify Code
                  </button>
                </div>
              )}
            </div>

            {/* Government ID Document Upload */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 20, marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={20} color="var(--deep-evergreen)" />
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--main-text)' }}>Government Identity Document</div>
                    <div style={{ fontSize: '13.5px', color: 'var(--secondary-text)' }}>Select NIN, Driver's Licence, or Voter's Card</div>
                  </div>
                </div>

                {formData.idDocumentUploaded ? (
                  <span className="badge badge-muted">Uploaded (Awaiting Admin Review)</span>
                ) : (
                  <span className="badge badge-muted">Not Uploaded</span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
                <select
                  className="input"
                  style={{ width: 180 }}
                  value={formData.idDocType}
                  onChange={e => setFormData({ ...formData, idDocType: e.target.value })}
                >
                  <option value="NIN">NIN Slip</option>
                  <option value="Driver Licence">Driver's Licence</option>
                  <option value="Voter Card">Voter's Card</option>
                </select>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, idDocumentUploaded: true })}
                  className="btn btn-outline btn-sm"
                >
                  <Upload size={14} /> {formData.idDocumentUploaded ? 'Document Uploaded' : 'Upload Document'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(4)} className="btn btn-ghost">Back</button>
              <button onClick={() => setStep(6)} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                Preview Profile & Complete
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 6: DYNAMIC PROFILE STRENGTH & TRUST SCORE (Section 12 & 14) ─────── */}
        {step === 6 && (
          <div className="card card-lg animate-scale-in" style={{ boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <span className="badge badge-gold" style={{ marginBottom: 8 }}>PROFILE READY</span>
              <h2 className="hero-heading" style={{ color: 'var(--deep-evergreen)', fontSize: '32px', marginBottom: 8 }}>
                Your KAIRO Trade Profile is Ready
              </h2>
              <p className="supporting-text" style={{ fontSize: '16px' }}>
                Your informal professional CV is now configured and ready for customer discovery in {formData.location || 'your area'}.
              </p>
            </div>

            {/* Dynamic Profile Strength & Trust Score Display */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 28 }}>
              
              {/* Dynamic Profile Strength Meter (Section 14) */}
              <div className="card" style={{ background: 'var(--warm-cream)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>
                  Profile Strength (Completeness)
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--deep-evergreen)', margin: '6px 0' }}>
                  {currentStrength}%
                </div>
                <div style={{ height: 8, background: 'var(--border-color)', borderRadius: 100, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ width: `${currentStrength}%`, height: '100%', background: 'var(--kairo-green)', borderRadius: 100, transition: 'width 0.4s' }} />
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--secondary-text)' }}>
                  Calculated dynamically from completed onboarding fields.
                </div>
              </div>

              {/* Dynamic Trust Score (Section 12) */}
              <div className="card" style={{ background: 'var(--mint-mist)', border: '1.5px solid var(--soft-sage)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-evergreen)', textTransform: 'uppercase' }}>
                  KAIRO Trust Score (Evidence Based)
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--deep-evergreen)', margin: '6px 0' }}>
                  {currentTrust} / 100
                </div>
                <div style={{ fontSize: '13px', color: 'var(--main-text)', fontWeight: 600 }}>
                  Contributors: Phone SMS ({formData.phoneVerified ? '✓' : 'Pending'}), Work Evidence ({formData.workSamples.length} samples), ID Document ({formData.idDocumentUploaded ? 'Uploaded' : 'Pending'}).
                </div>
              </div>

            </div>

            <button
              onClick={() => onCompleteOnboarding({
                ...formData,
                profileStrength: currentStrength,
                trustScore: currentTrust
              })}
              className="btn btn-primary btn-lg btn-block"
              style={{ padding: '16px', fontSize: '18px' }}
            >
              Publish Profile & Enter Artisan Workspace
              <ArrowRight size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
