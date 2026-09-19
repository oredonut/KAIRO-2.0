import React, { useEffect, useState } from 'react';

export default function KairoIntro({ onDone }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 80),
      setTimeout(() => setPhase(2), 650),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 2500),
      setTimeout(() => onDone(), 3100),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      className="intro-bg"
      style={{
        position:'fixed', inset:0, zIndex:9999,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        transition:'opacity 0.6s ease',
        opacity: phase === 4 ? 0 : 1,
        pointerEvents: phase === 4 ? 'none' : 'auto',
      }}
    >
      {/* Subtle ring */}
      <div style={{
        position:'absolute', width:280, height:280, borderRadius:'50%',
        border:'1px dashed rgba(82,183,136,0.15)', animation:'spinSlow 18s linear infinite',
        pointerEvents:'none',
      }}></div>
      <div style={{
        position:'absolute', width:180, height:180, borderRadius:'50%',
        border:'1px solid rgba(82,183,136,0.08)', animation:'spinSlow 12s linear reverse infinite',
        pointerEvents:'none',
      }}></div>

      {/* Logo */}
      <div style={{
        transform: phase >= 1 ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(16px)',
        opacity: phase >= 1 ? 1 : 0,
        transition:'transform 0.65s cubic-bezier(0.34,1.4,0.64,1), opacity 0.5s ease',
        marginBottom: 20, position:'relative',
      }}>
        <div style={{
          position:'absolute', inset:-12, borderRadius:28, pointerEvents:'none',
          background:'rgba(82,183,136,0.2)', filter:'blur(18px)',
          animation:'pulse 2.5s ease-in-out infinite',
        }}></div>
        <img
          src="/kairo-logo.png"
          alt="KAIRO"
          style={{ width:96, height:96, borderRadius:24, objectFit:'cover', display:'block', position:'relative', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}
        />
      </div>

      {/* Wordmark */}
      <div style={{
        transform: phase >= 2 ? 'translateY(0)' : 'translateY(20px)',
        opacity: phase >= 2 ? 1 : 0,
        transition:'transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease',
        marginBottom: 8,
      }}>
        <span style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize:'3rem', letterSpacing:'0.18em',
          background:'linear-gradient(135deg, #D8F3DC 0%, #52B788 50%, #2D6A4F 100%)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          display:'block', userSelect:'none',
        }}>KAIRO</span>
      </div>

      {/* Tagline */}
      <div style={{
        opacity: phase >= 3 ? 1 : 0,
        transition:'opacity 0.5s ease',
        textAlign:'center', padding:'0 32px',
      }}>
        <p style={{ fontSize:'0.875rem', color:'rgba(255,255,255,0.55)', margin:0, letterSpacing:'0.02em', fontFamily:"'DM Sans', sans-serif" }}>
          Got a problem? KAIRO finds the person who can solve it.
        </p>
      </div>

      {/* Loading bar */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:'rgba(82,183,136,0.1)' }}>
        <div style={{ height:'100%', background:'linear-gradient(90deg, #2D6A4F, #52B788, #2D6A4F)', backgroundSize:'200% 100%', animation:'loadBar 2.8s ease forwards, shimmer 1.5s linear infinite' }}></div>
      </div>

      <style>{`
        @keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }
        @keyframes loadBar { from{width:0} to{width:100%} }
        @keyframes spinSlow { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>
    </div>
  );
}
