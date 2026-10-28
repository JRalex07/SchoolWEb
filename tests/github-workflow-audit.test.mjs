import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('=== RUNNING GITHUB ACTIONS WORKFLOW AUDIT ===\n');

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

const workflowPath = path.resolve('.github/workflows/deploy.yml');

it('Workflow: .github/workflows/deploy.yml exists', () => {
  assert(fs.existsSync(workflowPath), '.github/workflows/deploy.yml must exist');
});

const content = fs.readFileSync(workflowPath, 'utf-8');

it('Workflow: Triggers on push to main branch and manual workflow_dispatch', () => {
  assert(content.includes('branches:') && content.includes('- main'), 'Must trigger on main branch');
  assert(content.includes('workflow_dispatch:'), 'Must support manual dispatch');
});

it('Workflow: Declares least-privilege permissions for GitHub Pages deployment', () => {
  assert(content.includes('contents: read'), 'Must declare contents: read');
  assert(content.includes('pages: write'), 'Must declare pages: write');
  assert(content.includes('id-token: write'), 'Must declare id-token: write (OIDC)');
});

it('Workflow: Executes reproducible install, testing, and production build', () => {
  assert(content.includes('npm ci'), 'Must use npm ci for reproducible lockfile install');
  assert(content.includes('npm test'), 'Must run npm test prior to build and deployment');
  assert(content.includes('npm run build'), 'Must run npm run build');
});

it('Workflow: Uses current official GitHub Pages deployment actions', () => {
  assert(content.includes('actions/checkout@v4'), 'Must use actions/checkout@v4');
  assert(content.includes('actions/setup-node@v4'), 'Must use actions/setup-node@v4');
  assert(content.includes('actions/upload-pages-artifact@v3'), 'Must use actions/upload-pages-artifact@v3');
  assert(content.includes('actions/deploy-pages@v4'), 'Must use actions/deploy-pages@v4');
  assert(content.includes("group: 'pages'"), 'Must declare pages deployment concurrency');
});

console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%) ===\n`);

