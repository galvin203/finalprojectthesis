// What the app keeps about a person, and when. Run: node --test tests/store.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
['ingredients', 'spices', 'recipes', 'i18n_ui', 'i18n_food'].forEach((f) => require('../data/' + f + '.js'));
require('../js/store.js');
const A = globalThis.Ateria;

function fake() { const m = {}; return { m, getItem: (k) => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: (k) => { delete m[k]; } }; }
const P = { sex: 'female', age: 34, heightCm: 168, weightKg: 68, activity: 'sedentary', goal: 'lose', diet: 'omnivore', allergies: ['milk'], meals: ['breakfast', 'lunch', 'dinner'], people: 1, budget: 70, cuisines: ['nordic'] };

test('nothing is written to the device before the person says yes', () => {
  const s = fake(); const st = A.makeStore(s); st.init();
  assert.equal(st.consent(), null);
  st.setProfile(P); st.toggleLike('d_meatballs'); st.addWeight('2026-11-07', 68); st.setLang('fi'); st.setPrices({ s: { oats: { price: 1.5 } } });
  assert.deepEqual(Object.keys(s.m), [], 'something was written without consent');
  assert.equal(st.active().profile.age, 34, 'the app still works from memory');
});

test('saying no writes only the decision and keeps nothing else', () => {
  const s = fake(); const st = A.makeStore(s); st.init(); st.setProfile(P);
  st.setConsent(false);
  assert.deepEqual(Object.keys(s.m), ['ateria.v2.consent']);
  assert.equal(s.m['ateria.v2.consent'], 'no');
  st.addWeight('2026-11-07', 68); assert.deepEqual(Object.keys(s.m), ['ateria.v2.consent']);
  const again = A.makeStore(s); again.init(); assert.equal(again.consent(), 'no'); assert.equal(again.active().profile, null);
});

test('saying yes saves everything and a reload brings it back', () => {
  const s = fake(); const st = A.makeStore(s); st.init(); st.setProfile(P);
  assert.equal(st.setConsent(true), true);
  st.toggleLike('d_meatballs'); st.addWeight('2026-11-07', 68.04); st.setSeed(4); st.setLang('sv');
  const b = A.makeStore(s); b.init();
  assert.equal(b.consent(), 'yes');
  assert.equal(b.active().profile.age, 34);
  assert.deepEqual(b.active().profile.cuisines, ['nordic']);
  assert.deepEqual(b.active().liked, ['d_meatballs']);
  assert.deepEqual(b.active().weights, [{ d: '2026-11-07', kg: 68 }]);
  assert.equal(b.active().seedN, 4); assert.equal(b.lang(), 'sv');
});

test('hearts count for the plan only from the moment the plan was made', () => {
  const st = A.makeStore(fake()); st.init();
  st.toggleLike('d_meatballs');
  assert.deepEqual(st.active().planLiked, []);
  st.snapshotLiked();
  st.toggleLike('b_skyr_bowl');
  assert.deepEqual(st.active().planLiked, ['d_meatballs']);
  assert.deepEqual(st.active().liked.sort(), ['b_skyr_bowl', 'd_meatballs']);
  assert.equal(st.toggleLike('d_meatballs'), false);
  assert.equal(st.toggleLike('no_such_recipe'), false);
});

test('weights: real dates and plausible values only, one entry per day, sorted, removable', () => {
  const st = A.makeStore(fake()); st.init();
  assert.equal(st.addWeight('2026-02-31', 70), false);
  assert.equal(st.addWeight('2026-11-08', 900), false);
  assert.equal(st.addWeight('2026-11-08', 'x'), false);
  assert.equal(st.addWeight('11/08/2026', 70), false);
  assert.equal(st.addWeight('2026-11-09', 69.04), true);
  assert.equal(st.addWeight('2026-11-07', 70), true);
  assert.equal(st.addWeight('2026-11-09', 68.5), true); // same day replaces
  assert.deepEqual(st.active().weights, [{ d: '2026-11-07', kg: 70 }, { d: '2026-11-09', kg: 68.5 }]);
  st.removeWeight('2026-11-07'); assert.equal(st.active().weights.length, 1);
});

test('people: add, rename, switch, remove; at most six; the last one cannot be removed', () => {
  const st = A.makeStore(fake()); st.init();
  const first = st.active().id;
  const b = st.addProfile('Anna <b>'); assert.ok(b); assert.equal(st.active().id, b.id);
  assert.ok(!/[<>]/.test(b.name));
  st.setProfile(P); assert.equal(st.profiles().filter((r) => r.profile).length, 1, 'details belong to one person only');
  st.setActive(first); assert.equal(st.active().profile, null);
  for (let i = 0; i < 10; i++) st.addProfile('x' + i);
  assert.equal(st.profiles().length, 6); assert.equal(st.canAddProfile(), false); assert.equal(st.addProfile('more'), null);
  const ids = st.profiles().map((r) => r.id); assert.equal(new Set(ids).size, 6);
  st.renameProfile(ids[1], '  Mum  '); assert.equal(st.profiles()[1].name, 'Mum');
  while (st.profiles().length > 1) assert.equal(st.removeProfile(st.profiles()[0].id), true);
  assert.equal(st.removeProfile(st.profiles()[0].id), false);
  assert.equal(st.profiles().length, 1);
});

test('setProfile keeps the old details when the new ones are incomplete', () => {
  const st = A.makeStore(fake()); st.init();
  st.setProfile(P);
  assert.equal(st.setProfile({ sex: 'female' }), null);
  assert.equal(st.active().profile.age, 34);
});

