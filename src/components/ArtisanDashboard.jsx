import React, { useState } from 'react';
import { UserCheck, Star, ShieldCheck, CheckCircle2, Clock, Phone, Plus, Image as ImageIcon, Briefcase, Zap, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

export default function ArtisanDashboard({ artisan, enquiries, onAcceptEnquiry, onAddWorkSample }) {
  const [isOnline, setIsOnline] = useState(true);
  const [showAddSampleModal, setShowAddSampleModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProblem, setNewProblem] = useState('');

  const handleCreateSample = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddWorkSample({
      id: 'ws-' + Date.now(),
      title: newTitle,
      beforeImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      afterImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
      problemSolved: newProblem || 'Successfully diagnosed and repaired user hardware component.',
      date: 'Just now'
    });

    setNewTitle('');
    setNewProblem('');
    setShowAddSampleModal(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in mb-12">
      {/* Top Banner Card */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={artisan.avatar}
              alt={artisan.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-2xl text-emerald-50">{artisan.name}</h2>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40">
                  VERIFIED ARTISAN
                </span>
              </div>
              <p className="text-xs text-emerald-300/80">{artisan.category} • {artisan.location}</p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-3 bg-emerald-950/80 p-2 rounded-2xl border border-emerald-500/30">
            <span className="text-xs font-semibold text-emerald-200">
              Status: {isOnline ? <span className="text-emerald-400 font-bold">Online & Discoverable</span> : <span className="text-amber-400">Busy / Offline</span>}
            </span>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className="text-emerald-400 hover:text-emerald-300 transition-all"
            >
              {isOnline ? <ToggleRight className="w-8 h-8 text-emerald-400" /> : <ToggleLeft className="w-8 h-8 text-emerald-600" />}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-500/20">
          <div className="p-3.5 rounded-xl bg-emerald-900/30 border border-emerald-500/20">
            <span className="block text-[11px] text-emerald-400 font-medium">Reputation Score</span>
            <span className="text-xl font-extrabold text-amber-300 flex items-center gap-1 mt-0.5">
              <Star className="w-5 h-5 fill-amber-300" />
              {artisan.rating} ★
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-900/30 border border-emerald-500/20">
            <span className="block text-[11px] text-emerald-400 font-medium">Completed Jobs</span>
            <span className="text-xl font-extrabold text-emerald-100 mt-0.5 block">
              {artisan.completedJobs} Jobs
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-900/30 border border-emerald-500/20">
            <span className="block text-[11px] text-emerald-400 font-medium">Work Samples</span>
            <span className="text-xl font-extrabold text-emerald-100 mt-0.5 block">
              {artisan.workSamples?.length || 18} Photos
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-900/30 border border-emerald-500/20">
            <span className="block text-[11px] text-emerald-400 font-medium">Pending Requests</span>
            <span className="text-xl font-extrabold text-emerald-300 mt-0.5 block">
              {enquiries.length} Enquiries
            </span>
          </div>
        </div>
      </div>

      {/* Main Section Grid: Enquiries Inbox & Portfolio Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* INCOMING CUSTOMER ENQUIRIES */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xl text-emerald-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Incoming Customer Enquiries ({enquiries.length})</span>
            </h3>
          </div>

          {enquiries.length === 0 ? (
            <div className="text-center py-8 text-emerald-300/60 text-xs">
              No new pending enquiries right now. Make sure your status is Online!
            </div>
          ) : (
            <div className="space-y-3">
              {enquiries.map((enq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-emerald-100">{enq.customerName}</span>
                    <span className="text-[11px] text-emerald-400 font-medium">{enq.preferredTime}</span>
                  </div>

                  <p className="text-xs text-emerald-200/90 italic bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-500/20">
                    "{enq.problemSummary}"
                  </p>

                  <div className="flex items-center justify-between text-xs text-emerald-300 pt-1">
                    <span>Address: {enq.address}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => onAcceptEnquiry(idx)}
                      className="emerald-button-gradient flex-1 py-2 px-3 rounded-xl text-xs font-bold text-emerald-950 flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Phone className="w-3.5 h-3.5 fill-emerald-950" />
                      <span>Accept & Call Customer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PORTFOLIO & WORK SAMPLES MANAGER */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xl text-emerald-100 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-400" />
              <span>Proof of Work Portfolio</span>
            </h3>

            <button
              onClick={() => setShowAddSampleModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add Work Photo</span>
            </button>
          </div>

          <div className="space-y-3">
            {artisan.workSamples?.map((sample) => (
              <div key={sample.id} className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/20 flex items-center gap-3">
                <img src={sample.afterImage} alt="Work" className="w-14 h-14 rounded-xl object-cover border border-emerald-400/30 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-emerald-100 truncate">{sample.title}</h4>
                  <p className="text-[11px] text-emerald-300/80 line-clamp-1">{sample.problemSolved}</p>
                  <span className="text-[10px] text-emerald-400">{sample.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Sample Modal */}
      {showAddSampleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-emerald-400/50 space-y-4">
            <h3 className="font-heading font-bold text-lg text-emerald-100">Upload Proof of Work Photo</h3>
            <form onSubmit={handleCreateSample} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sumec Generator Piston Overhaul"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">Problem Solved Explanation</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Cleared clogged fuel line and adjusted low oil sensor cut-off."
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  className="w-full glass-input rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSampleModal(false)}
                  className="px-4 py-2 text-xs text-emerald-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="emerald-button-gradient px-4 py-2 rounded-xl text-xs font-bold text-emerald-950"
                >
                  Publish Work Sample
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
