/* Small visual touches that need a little script. No data is read or sent.
   1. A soft light follows the mouse over cards (mouse and trackpad only, never on touch screens).
   2. When the screen changes, the new content fades in for a moment (see "screen change" in styles.css).
   Both are skipped when the person asks their system for less motion. */
(function () {
  'use strict';
  var d = document;
  var mq = function (q) { return typeof matchMedia === 'function' && matchMedia(q).matches; };
  var calm = mq('(prefers-reduced-motion: reduce)');
  if (calm) return;

  if (mq('(hover: hover) and (pointer: fine)')) {
    var frame = 0, last = null;
    d.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      last = e;
      if (frame) return;
      frame = requestAnimationFrame(function () {
        frame = 0;
        var el = last.target && last.target.closest ? last.target.closest('.meal, .item, .gcard, .panel') : null;
        if (!el) return;
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', Math.round(last.clientX - r.left) + 'px');
        el.style.setProperty('--my', Math.round(last.clientY - r.top) + 'px');
      });
    }, { passive: true });
  }

  var timer = 0;
  function enter() {
    var main = d.getElementById('main');
    if (!main) return;
    main.setAttribute('data-enter', '');
    clearTimeout(timer);
    timer = setTimeout(function () { main.removeAttribute('data-enter'); }, 700);
  }
  window.addEventListener('hashchange', enter);
  enter();
})();
