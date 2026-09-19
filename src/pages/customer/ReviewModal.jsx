import React, { useState } from 'react';
import { Star, CheckCircle2, ArrowRight, X } from 'lucide-react';

export default function ReviewModal({ artisan, enquiry, onSubmit, onClose }) {
  const [overall, setOverall] = useState(0);
  const [hover, setHover] = useState(0);
  const [subs, setSubs] = useState({ quality: 0, professionalism: 0, communication: 0, value: 0 });
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!overall) return;
    setSubmitted(true);
    setTimeout(() => {
      onSubmit && onSubmit({ artisanId: artisan?.id, overallRating: overall, subRatings: subs, text });
      onClose && onClose();
    }, 1200);
  };

  const subLabels = [
    { key: 'quality', label: 'Quality of work' },
    { key: 'professionalism', label: 'Professionalism' },
    { key: 'communication', label: 'Communication' },
    { key: 'value', label: 'Value' },
  ];

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--mint-mist)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', border: '1.5px solid var(--soft-sage)'
        }}>
          <CheckCircle2 size={32} color="var(--deep-evergreen)" />
        </div>
        <h3 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 8 }}>
          Review submitted!
        </h3>
        <p className="supporting-text" style={{ fontSize: '15px' }}>
          Thank you. Your feedback builds artisan reputation and helps other customers choose with confidence.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {artisan?.avatar && (
            <img src={artisan.avatar} alt={artisan.name} style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover' }} />
          )}
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--main-text)' }}>
              How did it go?
            </div>
            <div style={{ fontSize: '14px', color: 'var(--secondary-text)' }}>
              Reviewing {artisan?.name || 'Artisan'}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)' }}>
          <X size={20} />
        </button>
      </div>

      {/* Overall Star Rating */}
      <div style={{ marginBottom: 24, textAlign: 'center', background: 'var(--warm-cream)', padding: 20, borderRadius: 14, border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 8 }}>
          Overall Experience
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <button
              key={i}
              onClick={() => setOverall(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
            >
              <Star size={36} fill={(hover || overall) >= i ? '#F59E0B' : 'none'} color={(hover || overall) >= i ? '#F59E0B' : '#C4D0C7'} />
            </button>
          ))}
        </div>
      </div>

      {/* 4 Sub Ratings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {subLabels.map(({ key, label }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '15px', color: 'var(--main-text)', fontWeight: 600 }}>{label}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  onClick={() => setSubs(s => ({ ...s, [key]: i }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                >
                  <Star size={20} fill={subs[key] >= i ? '#F59E0B' : 'none'} color={subs[key] >= i ? '#F59E0B' : '#C4D0C7'} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Text Review */}
      <div style={{ marginBottom: 24 }}>
        <label className="label">Tell us about your experience</label>
        <textarea
          className="input"
          rows={3}
          placeholder="Describe how the artisan handled your problem, work quality, and timeliness..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!overall}
        className="btn btn-primary btn-lg btn-block"
      >
        Submit Review
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
