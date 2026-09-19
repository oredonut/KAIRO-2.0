import React, { useState, useEffect } from 'react';
import { ArrowRight, Search, ShieldCheck, Wrench, CheckCircle2 } from 'lucide-react';
import KairoIcon, { KairoLogo } from '../components/KairoIcon';

const EXPLANATORY_POINTS = [
  {
    num: '01',
    tag: 'PROBLEM-FIRST DISCOVERY',
    title: 'Tell KAIRO what is wrong',
    desc: 'Describe the problem in your own words — text, voice, or photo. No technical jargon required.',
    icon: Search,
  },
  {
    num: '02',
    tag: 'INTELLIGENT DIAGNOSIS',
    title: 'KAIRO understands what you need',
    desc: 'Our AI identifies the exact service required and asks targeted clarification questions to refine the match.',
    icon: Wrench,
  },
  {
    num: '03',
    tag: 'EVIDENCE-BASED MATCHING',
    title: 'KAIRO finds relevant skilled people',
    desc: 'Compare verified local professionals with genuine proof of work, ratings, and clear match reasoning.',
    icon: ShieldCheck,
  }
];

export default function SplashScreen({ onGetStarted }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % EXPLANATORY_POINTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--warm-cream)',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
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

      {/* Top Header Logo with DISTINCTIVE GEOMETRIC ICON */}
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
        <KairoLogo size={36} />
        <div className="badge badge-green" style={{ fontSize: '14px', padding: '6px 14px' }}>
          <CheckCircle2 size={15} color="var(--kairo-green)" />
          <span>Launch Ready Prototype</span>
        </div>
      </div>

      {/* Main Centered Composition (Section 2 - NO Experience Preview Card!) */}
      <div className="page-wrapper" style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '56px 0', position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 840, margin: '0 auto'
      }}>
        
        {/* Main Product Tagline */}
        <div className="ai-chip animate-fade-in" style={{ marginBottom: 20 }}>
          <KairoIcon size={16} />
          <span>AI-POWERED PROBLEM TO SOLUTION & ARTISAN TRUST PLATFORM</span>
        </div>

        <h1 className="hero-heading animate-slide-up" style={{ color: 'var(--deep-evergreen)', fontSize: 'clamp(36px, 5.5vw, 54px)', marginBottom: 20, maxWidth: 760 }}>
          You don’t need to know who you need.
        </h1>

        <p className="body-text animate-slide-up" style={{ color: 'var(--secondary-text)', fontSize: '19px', marginBottom: 44, maxWidth: 640, lineHeight: 1.6 }}>
          Just tell KAIRO what is wrong in plain words. Our AI identifies the exact skill required and matches you with trusted local professionals.
        </p>

        {/* Three Explanatory Points Composition (Clean Horizontal / Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, width: '100%', marginBottom: 44 }}>
          {EXPLANATORY_POINTS.map((pt, idx) => {
            const Icon = pt.icon;
            const isActive = activeSlide === idx;
            return (
              <div
                key={pt.num}
                onClick={() => setActiveSlide(idx)}
                style={{
                  background: isActive ? 'var(--white)' : 'rgba(255, 255, 255, 0.65)',
                  border: `1.5px solid ${isActive ? 'var(--kairo-green)' : 'var(--border-color)'}`,
                  borderRadius: 16,
                  padding: '24px 20px',
                  textAlign: 'left',
                  boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-xs)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--kairo-green)' }}>{pt.num}</span>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--mint-mist)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color="var(--deep-evergreen)" />
                  </div>
                </div>

                <h3 className="card-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8, fontSize: '17px' }}>
                  {pt.title}
                </h3>
                <p className="supporting-text" style={{ fontSize: '14px', margin: 0, lineHeight: 1.55 }}>
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Primary CTA: "Get started" */}
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <button
            onClick={onGetStarted}
            className="btn btn-primary btn-lg"
            style={{ padding: '18px 48px', fontSize: '19px', boxShadow: 'var(--shadow-md)' }}
          >
            Get started
            <ArrowRight size={22} />
          </button>
          
          <span className="small-metadata" style={{ color: 'var(--secondary-text)' }}>
            Join as a Customer to solve a problem, or an Artisan to build your digital identity.
          </span>
        </div>

      </div>
    </div>
  );
}
