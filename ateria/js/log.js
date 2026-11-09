/*
 * Ateria food log: the maths behind the Log screen. No DOM and no storage here (js/store.js keeps the entries).
 *
 * An entry says what was eaten and carries its own nutrition, worked out when it was added, so a day's total
 * does not change later if a recipe or the ingredient table is edited:
 *   { m: meal slot, t: 'plan' | 'food' | 'quick', k: kcal, p: protein g, f: fat g, c: carbs g, fi: fibre g,
 *     ref: recipe id (plan) or ingredient id (food), x: portion (plan), g: grams (food), name: text (quick) }
 * An entry of type 'plan' is a recipe of Ateria: a meal of the plan, or an idea from L.suggest.
 *
 * L.suggest proposes recipes for the rest of the day from what is already logged: the energy and protein that are
 * left, and the meals that have no entry yet.
 *
 * Nutrition values come from data/ingredients.js and are approximate. Not medical or dietetic advice.
 * Needs js/engine.js (A.engine.nutrientsOf, A.CONFIG.MEAL_SHARE) and the data files.
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

  // ---------- ideas for the rest of the day ----------
  L.MIN_LEFT = 100;               // below this many kcal left, no idea is given
  L.IDEA_PORTION = [0.5, 2, 0.25]; // smallest portion, largest portion, step (of the recipe's base portion)
  const FIT = [0.7, 1.25];        // an idea must supply between 70 % and 125 % of the energy meant for its meal

  // o.pools    { meal: [recipe adapted to the person by A.engine.adaptRecipe, ...] }
  // o.targets  { kcal, protein } of the day
  // o.entries  what is logged for the day
  // o.slots    the meals the person eats (default: all four)
  // o.perSlot  ideas per meal (default 2); o.round  0, 1, 2 ... gives other ideas for the same day
  // Returns { left, proteinLeft, more, ideas: [{ m, id, x, min, entry }] }; `entry` is ready for the log, `more` says that
  // another round would show different ideas.
  // The energy left is shared between the meals that have no entry yet, in the proportions of A.CONFIG.MEAL_SHARE. For each
  // meal the recipe is scaled to its share, recipes of the day's log are left out, and the recipes are ranked by how
  // little protein they lack for the protein that is still needed (then by how close they are to the energy of the meal).
  L.suggest = function (o) {
    const entries = o.entries || [];
    const tot = L.totals(entries);
    const res = { left: L.left(tot, o.targets.kcal), proteinLeft: Math.round(o.targets.protein - tot.protein), more: false, ideas: [] };
    if (res.left < L.MIN_LEFT) return res;
    const eaten = {}, used = {};
    entries.forEach(function (e) { eaten[e.m] = true; if (e.t === 'plan') used[e.ref] = true; });
    let open = (o.slots || SLOTS).filter(function (s) { return SLOTS.indexOf(s) >= 0 && !eaten[s]; });
    if (!open.length) open = ['snack']; // every meal has an entry, but there is still energy left
    const share = A.CONFIG.MEAL_SHARE;
    const sum = open.reduce(function (a, s) { return a + share[s]; }, 0);
    const per = o.perSlot || 2, round = o.round || 0;
    const need = res.proteinLeft > 0 ? res.proteinLeft / res.left : 0; // grams of protein per kcal still to come
    open.forEach(function (slot) {
      const slotKcal = res.left * share[slot] / sum;
      const ranked = ((o.pools && o.pools[slot]) || []).filter(function (c) { return !used[c.id]; }).map(function (c) {
        const step = L.IDEA_PORTION[2];
        const x = Math.round(Math.min(L.IDEA_PORTION[1], Math.max(L.IDEA_PORTION[0], slotKcal / c.base.kcal)) / step) * step;
        const e = L.fromMeal({ meal: slot, recipeId: c.id, nutrients: c.base }, x);
        return e && { id: c.id, x: x, min: c.minutes, entry: e, lack: Math.round(Math.max(0, need * e.k - e.p) * 10) / 10, off: Math.abs(e.k - slotKcal) };
      }).filter(function (it) {
        return it && it.entry.k <= res.left && it.entry.k >= slotKcal * FIT[0] && it.entry.k <= slotKcal * FIT[1];
      }).sort(function (a, b) { return a.lack - b.lack || a.off - b.off || (a.id < b.id ? -1 : 1); });
      if (ranked.length > per) res.more = true;
      for (let i = 0; i < Math.min(per, ranked.length); i++) {
        const it = ranked[(round * per + i) % ranked.length];
        res.ideas.push({ m: slot, id: it.id, x: it.x, min: it.min, entry: it.entry });
      }
    });
    return res;
  };

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
