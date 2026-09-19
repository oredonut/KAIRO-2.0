import React from 'react';
import { Sparkles, ArrowRight, Zap, Smartphone, Scissors, Shirt, ChevronRight, ShieldCheck, CheckCircle2, Clock, Image as ImageIcon, Star } from 'lucide-react';

const COMMON_PROBLEMS = [
  { text: 'I want to repair my clothes. There is a large tear near the pocket and I need the waist made smaller.' },
  { text: 'My laptop screen is cracked and I need it replaced.' },
  { text: 'My sink has been leaking underneath for two days.' },
  { text: 'My generator starts normally but shuts down after running for a few minutes.' },
];

export default function CustomerHome({
  onStartProblemFinder,
  onBrowseServices,
  recentRequests = [],
  onViewAllRequests,
  onOpenRequestDetails
}) {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingBottom: 80 }}>
      
      {/* ── 1. HERO SECTION (2-Column Desktop Layout) ─────────────────────────────────── */}
      <section style={{
        background: 'var(--warm-cream)',
        borderBottom: '1px solid var(--border-color)',
        padding: '56px 0 64px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="page-wrapper animate-fade-in">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            alignItems: 'center',
            gap: 48
          }}>
            
            {/* LEFT COLUMN */}
            <div>
              <div className="ai-chip" style={{ marginBottom: 20 }}>
                <Sparkles size={14} color="var(--deep-evergreen)" />
                <span>INTELLIGENT LOCAL ARTISAN DISCOVERY</span>
              </div>

              <h1 className="hero-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 20 }}>
                Got a problem?<br />
                <span style={{ color: 'var(--kairo-green)' }}>KAIRO finds the person who can solve it.</span>
              </h1>

              <p className="body-text" style={{ color: 'var(--secondary-text)', fontSize: '18px', marginBottom: 32, maxWidth: 540 }}>
                Tell us what’s wrong. KAIRO helps you figure out what kind of professional you need and finds relevant people you can trust.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={onStartProblemFinder}
                  className="btn btn-primary btn-lg"
                  style={{ fontSize: '18px', padding: '16px 32px' }}
                >
                  <Sparkles size={20} />
                  Tell KAIRO what's wrong
                </button>

                <button
                  onClick={onBrowseServices}
                  className="btn btn-ghost btn-lg"
                  style={{ fontSize: '16px', background: 'var(--white)' }}
                >
                  I already know what service I need
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Human Artisan Craftsman Image */}
            <div style={{ position: 'relative' }}>
              <div className="card" style={{
                padding: 12,
                borderRadius: 24,
                boxShadow: 'var(--shadow-xl)',
                background: 'var(--white)',
                border: '1px solid var(--border-color)'
              }}>
                <img
                  src="/hero-artisans.png"
                  alt="Skilled Artisans at work"
                  style={{
                    width: '100%',
                    height: '380px',
                    objectFit: 'cover',
                    borderRadius: 18
                  }}
                  onError={(e) => {
                    // Fallback if image path issues occur
                    e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&fit=crop';
                  }}
                />
                
                {/* Floating Trust Badge on Hero Image */}
                <div style={{
                  position: 'absolute',
                  bottom: 28,
                  left: 28,
                  background: 'var(--white)',
                  padding: '12px 20px',
                  borderRadius: 14,
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'var(--mint-mist)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    <ShieldCheck size={20} color="var(--deep-evergreen)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--deep-evergreen)' }}>Real Skills. Real Evidence.</div>
                    <div style={{ fontSize: '12px', color: 'var(--secondary-text)' }}>Verified local professionals</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="page-wrapper" style={{ marginTop: 48 }}>

        {/* ── 2. RECENT REQUESTS SECTION (Compact Section below Hero) ──────────────── */}
        {recentRequests && recentRequests.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)' }}>Your recent requests</h3>
              <button
                onClick={onViewAllRequests}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--kairo-green)', fontWeight: 600, fontSize: '15px',
                  display: 'flex', alignItems: 'center', gap: 4
                }}
              >
                View all requests <ChevronRight size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {recentRequests.slice(0, 3).map((req, idx) => (
                <div
                  key={req.id || idx}
                  onClick={() => onOpenRequestDetails && onOpenRequestDetails(req)}
                  className="card card-interactive"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px' }}
                >
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--main-text)', marginBottom: 4 }}>
                      {req.serviceLabel || req.service || 'Service Request'}
                    </div>
                    <div className="small-metadata">
                      Sent to: <strong>{req.artisanName || 'Matched Artisan'}</strong>
                    </div>
                  </div>

                  <span className={`status-pill status-${(req.status || 'awaiting').toLowerCase()}`}>
                    {req.statusText || req.status || 'Awaiting response'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. COMMON PROBLEMS SECTION ────────────────────────────────────────────── */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ marginBottom: 20 }}>
            <span className="small-metadata" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--secondary-text)' }}>
              Quick Start
            </span>
            <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginTop: 4 }}>
              Try these common problems
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {COMMON_PROBLEMS.map((prob, i) => (
              <button
                key={i}
                onClick={() => onStartProblemFinder(prob.text)}
                className="card card-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '20px 22px',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--main-text)' }}>
                  "{prob.text}"
                </span>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'var(--mint-mist)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <ArrowRight size={16} color="var(--kairo-green)" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── 4. HOW KAIRO WORKS (4 Steps) ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 64, background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: 24, padding: '40px 32px' }}>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
            <span className="ai-chip" style={{ marginBottom: 12 }}>THE KAIRO PROCESS</span>
            <h2 className="section-heading" style={{ fontSize: '30px', color: 'var(--deep-evergreen)', marginBottom: 12 }}>
              How KAIRO works
            </h2>
            <p className="supporting-text" style={{ fontSize: '16px' }}>
              From initial problem description to verified artisan introduction and review.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              {
                step: '01',
                title: 'Tell us the problem',
                desc: 'Describe what’s wrong using text, voice, or a photo. No technical terms required.'
              },
              {
                step: '02',
                title: 'KAIRO understands',
                desc: 'Our AI identifies the likely service you need and asks for important missing details.'
              },
              {
                step: '03',
                title: 'Compare relevant artisans',
                desc: 'See people matched to your problem, with their work, experience, reviews, and verification.'
              },
              {
                step: '04',
                title: 'Choose with confidence',
                desc: 'Send an enquiry, connect with the artisan, complete the job, and leave a review.'
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: 'var(--warm-cream)',
                border: '1px solid var(--border-color)',
                borderRadius: 16,
                padding: '24px'
              }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'var(--kairo-green)',
                  marginBottom: 12,
                  fontFamily: 'var(--font-sans)'
                }}>
                  {item.step}
                </div>
                <h4 className="card-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>
                  {item.title}
                </h4>
                <p className="supporting-text" style={{ fontSize: '14.5px', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. TRUST SECTION ────────────────────────────────────────────────────── */}
        <div style={{
          background: 'var(--deep-evergreen)',
          borderRadius: 24,
          padding: '48px 40px',
          color: 'var(--white)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ maxWidth: 640, marginBottom: 36 }}>
            <span className="badge badge-gold" style={{ marginBottom: 16 }}>TRUST & SAFETY</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--white)', marginBottom: 14 }}>
              Know who you're choosing.
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>
              KAIRO gives you more than a name. See evidence of an artisan's work and understand why they were recommended.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { icon: ShieldCheck, title: 'Verified Information', desc: 'Identity & phone verification badges on profiles.' },
              { icon: ImageIcon, title: 'Work Samples', desc: 'Before & after evidence with problem & result breakdown.' },
              { icon: Star, title: 'Customer Reviews', desc: 'Authentic reviews across quality, speed & professionalism.' },
              { icon: Clock, title: 'Relevant Experience', desc: 'Years in trade and specific fault resolution history.' }
            ].map((trust, idx) => {
              const Icon = trust.icon;
              return (
                <div key={idx} style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 16,
                  padding: '20px'
                }}>
                  <Icon size={24} color="var(--warm-gold)" style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--white)', marginBottom: 6 }}>
                    {trust.title}
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.5 }}>
                    {trust.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
