// The weekly progress summary (A.log.weeks). Run: node --test tests/progress.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
require('../data/ingredients.js');
require('../data/spices.js');
require('../data/recipes.js');
['engine', 'log'].forEach((f) => require('../js/' + f + '.js'));
const L = globalThis.Ateria.log;

const END = '2026-11-09'; // a Monday; week 0 is 3-9 Nov, week 1 is 27 Oct-2 Nov, ...
const entry = (kcal, protein) => ({ k: kcal, p: protein, f: 0, c: 0, fi: 0 });
const day = (d, kcal, protein) => ({ [d]: [entry(kcal, protein)] });
const W = (d, kg) => ({ d, kg });
const base = { end: END, log: {}, weights: [], targets: { kcal: 2000, protein: 100 }, goal: 'maintain' };
const run = (o) => L.weeks(Object.assign({}, base, o));

test('four contiguous weeks of seven days, week 0 ending today', () => {
  const r = run({});
  assert.equal(r.weeks.length, 4);
  assert.equal(r.weeks[0].to, END);
  assert.equal(r.weeks[0].from, '2026-11-03');
  r.weeks.forEach((w, i) => {
    assert.equal(L.shiftDate(w.from, 6), w.to);
    if (i) assert.equal(L.shiftDate(w.to, 1), r.weeks[i - 1].from);
  });
  assert.equal(r.weeks[3].from, '2026-10-13');
});

test('count can be changed and is kept in a sensible range', () => {
  assert.equal(run({ count: 2 }).weeks.length, 2);
  assert.equal(run({ count: 0 }).weeks.length, 4); // 0 is "not given"
  assert.equal(run({ count: 99 }).weeks.length, 12);
});

test('no log and no weights is empty and has no verdict', () => {
  const r = run({ goal: 'gain' });
  assert.equal(r.empty, true);
  assert.equal(r.since, null);
  assert.equal(r.verdict, null);
  r.weeks.forEach((w) => { assert.equal(w.days, 0); assert.equal(w.kcal, null); assert.equal(w.kg, null); assert.equal(w.change, null); });
});

test('energy and protein are averaged over the days that have entries, not over seven', () => {
  const log = Object.assign({}, day('2026-11-08', 2000, 100), day('2026-11-05', 1000, 50));
  const w = run({ log }).weeks[0];
  assert.equal(w.days, 2);
  assert.equal(w.kcal, 1500);
  assert.equal(w.protein, 75);
  assert.equal(w.kcalPct, 75);
  assert.equal(w.proteinPct, 75);
});

test('several entries on one day add up before the days are averaged', () => {
  const log = { '2026-11-08': [entry(500, 20), entry(700, 30)], '2026-11-07': [entry(1200, 50)] };
  const w = run({ log }).weeks[0];
  assert.equal(w.days, 2);
  assert.equal(w.kcal, 1200);
  assert.equal(w.protein, 50);
});

test('days outside the week are not counted, and the boundaries belong to their own week', () => {
  const log = Object.assign({}, day('2026-11-09', 1000, 10), day('2026-11-03', 1000, 10), day('2026-11-02', 3000, 90), day('2026-11-10', 5000, 90));
  const r = run({ log });
  assert.equal(r.weeks[0].days, 2); // 3 Nov and 9 Nov; 10 Nov (after today) and 2 Nov are not in week 0
  assert.equal(r.weeks[0].kcal, 1000);
  assert.equal(r.weeks[1].days, 1); // 2 Nov is the last day of week 1
  assert.equal(r.weeks[1].kcal, 3000);
});

test('percent of the target is empty when there is no target or no log', () => {
  const log = day('2026-11-08', 1800, 90);
  const none = run({ log, targets: {} }).weeks[0];
  assert.equal(none.kcalPct, null);
  assert.equal(none.proteinPct, null);
  assert.equal(none.kcal, 1800);
  const zero = run({ log, targets: { kcal: 0, protein: 0 } }).weeks[0];
  assert.equal(zero.kcalPct, null);
  const missing = run({ log });
  assert.equal(missing.weeks[1].kcalPct, null);
  assert.equal(missing.weeks[0].kcalPct, 90);
  assert.equal(missing.weeks[0].proteinPct, 90);
});

test('the weight of a week is the average of its weigh-ins, boundaries included', () => {
  const r = run({ weights: [W('2026-11-02', 70), W('2026-11-03', 70.2), W('2026-11-09', 70.6), W('2026-11-10', 99)] });
  assert.equal(r.weeks[0].weighIns, 2);
  assert.equal(r.weeks[0].kg, 70.4);
  assert.equal(r.weeks[1].weighIns, 1);
  assert.equal(r.weeks[1].kg, 70);
});

