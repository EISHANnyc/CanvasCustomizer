document.addEventListener('DOMContentLoaded', function() {
  var groupList = document.getElementById('theme-group-list');
  var radiusSlider = document.getElementById('radius-slider');
  var radiusVal = document.getElementById('radius-val');
  var resetBtn = document.getElementById('reset-btn');
  var restoreBtn = document.getElementById('restore-btn');
  var softNightToggle = document.getElementById('soft-night-toggle');
  var gpaToggle = document.getElementById('gpa-toggle');
  var gpaColorInput = document.getElementById('gpa-color-input');
  var gpaColorResetBtn = document.getElementById('gpa-color-reset-btn');
  var gpaColorRow = document.getElementById('gpa-color-row');
  var nicknameList = document.getElementById('nickname-list');
  var addNicknameBtn = document.getElementById('add-nickname-btn');

  // Wallpaper elements
  var uploadWallpaperBtn = document.getElementById('upload-wallpaper-btn');
  var urlWallpaperBtn = document.getElementById('url-wallpaper-btn');
  var wallpaperFileInput = document.getElementById('wallpaper-file-input');
  var clearWallpaperBtn = document.getElementById('clear-wallpaper-btn');
  var wallpaperControls = document.getElementById('wallpaper-controls');
  var wallpaperOpacitySlider = document.getElementById('wallpaper-opacity-slider');
  var wallpaperOpacityVal = document.getElementById('wallpaper-opacity-val');
  var wallpaperBlurSlider = document.getElementById('wallpaper-blur-slider');
  var wallpaperBlurVal = document.getElementById('wallpaper-blur-val');
  var wallpaperUrlBox = document.getElementById('wallpaper-url-box');
  var wallpaperUrlInput = document.getElementById('wallpaper-url-input');
  var wallpaperUrlApplyBtn = document.getElementById('wallpaper-url-apply-btn');

  // Sidebar Background elements
  var uploadSidebarBgBtn = document.getElementById('upload-sidebar-bg-btn');
  var urlSidebarBgBtn = document.getElementById('url-sidebar-bg-btn');
  var sidebarBgFileInput = document.getElementById('sidebar-bg-file-input');
  var clearSidebarBgBtn = document.getElementById('clear-sidebar-bg-btn');
  var sidebarBgUrlBox = document.getElementById('sidebar-bg-url-box');
  var sidebarBgUrlInput = document.getElementById('sidebar-bg-url-input');
  var sidebarBgUrlApplyBtn = document.getElementById('sidebar-bg-url-apply-btn');
  var sidebarBgOpacitySlider = document.getElementById('sidebar-bg-opacity-slider');
  var sidebarBgOpacityVal = document.getElementById('sidebar-bg-opacity-val');
  var sidebarBgBlurSlider = document.getElementById('sidebar-bg-blur-slider');
  var sidebarBgBlurVal = document.getElementById('sidebar-bg-blur-val');

  var presets = (typeof PRESETS !== 'undefined') ? PRESETS : {};
  var activePresetId = 'linen-day';
  var customNicknames = {};
  var courseImages = {};
  var discoveredCourses = [];
  var customThemeColors = null;
  var openCustomDotIndex = null;
  var savedUserPalettes = [];
  var currentStudioColors = {
    'background-0': '#181512',
    'cards': '#26201B',
    'sidebar': '#1C1713',
    'accent': '#E57B60',
    'text-0': '#F7F2EA'
  };

  var GROUPS = [
    { id: 'linen',   label: 'Linen',   day: 'linen-day',   night: 'linen-night' },
    { id: 'blossom', label: 'Blossom', day: 'blossom-day', night: 'blossom-night' },
    { id: 'dracula', label: 'Dracula', day: 'dracula-day',  night: 'dracula-night' },
    { id: 'custom',  label: 'Custom',  day: 'custom-day',   night: 'custom-night' }
  ];

  // ── Segmented Navigation Tabs ────────────────────────────────
  var navTabs = document.querySelectorAll('.popup-nav-tab');
  var tabPanes = document.querySelectorAll('.popup-tab-pane');
  navTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var target = tab.getAttribute('data-tab');
      navTabs.forEach(function(t) {
        var isTarget = t === tab;
        t.classList.toggle('active', isTarget);
        t.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      });
      tabPanes.forEach(function(pane) {
        pane.classList.toggle('active', pane.getAttribute('data-pane') === target);
      });
      try { localStorage.setItem('vibe_active_popup_tab', target); } catch(e) {}
    });
  });

  try {
    var savedTab = localStorage.getItem('vibe_active_popup_tab');
    if (savedTab) {
      var targetTab = document.querySelector('.popup-nav-tab[data-tab="' + savedTab + '"]');
      if (targetTab) targetTab.click();
    }
  } catch(e) {}

  // ── Color Utilities & Harmony Engine ─────────────────────────
  function hexToRgb(hex) {
    hex = (hex || '#000000').replace(/^#/, '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    var num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function hslToHex(h, s, l) {
    h = (h % 360 + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = l - c / 2;
    var r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    var toHex = function(n) {
      var hx = Math.round((n + m) * 255).toString(16);
      return hx.length === 1 ? '0' + hx : hx;
    };
    return ('#' + toHex(r) + toHex(g) + toHex(b)).toUpperCase();
  }

  function hexToHsl(hex) {
    var rgb = hexToRgb(hex);
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
  }

  var currentWallpaperUrl = '';
  var extractedWallpaperColors = [];

  function extractColorsFromWallpaper(url, callback) {
    if (!url || typeof url !== 'string' || !url.trim()) {
      extractedWallpaperColors = [];
      if (callback) callback([]);
      return;
    }
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      try {
        var cvs = document.createElement('canvas');
        cvs.width = 48;
        cvs.height = 48;
        var ctx = cvs.getContext('2d');
        ctx.drawImage(img, 0, 0, 48, 48);
        var data = ctx.getImageData(0, 0, 48, 48).data;
        var colorCounts = {};
        for (var i = 0; i < data.length; i += 16) {
          var a = data[i+3];
          if (a < 120) continue;
          var r = Math.round(data[i] / 28) * 28;
          var g = Math.round(data[i+1] / 28) * 28;
          var b = Math.round(data[i+2] / 28) * 28;
          var hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }
        var sorted = Object.keys(colorCounts).sort(function(a, b) {
          return colorCounts[b] - colorCounts[a];
        });
        var result = [];
        sorted.forEach(function(h) {
          var hsl = hexToHsl(h);
          if (hsl.s >= 10 && hsl.l >= 14 && hsl.l <= 90) {
            if (result.indexOf(h) === -1 && result.length < 8) result.push(h);
          }
        });
        extractedWallpaperColors = result;
        if (callback) callback(result);
      } catch (e) {
        if (callback) callback([]);
      }
    };
    img.onerror = function() {
      if (callback) callback([]);
    };
    img.src = url;
  }

  function deriveWallpaperPaletteForMode(isDark) {
    if (!extractedWallpaperColors || extractedWallpaperColors.length === 0) return null;
    var bg = null, card = null, accent = null, sec = null;

    var sortedBySat = extractedWallpaperColors.slice().sort(function(a, b) {
      return hexToHsl(b).s - hexToHsl(a).s;
    });
    accent = sortedBySat[0] || (isDark ? '#F59E0B' : '#B85338');
    sec = sortedBySat[1] || (isDark ? '#3B82F6' : '#2A8C66');

    if (isDark) {
      var sortedByLight = extractedWallpaperColors.slice().sort(function(a, b) {
        return hexToHsl(a).l - hexToHsl(b).l;
      });
      var darkest = sortedByLight[0] || '#1E1B18';
      var dHsl = hexToHsl(darkest);
      bg = hslToHex(dHsl.h, Math.min(dHsl.s, 22), 12);
      card = hslToHex(dHsl.h, Math.min(dHsl.s, 20), 18);
    } else {
      var sortedByLightDesc = extractedWallpaperColors.slice().sort(function(a, b) {
        return hexToHsl(b).l - hexToHsl(a).l;
      });
      var lightest = sortedByLightDesc[0] || '#F5F0E8';
      var lHsl = hexToHsl(lightest);
      bg = hslToHex(lHsl.h, Math.min(lHsl.s, 25), 92);
      card = hslToHex(lHsl.h, Math.min(lHsl.s, 20), 96);
    }

    var newSlots = [bg, card, accent, sec];
    return deriveFullCustomPalette(newSlots, isDark);
  }

  function adaptCustomThemeToWallpaper(isDark, markManual) {
    var pId = isDark ? 'custom-night' : 'custom-day';
    var derived = deriveWallpaperPaletteForMode(isDark);
    if (!derived) return;
    if (markManual) derived._manual = true;

    customThemeColors = (typeof customThemeColors === 'object' && customThemeColors !== null) ? customThemeColors : {};
    customThemeColors[pId] = derived;
    if (activePresetId === pId) {
      Object.assign(customThemeColors, derived);
    }
    if (presets[pId]) {
      presets[pId].colors = Object.assign({}, presets[pId].colors, derived);
    }
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ custom_theme_colors: customThemeColors });
    }
    if (activePresetId === pId) {
      if(customThemeColors && customThemeColors[activePresetId]) { presets[activePresetId] = customThemeColors[activePresetId]; } applyPopupTheme(activePresetId);
    }
    renderGroups();
  }

  function autoAdaptCustomDefaults() {
    if (!extractedWallpaperColors || extractedWallpaperColors.length === 0) return;
    customThemeColors = (typeof customThemeColors === 'object' && customThemeColors !== null) ? customThemeColors : {};
    var changed = false;

    // By default, Custom Day adapts to wallpaper if not manually locked
    if (!customThemeColors['custom-day'] || !customThemeColors['custom-day']._manual) {
      var dayPal = deriveWallpaperPaletteForMode(false);
      if (dayPal) {
        customThemeColors['custom-day'] = dayPal;
        if (presets['custom-day']) presets['custom-day'].colors = Object.assign({}, presets['custom-day'].colors, dayPal);
        changed = true;
      }
    }

    // By default, Custom Night adapts to wallpaper if not manually locked
    if (!customThemeColors['custom-night'] || !customThemeColors['custom-night']._manual) {
      var nightPal = deriveWallpaperPaletteForMode(true);
      if (nightPal) {
        customThemeColors['custom-night'] = nightPal;
        if (presets['custom-night']) presets['custom-night'].colors = Object.assign({}, presets['custom-night'].colors, nightPal);
        changed = true;
      }
    }

    if (activePresetId && activePresetId.indexOf('custom') !== -1 && customThemeColors[activePresetId]) {
      Object.assign(customThemeColors, customThemeColors[activePresetId]);
      if(customThemeColors && customThemeColors[activePresetId]) { presets[activePresetId] = customThemeColors[activePresetId]; } applyPopupTheme(activePresetId);
    }

    if (changed && typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ custom_theme_colors: customThemeColors });
    }
  }

  function getCustomSuggestions(slotIdx, slots, isDark) {
    var bgHsl = hexToHsl(slots[0]);
    var accentHsl = hexToHsl(slots[2]);
    var wpPicks = [];

    // Wallpaper-extracted colors prioritized
    if (extractedWallpaperColors && extractedWallpaperColors.length > 0) {
      if (slotIdx === 0) {
        extractedWallpaperColors.forEach(function(c) {
          var hsl = hexToHsl(c);
          if (isDark && hsl.l < 35 && wpPicks.indexOf(c) === -1) wpPicks.push(c);
          else if (!isDark && hsl.l > 65 && wpPicks.indexOf(c) === -1) wpPicks.push(c);
        });
      } else if (slotIdx === 1) {
        extractedWallpaperColors.forEach(function(c) {
          var hsl = hexToHsl(c);
          if (isDark && hsl.l >= 18 && hsl.l <= 45 && wpPicks.indexOf(c) === -1) wpPicks.push(c);
          else if (!isDark && hsl.l >= 70 && wpPicks.indexOf(c) === -1) wpPicks.push(c);
        });
      } else if (slotIdx === 2 || slotIdx === 3) {
        extractedWallpaperColors.forEach(function(c) {
          var hsl = hexToHsl(c);
          if (hsl.s >= 25 && wpPicks.indexOf(c) === -1) wpPicks.push(c);
        });
      }
    }

    var baseDefaults = [];
    if (slotIdx === 0) { // Background
      baseDefaults = isDark ? [
        '#241E19', '#251C24', '#1E222B', '#1B231F', '#EDE4D6'
      ] : [
        '#EDE4D6', '#D8E4D5', '#E8D5DA', '#DDD8E8', '#241E19'
      ];
    } else if (slotIdx === 1) { // Cards / Surface
      baseDefaults = isDark ? [
        '#2E2721', '#32232F', '#262C38', hslToHex(accentHsl.h, 24, 20), '#FAF7F2'
      ] : [
        '#FAF7F2', hslToHex(accentHsl.h, 34, 90), '#F2EAE0', '#E4ECE2', '#2C2621'
      ];
    } else if (slotIdx === 2) { // Primary Accent
      baseDefaults = [
        hslToHex((bgHsl.h + 180) % 360, 72, isDark ? 68 : 45),
        '#C54173', '#3B6EB5', '#D96B43', '#2A8C66'
      ];
    } else { // Secondary Accent / Detail
      baseDefaults = [
        hslToHex((accentHsl.h + 35) % 360, 72, isDark ? 68 : 48),
        '#DDA43B', '#E07A5F', '#377E5E', '#A855F7'
      ];
    }

    // Merge wallpaper picks first, then fill up to 6 suggestions
    var finalSuggestions = wpPicks.slice();
    baseDefaults.forEach(function(c) {
      if (finalSuggestions.indexOf(c) === -1 && finalSuggestions.length < 6) {
        finalSuggestions.push(c);
      }
    });
    return finalSuggestions;
  }

  function deriveFullCustomPalette(slots, isDark) {
    var bgHsl = hexToHsl(slots[0]);
    var accentHsl = hexToHsl(slots[2]);

    if (!isDark) {
      return {
        'background-0': slots[0],
        'background-1': hslToHex(bgHsl.h, bgHsl.s, Math.max(0, bgHsl.l - 4)),
        'background-2': hslToHex(bgHsl.h, bgHsl.s, Math.max(0, bgHsl.l - 8)),
        'borders': hslToHex(bgHsl.h, Math.max(0, bgHsl.s - 2), Math.max(0, bgHsl.l - 14)),
        'buttons': hslToHex(bgHsl.h, bgHsl.s, Math.max(0, bgHsl.l - 5)) + 'AF',
        'links': slots[2],
        'sidebar': hslToHex(bgHsl.h, Math.max(0, bgHsl.s - 2), Math.max(0, bgHsl.l - 3)),
        'sidebar-text': '#2A2521',
        'text-0': '#2A2521',
        'text-1': '#5A5149',
        'text-2': '#887B70',
        'cards': slots[1],
        'accent': slots[2],
        'accent-secondary': slots[3]
      };
    } else {
      return {
        'background-0': slots[0],
        'background-1': hslToHex(bgHsl.h, bgHsl.s, Math.min(100, bgHsl.l + 4)),
        'background-2': hslToHex(bgHsl.h, bgHsl.s, Math.min(100, bgHsl.l + 8)),
        'borders': hslToHex(bgHsl.h, Math.max(0, bgHsl.s - 4), Math.min(100, bgHsl.l + 14)),
        'buttons': hslToHex(bgHsl.h, bgHsl.s, Math.min(100, bgHsl.l + 5)),
        'links': slots[2],
        'sidebar': hslToHex(bgHsl.h, bgHsl.s, Math.max(0, bgHsl.l - 3)),
        'sidebar-text': '#EDEDF2',
        'text-0': '#EDEDF2',
        'text-1': '#B8BAC7',
        'text-2': '#828599',
        'cards': slots[1],
        'accent': slots[2],
        'accent-secondary': slots[3]
      };
    }
  }

  function applyPopupTheme(presetId) {
    var p = presets[presetId];
    if (!p) return;
    var isDark = p.mode === 'dark';
    document.body.classList.toggle('theme-dark', isDark);
    var accent = p.colors['accent'] || p.colors['links'] || '#B85338';
    document.documentElement.style.setProperty('--p-accent', accent);
    document.documentElement.style.setProperty('--p-bg', p.colors['background-0']);
    document.documentElement.style.setProperty('--p-surface', p.colors['background-1']);
    document.documentElement.style.setProperty('--p-border', p.colors['borders'] || (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'));
    document.documentElement.style.setProperty('--p-text', p.colors['text-0']);
    document.documentElement.style.setProperty('--p-text-2', p.colors['text-2'] || (isDark ? '#9E8E7D' : '#7A6B5F'));
    document.documentElement.style.setProperty('--p-slider-track', isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)');
    document.documentElement.style.setProperty('--p-pill-bg', isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)');
    document.documentElement.style.setProperty('--p-btn-bg', isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.04)');
    document.documentElement.style.setProperty('--p-btn-border', isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)');
    document.documentElement.style.setProperty('--p-item-active', isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)');

    var vBadge = document.getElementById('version-badge');
    if (vBadge && typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
      try {
        var mf = chrome.runtime.getManifest();
        if (mf && mf.version) vBadge.textContent = 'v' + mf.version;
      } catch (e) {}
    }
  }

  function renderGroups() {
    groupList.innerHTML = '';
    GROUPS.forEach(function(group) {
      var dayP = presets[group.day];
      var nightP = presets[group.night];
      if (!dayP && !nightP) return;
      var isDayActive = activePresetId === group.day;
      var isNightActive = activePresetId === group.night;

      var row = document.createElement('div');
      row.className = 'theme-group-row' + (isDayActive || isNightActive ? ' has-active' : '');

      var nameEl = document.createElement('div');
      nameEl.className = 'theme-group-name';
      nameEl.textContent = group.label;
      row.appendChild(nameEl);

      var activeP = isNightActive ? nightP : dayP;
      if (activeP) {
        if (group.id === 'custom' && (isDayActive || isNightActive)) {
          // Interactive 4-dot selector for Custom theme
          var customSwatches = document.createElement('div');
          customSwatches.className = 'custom-theme-swatches';

          var storedCustomForActive = (customThemeColors && customThemeColors[activePresetId]) ?
            customThemeColors[activePresetId] :
            (customThemeColors && !customThemeColors['custom-day'] && !customThemeColors['custom-night'] ? customThemeColors : null);

          var activeCustomColors = Object.assign({}, activeP.colors);
          if (storedCustomForActive && storedCustomForActive['background-0']) {
            var bgH = hexToHsl(storedCustomForActive['background-0']);
            var matchesMode = (activeP.mode === 'dark') ? (bgH.l < 50) : (bgH.l >= 50);
            if (matchesMode) {
              activeCustomColors = Object.assign({}, activeP.colors, storedCustomForActive);
            }
          }

          var slots = [
            activeCustomColors['background-0'],
            activeCustomColors['cards'],
            activeCustomColors['accent'] || activeCustomColors['links'],
            activeCustomColors['accent-secondary'] || activeCustomColors['borders']
          ];
          var slotLabels = ['Background', 'Cards Surface', 'Primary Accent', 'Secondary Detail'];

          var activeDotDropdown = null;

          slots.forEach(function(col, sIdx) {
            var dotItem = document.createElement('div');
            dotItem.className = 'custom-dot-item';

            var dotBtn = document.createElement('button');
            dotBtn.type = 'button';
            dotBtn.className = 'custom-dot-btn' + (openCustomDotIndex === sIdx ? ' active' : '');
            dotBtn.style.background = col;
            dotBtn.title = slotLabels[sIdx] + ': ' + col;

            dotBtn.addEventListener('click', function(e) {
              e.stopPropagation();
              openCustomDotIndex = (openCustomDotIndex === sIdx ? null : sIdx);
              renderGroups();
            });
            dotItem.appendChild(dotBtn);

            // Build dropdown popover for the active dot
            if (openCustomDotIndex === sIdx) {
              var colDropdown = document.createElement('div');
              colDropdown.className = 'custom-dot-column';

              var headerEl = document.createElement('div');
              headerEl.className = 'custom-dot-header';
              headerEl.textContent = slotLabels[sIdx];
              colDropdown.appendChild(headerEl);

              var suggRow = document.createElement('div');
              suggRow.className = 'custom-suggestions-row';

              var suggestions = getCustomSuggestions(sIdx, slots, activeP.mode === 'dark');
              suggestions.forEach(function(sCol) {
                var sDot = document.createElement('div');
                sDot.className = 'custom-suggestion-dot';
                sDot.style.background = sCol;
                sDot.title = 'Use ' + sCol;
                sDot.addEventListener('click', function(e) {
                  e.stopPropagation();
                  slots[sIdx] = sCol;
                  var derived = deriveFullCustomPalette(slots, activeP.mode === 'dark');
                  derived._manual = true;
                  customThemeColors = (typeof customThemeColors === 'object' && customThemeColors !== null) ? customThemeColors : {};
                  customThemeColors[activePresetId] = derived;
                  Object.assign(customThemeColors, derived);
                  presets[activePresetId].colors = Object.assign({}, presets[activePresetId].colors, derived);
                  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                    chrome.storage.local.set({ custom_theme_colors: customThemeColors });
                  }
                  openCustomDotIndex = null;
                  if(customThemeColors && customThemeColors[activePresetId]) { presets[activePresetId] = customThemeColors[activePresetId]; } applyPopupTheme(activePresetId);
                  renderGroups();
                });
                suggRow.appendChild(sDot);
              });

              // Native color picker (+ / visual palette)
              var colorPickerLabel = document.createElement('label');
              colorPickerLabel.className = 'custom-color-picker-label';
              colorPickerLabel.title = 'Color Wheel';

              var colorInput = document.createElement('input');
              colorInput.type = 'color';
              colorInput.className = 'custom-color-picker-input';
              colorInput.value = (col.startsWith('#') && col.length === 7) ? col : '#C54173';
              colorInput.addEventListener('input', function(e) {
                var chosen = e.target.value.toUpperCase();
                slots[sIdx] = chosen;
                var derived = deriveFullCustomPalette(slots, activeP.mode === 'dark');
                derived._manual = true;
                customThemeColors = (typeof customThemeColors === 'object' && customThemeColors !== null) ? customThemeColors : {};
                customThemeColors[activePresetId] = derived;
                Object.assign(customThemeColors, derived);
                presets[activePresetId].colors = Object.assign({}, presets[activePresetId].colors, derived);
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                  chrome.storage.local.set({ custom_theme_colors: customThemeColors });
                }
                if(customThemeColors && customThemeColors[activePresetId]) { presets[activePresetId] = customThemeColors[activePresetId]; } applyPopupTheme(activePresetId);
              });
              colorInput.addEventListener('change', function() {
                openCustomDotIndex = null;
                renderGroups();
              });

              colorPickerLabel.appendChild(colorInput);
              suggRow.appendChild(colorPickerLabel);
              colDropdown.appendChild(suggRow);

              // HEX Enter input box (user direct entry)
              var hexWrap = document.createElement('div');
              hexWrap.className = 'custom-hex-box';

              var hexInp = document.createElement('input');
              hexInp.type = 'text';
              hexInp.className = 'custom-hex-input';
              hexInp.maxLength = 7;
              hexInp.value = col.toUpperCase();
              hexInp.placeholder = '#HEX';
              hexInp.spellcheck = false;

              var hexBtn = document.createElement('button');
              hexBtn.type = 'button';
              hexBtn.className = 'custom-hex-btn';
              hexBtn.textContent = 'Apply';
              hexBtn.title = 'Apply hex code';

              function applyUserHex(raw) {
                raw = (raw || '').trim().toUpperCase();
                if (!raw.startsWith('#')) raw = '#' + raw;
                if (/^#[0-9A-F]{6}$/i.test(raw) || /^#[0-9A-F]{3}$/i.test(raw)) {
                  if (raw.length === 4) {
                    raw = '#' + raw[1] + raw[1] + raw[2] + raw[2] + raw[3] + raw[3];
                  }
                  slots[sIdx] = raw;
                  var derived = deriveFullCustomPalette(slots, activeP.mode === 'dark');
                  derived._manual = true;
                  customThemeColors = (typeof customThemeColors === 'object' && customThemeColors !== null) ? customThemeColors : {};
                  customThemeColors[activePresetId] = derived;
                  Object.assign(customThemeColors, derived);
                  presets[activePresetId].colors = Object.assign({}, presets[activePresetId].colors, derived);
                  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                    chrome.storage.local.set({ custom_theme_colors: customThemeColors });
                  }
                  openCustomDotIndex = null;
                  if(customThemeColors && customThemeColors[activePresetId]) { presets[activePresetId] = customThemeColors[activePresetId]; } applyPopupTheme(activePresetId);
                  renderGroups();
                } else {
                  hexInp.style.borderColor = '#FF453A';
                }
              }

              hexBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                applyUserHex(hexInp.value);
              });
              hexInp.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  applyUserHex(hexInp.value);
                }
              });
              hexInp.addEventListener('click', function(e) {
                e.stopPropagation();
              });

              hexWrap.appendChild(hexInp);
              hexWrap.appendChild(hexBtn);
              colDropdown.appendChild(hexWrap);

              if (extractedWallpaperColors && extractedWallpaperColors.length > 0) {
                var adaptBtn = document.createElement('button');
                adaptBtn.type = 'button';
                adaptBtn.className = 'adapt-wallpaper-btn';
                adaptBtn.textContent = '✨ Match Current Wallpaper';
                adaptBtn.title = 'Tune custom colors to match current wallpaper';
                adaptBtn.addEventListener('click', function(e) {
                  e.stopPropagation();
                  adaptCustomThemeToWallpaper(activeP.mode === 'dark');
                });
                colDropdown.appendChild(adaptBtn);
              }

              activeDotDropdown = colDropdown;
            }

            customSwatches.appendChild(dotItem);
          });

          if (activeDotDropdown) {
            row.appendChild(activeDotDropdown);
          }

          row.appendChild(customSwatches);
        } else {
          // Standard static swatches for other presets
          var sw = document.createElement('div');
          sw.className = 'theme-group-swatches';
          var c = (group.id === 'custom' && customThemeColors) ? Object.assign({}, activeP.colors, customThemeColors) : activeP.colors;
          [c['background-0'], c['accent'] || c['links'], c['accent-secondary'] || c['links'], c['borders']].forEach(function(col) {
            var s = document.createElement('div');
            s.className = 'swatch';
            s.style.background = col;
            sw.appendChild(s);
          });
          row.appendChild(sw);
        }
      }

      var pills = document.createElement('div');
      pills.className = 'theme-mode-pills';
      [
        {
          mode: 'day',
          title: 'Day mode',
          icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
        },
        {
          mode: 'night',
          title: 'Night mode',
          icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
        }
      ].forEach(function(item) {
        var btn = document.createElement('button');
        var isActive = (item.mode === 'day' ? isDayActive : isNightActive);
        btn.className = 'mode-pill-btn' + (isActive ? ' active' : '');
        btn.innerHTML = item.icon;
        btn.title = item.title;
        btn.setAttribute('aria-label', item.title);
        btn.addEventListener('click', function() {
          openCustomDotIndex = null;
          selectPreset(group[item.mode]);
        });
        pills.appendChild(btn);
      });
      row.appendChild(pills);
      groupList.appendChild(row);
    });
  }

  // Close open custom dot column when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-theme-swatches')) {
      if (openCustomDotIndex !== null) {
        openCustomDotIndex = null;
        renderGroups();
      }
    }
  });

  function selectPreset(presetId) {
    activePresetId = presetId;
    if (presetId.indexOf('custom') !== -1 && extractedWallpaperColors && extractedWallpaperColors.length > 0) {
      if (!customThemeColors || !customThemeColors[presetId] || !customThemeColors[presetId]._manual) {
        autoAdaptCustomDefaults();
      }
    }
    applyPopupTheme(presetId);
    renderGroups();
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ active_preset: presetId });
    }
  }

  // ── Sidebar Background Handlers ────────────────────────────
  function updateSidebarBgUI(url, opacity, blur) {
    var op = (opacity !== undefined && opacity !== null && !isNaN(parseInt(opacity, 10))) ? parseInt(opacity, 10) : 15;
    var bl = (blur !== undefined && blur !== null && !isNaN(parseInt(blur, 10))) ? parseInt(blur, 10) : 16;
    if (sidebarBgOpacitySlider) {
      sidebarBgOpacitySlider.value = op;
      sidebarBgOpacityVal.textContent = op + '%';
    }
    if (sidebarBgBlurSlider) {
      sidebarBgBlurSlider.value = bl;
      sidebarBgBlurVal.textContent = bl + 'px';
    }
    if (url) {
      if (clearSidebarBgBtn) clearSidebarBgBtn.style.display = 'inline-block';
      if (uploadSidebarBgBtn) uploadSidebarBgBtn.textContent = 'Change Photo';
      if (sidebarBgUrlInput) sidebarBgUrlInput.value = (typeof url === 'string' && url.startsWith('data:')) ? '' : url;
    } else {
      if (clearSidebarBgBtn) clearSidebarBgBtn.style.display = 'none';
      if (uploadSidebarBgBtn) uploadSidebarBgBtn.textContent = 'Custom Photo';
      if (sidebarBgUrlInput) sidebarBgUrlInput.value = '';
    }
  }

  if (uploadSidebarBgBtn && sidebarBgFileInput) {
    uploadSidebarBgBtn.addEventListener('click', function() {
      sidebarBgFileInput.click();
    });

    sidebarBgFileInput.addEventListener('change', function(e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(evt) {
        var dataUrl = evt.target.result;
        var op = parseInt(sidebarBgOpacitySlider.value, 10) || 15;
        var bl = parseInt(sidebarBgBlurSlider.value, 10) || 16;
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({
            vibe_sidebar_bg_url: dataUrl,
            vibe_sidebar_bg_opacity: op,
            vibe_sidebar_bg_blur: bl
          }, function() {
            updateSidebarBgUI(dataUrl, op, bl);
          });
        }
      };
      reader.readAsDataURL(file);
    });
  }

  if (urlSidebarBgBtn && sidebarBgUrlBox) {
    urlSidebarBgBtn.addEventListener('click', function() {
      var isHidden = sidebarBgUrlBox.style.display === 'none' || !sidebarBgUrlBox.style.display;
      sidebarBgUrlBox.style.display = isHidden ? 'flex' : 'none';
      if (isHidden && sidebarBgUrlInput) sidebarBgUrlInput.focus();
    });
  }

  function applySidebarBgUrl() {
    if (!sidebarBgUrlInput) return;
    var url = sidebarBgUrlInput.value.trim();
    if (!url) return;
    var op = parseInt(sidebarBgOpacitySlider.value, 10) || 15;
    var bl = parseInt(sidebarBgBlurSlider.value, 10) || 16;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({
        vibe_sidebar_bg_url: url,
        vibe_sidebar_bg_opacity: op,
        vibe_sidebar_bg_blur: bl
      }, function() {
        updateSidebarBgUI(url, op, bl);
        if (sidebarBgUrlBox) sidebarBgUrlBox.style.display = 'none';
      });
    }
  }

  if (sidebarBgUrlApplyBtn) {
    sidebarBgUrlApplyBtn.addEventListener('click', applySidebarBgUrl);
  }
  if (sidebarBgUrlInput) {
    sidebarBgUrlInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        applySidebarBgUrl();
      }
    });
  }

  if (clearSidebarBgBtn) {
    clearSidebarBgBtn.addEventListener('click', function() {
      var op = parseInt(sidebarBgOpacitySlider.value, 10) || 15;
      var bl = parseInt(sidebarBgBlurSlider.value, 10) || 16;
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ vibe_sidebar_bg_url: '' }, function() {
          updateSidebarBgUI('', op, bl);
          if (sidebarBgUrlBox) sidebarBgUrlBox.style.display = 'none';
        });
      }
    });
  }

  var debouncedStorageTimers = {};
  function debouncedStorageSet(key, val, delay) {
    if (debouncedStorageTimers[key]) clearTimeout(debouncedStorageTimers[key]);
    debouncedStorageTimers[key] = setTimeout(function() {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        var obj = {};
        obj[key] = val;
        chrome.storage.local.set(obj);
      }
    }, delay || 75);
  }

  let liveParamTicking = false;
  let latestParams = {};
  function sendLiveParam(key, val) {
    latestParams[key] = val;
    if (!liveParamTicking) {
      liveParamTicking = true;
      requestAnimationFrame(() => {
        for (let k in latestParams) {
          if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
            try { chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) { if (tabs && tabs[0] && tabs[0].id) { chrome.tabs.sendMessage(tabs[0].id, { type: "VIBE_LIVE_PARAM", key: k, value: latestParams[k] }, function() { if(chrome.runtime.lastError){} }); } }); } catch(e) {}
          }
        }
        latestParams = {};
        liveParamTicking = false;
      });
    }
  }
  function oldSendLiveParam_unused(key, val) {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      try {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          if (tabs && tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'VIBE_LIVE_PARAM', key: key, value: val }, function() {
              if (chrome.runtime.lastError) {}
            });
          }
        });
      } catch(e) {}
    }
  }

  if (sidebarBgOpacitySlider) {
    sidebarBgOpacitySlider.addEventListener('input', function() {
      var val = parseInt(sidebarBgOpacitySlider.value, 10);
      sidebarBgOpacityVal.textContent = val + '%';
      sendLiveParam('vibe_sidebar_bg_opacity', val);
      debouncedStorageSet('vibe_sidebar_bg_opacity', val, 60);
    });
    sidebarBgOpacitySlider.addEventListener('change', function() {
      var val = parseInt(sidebarBgOpacitySlider.value, 10);
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ vibe_sidebar_bg_opacity: val });
      }
    });
  }

  if (sidebarBgBlurSlider) {
    sidebarBgBlurSlider.addEventListener('input', function() {
      var val = parseInt(sidebarBgBlurSlider.value, 10);
      sidebarBgBlurVal.textContent = val + 'px';
      sendLiveParam('vibe_sidebar_bg_blur', val);
      debouncedStorageSet('vibe_sidebar_bg_blur', val, 60);
    });
    sidebarBgBlurSlider.addEventListener('change', function() {
      var val = parseInt(sidebarBgBlurSlider.value, 10);
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ vibe_sidebar_bg_blur: val });
      }
    });
  }

  // ── Wallpaper Handlers ─────────────────────────────────────
  function updateWallpaperUI(url, opacity, blur) {
    if (url) {
      wallpaperControls.style.display = 'flex';
      clearWallpaperBtn.style.display = 'inline-block';
      uploadWallpaperBtn.textContent = 'Change Photo';
      var op = opacity !== undefined ? parseInt(opacity, 10) : 25;
      var bl = blur !== undefined ? parseInt(blur, 10) : 0;
      wallpaperOpacitySlider.value = op;
      wallpaperOpacityVal.textContent = op + '%';
      wallpaperBlurSlider.value = bl;
      wallpaperBlurVal.textContent = bl + 'px';
      if (wallpaperUrlInput) wallpaperUrlInput.value = url.startsWith('data:') ? '' : url;
    } else {
      wallpaperControls.style.display = 'none';
      clearWallpaperBtn.style.display = 'none';
      uploadWallpaperBtn.textContent = 'Upload Photo';
      if (wallpaperUrlInput) wallpaperUrlInput.value = '';
    }
  }

  if (uploadWallpaperBtn && wallpaperFileInput) {
    uploadWallpaperBtn.addEventListener('click', function() {
      wallpaperFileInput.click();
    });

    wallpaperFileInput.addEventListener('change', function(e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(evt) {
        var dataUrl = evt.target.result;
        var op = parseInt(wallpaperOpacitySlider.value, 10) || 25;
        var bl = parseInt(wallpaperBlurSlider.value, 10) || 0;
        currentWallpaperUrl = dataUrl;
        extractColorsFromWallpaper(dataUrl, function() {
          autoAdaptCustomDefaults();
          renderGroups();
        });
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({
            vibe_wallpaper_url: dataUrl,
            vibe_wallpaper_opacity: op,
            vibe_wallpaper_blur: bl
          }, function() {
            updateWallpaperUI(dataUrl, op, bl);
          });
        }
      };
      reader.readAsDataURL(file);
    });
  }

  if (urlWallpaperBtn && wallpaperUrlBox) {
    urlWallpaperBtn.addEventListener('click', function() {
      var isHidden = wallpaperUrlBox.style.display === 'none' || !wallpaperUrlBox.style.display;
      wallpaperUrlBox.style.display = isHidden ? 'flex' : 'none';
      if (isHidden && wallpaperUrlInput) wallpaperUrlInput.focus();
    });
  }

  function applyWallpaperUrl() {
    if (!wallpaperUrlInput) return;
    var url = wallpaperUrlInput.value.trim();
    if (!url) return;
    var op = parseInt(wallpaperOpacitySlider.value, 10) || 25;
    var bl = parseInt(wallpaperBlurSlider.value, 10) || 0;
    currentWallpaperUrl = url;
    extractColorsFromWallpaper(url, function() {
      autoAdaptCustomDefaults();
      renderGroups();
    });
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({
        vibe_wallpaper_url: url,
        vibe_wallpaper_opacity: op,
        vibe_wallpaper_blur: bl
      }, function() {
        updateWallpaperUI(url, op, bl);
        if (wallpaperUrlBox) wallpaperUrlBox.style.display = 'none';
      });
    }
  }

  if (wallpaperUrlApplyBtn) {
    wallpaperUrlApplyBtn.addEventListener('click', applyWallpaperUrl);
  }
  if (wallpaperUrlInput) {
    wallpaperUrlInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyWallpaperUrl();
      }
    });
  }

  if (clearWallpaperBtn) {
    clearWallpaperBtn.addEventListener('click', function() {
      currentWallpaperUrl = '';
      extractedWallpaperColors = [];
      renderGroups();
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ vibe_wallpaper_url: '' }, function() {
          updateWallpaperUI('', 25, 0);
          if (wallpaperUrlBox) wallpaperUrlBox.style.display = 'none';
        });
      }
    });
  }

  if (wallpaperOpacitySlider) {
    wallpaperOpacitySlider.addEventListener('input', function() {
      var val = parseInt(wallpaperOpacitySlider.value, 10);
      wallpaperOpacityVal.textContent = val + '%';
      sendLiveParam('vibe_wallpaper_opacity', val);
      debouncedStorageSet('vibe_wallpaper_opacity', val, 60);
    });
    wallpaperOpacitySlider.addEventListener('change', function() {
      var val = parseInt(wallpaperOpacitySlider.value, 10);
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ vibe_wallpaper_opacity: val });
      }
    });
  }

  if (wallpaperBlurSlider) {
    wallpaperBlurSlider.addEventListener('input', function() {
      var val = parseInt(wallpaperBlurSlider.value, 10);
      wallpaperBlurVal.textContent = val + 'px';
      sendLiveParam('vibe_wallpaper_blur', val);
      debouncedStorageSet('vibe_wallpaper_blur', val, 60);
    });
    wallpaperBlurSlider.addEventListener('change', function() {
      var val = parseInt(wallpaperBlurSlider.value, 10);
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ vibe_wallpaper_blur: val });
      }
    });
  }

  // ── PALETTES STUDIO & PERSISTENCE ENGINE (UP TO 10 PALETTES) ────
  var colorBg0Input = document.getElementById('color-bg-0');
  var hexBg0Label = document.getElementById('hex-bg-0');
  var colorCardsInput = document.getElementById('color-cards');
  var hexCardsLabel = document.getElementById('hex-cards');
  var colorSidebarInput = document.getElementById('color-sidebar');
  var hexSidebarLabel = document.getElementById('hex-sidebar');
  var colorAccentInput = document.getElementById('color-accent');
  var hexAccentLabel = document.getElementById('hex-accent');
  var colorTextInput = document.getElementById('color-text');
  var hexTextLabel = document.getElementById('hex-text');

  var savePaletteBtn = document.getElementById('save-custom-palette-btn');
  var paletteNameInput = document.getElementById('custom-palette-name-input');
  var paletteLimitCaption = document.getElementById('palette-limit-caption');
  var savedPalettesShelf = document.getElementById('saved-palettes-shelf');
  var exportPalettesBtn = document.getElementById('export-palettes-btn');
  var importPalettesBtn = document.getElementById('import-palettes-btn');
  var importPalettesInput = document.getElementById('import-palettes-input');
  var restorePremadesBtn = document.getElementById('restore-premades-btn');
  var paletteModePill = document.getElementById('palette-mode-pill');

  var DEFAULT_PREMADE_PALETTES = [
    {
      id: 'pal-coastline',
      name: 'Coastline',
      isPremade: true,
      mode: 'dark',
      colors: {
        'background-0': '#1F3843',
        'background-1': '#192E37',
        'background-2': '#264653',
        'cards': '#223D49',
        'sidebar': '#14252D',
        'sidebar-text': '#F8F9FA',
        'borders': '#325868',
        'buttons': '#264653',
        'accent': '#F4A261',
        'links': '#E76F51',
        'text-0': '#F8F9FA',
        'text-1': '#D6DFE2',
        'text-2': '#A1B5BC'
      },
      courseColors: {
        math: '#2A9D8F',
        stat: '#E76F51',
        data: '#F4A261',
        music: '#E9C46A',
        history: '#2A9D8F',
        fallback: ['#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#3D7486', '#457B9D']
      }
    },
    {
      id: 'pal-terracotta',
      name: 'Terracotta Sun',
      isPremade: true,
      mode: 'dark',
      colors: {
        'background-0': '#211714',
        'background-1': '#1A1210',
        'background-2': '#2D1F1B',
        'cards': '#281C18',
        'sidebar': '#160E0D',
        'sidebar-text': '#FAF0E6',
        'borders': '#443029',
        'buttons': '#382520',
        'accent': '#E27D60',
        'links': '#E8A87C',
        'text-0': '#FAF0E6',
        'text-1': '#E0D2C7',
        'text-2': '#A8998E'
      },
      courseColors: {
        math: '#E27D60',
        stat: '#E8A87C',
        data: '#C38D9E',
        music: '#41B3A3',
        history: '#85DCB0',
        fallback: ['#E27D60', '#E8A87C', '#C38D9E', '#41B3A3', '#85DCB0', '#DDA15E']
      }
    },
    {
      id: 'pal-rose-milk',
      name: 'Rose Milk',
      isPremade: true,
      mode: 'light',
      colors: {
        'background-0': '#FAF2F5',
        'background-1': '#F4E6EB',
        'background-2': '#EBD6DF',
        'cards': '#FFFFFF',
        'sidebar': '#F6E8EE',
        'sidebar-text': '#2E1825',
        'borders': '#E3CDD7',
        'buttons': '#EDDAE3',
        'accent': '#E11D48',
        'links': '#BE185D',
        'text-0': '#281421',
        'text-1': '#59364C',
        'text-2': '#8A6178'
      },
      courseColors: {
        math: '#E11D48',
        stat: '#10B981',
        data: '#6366F1',
        music: '#F59E0B',
        history: '#8B5CF6',
        fallback: ['#E11D48', '#10B981', '#6366F1', '#F59E0B', '#8B5CF6', '#EC4899']
      }
    },
    {
      id: 'pal-sunlit-cream',
      name: 'Sunlit Cream',
      isPremade: true,
      mode: 'light',
      colors: {
        'background-0': '#FAF6F0',
        'background-1': '#F3ECE0',
        'background-2': '#E8DEC8',
        'cards': '#FFFFFF',
        'sidebar': '#F5EFE6',
        'sidebar-text': '#2B231C',
        'borders': '#E0D4C3',
        'buttons': '#EADECF',
        'accent': '#D97706',
        'links': '#B45309',
        'text-0': '#241E19',
        'text-1': '#574A3E',
        'text-2': '#8C7B6D'
      },
      courseColors: {
        math: '#D97706',
        stat: '#059669',
        data: '#2563EB',
        music: '#DB2777',
        history: '#7C3AED',
        fallback: ['#D97706', '#059669', '#2563EB', '#DB2777', '#7C3AED', '#EA580C']
      }
    },
    {
      id: 'pal-matcha-latte',
      name: 'Matcha Latte',
      isPremade: true,
      mode: 'dark',
      colors: {
        'background-0': '#19221B',
        'background-1': '#131A15',
        'background-2': '#233026',
        'cards': '#1E2920',
        'sidebar': '#0E140F',
        'sidebar-text': '#F4F7F4',
        'borders': '#334437',
        'buttons': '#28362B',
        'accent': '#A3C9A8',
        'links': '#84B59F',
        'text-0': '#F4F7F4',
        'text-1': '#D5E0D6',
        'text-2': '#96A898'
      },
      courseColors: {
        math: '#A3C9A8',
        stat: '#84B59F',
        data: '#69B578',
        music: '#DDB771',
        history: '#C27BA0',
        fallback: ['#A3C9A8', '#84B59F', '#69B578', '#DDB771', '#C27BA0', '#5B8E7D']
      }
    }
  ];

  function updateStudioLiveMockup() {
    var bg0 = currentStudioColors['background-0'];
    var cards = currentStudioColors['cards'];
    var sb = currentStudioColors['sidebar'];
    var acc = currentStudioColors['accent'];
    var txt = currentStudioColors['text-0'];

    var liveBox = document.getElementById('palette-live-preview');
    if (liveBox) liveBox.style.background = bg0;

    var mockSb = document.getElementById('mock-sidebar');
    if (mockSb) mockSb.style.background = sb;

    var mockNavActive = document.getElementById('mock-nav-active');
    if (mockNavActive) mockNavActive.style.background = acc;

    var mockBadge = document.getElementById('mock-badge');
    if (mockBadge) {
      mockBadge.style.background = acc;
      mockBadge.style.color = '#ffffff';
    }

    var mockTitleText = document.getElementById('mock-title-text');
    if (mockTitleText) mockTitleText.style.color = txt;

    var card1 = document.getElementById('mock-card-1');
    if (card1) card1.style.background = cards;

    var card2 = document.getElementById('mock-card-2');
    if (card2) card2.style.background = cards;

    var banner1 = document.getElementById('mock-banner-1');
    if (banner1) banner1.style.background = 'linear-gradient(135deg, ' + acc + ' 0%, ' + acc + '99 100%)';

    var banner2 = document.getElementById('mock-banner-2');
    if (banner2) banner2.style.background = 'linear-gradient(135deg, ' + acc + 'bb 0%, ' + acc + '55 100%)';

    var lineTitle1 = document.getElementById('mock-line-title-1');
    if (lineTitle1) lineTitle1.style.color = txt;

    var lineTitle2 = document.getElementById('mock-line-title-2');
    if (lineTitle2) lineTitle2.style.color = txt;

    var mockAccText = document.getElementById('mock-accent-text');
    if (mockAccText) mockAccText.style.color = acc;

    var bgHsl = hexToHsl(bg0);
    var isDark = bgHsl.l < 50;
    if (paletteModePill) {
      paletteModePill.textContent = isDark ? 'Dark Mode' : 'Light Mode';
    }
  }

  function syncStudioInputsWithColors() {
    if (colorBg0Input) { colorBg0Input.value = currentStudioColors['background-0']; hexBg0Label.textContent = currentStudioColors['background-0'].toUpperCase(); }
    if (colorCardsInput) { colorCardsInput.value = currentStudioColors['cards']; hexCardsLabel.textContent = currentStudioColors['cards'].toUpperCase(); }
    if (colorSidebarInput) { colorSidebarInput.value = currentStudioColors['sidebar']; hexSidebarLabel.textContent = currentStudioColors['sidebar'].toUpperCase(); }
    if (colorAccentInput) { colorAccentInput.value = currentStudioColors['accent']; hexAccentLabel.textContent = currentStudioColors['accent'].toUpperCase(); }
    if (colorTextInput) { colorTextInput.value = currentStudioColors['text-0']; hexTextLabel.textContent = currentStudioColors['text-0'].toUpperCase(); }
    updateStudioLiveMockup();
  }

  function wireStudioColorInput(inputEl, labelEl, key) {
    if (!inputEl) return;
    inputEl.addEventListener('input', function(e) {
      var val = e.target.value.toUpperCase();
      currentStudioColors[key] = val;
      if (labelEl) labelEl.textContent = val;
      updateStudioLiveMockup();
    });
  }

  wireStudioColorInput(colorBg0Input, hexBg0Label, 'background-0');
  wireStudioColorInput(colorCardsInput, hexCardsLabel, 'cards');
  wireStudioColorInput(colorSidebarInput, hexSidebarLabel, 'sidebar');
  wireStudioColorInput(colorAccentInput, hexAccentLabel, 'accent');
  wireStudioColorInput(colorTextInput, hexTextLabel, 'text-0');

  function registerSavedPalettesIntoPresets() {
    if (!Array.isArray(savedUserPalettes)) return;
    savedUserPalettes.forEach(function(p) {
      if (p && p.id && p.colors) {
        presets[p.id] = {
          id: p.id,
          name: p.name || 'Custom Palette',
          mode: p.mode || (hexToHsl(p.colors['background-0']).l < 50 ? 'dark' : 'light'),
          vibe: 'User Crafted Palette: ' + (p.name || 'Custom'),
          colors: p.colors,
          courseColors: p.courseColors || {
            math: p.colors.accent,
            stat: p.colors.accent,
            fallback: [p.colors.accent, '#457354', '#B85338', '#CFA33C', '#486A8C']
          }
        };
      }
    });
  }

  function persistSavedPalettes() {
    try {
      localStorage.setItem('vibe_saved_user_palettes_backup', JSON.stringify(savedUserPalettes));
    } catch(e) {}
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ saved_user_palettes: savedUserPalettes });
    }
  }

  function renderSavedPalettesShelf() {
    if (!savedPalettesShelf) return;
    savedPalettesShelf.innerHTML = '';

    if (paletteLimitCaption) {
      paletteLimitCaption.textContent = 'Saved Palettes (' + (savedUserPalettes ? savedUserPalettes.length : 0) + '/10)';
    }

    if (!savedUserPalettes || savedUserPalettes.length === 0) {
      var emptyEl = document.createElement('div');
      emptyEl.className = 'saved-palettes-empty';
      emptyEl.textContent = 'No custom palettes saved yet. Pick colors above and click Save Palette!';
      savedPalettesShelf.appendChild(emptyEl);
      return;
    }

    savedUserPalettes.forEach(function(item, idx) {
      var card = document.createElement('div');
      var isActive = activePresetId === item.id;
      card.className = 'saved-palette-card' + (isActive ? ' active' : '');

      var info = document.createElement('div');
      info.className = 'saved-palette-info';
      info.title = 'Click to preview & apply ' + item.name;

      var nameEl = document.createElement('div');
      nameEl.className = 'saved-palette-name';
      nameEl.textContent = item.name;

      var swRow = document.createElement('div');
      swRow.className = 'saved-palette-swatches';
      var c = item.colors || {};
      [c['background-0'], c['cards'], c['sidebar'], c['accent'], c['text-0']].forEach(function(col) {
        if (!col) return;
        var dot = document.createElement('div');
        dot.className = 'saved-mini-dot';
        dot.style.background = col;
        swRow.appendChild(dot);
      });

      info.appendChild(nameEl);
      info.appendChild(swRow);

      info.addEventListener('click', function() {
        currentStudioColors = Object.assign({}, item.colors);
        if (paletteNameInput) paletteNameInput.value = item.name;
        syncStudioInputsWithColors();
        selectPreset(item.id);
        renderSavedPalettesShelf();
      });

      var actions = document.createElement('div');
      actions.className = 'saved-palette-actions';

      var applyBtn = document.createElement('button');
      applyBtn.type = 'button';
      applyBtn.className = 'saved-apply-btn';
      applyBtn.textContent = isActive ? 'Active' : 'Apply';
      applyBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentStudioColors = Object.assign({}, item.colors);
        if (paletteNameInput) paletteNameInput.value = item.name;
        syncStudioInputsWithColors();
        selectPreset(item.id);
        renderSavedPalettesShelf();
      });

      var editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'saved-edit-btn';
      editBtn.title = 'Edit in Studio';
      editBtn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
      editBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentStudioColors = Object.assign({}, item.colors);
        if (paletteNameInput) paletteNameInput.value = item.name;
        syncStudioInputsWithColors();
        var liveBox = document.getElementById('palette-live-preview');
        if (liveBox) liveBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'saved-delete-btn';
      delBtn.title = 'Delete palette';
      delBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      delBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        savedUserPalettes.splice(idx, 1);
        persistSavedPalettes();
        delete presets[item.id];
        if (activePresetId === item.id) {
          selectPreset('linen-day');
        }
        renderSavedPalettesShelf();
      });

      actions.appendChild(applyBtn);
      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      card.appendChild(info);
      card.appendChild(actions);
      savedPalettesShelf.appendChild(card);
    });
  }

  if (restorePremadesBtn) {
    restorePremadesBtn.addEventListener('click', function() {
      if (!savedUserPalettes) savedUserPalettes = [];
      var added = 0;
      DEFAULT_PREMADE_PALETTES.forEach(function(dp) {
        var exists = savedUserPalettes.some(function(p) { return p && (p.id === dp.id || p.name === dp.name); });
        if (!exists && savedUserPalettes.length < 10) {
          savedUserPalettes.push(Object.assign({}, dp));
          added++;
        }
      });
      if (added > 0) {
        persistSavedPalettes();
        registerSavedPalettesIntoPresets();
        renderSavedPalettesShelf();
      } else if (savedUserPalettes.length >= 10) {
        alert('Palette limit reached (10 max). Delete one to add.');
      }
    });
  }

  if (savePaletteBtn) {
    savePaletteBtn.addEventListener('click', function() {
      if (!savedUserPalettes) savedUserPalettes = [];
      if (savedUserPalettes.length >= 10) {
        alert('You have reached the maximum limit of 10 saved custom palettes. Please delete one to save a new one.');
        return;
      }

      var rawName = (paletteNameInput && paletteNameInput.value ? paletteNameInput.value.trim() : '');
      var palName = rawName || ('Custom Palette ' + (savedUserPalettes.length + 1));

      var bgHsl = hexToHsl(currentStudioColors['background-0']);
      var isDark = bgHsl.l < 50;
      var palId = 'user-pal-' + Date.now();

      var bg0 = currentStudioColors['background-0'];
      var cards = currentStudioColors['cards'];
      var sb = currentStudioColors['sidebar'];
      var acc = currentStudioColors['accent'];
      var txt = currentStudioColors['text-0'];

      var bg1 = cards;
      var bg2 = isDark ? hslToHex(bgHsl.h, Math.min(bgHsl.s, 20), Math.min(bgHsl.l + 10, 40)) : hslToHex(bgHsl.h, Math.min(bgHsl.s, 20), Math.max(bgHsl.l - 8, 70));
      var borderCol = isDark ? hslToHex(bgHsl.h, Math.min(bgHsl.s, 15), Math.min(bgHsl.l + 16, 50)) : hslToHex(bgHsl.h, Math.min(bgHsl.s, 15), Math.max(bgHsl.l - 16, 55));
      var txtHsl = hexToHsl(txt);
      var txt1 = hslToHex(txtHsl.h, Math.min(txtHsl.s, 30), isDark ? Math.max(txtHsl.l - 15, 60) : Math.min(txtHsl.l + 20, 45));
      var txt2 = hslToHex(txtHsl.h, Math.min(txtHsl.s, 20), isDark ? Math.max(txtHsl.l - 30, 45) : Math.min(txtHsl.l + 35, 60));

      var fullColors = {
        'background-0': bg0,
        'background-1': bg1,
        'background-2': bg2,
        'borders': borderCol,
        'buttons': bg2,
        'links': acc,
        'sidebar': sb,
        'sidebar-text': isDark ? '#F7F2EA' : '#29221C',
        'text-0': txt,
        'text-1': txt1,
        'text-2': txt2,
        'cards': cards,
        'accent': acc,
        'accent-secondary': acc
      };

      var newPalette = {
        id: palId,
        name: palName,
        mode: isDark ? 'dark' : 'light',
        colors: fullColors,
        courseColors: {
          math: acc,
          stat: acc,
          fallback: [acc, '#457354', '#B85338', '#CFA33C', '#486A8C', '#9E77B0']
        }
      };

      savedUserPalettes.unshift(newPalette);
      persistSavedPalettes();
      registerSavedPalettesIntoPresets();
      selectPreset(palId);
      renderSavedPalettesShelf();

      if (paletteNameInput) paletteNameInput.value = '';
      savePaletteBtn.textContent = 'Saved ✓';
      setTimeout(function() {
        if (savePaletteBtn) savePaletteBtn.textContent = 'Save Palette';
      }, 1500);
    });
  }

  if (exportPalettesBtn) {
    exportPalettesBtn.addEventListener('click', function() {
      var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedUserPalettes, null, 2));
      var dlAnchor = document.createElement('a');
      dlAnchor.setAttribute('href', dataStr);
      dlAnchor.setAttribute('download', 'CanvasCustomizer_Palettes_Backup.json');
      dlAnchor.click();
    });
  }

  if (importPalettesBtn && importPalettesInput) {
    importPalettesBtn.addEventListener('click', function() {
      importPalettesInput.value = '';
      importPalettesInput.click();
    });

    importPalettesInput.addEventListener('change', function(e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;

      var reader = new FileReader();
      reader.onload = function(evt) {
        try {
          var parsed = JSON.parse(evt.target.result);
          if (!Array.isArray(parsed)) {
            alert('Invalid backup file. Expected an array of saved palettes.');
            return;
          }

          var validPalettes = [];
          for (var p = 0; p < parsed.length; p++) {
            var item = parsed[p];
            if (item && item.colors && item.name) {
              if (!item.id) item.id = 'user-pal-' + Date.now() + '-' + p;
              validPalettes.push(item);
            }
          }

          if (validPalettes.length === 0) {
            alert('No valid palettes found in this JSON file.');
            return;
          }

          // Combine with existing or replace up to max 10
          if (!savedUserPalettes) savedUserPalettes = [];
          for (var v = 0; v < validPalettes.length; v++) {
            var pal = validPalettes[v];
            var exists = false;
            for (var ex = 0; ex < savedUserPalettes.length; ex++) {
              if (savedUserPalettes[ex].name === pal.name) {
                savedUserPalettes[ex] = pal;
                exists = true;
                break;
              }
            }
            if (!exists) {
              if (savedUserPalettes.length >= 10) {
                savedUserPalettes.pop(); // keep within 10 limit
              }
              savedUserPalettes.unshift(pal);
            }
          }

          persistSavedPalettes();
          registerSavedPalettesIntoPresets();
          renderSavedPalettesShelf();
          importPalettesBtn.textContent = 'Imported ✓';
          setTimeout(function() {
            if (importPalettesBtn) importPalettesBtn.textContent = 'Import';
          }, 1500);
        } catch (err) {
          alert('Could not read JSON file: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
  }

  // ── Load State ─────────────────────────────────────────────
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get([
      'active_preset', 'card_radius', 'vibe_soft_night', 'course_nicknames',
      'course_images', 'discovered_courses', 'custom_theme_colors',
      'vibe_wallpaper_url', 'vibe_wallpaper_opacity', 'vibe_wallpaper_blur',
      'vibe_sidebar_bg_url', 'vibe_sidebar_bg_opacity', 'vibe_sidebar_bg_blur',
      'vibe_show_gpa', 'vibe_gpa_bg_color', 'saved_user_palettes'
    ], function(res) {
      if (res && res.saved_user_palettes && Array.isArray(res.saved_user_palettes)) {
        savedUserPalettes = res.saved_user_palettes;
        try { localStorage.setItem('vibe_saved_user_palettes_backup', JSON.stringify(savedUserPalettes)); } catch(e) {}
      } else {
        try {
          var bk = localStorage.getItem('vibe_saved_user_palettes_backup');
          if (bk) {
            savedUserPalettes = JSON.parse(bk);
          }
        } catch(e) {}
      }

      // Auto-migrate legacy AI-named duplicates and ensure the 5 diverse premades are populated
      var legacyIds = ['pal-sunny-beach', 'pal-olive-garden', 'pal-ocean-breeze', 'pal-olive-grove', 'pal-deep-pacific', 'pal-midnight-plum', 'pal-nordic-slate'];
      var hasLegacy = savedUserPalettes && savedUserPalettes.some(function(p) { return p && legacyIds.indexOf(p.id) !== -1; });
      if (hasLegacy || !Array.isArray(savedUserPalettes) || savedUserPalettes.length === 0) {
        var userCustomOnly = (savedUserPalettes || []).filter(function(p) {
          return p && !p.isPremade && legacyIds.indexOf(p.id) === -1 && !p.id.startsWith('pal-');
        });
        savedUserPalettes = DEFAULT_PREMADE_PALETTES.concat(userCustomOnly).slice(0, 10);
        persistSavedPalettes();
      }
      registerSavedPalettesIntoPresets();
      renderSavedPalettesShelf();
      syncStudioInputsWithColors();

      if (res && res.custom_theme_colors) {
        customThemeColors = res.custom_theme_colors;
      }
      if (res && res.active_preset && presets[res.active_preset]) activePresetId = res.active_preset;
      if(customThemeColors && customThemeColors[activePresetId]) { presets[activePresetId] = customThemeColors[activePresetId]; } applyPopupTheme(activePresetId);

      if (res && res.vibe_wallpaper_url) {
        currentWallpaperUrl = res.vibe_wallpaper_url;
        extractColorsFromWallpaper(res.vibe_wallpaper_url, function() {
          autoAdaptCustomDefaults();
          renderGroups();
        });
      } else {
        renderGroups();
      }

      if (res && res.card_radius !== undefined && res.card_radius !== null) {
        var r = parseInt(res.card_radius, 10);
        if (!isNaN(r)) { radiusSlider.value = r; radiusVal.textContent = r + 'px'; }
      }
      if (softNightToggle && res && res.vibe_soft_night) {
        softNightToggle.checked = true;
      }
      if (gpaToggle) {
        gpaToggle.checked = (res && res.vibe_show_gpa !== undefined) ? !!res.vibe_show_gpa : true;
        if (gpaColorRow) gpaColorRow.style.display = gpaToggle.checked ? 'flex' : 'none';
      }
      if (gpaColorInput) {
        var currP = presets[activePresetId] || presets['linen-day'];
        var defAccent = (currP && currP.colors && (currP.colors.accent || currP.colors.links)) || '#457354';
        gpaColorInput.value = (res && res.vibe_gpa_bg_color) ? res.vibe_gpa_bg_color : defAccent;
      }
      customNicknames = (res && res.course_nicknames) || {};
      courseImages = (res && res.course_images) || {};
      discoveredCourses = (res && res.discovered_courses) || [];

      updateWallpaperUI(
        res && res.vibe_wallpaper_url,
        res && res.vibe_wallpaper_opacity,
        res && res.vibe_wallpaper_blur
      );
      updateSidebarBgUI(
        res && res.vibe_sidebar_bg_url,
        res && res.vibe_sidebar_bg_opacity,
        res && res.vibe_sidebar_bg_blur
      );
    });
  } else {
    if(customThemeColors && customThemeColors[activePresetId]) { presets[activePresetId] = customThemeColors[activePresetId]; } applyPopupTheme(activePresetId);
    renderGroups();
  }

  if (radiusSlider && radiusVal) {
    radiusSlider.addEventListener('input', function() {
      var val = radiusSlider.value;
      radiusVal.textContent = val + 'px';
      sendLiveParam('card_radius', val);
      debouncedStorageSet('card_radius', val, 60);
    });
    radiusSlider.addEventListener('change', function() {
      var val = radiusSlider.value;
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ card_radius: val });
      }
    });
  }

  if (softNightToggle) {
    softNightToggle.addEventListener('change', function() {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ vibe_soft_night: softNightToggle.checked });
      }
    });
  }

  if (gpaToggle) {
    gpaToggle.addEventListener('change', function() {
      var isEnabled = gpaToggle.checked;
      if (gpaColorRow) gpaColorRow.style.display = isEnabled ? 'flex' : 'none';
      sendLiveParam('vibe_show_gpa', isEnabled);
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ vibe_show_gpa: isEnabled });
      }
    });
  }

  if (gpaColorInput) {
    gpaColorInput.addEventListener('input', function() {
      var col = gpaColorInput.value;
      sendLiveParam('vibe_gpa_bg_color', col);
      debouncedStorageSet('vibe_gpa_bg_color', col, 60);
    });
    gpaColorInput.addEventListener('change', function() {
      var col = gpaColorInput.value;
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ vibe_gpa_bg_color: col });
      }
    });
  }

  if (gpaColorResetBtn && gpaColorInput) {
    gpaColorResetBtn.addEventListener('click', function() {
      var currP = presets[activePresetId] || presets['linen-day'];
      var defAccent = (currP && currP.colors && (currP.colors.accent || currP.colors.links)) || '#457354';
      gpaColorInput.value = defAccent;
      sendLiveParam('vibe_gpa_bg_color', '');
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ vibe_gpa_bg_color: '' });
      }
    });
  }

  if (resetBtn) {
    var resetProgressFill = resetBtn.querySelector('.reset-progress-fill');
    var resetBtnText = resetBtn.querySelector('.reset-btn-text');
    var holdStartTime = 0;
    var holdDuration = 2500;
    var holdAnimFrame = null;
    var holdTriggered = false;

    function startHold(e) {
      if (e.type === 'mousedown' && e.button !== 0) return;
      holdTriggered = false;
      holdStartTime = Date.now();
      resetBtn.classList.add('is-holding');

      function updateHold() {
        var elapsed = Date.now() - holdStartTime;
        var progress = Math.min(1, elapsed / holdDuration);
        if (resetProgressFill) {
          resetProgressFill.style.width = (progress * 100) + '%';
        }
        if (resetBtnText) {
          if (progress > 0.08) {
            var pct = Math.round(progress * 100);
            resetBtnText.textContent = 'Hold to Reset (' + pct + '%)';
          } else {
            resetBtnText.textContent = 'Reset';
          }
        }

        if (progress >= 1) {
          holdTriggered = true;
          finishHold();
          executeFullReset();
        } else {
          holdAnimFrame = requestAnimationFrame(updateHold);
        }
      }

      holdAnimFrame = requestAnimationFrame(updateHold);
    }

    function cancelHold() {
      if (holdAnimFrame) {
        cancelAnimationFrame(holdAnimFrame);
        holdAnimFrame = null;
      }
      resetBtn.classList.remove('is-holding');
      if (resetProgressFill) {
        resetProgressFill.style.transition = 'width 0.2s ease-out';
        resetProgressFill.style.width = '0%';
        setTimeout(function() {
          if (resetProgressFill) resetProgressFill.style.transition = '';
        }, 220);
      }
      if (!holdTriggered && resetBtnText) {
        resetBtnText.textContent = 'Reset';
      }
    }

    function finishHold() {
      if (holdAnimFrame) {
        cancelAnimationFrame(holdAnimFrame);
        holdAnimFrame = null;
      }
      resetBtn.classList.remove('is-holding');
    }

    function executeFullReset() {
      selectPreset('linen-day');
      if (radiusSlider && radiusVal) {
        radiusSlider.value = 14;
        radiusVal.textContent = '14px';
      }
      if (softNightToggle) softNightToggle.checked = false;
      if (gpaToggle) {
        gpaToggle.checked = true;
        if (gpaColorRow) gpaColorRow.style.display = 'flex';
      }
      if (gpaColorInput) gpaColorInput.value = '#457354';
      customNicknames = {};
      courseImages = {};
      customThemeColors = null;
      openCustomDotIndex = null;
      updateWallpaperUI('', 25, 0);
      updateSidebarBgUI('', 15, 16);

      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({
          active_preset: 'linen-day',
          card_radius: 14,
          vibe_soft_night: false,
          vibe_show_gpa: true,
          vibe_gpa_bg_color: '',
          course_nicknames: {},
          course_images: {},
          custom_theme_colors: null,
          vibe_wallpaper_url: '',
          vibe_wallpaper_opacity: 25,
          vibe_wallpaper_blur: 0,
          vibe_sidebar_bg_url: '',
          vibe_sidebar_bg_opacity: 15,
          vibe_sidebar_bg_blur: 16,
          vibe_dismissed_tasks_v2: {},
          vibe_dismissed_graded_v1: {},
          vibe_dismissed_tasks: [],
          vibe_dismissed_todo: {},
          vibe_dismissed_graded: {},
          vibe_restore_signal: Date.now()
        }, function() {
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs && tabs[0] && tabs[0].id) {
              try {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'full_reset', type: 'FULL_RESET' }, function() {});
              } catch(e) {}
            }
          });
          if (resetBtnText) resetBtnText.textContent = 'Reset Complete ✓';
          if (resetProgressFill) {
            resetProgressFill.style.width = '100%';
            resetProgressFill.style.background = 'rgba(48, 209, 88, 0.4)';
          }
          setTimeout(function() {
            if (resetBtnText) resetBtnText.textContent = 'Reset';
            if (resetProgressFill) {
              resetProgressFill.style.width = '0%';
              resetProgressFill.style.background = '';
            }
          }, 2000);
        });
      }
    }

    function executeTaskRestore() {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({
          vibe_dismissed_tasks_v2: {},
          vibe_dismissed_graded_v1: {},
          vibe_completed_tasks_v1: {},
          vibe_dismissed_tasks: [],
          vibe_dismissed_todo: {},
          vibe_dismissed_graded: {},
          vibe_restore_signal: Date.now()
        }, function() {
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs && tabs[0] && tabs[0].id) {
              try {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'restore_tasks', type: 'RESTORE_TASKS' }, function() {});
              } catch(e) {}
            }
          });
          if (resetBtnText) resetBtnText.textContent = 'Tasks Restored ✓';
          setTimeout(function() {
            if (resetBtnText) resetBtnText.textContent = 'Reset';
          }, 1800);
        });
      }
    }

    resetBtn.addEventListener('mousedown', startHold);
    resetBtn.addEventListener('touchstart', startHold, { passive: true });

    resetBtn.addEventListener('mouseup', function() {
      if (!holdTriggered) {
        var elapsed = Date.now() - holdStartTime;
        cancelHold();
        if (elapsed < 350) {
          executeTaskRestore();
        }
      }
    });

    resetBtn.addEventListener('touchend', function() {
      if (!holdTriggered) {
        var elapsed = Date.now() - holdStartTime;
        cancelHold();
        if (elapsed < 350) {
          executeTaskRestore();
        }
      }
    });

    resetBtn.addEventListener('mouseleave', function() {
      if (!holdTriggered) {
        cancelHold();
      }
    });
  }
});
