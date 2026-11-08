// The cuisine cards on the swipe screen. Run: node --test tests/swipe.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
require('../data/ingredients.js');
require('../data/spices.js');
require('../data/recipes.js');
const A = global.Ateria;
const src = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');

test('each swipe card shows three real recipes that belong to its cuisine', () => {
  const block = src.match(/const SWIPE_DISHES = \{([\s\S]*?)\n  \};/);
  assert.ok(block, 'SWIPE_DISHES not found in app.js');
  const found = {};
  for (const m of block[1].matchAll(/(\w+): \[([^\]]*)\]/g)) found[m[1]] = [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  assert.deepEqual(Object.keys(found).sort(), A.CUISINES.slice().sort(), 'one card per cuisine');
  A.CUISINES.forEach((c) => {
    assert.equal(found[c].length, 3, c);
    found[c].forEach((id) => {
      assert.ok(A.REC[id], 'unknown recipe ' + id);
      assert.equal(A.REC[id].cuisine, c, id + ' is not ' + c);
    });
  });
});

test('the swipe screen is wired in: route, buttons, keyboard and drag', () => {
  assert.match(src, /swipe: viewSwipe/);
  ['swipeyes', 'swipeno', 'swipeundo', 'swipedone', 'swipereset', 'swipeskip'].forEach((a) => assert.ok(src.includes("'" + a + "'") || src.includes('"' + a + '"'), a));
  assert.match(src, /ArrowRight/);
  assert.match(src, /ArrowLeft/);
  assert.match(src, /pointerdown/);
  assert.match(src, /prefers-reduced-motion/);
});
