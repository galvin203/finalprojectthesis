#!/usr/bin/env node
/* Builds dist/ateria-artifact.html: one HTML fragment (title + inline CSS + markup + inline scripts)
 * in the shape the Artifact tool expects. Usage: node tools/build_artifact.js */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const index = read('index.html');
const fonts = (index.match(/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com[^"]+)">/) || [])[1];
const body = index.slice(index.indexOf('<body>') + 6, index.indexOf('<script'));
const scripts = [...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
if (!fonts || !body.trim() || scripts.length < 5) throw new Error('index.html did not have the expected structure');

const safe = (js) => js.replace(/<\/script/gi, '<\\/script');
const out = [
  '<title>Ateria</title>',
  '<meta name="claude:viewport-fit-sides" content="cover">',
  '<link rel="stylesheet" href="' + fonts + '">',
  '<style>',
  read('styles.css'),
  '</style>',
  body.trim(),
  ...scripts.map((s) => '<script>\n' + safe(read(s)) + '\n</script>'),
  '',
].join('\n');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const target = path.join(root, 'dist', 'ateria-artifact.html');
fs.writeFileSync(target, out);
console.log('Wrote ' + target + ' (' + Math.round(out.length / 1024) + ' KB)');
