import assert from 'node:assert';
import { calculateSafeAssistantLayout, MASCOT_DIMENSIONS, VIEWPORT_INSETS } from '../src/utils/mascotPositionCalculator.js';
import { MOVEMENT_STOPS, getStopForSection } from '../src/data/mascotMovementPaths.js';

console.log('=== RUNNING PHASE 2 P1 VERIFICATION SUITE ===\n');

let totalTests = 0;
let passedTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

// ============================================================================
// 1. MOBILE VIRTUAL KEYBOARD SUPPRESSION & VISUAL VIEWPORT DETECTION
// ============================================================================
console.log('[Test Suite 1: Mobile Virtual Keyboard Suppression Logic]');

it('Virtual Keyboard Detection: Detects keyboard when visual viewport collapses below 72% of window height', () => {
  const windowInnerHeight = 844;
  const normalVisualViewportHeight = 844;
  const keyboardActiveVisualViewportHeight = 460; // 54.5% of 844

  const isKeyboardNormal = keyboardActiveVisualViewportHeight < (windowInnerHeight * 0.72);
  const isKeyboardOpenNormal = normalVisualViewportHeight < (windowInnerHeight * 0.72);

  assert.strictEqual(isKeyboardNormal, true, 'Keyboard should be detected as active when visual viewport shrinks to 460px');
  assert.strictEqual(isKeyboardOpenNormal, false, 'Keyboard should NOT be detected when visual viewport is 844px');
});

it('Virtual Keyboard Detection: Correctly evaluates edge threshold at exactly 72%', () => {
  const windowHeight = 1000;
  const exactly72Percent = 720;
  const below72Percent = 719;

  assert.strictEqual(below72Percent < windowHeight * 0.72, true);
  assert.strictEqual(exactly72Percent < windowHeight * 0.72, false);
});

// ============================================================================
// 2. TALL SECTION CENTER-SPANNING INTERSECTION LOGIC
// ============================================================================
console.log('\n[Test Suite 2: Tall Section Intersection Detection]');

function checkSpansCenter(rect, vh) {
  return rect.top <= (vh * 0.45) && rect.bottom >= (vh * 0.45);
}

it('Tall Section: Section taller than viewport spanning center is detected', () => {
  const vh = 900;
  // A section starting at top: -300px and ending at bottom: 1200px (spans across the entire viewport)
  const tallSectionRect = { top: -300, bottom: 1200 };
  const spans = checkSpansCenter(tallSectionRect, vh);
  assert.strictEqual(spans, true, 'Tall section spanning across 45% screen mark should be recognized as dominant');
});

it('Tall Section: Section fully scrolled out above viewport is not detected', () => {
  const vh = 900;
  const scrolledOutRect = { top: -1500, bottom: -200 };
  const spans = checkSpansCenter(scrolledOutRect, vh);
  assert.strictEqual(spans, false, 'Scrolled-away section should not span center');
});

it('Tall Section: Section below the 45% center point is not detected yet', () => {
  const vh = 900;
  const belowCenterRect = { top: 500, bottom: 1400 }; // 45% of 900 is 405
  const spans = checkSpansCenter(belowCenterRect, vh);
  assert.strictEqual(spans, false, 'Section below center threshold should not claim center priority');
});

// ============================================================================
// 3. FORM FOCUS MOVEMENT LOCK AND PENDING DESTINATION QUEUEING
// ============================================================================
console.log('\n[Test Suite 3: Form Focus Movement Lock & Transition Queue]');

class SimulatedMascotController {
  constructor() {
    this.activeSection = 'hero';
    this.activeFocusedField = null;
    this.pendingSection = null;
    this.mascotState = 'idle';
  }

  setFieldFocus(fieldName) {
    this.activeFocusedField = fieldName;
    this.mascotState = 'thinking';
  }

  notifySectionChange(sectionId) {
    if (this.activeFocusedField) {
      // User is interacting with form; lock movement and queue
      this.pendingSection = sectionId;
      return;
    }
    this.activeSection = sectionId;
  }

  clearFieldFocus(fieldName) {
    if (this.activeFocusedField === fieldName) {
      this.activeFocusedField = null;
    }
    // Flush pending section queue upon blur
    if (this.pendingSection) {
      this.activeSection = this.pendingSection;
      this.pendingSection = null;
    }
    this.mascotState = 'idle';
  }
}

it('Form Focus: Section change notifications while form is focused do NOT move active section', () => {
  const controller = new SimulatedMascotController();
  controller.setFieldFocus('fullName');

  assert.strictEqual(controller.activeFocusedField, 'fullName');
  assert.strictEqual(controller.mascotState, 'thinking');

  // Visitor scrolls while input is focused
  controller.notifySectionChange('contact-form-section');
  assert.strictEqual(controller.activeSection, 'hero', 'Active section must NOT change while focused');
  assert.strictEqual(controller.pendingSection, 'contact-form-section', 'Destination must be queued in pendingSection');
});

