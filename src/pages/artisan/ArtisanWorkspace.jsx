import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, ShieldCheck, Phone, MessageSquare, ArrowRight, Sparkles, Briefcase, TrendingUp, Image as ImageIcon, CheckCircle2, X, AlertCircle, Lock, Plus, Globe, Trash2, Bell } from 'lucide-react';
import { ARTISANS } from '../../data/mockData';
import { getEnquiriesForArtisan, updateEnquiryStatus, getNotifications } from '../../data/enquiryStore';

const DEMO_ARTISAN = ARTISANS[0]; // Emeka

export default function ArtisanWorkspace({ currentUser }) {
  const artisan = DEMO_ARTISAN;
  const currentArtisanId = currentUser?.id || 'art-1';

  // Navigation Tabs (Point 35 requirement: KAIRO Pro is integrated on Dashboard, NOT a primary nav destination!)
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'enquiries' | 'profile' | 'insights'
  const [showProModal, setShowProModal] = useState(false);
  const [isProSubscriber, setIsProSubscriber] = useState(false);

  // User-Specific Enquiries Store (Point 19 requirement)
  const [enquiries, setEnquiries] = useState(() => getEnquiriesForArtisan(currentArtisanId));
  const [notifications, setNotifications] = useState(() => getNotifications(currentArtisanId));
  const [toastNotification, setToastNotification] = useState(null);

  const [selectedDeclineEnquiry, setSelectedDeclineEnquiry] = useState(null);
  const [declineReason, setDeclineReason] = useState('');

  // Social & Business Links state (Point 15 requirement)
  const [socialLinks, setSocialLinks] = useState([
    { platform: 'Instagram', url: 'https://instagram.com/emekagenerators' },
    { platform: 'Website', url: 'https://emekagenerators.com' }
  ]);
  const [newLinkPlatform, setNewLinkPlatform] = useState('Instagram');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [showAddLink, setShowAddLink] = useState(false);
  const [linkError, setLinkError] = useState('');

  // Work Samples state (Point 31 requirement)
  const [workSamplesList, setWorkSamplesList] = useState(artisan.workSamples || []);
  const [showAddSampleModal, setShowAddSampleModal] = useState(false);
  const [sampleForm, setSampleForm] = useState({ problem: '', work: '', result: '', image: null });

  // Scroll Position Reset Fix (Point 28 requirement)
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  // Real-Time Multi-User Listener (Point 21 requirement)
  useEffect(() => {
    const handleSync = () => {
      const updated = getEnquiriesForArtisan(currentArtisanId);
      setEnquiries(updated);
      setNotifications(getNotifications(currentArtisanId));
    };

    const handleNewNotif = () => {
      const notifs = getNotifications(currentArtisanId);
      setNotifications(notifs);
      if (notifs.length > 0) {
        setToastNotification(notifs[0]);
        setTimeout(() => setToastNotification(null), 5000);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('kairo_enquiries_updated', handleSync);
      window.addEventListener('kairo_notification_received', handleNewNotif);
      window.addEventListener('storage', handleSync);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('kairo_enquiries_updated', handleSync);
        window.removeEventListener('kairo_notification_received', handleNewNotif);
        window.removeEventListener('storage', handleSync);
      }
    };
  }, [currentArtisanId]);

  // Enquiries Handlers
  const handleAcceptEnquiry = (enquiryId) => {
    updateEnquiryStatus(enquiryId, 'accepted');
    setEnquiries(getEnquiriesForArtisan(currentArtisanId));
  };

  const handleDeclineSubmit = () => {
    if (!selectedDeclineEnquiry) return;
    updateEnquiryStatus(selectedDeclineEnquiry.id, 'declined', { declineReason });
    setEnquiries(getEnquiriesForArtisan(currentArtisanId));
    setSelectedDeclineEnquiry(null);
    setDeclineReason('');
  };

  // Social Links Handlers (Point 15)
  const handleAddSocialLink = () => {
    setLinkError('');
    if (!newLinkUrl.trim()) return;
    if (!newLinkUrl.startsWith('http://') && !newLinkUrl.startsWith('https://')) {
      setLinkError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    setSocialLinks(prev => [...prev, { platform: newLinkPlatform, url: newLinkUrl.trim() }]);
    setNewLinkUrl('');
    setShowAddLink(false);
  };

  const handleRemoveSocialLink = (index) => {
    setSocialLinks(prev => prev.filter((_, idx) => idx !== index));
  };

  // Add Work Sample Handler (Point 31)
  const handleSaveNewSample = () => {
    if (!sampleForm.problem.trim()) return;
    const newSampleItem = {
      id: 'ws-' + Date.now(),
      problem: sampleForm.problem.trim(),
      work: sampleForm.work.trim() || 'Servicing & fault repair performed',
      result: sampleForm.result.trim() || 'Restored to full operation',
      image: sampleForm.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&fit=crop'
    };
    setWorkSamplesList(prev => [newSampleItem, ...prev]);
    setSampleForm({ problem: '', work: '', result: '', image: null });
    setShowAddSampleModal(false);
  };

  const artisanName = currentUser?.name || artisan.ownerName;
  const newEnquiriesCount = enquiries.filter(e => e.status === 'new').length;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingBottom: 80 }}>
      
      {/* Real-time In-App Notification Toast */}
      {toastNotification && (
        <div style={{
          position: 'fixed', top: 80, right: 24, zIndex: 300,
          background: 'var(--deep-evergreen)', color: 'var(--white)',
          padding: '16px 20px', borderRadius: 14, boxShadow: 'var(--shadow-xl)',
          display: 'flex', alignItems: 'center', gap: 14, maxWidth: 380,
          border: '1.5px solid var(--warm-gold)'
        }} className="animate-slide-up">
          <Bell size={22} color="var(--warm-gold)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--warm-gold)' }}>{toastNotification.title}</div>
            <div style={{ fontSize: '13px', opacity: 0.9, marginTop: 2 }}>{toastNotification.message}</div>
          </div>
          <button onClick={() => setToastNotification(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── TOP ARTISAN PORTAL HEADER ──────────────────────────────────────────────── */}
      <div style={{ background: 'var(--deep-evergreen)', color: 'var(--white)', padding: '36px 24px 28px' }}>
        <div className="page-wrapper animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--warm-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                ARTISAN PROFESSIONAL WORKSPACE
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--white)', margin: 0 }}>
                Welcome back, {artisanName.split(' ')[0]}
              </h1>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {!isProSubscriber && (
                <button
                  onClick={() => setShowProModal(true)}
                  className="btn btn-gold btn-sm"
                >
                  <Sparkles size={15} /> Explore KAIRO Pro
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PRIMARY NAVIGATION TABS (Point 35: KAIRO Pro is integrated on Dashboard) ── */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 64, zIndex: 90, boxShadow: 'var(--shadow-xs)' }}>
        <div className="page-wrapper" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'enquiries', label: `Enquiries ${newEnquiriesCount > 0 ? `(${newEnquiriesCount})` : ''}` },
            { id: 'profile', label: 'Profile & Reputation' },
            { id: 'insights', label: 'Insights & Demand' },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
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

        {/* ── 1. DASHBOARD TAB (Expanded Vertical Layout - Section 16 & 17) ───────── */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            
            {/* Key Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18 }}>
              <MetricCard title="New Enquiries" value={newEnquiriesCount} highlightColor="var(--kairo-green)" />
              <MetricCard title="Profile Views" value="12" subtitle="This week in Yaba" highlightColor="var(--deep-evergreen)" />
              <MetricCard title="Trust Score" value={`${currentUser?.trustScore || 82} / 100`} highlightColor="var(--deep-evergreen)" subtitle="Evidence Based" />
              <MetricCard title="Completed Jobs" value={artisan.completedJobs || 47} />
              <MetricCard title="Rating" value={`${artisan.rating} ★`} highlightColor="var(--warm-gold)" />
              <MetricCard title="Profile Strength" value={`${currentUser?.profileStrength || 82}%`} subtitle="Completeness" />
            </div>

            {/* INTEGRATED KAIRO PRO SECTION ON DASHBOARD (Point 17) */}
            <div className="card card-lg" style={{ background: 'var(--gold-bg)', border: '1.5px solid var(--gold-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <span className="badge badge-gold" style={{ marginBottom: 8 }}>
                    <Sparkles size={13} /> KAIRO PRO BUSINESS GROWTH
                  </span>
                  <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 6 }}>
                    Grow your visibility and understand your business better.
                  </h3>
                  <div style={{ fontSize: '15px', color: 'var(--main-text)', fontWeight: 600 }}>
                    ₦3,000 / month · Unlock local demand insights, profile view analytics, and AI profile assistants.
                  </div>
                </div>

                <button onClick={() => setShowProModal(true)} className="btn btn-gold btn-lg">
                  Explore KAIRO Pro →
                </button>
              </div>
            </div>

            {/* Actionable Profile Improvement Suggestions */}
            <div className="card card-lg" style={{ background: 'var(--mint-mist)', border: '1.5px solid var(--soft-sage)' }}>
              <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 12 }}>
                💡 Actionable Profile Improvements
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <ImprovementBox title="Add 2 More Work Samples" desc="Profiles with more work samples receive higher customer enquiry conversions." action="Add Sample" onAction={() => handleTabChange('profile')} />
                <ImprovementBox title="Verify Government Identity" desc="Complete NIN or Driver's licence check to earn the Verified badge." action="Verify ID" onAction={() => handleTabChange('profile')} />
              </div>
            </div>

            {/* Recent Enquiries Preview (User-Specific Only!) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)' }}>Recent Direct Enquiries</h3>
                <button onClick={() => handleTabChange('enquiries')} style={{ background: 'none', border: 'none', color: 'var(--kairo-green)', fontWeight: 600, cursor: 'pointer', fontSize: '15px' }}>
                  View All Enquiries →
                </button>
              </div>

              {enquiries.length === 0 ? (
                <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--secondary-text)' }}>
                  No enquiries received yet for your account. Complete your profile to build local discovery.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {enquiries.slice(0, 2).map(enq => (
                    <EnquiryItemCard key={enq.id} enquiry={enq} onAccept={() => handleAcceptEnquiry(enq.id)} onDecline={() => setSelectedDeclineEnquiry(enq)} />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── 2. ENQUIRIES TAB (User-Specific Only! Section 19) ────────────────────── */}
        {activeTab === 'enquiries' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960 }}>
            <div>
              <h2 className="page-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 6 }}>
                Direct Customer Enquiries
              </h2>
              <p className="supporting-text">
                Enquiries directed specifically to your account ({currentUser?.name || artisan.ownerName}). Unrelated marketplace feed items are filtered.
              </p>
            </div>

            {enquiries.length === 0 ? (
              <div className="card card-lg" style={{ textAlign: 'center', padding: '60px 24px' }}>
                <Clock size={40} color="var(--secondary-text)" style={{ marginBottom: 12 }} />
                <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>
                  No enquiries yet
                </h3>
                <p className="supporting-text">
                  Complete your profile and add work samples so KAIRO can match you with relevant opportunities.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {enquiries.map(enq => (
                  <EnquiryItemCard key={enq.id} enquiry={enq} onAccept={() => handleAcceptEnquiry(enq.id)} onDecline={() => setSelectedDeclineEnquiry(enq)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── 3. PROFILE & REPUTATION TAB (Section 15, 29, 31) ─────────────────────── */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1040 }}>
            
            <div className="card card-lg">
              <h2 className="section-heading" style={{ color: 'var(--deep-evergreen)', margin: 0 }}>
                Informal Trade Profile & Reputation Record
              </h2>
              <p className="supporting-text" style={{ marginTop: 4 }}>
                Your digital trade identity built from verified skills, evidence, and customer reviews.
              </p>
            </div>

            {/* SOCIAL & BUSINESS LINKS SECTION (Section 15 requirement!) */}
            <div className="card card-lg" style={{ boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', margin: 0 }}>
                    Social & Business Links
                  </h3>
                  <p className="supporting-text" style={{ fontSize: '14.5px', marginTop: 2 }}>
                    Help customers learn more about your work by adding optional external business pages.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddLink(!showAddLink)}
                  className="btn btn-outline btn-sm"
                >
                  <Plus size={15} /> Add Link
                </button>
              </div>

              {showAddLink && (
                <div style={{ background: 'var(--warm-cream)', padding: 18, borderRadius: 14, border: '1px solid var(--border-color)', marginBottom: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: 12, alignItems: 'center' }}>
                    <select
                      className="input"
                      value={newLinkPlatform}
                      onChange={e => setNewLinkPlatform(e.target.value)}
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Website">Website</option>
                      <option value="Facebook">Facebook</option>
                      <option value="X/Twitter">X / Twitter</option>
                      <option value="TikTok">TikTok</option>
                    </select>

                    <input
                      className="input"
                      placeholder="https://instagram.com/yourbusiness"
                      value={newLinkUrl}
                      onChange={e => setNewLinkUrl(e.target.value)}
                    />

                    <button onClick={handleAddSocialLink} className="btn btn-primary btn-sm">
                      Save Link
                    </button>
                  </div>
                  {linkError && <div style={{ fontSize: '13px', color: 'var(--error)', marginTop: 8 }}>{linkError}</div>}
                </div>
              )}

              {/* Social Links List */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {socialLinks.map((link, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--warm-cream)', padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border-color)' }}>
                    <Globe size={15} color="var(--kairo-green)" />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--main-text)' }}>{link.platform}:</span>
                    <a href={link.url} target="_blank" rel="noreferrer" style={{ fontSize: '14px', color: 'var(--kairo-green)', textDecoration: 'none' }}>
                      {link.url}
                    </a>
                    <button onClick={() => handleRemoveSocialLink(idx)} style={{ background: 'none', border: 'none', color: 'var(--secondary-text)', cursor: 'pointer', marginLeft: 4 }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Evidence Samples List (Section 31) */}
            <div className="card card-lg">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)' }}>Work Evidence Samples</h3>
                <button onClick={() => setShowAddSampleModal(true)} className="btn btn-primary btn-sm">+ Add Work Sample</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {workSamplesList.map(sample => (
                  <div key={sample.id} style={{ border: '1px solid var(--border-color)', borderRadius: 14, overflow: 'hidden', background: 'var(--white)' }}>
                    <img src={sample.image} alt="Sample" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                    <div style={{ padding: 16 }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>Problem</div>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--main-text)', marginBottom: 8 }}>"{sample.problem}"</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>Result</div>
                      <div style={{ fontSize: '14px', color: 'var(--kairo-green)', fontWeight: 600 }}>{sample.result}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── 4. INSIGHTS & DEMAND TAB (Section 34) ─────────────────────────────────── */}
        {activeTab === 'insights' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 960 }}>
            <div>
              <h2 className="page-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 6 }}>
                Artisan Insights & Customer Demand
              </h2>
              <p className="supporting-text">
                Understand local customer search trends for generator repair and servicing in Yaba.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18 }}>
              <MetricCard title="Profile Views" value="12" subtitle="This week in Yaba" />
              <MetricCard title="Enquiries Received" value={enquiries.length} subtitle="Matched customer requests" />
              <MetricCard title="Response Rate" value="100%" subtitle="Fast response" />
              <MetricCard title="Popular Service" value="Generator Repair" subtitle="Top matched category" />
            </div>

            <div className="card card-lg" style={{ background: 'var(--mint-mist)', border: '1.5px solid var(--soft-sage)' }}>
              <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>
                Local Customer Problem Trend
              </h3>
              <p className="body-text" style={{ margin: 0 }}>
                "Generator startup and shutdown troubleshooting were among your most frequent customer enquiry match descriptions this month."
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Add Work Sample Modal (Point 31) */}
      {showAddSampleModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(11, 51, 32, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="card card-lg animate-scale-in" style={{ maxWidth: 500, width: '100%', padding: 28 }}>
            <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 16 }}>
              Add Work Evidence Sample
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <div>
                <label className="label">What was the problem?</label>
                <input className="input" placeholder="e.g. Generator shutting down after 5 minutes" value={sampleForm.problem} onChange={e => setSampleForm({ ...sampleForm, problem: e.target.value })} />
              </div>
              <div>
                <label className="label">What work did you perform?</label>
                <input className="input" placeholder="e.g. Carburetor cleaning, low-oil sensor replacement" value={sampleForm.work} onChange={e => setSampleForm({ ...sampleForm, work: e.target.value })} />
              </div>
              <div>
                <label className="label">What was the result?</label>
                <input className="input" placeholder="e.g. Generator restored to full continuous power" value={sampleForm.result} onChange={e => setSampleForm({ ...sampleForm, result: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowAddSampleModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleSaveNewSample} disabled={!sampleForm.problem.trim()} className="btn btn-primary" style={{ flex: 1 }}>
                Save Sample
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Reason Modal */}
      {selectedDeclineEnquiry && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(11, 51, 32, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="card card-lg animate-scale-in" style={{ maxWidth: 480, width: '100%', padding: 28 }}>
            <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>
              Decline Enquiry (No Penalty)
            </h3>
            <p className="supporting-text" style={{ fontSize: '14.5px', marginBottom: 20 }}>
              Declining unsuitable jobs helps KAIRO improve matching relevance for your business.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {['Not my service category', 'Not available today', 'Location too far', 'Can\'t take job right now', 'Other reason'].map(reason => (
                <button
                  key={reason}
                  onClick={() => setDeclineReason(reason)}
                  className={`card-interactive ${declineReason === reason ? 'card-selected' : ''}`}
                  style={{ padding: '12px 16px', fontSize: '15px', fontWeight: 600, textAlign: 'left' }}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setSelectedDeclineEnquiry(null)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleDeclineSubmit} disabled={!declineReason} className="btn btn-danger" style={{ flex: 1 }}>
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KAIRO Pro Details Modal (Section 17 & 18) */}
      {showProModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 250, background: 'rgba(11, 51, 32, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="card card-lg animate-scale-in" style={{ maxWidth: 600, width: '100%', padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: 6 }}>PRO GROWTH PLAN</span>
                <h2 className="section-heading" style={{ color: 'var(--deep-evergreen)', margin: 0 }}>
                  Explore KAIRO Pro
                </h2>
              </div>
              <button onClick={() => setShowProModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--deep-evergreen)', marginBottom: 16 }}>
              ₦3,000 <span style={{ fontSize: '15px', color: 'var(--secondary-text)', fontWeight: 600 }}>/ month</span>
            </div>

            <div style={{ background: 'var(--mint-mist)', border: '1px solid var(--soft-sage)', padding: 14, borderRadius: 12, marginBottom: 20, fontSize: '13.5px', color: 'var(--deep-evergreen)' }}>
              <strong>KAIRO Guarantee:</strong> KAIRO Pro provides business tools & analytics. Pro subscription does <strong>NOT</strong> manufacture trust or alter verified match scores.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {['Advanced profile tools & unlimited work samples', 'AI profile & work description assistant', 'Local customer demand search insights', 'Enquiry conversion & view analytics', 'Enhanced verification options'].map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '15px', color: 'var(--main-text)' }}>
                  <CheckCircle2 size={16} color="var(--kairo-green)" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setIsProSubscriber(true); setShowProModal(false); }}
              className="btn btn-gold btn-lg btn-block"
            >
              {isProSubscriber ? '✓ Currently Subscribed' : 'Subscribe to KAIRO Pro — ₦3,000 / mo'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// ── Sub-Components ──────────────────────────────────────────────────────────
function MetricCard({ title, value, highlightColor, subtitle }) {
  return (
    <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ fontSize: '28px', fontWeight: 800, color: highlightColor || 'var(--main-text)', margin: '8px 0 2px' }}>{value}</div>
      {subtitle && <div className="small-metadata">{subtitle}</div>}
    </div>
  );
}

function ImprovementBox({ title, desc, action, onAction }) {
  return (
    <div style={{ background: 'var(--white)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--main-text)', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: '13.5px', color: 'var(--secondary-text)' }}>{desc}</div>
      </div>
      <button onClick={onAction} className="btn btn-outline btn-sm" style={{ marginTop: 14, alignSelf: 'flex-start' }}>
        {action} →
      </button>
    </div>
  );
}

function EnquiryItemCard({ enquiry, onAccept, onDecline }) {
  return (
    <div className="card card-lg" style={{ boxShadow: 'var(--shadow-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <span className={`status-pill status-${enquiry.status}`}>{enquiry.statusText}</span>
            <span className="small-metadata">{enquiry.dateSent || enquiry.dateReceived}</span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--main-text)', margin: 0 }}>
            {enquiry.serviceLabel || enquiry.service}
          </h3>
          <div style={{ fontSize: '14.5px', color: 'var(--secondary-text)', marginTop: 4 }}>
            Customer: <strong>{enquiry.customerName}</strong> · Location: {enquiry.location} · Timing: {enquiry.when || 'Today'}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--warm-cream)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 16 }}>
        <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 4 }}>
          Customer Problem Description:
        </div>
        <div style={{ fontSize: '16.5px', fontWeight: 600, color: 'var(--main-text)', fontStyle: 'italic' }}>
          "{enquiry.problemText || enquiry.problem}"
        </div>
      </div>

      <div className="why-panel" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-evergreen)', textTransform: 'uppercase', marginBottom: 8 }}>
          Why KAIRO matched you:
        </div>
        {enquiry.matchReasons?.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px', color: 'var(--main-text)' }}>
            <CheckCircle2 size={15} color="var(--kairo-green)" />
            <span>{r}</span>
          </div>
        ))}
      </div>

      {enquiry.status === 'new' && (
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onAccept} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
            Accept Enquiry
            <ArrowRight size={18} />
          </button>
          <button onClick={onDecline} className="btn btn-ghost btn-lg" style={{ color: 'var(--error)' }}>
            Decline
          </button>
        </div>
      )}

      {enquiry.status === 'accepted' && (
        <div style={{ background: 'var(--mint-mist)', padding: 18, borderRadius: 14, border: '1px solid var(--soft-sage)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-evergreen)' }}>Enquiry Accepted!</div>
            <div style={{ fontSize: '13.5px', color: 'var(--secondary-text)' }}>Customer contact phone unlocked for direct coordination.</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href={`tel:${enquiry.customerPhone || '08031234567'}`} className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
              <Phone size={15} /> Call {enquiry.customerName}
            </a>
            <a href={`https://wa.me/2348031234567`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ textDecoration: 'none', borderColor: '#25D366', color: '#075E54', background: '#DCFCE7' }}>
              <MessageSquare size={15} /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
