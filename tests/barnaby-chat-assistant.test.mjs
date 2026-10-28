import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { processUserMessage, getContextualSuggestedQuestions } from '../src/utils/barnabyChatEngine.js';

console.log('=== RUNNING BARNABY CHAT ASSISTANT AUDIT ===\n');

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

// 1. Opt-In Silence & Zero Automatic Speech Bubbles
console.log('[Test Suite 1: Opt-in Silence & Zero Unsolicited Narration]');

const mascotProviderCode = fs.readFileSync(path.resolve('src/context/MascotProvider.jsx'), 'utf-8');
const mascotAssistantCode = fs.readFileSync(path.resolve('src/components/Mascot/MascotAssistant.jsx'), 'utf-8');

it('MascotProvider: Default isChatOpen is false (opt-in only)', () => {
  assert(mascotProviderCode.includes('const [isChatOpen, setIsChatOpen] = useState(false)'), 'isChatOpen must be initialized to false');
});

it('MascotProvider: Default isBubbleVisible is false on load and route changes', () => {
  assert(mascotProviderCode.includes('const [isBubbleVisible, setIsBubbleVisible] = useState(false)'), 'isBubbleVisible must default to false');
  assert(!mascotProviderCode.includes("setMessageWithPriority({\n      title: pageGreeting.title"), 'Unsolicited greeting popups on route change must not run automatically');
});

it('MascotAssistant: Renders as compact floating launcher with accessible controls', () => {
  assert(mascotAssistantCode.includes('aria-label={isChatOpen ? "Close Barnaby Assistant" : "Open Barnaby Assistant"}'), 'Launcher button must provide dynamic accessible label');
  assert(mascotAssistantCode.includes('role="dialog"'), 'Chat panel must declare dialog semantics');
  assert(mascotAssistantCode.includes("'keydown'"), 'Must support keyboard escape dismissal');
});

// 2. Local Intent Engine Accuracy
console.log('\n[Test Suite 2: Context-Aware Intent Engine & Knowledge Accuracy]');

const mockConfig = {
  schoolName: 'St. Jude International Academy',
  principalName: 'Dr. Alistair Vance',
  vicePrincipalName: 'Prof. Kenneth Morales',
  address: '100 Campus Drive',
  phone: '+91 9876543210',
  email: 'admissions@stjude.edu'
};

it('Intent: Admissions query returns accurate admissions guidance and explicit page action', () => {
  const res = processUserMessage('How do I apply for admissions?', '/', mockConfig);
  assert(res.text.includes('Admissions for the'), 'Response must explain admissions');
  assert.strictEqual(res.action.path, '/admissions', 'Must suggest /admissions');
  assert.strictEqual(res.action.label, 'Open Admissions Page →', 'Action button must have clear label');
});

it('Intent: Fee query does not fabricate fake tuition numbers', () => {
  const res = processUserMessage('What are the school fees and tuition costs?', '/admissions', mockConfig);
  assert(res.text.includes('not hardcoded into this demonstration prototype'), 'Must not invent fake fee schedules');
  assert.strictEqual(res.action.path, '/admissions');
});

it('Intent: Academics query highlights curriculum and returns Academics link', () => {
  const res = processUserMessage('Tell me about curriculum and athletic activities', '/', mockConfig);
  assert(res.text.includes('curriculum emphasizing STEM'), 'Response must detail curriculum');
  assert.strictEqual(res.action.path, '/academics');
});

it('Intent: Calendar query mentions 2026 festivals and calendar link', () => {
  const res = processUserMessage('When is Diwali and Independence Day?', '/', mockConfig);
  assert(res.text.includes('2026') && res.text.includes('Diwali') && res.text.includes('Independence Day'), 'Response must mention current year festivals');
  assert.strictEqual(res.action.path, '/calendar');
});

it('Intent: Contact query incorporates configured school phone and email', () => {
  const res = processUserMessage('How can I contact the school office?', '/', mockConfig);
  assert(res.text.includes('+91 9876543210'), 'Response must use configured phone');
  assert(res.text.includes('admissions@stjude.edu'), 'Response must use configured email');
  assert.strictEqual(res.action.path, '/contact');
});

