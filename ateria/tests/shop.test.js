// The Shop screen: amounts per meal and day, and the removal of prices. Run: node --test tests/shop.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
['ingredients', 'spices', 'recipes', 'icons', 'i18n_ui', 'i18n_ui2', 'i18n_food', 'i18n_recipes', 'i18n_help'].forEach((f) => require('../data/' + f + '.js'));
['engine', 'i18n', 'measure'].forEach((f) => require('../js/' + f + '.js'));
const A = globalThis.Ateria;
const E = A.engine, M = A.measure, I = A.i18n;
const root = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const LANGS = ['en', 'fi', 'sv', 'vi'];

const P = { sex: 'female', age: 34, heightCm: 168, weightKg: 68, activity: 'active', goal: 'maintain', diet: 'omnivore', allergies: [], lactoseFree: false, dislikes: [], favorites: [], meals: ['breakfast', 'lunch', 'snack', 'dinner'], people: 2, cuisines: [] };

test('the seasoning list follows the chosen days', () => {
  const plan = E.planWeek(P, 3);
  const ids = (s) => s.dried.concat(s.fresh, s.salt).map((x) => x.id).sort();
  assert.deepEqual(ids(M.spiceSummary(plan)), ids(M.spiceSummary(plan, [0, 1, 2, 3, 4, 5, 6])));
  assert.deepEqual(ids(M.spiceSummary(plan, [])), []);
  // what two days need is part of what the week needs, and the counts add up
  const week = M.spiceSummary(plan), two = M.spiceSummary(plan, [2, 5]);
  const count = (s) => s.dried.concat(s.fresh, s.salt).reduce((n, x) => n + x.uses, 0);
  assert.equal(count(two), [2, 5].reduce((n, d) => n + plan.days[d].meals.reduce((m, meal) => m + A.REC[meal.recipeId].spices.length, 0), 0));
  assert.ok(count(two) < count(week));
  ids(two).forEach((id) => assert.ok(ids(week).includes(id), id));
});

test('an amount on the list is shown as grams and as a kitchen measure, never as money', () => {
  const plan = E.planWeek(P, 4);
  const list = E.shoppingList(plan, P);
  list.rows.forEach((r) => {
    const text = M.ingredientText(r.id, Math.round(r.grams), 'shop');
    assert.ok(/\d/.test(text), r.id + ': ' + text);
    assert.ok(!/[€$£]/.test(text), r.id + ' shows a currency sign');
  });
});

test('the Shop screen is wired in: day buttons, all days, and where an amount comes from', () => {
  const app = read('js/app.js');
  ['shopday', 'shopall'].forEach((a) => assert.ok(app.includes("'" + a + "'") || app.includes('"' + a + '"'), a));
  assert.ok(app.includes('S.shopDays'));
  assert.ok(app.includes("E.shoppingList(S.plan, p, { days: S.shopDays })"));
  assert.ok(app.includes("M.spiceSummary(plan, S.shopDays)"));
  assert.match(app, /aria-pressed="' \+ \(S\.shopDays\.indexOf\(i\) >= 0\)/);
  assert.match(app, /<details class="uses">/);
  assert.match(read('styles.css'), /\.item \.uses summary/);
});

test('the day buttons start with all seven days selected', () => {
  assert.match(read('js/app.js'), /shopDays: \[0, 1, 2, 3, 4, 5, 6\]/);
});

test('every Shop text exists in all four languages, with a {n} in each plural form', () => {
  const ui = A.I18N.ui;
  ['shop.title', 'shop.forDays', 'shop.allDays', 'shop.noDays', 'shop.where', 'shop.note', 'shop.spices', 'shop.spicesHelp', 'shop.spicesDried', 'shop.spicesFresh',
    'welcome.s3.t', 'welcome.s3.b', 'brand.tag', 'welcome.title', 'item.got']
    .forEach((k) => LANGS.forEach((l) => assert.ok(ui[l][k] && ui[l][k].length > 3, l + ' ' + k)));
  ['shop.items', 'shop.meals', 'shop.uses', 'shop.people'].forEach((base) => ['one', 'other'].forEach((f) => LANGS.forEach((l) => {
    const v = ui[l][base + '_' + f];
    assert.ok(v && v.includes('{n}'), l + ' ' + base + '_' + f);
  })));
  // the plural helper picks a form for every language
  LANGS.forEach((l) => { I.setLang(l); assert.ok(I.tn('shop.items', 1).includes('1'), l); assert.ok(I.tn('shop.items', 12).includes('12'), l); });
  I.setLang('en');
});

test('no price, store, budget or money feature is left in the app', () => {
  // files
  ['data/prices.js', 'tools/prices_tool.py', 'tests/test_prices_tool.py', 'tests/stores.test.js', 'img/smarket.jpg', 'img/kmarket.png', 'img/lidl.png']
    .forEach((f) => assert.ok(!fs.existsSync(path.join(root, f)), f + ' is still there'));
  const index = read('index.html');
  assert.ok(!/prices/i.test(index) && !/data-i18n="nav\.prices"/.test(index));
  assert.ok(!index.includes('href="#prices"'));
  // code
  const app = read('js/app.js');
  ['viewPrices', 'storeLogo', 'budgetText', 'ioload', 'iocopy', 'ioreset', 'mergePrices', 'parsePrices', 'SEED_PRICES', 'A.STORES', 'buildPrices', 'eur('].forEach((x) => assert.ok(!app.includes(x), x));
  assert.ok(!/name="budget"|id="budget/.test(app));
  assert.equal(E.mergePrices, undefined); assert.equal(E.parsePrices, undefined);
  assert.equal(I.eur, undefined);
  // texts: none of the removed keys, and no price words in English, Finnish or Swedish
  const keys = Object.keys(A.I18N.ui.en);
  assert.deepEqual(keys.filter((k) => /^(prices|io|store)\./.test(k) || ['nav.prices', 'est', 'item.noPrice', 'profile.budget', 'budget.none', 'shop.mixed', 'shop.logos', 'shop.noteBudget'].includes(k)), []);
  LANGS.forEach((l) => {
    const bad = keys.filter((k) => /€|\beuros?\b|\bprices?\b|\bpriced\b|\bcheapest\b|\bbudget\b|\bhinta|\bhinnat|\bbudjetti|\bpriser?\b|\bprissatt|\bbilligast|\bbudgeten|\bngân sách|\bgiá (rẻ|tiền|ước tính|thật|minh họa)|cửa hàng rẻ/i.test(A.I18N.ui[l][k]));
    assert.deepEqual(bad, [], l + ' still talks about prices in ' + bad.join(', '));
  });
  const helpText = JSON.stringify(A.I18N.help);
  assert.ok(!/\bprices?\b|\bbudget\b|cheapest|\bhinnat|\bpriser\b|ngân sách/i.test(helpText), 'a help topic still talks about prices');
});

test('an old profile or backup that still has a budget or prices is read, and the extra fields are dropped', () => {
  require('../js/store.js');
  const m = {};
  const st = A.makeStore({ getItem: (k) => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: (k) => { delete m[k]; } });
  st.init();
  const old = Object.assign({}, P, { budget: 70 });
  const r = st.parseImport(JSON.stringify({ profiles: [{ id: 'p1', name: 'Me', profile: old }], prices: { s: { oats: { price: 1.5 } } } }));
  assert.ok(r.ok);
  assert.equal(r.data.profiles[0].profile.people, 2);
  assert.ok(!('budget' in r.data.profiles[0].profile));
  assert.ok(!('prices' in r.data));
  assert.ok(!JSON.stringify(r.data).includes('price'));
});