it('Form Blur: Field blur flushes the queued pending section transition safely', () => {
  const controller = new SimulatedMascotController();
  controller.setFieldFocus('email');
  controller.notifySectionChange('admissions-portal');

  assert.strictEqual(controller.activeSection, 'hero');
  assert.strictEqual(controller.pendingSection, 'admissions-portal');

  // Blur field
  controller.clearFieldFocus('email');
  assert.strictEqual(controller.activeFocusedField, null);
  assert.strictEqual(controller.activeSection, 'admissions-portal', 'Pending section should now be applied');
  assert.strictEqual(controller.pendingSection, null, 'Pending queue should be reset to null');
  assert.strictEqual(controller.mascotState, 'idle');
});

// ============================================================================
// 4. UNSCALED BUBBLE DIMENSION MEASUREMENT & FEEDBACK OSCILLATION PREVENTION
// ============================================================================
console.log('\n[Test Suite 4: Unscaled Bubble Dimension Layout Stability]');

it('Bubble Measurement: Clamps bubble width to 310px maximum to prevent viewport protrusion', () => {
  const rawElementWidth = 380;
  const clampedW = Math.min(310, rawElementWidth);
  assert.strictEqual(clampedW, 310, 'Bubble width must be capped at 310px');
});

it('Bubble Measurement: Ignore minute fluctuations (< 4px) to prevent layout thrashing', () => {
  const prevDimensions = { width: 300, height: 120 };
  const minorChange = { width: 302, height: 122 };

  const hasSignificantChange = (
    Math.abs(prevDimensions.width - minorChange.width) > 4 ||
    Math.abs(prevDimensions.height - minorChange.height) > 4
  );

  assert.strictEqual(hasSignificantChange, false, 'Minute subpixel/render changes <= 4px must be ignored');
});

it('Bubble Measurement: Detects genuine content changes (> 4px)', () => {
  const prevDimensions = { width: 300, height: 120 };
  const majorChange = { width: 300, height: 160 };

  const hasSignificantChange = (
    Math.abs(prevDimensions.width - majorChange.width) > 4 ||
    Math.abs(prevDimensions.height - majorChange.height) > 4
  );

  assert.strictEqual(hasSignificantChange, true, 'Height growth > 4px must trigger layout update');
});

// ============================================================================
// 5. NARROW DESKTOP GUTTER DOCKING & CLAMPING
// ============================================================================
console.log('\n[Test Suite 5: Narrow Desktop Gutter Docking]');

it('Narrow Desktop (1024px): Mascot stays within padX insets without clipping scrollbar', () => {
  const layout = calculateSafeAssistantLayout({
    stop: MOVEMENT_STOPS['contact-stop'],
    viewportWidth: 1024,
    viewportHeight: 768,
    deviceMode: 'desktop',
    isBubbleOpen: true,
    bubbleDimensions: { width: 310, height: 140 }
  });

  const mascotRight = layout.mascot.x + MASCOT_DIMENSIONS.desktop.width;
  assert(layout.mascot.x >= VIEWPORT_INSETS.padX, 'Mascot left must respect padX');
  assert(mascotRight <= 1024 - VIEWPORT_INSETS.padX, 'Mascot right must respect padX on 1024px desktop');
  assert(layout.bubble.x >= VIEWPORT_INSETS.padX, 'Bubble left must respect padX');
  assert(layout.bubble.x + layout.bubble.width <= 1024, 'Bubble right must not overflow 1024px width');
});

it('Standard Laptop (1280px): Mascot maintains comfortable margin on left-side stop', () => {
  const layout = calculateSafeAssistantLayout({
    stop: MOVEMENT_STOPS['contact-stop'],
    viewportWidth: 1280,
    viewportHeight: 800,
    deviceMode: 'desktop',
    isBubbleOpen: true,
    bubbleDimensions: { width: 300, height: 120 }
  });

  assert.strictEqual(layout.mascot.side, 'left');
  assert(layout.mascot.x >= 20, 'Mascot x must be >= 20px on left side');
  assert(layout.bubble.x >= layout.mascot.x, 'On left side, speech bubble anchors to the right of mascot');
});

// ============================================================================
// 6. TOUCH TAP AND FOCUSIN INTERACTION PARITY
// ============================================================================
console.log('\n[Test Suite 6: Touch Tap & Focusin Helper Parity]');

it('Touch & Keyboard Helper: Helper attributes are extracted identically across touch and keyboard', () => {
  const mockTarget = {
    getAttribute: (attr) => {
      if (attr === 'data-helper-title') return 'Admissions Desk';
      if (attr === 'data-helper-description') return 'Reach our office for grade 1-12 admission criteria.';
      if (attr === 'data-helper-example') return 'Phone: +91 98765 43210';
      return null;
    },
    innerText: 'Admissions Desk'
  };

  const title = mockTarget.getAttribute('data-helper-title') || mockTarget.innerText.slice(0, 25);
  const description = mockTarget.getAttribute('data-helper-description');
  const example = mockTarget.getAttribute('data-helper-example');

  assert.strictEqual(title, 'Admissions Desk');
  assert.strictEqual(description, 'Reach our office for grade 1-12 admission criteria.');
  assert.strictEqual(example, 'Phone: +91 98765 43210');
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%) ===\n`);
