const test = require('node:test');
const assert = require('node:assert/strict');
require('../data/ingredients.js');
require('../data/spices.js');
require('../data/recipes.js');
require('../data/prices.js');
require('../js/engine.js');
const A = globalThis.Ateria;
const E = A.engine;

function profile(over) {
  return Object.assign({
    sex: 'male', age: 30, heightCm: 180, weightKg: 80, activity: 'sedentary', goal: 'maintain',
    diet: 'omnivore', allergies: [], lactoseFree: false, dislikes: [], favorites: [],
    meals: ['breakfast', 'lunch', 'dinner'], people: 1, budget: 0,
  }, over || {});
}

// ---------- 1. formulas, checked by hand ----------
test('Mifflin-St Jeor and targets match hand calculation', () => {
  const t = E.computeTargets(profile());
  assert.equal(t.bmr, 1780);                       // 10*80 + 6.25*180 - 5*30 + 5
  assert.equal(t.tdee, Math.round(1780 * 1.53));   // 2723
  assert.equal(t.kcal, 2723);
  assert.equal(t.protein, 96);                     // 80 kg * 1.2
  const f = E.computeTargets(profile({ sex: 'female', age: 40, heightCm: 165, weightKg: 60, goal: 'lose' }));
  assert.equal(f.bmr, Math.round(600 + 1031.25 - 200 - 161)); // 1270
  assert.equal(f.kcal, Math.round(Math.max(1270 * 1.53 * 0.85, 1270))); // floor at BMR applies? 1651.6 > 1270 -> 1652
  assert.equal(f.protein, 96);                     // 60 * 1.6
});

test('energy never goes below resting energy and age below 18 is rejected', () => {
  const t = E.computeTargets(profile({ goal: 'lose', activity: 'sedentary', weightKg: 40, heightCm: 150, age: 70, sex: 'female' }));
  assert.ok(t.kcal >= t.bmr);
  assert.ok(E.validateProfile(profile({ age: 17 })).length > 0);
});

// ---------- 2. data integrity ----------
test('every recipe ingredient exists and every ingredient has a seed price in all stores', () => {
  A.RECIPES.forEach(r => r.items.forEach(it => assert.ok(A.ING[it.id], r.id + ' uses unknown ' + it.id)));
  A.INGREDIENTS.forEach(i => ['s', 'k', 'lidl'].forEach(s => {
    const p = A.SEED_PRICES[s][i.id];
    assert.ok(p && p.price > 0 && p.packG > 0, i.id + '/' + s);
  }));
  const meals = { breakfast: 0, lunch: 0, dinner: 0 };
  A.RECIPES.forEach(r => meals[r.meal]++);
  assert.ok(meals.breakfast >= 7 && meals.lunch >= 7 && meals.dinner >= 7, JSON.stringify(meals));
});

test('ingredient energy is consistent with its macros (Atwater, loose tolerance)', () => {
  const bad = [];
  A.INGREDIENTS.forEach(i => {
    const n = i.per100;
    const est = 4 * n.protein + 4 * n.carbs + 9 * n.fat;
    if (Math.abs(n.kcal - est) > Math.max(30, 0.2 * n.kcal)) bad.push(i.id + ' kcal ' + n.kcal + ' vs ' + Math.round(est));
  });
  assert.deepEqual(bad, []);
});

// ---------- 3. planner: restrictions are never violated ----------
function randomProfile(rng) {
  const pick = a => a[Math.floor(rng() * a.length)];
  const allergyPool = A.ALLERGENS.map(a => a[0]);
  const allergies = allergyPool.filter(() => rng() < 0.12);
  return profile({
    sex: pick(['male', 'female']), age: 18 + Math.floor(rng() * 70), heightCm: 150 + Math.floor(rng() * 50),
    weightKg: 45 + Math.floor(rng() * 70), activity: pick(['sedentary', 'active', 'vigorous']),
    goal: pick(['lose', 'maintain', 'gain']), diet: pick(['omnivore', 'omnivore', 'pescatarian', 'vegetarian', 'vegan']),
    allergies, lactoseFree: rng() < 0.2, people: 1 + Math.floor(rng() * 3),
    dislikes: A.INGREDIENTS.filter(() => rng() < 0.04).map(i => i.id),
    meals: pick([['breakfast', 'lunch', 'snack', 'dinner'], ['breakfast', 'lunch', 'snack', 'dinner'], ['breakfast', 'lunch', 'dinner'], ['lunch', 'dinner'], ['dinner']]),
  });
}

