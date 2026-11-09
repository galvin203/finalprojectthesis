/*
 * Ateria engine: targets, recipe adaptation, 7-day planner, shopping list.
 * Pure functions, no DOM, no network. Every number is calculated here, from the data tables.
 *
 * Assumptions (all adjustable in CONFIG, and shown to the user in the app):
 *  - Resting energy: Mifflin-St Jeor (developed for adults; the app accepts ages 18-99).
 *  - Activity: FAO/WHO/UNU 2004 physical activity levels 1.53 / 1.76 / 2.25.
 *  - Goal adjustment: -15 % (lose), 0 (maintain), +10 % (gain weight or build muscle); never below the resting energy.
 *    -15 % lies between the 10 % and 20 % deficits that gave weight loss in Wozniak et al. 2024 (Food Sci Nutr 12(11), 8920-8929);
 *    +10 % is the lower end of the 10-20 % surplus for novice and intermediate bodybuilders in Iraki et al. 2019 (Sports 7(7), 154).
 *  - Protein 1.6 g/kg (lose, gain), 1.8 g/kg (build muscle) or 0.83 g/kg (maintain); fat 30 % of energy; fibre 14 g per 1000 kcal.
 *    0.83 g/kg is the EFSA 2012 population reference intake for adults. 1.6 and 1.8 g/kg sit inside the 1.4-2.0 g/kg range
 *    that the ISSN position stand on protein and exercise (Jager et al. 2017) gives for people who train.
 * These are generic defaults for an informational tool, not medical or dietetic advice.
 */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});

  const CONFIG = {
    PAL: { sedentary: 1.53, active: 1.76, vigorous: 2.25 },
    GOAL_ADJ: { lose: -0.15, maintain: 0, gain: 0.1, muscle: 0.1 },
    PROTEIN_G_PER_KG: { lose: 1.6, maintain: 0.83, gain: 1.6, muscle: 1.8 },
    FAT_SHARE: 0.3,
    FIBRE_PER_1000_KCAL: 14,
    MEAL_SHARE: { breakfast: 0.25, lunch: 0.3, snack: 0.1, dinner: 0.35 },
    FACTOR_MIN: 0.5,
    FACTOR_MAX: 2.2,
    TOP_CANDIDATES: 4,
    MAIN_INGREDIENTS: ['chicken', 'beef_mince', 'salmon', 'cod', 'tuna', 'egg', 'tofu', 'lentils', 'chickpeas', 'cottage', 'skyr'],
    SAME_MAIN_PENALTY: 2,
    CUISINE_BONUS: 4,   // score bonus for a recipe from a cuisine the user prefers (a soft preference, not a filter)
    CUISINE_TARGET: 0.65, // the bonus is switched off while preferred cuisines already make up this share of the plan, so other food still mixes in
    LIKED_BONUS: 2.5,   // score bonus for a recipe the user marked with a heart
    DAYS: 7,
  };
  A.CONFIG = CONFIG;

  // ---------- helpers ----------
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashSeed(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function clamp(x, lo, hi) { return Math.min(hi, Math.max(lo, x)); }
  function roundGrams(x) { return x < 10 ? Math.max(1, Math.round(x)) : Math.round(x / 5) * 5; }
  function r1(x) { return Math.round(x * 10) / 10; }

  // ---------- profile ----------
  function validateProfile(p) {
    // Each problem is { code, text }: `code` lets the UI show it in the user's language, `text` is English.
    const e = [];
    function add(code, text) { e.push({ code: code, text: text }); }
    if (!p) return [{ code: 'missing', text: 'Missing profile' }];
    if (p.sex !== 'male' && p.sex !== 'female') add('sex', 'Choose a sex used for the energy formula.');
    if (!(p.age >= 18 && p.age <= 99)) add('age', 'Age must be between 18 and 99 (the formulas are for adults).');
    if (!(p.heightCm >= 120 && p.heightCm <= 230)) add('height', 'Height must be between 120 and 230 cm.');
    if (!(p.weightKg >= 35 && p.weightKg <= 250)) add('weight', 'Weight must be between 35 and 250 kg.');
    if (!CONFIG.PAL[p.activity]) add('activity', 'Choose an activity level.');
    if (!(p.goal in CONFIG.GOAL_ADJ)) add('goal', 'Choose a goal.');
    if (!p.meals || !p.meals.length) add('meals', 'Select at least one meal to plan.');
    if (!(p.people >= 1 && p.people <= 8)) add('people', 'People must be between 1 and 8.');
    return e;
  }

  function computeTargets(p) {
    const bmr = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + (p.sex === 'male' ? 5 : -161);
    const tdee = bmr * CONFIG.PAL[p.activity];
    const adj = CONFIG.GOAL_ADJ[p.goal];
    const kcal = Math.round(Math.max(tdee * (1 + adj), bmr));
    const protein = Math.round(p.weightKg * CONFIG.PROTEIN_G_PER_KG[p.goal]);
    const fat = Math.round((kcal * CONFIG.FAT_SHARE) / 9);
    const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
    const fibre = Math.round((kcal / 1000) * CONFIG.FIBRE_PER_1000_KCAL);
    return {
      bmr: Math.round(bmr), tdee: Math.round(tdee), pal: CONFIG.PAL[p.activity], adjustment: adj,
      floored: tdee * (1 + adj) < bmr, kcal, protein, fat, carbs, fibre,
    };
  }

  // ---------- nutrients ----------
  function nutrientsOf(items) {
    const t = { kcal: 0, protein: 0, fat: 0, carbs: 0, fibre: 0 };
    items.forEach(function (it) {
      const n = A.ING[it.id].per100;
      const k = it.g / 100;
      t.kcal += n.kcal * k; t.protein += n.protein * k; t.fat += n.fat * k; t.carbs += n.carbs * k; t.fibre += n.fibre * k;
    });
    return t;
  }

  // ---------- restrictions ----------
  function allowed(ing, p) {
    if (p.allergies && ing.allergens.some(function (a) { return p.allergies.indexOf(a) >= 0; })) return false;
    if (p.lactoseFree && ing.lactose) return false;
    if (p.dislikes && p.dislikes.indexOf(ing.id) >= 0) return false;
    const d = p.diet || 'omnivore';
    if (d === 'pescatarian' && ing.animal === 'meat') return false;
    if (d === 'vegetarian' && (ing.animal === 'meat' || ing.animal === 'fish')) return false;
    if (d === 'vegan' && ing.animal) return false;
    return true;
  }

  // Returns a recipe adapted to the profile (with swaps), or null if it cannot be made to fit.
  function adaptRecipe(recipe, p) {
    const items = [];
    for (let i = 0; i < recipe.items.length; i++) {
      const it = recipe.items[i];
      const ing = A.ING[it.id];
      if (allowed(ing, p)) { items.push({ id: it.id, g: it.g }); continue; }
      let swapped = null;
      for (let s = 0; s < ing.swaps.length; s++) {
        const cand = A.ING[ing.swaps[s]];
        if (allowed(cand, p)) { swapped = cand; break; }
      }
      if (!swapped) return null;
      items.push({ id: swapped.id, g: it.g, swappedFrom: it.id });
    }
    return { id: recipe.id, name: recipe.name, meal: recipe.meal, cuisine: recipe.cuisine, minutes: recipe.minutes, steps: recipe.steps, items: items, base: nutrientsOf(items) };
  }

  // ---------- planner ----------
  function scaleItems(items, factor) {
    return items.map(function (it) {
      const o = { id: it.id, g: roundGrams(it.g * factor) };
      if (it.swappedFrom) o.swappedFrom = it.swappedFrom;
      return o;
    });
  }

  function mealShares(meals) {
    // Shares are NOT renormalised: a meal that is not planned is assumed to be eaten elsewhere.
    const out = {};
    meals.forEach(function (m) { out[m] = CONFIG.MEAL_SHARE[m]; });
    return out;
  }

  // opts.liked: recipe ids the user marked with a heart (a small score bonus). Everything else comes from the profile.
  function planWeek(p, seed, opts) {
    const errors = validateProfile(p);
    if (errors.length) return { error: errors.map(function (x) { return x.text; }).join(' '), errorCode: 'invalid', errors: errors };
    const t = computeTargets(p);
    const order = ['breakfast', 'lunch', 'snack', 'dinner'];
    let meals = order.filter(function (m) { return p.meals.indexOf(m) >= 0; });
    const pools = {};
    const notes = [];
    for (let i = 0; i < meals.length; i++) {
      const m = meals[i];
      pools[m] = A.RECIPES.filter(function (r) { return r.meal === m; })
        .map(function (r) { return adaptRecipe(r, p); })
        .filter(Boolean);
    }
    // snacks are optional: if none fits the restrictions, leave them out instead of failing
    if (pools.snack && !pools.snack.length && meals.length > 1) {
      meals = meals.filter(function (m) { return m !== 'snack'; });
      notes.push({ code: 'noSnack', text: 'No snack recipe fits your restrictions, so snacks were left out.' });
    }
    for (let i = 0; i < meals.length; i++) {
      if (!pools[meals[i]].length) return { error: 'No ' + meals[i] + ' recipes fit your diet, allergies and dislikes. Try removing a restriction.', errorCode: 'noRecipes', errorMeal: meals[i] };
    }
    const share = mealShares(meals);
    const shareSum = meals.reduce(function (a, m) { return a + share[m]; }, 0);
    t.planKcal = Math.round(t.kcal * shareSum);
    t.planProtein = Math.round(t.protein * shareSum);
    t.planShare = shareSum;
    const rng = mulberry32(seed == null ? hashSeed(JSON.stringify(p)) : seed);
    const usage = {};
    const prev = {};
    const favs = p.favorites || [];
    const liked = (opts && opts.liked) || [];
    const cuisines = p.cuisines && p.cuisines.length ? p.cuisines : null;
    let prefN = 0, allN = 0; // meals chosen so far, and how many of them are from a preferred cuisine
    const days = [];

    // scale the portions of one day's meals so that the day lands on the planned calories
    function scaleDay(chosen) {
      let f = chosen.map(function (c) { return clamp((share[c.meal] * t.kcal) / c.r.base.kcal, CONFIG.FACTOR_MIN, CONFIG.FACTOR_MAX); });
      let dayK = 0;
      for (let iter = 0; iter < 8; iter++) {
        dayK = 0;
        for (let i = 0; i < f.length; i++) dayK += f[i] * chosen[i].r.base.kcal;
        const mult = t.planKcal / dayK;
        if (Math.abs(mult - 1) < 0.002) break;
        f = f.map(function (x) { return clamp(x * mult, CONFIG.FACTOR_MIN, CONFIG.FACTOR_MAX); });
      }
      dayK = 0;
      let dayP = 0;
      for (let i = 0; i < f.length; i++) { dayK += f[i] * chosen[i].r.base.kcal; dayP += f[i] * chosen[i].r.base.protein; }
      return { f: f, kcal: dayK, protein: dayP };
    }

    for (let d = 0; d < CONFIG.DAYS; d++) {
      // 1. the best few candidates for each meal slot (novelty, fit, favourites, small random jitter)
      const cand = {};
      meals.forEach(function (m) {
        const scored = pools[m].map(function (r) {
          const f = (share[m] * t.kcal) / r.base.kcal;
          let s = 0;
          if (f < 0.6) s += (0.6 - f) * 6; else if (f > 1.8) s += (f - 1.8) * 6;
          const wantP = share[m] * t.protein * 0.95;
          s += Math.max(0, (wantP - r.base.protein * f) / wantP) * 2.5;
          s += (usage[r.id] || 0) * 3;
          if (prev[m] === r.id) s += 5;
          let fav = 0;
          r.items.forEach(function (it) { if (favs.indexOf(it.id) >= 0) fav++; });
          s -= Math.min(fav, 3) * 0.4;
          if (cuisines && cuisines.indexOf(r.cuisine) >= 0 && (allN === 0 || prefN / allN < CONFIG.CUISINE_TARGET)) s -= CONFIG.CUISINE_BONUS;
          if (liked.indexOf(r.id) >= 0) s -= CONFIG.LIKED_BONUS;
          s += rng() * 0.8;
          return { r: r, s: s };
        }).sort(function (a, b) { return a.s - b.s; });
        cand[m] = scored.slice(0, CONFIG.TOP_CANDIDATES);
      });

      // 2. choose the combination for the day that best meets calories and protein
      let best = null;
      const pick = [];
      (function walk(i, acc) {
        if (i === meals.length) {
          const sc = scaleDay(pick);
          const kcalDev = Math.abs(sc.kcal - t.planKcal) / t.planKcal;
          const wantP = t.planProtein * 0.95;
          // the same main ingredient (e.g. salmon) twice in one day is avoided
          const count = {};
          let dup = 0;
          pick.forEach(function (c) {
            const inThisMeal = {};
            c.r.items.forEach(function (it) {
              if (CONFIG.MAIN_INGREDIENTS.indexOf(it.id) >= 0) inThisMeal[it.id] = true;
            });
            Object.keys(inThisMeal).forEach(function (id) {
              if (count[id]) dup += CONFIG.SAME_MAIN_PENALTY;
              count[id] = (count[id] || 0) + 1;
            });
          });
          const total = acc + dup + kcalDev * 20 + Math.max(0, (wantP - sc.protein) / wantP) * 6;
          if (!best || total < best.total) best = { total: total, chosen: pick.slice() };
          return;
        }
        const m = meals[i];
        for (let k = 0; k < cand[m].length; k++) {
          pick[i] = { meal: m, r: cand[m][k].r };
          walk(i + 1, acc + cand[m][k].s);
        }
      })(0, 0);

      const chosen = best.chosen;
      chosen.forEach(function (c) {
        usage[c.r.id] = (usage[c.r.id] || 0) + 1; prev[c.meal] = c.r.id;
        allN++; if (cuisines && cuisines.indexOf(c.r.cuisine) >= 0) prefN++;
      });
      const f = scaleDay(chosen).f;
      const dayMeals = chosen.map(function (c, i) {
        const items = scaleItems(c.r.items, f[i]);
        return { meal: c.meal, recipeId: c.r.id, name: c.r.name, cuisine: c.r.cuisine, minutes: c.r.minutes, steps: c.r.steps, factor: Math.round(f[i] * 100) / 100, items: items, nutrients: nutrientsOf(items) };
      });
      const totals = { kcal: 0, protein: 0, fat: 0, carbs: 0, fibre: 0 };
      dayMeals.forEach(function (m) { Object.keys(totals).forEach(function (k) { totals[k] += m.nutrients[k]; }); });
      days.push({ day: d + 1, meals: dayMeals, totals: totals });
    }

    const warnings = notes.slice();
    days.forEach(function (day) {
      const dev = (day.totals.kcal - t.planKcal) / t.planKcal;
      if (Math.abs(dev) > 0.05) warnings.push({ code: 'energy', day: day.day, pct: Math.round(dev * 100), text: 'Day ' + day.day + ': energy is ' + Math.round(dev * 100) + '% from the target (portion limits reached).' });
      if (day.totals.protein < t.planProtein * 0.85) warnings.push({ code: 'protein', day: day.day, text: 'Day ' + day.day + ': protein is below 85% of the target.' });
    });
    return { targets: t, days: days, meals: meals, warnings: warnings, notes: notes, seed: seed };
  }


  // ---------- swapping one meal ----------
  function recompute(day) {
    const totals = { kcal: 0, protein: 0, fat: 0, carbs: 0, fibre: 0 };
    day.meals.forEach(function (m) { Object.keys(totals).forEach(function (k) { totals[k] += m.nutrients[k]; }); });
    day.totals = totals;
  }

  // Recipes that can replace a meal for this profile (same meal type, restrictions respected).
  function alternatives(p, meal, excludeId) {
    return A.RECIPES.filter(function (r) { return r.meal === meal && r.id !== excludeId; })
      .map(function (r) { return adaptRecipe(r, p); }).filter(Boolean);
  }

  // Replace one meal by another recipe, keeping the calories of the meal that was there.
  // Works on a deep copy; returns the new plan, or null when the recipe does not fit the profile.
  function swapMeal(plan, p, dayIdx, mealIdx, recipeId) {
    const next = JSON.parse(JSON.stringify(plan));
    const day = next.days[dayIdx];
    const old = day.meals[mealIdx];
    const ad = A.REC[recipeId] && adaptRecipe(A.REC[recipeId], p);
    if (!ad || ad.meal !== old.meal) return null;
    const f = clamp(old.nutrients.kcal / ad.base.kcal, CONFIG.FACTOR_MIN, CONFIG.FACTOR_MAX);
    const items = scaleItems(ad.items, f);
    day.meals[mealIdx] = { meal: ad.meal, recipeId: ad.id, name: ad.name, cuisine: ad.cuisine, minutes: ad.minutes, steps: ad.steps, factor: Math.round(f * 100) / 100, items: items, nutrients: nutrientsOf(items), swapped: true };
    recompute(day);
    return next;
  }

  // ---------- shopping list ----------
  // What the planned meals need, ingredient by ingredient: the grams of every meal of the chosen days, for everyone in
  // the profile (`p.people`). `opts.days` lists the day indexes to shop for (default: all days of the plan).
  // Each row keeps the meals that use the ingredient, so the list can show where an amount comes from.
  // No prices: amounts are exactly what the recipes need, they are not rounded up to pack sizes.
  //   returns { rows: [{ id, name, fi, aisle, grams, uses: [{ d, i, meal, recipeId, g }] }], meals, days }
  function shoppingList(plan, p, opts) {
    const people = p.people || 1;
    const chosen = opts && Array.isArray(opts.days) ? opts.days : null;
    const need = {};
    let meals = 0, days = 0;
    plan.days.forEach(function (day, d) {
      if (chosen && chosen.indexOf(d) < 0) return;
      days++;
      day.meals.forEach(function (m, i) {
        meals++;
        m.items.forEach(function (it) {
          const row = need[it.id] || (need[it.id] = { grams: 0, uses: [] });
          const g = it.g * people;
          row.grams += g;
          const same = row.uses.filter(function (u) { return u.d === d && u.i === i; })[0];
          if (same) same.g += g; else row.uses.push({ d: d, i: i, meal: m.meal, recipeId: m.recipeId, g: g });
        });
      });
    });
    const rows = Object.keys(need).map(function (id) {
      const ing = A.ING[id];
      return { id: id, name: ing.name, fi: ing.fi, aisle: ing.aisle, grams: need[id].grams, uses: need[id].uses };
    });
    const order = Object.keys(A.AISLES);
    rows.sort(function (a, b) { return order.indexOf(a.aisle) - order.indexOf(b.aisle) || a.name.localeCompare(b.name); });
    return { rows: rows, meals: meals, days: days };
  }

  A.engine = {
    CONFIG: CONFIG, mulberry32: mulberry32, hashSeed: hashSeed, validateProfile: validateProfile, computeTargets: computeTargets,
    nutrientsOf: nutrientsOf, allowed: allowed, adaptRecipe: adaptRecipe, planWeek: planWeek,
    shoppingList: shoppingList, mealShares: mealShares,
    alternatives: alternatives, swapMeal: swapMeal,
  };
})(typeof window !== 'undefined' ? window : globalThis);
