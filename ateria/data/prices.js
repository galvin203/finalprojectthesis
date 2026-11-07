/*
 * ILLUSTRATIVE SEED PRICES. THESE ARE NOT REAL STORE PRICES.
 *
 * They are generated from the placeholder base price in data/ingredients.js with a fixed
 * per-store factor and a small deterministic per-item variation, only so that the shopping list
 * and the store comparison have something to calculate with. Replace them with real prices:
 *   - in the app: Prices tab (type a price, or import a CSV / JSON file), or
 *   - with tools/prices_tool.py (CSV import, experimental S-Group fetch).
 */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});
  const FACTOR = { s: 1.0, k: 1.05, lidl: 0.9 };

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) / 4294967295;
  }

  const seed = {};
  A.STORES.forEach(function (st) {
    seed[st.id] = {};
    A.INGREDIENTS.forEach(function (ing) {
      const jitter = 0.94 + hash(st.id + ':' + ing.id) * 0.12; // 0.94 .. 1.06
      const price = Math.round(ing.price * FACTOR[st.id] * jitter * 100) / 100;
      seed[st.id][ing.id] = { price: price, packG: ing.packG, source: 'seed' };
    });
  });
  A.SEED_PRICES = seed;
})(typeof window !== 'undefined' ? window : globalThis);
