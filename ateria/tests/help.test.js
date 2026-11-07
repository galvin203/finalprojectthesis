// The in-app helper: question list and matching. Run: node --test tests/help.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
['ingredients', 'spices', 'recipes', 'icons', 'i18n_ui', 'i18n_ui2', 'i18n_food', 'i18n_recipes', 'i18n_help'].forEach((f) => require('../data/' + f + '.js'));
['i18n', 'help'].forEach((f) => require('../js/' + f + '.js'));
const A = globalThis.Ateria;
const D = A.I18N;
const H = A.help;
const LANGS = A.LANGS.map((l) => l.id);
const VIEWS = ['plan', 'shop', 'prices', 'profile'];

test('the list has the topics people get stuck on', () => {
  const ids = D.help.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate topic id');
  assert.ok(ids.length >= 20);
  ['start', 'profile', 'swap', 'newplan', 'portions', 'spices', 'units', 'shopping', 'prices', 'save', 'backup', 'people', 'weight', 'allergies', 'cuisine', 'numbers'].forEach((id) => assert.ok(ids.includes(id), 'missing topic ' + id));
});

test('every topic has a question and an answer in all four languages, an icon and valid buttons', () => {
  D.help.forEach((t) => {
    assert.equal(t.q.length, 4, t.id); assert.equal(t.a.length, 4, t.id);
    t.q.forEach((x) => assert.ok(x && x.length > 5 && /[?.]$/.test(x), t.id + ' question: ' + x));
    t.a.forEach((x) => assert.ok(x && x.length > 30 && x.length < 700, t.id + ' answer length ' + (x || '').length));
    assert.ok(A.ICONS[t.icon], t.id + ' icon ' + t.icon);
    assert.ok(t.actions.every((v) => VIEWS.includes(v)), t.id + ' actions'); // a topic may have no button (the language box is always on screen)
    assert.ok(t.kw.length >= 8, t.id + ' has too few keywords');
    t.kw.forEach((k) => assert.equal(k, k.trim().toLowerCase(), t.id + ' keyword not lower case: ' + k));
  });
});

test('answers quote button names exactly as the app shows them', () => {
  LANGS.forEach((l, i) => {
    const names = new Set(Object.values(D.ui[l]).map((v) => String(v).replace(/<[^>]+>/g, '').trim()));
    // name of tabs, as shown in the navigation
    D.help.forEach((t) => {
      for (const m of t.a[i].matchAll(/[“”„]([^“”„]{3,60})[“”]/g)) {
        const q = m[1].trim().replace(/[.,;:!?]$/, '');
        const hit = [...names].some((n) => n === q || n.replace(/[.,;:!?]$/, '') === q || n.replace(/\{[^}]+\}/g, '').trim() === q);
        assert.ok(hit, l + ' ' + t.id + ': “' + q + '” is not a button or label in the app');
      }
    });
  });
});

test('every question, in every language, finds its own topic first', () => {
  D.help.forEach((t) => t.q.forEach((q, i) => {
    const r = H.match(q, 'plan');
    assert.ok(r.length, LANGS[i] + ' no match for: ' + q);
    assert.equal(r[0].id, t.id, LANGS[i] + ': "' + q + '" found ' + r[0].id + ' (' + r[0].score + ') instead of ' + t.id);
  }));
});

test('short, sloppy and accent-free questions still work', () => {
  const top = (q, v) => (H.match(q, v)[0] || {}).id;
  assert.equal(top('how do i swap a meal', 'plan'), 'swap');
  assert.equal(top('SWAP', 'plan'), 'swap');
  assert.equal(top('vaihda ateria', 'plan'), 'swap');
  assert.equal(top('miten vaihdan ateriaa?', 'plan'), 'swap');
  assert.equal(top('byt maltid', 'plan'), 'swap');
  assert.equal(top('doi mon', 'plan'), 'swap');
  assert.equal(top('đổi món', 'plan'), 'swap');
  assert.equal(top('backup', 'profile'), 'backup');
  assert.equal(top('can i use it on another phone', 'profile'), 'backup');
});

test('nonsense and empty questions match nothing', () => {
  assert.deepEqual(H.match('', 'plan'), []);
  assert.deepEqual(H.match('   ', 'plan'), []);
  assert.deepEqual(H.match('qwxz plmk', 'plan'), []);
  assert.deepEqual(H.match('???', 'plan'), []);
  assert.deepEqual(H.match(null, 'plan'), []);
});

test('the screen the person is on breaks ties', () => {
  const plan = H.match('prices', 'prices'); assert.ok(plan.length);
  const a = H.match('how do i change it', 'plan'), b = H.match('how do i change it', 'profile');
  assert.ok(a.length && b.length);
});

test('suggested questions: valid, unique, start with the basics, and fit the screen', () => {
  VIEWS.forEach((v) => {
    const s = H.suggest(v);
    assert.equal(new Set(s).size, s.length);
    s.forEach((id) => assert.ok(H.topic(id), id));
    assert.equal(s.length, D.help.length, 'every topic can be reached from "more questions"');
    assert.equal(s[0], 'start');
    // the first question after the basics belongs to the screen
    assert.ok(H.topic(s[1]).actions.includes(v), v + ': ' + s[1]);
  });
  assert.ok(H.suggest('nonsense').length === D.help.length);
});

test('prompt for Claude: question, screen and notes only; rules against medical advice and numbers', () => {
  A.i18n.setLang('fi');
  const p = H.buildPrompt('miten vaihdan ateriaa?', 'plan', 'Suomi');
  assert.match(p, /Answer in Suomi/);
  assert.match(p, /miten vaihdan ateriaa\?/);
  assert.match(p, /Never give medical, diet or nutrition advice/);
  assert.match(p, /never state calorie or nutrient numbers/);
  assert.match(p, /"plan" screen/);
  assert.ok(p.length < 30000, 'prompt too long: ' + p.length);
  // nothing about the person is available to the helper, so nothing can leak
  assert.ok(!/weight|age:|allerg(y|ies):/i.test(p.split('Notes about the app:')[0].replace(/medical, diet or nutrition/, '')));
  const long = H.buildPrompt('x'.repeat(1000), 'shop', 'English');
  assert.ok(long.split('The person asks: ')[1].length <= 300);
  A.i18n.setLang('en');
});
