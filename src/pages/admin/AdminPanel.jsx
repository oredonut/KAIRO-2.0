import React, { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, Users, FileText, Clock, Search } from 'lucide-react';
import { ARTISANS } from '../../data/mockData';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('verification'); // 'verification' | 'moderation' | 'stats'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ background: 'var(--dark-forest)', padding: '40px 24px 32px', color: 'var(--white)' }}>
        <div className="page-wrapper">
          <div className="badge badge-gold" style={{ marginBottom: 8 }}>ADMINISTRATION PORTAL</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--white)', margin: 0, marginBottom: 8 }}>
            KAIRO Platform Trust & Operations
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '16px', margin: 0 }}>
            Manage artisan identity verification, proof-of-work validation, and marketplace safety.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="page-wrapper" style={{ display: 'flex', gap: 12 }}>
          {[
            { id: 'verification', label: 'Verification Workspace (2 Pending)' },
            { id: 'moderation', label: 'Moderation & Reviews' },
            { id: 'stats', label: 'Marketplace Metrics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 20px',
                fontSize: '15px',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--deep-evergreen)' : 'var(--secondary-text)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid var(--deep-evergreen)' : '3px solid transparent',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="page-wrapper" style={{ paddingTop: 32, maxWidth: 960 }}>
        {activeTab === 'verification' && (
          <div className="card card-lg" style={{ boxShadow: 'var(--shadow-md)' }}>
            <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 16 }}>
              Pending Artisan Verification Queue
            </h3>
            <p className="supporting-text" style={{ marginBottom: 24 }}>
              Verify identity documents and submitted work samples before granting the Verified badge.
            </p>

            {ARTISANS.slice(0, 2).map(artisan => (
              <div key={artisan.id} style={{
                background: 'var(--warm-cream)',
                border: '1px solid var(--border-color)',
                borderRadius: 14,
                padding: 20,
                marginBottom: 16,
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16
              }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--main-text)' }}>
                    {artisan.name} ({artisan.ownerName})
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--secondary-text)' }}>
                    {artisan.categoryLabel} · {artisan.location}
                  </div>
                  <div className="badge badge-green" style={{ marginTop: 6 }}>
                    <Shield size={13} /> {artisan.workSamplesCount} Work Samples Attached
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary btn-sm">
                    <CheckCircle2 size={16} /> Approve & Verify
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    Request Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="card card-lg">
            <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 12 }}>
              Content Moderation
            </h3>
            <p className="supporting-text">All reviews and work samples are within acceptable platform guidelines.</p>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="card card-lg">
            <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 16 }}>
              Marketplace Metrics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div className="stat-card">
                <div className="stat-num">94.2%</div>
                <div className="stat-label">AI Problem Match Accuracy</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">18 mins</div>
                <div className="stat-label">Avg Artisan Response Time</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">4.8 / 5.0</div>
                <div className="stat-label">Average Customer Rating</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
