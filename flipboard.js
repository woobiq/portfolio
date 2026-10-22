/* Café flip board: tiles shuffle through letters and little doodles, then settle on a line.
 * Usage: FlipBoard(el, { cols, rows, lines: [[row1, row2], ...], hold }).
 * Doodles in a line: {star} {heart} {flower} {cloud}. Draft component. */
(function () {
  var ICONS = {
    star: '<path d="M12 1.8c.8 6.6 3.6 9.4 10.2 10.2-6.6.8-9.4 3.6-10.2 10.2-.8-6.6-3.6-9.4-10.2-10.2C8.4 11.2 11.2 8.4 12 1.8z"/>',
    heart: '<path d="M12 21.2s-7.8-4.7-9.9-9.5C.6 8.3 2.8 4.6 6.6 4.6c2.2 0 3.7 1.3 5.4 3.1 1.7-1.8 3.2-3.1 5.4-3.1 3.8 0 6 3.7 4.5 7.1-2.1 4.8-9.9 9.5-9.9 9.5z"/>',
    flower: '<circle cx="12" cy="5.6" r="4.2"/><circle cx="18.1" cy="10" r="4.2"/><circle cx="15.8" cy="17.2" r="4.2"/><circle cx="8.2" cy="17.2" r="4.2"/><circle cx="5.9" cy="10" r="4.2"/>',
    cloud: '<path d="M6.6 19h11a4.6 4.6 0 0 0 .7-9.1A6.2 6.2 0 0 0 6.5 8.4 5.3 5.3 0 0 0 6.6 19z"/>',
    bulb: '<path d="M12 2.4a6.6 6.6 0 0 0-3.9 11.9c.6.5 1 1.2 1 2v.9h5.8v-.9c0-.8.4-1.5 1-2A6.6 6.6 0 0 0 12 2.4z"/><path d="M9.2 18.6h5.6v1.1a1.8 1.8 0 0 1-1.8 1.8h-2a1.8 1.8 0 0 1-1.8-1.8z"/>'
  };
  var NAMES = ['heart', 'flower', 'cloud'];
  var LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
  function svg(name) { return '<svg class="fb-ic" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + '</svg>'; }
  function tokens(str) { var out = [], re = /\{(\w+)\}|./g, m; while ((m = re.exec(str))) out.push(m[1] ? { icon: m[1] } : { ch: m[0] }); return out; }
  function plain(str) { return str.replace(/\{\w+\}/g, '').trim(); }

  window.FlipBoard = function (el, opts) {
    var cols = opts.cols, rows = opts.rows || 1, lines = opts.lines, hold = opts.hold || 3800;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var timers = [], idx = 0, tiles = [], shown = 0, manual = false;
    el.classList.add('flipboard'); el.style.setProperty('--fb-cols', cols); el.innerHTML = '';
    var sr = document.createElement('span'); sr.className = 'fb-sr';
    for (var i = 0; i < cols * rows; i++) { var t = document.createElement('span'); t.className = 'fb-t'; t.setAttribute('aria-hidden', 'true'); el.appendChild(t); tiles.push(t); }
    el.appendChild(sr);
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function paint(t, tok) { t.innerHTML = tok.icon ? svg(tok.icon) : (tok.ch === ' ' ? '' : tok.ch); t.classList.toggle('is-icon', !!tok.icon); t.dataset.icon = tok.icon || ''; }
    function show(line) {
      sr.textContent = line.map(plain).join(' ');
      var cells = [];
      for (var r = 0; r < rows; r++) { var tk = tokens(line[r] || ''), lead = opts.align === 'center' ? Math.floor((cols - tk.length) / 2) : 0; for (var c = 0; c < cols; c++) cells.push(tk[c - lead] || { ch: ' ' }); }
      tiles.forEach(function (t, k) {
        var target = cells[k];
        if (reduce) { paint(t, target); return; }
        // sweep: every tile shuffles a while, then they settle one by one from left to right
        var spins = opts.sweep ? (opts.sweepStart || 16) + Math.round((k % cols) * (opts.sweepStep || 2))
                               : 5 + (k % cols) % 6 + Math.floor(Math.random() * 5);
        t.classList.add('is-spinning');
        (function spin(n) {
          if (n > 0) {
            var rnd = Math.random() < .22 ? { icon: NAMES[Math.floor(Math.random() * NAMES.length)] } : { ch: LETTERS[Math.floor(Math.random() * LETTERS.length)] };
            paint(t, rnd); if (el.__fbSpin) el.__fbSpin(t, k); t.classList.remove('is-flip'); void t.offsetWidth; t.classList.add('is-flip');
            later(function () { spin(n - 1); }, 65);
          } else { paint(t, target); t.classList.remove('is-spinning'); if (el.__fbSettle) el.__fbSettle(t, k); }
        })(spins);
      });
      shown++;
      // auto-advance, but stop after `passes` full rounds (and once someone has clicked through)
      var more = !opts.passes || shown < lines.length * opts.passes;
      if (!reduce && !manual && more && lines.length > 1) later(function () { idx = (idx + 1) % lines.length; show(lines[idx]); }, hold);
    }
    show(lines[0]);
    return {
      stop: function () { timers.forEach(clearTimeout); timers = []; },
      next: function () { manual = true; timers.forEach(clearTimeout); timers = []; idx = (idx + 1) % lines.length; show(lines[idx]); }
    };
  };
})();
