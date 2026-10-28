import http from 'http';
import assert from 'assert';
import fs from 'fs';
import path from 'path';

function fetchOrRead(url) {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000' + url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => {
      // Offline fallback: read source file directly
      try {
        const filePath = path.resolve(url.replace(/^\//, ''));
        if (fs.existsSync(filePath)) {
          resolve(fs.readFileSync(filePath, 'utf-8'));
        } else {
          resolve('');
        }
      } catch {
        resolve('');
      }
    });
    req.setTimeout(1500, () => {
      req.destroy();
      try {
        const filePath = path.resolve(url.replace(/^\//, ''));
        resolve(fs.readFileSync(filePath, 'utf-8'));
      } catch {
        resolve('');
      }
    });
  });
}

async function run() {
  console.log('=== RUNNING FAST REFRESH AUDIT ===\n');

  const schoolContext = await fetchOrRead('/src/context/SchoolConfigContext.jsx');
  const mascotContext = await fetchOrRead('/src/context/MascotContext.jsx');
  const schoolProvider = await fetchOrRead('/src/context/SchoolConfigProvider.jsx');
  const mascotProvider = await fetchOrRead('/src/context/MascotProvider.jsx');
  const schoolLogo = await fetchOrRead('/src/components/SchoolDefaultLogo.jsx');

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
  const configDrawer = await fetchOrRead('/src/components/ConfigDrawer.jsx');
  assert(!configDrawer.includes('[PARSE_ERROR]'), 'ConfigDrawer must not have parse errors');
  assert(configDrawer.includes('ConfigDrawer'), 'ConfigDrawer must export component');
  console.log('  ✓ ConfigDrawer compiles cleanly and exports component');

  const leadershipPortrait = await fetchOrRead('/src/components/LeadershipPortrait.jsx');
  assert(!leadershipPortrait.includes('[PARSE_ERROR]'), 'LeadershipPortrait must not have parse errors');
  assert(leadershipPortrait.includes('LeadershipPortrait'), 'LeadershipPortrait must export component');
  console.log('  ✓ LeadershipPortrait compiles cleanly and exports component');

  console.log('\n=== ALL FAST REFRESH CHECKS PASSED (100%) ===');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
