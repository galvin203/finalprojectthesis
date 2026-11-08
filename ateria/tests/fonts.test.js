'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

test('every font file named in styles.css and index.html exists', () => {
  const css = read('styles.css');
  const urls = [...css.matchAll(/url\(\s*['"]?(fonts\/[^)'"\s]+)['"]?\s*\)/g)].map((m) => m[1]);
  assert.ok(urls.length >= 4, 'expected the serif and three sans files');
  for (const u of urls) assert.ok(fs.existsSync(path.join(root, u)), u + ' is missing');
  const preloads = [...read('index.html').matchAll(/<link rel="preload" href="([^"]+)"/g)].map((m) => m[1]);
  for (const u of preloads) assert.ok(fs.existsSync(path.join(root, u)), 'preload ' + u + ' is missing');
});

test('fonts come from this site only: no font service is contacted', () => {
  for (const f of ['index.html', 'styles.css']) {
    assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(read(f)), f + ' points to a font service');
  }
});

test('Vercel publishes the fonts folder', () => {
  const v = JSON.parse(read('vercel.json'));
  assert.ok(/\bfonts\b/.test(v.buildCommand), 'buildCommand must copy fonts/');
});

test('headline font never tightens letter spacing (Vietnamese tone marks)', () => {
  const css = read('styles.css');
  assert.ok(!/letter-spacing:\s*-/.test(css), 'negative letter-spacing found');
});
