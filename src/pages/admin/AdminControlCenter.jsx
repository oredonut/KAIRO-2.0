import React, { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, Users, FileText, Clock, Search, TrendingUp, DollarSign, Flag, RefreshCw, X, ShieldAlert, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { ARTISANS } from '../../data/mockData';

export default function AdminControlCenter({ onAdminSignOut }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'verification' | 'users' | 'moderation' | 'revenue' | 'categories'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtisanReview, setSelectedArtisanReview] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null); // { action, item, onConfirm }

  // Pending verification cases
  const [pendingVerifications, setPendingVerifications] = useState([
    {
      id: 'ver-1',
      artisanId: 'art-1',
      name: 'Emeka Generator Repairs',
      ownerName: 'Emeka Okafor',
      category: 'Generator Repair Technician',
      location: 'Yaba, Lagos',
      submittedDoc: 'National Identity Number (NIN) Slip',
      workSamplesCount: 18,
      status: 'pending',
      artisanProvided: {
        yearsExp: '7 Years',
        skills: 'Generator diagnostics, Carburetor servicing, Shutdown fault repair',
        brands: 'Honda, Sumec Firman, Tiger'
      }
    },
    {
      id: 'ver-2',
      artisanId: 'art-3',
      name: 'TechDoctor Tunde',
      ownerName: 'Tunde Bakare',
      category: 'Device Repair Technician',
      location: 'Computer Village, Ikeja',
      submittedDoc: 'Driver\'s License Card',
      workSamplesCount: 31,
      status: 'pending',
      artisanProvided: {
        yearsExp: '6 Years',
        skills: 'Screen replacement, Charging port soldering, Battery repair',
        brands: 'Apple iPhone, Samsung Galaxy, HP'
      }
    }
  ]);

  // Moderation cases (Point 39)
  const [reports, setReports] = useState([
    {
      id: 'rep-101',
      type: 'review',
      target: 'Review on Fatimah Couture',
      reporter: 'Verified Customer (Blessing O.)',
      reason: 'AI flagged potentially suspicious language in review text.',
      content: '"She\'s the best tailor in all of Nigeria! Unbelievable speed."',
      status: 'flagged_by_ai',
      aiNote: 'AI flagged for review: Excessive praise check.'
    }
  ]);

  const handleApproveVerification = (item) => {
    setConfirmationModal({
      title: `Approve Verification for ${item.name}?`,
      desc: 'This will grant the KAIRO Verified Identity badge on the artisan\'s public profile.',
      confirmLabel: 'Approve & Grant Badge',
      onConfirm: () => {
        setPendingVerifications(prev => prev.filter(v => v.id !== item.id));
        setConfirmationModal(null);
      }
    });
  };

  const handleRejectVerification = (item) => {
    setConfirmationModal({
      title: `Reject Verification for ${item.name}?`,
      desc: 'The artisan will be notified to resubmit a clear government ID document.',
      confirmLabel: 'Reject Submission',
      isDanger: true,
      onConfirm: () => {
        setPendingVerifications(prev => prev.filter(v => v.id !== item.id));
        setConfirmationModal(null);
      }
    });
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingBottom: 80 }}>
      
      {/* ── ADMIN TOP BAR ─────────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--dark-forest)', color: 'var(--white)', padding: '36px 24px 28px' }}>
        <div className="page-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="badge badge-gold" style={{ marginBottom: 8 }}>
                SECURE PLATFORM OPERATIONS
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--white)', margin: 0 }}>
                KAIRO Admin Operational Control Center
              </h1>
            </div>

            <button onClick={onAdminSignOut} className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'var(--white)' }}>
              Sign Out Admin
            </button>
          </div>
        </div>
      </div>

      {/* ── ADMIN NAVIGATION TABS (Point 36) ──────────────────────────────────────── */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 64, zIndex: 90 }}>
        <div className="page-wrapper" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {[
            { id: 'dashboard', label: 'Dashboard Overview' },
            { id: 'verification', label: `Verification Queue (${pendingVerifications.length})` },
            { id: 'users', label: 'Users & Artisans' },
            { id: 'moderation', label: `Moderation & Reports (${reports.length})` },
            { id: 'revenue', label: 'Revenue & KAIRO Pro' },
            { id: 'categories', label: 'Service Categories' },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '16px 20px',
                  fontSize: '15px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--deep-evergreen)' : 'var(--secondary-text)',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '3px solid var(--deep-evergreen)' : '3px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="page-wrapper" style={{ paddingTop: 32 }}>

        {/* ── 1. DASHBOARD OVERVIEW (Point 35) ──────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            
            {/* FIRST SECTION: NEEDS YOUR ATTENTION */}
            <div className="card card-lg" style={{ background: 'var(--gold-bg)', border: '1.5px solid var(--gold-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <AlertTriangle size={22} color="var(--warning)" />
                <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', margin: 0 }}>
                  Needs Your Attention
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <AttentionBox label="Artisans Awaiting Verification" count={pendingVerifications.length} onClick={() => setActiveTab('verification')} />
                <AttentionBox label="Reported Profiles / Reviews" count={reports.length} onClick={() => setActiveTab('moderation')} />
                <AttentionBox label="Flagged Work Samples" count="0" onClick={() => setActiveTab('moderation')} />
                <AttentionBox label="Customer Escalations" count="0" onClick={() => setActiveTab('moderation')} />
              </div>
            </div>

            {/* PLATFORM OVERVIEW METRICS */}
            <div>
              <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 16 }}>
                Platform Operational Overview
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <MetricBox title="Total Artisans" value="142" subtitle="118 verified active" />
                <MetricBox title="Total Customers" value="890" subtitle="Registered accounts" />
                <MetricBox title="Enquiries Processed" value="412" subtitle="89% match acceptance" />
                <MetricBox title="Completed Jobs" value="380" subtitle="94% completion rate" />
                <MetricBox title="Average Customer Rating" value="4.8 ★" subtitle="Across all categories" />
              </div>
            </div>

            {/* REVENUE SUMMARY & MARKETPLACE HEALTH */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
              
              <div className="card card-lg">
                <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 14 }}>
                  Revenue Activity
                </h3>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--deep-evergreen)', marginBottom: 4 }}>
                  ₦102,000 <span style={{ fontSize: '14px', color: 'var(--secondary-text)', fontWeight: 600 }}>/ month</span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--secondary-text)', marginBottom: 16 }}>
                  34 Active KAIRO Pro Subscribers (₦3,000/mo)
                </div>
                <div className="small-metadata" style={{ fontStyle: 'italic', background: 'var(--warm-cream)', padding: 10, borderRadius: 8 }}>
                  Future forecast: Booking fee revenue represented separately.
                </div>
              </div>

              <div className="card card-lg">
                <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 14 }}>
                  Marketplace Category Health
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <CategoryHealthRow name="Generator Repair" count="186 enquiries" status="High Demand" />
                  <CategoryHealthRow name="Device Repair" count="124 enquiries" status="Steady" />
                  <CategoryHealthRow name="Clothing Alterations" count="68 enquiries" status="Steady" />
                  <CategoryHealthRow name="Tailoring" count="34 enquiries" status="Growing" />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ── 2. VERIFICATION WORKSPACE (Point 37 & 38) ──────────────────────────────── */}
        {activeTab === 'verification' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1040 }}>
            <div>
              <h2 className="page-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 6 }}>
                Artisan Verification Workspace
              </h2>
              <p className="supporting-text">
                Visually inspect artisan submissions and separate <strong>Artisan Provided</strong> claims from <strong>KAIRO Verified</strong> badges.
              </p>
            </div>

            {pendingVerifications.map(item => (
              <div key={item.id} className="card card-lg" style={{ boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
                  <div>
                    <span className="badge badge-gold" style={{ marginBottom: 6 }}>PENDING ADMIN REVIEW</span>
                    <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--main-text)', margin: 0 }}>
                      {item.name} ({item.ownerName})
                    </h3>
                    <div style={{ fontSize: '15px', color: 'var(--secondary-text)', marginTop: 4 }}>
                      {item.category} · Location: {item.location}
                    </div>
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--deep-evergreen)', background: 'var(--mint-mist)', padding: '6px 14px', borderRadius: 100 }}>
                    Doc Submitted: {item.submittedDoc}
                  </div>
                </div>

                {/* DEMARCATION BETWEEN ARTISAN PROVIDED VS KAIRO VERIFIED (Point 37) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
                  
                  <div style={{ background: 'var(--warm-cream)', padding: 18, borderRadius: 14, border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 10 }}>
                      ARTISAN PROVIDED INFORMATION
                    </div>
                    <div style={{ fontSize: '14.5px', lineHeight: 1.6 }}>
                      <div><strong>Stated Experience:</strong> {item.artisanProvided.yearsExp}</div>
                      <div><strong>Skills Claimed:</strong> {item.artisanProvided.skills}</div>
                      <div><strong>Brands Handled:</strong> {item.artisanProvided.brands}</div>
                    </div>
                  </div>

                  <div style={{ background: 'var(--mint-mist)', padding: 18, borderRadius: 14, border: '1.5px solid var(--soft-sage)' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--deep-evergreen)', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ShieldCheck size={16} color="var(--kairo-green)" /> KAIRO AUDIT & EVIDENCE
                    </div>
                    <div style={{ fontSize: '14.5px', lineHeight: 1.6 }}>
                      <div>✓ Phone OTP Check: Passed</div>
                      <div>✓ Work Samples Uploaded: {item.workSamplesCount} Before/After Photos</div>
                      <div>✓ Document Match: NIN Name matches profile</div>
                    </div>
                  </div>

                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
                  <button onClick={() => handleApproveVerification(item)} className="btn btn-primary">
                    <CheckCircle2 size={16} /> Approve & Grant Verified Badge
                  </button>
                  <button onClick={() => handleRejectVerification(item)} className="btn btn-danger">
                    Reject Document
                  </button>
                  <button className="btn btn-ghost">
                    Request Clarification
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 3. USER MANAGEMENT (Point 41) ─────────────────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 className="page-heading" style={{ color: 'var(--deep-evergreen)', margin: 0 }}>
                  Platform User Management
                </h2>
                <p className="supporting-text" style={{ marginTop: 4 }}>
                  Manage registered artisans and customer accounts.
                </p>
              </div>

              <div style={{ position: 'relative', width: 300 }}>
                <Search size={16} color="var(--secondary-text)" style={{ position: 'absolute', left: 12, top: 14 }} />
                <input
                  className="input"
                  placeholder="Search by name, service, location..."
                  style={{ paddingLeft: 38, fontSize: '14.5px' }}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="card card-lg" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: 16, background: 'var(--warm-cream)', padding: '16px 24px', fontWeight: 700, fontSize: '14px', borderBottom: '1px solid var(--border-color)' }}>
                <div>Artisan Name / Business</div>
                <div>Service</div>
                <div>Location</div>
                <div>Verification</div>
                <div>Completed Jobs</div>
              </div>

              {ARTISANS.map(a => (
                <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: 16, padding: '16px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '14.5px', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--main-text)' }}>{a.name}</div>
                  <div>{a.categoryLabel}</div>
                  <div>{a.location}</div>
                  <div>
                    <span className="badge badge-verified">✓ Verified</span>
                  </div>
                  <div>{a.completedJobs} Jobs ({a.rating} ★)</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. MODERATION & REPORTS (Point 39 & 44) ────────────────────────────────── */}
        {activeTab === 'moderation' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960 }}>
            <div>
              <h2 className="page-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 6 }}>
                Content Moderation & Reports
              </h2>
              <p className="supporting-text">
                Review AI-flagged content and user-submitted reports with human administrative oversight.
              </p>
            </div>

            {reports.map(rep => (
              <div key={rep.id} className="card card-lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <span className="badge badge-gold" style={{ marginBottom: 6 }}>
                      <Sparkles size={13} /> {rep.aiNote}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--main-text)', margin: 0 }}>
                      Target: {rep.target}
                    </h3>
                  </div>
                </div>

                <div style={{ background: 'var(--warm-cream)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 20 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>Flagged Content:</div>
                  <div style={{ fontSize: '15px', color: 'var(--main-text)', fontStyle: 'italic', marginTop: 4 }}>{rep.content}</div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-primary btn-sm">Approve Content</button>
                  <button className="btn btn-danger btn-sm">Remove Content</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 5. REVENUE & PRO SUBSCRIBERS (Point 40) ───────────────────────────────── */}
        {activeTab === 'revenue' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 960 }}>
            <div>
              <h2 className="page-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 6 }}>
                Revenue & Subscription Management
              </h2>
              <p className="supporting-text">
                Track KAIRO Pro monthly subscription revenue and future transaction forecasts.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <div className="card card-lg">
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>Current Monthly Pro Revenue</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--deep-evergreen)', margin: '8px 0' }}>₦102,000</div>
                <div className="small-metadata">34 active Pro subscribers at ₦3,000/mo</div>
              </div>

              <div className="card card-lg" style={{ background: 'var(--warm-cream)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>Future Transaction Forecast</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--secondary-text)', margin: '8px 0' }}>Coming Soon</div>
                <div className="small-metadata">Booking & escrow platform fee model</div>
              </div>
            </div>
          </div>
        )}

        {/* ── 6. SERVICE CATEGORIES (Point 42) ───────────────────────────────────────── */}
        {activeTab === 'categories' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 className="page-heading" style={{ color: 'var(--deep-evergreen)', margin: 0 }}>
                  Service Categories Management
                </h2>
                <p className="supporting-text" style={{ marginTop: 4 }}>
                  Active categories powering KAIRO problem-to-service matching.
                </p>
              </div>
              <button className="btn btn-primary">+ Add Category</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              {['Generator Repair', 'Device Repair', 'Tailoring', 'Clothing Alterations'].map(cat => (
                <div key={cat} className="card card-lg">
                  <span className="badge badge-green" style={{ marginBottom: 8 }}>ACTIVE</span>
                  <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', margin: 0 }}>{cat}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      {confirmationModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(11, 51, 32, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="card card-lg animate-scale-in" style={{ maxWidth: 460, width: '100%', padding: 28 }}>
            <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>
              {confirmationModal.title}
            </h3>
            <p className="supporting-text" style={{ fontSize: '15px', marginBottom: 24 }}>
              {confirmationModal.desc}
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setConfirmationModal(null)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button onClick={confirmationModal.onConfirm} className={`btn ${confirmationModal.isDanger ? 'btn-danger' : 'btn-primary'}`} style={{ flex: 1 }}>
                {confirmationModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function AttentionBox({ label, count, onClick }) {
  return (
    <div onClick={onClick} className="card-interactive" style={{ padding: 16, background: 'var(--white)' }}>
      <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--deep-evergreen)' }}>{count}</div>
      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--main-text)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function MetricBox({ title, value, subtitle }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--main-text)', margin: '6px 0 2px' }}>{value}</div>
      <div className="small-metadata">{subtitle}</div>
    </div>
  );
}

function CategoryHealthRow({ name, count, status }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--warm-cream)', borderRadius: 10, border: '1px solid var(--border-color)' }}>
      <div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--main-text)' }}>{name}</div>
        <div style={{ fontSize: '13px', color: 'var(--secondary-text)' }}>{count}</div>
      </div>
      <span className="badge badge-green">{status}</span>
    </div>
  );
}
