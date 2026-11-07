/*
 * Ateria helper: a small assistant inside the app for people who get stuck.
 *
 *  1. It answers from the question list in data/i18n_help.js. That works offline, in all four languages, and
 *     never sends anything anywhere. Typed questions are matched by words (accents ignored), in any language.
 *  2. Answers can be read aloud (the browser's speech synthesis, when it exists).
 *  3. When the page runs where Claude is available (the `sample` capability), an extra button "Ask Claude instead"
 *     appears for questions the list cannot answer. Claude only gets: the question, the language, the screen
 *     the person is on, and the question list as notes. Never the person's health details or plan. It is told
 *     not to give medical advice and not to state nutrition numbers. Its answer is labelled as AI.
 *
 * Pure functions (match, suggest, buildPrompt) are exported for the tests; the panel needs a DOM.
 */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});
  const Hlp = (A.help = {});

  // ---------- matching ----------
  function norm(s) {
    return String(s == null ? '' : s).toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  Hlp.norm = norm;

  let prepared = null;
  function topics() {
    if (prepared) return prepared;
    prepared = A.I18N.help.map(function (t) {
      const qw = {};
      t.q.forEach(function (q) { norm(q).split(' ').forEach(function (w) { if (w.length >= 4) qw[w] = true; }); });
      return { id: t.id, icon: t.icon, actions: t.actions, q: t.q, a: t.a, kw: t.kw.map(norm).filter(Boolean), qw: qw };
    });
    return prepared;
  }
  Hlp.topics = function () { return topics(); };
  Hlp.topic = function (id) { return topics().filter(function (t) { return t.id === id; })[0] || null; };

  // Topics that fit the question, best first: [{ id, score }]. `view` (plan|shop|prices|profile) breaks ties.
  Hlp.match = function (query, view) {
    const q = norm(query);
    if (!q) return [];
    const tokens = q.split(' ');
    const padded = ' ' + q + ' ';
    const out = [];
    topics().forEach(function (t) {
      let score = 0;
      t.kw.forEach(function (k) {
        if (k.indexOf(' ') >= 0) { if (padded.indexOf(' ' + k + ' ') >= 0) score += 3; return; }
        if (tokens.indexOf(k) >= 0) { score += 2; return; }
        if (k.length >= 4 && tokens.some(function (w) { return w.length >= 4 && (w.indexOf(k) === 0 || k.indexOf(w) === 0); })) score += 1;
      });
      const seen = {};
      tokens.forEach(function (w) { if (t.qw[w] && !seen[w]) { seen[w] = true; score += 0.5; } });
      if (score > 0 && view && t.actions.indexOf(view) >= 0) score += 0.4;
      if (score > 0) out.push({ id: t.id, score: score });
    });
    return out.sort(function (a, b) { return b.score - a.score; });
  };

  // Question ids to offer as buttons for the screen the person is on, most useful first.
  const BY_VIEW = {
    plan: ['swap', 'portions', 'spices', 'units', 'newplan', 'numbers'],
    shop: ['shopping', 'prices', 'budget'],
    prices: ['prices', 'shopping'],
    profile: ['profile', 'allergies', 'cuisine', 'save', 'backup', 'people', 'weight'],
  };
  Hlp.suggest = function (view) {
    const first = BY_VIEW[view] || ['start', 'profile'];
    const ids = ['start'].concat(first).concat(topics().map(function (t) { return t.id; }));
    return ids.filter(function (id, i) { return ids.indexOf(id) === i; });
  };

  // The notes and instructions sent to Claude. No personal data goes in here, only the question and the screen name.
  Hlp.buildPrompt = function (question, view, langName) {
    const lang = A.i18n.lang();
    const idx = A.LANGS.map(function (l) { return l.id; }).indexOf(lang);
    const notes = topics().map(function (t) { return '- ' + t.q[idx] + ' ' + t.a[idx].replace(/\n/g, ' '); }).join('\n');
    return [
      'You are the help assistant inside a meal-planning app called Ateria. Answer in ' + langName + '.',
      'Only help the person use the app: where to tap, what a word or screen means. Use short, plain sentences (at most 90 words), no markdown and no lists longer than four steps.',
      'Never give medical, diet or nutrition advice and never state calorie or nutrient numbers. For health questions say they should ask a doctor or a dietitian.',
      'If the notes below do not contain the answer, say you are not sure and point to the closest topic. The person is on the "' + view + '" screen. The app has four screens: Plan, Shop, Prices and You.',
      'Notes about the app:', notes, '', 'The person asks: ' + String(question).slice(0, 300),
    ].join('\n');
  };

  // ---------- panel (needs a DOM) ----------
  if (typeof document === 'undefined') return;

  const LOCALES = { en: 'en-GB', fi: 'fi-FI', sv: 'sv-SE', vi: 'vi-VN' };
  const st = { open: false, log: [], showAll: false, view: 'plan', ai: null, aiBusy: false, aiLast: 0, speaking: -1, goTo: null };
  let els = null;
  function T(k, p) { return A.i18n.t(k, p); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function langIdx() { return A.LANGS.map(function (l) { return l.id; }).indexOf(A.i18n.lang()); }
  function icon(id, px) { return '<span class="tile" style="--t:' + px + 'px">' + A.icon(id, px - 8) + '</span>'; }
  function canSpeak() { return !!(g.speechSynthesis && g.SpeechSynthesisUtterance); }

  function answerHtml(entry, index) {
    const t = Hlp.topic(entry.id);
    const idx = langIdx();
    let h = '<div class="msg bot"><span class="who">' + icon(t.icon, 36) + '</span><div class="bubble"><b class="qline">' + esc(t.q[idx]) + '</b>' +
      t.a[idx].split('\n').map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    const bits = [];
    t.actions.forEach(function (v) {
      bits.push('<button type="button" class="hbtn go" data-help="go" data-view="' + v + '">' + esc(T('help.open', { where: T('nav.' + (v === 'profile' ? 'you' : v)) })) + '</button>');
    });
    if (canSpeak()) bits.push('<button type="button" class="hbtn say" data-help="say" data-i="' + index + '" aria-pressed="' + (st.speaking === index) + '">' + A.icon('speaker', 18) + '<span>' + esc(st.speaking === index ? T('help.stop') : T('help.listen')) + '</span></button>');
    if (bits.length) h += '<div class="acts">' + bits.join('') + '</div>';
    if (entry.related && entry.related.length) {
      h += '<p class="rel">' + esc(T('help.related')) + '</p><div class="chipsrow">' + entry.related.map(function (id) {
        return '<button type="button" class="hchip" data-help="q" data-id="' + id + '">' + esc(Hlp.topic(id).q[idx]) + '</button>';
      }).join('') + '</div>';
    }
    if (entry.ai && st.ai) h += '<div class="acts"><button type="button" class="hbtn" data-help="ai" data-i="' + index + '">' + esc(T('help.ai')) + '</button></div>';
    return h + '</div></div>';
  }

  function entryHtml(e, i) {
    if (e.kind === 'you') return '<div class="msg you"><div class="bubble">' + esc(e.text) + '</div></div>';
    if (e.kind === 'hello') return '<div class="msg bot"><span class="who">' + icon('helper', 36) + '</span><div class="bubble"><p>' + esc(T('help.hello')) + '</p></div></div>';
    if (e.kind === 'nomatch') return '<div class="msg bot"><span class="who">' + icon('helper', 36) + '</span><div class="bubble"><p>' + esc(T('help.nomatch')) + '</p>' +
      (st.ai ? '<div class="acts"><button type="button" class="hbtn" data-help="ai" data-i="' + i + '">' + esc(T('help.ai')) + '</button></div>' : '') + '</div></div>';
    if (e.kind === 'ai') {
      return '<div class="msg bot"><span class="who">' + icon('helper', 36) + '</span><div class="bubble ai"><b class="qline">' + esc(T('help.aiLabel')) + '</b>' +
        (e.text ? e.text.split('\n').map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') : '<p class="muted">' + esc(T('help.aiBusy')) + '</p>') +
        (e.text && canSpeak() ? '<div class="acts"><button type="button" class="hbtn say" data-help="say" data-i="' + i + '" aria-pressed="' + (st.speaking === i) + '">' + A.icon('speaker', 18) + '<span>' + esc(st.speaking === i ? T('help.stop') : T('help.listen')) + '</span></button></div>' : '') +
        '<p class="small muted">' + esc(T('help.aiNote')) + '</p></div></div>';
    }
    if (e.kind === 'aierr') return '<div class="msg bot"><span class="who">' + icon('helper', 36) + '</span><div class="bubble"><p>' + esc(T(e.k)) + '</p></div></div>';
    return answerHtml(e, i);
  }

  function chipsHtml() {
    const idx = langIdx();
    const ids = Hlp.suggest(st.view);
    const shown = st.showAll ? ids : ids.slice(0, 5);
    return shown.map(function (id) { return '<button type="button" class="hchip" data-help="q" data-id="' + id + '">' + esc(Hlp.topic(id).q[idx]) + '</button>'; }).join('') +
      '<button type="button" class="hchip more" data-help="more">' + esc(st.showAll ? T('help.less') : T('help.more')) + '</button>';
  }

  function render() {
    if (!els) return;
    els.fabLabel.textContent = T('help.btn');
    els.fab.setAttribute('aria-label', T('help.btn'));
    els.panel.setAttribute('aria-label', T('help.panel'));
    els.title.textContent = T('help.title');
    if (!els.hint.hidden) els.hint.textContent = T('help.hint');
    els.close.setAttribute('aria-label', T('help.close'));
    els.input.placeholder = T('help.ph');
    els.input.setAttribute('aria-label', T('help.ph'));
    els.send.textContent = T('help.send');
    els.fab.setAttribute('aria-expanded', String(st.open));
    els.panel.hidden = !st.open;
    if (!st.open) return;
    const atBottom = els.log.scrollHeight - els.log.scrollTop - els.log.clientHeight < 60;
    els.log.innerHTML = st.log.map(entryHtml).join('');
    els.chips.innerHTML = chipsHtml();
    if (atBottom) els.log.scrollTop = els.log.scrollHeight;
  }

  function stopSpeaking() { try { if (canSpeak()) g.speechSynthesis.cancel(); } catch (e) { /* ignore */ } st.speaking = -1; }
  function speak(i) {
    if (!canSpeak()) return;
    if (st.speaking === i) { stopSpeaking(); render(); return; }
    stopSpeaking();
    const e = st.log[i];
    let text = '';
    if (e.kind === 'ai') text = e.text || '';
    else { const t = Hlp.topic(e.id); text = t.q[langIdx()] + '. ' + t.a[langIdx()].replace(/\n/g, ' '); }
    if (!text) return;
    try {
      const u = new g.SpeechSynthesisUtterance(text);
      u.lang = LOCALES[A.i18n.lang()] || 'en-GB';
      u.rate = 0.95;
      const voices = g.speechSynthesis.getVoices ? g.speechSynthesis.getVoices() : [];
      const base = u.lang.slice(0, 2);
      const v = voices.filter(function (x) { return x.lang && x.lang.toLowerCase().indexOf(base) === 0; })[0];
      if (v) u.voice = v;
      u.onend = u.onerror = function () { if (st.speaking === i) { st.speaking = -1; render(); } };
      st.speaking = i;
      g.speechSynthesis.speak(u);
    } catch (err) { st.speaking = -1; }
    render();
  }

  function ask(text) {
    text = String(text || '').trim().slice(0, 300);
    if (!text) return;
    stopSpeaking();
    st.log.push({ kind: 'you', text: text });
    const m = Hlp.match(text, st.view);
    if (!m.length) st.log.push({ kind: 'nomatch', question: text });
    else st.log.push({ kind: 'answer', id: m[0].id, related: m.slice(1, 3).map(function (x) { return x.id; }), ai: m[0].score < 2, question: text });
    render();
  }
  function askTopic(id) {
    const t = Hlp.topic(id);
    if (!t) return;
    stopSpeaking();
    st.log.push({ kind: 'you', text: t.q[langIdx()] });
    const rel = Hlp.match(t.q[0], st.view).filter(function (x) { return x.id !== id; }).slice(0, 2).map(function (x) { return x.id; });
    st.log.push({ kind: 'answer', id: id, related: rel });
    render();
  }

  // "Ask Claude instead": the question is taken from the message the button belongs to.
  function askAi(i) {
    if (!st.ai || st.aiBusy) return;
    let q = '';
    for (let j = i; j >= 0; j--) { if (st.log[j].question) { q = st.log[j].question; break; } }
    if (!q) return;
    if (Date.now() - st.aiLast < 3000) { st.log.push({ kind: 'aierr', k: 'help.aiLimit' }); render(); return; }
    st.aiLast = Date.now(); st.aiBusy = true;
    const entry = { kind: 'ai', text: '' };
    st.log.push(entry);
    render();
    const langName = A.LANGS[langIdx()].name;
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 45000);
    st.ai(Hlp.buildPrompt(q, st.view, langName), { cache: false, modelTier: 'quick', signal: ctrl ? ctrl.signal : undefined, onText: function (r) { entry.text = r.text; render(); } })
      .then(function (r) { entry.text = (r && r.text ? r.text : entry.text) || ''; if (!entry.text) { st.log.splice(st.log.indexOf(entry), 1); st.log.push({ kind: 'aierr', k: 'help.aiErr' }); } })
      .catch(function (err) {
        st.log.splice(st.log.indexOf(entry), 1);
        const code = err && err.code;
        if (code === 'not_granted' || code === 'capability_disabled') st.ai = null;
        st.log.push({ kind: 'aierr', k: code === 'rate_limited' ? 'help.aiLimit' : 'help.aiErr' });
      })
      .then(function () { clearTimeout(timer); st.aiBusy = false; render(); });
  }

  function setOpen(open, focus) {
    st.open = open;
    if (open && !st.log.length) st.log.push({ kind: 'hello' });
    if (!open) stopSpeaking();
    render();
    if (open && focus !== false) els.input.focus();
    if (!open && focus) els.fab.focus();
  }

  // A short "Need help?" bubble next to the button, for people who have not set up yet. It goes away by itself.
  let hintTimer = null;
  function hideHint() { clearTimeout(hintTimer); if (els) els.hint.hidden = true; }
  function showHint(ms) {
    if (!els || st.open) return;
    els.hint.textContent = T('help.hint');
    els.hint.hidden = false;
    hintTimer = setTimeout(hideHint, ms);
  }

  Hlp.open = function () { setOpen(true); };
  Hlp.close = function () { if (els) setOpen(false, true); };
  Hlp.setView = function (v) { st.view = v; if (els && st.open) render(); };
  Hlp.refresh = function () { render(); };

  Hlp.init = function (opts) {
    opts = opts || {};
    st.goTo = opts.goTo || function (v) { g.location.hash = '#' + v; };
    st.view = opts.view || 'plan';
    const root = document.createElement('div');
    root.className = 'help';
    root.innerHTML =
      '<div class="help-hint" hidden></div>' +
      '<button type="button" class="help-fab" id="help-fab" aria-haspopup="dialog" aria-expanded="false">' + A.icon('helper', 36) + '<span class="help-fab-label"></span></button>' +
      '<section class="help-panel" id="help-panel" role="dialog" aria-modal="false" hidden>' +
      '<header class="help-head"><span class="who">' + icon('helper', 40) + '</span><b class="help-title"></b><button type="button" class="help-x" aria-label="">×</button></header>' +
      '<div class="help-log" role="log" aria-live="polite"></div>' +
      '<div class="help-chips"></div>' +
      '<form class="help-form" autocomplete="off"><input type="text" maxlength="300" enterkeyhint="send"><button type="submit" class="btn primary small"></button></form></section>';
    document.body.appendChild(root);
    els = {
      root: root, hint: root.querySelector('.help-hint'), fab: root.querySelector('.help-fab'), fabLabel: root.querySelector('.help-fab-label'), panel: root.querySelector('.help-panel'),
      title: root.querySelector('.help-title'), close: root.querySelector('.help-x'), log: root.querySelector('.help-log'),
      chips: root.querySelector('.help-chips'), form: root.querySelector('.help-form'), input: root.querySelector('input'), send: root.querySelector('.help-form button'),
    };
    els.fab.addEventListener('click', function () { hideHint(); setOpen(!st.open); });
    els.close.addEventListener('click', function () { setOpen(false, true); });
    els.panel.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') setOpen(false, true); });
    els.form.addEventListener('submit', function (ev) { ev.preventDefault(); const v = els.input.value; els.input.value = ''; ask(v); });
    els.panel.addEventListener('click', function (ev) {
      const b = ev.target.closest('[data-help]');
      if (!b) return;
      const act = b.getAttribute('data-help');
      if (act === 'q') askTopic(b.getAttribute('data-id'));
      else if (act === 'more') { st.showAll = !st.showAll; render(); }
      else if (act === 'say') speak(+b.getAttribute('data-i'));
      else if (act === 'ai') askAi(+b.getAttribute('data-i'));
      else if (act === 'go') { const v = b.getAttribute('data-view'); setOpen(false, false); st.goTo(v); }
    });
    // Claude is optional: look for it once, quietly. Nothing is sent until the person presses "Ask Claude instead".
    try {
      if (g.claude && typeof g.claude.use === 'function') {
        g.claude.use('sample').then(function (s) { if (typeof s === 'function') { st.ai = s; render(); } }, function () { /* not available */ });
      }
    } catch (e) { /* not available */ }
    render();
    if (opts.hint) setTimeout(function () { showHint(9000); }, 1500);
  };
})(typeof window !== 'undefined' ? window : globalThis);
