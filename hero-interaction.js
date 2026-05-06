/* ── Hero Cursor Glow ── */
(function () {
  // Only on devices with a real pointer
  if (!window.matchMedia('(hover: hover)').matches) return;

  var hero = document.querySelector('.hero');
  if (!hero) return;

  hero.addEventListener('mousemove', function (e) {
    var rect = hero.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / rect.width) * 100;
    var y = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty('--mouse-x', x + '%');
    hero.style.setProperty('--mouse-y', y + '%');
  });

  hero.addEventListener('mouseleave', function () {
    hero.style.setProperty('--mouse-x', '50%');
    hero.style.setProperty('--mouse-y', '50%');
  });
})();
