import assert from 'node:assert';
import { calculateSafeAssistantLayout, MASCOT_DIMENSIONS, VIEWPORT_INSETS, BUBBLE_MAX_WIDTH } from '../src/utils/mascotPositionCalculator.js';
import { MOVEMENT_STOPS } from '../src/data/mascotMovementPaths.js';
import { FIELD_VALIDATION_REGISTRY } from '../src/data/helperRegistry.js';

console.log('=== RUNNING PHASE 1 P0 VERIFICATION SUITE ===\n');

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
// 1. POSITION CALCULATOR BOUNDS AND SAFE AREA TESTS
// ============================================================================
console.log('[Test Suite 1: Position Calculator Bounds]');

const VIEWPORTS = [
  { name: '1920x1080 Desktop FHD', width: 1920, height: 1080, mode: 'desktop' },
  { name: '1366x768 Standard Laptop', width: 1366, height: 768, mode: 'desktop' },
  { name: '1024x768 Desktop/Tablet Landscape', width: 1024, height: 768, mode: 'desktop' },
  { name: '768x1024 Tablet Portrait', width: 768, height: 1024, mode: 'tablet-touch' },
  { name: '390x844 Mobile Standard', width: 390, height: 844, mode: 'mobile' },
  { name: '844x390 Mobile Landscape', width: 844, height: 390, mode: 'mobile' },
  { name: '320x568 Ultra-Narrow Mobile', width: 320, height: 568, mode: 'mobile' }
];

for (const vp of VIEWPORTS) {
  for (const [stopKey, stop] of Object.entries(MOVEMENT_STOPS)) {
    it(`Viewport ${vp.name} with stop "${stopKey}": Mascot inside bounds`, () => {
      const layout = calculateSafeAssistantLayout({
        stop,
        viewportWidth: vp.width,
        viewportHeight: vp.height,
        deviceMode: vp.mode,
        isBubbleOpen: false
      });

      const { padX, padTop, padBottom } = VIEWPORT_INSETS;
      const mascotW = vp.mode === 'mobile' ? MASCOT_DIMENSIONS.mobile.width : MASCOT_DIMENSIONS.desktop.width;
      const mascotH = vp.mode === 'mobile' ? MASCOT_DIMENSIONS.mobile.height : MASCOT_DIMENSIONS.desktop.height;

      assert(layout.mascot.x >= padX, `mascot x (${layout.mascot.x}) below padX (${padX})`);
      assert(layout.mascot.x + mascotW <= vp.width, `mascot right (${layout.mascot.x + mascotW}) overflows viewport (${vp.width})`);
      assert(layout.mascot.y >= padTop, `mascot y (${layout.mascot.y}) below padTop (${padTop})`);
      assert(layout.mascot.y + mascotH <= vp.height, `mascot bottom (${layout.mascot.y + mascotH}) overflows viewport (${vp.height})`);
    });

    it(`Viewport ${vp.name} with stop "${stopKey}": Speech bubble inside bounds`, () => {
      const layout = calculateSafeAssistantLayout({
        stop,
        viewportWidth: vp.width,
        viewportHeight: vp.height,
        deviceMode: vp.mode,
        isBubbleOpen: true,
        bubbleDimensions: { width: 300, height: 120 }
      });

      const { padX, padTop } = VIEWPORT_INSETS;
      assert(layout.bubble !== null, 'bubble should be defined');
      assert(layout.bubble.x >= padX, `bubble x (${layout.bubble.x}) below padX (${padX})`);
      assert(layout.bubble.x + layout.bubble.width <= vp.width, `bubble right edge (${layout.bubble.x + layout.bubble.width}) overflows viewport (${vp.width})`);
      assert(layout.bubble.y >= padTop, `bubble y (${layout.bubble.y}) below padTop (${padTop})`);
      assert(layout.bubble.width <= BUBBLE_MAX_WIDTH, `bubble width (${layout.bubble.width}) exceeds BUBBLE_MAX_WIDTH (${BUBBLE_MAX_WIDTH})`);
    });
  }

  it(`Viewport ${vp.name}: Minimized pill footprint clamped within bounds`, () => {
    const layout = calculateSafeAssistantLayout({
      stop: MOVEMENT_STOPS['hero-stop'],
      viewportWidth: vp.width,
      viewportHeight: vp.height,
      deviceMode: vp.mode,
      isBubbleOpen: false,
      isMinimized: true
    });

    const minW = vp.mode === 'mobile' ? MASCOT_DIMENSIONS.mobile.width : MASCOT_DIMENSIONS.minimized.width;
    assert(layout.mascot.x + minW <= vp.width, `minimized pill overflows viewport width (${layout.mascot.x + minW} > ${vp.width})`);
  });
}

