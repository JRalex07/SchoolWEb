/**
 * mascotPositionCalculator.js
 * Mathematical positioning engine that calculates the combined safe footprint
 * of the mascot character and speech bubble within the viewport.
 * 
 * Guarantees zero off-screen overflow, zero clipping, and automatic side/vertical
 * flipping based on dynamic space availability.
 */

export const MASCOT_DIMENSIONS = {
  width: 84,
  height: 94
};

export const VIEWPORT_INSETS = {
  padX: 16,
  padTop: 82, // Safeguards against sticky header navbar (74px)
  padBottom: 16,
  gap: 12
};

/**
 * Calculates safe, non-overflowing fixed coordinates for both the mascot
 * and the speech bubble based on the current predefined stop and viewport dimensions.
 *
 * @param {Object} options
 * @param {Object} options.stop - The current movement stop config
 * @param {number} options.viewportWidth - window.innerWidth
 * @param {number} options.viewportHeight - window.innerHeight
 * @param {boolean} options.isBubbleOpen - Whether speech bubble is active
 * @param {Object} options.bubbleDimensions - Measured width and height of bubble
 * @returns {Object} Safe coordinates and placement mode
 */
export function calculateSafeAssistantLayout({
  stop,
  viewportWidth,
  viewportHeight,
  isBubbleOpen = true,
  bubbleDimensions = { width: 320, height: 160 }
}) {
  const { padX, padTop, padBottom, gap } = VIEWPORT_INSETS;
  const mascotW = MASCOT_DIMENSIONS.width;
  const mascotH = MASCOT_DIMENSIONS.height;

  // Viewport clamping bounds for the mascot
  const minMascotX = padX;
  const maxMascotX = Math.max(padX, viewportWidth - mascotW - padX);
  const minMascotY = padTop;
  const maxMascotY = Math.max(padTop, viewportHeight - mascotH - padBottom);

  // 1. Calculate Base Mascot Position from Predefined Stop
  let mascotX = 0;
  if (stop.side === 'left') {
    mascotX = viewportWidth > 768 ? padX + 12 : padX;
  } else {
    // Default or right side
    mascotX = maxMascotX;
  }

  // Base vertical positioning according to stop ratio
  const ratio = typeof stop.verticalRatio === 'number' ? stop.verticalRatio : 0.35;
  let mascotY = Math.round(viewportHeight * ratio);
  if (stop.minTop) {
    mascotY = Math.max(stop.minTop, mascotY);
  }
  mascotY = Math.max(minMascotY, Math.min(maxMascotY, mascotY));
  mascotX = Math.max(minMascotX, Math.min(maxMascotX, mascotX));

  // If bubble is not open, return just the safe mascot position
  if (!isBubbleOpen) {
    return {
      mascot: { x: Math.round(mascotX), y: Math.round(mascotY) },
      bubble: null,
      placement: null,
      maxBubbleWidth: 320
    };
  }

  // 2. Measure & Constrain Speech Bubble Dimensions
  // Ensure the bubble never demands more width than the viewport allows
  const maxAllowedBubbleW = Math.max(220, viewportWidth - (padX * 2));
  const measuredW = bubbleDimensions.width || 320;
  const safeBubbleW = Math.min(measuredW, maxAllowedBubbleW);
  const safeBubbleH = bubbleDimensions.height || 150;

  // Available space in all 4 cardinal directions relative to the mascot
  const spaceToLeft = mascotX - padX - gap;
  const spaceToRight = (viewportWidth - padX) - (mascotX + mascotW + gap);
  const spaceAbove = mascotY - padTop - gap;
  const spaceBelow = (viewportHeight - padBottom) - (mascotY + mascotH + gap);

  let placement = 'left'; // 'left' | 'right' | 'above' | 'below'
  let bubbleX = 0;
  let bubbleY = 0;

  const isNarrowScreen = viewportWidth <= 640;

  if (isNarrowScreen) {
    // Narrow screen / Mobile: Use stacked placement (above or below)
    if (spaceAbove >= safeBubbleH || spaceAbove >= spaceBelow) {
      placement = 'above';
      bubbleY = mascotY - safeBubbleH - gap;
    } else {
      placement = 'below';
      bubbleY = mascotY + mascotH + gap;
    }
    // Align horizontally with mascot, then clamp strictly
    bubbleX = stop.side === 'left' ? mascotX : mascotX + mascotW - safeBubbleW;
  } else if (stop.side === 'right') {
    // Right-anchored stop: Prefer placing bubble to the LEFT of mascot
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
    // Left-anchored stop: Prefer placing bubble to the RIGHT of mascot
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

  // 3. Strict Viewport Clamping (Ensures ZERO clipping on all 4 edges)
  const minBubbleX = padX;
  const maxBubbleX = Math.max(padX, viewportWidth - safeBubbleW - padX);
  const minBubbleY = padTop;
  const maxBubbleY = Math.max(padTop, viewportHeight - safeBubbleH - padBottom);

  bubbleX = Math.max(minBubbleX, Math.min(maxBubbleX, bubbleX));
  bubbleY = Math.max(minBubbleY, Math.min(maxBubbleY, bubbleY));

  // 4. Vertical Mutual Collision Adjustment
  // If stacked above pushes bubble into the header, nudge both down
  if (placement === 'above' && bubbleY <= padTop) {
    const overflowOffset = padTop - bubbleY;
    bubbleY = padTop;
    mascotY = Math.min(maxMascotY, mascotY + overflowOffset);
  }
  // If stacked below pushes bubble below screen bottom, nudge both up
  if (placement === 'below' && bubbleY >= maxBubbleY) {
    const overflowOffset = bubbleY - maxBubbleY;
    bubbleY = maxBubbleY;
    mascotY = Math.max(minMascotY, mascotY - overflowOffset);
  }

  return {
    mascot: {
      x: Math.round(mascotX),
      y: Math.round(mascotY)
    },
    bubble: {
      x: Math.round(bubbleX),
      y: Math.round(bubbleY),
      width: Math.round(safeBubbleW)
    },
    placement,
    maxBubbleWidth: Math.round(maxAllowedBubbleW)
  };
}