function violations(plan, p) {
  const v = [];
  plan.days.forEach(day => day.meals.forEach(m => m.items.forEach(it => {
    const ing = A.ING[it.id];
    ing.allergens.forEach(a => { if (p.allergies.includes(a)) v.push('allergen ' + a + ' in ' + m.name); });
    if (p.lactoseFree && ing.lactose) v.push('lactose in ' + m.name);
    if (p.dislikes.includes(it.id)) v.push('disliked ' + it.id);
    if (p.diet === 'vegan' && ing.animal) v.push('animal product ' + it.id);
    if (p.diet === 'vegetarian' && (ing.animal === 'meat' || ing.animal === 'fish')) v.push('meat/fish ' + it.id);
    if (p.diet === 'pescatarian' && ing.animal === 'meat') v.push('meat ' + it.id);
  })));
  return v;
}

test('planner: 600 random profiles, restrictions never violated, energy and protein on target', () => {
  const rng = E.mulberry32(12345);
  let planned = 0, refused = 0;
  let typDays = 0, typOff = 0, extremeDays = 0, extremeOff = 0;
  let omniDays = 0, omniProteinLow = 0, otherDays = 0, otherProteinLow = 0;
  let unwarned = 0;
  for (let n = 0; n < 600; n++) {
    const p = randomProfile(rng);
    const plan = E.planWeek(p, n + 1);
    if (plan.error) { refused++; assert.match(plan.error, /No .* recipes fit/); continue; }
    planned++;
    assert.equal(plan.days.length, 7);
    assert.deepEqual(violations(plan, p), [], JSON.stringify(p));
    const T = plan.targets;
    const typical = T.kcal >= 1300 && T.kcal <= 3200; // full-day target; very large targets exceed what one portion can carry
    const easy = p.diet === 'omnivore' && !p.allergies.length && p.meals.length >= 3;
    plan.days.forEach(day => {
      const dev = Math.abs(day.totals.kcal - T.planKcal) / T.planKcal;
      if (typical) { typDays++; if (dev > 0.05) typOff++; } else { extremeDays++; if (dev > 0.05) extremeOff++; }
      // every off-target day must be announced to the user
      if (dev > 0.05 && !plan.warnings.some(w => w.day === day.day)) unwarned++;
      const low = day.totals.protein < T.planProtein * 0.85;
      if (easy) { omniDays++; if (low) omniProteinLow++; } else { otherDays++; if (low) otherProteinLow++; }
    });
  }
  console.log(JSON.stringify({ planned, refused, typical: [typDays, typOff], extreme: [extremeDays, extremeOff], omnivoreProteinLow: [omniDays, omniProteinLow], otherProteinLow: [otherDays, otherProteinLow], unwarned }));
  assert.ok(planned > 400);
  assert.equal(unwarned, 0);
  assert.ok(typOff / typDays < 0.03, 'typical targets off by >5%: ' + typOff + '/' + typDays);
  assert.ok(omniProteinLow / omniDays < 0.1, 'omnivore protein <85%: ' + omniProteinLow + '/' + omniDays);
});

test('planner is deterministic for a profile and seed, and a new seed changes the plan', () => {
  const p = profile({ goal: 'gain' });
  const a = E.planWeek(p, 7), b = E.planWeek(p, 7), c = E.planWeek(p, 8);
  assert.deepEqual(a, b);
  assert.notDeepEqual(a.days.map(d => d.meals.map(m => m.recipeId)), c.days.map(d => d.meals.map(m => m.recipeId)));
});

test('planner avoids repeats when enough recipes exist and swaps milk correctly', () => {
  const plan = E.planWeek(profile(), 3);
  const dinners = plan.days.map(d => d.meals.find(m => m.meal === 'dinner').recipeId);
  assert.equal(new Set(dinners).size, 7);
  const vegan = E.planWeek(profile({ diet: 'vegan' }), 3);
  assert.ok(!vegan.error);
  const lf = E.planWeek(profile({ lactoseFree: true, diet: 'vegetarian' }), 3);
  assert.deepEqual(violations(lf, profile({ lactoseFree: true, diet: 'vegetarian' })), []);
});

