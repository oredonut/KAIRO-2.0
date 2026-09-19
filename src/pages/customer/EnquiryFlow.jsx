import React, { useState } from 'react';
import { ArrowRight, Edit2, CheckCircle, Star, MapPin, Clock, Phone } from 'lucide-react';

// ── Enquiry Review ────────────────────────────────────────────────────────
function EnquiryReview({ artisan, request, onSend, onEdit }) {
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onSend({ artisan, request, note, sentAt: new Date() });
    }, 1000);
  };

  const { diagnosis, clarification, problem } = request;

  return (
    <div style={{ maxWidth:520, margin:'0 auto' }} className="animate-scale-in">
      <div style={{ marginBottom:24 }}>
        <span style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:6 }}>
          Review your enquiry
        </span>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', color:'var(--text-primary)', margin:0 }}>
          Send to {artisan.ownerName.split(' ')[0]}?
        </h2>
      </div>

      {/* Artisan preview */}
      <div className="card" style={{ padding:'16px', marginBottom:16, display:'flex', gap:12, alignItems:'center' }}>
        <img src={artisan.avatar} alt={artisan.name} style={{ width:48, height:48, borderRadius:12, objectFit:'cover' }} />
        <div>
          <div style={{ fontWeight:700, fontSize:'0.9rem', color:'var(--text-primary)' }}>{artisan.name}</div>
          <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{artisan.categoryLabel} · {artisan.location}</div>
          <div style={{ fontSize:'0.75rem', color:'var(--amber)', fontWeight:600, marginTop:2 }}>{artisan.availability}</div>
        </div>
      </div>

      {/* Structured problem */}
      <div className="card" style={{ padding:'20px', marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <span style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Your problem</span>
          <button onClick={onEdit} style={{ fontSize:'0.78rem', color:'var(--brand)', fontWeight:600, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
            <Edit2 size={12} /> Edit
          </button>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <EnquiryRow label="Service" value={diagnosis.categoryLabel} />
          <EnquiryRow label="Problem" value={problem.text || diagnosis.understanding} highlight />
          {clarification?.answers && Object.entries(clarification.answers).map(([k, v]) => (
            <EnquiryRow key={k} label={k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g,' ')} value={v} />
          ))}
          <EnquiryRow label="Location" value={clarification?.location || 'Not specified'} icon={<MapPin size={12} />} />
          <EnquiryRow label="When needed" value="Today" icon={<Clock size={12} />} />
        </div>

        {/* Optional note */}
        <div style={{ marginTop:16, paddingTop:14, borderTop:'1px solid var(--border)' }}>
          <label className="label" style={{ marginBottom:6 }}>Any additional information? <span style={{ color:'var(--text-faint)', fontWeight:400 }}>(optional)</span></label>
          <textarea
            className="input"
            style={{ minHeight:70, fontSize:'0.85rem' }}
            placeholder="Anything else the artisan should know before calling you…"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
      </div>

      {/* Notice */}
      <div style={{ background:'var(--brand-ghost)', border:'1px solid var(--brand-pale)', borderRadius:10, padding:'12px 14px', marginBottom:20, fontSize:'0.8rem', color:'var(--text-body)', lineHeight:1.6 }}>
        KAIRO will share these details with {artisan.ownerName.split(' ')[0]} so they can decide whether they can help. Your contact details remain private until the artisan accepts.
      </div>

      <button className="btn btn-amber btn-xl btn-block" onClick={handleSend} disabled={sending}>
        {sending ? 'Sending enquiry…' : 'Send enquiry'}
        {!sending && <ArrowRight size={17} />}
      </button>
    </div>
  );
}

function EnquiryRow({ label, value, icon, highlight }) {
  return (
    <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
      {icon && <span style={{ color:'var(--brand-light)', flexShrink:0, marginTop:2 }}>{icon}</span>}
      <span style={{ fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:500, minWidth:80, flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:highlight ? '0.9rem' : '0.85rem', color:'var(--text-primary)', fontWeight: highlight ? 600 : 400, lineHeight:1.5 }}>
        {value}
      </span>
    </div>
  );
}

// ── Enquiry Sent / Status ─────────────────────────────────────────────────
function EnquirySent({ artisan, request, onViewOtherMatches, onGoHome }) {
  return (
    <div style={{ maxWidth:480, margin:'0 auto', textAlign:'center' }} className="animate-scale-in">
      {/* Success icon */}
      <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--success-bg)', border:'2px solid rgba(22,101,52,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
        <CheckCircle size={36} color="var(--success)" />
      </div>

      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', color:'var(--text-primary)', marginBottom:8 }}>
        Enquiry sent
      </h2>
      <p style={{ fontSize:'0.9rem', color:'var(--text-muted)', marginBottom:28, lineHeight:1.65 }}>
        <strong style={{ color:'var(--text-primary)' }}>{artisan.name}</strong> has received your request and will get back to you.
      </p>

      {/* Status card */}
      <div className="card" style={{ padding:'20px', textAlign:'left', marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <span style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Your request</span>
          <span className="status-pill status-awaiting">Awaiting response</span>
        </div>
        <div style={{ fontSize:'0.875rem', color:'var(--text-primary)', fontWeight:600, marginBottom:4 }}>{request.diagnosis.categoryLabel}</div>
        <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', display:'flex', gap:10, flexWrap:'wrap' }}>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}><MapPin size={11} />{request.clarification?.location || 'Your location'}</span>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={11} />Sent just now</span>
        </div>

        {/* Lifecycle steps */}
        <div style={{ marginTop:16, paddingTop:14, borderTop:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:8 }}>
          {[
            { label:'Enquiry sent', done:true, active:false },
            { label:'Awaiting response from artisan', done:false, active:true },
            { label:'Artisan accepts and contacts you', done:false, active:false },
            { label:'Work completed', done:false, active:false },
            { label:'Leave a review', done:false, active:false },
          ].map((step, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div className={`timeline-dot ${step.done ? 'done' : step.active ? 'active' : ''}`}></div>
              <span style={{ fontSize:'0.8rem', color: step.done ? 'var(--text-body)' : step.active ? 'var(--brand)' : 'var(--text-faint)', fontWeight: step.active ? 600 : 400 }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button className="btn btn-ghost" style={{ flex:1 }} onClick={onViewOtherMatches}>
          View other matches
        </button>
        <button className="btn btn-outline" style={{ flex:1 }} onClick={onGoHome}>
          Back to home
        </button>
      </div>
    </div>
  );
}

// ── Enquiry Flow orchestrator ─────────────────────────────────────────────
export default function EnquiryFlow({ artisan, request, onViewOtherMatches, onGoHome, onEdit }) {
  const [step, setStep] = useState('review'); // review | sent

  const handleSend = ({ artisan, request, note, sentAt }) => {
    setStep('sent');
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-base)', padding:'40px 20px 60px' }}>
      <div className="page-wrapper">
        {step === 'review' && (
          <EnquiryReview
            artisan={artisan}
            request={request}
            onSend={handleSend}
            onEdit={onEdit}
          />
        )}
        {step === 'sent' && (
          <EnquirySent
            artisan={artisan}
            request={request}
            onViewOtherMatches={onViewOtherMatches}
            onGoHome={onGoHome}
          />
        )}
      </div>
    </div>
  );
}
