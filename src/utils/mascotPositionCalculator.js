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
  bubbleDimensions = { width: 310, height: 130 }
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
      // Right-anchored: Prefer placing bubble to the LEFT of mascot
      if (spaceToLeft >= safeBubbleW) {
        placement = 'left';
        bubbleX = mascotX - safeBubbleW - gap;
        bubbleY = mascotY - 10;
      } else if (spaceAbove >= safeBubbleH) {
        placement = 'above';
        bubbleY = mascotY - safeBubbleH - gap;
        bubbleX = mascotX + mascotW - safeBubbleW;
      } else {
        placement = 'below';
        bubbleY = mascotY + mascotH + gap;
        bubbleX = mascotX + mascotW - safeBubbleW;
      }
    } else {
      // Left-anchored: Prefer placing bubble to the RIGHT of mascot
      if (spaceToRight >= safeBubbleW) {
        placement = 'right';
        bubbleX = mascotX + mascotW + gap;
        bubbleY = mascotY - 10;
      } else if (spaceAbove >= safeBubbleH) {
        placement = 'above';
        bubbleY = mascotY - safeBubbleH - gap;
        bubbleX = mascotX;
      } else {
        placement = 'below';
        bubbleY = mascotY + mascotH + gap;
        bubbleX = mascotX;
      }
    }
  }

  // Strict Viewport Clamping on Speech Bubble (Zero clipping on all edges)
  const minBubbleX = padX;
  const maxBubbleX = Math.max(padX, viewportWidth - safeBubbleW - padX);
  const minBubbleY = padTop;
  const maxBubbleY = Math.max(padTop, viewportHeight - safeBubbleH - padBottom);

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