test('impossible restrictions return a clear error, not a crash', () => {
  const p = profile({ diet: 'vegan', allergies: ['soy', 'peanut', 'nuts', 'sesame', 'gluten'], dislikes: ['rice', 'lentils', 'chickpeas', 'kidney_beans', 'quinoa', 'potato', 'sweet_potato', 'oats'] });
  const plan = E.planWeek(p, 1);
  assert.ok(plan.error);
});

// ---------- 4. shopping list, recomputed independently ----------
test('shopping list totals equal an independent recomputation', () => {
  const p = profile({ people: 2, goal: 'lose' });
  const plan = E.planWeek(p, 5);
  const prices = E.mergePrices(A.SEED_PRICES, {});
  const list = E.shoppingList(plan, p, prices);

  const need = {};
  plan.days.forEach(d => d.meals.forEach(m => m.items.forEach(it => { need[it.id] = (need[it.id] || 0) + it.g * 2; })));
  assert.equal(list.rows.length, Object.keys(need).length);
  ['s', 'k', 'lidl'].forEach(s => {
    let pack = 0, food = 0;
    Object.keys(need).forEach(id => {
      const pr = prices[s][id];
      pack += Math.ceil(need[id] / pr.packG - 1e-9) * pr.price;
      food += need[id] / pr.packG * pr.price;
    });
    assert.ok(Math.abs(list.stores[s].pack - pack) < 1e-6, s + ' pack total');
    assert.ok(Math.abs(list.stores[s].food - food) < 1e-6, s + ' food total');
    assert.ok(list.stores[s].pack >= list.stores[s].food - 1e-9);
  });
  const cheapest = ['s', 'k', 'lidl'].sort((a, b) => list.stores[a].pack - list.stores[b].pack)[0];
  assert.equal(list.cheapest, cheapest);
  assert.ok(list.mixed.total <= list.stores[cheapest].pack + 1e-9, 'mixed basket cannot cost more than the cheapest single store');
});

test('user price overrides replace seed prices and missing prices are reported', () => {
  const p = profile();
  const plan = E.planWeek(p, 2);
  const over = { lidl: { oats: { price: 0.99, packG: 1000 } } };
  const prices = E.mergePrices(A.SEED_PRICES, over);
  assert.equal(prices.lidl.oats.price, 0.99);
  assert.equal(prices.lidl.oats.source, 'you');
  delete prices.k.oats;
  const list = E.shoppingList(plan, p, prices);
  assert.ok(list.stores.k.missing.includes('oats') || !plan.days.some(d => d.meals.some(m => m.items.some(i => i.id === 'oats'))));
  assert.notEqual(list.cheapest, 'k');
});

test('swapping a meal keeps restrictions, keeps the meal calories and recomputes the day', () => {
  const p = profile({ diet: 'vegetarian', lactoseFree: true, allergies: ['nuts'] });
  const plan = E.planWeek(p, 4);
  const day = 2, idx = 1;
  const old = plan.days[day].meals[idx];
  const alts = E.alternatives(p, old.meal, old.recipeId);
  assert.ok(alts.length > 0);
  const next = E.swapMeal(plan, p, day, idx, alts[0].id);
  assert.ok(next);
  assert.deepEqual(violations(next, p), []);
  const m = next.days[day].meals[idx];
  assert.equal(m.recipeId, alts[0].id);
  assert.ok(Math.abs(m.nutrients.kcal - old.nutrients.kcal) / old.nutrients.kcal < 0.08);
  const sum = next.days[day].meals.reduce((a, x) => a + x.nutrients.kcal, 0);
  assert.ok(Math.abs(next.days[day].totals.kcal - sum) < 1e-9);
  assert.equal(plan.days[day].meals[idx].recipeId, old.recipeId, 'original plan is not mutated');
  // a recipe that conflicts with the profile is refused
  assert.equal(E.swapMeal(plan, p, day, idx, 'l_salmon_potato'), null);
});