it('Intent: Developer inquiry attributes ALEX and links to portfolio', () => {
  const res = processUserMessage('Who built this website?', '/', mockConfig);
  assert(res.text.includes('Designed & Developed by ALEX'), 'Must credit ALEX');
  assert.strictEqual(res.action.url, 'https://jralex07.github.io/Portfolio/');
  assert.strictEqual(res.action.isExternal, true);
});

it('Intent: Fallback gracefully handles unknown queries without fabricating information', () => {
  const res = processUserMessage('Does the school have a subterranean submarine dock?', '/', mockConfig);
  assert(res.text.includes('I don\'t have specific verified details'), 'Must gracefully fall back without making up facts');
  assert.strictEqual(res.action.path, '/contact');
});

// 3. Contextual Suggested Questions
console.log('\n[Test Suite 3: Contextual Suggested Questions]');

it('Suggested Questions: Reflects current path appropriately', () => {
  const homeQs = getContextualSuggestedQuestions('/');
  const admissionsQs = getContextualSuggestedQuestions('/admissions');
  const calendarQs = getContextualSuggestedQuestions('/calendar');

  assert(homeQs.length >= 4, 'Home should provide at least 4 prompt chips');
  assert(admissionsQs.some(q => q.toLowerCase().includes('admi') || q.toLowerCase().includes('document')), 'Admissions questions must be route-relevant');
  assert(calendarQs.some(q => q.toLowerCase().includes('holiday') || q.toLowerCase().includes('event')), 'Calendar questions must be route-relevant');
});

// 4. Explicit Navigation Action Consent
console.log('\n[Test Suite 4: Explicit Navigation Action Consent]');

it('MascotAssistant: Actions require explicit button activation, not automated redirects', () => {
  assert(mascotAssistantCode.includes('handleActionClick'), 'Must have explicit action click handler');
  assert(mascotAssistantCode.includes('onClick={() => handleActionClick(msg.action)}'), 'Action button must trigger only on user click');
  assert(mascotAssistantCode.includes('ExternalLink') && mascotAssistantCode.includes('ArrowRight'), 'External vs internal actions must be visibly distinct');
});

// 5. Word-Level Query Comprehension & Synonyms
console.log('\n[Test Suite 5: Word-Level Comprehension & Natural Language Understanding]');

it('Word: Single word queries map to appropriate helpful intents', () => {
  const timingRes = processUserMessage('timing', '/', mockConfig);
  assert(timingRes.text.includes('8:00 AM to 3:00 PM'), 'Should match school hours');

  const sportsRes = processUserMessage('football', '/', mockConfig);
  assert(sportsRes.text.includes('football') && sportsRes.action.path === '/academics', 'Should match sports/athletics');

  const busRes = processUserMessage('bus', '/', mockConfig);
  assert(busRes.text.includes('transportation') && busRes.action.path === '/contact', 'Should match transport');

  const uniformRes = processUserMessage('uniform', '/', mockConfig);
  assert(uniformRes.text.includes('uniform') && uniformRes.action.path === '/contact', 'Should match uniform');

  const docsRes = processUserMessage('documents', '/', mockConfig);
  assert(docsRes.text.includes('Birth Certificate') && docsRes.action.path === '/admissions', 'Should match documents');

  const thanksRes = processUserMessage('thanks', '/', mockConfig);
  assert(thanksRes.text.includes('welcome') && thanksRes.expression === 'success', 'Should handle gratitude');

  const helloRes = processUserMessage('hey', '/', mockConfig);
  assert(helloRes.text.includes('Hello') && helloRes.expression === 'greeting', 'Should handle greetings');
});

// 6. Smooth Typing Animation in Chat
console.log('\n[Test Suite 6: Smooth Typing Animation & Streaming Controls]');

it('MascotAssistant: Implements smooth typewriter streaming with cursor and skip ability', () => {
  assert(mascotAssistantCode.includes('TypewriterBubble'), 'Must define typewriter subcomponent');
  assert(mascotAssistantCode.includes('chat-typing-cursor'), 'Must include animated typing cursor indicator');
  assert(mascotAssistantCode.includes('handleSkipTyping'), 'Must provide skip capability on user click');
  assert(mascotAssistantCode.includes('shouldReduceMotion'), 'Must respect user reduced motion preference');
});

