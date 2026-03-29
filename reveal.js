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
})();
