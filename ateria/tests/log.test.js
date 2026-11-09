// The food log: the maths in js/log.js and how js/store.js keeps the entries. Run: node --test tests/log.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
['ingredients', 'spices', 'recipes'].forEach((f) => require('../data/' + f + '.js'));
['engine', 'log', 'store'].forEach((f) => require('../js/' + f + '.js'));
const A = globalThis.Ateria;
const L = A.log;
const E = A.engine;

function fake() { const m = {}; return { m, getItem: (k) => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: (k) => { delete m[k]; } }; }
const P = { sex: 'female', age: 34, heightCm: 168, weightKg: 68, activity: 'sedentary', goal: 'lose', diet: 'omnivore', allergies: [], meals: ['breakfast', 'lunch', 'snack', 'dinner'], people: 1, cuisines: [] };
const plan = () => E.planWeek(P, 7, {});

test('an entry from the plan carries the nutrition of that meal, scaled by the portion', () => {
  const meal = plan().days[0].meals[0];
  const one = L.fromMeal(meal, 1), half = L.fromMeal(meal, 0.5);
  assert.equal(one.t, 'plan'); assert.equal(one.ref, meal.recipeId); assert.equal(one.m, meal.meal);
  assert.equal(one.k, Math.round(meal.nutrients.kcal));
  assert.equal(half.k, Math.round(meal.nutrients.kcal * 0.5));
  assert.ok(Math.abs(half.p - Math.round(meal.nutrients.protein * 5) / 10) < 0.11);
  assert.equal(L.fromMeal(meal, 0.1), null, 'too small a portion');
  assert.equal(L.fromMeal(meal, 9), null, 'too large a portion');
  assert.equal(L.fromMeal(meal, 'x'), null);
  assert.equal(L.fromMeal(null, 1), null);
  assert.equal(L.fromMeal(Object.assign({}, meal, { recipeId: 'no_such_recipe' }), 1), null);
});

test('a food from the list is worked out per 100 g', () => {
  const id = Object.keys(A.ING)[0];
  const e = L.fromFood(id, 250, 'lunch');
  const per = A.ING[id].per100;
  assert.equal(e.t, 'food'); assert.equal(e.m, 'lunch'); assert.equal(e.g, 250);
  assert.equal(e.k, Math.round(per.kcal * 2.5));
  assert.equal(L.fromFood(id, 250, 'brunch').m, 'snack', 'an unknown meal becomes a snack');
  assert.equal(L.fromFood('no_such_food', 100, 'lunch'), null);
  assert.equal(L.fromFood(id, 0, 'lunch'), null);
  assert.equal(L.fromFood(id, 99999, 'lunch'), null);
  assert.equal(L.fromFood(id, 'abc', 'lunch'), null);
});

test('a quick entry needs a name and energy; protein is optional; markup and control characters are removed', () => {
  const e = L.quick('  Pizza <b>slice  ', 820.4, '', 'dinner');
  assert.deepEqual(e, { m: 'dinner', t: 'quick', name: 'Pizza bslice', k: 820, p: 0, f: 0, c: 0, fi: 0 });
  assert.equal(L.quick('Soup', 300, 12.34, 'lunch').p, 12.3);
  assert.equal(L.quick('', 300, 0, 'lunch'), null);
  assert.equal(L.quick('<>', 300, 0, 'lunch'), null);
  assert.equal(L.quick('x'.repeat(100), 300, 0, 'lunch').name.length, 40);
  assert.equal(L.quick('Soup', -1, 0, 'lunch'), null);
  assert.equal(L.quick('Soup', 6000, 0, 'lunch'), null);
  assert.equal(L.quick('Soup', NaN, 0, 'lunch'), null);
  assert.equal(L.quick('Soup', 300, 900, 'lunch'), null);
  assert.equal(L.quick('Soup', 300, 'abc', 'lunch'), null);
});

test('totals add up, and the energy left is negative once the target is passed', () => {
  const list = [{ k: 400, p: 20.2, f: 10.1, c: 50, fi: 5 }, { k: 650, p: 30.3, f: 20.2, c: 60.5, fi: 3.3 }];
  assert.deepEqual(L.totals(list), { kcal: 1050, protein: 50.5, fat: 30.3, carbs: 110.5, fibre: 8.3 });
  assert.deepEqual(L.totals([]), { kcal: 0, protein: 0, fat: 0, carbs: 0, fibre: 0 });
  assert.deepEqual(L.totals(undefined), { kcal: 0, protein: 0, fat: 0, carbs: 0, fibre: 0 });
  assert.equal(L.left({ kcal: 1050 }, 1800), 750);
  assert.equal(L.left({ kcal: 2100 }, 1800), -300);
});