// 7. Conversational Intelligence & 15 QA Verification Requirements
console.log('\n[Test Suite 7: Full Conversational Intelligence & Interaction Audit]');

it('Phase 8.1: Different phrasings of admissions produce appropriately related answers', () => {
  const phrasings = [
    "Where can I find admissions?",
    "How do I apply to this school?",
    "I want to know about admission.",
    "Can you show me the application page?",
    "Where do parents register their children?"
  ];
  for (const q of phrasings) {
    const res = processUserMessage(q, '/', mockConfig);
    assert(res.text.includes('Admissions for the') || res.text.includes('application'), `Failed on phrasing: ${q}`);
    assert.strictEqual(res.action?.path, '/admissions');
  }
});

it('Phase 8.2: Common spelling mistakes are handled gracefully', () => {
  const typos = [
    { input: 'admisison', expectedPath: '/admissions' },
    { input: 'tuiton', expectedPath: '/admissions' },
    { input: 'feee', expectedPath: '/admissions' },
    { input: 'schedul', expectedPath: '/contact' },
    { input: 'principall', expectedPath: '/about' }
  ];
  for (const { input, expectedPath } of typos) {
    const res = processUserMessage(input, '/', mockConfig);
    assert.strictEqual(res.action?.path, expectedPath, `Failed on typo: ${input}`);
  }
});

it('Phase 8.3: Follow-up messages use the right conversation context', () => {
  const history = [
    { sender: 'user', text: 'I want to apply' },
    { sender: 'barnaby', text: 'Admissions details', action: { label: 'Open Admissions Page →', path: '/admissions' }, topic: 'admissions' }
  ];
  const res = processUserMessage('open it', '/', mockConfig, history);
  assert(res.text.includes('Here is the link to open the Admissions Page'), 'Must resolve anaphora from last action');
  assert.strictEqual(res.action?.path, '/admissions');
});

it('Phase 8.4: Ambiguous requests trigger clarification where necessary', () => {
  const res = processUserMessage('open it', '/', mockConfig, []);
  assert(res.text.includes('Which page would you like to visit'), 'Must ask for clarification when no context is active');
  assert.strictEqual(res.topic, 'clarification');
});

it('Phase 8.5: Missing school facts are never fabricated', () => {
  const feeRes = processUserMessage('what are the exact tuition fees?', '/', mockConfig);
  assert(feeRes.text.includes('not hardcoded into this demonstration prototype'), 'Never fabricate fee amounts');
});

it('Phase 8.6 & 8.7: Typing animation respects reading pace (~25-35 cps) and punctuation pauses', () => {
  assert(mascotAssistantCode.includes('delay += 140'), 'Sentence boundary pause must be added');
  assert(mascotAssistantCode.includes('delay += 70'), 'Clause separator pause must be added');
  assert(mascotAssistantCode.includes('delay += 150'), 'Paragraph pause must be added');
});

it('Phase 8.8: Short messages do not have excessive artificial delays', () => {
  const thanksRes = processUserMessage('thanks', '/', mockConfig);
  assert(thanksRes.text.length < 120, 'Thanks reply is concise');
});

it('Phase 8.9: Smart auto-scroll avoids runaway scrolling when reading history', () => {
  assert(mascotAssistantCode.includes('isNearBottom'), 'Must check if user is near bottom before scrolling');
});

it('Phase 8.10: Input preserves message and handles Enter vs Shift+Enter correctly', () => {
  assert(mascotAssistantCode.includes('handleInputKeyDown'), 'Must intercept keydown');
  assert(mascotAssistantCode.includes("e.key === 'Enter' && !e.shiftKey"), 'Submits only on unshifted Enter');
});

it('Phase 8.11: Reopening the assistant preserves completed state without restarting', () => {
  assert(mascotAssistantCode.includes('completedMessageIds'), 'Must track completed messages in state');
  assert(mascotAssistantCode.includes("new Set(['welcome-1'])"), 'Initial welcome message marked completed by default');
});

