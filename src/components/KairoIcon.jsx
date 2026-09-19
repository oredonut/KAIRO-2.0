import React from 'react';

export default function KairoIcon({ size = 32, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {/* Outer rounded geometric container / emblem */}
      <rect width="40" height="40" rx="10" fill="#14532D" />
      
      {/* Left Block (Problem Node) */}
      <rect x="8" y="14" width="10" height="12" rx="3" fill="#FFFFFF" opacity="0.9" />
      
      {/* Right Block (Solution/Skill Node) */}
      <rect x="22" y="14" width="10" height="12" rx="3" fill="#217A4B" />
      
      {/* Connecting Central Bridge / Link */}
      <path d="M14 20H26" stroke="#D9A441" strokeWidth="3" strokeLinecap="round" />
      
      {/* Central Spark / Golden Node */}
      <circle cx="20" cy="20" r="2.5" fill="#D9A441" />
    </svg>
  );
}

export function KairoLogo({ size = 32, showText = true, textStyle = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <KairoIcon size={size} />
      {showText && (
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 800,
          fontSize: `${size * 0.7}px`,
          color: 'var(--deep-evergreen)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          ...textStyle
        }}>
          KAIRO
        </span>
      )}
    </div>
  );
}
