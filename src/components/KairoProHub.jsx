import React, { useState } from 'react';
import { ShieldCheck, Sparkles, TrendingUp, Award, CheckCircle2, ArrowRight, Eye, Star, Zap } from 'lucide-react';

export default function KairoProHub() {
  const [activeLeadTab, setActiveLeadTab] = useState('ikeja');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in mb-12">
      {/* Hero Pro Banner */}
      <div className="glass-panel p-8 rounded-3xl border-2 border-amber-400/40 shadow-2xl relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900/60 to-emerald-950">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold border border-amber-400/40 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>KAIRO PRO SUITE FOR ARTISANS</span>
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-50 font-heading tracking-tight mb-2">
          Build a trusted digital identity & grow your business
        </h2>

        <p className="text-sm md:text-base text-emerald-200/90 max-w-2xl leading-relaxed">
          Unlock verified trust badges, AI portfolio optimization, and local customer demand analytics.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <button className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all hover:scale-105">
            <Zap className="w-4 h-4 fill-emerald-950" />
            <span>Upgrade to KAIRO Pro (₦3,500/mo)</span>
          </button>
        </div>
      </div>

      {/* 4 Feature Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FEATURE 1: VERIFICATION */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="font-heading font-bold text-lg text-emerald-100">Identity & Skill Verification</h3>
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            Get an official KAIRO Verified Badge attached to your profile after identity check and workshop address audit. Verified artisans get 3x higher customer conversion.
          </p>
          <div className="pt-2 text-xs font-bold text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>NIN & Physical Workshop Audit Included</span>
          </div>
        </div>

        {/* FEATURE 2: AI PROFILE ASSISTANT */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="font-heading font-bold text-lg text-emerald-100">AI Profile & Portfolio Assistant</h3>
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            Automatically transform simple work sample photos into polished before/after case studies with technical problem breakdown and customer benefit bullet points.
          </p>
          <div className="pt-2 text-xs font-bold text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Automated Technical Tagging</span>
          </div>
        </div>

        {/* FEATURE 3: QUALIFIED LEAD INSIGHTS */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-emerald-100">Qualified Local Lead Insights</h3>
                <p className="text-xs text-emerald-300/80">Real-time breakdown of what customers in your service area are searching for</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
              LIVE DEMAND FEED
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/20">
              <span className="text-[11px] text-emerald-400 font-bold block mb-1">🔥 Top Search Issue #1</span>
              <h4 className="font-bold text-sm text-emerald-100">Generator Shutdown (5 Mins)</h4>
              <span className="text-xs font-extrabold text-emerald-400 block mt-1">+45% requests in Ikeja</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/20">
              <span className="text-[11px] text-emerald-400 font-bold block mb-1">🔥 Top Search Issue #2</span>
              <h4 className="font-bold text-sm text-emerald-100">iPhone Charging Port Soldering</h4>
              <span className="text-xs font-extrabold text-emerald-400 block mt-1">+32% requests in Yaba</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/20">
              <span className="text-[11px] text-emerald-400 font-bold block mb-1">🔥 Top Search Issue #3</span>
              <h4 className="font-bold text-sm text-emerald-100">Ankara Invisible Zip Replacement</h4>
              <span className="text-xs font-extrabold text-emerald-400 block mt-1">+28% requests in Surulere</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