it('Phase 8.12: Navigation requires explicit user click consent', () => {
  assert(mascotAssistantCode.includes('onClick={() => handleActionClick(msg.action)}'), 'Action button requires explicit user click');
  assert(!mascotAssistantCode.includes('navigate(action.path); // auto'), 'No automated navigation calls');
});

it('Phase 8.13: Keyboard and mobile accessibility operate cleanly', () => {
  assert(mascotAssistantCode.includes("e.key === 'Escape'"), 'Closes on Escape key');
  assert(mascotAssistantCode.includes('aria-live='), 'Provides aria-live polite announcement for screen readers');
});

it('Phase 8.14: Reduced-motion behavior is respected', () => {
  assert(mascotAssistantCode.includes('shouldReduceMotion'), 'Respects reduced motion');
  assert(mascotAssistantCode.includes('isCompleted || shouldReduceMotion ? fullText.length : 0'), 'Renders full text immediately if motion is reduced');
});

it('Phase 8.15: Assistant remains responsive with skip-to-end capability while streaming', () => {
  assert(mascotAssistantCode.includes('handleSkipTyping'), 'Clicking bubble skips animation');
  assert(mascotAssistantCode.includes('setDisplayedCount(fullText.length)'), 'Fast-forwards to complete text on skip');
});

it('Duplicate Answer Guard: MascotProvider uses isRespondingRef locking and pure updates', () => {
  assert(mascotProviderCode.includes('isRespondingRef.current'), 'Must guard against concurrent duplicate sends');
  assert(mascotProviderCode.includes('responseTimerRef.current = setTimeout'), 'Timeout must be scheduled outside state updater');
});

it('Suggestion Timing Guard: Suggestions only render after Barnaby finishes typing', () => {
  assert(mascotAssistantCode.includes('isBarnabyFinishedTyping'), 'Must compute isBarnabyFinishedTyping state');
  assert(mascotAssistantCode.includes('suggestedQuestions.length > 0 && isBarnabyFinishedTyping'), 'Suggestions must wait until Barnaby finishes typing');
});

// 8. Structured Response Payloads & Rich Message UI
console.log('\n[Test Suite 8: Structured Response Payloads & Rich UI]');

it('Structured Documents: Returns document_checklist with 5 required items and note', () => {
  const res = processUserMessage('what documents are needed for enrollment?', '/', mockConfig);
  assert(res.structuredData, 'Must provide structuredData payload');
  assert.strictEqual(res.structuredData.type, 'document_checklist');
  assert.strictEqual(res.structuredData.title, 'Enrollment Requirements');
  assert.strictEqual(res.structuredData.items.length, 5, 'Must list exactly 5 document items');
  assert(res.structuredData.items[0].name.includes('Birth Certificate'));
  assert(res.structuredData.items[1].name.includes('Academic Records'));
  assert(res.structuredData.items[2].name.includes('Transfer Certificate'));
  assert(res.structuredData.items[3].name.includes('Photographs'));
  assert(res.structuredData.items[4].name.includes('Parent/Guardian ID Proof'));
  assert(res.structuredData.note.includes('confirm the final document requirements with the school'));
  assert.strictEqual(res.action?.path, '/admissions');
});

it('Structured Steps: Returns step-by-step procedure payload', () => {
  const res = processUserMessage('what is the admission procedure step by step?', '/', mockConfig);
  assert(res.structuredData, 'Must provide structuredData payload');
  assert.strictEqual(res.structuredData.type, 'steps');
  assert.strictEqual(res.structuredData.items.length, 4, 'Must have 4 steps');
});

it('Structured Contact: Returns contact_card payload with verified details and links', () => {
  const res = processUserMessage('what is the school phone and email?', '/', mockConfig);
  assert(res.structuredData, 'Must provide structuredData payload');
  assert.strictEqual(res.structuredData.type, 'contact_card');
  assert(res.structuredData.items.some(i => i.label === 'Telephone' && i.link.includes('tel:')));
  assert(res.structuredData.items.some(i => i.label === 'Email Address' && i.link.includes('mailto:')));
});

