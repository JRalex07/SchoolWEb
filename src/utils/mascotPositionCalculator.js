/**
 * mascotPositionCalculator.js
 * Mathematical positioning engine that calculates the combined safe footprint
 * of the mascot character and speech bubble within the viewport.
 * 
 * Supports responsive interaction modes (Desktop, Tablet-Touch, Mobile).
 * Guarantees zero off-screen overflow, zero clipping, and automatic side/vertical
 * flipping based on dynamic space availability and visual viewport limits.
 */

export const MASCOT_DIMENSIONS = {
  desktop: { width: 116, height: 94 }, // Character (84px) + gap (7px) + quick dismiss button (25px)
  minimized: { width: 148, height: 42 }, // Minimized pill footprint (Barnaby + text + chevron)
  mobile: { width: 44, height: 44 }
};

export const BUBBLE_MAX_WIDTH = 310; // Compact, friendly speech bubble width (prevents oversized stretching)

export const VIEWPORT_INSETS = {
  padX: 16,
  padTop: 82, // Safeguards against sticky header navbar (74px)
  padBottom: 16,
  gap: 12
};

/**
 * Calculates safe, non-overflowing fixed coordinates for both the mascot
 * and the speech bubble based on the current predefined stop, viewport dimensions,
 * and device mode.
 *
 * @param {Object} options
 * @param {Object} options.stop - The current movement stop config
 * @param {number} options.viewportWidth - window.innerWidth or visualViewport.width
 * @param {number} options.viewportHeight - window.innerHeight or visualViewport.height
 * @param {string} options.deviceMode - 'desktop' | 'tablet-touch' | 'mobile'
 * @param {boolean} options.isBubbleOpen - Whether speech bubble is active
 * @param {boolean} options.isMinimized - Whether mascot is in minimized pill mode
 * @param {Object} options.bubbleDimensions - Measured width and height of bubble
 * @returns {Object} Safe coordinates and placement mode
 */
