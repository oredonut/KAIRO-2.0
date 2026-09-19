import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, Sparkles, ShieldCheck, Mail, Lock, User, Phone, CheckCircle2 } from 'lucide-react';

export default function AuthPage({ role = 'customer', onAuthSuccess, onBack }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [formData, setFormData] = useState({
    name: role === 'customer' ? 'Chidi Okonkwo' : 'Emeka Okafor',
    email: role === 'customer' ? 'chidi@example.com' : 'emeka@example.com',
    phone: '0803 123 4567',
    password: 'password123',
    serviceType: 'Generator Repair',
    location: 'Yaba, Lagos'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthSuccess({
      id: 'usr-' + Date.now(),
      name: formData.name || (role === 'customer' ? 'Chidi Okonkwo' : 'Emeka Okafor'),
      email: formData.email,
      phone: formData.phone,
      role: role
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--warm-cream)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '32px 24px'
    }}>
      <div className="page-wrapper" style={{ maxWidth: 1100 }}>
        
        {/* Top Back Link */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--secondary-text)', fontSize: '15px', fontWeight: 600
            }}
          >
            <ChevronLeft size={18} /> Back to role selection
          </button>
        </div>

        {/* Auth Split Card Layout */}
        <div className="card card-lg animate-slide-up" style={{
          padding: 0,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)'
        }}>
          
          {/* Left Column: Brand Statement */}
          <div style={{
            background: 'var(--deep-evergreen)',
            padding: '48px 40px',
            color: 'var(--white)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            position: 'relative'
          }}>
            {/* Ambient Lighting */}
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 260, height: 260,
              borderRadius: '50%', background: 'rgba(33, 122, 75, 0.35)', filter: 'blur(50px)'
            }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Sparkles size={20} color="var(--warm-gold)" />
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.03em' }}>
                  KAIRO
                </span>
              </div>

              <div className="badge badge-gold" style={{ marginBottom: 20 }}>
                {role === 'customer' ? 'Customer Account' : 'Artisan Partner'}
              </div>

              <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, color: 'var(--white)', lineHeight: 1.25, marginBottom: 20 }}>
                Got a problem?<br/>
                KAIRO helps you find the person who can solve it.
              </h2>

              <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '16px', lineHeight: 1.65, marginBottom: 32 }}>
                {role === 'customer'
                  ? 'Connect with verified local professionals with genuine proof of work, ratings, and clear match reasoning.'
                  : 'Get discovered by customers who need your exact skills. Receive pre-clarified job requests.'}
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 20 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
                <ShieldCheck size={18} color="var(--warm-gold)" />
                <span>Verified profiles, ratings & proof of work.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Form */}
          <div style={{ padding: '48px 40px', background: 'var(--white)' }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--deep-evergreen)', marginBottom: 8 }}>
                {mode === 'login' ? 'Sign in to KAIRO' : 'Create your account'}
              </h2>
              <p className="supporting-text">
                {mode === 'login'
                  ? `Enter your details to access your ${role} account.`
                  : `Join KAIRO as a ${role} in under 2 minutes.`}
              </p>
            </div>

            {/* Toggle Mode */}
            <div style={{
              display: 'flex', background: 'var(--warm-cream)',
              padding: 4, borderRadius: 12, marginBottom: 28, border: '1px solid var(--border-color)'
            }}>
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: 'none',
                  background: mode === 'login' ? 'var(--white)' : 'transparent',
                  color: mode === 'login' ? 'var(--deep-evergreen)' : 'var(--secondary-text)',
                  fontWeight: mode === 'login' ? 700 : 500, fontSize: '14px', cursor: 'pointer',
                  boxShadow: mode === 'login' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: 'none',
                  background: mode === 'signup' ? 'var(--white)' : 'transparent',
                  color: mode === 'signup' ? 'var(--deep-evergreen)' : 'var(--secondary-text)',
                  fontWeight: mode === 'signup' ? 700 : 500, fontSize: '14px', cursor: 'pointer',
                  boxShadow: mode === 'signup' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {mode === 'signup' && (
                <div>
                  <label className="label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="var(--secondary-text)" style={{ position: 'absolute', left: 14, top: 16 }} />
                    <input
                      type="text"
                      name="name"
                      className="input"
                      style={{ paddingLeft: 44 }}
                      placeholder="e.g. Chidi Okonkwo"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--secondary-text)" style={{ position: 'absolute', left: 14, top: 16 }} />
                  <input
                    type="email"
                    name="email"
                    className="input"
                    style={{ paddingLeft: 44 }}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} color="var(--secondary-text)" style={{ position: 'absolute', left: 14, top: 16 }} />
                    <input
                      type="tel"
                      name="phone"
                      className="input"
                      style={{ paddingLeft: 44 }}
                      placeholder="0803 123 4567"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--secondary-text)" style={{ position: 'absolute', left: 14, top: 16 }} />
                  <input
                    type="password"
                    name="password"
                    className="input"
                    style={{ paddingLeft: 44 }}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 10 }}>
                {mode === 'login' ? 'Sign In to Account' : 'Create KAIRO Account'}
                <ArrowRight size={18} />
              </button>
            </form>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <span className="small-metadata">
                By continuing, you agree to KAIRO's Terms of Service and Privacy Policy.
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