test('change from the week before needs a weight in both weeks', () => {
  const r = run({ weights: [W('2026-10-30', 70), W('2026-11-05', 70.35)] });
  assert.deepEqual(r.weeks[0].change, { kg: 0.35, pct: 0.5 });
  assert.equal(r.weeks[1].change, null); // the week before that has no weight
  assert.equal(run({ weights: [W('2026-11-05', 70)] }).weeks[0].change, null);
  assert.equal(run({ weights: [W('2026-10-30', 70)] }).weeks[0].change, null);
  // a gap week in between: no change is claimed over two weeks
  assert.equal(run({ weights: [W('2026-10-22', 70), W('2026-11-05', 71)] }).weeks[0].change, null);
});

test('the oldest shown week still gets a change from the week before it', () => {
  const r = run({ count: 2, weights: [W('2026-10-20', 70), W('2026-10-30', 70.7)] });
  assert.equal(r.weeks.length, 2);
  assert.deepEqual(r.weeks[1].change, { kg: 0.7, pct: 1 });
});

test('a loss is a negative change', () => {
  const r = run({ weights: [W('2026-10-30', 80), W('2026-11-05', 79.6)] });
  assert.deepEqual(r.weeks[0].change, { kg: -0.4, pct: -0.5 });
});

test('since: first to latest weight, only with two weights', () => {
  assert.equal(run({ weights: [W('2026-11-05', 70)] }).since, null);
  const r = run({ weights: [W('2026-09-01', 72), W('2026-10-10', 71), W('2026-11-05', 69.12)] });
  assert.deepEqual(r.since, { from: '2026-09-01', to: '2026-11-05', kg: -2.88, pct: -4 });
  assert.equal(r.empty, false);
});

test('weights that are not usable are left out', () => {
  const r = run({ weights: [null, { d: '2026-11-05' }, { d: '2026-11-05', kg: 'abc' }, { kg: 70 }, W('2026-11-05', 70)] });
  assert.equal(r.weeks[0].weighIns, 1);
  assert.equal(r.weeks[0].kg, 70);
});

test('verdict for the gain and muscle goals, with both limits of the range inside it', () => {
  const at = (pct, goal) => {
    const prev = 100, now = 100 + pct;
    return run({ goal, weights: [W('2026-10-30', prev), W('2026-11-05', now)] }).verdict;
  };
  assert.deepEqual(L.WEEK_REF.gain, [0.25, 0.5]);
  assert.deepEqual(L.WEEK_REF.muscle, [0.25, 0.5]);
  assert.equal(at(0.2, 'gain').status, 'below');
  assert.equal(at(0.24, 'gain').status, 'below');
  assert.equal(at(0.25, 'gain').status, 'within');
  assert.equal(at(0.4, 'muscle').status, 'within');
  assert.equal(at(0.5, 'gain').status, 'within');
  assert.equal(at(0.51, 'gain').status, 'above');
  assert.equal(at(-0.3, 'gain').status, 'below');
  assert.equal(at(0.4, 'gain').pct, 0.4);
});

test('no verdict for losing or keeping weight, and none without a change', () => {
  const ws = [W('2026-10-30', 100), W('2026-11-05', 100.4)];
  ['lose', 'maintain', undefined, 'unknown'].forEach((g) => assert.equal(run({ goal: g, weights: ws }).verdict, null));
  assert.equal(run({ goal: 'lose', weights: ws }).ref, null);
  assert.equal(run({ goal: 'gain' }).verdict, null);
  assert.equal(run({ goal: 'gain', weights: [W('2026-11-05', 100)] }).verdict, null);
  assert.deepEqual(run({ goal: 'gain', weights: ws }).ref, [0.25, 0.5]);
});

test('it does not change what it is given', () => {
  const log = Object.assign({}, day('2026-11-08', 2000, 100));
  const weights = [W('2026-10-30', 70), W('2026-11-05', 70.3)];
  const targets = { kcal: 2000, protein: 100 };
  const o = { end: END, log, weights, targets, goal: 'gain' };
  const before = JSON.stringify(o);
  L.weeks(o);
  assert.equal(JSON.stringify(o), before);
  assert.deepEqual(L.weeks(o), L.weeks(o));
});

test('it copes with missing input', () => {
  const r = L.weeks({ end: END });
  assert.equal(r.empty, true);
  assert.equal(r.weeks.length, 4);
});

test('the week list agrees with the day totals used on the Log tab', () => {
  const entries = [entry(450, 30), entry(650, 40)];
  const w = run({ log: { '2026-11-08': entries } }).weeks[0];
  const t = L.totals(entries);
  assert.equal(w.kcal, Math.round(t.kcal));
  assert.equal(w.protein, Math.round(t.protein * 10) / 10);
});