test('dates move by calendar days across month ends, leap days and clock changes', () => {
  assert.equal(L.shiftDate('2026-11-09', -1), '2026-11-08');
  assert.equal(L.shiftDate('2026-03-01', -1), '2026-02-28');
  assert.equal(L.shiftDate('2028-03-01', -1), '2028-02-29');
  assert.equal(L.shiftDate('2026-12-31', 1), '2027-01-01');
  assert.equal(L.shiftDate('2026-03-29', 1), '2026-03-30'); // the clocks change in Finland on this day
  assert.equal(L.shiftDate('2026-10-25', 1), '2026-10-26');
});

test('the week list is oldest first, has a slot for every day and counts the entries', () => {
  const log = { '2026-11-09': [{ k: 500, p: 0, f: 0, c: 0, fi: 0 }, { k: 250, p: 0, f: 0, c: 0, fi: 0 }], '2026-11-05': [{ k: 100, p: 0, f: 0, c: 0, fi: 0 }] };
  const w = L.week(log, '2026-11-09', 7);
  assert.equal(w.length, 7);
  assert.deepEqual(w.map((x) => x.d), ['2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08', '2026-11-09']);
  assert.deepEqual(w[6], { d: '2026-11-09', kcal: 750, n: 2 });
  assert.deepEqual(w[2], { d: '2026-11-05', kcal: 100, n: 1 });
  assert.deepEqual(w[0], { d: '2026-11-03', kcal: 0, n: 0 });
  assert.equal(L.week(undefined, '2026-11-09').length, 7);
});

// ---------- ideas for the rest of the day ----------
const SLOTS4 = ['breakfast', 'lunch', 'snack', 'dinner'];
function pools(p) {
  const out = {};
  SLOTS4.forEach((m) => { out[m] = A.RECIPES.filter((r) => r.meal === m).map((r) => E.adaptRecipe(r, p)).filter(Boolean); });
  return out;
}
const quickEntry = (m, k, p) => ({ m, t: 'quick', name: 'x', k, p, f: 0, c: 0, fi: 0 });

test('with nothing logged, every meal gets two ideas that fit its share of the day', () => {
  const t = E.computeTargets(P), r = L.suggest({ pools: pools(P), targets: t, entries: [], slots: P.meals });
  assert.equal(r.left, t.kcal); assert.equal(r.proteinLeft, t.protein);
  SLOTS4.forEach((m) => {
    const list = r.ideas.filter((i) => i.m === m);
    assert.equal(list.length, 2, m);
    const slotKcal = t.kcal * A.CONFIG.MEAL_SHARE[m];
    list.forEach((i) => {
      assert.equal(A.REC[i.id].meal, m, 'a recipe of another meal type');
      assert.equal(i.entry.t, 'plan'); assert.equal(i.entry.ref, i.id); assert.equal(i.entry.m, m); assert.equal(i.entry.x, i.x);
      assert.ok(i.x >= 0.5 && i.x <= 2 && Math.abs(i.x * 4 - Math.round(i.x * 4)) < 1e-9, 'portion ' + i.x);
      assert.ok(i.entry.k >= slotKcal * 0.7 - 1 && i.entry.k <= slotKcal * 1.25 + 1, m + ' ' + i.entry.k + ' vs ' + slotKcal);
    });
  });
  assert.equal(new Set(r.ideas.map((i) => i.m + i.id)).size, r.ideas.length, 'the same idea twice');
});

test('meals that already have an entry, and recipes already eaten, are left out', () => {
  const t = E.computeTargets(P), pl = pools(P);
  const eaten = pl.lunch[0];
  const entries = [quickEntry('breakfast', 400, 20), { m: 'lunch', t: 'plan', ref: eaten.id, x: 1, k: 500, p: 30, f: 0, c: 0, fi: 0 }];
  const r = L.suggest({ pools: pl, targets: t, entries, slots: P.meals });
  assert.deepEqual([...new Set(r.ideas.map((i) => i.m))].sort(), ['dinner', 'snack']);
  assert.ok(!r.ideas.some((i) => i.id === eaten.id));
  assert.equal(r.left, t.kcal - 900);
  // a recipe that was eaten as a snack is not offered again, whichever meal it is offered for
  const sn = pl.snack.map((c) => c.id);
  const r2 = L.suggest({ pools: pl, targets: t, entries: [{ m: 'snack', t: 'plan', ref: sn[0], x: 1, k: 100, p: 5, f: 0, c: 0, fi: 0 }], slots: P.meals });
  assert.ok(!r2.ideas.some((i) => i.id === sn[0]));
});

