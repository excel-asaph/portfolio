(function () {
  var navEl = document.querySelector('.navbar-no-shadow-container');
  if (!navEl) return;

  var stickyTarget = navEl.closest('.nav-block') || navEl.parentElement;
  if (stickyTarget) stickyTarget.classList.add('nav-sticky-wrapper');

  var activeDropLink = navEl.querySelector('.nav-dropdown-link.w--current');
  if (activeDropLink) {
    var parentToggle = activeDropLink.closest('.nav-dropdown').querySelector('.nav-dropdown-toggle');
    if (parentToggle) parentToggle.classList.add('nav-active');
  }

  var navMenuWrapper = navEl.querySelector('.nav-menu-wrapper');
  var pillOverlay = null;

  if (navMenuWrapper) {
    pillOverlay = document.createElement('div');
    pillOverlay.className = 'nav-pill-overlay';
    document.body.appendChild(pillOverlay);

    function positionPill() {
      var rect = navMenuWrapper.getBoundingClientRect();
      var containerEl = navEl.querySelector('.container');
      var rightEdge = containerEl ? containerEl.getBoundingClientRect().right : rect.right;
      var padV = 2;
      pillOverlay.style.left   = rect.left + 'px';
      pillOverlay.style.top    = (rect.top - padV) + 'px';
      pillOverlay.style.width  = (rightEdge - rect.left) + 'px';
      pillOverlay.style.height = (rect.height + padV * 2) + 'px';
    }

    requestAnimationFrame(positionPill);
    window.addEventListener('resize', function () {
      requestAnimationFrame(positionPill);
    });
  }

  // ── Theme state ──────────────────────────────────────────────────────────
  var darkPillVars = {
    '--nav-pill-bg':           'rgba(10, 10, 10, 0.45)',
    '--nav-pill-shadow':       '0 4px 24px rgba(0, 0, 0, 0.15)',
    '--nav-pill-link-color':   'rgba(255, 255, 255, 0.65)',
    '--nav-pill-active-bg':    'rgba(255, 255, 255, 0.13)',
    '--nav-pill-active-color': '#fff',
    '--nav-pill-hover-bg':     'rgba(255, 255, 255, 0.07)',
    '--nav-pill-hover-color':  'rgba(255, 255, 255, 0.9)'
  };
  var darkVarKeys = Object.keys(darkPillVars);

  var isDarkTheme = false;
  var currentSectionBg = null; // rgba string from data-bg tint, or null

  // Resolves --nav-pill-bg: dark wins, else section tint, else page default
  function applyPillBg() {
    var root = document.documentElement;
    if (isDarkTheme) {
      root.style.setProperty('--nav-pill-bg', darkPillVars['--nav-pill-bg']);
    } else if (currentSectionBg) {
      root.style.setProperty('--nav-pill-bg', currentSectionBg);
    } else {
      root.style.removeProperty('--nav-pill-bg');
    }
  }

  function applyPillTheme(dark) {
    isDarkTheme = dark;
    var root = document.documentElement;
    if (dark) {
      darkVarKeys.forEach(function(k) {
        if (k !== '--nav-pill-bg') root.style.setProperty(k, darkPillVars[k]);
      });
    } else {
      darkVarKeys.forEach(function(k) {
        if (k !== '--nav-pill-bg') root.style.removeProperty(k);
      });
    }
    applyPillBg();
  }

  // ── Dark section detection (data-nav-theme="dark" + page-overlay) ────────
  var darkSections = Array.from(document.querySelectorAll('[data-nav-theme="dark"]'));
  var sectionRanges = [];

  function cacheSectionRanges() {
    sectionRanges = darkSections.map(function(s) {
      return { top: s.offsetTop, bottom: s.offsetTop + s.offsetHeight };
    });
  }

  var pageOverlay = document.getElementById('page-overlay');

  function updatePillTheme() {
    if (!sectionRanges.length) return;
    var scrollY   = window.scrollY;
    var navBottom = scrollY + navEl.offsetHeight;

    var isDark = sectionRanges.some(function(r) {
      return navBottom > r.top && scrollY < r.bottom;
    });

    if (!isDark && pageOverlay) {
      var overlayOpacity = parseFloat(pageOverlay.style.opacity) || 0;
      if (overlayOpacity > 0.12) isDark = true;
    }

    applyPillTheme(isDark);
  }

  if (darkSections.length) {
    cacheSectionRanges();
    window.addEventListener('resize', function() {
      cacheSectionRanges();
      updatePillTheme();
    });
  }

  // ── Per-section bg tint (data-bg) ────────────────────────────────────────
  function hexToRgba(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }

  var bgSections = Array.from(document.querySelectorAll('[data-bg]'));
  if (bgSections.length) {
    var bgObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          currentSectionBg = hexToRgba(entry.target.getAttribute('data-bg'), 0.72);
          applyPillBg();
        }
      });
    }, { threshold: 0.35 });

    bgSections.forEach(function(s) { bgObserver.observe(s); });

    var heroEl = document.getElementById('hero');
    if (heroEl) {
      new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            currentSectionBg = null;
            applyPillBg();
          }
        });
      }, { threshold: 0.2 }).observe(heroEl);
    }
  }
  // ─────────────────────────────────────────────────────────────────────────

  function onNavScroll() {
    if (window.scrollY > 60) {
      navEl.classList.add('nav-is-scrolled');
      if (pillOverlay) {
        positionPill();
        pillOverlay.classList.add('active');
      }
    } else {
      navEl.classList.remove('nav-is-scrolled');
      if (pillOverlay) pillOverlay.classList.remove('active');
    }
    updatePillTheme();
  }

  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();
})();
