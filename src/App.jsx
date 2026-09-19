import React, { useState, useCallback, useEffect } from 'react';

// Onboarding Pages
import KairoIntro    from './pages/KairoIntro';
import SplashScreen  from './pages/SplashScreen';
import RolePicker    from './pages/RolePicker';
import AuthPage      from './pages/AuthPage';

// Customer Pages
import CustomerHome        from './pages/customer/CustomerHome';
import ProblemFinder       from './pages/customer/ProblemFinder';
import ArtisanResults      from './pages/customer/ArtisanResults';
import ArtisanProfilePage  from './pages/customer/ArtisanProfilePage';
import RequestsPage        from './pages/customer/RequestsPage';
import RequestDetailsPage  from './pages/customer/RequestDetailsPage';
import SavedPage           from './pages/customer/SavedPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';
import ReviewModal         from './pages/customer/ReviewModal';

// Artisan Experience
import ArtisanOnboarding from './pages/artisan/ArtisanOnboarding';
import ArtisanWorkspace  from './pages/artisan/ArtisanWorkspace';

// Admin Operational Experience
import AdminLogin         from './pages/admin/AdminLogin';
import AdminControlCenter from './pages/admin/AdminControlCenter';

// Shared App Header
import Header from './components/Header';

// Real-Time Enquiry Store & Sync (Section 21)
import { addCustomerEnquiry, getStoredEnquiries, updateEnquiryStatus } from './data/enquiryStore';

