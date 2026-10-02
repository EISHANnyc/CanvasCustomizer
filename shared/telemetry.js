// shared/telemetry.js - Anonymous Palette Statistics & Preferences Engine
(function(root) {
  var TELEMETRY_ENDPOINT = 'https://canvas-customizer-stats.workers.dev/api/palette-choice';

  function getStats(callback) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['vibe_palette_stats', 'vibe_share_stats'], function(res) {
        var stats = (res && res.vibe_palette_stats) || { total: 0, palettes: {} };
        var shareEnabled = (res && res.vibe_share_stats !== undefined) ? !!res.vibe_share_stats : true;
        callback({ stats: stats, shareEnabled: shareEnabled });
      });
    } else {
      callback({ stats: { total: 0, palettes: {} }, shareEnabled: true });
    }
  }

  function recordPaletteChoice(paletteName, colors) {
    if (!paletteName) return;
    var name = String(paletteName).trim();
    if (!name) return;

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['vibe_palette_stats', 'vibe_share_stats'], function(res) {
        var stats = (res && res.vibe_palette_stats) || { total: 0, palettes: {} };
        var shareEnabled = (res && res.vibe_share_stats !== undefined) ? !!res.vibe_share_stats : true;

        stats.total = (stats.total || 0) + 1;
        if (!stats.palettes) stats.palettes = {};
        stats.palettes[name] = (stats.palettes[name] || 0) + 1;
        stats.lastUsed = name;
        stats.lastUpdated = Date.now();

        chrome.storage.local.set({ vibe_palette_stats: stats });

        // If user has anonymous stats sharing enabled, ping endpoint non-blockingly
        if (shareEnabled) {
          try {
            var payload = {
              palette: name,
              colors: Array.isArray(colors) ? colors.slice(0, 5) : [],
              timestamp: Date.now()
            };
            fetch(TELEMETRY_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
              mode: 'cors'
            }).catch(function() {
              // Silently ignore network failures - user experience is never blocked
            });
          } catch (e) {}
        }
      });
    }
  }

  root.PaletteTelemetry = {
    getStats: getStats,
    recordPaletteChoice: recordPaletteChoice,
    ENDPOINT: TELEMETRY_ENDPOINT
  };
})(typeof window !== 'undefined' ? window : this);
