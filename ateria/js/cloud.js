/*
 * Ateria cloud copy: an optional second copy of the backup text in the person's own account.
 *
 *  - Only exists when the page runs on Claude (the `db` and `user` capabilities). Anywhere else A.cloud.ready stays
 *    false and the app hides the panel.
 *  - Never automatic: the app calls save() or load() only when the person presses a button.
 *  - One private document per person: data/users/<their id>/ateria  =  { v, updatedAt, blob }.
 *    The `data/users/` area is private to that person, even from the owner of the page.
 *  - `blob` is exactly what "Make backup" produces; loading it goes through the same cleaning as a pasted backup.
 */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});
  const C = (A.cloud = { ready: false });
  let ref = null;

  function withTimeout(p, ms) {
    return new Promise(function (resolve, reject) {
      const timer = setTimeout(function () { reject({ code: 'timeout' }); }, ms);
      p.then(function (v) { clearTimeout(timer); resolve(v); }, function (e) { clearTimeout(timer); reject(e); });
    });
  }
  function fail(e) {
    const code = e && e.code;
    return { ok: false, code: code === 'not_granted' || code === 'permission_denied' ? 'denied' : 'err' };
  }

  // Finds out once whether a private document can be used. Calls `done(bool)`.
  C.init = function (done) {
    done = done || function () {};
    if (!g.claude || typeof g.claude.use !== 'function') { done(false); return; }
    Promise.all([g.claude.use('db'), g.claude.use('user')]).then(function (r) {
      const db = r[0], user = r[1];
      if (!db || !user) return false;
      return user.id().then(function (id) {
        if (!id || typeof id !== 'string') return false;
        ref = db.doc('data/users/' + id + '/ateria');
        return true;
      });
    }).then(function (ok) { C.ready = !!ok; done(C.ready); }, function () { C.ready = false; done(false); });
  };

  // Writes the backup text. Resolves { ok: true, at } or { ok: false, code: 'denied' | 'err' }.
  C.save = function (text) {
    if (!ref) return Promise.resolve({ ok: false, code: 'err' });
    const at = new Date().toISOString();
    return withTimeout(ref.set({ v: 2, updatedAt: at, blob: String(text) }), 15000).then(function () { return { ok: true, at: at }; }, fail);
  };

  // Reads it back. Resolves { ok: true, blob, at } or { ok: false, code: 'empty' | 'denied' | 'err' }.
  C.load = function () {
    if (!ref) return Promise.resolve({ ok: false, code: 'err' });
    return withTimeout(ref.get(), 15000).then(function (snap) {
      const d = snap && snap.exists ? snap.data() : null;
      if (!d || typeof d.blob !== 'string' || !d.blob) return { ok: false, code: 'empty' };
      return { ok: true, blob: d.blob, at: typeof d.updatedAt === 'string' ? d.updatedAt : null };
    }, fail);
  };
})(typeof window !== 'undefined' ? window : globalThis);
