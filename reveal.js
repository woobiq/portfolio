/* ── Scroll Reveal ──
   Elements fade in & slide up as they enter the viewport.
   Automatically targets key sections and elements.
   ────────────────────────────────────────────────────── */

(function () {
  // Elements to reveal on scroll
  const selectors = [
    '.projects-section',
    '.project-card',
    '.cta-section',
    '.fun-section',
    '.gallery-item',
    '.about-content',
    '.case-study-hero',
    '.case-study-meta',
    '.case-study-body > *',
    '.page-header',
    '.section-heading',
    '.section-subheading',
    '.other-projects',
  ];

  function hasAutoplayVideo(el) {
    return el.querySelector('video[autoplay]') || el.matches('video[autoplay]');
  }

  function init() {
    // Skip reveal animations if body has no-reveal class
    if (document.body.classList.contains('no-reveal')) return;

    const elements = document.querySelectorAll(selectors.join(', '));

    // Skip if no elements or no IntersectionObserver support
    if (!elements.length || !('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('reveal--visible'); });
      return;
    }

    // Tag each element and add stagger delay for grouped items
    const groupCounters = {};

    elements.forEach(function (el) {
      // Don't double-reveal elements already visible from page animation
      if (el.closest('.hero')) return;

      // Don't hide elements or ancestors containing autoplay videos
      if (hasAutoplayVideo(el)) return;

      el.classList.add('reveal');

      // Stagger gallery items and cards within their parent
      var parent = el.parentElement;
      if (el.classList.contains('gallery-item') || el.classList.contains('project-card')) {
        var key = parent ? parent.className : '';
        if (!groupCounters[key]) groupCounters[key] = 0;
        el.style.setProperty('--reveal-delay', (groupCounters[key] * 0.07) + 's');
        groupCounters[key]++;
      }
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 120px 0px',
      }
    );

    elements.forEach(function (el) {
      if (el.classList.contains('reveal')) {
        observer.observe(el);
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── Fix blank page on any navigation ──
  function restorePage() {
    document.body.classList.remove('page-exit');
    document.querySelectorAll('.reveal:not(.reveal--visible)').forEach(function (el) {
      el.classList.add('reveal--visible');
    });
  }

  // Run immediately on every page load
  restorePage();
  window.addEventListener('pageshow', restorePage);
  window.addEventListener('popstate', restorePage);

  // ── Suppress nav transitions while user is resizing the window ──
  // Prevents the mobile dropdown from animating itself open/closed when
  // the viewport crosses the mobile breakpoint (768px). Adds an
  // .is-resizing class to <html> for ~150ms after the last resize event;
  // CSS uses this class to disable transitions on the nav.
  (function () {
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      document.documentElement.classList.add('is-resizing');
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        document.documentElement.classList.remove('is-resizing');
      }, 150);
    }, { passive: true });
  })();

  // ── Nav scroll-shrink behavior ──
  var nav = document.querySelector('.nav');
  if (nav) {
    var navTicking = false;
    function updateNav() {
      if (window.scrollY > 100) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
      navTicking = false;
    }
    window.addEventListener('scroll', function () {
      if (!navTicking) {
        requestAnimationFrame(updateNav);
        navTicking = true;
      }
    }, { passive: true });
    updateNav();
  }

  // ── Smooth page transitions via overlay ──
  // Auto-create overlay if not in HTML
  var overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.insertBefore(overlay, document.body.firstChild);
  }

  // Fade out the overlay shortly after page load
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.classList.add('is-loaded');
    });
  });

  // ── Prefetch on hover/touch so HTML is in cache by the time of click ──
  // Prefetch a same-origin URL (HTML page) once. The browser stores the
  // response so the actual navigation skips the network round-trip.
  var prefetched = new Set();
  function prefetch(url) {
    if (prefetched.has(url)) return;
    prefetched.add(url);
    var l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = url;
    l.as = 'document';
    document.head.appendChild(l);
  }
  function maybePrefetchFromEvent(e) {
    var link = e.target && e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
    var url;
    try { url = new URL(href, window.location.origin); } catch (e) { return; }
    if (url.origin !== window.location.origin) return;
    if (url.href === window.location.href) return;
    prefetch(url.href);
  }
  // touchstart fires before click; gives ~100-300ms head-start on mobile
  document.addEventListener('touchstart', maybePrefetchFromEvent, { passive: true, capture: true });
  // mouseover for desktop hover
  document.addEventListener('mouseover', maybePrefetchFromEvent, { passive: true, capture: true });

  // ── On link click, fade overlay back in, then navigate ──
  // Mobile gets a shorter outgoing fade so the perceived navigation feels snappier.
  var FADE_OUT_MS = window.innerWidth < 768 ? 120 : 220;
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || link.target === '_blank') return;

    var currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    var linkUrl = new URL(href, window.location.origin);
    var linkPath = linkUrl.pathname.replace(/\/$/, '') || '/';
    if (linkPath === currentPath && linkUrl.hash) {
      e.preventDefault();
      var target = document.querySelector(linkUrl.hash);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    var openMenu = document.querySelector('.nav__links--open');
    if (openMenu) openMenu.classList.remove('nav__links--open');

    e.preventDefault();
    overlay.classList.remove('is-loaded');
    overlay.classList.add('is-leaving');

    setTimeout(function () {
      window.location.href = href;
    }, FADE_OUT_MS);
  });

  // When using browser back/forward, ensure overlay fades out
  window.addEventListener('pageshow', function () {
    overlay.classList.remove('is-leaving');
    requestAnimationFrame(function () {
      overlay.classList.add('is-loaded');
    });
  });
})();
