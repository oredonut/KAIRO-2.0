import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Wrench, Search, CheckCircle2 } from 'lucide-react';

const SLIDES = [
  {
    tag: 'PROBLEM-FIRST DISCOVERY',
    headline: 'You don’t need to know who you need.',
    subhead: 'Just tell KAIRO what is wrong in plain words. Our AI identifies the exact skill required and matches you with trusted local professionals.',
    icon: Search,
    highlight: 'No scrolling through endless categories.'
  },
  {
    tag: 'VERIFIED ARTISAN EVIDENCE',
    headline: 'See real proof of past work.',
    subhead: 'KAIRO gives you evidence before you choose — verified work samples, honest customer reviews, and clear match reasoning.',
    icon: ShieldCheck,
    highlight: 'Know who you are choosing before sending an enquiry.'
  },
  {
    tag: 'DIRECT ENQUIRY HANDOFF',
    headline: 'Connect with confidence.',
    subhead: 'Send structured problem enquiries directly to matched artisans. Connect via call or WhatsApp once accepted.',
    icon: Wrench,
    highlight: 'Fast, seamless, and transparent.'
  }
];

export default function SplashScreen({ onGetStarted }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const SlideIcon = SLIDES[activeSlide].icon;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--warm-cream)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'between',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Subtle Gradient Blobs */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%', width: '450px', height: '450px',
        borderRadius: '50%', background: 'var(--mint-mist)', filter: 'blur(60px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px',
        borderRadius: '50%', background: 'var(--soft-sage)', filter: 'blur(80px)', opacity: 0.6, pointerEvents: 'none'
      }} />

      {/* Top Header Logo */}
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'var(--deep-evergreen)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sparkles size={22} color="var(--warm-gold)" />
          </div>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--deep-evergreen)', letterSpacing: '-0.03em' }}>
            KAIRO
          </span>
        </div>
        <div className="badge badge-green" style={{ fontSize: '14px', padding: '6px 14px' }}>
          <CheckCircle2 size={15} color="var(--kairo-green)" />
          <span>Launch Ready Prototype</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="page-wrapper" style={{
        flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignItems: 'center', gap: 48, padding: '40px 0', position: 'relative', zIndex: 10
      }}>
        {/* Left Side: Slide Text & Value Prop */}
        <div className="animate-slide-up" key={activeSlide} style={{ maxWidth: 560 }}>
          <div className="ai-chip" style={{ marginBottom: 20 }}>
            <SlideIcon size={15} color="var(--deep-evergreen)" />
            <span>{SLIDES[activeSlide].tag}</span>
          </div>

          <h1 className="hero-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 20 }}>
            {SLIDES[activeSlide].headline}
          </h1>

          <p className="body-text" style={{ color: 'var(--secondary-text)', fontSize: '18px', marginBottom: 24, lineHeight: 1.6 }}>
            {SLIDES[activeSlide].subhead}
          </p>

          <div style={{
            background: 'var(--white)',
            borderLeft: '4px solid var(--warm-gold)',
            padding: '14px 20px',
            borderRadius: '0 12px 12px 0',
            boxShadow: 'var(--shadow-xs)',
            marginBottom: 32
          }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--main-text)' }}>
              💡 {SLIDES[activeSlide].highlight}
            </span>
          </div>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 36 }}>
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                style={{
                  height: 8,
                  width: activeSlide === idx ? 32 : 10,
                  borderRadius: 100,
                  background: activeSlide === idx ? 'var(--kairo-green)' : 'var(--border-color)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onGetStarted}
              className="btn btn-primary btn-lg"
              style={{ padding: '16px 36px', fontSize: '18px' }}
            >
              Get Started with KAIRO
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Visual Card */}
        <div className="card card-lg animate-fade-in" style={{
          background: 'var(--white)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontSize: '13px', color: 'var(--secondary-text)', fontWeight: 600, marginLeft: 'auto' }}>
              KAIRO Experience Preview
            </span>
          </div>

          {/* Mock Problem Input */}
          <div style={{ background: 'var(--warm-cream)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 6 }}>
              Customer Problem
            </div>
            <div style={{ fontSize: '15px', color: 'var(--main-text)', fontWeight: 500 }}>
              "My generator starts fine, but shuts off automatically after 5 minutes."
            </div>
          </div>

          {/* AI Match Output */}
          <div className="ai-surface" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="badge badge-green">
                <Sparkles size={13} /> KAIRO AI Diagnosis
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--deep-evergreen)' }}>
                Likely: Generator Repair
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--main-text)', margin: 0 }}>
              Identified low-oil sensor trip or carburetor fuel restriction. Recommended 2 verified local technicians nearby.
            </p>
          </div>

          {/* Mock Artisan Card Preview */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
            <img
              src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&h=120&fit=crop"
              alt="Artisan"
              style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--main-text)' }}>Emeka Generator Repairs</div>
              <div style={{ fontSize: '13px', color: 'var(--secondary-text)' }}>★ 4.8 (34 reviews) · Yaba, Lagos</div>
            </div>
            <span className="badge badge-gold">Top Match</span>
          </div>

        </div>
      </div>
    </div>
  );
}
