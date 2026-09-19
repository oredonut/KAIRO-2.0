import React from 'react';
import { Star, ShieldCheck, MapPin, Clock, ArrowRight, CheckCircle2, RefreshCw, Search, ChevronRight } from 'lucide-react';
import { getArtisansByIds, ARTISANS } from '../../data/mockData';

export default function ArtisanResults({
  request,
  onViewProfile,
  onEnquire,
  onChangeRequest,
  onBrowseOther
}) {
  const matchedIds = request?.diagnosis?.matchedArtisans || ['art-1', 'art-2'];
  const artisans = getArtisansByIds(matchedIds).length > 0 ? getArtisansByIds(matchedIds) : ARTISANS.slice(0, 2);

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: '40px 24px 80px' }}>
      <div className="page-wrapper animate-fade-in">
        
        {/* Page Header */}
        <div style={{ marginBottom: 36, textAlign: 'center', maxWidth: 640, margin: '0 auto 36px' }}>
          <div className="badge badge-green" style={{ marginBottom: 12 }}>
            <SparklesIcon />
            <span>KAIRO MATCHING ALGORITHM</span>
          </div>
          <h1 className="hero-heading" style={{ color: 'var(--deep-evergreen)', fontSize: '36px', marginBottom: 8 }}>
            People who can help
          </h1>
          <p className="supporting-text" style={{ fontSize: '17px' }}>
            Based on your problem, these artisans look relevant.
          </p>
        </div>

        {/* Request Summary Capsule */}
        <div style={{
          background: 'var(--warm-cream)',
          border: '1px solid var(--border-color)',
          borderRadius: 16,
          padding: '16px 24px',
          marginBottom: 40,
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>
              Your Problem:
            </span>
            <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--main-text)' }}>
              "{request?.problem?.text || 'Generator shuts down after starting'}"
            </span>
            <span className="badge badge-green">
              {request?.diagnosis?.categoryLabel || 'Generator Repair'}
            </span>
          </div>

          <button
            onClick={onChangeRequest}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--kairo-green)', fontWeight: 600, fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: 4
            }}
          >
            <RefreshCw size={14} /> Change request
          </button>
        </div>

        {/* Standardized Artisan Cards Grid (Consistent Height & Alignment) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 32,
          marginBottom: 64
        }}>
          {artisans.map(artisan => (
            <ArtisanResultCard
              key={artisan.id}
              artisan={artisan}
              request={request}
              onViewProfile={() => onViewProfile(artisan)}
              onEnquire={() => onEnquire(artisan)}
            />
          ))}
        </div>

        {/* ── "NOT QUITE WHAT YOU'RE LOOKING FOR?" SECTION ───────────────────────────── */}
        <div style={{
          background: 'var(--white)',
          border: '1px solid var(--border-color)',
          borderRadius: 20,
          padding: '36px',
          textAlign: 'center',
          maxWidth: 680,
          margin: '0 auto',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>
            Not quite what you're looking for?
          </h3>
          <p className="supporting-text" style={{ fontSize: '15.5px', marginBottom: 24 }}>
            Try changing your request or searching for another service category.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onChangeRequest}
              className="btn btn-outline"
            >
              <RefreshCw size={16} /> Change request
            </button>
            <button
              onClick={onBrowseOther}
              className="btn btn-ghost"
            >
              <Search size={16} /> Browse other services
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Standardized Artisan Result Card ──────────────────────────────────────────
function ArtisanResultCard({ artisan, request, onViewProfile, onEnquire }) {
  // Grounded evidence points for "Why KAIRO recommends" dynamically generated from request
  const categoryTitle = request?.diagnosis?.categoryLabel || artisan.categoryLabel || 'Service';
  const defaultEvidence = [
    `Handles ${categoryTitle} requests matching your description`,
    `${artisan.workSamplesCount || 18} relevant work samples`,
    `${artisan.yearsExp || 7} years of experience in trade`,
    `${artisan.availability || 'Available today'}`,
    `Serves ${artisan.location || 'your area'}`,
    `${artisan.reviewCount || 34} customer reviews`
  ];

  return (
    <div className="card card-lg" style={{
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      height: '100%',
      boxShadow: 'var(--shadow-md)',
      padding: '28px'
    }}>
      <div>
        
        {/* Header: Photo, Name, Service, Verification Badge */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
          <img
            src={artisan.avatar}
            alt={artisan.name}
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              objectFit: 'cover',
              border: '2px solid var(--border-color)',
              flexShrink: 0
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--main-text)', margin: 0 }}>
                {artisan.name}
              </h3>
              {artisan.isIdentityVerified && (
                <span className="badge badge-verified" title="Identity Verified">
                  <ShieldCheck size={13} color="var(--deep-evergreen)" /> Verified
                </span>
              )}
            </div>
            
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--kairo-green)', marginBottom: 4 }}>
              {artisan.categoryLabel}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '13.5px', color: 'var(--secondary-text)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontWeight: 700, color: '#D97706' }}>
                <Star size={14} fill="#F59E0B" color="#F59E0B" /> {artisan.rating}
              </span>
              <span>({artisan.reviewCount} reviews)</span>
              <span>· {artisan.yearsExp} yrs exp</span>
            </div>
          </div>
        </div>

        {/* Location & Availability Pills */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <span className="badge badge-muted">
            <MapPin size={13} /> {artisan.location}
          </span>
          <span className="badge badge-green">
            <Clock size={13} /> {artisan.availability}
          </span>
        </div>

        {/* ── "WHY KAIRO RECOMMENDS THEM" FEATURE (Section 14) ──────────────── */}
        <div className="why-panel" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-evergreen)', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <SparklesIcon />
            Why KAIRO recommends {artisan.ownerName?.split(' ')[0] || artisan.name}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {defaultEvidence.map((ev, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '13.5px', color: 'var(--main-text)' }}>
                <CheckCircle2 size={15} color="var(--kairo-green)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{ev}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Work Sample Snippet Preview */}
        {artisan.workSamples && artisan.workSamples[0] && (
          <div style={{
            background: 'var(--warm-cream)',
            border: '1px solid var(--border-color)',
            borderRadius: 12,
            padding: 12,
            marginBottom: 24,
            display: 'flex',
            gap: 12,
            alignItems: 'center'
          }}>
            <img
              src={artisan.workSamples[0].image}
              alt="Work Sample"
              style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>
                Relevant Work Sample
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--main-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {artisan.workSamples[0].problem}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Buttons: Send Enquiry (Primary) & View Profile (Secondary) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <button
          onClick={onEnquire}
          className="btn btn-primary btn-block"
        >
          Send enquiry
        </button>
        <button
          onClick={onViewProfile}
          className="btn btn-outline btn-block"
        >
          View profile
        </button>
      </div>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
    </svg>
  );
}
