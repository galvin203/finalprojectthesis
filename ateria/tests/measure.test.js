// Kitchen measures, recipe views and seasoning. Run: node --test tests/measure.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
['ingredients', 'spices', 'recipes', 'icons', 'i18n_ui', 'i18n_ui2', 'i18n_food', 'i18n_recipes', 'prices'].forEach((f) => require('../data/' + f + '.js'));
['engine', 'i18n', 'measure'].forEach((f) => require('../js/' + f + '.js'));
const A = globalThis.Ateria;
const M = A.measure;
const I = A.i18n;
const LANGS = ['en', 'fi', 'sv', 'vi'];
const sp = (x) => x.replace(/[\u00a0\u202f]/g, ' '); // the app uses no-break spaces between a number and its unit
const BAD = /\{|\}|undefined|NaN|\[object|\bnull\b|\s,|\(\s*\)|\s{2,}/;

test('fractions are shown as eighths with unicode fraction characters', () => {
  assert.equal(M.frac(1.5), '1½');
  assert.equal(M.frac(0.25), '¼');
  assert.equal(M.frac(3), '3');
  assert.equal(M.frac(0.125), '⅛');
  assert.equal(M.frac(2.74), '2¾');
});

test('ingredients: small amounts in spoons, liquids in dl, countables in pieces, the rest in grams', () => {
  assert.equal(M.pickIngredient('egg', 110).kind, 'pcs');
  assert.equal(M.pickIngredient('egg', 110).n, 2);
  assert.equal(M.pickIngredient('garlic', 10).kind, 'clove');
  assert.equal(M.pickIngredient('milk', 200).kind, 'dl');
  assert.equal(M.pickIngredient('milk', 200).n, 2);
  assert.equal(M.pickIngredient('chicken', 150).kind, 'g');
  const spoon = M.pickIngredient('oil', 14);
  assert.ok(spoon.kind === 'tbsp' || spoon.kind === 'tsp', 'oil 14 g is a spoon amount');
  assert.equal(M.pickIngredient('oil', 5).kind, 'tsp');
  // never rounds an amount to zero
  A.INGREDIENTS.forEach((i) => [0.5, 1, 3, 10, 40, 100, 250, 600].forEach((g) => {
    const p = M.pickIngredient(i.id, g);
    if (p.kind !== 'g') assert.ok(p.n > 0, i.id + ' ' + g);
  }));
});

test('household measures stay close to the real grams (within one rounding step)', () => {
  A.INGREDIENTS.forEach((ing) => [3, 8, 15, 30, 55, 120, 200, 330].forEach((g) => {
    const p = M.pickIngredient(ing.id, g);
    let back = null;
    if (p.kind === 'pcs' || p.kind === 'clove') back = p.n * ing.each;
    else if (p.kind === 'tsp') back = (p.n / 3) * ing.tbsp;
    else if (p.kind === 'tbsp') back = p.n * ing.tbsp;
    else if (p.kind === 'dl') back = p.n * ing.dl;
    if (back == null) return;
    const tol = p.kind === 'pcs' || p.kind === 'clove' ? ing.each * 0.5 : Math.max(g * 0.2, 2);
    assert.ok(Math.abs(back - g) <= tol + 0.001, ing.id + ' ' + g + ' g shown as ' + JSON.stringify(p) + ' = ' + back.toFixed(1) + ' g');
  }));
});

test('seasoning amounts scale with people, but a bigger portion adds little', () => {
  const one = M.pickSpice('cumin', 1, 1, 1);
  const four = M.pickSpice('cumin', 1, 1, 4);
  assert.equal(one.kind, 'tsp');
  assert.ok((four.kind === 'tbsp' ? four.n * 3 : four.n) > (one.n || 1) * 3, 'four people need more than one');
  // a portion factor of 2.2 is capped at 1.5 for seasoning
  const big = M.pickSpice('cumin', 2, 2.2, 1), cap = M.pickSpice('cumin', 2, 1.5, 1);
  assert.deepEqual(big, cap);
  assert.equal(M.pickSpice('pepper', 0.125, 1, 1).kind, 'pinch');
  assert.equal(M.pickSpice('bay', 1, 1, 1).kind, 'leaf');
  assert.equal(M.pickSpice('lemon', 0.5, 1, 1).kind, 'lemon');
  assert.ok(M.pickSpice('lemon', 0.01, 1, 1).n >= 0.125);
});

test('water is rounded to 50 ml and never below 50 ml', () => {
  assert.equal(M.pickWater(300, 1, 1), 300);
  assert.equal(M.pickWater(330, 1.2, 1), 400);
  assert.equal(M.pickWater(10, 1, 1), 50);
  assert.equal(M.pickWater(300, 1, 3), 900);
  I.setLang('en'); assert.equal(M.waterText(400), '400 ml'); assert.equal(M.waterText(1500), '1.5 l');
  I.setLang('fi'); assert.equal(M.waterText(1500), '1,5 l');
  I.setLang('en');
});

test('text for amounts: noun with the number for countables, grams for the rest, in every language', () => {
  const tx = (id, g, mode) => sp(M.ingredientText(id, g, mode));
  I.setLang('en');
  assert.equal(tx('egg', 110, 'step'), '2 eggs');
  assert.equal(tx('egg', 55, 'step'), '1 egg');
  assert.equal(tx('egg', 110, 'table'), '2 eggs (110 g)');
  assert.equal(tx('milk', 200, 'step'), '2 dl');
  assert.equal(tx('milk', 200, 'table'), '2 dl (200 g)');
  assert.equal(tx('chicken', 150, 'step'), '150 g');
  assert.equal(tx('milk', 1000, 'shop'), '1 kg');
  assert.equal(tx('garlic', 10, 'step'), '2 cloves');
  // a small piece of a countable item is counted as a fraction; a tiny one reads "10 g onion", never "0 onions"
  assert.equal(tx('onion', 55, 'step'), '½ onion');
  assert.equal(tx('onion', 10, 'step'), '10 g onion');
  I.setLang('fi'); assert.equal(tx('egg', 110, 'step'), '2 kananmunaa'); assert.equal(tx('egg', 55, 'step'), '1 kananmuna');
  I.setLang('sv'); assert.equal(tx('egg', 110, 'step'), '2 ägg');
  I.setLang('vi'); assert.equal(tx('egg', 110, 'step'), '2 quả trứng');
  I.setLang('en');
});

test('seasoning text: pinch, spoons, leaves, lemon', () => {
  I.setLang('en');
  assert.equal(M.spiceText({ kind: 'pinch' }), 'a pinch of');
  assert.equal(M.spiceText({ kind: 'pinch' }, true), 'a pinch');
  assert.equal(M.spiceText({ kind: 'tsp', n: 1.5 }), '1½ tsp');
  assert.equal(M.spiceText({ kind: 'tbsp', n: 1 }), '1 tbsp');
  assert.equal(M.spiceText({ kind: 'leaf', n: 2 }), '2 leaves');
  assert.equal(M.spiceText({ kind: 'lemon', n: 0.5 }), '½ lemon');
  I.setLang('fi'); assert.match(M.spiceText({ kind: 'tsp', n: 1 }), /tl/);
  I.setLang('en');
});

// a meal as the planner makes it, built from the recipe itself
function mealOf(r, factor) {
  return { recipeId: r.id, meal: r.meal, cuisine: r.cuisine, factor: factor, items: r.items.map((x) => ({ id: x.id, g: x.g * factor })) };
}

test('every recipe fills every token in every language, for 1, 2 and 5 portions', () => {
  A.RECIPES.forEach((r) => LANGS.forEach((l) => {
    I.setLang(l);
    [1, 2, 5].forEach((n) => [0.6, 1, 1.8].forEach((f) => {
      const v = M.recipeView(mealOf(r, f), n);
      assert.equal(v.steps.length, r.steps.length);
      [v.name, v.tip].concat(v.steps).forEach((x) => { assert.ok(x.length > 3, r.id); assert.ok(!BAD.test(x), r.id + '/' + l + ': ' + x); });
      v.spices.forEach((s) => { assert.ok(s.name && s.text, r.id + ' ' + s.id); assert.ok(!BAD.test(s.text + s.name), s.text); });
      assert.equal(v.spices.length, r.spices.length);
      assert.ok(r.water === 0 ? v.water === 0 : v.water >= 50, r.id + ' water');
    }));
  }));
  I.setLang('en');
});

test('spices are listed by the moment they are used: start, cook, end, serve', () => {
  A.RECIPES.forEach((r) => {
    const v = M.recipeView(mealOf(r, 1), 1);
    const order = v.spices.map((s) => A.SPICE_WHEN.indexOf(s.when));
    assert.deepEqual(order, order.slice().sort((a, b) => a - b), r.id);
  });
});

test('amounts in the steps double when the number of portions doubles (for non-rounded cases)', () => {
  I.setLang('en');
  const r = A.REC.b_berry_oats;
  const one = M.recipeView(mealOf(r, 1), 1).steps[0], two = M.recipeView(mealOf(r, 1), 2).steps[0];
  assert.match(sp(one), /2 dl milk/);
  assert.match(sp(two), /4 dl milk/);
  assert.match(one, /rolled oats/);
});

test('a swapped ingredient is found by the original token (milk -> oat drink)', () => {
  I.setLang('en');
  const r = A.REC.b_berry_oats;
  const meal = mealOf(r, 1);
  meal.items = meal.items.map((it) => (it.id === 'milk' ? { id: 'oat_drink', g: it.g, swappedFrom: 'milk' } : it));
  const v = M.recipeView(meal, 1);
  assert.match(sp(v.steps[0]), /2 dl milk/); // the sentence keeps its noun; the swap note tells the person what to use
  assert.deepEqual(v.swaps, [{ from: 'milk', to: 'oat_drink' }]);
});

test('seasoning summary for a plan sorts salt, dried and fresh', () => {
  const E = A.engine;
  const p = { sex: 'female', age: 34, heightCm: 168, weightKg: 68, activity: 'active', goal: 'maintain', diet: 'omnivore', allergies: [], lactoseFree: false, dislikes: [], favorites: [], meals: ['breakfast', 'lunch', 'snack', 'dinner'], people: 1, budget: 0, cuisines: [] };
  const plan = E.planWeek(p, 12345);
  const s = M.spiceSummary(plan);
  assert.ok(s.dried.length > 3 && s.fresh.length >= 1);
  s.dried.forEach((x) => assert.ok(!['fresh', 'salt'].includes(A.SPICES[x.id].kind)));
  s.fresh.forEach((x) => assert.equal(A.SPICES[x.id].kind, 'fresh'));
  const total = plan.days.reduce((a, d) => a + d.meals.reduce((b, m) => b + A.REC[m.recipeId].spices.length, 0), 0);
  const counted = [].concat(s.dried, s.fresh, s.salt).reduce((a, x) => a + x.uses, 0);
  assert.equal(counted, total);
});

test('seasoning is never part of nutrition or the shopping list', () => {
  A.RECIPES.forEach((r) => r.items.forEach((it) => assert.ok(!A.SPICES[it.id], r.id + ' lists a seasoning as an ingredient: ' + it.id)));
  // salt use stays low: at most 1/4 tsp per base portion in any recipe, and no more than 1/2 tsp in total over a day of recipes
  A.RECIPES.forEach((r) => r.spices.filter((s) => s.id === 'salt').forEach((s) => assert.ok(s.q <= 0.75, r.id + ' salt ' + s.q)));
});
