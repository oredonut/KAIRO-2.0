import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ShieldCheck, Mail, Lock, User, Phone, MapPin, Briefcase } from 'lucide-react';
import KairoIcon, { KairoLogo } from '../components/KairoIcon';

export default function AuthPage({ role = 'customer', onAuthSuccess, onBack }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'

  // Input fields MUST START EMPTY (Section 5 & 7 requirement!)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    businessName: '',
    location: '',
    serviceArea: ''
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
      email: formData.email || (role === 'customer' ? 'chidi@example.com' : 'emeka@example.com'),
      phone: formData.phone || '0803 123 4567',
      location: formData.location || 'Yaba, Lagos',
      serviceArea: formData.serviceArea || 'Yaba, Surulere',
      businessName: formData.businessName || '',
      role: role,
      isExistingUser: mode === 'login' // Returning user sign-in vs new account creation!
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
              <div style={{ marginBottom: 32 }}>
                <KairoLogo size={36} textStyle={{ color: 'var(--white)' }} />
              </div>

              <div className="badge badge-gold" style={{ marginBottom: 20 }}>
                {role === 'customer' ? 'Customer Account' : 'Artisan Professional Account'}
              </div>

              <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, color: 'var(--white)', lineHeight: 1.25, marginBottom: 20 }}>
                {role === 'customer'
                  ? 'Got a problem? KAIRO helps you find the person who can solve it.'
                  : 'Your skill becomes your digital identity.'}
              </h2>

              <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '16px', lineHeight: 1.65, marginBottom: 32 }}>
                {role === 'customer'
                  ? 'Connect with verified local professionals with genuine proof of work, ratings, and clear match reasoning.'
                  : 'Build a professional digital identity, showcase your work, receive relevant enquiries, and grow your reputation.'}
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 20 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
                <ShieldCheck size={18} color="var(--warm-gold)" />
                <span>Verified profiles, ratings & evidence-based trust.</span>
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
                  ? `Enter your credentials to access your ${role} workspace.`
                  : `Join KAIRO as a ${role} to build your digital identity.`}
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
                      placeholder="Enter your full name"
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
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {mode === 'signup' && role === 'artisan' && (
                <>
                  <div>
                    <label className="label">Business Name (Optional)</label>
                    <div style={{ position: 'relative' }}>
                      <Briefcase size={18} color="var(--secondary-text)" style={{ position: 'absolute', left: 14, top: 16 }} />
                      <input
                        type="text"
                        name="businessName"
                        className="input"
                        style={{ paddingLeft: 44 }}
                        placeholder="Enter business name if applicable"
                        value={formData.businessName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Primary Location (Area / City)</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={18} color="var(--secondary-text)" style={{ position: 'absolute', left: 14, top: 16 }} />
                      <input
                        type="text"
                        name="location"
                        className="input"
                        style={{ paddingLeft: 44 }}
                        placeholder="e.g. Yaba, Lagos"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

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
                      placeholder="Enter your phone number"
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 10 }}>
                {mode === 'login' ? 'Sign In to Workspace' : 'Create Account & Build Profile'}
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