// ---------- the screen ----------
const fs = require('node:fs');
const path = require('node:path');
['icons', 'i18n_ui', 'i18n_ui2', 'i18n_food', 'i18n_recipes', 'i18n_help'].forEach((f) => require('../data/' + f + '.js'));
require('../js/i18n.js');
const A = globalThis.Ateria;
const root = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const LANGS = ['en', 'fi', 'sv', 'vi'];

test('the Progress tab is in the tab bar between Log and Shop, and the route exists', () => {
  const nav = read('index.html').match(/<nav class="nav"[\s\S]*?<\/nav>/)[0];
  assert.deepEqual([...nav.matchAll(/<a href="#(\w+)"/g)].map((m) => m[1]), ['plan', 'log', 'progress', 'shop', 'profile']);
  assert.ok(nav.includes('data-i18n="nav.progress"'));
  assert.match(read('js/app.js'), /VIEWS = \{[^}]*progress: viewProgress/);
});

test('every progress text exists in all four languages with the same placeholders', () => {
  const ui = A.I18N.ui;
  const keys = Object.keys(ui.en).filter((k) => k.startsWith('prog.') || k === 'nav.progress');
  assert.ok(keys.length >= 30, 'found ' + keys.length);
  keys.forEach((k) => {
    const ph = (l) => (ui[l][k] || '').match(/\{\w+\}/g) || [];
    LANGS.forEach((l) => {
      assert.ok(ui[l][k] && ui[l][k].length > 1, l + ' ' + k);
      assert.deepEqual(ph(l).slice().sort(), ph('en').slice().sort(), l + ' ' + k + ' placeholders');
    });
  });
});

test('the reference range written in the texts is the one the code uses', () => {
  const ui = A.I18N.ui, [lo, hi] = L.WEEK_REF.gain;
  assert.equal(lo, 0.25); assert.equal(hi, 0.5);
  const num = (x, l) => String(x).replace('.', l === 'en' ? '.' : ',');
  LANGS.forEach((l) => assert.ok(ui[l]['prog.gainRef'].includes(num(lo, l) + '–' + num(hi, l)), l + ' gainRef'));
});

test('each text that cites a source names the source that is listed on the screen', () => {
  const ui = A.I18N.ui, app = read('js/app.js');
  const cites = { 'prog.gainRef': 'Iraki', 'prog.loseRef': 'Jensen', 'prog.keepRef': 'Jensen', 'prog.logRef': 'Burke' };
  Object.keys(cites).forEach((k) => {
    LANGS.forEach((l) => assert.ok(ui[l][k].includes(cites[k]) && /20\d\d/.test(ui[l][k]), l + ' ' + k));
    assert.ok(new RegExp("\\{ text: '" + cites[k] + ", ").test(app), cites[k] + ' is in the source list');
  });
  ['10.1016/j.jada.2010.10.008', '10.3390/sports7070154', 'acc.org/Latest-in-Cardiology'].forEach((u) => assert.ok(app.includes(u), u));
});

test('only the gain and muscle goals are judged: the other goals have no verdict text in the code', () => {
  const ui = A.I18N.ui;
  assert.match(read('js/app.js'), /goal === 'lose' \? 'prog\.loseRef' : 'prog\.keepRef'/);
  ['loseRef', 'keepRef'].forEach((k) => LANGS.forEach((l) => assert.ok(!/\{pct\}/.test(ui[l]['prog.' + k]), l + ' ' + k + ' must not judge')));
});

test('the plural of weigh-ins has both forms in every language', () => {
  A.I18N.ui && ['prog.weighIns_one', 'prog.weighIns_other'].forEach((k) => LANGS.forEach((l) => assert.ok(A.I18N.ui[l][k], l + ' ' + k)));
});

test('the helper has a Progress topic, offered on that screen', () => {
  const D = A.I18N, topic = D.help.find((t) => t.id === 'progress');
  assert.ok(topic && topic.actions.includes('progress'));
  assert.match(read('js/help.js'), /progress: \['progress'/);
  assert.match(read('js/help.js'), /five screens: Plan, Log, Progress, Shop and You/);
});

test('the Progress texts do not mention prices or shops', () => {
  const ui = A.I18N.ui;
  Object.keys(ui.en).filter((k) => k.startsWith('prog.')).forEach((k) => LANGS.forEach((l) => assert.ok(!/price|hinta|pris|(?<!đánh )giá|€/i.test(ui[l][k]), l + ' ' + k)));
});
