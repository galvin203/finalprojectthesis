// Dish photos and the welcome screen's data. Run: node --test tests/photos.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
['ingredients', 'recipes', 'photos', 'i18n_ui'].forEach((f) => require('../data/' + f + '.js'));
const A = globalThis.Ateria;
const root = path.resolve(__dirname, '..');
const tool = require('../tools/photos_index.js');

test('data/photos.js lists exactly the usable photos in img/food/', () => {
  const { found, problems } = tool.scan();
  assert.deepEqual(problems, [], 'unusable files in img/food/: run node tools/photos_index.js');
  assert.deepEqual(A.PHOTOS, found, 'data/photos.js is out of date: run node tools/photos_index.js');
  Object.keys(A.PHOTOS).forEach((id) => {
    assert.ok(A.REC[id], 'photo for unknown recipe ' + id);
    assert.ok(fs.existsSync(path.join(root, A.PHOTOS[id].src)), A.PHOTOS[id].src + ' is missing');
    assert.deepEqual(A.photo(id), A.PHOTOS[id]);
  });
  assert.equal(A.photo('no_such_recipe'), null);
  assert.equal(A.photo('constructor'), null);
});

test('the JPEG reader finds the size in the frame header', () => {
  const b = Buffer.from([0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x02, 0xd0, 0x04, 0x00, 0x03, 1, 0x22, 0, 2, 0x11, 1, 3, 0x11, 1, 0, 0]);
  assert.deepEqual(tool.jpegSize(b), { h: 720, w: 1024 });
  assert.equal(tool.jpegSize(Buffer.from('not a jpeg at all')), null);
});

test('the single-file build leaves no img/ path behind, so logos and photos still show there', () => {
  execFileSync(process.execPath, [path.join(root, 'tools/build_artifact.js')], { stdio: 'pipe' });
  const out = fs.readFileSync(path.join(root, 'dist/ateria-artifact.html'), 'utf8');
  assert.ok(!/(src|href)="img\//.test(out), 'an image is still loaded from img/');
  assert.ok((out.match(/data:image\//g) || []).length >= 3 + Object.keys(A.PHOTOS).length);
});

test('the welcome screen and photo credit texts exist in all four languages', () => {
  const ui = A.I18N.ui;
  ['welcome.title', 'welcome.lead', 'welcome.pick', 'welcome.example', 'welcome.dishes', 'welcome.how', 'welcome.s1.t', 'welcome.s1.b', 'welcome.s2.t', 'welcome.s2.b', 'welcome.s3.t', 'welcome.s3.b', 'photo.credit', 'profile.goalMuscle', 'goal.muscle']
    .forEach((k) => ['en', 'fi', 'sv', 'vi'].forEach((l) => assert.ok(ui[l][k] && ui[l][k].length > 3, l + ' ' + k)));
  ['en', 'fi', 'sv', 'vi'].forEach((l) => assert.match(ui[l]['photo.credit'], /\{credit\}/, l));
});

test('the Vercel build copies img/ with its sub-folders', () => {
  const v = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  assert.match(v.buildCommand, /cp -r [^&]*\bimg\b/);
});
