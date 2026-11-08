/*
 * Ateria illustrations: original flat SVG drawings, 48 x 48, one per ingredient plus a few pictograms.
 * They are drawings of the food, NOT photos of store products, and contain no brand artwork.
 * Every colour is fixed (not themed) because the drawings are shown on a light tile in both themes.
 *
 *   Ateria.icon(id, size)   -> '<svg ...>' string for an ingredient id or a pictogram id
 *   Ateria.ICONS            -> { id: inner SVG markup }
 */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});
  const C = {
    red: '#d8473f', red2: '#a8312c', orange: '#ef8a2a', orange2: '#c96a14', yellow: '#f4c431', yellow2: '#d9a416',
    green: '#4f9d45', green2: '#2f7a3a', green3: '#a5d46f', brown: '#8a5a33', brown2: '#5e3a20', tan: '#d9b27a',
    tan2: '#c49a5c', cream: '#f6ecd4', white: '#ffffff', ice: '#e9f1f7', grey: '#c9ced1', grey2: '#8d979d',
    blue: '#3d78b8', blue2: '#2f5a93', blue3: '#bcd8f0', pink: '#f2a49a', purple: '#6c4a8c', ink: '#2b2a28',
  };

  function rot(a, x, y) { return ' transform="rotate(' + a + ' ' + x + ' ' + y + ')"'; }
  function ell(cx, cy, rx, ry, fill, a, extra) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"' + (a ? rot(a, cx, cy) : '') + (extra || '') + '/>'; }
  function circ(cx, cy, r, fill, extra) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function path(d, fill, extra) { return '<path d="' + d + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function line(d, stroke, w) { return '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round"/>'; }
  function rect(x, y, w, h, rx, fill) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="' + fill + '"/>'; }
  const OUT = ' stroke="#cdd5d8" stroke-width="1.4"';
  function fit(inner, sc) { return '<g transform="translate(24 24) scale(' + sc + ') translate(-24 -24)">' + inner + '</g>'; }
  function shine(cx, cy, rx, ry, a) { return ell(cx, cy, rx, ry, '#fff', a, ' opacity=".35"'); }

  // a grain ear, stem from (x, y+h) upward
  function ear(x, top, pairs, gap, gw, gh, col) {
    let s = line('M' + x + ' ' + (top + pairs * gap + 8) + 'V' + (top + 2), C.green2, 2);
    for (let i = 0; i < pairs; i++) {
      const y = top + 4 + i * gap;
      s += ell(x - gw, y, gw * 0.62, gh, col, -32) + ell(x + gw, y, gw * 0.62, gh, col, 32);
    }
    return s + ell(x, top, gw * 0.6, gh, col);
  }

  function carton(body, band, inner) {
    return path('M13 18L18 9h12l5 9z', C.white, OUT) + rect(18, 5, 12, 5, 1, C.grey) +
      rect(13, 18, 22, 26, 2, body) + rect(13, 28, 22, 10, 0, band) + (inner || '');
  }
  const drop = (cx, cy, s, fill) => path('M' + cx + ' ' + (cy - 5 * s) + 'c' + (4 * s) + ' ' + (5 * s) + ' ' + (5 * s) + ' ' + (7 * s) + ' ' + (5 * s) + ' ' + (9 * s) + 'a' + (5 * s) + ' ' + (5 * s) + ' 0 0 1-' + (10 * s) + ' 0c0-' + (2 * s) + ' ' + (1 * s) + '-' + (4 * s) + ' ' + (5 * s) + '-' + (9 * s) + 'z', fill);
  function can(body, top) { return rect(9, 17, 30, 22, 3, body) + ell(24, 39, 15, 4, C.grey2) + rect(9, 17, 30, 20, 3, body) + ell(24, 17, 15, 5, top || C.grey) + ell(24, 17, 11, 3, '#e8edf0'); }
  function sparkle(cx, cy, s, col) { return line('M' + cx + ' ' + (cy - s) + 'V' + (cy + s) + 'M' + (cx - s) + ' ' + cy + 'H' + (cx + s) + 'M' + (cx - s * 0.7) + ' ' + (cy - s * 0.7) + 'L' + (cx + s * 0.7) + ' ' + (cy + s * 0.7) + 'M' + (cx + s * 0.7) + ' ' + (cy - s * 0.7) + 'L' + (cx - s * 0.7) + ' ' + (cy + s * 0.7), col, 1.8); }

  const I = {};

  // ---------- grains & bread ----------
  I.oats = path('M13 15h22l3 27H10z', C.tan) + path('M13 15h22l-1.2 5H14.2z', C.tan2) + ear(24, 23, 3, 4.6, 3.4, 2.7, '#f1dc8a');
  I.rye_bread = path('M6 31c0-9 8-15 18-15s18 6 18 15v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z', '#7a4a28') +
    path('M6 31c0-9 8-15 18-15s18 6 18 15z', '#8d5a33') +
    line('M15 22l5 7M24 20l5 8M33 23l3 5', '#c7a074', 2) + circ(17, 34, 1, '#d9b27a') + circ(26, 35, 1, '#d9b27a') + circ(33, 33, 1, '#d9b27a') + circ(21, 37, 1, '#d9b27a');
  I.pasta = [8, 19, 30].map(function (y) {
    return '<g' + rot(-28, 24, 24) + '>' + rect(8, y - 2, 32, 9, 3, '#f0c96a') + rect(8, y - 2, 32, 3, 1.5, '#f7dc92') + line('M13 ' + (y + 4) + 'H35', '#d9a93d', 1.2) + '</g>';
  }).join('');
  I.rice = path('M5 27h38a19 16 0 0 1-38 0z', C.blue) + path('M5 27h38l-1 3H6z', C.blue3) +
    path('M9 27c0-9 7-15 15-15s15 6 15 15z', C.white, OUT) + line('M16 20l2 3M23 16l2 3M30 20l2 3M20 24l2 2M28 24l2 2M14 25l1 1', '#b9c3c8', 1.6);
  I.quinoa = path('M5 27h38a19 16 0 0 1-38 0z', C.green2) + path('M5 27h38l-1 3H6z', C.green3) +
    path('M9 27c0-8 7-14 15-14s15 6 15 14z', '#ecd29a') +
    [[15, 24], [20, 19], [26, 17], [32, 22], [24, 23], [18, 26], [30, 26], [22, 15], [12, 26], [35, 26]].map(function (p, i) { return circ(p[0], p[1], 1.6, i % 3 === 0 ? '#c9774e' : i % 3 === 1 ? '#f6e6bd' : '#b99a62'); }).join('');
  I.tortilla = ell(26, 28, 17, 15, '#d9b377') + circ(22, 24, 17, '#efd9a6') + circ(22, 24, 14, '#f5e4bb') +
    [[15, 19], [24, 17], [29, 25], [18, 30], [25, 31], [13, 26]].map(function (p) { return circ(p[0], p[1], 1.6, '#c99a52'); }).join('');
  I.potato = path('M9 28c0-10 8-16 18-15 9 1 13 8 11 16-2 8-12 11-20 8-6-2-9-5-9-9z', '#c8924f') + shine(18, 20, 6, 3, -20) +
    [[16, 30], [26, 22], [31, 31], [23, 34]].map(function (p) { return ell(p[0], p[1], 1.6, 1, '#8a5a33', 20); }).join('');
  I.wheat = ear(24, 9, 4, 6.5, 5.2, 4.2, '#e0b040');

  // ---------- meat, fish, eggs, plant protein ----------
  I.chicken = line('M20 28L11 37', '#f4efe4', 6) + circ(9, 36, 3.2, '#f4efe4') + circ(12, 40, 3.2, '#f4efe4') +
    ell(29, 19, 15, 12.5, '#d98a3d', -45) + ell(29, 19, 12, 9.5, '#e6a257', -45) + ell(24, 14, 6, 2.6, '#fff', -45, ' opacity=".3"');
  I.beef_mince = rect(5, 31, 38, 8, 3, '#dfe6e9') + path('M8 33c0-10 7-16 16-16s16 6 16 16z', '#c4453f') +
    line('M13 29c2-3 4-3 6 0M21 25c2-3 5-3 7 0M28 30c2-3 4-3 6 0M17 23c1-2 3-2 4 0', '#e8857a', 2) + circ(16, 32, 1.6, '#8f2b2b') + circ(25, 31, 1.6, '#8f2b2b') + circ(33, 33, 1.6, '#8f2b2b');
  I.salmon = path('M4 28c0-7 8-14 20-14 11 0 20 4 20 11s-9 12-21 12S4 35 4 28z', '#f08a63') + path('M4 28c1 4 6 6 14 7C10 33 6 31 4 28z', '#d96a43') +
    line('M14 20c4 4 5 10 4 16M22 17c4 5 5 11 3 19M31 17c4 4 5 9 4 15', '#fde3d6', 2.2);
  I.cod = path('M4 14l11 10L4 34c2-6 2-14 0-20z', '#7f9bb0') + ell(26, 24, 17, 10, '#9fb8c8') + ell(27, 28, 14, 5, '#e1ebf1') +
    circ(35, 22, 2, C.ink) + circ(35.6, 21.4, 0.7, '#fff') + path('M22 14c3-4 8-4 10-1-3 0-7 0-10 1z', '#7f9bb0') + line('M31 26c1 1 3 1 4 0', '#6d8799', 1.4);
  I.tuna = can(C.blue) + rect(9, 24, 30, 10, 0, C.white) + ell(22, 29, 6.5, 3.4, C.orange) + path('M27 29l5-3.4v6.8z', C.orange) + circ(19, 28.2, 0.9, C.ink);
  I.egg = path('M17 9c6 0 11 9 11 17a11 11 0 0 1-22 0C6 18 11 9 17 9z', '#c68a52') + shine(12, 18, 2.6, 4.4, 15) +
    path('M31 15c6.5 0 12 9 12 17a12 12 0 0 1-24 0c0-8 5.500-17 12-17z', '#fffdf6', OUT) + path('M31 15c6.5 0 12 9 12 17H19c0-8 5.500-17 12-17z', '#f2eedf', ' opacity=".5"') + shine(25, 27, 2.6, 5, 15);
  I.tofu = path('M8 22l6-7h26l-6 7z', '#fffaf0', OUT) + path('M34 22l6-7v16l-6 7z', '#e6dcc0') + rect(8, 22, 26, 16, 2, '#f6efdc') +
    line('M12 28h18M12 33h12', '#e1d4b0', 1.6);
  I.lentils = path('M6 28h36a18 14 0 0 1-36 0z', C.cream) + path('M6 28h36l-1.5 3h-33z', C.tan) +
    [[14, 24], [20, 20], [27, 19], [33, 23], [24, 24], [17, 27], [30, 27], [22, 15.500], [10, 27], [37, 27], [26, 14]].map(function (p, i) { return circ(p[0], p[1], 3, i % 2 ? '#e5742e' : '#cf5a1a'); }).join('');
  I.chickpeas = [[16, 18], [30, 17], [23, 28], [11, 31], [35, 31], [24, 38]].map(function (p, i) {
    return circ(p[0], p[1], 6.4, i % 2 ? '#e3bb6e' : '#d8ab5a') + path('M' + (p[0] + 2) + ' ' + (p[1] - 6) + 'l3-2.500-.6 3.500z', '#c0903f') + shine(p[0] - 2, p[1] - 2, 1.8, 1.2, -30);
  }).join('');
  I.kidney_beans = [[15, 17, -25], [31, 15, 20], [22, 29, 8], [36, 31, -30], [10, 35, 30]].map(function (b) {
    return ell(b[0], b[1], 9, 5.5, '#9c2a2a', b[2]) + ell(b[0] - 2, b[1] - 1.6, 4, 1.4, '#c85a55', b[2]) + ell(b[0] + 3, b[1] + 2, 1.6, 0.9, '#f1d6cf', b[2]);
  }).join('');
  I.peanut_butter = rect(11, 14, 26, 27, 4, '#c98a45') + rect(10, 9, 28, 7, 2, C.red) + rect(14, 22, 20, 14, 2, C.cream) +
    ell(20, 29, 3.2, 2.6, C.tan2) + ell(28, 29, 3.2, 2.6, C.tan2) + rect(21, 27.5, 6, 3, 1, C.tan2);
  I.peanut = ell(17, 31, 11, 9, '#d9b27a', -35) + ell(31, 17, 11, 9, '#d9b27a', -35) + ell(24, 24, 8, 5, '#d9b27a', -35) +
    [[13, 33], [18, 28], [27, 20], [32, 14], [22, 25]].map(function (p) { return circ(p[0], p[1], 0.9, '#b58a52'); }).join('');
  I.almonds = [[16, 28, -20, 1], [32, 26, 24, 1], [24, 17, 0, 0.9]].map(function (a) {
    return '<g' + rot(a[2], a[0], a[1]) + '>' + path('M' + a[0] + ' ' + (a[1] - 13 * a[3]) + 'c' + (8 * a[3]) + ' ' + (8 * a[3]) + ' ' + (9 * a[3]) + ' ' + (20 * a[3]) + ' 0 ' + (26 * a[3]) + 'c-' + (9 * a[3]) + '-' + (6 * a[3]) + '-' + (8 * a[3]) + '-' + (18 * a[3]) + ' 0-' + (26 * a[3]) + 'z', '#b87a3f') + ell(a[0] - 2, a[1] - 3, 1.6, 6, '#d29a62') + '</g>';
  }).join('');
  I.walnuts = circ(24, 25, 16, '#a9743c') + line('M24 9c-3 5-3 10 0 16s3 11 0 16', '#6e4720', 2) +
    line('M12 18c4 1 6 4 6 8M36 18c-4 1-6 4-6 8M14 33c3-1 6 0 8 2M34 33c-3-1-6 0-8 2', '#6e4720', 1.6) + shine(17, 17, 4, 2.4, -35);
  I.sunflower = [[15, 17, -35], [33, 15, 35], [24, 28, 8], [12, 33, -15], [36, 33, 25]].map(function (s) {
    return '<g' + rot(s[2], s[0], s[1]) + '>' + path('M' + s[0] + ' ' + (s[1] - 10) + 'c6 4 7 14 0 20c-7-6-6-16 0-20z', '#3a3a3a') + line('M' + s[0] + ' ' + (s[1] - 8) + 'V' + (s[1] + 8), '#d9d9d9', 1.6) + '</g>';
  }).join('');
  I.chia = path('M7 27h34a17 14 0 0 1-34 0z', '#5b9fa3') + path('M7 27h34l-1.500 3h-31z', '#8cc3c6') + path('M10 27c0-7 6-11 14-11s14 4 14 11z', '#5c5e63') +
    [[15, 24], [21, 20], [28, 21], [33, 25], [24, 25], [18, 27], [29, 27], [11, 26]].map(function (p, i) { return circ(p[0], p[1], 1.2, i % 2 ? '#c9ccd0' : '#2d2e31'); }).join('');
  I.soybean = path('M5 33C8 16 24 7 43 9c-1 18-14 32-34 29z', '#7fbf5f') + [[14, 29], [24, 22], [34, 16]].map(function (b) { return circ(b[0], b[1], 5.600, '#b7e08a') + circ(b[0] - 1.500, b[1] - 1.500, 1.800, '#dff3c4'); }).join('') + line('M5 35c-1 3-2 5-3 7', C.green2, 2.500);
  I.sesame = [[14, 16], [26, 13], [34, 22], [20, 25], [12, 33], [29, 32], [37, 37], [21, 40]].map(function (p, i) { return ell(p[0], p[1], 3.6, 2, i % 2 ? '#efe3c2' : '#e2cf9a', i * 40); }).join('');

  // ---------- dairy & alternatives ----------
  I.milk = carton(C.ice, C.blue, drop(24, 33, 0.55, C.white));
  I.milk_lf = carton('#e7f3e9', C.green, drop(24, 33, 0.55, C.white)) + circ(37, 38, 8, C.white) + circ(37, 38, 6.5, 'none', ' stroke="' + C.red + '" stroke-width="2"') + line('M32.500 42.500l9-9', C.red, 2);
  I.oat_drink = carton('#f7efd6', C.tan2, '<g transform="translate(0 2) scale(.9)">' + ear(24, 26, 2, 3.8, 2.6, 2.1, '#fff3c0') + '</g>');
  I.yoghurt = path('M12 17h24l-3 24a2 2 0 0 1-2 1.500H17a2 2 0 0 1-2-1.500z', '#f4f7f9', OUT) + path('M13 25h22l-.8 6H13.800z', C.blue) + rect(10, 12, 28, 6, 2, C.blue2) + line('M31 12l6-8', C.grey2, 2.500);
  I.skyr = path('M8 22h32l-3 18a3 3 0 0 1-3 2.500H14a3 3 0 0 1-3-2.500z', '#2f9aa0') + path('M9 22h30l-.8 5H9.800z', '#5fbcc1') + rect(6, 17, 36, 6, 3, C.white, OUT) + path('M13 17c0-5 5-7 11-7s11 2 11 7z', C.white, OUT) + line('M30 8l7-5', C.grey2, 2.500);
  I.cottage = path('M6 27h36a18 15 0 0 1-36 0z', '#c47a52') + path('M6 27h36l-1.500 3h-33z', '#a85f3b') +
    [[13, 24], [19, 20], [26, 19], [32, 23], [24, 24], [17, 27], [30, 27], [22, 15], [10, 27], [36, 27], [27, 14]].map(function (p) { return circ(p[0], p[1], 4, '#fffdf8') + circ(p[0] + 1, p[1] + 1.200, 1.4, '#e8e2d2'); }).join('');
  I.cheese = path('M6 27L38 11l4 14z', '#fbd85a') + rect(6, 27, 36, 12, 1, C.yellow) + path('M42 25v12l0 2z', C.yellow2) +
    circ(14, 33, 2.4, C.yellow2) + circ(25, 31, 3, C.yellow2) + circ(34, 34, 2.2, C.yellow2) + circ(30, 19, 1.8, '#e4b92e');
  I.feta = path('M7 24l5-6h14l-5 6z', '#ffffff', OUT) + path('M21 24l5-6v12l-5 7z', '#e8e2d0') + rect(7, 24, 14, 13, 1, '#f5f1e4') + '<rect x="7" y="24" width="14" height="13" rx="1" fill="none"' + OUT + '/>' +
    path('M27 31l5-6h11l-5 6z', '#ffffff', OUT) + path('M38 31l5-6v10l-5 6z', '#e8e2d0') + rect(27, 31, 11, 10, 1, '#f5f1e4') + '<rect x="27" y="31" width="11" height="10" rx="1" fill="none"' + OUT + '/>' +
    circ(14, 40, 2.500, C.ink) + circ(20, 42, 2.500, C.ink) + path('M38 16c4-4 8-4 9-1-4 2-7 2-9 1z', C.green);
  I.hummus = path('M5 25h38a19 16 0 0 1-38 0z', C.blue) + path('M5 25h38l-1 3H6z', C.blue3) + path('M8 25c0-6 7-9 16-9s16 3 16 9z', '#ead3a0') +
    line('M13 23c4-3 8-3 12 0s8 3 11 0', '#d4b777', 1.8) + circ(24, 20, 3.4, '#d3a54a', ' opacity=".7"') + circ(19, 18.500, 1.8, '#d9b27a') + circ(29, 19, 1.8, '#d9b27a') + circ(24, 17.500, 1.2, C.red);

  // ---------- pantry ----------
  I.oil = path('M19 5h10v9l5 9v17a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V23l5-9z', '#f2c230') + rect(19, 3, 10, 5, 1.500, C.green2) + shine(19, 30, 2, 8, 0) +
    path('M15 30h18v10a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3z', '#e0a516') + rect(17, 24, 14, 10, 2, C.cream) + circ(24, 29, 2.600, C.yellow);
  I.honey = rect(12, 8, 24, 7, 2, C.brown2) + path('M10 17c0-2 2-3 4-3h20c2 0 4 1 4 3v21a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5z', '#e8a317') +
    shine(15, 28, 2, 9, 0) + path('M24 20l5 3v6l-5 3-5-3v-6z', C.cream) + path('M24 23.500l2.600 1.500v3l-2.600 1.500-2.600-1.500v-3z', '#e8a317');
  I.soy_sauce = rect(18, 4, 12, 7, 2, C.red) + path('M19 11h10v6l6 6v16a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V23l6-6z', '#2b1d18') + shine(18, 30, 1.8, 8, 0) +
    rect(16, 26, 16, 11, 2, C.cream) + circ(24, 31.500, 3, '#4a3426');
  I.canned_tomato = can(C.red) + rect(9, 24, 30, 10, 0, C.cream) + circ(24, 29, 4.6, C.red) + path('M24 24l-2 2h4z', C.green2);
  I.frozen_veg = path('M10 8h28l-2 4 2 4-3 26a3 3 0 0 1-3 2H16a3 3 0 0 1-3-2L10 16l2-4z', C.blue3) + path('M10 8h28v4H10z', '#8fb8dd') +
    circ(19, 24, 3, C.green) + circ(27, 22, 3, C.green) + circ(23, 30, 3, C.green) + rect(26, 28, 6, 6, 1, C.orange) + rect(14, 31, 6, 6, 1, C.orange) + circ(31, 36, 3, C.yellow);

  // ---------- fruit & vegetables ----------
  I.tomato = ell(24, 28, 17, 15, C.red) + shine(17, 21, 4.500, 2.800, -30) +
    [0, 72, 144, 216, 288].map(function (a) { return '<g transform="translate(24 15) rotate(' + a + ')">' + ell(0, -4, 2.200, 5.500, C.green2) + '</g>'; }).join('') + circ(24, 15, 2, C.green2);
  I.cucumber = fit('<g' + rot(-35, 26, 20) + '>' + rect(6, 12, 40, 16, 8, C.green) + rect(6, 12, 40, 6, 3, '#6fb85f') + line('M12 22h26', C.green2, 1.4) + '</g>' +
    circ(15, 36, 9, C.green2) + circ(15, 36, 7, '#c8e6a3') + [[12, 34], [17, 33], [18, 38], [12, 39]].map(function (p) { return ell(p[0], p[1], 1.2, 0.7, '#e8f4c8'); }).join(''), 0.82);
  I.carrot = fit('<g' + rot(-40, 24, 24) + '>' + path('M4 24c0-4 4-7 10-8l26 6c3 1.500 3 3.500 0 4l-26 6c-6-1-10-4-10-8z', C.orange) + line('M16 20v3M22 26v3M28 21v3', C.orange2, 1.8) + '</g>' +
    line('M9 15c-1-5-4-7-5-8M10 14c1-5 4-8 5-9M12 15c3-3 7-4 9-4', C.green2, 2.600), 0.92);
  I.broccoli = path('M20 42c0-8 1-12-2-17h12c-3 5-2 9-2 17z', '#8fc46a') +
    [[14, 22, 7], [24, 16, 8.500], [34, 22, 7], [19, 26, 6], [29, 26, 6]].map(function (b, i) { return circ(b[0], b[1], b[2], i % 2 ? C.green2 : C.green); }).join('') + circ(22, 13, 2, '#6fb85f') + circ(30, 20, 2, '#6fb85f');
  I.spinach = '<g' + rot(-25, 24, 26) + '>' + path('M24 6c10 6 12 16 6 24-4 5-8 7-12 7C10 28 12 12 24 6z', C.green2) + line('M24 10v28M24 20l6-5M24 26l-6-5M24 30l5-3', '#7fc16b', 1.600) + '</g>' +
    '<g' + rot(35, 24, 26) + '>' + path('M26 20c7 3 10 9 7 16-2 3-5 5-9 5-3-8-3-15 2-21z', C.green) + '</g>';
  I.onion = line('M24 10c-2-3-1-5 1-6', C.green2, 2.200) + path('M24 8c6 6 16 9 16 22 0 9-7 13-16 13S8 39 8 30C8 17 18 14 24 8z', '#e2a14a') +
    path('M24 8c-3 6-8 10-8 22 0 8 3 12 8 13-3-12-1-22 0-35z', '#c98a36', ' opacity=".45"') + line('M24 40v4M20 41l-2 3M28 41l2 3', C.tan2, 1.800) + shine(16, 25, 2.500, 6, 10);
  I.bell_pepper = path('M24 14c-4-3-12-1-14 7-2 8 1 18 8 20 3 1 5-1 6-1s3 2 6 1c7-2 10-12 8-20-2-8-10-10-14-7z', C.red) +
    line('M24 14c-5 6-5 16-4 27M24 14c5 6 5 16 4 27', '#a8312c', 1.6) + shine(15, 24, 2.500, 5.500, 10) +
    path('M22 13c0-4 1-6 4-8l1 2c-2 2-2 4-2 7z', C.green2) + path('M18 15c3-3 9-3 12 0-3 1-9 1-12 0z', C.green);
  I.garlic = path('M24 5c2 4 2 7 1 9 8 3 14 9 14 18 0 8-6 11-15 11S9 40 9 32c0-9 6-15 14-18-1-2-1-5 1-9z', '#f8f4ea', OUT) +
    line('M24 15c-5 5-8 12-7 26M24 15c5 5 8 12 7 26M24 15c0 9 0 17 0 26', '#d9cfb8', 1.6) + path('M9 32c1-4 3-7 5-9-2 5-2 11 1 17-4-1-6-4-6-8z', '#e2cfe3', ' opacity=".8"');
  I.zucchini = fit('<g' + rot(-30, 24, 24) + '>' + rect(4, 15, 40, 14, 7, '#2f6b35') + rect(4, 15, 40, 5, 2.500, '#4d8f4f') + line('M10 24h28M10 19h5M20 19h5M30 19h5', '#7ec27a', 1.200) + rect(40, 17, 6, 10, 2, '#3f7a40') + '</g>' +
    circ(14, 37, 8, '#2f6b35') + circ(14, 37, 6.200, '#dff0b6') + circ(14, 37, 2.200, '#f3f8d9'), 0.82);
  I.mushrooms = rect(13, 24, 9, 14, 3, '#f1e8d8') + path('M6 26c0-9 6-14 13-14s13 5 13 14z', '#b4825a') + shine(13, 18, 3, 1.600, -20) +
    rect(31, 30, 7, 11, 2.500, '#f1e8d8') + path('M25 31c0-7 4-11 9.500-11S44 24 44 31z', '#c99a70') + circ(15, 21, 1.4, '#e8d3b8') + circ(22, 18, 1.2, '#e8d3b8') + circ(36, 26, 1.1, '#e8d3b8');
  I.cabbage = circ(24, 26, 17, '#b6dc88') + line('M24 9c-6 5-8 12-5 17s6 10 5 17M24 9c6 5 8 12 5 17s-6 10-5 17', '#8dbf5e', 2) +
    line('M9 22c5 2 9 6 11 12M39 22c-5 2-9 6-11 12', '#8dbf5e', 2) + shine(16, 17, 3.500, 2, -35);
  I.salad_mix = path('M5 27h38a19 16 0 0 1-38 0z', C.white) + path('M5 27h38l-1 3H6z', '#d6dde0') +
    path('M8 27c-2-8 4-14 9-12 2-5 9-6 12-1 6-2 11 4 10 10 1 2 0 3-1 3z', '#7fc16b') + line('M14 27c-2-5 2-9 6-8M26 27c-1-6 3-10 8-8', C.green2, 1.6) +
    circ(30, 19, 4, C.red) + circ(18, 18, 3, C.orange);
  I.sweet_potato = fit('<g' + rot(-28, 24, 24) + '>' + path('M3 25c0-6 5-10 12-10h16c8 0 14 3 14 8s-6 9-14 9H15C8 32 3 30 3 25z', '#b8553f') + path('M3 25c0-6 5-10 12-10h16l-2 5H8c-3 1-4 3-5 5z', '#cf6d52', ' opacity=".7"') + line('M16 24h18M20 28h14', '#8c3a2a', 1.600) + '</g>' +
    circ(34, 38, 7, '#b8553f') + circ(34, 38, 5.200, '#f39a3f'), 0.84);
  I.avocado = path('M24 4c7 0 12 9 14 18 2 9-3 20-14 20S8 31 10 22C12 13 17 4 24 4z', '#2f6b35') + path('M24 8c5 0 9 8 10.500 15 1.500 8-2 15.500-10.500 15.500S12.500 31 14 23C15.500 16 19 8 24 8z', '#c9e08a') +
    circ(24, 29, 7, C.brown) + shine(21.500, 26.500, 2, 3, 20);
  I.banana = path('M8 14c2 14 10 24 28 25 3 0 5-2 5-4-12 0-18-7-22-21-1-3-4-3-6-1-4 0-5 0-5 1z', '#f4d03a') + line('M12 14c3 12 10 20 24 22', '#d9a416', 2) +
    rect(8, 8, 7, 8, 2, '#8d6b32') + circ(40, 38, 2.800, '#5e3a20');
  I.apple = path('M24 15c-5-4-15-3-15 9 0 11 8 20 13 18 1-.4 3-.4 4 0 5 2 13-7 13-18 0-12-10-13-15-9z', C.red) + line('M24 15c-5-4-15-3-15 9', '#b9362f', 1.4) + shine(15.500, 25, 2.500, 5, 10) +
    line('M24 15c0-4 1-7 3-9', C.brown2, 2.400) + path('M27 9c3-4 8-4 10-3-1 4-5 6-10 3z', C.green);
  I.blueberries = [[16, 28, 9], [32, 28, 9], [24, 17, 9], [24, 36, 8]].map(function (b) {
    return circ(b[0], b[1], b[2], '#4a5fa5') + circ(b[0], b[1], b[2] - 2.800, '#5b72b8') + shine(b[0] - 3, b[1] - 3, 2.400, 1.400, -30) + circ(b[0] + 1, b[1] + 1.500, 1.800, '#2f3b73');
  }).join('') + path('M32 8c4-4 9-3 11 0-3 4-8 4-11 0z', C.green);

  // ---------- pictograms (not ingredients) ----------
  I.sunrise = line('M4 36h40', C.grey2, 2.5) + path('M12 36a12 12 0 0 1 24 0z', C.yellow) +
    line('M24 12v6M10 18l4 4M38 18l-4 4M5 28h5M38 28h5', C.orange, 2.500) + line('M14 42h20', C.grey, 2.500);
  I.sun = circ(24, 24, 9, C.yellow) + line('M24 5v6M24 37v6M5 24h6M37 24h6M10.500 10.500l4 4M33.500 33.500l4 4M37.500 10.500l-4 4M14.500 33.500l-4 4', C.orange, 2.800);
  I.moon = path('M32 6a18 18 0 1 0 10 26A15 15 0 0 1 32 6z', '#f3d97a') + circ(36, 13, 1.600, '#f3d97a') + sparkle(38, 22, 3, '#f3d97a');
  I.snack = I.apple;
  I.breakfast = I.sunrise; I.lunch = I.sun; I.dinner = I.moon;

  I.female = circ(24, 17, 10, 'none', ' stroke="' + C.purple + '" stroke-width="3.500"') + line('M24 27v16M16 36h16', C.purple, 3.500);
  I.male = circ(20, 28, 10, 'none', ' stroke="' + C.blue2 + '" stroke-width="3.500"') + line('M27.500 20.500L40 8M30 8h10v10', C.blue2, 3.500);
  I.sedentary = circ(14, 10, 4.500, C.blue2) + line('M14 16v12h14M28 28v13M14 28v13', C.blue2, 4) + line('M28 28l8-3', C.blue2, 4) + line('M36 20v21M32 20h8', C.grey2, 3);
  I.active = circ(26, 8, 4.500, C.blue2) + line('M26 15l-3 12-7 5M23 27l8 3 3 10M26 15l9 6M26 15l-8 5-3 7', C.blue2, 4);
  I.vigorous = line('M14 24h20', C.grey2, 4) + rect(7, 15, 5, 18, 2, C.blue2) + rect(12, 18, 4, 12, 1.500, C.blue) + rect(36, 15, 5, 18, 2, C.blue2) + rect(32, 18, 4, 12, 1.500, C.blue);
  I.lose = circ(24, 24, 19, '#e3f1e3') + line('M24 12v22M15 26l9 9 9-9', C.green2, 4.500);
  I.maintain = circ(24, 24, 19, '#e8eef3') + line('M13 19h22M13 29h22', C.blue2, 4.500);
  I.gain = circ(24, 24, 19, '#fbe9e0') + line('M24 36V14M15 22l9-9 9 9', C.orange2, 4.500);
  I.muscle = circ(24, 24, 19, '#ece4f5') + line('M15 24h18', C.purple, 4) + rect(9, 15, 6, 18, 2.500, C.purple) + rect(14, 18, 4, 12, 1.500, '#8a6bb0') + rect(33, 15, 6, 18, 2.500, C.purple) + rect(30, 18, 4, 12, 1.500, '#8a6bb0');
  I.people = circ(17, 14, 6, C.blue2) + path('M6 40c0-9 5-14 11-14s11 5 11 14z', C.blue2) + circ(33, 17, 5, C.blue) + path('M28 40c0-7 2-11 6-11s8 4 8 11z', C.blue);
  I.wallet = rect(6, 12, 36, 28, 5, C.green2) + path('M30 22h12v10H30a5 5 0 0 1 0-10z', '#5aa85b') + circ(33, 27, 2, C.white) + line('M6 18h28', '#1f5a2b', 2);
  I.clock = circ(24, 24, 17, C.white, ' stroke="' + C.grey2 + '" stroke-width="3"') + line('M24 13v11l7 5', C.ink, 3);
  I.lactose = I.milk_lf;
  I.leaf = path('M8 40C6 20 18 8 40 8c0 22-12 34-30 32z', C.green) + line('M10 38c8-10 16-17 26-24', C.green3, 2.200);
  I.check = circ(24, 24, 19, C.green2) + line('M14 25l7 7 13-14', '#fff', 4.500);

  // ---------- version 2: new ingredients ----------
  const bottle = function (body, label, inner) {
    return rect(20, 4, 8, 7, 1.5, '#2b2a28') + path('M20 11h8l1 6c5 2 8 5 8 10v13a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V27c0-5 3-8 8-10z', body) +
      rect(11, 26, 26, 13, 0, label) + (inner || '');
  };
  I.wholemeal_bread = path('M7 24c0-9 7-15 17-15s17 6 17 15c0 3-1 5-3 6v9a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2v-9c-2-1-3-3-3-6z', '#b9824a') +
    path('M7 24c0-9 7-15 17-15s17 6 17 15c0 3-1 5-3 6H10c-2-1-3-3-3-6z', '#cf9a5c') + line('M16 15l4 8M25 13l4 9M33 17l2 5', '#8a5a33', 2) +
    [[13, 27], [20, 28], [28, 27], [34, 28], [17, 34], [25, 35], [32, 34]].map(function (p) { return ell(p[0], p[1], 1.7, 0.9, '#f1dc8a', 20); }).join('');
  I.flour = path('M12 12h24l2 30H10z', '#f6efdc', OUT) + path('M12 12h24l.4 6H11.6z', C.grey) + rect(10.6, 24, 26.8, 11, 0, '#ecdcae') +
    fit(ear(24, 22, 2, 4.4, 3, 2.4, '#d9a416'), 0.78);
  I.rice_noodles = path('M5 27h38a19 16 0 0 1-38 0z', C.red2) + path('M5 27h38l-1 3H6z', '#e5a39d') + path('M9 27c0-8 5-12 8-12 3 0 3 3 7 3s4-4 8-4c4 0 7 6 7 13z', '#f7f0d9') +
    line('M11 24c4-6 8 2 12-4s8 2 12-2M13 27c4-5 8 1 11-3s7 2 11-1', '#d8c796', 1.6);
  I.split_peas = path('M6 28h36a18 14 0 0 1-36 0z', C.cream) + path('M6 28h36l-1.5 3h-33z', C.tan) +
    [[14, 24], [20, 20], [27, 19], [33, 23], [24, 24], [17, 27], [30, 27], [22, 15.5], [10, 27], [37, 27], [26, 14]].map(function (p, i) { return circ(p[0], p[1], 3, i % 2 ? '#e8c53a' : '#d9ad24'); }).join('');
  I.coconut_milk = can('#e9f2e4') + rect(9, 24, 30, 10, 0, '#4f9d45') + circ(24, 29, 5.5, '#6e4a2a') + circ(24, 29, 3.8, C.white) + circ(22.5, 28, 0.9, '#6e4a2a') + circ(25.5, 28, 0.9, '#6e4a2a') + circ(24, 30.6, 0.9, '#6e4a2a');
  I.sesame_oil = bottle('#b9731f', C.cream, ell(20, 32, 2.6, 1.4, '#e8d9a8', -20) + ell(25, 30, 2.6, 1.4, '#c9b27a', 15) + ell(29, 34, 2.6, 1.4, '#e8d9a8', 25) + ell(23, 35, 2.2, 1.2, '#c9b27a', -10));
  I.fish_sauce = bottle('#7a2f1c', C.cream, ell(23, 32.5, 6, 3, C.blue) + path('M28 32.5l5-3.4v6.8z', C.blue) + circ(20, 31.8, 0.8, C.cream));
  I.herring = ell(22, 24, 17, 8, '#9fb4c4') + ell(22, 28, 15, 4, '#e5eef3') + path('M36 24l9-8v16z', '#7f98ab') + path('M16 17c4-4 10-4 14-1-4 1-10 1-14 1z', '#7f98ab') +
    circ(11, 22.5, 1.9, C.ink) + circ(11.6, 21.9, 0.6, '#fff') + line('M16 18c2 4 2 9 0 12', '#7f98ab', 1.6) + circ(12, 39, 5, 'none', ' stroke="#a35a8b" stroke-width="2.4"') + circ(24, 39, 4, 'none', ' stroke="#c27aa8" stroke-width="2"');
  I.smoked_salmon = [[8, '#e97d55'], [18, '#f08a63'], [28, '#f39a76']].map(function (s, i) {
    return path('M4 ' + s[0] + 'q5-4 10 0t10 0t10 0t10 0v9q-5 4-10 0t-10 0t-10 0t-10 0z', s[1]) + line('M10 ' + (s[0] + 5) + 'h8M24 ' + (s[0] + 6) + 'h9', '#fde3d6', 1.6);
  }).join('');
  I.shrimp = line('M33 11c-13-3-21 5-19 16 2 9 11 11 17 6', '#f08a7a', 10) + path('M28 38l-5 5 9 0 6-5z', '#e8685a') + line('M20 12l-3 5M16 18l-2 6M16 27l0 5', '#e8685a', 1.8) + circ(34, 11, 1.8, C.ink) + line('M38 9c3-3 6-3 8-1M38 12c3 0 6 1 7 3', '#e8685a', 1.4);
  I.ginger = ell(24, 29, 16, 7, '#d4a35f', -12) + ell(13, 22, 5.5, 8.5, '#d4a35f', -22) + ell(33, 19, 5, 8.5, '#d4a35f', 22) + ell(38, 31, 6, 4.8, '#d4a35f', 10) + ell(10, 33, 5, 4, '#d4a35f', 10) +
    line('M16 29c1-2 1-4 0-6M25 30c1-2 1-4 0-6M31 28c1-2 1-3 0-5', '#a9762f', 1.6) + ell(30, 14, 2.5, 1.4, '#f1d9a2') + circ(34, 31, 1.4, '#f1d9a2');
  I.edamame = '<g' + rot(-30, 24, 24) + '>' + rect(3, 15, 42, 18, 9, '#5e9e45') + [[13, 24], [24, 24], [35, 24]].map(function (p) { return circ(p[0], p[1], 6.4, '#9bd16a') + shine(p[0] - 2, p[1] - 2, 2, 1.2, -20); }).join('') + '</g>' + line('M38 11c3-3 6-4 8-3', C.green2, 2.4);

  // ---------- seasonings ----------
  I.salt = path('M14 20h20l2 22a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2z', '#f4f7f9', OUT) + path('M13 15c0-5 22-5 22 0v6H13z', C.grey) + rect(12.5, 29, 23, 8, 0, C.blue3) +
    [[19, 12], [24, 11], [29, 12], [21.5, 16], [26.5, 16]].map(function (p) { return circ(p[0], p[1], 0.9, C.grey2); }).join('') + [[18, 33], [24, 33], [30, 33]].map(function (p) { return circ(p[0], p[1], 1, '#fff'); }).join('');
  I.spice_jar = rect(10, 6, 28, 8, 2, '#5e3a20') + path('M12 14h24v26a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3z', '#eef3f6', OUT) + path('M13 22h22v17a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2z', '#c9772a') +
    rect(15.5, 24, 17, 10, 2, C.cream) + circ(24, 29, 2.6, C.orange2) + line('M20 31c2-4 6-4 8 0', C.green2, 1.4);
  I.chili = path('M9 12c1 17 11 28 32 28-9-5-14-13-14-22 0-3-5-6-18-6z', C.red) + path('M9 12c3 0 7 0 10 1-6 2-9 4-10 6z', C.red2) + shine(20, 21, 2.2, 6, -35) + path('M9 12c-1-4 2-7 6-7l-1 4 5 3z', C.green2);
  I.herb = line('M24 43V12', C.green2, 2.4) + [[16, 36, -35], [32, 36, 35], [15, 27, -40], [33, 27, 40], [18, 18, -35], [30, 18, 35], [24, 9, 0]].map(function (l, i) { return ell(l[0], l[1], 6.5, 3.2, i % 2 ? C.green : '#6cb85c', l[2]); }).join('');
  I.lemon = ell(24, 26, 17, 13, '#f4d03a', -20) + ell(40.5, 20, 3.2, 2.4, '#f4d03a', -20) + ell(7.5, 32, 3.2, 2.4, '#f4d03a', -20) + shine(18, 20, 6, 2.4, -20) + path('M24 14c3-5 8-6 11-4-2 4-7 6-11 4z', C.green);

  // ---------- cuisines ----------
  I.nordic = path('M24 4l11 14h-6l9 12h-8l7 10H11l7-10h-8l9-12h-6z', C.green2) + path('M24 4l4.6 5.8h-9.200z', C.white) + path('M10 30h8l-2.500 3.500h-4z', C.white, ' opacity=".7"') + rect(21, 40, 6, 5, 1, C.brown);
  I.european = '<g' + rot(-35, 24, 24) + '>' + rect(1, 16, 46, 16, 8, '#d9a35a') + rect(1, 16, 46, 6, 3, '#e8bd7a') + line('M11 19l3 9M20 19l3 9M29 19l3 9M38 19l3 9', '#a8702f', 2) + '</g>';
  I.asian = path('M5 25h38a19 16 0 0 1-38 0z', C.red) + path('M5 25h38l-1 3H6z', '#f2a49a') + path('M9 25c0-8 7-12 15-12s15 4 15 12z', C.white, OUT) + line('M16 19l2 3M23 16l2 3M30 19l2 3', '#b9c3c8', 1.6) +
    line('M34 3L21 24', '#b07a3d', 2.8) + line('M41 5L28 25', '#8a5a33', 2.8);
  I.world = circ(24, 24, 18, C.blue) + path('M13 14c4-3 9-3 11 1s-3 6-5 9-8 1-9-3c0-3 1-5 3-7zM29 25c4-1 8 1 8 5s-4 7-7 6c-3-2-4-8-1-11z', C.green3) + line('M6 24h36M24 6c-8 9-8 27 0 36M24 6c8 9 8 27 0 36', '#fff', 1.4) + shine(17, 14, 5, 2.4, -35);

  // ---------- helper, actions and measures ----------
  I.helper = circ(16, 15, 7, C.white, OUT) + circ(24, 11, 8, C.white, OUT) + circ(32, 15, 7, C.white, OUT) + rect(15, 15, 18, 10, 1.5, C.white) + rect(15, 21, 18, 4, 1, C.green3) +
    circ(24, 33, 11.5, '#f6ecd4', OUT) + circ(20, 32, 1.7, C.ink) + circ(28, 32, 1.7, C.ink) + circ(16.5, 36, 2.2, C.pink, ' opacity=".7"') + circ(31.5, 36, 2.2, C.pink, ' opacity=".7"') + line('M20 37c2 3 6 3 8 0', C.ink, 1.8);
  I.chat = path('M6 11a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H20l-9 8v-8h-1a4 4 0 0 1-4-4z', C.blue) + circ(16, 20, 2.4, '#fff') + circ(24, 20, 2.4, '#fff') + circ(32, 20, 2.4, '#fff');
  I.speaker = path('M6 19h8l10-8v26l-10-8H6z', C.blue2) + line('M30 18c3 4 3 8 0 12M35 13c6 7 6 15 0 22', C.blue2, 3);
  I.heart = path('M24 42C8 30 5 21 8 14c3-6 11-6 16 0 5-6 13-6 16 0 3 7 0 16-16 28z', C.red) + shine(15, 17, 2.4, 3.6, -30);
  I.heart_o = path('M24 42C8 30 5 21 8 14c3-6 11-6 16 0 5-6 13-6 16 0 3 7 0 16-16 28z', 'none', ' stroke="' + C.red + '" stroke-width="3.2" stroke-linejoin="round"');
  I.save = rect(7, 7, 34, 34, 4, C.blue2) + rect(13, 7, 20, 13, 1, C.white) + rect(27, 9, 4, 8, 1, C.blue2) + rect(12, 27, 24, 14, 2, C.blue3) + line('M16 32h16M16 36h10', C.blue2, 1.6);
  I.cloud = path('M14 37a9 9 0 0 1-1-18 12 12 0 0 1 23 3 7.5 7.5 0 0 1-1 15z', C.blue3, ' stroke="' + C.blue + '" stroke-width="2"') + line('M24 33V22M19 26l5-5 5 5', C.blue2, 3);
  I.scale = rect(6, 12, 36, 30, 6, C.green2) + path('M13 29a11 11 0 0 1 22 0z', '#fff') + line('M24 29l5-7', C.red, 2.4) + circ(24, 29, 1.8, C.ink) + line('M16 23l1.4 1.4M24 20v2M32 23l-1.4 1.4', C.grey2, 1.4) + rect(16, 33, 16, 4, 2, '#1f5a2b');
  I.pot = rect(6, 22, 36, 18, 5, C.grey2) + rect(4, 24, 4, 4, 2, C.ink) + rect(40, 24, 4, 4, 2, C.ink) + path('M9 22h30l-2-5H11z', C.grey) + circ(24, 14, 2.4, C.ink) + line('M16 11c-2-2 2-3 0-5M32 11c-2-2 2-3 0-5', C.grey, 2);
  I.tsp = ell(24, 13, 6, 8, '#c9ced1', 0, OUT) + line('M24 21V43', '#8d979d', 3.4) + shine(22, 10, 1.6, 3.2, 0);
  I.tbsp = ell(24, 15, 9.5, 11.5, '#c9ced1', 0, OUT) + line('M24 26V44', '#8d979d', 3.8) + shine(20.5, 11, 2.2, 4.4, 0);
  I.dl = path('M10 10h26l-3 30a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3z', '#eef4f8', OUT) + path('M12 22h23l-1.800 18a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2z', '#bcd8f0') + line('M10 16h5M10 22h7M10 28h5M10 34h7', C.blue2, 1.6) +
    path('M36 14c8 0 8 12 0 12', 'none', ' stroke="#8d979d" stroke-width="3"');

  function snowBadge() {
    return circ(37, 37, 10, C.blue2, ' stroke="#fff" stroke-width="2"') + sparkle(37, 37, 5.200, '#fff');
  }

  function icon(id, size, opts) {
    const inner = I[id];
    if (!inner) return '';
    opts = opts || {};
    const ing = A.ING && A.ING[id];
    const badge = ing && ing.aisle === 'frozen' && opts.badge !== false ? snowBadge() : '';
    const s = size || 40;
    return '<svg class="ico" viewBox="0 0 48 48" width="' + s + '" height="' + s + '" aria-hidden="true" focusable="false">' + inner + badge + '</svg>';
  }

  A.ICONS = I;
  A.icon = icon;
})(typeof window !== 'undefined' ? window : globalThis);