test('imported text is cleaned: unknown fields dropped, bad values refused, no markup kept', () => {
  const st = A.makeStore(fake()); st.init();
  assert.deepEqual(st.parseImport(''), { ok: false, code: 'empty' });
  assert.equal(st.parseImport('{oops').code, 'json');
  assert.equal(st.parseImport('{"x":1}').code, 'format');
  assert.equal(st.parseImport('x'.repeat(2100000)).code, 'big');
  const evil = st.parseImport(JSON.stringify({ profiles: [{ id: '<b>', name: '<script>x</script>Ann', profile: { sex: 'x' }, swaps: [{ d: 99, i: 1, r: 'nope' }, { d: 1, i: 2, r: 'd_meatballs' }], liked: ['d_meatballs', 'zzz'], weights: [{ d: 'bad', kg: 1 }, { d: '2026-01-01', kg: 70 }], checked: { oats: true, nothing: true, milk: 'yes' } }], prices: { s: { oats: { price: -3 }, milk: { price: 2.5, packG: 1000 } }, evil: { oats: { price: 1 } } }, lang: 'xx' }));
  assert.ok(evil.ok);
  const r = evil.data.profiles[0];
  assert.ok(!/[<>]/.test(r.name)); assert.equal(r.profile, null);
  assert.deepEqual(r.swaps, [{ d: 1, i: 2, r: 'd_meatballs' }]);
  assert.deepEqual(r.liked, ['d_meatballs']);
  assert.deepEqual(r.weights, [{ d: '2026-01-01', kg: 70 }]);
  assert.deepEqual(r.checked, { oats: true });
  assert.deepEqual(Object.keys(evil.data.prices), ['s']); assert.deepEqual(Object.keys(evil.data.prices.s), ['milk']);
  assert.equal(evil.data.lang, null);
  assert.match(r.id, /^[a-z0-9_-]{1,24}$/i);
});

test('backup round trip keeps everything', () => {
  const s = fake(); const st = A.makeStore(s); st.init(); st.setProfile(P); st.setConsent(true);
  st.toggleLike('d_meatballs'); st.addWeight('2026-11-07', 68); st.setPrices({ k: { oats: { price: 1.99, packG: 1000, source: 'you' } } });
  const text = st.exportJSON();
  const other = A.makeStore(fake()); other.init();
  const r = other.parseImport(text); assert.ok(r.ok);
  other.applyImport(r.data);
  assert.deepEqual(other.data(), st.data());
});

test('details saved by version 1 are offered, kept only after yes, and the old keys are removed then', () => {
  const s = fake();
  s.setItem('ateria.v1.profile', JSON.stringify({ sex: 'male', age: 40, heightCm: 180, weightKg: 80, activity: 'active', goal: 'maintain', diet: 'omnivore', allergies: [], meals: ['lunch'], people: 2, budget: 50, dislikes: [], favorites: [] }));
  s.setItem('ateria.v1.lang', '"fi"'); s.setItem('ateria.v1.seedN', '3'); s.setItem('ateria.v1.checked', JSON.stringify({ oats: true }));
  const st = A.makeStore(s); const status = st.init();
  assert.equal(status.migrated, true); assert.equal(st.active().profile.age, 40); assert.equal(st.active().seedN, 3); assert.equal(st.lang(), 'fi');
  assert.deepEqual(Object.keys(s.m).filter((k) => k.includes('v2')), [], 'nothing written yet');
  st.setConsent(true);
  assert.deepEqual(Object.keys(s.m).filter((k) => k.includes('v1')), []);
  assert.ok(s.m['ateria.v2.data']);
  const again = A.makeStore(s); again.init(); assert.equal(again.active().profile.age, 40);
});

test('deleting everything removes both versions and starts again from the example', () => {
  const s = fake(); s.setItem('ateria.v1.profile', '{}');
  const st = A.makeStore(s); st.init(); st.setProfile(P); st.setConsent(true);
  st.wipe();
  assert.deepEqual(Object.keys(s.m), []); assert.equal(st.consent(), null); assert.equal(st.active().profile, null);
});

test('missing, blocked or full storage never crashes the app', () => {
  const none = A.makeStore(null); none.init();
  assert.equal(none.status().available, false);
  assert.equal(none.setConsent(true), false);
  none.setProfile(P); assert.equal(none.active().profile.age, 34);
  const throwing = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('quota'); }, removeItem() { throw new Error('blocked'); } };
  const st = A.makeStore(throwing); st.init();
  assert.equal(st.status().available, false);
  assert.equal(st.setConsent(true), false);
  assert.doesNotThrow(() => { st.setProfile(P); st.toggleLike('d_meatballs'); st.wipe(); });
  const full = fake(); full.setItem = (k, v) => { if (k.endsWith('data')) throw new Error('quota'); full.m[k] = String(v); };
  const f = A.makeStore(full); f.init(); f.setConsent(true); f.setProfile(P);
  assert.equal(f.status().error, 'write');
});

test('a damaged saved file is kept aside and the app starts fresh', () => {
  const s = fake(); s.setItem('ateria.v2.consent', 'yes'); s.setItem('ateria.v2.data', '{"profiles": [oops');
  const st = A.makeStore(s); const status = st.init();
  assert.equal(status.corrupt, true); assert.equal(st.active().profile, null);
  assert.equal(s.m['ateria.v2.data.bad'], '{"profiles": [oops');
});
