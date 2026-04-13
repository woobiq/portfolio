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
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
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

  // ── Fix back-button blank page ──
  // When restoring from bfcache, remove exit state and show all reveals
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      document.body.classList.remove('page-exit');
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('reveal--visible');
      });
    }
  });

  // ── Smooth page transitions ──
  // Fade out before navigating to internal links
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');
    // Skip external links, anchors, and special links
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || link.target === '_blank') return;

    // Close mobile menu immediately if open
    var openMenu = document.querySelector('.nav__links--open');
    if (openMenu) openMenu.classList.remove('nav__links--open');

    e.preventDefault();
    document.body.classList.add('page-exit');

    // Shorter delay for snappier feel
    setTimeout(function () {
      window.location.href = href;
    }, 180);
  });
})();
