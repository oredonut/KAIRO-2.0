import React from 'react';
import { Bookmark, Star, MapPin, Clock, ShieldCheck, Trash2, ArrowRight } from 'lucide-react';
import { ARTISANS } from '../../data/mockData';

export default function SavedPage({ savedArtisanIds = ['art-1', 'art-3'], onViewProfile, onRemoveSaved }) {
  const savedArtisans = ARTISANS.filter(a => savedArtisanIds.includes(a.id));

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: '40px 24px 80px' }}>
      <div className="page-wrapper animate-fade-in" style={{ maxWidth: 960 }}>
        
        {/* Page Heading */}
        <div style={{ marginBottom: 32 }}>
          <span className="badge badge-green" style={{ marginBottom: 8 }}>
            <Bookmark size={14} /> BOOKMARKS
          </span>
          <h1 className="page-heading" style={{ color: 'var(--deep-evergreen)', margin: 0 }}>
            Saved Artisans
          </h1>
          <p className="supporting-text" style={{ fontSize: '16px', marginTop: 4 }}>
            Artisans you've bookmarked for future everyday problems.
          </p>
        </div>

        {savedArtisans.length === 0 ? (
          <div className="card card-lg" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <Bookmark size={48} color="var(--secondary-text)" style={{ marginBottom: 16 }} />
            <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>
              No saved artisans yet
            </h3>
            <p className="supporting-text" style={{ fontSize: '16px', maxWidth: 420, margin: '0 auto' }}>
              Bookmark reliable professionals when searching or reviewing matches to easily find them again.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {savedArtisans.map(artisan => (
              <div key={artisan.id} className="card card-interactive" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 }}>
                    <img
                      src={artisan.avatar}
                      alt={artisan.name}
                      style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover', border: '1.5px solid var(--border-color)' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--main-text)', margin: 0 }}>
                        {artisan.name}
                      </h3>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--kairo-green)' }}>
                        {artisan.categoryLabel}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13.5px', color: 'var(--secondary-text)', marginTop: 4 }}>
                        <span style={{ fontWeight: 700, color: '#D97706', display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Star size={13} fill="#F59E0B" color="#F59E0B" /> {artisan.rating}
                        </span>
                        <span>({artisan.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
                    <span className="badge badge-muted">
                      <MapPin size={13} /> {artisan.location}
                    </span>
                    <span className="badge badge-green">
                      <Clock size={13} /> {artisan.availability}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                  <button
                    onClick={() => onViewProfile(artisan)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    View profile
                  </button>
                  <button
                    onClick={() => onRemoveSaved && onRemoveSaved(artisan.id)}
                    className="btn btn-ghost btn-sm"
                    title="Remove from saved"
                    style={{ color: 'var(--error)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