export function calculateSafeAssistantLayout({
  stop,
  viewportWidth,
  viewportHeight,
  deviceMode = 'desktop',
  isBubbleOpen = true,
  isMinimized = false,
  bubbleDimensions = { width: 310, height: 130 },
  obstacles = []
}) {
  const { padX, padTop, padBottom, gap } = VIEWPORT_INSETS;
  const isMobile = deviceMode === 'mobile' || viewportWidth <= 640;
  const mascotDims = isMobile
    ? MASCOT_DIMENSIONS.mobile
    : (isMinimized ? MASCOT_DIMENSIONS.minimized : MASCOT_DIMENSIONS.desktop);
  const mascotW = mascotDims.width;
  const mascotH = mascotDims.height;

  // Viewport clamping bounds for the mascot
  const minMascotX = padX;
  const maxMascotX = Math.max(padX, viewportWidth - mascotW - padX);
  const minMascotY = padTop;
  const maxMascotY = Math.max(padTop, viewportHeight - mascotH - padBottom);

  let mascotX = 0;
  let mascotY = 0;

  if (isMobile) {
    // Mobile Mode: Stationed safely at the bottom right corner so it never covers inputs or content
    mascotX = maxMascotX;
    mascotY = Math.max(padTop, viewportHeight - mascotH - padBottom - 8);
  } else {
    // Desktop / Tablet Mode: Follows predefined named movement stops
    if (stop.side === 'left') {
      mascotX = viewportWidth > 768 ? padX + 12 : padX;
    } else {
      mascotX = maxMascotX;
    }

    const ratio = typeof stop.verticalRatio === 'number' ? stop.verticalRatio : 0.35;
    mascotY = Math.round(viewportHeight * ratio);
    if (stop.minTop) {
      mascotY = Math.max(stop.minTop, mascotY);
    }
  }

  // Final mascot coordinate clamp
  mascotX = Math.round(Math.max(minMascotX, Math.min(maxMascotX, mascotX)));
  mascotY = Math.round(Math.max(minMascotY, Math.min(maxMascotY, mascotY)));

  // If bubble is not open, return just the safe mascot position
  if (!isBubbleOpen) {
    return {
      mascot: { x: mascotX, y: mascotY },
      bubble: null,
      placement: null,
      maxBubbleWidth: BUBBLE_MAX_WIDTH,
      isMobile
    };
  }

  // Measure & Constrain Speech Bubble Dimensions to compact, friendly proportion
  const maxAllowedBubbleW = Math.min(BUBBLE_MAX_WIDTH, Math.max(200, viewportWidth - (padX * 2)));
  const measuredW = Math.min(BUBBLE_MAX_WIDTH, bubbleDimensions.width || BUBBLE_MAX_WIDTH);
  const safeBubbleW = Math.min(measuredW, maxAllowedBubbleW);
  const safeBubbleH = Math.min(viewportHeight - padTop - padBottom - gap, bubbleDimensions.height || 130);

  // Strict Viewport Clamping bounds for Speech Bubble
  const minBubbleX = padX;
  const maxBubbleX = Math.max(padX, viewportWidth - safeBubbleW - padX);
  const minBubbleY = padTop;
  const maxBubbleY = Math.max(padTop, viewportHeight - safeBubbleH - padBottom);

  // Collision detection helper against interactive obstacles
  const checkObstacleCollision = (bx, by, bw, bh) => {
    if (!obstacles || obstacles.length === 0) return false;
    const bRight = bx + bw;
    const bBottom = by + bh;
    for (const obs of obstacles) {
      if (!obs) continue;
      // Buffer of 6px
      const oLeft = (obs.left ?? 0) - 6;
      const oRight = (obs.right ?? (obs.left + (obs.width || 0))) + 6;
      const oTop = (obs.top ?? 0) - 6;
      const oBottom = (obs.bottom ?? (obs.top + (obs.height || 0))) + 6;
      if (!(bRight < oLeft || bx > oRight || bBottom < oTop || by > oBottom)) {
        return obs;
      }
    }
    return null;
  };

  let placement = 'left';
  let bubbleX = 0;
  let bubbleY = 0;

  if (isMobile) {
    // Mobile Mode: Speech bubble sits cleanly above the bottom action bar/trigger
    placement = 'above';
    bubbleX = padX;
    bubbleY = Math.max(padTop, mascotY - safeBubbleH - gap);
  } else {
    // Available space in cardinal directions relative to mascot
    const spaceToLeft = mascotX - padX - gap;
    const spaceToRight = (viewportWidth - padX) - (mascotX + mascotW + gap);
    const spaceAbove = mascotY - padTop - gap;
    const spaceBelow = (viewportHeight - padBottom) - (mascotY + mascotH + gap);

    if (stop.side === 'right') {
      // Right-anchored: Default try placing bubble to the LEFT of mascot
      let candidateX = mascotX - safeBubbleW - gap;
      let candidateY = mascotY - 10;
      let candidatePlacement = 'left';

      // Check if candidate placement collides with any interactive obstacles (e.g. Hero CTAs)
      const collision = checkObstacleCollision(candidateX, candidateY, safeBubbleW, safeBubbleH);
      if (collision) {
        // Try placing above if space permits
        if (spaceAbove >= safeBubbleH && !checkObstacleCollision(mascotX + mascotW - safeBubbleW, mascotY - safeBubbleH - gap, safeBubbleW, safeBubbleH)) {
          candidatePlacement = 'above';
          candidateX = mascotX + mascotW - safeBubbleW;
          candidateY = mascotY - safeBubbleH - gap;
        } else if (spaceBelow >= safeBubbleH && !checkObstacleCollision(mascotX + mascotW - safeBubbleW, mascotY + mascotH + gap, safeBubbleW, safeBubbleH)) {
          candidatePlacement = 'below';
          candidateX = mascotX + mascotW - safeBubbleW;
          candidateY = mascotY + mascotH + gap;
        } else if (collision.top && (collision.top - safeBubbleH - gap) >= minBubbleY) {
          // Shift vertically above the obstacle
          candidateY = Math.max(minBubbleY, collision.top - safeBubbleH - gap);
        } else if (collision.bottom && (collision.bottom + gap) <= maxBubbleY) {
          // Shift vertically below the obstacle
          candidateY = Math.min(maxBubbleY, collision.bottom + gap);
        }
      } else if (spaceToLeft < safeBubbleW) {
        if (spaceAbove >= safeBubbleH) {
          candidatePlacement = 'above';
          candidateY = mascotY - safeBubbleH - gap;
          candidateX = mascotX + mascotW - safeBubbleW;
        } else {
          candidatePlacement = 'below';
          candidateY = mascotY + mascotH + gap;
          candidateX = mascotX + mascotW - safeBubbleW;
        }
      }

      placement = candidatePlacement;
      bubbleX = candidateX;
      bubbleY = candidateY;
    } else {
      // Left-anchored: Default try placing bubble to the RIGHT of mascot
      let candidateX = mascotX + mascotW + gap;
      let candidateY = mascotY - 10;
      let candidatePlacement = 'right';

      const collision = checkObstacleCollision(candidateX, candidateY, safeBubbleW, safeBubbleH);
      if (collision) {
        if (spaceAbove >= safeBubbleH && !checkObstacleCollision(mascotX, mascotY - safeBubbleH - gap, safeBubbleW, safeBubbleH)) {
          candidatePlacement = 'above';
          candidateX = mascotX;
          candidateY = mascotY - safeBubbleH - gap;
        } else if (spaceBelow >= safeBubbleH && !checkObstacleCollision(mascotX, mascotY + mascotH + gap, safeBubbleW, safeBubbleH)) {
          candidatePlacement = 'below';
          candidateX = mascotX;
          candidateY = mascotY + mascotH + gap;
        } else if (collision.top && (collision.top - safeBubbleH - gap) >= minBubbleY) {
          candidateY = Math.max(minBubbleY, collision.top - safeBubbleH - gap);
        } else if (collision.bottom && (collision.bottom + gap) <= maxBubbleY) {
          candidateY = Math.min(maxBubbleY, collision.bottom + gap);
        }
      } else if (spaceToRight < safeBubbleW) {
        if (spaceAbove >= safeBubbleH) {
          candidatePlacement = 'above';
          candidateY = mascotY - safeBubbleH - gap;
          candidateX = mascotX;
        } else {
          candidatePlacement = 'below';
          candidateY = mascotY + mascotH + gap;
          candidateX = mascotX;
        }
      }

      placement = candidatePlacement;
      bubbleX = candidateX;
      bubbleY = candidateY;
    }
  }

  // Strict Viewport Clamping on Speech Bubble (Zero clipping on all edges)
  bubbleX = Math.round(Math.max(minBubbleX, Math.min(maxBubbleX, bubbleX)));
  bubbleY = Math.round(Math.max(minBubbleY, Math.min(maxBubbleY, bubbleY)));

  // Mutual Collision Vertical Adjustment
  if (placement === 'above' && bubbleY <= padTop && !isMobile) {
    const overflowOffset = padTop - bubbleY;
    bubbleY = padTop;
    mascotY = Math.min(maxMascotY, mascotY + overflowOffset);
  } else if (placement === 'below' && bubbleY >= maxBubbleY && !isMobile) {
    const overflowOffset = bubbleY - maxBubbleY;
    bubbleY = maxBubbleY;
    mascotY = Math.max(minMascotY, mascotY - overflowOffset);
  }

  return {
    mascot: {
      x: mascotX,
      y: mascotY,
      side: stop.side
    },
    bubble: {
      x: bubbleX,
      y: bubbleY,
      width: Math.round(safeBubbleW)
    },
    placement,
    maxBubbleWidth: Math.round(maxAllowedBubbleW),
    isMobile
  };
}
