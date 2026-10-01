(function() {
  'use strict';
  var DEFAULT_PRESET_ID = 'linen-day';

  function applyPresetTheme(preset) {
    if (!preset || !preset.colors) return;
    var c = preset.colors;
    var root = document.documentElement;
    var accentColor = c.accent || c.links;

    root.setAttribute('data-theme-mode', preset.mode || 'light');
    root.classList.toggle('vibe-theme-dark', preset.mode === 'dark');
    root.classList.toggle('vibe-theme-light', preset.mode === 'light');
    if (document.body) {
      document.body.classList.toggle('vibe-theme-dark', preset.mode === 'dark');
      document.body.classList.toggle('vibe-theme-light', preset.mode === 'light');
    }

    // CanvasCustomizer CSS variables
    root.style.setProperty('--bcbackground-0', c['background-0']);
    root.style.setProperty('--bcbackground-1', c['background-1']);
    root.style.setProperty('--bcbackground-2', c['background-2']);
    root.style.setProperty('--bcborders', c['borders']);
    root.style.setProperty('--bcbuttons', c['buttons']);
    root.style.setProperty('--bclinks', c['links']);
    root.style.setProperty('--bcsidebar', c['sidebar']);
    root.style.setProperty('--bc-sidebar', c['sidebar']);
    root.style.setProperty('--bcsidebar-text', c['sidebar-text']);
    root.style.setProperty('--bctext-0', c['text-0']);
    root.style.setProperty('--bctext-1', c['text-1']);
    root.style.setProperty('--bctext-2', c['text-2']);
    root.style.setProperty('--bccards', c['cards']);
    root.style.setProperty('--bcaccent', accentColor);

    // Canvas Native Theme Variables
    root.style.setProperty('--ic-brand-global-nav-bgd', c['sidebar']);
    root.style.setProperty('--ic-brand-global-nav-logo-bgd', c['sidebar']);
    root.style.setProperty('--ic-brand-global-nav-ic-icon-svg-fill', c['sidebar-text']);
    root.style.setProperty('--ic-brand-global-nav-ic-icon-svg-fill--active', accentColor);
    root.style.setProperty('--ic-brand-global-nav-menu-item__text-color', c['sidebar-text']);
    root.style.setProperty('--ic-brand-global-nav-menu-item__text-color--active', accentColor);
    root.style.setProperty('--ic-brand-global-nav-menu-item__badge-bgd', accentColor);
    root.style.setProperty('--ic-brand-global-nav-menu-item__badge-text', '#ffffff');
    root.style.setProperty('--ic-brand-header-image', 'none');

    var styleTag = document.getElementById('canvas-vibe-dynamic-styles');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'canvas-vibe-dynamic-styles';
      (document.head || document.documentElement).appendChild(styleTag);
    }

    var rules = '.ic-DashboardCard__header_content, .ic-DashboardCard__header-content { padding: 8px 14px 10px 14px !important; } .ic-DashboardCard__header-title, .ic-DashboardCard__header_content h2, .ic-DashboardCard__header_content h3, .ic-DashboardCard__header-content h2, .ic-DashboardCard__header-content h3, .ic-DashboardCard h2, .ic-DashboardCard h3 { margin: 0px 0px 4px 0px !important; margin-top: 0px !important; margin-bottom: 4px !important; padding-top: 0px !important; }\n';
    if (typeof CANVAS_STYLES !== 'undefined') {
      rules += (CANVAS_STYLES._base || '') + '\n';
      rules += (CANVAS_STYLES['background-0'] || '') + '\n';
      rules += (CANVAS_STYLES['background-1'] || '') + '\n';
      rules += (CANVAS_STYLES['background-2'] || '') + '\n';
      rules += (CANVAS_STYLES.borders || '') + '\n';
      rules += (CANVAS_STYLES.buttons || '') + '\n';
      rules += (CANVAS_STYLES.links || '') + '\n';
      rules += (CANVAS_STYLES.sidebar || '') + '\n';
      rules += (CANVAS_STYLES['sidebar-text'] || '') + '\n';
      rules += (CANVAS_STYLES['text-0'] || '') + '\n';
      rules += (CANVAS_STYLES['text-1'] || '') + '\n';
      rules += (CANVAS_STYLES['text-2'] || '') + '\n';
    }

    styleTag.textContent = rules;

    try {
      localStorage.setItem('vibe_cached_preset', preset.id);
    } catch (e) {}
  }

  // ── 0ms Instant Pre-Paint Theme Injection ──
  try {
    var cachedPresetId = localStorage.getItem('vibe_cached_preset') || DEFAULT_PRESET_ID;
    var cachedSoft = localStorage.getItem('vibe_cached_soft_night') === 'true';
    var cachedRadius = localStorage.getItem('vibe_cached_radius') || '12';

    if (cachedSoft) {
      document.documentElement.classList.add('vibe-soft-night');
    }
    if (cachedRadius) {
      document.documentElement.style.setProperty('--bc-card-radius', cachedRadius + 'px');
    }

    var catalog0 = (typeof PRESETS !== 'undefined') ? PRESETS : {};
    var p0 = catalog0[cachedPresetId] || catalog0[DEFAULT_PRESET_ID];
    if (p0) {
      applyPresetTheme(p0);
    }
  } catch (e) {}

  function isCanvasPage() {
    var host = (location.hostname || '').toLowerCase();
    var isCanvasHost = host === 'canvas.sfu.ca' || host.endsWith('.instructure.com') || host.endsWith('.canvaslms.com');
    var hasCanvasDOM = !!(
      document.getElementById('application') ||
      document.querySelector('.ic-app-header') ||
      document.querySelector('.ic-DashboardCard') ||
      document.getElementById('calendar-app') ||
      (document.body && (
        document.body.classList.contains('ic-app') ||
        document.body.classList.contains('with-right-side') ||
        document.body.classList.contains('with-left-side') ||
        document.body.classList.contains('primary-nav-expanded')
      ))
    );
    return isCanvasHost || (host.includes('canvas') && hasCanvasDOM);
  }

  function isExtensionContextValid() {
    try {
      return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
    } catch (e) {
      return false;
    }
  }

  function safeStorageGet(keys, callback) {
    if (!isExtensionContextValid() || !chrome.storage || !chrome.storage.local) {
      if (callback) callback({});
      return;
    }
    try {
      chrome.storage.local.get(keys, function(res) {
        if (!isExtensionContextValid() || (chrome.runtime && chrome.runtime.lastError) || !res) {
          if (callback) callback({});
          return;
        }
        if (callback) callback(res);
      });
    } catch (e) {
      if (callback) callback({});
    }
  }

  function safeStorageSet(data, callback) {
    if (!isExtensionContextValid() || !chrome.storage || !chrome.storage.local) {
      if (callback) callback();
      return;
    }
    try {
      chrome.storage.local.set(data, function() {
        if (callback) callback();
      });
    } catch (e) {
      if (callback) callback();
    }
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function hashString(str) {
    if (!str) return 0;
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function detectCourseSubject(text) {
    if (!text) return null;
    var t = text.toUpperCase();
    if (/\b(MATH|CALCULUS|CALC|ALGEBRA|GEOMETRY|LINEAR|TRIG|DISCRETE)\b|MATH\d+/i.test(t)) return 'math';
    if (/\b(STAT|STATS|STATISTICS|PROBABILITY|PROB|BIOSTAT)\b|STAT\d+/i.test(t)) return 'stat';
    if (/\b(DATA|CS|CMPT|CIS|INFO|PYTHON|CODING|SOFTWARE|PROGRAMMING|ALGORITHM|COMPUTING)\b|DATA\d+|CMPT\d+|CS\d+/i.test(t)) return 'data';
    if (/\b(HIST|HISTORY|HUMANITIES|PHIL|PHILOSOPHY|LIT|LITERATURE|POLI|POLITICS|SOCIOLOGY|ANTH|ETHICS)\b|HIST\d+/i.test(t)) return 'history';
    if (/\b(SOUND|MUSIC|AUDIO|SONIC|ART|DESIGN|THEATRE|DRAMA|FILM|MEDIA|CREATIVE)\b|CA\d+/i.test(t)) return 'music';
    return null;
  }

  function getCourseColor(presetId, subject, index, key) {
    var catalog = (typeof PRESETS !== 'undefined') ? PRESETS : {};
    var p = catalog[presetId] || catalog[DEFAULT_PRESET_ID];
    var cMap = (p && p.courseColors) ? p.courseColors : {};
    if (subject && cMap[subject]) {
      return cMap[subject];
    }
    var fallbacks = (cMap && cMap.fallback) ? cMap.fallback : ['#457354', '#B85338', '#CFA33C', '#A84542', '#486A8C', '#735381', '#387577', '#916342', '#526B59'];
    var idx = (key ? hashString(String(key)) : (index !== undefined ? index : 0)) % fallbacks.length;
    return fallbacks[idx];
  }

  function hexToRgba(hex, alpha) {
    if (!hex) return 'transparent';
    var cleanHex = hex.replace('#', '').trim();
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(function(c) { return c + c; }).join('');
    }
    var num = parseInt(cleanHex, 16);
    if (isNaN(num)) return hex;
    var r = (num >> 16) & 255;
    var g = (num >> 8) & 255;
    var b = num & 255;
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }

  function getUrgencyDetails(dateObj, item) {
    if (!item) item = {};
    if (item.type === 'announcement') {
      return {
        label: 'Notice',
        countdownShort: 'Notice',
        urgencyTier: 'notice',
        modifier: 'vibe-urgency-notice'
      };
    }
    var now = new Date();
    if (item.isOpenCard) {
      return {
        label: 'Opens Soon',
        countdownShort: 'Opens Soon',
        urgencyTier: 'locked',
        modifier: 'vibe-urgency-locked'
      };
    }
    if (item.unlockDateObj && item.unlockDateObj.getTime() > now.getTime()) {
      var mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var openStr = 'Opens ' + mNames[item.unlockDateObj.getMonth()] + ' ' + item.unlockDateObj.getDate();
      return {
        label: openStr,
        countdownShort: openStr,
        urgencyTier: 'locked',
        modifier: 'vibe-urgency-locked'
      };
    }

    if (!dateObj || isNaN(dateObj.getTime())) {
      var fallback = item.dateStr || 'Upcoming';
      return {
        label: fallback,
        countdownShort: fallback,
        urgencyTier: 'relaxed',
        modifier: 'vibe-urgency-relaxed'
      };
    }

    var hours = dateObj.getHours();
    var minutes = dateObj.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var minStr = minutes < 10 ? '0' + minutes : minutes;
    var timeStr = hours + ':' + minStr + ' ' + ampm;

    var diffMs = dateObj.getTime() - now.getTime();
    var diffMinutes = Math.round(diffMs / 60000);
    var diffHours = Math.round(diffMs / 3600000);

    var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var targetStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
    var dayDiff = Math.round((targetStart - todayStart) / 86400000);

    var shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var dayName = shortDays[dateObj.getDay()];
    var mName = monthNames[dateObj.getMonth()];

    // Overdue or due now (within -3 hours to 0)
    if (diffMinutes <= 0 && diffMinutes >= -180) {
      return {
        label: 'Due Now',
        countdownShort: 'Due Now',
        urgencyTier: 'critical',
        modifier: 'vibe-urgency-critical',
        timeStr: timeStr
      };
    }

    // Critical: < 1 hour
    if (diffMinutes > 0 && diffMinutes < 60) {
      return {
        label: 'Due in ' + diffMinutes + 'm',
        countdownShort: 'In ' + diffMinutes + 'm',
        urgencyTier: 'critical',
        modifier: 'vibe-urgency-critical',
        timeStr: timeStr
      };
    }

    // Imminent: 1 to 5 hours
    if (diffHours >= 1 && diffHours < 6) {
      return {
        label: 'In ' + diffHours + 'h · ' + timeStr,
        countdownShort: 'In ' + diffHours + 'h',
        urgencyTier: 'critical',
        modifier: 'vibe-urgency-critical',
        timeStr: timeStr
      };
    }

    // Due Today: same day
    if (dayDiff === 0) {
      return {
        label: 'Tonight · ' + timeStr,
        countdownShort: 'Tonight ' + timeStr,
        urgencyTier: 'high',
        modifier: 'vibe-urgency-high',
        timeStr: timeStr
      };
    }

    // Due Tomorrow
    if (dayDiff === 1) {
      return {
        label: 'Tomorrow · ' + timeStr,
        countdownShort: 'Tomorrow ' + timeStr,
        urgencyTier: 'soon',
        modifier: 'vibe-urgency-soon',
        timeStr: timeStr
      };
    }

    // Due in 2 to 6 days
    if (dayDiff >= 2 && dayDiff <= 6) {
      return {
        label: 'In ' + dayDiff + 'd · ' + dayName + ' ' + timeStr,
        countdownShort: 'In ' + dayDiff + 'd · ' + dayName,
        urgencyTier: 'approaching',
        modifier: 'vibe-urgency-approaching',
        timeStr: timeStr
      };
    }

    // Due in > 6 days
    return {
      label: 'In ' + dayDiff + 'd · ' + mName + ' ' + dateObj.getDate(),
      countdownShort: mName + ' ' + dateObj.getDate(),
      urgencyTier: 'relaxed',
      modifier: 'vibe-urgency-relaxed',
      timeStr: timeStr
    };
  }

  function applySidebarBackground(sidebarBgUrl, opacity, blur, canvasWallpaperUrl) {
    var header = document.querySelector('header#header, .ic-app-header');
    if (!header) return;

    var layer = document.getElementById('vibe-sidebar-bg-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'vibe-sidebar-bg-layer';
      var tintEl = document.createElement('div');
      tintEl.className = 'vibe-sidebar-bg-tint';
      var imgEl = document.createElement('div');
      imgEl.className = 'vibe-sidebar-bg-img';
      layer.appendChild(tintEl);
      layer.appendChild(imgEl);
      header.insertBefore(layer, header.firstChild);
    }

    var imgDiv = layer.querySelector('.vibe-sidebar-bg-img');
    var op = (opacity !== undefined && opacity !== null && !isNaN(parseInt(opacity, 10))) ? parseInt(opacity, 10) : 15;
    var bl = (blur !== undefined && blur !== null && !isNaN(parseInt(blur, 10))) ? parseInt(blur, 10) : 16;

    // Use custom sidebar background if provided; otherwise fallback to Canvas main wallpaper
    var targetUrl = (sidebarBgUrl && String(sidebarBgUrl).trim()) ? String(sidebarBgUrl).trim() : (canvasWallpaperUrl && String(canvasWallpaperUrl).trim() ? String(canvasWallpaperUrl).trim() : '');

    if (targetUrl) {
      var cleanUrl = targetUrl.replace(/"/g, '\\"');
      if (imgDiv) {
        imgDiv.style.setProperty('background-image', 'url("' + cleanUrl + '")', 'important');
        imgDiv.style.setProperty('opacity', (op / 100).toString(), 'important');
        imgDiv.style.setProperty('filter', 'blur(' + bl + 'px)', 'important');
        imgDiv.style.display = 'block';
      }
      try {
        localStorage.setItem('vibe_cached_sidebar_url', targetUrl);
        localStorage.setItem('vibe_cached_sidebar_op', op);
        localStorage.setItem('vibe_cached_sidebar_bl', bl);
      } catch (e) {}
    } else {
      if (imgDiv) {
        imgDiv.style.removeProperty('background-image');
        imgDiv.style.display = 'none';
      }
      try {
        localStorage.removeItem('vibe_cached_sidebar_url');
        localStorage.removeItem('vibe_cached_sidebar_op');
        localStorage.removeItem('vibe_cached_sidebar_bl');
      } catch (e) {}
    }
  }

  function applySidebarTheme(presetId, sidebarBgData) {
    var catalog = (typeof PRESETS !== 'undefined') ? PRESETS : {};
    var p = catalog[presetId] || catalog[DEFAULT_PRESET_ID];
    if (!p || !p.colors) return;
    var c = p.colors;
    var accent = c.accent || c.links || '#0A84FF';

    // Remove any obsolete logo images or camera buttons from logomark container
    var obsoleteBtns = document.querySelectorAll('.vibe-sidebar-photo-btn, .vibe-sidebar-logo-img');
    for (var ob = 0; ob < obsoleteBtns.length; ob++) {
      obsoleteBtns[ob].remove();
    }
    var logoConts = document.querySelectorAll('.ic-app-header__logomark-container, .ic-brand-global-nav__logo-container');
    for (var lc = 0; lc < logoConts.length; lc++) {
      logoConts[lc].classList.remove('has-custom-photo');
      var defSvg = logoConts[lc].querySelector('svg');
      if (defSvg) defSvg.style.display = '';
    }

    // 1. Top School / Institution Logomark Container - blend seamlessly with sidebar
    var logomarkContainers = document.querySelectorAll('.ic-app-header__logomark-container, .ic-brand-global-nav__logo-container');
    for (var i = 0; i < logomarkContainers.length; i++) {
      logomarkContainers[i].style.setProperty('background-color', 'transparent', 'important');
      logomarkContainers[i].style.setProperty('background', 'transparent', 'important');
      logomarkContainers[i].style.setProperty('border-bottom', '1px solid ' + (c.borders || 'rgba(255, 255, 255, 0.15)'), 'important');
    }

    var logomarks = document.querySelectorAll('.ic-app-header__logomark, a.ic-app-header__logomark, .ic-brand-global-nav__logo');
    for (var j = 0; j < logomarks.length; j++) {
      logomarks[j].style.setProperty('background-color', 'transparent', 'important');
    }

    if (sidebarBgData) {
      applySidebarBackground(sidebarBgData.url, sidebarBgData.opacity, sidebarBgData.blur, sidebarBgData.canvasWp);
    } else {
      safeStorageGet(['vibe_sidebar_bg_url', 'vibe_sidebar_bg_opacity', 'vibe_sidebar_bg_blur', 'vibe_wallpaper_url'], function(res) {
        applySidebarBackground(
          res && res.vibe_sidebar_bg_url,
          res && res.vibe_sidebar_bg_opacity,
          res && res.vibe_sidebar_bg_blur,
          res && res.vibe_wallpaper_url
        );
      });
    }

    // 2. Active Menu Item (Dashboard etc.)
    var activeLinks = document.querySelectorAll('.ic-app-header__menu-list-item--active .ic-app-header__menu-list-link, .ic-app-header__menu-list-item.ic-app-header__menu-list-item--active .ic-app-header__menu-list-link');
    for (var k = 0; k < activeLinks.length; k++) {
      activeLinks[k].style.setProperty('border-left', '3.5px solid ' + accent, 'important');
      activeLinks[k].style.setProperty('box-shadow', 'inset 3.5px 0 0 ' + accent, 'important');
      var activeText = activeLinks[k].querySelector('.menu-item__text');
      if (activeText) activeText.style.setProperty('color', accent, 'important');
      var activeSvg = activeLinks[k].querySelector('svg, .ic-icon-svg');
      if (activeSvg) activeSvg.style.setProperty('fill', accent, 'important');
    }

    // 3. User Avatar border
    var avatars = document.querySelectorAll('.ic-avatar, .ic-app-header__menu-list-link .ic-avatar');
    for (var m = 0; m < avatars.length; m++) {
      avatars[m].style.setProperty('border', '2px solid ' + accent, 'important');
    }
  }

  function enhanceCalendarEvents(presetId) {
    var events = document.querySelectorAll('.fc-event, a.fc-event');
    if (!events.length) return;

    var catalog = (typeof PRESETS !== 'undefined') ? PRESETS : {};
    var p = catalog[presetId] || catalog[DEFAULT_PRESET_ID];
    var isLight = p && p.mode === 'light';

    for (var i = 0; i < events.length; i++) {
      var ev = events[i];
      var evText = (ev.textContent || ev.title || '').trim();
      var subject = detectCourseSubject(evText);

      var courseColor = null;
      if (subject) {
        courseColor = getCourseColor(presetId, subject, i);
      } else {
        courseColor = ev.style.borderColor || getComputedStyle(ev).borderColor;
        if (!courseColor || courseColor === 'transparent' || courseColor === 'rgba(0, 0, 0, 0)') {
          courseColor = ev.style.backgroundColor || getComputedStyle(ev).backgroundColor;
        }
      }

      if (courseColor && courseColor !== 'transparent' && courseColor !== 'rgba(0, 0, 0, 0)') {
        // 1. Subtle 4.5px left accent stripe
        ev.style.setProperty('border-left-width', '4.5px', 'important');
        ev.style.setProperty('border-left-style', 'solid', 'important');
        ev.style.setProperty('border-left-color', courseColor, 'important');
        ev.style.setProperty('border-top-width', '1px', 'important');
        ev.style.setProperty('border-right-width', '1px', 'important');
        ev.style.setProperty('border-bottom-width', '1px', 'important');
        ev.style.setProperty('border-top-color', courseColor, 'important');
        ev.style.setProperty('border-right-color', courseColor, 'important');
        ev.style.setProperty('border-bottom-color', courseColor, 'important');
        ev.style.setProperty('border-radius', '6px', 'important');

        // 2. Soft background tint based on theme mode
        var alpha = isLight ? '0.14' : '0.22';
        var tint = 'var(--bcbackground-1)';
        var rgbMatch = courseColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
          tint = 'rgba(' + rgbMatch[1] + ', ' + rgbMatch[2] + ', ' + rgbMatch[3] + ', ' + alpha + ')';
        } else if (courseColor.indexOf('#') === 0) {
          var hex = courseColor.slice(1);
          if (hex.length === 3) hex = hex.split('').map(function(x) { return x + x; }).join('');
          if (hex.length === 6) {
            var r = parseInt(hex.slice(0, 2), 16);
            var g = parseInt(hex.slice(2, 4), 16);
            var b = parseInt(hex.slice(4, 6), 16);
            tint = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
          }
        }
        ev.style.setProperty('background-color', tint, 'important');
        ev.style.setProperty('background', tint, 'important');
        ev.style.setProperty('color', 'var(--bctext-0)', 'important');

        // 3. Ensure high-contrast readable text
        var titleEl = ev.querySelector('.fc-title');
        if (titleEl) {
          titleEl.style.setProperty('color', 'var(--bctext-0)', 'important');
          titleEl.style.setProperty('font-weight', '600', 'important');
        }
        var timeEl = ev.querySelector('.fc-time');
        if (timeEl) {
          timeEl.style.setProperty('color', 'var(--bctext-0)', 'important');
          timeEl.style.setProperty('font-weight', '700', 'important');
          timeEl.style.setProperty('font-variant-numeric', 'tabular-nums', 'important');
        }

        // 4. Course Dot Chip indicator
        var contentEl = ev.querySelector('.fc-content') || ev;
        if (contentEl && !contentEl.querySelector('.vibe-course-dot')) {
          var dot = document.createElement('span');
          dot.className = 'vibe-course-dot';
          dot.style.cssText = 'display:inline-block; width:6px; height:6px; min-width:6px; border-radius:50%; background-color:' + courseColor + '; margin-right:4px; vertical-align:middle; box-shadow:0 0 0 1px rgba(0,0,0,0.15); flex-shrink:0;';
          contentEl.insertBefore(dot, contentEl.firstChild);
        }

        // 5. Tint icon if present
        var icon = ev.querySelector('i, svg');
        if (icon) {
          icon.style.setProperty('color', courseColor, 'important');
          icon.style.setProperty('fill', courseColor, 'important');
        }
      }
    }
  }

  function getCardCourseKey(card, text) {
    if (!card) return null;
    var link = card.querySelector('a.ic-DashboardCard__link') || card.querySelector('a[href*="/courses/"]');
    if (link && link.href) {
      var m = link.href.match(/\/courses\/(\d+)/);
      if (m && m[1]) return 'c_' + m[1];
    }
    var idAttr = card.getAttribute('data-course-id');
    if (idAttr) return 'c_' + idAttr;
    var code = (text || '').match(/\b([A-Z]{2,5}\s*\d{3}[A-Z]?)\b/i);
    if (code) return 'code_' + code[1].replace(/\s+/g, '').toUpperCase();
    return 'title_' + (text || '').substring(0, 24).trim().replace(/\s+/g, '_');
  }

  function discoverAndSaveCourses(cards, nicknames) {
    if (!cards || !cards.length) return;
    var list = [];
    var seen = {};

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var link = card.querySelector('a.ic-DashboardCard__link, a[href*="/courses/"]');
      var cid = null;
      if (link) {
        var m = (link.getAttribute('href') || '').match(/\/courses\/(\d+)/);
        if (m) cid = m[1];
      }
      var text = (
        (card.getAttribute('aria-label') || '') + ' ' +
        (card.querySelector('.ic-DashboardCard__header-title') ? card.querySelector('.ic-DashboardCard__header-title').textContent : '') + ' ' +
        (card.querySelector('.ic-DashboardCard__header-subtitle') ? card.querySelector('.ic-DashboardCard__header-subtitle').textContent : '')
      ).trim();

      var codeMatch = text.match(/\b([A-Z]{2,6}\s*\d{2,4}[A-Z]?)\b/i);
      var codeClean = codeMatch ? codeMatch[1].replace(/\s+/g, '').toUpperCase() : (cid ? 'COURSE_' + cid : 'COURSE_' + i);
      var codeDisplay = codeMatch ? codeMatch[1].toUpperCase() : codeClean;

      if (!seen[codeClean]) {
        seen[codeClean] = true;
        var existingNick = (nicknames && (nicknames['code_' + codeClean] || (cid && nicknames['c_' + cid]))) || '';
        list.push({
          id: cid,
          code: codeClean,
          label: codeDisplay,
          defaultNick: existingNick || codeDisplay
        });
      }
    }

    if (list.length > 0) {
      safeStorageSet({ discovered_courses: list });
    }
  }

  function openPhotoCropperModal(options) {
    var existing = document.getElementById('vibe-photo-modal-overlay');
    if (existing) existing.remove();

    var title = options.title || 'Customize Course Photo';
    var initialUrl = options.initialUrl || '';
    var initialScale = options.initialScale || 100;
    var initialPosX = options.initialPosX !== undefined ? options.initialPosX : 50;
    var initialPosY = options.initialPosY !== undefined ? options.initialPosY : 50;
    var onSave = options.onSave;
    var onRemove = options.onRemove;
    var badgeLabel = options.badgeLabel || 'Course Preview';
    var heroColor = options.heroColor || '#0A84FF';

    var currentUrl = initialUrl;
    var currentScale = initialScale;
    var currentPosX = initialPosX;
    var currentPosY = initialPosY;

    var overlay = document.createElement('div');
    overlay.id = 'vibe-photo-modal-overlay';

    function closeModal() {
      if (typeof onMouseUp === 'function') onMouseUp();
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    var dialog = document.createElement('div');
    dialog.className = 'vibe-photo-modal-dialog';

    // Header
    var header = document.createElement('div');
    header.className = 'vibe-modal-header';
    var titleEl = document.createElement('div');
    titleEl.className = 'vibe-modal-title';
    titleEl.textContent = title;
    var closeBtn = document.createElement('button');
    closeBtn.className = 'vibe-modal-close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = closeModal;
    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    dialog.appendChild(header);

    // Live Preview Box
    var previewBox = document.createElement('div');
    previewBox.className = 'vibe-crop-preview-container';

    var previewImg = document.createElement('img');
    previewImg.className = 'vibe-crop-preview-img';
    previewImg.src = currentUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop';
    previewImg.style.display = currentUrl ? 'block' : 'none';

    var emptyPlaceholder = document.createElement('div');
    emptyPlaceholder.style.cssText = 'color:var(--bctext-2,#888);font-size:12px;font-weight:600;display:' + (currentUrl ? 'none' : 'block');
    emptyPlaceholder.textContent = 'Upload a photo or paste a URL below to preview';

    var badgeOverlay = document.createElement('div');
    badgeOverlay.className = 'vibe-crop-badge-overlay';
    badgeOverlay.textContent = badgeLabel;

    previewBox.appendChild(emptyPlaceholder);
    previewBox.appendChild(previewImg);
    previewBox.appendChild(badgeOverlay);
    dialog.appendChild(previewBox);

    function updatePreviewTransform() {
      if (!currentUrl) {
        previewImg.style.display = 'none';
        emptyPlaceholder.style.display = 'block';
        return;
      }
      previewImg.style.display = 'block';
      emptyPlaceholder.style.display = 'none';
      previewImg.src = currentUrl;
      previewImg.style.objectPosition = currentPosX + '% ' + currentPosY + '%';
      previewImg.style.transform = 'scale(' + (currentScale / 100) + ')';
    }

    // Drag to pan (dynamically bound to avoid global listener leaks)
    var isDragging = false;
    var startX = 0, startY = 0;
    var startPosX = 50, startPosY = 50;

    function onMouseMove(e) {
      if (!isDragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      currentPosX = Math.max(0, Math.min(100, Math.round(startPosX - (dx / 2))));
      currentPosY = Math.max(0, Math.min(100, Math.round(startPosY - (dy / 2))));
      if (posXSlider) posXSlider.value = currentPosX;
      if (posYSlider) posYSlider.value = currentPosY;
      updatePreviewTransform();
    }

    function onMouseUp() {
      isDragging = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    previewBox.addEventListener('mousedown', function(e) {
      if (!currentUrl) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startPosX = currentPosX;
      startPosY = currentPosY;
      e.preventDefault();
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    // URL & File row
    var sourceRow = document.createElement('div');
    sourceRow.style.cssText = 'display:flex;gap:8px;align-items:center;';

    var urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Paste image URL...';
    urlInput.value = (currentUrl && !currentUrl.startsWith('data:')) ? currentUrl : '';
    urlInput.style.cssText = 'flex:1;padding:7px 10px;border-radius:8px;border:1px solid var(--bcborders,rgba(255,255,255,0.2));background:var(--bcbackground-0,#1C1A17);color:var(--bctext-0,#FFF);font-size:12px;outline:none;';
    urlInput.addEventListener('input', function() {
      var val = urlInput.value.trim();
      if (val) {
        currentUrl = val;
        updatePreviewTransform();
      }
    });

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', function(e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function(evt) {
        currentUrl = evt.target.result;
        urlInput.value = '';
        updatePreviewTransform();
      };
      r.readAsDataURL(f);
    });

    var uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.className = 'vibe-modal-btn secondary';
    uploadBtn.textContent = 'Upload File';
    uploadBtn.onclick = function() { fileInput.click(); };

    sourceRow.appendChild(urlInput);
    sourceRow.appendChild(uploadBtn);
    sourceRow.appendChild(fileInput);
    dialog.appendChild(sourceRow);

    // Zoom & Pan controls
    var controls = document.createElement('div');
    controls.className = 'vibe-crop-controls';

    // Scale
    var scaleRow = document.createElement('div');
    scaleRow.className = 'vibe-crop-row';
    var scaleLabel = document.createElement('span');
    scaleLabel.className = 'vibe-crop-label';
    scaleLabel.textContent = 'Zoom';
    var scaleSlider = document.createElement('input');
    scaleSlider.type = 'range';
    scaleSlider.min = '100';
    scaleSlider.max = '250';
    scaleSlider.value = currentScale;
    scaleSlider.className = 'vibe-crop-slider';
    scaleSlider.addEventListener('input', function() {
      currentScale = parseInt(scaleSlider.value, 10);
      updatePreviewTransform();
    });
    scaleRow.appendChild(scaleLabel);
    scaleRow.appendChild(scaleSlider);
    controls.appendChild(scaleRow);

    // Position X
    var posXRow = document.createElement('div');
    posXRow.className = 'vibe-crop-row';
    var posXLabel = document.createElement('span');
    posXLabel.className = 'vibe-crop-label';
    posXLabel.textContent = 'Position X';
    var posXSlider = document.createElement('input');
    posXSlider.type = 'range';
    posXSlider.min = '0';
    posXSlider.max = '100';
    posXSlider.value = currentPosX;
    posXSlider.className = 'vibe-crop-slider';
    posXSlider.addEventListener('input', function() {
      currentPosX = parseInt(posXSlider.value, 10);
      updatePreviewTransform();
    });
    posXRow.appendChild(posXLabel);
    posXRow.appendChild(posXSlider);
    controls.appendChild(posXRow);

    // Position Y
    var posYRow = document.createElement('div');
    posYRow.className = 'vibe-crop-row';
    var posYLabel = document.createElement('span');
    posYLabel.className = 'vibe-crop-label';
    posYLabel.textContent = 'Position Y';
    var posYSlider = document.createElement('input');
    posYSlider.type = 'range';
    posYSlider.min = '0';
    posYSlider.max = '100';
    posYSlider.value = currentPosY;
    posYSlider.className = 'vibe-crop-slider';
    posYSlider.addEventListener('input', function() {
      currentPosY = parseInt(posYSlider.value, 10);
      updatePreviewTransform();
    });
    posYRow.appendChild(posYLabel);
    posYRow.appendChild(posYSlider);
    controls.appendChild(posYRow);

    dialog.appendChild(controls);

    // Actions footer
    var actions = document.createElement('div');
    actions.className = 'vibe-crop-actions';

    var leftActions = document.createElement('div');
    if (initialUrl && onRemove) {
      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'vibe-modal-btn danger';
      removeBtn.textContent = 'Remove Photo';
      removeBtn.onclick = function() {
        onRemove();
        closeModal();
      };
      leftActions.appendChild(removeBtn);
    }
    actions.appendChild(leftActions);

    var rightActions = document.createElement('div');
    rightActions.style.cssText = 'display:flex;gap:8px;';

    var cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'vibe-modal-btn secondary';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = closeModal;

    var saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'vibe-modal-btn primary';
    saveBtn.textContent = 'Save & Apply';
    saveBtn.onclick = function() {
      if (!currentUrl) {
        alert('Please choose or enter an image first.');
        return;
      }
      if (onSave) {
        onSave({
          url: currentUrl,
          scale: currentScale,
          posX: currentPosX,
          posY: currentPosY
        });
      }
      closeModal();
    };

    rightActions.appendChild(cancelBtn);
    rightActions.appendChild(saveBtn);
    actions.appendChild(rightActions);
    dialog.appendChild(actions);

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    updatePreviewTransform();
  }

  function applyCardHeroColors(presetId) {
    var cards = document.querySelectorAll('.ic-DashboardCard, [data-testid="draggable-card"]');
    if (!cards.length) return;

    safeStorageGet(['course_nicknames', 'course_images'], function(res) {
      var nicknames = (res && res.course_nicknames) || {};
      var courseImages = (res && res.course_images) || {};
      discoverAndSaveCourses(cards, nicknames);
      renderDashboardCards(cards, presetId, nicknames, courseImages);
      renderGpaSchoolCard(presetId);
    });
  }

  function renderDashboardCards(cards, presetId, nicknames, courseImages) {
    courseImages = courseImages || {};
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var text = (
        (card.getAttribute('aria-label') || '') + ' ' +
        (card.querySelector('.ic-DashboardCard__header-title') ? card.querySelector('.ic-DashboardCard__header-title').textContent : '') + ' ' +
        (card.querySelector('.ic-DashboardCard__header-subtitle') ? card.querySelector('.ic-DashboardCard__header-subtitle').textContent : '')
      ).trim();

      var subject = detectCourseSubject(text);
      var courseKey = getCardCourseKey(card, text);
      var heroColor = getCourseColor(presetId, subject, i, courseKey);

      card.setAttribute('data-vibe-subject', subject || ('general-' + i));
      card.setAttribute('data-vibe-color', heroColor);
      card.style.setProperty('--card-course-color', heroColor);

      var contentBox = card.querySelector('.ic-DashboardCard__header_content');
      if (contentBox) {
        contentBox.style.setProperty('color', 'var(--bctext-0)', 'important');
      }

      var actionContainer = card.querySelector('.ic-DashboardCard__action-container');

      // Check if custom photo exists for this course
      var link = card.querySelector('a.ic-DashboardCard__link, a[href*="/courses/"]');
      var cid = null;
      if (link) {
        var m = (link.getAttribute('href') || '').match(/\/courses\/(\d+)/);
        if (m) cid = m[1];
      }
      var codeM = text.match(/\b([A-Z]{2,6}\s*\d{2,4}[A-Z]?)\b/i);
      var codeClean = codeM ? codeM[1].replace(/\s+/g, '').toUpperCase() : null;
      var customPhoto = (courseKey && courseImages[courseKey]) ||
                        (codeClean && courseImages['code_' + codeClean]) ||
                        (cid && courseImages['c_' + cid]) || null;

      var photoUrl = null;
      var photoScale = 100;
      var photoPosX = 50;
      var photoPosY = 50;

      if (customPhoto) {
        if (typeof customPhoto === 'object' && customPhoto !== null) {
          photoUrl = customPhoto.url;
          photoScale = customPhoto.scale || 100;
          photoPosX = customPhoto.posX !== undefined ? customPhoto.posX : 50;
          photoPosY = customPhoto.posY !== undefined ? customPhoto.posY : 50;
        } else if (typeof customPhoto === 'string') {
          photoUrl = customPhoto;
        }
      }

      var hero = card.querySelector('.ic-DashboardCard__header_hero') || card.querySelector('.ic-DashboardCard__header_image') || card.querySelector('.ic-DashboardCard__header');
      if (hero) {
        hero.style.setProperty('opacity', '1', 'important');
        hero.style.setProperty('min-height', '130px', 'important');
        hero.style.setProperty('display', 'block', 'important');
        hero.style.setProperty('position', 'relative', 'important');

        if (photoUrl) {
          hero.classList.add('vibe-has-custom-photo');
          hero.style.setProperty('background-image', "url('" + photoUrl + "')", 'important');
          hero.style.setProperty('background-color', 'transparent', 'important');
          hero.style.setProperty('border', 'none', 'important');
          hero.style.setProperty('outline', 'none', 'important');
          hero.style.setProperty('box-shadow', 'none', 'important');
          hero.style.setProperty('background-size', photoScale === 100 ? 'cover' : (photoScale + '% auto'), 'important');
          hero.style.setProperty('background-position', photoPosX + '% ' + photoPosY + '%', 'important');
          hero.style.setProperty('border-bottom', '3.5px solid ' + heroColor, 'important');
        } else {
          hero.classList.remove('vibe-has-custom-photo');
          hero.style.removeProperty('background-image');
          hero.style.removeProperty('outline');
          hero.style.removeProperty('box-shadow');
          hero.style.setProperty('background-color', heroColor, 'important');
          hero.style.removeProperty('border-bottom');
        }

        // Camera / custom photo button on card banner
        var photoBtn = hero.querySelector('.vibe-card-photo-btn');
        if (!photoBtn) {
          photoBtn = document.createElement('button');
          photoBtn.className = 'vibe-card-photo-btn';
          photoBtn.type = 'button';
          photoBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';
          hero.appendChild(photoBtn);
        }
        photoBtn.title = photoUrl ? 'Crop, scale or change course photo' : 'Add custom photo to course card';

        (function(cKey, currentPhotoData, pId, cIdStr, cardName, cColor) {
          photoBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();

            var initUrl = '';
            var initScale = 100;
            var initX = 50;
            var initY = 50;
            if (currentPhotoData) {
              if (typeof currentPhotoData === 'object') {
                initUrl = currentPhotoData.url || '';
                initScale = currentPhotoData.scale || 100;
                initX = currentPhotoData.posX !== undefined ? currentPhotoData.posX : 50;
                initY = currentPhotoData.posY !== undefined ? currentPhotoData.posY : 50;
              } else if (typeof currentPhotoData === 'string') {
                initUrl = currentPhotoData;
              }
            }

            openPhotoCropperModal({
              title: 'Customize Photo: ' + (cardName || 'Course'),
              badgeLabel: cardName || 'Course Preview',
              heroColor: cColor,
              initialUrl: initUrl,
              initialScale: initScale,
              initialPosX: initX,
              initialPosY: initY,
              onSave: function(croppedData) {
                safeStorageGet(['course_images'], function(res) {
                  var imgs = Object.assign({}, res && res.course_images);
                  imgs[cKey] = croppedData;
                  if (cIdStr) imgs['c_' + cIdStr] = croppedData;
                  safeStorageSet({ course_images: imgs }, function() {
                    applyCardHeroColors(pId);
                  });
                });
              },
              onRemove: function() {
                safeStorageGet(['course_images'], function(res) {
                  var imgs = Object.assign({}, res && res.course_images);
                  if (cKey) delete imgs[cKey];
                  if (cIdStr) delete imgs['c_' + cIdStr];
                  safeStorageSet({ course_images: imgs }, function() {
                    applyCardHeroColors(pId);
                  });
                });
              }
            });
          };
        })(courseKey || ('code_' + codeClean), customPhoto, presetId, cid, (codeClean || 'Course'), heroColor);
      }

      var badge = card.querySelector('.vibe-food-badge');
      if (badge) badge.remove();
      var buttonBg = card.querySelector('.ic-DashboardCard__header-button-bg');
      if (buttonBg) {
        buttonBg.style.setProperty('background-color', 'rgba(0, 0, 0, 0.2)', 'important');
      }

      // Course action badges match course color
      var badges = card.querySelectorAll('.ic-DashboardCard__action-badge');
      for (var b = 0; b < badges.length; b++) {
        var actionBadge = badges[b];
        actionBadge.style.setProperty('background-color', heroColor, 'important');
        actionBadge.style.setProperty('color', '#ffffff', 'important');
        var parentAction = actionBadge.closest('.ic-DashboardCard__action');
        if (parentAction) {
          var actionSvg = parentAction.querySelector('svg');
          if (actionSvg) {
            actionSvg.style.setProperty('fill', heroColor, 'important');
          }
        }
      }

      // Course Nickname Handling
      var courseKey = getCardCourseKey(card, text);
      var titleEl = card.querySelector('.ic-DashboardCard__header-title');
      if (titleEl) {
        titleEl.style.setProperty('color', 'var(--bctext-0)', 'important');
        titleEl.style.setProperty('margin', '0px 0px 4px 0px', 'important');
        titleEl.style.setProperty('margin-top', '0px', 'important');
        titleEl.style.setProperty('margin-bottom', '4px', 'important');
        titleEl.style.setProperty('padding-top', '0px', 'important');
      }
      if (contentBox) {
        contentBox.style.setProperty('padding-top', '8px', 'important');
      }
      var subEl = card.querySelector('.ic-DashboardCard__header-subtitle');
      if (subEl) {
        subEl.style.setProperty('color', 'var(--bctext-1)', 'important');
      }
      var termEl = card.querySelector('.ic-DashboardCard__header-term');
      if (termEl) {
        termEl.style.setProperty('color', 'var(--bctext-2)', 'important');
      }
      if (titleEl && courseKey) {
        if (!card.hasAttribute('data-vibe-orig-title')) {
          card.setAttribute('data-vibe-orig-title', titleEl.textContent.trim());
        }
        var origTitle = card.getAttribute('data-vibe-orig-title');
        var customNick = nicknames[courseKey];

        var displaySpan = titleEl.querySelector('.vibe-title-text');
        if (!displaySpan) {
          displaySpan = document.createElement('span');
          displaySpan.className = 'vibe-title-text';
          displaySpan.textContent = customNick || origTitle;
          titleEl.innerHTML = '';
          titleEl.appendChild(displaySpan);
        } else {
          displaySpan.textContent = customNick || origTitle;
        }

        if (!titleEl.querySelector('.vibe-edit-nick-btn')) {
          var editBtn = document.createElement('button');
          editBtn.className = 'vibe-edit-nick-btn';
          editBtn.type = 'button';
          editBtn.title = 'Set custom course nickname';
          editBtn.setAttribute('aria-label', 'Edit nickname for ' + (customNick || origTitle));
          editBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>';

          (function(k, o, c, crd) {
            editBtn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              var val = prompt('Set a custom nickname for this course (leave blank to reset):', c || o);
              if (val !== null) {
                var trimmed = val.trim();
                safeStorageGet(['course_nicknames'], function(store) {
                  var nMap = Object.assign({}, store && store.course_nicknames);
                  var cIdM = k ? k.match(/^c_(\d+)/) : null;
                  var cId = cIdM ? cIdM[1] : null;
                  var codeM = ((crd ? crd.getAttribute('aria-label') : '') + ' ' + o).match(/\b([A-Z]{2,5}\s*\d{3}[A-Z]?)\b/i);
                  var codeKey = codeM ? 'code_' + codeM[1].replace(/\s+/g, '').toUpperCase() : null;

                  if (trimmed && trimmed !== o) {
                    nMap[k] = trimmed;
                    if (cId) {
                      nMap['c_' + cId] = trimmed;
                      nMap['id_' + cId] = trimmed;
                    }
                    if (codeKey) nMap[codeKey] = trimmed;
                  } else {
                    delete nMap[k];
                    if (cId) {
                      delete nMap['c_' + cId];
                      delete nMap['id_' + cId];
                    }
                    if (codeKey) delete nMap[codeKey];
                  }
                  safeStorageSet({ course_nicknames: nMap }, function() {
                    applyCardHeroColors(presetId);
                    initTodoReformatter(presetId);
                  });
                });
              }
            });
          })(courseKey, origTitle, customNick, card);

          titleEl.appendChild(editBtn);
        }
      }
    }

    renderUrgentCourseBadges(cards, cachedPlannerItems || []);
  }

  // ── GPA School Card ─────────────────────────────────────────────────────
  var cachedCourseScores = null;
  var lastScoresFetchTime = 0;
  var gpaCardGuardObserver = null;

  var GPA_SCALES = {
    standard4: {
      label: 'Standard 4.0 Scale',
      breaks: [
        { min: 93, gpa: 4.0, letter: 'A' },
        { min: 90, gpa: 3.7, letter: 'A-' },
        { min: 87, gpa: 3.3, letter: 'B+' },
        { min: 83, gpa: 3.0, letter: 'B' },
        { min: 80, gpa: 2.7, letter: 'B-' },
        { min: 77, gpa: 2.3, letter: 'C+' },
        { min: 73, gpa: 2.0, letter: 'C' },
        { min: 70, gpa: 1.7, letter: 'C-' },
        { min: 67, gpa: 1.3, letter: 'D+' },
        { min: 63, gpa: 1.0, letter: 'D' },
        { min: 60, gpa: 0.7, letter: 'D-' },
        { min: 0,  gpa: 0.0, letter: 'F' }
      ]
    },
    scale433: {
      label: '4.33 Scale',
      breaks: [
        { min: 90, gpa: 4.33, letter: 'A+' },
        { min: 85, gpa: 4.0,  letter: 'A' },
        { min: 80, gpa: 3.67, letter: 'A-' },
        { min: 77, gpa: 3.33, letter: 'B+' },
        { min: 73, gpa: 3.0,  letter: 'B' },
        { min: 70, gpa: 2.67, letter: 'B-' },
        { min: 65, gpa: 2.33, letter: 'C+' },
        { min: 60, gpa: 2.0,  letter: 'C' },
        { min: 55, gpa: 1.67, letter: 'C-' },
        { min: 50, gpa: 1.0,  letter: 'D' },
        { min: 0,  gpa: 0.0,  letter: 'F' }
      ]
    }
  };

  function getActiveGpaScale(scaleKey, customScaleData) {
    if (scaleKey === 'custom' && Array.isArray(customScaleData) && customScaleData.length > 0) {
      return {
        label: 'Custom Scale',
        breaks: customScaleData.slice().sort(function(a, b) { return b.min - a.min; })
      };
    }
    return GPA_SCALES[scaleKey] || GPA_SCALES.standard4;
  }

  function pctToGpa(pct, scaleKey, customScaleData) {
    var scale = getActiveGpaScale(scaleKey, customScaleData);
    for (var i = 0; i < scale.breaks.length; i++) {
      var b = scale.breaks[i];
      if (pct >= b.min) {
        return { gpa: b.gpa, letter: b.letter || '' };
      }
    }
    return { gpa: 0, letter: 'F' };
  }

  function fetchCourseGrades(callback) {
    var now = Date.now();
    if (cachedCourseScores && (now - lastScoresFetchTime) < 120000) {
      callback(cachedCourseScores);
      return;
    }
    var url = '/api/v1/courses?include[]=total_scores&enrollment_state=active&per_page=50';
    fetch(url, { credentials: 'same-origin' })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!Array.isArray(data)) { callback([]); return; }
        var results = [];
        for (var i = 0; i < data.length; i++) {
          var c = data[i];
          var score = null;
          if (c.enrollments && c.enrollments.length) {
            for (var j = 0; j < c.enrollments.length; j++) {
              var e = c.enrollments[j];
              if (e.type === 'student' || e.enrollment_state === 'active') {
                score = (e.computed_current_score !== undefined && e.computed_current_score !== null)
                  ? e.computed_current_score
                  : (e.computed_final_score !== undefined ? e.computed_final_score : null);
                if (score !== null) break;
              }
            }
          }
          results.push({ id: String(c.id), name: c.name || 'Course', code: c.course_code || '', score: score });
        }
        cachedCourseScores = results;
        lastScoresFetchTime = Date.now();
        callback(results);
      })
      .catch(function() { callback(cachedCourseScores || []); });
  }

  function calculateGPA(courses, scaleKey, pastGpa, pastCredits, customScaleData) {
    var total = 0, count = 0;
    var breakdown = [];
    for (var i = 0; i < courses.length; i++) {
      var c = courses[i];
      if (c.score === null || c.score === undefined || c.score === 0) continue;
      var info = pctToGpa(c.score, scaleKey, customScaleData);
      total += info.gpa;
      count++;
      breakdown.push({ name: c.name, code: c.code, score: c.score, gpa: info.gpa, letter: info.letter, id: c.id });
    }
    var semGpa = count > 0 ? (total / count) : null;
    var cumGpa = semGpa;
    if (pastGpa !== null && pastGpa !== undefined && pastCredits > 0 && count > 0) {
      cumGpa = ((pastGpa * pastCredits) + total) / (pastCredits + count);
    }
    return { semGpa: semGpa, cumGpa: cumGpa, breakdown: breakdown, count: count };
  }

  function attachGpaCardGuard(card, container) {
    if (gpaCardGuardObserver) gpaCardGuardObserver.disconnect();
    gpaCardGuardObserver = new MutationObserver(function() {
      if (!container.contains(card)) {
        try { container.appendChild(card); } catch(e) {}
      } else if (container.lastElementChild !== card) {
        try { container.appendChild(card); } catch(e) {}
      }
    });
    gpaCardGuardObserver.observe(container, { childList: true });
  }

  function renderGpaSchoolCard(presetId) {
    if (!window.location.pathname.match(/^\/?($|dashboard|courses\/?$)/i) &&
        window.location.pathname !== '/') return;

    var container = document.querySelector('.ic-DashboardCard__box__container');
    if (!container) return;

    safeStorageGet(['vibe_show_gpa', 'vibe_gpa_bg_color', 'vibe_gpa_scale', 'vibe_gpa_custom_scale', 'vibe_gpa_past_gpa', 'vibe_gpa_past_credits', 'vibe_gpa_mode'], function(res) {
      var showGpa = (res && res.vibe_show_gpa !== undefined) ? !!res.vibe_show_gpa : true;
      var existing = document.getElementById('vibe-gpa-school-card');

      if (!showGpa) {
        if (gpaCardGuardObserver) {
          gpaCardGuardObserver.disconnect();
          gpaCardGuardObserver = null;
        }
        if (existing) existing.remove();
        return;
      }

      var scaleKey        = (res && res.vibe_gpa_scale) || 'standard4';
      if (scaleKey === 'sfu') scaleKey = 'scale433';
      else if (scaleKey === 'gpa4') scaleKey = 'standard4';

      var customScaleData = (res && res.vibe_gpa_custom_scale) || null;
      if (!Array.isArray(customScaleData) || customScaleData.length === 0) {
        customScaleData = [
          { min: 90, gpa: 4.0, letter: 'A' },
          { min: 80, gpa: 3.0, letter: 'B' },
          { min: 70, gpa: 2.0, letter: 'C' },
          { min: 60, gpa: 1.0, letter: 'D' },
          { min: 0,  gpa: 0.0, letter: 'F' }
        ];
      }

      var pastGpa     = (res && res.vibe_gpa_past_gpa !== undefined) ? parseFloat(res.vibe_gpa_past_gpa) : null;
      var pastCredits = (res && res.vibe_gpa_past_credits !== undefined) ? parseFloat(res.vibe_gpa_past_credits) : 0;
      var mode        = (res && res.vibe_gpa_mode) || 'semester';
      var customBg    = (res && res.vibe_gpa_bg_color) || '';
      var catalog     = (typeof PRESETS !== 'undefined') ? PRESETS : {};
      var p           = catalog[presetId] || catalog[DEFAULT_PRESET_ID];
      var accentColor = (p && p.colors && (p.colors.accent || p.colors.links)) || '#457354';
      var heroBg      = customBg || ('linear-gradient(135deg,' + accentColor + 'dd 0%,' + accentColor + '88 100%)');
      var colorInputVal = customBg && customBg.startsWith('#') ? customBg : accentColor;

      fetchCourseGrades(function(courses) {
        var result = calculateGPA(courses, scaleKey, pastGpa, pastCredits, customScaleData);
        var displayGpa = (mode === 'cumulative' && result.cumGpa !== null) ? result.cumGpa : result.semGpa;
        var gpaStr = displayGpa !== null ? displayGpa.toFixed(2) : '—';
        var modeLabel = mode === 'cumulative' ? 'Cumulative' : 'Semester';

        var activeScale = getActiveGpaScale(scaleKey, customScaleData);
        var scaleBadgeLabel = activeScale ? activeScale.label : scaleKey;

        var card = document.getElementById('vibe-gpa-school-card') || document.createElement('div');
        var isNew = !card.parentNode;
        card.id = 'vibe-gpa-school-card';
        card.className = 'ic-DashboardCard vibe-gpa-card';

        // Build breakdown rows: Course | Score | Letter | GPA
        var rowsHtml = '';
        var sorted = result.breakdown.slice().sort(function(a, b) { return b.score - a.score; });
        for (var i = 0; i < sorted.length; i++) {
          var cr = sorted[i];
          var shortName = cr.code || cr.name.replace(/\s*\d{4}\s*.*$/, '').trim().substring(0, 18);
          var gpaColor = cr.gpa >= 3.0 ? '#4caf50' : cr.gpa >= 2.0 ? '#ff9800' : '#f44336';
          rowsHtml += '<div class="vibe-gpa-row">' +
            '<a class="vibe-gpa-row-name" href="/courses/' + encodeURIComponent(cr.id) + '/grades" title="' + escapeHtml(cr.name) + '">' + escapeHtml(shortName) + '</a>' +
            '<span class="vibe-gpa-row-score">' + cr.score.toFixed(1) + '%</span>' +
            '<span class="vibe-gpa-row-letter">' + escapeHtml(cr.letter || '') + '</span>' +
            '<span class="vibe-gpa-row-gp" style="color:' + gpaColor + '">' + cr.gpa.toFixed(2) + '</span>' +
          '</div>';
        }
        if (!rowsHtml) {
          rowsHtml = '<div class="vibe-gpa-empty">No graded courses yet</div>';
        }

        // Build Custom Scale Editor HTML
        var customRowsHtml = '';
        var editScaleList = customScaleData.slice().sort(function(a, b) { return b.min - a.min; });
        for (var s = 0; s < editScaleList.length; s++) {
          var rowItem = editScaleList[s];
          customRowsHtml +=
            '<div class="vibe-gpa-custom-row">' +
              '<input type="number" class="vibe-scale-min" min="0" max="100" step="0.5" value="' + rowItem.min + '" title="Min %">' +
              '<input type="text" class="vibe-scale-letter" maxlength="3" value="' + escapeHtml(rowItem.letter || '') + '" title="Letter">' +
              '<input type="number" class="vibe-scale-gpa" min="0" max="10" step="0.01" value="' + rowItem.gpa + '" title="GPA points">' +
              '<button type="button" class="vibe-gpa-del-btn" title="Remove threshold">×</button>' +
            '</div>';
        }

        card.innerHTML =
          '<div class="vibe-gpa-hero" style="background:' + heroBg + '">' +
            '<button class="vibe-gpa-settings-btn" title="GPA Settings" aria-label="GPA Settings">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>' +
            '</button>' +
            '<div class="vibe-gpa-big">' + gpaStr + '</div>' +
            '<div class="vibe-gpa-label">' + modeLabel + ' GPA</div>' +
            '<div class="vibe-gpa-scale-badge">' + scaleBadgeLabel + '</div>' +
          '</div>' +
          '<div class="vibe-gpa-body">' +
            '<div class="vibe-gpa-breakdown-header">' +
              '<span>Course</span><span>Score</span><span style="text-align:center;">Grade</span><span>GPA</span>' +
            '</div>' +
            '<div class="vibe-gpa-breakdown">' + rowsHtml + '</div>' +
          '</div>';

        if (isNew) {
          isApplyingTheme = true;
          container.appendChild(card);
          setTimeout(function() { isApplyingTheme = false; }, 120);
          attachGpaCardGuard(card, container);
        } else {
          if (container.lastElementChild !== card) {
            container.appendChild(card);
          }
        }

        // Clean up any existing modal backdrop in document.body, unless it's currently open
        var oldBackdrop = document.getElementById('vibe-gpa-modal-backdrop');
        if (oldBackdrop && oldBackdrop.classList.contains('vibe-modal-open')) {
          var sBtn = card.querySelector('.vibe-gpa-settings-btn');
          if (sBtn) {
            sBtn.onclick = function(e) {
              e.preventDefault(); e.stopPropagation();
              oldBackdrop.classList.add('vibe-modal-open');
            };
          }
          return;
        }
        if (oldBackdrop) oldBackdrop.remove();

        // Settings Modal Popup (Rendered directly on document.body so it is never clipped)
        var modalBackdrop = document.createElement('div');
        modalBackdrop.id = 'vibe-gpa-modal-backdrop';
        modalBackdrop.className = 'vibe-gpa-modal-backdrop';
        modalBackdrop.innerHTML =
          '<div class="vibe-gpa-modal-box">' +
            '<div class="vibe-gpa-modal-header">' +
              '<div class="vibe-gpa-modal-title-wrap">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>' +
                '<span class="vibe-gpa-modal-title">GPA Calculator Settings</span>' +
              '</div>' +
              '<button type="button" class="vibe-gpa-modal-close" id="vibe-gpa-modal-close" title="Close">×</button>' +
            '</div>' +
            '<div class="vibe-gpa-modal-body">' +
              '<div class="vibe-gpa-settings-row">' +
                '<label>Scale Preset</label>' +
                '<select id="vibe-gpa-scale-sel">' +
                  '<option value="standard4"' + (scaleKey === 'standard4' ? ' selected' : '') + '>Standard 4.0 Scale</option>' +
                  '<option value="scale433"' + (scaleKey === 'scale433' ? ' selected' : '') + '>4.33 Scale</option>' +
                  '<option value="custom"' + (scaleKey === 'custom' ? ' selected' : '') + '>Custom Scale...</option>' +
                '</select>' +
              '</div>' +
              '<div id="vibe-gpa-custom-editor-wrap" class="vibe-gpa-custom-editor-card" style="' + (scaleKey === 'custom' ? '' : 'display:none;') + '">' +
                '<div class="vibe-gpa-custom-editor-header">' +
                  '<span class="vibe-gpa-editor-title">Custom Grade Thresholds</span>' +
                  '<span class="vibe-gpa-editor-hint">Assign % to letter & GPA points</span>' +
                '</div>' +
                '<div class="vibe-gpa-custom-col-headers">' +
                  '<span>Min %</span><span>Letter</span><span>GPA Points</span><span></span>' +
                '</div>' +
                '<div class="vibe-gpa-custom-editor" id="vibe-gpa-custom-rows-container">' + customRowsHtml + '</div>' +
                '<button type="button" class="vibe-gpa-add-row-btn" id="vibe-gpa-add-custom-row">+ Add Grade Threshold</button>' +
              '</div>' +
              '<div class="vibe-gpa-settings-row">' +
                '<label>Calculation Mode</label>' +
                '<select id="vibe-gpa-mode-sel">' +
                  '<option value="semester"' + (mode === 'semester' ? ' selected' : '') + '>Semester (Current Courses)</option>' +
                  '<option value="cumulative"' + (mode === 'cumulative' ? ' selected' : '') + '>Cumulative (Include Past GPA)</option>' +
                '</select>' +
              '</div>' +
              '<div class="vibe-gpa-settings-row" id="vibe-gpa-cumulative-row" style="' + (mode === 'cumulative' ? 'display:flex !important;' : 'display:none !important;') + '">' +
                '<label>Past GPA</label>' +
                '<input id="vibe-gpa-past-gpa-input" type="number" step="0.01" min="0" max="10" placeholder="e.g. 3.50" value="' + (pastGpa !== null ? pastGpa : '') + '">' +
              '</div>' +
              '<div class="vibe-gpa-settings-row" id="vibe-gpa-credits-row" style="' + (mode === 'cumulative' ? 'display:flex !important;' : 'display:none !important;') + '">' +
                '<label>Past Credits</label>' +
                '<input id="vibe-gpa-past-credits-input" type="number" step="1" min="0" placeholder="e.g. 60" value="' + (pastCredits || '') + '">' +
              '</div>' +
              '<div class="vibe-gpa-settings-row">' +
                '<label>Card Accent</label>' +
                '<div style="display:flex;align-items:center;justify-content:center;gap:10px;flex:1;">' +
                  '<input id="vibe-gpa-color-input" type="color" value="' + colorInputVal + '" style="width:34px;height:28px;border:none;padding:0;background:none;cursor:pointer;border-radius:6px;">' +
                  '<button type="button" id="vibe-gpa-color-reset-btn" class="mini-text-btn" style="background:none;border:none;color:var(--bctext-2);font-size:12px;cursor:pointer;text-decoration:underline;">Reset to theme</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="vibe-gpa-modal-footer">' +
              '<button type="button" class="vibe-gpa-btn-secondary" id="vibe-gpa-modal-cancel">Cancel</button>' +
              '<button type="button" class="vibe-gpa-btn-primary" id="vibe-gpa-settings-save">Save Settings</button>' +
            '</div>' +
          '</div>';
        document.body.appendChild(modalBackdrop);

        // Wire settings button & modal popup
        var settingsBtn = card.querySelector('.vibe-gpa-settings-btn');
        var modalClose = modalBackdrop.querySelector('#vibe-gpa-modal-close');
        var modalCancel = modalBackdrop.querySelector('#vibe-gpa-modal-cancel');
        var scaleSel = modalBackdrop.querySelector('#vibe-gpa-scale-sel');
        var customWrap = modalBackdrop.querySelector('#vibe-gpa-custom-editor-wrap');
        var customRowsContainer = modalBackdrop.querySelector('#vibe-gpa-custom-rows-container');
        var addRowBtn = modalBackdrop.querySelector('#vibe-gpa-add-custom-row');
        var modeSel = modalBackdrop.querySelector('#vibe-gpa-mode-sel');
        var cumRow = modalBackdrop.querySelector('#vibe-gpa-cumulative-row');
        var credsRow = modalBackdrop.querySelector('#vibe-gpa-credits-row');
        var colorInput = modalBackdrop.querySelector('#vibe-gpa-color-input');
        var colorResetBtn = modalBackdrop.querySelector('#vibe-gpa-color-reset-btn');
        var saveBtn = modalBackdrop.querySelector('#vibe-gpa-settings-save');
        var colorWasReset = false;

        function openModal() {
          if (modalBackdrop) modalBackdrop.classList.add('vibe-modal-open');
        }
        function closeModal() {
          if (modalBackdrop) modalBackdrop.classList.remove('vibe-modal-open');
        }

        if (settingsBtn) {
          settingsBtn.onclick = function(e) {
            e.preventDefault(); e.stopPropagation();
            openModal();
          };
        }
        if (modalClose) {
          modalClose.onclick = function(e) {
            e.preventDefault(); e.stopPropagation();
            closeModal();
          };
        }
        if (modalCancel) {
          modalCancel.onclick = function(e) {
            e.preventDefault(); e.stopPropagation();
            closeModal();
          };
        }
        if (modalBackdrop) {
          modalBackdrop.onclick = function(e) {
            if (e.target === modalBackdrop) {
              closeModal();
            }
          };
        }

        if (scaleSel && customWrap) {
          scaleSel.onchange = function() {
            customWrap.style.display = scaleSel.value === 'custom' ? '' : 'none';
          };
        }

        if (addRowBtn && customRowsContainer) {
          addRowBtn.onclick = function(e) {
            e.preventDefault(); e.stopPropagation();
            var newRow = document.createElement('div');
            newRow.className = 'vibe-gpa-custom-row';
            newRow.innerHTML =
              '<input type="number" class="vibe-scale-min" min="0" max="100" step="0.5" value="50" title="Min %">' +
              '<input type="text" class="vibe-scale-letter" maxlength="3" value="C" title="Letter">' +
              '<input type="number" class="vibe-scale-gpa" min="0" max="10" step="0.01" value="2.00" title="GPA points">' +
              '<button type="button" class="vibe-gpa-del-btn" title="Remove threshold">×</button>';
            customRowsContainer.appendChild(newRow);
            wireDelBtns();
          };
        }

        function wireDelBtns() {
          if (!customRowsContainer) return;
          var delBtns = customRowsContainer.querySelectorAll('.vibe-gpa-del-btn');
          delBtns.forEach(function(btn) {
            btn.onclick = function(e) {
              e.preventDefault(); e.stopPropagation();
              var r = btn.closest('.vibe-gpa-custom-row');
              if (r) r.remove();
            };
          });
        }
        wireDelBtns();

        if (colorResetBtn && colorInput) {
          colorResetBtn.onclick = function(e) {
            e.preventDefault(); e.stopPropagation();
            colorWasReset = true;
            colorInput.value = accentColor;
          };
        }

        if (modeSel && cumRow && credsRow) {
          modeSel.onchange = function() {
            var isCum = modeSel.value === 'cumulative';
            cumRow.style.setProperty('display', isCum ? 'flex' : 'none', 'important');
            credsRow.style.setProperty('display', isCum ? 'flex' : 'none', 'important');
          };
        }

        if (saveBtn) {
          saveBtn.onclick = function(e) {
            e.preventDefault(); e.stopPropagation();
            var newScale = scaleSel ? scaleSel.value : 'standard4';
            var newMode  = modeSel ? modeSel.value : 'semester';
            var pgInput  = modalBackdrop.querySelector('#vibe-gpa-past-gpa-input');
            var pcInput  = modalBackdrop.querySelector('#vibe-gpa-past-credits-input');
            var newPg    = pgInput && pgInput.value !== '' ? parseFloat(pgInput.value) : null;
            var newPc    = pcInput && pcInput.value !== '' ? parseFloat(pcInput.value) : 0;

            var toSave = { vibe_gpa_scale: newScale, vibe_gpa_mode: newMode, vibe_gpa_past_credits: newPc };
            if (newPg !== null) toSave.vibe_gpa_past_gpa = newPg;

            // Parse custom scale rows if user edited custom scale
            if (customRowsContainer) {
              var rows = customRowsContainer.querySelectorAll('.vibe-gpa-custom-row');
              var customArr = [];
              rows.forEach(function(r) {
                var minVal = parseFloat((r.querySelector('.vibe-scale-min') || {}).value);
                var letVal = ((r.querySelector('.vibe-scale-letter') || {}).value || '').trim();
                var gpaVal = parseFloat((r.querySelector('.vibe-scale-gpa') || {}).value);
                if (!isNaN(minVal) && !isNaN(gpaVal)) {
                  customArr.push({ min: minVal, letter: letVal, gpa: gpaVal });
                }
              });
              if (customArr.length > 0) {
                customArr.sort(function(a, b) { return b.min - a.min; });
                toSave.vibe_gpa_custom_scale = customArr;
              }
            }

            if (colorWasReset) {
              toSave.vibe_gpa_bg_color = '';
            } else if (colorInput && colorInput.value) {
              toSave.vibe_gpa_bg_color = colorInput.value;
            }

            safeStorageSet(toSave, function() {
              closeModal();
              cachedCourseScores = null; // force refresh
              renderGpaSchoolCard(presetId);
            });
          };
        }
      });
    });
  }
  // ── End GPA Card ──────────────────────────────────────────────────────────

  function renderUrgentCourseBadges(cards, items, presetId) {
    if (!cards || !cards.length) {
      cards = document.querySelectorAll('.ic-DashboardCard, [data-testid="draggable-card"]');
    }
    if (!cards || !cards.length) return;
    if (!items || !items.length) {
      items = cachedPlannerItems || [];
    }
    presetId = presetId || localStorage.getItem('vibe_cached_preset') || DEFAULT_PRESET_ID;

    var courseUpcomingMap = {};
    var coursePastMap = {};

    // Group items by course
    for (var i = 0; i < (items || []).length; i++) {
      var item = items[i];
      if (!item.dateObj || isNaN(item.dateObj.getTime())) continue;

      var itemCid = item.courseId || (item.href ? (item.href.match(/\/courses\/(\d+)/) || [])[1] : null);
      var cKey = itemCid ? ('c_' + itemCid) : null;
      var codeMatch = (item.course || item.title || '').match(/\b([A-Z]{2,5}\s*\d{3}[A-Z]?)\b/i);
      var codeKey = codeMatch ? ('code_' + codeMatch[1].replace(/\s+/g, '').toUpperCase()) : null;

      var targetKeys = [];
      if (cKey) targetKeys.push(cKey);
      if (codeKey) targetKeys.push(codeKey);

      var isPast = item.isSubmitted || item.isGraded || (item.score !== null && item.score !== undefined) || (item.dateObj.getTime() < Date.now() - 3600 * 1000);

      for (var k = 0; k < targetKeys.length; k++) {
        var tKey = targetKeys[k];
        if (isPast) {
          if (!coursePastMap[tKey]) coursePastMap[tKey] = [];
          coursePastMap[tKey].push(item);
        } else {
          if (!courseUpcomingMap[tKey]) courseUpcomingMap[tKey] = [];
          courseUpcomingMap[tKey].push(item);
        }
      }
    }

    // Sort upcoming ascending by due date
    for (var uKey in courseUpcomingMap) {
      if (courseUpcomingMap.hasOwnProperty(uKey)) {
        courseUpcomingMap[uKey].sort(function(a, b) {
          return a.dateObj.getTime() - b.dateObj.getTime();
        });
      }
    }
    // Sort past descending by due date
    for (var pKey in coursePastMap) {
      if (coursePastMap.hasOwnProperty(pKey)) {
        coursePastMap[pKey].sort(function(a, b) {
          return b.dateObj.getTime() - a.dateObj.getTime();
        });
      }
    }

    // Fetch grades asynchronously to display grade pill on card hero
    fetchCourseGrades(function(scoresData) {
      var scoreMap = {};
      if (Array.isArray(scoresData)) {
        for (var s = 0; s < scoresData.length; s++) {
          var item = scoresData[s];
          if (item && item.score !== null && item.score !== undefined) {
            if (item.id) scoreMap[String(item.id)] = item.score;
            if (item.code) {
              var cleanCode = item.code.replace(/\s+/g, '').toUpperCase();
              scoreMap['code_' + cleanCode] = item.score;
            }
          }
        }
      } else if (scoresData && scoresData.map) {
        scoreMap = scoresData.map;
      }

      for (var c = 0; c < cards.length; c++) {
        var card = cards[c];
        if (card.id === 'vibe-gpa-school-card') continue;
        var hero = card.querySelector('.ic-DashboardCard__header_hero') || card.querySelector('.ic-DashboardCard__header_image') || card.querySelector('.ic-DashboardCard__header');
        if (!hero) continue;

        var link = card.querySelector('a.ic-DashboardCard__link, a[href*="/courses/"]');
        var cid = null;
        if (link) {
          var m = (link.getAttribute('href') || link.href || '').match(/\/courses\/(\d+)/);
          if (m) cid = m[1];
        }

        var text = (
          (card.getAttribute('aria-label') || '') + ' ' +
          (card.querySelector('.ic-DashboardCard__header-title') ? card.querySelector('.ic-DashboardCard__header-title').textContent : '')
        ).trim();
        var codeM = text.match(/\b([A-Z]{2,6}\s*\d{2,4}[A-Z]?)\b/i);
        var codeClean = codeM ? ('code_' + codeM[1].replace(/\s+/g, '').toUpperCase()) : null;

        var rawScore = (cid && scoreMap[String(cid)] !== undefined)
          ? scoreMap[String(cid)]
          : (codeClean && scoreMap[codeClean] !== undefined ? scoreMap[codeClean] : undefined);

        if (rawScore !== undefined && rawScore !== null) {
          var formattedScore = (Math.round(rawScore * 10) / 10) + '%';
          var existingGradeBadge = hero.querySelector('.vibe-card-grade-badge');
          if (!existingGradeBadge) {
            existingGradeBadge = document.createElement('div');
            existingGradeBadge.className = 'vibe-card-grade-badge';
            hero.appendChild(existingGradeBadge);
          }
          existingGradeBadge.textContent = formattedScore;
          existingGradeBadge.title = 'Current Grade: ' + formattedScore;
        }
      }
    });

    for (var c = 0; c < cards.length; c++) {
      var card = cards[c];
      var contentBox = card.querySelector('.ic-DashboardCard__header_content') || card.querySelector('.ic-DashboardCard__header-content');
      if (!contentBox) continue;

      // Remove obsolete ugly badges
      var oldBadges = card.querySelectorAll('.vibe-urgent-badge');
      for (var b = 0; b < oldBadges.length; b++) {
        oldBadges[b].remove();
      }

      var cardCourseId = null;
      var link = card.querySelector('a.ic-DashboardCard__link, a[href*="/courses/"]');
      if (link) {
        var m = (link.getAttribute('href') || link.href || '').match(/\/courses\/(\d+)/);
        if (m) cardCourseId = m[1];
      }
      var cardText = (card.textContent || '').toUpperCase();
      var cardCodeMatch = cardText.match(/\b([A-Z]{2,5}\s*\d{3}[A-Z]?)\b/i);
      var cardCodeKey = cardCodeMatch ? ('code_' + cardCodeMatch[1].replace(/\s+/g, '').toUpperCase()) : null;

      var upList = (cardCourseId && courseUpcomingMap['c_' + cardCourseId]) || (cardCodeKey && courseUpcomingMap[cardCodeKey]) || [];
      var pastList = (cardCourseId && coursePastMap['c_' + cardCourseId]) || (cardCodeKey && coursePastMap[cardCodeKey]) || [];

      // Combine: up to 1-2 past (with strikethrough) and upcoming items
      var displayItems = [];
      if (pastList.length > 0 && upList.length < 3) {
        displayItems.push(Object.assign({}, pastList[0], { isPastDue: true }));
      }
      for (var u = 0; u < upList.length && displayItems.length < 4; u++) {
        displayItems.push(Object.assign({}, upList[u], { isPastDue: false }));
      }

      // Render Course Card Due items list section (matching user reference mockup)
      var existingDueSection = card.querySelector('.vibe-card-due-section');
      if (!existingDueSection) {
        existingDueSection = document.createElement('div');
        existingDueSection.className = 'vibe-card-due-section';
        card.appendChild(existingDueSection);
      }

      if (displayItems.length > 0) {
        var dueHtml = '<div class="vibe-card-due-header">Due</div><div class="vibe-card-due-list">';
        for (var d = 0; d < displayItems.length; d++) {
          var dItem = displayItems[d];
          var dTitle = sanitizeTitle(dItem.title);
          if (/^Opens:\s*/i.test(dTitle)) dTitle = dTitle.replace(/^Opens:\s*/i, '');
          if (dTitle.length > 24) dTitle = dTitle.substring(0, 22) + '…';
          var dMonth = dItem.dateObj.getMonth() + 1;
          var dDate = dItem.dateObj.getDate();
          var dDateStr = dMonth + '/' + dDate;
          var strikeCls = dItem.isPastDue ? ' strike' : '';
          var itemHref = (dItem.href && dItem.href !== '#') ? dItem.href : '';
          var escTitle = (dItem.title || '').replace(/"/g, '&quot;');
          if (itemHref) {
            dueHtml += '<a class="vibe-card-due-row' + strikeCls + '" href="' + escapeHtml(itemHref) + '" title="' + escapeHtml(dItem.title) + '"><span class="vibe-card-due-title' + strikeCls + '">' + escapeHtml(dTitle) + '</span><span class="vibe-card-due-date">' + escapeHtml(dDateStr) + '</span></a>';
          } else {
            dueHtml += '<div class="vibe-card-due-row' + strikeCls + '" title="' + escapeHtml(dItem.title) + '"><span class="vibe-card-due-title' + strikeCls + '">' + escapeHtml(dTitle) + '</span><span class="vibe-card-due-date">' + escapeHtml(dDateStr) + '</span></div>';
          }
        }
        dueHtml += '</div>';
        existingDueSection.innerHTML = dueHtml;

        var dueLinks = existingDueSection.querySelectorAll('a.vibe-card-due-row');
        for (var dl = 0; dl < dueLinks.length; dl++) {
          dueLinks[dl].addEventListener('click', function(e) {
            e.stopPropagation();
          });
        }
      } else {
        existingDueSection.innerHTML =
          '<div class="vibe-card-due-header">Due</div>' +
          '<div class="vibe-card-due-list">' +
            '<div class="vibe-card-due-row"><span class="vibe-card-due-title" style="opacity:0.45;font-size:11px;">No upcoming assignments</span></div>' +
          '</div>';
      }
    }
  }

  // --------------------------------------------------------------------------
  // Duo Sidebar Widget Engine (Upcoming Tasks & Graded Work)
  // --------------------------------------------------------------------------
  var cachedPlannerItems = null;
  var lastPlannerFetchTime = 0;
  var cachedGradedItems = null;
  var lastGradedFetchTime = 0;
  var isRenderingWidget = false;

  function hideNativeTodoList(rightSide) {
    var target = rightSide || document.getElementById('right-side') || document.getElementById('right-side-wrapper');
    if (!target) return;
    var selectors = [
      '.todo-list-wrapper',
      '.to-do-list',
      '.events_list',
      '.todo-list-header',
      '.events_list_header',
      '.recent_feedback',
      '.right-side-list',
      '.ToDoSidebarItem',
      'div[data-testid*="todo"]',
      'div[data-testid*="coming-up"]',
      'section[data-testid*="todo"]',
      'section[data-testid*="coming-up"]'
    ];
    try {
      var els = target.querySelectorAll(selectors.join(', '));
      for (var i = 0; i < els.length; i++) {
        if (!els[i].closest('#vibe-todo-widget') && !els[i].closest('#vibe-graded-widget')) {
          els[i].style.setProperty('display', 'none', 'important');
        }
      }
      var headers = target.querySelectorAll('h2');
      for (var h = 0; h < headers.length; h++) {
        var hText = (headers[h].textContent || '').trim().toLowerCase();
        if (hText === 'to do' || hText === 'coming up' || hText === 'recent feedback') {
          headers[h].style.setProperty('display', 'none', 'important');
        }
      }
    } catch (e) {}
  }

  function getDismissedTasks() {
    try {
      var saved = localStorage.getItem('vibe_dismissed_tasks_v2');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  function saveDismissedTask(key) {
    if (!key) return;
    try {
      var map = getDismissedTasks();
      map[key] = Date.now();
      localStorage.setItem('vibe_dismissed_tasks_v2', JSON.stringify(map));
    } catch (e) {}
  }

  function getManuallyCompletedTasks() {
    try {
      var saved = localStorage.getItem('vibe_completed_tasks_v1');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  function saveManuallyCompletedTask(item) {
    if (!item) return;
    try {
      var map = getManuallyCompletedTasks();
      var k = item.key || ('task_' + (item.plannableId || item.title));
      var compEntry = {
        key: k,
        title: item.title,
        course: item.course,
        courseId: item.courseId,
        href: item.href,
        dateObj: new Date().toISOString(),
        dueDateObj: item.dateISO || (item.dateObj ? (typeof item.dateObj.toISOString === 'function' ? item.dateObj.toISOString() : item.dateObj) : new Date().toISOString()),
        gradedDateObj: new Date().toISOString(),
        isGraded: false,
        isSubmitted: false,
        isCompleted: true,
        score: null,
        grade: 'Ungraded',
        points: item.points || null,
        completedAt: Date.now()
      };
      map[k] = compEntry;
      localStorage.setItem('vibe_completed_tasks_v1', JSON.stringify(map));

      // Also mark as dismissed from upcoming tasks
      saveDismissedTask(k);

      lastGradedFetchTime = 0;
      if (Array.isArray(cachedGradedItems)) {
        cachedGradedItems.unshift({
          key: k,
          title: item.title,
          course: item.course,
          courseId: item.courseId,
          href: item.href,
          dateObj: new Date(),
          dueDateObj: item.dateObj || new Date(),
          gradedDateObj: new Date(),
          isGraded: false,
          isSubmitted: false,
          isCompleted: true,
          score: null,
          grade: 'Ungraded',
          points: item.points || null
        });
      }
    } catch (e) {}
  }

  function removeManuallyCompletedTask(key) {
    if (!key) return;
    try {
      var map = getManuallyCompletedTasks();
      delete map[key];
      localStorage.setItem('vibe_completed_tasks_v1', JSON.stringify(map));
      lastGradedFetchTime = 0;
      if (Array.isArray(cachedGradedItems)) {
        cachedGradedItems = cachedGradedItems.filter(function(x) { return x.key !== key; });
      }
    } catch (e) {}
  }

  function getDismissedGraded() {
    try {
      var saved = localStorage.getItem('vibe_dismissed_graded_v1');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  function saveDismissedGraded(key) {
    if (!key) return;
    try {
      var map = getDismissedGraded();
      map[key] = Date.now();
      localStorage.setItem('vibe_dismissed_graded_v1', JSON.stringify(map));
    } catch (e) {}
  }

  function unDismissTask(key) {
    if (!key) return;
    try {
      var map = getDismissedTasks();
      delete map[key];
      localStorage.setItem('vibe_dismissed_tasks_v2', JSON.stringify(map));
    } catch (e) {}
  }

  function unDismissGraded(key) {
    if (!key) return;
    try {
      var map = getDismissedGraded();
      delete map[key];
      localStorage.setItem('vibe_dismissed_graded_v1', JSON.stringify(map));
    } catch (e) {}
  }

  function restoreAllDismissedItems(presetId) {
    try {
      localStorage.removeItem('vibe_dismissed_tasks_v2');
      localStorage.removeItem('vibe_dismissed_graded_v1');
      localStorage.removeItem('vibe_completed_tasks_v1');
      localStorage.removeItem('vibe_dismissed_tasks');
      localStorage.removeItem('vibe_dismissed_todo');
      localStorage.removeItem('vibe_dismissed_graded');
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({
          vibe_dismissed_tasks_v2: {},
          vibe_dismissed_graded_v1: {},
          vibe_completed_tasks_v1: {},
          vibe_dismissed_tasks: [],
          vibe_dismissed_todo: {},
          vibe_dismissed_graded: {}
        });
      }
    } catch (e) {}
    cachedPlannerItems = null;
    lastPlannerFetchTime = 0;
    cachedGradedItems = null;
    lastGradedFetchTime = 0;
    initTodoReformatter(presetId || DEFAULT_PRESET_ID);
  }

  var undoToastTimeout = null;

  function showUndoToast(item, type, presetId) {
    var oldToast = document.getElementById('vibe-undo-toast');
    if (oldToast) oldToast.remove();
    if (undoToastTimeout) clearTimeout(undoToastTimeout);

    var toast = document.createElement('div');
    toast.id = 'vibe-undo-toast';
    toast.className = 'vibe-undo-toast';
    toast.style.cssText = 'position: fixed !important; bottom: 28px !important; right: 32px !important; z-index: 2147483647 !important; background-color: var(--bcbackground-1, #1C2028) !important; color: var(--bctext-0, #FFFFFF) !important; border: 1px solid var(--bcborders, rgba(255, 255, 255, 0.12)) !important; border-radius: 10px !important; padding: 10px 14px 12px 14px !important; display: flex !important; align-items: center !important; gap: 12px !important; box-shadow: 0 8px 28px rgba(0, 0, 0, 0.32), 0 2px 8px rgba(0, 0, 0, 0.18) !important; font-size: 12px !important; font-weight: 500 !important; opacity: 0; transform: translateY(16px) scale(0.96); transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease !important; overflow: hidden !important; pointer-events: none;';

    var labelText = (type === 'graded') ? 'Grade hidden' : 'Task marked Complete';

    toast.innerHTML =
      '<div class="vibe-undo-content" style="display: flex !important; align-items: center !important; gap: 7px !important; color: var(--bctext-0, #FFFFFF) !important;">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="stroke: var(--bclinks, #0A84FF) !important;"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>' +
        '<span>' + labelText + '</span>' +
      '</div>' +
      '<button id="vibe-undo-action-btn" class="vibe-undo-btn" type="button" style="background: var(--bclinks, #0A84FF) !important; color: #FFFFFF !important; border: none !important; border-radius: 6px !important; padding: 4px 10px !important; font-size: 11px !important; font-weight: 700 !important; cursor: pointer !important;">Undo</button>' +
      '<div class="vibe-undo-progress"><div class="vibe-undo-progress-bar"></div></div>';

    document.body.appendChild(toast);

    requestAnimationFrame(function() {
      toast.classList.add('vibe-undo-visible');
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0) scale(1)';
      toast.style.pointerEvents = 'auto';
    });

    var actionBtn = toast.querySelector('#vibe-undo-action-btn');
    if (actionBtn) {
      actionBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (type === 'graded') {
          unDismissGraded(item.key);
        } else {
          unDismissTask(item.key);
          removeManuallyCompletedTask(item.key);
        }
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(16px) scale(0.96)';
        setTimeout(function() { if (toast.parentNode) toast.remove(); }, 200);
        if (undoToastTimeout) clearTimeout(undoToastTimeout);
        initTodoReformatter(presetId || DEFAULT_PRESET_ID);
      });
    }

    undoToastTimeout = setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(16px) scale(0.96)';
      setTimeout(function() { if (toast.parentNode) toast.remove(); }, 260);
    }, 5000);
  }

  function parseItemDate(dateVal) {
    if (!dateVal) return null;
    if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? null : dateVal;
    var d = new Date(dateVal);
    if (!isNaN(d.getTime())) return d;

    var str = String(dateVal).trim();
    var now = new Date();

    if (/today/i.test(str)) {
      var timeMatch = str.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
      if (timeMatch) {
        var hrs = parseInt(timeMatch[1], 10);
        var mins = parseInt(timeMatch[2], 10);
        var ampm = (timeMatch[3] || '').toLowerCase();
        if (ampm === 'pm' && hrs < 12) hrs += 12;
        if (ampm === 'am' && hrs === 12) hrs = 0;
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hrs, mins);
      }
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59);
    }

    if (/tomorrow/i.test(str)) {
      var tmMatch = str.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
      var tmHrs = 23, tmMins = 59;
      if (tmMatch) {
        tmHrs = parseInt(tmMatch[1], 10);
        tmMins = parseInt(tmMatch[2], 10);
        var tmAmpm = (tmMatch[3] || '').toLowerCase();
        if (tmAmpm === 'pm' && tmHrs < 12) tmHrs += 12;
        if (tmAmpm === 'am' && tmHrs === 12) tmHrs = 0;
      }
      var tmDate = new Date(now);
      tmDate.setDate(tmDate.getDate() + 1);
      tmDate.setHours(tmHrs, tmMins, 0, 0);
      return tmDate;
    }

    var monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    var parts = str.match(/([a-z]{3,})\s+(\d{1,2})(?:\s+at\s+(\d{1,2}):(\d{2})\s*(am|pm)?)?/i);
    if (parts) {
      var mIdx = monthNames.indexOf(parts[1].toLowerCase().slice(0, 3));
      if (mIdx !== -1) {
        var day = parseInt(parts[2], 10);
        var h = 23, m = 59;
        if (parts[3] && parts[4]) {
          h = parseInt(parts[3], 10);
          m = parseInt(parts[4], 10);
          var ap = (parts[5] || '').toLowerCase();
          if (ap === 'pm' && h < 12) h += 12;
          if (ap === 'am' && h === 12) h = 0;
        }
        return new Date(now.getFullYear(), mIdx, day, h, m);
      }
    }
    return null;
  }

  function formatDayGroupHeader(dateObj) {
    var now = new Date();
    var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var targetStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
    var diffDays = Math.round((targetStart - todayStart) / (1000 * 60 * 60 * 24));

    var shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var shortDay = shortDayNames[dateObj.getDay()];
    var monthName = monthNames[dateObj.getMonth()];
    var dayNum = dateObj.getDate();

    if (diffDays === 0) {
      return { label: 'Today · ' + monthName + ' ' + dayNum, isToday: true, isTomorrow: false };
    }
    if (diffDays === 1) {
      return { label: 'Tomorrow · ' + monthName + ' ' + dayNum, isToday: false, isTomorrow: true };
    }
    if (diffDays === -1) {
      return { label: 'Yesterday · ' + monthName + ' ' + dayNum, isToday: false, isTomorrow: false };
    }
    if (diffDays < -1) {
      return { label: 'Past Due · ' + monthName + ' ' + dayNum, isToday: false, isTomorrow: false, isPast: true };
    }
    return { label: shortDay + ', ' + monthName + ' ' + dayNum, isToday: false, isTomorrow: false };
  }

  function sanitizeTitle(str) {
    if (!str) return '';
    return str
      .replace(/^[\s\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}🔒🔓📋📝📢📅💬⏳🎓✨]+/u, '')
      .replace(/^(Opens:\s*)+/i, 'Opens: ')
      .replace(/\s+[A-Z]{2,5}\s*\d{3}[A-Z]?(?:\s+[A-Z0-9]+)?\s+\d+(?:\.\d+)?\s+out\s+of\s+\d+(?:\.\d+)?/i, '')
      .replace(/\s+\d+(?:\.\d+)?\s+out\s+of\s+\d+(?:\.\d+)?/i, '')
      .trim();
  }

  function getTodoItemIconSvg(item) {
    var isQuizOrExam = (item.type === 'quiz') || /quiz|exam|midterm|final\s*test|assessment/i.test(item.title);
    if (item.isOpenCard) {
      return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>';
    }
    if (item.type === 'announcement') {
      return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>';
    }
    if (isQuizOrExam) {
      return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFD60A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>';
    }
    if (item.type === 'event') {
      return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';
    }
    if (item.type === 'discussion') {
      return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    }
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>';
  }

  function getActiveCourseId() {
    var m = (location.pathname || '').match(/\/courses\/(\d+)/);
    return m ? m[1] : null;
  }

  function getGradedItemIconSvg(statusType) {
    if (statusType === 'graded') {
      return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#30D158" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    }
    if (statusType === 'submitted') {
      return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#DFB147" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
    }
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A84FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
  }

  function formatCardTime(dateObj, item) {
    if (item.type === 'announcement') {
      return 'Notice';
    }
    var now = new Date();
    if (item.isOpenCard) {
      if (!dateObj) return 'Opens Soon';
      var oh = dateObj.getHours();
      var om = dateObj.getMinutes();
      var oap = oh >= 12 ? 'PM' : 'AM';
      oh = oh % 12;
      oh = oh ? oh : 12;
      var oms = om < 10 ? '0' + om : om;
      return 'Opens · ' + oh + ':' + oms + ' ' + oap;
    }
    if (item.unlockDateObj && item.unlockDateObj.getTime() > now.getTime()) {
      var mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return 'Opens ' + mNames[item.unlockDateObj.getMonth()] + ' ' + item.unlockDateObj.getDate();
    }

    if (!dateObj) return item.dateStr || 'Upcoming';

    var hours = dateObj.getHours();
    var minutes = dateObj.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var minStr = minutes < 10 ? '0' + minutes : minutes;
    var timeStr = hours + ':' + minStr + ' ' + ampm;

    return timeStr;
  }

  function fetchPlannerItems(daysAhead, callback) {
    var now = new Date();
    if (cachedPlannerItems && (Date.now() - lastPlannerFetchTime < 45000)) {
      if (callback) callback(cachedPlannerItems);
      return;
    }

    var start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    var end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (daysAhead || 15), 23, 59, 59, 999);

    var url = '/api/v1/planner/items?start_date=' + encodeURIComponent(start.toISOString()) + '&end_date=' + encodeURIComponent(end.toISOString()) + '&per_page=100';

    fetch(url, { credentials: 'same-origin', headers: { 'Accept': 'application/json' } })
      .then(function(resp) {
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        return resp.json();
      })
      .then(function(data) {
        if (!Array.isArray(data)) throw new Error('Planner items not array');

        var parsed = [];
        var dismissedMap = getDismissedTasks();
        var completedMap = getManuallyCompletedTasks();

        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          var plannable = item.plannable || {};

          if (item.submissions && (item.submissions.submitted || item.submissions.workflow_state === 'graded' || item.submissions.excused)) {
            continue;
          }

          var pType = item.plannable_type || 'assignment';
          var pId = item.plannable_id || plannable.id || i;
          var title = (plannable.title || item.title || 'Task').replace(/\s+/g, ' ').trim();
          var course = item.context_name || item.course_title || '';
          var href = item.html_url || plannable.html_url || '#';
          var dateISO = item.plannable_date || plannable.due_at || plannable.todo_date || plannable.posted_at || null;
          var dateObj = parseItemDate(dateISO);
          var unlockISO = plannable.unlock_at || null;
          var unlockObj = parseItemDate(unlockISO);

          var itemKey = (pType + '_' + pId).toLowerCase();
          if (dismissedMap[itemKey] || completedMap[itemKey]) continue;

          var itemType = 'assignment';
          if (pType === 'announcement' || /announcement/i.test(pType) || /announcement/i.test(title)) {
            itemType = 'announcement';
          } else if (pType === 'quiz' || /quiz|exam|test/i.test(title)) {
            itemType = 'quiz';
          } else if (pType === 'calendar_event' || pType === 'event') {
            itemType = 'event';
          } else if (pType === 'discussion_topic' || pType === 'discussion') {
            itemType = 'discussion';
          }

          var cm = (href || '').match(/\/courses\/(\d+)/);
          var cid = item.course_id || (item.context_type === 'Course' ? item.context_id : null) || (plannable ? plannable.course_id : null) || (cm ? cm[1] : null);

          parsed.push({
            key: itemKey,
            plannableType: pType,
            plannableId: pId,
            courseId: cid ? String(cid) : null,
            type: itemType,
            title: title,
            course: course,
            href: href,
            dateISO: dateISO,
            dateObj: dateObj,
            unlockDateISO: unlockISO,
            unlockDateObj: unlockObj,
            points: plannable.points_possible !== undefined ? plannable.points_possible : null,
            nativeDismissBtn: null
          });
        }

        // Parallel enrich unlock_at dates for assignments & quizzes
        var assignList = parsed.filter(function(x) {
          return (x.plannableType === 'assignment' || x.plannableType === 'quiz') && x.href && !x.unlockDateObj;
        });

        var enrichTasks = assignList.map(function(item) {
          var match = item.href.match(/\/courses\/(\d+)\/assignments\/(\d+)/);
          if (match) {
            return fetch('/api/v1/courses/' + match[1] + '/assignments/' + match[2], { credentials: 'same-origin', headers: { 'Accept': 'application/json' } })
              .then(function(r) { return r.ok ? r.json() : null; })
              .then(function(d) {
                if (d && d.unlock_at) {
                  item.unlockDateISO = d.unlock_at;
                  item.unlockDateObj = parseItemDate(d.unlock_at);
                }
              })
              .catch(function() {});
          }
          return Promise.resolve();
        });

        cachedPlannerItems = parsed;
        lastPlannerFetchTime = Date.now();
        renderUrgentCourseBadges(document.querySelectorAll('.ic-DashboardCard, [data-testid="draggable-card"]'), parsed);
        if (callback) callback(parsed);

        if (enrichTasks.length > 0) {
          Promise.all(enrichTasks).then(function() {
            var finalItems = [];
            for (var k = 0; k < parsed.length; k++) {
              var orig = parsed[k];
              finalItems.push(orig);

              if (orig.unlockDateObj && orig.unlockDateObj.getTime() > now.getTime()) {
                var unlockKey = 'open_' + orig.key;
                if (!dismissedMap[unlockKey]) {
                  finalItems.push({
                    key: unlockKey,
                    plannableType: 'event',
                    plannableId: 'open_' + orig.plannableId,
                    courseId: orig.courseId,
                    type: orig.type === 'quiz' ? 'quiz' : 'event',
                    title: 'Opens: ' + sanitizeTitle(orig.title),
                    course: orig.course,
                    href: orig.href,
                    dateISO: orig.unlockDateISO,
                    dateObj: orig.unlockDateObj,
                    unlockDateISO: null,
                    unlockDateObj: null,
                    isOpenCard: true,
                    points: orig.points,
                    nativeDismissBtn: null
                  });
                }
              }
            }
            cachedPlannerItems = finalItems;
            renderUrgentCourseBadges(document.querySelectorAll('.ic-DashboardCard, [data-testid="draggable-card"]'), finalItems);
            var upList = document.querySelector('#vibe-todo-card-list');
            if (upList) {
              safeStorageGet(['course_nicknames'], function(res) {
                var nicknames = (res && res.course_nicknames) || {};
                var domItems = harvestNativeTodoAndEvents();
                var merged = mergeUpcomingItems(finalItems, domItems);
                populateGroupedCards(upList, merged, DEFAULT_PRESET_ID, nicknames);
              });
            }
          });
        }
      })
      .catch(function() {
        var fallbackItems = harvestNativeTodoAndEvents();
        if (callback) callback(fallbackItems);
      });
  }

  function harvestNativeTodoAndEvents() {
    var items = [];
    var seenKeys = {};
    var dismissedMap = getDismissedTasks();
    var completedMap = getManuallyCompletedTasks();

    var todoNodes = document.querySelectorAll(
      '#right-side .to-do-list li, ' +
      '#right-side .todo-list-item, ' +
      '#right-side .todo, ' +
      '.to-do-list li, ' +
      'div[data-testid^="todo-item-"], ' +
      '.ToDoSidebarItem'
    );

    for (var i = 0; i < todoNodes.length; i++) {
      var node = todoNodes[i];
      if (node.closest('#vibe-side-duo') || node.closest('#vibe-todo-widget') || node.closest('#vibe-graded-widget')) continue;

      var link = node.querySelector('a.todo-item-link') || node.querySelector('a[href*="/courses/"]') || node.querySelector('a');
      var href = link ? link.getAttribute('href') : '#';

      var title = '';
      var titleEl = node.querySelector('.title, .header, h3, h4') || link;
      if (titleEl) title = titleEl.textContent.replace(/\s+/g, ' ').trim();
      if (!title && link) title = (link.getAttribute('title') || link.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();

      var course = '';
      var courseEl = node.querySelector('.sub-title, .todo-details, .context, em, small');
      if (courseEl) course = courseEl.textContent.replace(/\s+/g, ' ').trim();

      var dateStr = '';
      var dateEl = node.querySelector('.date, .event-details-timestring, time');
      if (dateEl) dateStr = dateEl.textContent.trim();

      var dismissBtn = node.querySelector('a.disable_item_link, .delete-item, button.close, [title*="Ignore" i], [aria-label*="Ignore" i], button[data-testid$="-close"], a[role="button"]');

      var key = ('dom_' + title + '|' + course).toLowerCase().replace(/\s+/g, '_');
      if (seenKeys[key] || dismissedMap[key] || completedMap[key] || !title) continue;
      seenKeys[key] = true;

      var isAnnouncement = node.querySelector('.icon-announcement, [class*="announcement"]') || /announcement|welcome|crowdmark/i.test(title);
      var isInbox = window.location.href.indexOf('/conversations') !== -1;
      var isQuiz = /quiz|exam|test/i.test(title);
      var type = isAnnouncement ? 'announcement' : (isQuiz ? 'quiz' : 'assignment');

      var todoCm = (href || '').match(/\/courses\/(\d+)/);
      var todoCid = todoCm ? todoCm[1] : null;

      items.push({
        key: key,
        plannableType: type,
        plannableId: null,
        courseId: todoCid ? String(todoCid) : null,
        title: title || 'Task',
        course: course,
        dateStr: dateStr,
        dateObj: parseItemDate(dateStr),
        href: href,
        type: type,
        points: null,
        nativeDismissBtn: dismissBtn
      });
    }

    var eventNodes = document.querySelectorAll('#right-side .events_list li, #right-side .event, .events_list li');
    for (var j = 0; j < eventNodes.length; j++) {
      var evNode = eventNodes[j];
      if (evNode.closest('#vibe-side-duo') || evNode.closest('#vibe-todo-widget') || evNode.closest('#vibe-graded-widget')) continue;

      var evLink = evNode.querySelector('a[href*="/courses/"]') || evNode.querySelector('a');
      var evHref = evLink ? evLink.getAttribute('href') : '#';

      var evTitle = (evLink ? evLink.textContent : evNode.textContent).replace(/\s+/g, ' ').trim();
      var evCourse = '';
      var evCourseEl = evNode.querySelector('.context, .event-details, em, small');
      if (evCourseEl) evCourse = evCourseEl.textContent.replace(/\s+/g, ' ').trim();

      var evDate = '';
      var evDateEl = evNode.querySelector('.event-details-timestring, .date, time');
      if (evDateEl) evDate = evDateEl.textContent.trim();

      var evDismiss = evNode.querySelector('a.disable_item_link, button.close, [title*="Ignore" i]');

      var evKey = ('dom_' + evTitle + '|' + evCourse).toLowerCase().replace(/\s+/g, '_');
      if (seenKeys[evKey] || dismissedMap[evKey] || !evTitle) continue;
      seenKeys[evKey] = true;

      var evCm = (evHref || '').match(/\/courses\/(\d+)/);
      var evCid = evCm ? evCm[1] : null;

      items.push({
        key: evKey,
        plannableType: 'calendar_event',
        plannableId: null,
        courseId: evCid ? String(evCid) : null,
        title: evTitle || 'Event',
        course: evCourse,
        dateStr: evDate,
        dateObj: parseItemDate(evDate),
        href: evHref,
        type: 'event',
        points: null,
        nativeDismissBtn: evDismiss
      });
    }

    return items;
  }

  function normalizeTextKey(s) {
    return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function getEntityIdentifier(href) {
    if (!href) return null;
    var m = href.match(/\/(assignments|quizzes|discussion_topics|calendar_events)\/(\d+)/);
    return m ? m[1] + '_' + m[2] : null;
  }

  function mergeUpcomingItems(plannerItems, domItems) {
    var merged = [];
    var seenEntities = {};
    var seenNormTitles = {};

    for (var i = 0; i < plannerItems.length; i++) {
      var item = plannerItems[i];
      var entityId = getEntityIdentifier(item.href);
      if (entityId) seenEntities[entityId] = true;

      var normT = normalizeTextKey(item.title);
      if (normT) seenNormTitles[normT] = true;

      merged.push(item);
    }

    for (var j = 0; j < domItems.length; j++) {
      var dItem = domItems[j];
      var dEntityId = getEntityIdentifier(dItem.href);
      if (dEntityId && seenEntities[dEntityId]) {
        continue;
      }

      var dNormT = normalizeTextKey(dItem.title);
      // If a task with the identical normalized title already exists from Planner API, don't duplicate
      if (dNormT && seenNormTitles[dNormT]) {
        continue;
      }

      if (dEntityId) seenEntities[dEntityId] = true;
      if (dNormT) seenNormTitles[dNormT] = true;
      merged.push(dItem);
    }

    merged.sort(function(a, b) {
      var timeA = a.dateObj ? a.dateObj.getTime() : 9999999999999;
      var timeB = b.dateObj ? b.dateObj.getTime() : 9999999999999;
      return timeA - timeB;
    });

    return merged;
  }

  var DEFAULT_COURSE_NICKNAMES = {};

  function formatCourseCodeDisplay(rawText, href, courseId, nicknames) {
    var cId = courseId ? String(courseId) : '';
    if (!cId && href) {
      var m = String(href).match(/\/courses\/(\d+)/);
      if (m) cId = m[1];
    }
    var txt = (rawText || '').trim();

    // 1. FIRST PRIORITY: User custom nicknames from storage or card edits!
    if (nicknames) {
      if (cId && nicknames['c_' + cId]) return nicknames['c_' + cId];
      if (cId && nicknames['id_' + cId]) return nicknames['id_' + cId];
      if (cId && nicknames['code_' + cId]) return nicknames['code_' + cId];

      var codeMatchUser = txt.match(/\b([A-Z]{2,6}\s*\d{2,4}[A-Z]?)\b/i);
      if (codeMatchUser) {
        var cleanCodeUser = codeMatchUser[1].replace(/\s+/g, '').toUpperCase();
        if (nicknames['code_' + cleanCodeUser]) return nicknames['code_' + cleanCodeUser];
      }
    }

    // 2. Automatic Course Code Extraction (e.g. "MATH 251", "CS 101", "BIOL 111")
    var codeMatch = txt.match(/\b([A-Z]{2,6}\s*\d{2,4}[A-Z]?)\b/i);
    if (codeMatch) {
      return codeMatch[1].toUpperCase();
    }

    // 3. Fallback: Clean readable course name (truncated if long)
    if (txt && txt !== 'COURSE' && txt.length <= 25) return txt;
    return txt ? txt.substring(0, 22) + '...' : 'Course';
  }

  function groupItemsByDay(items) {
    var groups = [];
    var groupMap = {};
    var now = new Date();
    var todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var d = item.dateObj;

      // Filter out items without dates, invalid dates, or dates in the past
      if (!d || isNaN(d.getTime()) || d.getTime() < todayMidnight) {
        continue;
      }

      var y = d.getFullYear();
      var m = ('0' + (d.getMonth() + 1)).slice(-2);
      var dayNum = ('0' + d.getDate()).slice(-2);
      var groupKey = y + '-' + m + '-' + dayNum;
      var headerInfo = formatDayGroupHeader(d);

      if (!groupMap[groupKey]) {
        var newGroup = {
          key: groupKey,
          header: headerInfo,
          items: []
        };
        groupMap[groupKey] = newGroup;
        groups.push(newGroup);
      }

      groupMap[groupKey].items.push(item);
    }

    return groups;
  }

  function parseScoreAndGrade(sub, pointsPossible) {
    var score = null;
    var grade = null;
    var isGraded = false;
    var isSubmitted = false;

    if (!sub) return { score: null, grade: null, isGraded: false, isSubmitted: false };

    if (sub.score !== undefined && sub.score !== null) score = sub.score;
    else if (sub.entered_score !== undefined && sub.entered_score !== null) score = sub.entered_score;
    else if (sub.grade !== undefined && sub.grade !== null && !isNaN(parseFloat(sub.grade))) score = parseFloat(sub.grade);

    if (sub.grade !== undefined && sub.grade !== null) grade = String(sub.grade);
    else if (sub.entered_grade !== undefined && sub.entered_grade !== null) grade = String(sub.entered_grade);

    if (sub.workflow_state === 'graded' || score !== null || grade !== null) {
      isGraded = true;
    }
    if (sub.submitted || sub.submitted_at || sub.workflow_state === 'submitted' || sub.workflow_state === 'graded') {
      isSubmitted = true;
    }

    return { score: score, grade: grade, isGraded: isGraded, isSubmitted: isSubmitted };
  }

  function fetchGradedAndSubmittedItems(presetId, callback) {
    if (typeof presetId === 'function') {
      callback = presetId;
      presetId = 'obsidian-dark';
    }
    presetId = presetId || 'obsidian-dark';
    var now = new Date();

    if (cachedGradedItems && (Date.now() - lastGradedFetchTime < 35000)) {
      if (callback) callback(cachedGradedItems);
      return;
    }

    var activeCid = getActiveCourseId();
    var parsedList = [];
    var seenKeys = {};

    function addParsedItem(item) {
      if (!item || !item.title) return;
      var entityId = getEntityIdentifier(item.href);
      var key = entityId || (normalizeTextKey(item.title) + '_' + (item.courseId || ''));
      if (seenKeys[key]) {
        var existing = seenKeys[key];
        if ((existing.score === null || existing.score === undefined) && item.score !== null && item.score !== undefined) {
          existing.score = item.score;
        }
        if (!existing.grade && item.grade) existing.grade = item.grade;
        if ((existing.points === null || existing.points === undefined || existing.points === 0) && item.points !== null && item.points !== undefined && item.points > 0) {
          existing.points = item.points;
        }
        if (!existing.course && item.course) existing.course = item.course;
        if (!existing.courseId && item.courseId) existing.courseId = item.courseId;
        return;
      }
      seenKeys[key] = item;
      parsedList.push(item);
    }

    // 1. If currently inside a course page, fetch course assignments & submissions directly
    var courseFetchPromise = Promise.resolve();
    if (activeCid) {
      courseFetchPromise = fetch('/api/v1/courses/' + activeCid + '/assignments?include[]=submission&order_by=due_at&per_page=100', {
        credentials: 'same-origin',
        headers: { 'Accept': 'application/json' }
      })
      .then(function(r) { return r.ok ? r.json() : []; })
      .then(function(assignments) {
        if (Array.isArray(assignments)) {
          for (var i = 0; i < assignments.length; i++) {
            var a = assignments[i];
            var sub = a.submission;
            if (!sub) continue;

            var parsedSG = parseScoreAndGrade(sub, a.points_possible);
            if (!parsedSG.isGraded && !parsedSG.isSubmitted && sub.workflow_state !== 'pending_review') continue;

            var title = (a.name || a.title || 'Assignment').trim();
            var href = a.html_url || ('/courses/' + activeCid + '/assignments/' + a.id);
            var dueISO = a.due_at || sub.submitted_at || null;
            var subISO = sub.graded_at || sub.submitted_at || null;

            addParsedItem({
              title: title,
              course: '',
              courseId: String(activeCid),
              href: href,
              dateObj: parseItemDate(subISO || dueISO),
              dueDateObj: parseItemDate(dueISO),
              gradedDateObj: parseItemDate(subISO),
              isGraded: parsedSG.isGraded,
              isSubmitted: parsedSG.isSubmitted,
              score: parsedSG.score,
              grade: parsedSG.grade,
              points: (a.points_possible !== undefined && a.points_possible !== null) ? a.points_possible : sub.points_possible
            });
          }
        }
      })
      .catch(function() {});
    }

    // 2. Fetch Activity Stream (includes all recent submissions & grade posts)
    var streamFetchPromise = fetch('/api/v1/users/self/activity_stream?per_page=100', {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    })
    .then(function(r) { return r.ok ? r.json() : []; })
    .then(function(activities) {
      if (Array.isArray(activities)) {
        for (var k = 0; k < activities.length; k++) {
          var act = activities[k];
          if (act.type !== 'Submission' && !act.grade && !act.score && !act.assignment) continue;

          var aTitle = ((act.assignment && act.assignment.title) || act.title || 'Assignment').trim();
          var aHref = act.html_url || (act.assignment && act.assignment.html_url) || '#';
          var aCourse = act.context_name || act.course_title || '';
          var actCid = act.course_id || (act.context_type === 'Course' ? act.context_id : null);

          var actScore = (act.score !== undefined && act.score !== null) ? act.score : (act.entered_score !== undefined ? act.entered_score : null);
          var actGrade = (act.grade !== undefined && act.grade !== null) ? String(act.grade) : null;
          var actPoints = act.points_possible !== undefined ? act.points_possible : (act.assignment ? act.assignment.points_possible : null);
          var actDate = act.graded_at || act.created_at || act.updated_at;

          addParsedItem({
            title: aTitle,
            course: aCourse,
            courseId: actCid ? String(actCid) : null,
            href: aHref,
            dateObj: parseItemDate(actDate),
            dueDateObj: parseItemDate(actDate),
            gradedDateObj: parseItemDate(actDate),
            isGraded: act.workflow_state === 'graded' || actScore !== null || actGrade !== null,
            isSubmitted: true,
            score: actScore,
            grade: actGrade,
            points: actPoints
          });
        }
      }
    })
    .catch(function() {});

    // 3. Fetch Planner Items over 90-day past window
    var start90 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90, 0, 0, 0);
    var endNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59, 999);
    var plannerHistoryUrl = '/api/v1/planner/items?start_date=' + encodeURIComponent(start90.toISOString()) + '&end_date=' + encodeURIComponent(endNow.toISOString()) + '&per_page=100';

    var plannerFetchPromise = fetch(plannerHistoryUrl, {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    })
    .then(function(r) { return r.ok ? r.json() : []; })
    .then(function(data) {
      if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          var rawSub = item.submissions;
          var sub = {};
          if (Array.isArray(rawSub) && rawSub.length > 0) sub = rawSub[0] || {};
          else if (typeof rawSub === 'object' && rawSub !== null) sub = rawSub;
          else if (rawSub === true) sub = { submitted: true };
          if (item.submission && typeof item.submission === 'object') Object.assign(sub, item.submission);

          var plannable = item.plannable || {};
          var isCompleted = !!(item.planner_override && item.planner_override.marked_complete);
          var parsedSG = parseScoreAndGrade(sub, plannable.points_possible);

          if (!parsedSG.isGraded && !parsedSG.isSubmitted && !isCompleted) continue;

          var title = (plannable.title || item.title || 'Assignment').replace(/\s+/g, ' ').trim();
          var course = (item.context_name || item.course_title || '').replace(/\s+/g, ' ').trim();
          var href = item.html_url || plannable.html_url || '#';
          var dueISO = plannable.due_at || item.plannable_date || null;
          var subISO = sub && (sub.graded_at || sub.submitted_at);
          var dateISO = subISO || dueISO || null;

          var gCm = (href || '').match(/\/courses\/(\d+)/);
          var gCid = item.course_id || (item.context_type === 'Course' ? item.context_id : null) || (plannable ? plannable.course_id : null) || (gCm ? gCm[1] : null);

          addParsedItem({
            title: title,
            course: course,
            courseId: gCid ? String(gCid) : null,
            href: href,
            dateObj: parseItemDate(dateISO),
            dueDateObj: parseItemDate(dueISO),
            gradedDateObj: parseItemDate(subISO),
            isGraded: parsedSG.isGraded,
            isSubmitted: parsedSG.isSubmitted,
            score: parsedSG.score,
            grade: parsedSG.grade,
            points: (plannable.points_possible !== undefined && plannable.points_possible !== null) ? plannable.points_possible : ((sub && sub.points_possible !== undefined) ? sub.points_possible : null)
          });
        }
      }
    })
    .catch(function() {});

    // 4. Harvest DOM Feedback from Native Sidebar
    var domFeedbackNodes = document.querySelectorAll('#right-side .recent_feedback li, .recent_feedback li');
    for (var f = 0; f < domFeedbackNodes.length; f++) {
      var fNode = domFeedbackNodes[f];
      var fLink = fNode.querySelector('a') || fNode;
      var fHref = fLink ? fLink.getAttribute('href') : '#';
      var fTitle = (fLink ? fLink.textContent : fNode.textContent).trim();
      var fScoreMatch = (fNode.textContent || '').match(/(\d+(?:\.\d+)?)\s*(?:\/\s*(\d+(?:\.\d+)?))?\s*(?:pts|points|%)/i);
      var fScore = fScoreMatch ? parseFloat(fScoreMatch[1]) : null;
      var fPts = (fScoreMatch && fScoreMatch[2]) ? parseFloat(fScoreMatch[2]) : null;

      var fCm = (fHref || '').match(/\/courses\/(\d+)/);
      var fCid = fCm ? fCm[1] : null;

      addParsedItem({
        title: fTitle || 'Feedback',
        course: '',
        courseId: fCid ? String(fCid) : null,
        href: fHref,
        dateObj: new Date(),
        dueDateObj: new Date(),
        gradedDateObj: new Date(),
        isGraded: true,
        isSubmitted: true,
        score: fScore,
        grade: null,
        points: fPts
      });
    }

    Promise.all([courseFetchPromise, streamFetchPromise, plannerFetchPromise]).then(function() {
      var completedMap = getManuallyCompletedTasks();
      for (var compKey in completedMap) {
        if (completedMap.hasOwnProperty(compKey)) {
          var cItem = completedMap[compKey];
          addParsedItem({
            title: cItem.title,
            course: cItem.course,
            courseId: cItem.courseId,
            href: cItem.href,
            dateObj: parseItemDate(cItem.dateObj),
            dueDateObj: parseItemDate(cItem.dueDateObj),
            gradedDateObj: parseItemDate(cItem.gradedDateObj),
            isGraded: false,
            isSubmitted: false,
            isCompleted: true,
            score: null,
            grade: 'Complete',
            points: cItem.points
          });
        }
      }

      parsedList.sort(function(a, b) {
        var timeA = (a.gradedDateObj || a.dueDateObj || a.dateObj) ? (a.gradedDateObj || a.dueDateObj || a.dateObj).getTime() : 0;
        var timeB = (b.gradedDateObj || b.dueDateObj || b.dateObj) ? (b.gradedDateObj || b.dueDateObj || b.dateObj).getTime() : 0;
        return timeB - timeA;
      });

      cachedGradedItems = parsedList;
      lastGradedFetchTime = Date.now();
      if (callback) callback(parsedList);

      // Background enrich any items where score or points is missing
      var enrichTasks = parsedList
        .filter(function(x) {
          return (x.score === null || x.points === null || x.points === undefined) && x.href && x.href.indexOf('/assignments/') !== -1;
        })
        .map(function(item) {
          var m = item.href.match(/\/courses\/(\d+)\/assignments\/(\d+)/);
          if (m) {
            return fetch('/api/v1/courses/' + m[1] + '/assignments/' + m[2] + '/submissions/self?include[]=assignment', { credentials: 'same-origin', headers: { 'Accept': 'application/json' } })
              .then(function(r) { return r.ok ? r.json() : null; })
              .then(function(subData) {
                if (subData) {
                  if (subData.score !== undefined && subData.score !== null) item.score = subData.score;
                  else if (subData.entered_score !== undefined && subData.entered_score !== null) item.score = subData.entered_score;
                  if (subData.grade !== undefined && subData.grade !== null) item.grade = String(subData.grade);
                  else if (subData.entered_grade !== undefined && subData.entered_grade !== null) item.grade = String(subData.entered_grade);
                  if (subData.assignment && subData.assignment.points_possible !== undefined && subData.assignment.points_possible !== null) {
                    item.points = subData.assignment.points_possible;
                  }
                  if (subData.workflow_state === 'graded' || item.score !== null || item.grade !== null) {
                    item.isGraded = true;
                  }
                  if (subData.submitted_at || subData.workflow_state === 'submitted') {
                    item.isSubmitted = true;
                  }
                }
              })
              .catch(function() {});
          }
          return Promise.resolve();
        });

      if (enrichTasks.length > 0) {
        Promise.all(enrichTasks).then(function() {
          var gradList = document.querySelector('#vibe-graded-card-list');
          if (gradList) {
            safeStorageGet(['course_nicknames'], function(res) {
              var nicknames = (res && res.course_nicknames) || {};
              populateGradedCards(gradList, parsedList, presetId, nicknames);
            });
          }
        });
      }
    });
  }

  function initTodoReformatter(presetId) {
    // Never inject tasks/completed sidebar duo on quiz pages
    if (document.body && (document.body.classList.contains('quizzes') || document.body.classList.contains('vibe-quiz-page') || window.location.href.indexOf('/quizzes') !== -1 || window.location.href.indexOf('/grades') !== -1)) {
      return;
    }
    var rightSide = document.getElementById('right-side') || document.getElementById('right-side-wrapper');
    if (!rightSide) return;

    hideNativeTodoList(rightSide);

    var duoContainer = document.getElementById('vibe-side-duo');
    if (!duoContainer || !rightSide.contains(duoContainer)) {
      if (duoContainer && duoContainer.parentElement) {
        duoContainer.remove();
      }
      duoContainer = document.createElement('div');
      duoContainer.id = 'vibe-side-duo';
      duoContainer.className = 'vibe-sidebar-duo';
      rightSide.insertBefore(duoContainer, rightSide.firstChild);
    }

    if (!duoContainer.querySelector('#vibe-todo-widget')) {
      renderReformattedWidget(duoContainer, cachedPlannerItems || [], cachedGradedItems || [], presetId);
    } else if (cachedPlannerItems && cachedGradedItems) {
      renderReformattedWidget(duoContainer, cachedPlannerItems, cachedGradedItems, presetId);
    }

    if (isRenderingWidget) return;
    isRenderingWidget = true;

    fetchPlannerItems(15, function(plannerItems) {
      try {
        var domItems = harvestNativeTodoAndEvents();
        var upcomingItems = mergeUpcomingItems(plannerItems, domItems);

        renderUrgentCourseBadges(document.querySelectorAll('.ic-DashboardCard, [data-testid="draggable-card"]'), upcomingItems);

        fetchGradedAndSubmittedItems(presetId, function(gradedItems) {
          try {
            hideNativeTodoList(rightSide);
            renderReformattedWidget(duoContainer, upcomingItems, gradedItems, presetId);
          } catch(e) {
            console.error('[CanvasCustomizer] Error rendering widgets:', e);
          } finally {
            isRenderingWidget = false;
          }
        });
      } catch(e) {
        console.error('[CanvasCustomizer] Error processing items:', e);
        isRenderingWidget = false;
      }
    });
  }

  function renderReformattedWidget(duoContainer, upcomingItems, gradedItems, presetId) {
    if (!duoContainer) return;

    var html =
      '<div class="vibe-feed-card" id="vibe-todo-widget">' +
        '<div class="vibe-feed-header">' +
          '<div class="vibe-feed-title-wrap">' +
            '<span class="vibe-feed-title">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>' +
              '<span>Tasks</span>' +
            '</span>' +
            '<span class="vibe-feed-badge" id="vibe-todo-counter">0</span>' +
          '</div>' +
          '<div class="vibe-feed-header-actions">' +
            '<button id="vibe-todo-restore-btn" class="vibe-feed-action-btn" type="button" title="Restore all dismissed tasks">↻ Restore</button>' +
            '<a class="vibe-feed-cal-link" href="/calendar" title="View Full Calendar">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' +
            '</a>' +
          '</div>' +
        '</div>' +
        '<div class="vibe-todo-list" id="vibe-todo-card-list"></div>' +
      '</div>' +
      '<div class="vibe-feed-card" id="vibe-graded-widget">' +
        '<div class="vibe-feed-header">' +
          '<div class="vibe-feed-title-wrap">' +
            '<span class="vibe-feed-title">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>' +
              '<span>Completed</span>' +
            '</span>' +
            '<span class="vibe-feed-badge" id="vibe-graded-counter">0</span>' +
          '</div>' +
          '<div class="vibe-feed-header-actions">' +
            '<a class="vibe-feed-cal-link" href="/grades" title="View All Grades">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>' +
            '</a>' +
          '</div>' +
        '</div>' +
        '<div class="vibe-graded-list" id="vibe-graded-card-list"></div>' +
      '</div>';

    duoContainer.innerHTML = html;

    // Wire restore button on Tasks header
    var todoRestoreBtn = duoContainer.querySelector('#vibe-todo-restore-btn');
    if (todoRestoreBtn) {
      todoRestoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        restoreAllDismissedItems(presetId);
      });
    }

    var upList = duoContainer.querySelector('#vibe-todo-card-list');
    var gradList = duoContainer.querySelector('#vibe-graded-card-list');

    safeStorageGet(['course_nicknames'], function(res) {
      var nicknames = (res && res.course_nicknames) || {};
      populateGroupedCards(upList, upcomingItems, presetId, nicknames);
      populateGradedCards(gradList, gradedItems, presetId, nicknames);
    });
  }

  // Revamped Minimalist Graded Cards (Clean, Tabular & High-Contrast)
  function populateGradedCards(container, items, presetId, nicknames) {
    if (!container) return;
    container.innerHTML = '';
    var activeCid = getActiveCourseId();
    var filteredItems = items || [];
    if (activeCid) {
      filteredItems = filteredItems.filter(function(item) {
        if (item.courseId && String(item.courseId) === String(activeCid)) return true;
        if (item.href && item.href.indexOf('/courses/' + activeCid) !== -1) return true;
        return false;
      });
    }

    var dismissedGraded = getDismissedGraded();
    filteredItems = filteredItems.filter(function(item) {
      var k = item.key || ('graded_' + (item.id || (item.title + '_' + (item.courseId || item.course || '') + '_' + (item.score !== null ? item.score : '') + '_' + (item.grade || ''))));
      item.key = k;
      return !dismissedGraded[k];
    });

    var counter = document.getElementById('vibe-graded-counter');
    if (counter) {
      counter.textContent = String(filteredItems.length);
    }

    if (filteredItems.length === 0) {
      var emptyMsg = activeCid ? '✨ No recently completed items for this course.' : '✨ No recently completed items found.';
      container.innerHTML = '<div class="vibe-todo-empty">' + emptyMsg + '</div>';
      return;
    }

    var listEl = document.createElement('div');
    listEl.className = 'vibe-minimal-list';

    for (var i = 0; i < filteredItems.length; i++) {
      (function(item, idx) {
        var row = document.createElement('div');
        row.className = 'vibe-minimal-row';

        var subject = detectCourseSubject(item.course + ' ' + item.title);
        var courseColor = getCourseColor(presetId, subject, idx);
        row.style.setProperty('--item-course-color', courseColor);

        var courseDisplay = formatCourseCodeDisplay(item.course, item.href, item.courseId, nicknames);
        var cleanTitle = sanitizeTitle(item.title);

        var hasNumericalScore = (item.score !== null && item.score !== undefined);
        var hasGradeStr = !!(item.grade && item.grade.trim() && item.grade !== 'null');
        var isCompleted = !hasNumericalScore && !hasGradeStr && !item.isSubmitted;

        var scoreClass = 'vibe-minimal-score-tag';
        var scoreText = 'Done';

        if (hasNumericalScore) {
          scoreClass = 'vibe-minimal-score-tag';
          if (item.points !== null && item.points !== undefined && item.points > 0) {
            scoreText = item.score + '/' + item.points;
          } else if (hasGradeStr && item.grade.indexOf('/') !== -1) {
            scoreText = item.grade.replace(/\s*pts/i, '');
          } else {
            scoreText = item.score + ' pts';
          }
        } else if (hasGradeStr) {
          if (/complete/i.test(item.grade)) {
            scoreText = '✓ Done';
          } else if (/incomplete/i.test(item.grade)) {
            scoreText = 'Incomplete';
            scoreClass = 'vibe-minimal-score-tag vibe-score-pending';
          } else if (item.points !== null && item.points !== undefined && item.points > 0 && !isNaN(parseFloat(item.grade))) {
            scoreText = parseFloat(item.grade) + '/' + item.points;
          } else {
            scoreText = item.grade;
          }
        } else if (isCompleted) {
          scoreText = '✓ Done';
        } else {
          scoreText = 'Submitted';
          scoreClass = 'vibe-minimal-score-tag vibe-score-pending';
        }

        var relativeDateStr = 'Done';
        var activeDate = item.gradedDateObj || item.dueDateObj || item.dateObj;
        if (activeDate) {
          var now = new Date();
          var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
          var targetStart = new Date(activeDate.getFullYear(), activeDate.getMonth(), activeDate.getDate()).getTime();
          var diff = Math.round((todayStart - targetStart) / (1000 * 60 * 60 * 24));
          var mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          var dStr = mNames[activeDate.getMonth()] + ' ' + activeDate.getDate();
          if (diff === 0) relativeDateStr = 'Today';
          else if (diff === 1) relativeDateStr = 'Yesterday';
          else if (diff > 1 && diff <= 6) relativeDateStr = diff + 'd ago';
          else relativeDateStr = dStr;
        }

        row.innerHTML =
          '<button class="vibe-minimal-uncomplete-btn" type="button" title="Move back to Tasks" aria-label="Move back to Tasks">' +
            '<span class="vibe-minimal-graded-icon">✓</span>' +
          '</button>' +
          '<div class="vibe-minimal-body">' +
            '<span class="vibe-minimal-title" title="' + cleanTitle + '">' + cleanTitle + '</span>' +
            '<div class="vibe-minimal-meta">' +
              '<span class="vibe-minimal-course" style="color: ' + courseColor + ' !important;">' + (escapeHtml(courseDisplay || (subject ? subject.toUpperCase() : 'COURSE'))) + '</span>' +
              '<span class="vibe-minimal-sep">·</span>' +
              '<span class="vibe-minimal-time">' + relativeDateStr + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="vibe-minimal-actions">' +
            '<span class="' + scoreClass + '">' + escapeHtml(scoreText) + '</span>' +
          '</div>';

        row.addEventListener('click', function(e) {
          if (e.target.closest('.vibe-minimal-uncomplete-btn')) return;
          if (item.href && item.href !== '#' && !item.href.trim().toLowerCase().startsWith("javascript:")) {
            window.location.href = item.href;
          }
        });

        var uncompleteBtn = row.querySelector('.vibe-minimal-uncomplete-btn');
        if (uncompleteBtn) {
          uncompleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            row.classList.add('vibe-row-completed');
            removeManuallyCompletedTask(item.key);
            unDismissTask(item.key);
            cachedPlannerItems = null;
            lastPlannerFetchTime = 0;
            cachedGradedItems = null;
            lastGradedFetchTime = 0;
            setTimeout(function() {
              if (row.parentNode) row.parentNode.removeChild(row);
              updateGradedWidgetCount();
              safeStorageGet(['course_nicknames', 'active_preset'], function(res) {
                var nicks = (res && res.course_nicknames) || {};
                var actPreset = (res && res.active_preset) || DEFAULT_PRESET_ID;
                fetchPlannerItems(15, function(pItems) {
                  var domItems = harvestNativeTodoAndEvents();
                  var upItems = mergeUpcomingItems(pItems, domItems);
                  var upList = document.getElementById('vibe-todo-card-list');
                  if (upList) {
                    populateGroupedCards(upList, upItems, actPreset, nicks);
                  }
                });
              });
            }, 180);
          });
        }

        listEl.appendChild(row);
      })(filteredItems[i], i);
    }

    container.appendChild(listEl);
  }

  function insertNewlyCompletedToGradedList(item, presetId, nicknames) {
    if (!item) return;
    var gradList = document.getElementById('vibe-graded-card-list');
    if (!gradList) return;

    var emptyEl = gradList.querySelector('.vibe-todo-empty');
    if (emptyEl) emptyEl.remove();

    var listEl = gradList.querySelector('.vibe-minimal-list');
    if (!listEl) {
      listEl = document.createElement('div');
      listEl.className = 'vibe-minimal-list';
      gradList.appendChild(listEl);
    }

    var row = document.createElement('div');
    row.className = 'vibe-minimal-row';

    var subject = detectCourseSubject((item.course || '') + ' ' + (item.title || ''));
    var courseColor = getCourseColor(presetId, subject, 0);
    row.style.setProperty('--item-course-color', courseColor);

    var courseDisplay = formatCourseCodeDisplay(item.course, item.href, item.courseId, nicknames);
    var cleanTitle = sanitizeTitle(item.title || 'Completed Task');

    row.innerHTML =
      '<button class="vibe-minimal-uncomplete-btn" type="button" title="Move back to Tasks" aria-label="Move back to Tasks">' +
        '<span class="vibe-minimal-graded-icon">✓</span>' +
      '</button>' +
      '<div class="vibe-minimal-body">' +
        '<span class="vibe-minimal-title" title="' + cleanTitle + '">' + cleanTitle + '</span>' +
        '<div class="vibe-minimal-meta">' +
          '<span class="vibe-minimal-course" style="color: ' + courseColor + ' !important;">' + (escapeHtml(courseDisplay || (subject ? subject.toUpperCase() : 'COURSE'))) + '</span>' +
          '<span class="vibe-minimal-sep">·</span>' +
          '<span class="vibe-minimal-time">Today</span>' +
        '</div>' +
      '</div>' +
      '<div class="vibe-minimal-actions">' +
        '<span class="vibe-minimal-score-tag vibe-score-pending">Ungraded</span>' +
      '</div>';

    row.addEventListener('click', function(e) {
      if (e.target.closest('.vibe-minimal-uncomplete-btn')) return;
      if (item.href && item.href !== '#') {
        window.location.href = item.href;
      }
    });

    var uncompleteBtn = row.querySelector('.vibe-minimal-uncomplete-btn');
    if (uncompleteBtn) {
      uncompleteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        row.classList.add('vibe-row-completed');
        removeManuallyCompletedTask(item.key);
        unDismissTask(item.key);
        cachedPlannerItems = null;
        lastPlannerFetchTime = 0;
        cachedGradedItems = null;
        lastGradedFetchTime = 0;
        setTimeout(function() {
          if (row.parentNode) row.parentNode.removeChild(row);
          updateGradedWidgetCount();
          safeStorageGet(['course_nicknames', 'active_preset'], function(res) {
            var nicks = (res && res.course_nicknames) || {};
            var actPreset = (res && res.active_preset) || DEFAULT_PRESET_ID;
            fetchPlannerItems(15, function(pItems) {
              var domItems = harvestNativeTodoAndEvents();
              var upItems = mergeUpcomingItems(pItems, domItems);
              var upList = document.getElementById('vibe-todo-card-list');
              if (upList) {
                populateGroupedCards(upList, upItems, actPreset, nicks);
              }
            });
          });
        }, 180);
      });
    }

    listEl.insertBefore(row, listEl.firstChild);
    updateGradedWidgetCount();
  }

  function updateGradedWidgetCount() {
    var gradList = document.getElementById('vibe-graded-card-list');
    var remaining = gradList ? gradList.querySelectorAll('.vibe-minimal-row:not(.vibe-row-completed), .vibe-graded-card:not(.vibe-dismissing)').length : 0;
    var counter = document.getElementById('vibe-graded-counter');
    if (counter) {
      counter.textContent = String(remaining);
    }
    if (remaining === 0 && gradList) {
      var activeCid = getActiveCourseId();
      var emptyMsg = activeCid ? '✨ No recently completed items for this course.' : '✨ No recently completed items found.';
      gradList.innerHTML = '<div class="vibe-todo-empty">' + emptyMsg + '</div>';
    }
  }

  // Revamped Minimalist Grouped Cards (Clean Checklist Architecture)
  function populateGroupedCards(container, items, presetId, nicknames) {
    if (!container) return;
    container.innerHTML = '';
    var activeCid = getActiveCourseId();
    var filteredItems = items || [];
    if (activeCid) {
      filteredItems = filteredItems.filter(function(item) {
        if (item.courseId && String(item.courseId) === String(activeCid)) return true;
        if (item.href && item.href.indexOf('/courses/' + activeCid) !== -1) return true;
        return false;
      });
    }

    var groups = groupItemsByDay(filteredItems);

    var totalValidItems = 0;
    for (var g0 = 0; g0 < groups.length; g0++) {
      totalValidItems += groups[g0].items.length;
    }

    var counter = document.getElementById('vibe-todo-counter');
    if (counter) {
      counter.textContent = String(totalValidItems);
    }

    if (totalValidItems === 0) {
      var emptyMsg = activeCid ? '✨ All caught up! Nothing due for this course in the next 10 days.' : '✨ All caught up! Nothing due in the next 10 days.';
      container.innerHTML = '<div class="vibe-todo-empty">' + emptyMsg + '</div>';
      return;
    }

    var cardIndex = 0;
    for (var g = 0; g < groups.length; g++) {
      var group = groups[g];
      var groupEl = document.createElement('div');
      groupEl.className = 'vibe-minimal-day-section';
      groupEl.setAttribute('data-day-key', group.key);

      var labelClass = 'vibe-minimal-day-label';
      if (group.header.isToday) {
        labelClass += ' is-today';
      }

      var countStr = String(group.items.length);

      groupEl.innerHTML =
        '<div class="vibe-minimal-day-header">' +
          '<span class="' + labelClass + '">' + group.header.label + '</span>' +
          '<span class="vibe-minimal-day-line"></span>' +
          '<span class="vibe-minimal-day-count">' + countStr + '</span>' +
        '</div>' +
        '<div class="vibe-minimal-list"></div>';

      var cardsContainer = groupEl.querySelector('.vibe-minimal-list');

      for (var i = 0; i < group.items.length; i++) {
        (function(item, idx) {
          var row = document.createElement('div');
          row.className = 'vibe-minimal-row';
          row.setAttribute('data-key', item.key);

          var urgency = getUrgencyDetails(item.dateObj, item);
          var subject = detectCourseSubject(item.course + ' ' + item.title);
          var courseColor = getCourseColor(presetId, subject, idx);
          row.style.setProperty('--item-course-color', courseColor);

          var courseDisplay = formatCourseCodeDisplay(item.course, item.href, item.courseId, nicknames);
          var cleanTitle = sanitizeTitle(item.title);

          var timeStr = urgency.label || '';
          var timeUrgencyClass = '';
          if (urgency.modifier === 'vibe-urgency-critical' || urgency.modifier === 'vibe-urgency-high') {
            timeUrgencyClass = 'is-urgent';
          } else if (urgency.modifier === 'vibe-urgency-soon') {
            timeUrgencyClass = 'is-soon';
          }

          row.innerHTML =
            '<button class="vibe-minimal-check" type="button" title="Complete task" aria-label="Complete task">' +
              '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
            '</button>' +
            '<div class="vibe-minimal-body">' +
              '<span class="vibe-minimal-title" title="' + cleanTitle + '">' + cleanTitle + '</span>' +
              '<div class="vibe-minimal-meta">' +
                '<span class="vibe-minimal-course" style="color: ' + courseColor + ' !important;">' + (escapeHtml(courseDisplay || (subject ? subject.toUpperCase() : 'COURSE'))) + '</span>' +
                '<span class="vibe-minimal-sep">·</span>' +
                '<span class="vibe-minimal-time ' + timeUrgencyClass + '">' + timeStr + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="vibe-minimal-actions">' +
              '<button class="vibe-minimal-dismiss" type="button" title="Dismiss task" aria-label="Dismiss task">' +
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
              '</button>' +
            '</div>';

          row.addEventListener('click', function(e) {
            if (e.target.closest('.vibe-minimal-check') || e.target.closest('.vibe-minimal-dismiss')) return;
            if (item.href && item.href !== '#') {
              window.location.href = item.href;
            }
          });

          var checkBtn = row.querySelector('.vibe-minimal-check');
          if (checkBtn) {
            checkBtn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              checkBtn.classList.add('checked');
              row.classList.add('vibe-row-completed');
              saveManuallyCompletedTask(item);
              showUndoToast(item, 'todo', presetId);
              setTimeout(function() {
                var parentGroup = row.closest('.vibe-minimal-day-section');
                if (row.parentNode) row.parentNode.removeChild(row);
                if (parentGroup) {
                  var remainingInGroup = parentGroup.querySelectorAll('.vibe-minimal-row:not(.vibe-row-completed)').length;
                  if (remainingInGroup === 0 && parentGroup.parentNode) {
                    parentGroup.parentNode.removeChild(parentGroup);
                  } else {
                    var countEl = parentGroup.querySelector('.vibe-minimal-day-count');
                    if (countEl) countEl.textContent = String(remainingInGroup);
                  }
                }
                updateTodoWidgetCount();
                insertNewlyCompletedToGradedList(item, presetId, nicknames);
              }, 180);
            });
          }

          var dismissBtn = row.querySelector('.vibe-minimal-dismiss');
          if (dismissBtn) {
            dismissBtn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              row.classList.add('vibe-row-completed');
              saveDismissedTask(item.key);
              showUndoToast(item, 'todo', presetId);
              setTimeout(function() {
                var parentGroup = row.closest('.vibe-minimal-day-section');
                if (row.parentNode) row.parentNode.removeChild(row);
                if (parentGroup) {
                  var remainingInGroup = parentGroup.querySelectorAll('.vibe-minimal-row:not(.vibe-row-completed)').length;
                  if (remainingInGroup === 0 && parentGroup.parentNode) {
                    parentGroup.parentNode.removeChild(parentGroup);
                  } else {
                    var countEl = parentGroup.querySelector('.vibe-minimal-day-count');
                    if (countEl) countEl.textContent = String(remainingInGroup);
                  }
                }
                updateTodoWidgetCount();
              }, 180);
            });
          }

          cardsContainer.appendChild(row);
        })(group.items[i], cardIndex++);
      }

      container.appendChild(groupEl);
    }
  }

  function updateTodoWidgetCount() {
    var upList = document.getElementById('vibe-todo-card-list');
    var remaining = upList ? upList.querySelectorAll('.vibe-minimal-row:not(.vibe-row-completed), .vibe-todo-card:not(.vibe-dismissing)').length : 0;
    var counter = document.getElementById('vibe-todo-counter');
    if (counter) {
      counter.textContent = String(remaining);
    }
    if (remaining === 0 && upList) {
      var activeCid = getActiveCourseId();
      var emptyMsg = activeCid ? '✨ All caught up! Nothing due for this course in the next 10 days.' : '✨ All caught up! Nothing due in the next 10 days.';
      upList.innerHTML = '<div class="vibe-todo-empty">' + emptyMsg + '</div>';
    }
  }

  function updateWidgetCount() {
    var upList = document.getElementById('vibe-todo-card-list');
    var remaining = upList ? upList.querySelectorAll('.vibe-todo-card:not(.vibe-dismissing)').length : 0;

    var counter = document.getElementById('vibe-todo-counter');
    if (counter) {
      counter.textContent = remaining === 1 ? '1 Task' : remaining + ' Tasks';
    }

    if (upList) {
      var groups = upList.querySelectorAll('.vibe-todo-day-group');
      for (var g = 0; g < groups.length; g++) {
        var visibleCards = groups[g].querySelectorAll('.vibe-todo-card:not(.vibe-dismissing)');
        if (visibleCards.length === 0) {
          groups[g].remove();
        } else {
          var countBadge = groups[g].querySelector('.vibe-todo-day-count');
          if (countBadge) {
            countBadge.textContent = visibleCards.length === 1 ? '1 item' : visibleCards.length + ' items';
          }
        }
      }

      if (remaining === 0) {
        upList.innerHTML = '<div class="vibe-todo-empty">✨ All caught up! Nothing due in the next 10 days.</div>';
      }
    }
  }

  function attachDragToDismiss(cardEl, dismissBtnEl, item) {
    var startX = 0;
    var currentX = 0;
    var isDragging = false;
    var hasMoved = false;

    function onMouseDown(e) {
      if (e.target.closest('.vibe-todo-dismiss')) return;
      if (e.button !== 0) return;

      startX = e.clientX;
      currentX = e.clientX;
      isDragging = true;
      hasMoved = false;

      cardEl.style.transition = 'none';

      function onMouseMove(moveEvent) {
        if (!isDragging) return;
        currentX = moveEvent.clientX;
        var diffX = currentX - startX;

        if (Math.abs(diffX) > 6) {
          hasMoved = true;
          cardEl.style.cursor = 'grabbing';
          moveEvent.preventDefault();
        }

        if (hasMoved) {
          var rot = diffX * 0.035;
          cardEl.style.transform = 'translateX(' + diffX + 'px) rotate(' + rot + 'deg)';
          var opacity = Math.max(0.15, 1 - Math.abs(diffX) / 260);
          cardEl.style.opacity = opacity;
        }
      }

      function onMouseUp(upEvent) {
        if (!isDragging) return;
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        cardEl.style.cursor = 'grab';
        var diffX = currentX - startX;

        if (hasMoved && Math.abs(diffX) > 70) {
          var direction = diffX > 0 ? 1 : -1;
          executeDismissAnimation(cardEl, direction, item);
        } else if (hasMoved) {
          cardEl.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease';
          cardEl.style.transform = 'translateX(0px) rotate(0deg)';
          cardEl.style.opacity = '1';
        } else {
          if (item.href && item.href !== '#' && !upEvent.target.closest('.vibe-todo-dismiss')) {
            window.location.href = item.href;
          }
        }
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    cardEl.addEventListener('mousedown', onMouseDown);

    cardEl.addEventListener('touchstart', function(e) {
      if (e.target.closest('.vibe-todo-dismiss')) return;
      var touch = e.touches[0];
      startX = touch.clientX;
      currentX = touch.clientX;
      isDragging = true;
      hasMoved = false;
      cardEl.style.transition = 'none';
    }, { passive: true });

    cardEl.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      var touch = e.touches[0];
      currentX = touch.clientX;
      var diffX = currentX - startX;
      if (Math.abs(diffX) > 6) hasMoved = true;
      if (hasMoved) {
        var rot = diffX * 0.035;
        cardEl.style.transform = 'translateX(' + diffX + 'px) rotate(' + rot + 'deg)';
        cardEl.style.opacity = Math.max(0.15, 1 - Math.abs(diffX) / 260);
      }
    }, { passive: true });

    cardEl.addEventListener('touchend', function() {
      if (!isDragging) return;
      isDragging = false;
      var diffX = currentX - startX;
      if (hasMoved && Math.abs(diffX) > 70) {
        var direction = diffX > 0 ? 1 : -1;
        executeDismissAnimation(cardEl, direction, item);
      } else if (hasMoved) {
        cardEl.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease';
        cardEl.style.transform = 'translateX(0px) rotate(0deg)';
        cardEl.style.opacity = '1';
      }
    });

    if (dismissBtnEl) {
      dismissBtnEl.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        executeDismissAnimation(cardEl, 1, item);
      });
    }
  }

  function executeDismissAnimation(cardEl, direction, item) {
    saveDismissedTask(item.key);
    saveManuallyCompletedTask(item);
    var dir = direction || 1;
    showUndoToast(item, 'task', DEFAULT_PRESET_ID);
    smoothDismissCard(cardEl, dir, function() {
      if (item.nativeDismissBtn) {
        try { item.nativeDismissBtn.click(); } catch (err) {}
      }
      if (item.plannableType && item.plannableId) {
        try {
          fetch('/api/v1/planner/overrides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({
              plannable_type: item.plannableType,
              plannable_id: item.plannableId,
              marked_complete: true,
              dismissed: true
            })
          }).catch(function() {});
        } catch (e) {}
      }
      updateWidgetCount();

      // Immediately refresh and animate into Graded & Done
      var gradList = document.getElementById('vibe-graded-card-list');
      if (gradList) {
        safeStorageGet(['course_nicknames', 'active_preset'], function(res) {
          var nicknames = (res && res.course_nicknames) || {};
          var activePreset = (res && res.active_preset) || DEFAULT_PRESET_ID;
          fetchGradedAndSubmittedItems(activePreset, function(gradedItems) {
            populateGradedCards(gradList, gradedItems, activePreset, nicknames);
          });
        });
      }
    });
  }

  // ── Silky Ink Theme Transition ─────────────────────────────
  function playInkTransition(targetPreset, applyFn) {
    if (!targetPreset || !targetPreset.colors) {
      applyFn();
      return;
    }
    var targetBg = targetPreset.colors['background-0'] || '#242018';
    var maxRadius = Math.max(window.innerWidth, window.innerHeight) * 2.6 + 'px';
    var ov = document.createElement('div');
    ov.style.cssText = [
      'position:fixed', 'top:50%', 'left:50%', 'width:0', 'height:0',
      'border-radius:50%', 'background:' + targetBg,
      'transform:translate(-50%,-50%)', 'z-index:2147483646',
      'pointer-events:none',
      'transition:width 0.32s cubic-bezier(0.2,0.8,0.2,1),height 0.32s cubic-bezier(0.2,0.8,0.2,1),opacity 0.22s ease'
    ].join(';') + ';';

    document.body.appendChild(ov);
    void ov.offsetHeight;
    ov.style.width = maxRadius;
    ov.style.height = maxRadius;

    setTimeout(function() {
      applyFn();
      ov.style.opacity = '0';
      setTimeout(function() {
        if (ov.parentNode) ov.parentNode.removeChild(ov);
      }, 230);
    }, 280);
  }

  // ── Top Course Navigation Bar ───────────────────────────────
  var courseNavTimer = null;
  var courseNavObserver = null;
  var courseNavBadgeObserver = null;

  function extractCourseNavBadge(rawA) {
    if (!rawA) return null;
    var parent = rawA.closest('li, .section') || rawA;
    var badgeEl = parent.querySelector(
      '.nav-badge, .badge, .count, .unread-grade, .unread-count, [class*="badge"], [class*="unread"], [data-testid*="badge"]'
    );
    if (badgeEl) {
      var txt = (badgeEl.textContent || '').trim();
      var numMatch = txt.match(/\d+\+?/);
      if (numMatch) return numMatch[0];
    }
    // Check aria-label / title fallback (e.g. "Grades (1 unread)")
    var aria = (rawA.getAttribute('aria-label') || '') + ' ' +
               (parent.getAttribute('aria-label') || '') + ' ' +
               (rawA.getAttribute('title') || '');
    var ariaMatch = aria.match(/(\d+)\s*(unread|new|notification|alert)/i);
    if (ariaMatch) return ariaMatch[1];
    return null;
  }

  function extractCourseNavLabel(rawA) {
    if (!rawA) return '';
    var clone = rawA.cloneNode(true);
    var badges = clone.querySelectorAll(
      '.nav-badge, .badge, .count, .unread-grade, .unread-count, .screenreader-only, [class*="badge"], [class*="unread"], [class*="screenreader"]'
    );
    for (var b = 0; b < badges.length; b++) {
      badges[b].remove();
    }
    return (clone.textContent || '').trim().replace(/\s+/g, ' ');
  }

  function syncCourseNavBadges() {
    var nav = document.getElementById('vibe-course-nav');
    if (!nav) return;
    var rawLinks = document.querySelectorAll(
      '#section-tabs a, #left-side nav a, nav[aria-label*="Course" i] a, #left-side a[id$="-link"], #left-side a'
    );
    if (!rawLinks || rawLinks.length === 0) return;

    var pills = nav.querySelectorAll('.vibe-course-nav-pill');
    for (var p = 0; p < pills.length; p++) {
      var pill = pills[p];
      var pillHref = (pill.getAttribute('href') || '').replace(/\/$/, '');
      for (var j = 0; j < rawLinks.length; j++) {
        var rawA = rawLinks[j];
        var rHref = (rawA.getAttribute('href') || '').replace(/\/$/, '');
        if (rHref && rHref === pillHref) {
          var badgeVal = extractCourseNavBadge(rawA);
          var existingBadge = pill.querySelector('.vibe-nav-badge');
          if (badgeVal) {
            if (existingBadge) {
              if (existingBadge.textContent !== badgeVal) existingBadge.textContent = badgeVal;
            } else {
              var newB = document.createElement('span');
              newB.className = 'vibe-nav-badge';
              newB.textContent = badgeVal;
              pill.appendChild(newB);
            }
          } else if (existingBadge) {
            existingBadge.remove();
          }
          break;
        }
      }
    }
  }

  function updateActiveCourseNavPill() {
    var nav = document.getElementById('vibe-course-nav');
    if (!nav) return;
    var courseMatch = window.location.pathname.match(/^\/courses\/(\d+)/);
    if (!courseMatch) return;
    var currentPath = window.location.pathname.replace(/\/$/, '');
    var pills = nav.querySelectorAll('.vibe-course-nav-pill');
    for (var i = 0; i < pills.length; i++) {
      var pill = pills[i];
      var href = (pill.getAttribute('href') || '').replace(/\/$/, '');
      var isActive = currentPath === href ||
        (href !== '/courses/' + courseMatch[1] && currentPath.startsWith(href));
      pill.classList.toggle('active', !!isActive);
    }
  }

  function injectCourseNavBar(presetId) {
    var courseMatch = window.location.pathname.match(/^\/courses\/(\d+)/);
    if (!courseMatch) return;
    if (document.getElementById('vibe-course-nav')) {
      updateActiveCourseNavPill();
      return;
    }

    function tryBuildNav() {
      if (document.getElementById('vibe-course-nav')) return true;

      // Query any Canvas navigation links inside section-tabs or left-side
      var rawLinks = document.querySelectorAll(
        '#section-tabs a, #left-side nav a, nav[aria-label*="Course" i] a, #left-side a[id$="-link"], #left-side a'
      );
      if (!rawLinks || rawLinks.length === 0) return false;

      var currentPath = window.location.pathname.replace(/\/$/, '');

      var nav = document.createElement('nav');
      nav.id = 'vibe-course-nav';
      nav.className = 'vibe-course-nav';
      nav.setAttribute('aria-label', 'Course Navigation Tabs');

      var seenHrefs = {};
      var count = 0;

      for (var i = 0; i < rawLinks.length; i++) {
        var rawA = rawLinks[i];
        var href = (rawA.getAttribute('href') || '').trim();
        var label = extractCourseNavLabel(rawA);
        if (!href || !label || href === '#' || href.startsWith('javascript:')) continue;

        var cleanHref = href.replace(/\/$/, '');
        if (seenHrefs[cleanHref]) continue;
        seenHrefs[cleanHref] = true;

        var isActive = rawA.classList.contains('active') ||
          rawA.parentElement.classList.contains('active') ||
          rawA.getAttribute('aria-current') === 'page' ||
          currentPath === cleanHref ||
          (cleanHref !== '/courses/' + courseMatch[1] && currentPath.startsWith(cleanHref));

        var badgeVal = extractCourseNavBadge(rawA);

        var pill = document.createElement('a');
        pill.className = 'vibe-course-nav-pill' + (isActive ? ' active' : '');
        pill.href = href;

        var labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        pill.appendChild(labelSpan);

        if (badgeVal) {
          var badgeSpan = document.createElement('span');
          badgeSpan.className = 'vibe-nav-badge';
          badgeSpan.textContent = badgeVal;
          pill.appendChild(badgeSpan);
        }

        nav.appendChild(pill);
        count++;
      }

      if (count === 0) return false;

      // Placement: insert after top breadcrumbs bar (.ic-app-nav-toggle-and-crumbs) or at top of content
      var toggleAndCrumbs = document.querySelector('.ic-app-nav-toggle-and-crumbs');
      if (toggleAndCrumbs && toggleAndCrumbs.parentNode) {
        toggleAndCrumbs.parentNode.insertBefore(nav, toggleAndCrumbs.nextSibling);
      } else {
        var content = document.getElementById('content') || document.getElementById('content-wrapper') || document.getElementById('main');
        if (content) content.insertBefore(nav, content.firstChild);
      }

      // Cleanup retry hooks
      if (courseNavTimer) { clearInterval(courseNavTimer); courseNavTimer = null; }
      if (courseNavObserver) { courseNavObserver.disconnect(); courseNavObserver = null; }

      // Keep observing #section-tabs or #left-side to live-sync badges whenever Canvas receives them
      var watchTarget = document.getElementById('section-tabs') || document.getElementById('left-side');
      if (watchTarget && window.MutationObserver) {
        if (courseNavBadgeObserver) courseNavBadgeObserver.disconnect();
        var badgeDebounceTimer = null;
        courseNavBadgeObserver = new MutationObserver(function() {
          if (badgeDebounceTimer) clearTimeout(badgeDebounceTimer);
          badgeDebounceTimer = setTimeout(syncCourseNavBadges, 80);
        });
        courseNavBadgeObserver.observe(watchTarget, { childList: true, subtree: true });
      }

      return true;
    }

    if (!tryBuildNav()) {
      var attempts = 0;
      courseNavTimer = setInterval(function() {
        attempts++;
        if (tryBuildNav() || attempts > 20) {
          if (courseNavTimer) { clearInterval(courseNavTimer); courseNavTimer = null; }
          if (courseNavObserver) { courseNavObserver.disconnect(); courseNavObserver = null; }
        }
      }, 250);

      var navTarget = document.getElementById('content') || document.getElementById('content-wrapper') || document.getElementById('main') || document.body;
      if (!courseNavObserver && window.MutationObserver && navTarget) {
        courseNavObserver = new MutationObserver(function() {
          if (tryBuildNav() || attempts > 20) {
            if (courseNavTimer) { clearInterval(courseNavTimer); courseNavTimer = null; }
            if (courseNavObserver) { courseNavObserver.disconnect(); courseNavObserver = null; }
          }
        });
        courseNavObserver.observe(navTarget, { childList: true, subtree: true });
      }
    }
  }


  // ── Course Shortcuts & Landing Page Redirects ───────────────
  var COURSE_REDIRECTS = {};

  function checkCourseLandingRedirect() {
    var m = window.location.pathname.match(/^\/courses\/(\d+)\/?$/);
    if (!m) return;
    var cId = m[1];
    var target = COURSE_REDIRECTS[cId];
    if (!target) return;
    if (window.location.href === target) return;
    if (cId === '15803' && window.location.hash && window.location.hash.indexOf('text=bands') !== -1) return;
    window.location.replace(target);
  }

  function applyCourseRedirectsAndRenaming() {
    safeStorageGet(['course_nicknames'], function(res) {
      var nicks = Object.assign({}, DEFAULT_COURSE_NICKNAMES, (res && res.course_nicknames) || {});

      // 1. Course URL redirects (HREF rewrite only - NEVER touch link innerHTML/textContent)
      var links = document.querySelectorAll('a[href*="/courses/"]');
      for (var i = 0; i < links.length; i++) {
        var a = links[i];
        if (a.closest('#vibe-course-nav') || a.closest('#breadcrumbs') || a.closest('#section-tabs') || a.closest('#left-side')) {
          continue;
        }
        var href = a.getAttribute('href') || '';
        var m = href.match(/\/courses\/(\d+)/);
        if (m && COURSE_REDIRECTS[m[1]] && /\/courses\/\d+\/?$/.test(href)) {
          a.setAttribute('href', COURSE_REDIRECTS[m[1]]);
        }
      }

      // 2. Specific Course Breadcrumb (only the course crumb li:nth-child(2))
      var courseCrumb = document.querySelector('#breadcrumbs li:nth-child(2) .ellipsible, #breadcrumbs li:nth-child(2) a, #breadcrumbs li:nth-child(2) span');
      if (courseCrumb) {
        var mPath = window.location.pathname.match(/^\/courses\/(\d+)/);
        var activeCId = mPath ? mPath[1] : null;
        var formattedCrumb = formatCourseCodeDisplay(courseCrumb.textContent, window.location.pathname, activeCId, nicks);
        if (formattedCrumb && formattedCrumb !== 'Course' && formattedCrumb !== courseCrumb.textContent.trim()) {
          courseCrumb.textContent = formattedCrumb;
        }
      }

      // 3. Dashboard card titles: ONLY modify title text, NEVER wipe card header content
      var cards = document.querySelectorAll('.ic-DashboardCard');
      for (var c = 0; c < cards.length; c++) {
        var cardEl = cards[c];
        var cardLink = cardEl.querySelector('a.ic-DashboardCard__link');
        var cardHref = cardLink ? (cardLink.getAttribute('href') || '') : '';
        var cardCm = cardHref.match(/\/courses\/(\d+)/);
        var cardCid = cardCm ? cardCm[1] : null;

        var titleEl = cardEl.querySelector('.ic-DashboardCard__header-title');
        if (titleEl) {
          var directTitle = titleEl.querySelector('span, a') || titleEl;
          var rawTitle = directTitle.textContent.trim();
          var cleanTitle = formatCourseCodeDisplay(rawTitle, cardHref, cardCid, nicks);
          if (cleanTitle && cleanTitle !== 'Course' && cleanTitle !== rawTitle) {
            directTitle.textContent = cleanTitle;
            if (titleEl.hasAttribute('title')) titleEl.setAttribute('title', cleanTitle);
          }
        }
      }

      // 4. Courses tray drawer links
      var trayLinks = document.querySelectorAll('.navigation-tray-container a[href*="/courses/"]');
      for (var t = 0; t < trayLinks.length; t++) {
        var tLink = trayLinks[t];
        var tHref = tLink.getAttribute('href') || '';
        var tCm = tHref.match(/\/courses\/(\d+)/);
        var tCid = tCm ? tCm[1] : null;
        if (tLink.children.length === 0) {
          var cleanTrayName = formatCourseCodeDisplay(tLink.textContent, tHref, tCid, nicks);
          if (cleanTrayName && cleanTrayName !== 'Course' && cleanTrayName !== tLink.textContent.trim()) {
            tLink.textContent = cleanTrayName;
          }
        }
      }
    });
  }

  // ── Adaptive Layout Coordinator (Quizzes, Unlocked Scrolling & Responsive Scaler) ──
  function syncCanvasLayout() {
    var header = document.getElementById('header') || document.querySelector('.ic-app-header');
    var navWidth = 84;
    if (header) {
      var rect = header.getBoundingClientRect();
      if (rect.width > 20) {
        navWidth = Math.round(rect.width);
      }
    }
    if (document.documentElement) {
      document.documentElement.style.setProperty('--vibe-nav-width', navWidth + 'px');
    }

    var url = window.location.href;
    var pathname = window.location.pathname;

    var isInbox = url.indexOf('/conversations') !== -1;
    var isQuiz = (
      url.indexOf('/quizzes') !== -1 ||
      url.indexOf('/taking') !== -1 ||
      url.indexOf('/take') !== -1 ||
      url.indexOf('quiz-lti') !== -1 ||
      (document.body && document.body.classList.contains('quizzes')) ||
      (document.body && document.body.classList.contains('full-width')) ||
      !!document.getElementById('questions') ||
      !!document.getElementById('question_list') ||
      !!document.getElementById('assessment_questions') ||
      !!document.querySelector('.quiz-submission') ||
      !!document.querySelector('iframe#tool_content') ||
      !!document.querySelector('iframe[src*="quiz"]') ||
      !!document.querySelector('[data-testid*="quiz"]') ||
      !!document.querySelector('[aria-label*="Question Navigator"]') ||
      !!document.querySelector('[aria-label*="Question list"]') ||
      !!document.querySelector('[aria-label*="question list"]')
    );

    var isDashboard = (
      (pathname === '/' || pathname === '/dashboard') &&
      !isQuiz &&
      (!!document.getElementById('dashboard') || (document.body && document.body.classList.contains('ic-dashboard-app')))
    );

    if (document.documentElement) {
      document.documentElement.classList.toggle('vibe-quiz-page', isQuiz);
      document.documentElement.classList.toggle('vibe-dashboard-page', isDashboard);
    }
    if (document.body) {
      document.body.classList.toggle('vibe-quiz-page', isQuiz);
      document.body.classList.toggle('vibe-inbox-page', isInbox);
      document.body.classList.toggle('vibe-dashboard-page', isDashboard);
    }

    // Always ensure root scroll containers allow vertical scrolling
    if (document.documentElement) {
      document.documentElement.style.removeProperty('overflow-x');
      document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
    }
    if (document.body) {
      document.body.style.removeProperty('overflow-x');
      document.body.style.setProperty('overflow-y', 'auto', 'important');
    }

    var app = document.getElementById('application');
    if (app) {
      app.style.setProperty('overflow-y', 'auto', 'important');
      app.style.setProperty('height', 'auto', 'important');
    }

    var wrapper = document.getElementById('wrapper');
    if (wrapper) {
      wrapper.style.setProperty('margin-left', navWidth + 'px', 'important');
      wrapper.style.setProperty('width', 'calc(100% - ' + navWidth + 'px)', 'important');
      wrapper.style.setProperty('max-width', 'calc(100% - ' + navWidth + 'px)', 'important');
      wrapper.style.setProperty('overflow', 'visible', 'important');

      if (isQuiz) {
        wrapper.style.setProperty('padding', '0', 'important');
      }
    }

    var notRight = document.getElementById('not_right_side');
    var contentWrapper = document.getElementById('content-wrapper');
    var rightSideWrapper = document.getElementById('right-side-wrapper');

    if (isQuiz) {
      if (notRight) {
        notRight.style.setProperty('display', 'block', 'important');
        notRight.style.setProperty('width', '100%', 'important');
        notRight.style.setProperty('max-width', '100%', 'important');
        notRight.style.setProperty('margin', '0', 'important');
        notRight.style.setProperty('padding', '0', 'important');
      }
      if (contentWrapper) {
        contentWrapper.style.setProperty('display', 'block', 'important');
        contentWrapper.style.setProperty('width', '100%', 'important');
        contentWrapper.style.setProperty('max-width', '100%', 'important');
        contentWrapper.style.setProperty('flex', '1 1 100%', 'important');
        contentWrapper.style.setProperty('margin', '0', 'important');
        contentWrapper.style.setProperty('padding', '0', 'important');
        contentWrapper.style.setProperty('overflow', 'visible', 'important');
      }
      if (rightSideWrapper) {
        var hasNativeContent = !!rightSideWrapper.querySelector('#sidebar_content, table.summary, a[href*="/take"]');
        if (hasNativeContent) {
          rightSideWrapper.style.setProperty('display', 'block', 'important');
          rightSideWrapper.style.setProperty('width', '100%', 'important');
          rightSideWrapper.style.setProperty('max-width', '860px', 'important');
          rightSideWrapper.style.setProperty('margin', '0 auto', 'important');
          rightSideWrapper.style.setProperty('flex', 'none', 'important');
        } else if (!rightSideWrapper.querySelector('.vibe-sidebar-duo')) {
          rightSideWrapper.style.setProperty('display', 'none', 'important');
          rightSideWrapper.style.setProperty('width', '0', 'important');
          rightSideWrapper.style.setProperty('max-width', '0', 'important');
          rightSideWrapper.style.setProperty('flex', '0 0 0', 'important');
        }
      }

      // Ensure question navigation drawer clears the global header
      var questionDrawers = document.querySelectorAll(
        '[data-testid="question-nav"], [aria-label*="Question Navigator"], [aria-label*="Question list"], [aria-label*="question list"], aside[aria-label*="uestion"], nav[aria-label*="Question"], div[class*="QuestionNav"], div[class*="questionNav"], div[class*="question-nav"], div[class*="Drawer"], div[class*="drawer"]'
      );
      for (var d = 0; d < questionDrawers.length; d++) {
        var drawer = questionDrawers[d];
        var dStyle = window.getComputedStyle(drawer);
        if (dStyle.position === 'fixed' || dStyle.position === 'absolute') {
          var dRect = drawer.getBoundingClientRect();
          if (dRect.left < navWidth) {
            drawer.style.setProperty('left', navWidth + 'px', 'important');
          }
        }
      }

      // Ensure quiz question & submission review containers are fully scrollable
      var submissionContainers = document.querySelectorAll('.quiz-submission, #quiz-submission-version-switcher, #questions, #assessment_questions, .take_quiz_wrapper');
      for (var s = 0; s < submissionContainers.length; s++) {
        submissionContainers[s].style.setProperty('overflow-y', 'visible', 'important');
        submissionContainers[s].style.setProperty('height', 'auto', 'important');
        submissionContainers[s].style.setProperty('max-height', 'none', 'important');
      }
    } else if (!isDashboard) {
      if (rightSideWrapper && !rightSideWrapper.querySelector('.vibe-sidebar-duo')) {
        var rightSide = document.getElementById('right-side');
        if (!rightSide || rightSide.children.length === 0 || window.getComputedStyle(rightSide).display === 'none') {
          rightSideWrapper.style.setProperty('display', 'none', 'important');
          rightSideWrapper.style.setProperty('width', '0', 'important');
          rightSideWrapper.style.setProperty('flex', '0 0 0', 'important');
          if (contentWrapper) {
            contentWrapper.style.setProperty('width', '100%', 'important');
            contentWrapper.style.setProperty('max-width', '100%', 'important');
            contentWrapper.style.setProperty('flex', '1 1 100%', 'important');
          }
        }
      }
    }
  }

  function cleanupObsoleteWidgets() {
    var pop = document.getElementById('vibe-pomodoro-popover');
    if (pop) pop.remove();
    var sq = document.getElementById('vibe-pomodoro-squircle');
    if (sq) sq.remove();
    try {
      localStorage.removeItem('vibe_pomodoro_state_v5');
      localStorage.removeItem('vibe_pomodoro_state_v4');
      localStorage.removeItem('vibe_pomodoro_squircle_pos');
      localStorage.removeItem('vibe_pomodoro_squircle_size');
    } catch(e) {}
  }

  function isDashboardPage() {
    var p = (window.location.pathname || '').replace(/\/+$/, '');
    return p === '' || p === '/' || p === '/dashboard' || p === '/courses';
  }

  function sanitizeFilesAndTables() {
    // Expand gradebook details/comments rows across all table columns
    var gradeTable = document.getElementById('grades_summary');
    if (gradeTable) {
      var colTds = gradeTable.querySelectorAll('tr.comments > td[colspan], tr.grade_details > td[colspan]');
      for (var k = 0; k < colTds.length; k++) {
        if (colTds[k].getAttribute('colspan') !== '12') {
          colTds[k].setAttribute('colspan', '12');
        }
      }
    }

    var hasTables = document.querySelector(
      'div[role="grid"], div[role="table"], .ReactVirtualized__Table, .ef-main, table.ic-Table, table'
    );
    if (!hasTables) return;

    var rowsAndCells = document.querySelectorAll(
      'div[role="row"], div[role="gridcell"], div[role="cell"], div[role="columnheader"], ' +
      '.ReactVirtualized__Table__row, .ReactVirtualized__Table__rowColumn, .ReactVirtualized__Table__headerRow, ' +
      '.ef-item-row, .ef-item-row-content, .ef-header, .ef-directory-header, ' +
      'table.ic-Table tbody tr, table.ic-Table tbody td, table tbody tr, table tbody td'
    );

    for (var i = 0; i < rowsAndCells.length; i++) {
      var el = rowsAndCells[i];
      var inlineBg = el.style.backgroundColor || el.style.background;
      if (inlineBg && (
        inlineBg.includes('255, 255, 255') ||
        inlineBg.includes('#fff') ||
        inlineBg.includes('#ffffff') ||
        inlineBg.includes('white') ||
        inlineBg.includes('245, 245, 245') ||
        inlineBg.includes('250, 250, 250') ||
        inlineBg.includes('240, 240, 240')
      )) {
        el.style.removeProperty('background-color');
        el.style.removeProperty('background');
      }
    }
  }

  function applyWallpaper(url, opacity, blur) {
    var baseLayer = document.getElementById('vibe-theme-base-layer');
    if (!baseLayer) {
      baseLayer = document.createElement('div');
      baseLayer.id = 'vibe-theme-base-layer';
      (document.body || document.documentElement).appendChild(baseLayer);
    }
    var layer = document.getElementById('vibe-wallpaper-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'vibe-wallpaper-layer';
      (document.body || document.documentElement).appendChild(layer);
    }
    if (url && String(url).trim()) {
      var cleanUrl = String(url).trim().replace(/"/g, '\\"');
      layer.style.setProperty('background-image', 'url("' + cleanUrl + '")', 'important');
      var op = (opacity !== undefined && opacity !== null && !isNaN(parseInt(opacity, 10))) ? parseInt(opacity, 10) : 25;
      var bl = (blur !== undefined && blur !== null && !isNaN(parseInt(blur, 10))) ? parseInt(blur, 10) : 0;

      // Context-aware: non-dashboard content pages (files, courses, calendar, grades, etc.) get reduced opacity + more blur for readability
      var isContentPage = !isDashboardPage();
      var effectiveOp = isContentPage ? Math.min(op, 45) : op;
      var effectiveBl = isContentPage ? Math.max(bl, 15) : bl;

      layer.style.setProperty('opacity', (effectiveOp / 100).toString(), 'important');
      layer.style.setProperty('filter', 'blur(' + effectiveBl + 'px)', 'important');
      document.documentElement.classList.add('vibe-has-wallpaper');
      if (document.body) document.body.classList.add('vibe-has-wallpaper');
      try {
        localStorage.setItem('vibe_cached_wallpaper', url);
        localStorage.setItem('vibe_cached_wp_op', op);
        localStorage.setItem('vibe_cached_wp_bl', bl);
      } catch (e) {}
    } else {
      layer.style.removeProperty('background-image');
      document.documentElement.classList.remove('vibe-has-wallpaper');
      if (document.body) document.body.classList.remove('vibe-has-wallpaper');
      try {
        localStorage.removeItem('vibe_cached_wallpaper');
        localStorage.removeItem('vibe_cached_wp_op');
        localStorage.removeItem('vibe_cached_wp_bl');
      } catch (e) {}
    }

    // Sync sidebar background with canvas wallpaper if not using custom sidebar image
    safeStorageGet(['vibe_sidebar_bg_url', 'vibe_sidebar_bg_opacity', 'vibe_sidebar_bg_blur'], function(sRes) {
      applySidebarBackground(
        sRes && sRes.vibe_sidebar_bg_url,
        sRes && sRes.vibe_sidebar_bg_opacity,
        sRes && sRes.vibe_sidebar_bg_blur,
        url
      );
    });
  }

  function _legacy_escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&#039;');
  }

  // ── Quiz Full-Box Answer Click Delegation ────────────────────────────
  function initQuizAnswerClickDelegation() {
    document.addEventListener('click', function(e) {
      var answerEl = e.target.closest('.answer, .answer_row');
      if (!answerEl) return;
      var input = answerEl.querySelector('input[type="radio"], input[type="checkbox"]');
      if (!input || e.target === input) return;

      if (input.type === 'radio') {
        if (!input.checked) {
          input.checked = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      } else if (input.type === 'checkbox') {
        if (!e.target.closest('label')) {
          input.checked = !input.checked;
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    });
  }

  var isVibeInitialized = false;
  function init() {
    if(isVibeInitialized) return;
    isVibeInitialized = true;
    if (!isCanvasPage()) return;

    checkCourseLandingRedirect();
    applyCourseRedirectsAndRenaming();
    initQuizAnswerClickDelegation();

    // Early synchronous pass using cached preset & wallpaper (0ms)
    cleanupObsoleteWidgets();
    var resizeRaf = null;
    window.addEventListener('resize', function() {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(function() {
        resizeRaf = null;
        syncCanvasLayout();
      });
    }, { passive: true });
    var cachedId = localStorage.getItem('vibe_cached_preset') || DEFAULT_PRESET_ID;
    applyCardHeroColors(cachedId);
    applySidebarTheme(cachedId);
    enhanceCalendarEvents(cachedId);
    initTodoReformatter(cachedId);

    var cachedWp = localStorage.getItem('vibe_cached_wallpaper');
    if (cachedWp) {
      var cachedOp = localStorage.getItem('vibe_cached_wp_op');
      var cachedBl = localStorage.getItem('vibe_cached_wp_bl');
      applyWallpaper(cachedWp, cachedOp, cachedBl);
    }

    var cachedSbUrl = localStorage.getItem('vibe_cached_sidebar_url');
    var cachedSbOp = localStorage.getItem('vibe_cached_sidebar_op');
    var cachedSbBl = localStorage.getItem('vibe_cached_sidebar_bl');
    if (cachedSbUrl || cachedWp) {
      applySidebarBackground(cachedSbUrl, cachedSbOp, cachedSbBl, cachedWp);
    }

    var coursesNavBtn = document.getElementById('global_nav_courses_link');
    if (coursesNavBtn) {
      coursesNavBtn.addEventListener('click', function() {
        setTimeout(applyCourseRedirectsAndRenaming, 60);
        setTimeout(applyCourseRedirectsAndRenaming, 250);
        setTimeout(applyCourseRedirectsAndRenaming, 600);
      });
    }

    safeStorageGet([
      'active_preset', 'card_radius', 'vibe_soft_night',
      'vibe_wallpaper_url', 'vibe_wallpaper_opacity', 'vibe_wallpaper_blur',
      'vibe_sidebar_bg_url', 'vibe_sidebar_bg_opacity', 'vibe_sidebar_bg_blur',
      'custom_theme_colors'
    ], function(res) {
      if (res && res.vibe_soft_night !== undefined) {
        document.documentElement.classList.toggle('vibe-soft-night', !!res.vibe_soft_night);
        try { localStorage.setItem('vibe_cached_soft_night', res.vibe_soft_night ? 'true' : 'false'); } catch (e) {}
      }
      if (res) {
        applyWallpaper(res.vibe_wallpaper_url, res.vibe_wallpaper_opacity, res.vibe_wallpaper_blur);
        applySidebarBackground(
          res.vibe_sidebar_bg_url,
          res.vibe_sidebar_bg_opacity,
          res.vibe_sidebar_bg_blur,
          res.vibe_wallpaper_url
        );
      }
      var presetId = (res && res.active_preset) || DEFAULT_PRESET_ID;
      try { localStorage.setItem('vibe_cached_preset', presetId); } catch (e) {}
      var catalog = (typeof PRESETS !== 'undefined') ? PRESETS : {};
      var preset = catalog[presetId] || catalog[DEFAULT_PRESET_ID];
      if (preset) {
        if (presetId.indexOf('custom') !== -1 && res && res.custom_theme_colors) {
          var customC = res.custom_theme_colors[presetId] ||
            (res.custom_theme_colors['background-0'] ? res.custom_theme_colors : null);
          if (customC) {
            preset = Object.assign({}, preset, { colors: Object.assign({}, preset.colors, customC) });
          }
        }
        applyPresetTheme(preset);
      }
      if (res && res.card_radius) {
        var r0 = parseInt(res.card_radius, 10);
        if (!isNaN(r0)) {
          document.documentElement.style.setProperty('--bc-card-radius', r0 + 'px');
          try { localStorage.setItem('vibe_cached_radius', r0); } catch (e) {}
        }
      }
      applyCardHeroColors(presetId);
      applySidebarTheme(presetId);
      enhanceCalendarEvents(presetId);
      initTodoReformatter(presetId);
      injectCourseNavBar(presetId);
      cleanupObsoleteWidgets();
      syncCanvasLayout();
    });

    if (isExtensionContextValid() && chrome.storage && chrome.storage.onChanged) {
      try {
        chrome.storage.onChanged.addListener(function(changes, area) {
          if (area === 'local' && isExtensionContextValid()) {
            if (changes.vibe_soft_night !== undefined) {
              document.documentElement.classList.toggle('vibe-soft-night', !!changes.vibe_soft_night.newValue);
              try { localStorage.setItem('vibe_cached_soft_night', changes.vibe_soft_night.newValue ? 'true' : 'false'); } catch (e) {}
            }
            if (changes.vibe_wallpaper_url) {
              safeStorageGet(['vibe_wallpaper_url', 'vibe_wallpaper_opacity', 'vibe_wallpaper_blur'], function(res) {
                applyWallpaper(
                  res && res.vibe_wallpaper_url,
                  res && res.vibe_wallpaper_opacity,
                  res && res.vibe_wallpaper_blur
                );
              });
            } else if (changes.vibe_wallpaper_opacity || changes.vibe_wallpaper_blur) {
              var wpLayer = document.getElementById('vibe-wallpaper-layer');
              if (wpLayer) {
                var isContentPage = !isDashboardPage();
                if (changes.vibe_wallpaper_opacity && changes.vibe_wallpaper_opacity.newValue !== undefined) {
                  var op = parseInt(changes.vibe_wallpaper_opacity.newValue, 10);
                  var effOp = isContentPage ? Math.min(op, 45) : op;
                  wpLayer.style.setProperty('opacity', (effOp / 100).toString(), 'important');
                  try { localStorage.setItem('vibe_cached_wp_op', op); } catch (e) {}
                }
                if (changes.vibe_wallpaper_blur && changes.vibe_wallpaper_blur.newValue !== undefined) {
                  var bl = parseInt(changes.vibe_wallpaper_blur.newValue, 10);
                  var effBl = isContentPage ? Math.max(bl, 15) : bl;
                  wpLayer.style.setProperty('filter', 'blur(' + effBl + 'px)', 'important');
                  try { localStorage.setItem('vibe_cached_wp_bl', bl); } catch (e) {}
                }
              }
            }
            if (changes.vibe_sidebar_bg_url) {
              safeStorageGet([
                'vibe_sidebar_bg_url', 'vibe_sidebar_bg_opacity', 'vibe_sidebar_bg_blur', 'vibe_wallpaper_url'
              ], function(res) {
                applySidebarBackground(
                  res && res.vibe_sidebar_bg_url,
                  res && res.vibe_sidebar_bg_opacity,
                  res && res.vibe_sidebar_bg_blur,
                  res && res.vibe_wallpaper_url
                );
              });
            } else if (changes.vibe_sidebar_bg_opacity || changes.vibe_sidebar_bg_blur) {
              var sbImg = document.querySelector('#vibe-sidebar-bg-layer .vibe-sidebar-bg-img');
              if (sbImg) {
                if (changes.vibe_sidebar_bg_opacity && changes.vibe_sidebar_bg_opacity.newValue !== undefined) {
                  var sOp = parseInt(changes.vibe_sidebar_bg_opacity.newValue, 10);
                  sbImg.style.setProperty('opacity', (sOp / 100).toString(), 'important');
                  try { localStorage.setItem('vibe_cached_sidebar_op', sOp); } catch (e) {}
                }
                if (changes.vibe_sidebar_bg_blur && changes.vibe_sidebar_bg_blur.newValue !== undefined) {
                  var sBl = parseInt(changes.vibe_sidebar_bg_blur.newValue, 10);
                  sbImg.style.setProperty('filter', 'blur(' + sBl + 'px)', 'important');
                  try { localStorage.setItem('vibe_cached_sidebar_bl', sBl); } catch (e) {}
                }
              }
            }
            if (changes.custom_theme_colors) {
              safeStorageGet(['active_preset', 'custom_theme_colors'], function(res) {
                var pId = (res && res.active_preset) || DEFAULT_PRESET_ID;
                if (pId.indexOf('custom') !== -1) {
                  var catalog = (typeof PRESETS !== 'undefined') ? PRESETS : {};
                  var p = catalog[pId];
                  if (p) {
                    var customC = (res && res.custom_theme_colors && res.custom_theme_colors[pId]) ||
                      (res && res.custom_theme_colors && res.custom_theme_colors['background-0'] ? res.custom_theme_colors : null);
                    var merged = customC ? Object.assign({}, p, { colors: Object.assign({}, p.colors, customC) }) : p;
                    applyPresetTheme(merged);
                    applyCardHeroColors(pId);
                    applySidebarTheme(pId);
                  }
                }
              });
            }
            if (changes.course_images) {
              safeStorageGet(['active_preset'], function(res) {
                var pId = (res && res.active_preset) || DEFAULT_PRESET_ID;
                applyCardHeroColors(pId);
              });
            }
            syncCanvasLayout();
            if (changes.active_preset && changes.active_preset.newValue) {
              var newId = changes.active_preset.newValue;
              try { localStorage.setItem('vibe_cached_preset', newId); } catch (e) {}
              var catalog = (typeof PRESETS !== 'undefined') ? PRESETS : {};
              var p = catalog[newId];
              playInkTransition(p, function() {
                if (p) applyPresetTheme(p);
                applyCardHeroColors(newId);
                applySidebarTheme(newId);
                enhanceCalendarEvents(newId);
                initTodoReformatter(newId);
                var oldNav = document.getElementById('vibe-course-nav');
                if (oldNav) oldNav.remove();
                injectCourseNavBar(newId);
                applyCourseRedirectsAndRenaming();
              });
            }
            if (changes.course_nicknames) {
              safeStorageGet(['active_preset'], function(res) {
                var pId = (res && res.active_preset) || DEFAULT_PRESET_ID;
                applyCardHeroColors(pId);
                initTodoReformatter(pId);
                applyCourseRedirectsAndRenaming();
              });
            }
            if (changes.card_radius && changes.card_radius.newValue !== undefined) {
              var r = parseInt(changes.card_radius.newValue, 10);
              if (!isNaN(r)) {
                document.documentElement.style.setProperty('--bc-card-radius', r + 'px');
                try { localStorage.setItem('vibe_cached_radius', r); } catch (e) {}
              }
            }
            if (changes.vibe_restore_signal) {
              safeStorageGet(['active_preset'], function(res) {
                var pId = (res && res.active_preset) || DEFAULT_PRESET_ID;
                restoreAllDismissedItems(pId);
              });
            }
            if (changes.vibe_show_gpa !== undefined || changes.vibe_gpa_bg_color !== undefined) {
              safeStorageGet(['active_preset'], function(res) {
                var pId = (res && res.active_preset) || DEFAULT_PRESET_ID;
                renderGpaSchoolCard(pId);
              });
            }
          }
        });
      } catch (e) {}
    }

    if (isExtensionContextValid() && chrome.runtime && chrome.runtime.onMessage) {
      try {
        chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
          if (!msg) return;
          if (msg.action === 'restore_tasks' || msg.type === 'RESTORE_TASKS') {
            safeStorageGet(['active_preset'], function(res) {
              restoreAllDismissedItems(res && res.active_preset ? res.active_preset : DEFAULT_PRESET_ID);
            });
            return;
          }
          if (msg.action === 'full_reset' || msg.type === 'FULL_RESET') {
            try {
              localStorage.removeItem('vibe_dismissed_tasks_v2');
              localStorage.removeItem('vibe_dismissed_graded_v1');
              localStorage.removeItem('vibe_completed_tasks_v1');
              localStorage.removeItem('vibe_custom_nicknames');
              localStorage.removeItem('vibe_custom_photos');
              localStorage.removeItem('vibe_cached_preset');
              localStorage.removeItem('vibe_cached_radius');
              localStorage.removeItem('vibe_cached_wp_url');
              localStorage.removeItem('vibe_cached_sidebar_url');
            } catch (e) {}
            cachedPlannerItems = null;
            lastPlannerFetchTime = 0;
            cachedGradedItems = null;
            lastGradedFetchTime = 0;
            init();
            return;
          }
          if (msg.type !== 'VIBE_LIVE_PARAM') return;
          if (msg.key === 'vibe_wallpaper_opacity') {
            var op = parseInt(msg.value, 10);
            var wpLayer = document.getElementById('vibe-wallpaper-layer');
            if (wpLayer) {
              var isContentPage = !isDashboardPage();
              var effOp = isContentPage ? Math.min(op, 45) : op;
              wpLayer.style.setProperty('opacity', (effOp / 100).toString(), 'important');
              try { localStorage.setItem('vibe_cached_wp_op', op); } catch(e) {}
            }
          } else if (msg.key === 'vibe_wallpaper_blur') {
            var bl = parseInt(msg.value, 10);
            var wpLayer = document.getElementById('vibe-wallpaper-layer');
            if (wpLayer) {
              var isContentPage = !isDashboardPage();
              var effBl = isContentPage ? Math.max(bl, 15) : bl;
              wpLayer.style.setProperty('filter', 'blur(' + effBl + 'px)', 'important');
              try { localStorage.setItem('vibe_cached_wp_bl', bl); } catch(e) {}
            }
          } else if (msg.key === 'vibe_sidebar_bg_opacity') {
            var sImg = document.querySelector('#vibe-sidebar-bg-layer .vibe-sidebar-bg-img');
            if (sImg) {
              var sOp = parseInt(msg.value, 10);
              sImg.style.setProperty('opacity', (sOp / 100).toString(), 'important');
              try { localStorage.setItem('vibe_cached_sidebar_op', sOp); } catch(e) {}
            }
          } else if (msg.key === 'vibe_sidebar_bg_blur') {
            var sImg = document.querySelector('#vibe-sidebar-bg-layer .vibe-sidebar-bg-img');
            if (sImg) {
              var sBl = parseInt(msg.value, 10);
              sImg.style.setProperty('filter', 'blur(' + sBl + 'px)', 'important');
              try { localStorage.setItem('vibe_cached_sidebar_bl', sBl); } catch(e) {}
            }
          } else if (msg.key === 'card_radius') {
            var r = parseInt(msg.value, 10);
            if (!isNaN(r)) {
              document.documentElement.style.setProperty('--bc-card-radius', r + 'px');
              try { localStorage.setItem('vibe_cached_radius', r); } catch(e) {}
            }
          } else if (msg.key === 'vibe_show_gpa') {
            safeStorageGet(['active_preset'], function(res) {
              var activeId = (res && res.active_preset) || localStorage.getItem('vibe_cached_preset') || DEFAULT_PRESET_ID;
              renderGpaSchoolCard(activeId);
            });
          } else if (msg.key === 'vibe_gpa_bg_color') {
            var gpaHero = document.querySelector('#vibe-gpa-school-card .vibe-gpa-hero');
            if (gpaHero) {
              if (msg.value) {
                gpaHero.style.background = msg.value;
              } else {
                safeStorageGet(['active_preset'], function(res) {
                  var activeId = (res && res.active_preset) || localStorage.getItem('vibe_cached_preset') || DEFAULT_PRESET_ID;
                  var catalog = (typeof PRESETS !== 'undefined') ? PRESETS : {};
                  var p = catalog[activeId] || catalog[DEFAULT_PRESET_ID];
                  var accent = (p && p.colors && (p.colors.accent || p.colors.links)) || '#457354';
                  gpaHero.style.background = 'linear-gradient(135deg,' + accent + 'dd 0%,' + accent + '88 100%)';
                });
              }
            }
          }
        });
      } catch (e) {}
    }
  }

  var observerTimeout = null;
  var isApplyingTheme = false;

  function attachObserver() {
    if (!isCanvasPage()) return;
    var observer = new MutationObserver(function(mutations) {
      if (isApplyingTheme) return;

      var hasForeignMutation = false;
      for (var m = 0; m < mutations.length; m++) {
        var t = mutations[m].target;
        var el = (t && t.nodeType === 1) ? t : (t && t.parentElement);
        if (!el || typeof el.closest !== 'function') continue;
        if (
          el.closest('#vibe-side-duo') ||
          el.closest('#vibe-pomodoro-pill') ||
          el.closest('#vibe-pomodoro-popover') ||
          el.closest('#vibe-pomodoro-squircle') ||
          el.closest('#vibe-course-nav') ||
          el.closest('#canvas-vibe-dynamic-styles') ||
          el.closest('#canvas-vibe-ink-overlay') ||
          el.closest('.vibe-toast') ||
          el.closest('.vibe-grade-spark-tooltip') ||
          el.closest('#vibe-wallpaper-layer') ||
          el.closest('#vibe-sidebar-bg-layer') ||
          el.closest('#vibe-gpa-school-card')
        ) {
          continue;
        }
        hasForeignMutation = true;
        break;
      }
      if (!hasForeignMutation) return;

      if (observerTimeout) clearTimeout(observerTimeout);
      observerTimeout = setTimeout(function() {
        if (!isExtensionContextValid()) return;
        hideNativeTodoList();
        applyCourseRedirectsAndRenaming();
        safeStorageGet([
          'active_preset', 'custom_theme_colors',
          'vibe_sidebar_bg_url', 'vibe_sidebar_bg_opacity', 'vibe_sidebar_bg_blur', 'vibe_wallpaper_url'
        ], function(res) {
          var activeId = (res && res.active_preset) || localStorage.getItem('vibe_cached_preset') || DEFAULT_PRESET_ID;
          isApplyingTheme = true;
          try {
            applyCardHeroColors(activeId);
            applySidebarTheme(activeId);
            applySidebarBackground(
              res && res.vibe_sidebar_bg_url,
              res && res.vibe_sidebar_bg_opacity,
              res && res.vibe_sidebar_bg_blur,
              res && res.vibe_wallpaper_url
            );
            enhanceCalendarEvents(activeId);
            initTodoReformatter(activeId);
            syncCanvasLayout();
            sanitizeFilesAndTables();
            if (window.location.pathname.match(/^\/courses\/\d+/) && !document.getElementById('vibe-course-nav')) {
              injectCourseNavBar(activeId);
            }
          } finally {
            setTimeout(function() { isApplyingTheme = false; }, 120);
          }
        });
      }, 60);
    });

    var root = document.getElementById('application') || document.getElementById('main') || document.body || document.documentElement;
    if (root) { observer.observe(root, { childList: true, subtree: true }); }
  }

  function startMountRetentionGuard() {
    var mountAttempts = 0;
    var stableTicks = 0;
    var mountInterval = setInterval(function() {
      mountAttempts++;
      if (mountAttempts > 40) {
        clearInterval(mountInterval);
        return;
      }

      sanitizeFilesAndTables();

      var rightSide = document.getElementById('right-side') || document.getElementById('right-side-wrapper');
      var duo = document.getElementById('vibe-side-duo');
      var appHeader = document.querySelector('header#header, .ic-app-header');
      var isHeaderSettled = !appHeader || !!appHeader.querySelector('#vibe-sidebar-bg-layer');
      var isDuoSettled = !rightSide || (!!duo && rightSide.contains(duo) && !!duo.querySelector('#vibe-todo-widget'));

      if (isHeaderSettled && isDuoSettled) {
        stableTicks++;
        if (stableTicks >= 3) {
          clearInterval(mountInterval);
          return;
        }
      } else {
        stableTicks = 0;
      }

      if (rightSide && (!duo || !rightSide.contains(duo) || !duo.querySelector('#vibe-todo-widget'))) {
        safeStorageGet(['active_preset'], function(res) {
          var activeId = (res && res.active_preset) || localStorage.getItem('vibe_cached_preset') || DEFAULT_PRESET_ID;
          initTodoReformatter(activeId);
        });
      } else if (rightSide && duo) {
        hideNativeTodoList(rightSide);
      }

      if (appHeader && !appHeader.querySelector('#vibe-sidebar-bg-layer')) {
        safeStorageGet([
          'active_preset', 'vibe_sidebar_bg_url', 'vibe_sidebar_bg_opacity', 'vibe_sidebar_bg_blur', 'vibe_wallpaper_url'
        ], function(res) {
          var activeId = (res && res.active_preset) || localStorage.getItem('vibe_cached_preset') || DEFAULT_PRESET_ID;
          applySidebarTheme(activeId);
          applySidebarBackground(
            res && res.vibe_sidebar_bg_url,
            res && res.vibe_sidebar_bg_opacity,
            res && res.vibe_sidebar_bg_blur,
            res && res.vibe_wallpaper_url
          );
        });
      }
    }, 150);
  }

  function attachNavigationListeners() {
    function handleRouteTransition() {
      cleanupObsoleteWidgets();
      syncCanvasLayout();
      checkCourseLandingRedirect();
      applyCourseRedirectsAndRenaming();
      sanitizeFilesAndTables();
      safeStorageGet([
        'active_preset', 'vibe_sidebar_bg_url', 'vibe_sidebar_bg_opacity', 'vibe_sidebar_bg_blur',
        'vibe_wallpaper_url', 'vibe_wallpaper_opacity', 'vibe_wallpaper_blur'
      ], function(res) {
        var activeId = (res && res.active_preset) || localStorage.getItem('vibe_cached_preset') || DEFAULT_PRESET_ID;
        // Re-apply wallpaper so course vs dashboard context-aware opacity kicks in
        if (res) {
          applyWallpaper(res.vibe_wallpaper_url, res.vibe_wallpaper_opacity, res.vibe_wallpaper_blur);
        }
        initTodoReformatter(activeId);
        applySidebarTheme(activeId);
        applySidebarBackground(
          res && res.vibe_sidebar_bg_url,
          res && res.vibe_sidebar_bg_opacity,
          res && res.vibe_sidebar_bg_blur,
          res && res.vibe_wallpaper_url
        );
        sanitizeFilesAndTables();
        if (window.location.pathname.match(/^\/courses\/\d+/)) {
          if (!document.getElementById('vibe-course-nav')) {
            injectCourseNavBar(activeId);
          } else {
            updateActiveCourseNavPill();
          }
        }
      });
    }

    try {
      var origPush = history.pushState;
      if (origPush) {
        history.pushState = function() {
          var ret = origPush.apply(this, arguments);
          setTimeout(handleRouteTransition, 40);
          return ret;
        };
      }
      var origReplace = history.replaceState;
      if (origReplace) {
        history.replaceState = function() {
          var ret = origReplace.apply(this, arguments);
          setTimeout(handleRouteTransition, 40);
          return ret;
        };
      }
    } catch (e) {}

    window.addEventListener('popstate', handleRouteTransition);
    window.addEventListener('hashchange', handleRouteTransition);
  }

  // Instant 0ms execution at document_start
  init();
  sanitizeFilesAndTables();
  attachObserver();
  startMountRetentionGuard();
  attachNavigationListeners();

  // Backup pass when DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      init();
      sanitizeFilesAndTables();
      startMountRetentionGuard();
    });
  } else {
    init();
    sanitizeFilesAndTables();
    startMountRetentionGuard();
  }
})();
