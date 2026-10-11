import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * LeadershipPortrait
 * Renders a high-fidelity 3D claymorphic human portrait placeholder based on the
 * reference aesthetic (sculpted volume, soft studio keylight, ambient occlusion,
 * tactile pastel attire), or a user-configured real photograph when provided.
 *
 * @param {Object} props
 * @param {'principal' | 'vicePrincipal'} props.role - Role defining distinct clay bust design
 * @param {string | null} props.photoUrl - Optional custom photo URL override
 * @param {string} props.name - Display name for accessibility
 * @param {number | string} props.size - Portrait diameter or bounding width
 * @param {string} props.className - Additional class names
 */
export const LeadershipPortrait = ({
  role = 'principal',
  photoUrl = null,
  name = '',
  size = 180,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const isPrincipal = role === 'principal';
  const roleTitle = isPrincipal ? 'Principal' : 'Vice Principal';
  const defaultAlt = isPrincipal
    ? 'Principal portrait placeholder'
    : 'Vice principal portrait placeholder';

  // If a valid custom photo is provided and hasn't errored, display the photo
  if (photoUrl && !imageError) {
    return (
      <div
        className={`leadership-portrait-container ${className}`}
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
          maxWidth: '100%',
          aspectRatio: '1 / 1',
          borderRadius: '28px',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #FAF7F2, #EDE8DF)',
          border: '3px solid rgba(255, 255, 255, 0.95)',
          boxShadow: 'var(--clay-card)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img
          src={photoUrl}
          alt={name ? `${name} - ${roleTitle}` : defaultAlt}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          loading="lazy"
        />
        {/* Clay ambient gloss sheen overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.6), inset 0 -3px 6px rgba(0, 0, 0, 0.1)',
            pointerEvents: 'none'
          }}
        />
      </div>
    );
  }

  // Otherwise, render the refined, sculpted 3D Claymorphic Avatar
  return (
    <div
      className={`leadership-portrait-container ${isPrincipal ? 'clay-portrait-principal' : 'clay-portrait-vice-principal'} ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        maxWidth: '100%',
        aspectRatio: '1 / 1',
        borderRadius: '32px',
        background: isPrincipal
          ? 'linear-gradient(155deg, #FFFDF8 0%, #F5EFEB 50%, #E8DFD8 100%)'
          : 'linear-gradient(155deg, #FFFDF8 0%, #F3EDF8 50%, #E3DAEC 100%)',
        border: '3.5px solid rgba(255, 255, 255, 0.98)',
        boxShadow: 'var(--clay-card)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none'
      }}
      title={`${roleTitle} Portrait Placeholder (Claymorphism Demo)`}
      aria-label={defaultAlt}
      role="img"
    >
      <svg
        viewBox="0 0 160 160"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', transform: 'scale(1.04)' }}
      >
        <defs>
          {/* Studio Keylight Skin Gradient */}
          <radialGradient id={`skinGrad_${role}`} cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#FFF2E2" />
            <stop offset="45%" stopColor="#F7DDC2" />
            <stop offset="85%" stopColor="#E8BFA2" />
            <stop offset="100%" stopColor="#D4A385" />
          </radialGradient>

          {/* Diffuse Ambient Shadow Filter */}
          <filter id={`clayShadow_${role}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3.5" stdDeviation="3" floodColor="#1E1838" floodOpacity="0.16" />
          </filter>

          {/* Soft Highlight Filter */}
          <filter id={`softGlow_${role}`} x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {isPrincipal ? (
            /* Principal Hair & Blazer Gradients */
            <>
              <linearGradient id="princHairGrad" x1="20%" y1="10%" x2="80%" y2="90%">
                <stop offset="0%" stopColor="#64748B" />
                <stop offset="40%" stopColor="#475569" />
                <stop offset="85%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              <radialGradient id="princBlazerGrad" cx="45%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#2A2266" />
                <stop offset="60%" stopColor="#1E1850" />
                <stop offset="100%" stopColor="#130F36" />
              </radialGradient>

              <linearGradient id="princTieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="spectaclesGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </>
          ) : (
            /* Vice Principal Hair & Attire Gradients */
            <>
              <radialGradient id="vpBunGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#784A36" />
                <stop offset="50%" stopColor="#5C3424" />
                <stop offset="90%" stopColor="#422416" />
                <stop offset="100%" stopColor="#2E170C" />
              </radialGradient>

              <radialGradient id="vpSweaterGrad" cx="42%" cy="28%" r="72%">
                <stop offset="0%" stopColor="#FCD34D" />
                <stop offset="45%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </radialGradient>

              <linearGradient id="vpCollarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
            </>
          )}
        </defs>

        {isPrincipal ? (
          /* =================================================================
             PRINCIPAL SCULPTED 3D CLAY BUST
             Scholarly, distinguished academic with sculpted hair, soft clay
             spectacles, warm smile with catchlights, navy clay blazer & golden tie.
             ================================================================= */
          <g id="principal-clay-sculpt">
            {/* 1. Sculpted Shoulders & Collegiate Navy Blazer */}
            <path
              d="M26 142 C26 118, 52 110, 80 110 C108 110, 134 118, 134 142 L134 160 L26 160 Z"
              fill="url(#princBlazerGrad)"
              filter={`url(#clayShadow_${role})`}
            />

            {/* Inner White Crisp Clay Shirt Collar */}
            <path
              d="M68 110 L80 128 L92 110 L88 106 L72 106 Z"
              fill="#FFFFFF"
            />
            {/* Golden Academic Tie */}
            <path
              d="M78 126 L82 126 L84 146 L80 152 L76 146 Z"
              fill="url(#princTieGrad)"
              filter={`url(#clayShadow_${role})`}
            />
            {/* Blazer Lapel Sculpted Curves */}
            <path
              d="M58 114 L74 136 L70 148 L46 122 Z"
              fill="#261E5C"
            />
            <path
              d="M102 114 L86 136 L90 148 L114 122 Z"
              fill="#261E5C"
            />
            {/* Golden Lapel Pin / Badge */}
            <circle cx="56" cy="128" r="3" fill="url(#spectaclesGold)" />

            {/* 2. Sculpted Neck */}
            <rect
              x="71"
              y="88"
              width="18"
              height="24"
              rx="9"
              fill={`url(#skinGrad_${role})`}
            />
            {/* Neck Ambient Occlusion Shadow */}
            <path
              d="M71 96 C74 102, 86 102, 89 96 L89 104 C86 107, 74 107, 71 104 Z"
              fill="#C79679"
              opacity="0.45"
            />

            {/* 3. Sculpted Ears */}
            <ellipse cx="44" cy="69" rx="6.5" ry="9" fill={`url(#skinGrad_${role})`} filter={`url(#clayShadow_${role})`} />
            <ellipse cx="45" cy="69" rx="3.5" ry="5.5" fill="#E8BFA2" opacity="0.6" />
            <ellipse cx="116" cy="69" rx="6.5" ry="9" fill={`url(#skinGrad_${role})`} filter={`url(#clayShadow_${role})`} />
            <ellipse cx="115" cy="69" rx="3.5" ry="5.5" fill="#E8BFA2" opacity="0.6" />

            {/* 4. Sculpted Head & Jaw */}
            <ellipse
              cx="80"
              cy="67"
              rx="33"
              ry="35"
              fill={`url(#skinGrad_${role})`}
              filter={`url(#clayShadow_${role})`}
            />

            {/* Warm Clay Rosy Cheeks */}
            <ellipse cx="61" cy="74" rx="7" ry="4.5" fill="#F43F5E" opacity="0.22" />
            <ellipse cx="99" cy="74" rx="7" ry="4.5" fill="#F43F5E" opacity="0.22" />

            {/* 5. Sculpted Graying Hair (Puff volume with gentle side parts) */}
            <path
              d="M45 56 C44 32, 60 22, 80 22 C100 22, 116 32, 115 56 C111 44, 98 36, 80 37 C64 37, 50 44, 45 56 Z"
              fill="url(#princHairGrad)"
              filter={`url(#clayShadow_${role})`}
            />
            {/* Side Hair Volume Tufts */}
            <path
              d="M44 54 C42 62, 43 71, 46 76 C45 68, 46 60, 49 55 Z"
              fill="url(#princHairGrad)"
            />
            <path
              d="M116 54 C118 62, 117 71, 114 76 C115 68, 114 60, 111 55 Z"
              fill="url(#princHairGrad)"
            />
            {/* Soft Hair Highlights */}
            <path
              d="M58 32 C68 28, 86 28, 98 33"
              stroke="#94A3B8"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.45"
            />

            {/* 6. Distingushed Scholarly Eyebrows */}
            <path
              d="M57 54 Q65 51 72 54"
              stroke="#334155"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M88 54 Q95 51 103 54"
              stroke="#334155"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* 7. Eyes with Catchlights */}
            <ellipse cx="65" cy="63" rx="4.5" ry="5.5" fill="#1E293B" />
            <circle cx="66.5" cy="61.5" r="1.8" fill="#FFFFFF" />
            <circle cx="63.5" cy="64.5" r="0.9" fill="#FFFFFF" />

            <ellipse cx="95" cy="63" rx="4.5" ry="5.5" fill="#1E293B" />
            <circle cx="96.5" cy="61.5" r="1.8" fill="#FFFFFF" />
            <circle cx="93.5" cy="64.5" r="0.9" fill="#FFFFFF" />

            {/* 8. Scholarly Golden Spectacles (Clay Eyeglasses) */}
            <g id="clay-glasses">
              {/* Left Rim */}
              <rect
                x="54"
                y="54"
                width="22"
                height="18"
                rx="7"
                fill="none"
                stroke="url(#spectaclesGold)"
                strokeWidth="2.4"
                filter={`url(#clayShadow_${role})`}
              />
              {/* Right Rim */}
              <rect
                x="84"
                y="54"
                width="22"
                height="18"
                rx="7"
                fill="none"
                stroke="url(#spectaclesGold)"
                strokeWidth="2.4"
                filter={`url(#clayShadow_${role})`}
              />
              {/* Nose Bridge */}
              <path
                d="M76 62 Q80 59 84 62"
                stroke="url(#spectaclesGold)"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Left & Right Temples */}
              <path d="M54 62 L44 64" stroke="url(#spectaclesGold)" strokeWidth="2" strokeLinecap="round" />
              <path d="M106 62 L116 64" stroke="url(#spectaclesGold)" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* 9. Soft Clay Sculpted Nose */}
            <path
              d="M77 67 Q80 73 83 67"
              stroke="#D4A385"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />

            {/* 10. Warm, Dignified Smile */}
            <path
              d="M71 78 Q80 85 89 78"
              stroke="#991B1B"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Subtle Lip Accent */}
            <path
              d="M74 81 Q80 84 86 81"
              stroke="#E11D48"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.4"
            />
          </g>
        ) : (
          /* =================================================================
             VICE PRINCIPAL SCULPTED 3D CLAY BUST
             Warm, creative, inspiring academic leader with sculpted top-bun
             hair volume (directly evocative of reference image), warm golden
             clay sweater with white shirt collar, and engaging friendly smile.
             ================================================================= */
          <g id="vice-principal-clay-sculpt">
            {/* 1. Sculpted Top-Bun Volume (Directly inspired by reference illustration) */}
            <circle
              cx="80"
              cy="23"
              r="17"
              fill="url(#vpBunGrad)"
              filter={`url(#clayShadow_${role})`}
            />
            {/* Top Bun Sculpted Swirl */}
            <path
              d="M74 15 C82 12, 90 20, 84 27 C78 30, 72 24, 78 18"
              stroke="#A16207"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
            <ellipse cx="80" cy="27" rx="9" ry="3.5" fill="#422416" opacity="0.3" />

            {/* 2. Sculpted Shoulders & Warm Saffron Clay Sweater */}
            <path
              d="M26 142 C26 118, 52 110, 80 110 C108 110, 134 118, 134 142 L134 160 L26 160 Z"
              fill="url(#vpSweaterGrad)"
              filter={`url(#clayShadow_${role})`}
            />
            {/* Sculpted Knit Ribbing Neckband */}
            <path
              d="M62 110 C68 118, 92 118, 98 110"
              stroke="#D97706"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Peeking White Clay Collar */}
            <path
              d="M68 108 L78 117 L82 117 L92 108"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* 3. Sculpted Neck */}
            <rect
              x="71"
              y="88"
              width="18"
              height="24"
              rx="9"
              fill={`url(#skinGrad_${role})`}
            />
            <path
              d="M71 96 C74 102, 86 102, 89 96 L89 104 C86 107, 74 107, 71 104 Z"
              fill="#C79679"
              opacity="0.45"
            />

            {/* 4. Sculpted Ears */}
            <ellipse cx="44" cy="70" rx="6.5" ry="9" fill={`url(#skinGrad_${role})`} filter={`url(#clayShadow_${role})`} />
            <ellipse cx="45" cy="70" rx="3.5" ry="5.5" fill="#E8BFA2" opacity="0.6" />
            <ellipse cx="116" cy="70" rx="6.5" ry="9" fill={`url(#skinGrad_${role})`} filter={`url(#clayShadow_${role})`} />
            <ellipse cx="115" cy="70" rx="3.5" ry="5.5" fill="#E8BFA2" opacity="0.6" />

            {/* 5. Sculpted Head & Soft Oval Jaw */}
            <ellipse
              cx="80"
              cy="68"
              rx="33"
              ry="35"
              fill={`url(#skinGrad_${role})`}
              filter={`url(#clayShadow_${role})`}
            />

            {/* Warm Friendly Rosy Cheeks */}
            <ellipse cx="60" cy="75" rx="7.5" ry="5" fill="#F43F5E" opacity="0.25" />
            <ellipse cx="100" cy="75" rx="7.5" ry="5" fill="#F43F5E" opacity="0.25" />

            {/* 6. Sculpted Brunette Hair Framing (Fluffy soft clay bangs & tendrils) */}
            <path
              d="M44 56 C42 34, 58 28, 80 28 C102 28, 118 34, 116 56 C112 45, 96 40, 80 40 C64 40, 48 45, 44 56 Z"
              fill="url(#vpBunGrad)"
              filter={`url(#clayShadow_${role})`}
            />
            {/* Soft Clay Bang Tendrils (Like reference image) */}
            <path
              d="M50 46 C56 54, 68 56, 76 50 C70 43, 58 42, 50 46 Z"
              fill="#5C3424"
            />
            <path
              d="M110 46 C104 54, 92 56, 84 50 C90 43, 102 42, 110 46 Z"
              fill="#5C3424"
            />
            {/* Side Tendrils hugging cheeks */}
            <path
              d="M43 54 C40 64, 43 74, 47 79 C44 71, 45 61, 47 54 Z"
              fill="url(#vpBunGrad)"
            />
            <path
              d="M117 54 C120 64, 117 74, 113 79 C116 71, 115 61, 113 54 Z"
              fill="url(#vpBunGrad)"
            />

            {/* 7. Soft Natural Arched Eyebrows */}
            <path
              d="M56 55 Q64 51 72 55"
              stroke="#451A03"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              d="M88 55 Q96 51 104 55"
              stroke="#451A03"
              strokeWidth="2.8"
              strokeLinecap="round"
            />

            {/* 8. Expressive Warm Almond Eyes with High Catchlights */}
            <ellipse cx="64" cy="64" rx="4.8" ry="6" fill="#1C1917" />
            <circle cx="66" cy="62" r="2" fill="#FFFFFF" />
            <circle cx="62.5" cy="65.5" r="1" fill="#FFFFFF" />

            <ellipse cx="96" cy="64" rx="4.8" ry="6" fill="#1C1917" />
            <circle cx="98" cy="62" r="2" fill="#FFFFFF" />
            <circle cx="94.5" cy="65.5" r="1" fill="#FFFFFF" />

            {/* Subtle Eyelashes */}
            <path d="M68 60 L71 58" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M100 60 L103 58" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />

            {/* 9. Soft Cute Clay Button Nose */}
            <ellipse cx="80" cy="70" rx="3.5" ry="2.5" fill="#D4A385" opacity="0.75" />
            <path d="M78 71 Q80 72.5 82 71" stroke="#A86D4E" strokeWidth="1.2" strokeLinecap="round" />

            {/* 10. Joyful Welcoming Smile */}
            <path
              d="M71 78 Q80 87 89 78"
              stroke="#991B1B"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Open Gentle Smile Depth */}
            <path
              d="M73 79 Q80 86 87 79 Z"
              fill="#BE123C"
            />
            <ellipse cx="80" cy="82.5" rx="3.5" ry="1.5" fill="#FDA4AF" />
          </g>
        )}
      </svg>

      {/* Tactile 3D Clay Rim Sheen (Top-left studio highlight + bottom-right occlusion) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          boxShadow: 'inset 0 3px 5px rgba(255, 255, 255, 0.75), inset 0 -3px 6px rgba(48, 39, 100, 0.08)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default LeadershipPortrait;
