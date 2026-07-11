/* Lightbox — click a content image (or a fun-page video) to view it
 * full-screen for a closer look, with its caption underneath if it has one.
 *
 * Targets:
 *   - case-study content images (inside <main class="v2-main">)
 *   - fun-page gallery images AND videos (.gallery-item img / video)
 * Skips images/videos that are themselves links (e.g. "Other Projects"
 * thumbnails), the nav logo, and anything outside the content area.
 *
 * Captions come from the gallery item's data-caption attribute, so logos
 * show their names and doodles show their dates; items without one simply
 * show no caption. Case-study images have no gallery item, so no caption.
 *
 * Self-contained: injects its own styles, so no style.css / cache-buster
 * changes are needed. Loaded only on pages that opt in via <script src>.
 */
(function () {
  var triggers = Array.prototype.slice
    .call(document.querySelectorAll('.v2-main img, .gallery-item img, .gallery-item video'))
    // Skip links, and the Hi-Fi design-system / before-after module, which is
    // its own inline interactive block (its stepper images are built on the fly).
    .filter(function (el) { return !el.closest('a') && !el.closest('.v2-hifi'); });

  if (!triggers.length) return;

  // ── Styles ───────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '.lightbox-trigger { cursor: zoom-in; }',
    '.lightbox-overlay {',
    '  position: fixed; inset: 0; z-index: 2000;',
    '  display: flex; align-items: center; justify-content: center;',
    '  padding: 5vmin;',
    '  background: rgba(22, 22, 26, 0.84);',
    '  -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);',
    '  opacity: 0; visibility: hidden;',
    '  transition: opacity 0.28s ease, visibility 0.28s ease;',
    '  cursor: zoom-out;',
    '}',
    '.lightbox-overlay.is-open { opacity: 1; visibility: visible; }',
    '.lightbox-stage {',
    '  display: flex; flex-direction: column; align-items: center; gap: 14px;',
    '  max-width: 92vw; max-height: 90vh;',
    '}',
    '.lightbox-media {',
    '  box-sizing: border-box;',
    '  max-width: 92vw; max-height: 84vh; width: auto; height: auto;',
    '  object-fit: contain; border-radius: 10px;',
    '  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);',
    '  transform: scale(0.97); transition: transform 0.28s ease;',
    '  cursor: default; background: #000;',
    '}',
    // Transparent PNGs (e.g. the final logos: black art, no background) sit
    // on white with a little padding so the artwork stays visible.
    '.lightbox-media--png { background: #ffffff; padding: 28px; }',
    '.lightbox-overlay.is-open .lightbox-media { transform: scale(1); }',
    '.lightbox-caption {',
    '  color: rgba(255, 255, 255, 0.92);',
    "  font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 400;",
    '  letter-spacing: 0.01em; text-align: center; max-width: 80vw; cursor: default;',
    '}',
    '.lightbox-caption:empty { display: none; }',
    '.lightbox-close {',
    '  position: fixed; top: 22px; right: 26px;',
    '  width: 42px; height: 42px; border: none; border-radius: 50%;',
    '  background: rgba(255, 255, 255, 0.16); color: #fff;',
    '  font-size: 24px; line-height: 1; cursor: pointer;',
    '  display: flex; align-items: center; justify-content: center;',
    '  transition: background 0.2s;',
    '}',
    '.lightbox-close:hover { background: rgba(255, 255, 255, 0.3); }',
    '@media (prefers-reduced-motion: reduce) {',
    '  .lightbox-overlay, .lightbox-media { transition: opacity 0.01s; }',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  // ── Overlay ──────────────────────────────────────────────────────────
  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-hidden', 'true');

  var stage = document.createElement('div');
  stage.className = 'lightbox-stage';

  var caption = document.createElement('div');
  caption.className = 'lightbox-caption';

  var closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '&times;';

  stage.appendChild(caption);
  overlay.appendChild(stage);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  function clearMedia() {
    Array.prototype.slice.call(stage.querySelectorAll('.lightbox-media')).forEach(function (n) {
      if (n.tagName === 'VIDEO') { try { n.pause(); } catch (e) {} }
      n.remove();
    });
  }

  function open(trigger) {
    clearMedia();

    var media;
    if (trigger.tagName === 'VIDEO') {
      media = trigger.cloneNode(true); // deep clone keeps <source> + attributes
      media.controls = true;           // let viewers scrub / unmute in full view
    } else {
      media = document.createElement('img');
      media.src = trigger.currentSrc || trigger.src;
      media.alt = trigger.alt || '';
      // Cap at the image's native size so it never upscales past its own
      // resolution (which reads blurry); still bounded by the viewport.
      if (trigger.naturalWidth) {
        media.style.maxWidth = 'min(92vw, ' + trigger.naturalWidth + 'px)';
        media.style.maxHeight = 'min(84vh, ' + trigger.naturalHeight + 'px)';
      }
      // Transparent PNGs get a white backdrop so black artwork stays visible.
      if (/\.png(\?|$)/i.test(media.src)) media.classList.add('lightbox-media--png');
    }
    media.classList.add('lightbox-media');
    stage.insertBefore(media, caption);

    // Captions come from logo items only; doodles (dates) stay uncaptioned.
    var item = trigger.closest('.gallery-item');
    var inDoodles = trigger.closest('.doodles-grid');
    caption.textContent = (item && !inDoodles) ? (item.getAttribute('data-caption') || '') : '';

    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (media.tagName === 'VIDEO') {
      var p = media.play();
      if (p && p.catch) p.catch(function () {});
    }
  }

  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Remove the media once hidden so videos stop and images don't flash.
    setTimeout(function () {
      if (!overlay.classList.contains('is-open')) clearMedia();
    }, 300);
  }

  triggers.forEach(function (el) {
    el.classList.add('lightbox-trigger');
    el.addEventListener('click', function () { open(el); });
  });

  // Click anywhere except the media or its caption (backdrop / close) closes.
  overlay.addEventListener('click', function (e) {
    if (!e.target.closest('.lightbox-media') && !e.target.closest('.lightbox-caption')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });
})();