test('the energy left is shared between the meals still open, never more than what is left', () => {
  const t = E.computeTargets(P), pl = pools(P);
  const r = L.suggest({ pools: pl, targets: t, entries: [quickEntry('breakfast', 500, 30), quickEntry('lunch', 700, 40)], slots: P.meals });
  const left = t.kcal - 1200;
  ['snack', 'dinner'].forEach((m) => {
    const slotKcal = left * A.CONFIG.MEAL_SHARE[m] / (A.CONFIG.MEAL_SHARE.snack + A.CONFIG.MEAL_SHARE.dinner);
    r.ideas.filter((i) => i.m === m).forEach((i) => assert.ok(i.entry.k >= slotKcal * 0.7 - 1 && i.entry.k <= slotKcal * 1.25 + 1, m));
  });
  assert.ok(r.ideas.reduce((a, i) => a + i.entry.k, 0) / 2 <= left * 1.3, 'two ideas per meal are alternatives, so one of each fits the day');
  // only 150 kcal left: nothing bigger than that is offered
  const small = L.suggest({ pools: pl, targets: t, entries: [quickEntry('breakfast', t.kcal - 150, 80)], slots: P.meals });
  small.ideas.forEach((i) => assert.ok(i.entry.k <= 150, i.id + ' ' + i.entry.k));
});

test('no ideas once the day is used up or over; the energy and protein left are reported', () => {
  const t = E.computeTargets(P), pl = pools(P);
  const done = L.suggest({ pools: pl, targets: t, entries: [quickEntry('dinner', t.kcal - 99, 50)], slots: P.meals });
  assert.deepEqual(done.ideas, []); assert.equal(done.left, 99);
  const over = L.suggest({ pools: pl, targets: t, entries: [quickEntry('dinner', t.kcal + 300, 50)], slots: P.meals });
  assert.deepEqual(over.ideas, []); assert.equal(over.left, -300);
  assert.equal(L.suggest({ pools: pl, targets: t, entries: [quickEntry('lunch', 500, 100)], slots: P.meals }).proteinLeft, t.protein - 100);
  assert.deepEqual(L.suggest({ pools: {}, targets: t, entries: [], slots: P.meals }).ideas, [], 'no recipes, no ideas');
});

test('when every meal has an entry but some energy is left, snack ideas are given; a large rest is not filled with snacks', () => {
  const t = E.computeTargets(P), each = (t.kcal - 250) / 4;
  const r = L.suggest({ pools: pools(P), targets: t, entries: SLOTS4.map((m) => quickEntry(m, each, 5)), slots: P.meals });
  assert.ok(r.ideas.length > 0);
  assert.ok(r.ideas.every((i) => i.m === 'snack'));
  assert.ok(r.ideas.every((i) => i.entry.k <= r.left));
  const big = L.suggest({ pools: pools(P), targets: t, entries: SLOTS4.map((m) => quickEntry(m, 100, 5)), slots: P.meals });
  assert.deepEqual(big.ideas, [], 'about 1400 kcal left is more than a snack of any size');
});

test('only the meals the person eats are considered', () => {
  const t = E.computeTargets(P);
  const r = L.suggest({ pools: pools(P), targets: t, entries: [], slots: ['lunch', 'dinner'] });
  assert.deepEqual([...new Set(r.ideas.map((i) => i.m))].sort(), ['dinner', 'lunch']);
});

test('recipes that are short of the protein still needed come last', () => {
  const ids = A.RECIPES.filter((r) => r.meal === 'lunch').slice(0, 3).map((r) => r.id);
  const mk = (id, kcal, protein) => ({ id, minutes: 10, base: { kcal, protein, fat: 10, carbs: 50, fibre: 5 } });
  const pool = { lunch: [mk(ids[0], 500, 10), mk(ids[1], 500, 45), mk(ids[2], 500, 25)] };
  const t = { kcal: 1000, protein: 100 }; // 0.1 g of protein is still needed per kcal; the three recipes give 0.04, 0.18 and 0.1
  const r = L.suggest({ pools: pool, targets: t, entries: [], slots: ['lunch'], perSlot: 3 });
  assert.deepEqual(r.ideas.map((i) => i.id), [ids[1], ids[2], ids[0]]);
  // when the protein is already reached, the recipes are ranked by how close they are to the energy of the meal
  const r2 = L.suggest({ pools: pool, targets: t, entries: [quickEntry('breakfast', 100, 200)], slots: ['lunch'], perSlot: 3 });
  assert.equal(r2.proteinLeft, -100);
  assert.deepEqual(r2.ideas.map((i) => i.id), ids.slice().sort(), 'same energy: the order of the recipe ids decides');
});

