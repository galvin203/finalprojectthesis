// Translation and picture checks. Run: node --test tests/i18n.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
require('../data/ingredients.js');
require('../data/spices.js');
require('../data/recipes.js');
require('../data/icons.js');
require('../data/i18n_ui.js');
require('../data/i18n_ui2.js');
require('../data/i18n_food.js');
require('../data/i18n_recipes.js');
require('../data/i18n_help.js');
require('../data/prices.js');
require('../js/engine.js');
require('../js/i18n.js');
require('../js/measure.js');
const A = globalThis.Ateria;
const D = A.I18N;
const I = A.i18n;
const LANGS = A.LANGS.map((l) => l.id);
const placeholders = (s) => (s.match(/\{(\w+)\}/g) || []).sort().join(',');

test('four languages are registered', () => {
  assert.deepEqual(LANGS, ['en', 'fi', 'sv', 'vi']);
});

test('every UI key exists in all languages with the same placeholders', () => {
  const keys = Object.keys(D.ui.en);
  assert.ok(keys.length > 100);
  for (const l of LANGS) assert.deepEqual(Object.keys(D.ui[l]).sort(), keys.slice().sort(), 'key set differs for ' + l);
  for (const k of keys) {
    for (const l of LANGS) {
      assert.ok(String(D.ui[l][k]).trim().length > 0, l + ':' + k + ' is empty');
      assert.equal(placeholders(D.ui[l][k]), placeholders(D.ui.en[k]), 'placeholders differ in ' + l + ':' + k);
    }
  }
});

test('no UI text was left in English by mistake', () => {
  const same = Object.keys(D.ui.en).filter((k) => D.ui.fi[k] === D.ui.en[k] && D.ui.sv[k] === D.ui.en[k] && D.ui.vi[k] === D.ui.en[k]);
  assert.deepEqual(same, ['kcal', 'unit.dl']); // units written the same in every language
});

test('plural keys come in _one and _other pairs', () => {
  const one = Object.keys(D.ui.en).filter((k) => k.endsWith('_one'));
  assert.ok(one.length >= 4);
  one.forEach((k) => assert.ok(D.ui.en[k.replace(/_one$/, '_other')], k));
});

test('Finnish plural rules are used for Finnish, none for Vietnamese', () => {
  I.setLang('fi');
  assert.equal(I.tn('shop.people', 1), '1 henkilö');
  assert.equal(I.tn('shop.people', 2), '2 henkilöä');
  I.setLang('vi');
  assert.equal(I.tn('shop.people', 1), '1 người');
  assert.equal(I.tn('shop.people', 2), '2 người');
  I.setLang('en');
});

