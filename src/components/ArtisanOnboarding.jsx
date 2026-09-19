import React, { useState } from 'react';
import { Bot, Sparkles, Mic, CheckCircle2, ArrowRight, Upload, Briefcase, Award, ShieldCheck } from 'lucide-react';

export default function ArtisanOnboarding({ onProfileCreated }) {
  const [rawBio, setRawBio] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [generatedProfile, setGeneratedProfile] = useState(null);

  // Form editing state after AI generation
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Generator Repair');
  const [yearsExp, setYearsExp] = useState(6);
  const [location, setLocation] = useState('Ikeja, Lagos');
  const [skills, setSkills] = useState([]);
  const [brands, setBrands] = useState([]);

  // Voice recording simulation for artisan
  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const simulatedArtisanText = "I've repaired phones for 6 years in Computer Village Ikeja. I work on iPhones and Samsung. I change screens, replace batteries, and solder broken charging ports.";
      let idx = 0;
      const interval = setInterval(() => {
        if (idx <= simulatedArtisanText.length) {
          setRawBio(simulatedArtisanText.slice(0, idx));
          idx++;
        } else {
          clearInterval(interval);
          setIsRecording(false);
        }
      }, 30);
    }
  };

  const handleRunAIProfileBuilder = (e) => {
    e.preventDefault();
    if (!rawBio.trim()) return;

    setIsAIProcessing(true);

    setTimeout(() => {
      setIsAIProcessing(false);
      
      const lower = rawBio.toLowerCase();
      let detectedCategory = 'Generator Repair';
      let detectedSkills = ['Diagnostics', 'Maintenance'];
      let detectedBrands = ['Generic'];

      if (lower.includes('phone') || lower.includes('iphone') || lower.includes('screen') || lower.includes('samsung')) {
        detectedCategory = 'Device & Phone Repair Technician';
        detectedSkills = ['Screen Replacement', 'Battery Swap', 'Charging Port Soldering', 'Water Damage Recovery'];
        detectedBrands = ['Apple iPhone', 'Samsung Galaxy', 'Tecno', 'Infinix'];
      } else if (lower.includes('dress') || lower.includes('tailor') || lower.includes('zip') || lower.includes('waist') || lower.includes('sew')) {
        detectedCategory = 'Tailoring & Alterations Specialist';
        detectedSkills = ['Garment Alteration', 'Invisible Zip Fitting', 'Waist Sizing', 'Native Outfit Styling'];
        detectedBrands = ['Ankara', 'Lace', 'Corporate Suits'];
      } else {
        detectedCategory = 'Generator Repair & Maintenance Tech';
        detectedSkills = ['Engine Diagnostics', 'Automatic Shutdown Fix', 'Carburetor Cleaning', 'Low-Oil Sensor Replacement'];
        detectedBrands = ['Sumec Firman', 'Elepaq', 'Tiger', 'Lutian'];
      }

      setName('Tunde Repair Hub');
      setCategory(detectedCategory);
      setYearsExp(6);
      setSkills(detectedSkills);
      setBrands(detectedBrands);

      setGeneratedProfile({
        category: detectedCategory,
        skills: detectedSkills,
        brands: detectedBrands,
        bio: `Professional ${detectedCategory} with 6 years experience. Proven track record in solving complex customer problems.`
      });
    }, 1200);
  };

  const handlePublishProfile = () => {
    onProfileCreated({
      name: name || 'Artisan Service',
      category,
      yearsExperience: yearsExp,
      location,
      skills,
      brands,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewCount: 0,
      completedJobs: 0,
      isVerified: true
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 animate-fade-in">
      {/* Hero Title */}
      <div className="text-center mb-8">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          ARTISAN ONBOARDING & DIGITAL IDENTITY
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-50 mt-2 font-heading">
          Turn your <span className="emerald-gradient-text">skills into opportunities</span>
        </h2>
        <p className="text-sm md:text-base text-emerald-200/90 max-w-xl mx-auto mt-2">
          You don't need to know how to build a website. Simply describe your experience in plain words or voice, and KAIRO AI creates your digital portfolio!
        </p>
      </div>

      {!generatedProfile ? (
        /* STEP 1: CONVERSATIONAL RAW INPUT */
        <div className="glass-panel p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Bot className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-emerald-100">
                Tell us about your work
              </h3>
              <p className="text-xs text-emerald-300/80">
                Speak or type naturally about what you do, years of experience, and brands you work on.
              </p>
            </div>
          </div>

          <form onSubmit={handleRunAIProfileBuilder} className="space-y-4">
            <div className="relative">
              <textarea
                rows={5}
                value={rawBio}
                onChange={(e) => setRawBio(e.target.value)}
                placeholder="Example: I've repaired phones for 6 years. I mostly work on iPhones and Samsung. I change screens, batteries, and charging ports..."
                className="w-full glass-input rounded-2xl p-4 text-sm md:text-base placeholder-emerald-400/40 resize-none"
              />

              {isRecording && (
                <div className="absolute inset-0 bg-emerald-950/95 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 border border-emerald-400/60 z-10">
                  <span className="text-xs font-bold text-emerald-300 animate-pulse">
                    Recording your voice description...
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-xs font-bold border border-red-500/40"
                  >
                    Done Speaking
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleToggleVoice}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30"
              >
                <Mic className="w-4 h-4 text-emerald-400" />
                <span>Speak Your Work Experience</span>
              </button>

              <button
                type="submit"
                disabled={!rawBio.trim() || isAIProcessing}
                className={`emerald-button-gradient px-6 py-3 rounded-xl text-sm font-bold text-emerald-950 flex items-center gap-2 shadow-lg shadow-emerald-500/25 ${
                  !rawBio.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {isAIProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>AI Structuring Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-emerald-950" />
                    <span>Generate AI Digital Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* STEP 2: REVIEW & PUBLISH AI STRUCTURED PROFILE */
        <div className="glass-panel p-6 md:p-8 rounded-3xl border-2 border-emerald-400/50 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <h3 className="font-heading font-bold text-xl text-emerald-100">
                AI Structured Profile Ready!
              </h3>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40">
              KAIRO Skill Profile
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-300 mb-1">Business / Brand Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-emerald-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-300 mb-1">Primary Service Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-emerald-100"
              />
            </div>
          </div>

          {/* AI Extracted Skills */}
          <div>
            <label className="block text-xs font-bold text-emerald-300 mb-2">AI Extracted Skill Tags</label>
            <div className="flex flex-wrap gap-2">
              {skills.map((sk, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{sk}</span>
                </span>
              ))}
            </div>
          </div>

          {/* AI Extracted Brands */}
          <div>
            <label className="block text-xs font-bold text-emerald-300 mb-2">Supported Brands & Equipment</label>
            <div className="flex flex-wrap gap-2">
              {brands.map((br, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-emerald-950/80 text-emerald-200 text-xs border border-emerald-500/20">
                  {br}
                </span>
              ))}
            </div>
          </div>

          {/* Action to publish */}
          <div className="flex items-center justify-between pt-4 border-t border-emerald-500/20">
            <button
              type="button"
              onClick={() => setGeneratedProfile(null)}
              className="text-xs font-semibold text-emerald-300 hover:underline"
            >
              ← Edit Spoken Description
            </button>

            <button
              onClick={handlePublishProfile}
              className="emerald-button-gradient px-8 py-3 rounded-xl text-sm font-bold text-emerald-950 flex items-center gap-2 shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all"
            >
              <ShieldCheck className="w-4 h-4 fill-emerald-950" />
              <span>Publish Digital Identity & Go Live</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
