/* Ateria UI. Vanilla JS, no dependencies.
 * The person's details live in A.store (js/store.js). Nothing is written to the device until they say yes. */
(function () {
  const A = window.Ateria;
  const E = A.engine;
  const I = A.i18n;
  const M = A.measure;
  const store = A.store;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  const t = function (k, p) { return I.t(k, p); };
  const n0 = function (x) { return I.n(x); };
  const eur = function (x) { return I.eur(x); };

  const SAMPLE = {
    sex: 'female', age: 34, heightCm: 168, weightKg: 68, activity: 'sedentary', goal: 'lose', diet: 'omnivore',
    allergies: [], lactoseFree: false, dislikes: [], favorites: [], meals: ['breakfast', 'lunch', 'snack', 'dinner'], people: 1, budget: 70, cuisines: [],
  };
  const ACTIVITIES = ['sedentary', 'active', 'vigorous'];
  const GOALS = ['lose', 'maintain', 'gain', 'muscle'];
  const DIETS = ['omnivore', 'pescatarian', 'vegetarian', 'vegan'];
  const MEALS = ['breakfast', 'lunch', 'snack', 'dinner'];
  const DIET_ICON = { omnivore: 'chicken', pescatarian: 'cod', vegetarian: 'carrot', vegan: 'leaf' };
  const ALLERGEN_ICON = { gluten: 'wheat', milk: 'milk', egg: 'egg', fish: 'cod', shellfish: 'shrimp', peanut: 'peanut', nuts: 'almonds', soy: 'soybean', sesame: 'sesame' };
  const AISLE_ICON = { produce: 'tomato', grains: 'rye_bread', meat: 'chicken', dairy: 'milk', pantry: 'canned_tomato', frozen: 'frozen_veg' };
  // ingredients that season rather than feed: they do not make a good picture of the meal
  const SEASONING = { oil: 1, soy_sauce: 1, garlic: 1, honey: 1, chia: 1, sesame_oil: 1, fish_sauce: 1, ginger: 1, flour: 1 };
  const LOCALES = { en: 'en-GB', fi: 'fi-FI', sv: 'sv-SE', vi: 'vi-VN' };

  store.init();
  const S = {
    lang: I.setLang(I.detect(store.lang())),
    view: 'plan', draftGoal: null, day: 0, open: null, swapOpen: null, plan: null, prices: null, portions: {},
    io: '', ioMsg: null, resetArmed: false, filter: '',
    backup: '', dataMsg: null, wipeArmed: false, removeArmed: false, wtErr: false, cloudMsg: null, cloudAt: null, cloudBusy: false,
  };

  function rec() { return store.active(); }
  function isExample() { return !rec().profile; }
  function P() { return rec().profile || SAMPLE; }
  function displayName(r) { return r.name === 'Me' ? t('prof.me') : r.name; }

  function buildPlan() {
    const p = P();
    const seed = (E.hashSeed(JSON.stringify(p)) + rec().seedN) >>> 0;
    let plan = E.planWeek(p, seed, { liked: rec().planLiked });
    if (!plan.error) {
      rec().swaps.forEach(function (sw) { const n = E.swapMeal(plan, p, sw.d, sw.i, sw.r); if (n) plan = n; });
    }
    S.plan = plan;
    if (S.day > 6) S.day = 0;
  }
  function buildPrices() { S.prices = E.mergePrices(A.SEED_PRICES, store.prices()); }
  function resetView() { S.day = 0; S.open = null; S.swapOpen = null; S.portions = {}; S.removeArmed = false; }

  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg; el.hidden = false;
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { el.hidden = true; }, 2800);
  }
  // after a change: tell the person if saving was allowed but failed
  function kept() {
    const s = store.status();
    if (s.consent === 'yes' && s.error) toast(t('toast.saveFail'));
  }

  // ---------- small building blocks ----------
  // A picture on a light tile, so the colours read the same in both themes.
  function tile(id, px, opts) {
    return '<span class="tile" style="--t:' + px + 'px">' + A.icon(id, px - 8, opts) + '</span>';
  }
  function ingName(id) { return esc(I.ingName(id)); }
  function fiName(id) { return I.lang() === 'fi' ? '' : '<span class="finame">' + esc(A.ING[id].fi) + '</span>'; }
  function today() { const d = new Date(); const z = function (x) { return (x < 10 ? '0' : '') + x; }; return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); }
  function fmtDate(d) {
    try { return new Intl.DateTimeFormat(LOCALES[S.lang], { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(d + 'T00:00:00Z')); } catch (e) { return d; }
  }
  function fmtStamp(iso) {
    try { return new Intl.DateTimeFormat(LOCALES[S.lang], { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)); } catch (e) { return iso; }
  }

  // up to three ingredients that best show what the meal looks like
  function mealPics(m, px) {
    return m.items.slice().filter(function (it) { return !SEASONING[it.id]; })
      .sort(function (a, b) { return A.ING[b.id].per100.kcal * b.g - A.ING[a.id].per100.kcal * a.g; })
      .slice(0, 3).map(function (it) { return tile(it.id, px || 40); }).join('');
  }
  // A real photo of the dish, when the site has one (data/photos.js, made by tools/photos_index.js). Otherwise ''.
  function dishPhoto(id) { return (A.photo && A.photo(id)) || null; }
  function dishImg(id, px, cls) {
    const ph = dishPhoto(id);
    return ph ? '<img class="dish' + (cls ? ' ' + cls : '') + '" src="' + esc(ph.src) + '" width="' + px + '" height="' + px + '" alt="" loading="lazy" decoding="async">' : '';
  }
  // the large photo at the top of an opened recipe; the credit is shown only when the photo's licence asks for one
  function dishFigure(id) {
    const ph = dishPhoto(id);
    if (!ph) return '';
    return '<figure class="dishfig"><img src="' + esc(ph.src) + '" width="960" height="540" alt="" loading="lazy" decoding="async">' +
      (ph.credit ? '<figcaption class="note small">' + esc(t('photo.credit', { credit: ph.credit })) + '</figcaption>' : '') + '</figure>';
  }

  function planErrorText(plan) {
    if (plan.errorCode === 'noRecipes') return t('err.noRecipes', { meal: I.meal(plan.errorMeal) });
    if (plan.errorCode === 'invalid') return plan.errors.map(function (e) { return t('err.' + e.code); }).join(' ');
    return plan.error;
  }
  function warnText(w) {
    if (w.code === 'noSnack') return t('warn.noSnack');
    if (w.code === 'energy') return t('warn.energy', { day: w.day, pct: I.pct(w.pct) });
    if (w.code === 'protein') return t('warn.protein', { day: w.day });
    return w.text;
  }
  function ioMsgText() {
    const m = S.ioMsg;
    if (!m) return '';
    if (m.k) return t(m.k);
    let s = I.tn('io.loaded', m.loaded);
    if (m.skipped) s += ', ' + I.tn('io.skipped', m.skipped);
    return s + '.';
  }
  function msgText(m) {
    if (!m) return '';
    return m.n != null ? I.tn(m.k, m.n) : t(m.k);
  }

  // ---------- banners ----------
  function exampleBanner() {
    if (!isExample()) return '';
    return '<div class="banner info"><div>' + t('example.body', { link: '<a href="#profile">' + esc(t('example.link')) + '</a>' }) + '</div></div>';
  }
  // Asks once whether the app may keep the person's details on this device. Nothing is written before the answer.
  function consentBanner() {
    const s = store.status();
    if (s.consent !== null || !s.available) return '';
    return '<div class="banner consent" role="region" aria-label="' + esc(t('consent.q')) + '"><div><strong>' + esc(t('consent.q')) + '</strong><p>' + esc(t(s.migrated ? 'consent.migrated' : 'consent.body')) + '</p></div>' +
      '<div class="row"><button class="btn primary small" type="button" data-act="consent" data-v="yes">' + esc(t('consent.yes')) + '</button><button class="btn small" type="button" data-act="consent" data-v="no">' + esc(t('consent.no')) + '</button></div></div>';
  }

  // ---------- views ----------
  function gauge(label, val, target, unit, isProtein) {
    const pct = Math.min(100, (val / target) * 100);
    const low = isProtein && val < target * 0.85;
    return '<div class="gauge"><div class="label"><span>' + esc(label) + '</span><span><b>' + n0(val) + '</b> / ' + n0(target) + ' ' + esc(unit) + '</span></div>' +
      '<div class="bar" role="img" aria-label="' + esc(t('gauge.aria', { label: label, val: n0(val), target: n0(target), unit: unit })) + '"><i class="' + (low ? 'low' : '') + '" style="width:' + pct.toFixed(0) + '%"></i></div></div>';
  }

  function portionsOf(key) { return Math.min(8, Math.max(1, S.portions[key] || P().people || 1)); }

  // the opened recipe: amounts for N portions, seasoning by moment, method with the amounts filled in
  function recipeDetail(m, key, i) {
    const people = portionsOf(key);
    const rv = M.recipeView(m, people);
    const liked = rec().liked.indexOf(m.recipeId) >= 0;
    const kcal = t('kcal');
    let s = '<div class="detail">';
    s += dishFigure(m.recipeId);
    s += '<div class="row between"><span class="pill cuisine">' + A.icon(m.cuisine, 20) + esc(I.cuisine(m.cuisine)) + '</span>' +
      '<button class="btn small heart" type="button" data-act="like" data-id="' + m.recipeId + '" aria-pressed="' + liked + '">' + A.icon(liked ? 'heart' : 'heart_o', 20) + '<span>' + esc(t(liked ? 'rec.unlike' : 'rec.like')) + '</span></button></div>';
    s += '<div class="stepper" role="group" aria-label="' + esc(t('rec.portions')) + '"><span class="lab">' + A.icon('people', 22) + esc(t('rec.portions')) + '</span>' +
      '<button type="button" data-act="portions" data-key="' + key + '" data-d="-1" aria-label="' + esc(t('rec.less')) + '"' + (people <= 1 ? ' disabled' : '') + '>−</button>' +
      '<output aria-live="polite">' + people + '</output>' +
      '<button type="button" data-act="portions" data-key="' + key + '" data-d="1" aria-label="' + esc(t('rec.more')) + '"' + (people >= 8 ? ' disabled' : '') + '>+</button></div>';
    s += '<div class="tablewrap"><table><thead><tr><th>' + esc(t('tbl.ingredient')) + ' · ' + esc(t('tbl.amount')) + '</th><th class="num">' + esc(kcal) + '</th><th class="num">' + esc(t('tbl.protein')) + '</th></tr></thead><tbody>' +
      m.items.map(function (it) {
        const nu = A.ING[it.id].per100, k = it.g / 100;
        return '<tr><td><span class="ingcell">' + tile(it.id, 40) + '<span>' + ingName(it.id) + '<span class="amt">' + esc(M.ingredientText(it.id, it.g * people, 'table')) + '</span>' +
          (it.swappedFrom ? '<span class="muted small">' + esc(t('tbl.instead', { name: I.ingName(it.swappedFrom).toLocaleLowerCase(I.lang()) })) + '</span>' : '') + '</span></span></td>' +
          '<td class="num">' + n0(nu.kcal * k) + '</td><td class="num">' + I.n(nu.protein * k, 1) + ' g</td></tr>';
      }).join('') +
      '</tbody><tfoot><tr><td>' + esc(t('tbl.total')) + ' · ' + esc(I.grams(m.items.reduce(function (a, x) { return a + x.g; }, 0) * people)) + '</td><td class="num">' + n0(m.nutrients.kcal) + '</td><td class="num">' + I.n(m.nutrients.protein, 1) + ' g</td></tr></tfoot></table></div>';
    s += '<p class="note">' + esc(I.tn('rec.amountsFor', people)) + ' ' + esc(t('meal.note', { f: I.n(m.factor, 2) })) + '</p>';

    if (rv.swaps.length) {
      const list = rv.swaps.map(function (w) { return t('rec.swapItem', { to: I.ingName(w.to).toLocaleLowerCase(I.lang()), from: I.ingName(w.from).toLocaleLowerCase(I.lang()) }); }).join(', ');
      s += '<p class="banner info"><span>' + esc(t('rec.swapNote', { list: list })) + '</span></p>';
    }

    if (rv.spices.length || rv.water) {
      s += '<section class="spices"><h4>' + A.icon('spice_jar', 24) + esc(t('rec.spices')) + '</h4>';
      A.SPICE_WHEN.forEach(function (w) {
        const group = rv.spices.filter(function (x) { return x.when === w; });
        if (!group.length) return;
        s += '<h5>' + esc(t('when.' + w)) + '</h5><ul class="spicelist">' + group.map(function (x) {
          return '<li>' + tile(A.SPICES[x.id].icon, 40) + '<span class="sp-name">' + esc(x.name) + '</span><b class="sp-amt">' + esc(x.text) + '</b></li>';
        }).join('') + '</ul>';
      });
      if (rv.water) s += '<p class="waterline">' + A.icon('pot', 24) + '<span>' + esc(t('rec.water')) + '</span><b>' + esc(M.waterText(rv.water)) + '</b></p>';
      s += '<p class="note">' + esc(t('rec.spiceNote')) + '</p>';
      if (rv.spices.some(function (x) { return x.id === 'salt'; })) s += '<p class="note">' + esc(t('rec.saltNote')) + '</p>';
      s += '</section>';
    }

    s += '<h4 class="methodh">' + esc(t('rec.method')) + '</h4><ol class="steps">' + rv.steps.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>';
    if (rv.tip) s += '<p class="tip"><b>' + esc(t('rec.tip')) + '</b> ' + esc(rv.tip) + '</p>';

    s += '<div class="row"><button class="btn small" type="button" data-act="swapopen" data-key="' + key + '">' + esc(S.swapOpen === key ? t('swap.hide') : t('swap.open')) + '</button></div>';
    if (S.swapOpen === key) {
      const alts = E.alternatives(P(), m.meal, m.recipeId);
      s += alts.length ? '<div class="swap">' + alts.map(function (a) {
        const f = Math.min(E.CONFIG.FACTOR_MAX, Math.max(E.CONFIG.FACTOR_MIN, m.nutrients.kcal / a.base.kcal));
        return '<button type="button" data-act="swap" data-d="' + S.day + '" data-i="' + i + '" data-r="' + a.id + '"><span class="swapname"><span class="pics small">' + (dishPhoto(a.id) ? dishImg(a.id, 40, 'sm') : mealPics({ items: a.items || [] })) + '</span><span>' + esc(I.recipe(a.id).name) + '</span></span><span class="muted">' + esc(t('swap.meta', { min: a.minutes, p: n0(a.base.protein * f) })) + '</span></button>';
      }).join('') + '</div>' : '<p class="muted">' + esc(t('swap.none')) + '</p>';
    }
    return s + '</div>';
  }

  function viewPlan() {
    const plan = S.plan;
    let h = consentBanner();
    if (plan.error) {
      return h + '<div class="panel"><h2>' + esc(t('plan.none')) + '</h2><p style="margin:8px 0 14px">' + esc(planErrorText(plan)) + '</p><a class="btn primary" href="#profile">' + esc(t('plan.change')) + '</a></div>';
    }
    const kcal = t('kcal');
    const tg = plan.targets, day = plan.days[S.day];
    h += exampleBanner();
    const formula = t(tg.floored ? 'formula.floored' : 'formula.main', { bmr: n0(tg.bmr), pal: I.n(tg.pal, 2), tdee: n0(tg.tdee), adj: I.pct(tg.adjustment * 100), kcal: n0(tg.kcal) }) +
      (tg.planShare < 0.999 ? t('formula.share', { pct: I.pctAbs(tg.planShare * 100), kcal: n0(tg.planKcal) }) : '');
    h += '<section class="targets" aria-label="' + esc(t('targets.aria')) + '">' +
      '<div><div class="muted small" style="color:inherit;opacity:.85">' + esc(t('targets.daily')) + '</div><div class="big">' + n0(tg.kcal) + '<span>' + esc(kcal) + '</span></div></div>' +
      '<div class="macros">' + [['protein', tg.protein], ['fat', tg.fat], ['carbs', tg.carbs], ['fibre', tg.fibre]].map(function (m) {
        return '<div><b>' + n0(m[1]) + ' g</b><small>' + esc(t('macro.' + m[0])) + '</small></div>';
      }).join('') + '</div>' +
      '<p class="formula">' + esc(formula) + '</p></section>';

    h += '<div class="row between"><h2>' + esc(t('plan.title')) + '</h2><button class="btn small" data-act="newplan" type="button">' + esc(t('plan.new')) + '</button></div>';
    h += '<div class="days" role="group" aria-label="' + esc(t('plan.chooseDay')) + '">' + plan.days.map(function (d, i) {
      return '<button type="button" data-act="day" data-i="' + i + '" aria-pressed="' + (i === S.day) + '"><b>' + esc(t('plan.day', { n: i + 1 })) + '</b><small>' + n0(d.totals.kcal) + ' ' + esc(kcal) + '</small></button>';
    }).join('') + '</div>';

    const share = tg.planShare;
    h += '<div class="dayline panel">' +
      gauge(t('gauge.energy'), day.totals.kcal, tg.planKcal, kcal) +
      gauge(t('macro.protein'), day.totals.protein, tg.protein * share, 'g', true) +
      gauge(t('macro.carbs'), day.totals.carbs, tg.carbs * share, 'g') +
      gauge(t('macro.fat'), day.totals.fat, tg.fat * share, 'g') + '</div>';

    plan.warnings.filter(function (w) { return !w.day || w.day === S.day + 1; }).forEach(function (w) {
      h += '<div class="banner"><div><strong>' + esc(t('warn.label')) + '</strong> ' + esc(warnText(w)) + '</div></div>';
    });

    h += '<div class="meals">' + day.meals.map(function (m, i) {
      const key = S.day + '-' + i;
      const open = S.open === key;
      const rn = I.recipe(m.recipeId);
      const liked = rec().liked.indexOf(m.recipeId) >= 0;
      let s = '<article class="meal"><button class="head" type="button" data-act="open" data-key="' + key + '" aria-expanded="' + open + '">' +
        (dishPhoto(m.recipeId) ? '<span class="pics photo">' + dishImg(m.recipeId, 76) + '</span>' : '<span class="pics">' + mealPics(m) + '</span>') +
        '<span class="kind">' + A.icon(m.meal, 18) + esc(I.meal(m.meal)) + (m.swapped ? ' · ' + esc(t('meal.swapped')) : '') + '</span>' +
        '<span class="name">' + esc(rn.name) + (liked ? '<span class="likedmark" title="' + esc(t('rec.unlike')) + '">' + A.icon('heart', 16) + '</span>' : '') + '</span>' +
        '<span class="facts"><span class="cu">' + A.icon(m.cuisine, 16) + esc(I.cuisine(m.cuisine)) + '</span><span>' + esc(t('meal.min', { n: m.minutes })) + '</span><span>' + n0(m.nutrients.kcal) + ' ' + esc(kcal) + '</span><span>' + esc(t('meal.protein', { n: n0(m.nutrients.protein) })) + '</span></span></button>';
      if (open) s += recipeDetail(m, key, i);
      return s + '</article>';
    }).join('') + '</div>';
    return h;
  }

  function storeName(id) { return A.STORES.filter(function (s) { return s.id === id; })[0].name; }
  // store logo; alt text is empty when the store name is written next to it
  function storeLogo(st, px, named) {
    return '<img class="slogo" data-store="' + st.id + '" src="' + esc(st.logo) + '" width="' + px + '" height="' + px + '" alt="' + (named ? esc(st.name) : '') + '" decoding="async">';
  }

  // seasonings the week's recipes use; not priced, the person checks the cupboard
  function spiceSection(plan) {
    const sm = M.spiceSummary(plan);
    const groups = [[t('shop.spicesDried'), sm.salt.concat(sm.dried)], [t('shop.spicesFresh'), sm.fresh]].filter(function (g) { return g[1].length; });
    if (!groups.length) return '';
    return '<section class="aisle spiceaisle"><h3>' + A.icon('spice_jar', 26) + esc(t('shop.spices')) + '</h3><p class="note">' + esc(t('shop.spicesHelp')) + '</p>' +
      groups.map(function (g) {
        return '<h5>' + esc(g[0]) + '</h5><ul class="spicelist">' + g[1].map(function (x) {
          return '<li>' + tile(A.SPICES[x.id].icon, 40) + '<span class="sp-name">' + esc(I.spiceName(x.id)) + '</span><span class="muted small">' + esc(I.tn('shop.uses', x.uses)) + '</span></li>';
        }).join('') + '</ul>';
      }).join('') + '</section>';
  }

  function viewShop() {
    let h = consentBanner();
    if (S.plan.error) return h + '<div class="panel"><h2>' + esc(t('shop.none')) + '</h2><p style="margin:8px 0 14px">' + esc(t('shop.createFirst')) + '</p><a class="btn primary" href="#profile">' + esc(t('plan.change')) + '</a></div>';
    const p = P();
    const list = E.shoppingList(S.plan, p, S.prices);
    const best = list.cheapest;
    const budget = Number(p.budget) || 0;
    const checked = rec().checked;
    let seedUsed = false;
    list.rows.forEach(function (r) { Object.keys(r.byStore).forEach(function (s) { if (r.byStore[s] && r.byStore[s].source === 'seed') seedUsed = true; }); });
    h += exampleBanner();
    h += '<div class="row between"><h2>' + esc(t('shop.title')) + '</h2><span class="muted small">' + esc(I.tn('shop.people', p.people)) + ', ' + esc(t('shop.days')) + '</span></div>';
    if (seedUsed) h += '<div class="banner"><div>' + t('shop.placeholder', { link: '<a href="#prices">' + esc(t('shop.placeholderLink')) + '</a>' }) + '</div></div>';
    h += '<div class="stores">' + A.STORES.map(function (st) {
      const T = list.stores[st.id];
      const isBest = st.id === best;
      let sub = t('store.use', { eur: eur(T.food) });
      if (T.missing.length) sub = I.tn('store.missing', T.missing.length);
      let extra = '';
      if (isBest) extra = '<span class="pill">' + esc(t('store.lowest')) + '</span>';
      else if (best && !T.missing.length) extra = '<span class="sub">' + esc(t('store.more', { eur: eur(T.pack - list.stores[best].pack), store: storeName(best) })) + '</span>';
      let bud = '';
      if (budget > 0 && !T.missing.length) bud = T.food <= budget ? '<span class="sub">' + esc(t('store.under', { eur: eur(budget - T.food) })) + '</span>' : '<span class="sub berry">' + esc(t('store.over', { eur: eur(T.food - budget) })) + '</span>';
      return '<div class="store' + (isBest ? ' best' : '') + '"><div class="s-left"><span class="sname">' + storeLogo(st, 32) + '<span>' + esc(st.name) + '</span></span><span class="total">' + eur(T.pack) + '</span></div><div class="s-right"><span class="sub">' + esc(sub) + '</span>' + extra + bud + '</div></div>';
    }).join('') + '</div>';
    h += '<p class="note">' + esc(t('shop.note') + (budget > 0 ? t('shop.noteBudget', { budget: eur(budget) }) : '')) + '</p>';
    h += '<p class="note small">' + esc(t('shop.logos')) + '</p>';

    if (best) {
      const stores = {};
      Object.keys(list.mixed.assignment).forEach(function (id) { stores[list.mixed.assignment[id]] = true; });
      const saving = list.stores[best].pack - list.mixed.total;
      if (saving > 0.005) h += '<div class="banner info"><div>' + t('shop.mixed', { total: eur(list.mixed.total), saving: eur(saving), store: esc(storeName(best)), n: Object.keys(stores).length }) + '</div></div>';
    }

    const groups = {};
    list.rows.forEach(function (r) { (groups[r.aisle] = groups[r.aisle] || []).push(r); });
    Object.keys(A.AISLES).forEach(function (aisle) {
      if (!groups[aisle]) return;
      h += '<section class="aisle"><h3>' + A.icon(AISLE_ICON[aisle], 26) + esc(I.aisle(aisle)) + '</h3>' + groups[aisle].map(function (r) {
        const first = A.STORES.map(function (s) { return r.byStore[s.id]; }).filter(Boolean)[0];
        let low = null;
        A.STORES.forEach(function (s) { const b = r.byStore[s.id]; if (b && (!low || b.packCost < r.byStore[low].packCost)) low = s.id; });
        const done = !!checked[r.id];
        return '<div class="item' + (done ? ' done' : '') + '"><input type="checkbox" id="chk-' + r.id + '" data-act="check" data-id="' + r.id + '"' + (done ? ' checked' : '') + ' aria-label="' + esc(t('item.got', { name: I.ingName(r.id) })) + '">' +
          tile(r.id, 52) +
          '<label class="what" for="chk-' + r.id + '"><b>' + ingName(r.id) + '</b>' + fiName(r.id) + '<span class="muted">' + esc(M.ingredientText(r.id, Math.round(r.grams), 'shop') + (first ? ' · ' + first.packs + ' × ' + I.grams(first.packG) : '')) + '</span></label>' +
          '<div class="prices">' + A.STORES.map(function (s) {
            const b = r.byStore[s.id];
            if (!b) return '<span><small>' + storeLogo(s, 20, true) + '</small><b class="muted">' + esc(t('item.noPrice')) + '</b></span>';
            return '<span class="' + (s.id === low ? 'low' : '') + '"><small>' + storeLogo(s, 20, true) + '</small><b>' + eur(b.packCost) + (b.source === 'seed' ? '<i class="est">' + esc(t('est')) + '</i>' : '') + '</b></span>';
          }).join('') + '</div></div>';
      }).join('') + '</section>';
    });
    h += spiceSection(S.plan);
    return h;
  }

  function viewPrices() {
    const ov = store.prices();
    let h = '<div class="row between"><h2>' + esc(t('prices.title')) + '</h2></div>';
    h += '<div class="banner"><div>' + t('prices.banner') + '</div></div>';
    h += '<label class="field"><span>' + esc(t('prices.find')) + '</span><input id="filter" type="search" value="' + esc(S.filter) + '" placeholder="' + esc(t('prices.findPh')) + '" autocomplete="off"></label>';
    const q = S.filter.trim().toLowerCase();
    h += '<div class="pricegrid">' + A.INGREDIENTS.filter(function (i) {
      return !q || I.allNames(i.id).indexOf(q) >= 0;
    }).map(function (i) {
      return '<div class="prow"><div class="ingcell">' + tile(i.id, 40) + '<span><b>' + ingName(i.id) + '</b> ' + fiName(i.id) + '<br><span class="muted small">' + esc(t('prices.perPack', { g: I.grams(i.packG) })) + '</span></span></div><div class="inputs">' + A.STORES.map(function (s) {
        const o = ov[s.id] && ov[s.id][i.id];
        const seed = A.SEED_PRICES[s.id][i.id].price;
        return '<label><span class="lname">' + storeLogo(s, 22) + '<span>' + esc(s.name) + '</span></span><input type="number" inputmode="decimal" step="0.01" min="0" data-act="price" data-s="' + s.id + '" data-id="' + i.id + '" class="' + (o ? 'mine' : '') + '" value="' + (o ? o.price : '') + '" placeholder="' + seed.toFixed(2) + '"></label>';
      }).join('') + '</div></div>';
    }).join('') + '</div>';

    h += '<section class="panel" style="display:grid;gap:10px"><h3>' + esc(t('io.title')) + '</h3>' +
      '<p class="note">' + t('io.help') + '</p>' +
      '<textarea id="io" aria-label="' + esc(t('io.aria')) + '" spellcheck="false">' + esc(S.io) + '</textarea>' +
      '<div class="row"><button class="btn primary small" type="button" data-act="ioload">' + esc(t('io.load')) + '</button><button class="btn small" type="button" data-act="iocopy">' + esc(t('io.copy')) + '</button>' +
      '<button class="btn small quiet" type="button" data-act="ioreset">' + esc(S.resetArmed ? t('io.resetArmed') : t('io.reset')) + '</button></div>' +
      '<p id="iomsg" role="status" class="small muted">' + esc(ioMsgText()) + '</p></section>';
    return h;
  }

  // a small pill with a picture
  function chip(type, name, value, label, checked, iconId) {
    return '<label class="chip"><input type="' + type + '" name="' + name + '" value="' + esc(value) + '"' + (checked ? ' checked' : '') + '><span>' + (iconId ? tile(iconId, 28, { badge: false }) : '') + esc(label) + '</span></label>';
  }
  // a larger card with a picture, for the choices that matter most
  function choice(type, name, value, label, checked, iconId, hint) {
    return '<label class="choice"><input type="' + type + '" name="' + name + '" value="' + esc(value) + '"' + (checked ? ' checked' : '') + '><span>' + tile(iconId, 52, { badge: false }) + '<b>' + esc(label) + '</b>' + (hint ? '<small>' + esc(hint) + '</small>' : '') + '</span></label>';
  }

  // ----- "You" sections. Each one can be redrawn alone, so a half-filled form is not lost. -----
  function secPeople() {
    const list = store.profiles(), cur = rec();
    let h = '<h3>' + esc(t('prof.who')) + '</h3><div class="people" role="group" aria-label="' + esc(t('prof.who')) + '">' + list.map(function (r) {
      return '<button type="button" class="pchip" data-act="who" data-id="' + r.id + '" aria-pressed="' + (r.id === cur.id) + '">' + tile(r.profile ? r.profile.sex : 'people', 32, { badge: false }) + '<span>' + esc(displayName(r)) + '</span></button>';
    }).join('') + '</div>';
    h += '<div class="namerow"><label class="field"><span>' + esc(t('prof.name')) + '</span><input id="pname" type="text" maxlength="30" value="' + esc(displayName(cur)) + '" autocomplete="off"></label>' +
      '<button class="btn small" type="button" data-act="rename">' + esc(t('prof.rename')) + '</button></div>';
    h += '<div class="row"><button class="btn small" type="button" data-act="addperson"' + (store.canAddProfile() ? '' : ' disabled') + '>+ ' + esc(t('prof.add')) + '</button>' +
      (list.length > 1 ? '<button class="btn small quiet" type="button" data-act="removeperson">' + esc(S.removeArmed ? t('prof.removeArmed') : t('prof.remove')) + '</button>' : '') + '</div>';
    if (!store.canAddProfile()) h += '<p class="note">' + esc(t('prof.max', { n: 6 })) + '</p>';
    return h;
  }

  function weightChart(ws) {
    ws = ws.slice(-90);
    if (ws.length < 2) return '';
    const W = 320, H = 150, L = 38, R = 12, T = 12, B = 26;
    const day = function (d) { return Date.parse(d + 'T00:00:00Z') / 86400000; };
    const x0 = day(ws[0].d), x1 = day(ws[ws.length - 1].d);
    let lo = Math.min.apply(null, ws.map(function (w) { return w.kg; })), hi = Math.max.apply(null, ws.map(function (w) { return w.kg; }));
    if (hi - lo < 1) { lo -= 0.5; hi += 0.5; }
    const pad = (hi - lo) * 0.12; lo -= pad; hi += pad;
    const X = function (d) { return L + (x1 === x0 ? 0.5 : (day(d) - x0) / (x1 - x0)) * (W - L - R); };
    const Y = function (k) { return T + (1 - (k - lo) / (hi - lo)) * (H - T - B); };
    const pts = ws.map(function (w) { return X(w.d).toFixed(1) + ',' + Y(w.kg).toFixed(1); });
    return '<svg class="wchart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(t('wt.chart') + ': ' + I.n(ws[0].kg, 1) + ' → ' + I.n(ws[ws.length - 1].kg, 1) + ' kg') + '">' +
      '<line class="wc-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(hi - pad).toFixed(1) + '" y2="' + Y(hi - pad).toFixed(1) + '"/>' +
      '<line class="wc-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(lo + pad).toFixed(1) + '" y2="' + Y(lo + pad).toFixed(1) + '"/>' +
      '<text class="wc-txt" x="' + (L - 6) + '" y="' + (Y(hi - pad) + 4).toFixed(1) + '" text-anchor="end">' + I.n(hi - pad, 1) + '</text>' +
      '<text class="wc-txt" x="' + (L - 6) + '" y="' + (Y(lo + pad) + 4).toFixed(1) + '" text-anchor="end">' + I.n(lo + pad, 1) + '</text>' +
      '<polyline class="wc-line" points="' + pts.join(' ') + '" fill="none"/>' +
      ws.map(function (w) { return '<circle class="wc-dot" cx="' + X(w.d).toFixed(1) + '" cy="' + Y(w.kg).toFixed(1) + '" r="3"/>'; }).join('') +
      '<text class="wc-txt" x="' + L + '" y="' + (H - 6) + '">' + esc(fmtDate(ws[0].d)) + '</text>' +
      '<text class="wc-txt" x="' + (W - R) + '" y="' + (H - 6) + '" text-anchor="end">' + esc(fmtDate(ws[ws.length - 1].d)) + '</text></svg>';
  }

  function secWeight() {
    const ws = rec().weights;
    const last = ws.length ? ws[ws.length - 1].kg : P().weightKg;
    let h = '<h3>' + A.icon('scale', 26) + esc(t('wt.title')) + '</h3>';
    h += '<div class="wtrow"><label class="field"><span>' + esc(t('wt.date')) + '</span><input id="wdate" type="date" value="' + today() + '" max="' + today() + '"></label>' +
      '<label class="field"><span>' + esc(t('wt.kg')) + '</span><input id="wkg" type="number" inputmode="decimal" min="20" max="400" step="0.1" value="' + esc(last) + '"></label>' +
      '<button class="btn primary small" type="button" data-act="wadd">' + esc(t('wt.add')) + '</button></div>';
    if (S.wtErr) h += '<p class="errors" role="alert"><span>' + esc(t('wt.err')) + '</span></p>';
    if (!ws.length) h += '<p class="muted">' + esc(t('wt.none')) + '</p>';
    else {
      h += weightChart(ws);
      if (ws.length > 1) {
        const d = ws[ws.length - 1].kg - ws[0].kg;
        h += '<p class="small"><b>' + esc(t('wt.change', { d: (d > 0 ? '+' : d < 0 ? '−' : '') + I.n(Math.abs(d), 1) })) + '</b></p>';
      }
      h += '<ul class="wlist">' + ws.slice().reverse().slice(0, 8).map(function (w) {
        return '<li><span>' + esc(fmtDate(w.d)) + '</span><b>' + I.n(w.kg, 1) + ' kg</b><button type="button" class="x" data-act="wdel" data-d="' + w.d + '" aria-label="' + esc(t('wt.remove', { date: fmtDate(w.d) })) + '">×</button></li>';
      }).join('') + '</ul>';
    }
    if (store.consent() !== 'yes') h += '<p class="note">' + esc(t('wt.needSave')) + '</p>';
    h += '<p class="note">' + esc(t('wt.note')) + '</p>';
    return h;
  }

  function secFavs() {
    const ids = rec().liked.slice().sort(function (a, b) { return I.recipe(a).name.localeCompare(I.recipe(b).name, I.lang()); });
    let h = '<h3>' + A.icon('heart', 26) + esc(t('fav.title')) + '</h3>';
    if (!ids.length) return h + '<p class="muted">' + esc(t('fav.none')) + '</p>';
    return h + '<ul class="favlist">' + ids.map(function (id) {
      const name = I.recipe(id).name;
      return '<li>' + tile(A.REC[id].cuisine, 36, { badge: false }) + '<span>' + esc(name) + '<small class="muted">' + esc(I.cuisine(A.REC[id].cuisine)) + '</small></span>' +
        '<button type="button" class="x" data-act="unlike" data-id="' + id + '" aria-label="' + esc(t('fav.remove', { name: name })) + '">' + A.icon('heart', 20) + '</button></li>';
    }).join('') + '</ul>';
  }

  function statusLine() {
    const s = store.status();
    if (!s.available) return t('data.status.unavailable');
    if (s.consent === 'yes') return (s.error ? t('data.status.error') : t('data.status.yes', { kb: I.n(s.bytes / 1024, 1) })) + (s.corrupt ? ' ' + t('data.status.corrupt') : '');
    if (s.consent === 'no') return t('data.status.no');
    return t('data.status.ask');
  }
  function secData() {
    const s = store.status();
    let h = '<h3>' + A.icon('save', 26) + esc(t('data.title')) + '</h3><p role="status">' + esc(statusLine()) + '</p>';
    if (s.available && s.consent !== 'yes') h += '<div class="row"><button class="btn primary small" type="button" data-act="consent" data-v="yes">' + esc(t('data.turnOn')) + '</button></div>';
    h += '<h4>' + esc(t('data.backup')) + '</h4><p class="note">' + esc(t('data.backupHelp')) + '</p>' +
      '<textarea id="backup" aria-label="' + esc(t('data.backupAria')) + '" spellcheck="false">' + esc(S.backup) + '</textarea>' +
      '<div class="row"><button class="btn small" type="button" data-act="mkbackup">' + esc(t('data.makeBackup')) + '</button>' +
      '<button class="btn small" type="button" data-act="dlbackup">' + esc(t('data.download')) + '</button>' +
      '<button class="btn small" type="button" data-act="cpbackup">' + esc(t('data.copy')) + '</button>' +
      '<label class="btn small filebtn">' + esc(t('data.chooseFile')) + '<input id="bfile" type="file" accept=".json,application/json,text/plain"></label></div>' +
      '<div class="row"><button class="btn primary small" type="button" data-act="loadbackup">' + esc(t('data.load')) + '</button></div>' +
      '<p class="note">' + esc(t('data.loadWarn')) + '</p>' +
      '<p id="datamsg" role="status" class="small muted">' + esc(msgText(S.dataMsg)) + '</p>' +
      '<div class="row"><button class="btn small quiet danger" type="button" data-act="wipe">' + esc(S.wipeArmed ? t('data.wipeArmed') : t('data.wipe')) + '</button></div>';
    return h;
  }

  function secCloud() {
    if (!A.cloud || !A.cloud.ready) return '';
    return '<h3>' + A.icon('cloud', 26) + esc(t('cloud.title')) + '</h3><p class="note">' + esc(t('cloud.help')) + '</p>' +
      '<div class="row"><button class="btn small" type="button" data-act="cloudsave"' + (S.cloudBusy ? ' disabled' : '') + '>' + esc(t('cloud.save')) + '</button>' +
      '<button class="btn small" type="button" data-act="cloudload"' + (S.cloudBusy ? ' disabled' : '') + '>' + esc(t('cloud.load')) + '</button></div>' +
      '<p role="status" class="small muted">' + esc(S.cloudBusy ? t('cloud.busy') : msgText(S.cloudMsg)) + (S.cloudAt ? ' ' + esc(t('cloud.at', { time: fmtStamp(S.cloudAt) })) : '') + '</p>';
  }

  const SECTIONS = { people: secPeople, weight: secWeight, favs: secFavs, data: secData, cloud: secCloud };
  function refresh(name) {
    const el = document.getElementById('sec-' + name);
    if (!el) return;
    el.innerHTML = SECTIONS[name]();
    if (name === 'cloud') el.hidden = !(A.cloud && A.cloud.ready);
  }

  function viewProfile() {
    const p = S.draftGoal ? Object.assign({}, P(), { goal: S.draftGoal }) : P(); // a goal picked on the welcome screen
    let h = consentBanner();
    h += '<div class="row between"><h2>' + esc(t('profile.title')) + '</h2></div>';
    h += '<section class="panel" id="sec-people">' + secPeople() + '</section>';
    h += '<form class="profile" id="pform" novalidate>';
    h += '<fieldset><legend>' + esc(t('profile.sex')) + '</legend><div class="choices two">' + ['female', 'male'].map(function (k) { return choice('radio', 'sex', k, t('sex.' + k), p.sex === k, k); }).join('') + '</div></fieldset>';
    h += '<div class="grid3"><label class="field"><span>' + esc(t('profile.age')) + '</span><input id="age" name="age" type="number" inputmode="numeric" min="18" max="99" value="' + p.age + '"></label>' +
      '<label class="field"><span>' + esc(t('profile.height')) + '</span><input id="height" name="height" type="number" inputmode="numeric" min="120" max="230" value="' + p.heightCm + '"></label>' +
      '<label class="field"><span>' + esc(t('profile.weight')) + '</span><input id="weight" name="weight" type="number" inputmode="decimal" min="35" max="250" step="0.5" value="' + p.weightKg + '"></label></div>';
    h += '<fieldset><legend>' + esc(t('profile.activity')) + '</legend><div class="choices rows">' + ACTIVITIES.map(function (k) { return choice('radio', 'activity', k, t('activity.' + k), p.activity === k, k); }).join('') + '</div></fieldset>';
    h += '<fieldset><legend>' + esc(t('profile.goal')) + '</legend><div class="choices four">' + GOALS.map(function (k) { return choice('radio', 'goal', k, t('goal.' + k), p.goal === k, k); }).join('') + '</div>' +
      '<p class="note" id="goalnote"' + (p.goal === 'muscle' ? '' : ' hidden') + '>' + esc(t('profile.goalMuscle')) + '</p></fieldset>';
    h += '<fieldset><legend>' + esc(t('profile.diet')) + '</legend><div class="choices">' + DIETS.map(function (k) { return choice('radio', 'diet', k, t('diet.' + k), p.diet === k, DIET_ICON[k]); }).join('') + '</div></fieldset>';
    h += '<fieldset><legend>' + esc(t('profile.allergy')) + '</legend><div class="chips">' + A.ALLERGENS.map(function (a) { return chip('checkbox', 'allergy', a[0], I.allergen(a[0]), p.allergies.indexOf(a[0]) >= 0, ALLERGEN_ICON[a[0]]); }).join('') + chip('checkbox', 'lactose', '1', t('profile.lactose'), p.lactoseFree, 'lactose') + '</div></fieldset>';
    h += '<fieldset><legend>' + esc(t('profile.cuisine')) + '</legend><div class="choices four">' + A.CUISINES.map(function (c) { return choice('checkbox', 'cuisine', c, I.cuisine(c), (p.cuisines || []).indexOf(c) >= 0, c); }).join('') + '</div><p class="note">' + esc(t('profile.cuisineNote')) + '</p></fieldset>';
    h += '<fieldset><legend>' + esc(t('profile.meals')) + '</legend><div class="choices four">' + MEALS.map(function (k) { return choice('checkbox', 'meal', k, I.meal(k), p.meals.indexOf(k) >= 0, k); }).join('') + '</div><p class="note">' + esc(t('profile.mealsNote')) + '</p></fieldset>';
    h += '<div class="grid2"><label class="field"><span>' + esc(t('profile.people')) + '</span><input id="people" name="people" type="number" inputmode="numeric" min="1" max="8" value="' + p.people + '"></label>' +
      '<label class="field"><span>' + esc(t('profile.budget')) + '</span><input id="budget" name="budget" type="number" inputmode="decimal" min="0" step="1" value="' + (p.budget || 0) + '"></label></div>';
    h += '<details class="more"><summary>' + esc(t('profile.dislike')) + (p.dislikes.length ? ' (' + p.dislikes.length + ')' : '') + '</summary><div class="chips">' + A.INGREDIENTS.map(function (i) { return chip('checkbox', 'dislike', i.id, I.ingName(i.id), p.dislikes.indexOf(i.id) >= 0, i.id); }).join('') + '</div></details>';
    h += '<details class="more"><summary>' + esc(t('profile.like')) + (p.favorites.length ? ' (' + p.favorites.length + ')' : '') + '</summary><div class="chips">' + A.INGREDIENTS.map(function (i) { return chip('checkbox', 'favorite', i.id, I.ingName(i.id), p.favorites.indexOf(i.id) >= 0, i.id); }).join('') + '</div></details>';
    h += '<div id="errors" class="errors" role="alert"></div>';
    h += '<div class="row"><button class="btn primary" type="submit">' + esc(t('profile.create')) + '</button></div>';
    h += '<p class="note">' + esc(t('profile.disclaimer')) + '</p>';
    h += '</form>';
    h += '<section class="panel" id="sec-weight">' + secWeight() + '</section>';
    h += '<section class="panel" id="sec-favs">' + secFavs() + '</section>';
    h += '<section class="panel" id="sec-data" style="display:grid;gap:10px">' + secData() + '</section>';
    h += '<section class="panel" id="sec-cloud" style="display:grid;gap:10px"' + (A.cloud && A.cloud.ready ? '' : ' hidden') + '>' + secCloud() + '</section>';
    return h;
  }

  // ---------- welcome: the first screen for someone who has not made a profile yet ----------
  function dishCard(m) {
    const ph = dishPhoto(m.recipeId);
    return '<li class="dishcard"><span class="art' + (ph ? ' photo' : '') + '">' + (ph ? dishImg(m.recipeId, 440, 'fill') : mealPics(m, 56)) + '</span>' +
      '<span class="body"><span class="kind">' + A.icon(m.meal, 16) + esc(I.meal(m.meal)) + '</span><b class="nm">' + esc(I.recipe(m.recipeId).name) + '</b>' +
      '<span class="meta">' + esc(t('meal.min', { n: m.minutes })) + ' · ' + n0(m.nutrients.kcal) + ' ' + esc(t('kcal')) + ' · ' + esc(t('meal.protein', { n: n0(m.nutrients.protein) })) + '</span></span></li>';
  }
  function viewWelcome() {
    let dishes = '';
    if (!S.plan.error) {
      const seen = {};
      const picks = S.plan.days[0].meals.concat(S.plan.days[1].meals).filter(function (m) {
        if (seen[m.recipeId]) return false;
        seen[m.recipeId] = true; return true;
      }).slice(0, 6);
      dishes = '<section class="dishes" aria-labelledby="wl-dishes"><h2 id="wl-dishes">' + esc(t('welcome.dishes')) + '</h2><ul class="dishrow">' + picks.map(dishCard).join('') + '</ul></section>';
    }
    const steps = [
      [t('welcome.s1.t'), t('welcome.s1.b'), ''],
      [t('welcome.s2.t'), t('welcome.s2.b'), ''],
      [t('welcome.s3.t'), t('welcome.s3.b'), '<span class="storerow">' + A.STORES.map(function (st) { return storeLogo(st, 28, true); }).join('') + '</span>'],
    ];
    return '<div class="welcome">' +
      '<section class="hero"><h1>' + esc(t('welcome.title')) + '</h1><p class="lead">' + esc(t('welcome.lead')) + '</p>' +
      '<h2 class="pickh" id="wl-pick">' + esc(t('welcome.pick')) + '</h2>' +
      '<div class="goalpick" role="group" aria-labelledby="wl-pick">' + GOALS.map(function (k) {
        return '<button type="button" class="gcard" data-act="welcomegoal" data-goal="' + k + '">' + tile(k, 52, { badge: false }) + '<span>' + esc(t('goal.' + k)) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="row"><button class="btn primary" type="button" data-act="welcomegoal" data-goal="">' + esc(t('profile.create')) + '</button>' +
      '<button class="btn quiet" type="button" data-act="welcomeexample">' + esc(t('welcome.example')) + '</button></div></section>' +
      dishes +
      '<section aria-labelledby="wl-how"><h2 id="wl-how">' + esc(t('welcome.how')) + '</h2><ol class="how">' + steps.map(function (s, i) {
        return '<li><span class="num" aria-hidden="true">' + (i + 1) + '</span><b>' + esc(s[0]) + '</b><span class="muted">' + esc(s[1]) + '</span>' + s[2] + '</li>';
      }).join('') + '</ol></section>' +
      '<p class="note">' + esc(t('profile.disclaimer')) + '</p></div>';
  }

  // ---------- render & routing ----------
  const VIEWS = { welcome: viewWelcome, plan: viewPlan, shop: viewShop, prices: viewPrices, profile: viewProfile };

  function renderChrome() {
    document.documentElement.lang = S.lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    const nav = document.querySelector('.nav');
    if (nav) nav.setAttribute('aria-label', t('nav.aria'));
    const sel = document.getElementById('lang');
    if (sel) {
      sel.innerHTML = A.LANGS.map(function (l) { return '<option value="' + l.id + '" lang="' + l.id + '"' + (l.id === S.lang ? ' selected' : '') + '>' + esc(l.name) + '</option>'; }).join('');
      sel.setAttribute('aria-label', t('lang.label'));
    }
  }

  function render() {
    const main = document.getElementById('main');
    main.innerHTML = VIEWS[S.view]();
    const app = document.querySelector('.app');
    if (app) app.classList.toggle('is-welcome', S.view === 'welcome');
    document.querySelectorAll('.nav a').forEach(function (a) {
      if (a.getAttribute('href') === '#' + S.view) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (A.help) A.help.refresh();
  }
  function route() {
    const h = (location.hash || '').replace('#', '');
    // someone without a profile starts on the welcome screen; everyone else starts on their plan
    S.view = VIEWS[h] ? h : (isExample() ? 'welcome' : 'plan');
    render();
    window.scrollTo(0, 0);
    if (A.help) A.help.setView(S.view);
  }
  // after the data was replaced (backup loaded, everything deleted): rebuild everything from the store
  function reload(langFromData) {
    if (langFromData && store.lang()) S.lang = I.setLang(store.lang());
    resetView(); S.backup = '';
    buildPrices(); buildPlan(); renderChrome(); render();
  }

  // ---------- events ----------
  function downloadBackup(text) {
    const name = 'ateria-backup-' + today() + '.json';
    const viaLink = function () {
      try {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
        a.download = name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000);
      } catch (e) { S.dataMsg = { k: 'data.copyFail' }; refresh('data'); }
    };
    if (window.claude && typeof window.claude.use === 'function') {
      window.claude.use('downloads').then(function (d) {
        if (!d) { viaLink(); return; }
        return d.save({ filename: name, data: text }).catch(function (e) { if (!e || e.code !== 'declined') viaLink(); });
      }, viaLink);
    } else viaLink();
  }

  function applyBackupText(text, fromCloud) {
    const r = store.parseImport(text);
    if (!r.ok) { S.dataMsg = { k: 'data.err.' + r.code }; refresh('data'); return false; }
    store.applyImport(r.data);
    S.dataMsg = { k: 'data.imported', n: r.data.profiles.length };
    reload(true);
    kept();
    return true;
  }

  document.addEventListener('click', function (ev) {
    const el = ev.target.closest('[data-act]');
    if (!el) return;
    const act = el.getAttribute('data-act');
    if (act === 'day') { S.day = +el.getAttribute('data-i'); S.open = null; S.swapOpen = null; render(); }
    else if (act === 'open') { const k = el.getAttribute('data-key'); S.open = S.open === k ? null : k; S.swapOpen = null; render(); }
    else if (act === 'swapopen') { const k = el.getAttribute('data-key'); S.swapOpen = S.swapOpen === k ? null : k; render(); }
    else if (act === 'portions') {
      const k = el.getAttribute('data-key');
      S.portions[k] = Math.min(8, Math.max(1, portionsOf(k) + (+el.getAttribute('data-d'))));
      render();
    }
    else if (act === 'like') {
      const on = store.toggleLike(el.getAttribute('data-id'));
      toast(t(on ? 'toast.liked' : 'toast.unliked')); kept(); render();
    }
    else if (act === 'unlike') { store.toggleLike(el.getAttribute('data-id')); toast(t('toast.unliked')); kept(); refresh('favs'); }
    else if (act === 'swap') {
      const d = +el.getAttribute('data-d'), i = +el.getAttribute('data-i'), r = el.getAttribute('data-r');
      const next = E.swapMeal(S.plan, P(), d, i, r);
      if (next) { S.plan = next; store.setSwaps(rec().swaps.concat([{ d: d, i: i, r: r }])); kept(); S.swapOpen = null; S.portions = {}; render(); toast(t('toast.swapped')); }
    }
    else if (act === 'welcomegoal') { S.draftGoal = el.getAttribute('data-goal') || null; location.hash = '#profile'; }
    else if (act === 'welcomeexample') { location.hash = '#plan'; }
    else if (act === 'newplan') {
      store.setSeed(rec().seedN + 1); store.setSwaps([]); store.snapshotLiked(); kept();
      S.open = null; S.swapOpen = null; S.portions = {}; buildPlan(); render(); toast(t('toast.newplan'));
    }
    else if (act === 'consent') {
      const yes = el.getAttribute('data-v') === 'yes';
      const ok = store.setConsent(yes);
      if (yes) { store.setLang(S.lang); toast(t(ok ? 'toast.consentYes' : 'toast.saveFail')); } else toast(t('toast.consentNo'));
      render();
    }
    else if (act === 'who') {
      if (store.setActive(el.getAttribute('data-id'))) { resetView(); buildPlan(); render(); kept(); }
    }
    else if (act === 'addperson') {
      const r = store.addProfile(t('prof.newName', { n: store.profiles().length + 1 }));
      if (r) { resetView(); buildPlan(); render(); toast(t('toast.personAdded')); kept(); }
    }
    else if (act === 'rename') {
      const v = document.getElementById('pname').value;
      store.renameProfile(rec().id, v); kept(); refresh('people');
    }
    else if (act === 'removeperson') {
      if (!S.removeArmed) { S.removeArmed = true; refresh('people'); return; }
      store.removeProfile(rec().id); resetView(); buildPlan(); render(); toast(t('toast.personRemoved')); kept();
    }
    else if (act === 'wadd') {
      const date = document.getElementById('wdate').value;
      const kg = parseFloat(String(document.getElementById('wkg').value).replace(',', '.'));
      S.wtErr = !store.addWeight(date, kg);
      if (!S.wtErr) kept();
      refresh('weight');
    }
    else if (act === 'wdel') { store.removeWeight(el.getAttribute('data-d')); kept(); refresh('weight'); }
    else if (act === 'mkbackup') { S.backup = store.exportJSON(); S.dataMsg = null; refresh('data'); }
    else if (act === 'dlbackup') { S.backup = store.exportJSON(); refresh('data'); downloadBackup(S.backup); }
    else if (act === 'cpbackup') {
      S.backup = store.exportJSON(); refresh('data');
      const ta = document.getElementById('backup');
      const say = function (k) { S.dataMsg = { k: k }; const m = document.getElementById('datamsg'); if (m) m.textContent = t(k); };
      const fail = function () { ta.select(); say('data.copyFail'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(S.backup).then(function () { say('data.copied'); }, fail); else fail();
    }
    else if (act === 'loadbackup') { applyBackupText(document.getElementById('backup').value); }
    else if (act === 'wipe') {
      if (!S.wipeArmed) { S.wipeArmed = true; refresh('data'); return; }
      store.wipe(); S.wipeArmed = false; S.dataMsg = { k: 'data.wiped' }; reload(false); toast(t('data.wiped'));
    }
    else if (act === 'cloudsave') {
      S.cloudBusy = true; S.cloudMsg = null; refresh('cloud');
      A.cloud.save(store.exportJSON()).then(function (r) {
        S.cloudBusy = false;
        S.cloudMsg = { k: r.ok ? 'cloud.saved' : (r.code === 'denied' ? 'cloud.denied' : 'cloud.err') };
        if (r.ok) S.cloudAt = r.at;
        refresh('cloud');
      });
    }
    else if (act === 'cloudload') {
      S.cloudBusy = true; S.cloudMsg = null; refresh('cloud');
      A.cloud.load().then(function (r) {
        S.cloudBusy = false;
        if (!r.ok) { S.cloudMsg = { k: r.code === 'empty' ? 'cloud.empty' : (r.code === 'denied' ? 'cloud.denied' : 'cloud.err') }; refresh('cloud'); return; }
        S.cloudAt = r.at;
        if (applyBackupText(r.blob, true)) { S.cloudMsg = { k: 'cloud.loaded' }; refresh('cloud'); }
        else refresh('cloud');
      });
    }
    else if (act === 'ioload') {
      const text = document.getElementById('io').value;
      S.io = text;
      const r = E.parsePrices(text);
      if (r.error) S.ioMsg = { k: r.errorCode === 'json' ? 'io.errJson' : 'io.errEmpty' };
      else {
        const ov = clone(store.prices());
        Object.keys(r.overrides).forEach(function (s) { ov[s] = ov[s] || {}; Object.keys(r.overrides[s]).forEach(function (id) { ov[s][id] = r.overrides[s][id]; }); });
        store.setPrices(ov); kept(); buildPrices();
        S.ioMsg = { loaded: r.applied, skipped: r.skipped };
        S.io = '';
      }
      render();
    }
    else if (act === 'iocopy') {
      const text = JSON.stringify(store.prices(), null, 2);
      const ta = document.getElementById('io');
      ta.value = text; S.io = text;
      const say = function (k) { S.ioMsg = { k: k }; document.getElementById('iomsg').textContent = ioMsgText(); };
      const done = function () { say('io.copied'); };
      const fail = function () { ta.select(); say('io.copyFail'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fail); else fail();
    }
    else if (act === 'ioreset') {
      if (!S.resetArmed) { S.resetArmed = true; render(); return; }
      store.setPrices({}); kept(); buildPrices(); S.resetArmed = false; S.ioMsg = { k: 'io.removed' }; render();
    }
  });

  document.addEventListener('change', function (ev) {
    const el = ev.target;
    if (el.id === 'lang') {
      S.lang = I.setLang(el.value);
      store.setLang(S.lang); kept();
      renderChrome();
      render();
      return;
    }
    if (el.id === 'bfile') {
      const f = el.files && el.files[0];
      if (!f) return;
      if (f.size > 2000000) { S.dataMsg = { k: 'data.err.big' }; refresh('data'); return; }
      const rd = new FileReader();
      rd.onload = function () { S.backup = String(rd.result || ''); S.dataMsg = null; refresh('data'); };
      rd.onerror = function () { S.dataMsg = { k: 'data.err.format' }; refresh('data'); };
      rd.readAsText(f);
      return;
    }
    if (el.name === 'goal' && el.closest && el.closest('#pform')) {
      S.draftGoal = el.value;
      const note = document.getElementById('goalnote');
      if (note) note.hidden = el.value !== 'muscle';
      return;
    }
    const act = el.getAttribute && el.getAttribute('data-act');
    if (act === 'check') {
      const c = clone(rec().checked);
      if (el.checked) c[el.getAttribute('data-id')] = true; else delete c[el.getAttribute('data-id')];
      store.setChecked(c); kept();
      el.closest('.item').classList.toggle('done', el.checked);
    }
    else if (act === 'price') {
      const s = el.getAttribute('data-s'), id = el.getAttribute('data-id');
      const ov = clone(store.prices());
      const v = parseFloat(String(el.value).replace(',', '.'));
      if (v > 0 && v < 500) { ov[s] = ov[s] || {}; ov[s][id] = { price: Math.round(v * 100) / 100, packG: A.ING[id].packG, source: 'you' }; el.classList.add('mine'); }
      else { if (ov[s]) delete ov[s][id]; el.value = ''; el.classList.remove('mine'); }
      store.setPrices(ov); kept(); buildPrices();
    }
  });

  document.addEventListener('input', function (ev) {
    if (ev.target.id === 'filter') {
      S.filter = ev.target.value;
      const pos = ev.target.selectionStart;
      render();
      const f = document.getElementById('filter');
      f.focus(); try { f.setSelectionRange(pos, pos); } catch (e) { /* not supported for this input type */ }
    }
    else if (ev.target.id === 'backup') S.backup = ev.target.value;
  });

  document.addEventListener('submit', function (ev) {
    if (ev.target.id !== 'pform') return;
    ev.preventDefault();
    const fd = new FormData(ev.target);
    const p = {
      sex: fd.get('sex'), age: Number(fd.get('age')), heightCm: Number(fd.get('height')), weightKg: Number(fd.get('weight')),
      activity: fd.get('activity'), goal: fd.get('goal'), diet: fd.get('diet'),
      allergies: fd.getAll('allergy'), lactoseFree: fd.get('lactose') === '1',
      dislikes: fd.getAll('dislike'), favorites: fd.getAll('favorite'), meals: fd.getAll('meal'), cuisines: fd.getAll('cuisine'),
      people: Number(fd.get('people')), budget: Math.max(0, Number(fd.get('budget')) || 0),
    };
    const errors = E.validateProfile(p);
    const box = document.getElementById('errors');
    if (errors.length) { box.innerHTML = errors.map(function (e) { return '<span>' + esc(t('err.' + e.code)) + '</span>'; }).join(''); return; }
    if (!store.setProfile(p)) { box.innerHTML = '<span>' + esc(t('err.missing')) + '</span>'; return; }
    store.setSeed(1); store.setSwaps([]); store.snapshotLiked(); kept();
    S.draftGoal = null;
    resetView();
    buildPlan();
    location.hash = '#plan';
    if (S.view === 'plan') render();
    toast(S.plan.error ? t('toast.check') : t('toast.ready'));
  });

  window.addEventListener('hashchange', route);
  renderChrome();
  buildPrices();
  buildPlan();
  route();
  if (A.cloud) A.cloud.init(function (ok) { if (ok) refresh('cloud'); });
  if (A.help) A.help.init({ view: S.view, hint: isExample(), goTo: function (v) { if (location.hash === '#' + v) route(); else location.hash = '#' + v; } });
})();