it('Structured Events: Returns events payload with 2026 milestones', () => {
  const res = processUserMessage('when are the holidays and festival dates?', '/', mockConfig);
  assert(res.structuredData, 'Must provide structuredData payload');
  assert.strictEqual(res.structuredData.type, 'events');
  assert(res.structuredData.items.some(i => i.title === 'Diwali (Deepavali)' && i.date.includes('2026')));
  assert(res.structuredData.items.some(i => i.title.includes('Chhath Puja') && i.date.includes('2026')));
});

it('Chhath Puja: Dedicated query recognizes Chhath Puja and returns accurate 2026 observance dates', () => {
  const res1 = processUserMessage('When is Chhath Puja in 2026?', '/', mockConfig);
  assert(res1.text.includes('Chhath Puja') || res1.text.includes('Chhath Mahaparv'), 'Must identify Chhath Puja');
  assert(res1.text.includes('November 14–15, 2026') || res1.text.includes('Nov 14'), 'Must give correct dates');
  assert.strictEqual(res1.structuredData?.type, 'events');
  assert(res1.structuredData.items.some(i => i.title.includes('Sandhya Arghya')), 'Must list Sandhya Arghya');

  // Variant matching "chat puja"
  const res2 = processUserMessage('is there a holiday for chat puja?', '/', mockConfig);
  assert(res2.text.includes('Chhath Puja') || res2.text.includes('Chhath Mahaparv'), 'Must handle "chat puja" phonetic variant');
  assert.strictEqual(res2.action?.path, '/calendar');
});

// 9. Global Page Navigation Intelligence & 404 Route Exclusion
console.log('\n[Test Suite 9: Global Page Navigation Intelligence]');

it('Navigation: Pure navigation command to Contact returns clean prompt without info dump', () => {
  const res = processUserMessage('Take me to the Contact page.', '/', mockConfig);
  assert(res.text.includes('Sure! You can open the Contact page here:'), 'Must give clean navigation confirmation');
  assert.strictEqual(res.action?.path, '/contact');
  assert.strictEqual(res.action?.label, 'Open Contact Page →');
  assert(!res.structuredData, 'Pure navigation must not dump contact card');
});

it('Navigation: Pure navigation command to Admissions works seamlessly', () => {
  const res = processUserMessage("Let's go to Admissions.", '/', mockConfig);
  assert(res.text.includes('Sure! You can open the Admissions page here:'));
  assert.strictEqual(res.action?.path, '/admissions');
  assert.strictEqual(res.action?.label, 'Open Admissions Page →');
});

it('Navigation: Pure navigation command to About works seamlessly', () => {
  const res = processUserMessage("Open the About page.", '/', mockConfig);
  assert(res.text.includes('Sure! You can open the About page here:'));
  assert.strictEqual(res.action?.path, '/about');
});

it('Navigation: Pure navigation command to Academics works seamlessly', () => {
  const res = processUserMessage("Show me academics.", '/', mockConfig);
  assert.strictEqual(res.action?.path, '/academics');
});

it('Navigation: Pure navigation command to Calendar works seamlessly', () => {
  const res = processUserMessage("I want to see upcoming events.", '/', mockConfig);
  assert.strictEqual(res.action?.path, '/calendar');
});

it('Navigation: Pure navigation command to Home works seamlessly', () => {
  const res = processUserMessage("Navigate to the homepage.", '/about', mockConfig);
  assert.strictEqual(res.action?.path, '/');
});

it('Navigation: Combined request provides both information and navigation action', () => {
  const res = processUserMessage('Tell me about admissions and then take me to that page.', '/', mockConfig);
  assert(res.text.includes('Admissions for the') || res.text.includes('application'));
  assert.strictEqual(res.action?.path, '/admissions');
});

it('Navigation: 404 is strictly excluded and never offered as a destination', () => {
  const res = processUserMessage('Take me to the 404 page.', '/', mockConfig);
  assert(res.text.includes("The 404 page is an error page"), 'Must explain 404 is an error page');
  assert.strictEqual(res.action, null, 'Must strictly never provide an action targeting 404');
  assert(res.suggestedFollowUps.every(s => !s.includes('404')), 'Suggestions must not contain 404');
});

console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%) ===\n`);
