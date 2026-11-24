// The visual polish: energy shares for the ring, macro colours on the bars, motion only when allowed.
// Run: node --test tests/design.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
require('../data/ingredients.js');
require('../data/spices.js');
require('../data/recipes.js');
require('../js/engine.js');
const A = global.Ateria;
const read = (f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

test('energyShares: protein and carbs count 4 kcal per gram, fat 9, and the shares add up to 1', () => {
  const sh = A.engine.energyShares({ protein: 100, fat: 50, carbs: 250 });
  assert.ok(Math.abs(sh.protein + sh.fat + sh.carbs - 1) < 1e-12);
  assert.ok(Math.abs(sh.protein - 400 / 1850) < 1e-12);
  assert.ok(Math.abs(sh.fat - 450 / 1850) < 1e-12);
  assert.ok(Math.abs(sh.carbs - 1000 / 1850) < 1e-12);
});

test('energyShares: missing, negative or zero amounts give zeros instead of NaN', () => {
  assert.deepEqual(A.engine.energyShares({ protein: 0, fat: 0, carbs: 0 }), { protein: 0, fat: 0, carbs: 0 });
  assert.deepEqual(A.engine.energyShares({}), { protein: 0, fat: 0, carbs: 0 });
  const sh = A.engine.energyShares({ protein: -5, fat: 10, carbs: undefined });
  assert.equal(sh.protein, 0);
  assert.equal(sh.fat, 1);
});

test('energyShares works for every real plan the app can make', () => {
  for (const goal of ['lose', 'maintain', 'gain', 'muscle']) {
    const plan = A.engine.planWeek({ sex: 'male', age: 30, heightCm: 180, weightKg: 80, activity: 'active', goal, diet: 'omnivore', allergies: [], lactoseFree: false, dislikes: [], favorites: [], meals: ['breakfast', 'lunch', 'snack', 'dinner'], people: 1, budget: 0, cuisines: [] });
    assert.ok(!plan.error, goal + ': ' + plan.error);
    const sh = A.engine.energyShares(plan.targets);
    assert.ok(sh.protein > 0.05 && sh.protein < 0.45, goal + ' protein share ' + sh.protein);
    assert.ok(sh.fat > 0.15 && sh.fat < 0.45, goal + ' fat share ' + sh.fat);
    assert.ok(Math.abs(sh.protein + sh.fat + sh.carbs - 1) < 1e-9);
  }
});

test('every gauge names its nutrient, so the bar, the dot and the ring use one colour', () => {
  const src = read('js/app.js');
  for (const k of ['energy', 'protein', 'carbs', 'fat']) {
    assert.ok(src.includes("'" + k + "') +") || src.includes("'" + k + "')"), 'no gauge for ' + k);
    assert.match(read('styles.css'), new RegExp("\\.gauge\\[data-m='" + k + "'\\]"));
  }
  assert.match(src, /function energyRing/);
  assert.match(src, /class="ring" aria-hidden="true"/, 'the ring repeats numbers that are written out, so it is hidden from screen readers');
});

test('all motion in the polish block is inside prefers-reduced-motion: no-preference', () => {
  const css = read('styles.css');
  const start = css.indexOf('/* ---------- modern polish');
  assert.ok(start > 0);
  const stack = [];
  let buf = '';
  let seen = 0;
  for (const ch of css.slice(start)) {
    if (ch === '{') { stack.push(buf.trim()); buf = ''; }
    else if (ch === '}' || ch === ';') {
      if (/(^|[\s;])animation(-delay)?\s*:/.test(buf) && !/^animation-delay/.test(buf.trim())) {
        seen++;
        assert.ok(stack.some((p) => /no-preference/.test(p)), 'animation outside the no-preference block: ' + buf.trim().slice(0, 60));
      }
      buf = '';
      if (ch === '}') stack.pop();
    } else buf += ch;
  }
  assert.ok(seen >= 5, 'expected the animations to be found, saw ' + seen);
});

test('fx.js is loaded after app.js, is skipped for reduced motion, and reads or sends nothing', () => {
  const html = read('index.html'), fx = read('js/fx.js');
  assert.ok(html.indexOf('js/fx.js') > html.indexOf('js/app.js'));
  assert.match(fx, /prefers-reduced-motion: reduce/);
  assert.match(fx, /pointerType !== 'mouse'/, 'touch screens get no pointer light');
  assert.doesNotMatch(fx, /fetch\(|XMLHttpRequest|localStorage|sessionStorage|document\.cookie|sendBeacon/);
});

test('the polish adds no web address and no font service', () => {
  assert.doesNotMatch(read('js/fx.js') + read('styles.css'), /https?:\/\/(?!www\.w3\.org)/);
});
