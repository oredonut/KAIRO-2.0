import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, ChevronLeft, KeyRound, Sparkles } from 'lucide-react';

export default function AdminLogin({ onAdminAuthSuccess, onBack }) {
  const [email, setEmail] = useState('admin@kairo.com');
  const [password, setPassword] = useState('admin123');
  const [code2FA, setCode2FA] = useState('849 201');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdminAuthSuccess({
      id: 'admin-001',
      name: 'KAIRO Systems Admin',
      email: email,
      role: 'admin'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dark-forest)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '32px 24px',
      color: 'var(--white)'
    }}>
      <div className="page-wrapper" style={{ maxWidth: 480 }}>
        
        {/* Back link */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24
            }}
          >
            <ChevronLeft size={16} /> Back to KAIRO Application
          </button>
        )}

        {/* Card */}
        <div className="card card-lg animate-slide-up" style={{
          background: 'var(--white)',
          color: 'var(--main-text)',
          boxShadow: 'var(--shadow-xl)',
          padding: '40px 36px'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'var(--deep-evergreen)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', boxShadow: 'var(--shadow-sm)'
            }}>
              <Shield size={26} color="var(--warm-gold)" />
            </div>

            <div className="badge badge-gold" style={{ marginBottom: 8 }}>
              RESTRICTED SYSTEM
            </div>
            
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--deep-evergreen)', margin: 0, marginBottom: 6 }}>
              KAIRO Admin
            </h1>
            <p className="supporting-text" style={{ fontSize: '15px' }}>
              Secure administrator access & marketplace operations.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="label">Admin Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--secondary-text)" style={{ position: 'absolute', left: 14, top: 16 }} />
                <input
                  type="email"
                  className="input"
                  style={{ paddingLeft: 44 }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--secondary-text)" style={{ position: 'absolute', left: 14, top: 16 }} />
                <input
                  type="password"
                  className="input"
                  style={{ paddingLeft: 44 }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="label" style={{ margin: 0 }}>2FA Security Code</label>
                <span className="small-metadata" style={{ color: 'var(--kairo-green)', fontWeight: 600 }}>Active Token</span>
              </div>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} color="var(--secondary-text)" style={{ position: 'absolute', left: 14, top: 16 }} />
                <input
                  type="text"
                  className="input"
                  style={{ paddingLeft: 44, letterSpacing: '0.1em', fontWeight: 700 }}
                  value={code2FA}
                  onChange={e => setCode2FA(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-dark btn-lg btn-block" style={{ marginTop: 8 }}>
              Sign In to Admin Workspace
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: 24, padding: 12, background: 'var(--warm-cream)', borderRadius: 10, textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '13px', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Shield size={14} color="var(--deep-evergreen)" />
              <span>Encrypted administrative session active</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
