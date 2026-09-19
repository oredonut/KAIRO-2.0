import React, { useState } from 'react';
import { Users, Wrench, ShieldCheck, ArrowRight, ChevronLeft, Check } from 'lucide-react';
import KairoIcon, { KairoLogo } from '../components/KairoIcon';

const ROLES = [
  {
    id: 'customer',
    title: 'Customer',
    headline: 'I have a problem to solve',
    description: 'Find someone to solve your problem.',
    Icon: Users,
    features: [
      'Describe problems in text or voice',
      'AI matching to exact required skill',
      'Compare verified work samples & reviews',
      'Direct enquiry handoff & transparent status'
    ]
  },
  {
    id: 'artisan',
    title: 'Artisan',
    headline: 'I offer skilled services',
    description: 'Get discovered, build your professional profile, and receive relevant enquiries.',
    Icon: Wrench,
    features: [
      'Showcase portfolio & work samples',
      'Receive pre-clarified job requests',
      'Build verified reputation in your area',
      'Accept or decline enquiries with 1-click'
    ]
  }
];

export default function RolePicker({ onSelectRole, onBack }) {
  const [selected, setSelected] = useState('customer');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--warm-cream)',
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 24px',
      position: 'relative'
    }}>
      {/* Top Bar */}
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--secondary-text)', fontSize: '15px', fontWeight: 600
          }}
        >
          <ChevronLeft size={18} /> Back
        </button>

        <KairoLogo size={32} />
      </div>

      {/* Main Content */}
      <div className="page-wrapper" style={{ flex: 1, maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }} className="animate-slide-up">
          <div className="ai-chip" style={{ marginBottom: 12 }}>
            <KairoIcon size={14} /> ONBOARDING
          </div>
          <h1 className="page-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 12 }}>
            How are you joining KAIRO?
          </h1>
          <p className="supporting-text" style={{ fontSize: '17px', maxWidth: 520, margin: '0 auto' }}>
            Select your account type to personalize your experience.
          </p>
        </div>

        {/* Visually Balanced Role Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 40 }}>
          {ROLES.map(r => {
            const isSelected = selected === r.id;
            const Icon = r.Icon;
            return (
              <div
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`card card-interactive animate-fade-in ${isSelected ? 'card-selected' : ''}`}
                style={{
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  minHeight: 440,
                  position: 'relative'
                }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute', top: 16, right: 16,
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--deep-evergreen)', color: 'var(--white)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Check size={16} />
                  </div>
                )}

                <div>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: isSelected ? 'var(--mint-mist)' : 'var(--warm-cream)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20, border: '1px solid var(--border-color)'
                  }}>
                    <Icon size={26} color={isSelected ? 'var(--deep-evergreen)' : 'var(--secondary-text)'} />
                  </div>

                  <span className="badge badge-muted" style={{ marginBottom: 8 }}>{r.title}</span>
                  <h3 className="section-heading" style={{ color: 'var(--main-text)', marginBottom: 8 }}>
                    {r.headline}
                  </h3>
                  <p className="supporting-text" style={{ fontSize: '15px', marginBottom: 24, minHeight: 48 }}>
                    {r.description}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 12 }}>
                      What you get:
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {r.features.map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '14px', color: 'var(--main-text)' }}>
                          <ShieldCheck size={16} color="var(--kairo-green)" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => onSelectRole(selected)}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', maxWidth: 360, fontSize: '18px' }}
          >
            Continue as {selected === 'customer' ? 'Customer' : 'Artisan'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
