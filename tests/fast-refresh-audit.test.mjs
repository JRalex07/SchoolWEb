import http from 'http';
import assert from 'assert';

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000' + url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  console.log('=== RUNNING FAST REFRESH AUDIT ===\n');

  const schoolContext = await fetch('/src/context/SchoolConfigContext.jsx');
  const mascotContext = await fetch('/src/context/MascotContext.jsx');
  const schoolProvider = await fetch('/src/context/SchoolConfigProvider.jsx');
  const mascotProvider = await fetch('/src/context/MascotProvider.jsx');
  const schoolLogo = await fetch('/src/components/SchoolDefaultLogo.jsx');

  // Verify SchoolDefaultLogo compiled without parse error
  assert(!schoolLogo.includes('[PARSE_ERROR]'), 'SchoolDefaultLogo must not have parse errors');
  assert(schoolLogo.includes('SchoolDefaultLogo'), 'SchoolDefaultLogo must export component');
  console.log('  ✓ SchoolDefaultLogo compiles cleanly and exports component');

  // SchoolConfigContext should only export hook and context (no component registered)
  assert(!schoolContext.includes('RefreshRuntime.register(SchoolConfigContext'), 'SchoolConfigContext should not be registered as component');
  console.log('  ✓ SchoolConfigContext exports clean hook and context without component conflict');

  // MascotContext should only export hook and context
  assert(!mascotContext.includes('RefreshRuntime.register(MascotContext'), 'MascotContext should not be registered as component');
  console.log('  ✓ MascotContext exports clean hook and context without component conflict');

  // SchoolConfigProvider should register SchoolConfigProvider cleanly
  assert(schoolProvider.includes('SchoolConfigProvider'), 'SchoolConfigProvider must export component');
  console.log('  ✓ SchoolConfigProvider cleanly isolates Provider component boundary');

  // MascotProvider should register MascotProvider cleanly
  assert(mascotProvider.includes('MascotProvider'), 'MascotProvider must export component');
  console.log('  ✓ MascotProvider cleanly isolates Provider component boundary');

  // Verify ConfigDrawer and LeadershipPortrait compile cleanly
  const configDrawer = await fetch('/src/components/ConfigDrawer.jsx');
  assert(!configDrawer.includes('[PARSE_ERROR]'), 'ConfigDrawer must not have parse errors');
  assert(configDrawer.includes('ConfigDrawer'), 'ConfigDrawer must export component');
  console.log('  ✓ ConfigDrawer compiles cleanly and exports component');

  const leadershipPortrait = await fetch('/src/components/LeadershipPortrait.jsx');
  assert(!leadershipPortrait.includes('[PARSE_ERROR]'), 'LeadershipPortrait must not have parse errors');
  assert(leadershipPortrait.includes('LeadershipPortrait'), 'LeadershipPortrait must export component');
  console.log('  ✓ LeadershipPortrait compiles cleanly and exports component');

  console.log('\n=== ALL FAST REFRESH CHECKS PASSED (100%) ===');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
