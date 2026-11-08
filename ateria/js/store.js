/*
 * Ateria store: keeps the user's own information (profiles, plan choices, ticked items, hearts, weight log, prices).
 *
 * Rules this module follows:
 *  - Nothing is written to the device until the user says yes. Before that the app works from memory only.
 *    The only thing written without a yes is the decision itself ("no").
 *  - Everything stays in this browser (localStorage). The cloud copy in js/cloud.js is a separate, manual action.
 *  - Data read back (from storage or from an imported file) is never trusted: it is cleaned field by field and
 *    anything unknown is dropped, so a damaged or edited file cannot break the app.
 *  - Storage can be missing or full (private windows, blocked cookies): every access is wrapped, and the app
 *    keeps working from memory and says so.
 *
 * A.makeStore(storageLike) builds a store around any object with getItem / setItem / removeItem (used by the tests).
 * A.store is the one the app uses (window.localStorage). Needs data/ingredients.js and data/recipes.js first.
 */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});

  const PFX = 'ateria.v2.';
  const K_DATA = PFX + 'data';
  const K_CONSENT = PFX + 'consent';
  const K_BAD = PFX + 'data.bad';
  const V1_KEYS = ['profile', 'seedN', 'swaps', 'prices', 'checked', 'lang'];
  const LIMITS = { profiles: 6, swaps: 100, liked: 200, weights: 400, name: 30 };
  const MEALS = ['breakfast', 'lunch', 'snack', 'dinner'];
  const SEXES = ['female', 'male'];
  const ACTIVITIES = ['sedentary', 'active', 'vigorous'];
  const GOALS = ['lose', 'maintain', 'gain', 'muscle'];
  const DIETS = ['omnivore', 'pescatarian', 'vegetarian', 'vegan'];
  const STORE_IDS = ['s', 'k', 'lidl'];

  function num(x, lo, hi, dflt) { x = Number(x); return isFinite(x) && x >= lo && x <= hi ? x : dflt; }
  function int(x, lo, hi, dflt) { x = Math.round(Number(x)); return isFinite(x) && x >= lo && x <= hi ? x : dflt; }
  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }
  function uniqueKnown(list, isKnown, max) {
    const out = [];
    (Array.isArray(list) ? list : []).forEach(function (x) { if (typeof x === 'string' && isKnown(x) && out.indexOf(x) < 0 && out.length < max) out.push(x); });
    return out;
  }
  function validDate(s) {
    if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d = new Date(s + 'T00:00:00Z');
    return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
  }
  function newId(used) {
    for (let i = 1; i < 1000; i++) { const id = 'p' + i; if (used.indexOf(id) < 0) return id; }
    return 'p' + Date.now();
  }

  // ---------- cleaning ----------
  const clean = {};
  clean.profile = function (p) {
    if (!isObj(p)) return null;
    const out = {
      sex: SEXES.indexOf(p.sex) >= 0 ? p.sex : null,
      age: num(p.age, 18, 99, null), heightCm: num(p.heightCm, 120, 230, null), weightKg: num(p.weightKg, 35, 250, null),
      activity: ACTIVITIES.indexOf(p.activity) >= 0 ? p.activity : null,
      goal: GOALS.indexOf(p.goal) >= 0 ? p.goal : null,
      diet: DIETS.indexOf(p.diet) >= 0 ? p.diet : 'omnivore',
      allergies: uniqueKnown(p.allergies, function (a) { return A.ALLERGENS.some(function (x) { return x[0] === a; }); }, 20),
      lactoseFree: p.lactoseFree === true,
      dislikes: uniqueKnown(p.dislikes, function (id) { return !!A.ING[id]; }, 100),
      favorites: uniqueKnown(p.favorites, function (id) { return !!A.ING[id]; }, 100),
      meals: uniqueKnown(p.meals, function (m) { return MEALS.indexOf(m) >= 0; }, 4),
      people: int(p.people, 1, 8, null),
      budget: num(p.budget, 0, 10000, 0),
      cuisines: uniqueKnown(p.cuisines, function (c) { return A.CUISINES.indexOf(c) >= 0; }, 4),
    };
    // a profile with a missing required field is dropped (the example profile is shown instead)
    if (!out.sex || out.age == null || out.heightCm == null || out.weightKg == null || !out.activity || !out.goal || !out.meals.length || out.people == null) return null;
    return out;
  };
  clean.swaps = function (list) {
    const out = [];
    (Array.isArray(list) ? list : []).forEach(function (s) {
      if (!isObj(s) || out.length >= LIMITS.swaps) return;
      const d = int(s.d, 0, 6, null), i = int(s.i, 0, 3, null);
      if (d == null || i == null || typeof s.r !== 'string' || !A.REC[s.r]) return;
      out.push({ d: d, i: i, r: s.r });
    });
    return out;
  };
  clean.checked = function (o) {
    const out = {};
    if (isObj(o)) Object.keys(o).forEach(function (id) { if (A.ING[id] && o[id] === true) out[id] = true; });
    return out;
  };
  clean.recipeIds = function (list) { return uniqueKnown(list, function (id) { return !!A.REC[id]; }, LIMITS.liked); };
  clean.weights = function (list) {
    const byDate = {};
    (Array.isArray(list) ? list : []).forEach(function (w) {
      if (!isObj(w) || !validDate(w.d)) return;
      const kg = num(w.kg, 20, 400, null);
      if (kg != null) byDate[w.d] = Math.round(kg * 10) / 10;
    });
    return Object.keys(byDate).sort().slice(-LIMITS.weights).map(function (d) { return { d: d, kg: byDate[d] }; });
  };
  clean.prices = function (o) {
    const out = {};
    if (!isObj(o)) return out;
    STORE_IDS.forEach(function (s) {
      if (!isObj(o[s])) return;
      Object.keys(o[s]).forEach(function (id) {
        const v = o[s][id];
        if (!A.ING[id] || !isObj(v)) return;
        const price = num(v.price, 0.01, 499.99, null);
        if (price == null) return;
        out[s] = out[s] || {};
        out[s][id] = { price: Math.round(price * 100) / 100, packG: num(v.packG, 1, 100000, A.ING[id].packG), source: v.source === 'import' ? 'import' : 'you' };
      });
    });
    return out;
  };
  clean.name = function (n, dflt) { n = typeof n === 'string' ? n.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, LIMITS.name) : ''; return n || dflt; };
  clean.record = function (r, id, dflt) {
    r = isObj(r) ? r : {};
    return {
      id: id, name: clean.name(r.name, dflt), profile: clean.profile(r.profile), seedN: int(r.seedN, 1, 99999, 1), swaps: clean.swaps(r.swaps),
      checked: clean.checked(r.checked), liked: clean.recipeIds(r.liked), planLiked: clean.recipeIds(r.planLiked), weights: clean.weights(r.weights),
    };
  };
  function blankRecord(id, name) { return clean.record({}, id, name); }
  function blankData() { return { v: 2, lang: null, prices: {}, active: 'p1', profiles: [blankRecord('p1', 'Me')] }; }

  clean.data = function (raw) {
    if (!isObj(raw)) return null;
    const used = [];
    const profiles = [];
    (Array.isArray(raw.profiles) ? raw.profiles : []).forEach(function (r, i) {
      if (profiles.length >= LIMITS.profiles || !isObj(r)) return;
      let id = typeof r.id === 'string' && /^[a-z0-9_-]{1,24}$/i.test(r.id) && used.indexOf(r.id) < 0 ? r.id : newId(used);
      used.push(id);
      profiles.push(clean.record(r, id, 'Me ' + (i + 1)));
    });
    if (!profiles.length) return null;
    const langs = (A.LANGS || []).map(function (l) { return l.id; });
    return {
      v: 2, lang: langs.indexOf(raw.lang) >= 0 ? raw.lang : null, prices: clean.prices(raw.prices),
      active: used.indexOf(raw.active) >= 0 ? raw.active : profiles[0].id, profiles: profiles,
    };
  };

  // ---------- the store ----------
  function makeStore(storage) {
    const st = { consent: null, data: blankData(), available: !!storage, lastError: null, migrated: false, corrupt: false };

    function rawGet(k) { try { return storage ? storage.getItem(k) : null; } catch (e) { st.available = false; return null; } }
    function rawSet(k, v) {
      try { if (!storage) throw new Error('no storage'); storage.setItem(k, v); return true; } catch (e) { st.lastError = 'write'; return false; }
    }
    function rawRemove(k) { try { if (storage) storage.removeItem(k); } catch (e) { /* nothing to remove */ } }
    function json(s) { try { return JSON.parse(s); } catch (e) { return undefined; } }

    // Details saved by the first version of the app (keys ateria.v1.*). Read only; nothing is written here.
    function readV1() {
      const old = {};
      let any = false;
      V1_KEYS.forEach(function (k) { const v = rawGet('ateria.v1.' + k); if (v != null) { old[k] = json(v); any = true; } });
      if (!any) return null;
      const rec = clean.record({ name: 'Me', profile: old.profile, seedN: old.seedN, swaps: old.swaps, checked: old.checked }, 'p1', 'Me');
      const d = blankData();
      d.profiles = [rec];
      d.prices = clean.prices(old.prices);
      d.lang = typeof old.lang === 'string' && (A.LANGS || []).some(function (l) { return l.id === old.lang; }) ? old.lang : null;
      return d;
    }

    const api = {
      init: function () {
        st.lastError = null; st.corrupt = false; st.migrated = false;
        const c = rawGet(K_CONSENT);
        st.consent = c === 'yes' || c === 'no' ? c : null;
        st.data = blankData();
        if (st.consent === 'yes') {
          const text = rawGet(K_DATA);
          if (text != null) {
            const d = clean.data(json(text));
            if (d) st.data = d;
            else { st.corrupt = true; rawSet(K_BAD, text); }
          }
        } else if (st.consent === null) {
          const old = readV1();
          if (old) { st.data = old; st.migrated = true; }
        }
        return api.status();
      },
      status: function () {
        const text = st.consent === 'yes' ? rawGet(K_DATA) : null;
        return { available: st.available, consent: st.consent, profiles: st.data.profiles.length, bytes: text ? text.length : 0, error: st.lastError, corrupt: st.corrupt, migrated: st.migrated };
      },
      consent: function () { return st.consent; },
      setConsent: function (yes) {
        if (yes) {
          st.consent = 'yes';
          const ok = rawSet(K_CONSENT, 'yes') && api.save();
          if (ok && st.migrated) { V1_KEYS.forEach(function (k) { rawRemove('ateria.v1.' + k); }); st.migrated = false; }
          return ok;
        }
        st.consent = 'no';
        rawRemove(K_DATA);
        return rawSet(K_CONSENT, 'no');
      },
      save: function () {
        if (st.consent !== 'yes') return false;
        st.lastError = null;
        return rawSet(K_DATA, JSON.stringify(st.data));
      },
      // Delete everything this app stored on the device (both versions) and start again from the example.
      wipe: function () {
        [K_DATA, K_CONSENT, K_BAD].forEach(rawRemove);
        V1_KEYS.forEach(function (k) { rawRemove('ateria.v1.' + k); });
        st.consent = null; st.data = blankData(); st.lastError = null; st.corrupt = false; st.migrated = false;
        return true;
      },
      data: function () { return st.data; },

      // ----- profiles -----
      profiles: function () { return st.data.profiles; },
      active: function () { return st.data.profiles.filter(function (r) { return r.id === st.data.active; })[0] || st.data.profiles[0]; },
      setActive: function (id) { if (st.data.profiles.some(function (r) { return r.id === id; })) { st.data.active = id; api.save(); return true; } return false; },
      addProfile: function (name) {
        if (st.data.profiles.length >= LIMITS.profiles) return null;
        const used = st.data.profiles.map(function (r) { return r.id; });
        const rec = blankRecord(newId(used), clean.name(name, 'Me ' + (st.data.profiles.length + 1)));
        st.data.profiles.push(rec); st.data.active = rec.id; api.save();
        return rec;
      },
      renameProfile: function (id, name) {
        const r = st.data.profiles.filter(function (x) { return x.id === id; })[0];
        if (!r) return false;
        r.name = clean.name(name, r.name); api.save(); return true;
      },
      removeProfile: function (id) {
        if (st.data.profiles.length <= 1) return false;
        const i = st.data.profiles.findIndex(function (r) { return r.id === id; });
        if (i < 0) return false;
        st.data.profiles.splice(i, 1);
        if (st.data.active === id) st.data.active = st.data.profiles[0].id;
        api.save(); return true;
      },
      canAddProfile: function () { return st.data.profiles.length < LIMITS.profiles; },

      // ----- values of the active profile -----
      // returns the cleaned profile, or null (and keeps the old one) when something required is missing
      setProfile: function (p) {
        const c = clean.profile(p);
        if (!c) return null;
        api.active().profile = c; api.save(); return c;
      },
      setSeed: function (n) { api.active().seedN = int(n, 1, 99999, 1); api.save(); },
      setSwaps: function (list) { api.active().swaps = clean.swaps(list); api.save(); },
      setChecked: function (o) { api.active().checked = clean.checked(o); api.save(); },
      toggleLike: function (recipeId) {
        const r = api.active();
        if (!A.REC[recipeId]) return false;
        const i = r.liked.indexOf(recipeId);
        if (i >= 0) r.liked.splice(i, 1); else if (r.liked.length < LIMITS.liked) r.liked.push(recipeId);
        api.save();
        return r.liked.indexOf(recipeId) >= 0;
      },
      // the hearts that count for the current plan are the ones present when the plan was made
      snapshotLiked: function () { const r = api.active(); r.planLiked = r.liked.slice(); api.save(); },
      addWeight: function (date, kg) {
        const one = clean.weights([{ d: date, kg: kg }]);
        if (!one.length) return false; // not a real date or not a plausible weight
        const r = api.active();
        r.weights = clean.weights(r.weights.concat(one)); api.save(); return true;
      },
      removeWeight: function (date) { const r = api.active(); r.weights = r.weights.filter(function (w) { return w.d !== date; }); api.save(); },

      // ----- shared by all profiles -----
      prices: function () { return st.data.prices; },
      setPrices: function (p) { st.data.prices = clean.prices(p); api.save(); },
      lang: function () { return st.data.lang; },
      setLang: function (l) { st.data.lang = (A.LANGS || []).some(function (x) { return x.id === l; }) ? l : null; api.save(); },

      // ----- backup -----
      exportJSON: function () { return JSON.stringify({ app: 'ateria', v: 2, exportedAt: new Date().toISOString(), data: st.data }, null, 2); },
      // returns { ok: true, data } or { ok: false, code } ; nothing is changed until applyImport
      parseImport: function (text) {
        text = String(text || '').trim();
        if (!text) return { ok: false, code: 'empty' };
        if (text.length > 2000000) return { ok: false, code: 'big' };
        const o = json(text);
        if (o === undefined) return { ok: false, code: 'json' };
        const d = clean.data(isObj(o) && isObj(o.data) ? o.data : o);
        if (!d) return { ok: false, code: 'format' };
        return { ok: true, data: d };
      },
      applyImport: function (d) { st.data = d; return api.save(); },
    };
    return api;
  }

  A.makeStore = makeStore;
  A.storeClean = clean;
  A.store = (function () {
    let ls = null;
    try { ls = g.localStorage || null; } catch (e) { ls = null; }
    return makeStore(ls);
  })();
})(typeof window !== 'undefined' ? window : globalThis);