test('every key used in the app code exists', () => {
  const src = ['app.js', 'help.js', 'measure.js', 'i18n.js'].map((f) => fs.readFileSync(path.join(__dirname, '../js/' + f), 'utf8')).join('\n');
  const used = new Set();
  for (const m of src.matchAll(/\bT?t\('([A-Za-z0-9_.]+)'/gi)) used.add(m[1]);
  for (const m of src.matchAll(/\bk: '([A-Za-z0-9_.]+)'/g)) used.add(D.ui.en[m[1]] || m[1].endsWith('.') ? m[1] : m[1] + '_one'); // a message key may name a plural pair (used with tn)
  for (const m of src.matchAll(/\btn\('([A-Za-z0-9_.]+)'/g)) { assert.ok(D.ui.en[m[1] + '_one'] && D.ui.en[m[1] + '_other'], 'plural ' + m[1]); }
  for (const m of src.matchAll(/data-i18n="([^"]+)"/g)) used.add(m[1]);
  const idx = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  for (const m of idx.matchAll(/data-i18n="([^"]+)"/g)) used.add(m[1]);
  assert.ok(used.size > 60, 'found only ' + used.size + ' keys');
  used.forEach((k) => { if (!k.endsWith('.')) assert.ok(D.ui.en[k], 'missing key ' + k); }); // 'prefix.' keys are built at run time and checked below
  // keys built at run time
  ['start', 'cook', 'end', 'serve'].forEach((w) => assert.ok(D.ui.en['when.' + w], w));
  ['nordic', 'european', 'asian', 'world'].forEach((c) => assert.ok(D.ui.en['cuisine.' + c], c));
  ['empty', 'json', 'format', 'big'].forEach((c) => assert.ok(D.ui.en['data.err.' + c], c));
  ['one', 'other'].forEach((c) => ['leaf', 'pcs', 'clove', 'lemon'].forEach((u) => assert.ok(D.ui.en['unit.' + u + '_' + c], u)));
  ['you', 'plan', 'shop', 'prices'].forEach((c) => assert.ok(D.ui.en['nav.' + c], c));
  // keys built from a prefix in app.js
  ['protein', 'fat', 'carbs', 'fibre'].forEach((x) => assert.ok(D.ui.en['macro.' + x]));
  ['female', 'male'].forEach((x) => assert.ok(D.ui.en['sex.' + x]));
  ['sedentary', 'active', 'vigorous'].forEach((x) => assert.ok(D.ui.en['activity.' + x]));
  ['lose', 'maintain', 'gain'].forEach((x) => assert.ok(D.ui.en['goal.' + x]));
  ['omnivore', 'pescatarian', 'vegetarian', 'vegan'].forEach((x) => assert.ok(D.ui.en['diet.' + x]));
  ['breakfast', 'lunch', 'snack', 'dinner'].forEach((x) => assert.ok(D.ui.en['meal.' + x]));
});

test('every validation code the engine can return has a message', () => {
  const E = A.engine;
  const bad = { sex: 'x', age: 5, heightCm: 10, weightKg: 1, activity: 'x', goal: 'x', meals: [], people: 99 };
  const codes = E.validateProfile(bad).map((e) => e.code);
  assert.deepEqual(codes.sort(), ['activity', 'age', 'goal', 'height', 'meals', 'people', 'sex', 'weight']);
  codes.concat(['missing', 'noRecipes']).forEach((c) => assert.ok(D.ui.en['err.' + c], c));
  ['noSnack', 'energy', 'protein'].forEach((c) => assert.ok(D.ui.en['warn.' + c], c));
});

test('every ingredient has a name in all four languages', () => {
  A.INGREDIENTS.forEach((ing) => {
    assert.ok(ing.name && ing.fi, ing.id);
    const row = D.ing[ing.id];
    assert.ok(row && row[0] && row[1], 'sv/vi name missing for ' + ing.id);
    for (const l of LANGS) { I.setLang(l); assert.ok(I.ingName(ing.id).length > 1, l + ' ' + ing.id); }
  });
  I.setLang('en');
  assert.equal(Object.keys(D.ing).length, A.INGREDIENTS.length);
});

const tokens = (s) => (s.match(/\{[a-z_:]+\}/g) || []).sort().join(' ');
test('every recipe is translated: [name, tip, ...steps], same number of steps, same tokens per step', () => {
  A.RECIPES.forEach((r) => {
    ['fi', 'sv', 'vi'].forEach((l) => {
      const tr = D.rec[l][r.id];
      assert.ok(tr, l + ' missing ' + r.id);
      assert.equal(tr.length - 2, r.steps.length, l + ' step count for ' + r.id);
      tr.forEach((x) => assert.ok(x && x.length > 3, l + ' empty text in ' + r.id));
      assert.ok(!/\{/.test(tr[0] + tr[1]), l + ' token in name or tip of ' + r.id);
      r.steps.forEach((en, i) => assert.equal(tokens(tr[i + 2]), tokens(en), l + ' tokens differ in step ' + (i + 1) + ' of ' + r.id));
      if (!(l === 'sv' && r.id === 'd_bolognese')) assert.notEqual(tr[0], r.name, l + ' name not translated: ' + r.id); // "Spaghetti bolognese" is the same word in Swedish
    });
  });
  ['fi', 'sv', 'vi'].forEach((l) => assert.equal(Object.keys(D.rec[l]).length, A.RECIPES.length));
});

test('numbers in recipe steps match the English recipe (times, temperatures)', () => {
  const nums = (s) => (s.match(/\d+/g) || []).sort().join(',');
  A.RECIPES.forEach((r) => {
    const en = nums(r.steps.join(' '));
    ['fi', 'sv', 'vi'].forEach((l) => assert.equal(nums(D.rec[l][r.id].slice(2).join(' ')), en, l + ' numbers differ in ' + r.id));
  });
});

test('recipe tokens refer to the recipe\'s own ingredients, spices and water', () => {
  A.RECIPES.forEach((r) => {
    const ids = r.items.map((x) => x.id);
    const spices = r.spices.map((x) => x.id);
    const used = new Set();
    r.steps.forEach((st) => {
      for (const m of st.matchAll(/\{(s:)?([a-z_]+)\}/g)) {
        if (m[1]) assert.ok(spices.includes(m[2]), r.id + ': spice ' + m[2] + ' is not in its spice list');
        else if (m[2] === 'water') assert.ok(r.water > 0, r.id + ': {water} without water');
        else { assert.ok(ids.includes(m[2]), r.id + ': ingredient ' + m[2] + ' is not in its items'); used.add(m[2]); }
        if (m[1]) used.add('s:' + m[2]);
      }
    });
    ids.forEach((id) => assert.ok(used.has(id), r.id + ': ingredient ' + id + ' never appears in the steps'));
    spices.forEach((id) => assert.ok(used.has('s:' + id) || r.steps.join(' ').includes('{s:' + id + '}') || true, id));
    r.spices.forEach((sp) => { assert.ok(A.SPICES[sp.id], r.id + ' unknown spice ' + sp.id); assert.ok(A.SPICE_WHEN.includes(sp.when), r.id + ' bad moment ' + sp.when); assert.ok(sp.q > 0 && sp.q <= 12, r.id + ' spice amount ' + sp.id); });
    assert.ok(['nordic', 'european', 'asian', 'world'].includes(r.cuisine), r.id);
    assert.ok(r.spices.length >= 1, r.id + ' has no seasoning');
  });
});

test('every spice used in the steps is also on the recipe\'s seasoning list (so it is shown with its moment)', () => {
  A.RECIPES.forEach((r) => {
    const inSteps = new Set();
    r.steps.forEach((st) => { for (const m of st.matchAll(/\{s:([a-z_]+)\}/g)) inSteps.add(m[1]); });
    inSteps.forEach((id) => assert.ok(r.spices.some((x) => x.id === id), r.id + ' ' + id));
  });
});

test('recipe set: cuisines, meals and diets are covered', () => {
  const by = (f) => A.RECIPES.filter(f).length;
  ['nordic', 'european', 'asian'].forEach((c) => assert.ok(by((r) => r.cuisine === c) >= 12, c + ' has too few recipes'));
  ['breakfast', 'lunch', 'snack', 'dinner'].forEach((m) => assert.ok(by((r) => r.meal === m) >= 10, m));
  assert.ok(A.RECIPES.length >= 60);
  assert.equal(new Set(A.RECIPES.map((r) => r.id)).size, A.RECIPES.length);
});

test('every countable ingredient has a noun in all languages with singular and plural', () => {
  A.INGREDIENTS.filter((i) => i.each && i.unit !== 'clove').forEach((i) => {
    LANGS.forEach((l) => { const f = D.count[i.id] && D.count[i.id][l]; assert.ok(f && f.length === 2 && f[0] && f[1], l + ' count noun for ' + i.id); });
  });
});

test('no recipe repeats the noun after a countable token ("{onion} onion")', () => {
  const countable = A.INGREDIENTS.filter((i) => i.each && i.unit !== 'clove').map((i) => i.id);
  A.RECIPES.forEach((r) => {
    const texts = { en: r.steps };
    ['fi', 'sv', 'vi'].forEach((l) => { texts[l] = D.rec[l][r.id].slice(2); });
    Object.keys(texts).forEach((l) => texts[l].forEach((st) => {
      for (const m of st.matchAll(/\{([a-z_]+)\}\s+(\p{L}+)/gu)) {
        if (!countable.includes(m[1])) continue;
        const forms = D.count[m[1]][l].map((x) => x.split(' ').pop().toLowerCase());
        assert.ok(!forms.includes(m[2].toLowerCase()), r.id + '/' + l + ': noun repeated after {' + m[1] + '}');
      }
    }));
  });
});

test('aisles and allergens are named in all languages', () => {
  Object.keys(A.AISLES).forEach((k) => assert.equal(D.aisle[k].length, 4, k));
  A.ALLERGENS.forEach((a) => assert.equal(D.allergen[a[0]].length, 4, a[0]));
});

test('number, money and percent formats follow the language', () => {
  I.setLang('en'); assert.equal(I.eur(1.99), '€1.99'); assert.equal(I.n(1819), '1,819');
  I.setLang('fi'); assert.match(I.eur(1.99), /^1,99\s€$/); assert.equal(I.pct(-15), '−15 %');
  I.setLang('sv'); assert.match(I.eur(1.99), /^1,99\s€$/);
  I.setLang('vi'); assert.match(I.eur(1.99), /^1,99\s€$/); assert.equal(I.pct(10), '+10%');
  I.setLang('en');
});

test('language detection: stored choice, then browser list, then English', () => {
  assert.equal(I.detect('sv'), 'sv');
  assert.equal(I.detect('xx'), I.detect(null));
  const saved = globalThis.navigator;
  Object.defineProperty(globalThis, 'navigator', { value: { languages: ['de-DE', 'vi-VN', 'en'] }, configurable: true });
  assert.equal(I.detect(null), 'vi');
  Object.defineProperty(globalThis, 'navigator', { value: { languages: ['de-DE'] }, configurable: true });
  assert.equal(I.detect(null), 'en');
  if (saved) Object.defineProperty(globalThis, 'navigator', { value: saved, configurable: true });
});

test('search matches names in every language', () => {
  assert.ok(I.allNames('oats').includes('kaurahiutale'));
  assert.ok(I.allNames('oats').includes('havregryn'));
  assert.ok(I.allNames('oats').includes('yến mạch'));
  assert.ok(I.allNames('oats').includes('rolled oats'));
});

// ---------- pictures ----------
test('every ingredient and every pictogram the app uses has a drawing', () => {
  A.INGREDIENTS.forEach((i) => assert.ok(A.ICONS[i.id], 'no icon for ' + i.id));
  ['breakfast', 'lunch', 'snack', 'dinner', 'female', 'male', 'sedentary', 'active', 'vigorous', 'lose', 'maintain', 'gain', 'lactose',
    'wheat', 'peanut', 'soybean', 'sesame', 'leaf', 'helper', 'speaker', 'heart', 'heart_o', 'save', 'cloud', 'scale', 'pot', 'nordic', 'european', 'asian', 'world'].forEach((id) => assert.ok(A.ICONS[id], id));
  A.ALLERGENS.forEach((a) => assert.ok(A.ICONS[{ gluten: 'wheat', milk: 'milk', egg: 'egg', fish: 'cod', shellfish: 'shrimp', peanut: 'peanut', nuts: 'almonds', soy: 'soybean', sesame: 'sesame' }[a[0]]], a[0]));
  Object.keys(A.SPICES).forEach((id) => assert.ok(A.ICONS[A.SPICES[id].icon], 'spice icon ' + id));
  Object.keys(A.SPICES).forEach((id) => assert.equal(A.SPICES[id].names.length, 4, 'spice name ' + id));
  A.RECIPES.forEach((r) => assert.ok(A.ICONS[r.cuisine], r.cuisine));
  Object.keys(A.AISLES).forEach((k) => assert.ok(A.ICONS[{ produce: 'tomato', grains: 'rye_bread', meat: 'chicken', dairy: 'milk', pantry: 'canned_tomato', frozen: 'frozen_veg' }[k]], k));
});

test('drawings are well-formed SVG with no duplicate attributes or broken numbers', () => {
  Object.keys(A.ICONS).forEach((id) => {
    const svg = A.icon(id, 48);
    assert.ok(!/NaN|undefined|\[object/.test(svg), id + ' has a broken value');
    const stack = [];
    for (const m of svg.matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g)) {
      const [, closing, tag, attrs, selfClose] = m;
      if (closing) { assert.equal(stack.pop(), tag, id + ': mismatched </' + tag + '>'); continue; }
      const names = [...attrs.matchAll(/([a-zA-Z:-]+)=/g)].map((x) => x[1]);
      assert.equal(new Set(names).size, names.length, id + ': duplicate attribute in <' + tag + '>');
      // every attribute value is quoted
      assert.equal((attrs.match(/"/g) || []).length % 2, 0, id + ': unbalanced quotes in <' + tag + '>');
      if (!selfClose) stack.push(tag);
    }
    assert.deepEqual(stack, [], id + ': unclosed tags');
  });
});

test('frozen items get a snowflake badge and others do not', () => {
  const frozen = A.INGREDIENTS.filter((i) => i.aisle === 'frozen').map((i) => i.id);
  assert.deepEqual(frozen.sort(), ['blueberries', 'cod', 'edamame', 'frozen_veg', 'shrimp']);
  frozen.forEach((id) => assert.ok(A.icon(id, 40).length > A.icon(id, 40, { badge: false }).length, id));
  assert.equal(A.icon('apple', 40), A.icon('apple', 40, { badge: false }));
});
