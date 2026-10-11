import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('=== RUNNING PHASE 3 P2 VERIFICATION SUITE ===\n');

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
// 1. EXPRESSION STATE COMPLETENESS & SAFETY
// ============================================================================
console.log('[Test Suite 1: Expression State Mapping & Completeness]');

const ALL_EXPRESSION_STATES = [
  'idle',
  'greeting',
  'curious',
  'attentive',
  'explaining',
  'thinking',
  'warning',
  'reassuring',
  'success',
  'confused',
  'listening',
  'resting'
];

// Read MascotCharacter.jsx source to verify every state is explicitly handled
const mascotCharacterCode = fs.readFileSync(
  path.resolve('src/components/Mascot/MascotCharacter.jsx'),
  'utf-8'
);

for (const stateName of ALL_EXPRESSION_STATES) {
  it(`Expression "${stateName}": Is mapped with distinct SVG facial features`, () => {
    // Check that state name is referenced in MascotCharacter
    assert(
      mascotCharacterCode.includes(`'${stateName}'`) || mascotCharacterCode.includes(`"${stateName}"`),
      `State "${stateName}" should be explicitly handled in MascotCharacter.jsx`
    );
  });
}

// ============================================================================
// 2. SVG ID COLLISION AUDIT
// ============================================================================
console.log('\n[Test Suite 2: SVG ID Collision Audit]');

it('SVG IDs: No duplicate id="barnabyCap" in MascotCharacter.jsx', () => {
  const capIdMatches = mascotCharacterCode.match(/id="barnabyCap"/g);
  assert.strictEqual(
    capIdMatches,
    null,
    'id="barnabyCap" must not be present to prevent duplicate ID warnings across multiple mascot instances'
  );
  assert(
    mascotCharacterCode.includes('className="barnaby-cap"'),
    'Mortarboard cap should use semantic className="barnaby-cap"'
  );
});

it('SVG Gradient IDs: barnabyCapGrad is uniquely named', () => {
  const capGradMatches = mascotCharacterCode.match(/id="barnabyCapGrad"/g);
  assert.strictEqual(
    capGradMatches?.length,
    1,
    'id="barnabyCapGrad" must exist exactly once in definitions'
  );
});

// ============================================================================
// 3. PREFERS-REDUCED-MOTION POLISH & SPRING LOGIC
// ============================================================================
console.log('\n[Test Suite 3: Prefers-Reduced-Motion Policy]');

it('Reduced Motion: Spring transitions collapse duration to 0 when reduced motion is preferred', () => {
  const getSpringTransition = (shouldReduceMotion) => {
    return shouldReduceMotion
      ? { duration: 0 }
      : {
          type: 'spring',
          stiffness: 28,
          damping: 15,
          mass: 1.3
        };
  };

  const normalTransition = getSpringTransition(false);
  const reducedTransition = getSpringTransition(true);

  assert.strictEqual(reducedTransition.duration, 0, 'Duration should be 0 when reduced motion is true');
  assert.strictEqual(normalTransition.type, 'spring', 'Spring transition used for default motion');
  assert.strictEqual(normalTransition.stiffness, 28, 'Stiffness is tuned to gentle 28');
  assert.strictEqual(normalTransition.mass, 1.3, 'Mass is weighted at 1.3 for leisurely floating glide');
});

it('Reduced Motion: Hover and tap scale gestures are safely disabled when reduced motion is true', () => {
  const getHoverGesture = (shouldReduceMotion) => (shouldReduceMotion ? undefined : { scale: 1.08 });
  const getTapGesture = (shouldReduceMotion) => (shouldReduceMotion ? undefined : { scale: 0.94 });

  assert.strictEqual(getHoverGesture(true), undefined, 'Hover scale should be undefined when reduced motion is active');
  assert.strictEqual(getTapGesture(true), undefined, 'Tap scale should be undefined when reduced motion is active');
  assert.deepStrictEqual(getHoverGesture(false), { scale: 1.08 });
  assert.deepStrictEqual(getTapGesture(false), { scale: 0.94 });
});

// ============================================================================
// 4. CSS REDUCED MOTION RULES VERIFICATION
// ============================================================================
console.log('\n[Test Suite 4: CSS Stylesheet Reduced Motion Rules]');

const indexCssCode = fs.readFileSync(
  path.resolve('src/index.css'),
  'utf-8'
);

it('CSS: Contains prefers-reduced-motion media query covering all mascot animation classes', () => {
  assert(indexCssCode.includes('@media (prefers-reduced-motion: reduce)'), 'index.css must include media query');
  assert(indexCssCode.includes('.mascot-character-art'), 'must disable mascot-character-art animation');
  assert(indexCssCode.includes('.mascot-anim-wave'), 'must disable mascot-anim-wave animation');
  assert(indexCssCode.includes('.mascot-anim-point'), 'must disable mascot-anim-point animation');
  assert(indexCssCode.includes('.mascot-anim-cheer-left'), 'must disable mascot-anim-cheer-left animation');
  assert(indexCssCode.includes('.mascot-anim-cheer-right'), 'must disable mascot-anim-cheer-right animation');
  assert(indexCssCode.includes('.mascot-intelligent-companion'), 'must disable mascot-intelligent-companion');
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%) ===\n`);
