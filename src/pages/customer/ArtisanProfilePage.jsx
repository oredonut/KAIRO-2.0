import React, { useState } from 'react';
import { Star, ShieldCheck, MapPin, Clock, ArrowRight, ChevronLeft, CheckCircle2, Award, Briefcase, ThumbsUp, Wrench } from 'lucide-react';

export default function ArtisanProfilePage({ artisan, request, onBack, onEnquire }) {
  const [activeTab, setActiveTab] = useState('samples'); // 'samples' | 'reviews' | 'about'

  if (!artisan) return null;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: '32px 24px 80px' }}>
      <div className="page-wrapper animate-fade-in" style={{ maxWidth: 1080 }}>
        
        {/* Back Link */}
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '15px', marginBottom: 24 }}
        >
          <ChevronLeft size={18} /> Back to match results
        </button>

        {/* ── PROFILE HEADER ─────────────────────────────────────────────────── */}
        <div className="card card-lg" style={{ marginBottom: 32, boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <img
              src={artisan.avatar}
              alt={artisan.name}
              style={{ width: 100, height: 100, borderRadius: 20, objectFit: 'cover', border: '3px solid var(--border-color)', flexShrink: 0 }}
            />

            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                <h1 className="page-heading" style={{ color: 'var(--main-text)', margin: 0, fontSize: '28px' }}>
                  {artisan.name}
                </h1>
                {artisan.isIdentityVerified && (
                  <span className="badge badge-verified">
                    <ShieldCheck size={14} color="var(--deep-evergreen)" /> Verified Identity & Skills
                  </span>
                )}
              </div>

              <div style={{ fontSize: '17px', fontWeight: 600, color: 'var(--kairo-green)', marginBottom: 12 }}>
                {artisan.categoryLabel} · {artisan.ownerName}
              </div>

              {/* Metadata Pills */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: '#D97706', fontSize: '16px' }}>
                  <Star size={18} fill="#F59E0B" color="#F59E0B" /> {artisan.rating}
                  <span style={{ fontWeight: 400, color: 'var(--secondary-text)', fontSize: '14px' }}>
                    ({artisan.reviewCount} reviews)
                  </span>
                </div>

                <div style={{ fontSize: '14.5px', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Briefcase size={16} /> {artisan.yearsExp} Years Experience
                </div>

                <div style={{ fontSize: '14.5px', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={16} /> {artisan.location}
                </div>

                <div className="badge badge-green" style={{ fontSize: '13.5px' }}>
                  <Clock size={14} /> {artisan.availability || 'Available Today'}
                </div>
              </div>

              {/* Action Bar */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button
                  onClick={() => onEnquire(artisan)}
                  className="btn btn-primary btn-lg"
                >
                  Send enquiry to {artisan.ownerName?.split(' ')[0]}
                  <ArrowRight size={18} />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ── PROFILE CONTENT TABS ───────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--border-color)', marginBottom: 28 }}>
          {[
            { id: 'samples', label: `Work Samples (${artisan.workSamples?.length || 0})` },
            { id: 'reviews', label: `Customer Reviews (${artisan.reviewCount || 0})` },
            { id: 'about', label: 'About & Skills' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === tab.id ? '3px solid var(--deep-evergreen)' : '3px solid transparent',
                color: activeTab === tab.id ? 'var(--deep-evergreen)' : 'var(--secondary-text)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: WORK SAMPLES (Problem -> Action -> Result) */}
        {activeTab === 'samples' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ marginBottom: 8 }}>
              <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)' }}>Evidence of Past Work</h3>
              <p className="supporting-text">Each work sample details the customer problem, artisan action, and final result.</p>
            </div>

            {artisan.workSamples && artisan.workSamples.map(sample => (
              <div key={sample.id} className="card card-lg" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                <img
                  src={sample.image}
                  alt="Work Sample"
                  style={{ width: '100%', height: 220, borderRadius: 14, objectFit: 'cover' }}
                />
                
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span className="small-metadata" style={{ fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>
                      Completed {sample.date}
                    </span>

                    <div style={{ marginTop: 10, marginBottom: 12 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>
                        Problem:
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--main-text)' }}>
                        "{sample.problem}"
                      </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>
                        Artisan Action:
                      </div>
                      <div style={{ fontSize: '15px', color: 'var(--main-text)' }}>
                        {sample.work}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>
                        Result:
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--deep-evergreen)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 size={16} color="var(--kairo-green)" />
                        {sample.result}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: REVIEWS */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {artisan.reviews && artisan.reviews.map(rev => (
              <div key={rev.id} className="card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--main-text)' }}>{rev.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontWeight: 700, color: '#D97706' }}>
                    <Star size={14} fill="#F59E0B" color="#F59E0B" /> {rev.rating}.0
                  </div>
                </div>
                <div className="badge badge-muted" style={{ marginBottom: 10 }}>{rev.jobType}</div>
                <p className="body-text" style={{ fontSize: '15.5px', margin: 0, fontStyle: 'italic' }}>
                  "{rev.text}"
                </p>
                <div className="small-metadata" style={{ marginTop: 8 }}>Reviewed {rev.date}</div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: ABOUT & SKILLS */}
        {activeTab === 'about' && (
          <div className="card card-lg" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>Bio & Background</h3>
              <p className="body-text" style={{ fontSize: '16.5px', color: 'var(--main-text)' }}>{artisan.bio}</p>
            </div>

            <div>
              <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 12 }}>Skills & Expertise</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {artisan.skills && artisan.skills.map((sk, i) => (
                  <span key={i} className="badge badge-green" style={{ fontSize: '14.5px', padding: '6px 14px' }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {artisan.brands && (
              <div>
                <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 12 }}>Brands Handled</h3>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {artisan.brands.map((b, i) => (
                    <span key={i} className="badge badge-gold" style={{ fontSize: '14px', padding: '6px 14px' }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
