// Licence and honesty of the repository texts. Run: node --test tests/licence.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = (f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

test('the repository has an MIT licence, the READMEs list what it does not cover, and no text calls adapted recipes original', () => {
  const lic = read('../LICENSE');
  assert.match(lic, /^MIT License/);
  assert.match(lic, /Copyright \(c\) 2026 Nhut Tan Pham/);
  assert.match(lic, /THE SOFTWARE IS PROVIDED "AS IS"/);
  const readme = read('README.md'), root = read('../README.md');
  assert.match(readme, /## Licence/);
  ['SIL Open Font License', 'recipes published by dietitians'].forEach((x) => assert.ok(readme.includes(x), x));
  assert.match(root, /## Licence/);
  [readme, root, read('data/recipes.js')].forEach((s) => {
    assert.ok(!/No licence has been chosen/i.test(s));
    assert.ok(!/66 original recipes|every recipe, text, ingredient drawing and line of code here is original|original, simple recipes/.test(s), 'the recipes are adapted, not original');
  });
});
