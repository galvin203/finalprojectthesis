/*
 * Ateria measures: turns gram amounts into kitchen measures (teaspoons, tablespoons, decilitres, pieces, cloves)
 * and fills the {tokens} of a recipe with the amounts for the chosen portion and number of people.
 *
 * Nothing here changes a calculation: calories, protein and prices always use grams. This module only changes
 * how an amount is DISPLAYED. Densities (g per tbsp / dl) are rounded everyday values from data/ingredients.js.
 *
 * Needs data/ingredients.js, data/spices.js, data/recipes.js and js/i18n.js to be loaded first.
 */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});
  const M = (A.measure = {});

  const EIGHTHS = { 1: '⅛', 2: '¼', 3: '⅜', 4: '½', 5: '⅝', 6: '¾', 7: '⅞' };
  const STEP = { garlic: 0.5, cucumber: 0.25 }; // rounding step for counted items (default 0.5)
  function clamp(x, lo, hi) { return Math.min(hi, Math.max(lo, x)); }

  // 1.5 -> "1½", 0.25 -> "¼", 3 -> "3". Rounds to the nearest eighth.
  function frac(x) {
    let eighths = Math.round(x * 8);
    const whole = Math.floor(eighths / 8);
    eighths -= whole * 8;
    if (!eighths) return String(whole);
    return (whole ? String(whole) : '') + EIGHTHS[eighths];
  }
  M.frac = frac;

  // ---------- numbers only (no language) ----------
  // How to show `grams` of ingredient `id`: { kind: 'g' | 'pcs' | 'clove' | 'tsp' | 'tbsp' | 'dl', n, g }
  M.pickIngredient = function (id, grams) {
    const ing = A.ING[id];
    if (ing.each && grams >= ing.each * 0.2) {
      const step = STEP[id] || 0.5;
      let n = Math.round(grams / ing.each / step) * step;
      if (n < step) n = step;
      return { kind: ing.unit === 'clove' ? 'clove' : 'pcs', n: n, g: grams };
    }
    if (ing.tbsp && grams <= ing.tbsp * 4.2) {
      const tsp = (grams / ing.tbsp) * 3;
      if (tsp < 0.4) return { kind: 'g', g: grams };
      if (tsp <= 2.6) return { kind: 'tsp', n: Math.max(0.25, Math.round(tsp * 4) / 4), g: grams };
      return { kind: 'tbsp', n: Math.max(1, Math.round((tsp / 3) * 2) / 2), g: grams };
    }
    if (ing.dl && grams >= ing.dl * 0.5) return { kind: 'dl', n: Math.round((grams / ing.dl) * 4) / 4, g: grams };
    return { kind: 'g', g: grams };
  };

  // Amount of a seasoning for one recipe: `base` per base portion, scaled by the portion factor and the number of people.
  // The portion factor is limited (0.7 to 1.5): seasoning does not need to grow in step with a very large portion.
  M.pickSpice = function (id, base, factor, people) {
    const sp = A.SPICES[id];
    const q = base * clamp(factor || 1, 0.7, 1.5) * (people || 1);
    if (sp.unit === 'leaf' || sp.unit === 'pcs') return { kind: sp.unit, n: Math.max(1, Math.round(q)) };
    if (sp.unit === 'lemon') return { kind: 'lemon', n: Math.max(0.125, Math.round(q * 8) / 8) };
    if (q < 0.19) return { kind: 'pinch' };
    if (q >= 2.75) return { kind: 'tbsp', n: Math.max(1, Math.round((q / 3) * 2) / 2) };
    return { kind: 'tsp', n: Math.max(0.25, Math.round(q * 4) / 4) };
  };

  // Water in ml for the chosen portion and number of people, rounded to 50 ml.
  M.pickWater = function (base, factor, people) {
    return Math.max(50, Math.round((base * (factor || 1) * (people || 1)) / 50) * 50);
  };

  // ---------- text (needs the language module) ----------
  function I() { return A.i18n; }
  function plural(n) {
    if (n === 1) return 'one';
    if (n < 1) return I().lang() === 'fi' ? 'other' : 'one';
    return 'other';
  }
  function unit(key, n) { return I().t('unit.' + key + '_' + plural(n), { n: frac(n) }); }

  // Name of a counted item with its number: "2 eggs", "½ onion", "1 clove". Falls back to grams.
  function countText(id, pick) {
    const lang = I().lang();
    const forms = A.I18N.count && A.I18N.count[id] && A.I18N.count[id][lang];
    if (!forms) return I().grams(pick.g);
    return frac(pick.n) + ' ' + forms[plural(pick.n) === 'one' ? 0 : 1];
  }
  // A counted item that is too small to count ("22 g onion"): grams, then the noun, so the sentence still reads well.
  function gramsWithNoun(id, grams) {
    const lang = I().lang();
    const forms = A.I18N.count && A.I18N.count[id] && A.I18N.count[id][lang];
    if (!forms) return I().grams(grams);
    return I().grams(grams) + ' ' + (lang === 'fi' ? forms[1] : forms[0]);
  }

  // mode 'step': the amount as written in a cooking step ("2 dl", "1 tbsp (14 g)", "2 eggs")
  // mode 'table': the amount in the ingredient table ("2 pcs (110 g)", "1 tbsp (14 g)")
  // mode 'shop': the amount in the shopping list (grams; whole items such as eggs are also counted)
  M.ingredientText = function (id, grams, mode) {
    const ing = A.ING[id];
    const p = M.pickIngredient(id, grams);
    const t = I().t;
    const gm = I().grams(grams);
    if (p.kind === 'g') return mode === 'step' && ing.each && ing.unit !== 'clove' ? gramsWithNoun(id, grams) : gm;
    if (p.kind === 'pcs') {
      if (mode === 'step') return countText(id, p);
      const forms = A.I18N.count && A.I18N.count[id] && A.I18N.count[id][I().lang()];
      return forms ? countText(id, p) + ' (' + gm + ')' : t('amt.pcs', { pcs: frac(p.n), g: gm });
    }
    if (p.kind === 'clove') return mode === 'table' || mode === 'shop' ? unit('clove', p.n) + ' (' + gm + ')' : unit('clove', p.n);
    if (mode === 'shop') return gm; // a weekly total reads best in grams, only whole items are counted
    const base = p.kind === 'dl' ? frac(p.n) + ' ' + t('unit.dl') : frac(p.n) + ' ' + t(p.kind === 'tsp' ? 'unit.tsp' : 'unit.tbsp');
    if (mode === 'table' || !ing.liquid) return base + ' (' + gm + ')';
    return base;
  };

  M.spiceText = function (pick, alone) {
    const t = I().t;
    if (pick.kind === 'pinch') return t(alone ? 'unit.pinch1' : 'unit.pinch');
    if (pick.kind === 'tsp') return frac(pick.n) + ' ' + t('unit.tsp');
    if (pick.kind === 'tbsp') return frac(pick.n) + ' ' + t('unit.tbsp');
    if (pick.kind === 'leaf') return unit('leaf', pick.n);
    if (pick.kind === 'pcs') return unit('pcs', pick.n);
    if (pick.kind === 'lemon') return unit('lemon', pick.n);
    return '';
  };

  M.waterText = function (ml) {
    return ml >= 1000 ? I().n(ml / 1000, ml % 1000 === 0 ? 0 : 1) + ' l' : ml + ' ml';
  };

  // Find the planned item for a recipe ingredient (it may have been swapped, e.g. milk -> oat drink).
  function findItem(meal, ingId) {
    for (let i = 0; i < meal.items.length; i++) {
      const it = meal.items[i];
      if (it.id === ingId || it.swappedFrom === ingId) return it;
    }
    return null;
  }

  // Everything the recipe view needs for one planned meal and a number of people.
  //   steps   cooking steps with the amounts filled in
  //   spices  [{ id, when, name, text, kind }] ordered by when
  //   water   ml or 0
  //   swaps   [{ from, to }] ingredients that were replaced to fit the profile
  M.recipeView = function (meal, people) {
    people = people || 1;
    const rec = A.REC[meal.recipeId];
    const loc = I().recipe(meal.recipeId);
    const factor = meal.factor || 1;
    const sp = {};
    rec.spices.forEach(function (s) { sp[s.id] = s; });
    const water = rec.water ? M.pickWater(rec.water, factor, people) : 0;

    function fill(text) {
      return text.replace(/\{(s:)?(\w+)\}/g, function (m, isSpice, key) {
        if (isSpice) return sp[key] ? M.spiceText(M.pickSpice(key, sp[key].q, factor, people)) : '';
        if (key === 'water') return water ? M.waterText(water) : '';
        const it = findItem(meal, key);
        return it ? M.ingredientText(it.id, it.g * people, 'step') : '';
      });
    }

    const order = A.SPICE_WHEN;
    const spices = rec.spices.map(function (s, i) {
      const pick = M.pickSpice(s.id, s.q, factor, people);
      return { id: s.id, when: s.when, order: order.indexOf(s.when) * 100 + i, name: I().spiceName(s.id), text: M.spiceText(pick, true), kind: A.SPICES[s.id].kind };
    }).sort(function (a, b) { return a.order - b.order; });

    const swaps = meal.items.filter(function (it) { return it.swappedFrom; }).map(function (it) { return { from: it.swappedFrom, to: it.id }; });
    return { name: loc.name, tip: loc.tip, steps: loc.steps.map(fill), spices: spices, water: water, swaps: swaps };
  };

  // Seasonings needed for a whole plan: { dried: [{id, uses}], fresh: [...], salt: bool } for the shopping view.
  M.spiceSummary = function (plan) {
    const uses = {};
    plan.days.forEach(function (day) {
      day.meals.forEach(function (m) {
        A.REC[m.recipeId].spices.forEach(function (s) { uses[s.id] = (uses[s.id] || 0) + 1; });
      });
    });
    const out = { dried: [], fresh: [], salt: [] };
    Object.keys(uses).forEach(function (id) {
      const sp = A.SPICES[id];
      (sp.kind === 'fresh' ? out.fresh : sp.kind === 'salt' ? out.salt : out.dried).push({ id: id, uses: uses[id] });
    });
    ['dried', 'fresh', 'salt'].forEach(function (k) { out[k].sort(function (a, b) { return b.uses - a.uses || a.id.localeCompare(b.id); }); });
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);
