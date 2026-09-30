const fs = require('fs');
const path = require('path');

const base = path.resolve(__dirname, '..');
console.log('Testing extension package at:', base);

// 1. Validate Manifest
const manifestPath = path.join(base, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('FAIL: manifest.json missing');
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
console.log('PASS: manifest.json found, version', manifest.version);
if (manifest.manifest_version !== 3) {
  console.error('FAIL: Must be Manifest V3');
  process.exit(1);
}

// Ensure manifest strictly scopes to Canvas domains
const matches = manifest.content_scripts[0].matches;
console.log('Content script matches:', matches);
if (matches.includes('<all_urls>')) {
  console.error('FAIL: <all_urls> must not be in content script matches!');
  process.exit(1);
}
console.log('PASS: Matches strictly scoped to Canvas domains');

// 2. Validate Presets: 50% Dark and 50% Light
const presetsFile = path.join(base, 'shared/presets.js');
const { PRESETS } = require(presetsFile);

if (PRESETS['taco-bell'] || PRESETS['chipotle']) {
  console.error('FAIL: Taco Bell and Chipotle must be removed!');
  process.exit(1);
}

const darkPresets = Object.values(PRESETS).filter(p => p.mode === 'dark');
const lightPresets = Object.values(PRESETS).filter(p => p.mode === 'light');
console.log(`PASS: Found ${darkPresets.length} Dark presets and ${lightPresets.length} Light presets`);

if (darkPresets.length === 0 || darkPresets.length !== lightPresets.length) {
  console.error(`FAIL: Presets must be balanced 50/50 dark and light! Found ${darkPresets.length} dark and ${lightPresets.length} light.`);
  process.exit(1);
}

// 3. Validate Color properties on every preset
const requiredColorProps = [
  'background-0', 'background-1', 'background-2',
  'borders', 'buttons', 'links',
  'sidebar', 'sidebar-text',
  'text-0', 'text-1', 'text-2',
  'cards', 'accent'
];

for (const [id, preset] of Object.entries(PRESETS)) {
  for (const prop of requiredColorProps) {
    if (!preset.colors[prop]) {
      console.error(`FAIL: Preset ${id} missing required color property: ${prop}`);
      process.exit(1);
    }
  }

  // Validate subject courseColors
  const requiredSubjects = ['math', 'stat', 'music', 'data', 'history'];
  if (!preset.courseColors) {
    console.error(`FAIL: Preset ${id} missing courseColors object!`);
    process.exit(1);
  }
  for (const sub of requiredSubjects) {
    if (!preset.courseColors[sub]) {
      console.error(`FAIL: Preset ${id} missing subject color for ${sub}`);
      process.exit(1);
    }
  }
}
console.log(`PASS: All ${Object.keys(PRESETS).length} presets have complete, valid color maps and subject courseColors`);


// 4. Validate Files
const filesToCheck = [
  'content/theme.css',
  'content/theme-engine.js',
  'popup/popup.html',
  'popup/popup.css',
  'popup/popup.js',
  'shared/canvas-styles.js',
  'icons/icon16.png',
  'icons/icon48.png',
  'icons/icon128.png'
];

for (const file of filesToCheck) {
  const fp = path.join(base, file);
  if (!fs.existsSync(fp)) {
    console.error('FAIL: Missing file ' + file);
    process.exit(1);
  }
}
console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