test('"other ideas" gives different recipes for the same day, and the same call gives the same ideas', () => {
  const t = E.computeTargets(P), pl = pools(P);
  const call = (round) => L.suggest({ pools: pl, targets: t, entries: [], slots: P.meals, round });
  assert.deepEqual(call(0), call(0));
  assert.equal(call(0).more, true);
  const a = call(0).ideas.filter((i) => i.m === 'lunch').map((i) => i.id), b = call(1).ideas.filter((i) => i.m === 'lunch').map((i) => i.id);
  assert.ok(a.length === 2 && b.length === 2 && !a.some((id) => b.includes(id)), a + ' / ' + b);
  // with only one or two candidates there is nothing else to show
  const one = L.suggest({ pools: { lunch: pl.lunch.slice(0, 1) }, targets: t, entries: [], slots: ['lunch'] });
  assert.equal(one.more, false);
});

test('ideas respect the diet, the allergies and the dislikes of the person', () => {
  const vegan = Object.assign({}, P, { diet: 'vegan', allergies: ['peanut', 'soy'], lactoseFree: true });
  const t = E.computeTargets(vegan), r = L.suggest({ pools: pools(vegan), targets: t, entries: [], slots: vegan.meals });
  assert.ok(r.ideas.length > 0);
  r.ideas.forEach((i) => {
    const ad = E.adaptRecipe(A.REC[i.id], vegan);
    assert.ok(ad, i.id);
    ad.items.forEach((it) => assert.ok(E.allowed(A.ING[it.id], vegan), i.id + ' contains ' + it.id));
  });
});

test('an idea is a valid log entry: the store accepts it, with its nutrition kept as suggested', () => {
  const t = E.computeTargets(P), st = A.makeStore(fake()); st.init();
  const r = L.suggest({ pools: pools(P), targets: t, entries: [], slots: P.meals });
  r.ideas.forEach((i) => assert.ok(st.addLog('2026-11-09', i.entry) > 0, i.id));
  const kept = st.logOf('2026-11-09');
  assert.equal(kept.length, r.ideas.length);
  assert.equal(kept[0].k, r.ideas[0].entry.k); assert.equal(kept[0].p, r.ideas[0].entry.p);
  // and the day's totals now include them, so fewer ideas are open
  const again = L.suggest({ pools: pools(P), targets: t, entries: kept, slots: P.meals });
  assert.ok(again.left < t.kcal);
  assert.deepEqual(again.ideas, [], 'all four meals now have an entry, and little energy is left');
});

// ---------- how the store keeps it ----------
test('nothing is written before the person says yes; after yes the log is saved and comes back', () => {
  const s = fake(); const st = A.makeStore(s); st.init();
  const id = st.addLog('2026-11-09', L.quick('Pizza', 800, 30, 'dinner'));
  assert.ok(id > 0);
  assert.deepEqual(Object.keys(s.m), [], 'something was written without consent');
  assert.equal(st.logOf('2026-11-09').length, 1, 'the app still works from memory');
  st.setConsent(true);
  const b = A.makeStore(s); b.init();
  assert.equal(b.logOf('2026-11-09').length, 1);
  assert.equal(b.logOf('2026-11-09')[0].name, 'Pizza');
  assert.equal(b.logOf('2026-11-08').length, 0);
});

test('entries get their own ids and can be removed one by one; an empty day disappears', () => {
  const st = A.makeStore(fake()); st.init();
  const a = st.addLog('2026-11-09', L.quick('A', 100, 0, 'snack'));
  const b = st.addLog('2026-11-09', L.quick('B', 200, 0, 'snack'));
  assert.notEqual(a, b);
  st.removeLog('2026-11-09', a);
  assert.deepEqual(st.logOf('2026-11-09').map((e) => e.name), ['B']);
  st.removeLog('2026-11-09', 12345); // unknown id: nothing happens
  assert.equal(st.logOf('2026-11-09').length, 1);
  st.removeLog('2026-11-09', b);
  assert.deepEqual(Object.keys(st.logAll()), []);
});

