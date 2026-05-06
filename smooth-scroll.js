/* ── Smooth Scrolling with Lenis ── */
(function () {
  var lenis = null;

  // Lenis smooth scrolling on desktop only — native scroll feels better on touch
  if (window.innerWidth >= 768 && typeof Lenis !== 'undefined') {
    try {
      lenis = new Lenis({
        lerp: 0.18,
        smoothWheel: true,
      });
      window.lenis = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (err) {
      console.warn('Lenis init failed:', err);
    }
  }

  // Handle hash anchor links on all devices (Lenis if available, else native smooth)
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href === '#') return;
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -64 });
    } else {
      var top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });
})();
