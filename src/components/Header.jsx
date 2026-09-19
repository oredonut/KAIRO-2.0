import React from 'react';
import { Home, ClipboardList, Bookmark, User, LogOut } from 'lucide-react';
import KairoIcon, { KairoLogo } from './KairoIcon';

export default function Header({ role, currentUser, onSignOut, activeTab, onTabChange }) {
  const navItems = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'requests', label: 'Requests', Icon: ClipboardList },
    { id: 'saved', label: 'Saved', Icon: Bookmark },
    { id: 'profile', label: 'Profile', Icon: User },
  ];

  const handleNavClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0); // Scroll position reset fix (Point 28)
    }
  };

  return (
    <>
      {/* Top Header Bar */}
      <header style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}>
          
          {/* Logo & Brand with NEW KairoLogo Symbol */}
          <div
            onClick={() => handleNavClick('home')}
            style={{ cursor: 'pointer' }}
          >
            <KairoLogo size={32} />
          </div>

          {/* Desktop Persistent Navigation (Customer) */}
          {role === 'customer' && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hidden-mobile">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                const Icon = item.Icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 18px',
                      borderRadius: 10,
                      border: 'none',
                      background: isActive ? 'var(--mint-mist)' : 'transparent',
                      color: isActive ? 'var(--deep-evergreen)' : 'var(--secondary-text)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <Icon size={18} color={isActive ? 'var(--kairo-green)' : 'currentColor'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* User Avatar & Sign Out */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {currentUser && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--mint-mist)', border: '1.5px solid var(--soft-sage)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 700, color: 'var(--deep-evergreen)'
                }}>
                  {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div style={{ lineHeight: 1.2 }} className="hidden-mobile">
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--main-text)' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--secondary-text)', textTransform: 'capitalize' }}>
                    {role === 'customer' ? 'Customer' : role === 'artisan' ? 'Artisan Workspace' : 'Admin'}
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={onSignOut}
              title="Sign Out"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 10,
                border: '1px solid var(--border-color)',
                background: 'var(--warm-cream)',
                cursor: 'pointer', fontSize: '13.5px',
                color: 'var(--secondary-text)', fontWeight: 500,
                transition: 'all 0.18s'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#991B1B'; e.currentTarget.style.borderColor = '#FCA5A5'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--secondary-text)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              <LogOut size={15} />
              <span className="hidden-mobile">Sign out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Customer) */}
      {role === 'customer' && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          background: 'var(--white)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-around',
          zIndex: 100,
          boxShadow: '0 -4px 16px rgba(0,0,0,0.06)'
        }} className="show-mobile-only">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            const Icon = item.Icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isActive ? 'var(--deep-evergreen)' : 'var(--secondary-text)',
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  padding: '6px 12px'
                }}
              >
                <Icon size={20} color={isActive ? 'var(--kairo-green)' : 'currentColor'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      <style>{`
        @media (min-width: 769px) {
          .show-mobile-only { display: none !important; }
        }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