test('bad dates and bad entries are refused', () => {
  const st = A.makeStore(fake()); st.init();
  const ok = L.quick('A', 100, 0, 'snack');
  assert.equal(st.addLog('2026-02-31', ok), 0);
  assert.equal(st.addLog('11/09/2026', ok), 0);
  assert.equal(st.addLog('2026-11-09', null), 0);
  assert.equal(st.addLog('2026-11-09', { t: 'quick', name: 'x', k: 99999 }), 0);
  assert.equal(st.addLog('2026-11-09', { t: 'plan', ref: 'no_such_recipe', x: 1, k: 100 }), 0);
  assert.equal(st.addLog('2026-11-09', { t: 'food', ref: 'no_such_food', g: 100, k: 100 }), 0);
  assert.equal(st.addLog('2026-11-09', { t: 'other', k: 100 }), 0);
  assert.deepEqual(Object.keys(st.logAll()), []);
});

test('a day holds at most 40 entries, and only the newest 120 days are kept', () => {
  const st = A.makeStore(fake()); st.init();
  for (let i = 0; i < 40; i++) assert.ok(st.addLog('2026-11-09', L.quick('E' + i, 10, 0, 'snack')) > 0);
  assert.equal(st.addLog('2026-11-09', L.quick('one too many', 10, 0, 'snack')), -1);
  assert.equal(st.logOf('2026-11-09').length, 40);
  const lim = A.storeLimits;
  assert.equal(lim.logEntries, 40); assert.equal(lim.logDays, 120);
  const many = A.makeStore(fake()); many.init();
  let d = '2026-11-09';
  for (let i = 0; i < 130; i++) { many.addLog(d, L.quick('x', 10, 0, 'snack')); d = L.shiftDate(d, -1); }
  assert.equal(Object.keys(many.logAll()).length, 120);
  assert.equal(many.addLog('2020-01-01', L.quick('too old', 10, 0, 'snack')), 0, 'older than the 120 newest days');
});

test('each person has their own log', () => {
  const st = A.makeStore(fake()); st.init();
  st.addLog('2026-11-09', L.quick('Mine', 100, 0, 'snack'));
  st.addProfile('Anna');
  assert.equal(st.logOf('2026-11-09').length, 0, 'the new person starts empty');
  st.addLog('2026-11-09', L.quick('Anna lunch', 300, 0, 'lunch'));
  const first = st.profiles()[0].id;
  st.setActive(first);
  assert.deepEqual(st.logOf('2026-11-09').map((e) => e.name), ['Mine']);
});

test('a backup keeps the log, and an imported log is cleaned field by field', () => {
  const s = fake(); const st = A.makeStore(s); st.init(); st.setConsent(true);
  const plan0 = plan().days[1].meals[1];
  st.addLog('2026-11-09', L.fromMeal(plan0, 1.5));
  st.addLog('2026-11-09', L.fromFood(Object.keys(A.ING)[2], 80, 'breakfast'));
  st.addLog('2026-11-08', L.quick('Pizza', 800, 30, 'dinner'));
  const text = st.exportJSON();
  const other = A.makeStore(fake()); other.init();
  const r = other.parseImport(text); assert.ok(r.ok);
  other.applyImport(r.data);
  assert.deepEqual(other.logAll(), st.logAll());
  assert.deepEqual(other.data(), st.data());

  // a hand-edited file: bad dates, markup, impossible numbers, unknown types and unknown ids
  const o = JSON.parse(text);
  const rec = o.data.profiles[0];
  rec.log = {
    '2026-11-07': [{ id: 1, t: 'quick', name: '<img src=x onerror=alert(1)>Soup', k: 300.6, p: 12, m: 'lunch' }, { id: 2, t: 'quick', name: 'Boom', k: 1e9 }, { id: 3, t: 'food', ref: 'no_such_food', g: 100, k: 5 }, { id: 4, t: 'plan', ref: plan0.recipeId, x: 99, k: 5 }, { id: 5, t: 'hack', k: 5 }, 'text', null],
    'not-a-date': [{ id: 1, t: 'quick', name: 'x', k: 1 }],
    '2026-13-45': [{ id: 1, t: 'quick', name: 'x', k: 1 }],
  };
  const r2 = other.parseImport(JSON.stringify(o)); assert.ok(r2.ok);
  other.applyImport(r2.data);
  assert.deepEqual(Object.keys(other.logAll()), ['2026-11-07']);
  const kept = other.logOf('2026-11-07');
  assert.equal(kept.length, 1, 'only the valid entry survives');
  assert.equal(kept[0].name, 'img src=x onerror=alert(1)Soup');
  assert.equal(kept[0].k, 301);
  assert.ok(!/[<>]/.test(kept[0].name));
});

