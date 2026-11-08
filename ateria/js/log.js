/*
 * Ateria food log: the maths behind the Log screen. No DOM and no storage here (js/store.js keeps the entries).
 *
 * An entry says what was eaten and carries its own nutrition, worked out when it was added, so a day's total
 * does not change later if a recipe or the ingredient table is edited:
 *   { m: meal slot, t: 'plan' | 'food' | 'quick', k: kcal, p: protein g, f: fat g, c: carbs g, fi: fibre g,
 *     ref: recipe id (plan) or ingredient id (food), x: portion (plan), g: grams (food), name: text (quick) }
 *
 * Nutrition values come from data/ingredients.js and are approximate. Not medical or dietetic advice.
 * Needs js/engine.js (A.engine.nutrientsOf) and the data files.
 */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});
  const L = (A.log = {});

  const SLOTS = ['breakfast', 'lunch', 'snack', 'dinner'];
  const r1 = function (x) { return Math.round(x * 10) / 10; };
  const slotOf = function (m) { return SLOTS.indexOf(m) >= 0 ? m : 'snack'; };
  const finite = function (x) { x = Number(x); return isFinite(x) ? x : null; };

  L.SLOTS = SLOTS;
  L.PORTIONS = [0.5, 1, 1.5, 2];

  // a meal of the plan, eaten as planned (portion 1), half (0.5), and so on
  L.fromMeal = function (meal, portion) {
    const x = finite(portion);
    if (!meal || !meal.nutrients || !A.REC[meal.recipeId] || x == null || x < 0.25 || x > 4) return null;
    const n = meal.nutrients;
    return { m: slotOf(meal.meal), t: 'plan', ref: meal.recipeId, x: x, k: Math.round(n.kcal * x), p: r1(n.protein * x), f: r1(n.fat * x), c: r1(n.carbs * x), fi: r1(n.fibre * x) };
  };

  // an ingredient from the list, by weight in grams
  L.fromFood = function (id, grams, slot) {
    const gr = finite(grams);
    if (!A.ING[id] || gr == null || gr < 1 || gr > 3000) return null;
    const n = A.engine.nutrientsOf([{ id: id, g: gr }]);
    return { m: slotOf(slot), t: 'food', ref: id, g: Math.round(gr), k: Math.round(n.kcal), p: r1(n.protein), f: r1(n.fat), c: r1(n.carbs), fi: r1(n.fibre) };
  };

  // something that is not on the list (a restaurant meal, a packet): a name and the numbers the person knows
  L.quick = function (name, kcal, protein, slot) {
    const nm = typeof name === 'string' ? name.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 40) : '';
    const k = finite(kcal);
    const p = protein === '' || protein == null ? 0 : finite(protein);
    if (!nm || k == null || k < 0 || k > 5000 || p == null || p < 0 || p > 500) return null;
    return { m: slotOf(slot), t: 'quick', name: nm, k: Math.round(k), p: r1(p), f: 0, c: 0, fi: 0 };
  };

  L.totals = function (entries) {
    const t = { kcal: 0, protein: 0, fat: 0, carbs: 0, fibre: 0 };
    (entries || []).forEach(function (e) { t.kcal += e.k; t.protein += e.p; t.fat += e.f; t.carbs += e.c; t.fibre += e.fi; });
    return { kcal: Math.round(t.kcal), protein: r1(t.protein), fat: r1(t.fat), carbs: r1(t.carbs), fibre: r1(t.fibre) };
  };

  // energy left for the day (negative = over the target), in whole kcal
  L.left = function (totals, targetKcal) { return Math.round(targetKcal - totals.kcal); };

  // 'YYYY-MM-DD' moved by n days (calendar arithmetic in UTC, so clock changes cannot skip or repeat a day)
  L.shiftDate = function (d, n) {
    const t = new Date(d + 'T00:00:00Z');
    t.setUTCDate(t.getUTCDate() + n);
    return t.toISOString().slice(0, 10);
  };

  // the last `days` days ending on `end`: [{ d, kcal, n }], oldest first (n = number of entries that day)
  L.week = function (log, end, days) {
    const out = [];
    for (let i = (days || 7) - 1; i >= 0; i--) {
      const d = L.shiftDate(end, -i);
      const list = (log && log[d]) || [];
      out.push({ d: d, kcal: L.totals(list).kcal, n: list.length });
    }
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);
