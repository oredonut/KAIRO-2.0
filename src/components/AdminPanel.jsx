import React from 'react';
import { LayoutDashboard, Users, ShieldCheck, CheckCircle2, AlertTriangle, Activity, BarChart3, Wrench } from 'lucide-react';

export default function AdminPanel({ artisans }) {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in mb-12">
      {/* Admin Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            ADMINISTRATOR PORTAL
          </span>
          <h2 className="text-3xl font-extrabold text-emerald-50 mt-1 font-heading">
            Platform Moderation & Metrics
          </h2>
        </div>
        <span className="px-3 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/40">
          SYSTEM HEALTH: 99.9%
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30">
          <span className="text-xs text-emerald-400 font-medium block mb-1">Onboarded Artisans</span>
          <span className="text-2xl font-extrabold text-emerald-100 block">537</span>
          <span className="text-[10px] text-emerald-400 font-semibold">+14 this week</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30">
          <span className="text-xs text-emerald-400 font-medium block mb-1">Jobs Completed</span>
          <span className="text-2xl font-extrabold text-emerald-100 block">1,842</span>
          <span className="text-[10px] text-emerald-400 font-semibold">98.4% satisfaction</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30">
          <span className="text-xs text-emerald-400 font-medium block mb-1">AI Match Success</span>
          <span className="text-2xl font-extrabold text-emerald-300 block">94.2%</span>
          <span className="text-[10px] text-emerald-400 font-semibold">Based on 1st match</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30">
          <span className="text-xs text-emerald-400 font-medium block mb-1">Verified Badges</span>
          <span className="text-2xl font-extrabold text-amber-300 block">412</span>
          <span className="text-[10px] text-emerald-400 font-semibold">NIN Audit complete</span>
        </div>
      </div>

      {/* Artisan Audit Queue */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
        <h3 className="font-heading font-bold text-lg text-emerald-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Active Registered Artisans</span>
        </h3>

        <div className="space-y-3">
          {artisans.map((artisan) => (
            <div key={artisan.id} className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/20 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <img src={artisan.avatar} alt={artisan.name} className="w-12 h-12 rounded-xl object-cover border border-emerald-400/40" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-100">{artisan.name}</h4>
                  <span className="text-xs text-emerald-300/80">{artisan.category} • {artisan.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  {artisan.rating} ★ ({artisan.reviewCount} reviews)
                </span>
                <button className="px-3 py-1.5 rounded-xl bg-emerald-900/60 text-emerald-200 text-xs font-bold border border-emerald-500/30">
                  Audit Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
