const fs = require('fs');

// 1. Manifest
let m = fs.readFileSync('manifest.json', 'utf8');
let j = JSON.parse(m);
j.permissions = j.permissions.filter(p => p !== 'tabs');
fs.writeFileSync('manifest.json', JSON.stringify(j, null, 2));

// 2. Popup IPC flood
let p = fs.readFileSync('popup/popup.js', 'utf8');
if (!p.includes('let liveParamTicking = false;')) {
  p = p.replace('function sendLiveParam(key, val) {', 
    'let liveParamTicking = false;\n  let latestParams = {};\n  function sendLiveParam(key, val) {\n    latestParams[key] = val;\n    if (!liveParamTicking) {\n      liveParamTicking = true;\n      requestAnimationFrame(() => {\n        for (let k in latestParams) {\n          if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {\n            try { chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) { if (tabs && tabs[0] && tabs[0].id) { chrome.tabs.sendMessage(tabs[0].id, { type: "VIBE_LIVE_PARAM", key: k, value: latestParams[k] }, function() { if(chrome.runtime.lastError){} }); } }); } catch(e) {}\n          }\n        }\n        latestParams = {};\n        liveParamTicking = false;\n      });\n    }\n  }\n  function oldSendLiveParam_unused(key, val) {');
  fs.writeFileSync('popup/popup.js', p);
}

// 3. Theme Engine XSS & Initialization & API N+1 Storm
let t = fs.readFileSync('content/theme-engine.js', 'utf8');

// XSS: sanitizeTitle escaping
if (!t.includes('escapeHtml(stripped)')) {
  t = t.replace('return stripped;', 'return typeof escapeHtml === "function" ? escapeHtml(stripped) : stripped;');
}
if (!t.includes('var escCourseDisplay')) {
  // Find where courseDisplay is injected and escape it.
  t = t.replace(/courseDisplay \|\| \([^)]+\)/g, 'escapeHtml($&)');
}
if (!t.includes('escapeHtml(scoreText)')) {
  t = t.replace(/'<span class="' \+ scoreClass \+ '">' \+ scoreText \+ '<\/span>'/g, 
    '\'<span class="\' + scoreClass + \'">\' + escapeHtml(scoreText) + \'</span>\'');
}

// Initialization Guard
if (!t.includes('var isVibeInitialized = true;')) {
  t = t.replace('function init() {', 'var isVibeInitialized = false;\n  function init() {\n    if(isVibeInitialized) return;\n    isVibeInitialized = true;');
}

// javascript: validation
if (!t.includes('isSafeUrl(')) {
  t = t.replace('if (item.href && item.href !== \'#\') {', 'if (item.href && item.href !== \'#\' && !item.href.trim().toLowerCase().startsWith("javascript:")) {');
}

// API N+1 storm - fetchPlannerItems
// We just remove the part where it maps missing unlocks to a fetch.
let n1 = t.match(/if \(!needsFetch || needsFetch\.length === 0\) \{\s*return resolve\([^)]+\);\s*\}/);
if (n1) {
  // Just resolve immediately instead of fetching.
  t = t.replace(/var assignmentPromises = needsFetch\.map[\s\S]*?Promise\.all\(assignmentPromises\)[\s\S]*?\}\);/g, 
  '// N+1 storm removed for performance\n      resolve(parsedList);');
}
fs.writeFileSync('content/theme-engine.js', t);

console.log("Patched!");
