import React from 'react';
import { ChevronLeft, Phone, MessageSquare, ShieldCheck, MapPin, Clock, CheckCircle2, AlertCircle, RefreshCw, Star } from 'lucide-react';

export default function RequestDetailsPage({ request, onBack, onViewOtherMatches, onReviewArtisan }) {
  if (!request) return null;

  const status = request.status || 'awaiting'; // 'awaiting' | 'accepted' | 'declined' | 'completed'

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: '40px 24px 80px' }}>
      <div className="page-wrapper animate-fade-in" style={{ maxWidth: 880 }}>
        
        {/* Back link */}
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '15px', marginBottom: 24 }}
        >
          <ChevronLeft size={18} /> Back to requests
        </button>

        {/* ── STATUS BANNER ──────────────────────────────────────────────────── */}
        <div style={{
          background: status === 'accepted' ? 'var(--mint-mist)' : status === 'declined' ? 'var(--error-bg)' : status === 'completed' ? '#E0F2FE' : 'var(--gold-bg)',
          border: `1.5px solid ${status === 'accepted' ? 'var(--soft-sage)' : status === 'declined' ? '#FCA5A5' : status === 'completed' ? '#BAE6FD' : 'var(--gold-border)'}`,
          borderRadius: 20,
          padding: '24px 32px',
          marginBottom: 32,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <span className={`status-pill status-${status}`} style={{ marginBottom: 8, display: 'inline-block' }}>
              {request.statusText || status.toUpperCase()}
            </span>
            <h2 className="section-heading" style={{ color: 'var(--main-text)', margin: '4px 0' }}>
              {status === 'accepted' && 'Your enquiry was accepted!'}
              {status === 'declined' && 'This artisan cannot take this request.'}
              {status === 'awaiting' && 'Still waiting for a response.'}
              {status === 'completed' && 'Job marked as completed.'}
            </h2>
            <p className="supporting-text" style={{ margin: 0 }}>
              {status === 'accepted' && 'You can now call or WhatsApp the artisan directly to coordinate.'}
              {status === 'declined' && 'Don\'t worry — KAIRO can introduce you to other verified matches immediately.'}
              {status === 'awaiting' && 'The artisan has been notified and usually responds within 20 minutes.'}
              {status === 'completed' && 'Thank you for using KAIRO! Please leave a review to build community trust.'}
            </p>
          </div>

          {/* Contact Handoff Actions (REVEALED ONLY WHEN ACCEPTED OR COMPLETED) */}
          {status === 'accepted' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <a
                href={`tel:${request.artisanPhone || '08031234567'}`}
                className="btn btn-primary btn-lg"
                style={{ textDecoration: 'none' }}
              >
                <Phone size={18} /> Call Artisan
              </a>
              <a
                href={`https://wa.me/2348031234567?text=Hi, I sent a KAIRO enquiry for ${encodeURIComponent(request.serviceLabel || 'service')}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-lg"
                style={{ textDecoration: 'none', borderColor: '#25D366', color: '#075E54', background: '#DCFCE7' }}
              >
                <MessageSquare size={18} /> WhatsApp
              </a>
            </div>
          )}

          {status === 'declined' && (
            <button onClick={onViewOtherMatches} className="btn btn-primary btn-lg">
              <RefreshCw size={18} /> View other matches
            </button>
          )}

          {status === 'awaiting' && (
            <button onClick={onViewOtherMatches} className="btn btn-outline btn-lg">
              Try another artisan
            </button>
          )}

          {status === 'completed' && (
            <button onClick={() => onReviewArtisan && onReviewArtisan(request)} className="btn btn-gold btn-lg">
              <Star size={18} /> Leave Review
            </button>
          )}
        </div>

        {/* ── REQUEST DETAILS CARD ────────────────────────────────────────────── */}
        <div className="card card-lg" style={{ marginBottom: 32, boxShadow: 'var(--shadow-md)' }}>
          <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 20 }}>
            Request Summary
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 24 }}>
            <DetailBox label="Service Requested" value={request.serviceLabel || 'Generator Repair'} />
            <DetailBox label="Brand / Equipment" value={request.brand || 'Honda'} />
            <DetailBox label="Location" value={request.location || 'Yaba, Lagos'} />
            <DetailBox label="Date Sent" value={request.dateSent || 'Today'} />
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20, marginBottom: 24 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 6 }}>
              Original Problem Description:
            </div>
            <div style={{ fontSize: '17px', fontWeight: 600, color: 'var(--main-text)', fontStyle: 'italic' }}>
              "{request.problemText || 'Generator starts but goes off after a few minutes.'}"
            </div>
          </div>

          {/* Artisan Information */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 12 }}>
              Artisan Contacted:
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--mint-mist)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--deep-evergreen)', fontSize: '18px' }}>
                {request.artisanName?.charAt(0) || 'A'}
              </div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--main-text)' }}>
                  {request.artisanName || 'Emeka Generator Repairs'}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--secondary-text)' }}>
                  {status === 'accepted' ? `Phone: ${request.artisanPhone || '0803 123 4567'}` : 'Contact details hidden until accepted'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── WHY RECOMMENDED FEATURE ────────────────────────────────────────── */}
        <div className="card card-lg" style={{ background: 'var(--warm-cream)' }}>
          <h4 className="card-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 12 }}>
            Why KAIRO recommended this artisan:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(request.matchReasons || [
              'Specializes in startup and shutdown faults',
              '18 relevant work samples',
              'Serves your location in Yaba',
              'Available for immediate response'
            ]).map((reason, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14.5px', color: 'var(--main-text)' }}>
                <CheckCircle2 size={16} color="var(--kairo-green)" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function DetailBox({ label, value }) {
  return (
    <div style={{ background: 'var(--warm-cream)', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--main-text)' }}>
        {value}
      </div>
    </div>
  );
}
