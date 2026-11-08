#!/usr/bin/env node
/* Reads img/food/ and rewrites data/photos.js so the app shows a real photo for every recipe that has one.
 *
 *   node tools/photos_index.js          write data/photos.js and print which recipes still have no photo
 *   node tools/photos_index.js --check  only print the report (exit code 1 if a file is unusable)
 *
 * File rules:  img/food/<recipe id>.jpg (or .jpeg / .webp), landscape (16:9 or 4:3), at least 640 px wide,
 * at most 200 KB so the page stays fast on a phone.  Optional img/food/credits.json: { "<recipe id>": "Photographer, source, licence" }
 * for photos whose licence asks for a credit. Only use photos you took yourself or that carry a licence allowing this use.
 */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'img', 'food');
const MAX_BYTES = 200 * 1024;
const MIN_WIDTH = 640;

['ingredients', 'recipes'].forEach((f) => require(path.join(root, 'data', f + '.js')));
const ids = globalThis.Ateria.RECIPES.map((r) => r.id);

// width and height of a JPEG, read from its start-of-frame marker (no image library needed)
function jpegSize(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

function scan() {
  const found = {}, problems = [];
  const credits = fs.existsSync(path.join(dir, 'credits.json')) ? JSON.parse(fs.readFileSync(path.join(dir, 'credits.json'), 'utf8')) : {};
  (fs.existsSync(dir) ? fs.readdirSync(dir) : []).sort().forEach((f) => {
    const m = /^(.+)\.(jpe?g|webp)$/i.exec(f);
    if (!m) { if (f !== 'credits.json' && f !== 'README.md' && f !== '.gitkeep') problems.push(f + ': not a .jpg, .jpeg or .webp file'); return; }
    const id = m[1];
    if (ids.indexOf(id) < 0) { problems.push(f + ': no recipe has the id "' + id + '"'); return; }
    const buf = fs.readFileSync(path.join(dir, f));
    if (buf.length > MAX_BYTES) { problems.push(f + ': ' + Math.round(buf.length / 1024) + ' KB is over the ' + MAX_BYTES / 1024 + ' KB limit'); return; }
    if (/jpe?g/i.test(m[2])) {
      const s = jpegSize(buf);
      if (!s) { problems.push(f + ': not a readable JPEG'); return; }
      if (s.w < MIN_WIDTH) { problems.push(f + ': ' + s.w + ' px wide, at least ' + MIN_WIDTH + ' needed'); return; }
      if (s.w < s.h) { problems.push(f + ': portrait photo, use a landscape one'); return; }
    }
    found[id] = { src: 'img/food/' + f };
    if (credits[id]) found[id].credit = String(credits[id]);
  });
  return { found, problems };
}

function render(found) {
  const body = Object.keys(found).sort().map((id) => '    ' + JSON.stringify(id) + ': ' + JSON.stringify(found[id]) + ',').join('\n');
  const head = fs.readFileSync(path.join(root, 'data', 'photos.js'), 'utf8').split('  A.PHOTOS = ')[0];
  return head + '  A.PHOTOS = {' + (body ? '\n' + body + '\n  ' : '') + '};\n' +
    '  A.photo = function (id) { return Object.prototype.hasOwnProperty.call(A.PHOTOS, id) ? A.PHOTOS[id] : null; };\n})(typeof window !== \'undefined\' ? window : globalThis);\n';
}

if (require.main === module) {
  const { found, problems } = scan();
  const have = Object.keys(found).length;
  if (!process.argv.includes('--check')) fs.writeFileSync(path.join(root, 'data', 'photos.js'), render(found));
  console.log(have + ' of ' + ids.length + ' recipes have a photo.');
  if (problems.length) { console.log('Problems:'); problems.forEach((p) => console.log('  - ' + p)); }
  const missing = ids.filter((id) => !found[id]);
  if (missing.length) console.log('Still without a photo (' + missing.length + '):\n  ' + missing.join('\n  '));
  process.exit(problems.length ? 1 : 0);
}
module.exports = { scan, render, jpegSize, ids };
