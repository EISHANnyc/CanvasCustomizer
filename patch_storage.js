const fs = require('fs');
let t = fs.readFileSync('content/theme-engine.js', 'utf8');

if (!t.includes('function safeStorageRemove')) {
  t = t.replace('function safeStorageSet(obj, callback) {', 'function safeStorageRemove(keys, callback) { if (!chrome.storage || !chrome.storage.local) { if (callback) callback(); return; } try { chrome.storage.local.remove(keys, function() { if (callback) callback(); }); } catch (e) { if (callback) callback(); } }\n\nfunction safeStorageSet(obj, callback) {');
}

t = t.replace(/try\s*\{\s*localStorage\.setItem\('vibe_cached_preset', preset\.id\);\s*\}\s*catch[^{]*\{\s*\}/g, "safeStorageSet({ vibe_cached_preset: preset.id });");
t = t.replace(/\/\/ -- 0ms Instant Pre-Paint Theme Injection --[\s\S]*?applyPresetTheme\(p0\);\s*\}\s*\}/g, // -- Pre-Paint Theme Injection via chrome.storage.local --
  safeStorageGet([
    'active_preset', 'vibe_cached_preset',
    'vibe_soft_night', 'vibe_cached_soft_night',
    'card_radius', 'vibe_cached_radius'
  ], function(res) {
    if (!res) return;
    var cachedPresetId = res.active_preset || res.vibe_cached_preset || 'linen-day';
    var cachedSoft = res.vibe_soft_night !== undefined ? !!res.vibe_soft_night : (res.vibe_cached_soft_night === 'true' || res.vibe_cached_soft_night === true);
    var cachedRadius = res.card_radius || res.vibe_cached_radius || '12';
    if (cachedSoft) document.documentElement.classList.add('vibe-soft-night');
    if (cachedRadius) document.documentElement.style.setProperty('--bc-card-radius', cachedRadius + 'px');
    if (typeof applyPresetTheme === 'function') applyPresetTheme({ id: cachedPresetId });
  }););

t = t.replace(/try\s*\{\s*localStorage\.removeItem\('vibe_pomodoro_state_v5'[\s\S]*?localStorage\.removeItem\('vibe_pomodoro_squircle_size'\);\s*\}\s*catch[^{]*\{\s*\}/g, "safeStorageRemove(['vibe_pomodoro_state_v5', 'vibe_pomodoro_state_v4', 'vibe_pomodoro_squircle_pos', 'vibe_pomodoro_squircle_size']);");

// Just wipe out all remaining raw localStorage calls
t = t.replace(/localStorage\.(?:get|set|remove)Item\([^)]+\)/g, "null");
t = t.replace(/window\.localStorage/g, "{}");

fs.writeFileSync('content/theme-engine.js', t);
console.log("Storage patched");
