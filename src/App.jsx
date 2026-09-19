import React, { useState, useCallback } from 'react';

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

// Artisan & Admin Portals
import ArtisanDashboard from './pages/artisan/ArtisanDashboard';
import AdminPanel       from './pages/admin/AdminPanel';

// Shared App Header
import Header from './components/Header';

export default function App() {
  // Onboarding Screen Router: 'intro' | 'splash' | 'role' | 'auth' | 'app'
  const [screen, setScreen] = useState('intro');
  const [role, setRole] = useState('customer');
  const [currentUser, setCurrentUser] = useState({
    id: 'usr-1',
    name: 'Chidi Okonkwo',
    email: 'chidi@example.com',
    phone: '0803 123 4567',
    role: 'customer'
  });

  // Active Navigation Tab for Customer: 'home' | 'requests' | 'saved' | 'profile'
  const [activeTab, setActiveTab] = useState('home');

  // Customer View State: 'home' | 'finding' | 'results' | 'profile' | 'requests' | 'requestDetails' | 'saved' | 'customerProfile'
  const [customerView, setCustomerView] = useState('home');

  // Flow State
  const [problemInput, setProblemInput] = useState(null);
  const [completedRequest, setCompletedRequest] = useState(null);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // User Data Store
  const [savedArtisanIds, setSavedArtisanIds] = useState(['art-1', 'art-3']);
  const [sentRequests, setSentRequests] = useState([
    {
      id: 'req-101',
      serviceLabel: 'Generator Repair',
      problemText: 'My generator starts but goes off after a few minutes.',
      artisanName: 'Emeka Generator Repairs',
      artisanPhone: '0803 555 0192',
      status: 'awaiting',
      statusText: 'Awaiting response',
      dateSent: 'Today at 2:15 PM',
      brand: 'Honda',
      location: 'Yaba, Lagos',
      matchReasons: ['Specializes in generator shutdown faults', '18 relevant work samples', 'Available today']
    },
    {
      id: 'req-102',
      serviceLabel: 'Device Repair',
      problemText: 'iPhone 13 screen cracked after drop.',
      artisanName: 'TechDoctor Tunde',
      artisanPhone: '0802 888 1234',
      status: 'accepted',
      statusText: 'Accepted',
      dateSent: 'Yesterday',
      brand: 'iPhone 13',
      location: 'Computer Village, Ikeja',
      matchReasons: ['Screen replacement specialist', 'OEM parts guaranteed']
    }
  ]);
  const [reviewArtisan, setReviewArtisan] = useState(null);

  // ── Onboarding Handlers ─────────────────────────────────────────────────
  const handleAuthSuccess = useCallback((user) => {
    setCurrentUser(user);
    setRole(user.role);
    setScreen('app');
    setActiveTab('home');
    setCustomerView('home');
  }, []);

  const handleSignOut = useCallback(() => {
    setCurrentUser(null);
    setRole('customer');
    setScreen('splash');
    setCustomerView('home');
    setActiveTab('home');
  }, []);

  // ── Tab Switching Handler ───────────────────────────────────────────────
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'home') setCustomerView('home');
    else if (tabId === 'requests') setCustomerView('requests');
    else if (tabId === 'saved') setCustomerView('saved');
    else if (tabId === 'profile') setCustomerView('customerProfile');
  };

  // ── Customer Flow Handlers ──────────────────────────────────────────────
  const handleStartProblemFinder = (textOrInput) => {
    if (typeof textOrInput === 'string') {
      setProblemInput({ text: textOrInput });
    } else {
      setProblemInput(null);
    }
    setCustomerView('finding');
  };

  const handleProblemFinderComplete = (result) => {
    setCompletedRequest(result);
    setCustomerView('results');
  };

  const handleViewProfile = (artisan) => {
    setSelectedArtisan(artisan);
    setCustomerView('profile');
  };

  const handleSendEnquiry = (artisan) => {
    const newReq = {
      id: 'req-' + Date.now(),
      serviceLabel: completedRequest?.diagnosis?.categoryLabel || artisan.categoryLabel || 'Service Request',
      problemText: completedRequest?.problem?.text || 'Service request',
      artisanName: artisan.name,
      artisanPhone: '0803 555 0192',
      status: 'awaiting',
      statusText: 'Awaiting response',
      dateSent: 'Just now',
      brand: completedRequest?.clarification?.brand || 'Honda',
      location: completedRequest?.clarification?.location || artisan.location || 'Yaba, Lagos',
      matchReasons: [
        `Handles ${artisan.category === 'generator' ? 'generator startup & shutdown' : 'device'} problems`,
        `${artisan.workSamplesCount || 18} relevant work samples`,
        `Available today in ${artisan.location}`
      ]
    };

    setSentRequests(prev => [newReq, ...prev]);
    setSelectedRequest(newReq);
    setActiveTab('requests');
    setCustomerView('requestDetails');
  };

  const handleToggleSaved = (artisanId) => {
    setSavedArtisanIds(prev =>
      prev.includes(artisanId) ? prev.filter(id => id !== artisanId) : [...prev, artisanId]
    );
  };

  // ── Onboarding Screen Routing ──────────────────────────────────────────
  if (screen === 'intro')  return <KairoIntro onDone={() => setScreen('splash')} />;
  if (screen === 'splash') return <SplashScreen onGetStarted={() => setScreen('role')} />;
  if (screen === 'role')   return <RolePicker onSelectRole={(r) => { setRole(r); setScreen('auth'); }} onBack={() => setScreen('splash')} />;
  if (screen === 'auth')   return <AuthPage role={role} onAuthSuccess={handleAuthSuccess} onBack={() => setScreen('role')} />;

  // ── Main App Shell ──────────────────────────────────────────────────────
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
                onOpenRequestDetails={(req) => { setSelectedRequest(req); setCustomerView('requestDetails'); }}
              />
            )}

            {customerView === 'finding' && (
              <ProblemFinder
                initialProblem={problemInput}
                onComplete={handleProblemFinderComplete}
                onCancel={() => setCustomerView('home')}
              />
            )}

            {customerView === 'results' && completedRequest && (
              <ArtisanResults
                request={completedRequest}
                onViewProfile={handleViewProfile}
                onEnquire={handleSendEnquiry}
                onChangeRequest={() => setCustomerView('finding')}
                onBrowseOther={() => handleStartProblemFinder('Browse services')}
              />
            )}

            {customerView === 'profile' && selectedArtisan && (
              <ArtisanProfilePage
                artisan={selectedArtisan}
                request={completedRequest}
                onBack={() => setCustomerView('results')}
                onEnquire={handleSendEnquiry}
              />
            )}

            {customerView === 'requests' && (
              <RequestsPage
                requests={sentRequests}
                onSelectRequest={(req) => { setSelectedRequest(req); setCustomerView('requestDetails'); }}
                onNewProblem={() => handleStartProblemFinder()}
              />
            )}

            {customerView === 'requestDetails' && selectedRequest && (
              <RequestDetailsPage
                request={selectedRequest}
                onBack={() => setCustomerView('requests')}
                onViewOtherMatches={() => setCustomerView('results')}
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

        {/* ARTISAN PORTAL VIEW */}
        {role === 'artisan' && (
          <ArtisanDashboard currentUser={currentUser} />
        )}

        {/* ADMIN PORTAL VIEW */}
        {role === 'admin' && (
          <AdminPanel />
        )}
      </main>

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
