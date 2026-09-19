import React, { useState } from 'react';
import { Star, MapPin, Clock, CheckCircle2, Phone, X, ArrowRight, Sparkles, Briefcase, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { ARTISANS } from '../../data/mockData';

const DEMO_ARTISAN = ARTISANS[0]; // Emeka

const DEMO_ENQUIRIES = [
  {
    id: 'enq-1',
    customerName: 'Chidi N.',
    problem: 'My generator dey start but e go just off after five minutes.',
    structured: { service: 'Generator Repair', brand: 'Honda', location: 'Yaba, Lagos', when: 'Today' },
    matchReasons: ['Specializes in generator shutdown faults', '18 relevant work samples', 'Available today'],
    status: 'new',
    time: 'Just now',
  },
  {
    id: 'enq-2',
    customerName: 'Mrs. Adeyemi',
    problem: 'Generator smoke dey come out from exhaust while running.',
    structured: { service: 'Generator Repair', brand: 'Sumec Firman', location: 'Surulere, Lagos', when: 'Today' },
    matchReasons: ['Generator engine specialist', 'Serves Surulere area'],
    status: 'new',
    time: '14 mins ago',
  },
];

export default function ArtisanDashboard({ currentUser }) {
  const artisan = DEMO_ARTISAN;
  const [enquiries, setEnquiries] = useState(DEMO_ENQUIRIES);
  const [accepted, setAccepted] = useState([]);
  const [activeTab, setActiveTab] = useState('enquiries');

  const handleAccept = (enq) => {
    setAccepted(prev => [...prev, enq]);
  };
  const handleDecline = (enq) => {
    setEnquiries(prev => prev.filter(e => e.id !== enq.id));
  };

  const artisanName = currentUser?.name || artisan.ownerName;

  const tabs = [
    { id: 'enquiries', label: `Enquiries (${enquiries.length})` },
    { id: 'reputation', label: 'Reputation & Evidence' },
    { id: 'profile', label: 'My Profile' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: 60 }}>
      
      {/* Header Banner */}
      <div style={{ background: 'var(--deep-evergreen)', padding: '40px 24px 32px', color: 'var(--white)' }}>
        <div className="page-wrapper">
          <div style={{ fontSize: '13.5px', color: 'var(--warm-gold)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
            ARTISAN PARTNER PORTAL
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--white)', margin: 0, marginBottom: 16 }}>
            Good day, {artisanName.split(' ')[0]}.
          </h1>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {[
              { label: 'New enquiries', value: enquiries.length, color: 'var(--warm-gold)' },
              { label: 'Rating', value: `${artisan.rating} ★`, color: 'var(--warm-gold)' },
              { label: 'Completed jobs', value: artisan.completedJobs, color: 'var(--white)' },
              { label: 'Verified work samples', value: artisan.workSamplesCount, color: 'var(--white)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 20px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.78)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-color)', sticky: true, top: 64, zIndex: 50 }}>
        <div className="page-wrapper" style={{ display: 'flex', gap: 12 }}>
          {tabs.map(tab => (
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

      <div className="page-wrapper" style={{ paddingTop: 32, maxWidth: 840 }}>

        {/* Enquiries tab */}
        {activeTab === 'enquiries' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {enquiries.length === 0 ? (
              <div className="card card-lg" style={{ textAlign: 'center', padding: '60px 24px' }}>
                <Clock size={40} color="var(--secondary-text)" style={{ marginBottom: 12 }} />
                <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>
                  No new pending enquiries
                </h3>
                <p className="supporting-text">
                  KAIRO notifies you automatically when a customer's problem matches your specific skill set.
                </p>
              </div>
            ) : (
              enquiries.map(enq => (
                <div key={enq.id} className="card card-lg" style={{ boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <span className="badge badge-gold" style={{ marginBottom: 8 }}>NEW MATCHED ENQUIRY</span>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--main-text)', margin: 0 }}>
                        {enq.structured.service}
                      </h3>
                      <div style={{ fontSize: '14px', color: 'var(--secondary-text)', marginTop: 4 }}>
                        Customer: <strong>{enq.customerName}</strong> · Location: {enq.structured.location}
                      </div>
                    </div>
                    <span className="small-metadata">{enq.time}</span>
                  </div>

                  <div style={{ background: 'var(--warm-cream)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 16 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 4 }}>
                      Customer Problem:
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--main-text)', fontStyle: 'italic' }}>
                      "{enq.problem}"
                    </div>
                  </div>

                  <div className="why-panel" style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-evergreen)', textTransform: 'uppercase', marginBottom: 6 }}>
                      Why KAIRO matched you:
                    </div>
                    {enq.matchReasons.map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '14px', color: 'var(--main-text)' }}>
                        <CheckCircle2 size={15} color="var(--kairo-green)" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => handleAccept(enq)} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                      Accept Enquiry & View Phone
                      <ArrowRight size={18} />
                    </button>
                    <button onClick={() => handleDecline(enq)} className="btn btn-ghost btn-lg" style={{ color: 'var(--error)' }}>
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Reputation tab */}
        {activeTab === 'reputation' && (
          <div className="card card-lg">
            <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 16 }}>
              KAIRO Reputation & Evidence Score
            </h3>
            <p className="body-text" style={{ marginBottom: 20 }}>
              Your profile is verified with identity checks and {artisan.workSamplesCount} proof-of-work samples.
            </p>
            <div style={{ background: 'var(--mint-mist)', border: '1px solid var(--soft-sage)', padding: 20, borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, color: 'var(--deep-evergreen)', marginBottom: 8 }}>
                <TrendingUp size={18} /> KAIRO Match Optimization Tip
              </div>
              <p className="supporting-text" style={{ margin: 0 }}>
                Customers in Yaba are frequently requesting <strong>generator shutdown & carburetor maintenance</strong>. Adding 2 more work samples will increase your top-match frequency.
              </p>
            </div>
          </div>
        )}

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="card card-lg">
            <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 12 }}>
              Artisan Profile Details
            </h3>
            <p className="body-text">
              Name: <strong>{artisan.name}</strong> ({artisan.ownerName})<br />
              Service: <strong>{artisan.categoryLabel}</strong><br />
              Location: <strong>{artisan.location}</strong><br />
              Experience: <strong>{artisan.yearsExp} Years</strong>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
