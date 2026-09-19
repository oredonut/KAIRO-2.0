import React from 'react';
import { Star, ShieldCheck, MapPin, Clock, Award, CheckCircle, ArrowRight, Eye, PhoneCall } from 'lucide-react';

export default function ArtisanCard({ artisan, userProblem, onSelectArtisan, onBookArtisan }) {
  // Determine match reasons based on problem type
  const problemCategory = userProblem?.diagnosis?.categoryId || 'generator';
  const matchBulletPoints = artisan.matchReasons[problemCategory + '-shutdown'] ||
                             artisan.matchReasons[problemCategory + '-alteration'] ||
                             artisan.matchReasons[problemCategory + '-screen'] ||
                             artisan.matchReasons['default'] || [
                               `✓ Specializes in ${artisan.category} diagnosis & repairs`,
                               `✓ ${artisan.workSamplesCount} verified work samples available`,
                               `✓ ${artisan.yearsExperience} years certified experience`,
                               `✓ ${artisan.availability} in ${artisan.location}`,
                               `✓ ${artisan.reviewCount} customer reviews on KAIRO`
                             ];

  return (
    <div className="glass-panel-interactive rounded-3xl p-6 border border-emerald-500/30 relative flex flex-col justify-between overflow-hidden">
      {/* Background ambient badge glow */}
      {artisan.isKairoPro && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500/20 via-emerald-500/10 to-transparent px-4 py-1.5 rounded-bl-2xl border-l border-b border-amber-400/30 text-[11px] font-bold text-amber-300 flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>KAIRO PRO ARTISAN</span>
        </div>
      )}

      <div>
        {/* Artisan Profile Header */}
        <div className="flex items-start gap-4 mb-4 pt-2">
          <div className="relative">
            <img
              src={artisan.avatar}
              alt={artisan.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/50 shadow-md"
            />
            {artisan.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-emerald-950 p-1 rounded-full text-[10px]" title="Identity Verified">
                <ShieldCheck className="w-3.5 h-3.5 fill-emerald-950" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-heading font-bold text-lg text-emerald-50 truncate">
                {artisan.name}
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs text-emerald-300/80 mb-2 flex-wrap">
              <div className="flex items-center gap-1 text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>{artisan.rating}</span>
                <span className="text-emerald-300/60 font-normal">({artisan.reviewCount} reviews)</span>
              </div>
              <span className="text-emerald-500/40">•</span>
              <span className="text-emerald-200 font-medium">{artisan.completedJobs} jobs completed</span>
              <span className="text-emerald-500/40">•</span>
              <span>{artisan.yearsExperience} yrs exp</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-emerald-300/70">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {artisan.location}
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Clock className="w-3 h-3 text-emerald-400" />
                {artisan.availability}
              </span>
            </div>
          </div>
        </div>

        {/* SIGNATURE FEATURE: "WHY KAIRO RECOMMENDS" */}
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2.5 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Why KAIRO Recommends {artisan.ownerName.split(' ')[0]}</span>
          </h4>

          <ul className="space-y-1.5">
            {matchBulletPoints.map((point, index) => (
              <li key={index} className="text-xs text-emerald-100 font-medium flex items-start gap-2 leading-tight">
                <span className="text-emerald-300 shrink-0">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skill Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {artisan.skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-[11px] font-medium bg-emerald-900/40 text-emerald-300 rounded-lg border border-emerald-500/20"
            >
              {skill}
            </span>
          ))}
          {artisan.skills.length > 4 && (
            <span className="px-2 py-1 text-[10px] text-emerald-400 font-semibold">
              +{artisan.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-3 border-t border-emerald-500/20">
        <button
          onClick={() => onSelectArtisan(artisan)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-900/50 hover:bg-emerald-800/60 text-emerald-200 text-xs font-bold border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all"
        >
          <Eye className="w-4 h-4 text-emerald-400" />
          <span>View Proof & Work</span>
        </button>

        <button
          onClick={() => onBookArtisan(artisan)}
          className="emerald-button-gradient flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-950 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
        >
          <PhoneCall className="w-4 h-4 fill-emerald-950" />
          <span>Contact Artisan</span>
        </button>
      </div>
    </div>
  );
}
