// Store logos: every store has a logo file that ships with the site. Run: node --test tests/stores.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
require('../data/ingredients.js');
const A = globalThis.Ateria;
const root = path.resolve(__dirname, '..');

test('every store has a logo file in img/', () => {
  assert.equal(A.STORES.length, 3);
  A.STORES.forEach((s) => {
    assert.match(s.logo, /^img\/[a-z]+\.(png|jpg)$/, s.id);
    const f = path.join(root, s.logo);
    assert.ok(fs.existsSync(f), s.id + ' logo is missing: ' + s.logo);
    assert.ok(fs.statSync(f).size < 60 * 1024, s.id + ' logo is too large for a page that loads on mobile');
  });
});

test('the Vercel build copies img/ so the logos are published', () => {
  const v = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  assert.match(v.buildCommand, /\bimg\b/);
});

test('the logo notice exists in all four languages', () => {
  require('../data/i18n_ui.js');
  const ui = globalThis.Ateria.I18N.ui;
  ['en', 'fi', 'sv', 'vi'].forEach((l) => assert.ok(ui[l]['shop.logos'] && ui[l]['shop.logos'].length > 20, l));
});
