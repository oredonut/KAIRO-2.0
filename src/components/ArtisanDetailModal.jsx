import React, { useState } from 'react';
import { X, Star, ShieldCheck, MapPin, Clock, Award, CheckCircle2, PhoneCall, Image as ImageIcon, MessageSquare, ThumbsUp, ChevronRight } from 'lucide-react';

export default function ArtisanDetailModal({ artisan, isOpen, onClose, onBookArtisan }) {
  if (!isOpen || !artisan) return null;

  const [activeTab, setActiveTab] = useState('work'); // 'work' | 'reviews' | 'about'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border-2 border-emerald-400/40 shadow-2xl p-6 md:p-8 relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-emerald-300/60 hover:text-emerald-100 p-1.5 rounded-xl hover:bg-emerald-900/50 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Profile Header */}
        <div className="flex flex-col md:flex-row items-start gap-5 mb-6 pr-8">
          <img
            src={artisan.avatar}
            alt={artisan.name}
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-emerald-400/60 shadow-lg shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="font-heading font-extrabold text-2xl text-emerald-50">
                {artisan.name}
              </h2>
              {artisan.isVerified && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>KAIRO VERIFIED</span>
                </span>
              )}
            </div>

            <p className="text-xs md:text-sm text-emerald-200/90 mb-3 leading-relaxed">
              {artisan.bio}
            </p>

            <div className="flex items-center gap-4 text-xs text-emerald-300/80 flex-wrap">
              <div className="flex items-center gap-1 text-amber-300 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>{artisan.rating}</span>
                <span className="text-emerald-300/60 font-normal">({artisan.reviewCount} verified reviews)</span>
              </div>
              <span className="text-emerald-500/40">•</span>
              <span className="text-emerald-200 font-semibold">{artisan.completedJobs} Jobs Completed</span>
              <span className="text-emerald-500/40">•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                {artisan.availability}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-emerald-500/20 mb-5">
          <button
            onClick={() => setActiveTab('work')}
            className={`pb-2.5 px-4 text-xs md:text-sm font-bold transition-all relative ${
              activeTab === 'work' ? 'text-emerald-300' : 'text-emerald-300/60 hover:text-emerald-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              <span>Proof of Work ({artisan.workSamples.length})</span>
            </span>
            {activeTab === 'work' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full shadow-glow"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2.5 px-4 text-xs md:text-sm font-bold transition-all relative ${
              activeTab === 'reviews' ? 'text-emerald-300' : 'text-emerald-300/60 hover:text-emerald-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              <span>Ratings & Reviews ({artisan.reviewCount})</span>
            </span>
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full shadow-glow"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`pb-2.5 px-4 text-xs md:text-sm font-bold transition-all relative ${
              activeTab === 'about' ? 'text-emerald-300' : 'text-emerald-300/60 hover:text-emerald-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Verification & Skills</span>
            </span>
            {activeTab === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full shadow-glow"></span>
            )}
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* TAB 1: PROOF OF WORK GALLERY */}
          {activeTab === 'work' && (
            <div className="space-y-4">
              {artisan.workSamples.map((sample) => (
                <div key={sample.id} className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-heading font-bold text-base text-emerald-100">
                      {sample.title}
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-medium">{sample.date}</span>
                  </div>

                  {/* Before / After Images */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <span className="block text-[11px] font-semibold text-emerald-400/80 mb-1">Before Repair / Alteration:</span>
                      <img src={sample.beforeImage} alt="Before" className="w-full h-40 object-cover rounded-xl border border-emerald-500/30" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-emerald-300 mb-1">After (Result):</span>
                      <img src={sample.afterImage} alt="After" className="w-full h-40 object-cover rounded-xl border border-emerald-400/50 shadow-md" />
                    </div>
                  </div>

                  <p className="text-xs text-emerald-200/90 leading-relaxed bg-emerald-900/40 p-3 rounded-xl border border-emerald-500/20">
                    <span className="font-semibold text-emerald-300">Problem Solved: </span>
                    {sample.problemSolved}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: UBER-STYLE RATINGS & REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-5">
              {/* 4-Tier Sub-Ratings Breakdown */}
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="block text-[11px] text-emerald-400 font-medium">Quality of Work</span>
                  <div className="flex items-center gap-1 text-emerald-100 font-bold text-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>{artisan.subRatings.quality} / 5.0</span>
                  </div>
                </div>
                <div>
                  <span className="block text-[11px] text-emerald-400 font-medium">Professionalism</span>
                  <div className="flex items-center gap-1 text-emerald-100 font-bold text-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>{artisan.subRatings.professionalism} / 5.0</span>
                  </div>
                </div>
                <div>
                  <span className="block text-[11px] text-emerald-400 font-medium">Communication</span>
                  <div className="flex items-center gap-1 text-emerald-100 font-bold text-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>{artisan.subRatings.communication} / 5.0</span>
                  </div>
                </div>
                <div>
                  <span className="block text-[11px] text-emerald-400 font-medium">Value for Money</span>
                  <div className="flex items-center gap-1 text-emerald-100 font-bold text-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>{artisan.subRatings.value} / 5.0</span>
                  </div>
                </div>
              </div>

              {/* Verified Customer Reviews */}
              <div className="space-y-3">
                {artisan.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-emerald-100">{rev.customerName}</span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Verified Job</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-300 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-xs text-emerald-200/90 leading-relaxed italic">
                      "{rev.text}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-emerald-400/70 pt-1">
                      <span>Job: {rev.verifiedJob}</span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VERIFICATION & SKILLS */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 space-y-3">
                <h4 className="font-heading font-bold text-sm text-emerald-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>KAIRO Trust & Verification Audit</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/20">
                    <span className="block font-bold text-emerald-300 mb-1">✓ Government Identity Verified</span>
                    <span className="text-emerald-200/80">NIN / Voter's card verified by KAIRO admin team.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/20">
                    <span className="block font-bold text-emerald-300 mb-1">✓ Physical Workshop Verified</span>
                    <span className="text-emerald-200/80">Location confirmed in {artisan.location}.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 space-y-2">
                <h4 className="font-heading font-bold text-sm text-emerald-200">
                  Brands & Equipment Supported
                </h4>
                <div className="flex flex-wrap gap-2">
                  {artisan.brands.map((b, i) => (
                    <span key={i} className="px-3 py-1 text-xs font-semibold bg-emerald-900/60 text-emerald-300 rounded-lg border border-emerald-500/30">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Contact Action */}
        <div className="pt-4 border-t border-emerald-500/20 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-emerald-400 block font-medium">Service Area: {artisan.serviceArea}</span>
            <span className="text-xs text-emerald-200 font-bold">{artisan.responseTime} typical response</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookArtisan(artisan);
            }}
            className="emerald-button-gradient px-6 py-3 rounded-xl text-xs md:text-sm font-bold text-emerald-950 flex items-center gap-2 shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all"
          >
            <PhoneCall className="w-4 h-4 fill-emerald-950" />
            <span>Contact & Book {artisan.ownerName.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