test('a backup made before the log existed still loads, with an empty log', () => {
  const st = A.makeStore(fake()); st.init(); st.setProfile(P); st.setConsent(true);
  const o = JSON.parse(st.exportJSON());
  o.data.profiles.forEach((p) => delete p.log);
  const other = A.makeStore(fake()); other.init();
  const r = other.parseImport(JSON.stringify(o)); assert.ok(r.ok);
  other.applyImport(r.data);
  assert.deepEqual(other.logAll(), {});
  assert.equal(other.active().profile.age, 34);
});

test('deleting everything removes the log too', () => {
  const s = fake(); const st = A.makeStore(s); st.init(); st.setConsent(true);
  st.addLog('2026-11-09', L.quick('A', 100, 0, 'snack'));
  assert.ok(Object.keys(s.m).length > 0);
  st.wipe();
  assert.deepEqual(Object.keys(s.m), []);
  assert.deepEqual(st.logAll(), {});
});

// ---------- the screen is wired in ----------
const fs = require('node:fs');
const path = require('node:path');
const read = (f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

test('the Log screen is wired in: tab, script order, route, buttons, forms', () => {
  const html = read('index.html'), app = read('js/app.js');
  assert.match(html, /<a href="#log">[\s\S]*?data-i18n="nav\.log"/);
  const order = ['js/engine.js', 'js/log.js', 'js/store.js', 'js/app.js'].map((f) => html.indexOf('<script src="' + f + '"'));
  assert.ok(order.every((i) => i > 0), 'a script tag is missing');
  assert.deepEqual(order.slice().sort((a, b) => a - b), order.slice().sort((a, b) => a - b));
  assert.ok(html.indexOf('js/log.js') < html.indexOf('js/app.js') && html.indexOf('js/engine.js') < html.indexOf('js/log.js'), 'log.js must come after engine.js and before app.js');
  assert.match(app, /log: viewLog/);
  ['logday', 'logplan', 'logdel'].forEach((a) => assert.ok(app.includes("'" + a + "'"), a));
  ['logfform', 'logqform', 'logdate', 'logplanday', 'logportion'].forEach((id) => assert.ok(app.includes("'" + id + "'") || app.includes('id="' + id + '"'), id));
  assert.match(app, /logday: secLogDay/);
});

test('the ideas are wired in: section, buttons, refresh with the day, today only', () => {
  const app = read('js/app.js');
  assert.match(app, /logideas: secLogIdeas/);
  ['logidea', 'logmore'].forEach((a) => assert.ok(app.includes("'" + a + "'"), a));
  assert.ok(app.includes('id="sec-logideas"'));
  assert.match(app, /if \(name === 'logday'\) refresh\('logideas'\)/);
  assert.match(app, /if \(S\.logDate !== today\(\)\) return ''/);
});

test('the tab bar has four tabs: Plan, Log, Shop and You', () => {
  assert.match(read('styles.css'), /\.nav \{[^}]*grid-template-columns: repeat\(4,/);
  const nav = read('index.html').match(/<nav class="nav"[\s\S]*?<\/nav>/)[0];
  assert.deepEqual([...nav.matchAll(/<a href="#(\w+)"/g)].map((m) => m[1]), ['plan', 'log', 'shop', 'profile']);
});

test('every log text exists in all four languages and the consent text mentions the log', () => {
  ['i18n_ui', 'i18n_ui2'].forEach((f) => require('../data/' + f + '.js'));
  const D = A.I18N;
  const keys = Object.keys(D.ui.en).filter((k) => k.startsWith('log.') || k === 'nav.log');
  assert.ok(keys.length >= 25);
  ['en', 'fi', 'sv', 'vi'].forEach((l) => keys.forEach((k) => assert.ok(D.ui[l][k] && D.ui[l][k].length > 1, l + ' ' + k)));
  ['en', 'fi', 'sv', 'vi'].forEach((l, i) => {
    const w = [/food log/i, /ruokapäiväkirja/i, /matlogg/i, /nhật ký ăn uống/i][i];
    assert.match(D.ui[l]['consent.body'], w, l + ' consent.body');
  });
});