export default function App() {
  // Check URL pathname for direct /admin route (Section 36)
  const [screen, setScreen] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.toLowerCase().includes('admin')) {
      return 'adminLogin';
    }
    return 'intro';
  });

  const [role, setRole] = useState('customer'); // 'customer' | 'artisan' | 'admin'
  const [currentUser, setCurrentUser] = useState({
    id: 'usr-customer-1',
    name: 'Chidi Okonkwo',
    email: 'chidi@example.com',
    phone: '0803 123 4567',
    role: 'customer'
  });

  // Active Navigation Tab for Customer: 'home' | 'requests' | 'saved' | 'profile'
  const [activeTab, setActiveTab] = useState('home');

  // Customer View State: 'home' | 'finding' | 'results' | 'profile' | 'requests' | 'requestDetails' | 'saved' | 'customerProfile'
  const [customerView, setCustomerView] = useState('home');

  // Customer Flow State
  const [problemInput, setProblemInput] = useState(null);
  const [completedRequest, setCompletedRequest] = useState(null);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // User Data Store
  const [savedArtisanIds, setSavedArtisanIds] = useState(['art-1', 'art-3']);
  const [sentRequests, setSentRequests] = useState(() => getStoredEnquiries());
  const [reviewArtisan, setReviewArtisan] = useState(null);

  // Scroll Reset Helper (Section 28 Fix)
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  // Sync enquiries on update
  useEffect(() => {
    const handleSync = () => {
      setSentRequests(getStoredEnquiries());
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('kairo_enquiries_updated', handleSync);
      window.addEventListener('storage', handleSync);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('kairo_enquiries_updated', handleSync);
        window.removeEventListener('storage', handleSync);
      }
    };
  }, []);

  // ── Onboarding & Auth Handlers ─────────────────────────────────────────
  const handleAuthSuccess = useCallback((user) => {
    setCurrentUser(user);
    setRole(user.role);
    scrollToTop();

    if (user.role === 'artisan') {
      if (user.isExistingUser) {
        // Returning Artisan Sign-In -> Goes straight to Dashboard (Section 5 requirement!)
        setScreen('app');
      } else {
        // New Artisan Creation -> Goes to Profile Creation (Section 6 requirement!)
        setScreen('artisanOnboarding');
      }
    } else {
      setScreen('app');
      setActiveTab('home');
      setCustomerView('home');
    }
  }, []);

  const handleAdminAuthSuccess = useCallback((adminUser) => {
    setCurrentUser(adminUser);
    setRole('admin');
    setScreen('adminWorkspace');
    scrollToTop();
  }, []);

  const handleSignOut = useCallback(() => {
    setCurrentUser(null);
    setRole('customer');
    setScreen('splash');
    setCustomerView('home');
    setActiveTab('home');
    scrollToTop();
  }, []);

  // ── Tab Switching Handler ───────────────────────────────────────────────
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'home') setCustomerView('home');
    else if (tabId === 'requests') setCustomerView('requests');
    else if (tabId === 'saved') setCustomerView('saved');
    else if (tabId === 'profile') setCustomerView('customerProfile');
    scrollToTop();
  };

  // ── Customer Flow Handlers ──────────────────────────────────────────────
  const handleStartProblemFinder = (textOrInput) => {
    if (typeof textOrInput === 'string') {
      setProblemInput({ text: textOrInput });
    } else {
      setProblemInput(null);
    }
    setCustomerView('finding');
    scrollToTop();
  };

  const handleProblemFinderComplete = (result) => {
    setCompletedRequest(result);
    setCustomerView('results');
    scrollToTop();
  };

  const handleViewProfile = (artisan) => {
    setSelectedArtisan(artisan);
    setCustomerView('profile');
    scrollToTop();
  };

  // Customer Sends Enquiry (Session A -> Broadcasts Real-Time to Specific Artisan Session B)
  const handleSendEnquiry = (artisan) => {
    const newReqData = {
      artisanId: artisan.id || 'art-1', // Target specific artisan! (Section 19 & 20)
      serviceLabel: completedRequest?.diagnosis?.categoryLabel || artisan.categoryLabel || 'Service Request',
      problemText: completedRequest?.problem?.text || 'Service request description',
      customerName: currentUser?.name || 'Sarah N.',
      customerPhone: currentUser?.phone || '0803 123 4567',
      artisanName: artisan.name,
      artisanPhone: '0803 555 0192',
      brand: completedRequest?.clarification?.brand || 'Honda',
      location: completedRequest?.clarification?.location || artisan.location || 'Yaba, Lagos',
      when: 'Today',
      matchReasons: [
        `Handles ${artisan.category === 'generator' ? 'generator startup & shutdown' : 'device'} problems`,
        `${artisan.workSamplesCount || 18} verified work samples`,
        `Available today in ${artisan.location}`
      ]
    };

    // Add to shared real-time store (notifies specific artisan immediately!)
    const createdEnquiry = addCustomerEnquiry(newReqData);
    
    setSelectedRequest(createdEnquiry);
    setActiveTab('requests');
    setCustomerView('requestDetails');
    scrollToTop();
  };

  const handleToggleSaved = (artisanId) => {
    setSavedArtisanIds(prev =>
      prev.includes(artisanId) ? prev.filter(id => id !== artisanId) : [...prev, artisanId]
    );
  };

  // ── Standalone Screens ──────────────────────────────────────────────────
  if (screen === 'intro')  return <KairoIntro onDone={() => { setScreen('splash'); scrollToTop(); }} />;
  if (screen === 'splash') return <SplashScreen onGetStarted={() => { setScreen('role'); scrollToTop(); }} />;
  if (screen === 'role')   return <RolePicker onSelectRole={(r) => { setRole(r); setScreen('auth'); scrollToTop(); }} onBack={() => { setScreen('splash'); scrollToTop(); }} />;
  if (screen === 'auth')   return <AuthPage role={role} onAuthSuccess={handleAuthSuccess} onBack={() => { setScreen('role'); scrollToTop(); }} />;

  // Artisan Identity Creation Flow (Section 6 & 7)
  if (screen === 'artisanOnboarding') {
    return (
      <ArtisanOnboarding
        initialData={currentUser}
        onCompleteOnboarding={(onboardedData) => {
          setCurrentUser(prev => ({ ...prev, ...onboardedData, id: prev.id || 'art-1' }));
          setScreen('app');
          scrollToTop();
        }}
      />
    );
  }

  // Private Admin Login (Section 36)
  if (screen === 'adminLogin') {
    return (
      <AdminLogin
        onAdminAuthSuccess={handleAdminAuthSuccess}
        onBack={() => { setScreen('splash'); scrollToTop(); }}
      />
    );
  }

  // Admin Operational Workspace (Section 37)
  if (screen === 'adminWorkspace' || role === 'admin') {
    return (
      <AdminControlCenter
        onAdminSignOut={handleSignOut}
      />
    );
  }

  // ── Main App Shell (Customer & Artisan Portals) ─────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Persistent App Header */}
      <Header
        role={role}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <main style={{ flex: 1 }}>
        {/* CUSTOMER PORTAL VIEWS */}
        {role === 'customer' && (
          <>
            {customerView === 'home' && (
              <CustomerHome
                onStartProblemFinder={handleStartProblemFinder}
                onBrowseServices={() => handleStartProblemFinder('Browse services')}
                recentRequests={sentRequests}
                onViewAllRequests={() => handleTabChange('requests')}
                onOpenRequestDetails={(req) => { setSelectedRequest(req); setCustomerView('requestDetails'); scrollToTop(); }}
              />
            )}

            {customerView === 'finding' && (
              <ProblemFinder
                initialProblem={problemInput}
                onComplete={handleProblemFinderComplete}
                onCancel={() => { setCustomerView('home'); scrollToTop(); }}
              />
            )}

            {customerView === 'results' && completedRequest && (
              <ArtisanResults
                request={completedRequest}
                onViewProfile={handleViewProfile}
                onEnquire={handleSendEnquiry}
                onChangeRequest={() => { setCustomerView('finding'); scrollToTop(); }}
                onBrowseOther={() => handleStartProblemFinder('Browse services')}
              />
            )}

            {customerView === 'profile' && selectedArtisan && (
              <ArtisanProfilePage
                artisan={selectedArtisan}
                request={completedRequest}
                onBack={() => { setCustomerView('results'); scrollToTop(); }}
                onEnquire={handleSendEnquiry}
              />
            )}

            {customerView === 'requests' && (
              <RequestsPage
                requests={sentRequests}
                onSelectRequest={(req) => { setSelectedRequest(req); setCustomerView('requestDetails'); scrollToTop(); }}
                onNewProblem={() => handleStartProblemFinder()}
              />
            )}

            {customerView === 'requestDetails' && selectedRequest && (
              <RequestDetailsPage
                request={selectedRequest}
                onBack={() => { setCustomerView('requests'); scrollToTop(); }}
                onViewOtherMatches={() => { setCustomerView('results'); scrollToTop(); }}
                onReviewArtisan={(req) => setReviewArtisan({ name: req.artisanName, avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&fit=crop' })}
              />
            )}

            {customerView === 'saved' && (
              <SavedPage
                savedArtisanIds={savedArtisanIds}
                onViewProfile={handleViewProfile}
                onRemoveSaved={handleToggleSaved}
              />
            )}

            {customerView === 'customerProfile' && (
              <CustomerProfilePage
                currentUser={currentUser}
                savedCount={savedArtisanIds.length}
                completedCount={sentRequests.filter(r => r.status === 'completed').length}
                onSignOut={handleSignOut}
              />
            )}
          </>
        )}

        {/* ARTISAN PROFESSIONAL WORKSPACE */}
        {role === 'artisan' && (
          <ArtisanWorkspace
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Discrete Admin Link Footer (Section 36) */}
      <footer style={{ background: 'var(--warm-cream)', borderTop: '1px solid var(--border-color)', padding: '16px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto', fontSize: '13px', color: 'var(--secondary-text)' }}>
          <span>© 2026 KAIRO — AI-Powered Artisan Trust Platform</span>
          <button
            onClick={() => { setScreen('adminLogin'); scrollToTop(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)', fontWeight: 600, textDecoration: 'underline' }}
          >
            Admin Access
          </button>
        </div>
      </footer>

      {/* Post-Job Review Overlay Modal */}
      {reviewArtisan && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(11, 51, 32, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16
          }}
          onClick={() => setReviewArtisan(null)}
        >
          <div
            className="card card-lg animate-scale-in"
            style={{ maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 28 }}
            onClick={e => e.stopPropagation()}
          >
            <ReviewModal
              artisan={reviewArtisan}
              onSubmit={() => {}}
              onClose={() => setReviewArtisan(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