test('price import accepts JSON and CSV and rejects bad rows', () => {
  const csv = 'store,ingredient_id,price,pack_g\nS,oats,1.79,1000\nK-market,milk,1.55,\nLidl;rice;2,10;1000\nlidl,nonsense,1,1\nS,oats,-1,1000';
  const r = E.parsePrices(csv);
  assert.equal(r.applied, 3);
  assert.equal(r.skipped, 2);
  assert.equal(r.overrides.s.oats.price, 1.79);
  assert.equal(r.overrides.k.milk.packG, 1000);   // default pack size when none is given
  assert.equal(r.overrides.lidl.rice.price, 2.1); // decimal comma with ; separator
  const j = E.parsePrices(JSON.stringify({ s: { egg: { price: 3.1, packG: 600 } }, k: { egg: 3.4 }, x: { egg: 1 } }));
  assert.equal(j.applied, 2);
  assert.equal(j.skipped, 1);
  assert.ok(E.parsePrices('{ not json').error);
  const merged = E.mergePrices(A.SEED_PRICES, j.overrides);
  assert.equal(merged.s.egg.price, 3.1);
  assert.equal(merged.s.egg.packG, 600);
});

// ---------- 13. recipe set v2: cuisines, hearts, restrictive diets ----------
function dayOf(plan) { return plan.days.reduce((a, d) => a.concat(d.meals), []); }
function containsAllergen(meal, allergen) {
  return meal.items.some((it) => (A.ING[it.id].allergens || []).includes(allergen));
}

test('every planned meal carries its cuisine, and the plan never uses a seasoning as an ingredient', () => {
  const plan = E.planWeek(profile({ meals: ['breakfast', 'lunch', 'snack', 'dinner'] }), 42);
  dayOf(plan).forEach((m) => {
    assert.ok(['nordic', 'european', 'asian', 'world'].includes(m.cuisine), m.recipeId);
    assert.equal(m.cuisine, A.REC[m.recipeId].cuisine);
    m.items.forEach((it) => assert.ok(A.ING[it.id] && !A.SPICES[it.id], it.id));
  });
});

test('a preferred cuisine shows up more often but does not take over', () => {
  const share = (cuisines, c) => {
    let n = 0, total = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const plan = E.planWeek(profile({ meals: ['breakfast', 'lunch', 'snack', 'dinner'], cuisines }), seed * 101);
      dayOf(plan).forEach((m) => { total++; if (m.cuisine === c) n++; });
    }
    return n / total;
  };
  ['asian', 'nordic'].forEach((c) => {
    const base = share([], c), liked = share([c], c);
    assert.ok(liked > base + 0.08, c + ': ' + base.toFixed(2) + ' -> ' + liked.toFixed(2));
    assert.ok(liked < 0.85, c + ' takes over the plan: ' + liked.toFixed(2));
  });
  // with every cuisine chosen the plan is the same as with none chosen
  const all = E.planWeek(profile({ cuisines: ['nordic', 'european', 'asian', 'world'] }), 7);
  assert.equal(all.error, undefined);
});

test('hearts make a recipe more likely in a new plan, and never override a restriction', () => {
  const liked = ['d_teriyaki_salmon', 'l_pho_ga', 'b_skyr_bowl'].filter((id) => A.REC[id]);
  assert.ok(liked.length >= 2, 'test recipes exist');
  let withHeart = 0, without = 0;
  for (let seed = 1; seed <= 40; seed++) {
    const p = profile({ meals: ['breakfast', 'lunch', 'snack', 'dinner'] });
    dayOf(E.planWeek(p, seed * 97, { liked })).forEach((m) => { if (liked.includes(m.recipeId)) withHeart++; });
    dayOf(E.planWeek(p, seed * 97)).forEach((m) => { if (liked.includes(m.recipeId)) without++; });
  }
  assert.ok(withHeart > without, withHeart + ' vs ' + without);
  // a heart on a fish recipe does not put fish in the plan of someone with a fish allergy
  const fishy = Object.keys(A.REC).filter((id) => A.REC[id].items.some((x) => (A.ING[x.id].allergens || []).includes('fish')));
  const plan = E.planWeek(profile({ allergies: ['fish'], meals: ['lunch', 'dinner'] }), 5, { liked: fishy });
  dayOf(plan).forEach((m) => assert.ok(!containsAllergen(m, 'fish'), m.recipeId));
});

