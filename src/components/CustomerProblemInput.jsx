import React, { useState } from 'react';
import { Mic, Image as ImageIcon, Sparkles, X, Volume2, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { SAMPLE_PROBLEMS } from '../data/mockData';

export default function CustomerProblemInput({ onDiagnose }) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingLanguage, setRecordingLanguage] = useState('pidgin'); // 'pidgin' or 'english'
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoContextTag, setPhotoContextTag] = useState('');

  // Voice recording simulation
  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      // Simulate live spoken audio transcription
      const simulatedSpeech = recordingLanguage === 'pidgin'
        ? "My generator dey start but e go just off after about five minutes."
        : "My generator starts normally but shuts down after running for five minutes.";
      
      let index = 0;
      const interval = setInterval(() => {
        if (index <= simulatedSpeech.length) {
          setInputText(simulatedSpeech.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setIsRecording(false);
        }
      }, 35);
    }
  };

  // Simulated photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setPhotoContextTag('Visual Context Detected: Component damage / Wear inspection');
    }
  };

  // Preset chip selection
  const handleSelectSample = (sample) => {
    setInputText(sample.text);
    if (sample.category === 'generator') {
      setPhotoPreview('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80');
      setPhotoContextTag('Visual Context: Generator fuel & engine starter section');
    } else if (sample.category === 'device') {
      setPhotoPreview('https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80');
      setPhotoContextTag('Visual Context: Front OLED display glass fractures');
    } else {
      setPhotoPreview('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=400&q=80');
      setPhotoContextTag('Visual Context: Garment waist seam & back zipper');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onDiagnose(inputText, photoPreview, photoContextTag);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
      {/* Hero Banner Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4 shadow-sm">
          <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <span>Problem-First AI Matching</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-emerald-50 font-heading">
          What's your <span className="emerald-gradient-text">problem?</span>
        </h1>
        
        <p className="text-base md:text-lg text-emerald-200/90 max-w-2xl mx-auto leading-relaxed">
          Tell KAIRO what you need in plain text, voice, or photo. Our AI will figure out who can solve it and why.
        </p>
      </div>

      {/* Multimodal Search Card */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Input Text Area */}
          <div className="relative">
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Describe your issue in your own words... (e.g. My generator dey start but e go just off after 5 minutes, or My phone isn't charging properly)"
              className="w-full glass-input rounded-2xl p-4 md:p-5 text-sm md:text-base placeholder-emerald-400/50 resize-none transition-all focus:ring-2 focus:ring-emerald-400/50"
            />

            {/* Voice Audio Wave Overlay when Recording */}
            {isRecording && (
              <div className="absolute inset-0 bg-emerald-950/95 rounded-2xl backdrop-blur-md p-6 flex flex-col items-center justify-center gap-3 border border-emerald-400/60 z-20">
                <div className="flex items-center gap-1.5 h-10">
                  <span className="w-1.5 bg-emerald-400 rounded-full animate-wave-1"></span>
                  <span className="w-1.5 bg-emerald-300 rounded-full animate-wave-2"></span>
                  <span className="w-1.5 bg-emerald-400 rounded-full animate-wave-3"></span>
                  <span className="w-1.5 bg-emerald-200 rounded-full animate-wave-4"></span>
                  <span className="w-1.5 bg-emerald-400 rounded-full animate-wave-5"></span>
                </div>
                <p className="text-sm font-semibold text-emerald-200 animate-pulse">
                  Listening to your spoken voice ({recordingLanguage === 'pidgin' ? 'Pidgin English' : 'English'})...
                </p>
                <button
                  type="button"
                  onClick={handleToggleRecord}
                  className="px-4 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold border border-red-500/40"
                >
                  Stop Recording
                </button>
              </div>
            )}
          </div>

          {/* Photo Preview Attachment */}
          {photoPreview && (
            <div className="relative inline-flex items-center gap-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30">
              <img src={photoPreview} alt="Problem attachment" className="w-14 h-14 object-cover rounded-lg border border-emerald-400/30" />
              <div>
                <span className="block text-xs font-semibold text-emerald-200">Photo Context Attached</span>
                <span className="block text-[11px] text-emerald-400 font-medium">{photoContextTag}</span>
              </div>
              <button
                type="button"
                onClick={() => { setPhotoPreview(null); setPhotoContextTag(''); }}
                className="ml-2 text-emerald-400/60 hover:text-emerald-200 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Controls Bar: Voice, Photo, Submit */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-emerald-500/20">
            <div className="flex items-center gap-2">
              {/* Voice Button */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={handleToggleRecord}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    isRecording
                      ? 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse'
                      : 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/30 hover:border-emerald-400/50'
                  }`}
                >
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
                </button>
              </div>

              {/* Language Selector for Voice */}
              <div className="flex items-center bg-emerald-950/90 rounded-xl p-1 border border-emerald-500/20 text-[11px]">
                <button
                  type="button"
                  onClick={() => setRecordingLanguage('pidgin')}
                  className={`px-2 py-1 rounded-lg font-medium transition-all ${
                    recordingLanguage === 'pidgin' ? 'bg-emerald-500 text-emerald-950 font-bold' : 'text-emerald-300/70 hover:text-emerald-100'
                  }`}
                >
                  Pidgin
                </button>
                <button
                  type="button"
                  onClick={() => setRecordingLanguage('english')}
                  className={`px-2 py-1 rounded-lg font-medium transition-all ${
                    recordingLanguage === 'english' ? 'bg-emerald-500 text-emerald-950 font-bold' : 'text-emerald-300/70 hover:text-emerald-100'
                  }`}
                >
                  English
                </button>
              </div>

              {/* Photo Upload Button */}
              <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/50 cursor-pointer transition-all">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Upload Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`px-6 py-3 rounded-xl text-sm font-bold text-emerald-950 flex items-center gap-2 transition-all shadow-lg ${
                inputText.trim()
                  ? 'emerald-button-gradient hover:scale-[1.02] shadow-emerald-500/30 cursor-pointer'
                  : 'bg-emerald-900/40 text-emerald-400/40 border border-emerald-500/10 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4 fill-emerald-950" />
              <span>Understand & Find Solutions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Sample Problem Quick Chips */}
        <div className="mt-6 pt-5 border-t border-emerald-500/20">
          <p className="text-xs font-medium text-emerald-300/70 mb-2.5 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Try common customer problem examples:</span>
          </p>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROBLEMS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-left px-3 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/80 text-emerald-200/90 text-xs border border-emerald-500/20 hover:border-emerald-400/50 transition-all flex items-center gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-all"></span>
                <span>{sample.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
