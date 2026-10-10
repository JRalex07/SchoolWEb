import React from 'react';

/**
 * SchoolDefaultLogo
 * Premium, neutral academic school crest SVG icon designed for the claymorphism design system.
 * Features an academic shield, open book of knowledge, golden torch flame, and laurels.
 */
export const SchoolDefaultLogo = ({
  size = 38,
  idPrefix = 'school-emblem',
  className = '',
  style = {}
}) => {
  const p = idPrefix ? `${idPrefix}-` : '';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
      role="img"
      aria-label="Neutral School Crest"
    >
      <defs>
        {/* Background Clay Gradients */}
        <linearGradient id={`${p}shieldBg`} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3A3078" />
          <stop offset="50%" stopColor="#261F58" />
          <stop offset="100%" stopColor="#18133C" />
        </linearGradient>
        <linearGradient id={`${p}shieldRim`} x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#F4A024" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </linearGradient>

        {/* Golden Flame Gradients */}
        <linearGradient id={`${p}flameGrad`} x1="32" y1="12" x2="32" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF3B0" />
          <stop offset="35%" stopColor="#F4A024" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>
        <linearGradient id={`${p}innerFlameGrad`} x1="32" y1="18" x2="32" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFD54F" />
        </linearGradient>

        {/* Book Pages Gradients */}
        <linearGradient id={`${p}leftPageGrad`} x1="18" y1="31" x2="32" y2="43" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EDE9FE" />
        </linearGradient>
        <linearGradient id={`${p}rightPageGrad`} x1="46" y1="31" x2="32" y2="43" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        {/* Gold Trim Gradients */}
        <linearGradient id={`${p}goldTrim`} x1="20" y1="20" x2="44" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="50%" stopColor="#F4A024" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <filter id={`${p}clayShadow`} x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#0B091E" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Outer Clay Shield / Medallion */}
      <path
        d="M 32 6 C 47 6 54 11 54 22 C 54 39 42 53 32 58 C 22 53 10 39 10 22 C 10 11 17 6 32 6 Z"
        fill={`url(#${p}shieldBg)`}
        filter={`url(#${p}clayShadow)`}
      />
      <path
        d="M 32 6 C 47 6 54 11 54 22 C 54 39 42 53 32 58 C 22 53 10 39 10 22 C 10 11 17 6 32 6 Z"
        stroke={`url(#${p}shieldRim)`}
        strokeWidth="1.75"
        fill="none"
      />

      {/* Inset Rim Lighting */}
      <path
        d="M 32 9 C 44 9 50 13 50 22 C 50 36 40 48 32 53 C 24 48 14 36 14 22 C 14 13 20 9 32 9 Z"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1"
        fill="none"
      />

      {/* Academic Laurels */}
      <g fill={`url(#${p}goldTrim)`} opacity="0.9">
        <path d="M 16 32 C 14 30 14 26 18 28 C 18 30 17 32 16 32 Z" />
        <path d="M 17 38 C 15 36 16 32 20 34 C 19 36 18 38 17 38 Z" />
        <path d="M 21 44 C 19 43 20 39 24 40 C 23 42 22 44 21 44 Z" />
        <path d="M 26 49 C 24 49 24 45 28 46 C 28 48 27 49 26 49 Z" />

        <path d="M 48 32 C 50 30 50 26 46 28 C 46 30 47 32 48 32 Z" />
        <path d="M 47 38 C 49 36 48 32 44 34 C 45 36 46 38 47 38 Z" />
        <path d="M 43 44 C 45 43 44 39 40 40 C 41 42 42 44 43 44 Z" />
        <path d="M 38 49 C 40 49 40 45 36 46 C 36 48 37 49 38 49 Z" />
      </g>

      {/* Open Book of Knowledge */}
      <path
        d="M 18 43.5 C 24 41 30 42 32 45 C 34 42 40 41 46 43.5 L 46 32 C 40 29.5 34 30.5 32 33.5 C 30 30.5 24 29.5 18 32 Z"
        fill="rgba(10, 7, 28, 0.45)"
      />

      {/* Left Page */}
      <path
        d="M 19 42 C 24 39.5 29.5 40.5 32 43.5 L 32 32 C 29.5 29 24 28 19 30.5 Z"
        fill={`url(#${p}leftPageGrad)`}
        stroke="rgba(255, 255, 255, 0.7)"
        strokeWidth="0.75"
      />
      <path d="M 22 33.5 C 25 32.5 28 33 29.5 34.5" stroke="#94A3B8" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M 22 36.5 C 25 35.5 28 36 29.5 37.5" stroke="#94A3B8" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M 22 39.5 C 25 38.5 28 39 29.5 40.5" stroke="#94A3B8" strokeWidth="0.7" strokeLinecap="round" />

      {/* Right Page */}
      <path
        d="M 45 42 C 40 39.5 34.5 40.5 32 43.5 L 32 32 C 34.5 29 40 28 45 30.5 Z"
        fill={`url(#${p}rightPageGrad)`}
        stroke="rgba(255, 255, 255, 0.7)"
        strokeWidth="0.75"
      />
      <path d="M 42 33.5 C 39 32.5 36 33 34.5 34.5" stroke="#94A3B8" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M 42 36.5 C 39 35.5 36 36 34.5 37.5" stroke="#94A3B8" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M 42 39.5 C 39 38.5 36 39 34.5 40.5" stroke="#94A3B8" strokeWidth="0.7" strokeLinecap="round" />

      {/* Spine Ribbon */}
      <path d="M 32 32 L 32 44.5" stroke={`url(#${p}goldTrim)`} strokeWidth="1.5" strokeLinecap="round" />

      {/* Torch / Flame */}
      <path
        d="M 29.5 29 C 30.5 30.5 33.5 30.5 34.5 29 L 33.5 32 L 30.5 32 Z"
        fill={`url(#${p}goldTrim)`}
      />
      <path
        d="M 32 13 C 35.5 18 37 21.5 35.5 25 C 34.2 27.5 32 28.5 32 28.5 C 32 28.5 29.8 27.5 28.5 25 C 27 21.5 28.5 18 32 13 Z"
        fill={`url(#${p}flameGrad)`}
      />
      <path
        d="M 32 18 C 33.8 21 34.5 23 33.5 25 C 32.8 26.3 32 27 32 27 C 32 27 31.2 26.3 30.5 25 C 29.5 23 30.2 21 32 18 Z"
        fill={`url(#${p}innerFlameGrad)`}
      />

      {/* Crown Stars */}
      <path
        d="M 32 8.5 L 32.8 10.3 L 34.7 10.6 L 33.3 12 L 33.6 13.9 L 32 13 L 30.4 13.9 L 30.7 12 L 29.3 10.6 L 31.2 10.3 Z"
        fill="#FFD54F"
        opacity="0.95"
      />
      <circle cx="24.5" cy="11.5" r="1.1" fill="#FFE082" opacity="0.85" />
      <circle cx="39.5" cy="11.5" r="1.1" fill="#FFE082" opacity="0.85" />
    </svg>
  );
};
