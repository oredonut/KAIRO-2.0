import React, { useState } from 'react';
import { Bot, CheckCircle2, HelpCircle, ArrowRight, X, Sparkles, AlertCircle } from 'lucide-react';
import { generateAIDiagnosis } from '../data/mockData';

export default function AIDiagnosisModal({ rawProblem, photoPreview, photoContextTag, isOpen, onClose, onConfirmRequest }) {
  if (!isOpen) return null;

  const diagnosis = generateAIDiagnosis(rawProblem);
  const [answers, setAnswers] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const handleProceed = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmRequest({
        rawProblem,
        photoPreview,
        photoContextTag,
        diagnosis,
        clarificationAnswers: answers
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border-2 border-emerald-400/40 shadow-2xl p-6 md:p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-emerald-300/60 hover:text-emerald-100 p-1.5 rounded-xl hover:bg-emerald-900/50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* AI Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-inner">
            <Bot className="w-7 h-7 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                AI Problem Diagnosis
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-400/20 text-emerald-300 rounded-md">
                STEP 1 OF 2
              </span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-emerald-50">
              We analyzed your problem
            </h3>
          </div>
        </div>

        {/* AI Identified Category Card */}
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs text-emerald-400 font-semibold block mb-1">We think you need:</span>
              <h4 className="font-heading font-extrabold text-xl text-emerald-100 flex items-center gap-2">
                <span>{diagnosis.category}</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </h4>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
              Category Matched
            </span>
          </div>

          <div className="space-y-2 text-xs md:text-sm text-emerald-200/90 leading-relaxed border-t border-emerald-500/20 pt-3">
            <div>
              <span className="font-semibold text-emerald-300">What KAIRO Understood: </span>
              <span>"{diagnosis.understanding}"</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-semibold text-emerald-300 text-xs">Skills Identified: </span>
              {diagnosis.matchedSkills.map((skill, idx) => (
                <span key={idx} className="px-2 py-0.5 text-[11px] font-medium bg-emerald-900/60 text-emerald-300 rounded-md border border-emerald-500/30">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Follow-up Clarifying Questions */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-200">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>We need a little more information to get exact artisan matches:</span>
          </div>

          {diagnosis.followUpQuestions.map((q) => (
            <div key={q.id} className="space-y-1.5">
              <label className="block text-xs font-semibold text-emerald-300">
                {q.question}
              </label>
              <input
                type="text"
                placeholder={q.placeholder}
                value={answers[q.id] || ''}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-xs md:text-sm placeholder-emerald-400/40"
              />
            </div>
          ))}
        </div>

        {/* Action button */}
        <div className="flex items-center justify-between pt-4 border-t border-emerald-500/20">
          <p className="text-xs text-emerald-300/70 hidden sm:block">
            KAIRO converts this into a structured request & finds artisans.
          </p>

          <button
            onClick={handleProceed}
            disabled={isProcessing}
            className="emerald-button-gradient px-6 py-3 rounded-xl text-sm font-bold text-emerald-950 flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all ml-auto hover:scale-105"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Finding Matched Artisans...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-emerald-950" />
                <span>Find Relevant Artisans</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
