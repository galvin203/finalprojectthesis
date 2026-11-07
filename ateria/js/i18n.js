/* Ateria i18n runtime: texts, names, number formats. No DOM access except document.documentElement.lang. */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});
  const D = A.I18N;
  const I = (A.i18n = {});
  let lang = 'en';
  let fmt = {};
  let rules = null;

  function info(id) { return A.LANGS.filter(function (l) { return l.id === id; })[0] || null; }
  function locale() { return info(lang).locale; }

  I.langs = function () { return A.LANGS; };
  I.lang = function () { return lang; };
  I.has = function (id) { return !!info(id); };

  I.setLang = function (id) {
    if (!info(id)) id = 'en';
    lang = id;
    fmt = {};
    try { rules = new Intl.PluralRules(locale()); } catch (e) { rules = null; }
    try { if (g.document && g.document.documentElement) g.document.documentElement.lang = id; } catch (e) { /* no document */ }
    return lang;
  };

  // Pick a language: a stored choice wins, then the browser's language list, then English.
  I.detect = function (stored) {
    if (stored && info(stored)) return stored;
    const list = (g.navigator && (g.navigator.languages || [g.navigator.language])) || [];
    for (let i = 0; i < list.length; i++) {
      const base = String(list[i] || '').slice(0, 2).toLowerCase();
      if (info(base)) return base;
    }
    return 'en';
  };

  function fill(s, params) {
    if (!params) return s;
    return s.replace(/\{(\w+)\}/g, function (m, k) { return params[k] != null ? params[k] : m; });
  }
  I.t = function (key, params) {
    const s = (D.ui[lang] && D.ui[lang][key]) || D.ui.en[key] || key;
    return fill(s, params);
  };
  I.tn = function (key, n, params) {
    const form = rules && rules.select(n) === 'one' ? 'one' : 'other';
    const p = { n: n };
    if (params) Object.keys(params).forEach(function (k) { p[k] = params[k]; });
    return I.t(key + '_' + form, p);
  };

  // ---------- names ----------
  I.ingName = function (id) {
    const ing = A.ING[id];
    if (!ing) return id;
    if (lang === 'en') return ing.name;
    if (lang === 'fi') return ing.fi;
    const row = D.ing[id];
    return (row && row[lang === 'sv' ? 0 : 1]) || ing.name;
  };
  I.allNames = function (id) {
    const ing = A.ING[id];
    const row = D.ing[id] || [];
    return [ing.name, ing.fi, row[0], row[1]].filter(Boolean).join('|').toLowerCase();
  };
  // Recipe text in the current language: { name, tip, steps }. Steps still contain {tokens} (see js/measure.js).
  I.recipe = function (id) {
    if (!I._recById) { I._recById = {}; A.RECIPES.forEach(function (r) { I._recById[r.id] = r; }); }
    const base = I._recById[id];
    if (!base) return { name: id, tip: '', steps: [] };
    const tr = D.rec[lang] && D.rec[lang][id];
    if (lang === 'en' || !tr) return { name: base.name, tip: base.tip, steps: base.steps };
    return { name: tr[0], tip: tr[1], steps: tr.slice(2) };
  };
  function langIndex() { return A.LANGS.map(function (l) { return l.id; }).indexOf(lang); }
  I.spiceName = function (id) { const sp = A.SPICES && A.SPICES[id]; return sp ? sp.names[langIndex()] || sp.names[0] : id; };
  I.cuisine = function (id) { return I.t('cuisine.' + id); };
  I.aisle = function (k) { const r = D.aisle[k]; return r ? r[langIndex()] : k; };
  I.allergen = function (k) { const r = D.allergen[k]; return r ? r[langIndex()] : k; };
  I.meal = function (m) { return I.t('meal.' + m); };

  // ---------- numbers ----------
  function nf(digitsMin, digitsMax) {
    const k = digitsMin + ':' + digitsMax;
    if (!fmt[k]) fmt[k] = new Intl.NumberFormat(locale(), { minimumFractionDigits: digitsMin, maximumFractionDigits: digitsMax });
    return fmt[k];
  }
  I.n = function (x, digits) { return nf(digits || 0, digits || 0).format(x); };
  I.eur = function (x) {
    if (!fmt.eur) fmt.eur = new Intl.NumberFormat(locale(), { style: 'currency', currency: 'EUR' });
    return fmt.eur.format(x);
  };
  I.grams = function (g) {
    return g >= 1000 ? nf(0, 2).format(g / 1000) + ' kg' : nf(0, 0).format(g) + ' g';
  };
  I.pct = function (x) {
    const r = Math.round(x);
    const sign = r > 0 ? '+' : r < 0 ? '−' : '';
    return sign + Math.abs(r) + (lang === 'fi' || lang === 'sv' ? ' %' : '%');
  };
  I.pctAbs = function (x) { return Math.round(x) + (lang === 'fi' || lang === 'sv' ? '\u00a0%' : '%'); };
  I.plain = function (x) { return nf(0, 1).format(x); };

  I.setLang('en');
})(typeof window !== 'undefined' ? window : globalThis);