// ============================================================================
// 2. HELPER REGISTRY VALIDATION AND COACHING TESTS
// ============================================================================
console.log('\n[Test Suite 2: Helper Registry Validation]');

// 2.1 Name validation & Unicode support
it('FullName: Accepts standard Latin name "Aarav Sharma"', () => {
  const res = FIELD_VALIDATION_REGISTRY.fullName.validate('Aarav Sharma');
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.state, 'success');
});

it('FullName: Accepts Indian Devanagari script "आरव शर्मा"', () => {
  const res = FIELD_VALIDATION_REGISTRY.fullName.validate('आरव शर्मा');
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.state, 'success');
});

it('FullName: Accepts accented Latin names "René François" and "Chloë"', () => {
  const res1 = FIELD_VALIDATION_REGISTRY.fullName.validate('René François');
  const res2 = FIELD_VALIDATION_REGISTRY.fullName.validate('Chloë');
  assert.strictEqual(res1.isValid, true);
  assert.strictEqual(res2.isValid, true);
});

it('FullName: Rejects empty or invalid names with numbers', () => {
  const resEmpty = FIELD_VALIDATION_REGISTRY.fullName.validate('');
  const resNum = FIELD_VALIDATION_REGISTRY.fullName.validate('Aarav123');
  assert.strictEqual(resEmpty.isValid, false);
  assert.strictEqual(resNum.isValid, false);
});

// 2.2 Email validation & safe suggestion generation
it('Email: Validates proper email format "parent@example.com"', () => {
  const res = FIELD_VALIDATION_REGISTRY.email.validate('parent@example.com');
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.state, 'success');
});

it('Email: Rejects invalid email "abkdjfa" and displays format hint', () => {
  const res = FIELD_VALIDATION_REGISTRY.email.validate('abkdjfa');
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.format, 'name@example.com');
});

it('Email: NEVER suggests modifying already valid email like "a@gmail.co"', () => {
  const suggestion = FIELD_VALIDATION_REGISTRY.email.suggestCorrection('a@gmail.co');
  assert.strictEqual(suggestion, null, 'Already valid email should never be suggested to change');
});

it('Email: NEVER generates syntactically broken emails like "johngmail@com"', () => {
  const suggestion = FIELD_VALIDATION_REGISTRY.email.suggestCorrection('johngmail.com');
  assert.strictEqual(suggestion, null, 'Malformed email without @ should not generate broken suggestion');
});

it('Email: Generates verified suggestion for genuine domain typo "parent@gmai.com"', () => {
  const suggestion = FIELD_VALIDATION_REGISTRY.email.suggestCorrection('parent@gmai.com');
  assert.strictEqual(suggestion, 'parent@gmail.com');
  // Confirm suggestion itself is syntactically valid!
  assert.strictEqual(FIELD_VALIDATION_REGISTRY.email.validate(suggestion).isValid, true);
});

// 2.3 Phone validation & alphabetic rejection
it('Phone: Validates standard Indian mobile "+91 9876543210"', () => {
  const res = FIELD_VALIDATION_REGISTRY.phone.validate('+91 9876543210');
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.state, 'success');
});

it('Phone: Rejects alphabetic input "abc1234567" explicitly', () => {
  const res = FIELD_VALIDATION_REGISTRY.phone.validate('abc1234567');
  assert.strictEqual(res.isValid, false);
  assert(res.message.includes('cannot contain letters'), 'Error message must specify letters are forbidden');
});

it('Phone: Rejects too-short phone "12345"', () => {
  const res = FIELD_VALIDATION_REGISTRY.phone.validate('12345');
  assert.strictEqual(res.isValid, false);
});

// 2.4 Optional fields empty handling
it('Phone: Empty optional phone returns idle with isOptionalEmpty=true (no false Verified celebration)', () => {
  const res = FIELD_VALIDATION_REGISTRY.phone.validate('');
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.isOptionalEmpty, true);
  assert.strictEqual(res.state, 'idle');
});

it('Subject: Empty optional subject returns idle with isOptionalEmpty=true', () => {
  const res = FIELD_VALIDATION_REGISTRY.subject.validate('');
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.isOptionalEmpty, true);
  assert.strictEqual(res.state, 'idle');
});

// ============================================================================
// 3. CONTACT STOP PLACEMENT VERIFICATION
// ============================================================================
console.log('\n[Test Suite 3: Contact Stop Safety]');

it('Contact Stop: Anchored on the left flank so it clears the right-side form container', () => {
  assert.strictEqual(MOVEMENT_STOPS['contact-stop'].side, 'left');
});

console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%) ===\n`);