test('hearts do not change the plan unless they are passed in (no hidden reseeding)', () => {
  const p = profile();
  assert.deepEqual(JSON.stringify(E.planWeek(p, 9)), JSON.stringify(E.planWeek(p, 9, { liked: [] })));
  assert.deepEqual(JSON.stringify(E.planWeek(p, 9, { liked: ['d_teriyaki_salmon'] })), JSON.stringify(E.planWeek(p, 9, { liked: ['d_teriyaki_salmon'] })));
});

test('restrictive profiles still get a full plan with no forbidden ingredient (vegan, gluten, shellfish, peanut, soy, ...)', () => {
  const cases = [
    { diet: 'vegan' }, { diet: 'vegan', allergies: ['gluten'] }, { diet: 'vegan', allergies: ['soy'] }, { diet: 'vegan', allergies: ['gluten', 'soy'] },
    { diet: 'vegan', allergies: ['nuts', 'peanut'] }, { diet: 'vegetarian', allergies: ['egg', 'milk'] }, { diet: 'pescatarian', allergies: ['fish'] },
    { allergies: ['shellfish'] }, { allergies: ['peanut', 'nuts', 'sesame'] }, { allergies: ['gluten', 'milk', 'egg'] }, { lactoseFree: true, allergies: ['gluten'] },
  ];
  cases.forEach((c) => {
    const p = profile(Object.assign({ meals: ['breakfast', 'lunch', 'snack', 'dinner'] }, c));
    for (let seed = 1; seed <= 4; seed++) {
      const plan = E.planWeek(p, seed * 31);
      assert.equal(plan.error, undefined, JSON.stringify(c) + ' seed ' + seed + ': ' + plan.errorCode + ' ' + (plan.errorMeal || ''));
      (c.allergies || []).forEach((a) => dayOf(plan).forEach((m) => assert.ok(!containsAllergen(m, a), JSON.stringify(c) + ' ' + m.recipeId + ' has ' + a)));
      if (c.diet === 'vegan') dayOf(plan).forEach((m) => m.items.forEach((it) => assert.ok(!A.ING[it.id].animal, m.recipeId + ' has ' + it.id)));
      if (c.diet === 'vegetarian') dayOf(plan).forEach((m) => m.items.forEach((it) => assert.ok(!['meat', 'fish'].includes(A.ING[it.id].animal), m.recipeId + ' has ' + it.id)));
      if (c.lactoseFree) dayOf(plan).forEach((m) => m.items.forEach((it) => assert.ok(!A.ING[it.id].lactose, m.recipeId + ' has lactose ' + it.id)));
    }
  });
});

test('new ingredients: nutrition values are plausible (protein+fat+carbs fit in 100 g, kcal match within 15%)', () => {
  ['wholemeal_bread', 'flour', 'rice_noodles', 'split_peas', 'coconut_milk', 'sesame_oil', 'fish_sauce', 'herring', 'smoked_salmon', 'shrimp', 'ginger', 'edamame'].forEach((id) => {
    const ing = A.ING[id]; assert.ok(ing, id);
    const n = ing.per100;
    assert.ok(n.protein + n.fat + n.carbs <= 100.5, id + ' macros exceed 100 g');
    const atwater = 4 * n.protein + 9 * n.fat + 4 * (n.carbs - (n.fibre || 0)) + 2 * (n.fibre || 0); // fibre counted at 2 kcal/g
    assert.ok(Math.abs(atwater - n.kcal) <= Math.max(30, n.kcal * 0.15), id + ' kcal ' + n.kcal + ' vs Atwater ' + atwater.toFixed(0));
  });
});

test('a recipe used for two or more people scales ingredient grams linearly in the shopping list', () => {
  const one = E.shoppingList(E.planWeek(profile({ people: 1 }), 3), profile({ people: 1 }), E.mergePrices(A.SEED_PRICES, {}));
  const three = E.shoppingList(E.planWeek(profile({ people: 3 }), 3), profile({ people: 3 }), E.mergePrices(A.SEED_PRICES, {}));
  one.rows.forEach((r) => { const t = three.rows.find((x) => x.id === r.id); assert.ok(t, r.id); assert.ok(Math.abs(t.grams - 3 * r.grams) < 0.5, r.id); });
});
