import React from 'react';
import { User, Mail, Phone, MapPin, Bell, Shield, Bookmark, CheckCircle2, Settings } from 'lucide-react';

export default function CustomerProfilePage({ currentUser, savedCount = 2, completedCount = 1, onSignOut }) {
  const user = currentUser || {
    name: 'Chidi Okonkwo',
    email: 'chidi@example.com',
    phone: '0803 123 4567',
    location: 'Yaba, Lagos'
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: '40px 24px 80px' }}>
      <div className="page-wrapper animate-fade-in" style={{ maxWidth: 880 }}>
        
        {/* Page Heading */}
        <div style={{ marginBottom: 32 }}>
          <span className="badge badge-green" style={{ marginBottom: 8 }}>
            <User size={14} /> ACCOUNT MANAGEMENT
          </span>
          <h1 className="page-heading" style={{ color: 'var(--deep-evergreen)', margin: 0 }}>
            Customer Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className="card card-lg" style={{ marginBottom: 32, boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'var(--deep-evergreen)', color: 'var(--white)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', fontWeight: 800
            }}>
              {user.name?.charAt(0)?.toUpperCase() || 'C'}
            </div>

            <div>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--main-text)', margin: 0 }}>
                {user.name}
              </h2>
              <div style={{ fontSize: '15px', color: 'var(--secondary-text)', marginTop: 4 }}>
                Customer Account · {user.location || 'Yaba, Lagos'}
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '20px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--deep-evergreen)' }}>{savedCount}</div>
              <div style={{ fontSize: '13px', color: 'var(--secondary-text)', fontWeight: 600 }}>Saved Artisans</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--deep-evergreen)' }}>{completedCount}</div>
              <div style={{ fontSize: '13px', color: 'var(--secondary-text)', fontWeight: 600 }}>Completed Jobs</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--kairo-green)' }}>Verified</div>
              <div style={{ fontSize: '13px', color: 'var(--secondary-text)', fontWeight: 600 }}>Account Status</div>
            </div>
          </div>

          {/* Contact Details */}
          <div style={{ paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '15.5px', color: 'var(--main-text)' }}>
              <Mail size={18} color="var(--secondary-text)" />
              <span><strong>Email:</strong> {user.email}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '15.5px', color: 'var(--main-text)' }}>
              <Phone size={18} color="var(--secondary-text)" />
              <span><strong>Phone:</strong> {user.phone || '0803 123 4567'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '15.5px', color: 'var(--main-text)' }}>
              <MapPin size={18} color="var(--secondary-text)" />
              <span><strong>Primary Location:</strong> {user.location || 'Yaba, Lagos'}</span>
            </div>
          </div>
        </div>

        {/* Preferences & Settings */}
        <div className="card card-lg" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 16 }}>
            Preferences & Settings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--main-text)' }}>SMS Notifications</div>
                <div style={{ fontSize: '13.5px', color: 'var(--secondary-text)' }}>Receive instant text alerts when artisans accept requests</div>
              </div>
              <input type="checkbox" defaultChecked style={{ width: 20, height: 20, accentColor: 'var(--kairo-green)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--main-text)' }}>WhatsApp Updates</div>
                <div style={{ fontSize: '13.5px', color: 'var(--secondary-text)' }}>Receive enquiry updates and matches on WhatsApp</div>
              </div>
              <input type="checkbox" defaultChecked style={{ width: 20, height: 20, accentColor: 'var(--kairo-green)' }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
