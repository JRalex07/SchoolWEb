import React, { useState, useEffect } from 'react';

/**
 * MascotCharacter
 * Redesigned original scholar mascot ("Barnaby the Campus Owl").
 * Built with layered SVG facial components, expressive eyebrow/eye/mouth variants,
 * collegiate mortarboard with golden tassel, and claymorphic 3D depth.
 */
export const MascotCharacter = ({ state = 'idle', onClick, size = 84, style = {} }) => {
  // Blinking timer for idle/relaxed states (disabled if user prefers reduced motion)
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (state !== 'idle' && state !== 'greeting' && state !== 'reassuring') return;
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4200 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [state]);

  // Determine pupil gaze direction based on state
  const getPupilOffset = () => {
    switch (state) {
      case 'thinking':
        return { x: 1.5, y: -2.5 }; // Looking up thoughtfully
      case 'hover':
      case 'explaining':
        return { x: 2, y: 0.5 }; // Looking towards element
      case 'curious':
        return { x: 1.8, y: -1.2 }; // Looking up-right inquisitively
      case 'attentive':
        return { x: 0, y: 1.2 }; // Attentive downward-forward focus
      case 'reassuring':
        return { x: 0, y: 0.5 }; // Calm centered comforting gaze
      case 'confused':
        return { x: -1.4, y: -0.6 }; // Puzzled slight offset
      case 'warning':
        return { x: 0, y: 1 }; // Focused forward
      default:
        return { x: 0, y: 0 };
    }
  };

  const pupil = getPupilOffset();

  const isSmall = typeof size === 'number' && size <= 44;

  return (
    <button
      type="button"
      className={`mascot-character-art state-${state}`}
      onClick={onClick}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        cursor: 'pointer',
        position: 'relative',
        filter: isSmall ? 'drop-shadow(0 2px 4px rgba(15, 30, 54, 0.16))' : 'drop-shadow(0 12px 22px rgba(15, 30, 54, 0.22))',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        userSelect: 'none',
        background: 'transparent',
        border: 'none',
        padding: 0,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style
      }}
      title="Barnaby - Your Campus Companion (Click to open or dismiss help)"
      aria-label={`Campus companion Barnaby in ${state} expression state`}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Body Clay Gradient */}
          <radialGradient id="barnabyBody" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ffd88a" />
            <stop offset="45%" stopColor="#e5a035" />
            <stop offset="85%" stopColor="#bf7a1e" />
            <stop offset="100%" stopColor="#96570c" />
          </radialGradient>

          {/* Soft Clay Belly Gradient */}
          <radialGradient id="barnabyBelly" cx="45%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#dbe4f0" />
          </radialGradient>

          {/* Eye Outline & Sclera Depth */}
          <radialGradient id="eyeSclera" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </radialGradient>

          {/* Academic Mortarboard Gradient */}
          <linearGradient id="barnabyCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3258" />
            <stop offset="60%" stopColor="#0f1e36" />
            <stop offset="100%" stopColor="#070e1b" />
          </linearGradient>

          {/* Golden Medal & Tassel */}
          <linearGradient id="barnabyGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Soft Drop Shadow for Features */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.8" floodColor="#0f1e36" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* 1. Feathered Ear Tufts (Perked up when curious/greeting) */}
        <path
          d="M26 36 C 18 24, 22 18, 30 27 Z"
          fill="#d08622"
          className="mascot-tuft-left"
        />
        <path
          d="M74 36 C 82 24, 78 18, 70 27 Z"
          fill="#d08622"
          className="mascot-tuft-right"
        />

        {/* 2. Feet (Cute little clay talons) */}
        <ellipse cx="38" cy="88" rx="8" ry="4.5" fill="#ca8a04" />
        <ellipse cx="62" cy="88" rx="8" ry="4.5" fill="#ca8a04" />
        <ellipse cx="34" cy="88.5" rx="3" ry="2" fill="#a16207" />
        <ellipse cx="42" cy="88.5" rx="3" ry="2" fill="#a16207" />
        <ellipse cx="58" cy="88.5" rx="3" ry="2" fill="#a16207" />
        <ellipse cx="66" cy="88.5" rx="3" ry="2" fill="#a16207" />

        {/* 3. Volumetric Main Body & Belly */}
        <ellipse cx="50" cy="57" rx="35" ry="33" fill="url(#barnabyBody)" />
        <ellipse cx="50" cy="62" rx="23" ry="22" fill="url(#barnabyBelly)" filter="url(#softShadow)" />

        {/* Belly feather scalloped accents */}
        <path d="M42 63 Q 46 67 50 63" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M50 63 Q 54 67 58 63" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M46 70 Q 50 74 54 70" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* 4. Layered Wings / Gestures */}
        {state === 'greeting' ? (
          /* Waving Left Wing */
          <>
            <path d="M22 57 Q 6 42 12 30 Q 24 38 27 50 Z" fill="#d08622" className="mascot-anim-wave" filter="url(#softShadow)" />
            <path d="M78 57 Q 88 64 83 74 Q 74 74 73 62 Z" fill="#d08622" />
          </>
        ) : state === 'explaining' || state === 'hover' ? (
          /* Explaining / Pointer Right Wing */
          <>
            <path d="M22 57 Q 14 65 19 74 Q 28 72 27 61 Z" fill="#d08622" />
            <path d="M77 56 Q 93 46 89 36 Q 78 43 75 53 Z" fill="#d08622" className="mascot-anim-point" filter="url(#softShadow)" />
          </>
        ) : state === 'thinking' ? (
          /* Wing resting on chin */
          <>
            <path d="M22 57 Q 14 65 19 74 Q 28 72 27 61 Z" fill="#d08622" />
            <path d="M78 58 Q 72 68 62 64 Q 68 54 75 54 Z" fill="#d08622" filter="url(#softShadow)" />
          </>
        ) : state === 'curious' ? (
          /* Wing perked inquisitively outward */
          <>
            <path d="M22 56 Q 14 64 19 74 Q 28 72 27 61 Z" fill="#d08622" />
            <path d="M77 56 Q 90 48 87 40 Q 77 45 74 55 Z" fill="#d08622" filter="url(#softShadow)" />
          </>
        ) : state === 'confused' ? (
          /* Wing raised toward cap in puzzlement */
          <>
            <path d="M22 56 Q 14 64 19 74 Q 28 72 27 61 Z" fill="#d08622" />
            <path d="M78 56 Q 76 43 67 39 Q 70 48 74 58 Z" fill="#d08622" filter="url(#softShadow)" />
          </>
        ) : state === 'success' ? (
          /* Both Wings Raised in Celebration! */
          <>
            <path d="M22 56 Q 10 44 16 34 Q 26 42 27 52 Z" fill="#d08622" className="mascot-anim-cheer-left" filter="url(#softShadow)" />
            <path d="M78 56 Q 90 44 84 34 Q 74 42 73 52 Z" fill="#d08622" className="mascot-anim-cheer-right" filter="url(#softShadow)" />
          </>
        ) : (
          /* Rested Friendly Wings (idle, attentive, reassuring) */
          <>
            <path d="M22 56 Q 14 64 19 74 Q 28 72 27 61 Z" fill="#d08622" />
            <path d="M78 56 Q 86 64 81 74 Q 72 72 73 61 Z" fill="#d08622" />
          </>
        )}

        {/* 5. Collegiate Neck Ribbon with Golden Academy Pin */}
        <path d="M38 74 L50 82 L62 74" stroke="#0f1e36" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="50" cy="80" r="4.5" fill="url(#barnabyGold)" filter="url(#softShadow)" />
        <circle cx="50" cy="80" r="2" fill="#ffffff" opacity="0.6" />

        {/* 6. Expressive Layered Eyebrows */}
        {state === 'warning' ? (
          /* Concerned angled eyebrows */
          <>
            <path d="M32 37 Q 41 41 47 43" stroke="#713f12" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M68 37 Q 59 41 53 43" stroke="#713f12" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          </>
        ) : state === 'thinking' ? (
          /* Furrowed / inquisitive eyebrows */
          <>
            <path d="M33 39 Q 40 37 46 41" stroke="#713f12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M67 36 Q 60 38 54 39" stroke="#713f12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : state === 'hover' || state === 'curious' ? (
          /* One raised inquisitive eyebrow */
          <>
            <path d="M33 34 Q 40 30 46 36" stroke="#713f12" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M67 39 Q 60 37 54 41" stroke="#713f12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : state === 'confused' ? (
          /* Puzzled asymmetrical eyebrows */
          <>
            <path d="M33 42 Q 40 40 46 37" stroke="#713f12" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M67 34 Q 60 32 54 39" stroke="#713f12" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          </>
        ) : state === 'reassuring' ? (
          /* Soft gentle uplifting arches */
          <>
            <path d="M33 38 Q 40 34 46 38" stroke="#713f12" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <path d="M67 38 Q 60 34 54 38" stroke="#713f12" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </>
        ) : (
          /* Gentle natural friendly eyebrows */
          <>
            <path d="M33 39 Q 40 35 46 39" stroke="#713f12" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M67 39 Q 60 35 54 39" stroke="#713f12" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* 7. Expressive Layered Eyes */}
        {state === 'success' ? (
          /* Joyful closed eyes (^_^) with sparkle stars */
          <>
            <path d="M34 49 Q 41 41 48 49" stroke="#0f1e36" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M52 49 Q 59 41 66 49" stroke="#0f1e36" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Sparkle star over head */}
            <path d="M50 32 L51.5 36.5 L56 38 L51.5 39.5 L50 44 L48.5 39.5 L44 38 L48.5 36.5 Z" fill="url(#barnabyGold)" />
          </>
        ) : isBlinking ? (
          /* Natural blink eyelid slit */
          <>
            <path d="M35 50 Q 41 53 47 50" stroke="#0f1e36" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M53 50 Q 59 53 65 50" stroke="#0f1e36" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          /* Open Eyes with Sclera & Pupils */
          <>
            {/* Sclera */}
            <circle cx="41" cy="49" r="8" fill="url(#eyeSclera)" filter="url(#softShadow)" />
            <circle cx="59" cy="49" r="8" fill="url(#eyeSclera)" filter="url(#softShadow)" />

            {/* Iris & Pupil */}
            <circle cx={41 + pupil.x} cy={49 + pupil.y} r={state === 'warning' ? 3.8 : 4.8} fill="#0f1e36" />
            <circle cx={59 + pupil.x} cy={49 + pupil.y} r={state === 'warning' ? 3.8 : 4.8} fill="#0f1e36" />

            {/* Specular Catchlights */}
            <circle cx={43 + pupil.x} cy={47 + pupil.y} r="1.8" fill="#ffffff" />
            <circle cx={61 + pupil.x} cy={47 + pupil.y} r="1.8" fill="#ffffff" />
            <circle cx={40 + pupil.x} cy={51 + pupil.y} r="0.9" fill="#ffffff" />
            <circle cx={58 + pupil.x} cy={51 + pupil.y} r="0.9" fill="#ffffff" />
          </>
        )}

        {/* 8. Cheeks (Cute blush) */}
        <ellipse cx="32" cy="58" rx="4.5" ry="3" fill="#f43f5e" opacity="0.3" />
        <ellipse cx="68" cy="58" rx="4.5" ry="3" fill="#f43f5e" opacity="0.3" />

        {/* 9. Expressive Beak & Mouth Variants */}
        {state === 'greeting' || state === 'explaining' || state === 'speaking' ? (
          /* Open speaking/smiling beak with tongue */
          <g transform="translate(0, 0)">
            <polygon points="50,53 42,60 58,60" fill="#eab308" stroke="#a16207" strokeWidth="1" />
            <path d="M44 60 Q 50 67 56 60 Z" fill="#991b1b" />
            <ellipse cx="50" cy="62" rx="3" ry="1.5" fill="#f43f5e" />
          </g>
        ) : state === 'thinking' ? (
          /* Small thoughtful 'o' beak */
          <g transform="translate(0, 0)">
            <polygon points="50,54 44,60 56,60" fill="#eab308" stroke="#a16207" strokeWidth="1" />
            <circle cx="50" cy="58" r="2" fill="#78350f" />
          </g>
        ) : state === 'curious' ? (
          /* Perked curious beak */
          <g transform="translate(0, 0)">
            <polygon points="50,53 44,60 56,59" fill="#eab308" stroke="#a16207" strokeWidth="1" />
            <ellipse cx="50" cy="58.5" rx="3.5" ry="1.5" fill="#fef08a" opacity="0.7" />
          </g>
        ) : state === 'confused' ? (
          /* Puzzled wavy beak */
          <g transform="translate(0, 0)">
            <polygon points="50,54 43,60 57,60" fill="#eab308" stroke="#a16207" strokeWidth="1" />
            <path d="M45 60 Q 48 58 50 60 Q 53 62 55 60" stroke="#78350f" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>
        ) : state === 'warning' ? (
          /* Alert slightly focused beak */
          <g transform="translate(0, 0)">
            <polygon points="50,54 43,59 57,59" fill="#eab308" stroke="#a16207" strokeWidth="1" />
            <path d="M45 59 Q 50 57 55 59" stroke="#78350f" strokeWidth="1.2" fill="none" />
          </g>
        ) : state === 'reassuring' ? (
          /* Gentle comforting smile beak */
          <g transform="translate(0, 0)">
            <polygon points="50,54 43,60 57,60" fill="#eab308" stroke="#a16207" strokeWidth="1" />
            <path d="M45 60 Q 50 63 55 60" stroke="#92400e" strokeWidth="1" fill="none" />
            <ellipse cx="50" cy="59" rx="4.5" ry="2" fill="#fef08a" opacity="0.8" />
          </g>
        ) : (
          /* Friendly cheerful closed beak (idle, attentive) */
          <g transform="translate(0, 0)">
            <polygon points="50,54 43,60 57,60" fill="#eab308" stroke="#a16207" strokeWidth="1" />
            <ellipse cx="50" cy="59" rx="4.5" ry="2" fill="#fef08a" opacity="0.7" />
          </g>
        )}

        {/* 10. Academic Mortarboard Cap */}
        <g className="barnaby-cap" transform="translate(0, -3)">
          {/* Skullcap */}
          <ellipse cx="50" cy="27" rx="15" ry="7.5" fill="#070e1b" />
          {/* Diamond Board */}
          <polygon points="50,13 76,23 50,31 24,23" fill="url(#barnabyCapGrad)" filter="url(#softShadow)" />
          {/* Golden Center Button */}
          <circle cx="50" cy="22" r="2.8" fill="url(#barnabyGold)" />
          {/* Golden Tassel String */}
          <path d="M50 22 Q 63 26 68 37" stroke="url(#barnabyGold)" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Tassel Fringe */}
          <polygon points="67,36 71,38 66,43 64,41" fill="url(#barnabyGold)" />
        </g>
      </svg>
    </button>
  );
};
