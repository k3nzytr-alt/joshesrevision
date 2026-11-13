(() => {
"use strict";

/* ================= helpers ================= */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const SUBJ = Object.fromEntries(SUBJECTS.map(s => [s.id, s]));
const SEC = {}; SUBJECTS.forEach(x => x.topics.forEach(t => SEC[x.id + "|" + t[1]] = t[0]));
const papersOf = sid => { const p = sid && SUBJ[sid] ? [...new Set(SUBJ[sid].topics.map(t => t[0]).filter(n => /^Paper \d/.test(n)))] : []; return p.length > 1 ? p : []; };
// a topic is "in" a paper if it's listed under it, or under a shared section (practicals, maths skills) that can come up in any paper
const inPaper = (sid, t, paper) => { if (!paper) return true; const sec = SEC[sid + "|" + t] || ""; return sec === paper || !/^Paper \d/.test(sec); };
function evPaper(e) {
  if (!e.s || !papersOf(e.s).length) return "";
  const m = ["bio", "chem", "phys"].includes(e.s) && /Combined Science/.test(e.t) ? / (\d)$/.exec(e.t) : /(?:Paper|Component) (\d)/.exec(e.t);
  const p = m ? "Paper " + m[1] : ""; return papersOf(e.s).includes(p) ? p : "";
}
const pad = n => String(n).padStart(2, "0");
const dkey = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const today = () => dkey(new Date());
const fmtMin = sec => { const m = Math.floor(sec / 60); return m >= 60 ? Math.floor(m / 60) + "h " + (m % 60) + "m" : m + " min"; };
const qkey = q => q.s + "|" + q.q;
function video(sid, topic) {
  const ex = (window.VIDEO_LINKS || {})[sid + "|" + topic];
  if (ex && ex.length) return { label: ex[0][0].split(":")[0].replace(" (YouTube)", ""), url: ex[0][1], exact: true };
  const o = VIDEO_Q[sid + "|" + topic]; const v = VIDEOS[sid];
  if (!o && !v) return null;
  const clean = topic.replace(/\((H|F)\)/g, "").replace(/&/g, "and").replace(/\s+/g, " ").trim();
  const [label, q] = o || [v.label, v.q(clean)];
  return { label, url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(q) };
}
const watchLink = (sid, topic, cls = "watch") => { const v = video(sid, topic); return v ? `<a class="${cls}" href="${v.url}" target="_blank" rel="noopener" title="Watch a video on ${esc(topic)} (${esc(v.label)})"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>${esc(v.label)}</a>` : ""; };

const ICONS = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  quiz: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  cards: '<rect x="3" y="7" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
  topics: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2"/><circle cx="4.5" cy="12" r="1.2"/><circle cx="4.5" cy="18" r="1.2"/>',
  focus: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  flame: '<path fill="currentColor" stroke="none" d="M12 2c1 3.5 5 6 5 11a5 5 0 0 1-10 0c0-2.2 1.1-3.7 2.3-4.8.2 1.6 1 2.8 2.2 3.3C11 9 11 5.5 12 2z"/>',
  star: '<path fill="currentColor" stroke="none" d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12l5 5 9-11"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  medal: '<circle cx="12" cy="15" r="6"/><path d="M8.5 10L6 3h4l2 4 2-4h4l-2.5 7"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  play: '<path fill="currentColor" stroke="none" d="M7 4l13 8-13 8z"/>',
  pause: '<path d="M8 4v16M16 4v16"/>',
  reset: '<path d="M4 4v6h6"/><path d="M5 15a8 8 0 1 0 2-8.5L4 10"/>',
  bio: '<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15"/><path d="M5 19l8-8"/>',
  chem: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>',
  phys: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
  maths: '<path d="M4 7h6M7 4v6M14 7h6M5 15l4 4M9 15l-4 4M14 16h6M14 19h6"/>',
  dt: '<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
  pe: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
  geog: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  paper: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  video: '<rect x="3" y="5" width="18" height="14" rx="3"/><path fill="currentColor" stroke="none" d="M10 9v6l5-3z"/>',
  exam: '<path d="M9 4h6v3H9z"/><path d="M15 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="M9 13l2 2 4-4"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  pencil: '<path d="M4 20l4-1L19 8a2.1 2.1 0 0 0-3-3L5 16z"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  eng: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  lit: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/>'
};
const svg = n => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[n] || "") + "</svg>";

/* ================= state ================= */
const KEY = "rhq-v1";
const STREAK_XP = 10;
const LIT_T = (SUBJECTS.find(x => x.id === "lit") || { topics: [] }).topics.map(t => t[1]);
const blank = () => ({
  v: 1, name: "Josh", goal: 100, xp: 0, sec: 0, days: {}, rag: {}, missed: {}, boxes: {}, badges: {}, subjStats: {}, papers: [], donePapers: {}, exam: {}, events: [], weekMin: 25,
  stats: { answered: 0, correct: 0, quizzes: 0, perfect: 0, bestCombo: 0, cards: 0, focus: 0, bestStreak: 0, subjQuiz: {} },
  updated: 0
});
function normalise(d) {
  const b = blank();
  const out = Object.assign(b, d || {});
  out.stats = Object.assign(blank().stats, (d && d.stats) || {});
  if (!out.exDone) { out.exDone = {}; Object.keys(out.exam || {}).forEach(k => { out.exDone[k] = out.exam[k].d || 1; }); }
  if (!out.litSplit) {  // English split into Language + Literature: move Lit topic ratings and missed questions across
    const r = out.rag && out.rag.eng;
    if (r) { const lit = {}; Object.keys(r).forEach(i => { if (+i >= 8) { lit[+i - 8] = r[i]; delete r[i]; } }); if (Object.keys(lit).length) out.rag.lit = Object.assign(out.rag.lit || {}, lit); }
    const litQ = new Set((window.QUESTIONS || []).filter(q => q.s === "lit").map(q => q.q));
    Object.keys(out.missed || {}).forEach(k => { if (k.startsWith("eng|") && litQ.has(k.slice(4))) { out.missed["lit|" + k.slice(4)] = out.missed[k]; delete out.missed[k]; } });
    Object.keys(out.exam || {}).forEach(k => { const t = k.split("|")[1]; if (k.startsWith("eng|") && LIT_T.includes(t)) { out.exam["lit|" + k.slice(4)] = out.exam[k]; delete out.exam[k]; } });
    out.litSplit = 1;
  }
  return out;
}
function loadLocal() {
  try { const raw = localStorage.getItem(KEY); if (raw) return normalise(JSON.parse(raw)); } catch (e) {}
  return blank();
}
let S = loadLocal();
let remote = null, writing = false, pendingWrite = false, remoteT = null, synced = false;

function saveLocal() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function save() { S.updated = Date.now(); saveLocal(); queueRemote(); }
function queueRemote() { if (!remote) return; clearTimeout(remoteT); remoteT = setTimeout(flushRemote, 2500); }
async function flushRemote() {
  if (!remote) return;
  if (writing) { pendingWrite = true; return; }
  writing = true;
  try { await remote.set(JSON.parse(JSON.stringify(S))); setSync(true); }
  catch (e) { if (e && e.code === "invalid_argument") { remote = null; setSync(false); } }
  writing = false;
  if (pendingWrite) { pendingWrite = false; flushRemote(); }
}
function setSync(on) { synced = on; const el = $("#sync"); if (el) el.innerHTML = syncHTML(); }
const syncHTML = () => '<span class="sync-dot' + (synced ? " on" : "") + '"></span>' + (synced ? (ACC.user ? "Synced as " + esc(ACC.user) : "Saved to your account") : ACC.server ? "Not synced · sign in" : "Saved on this device");

/* ---------- own-server accounts (when hosted with server.js) ---------- */
const ACC = { server: false, signups: true, token: "", user: "" };
try { ACC.token = localStorage.getItem("rhq-token") || ""; ACC.user = localStorage.getItem("rhq-user") || ""; } catch (e) {}
async function apiFetch(method, path, body) {
  const r = await fetch(path, { method, headers: { "Content-Type": "application/json", ...(ACC.token ? { Authorization: "Bearer " + ACC.token } : {}) }, body: body ? JSON.stringify(body) : undefined });
  let j = {}; try { j = await r.json(); } catch (e) {}
  if (r.status === 401 && ACC.token && path !== "/api/login") { signOutLocal(); }
  return { ok: r.ok, status: r.status, j };
}
const serverRemote = {
  async set(data) {
    const r = await apiFetch("PUT", "/api/progress", { data });
    if (r.status === 409 && r.j.data && (r.j.updated || 0) > (S.updated || 0)) { S = normalise(r.j.data); saveLocal(); render(); toast("check", "Synced", "Loaded newer progress from another device."); }
    else if (!r.ok && r.status !== 409) throw Object.assign(new Error("sync"), { code: r.status === 401 ? "invalid_argument" : "net" });
  }
};
async function pullServer(preferServer) {
  const r = await apiFetch("GET", "/api/progress");
  if (!r.ok) return false;
  const d = r.j.data, upd = r.j.updated || 0;
  if (d && (preferServer || upd > (S.updated || 0))) { S = normalise(d); saveLocal(); render(); }
  else if (!d || (S.updated || 0) > upd) await flushRemote();
  setSync(true); return true;
}
function signOutLocal() { ACC.token = ""; ACC.user = ""; remote = null; try { localStorage.removeItem("rhq-token"); localStorage.removeItem("rhq-user"); } catch (e) {} setSync(false); }
async function authSubmit(mode, username, password) {
  const r = await apiFetch("POST", mode === "register" ? "/api/register" : "/api/login", { username, password });
  if (!r.ok) return r.j.error || "Couldn't reach the server.";
  ACC.token = r.j.token; ACC.user = r.j.username; try { localStorage.setItem("rhq-token", ACC.token); localStorage.setItem("rhq-user", ACC.user); localStorage.removeItem("rhq-noauth"); } catch (e) {}
  remote = serverRemote;
  if (mode === "register") { S.updated = Date.now(); saveLocal(); await flushRemote(); setSync(true); }   // new account starts from this device's progress
  else await pullServer(true);                                                                       // signing in loads your saved progress
  closeAuth(); render(); toast("check", mode === "register" ? "Account created" : "Signed in", "Progress now syncs across your devices.");
  return null;
}
let authMode = "login";
function openAuth(mode) {
  authMode = mode || (ACC.signups ? "login" : "login");
  let el = $("#auth"); if (!el) { el = document.createElement("div"); el.id = "auth"; el.className = "modal-bg auth-bg"; document.body.appendChild(el); }
  el.innerHTML = `<form class="modal auth" id="auth-form" autocomplete="on">
    <div class="auth-mark">${svg("star")}</div>
    <h2>${authMode === "register" ? "Create your account" : "Sign in to sync"}</h2>
    <p class="muted">${authMode === "register" ? "Your progress on this device becomes your account. Then sign in on your phone with the same details." : "Pick up your streak, XP and progress on any device."}</p>
    <label>Username<input id="au-user" name="username" autocomplete="username" required minlength="3" maxlength="24" value="${esc(ACC.user || "")}"></label>
    <label>Password<input id="au-pass" name="password" type="password" autocomplete="${authMode === "register" ? "new-password" : "current-password"}" required minlength="6"></label>
    <div class="auth-err" id="au-err" role="alert"></div>
    <button class="btn" type="submit" style="width:100%;justify-content:center">${authMode === "register" ? "Create account" : "Sign in"}</button>
    ${ACC.signups ? `<button class="mini-link" type="button" data-auth="${authMode === "register" ? "login" : "register"}">${authMode === "register" ? "Already have an account? Sign in" : "New here? Create an account"}</button>` : ""}
    <button class="mini-link muted" type="button" data-auth="skip">Use on this device only</button>
  </form>`;
  el.hidden = false; setTimeout(() => { const u = $("#au-user"); if (u) (u.value ? $("#au-pass") : u).focus(); }, 50);
}
function closeAuth() { const el = $("#auth"); if (el) el.remove(); }
document.addEventListener("submit", async e => {
  if (e.target.id !== "auth-form") return; e.preventDefault();
  const btn = e.target.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = "One sec…";
  let err; try { err = await authSubmit(authMode, $("#au-user").value, $("#au-pass").value); } catch (x) { err = "Couldn't reach the server."; }
  if (err) { $("#au-err").textContent = err; btn.disabled = false; btn.textContent = authMode === "register" ? "Create account" : "Sign in"; }
});
document.addEventListener("click", e => {
  const b = e.target.closest("[data-auth]"); if (!b) return;
  if (b.dataset.auth === "skip") { try { localStorage.setItem("rhq-noauth", "1"); } catch (x) {} closeAuth(); }
  else openAuth(b.dataset.auth);
});
async function connectServer() {
  if (!/^https?:$/.test(location.protocol)) return false;
  try {
    const r = await fetch("/api/health", { cache: "no-store" }); if (!r.ok) return false;
    const j = await r.json(); if (!j || !j.ok) return false;
    ACC.server = true; ACC.signups = j.signups !== false; setSync(false);
  } catch (e) { return false; }
  if (ACC.token) { remote = serverRemote; if (!(await pullServer(false))) { if (!ACC.token) openAuth("login"); } }
  else { let skip = false; try { skip = !!localStorage.getItem("rhq-noauth"); } catch (e) {} if (!skip) openAuth(S.updated ? "register" : "login"); }
  // when you come back to the tab, grab anything another device saved
  addEventListener("visibilitychange", () => { if (!document.hidden && remote === serverRemote) pullServer(false); });
  addEventListener("focus", () => { if (remote === serverRemote) pullServer(false); });
  return true;
}

async function connect(tries = 0) {
  if (tries === 0 && await connectServer()) return;
  const c = window.claude;
  if (!c || typeof c.use !== "function") { if (tries < 6) setTimeout(() => connect(tries + 1), 1500); return; }
  try {
    const [db, user] = await Promise.all([c.use("db"), c.use("user")]);
    if (!db || !user) return;
    const id = await user.id();
    if (!id) return;
    const ref = db.doc("data/users/" + id + "/progress");
    const snap = await ref.get();
    remote = ref;
    if (snap.exists) {
      const d = snap.data();
      if (d && (d.updated || 0) > (S.updated || 0)) { S = normalise(JSON.parse(JSON.stringify(d))); saveLocal(); render(); }
      else if ((S.updated || 0) > ((d && d.updated) || 0)) flushRemote();
    } else if (S.updated) flushRemote();
    setSync(true);
  } catch (e) { /* stay local */ }
}

/* ================= progress maths ================= */
const lvlXP = L => 50 * L * (L - 1);
const levelOf = xp => { let L = 1; while (xp >= lvlXP(L + 1)) L++; return L; };
const RANKS = [[1, "Fresher"], [3, "Grinder"], [5, "Scholar"], [8, "Brainbox"], [12, "Topic Slayer"], [16, "Examiner's Nightmare"], [20, "Grade 9 Legend"]];
const rankOf = L => RANKS.filter(r => L >= r[0]).pop()[1];
const dayRec = k => { const d = (S.days[k] = S.days[k] || { xp: 0, sec: 0, q: 0, c: 0 }); d.subjQ = d.subjQ || {}; d.topicC = d.topicC || {}; d.deckC = d.deckC || {}; d.fsec = d.fsec || 0; d.tasks = d.tasks || {}; d.subjSec = d.subjSec || {}; return d; };
function streak() {
  const hit = k => ((S.days[k] && S.days[k].xp) || 0) >= STREAK_XP;
  const d = new Date(); let n = 0;
  if (!hit(dkey(d))) d.setDate(d.getDate() - 1);
  while (hit(dkey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const todayDone = () => ((S.days[today()] || {}).xp || 0) >= STREAK_XP;
function weekSec() {
  const d = new Date(); const dow = (d.getDay() + 6) % 7; let t = 0;
  for (let i = 0; i <= dow; i++) { const x = new Date(); x.setDate(x.getDate() - i); t += (S.days[dkey(x)] || {}).sec || 0; }
  return t;
}
function confidence(sid) {
  const s = SUBJ[sid]; const r = S.rag[sid] || {}; let v = 0;
  s.topics.forEach((t, i) => { if (r[i] === "G") v += 1; else if (r[i] === "A") v += 0.5; });
  return Math.round(v / s.topics.length * 100);
}
function accuracy(sid) { const st = S.subjStats[sid]; return st && st.a ? Math.round(st.c / st.a * 100) : null; }

function addXP(n, at) {
  const before = levelOf(S.xp);
  const wasDone = todayDone();
  S.xp += n; dayRec(today()).xp += n;
  if (at) floatXP("+" + n + " XP", at);
  const after = levelOf(S.xp);
  updateStatus();
  if (!wasDone && todayDone()) { const st = streak(); if (st > S.stats.bestStreak) S.stats.bestStreak = st; toast("flame", "Streak: " + st + " day" + (st === 1 ? "" : "s"), "Today's revision counts."); }
  if (after > before) levelUp(after);
  checkBadges();
}
let secSinceSave = 0;
function addSec(n, sid) {
  const dr = dayRec(today()); S.sec += n; dr.sec += n; secSinceSave += n;
  if (sid && SUBJ[sid]) { dr.subjSec[sid] = (dr.subjSec[sid] || 0) + n; if (dr.subjSec[sid] % 60 === 0) checkPlan(); }
  if (S.sec % 60 === 0) { updateStatus(); checkBadges(); }
  if (secSinceSave >= 30) { secSinceSave = 0; save(); }
}

/* ================= badges ================= */
const BADGES = [
  ["first", "First steps", "Finish your first quiz", () => S.stats.quizzes >= 1],
  ["perfect", "Flawless", "Score 100% on a 10-question quiz", () => S.stats.perfect >= 1],
  ["combo10", "On fire", "Get 10 right in a row", () => S.stats.bestCombo >= 10],
  ["streak3", "Hat-trick", "Hit a 3-day streak", () => S.stats.bestStreak >= 3],
  ["streak7", "Full week", "Hit a 7-day streak", () => S.stats.bestStreak >= 7],
  ["streak14", "Unstoppable", "Hit a 14-day streak", () => S.stats.bestStreak >= 14],
  ["q100", "Century", "Answer 100 questions", () => S.stats.answered >= 100],
  ["q500", "Question machine", "Answer 500 questions", () => S.stats.answered >= 500],
  ["min60", "One hour in", "Revise for 60 minutes in total", () => S.sec >= 3600],
  ["min600", "Ten-hour shift", "Revise for 10 hours in total", () => S.sec >= 36000],
  ["cards50", "Card shark", "Review 50 flashcards", () => S.stats.cards >= 50],
  ["focus", "Deep focus", "Finish a full focus session", () => S.stats.focus >= 1],
  ["allsubj", "All-rounder", "Do a quiz in every subject", () => SUBJECTS.every(s => S.stats.subjQuiz[s.id])],
  ["green10", "Going green", "Mark 10 topics green", () => Object.values(S.rag).reduce((n, r) => n + Object.values(r).filter(v => v === "G").length, 0) >= 10],
  ["plan1", "Daily grind", "Finish a full daily plan", () => Object.values(S.days).some(d => d.planDone)],
  ["plan7", "Routine machine", "Finish 7 daily plans", () => Object.values(S.days).filter(d => d.planDone).length >= 7],
  ["paper1", "Exam ready", "Finish a past paper", () => (S.papers || []).length >= 1],
  ["paper5", "Paper pro", "Finish 5 past papers", () => (S.papers || []).length >= 5],
  ["exam10", "Mark scheme master", "Self-mark 10 exam questions", () => Object.keys(S.exam || {}).length >= 10],
  ["exam50", "Exam machine", "Self-mark 50 exam questions", () => Object.keys(S.exam || {}).length >= 50],
  ["exfull", "Full marks", "Get full marks on a 6+ mark question", () => EXQ.some(q => q.m >= 6 && ((S.exam || {})[exKey(q)] || {}).b >= q.m)],
  ["lvl5", "Scholar", "Reach level 5", () => levelOf(S.xp) >= 5],
  ["lvl10", "Double digits", "Reach level 10", () => levelOf(S.xp) >= 10]
];
function checkBadges() {
  let changed = false;
  BADGES.forEach(([id, name, desc, test]) => {
    if (!S.badges[id] && test()) { S.badges[id] = today(); changed = true; toast("medal", "Badge unlocked: " + name, desc); }
  });
  if (changed) save();
}

/* ================= question generators ================= */
function opts(correct, cands) {
  const out = [String(correct)];
  for (const c of cands) { const s = String(c); if (!out.includes(s) && s !== "NaN") out.push(s); if (out.length === 4) break; }
  let k = 1;
  while (out.length < 4) { const s = String(correct) + (k === 1 ? " " : "") + "·".repeat(k); if (!out.includes(s)) out.push(s); k++; }
  return out;
}
const numOpts = (ans, cands, unit = "") => {
  const extra = typeof ans === "number" ? [ans + 1, ans - 1, ans + 2, ans * 10, ans + 5] : [];
  return opts(ans + unit, cands.concat(extra).map(c => c + unit));
};
const r1 = x => Math.round(x * 10) / 10;
const sup = n => String(n).replace(/-/g, "⁻").replace(/\d/g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
const lin = (m, c, v = "n") => (m === 1 ? "" : m === -1 ? "−" : String(m).replace("-", "−")) + v + (c === 0 ? "" : c > 0 ? " + " + c : " − " + (-c));
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const frac = (a, b) => { const g = gcd(a, b); return (a / g) + "/" + (b / g); };

const GEN = [
  { s: "maths", t: "Decimals, percentages & FDP", f() { const p = pick([5, 10, 15, 20, 25, 30, 40, 60, 75]); const n = ri(2, 30) * 20; const a = p * n / 100;
    return { q: `What is ${p}% of ${n}?`, o: numOpts(a, [a * 2, n - a, r1(n / p), a + n / 10]), e: `${p}% = ${p / 100}, and ${p / 100} × ${n} = ${a}.` }; } },
  { s: "maths", t: "Percentage change & reverse %", f() { const a = ri(4, 20) * 10; const p = pick([10, 20, 25, 30, 40, 50]); const up = Math.random() < .5; const b = a * (1 + (up ? p : -p) / 100);
    return { q: `A price changes from £${a} to £${b}. What is the percentage ${up ? "increase" : "decrease"}?`, o: numOpts(p, [r1(Math.abs(b - a) / b * 100), p + 10, p / 2, Math.abs(b - a)], "%"), e: `Change ÷ original × 100 = ${Math.abs(b - a)} ÷ ${a} × 100 = ${p}%.` }; } },
  { s: "maths", t: "Factors, multiples, primes, HCF & LCM", f() { const k = pick([2, 3, 4, 5, 6, 8]); const pr = pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [3, 7]]); const a = k * pr[0], b = k * pr[1];
    if (Math.random() < .5) return { q: `What is the HCF of ${a} and ${b}?`, o: numOpts(k, [k * pr[0], a * b, k * 2, pr[0]]), e: `Biggest number that divides both: ${k}.` };
    const l = k * pr[0] * pr[1]; return { q: `What is the LCM of ${a} and ${b}?`, o: numOpts(l, [a * b, k, l * 2, a + b]), e: `Smallest number in both times tables: ${l}.` }; } },
  { s: "maths", t: "Solving equations", f() { const a = ri(2, 9), x = ri(-4, 12), b = ri(-10, 15), c = a * x + b;
    return { q: `Solve ${a}x ${b >= 0 ? "+ " + b : "− " + (-b)} = ${c}`, o: numOpts("x = " + x, ["x = " + (x + 1), "x = " + (c - b), "x = " + (-x), "x = " + (x - 2), "x = " + (x + 2), "x = " + (c + b), "x = " + (x * 2 + 1)]), e: `Undo ${b >= 0 ? "+" + b : b}: ${a}x = ${c - b}. Divide by ${a}: x = ${x}.` }; } },
  { s: "maths", t: "Sequences (nth term)", f() { const d = pick([2, 3, 4, 5, 6, 7, -2, -3]), c = ri(-5, 9); const seq = [1, 2, 3, 4].map(n => d * n + c).join(", ");
    return { q: `Find the nth term of ${seq}, …`, o: opts(lin(d, c), [lin(d, c + d), lin(c + d, d), lin(d, -c), lin(d + 1, c - 1), lin(d, c + 1), lin(-d, c), lin(d - 1, c + 2)]), e: `Difference is ${d}, so ${d}n. Then adjust: ${d} × 1 ${c >= 0 ? "+" : "−"} ${Math.abs(c)} = ${d + c}.` }; } },
  { s: "maths", t: "Pythagoras", f() { const t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]); const k = pick([1, 1, 2, 3]); const [a, b, c] = t.map(v => v * k);
    return { q: `A right-angled triangle has shorter sides ${a} cm and ${b} cm. How long is the hypotenuse?`, o: numOpts(c, [a + b, c + 1, Math.round(Math.sqrt(Math.abs(b * b - a * a))), c * 2], " cm"), e: `c² = ${a}² + ${b}² = ${a * a + b * b}, so c = ${c}.` }; } },
  { s: "maths", t: "Area & circumference", f() { const r = ri(2, 12); const A = (Math.PI * r * r).toFixed(1);
    return { q: `Find the area of a circle with radius ${r} cm (1 d.p.)`, o: numOpts(A, [(2 * Math.PI * r).toFixed(1), (Math.PI * 4 * r * r).toFixed(1), (Math.PI * r).toFixed(1), (Math.PI * (r + 1) * (r + 1)).toFixed(1), (2 * Math.PI * r * r).toFixed(1)], " cm²"), e: `A = πr² = π × ${r}² = ${A}.` }; } },
  { s: "maths", t: "Averages & range", f() { const xs = Array.from({ length: 5 }, () => ri(2, 20)); const rem = xs.reduce((a, b) => a + b, 0) % 5; xs[4] += (5 - rem) % 5; const sum = xs.reduce((a, b) => a + b, 0); const m = sum / 5; const sorted = xs.slice().sort((a, b) => a - b);
    return { q: `Find the mean of ${xs.join(", ")}`, o: numOpts(m, [sorted[2], sorted[4] - sorted[0], m + 1, sum]), e: `Total ${sum} ÷ 5 = ${m}.` }; } },
  { s: "maths", t: "Ratio & proportion", f() { const a = ri(1, 5), b = ri(a + 1, 8), k = ri(2, 12) * 5, T = (a + b) * k;
    return { q: `Share £${T} in the ratio ${a}:${b}. How much is the larger share?`, o: numOpts("£" + b * k, ["£" + a * k, "£" + T / 2, "£" + k, "£" + (b * k + k)]), e: `${a + b} parts, so 1 part = £${k}. Larger = ${b} × ${k} = £${b * k}.` }; } },
  { s: "maths", t: "Compound measures", f() { const t = pick([2, 3, 4, 5]), v = ri(3, 16) * 5, d = v * t;
    return { q: `A car travels ${d} km in ${t} hours. What is its average speed?`, o: numOpts(v, [d * t, v + 10, d - t, v * 2], " km/h"), e: `Speed = distance ÷ time = ${d} ÷ ${t}.` }; } },
  { s: "maths", t: "Powers, roots & standard form", f() { const m = ri(11, 99) / 10, k = ri(3, 7); const n = Math.round(m * Math.pow(10, k));
    return { q: `Write ${n.toLocaleString("en-GB")} in standard form.`, o: opts(`${m} × 10${sup(k)}`, [`${m} × 10${sup(k + 1)}`, `${m} × 10${sup(k - 1)}`, `${m} × 10${sup(-k)}`]), e: `Move the decimal point ${k} places: power ${k}.` }; } },
  { s: "maths", t: "Simplifying & expanding", f() { const a = ri(2, 9), b = ri(1, 9), sign = Math.random() < .5 ? 1 : -1; const s = sign > 0 ? "+" : "−";
    return { q: `Expand ${a}(x ${s} ${b})`, o: opts(`${a}x ${s} ${a * b}`, [`${a}x ${s} ${b}`, `x ${s} ${a * b}`, `${a}x ${s} ${a + b}`, `${a}x ${s === "+" ? "−" : "+"} ${a * b}`, `${a + 1}x ${s} ${a * b}`]), e: `Multiply both terms by ${a}.` }; } },
  { s: "maths", t: "Angles & parallel lines", f() { const a = ri(25, 80), b = ri(25, 150 - a);
    return { q: `Two angles in a triangle are ${a}° and ${b}°. Find the third angle.`, o: numOpts(180 - a - b, [360 - a - b, a + b, 90 - Math.min(a, b), 180 - a], "°"), e: `Angles in a triangle add to 180°.` }; } },
  { s: "maths", t: "Probability & Venn diagrams", f() { const r = ri(2, 9); let b = ri(2, 9); if (b === r) b = r + 1;
    return { q: `A bag has ${r} red and ${b} blue counters. What is P(red)?`, o: opts(frac(r, r + b), [frac(b, r + b), r + "/" + b, "1/" + r, (r + b) + "/" + r, r + "/" + (r + b + 1)]), e: `Favourable ÷ total = ${r}/${r + b}.` }; } },
  { s: "maths", t: "Linear graphs, gradient & intercept", f() { const m = pick([1, 2, 3, -1, -2, 4]); const x1 = ri(-3, 2), x2 = x1 + ri(1, 4), c = ri(-4, 5); const y1 = m * x1 + c, y2 = m * x2 + c;
    return { q: `Find the gradient of the line through (${x1}, ${y1}) and (${x2}, ${y2}).`, o: numOpts(m, [-m, c, m * 2, r1((x2 - x1) / (y2 - y1))]), e: `Change in y ÷ change in x = ${y2 - y1} ÷ ${x2 - x1} = ${m}.` }; } },

  { s: "phys", t: "Newton's laws", f() { const m = ri(2, 30) * 50, a = ri(1, 6);
    return { q: `A ${m} kg object accelerates at ${a} m/s². What is the resultant force?`, o: numOpts(m * a, [m + a, r1(m / a), m * a * 2], " N"), e: `F = m × a = ${m} × ${a}.` }; } },
  { s: "phys", t: "Newton's laws", f() { const m = ri(3, 95);
    return { q: `What is the weight of a ${m} kg mass on Earth? (g = 10 N/kg)`, o: numOpts(m * 10, [m, r1(m / 10), m * 100], " N"), e: `W = m × g = ${m} × 10.` }; } },
  { s: "phys", t: "Wave properties", f() { const f = ri(2, 50) * 10, l = pick([0.5, 1, 1.5, 2, 3, 4]);
    return { q: `A wave has frequency ${f} Hz and wavelength ${l} m. What is its speed?`, o: numOpts(r1(f * l), [r1(f / l), f + l, r1(l / f * 100)], " m/s"), e: `v = f × λ = ${f} × ${l}.` }; } },
  { s: "phys", t: "Work, power & efficiency", f() { const t = pick([2, 4, 5, 10, 20]), P = ri(2, 30) * 10, E = P * t;
    return { q: `A device transfers ${E} J in ${t} s. What is its power?`, o: numOpts(P, [E * t, E - t, P * 2], " W"), e: `P = E ÷ t = ${E} ÷ ${t}.` }; } },
  { s: "phys", t: "Work, power & efficiency", f() { const tot = pick([200, 400, 500, 800, 1000]), p = pick([10, 20, 25, 40, 60, 75]), u = tot * p / 100;
    return { q: `A motor takes in ${tot} J and transfers ${u} J usefully. What is its efficiency?`, o: numOpts(p, [100 - p, r1(tot / u), p * 2], "%"), e: `${u} ÷ ${tot} × 100 = ${p}%.` }; } },
  { s: "phys", t: "Energy stores & transfers", f() { const m = ri(1, 10) * 2, v = ri(2, 10);
    return { q: `What is the kinetic energy of a ${m} kg object moving at ${v} m/s?`, o: numOpts(m * v * v / 2, [m * v * v, m * v / 2, m * v], " J"), e: `KE = ½ × ${m} × ${v}² = ${m * v * v / 2} J.` }; } },
  { s: "phys", t: "Momentum", f() { const m = ri(2, 80), v = ri(2, 15);
    return { q: `Find the momentum of a ${m} kg object moving at ${v} m/s.`, o: numOpts(m * v, [m + v, r1(m / v), m * v * 2], " kg m/s"), e: `p = m × v = ${m} × ${v}.` }; } },
  { s: "phys", t: "Speed, velocity & acceleration", f() { const t = ri(2, 8), a = ri(1, 6), dv = a * t;
    return { q: `A cyclist speeds up from rest to ${dv} m/s in ${t} s. What is the acceleration?`, o: numOpts(a, [dv * t, dv + t, a * 2], " m/s²"), e: `a = Δv ÷ t = ${dv} ÷ ${t}.` }; } },
  { s: "phys", t: "Electric circuits", f() { const I = ri(1, 6), R = ri(2, 12) * 2;
    return { q: `A current of ${I} A flows through a ${R} Ω resistor. What is the potential difference?`, o: numOpts(I * R, [r1(R / I), I + R, I * R * 2], " V"), e: `V = I × R = ${I} × ${R}.` }; } },
  { s: "phys", t: "Half-life", f() { const a0 = pick([400, 800, 1600, 3200, 640]), n = ri(1, 4);
    return { q: `A source has an activity of ${a0} Bq. What is its activity after ${n} half-li${n === 1 ? "fe" : "ves"}?`, o: numOpts(a0 / Math.pow(2, n), [a0 / (2 * n + 2), a0 - 100 * n, a0 / Math.pow(2, n + 1), a0 / Math.pow(2, n - 1)], " Bq"), e: `Halve it ${n} time${n > 1 ? "s" : ""}.` }; } },

  { s: "lit", t: "Romeo and Juliet themes", f() { const q = pick(RJ_QUOTES); const who = q[1].split(",")[0];
    const pool = ["Romeo", "Juliet", "Mercutio", "Tybalt", "Capulet", "Nurse", "Friar Lawrence", "Prince", "Benvolio"].filter(x => x !== who);
    return { q: `Who says: “${q[0]}”?`, o: opts(who, shuffle(pool)), e: `${q[1]}: ${q[2]}.` }; } },
  { s: "lit", t: "Journey's End essay", f() { const NAMES = ["Stanhope", "Osborne", "Raleigh", "Hibbert", "Trotter", "Hardy"]; const cand = JE_QUOTES.map(q => [q, NAMES.find(n => q[1].startsWith(n))]).filter(x => x[1]); const [q, who] = pick(cand);
    return { q: `Who says: “${q[0]}”?`, o: opts(who, shuffle(NAMES.filter(n => n !== who))), e: `${q[1]} (${q[2]}).` }; } },
  { s: "lit", t: "Frankenstein themes", f() { const q = pick(FR_QUOTES); const who = q[1];
    return { q: `Who says: “${q[0]}”?`, o: opts(who, shuffle(["Victor", "The monster", "Walton", "Elizabeth"].filter(x => x !== who))), e: `${who}, ${q[2]}.` }; } },
  { s: "lit", t: "Conflict poetry", f() { const p = pick(POEMS);
    return { q: `Who wrote “${p[0]}”?`, o: opts(p[1], shuffle(POEMS.filter(x => x[1] !== p[1]).map(x => x[1]))), e: `${p[2]}. ${p[3]}.` }; } }
];

/* ================= views state ================= */
let view = "home";
let quiz = null;      // active quiz runner
let qsetup = { sid: "all", topic: "", n: 10, mode: "mixed" };
let fc = null;        // active flashcard runner
let topicSid = "bio", topicPaper = "";
const focus = { len: 25 * 60, left: 25 * 60, running: false, tick: 0, sid: "" };
let lastAct = Date.now();
["pointerdown", "keydown", "wheel", "touchstart"].forEach(e => addEventListener(e, () => { lastAct = Date.now(); }, { passive: true }));

/* ================= shell ================= */
const NAV = [["home", "Home", "home"], ["quiz", "Quizzes", "quiz"], ["cards", "Flashcards", "cards"], ["topics", "Topics", "topics"], ["videos", "Videos", "video"], ["exam", "Exam Qs", "exam"], ["papers", "Papers", "paper"], ["calendar", "Calendar", "cal"], ["focus", "Focus", "focus"], ["trophies", "Trophies", "trophy"]];
function renderRail() {
  let ff = $("#ftf"); if (!ff) { ff = document.createElement("div"); ff.id = "ftf"; document.body.appendChild(ff); }
  ff.innerHTML = floatTimer();
  const rail = $("#rail");
  const L = levelOf(S.xp);
  rail.innerHTML = `<button class="me${view === "profile" ? " active" : ""}" data-act="nav" data-v="profile" title="Your stats"><div class="avatar">${esc((S.name || "J")[0].toUpperCase())}</div><div><b>${esc(S.name)}</b><span>Level ${L} · ${rankOf(L)}</span></div>${svg("chev")}</button>` +
    NAV.map(([id, label, ic]) => `<button class="nav-btn${view === id ? " active" : ""}" data-act="nav" data-v="${id}" aria-current="${view === id ? "page" : "false"}">${svg(ic)}<span>${label}</span>${id === "focus" ? navTimer() : ""}</button>`).join("") +
    `<div class="rail-foot"><strong id="goal-foot">${goalLine()}</strong><span id="sync">${syncHTML()}</span></div>`;
}
const fmtLeft = () => pad(Math.floor(focus.left / 60)) + ":" + pad(focus.left % 60);
const floatTimer = () => (focus.running || focus.left < focus.len) && view !== "focus" ? `<button class="ftfloat${focus.running ? "" : " paused"}" data-act="nav" data-v="focus" aria-label="Focus timer">${svg("clock")}<b id="nav-ftime2">${fmtLeft()}</b></button>` : "";
const navTimer = () => focus.running || focus.left < focus.len ? `<b class="nav-timer${focus.running ? "" : " paused"}" id="nav-ftime">${fmtLeft()}</b>` : "";
const goalLine = () => { const x = (S.days[today()] || {}).xp || 0; return `Today: ${Math.min(x, S.goal)} / ${S.goal} XP`; };

function topbar(title, sub) {
  const st = streak(), L = levelOf(S.xp);
  return `<header class="topbar"><h1>${title}${sub ? `<span class="sub">${sub}</span>` : ""}</h1>
    <span class="pill flame${todayDone() ? "" : " cold"}" id="p-streak" title="Day streak">${svg("flame")}<span class="val num">${st}</span><small>day streak</small></span>
    <span class="pill xp" id="p-xp" title="Total XP">${svg("star")}<span class="val num">${S.xp.toLocaleString("en-GB")}</span><small>XP · Lv ${L}</small></span>
    <span class="pill min" id="p-min" title="Total time revised">${svg("clock")}<span class="val num">${fmtMin(S.sec)}</span><small>revised</small></span>
  </header>`;
}
function updateStatus() {
  const st = $("#p-streak"); if (st) { st.className = "pill flame" + (todayDone() ? "" : " cold"); st.querySelector(".val").textContent = streak(); }
  const xp = $("#p-xp"); if (xp && xp.querySelector(".val").textContent !== S.xp.toLocaleString("en-GB")) { xp.classList.remove("bump"); void xp.offsetWidth; xp.classList.add("bump"); }
  if (xp) { xp.querySelector(".val").textContent = S.xp.toLocaleString("en-GB"); xp.querySelector("small").textContent = "XP · Lv " + levelOf(S.xp); }
  const mn = $("#p-min"); if (mn) mn.querySelector(".val").textContent = fmtMin(S.sec);
  const gf = $("#goal-foot"); if (gf) gf.textContent = goalLine();
}

let animNext = true, animT = null;
function render() {
  renderRail();
  const main = $("#main");
  let html = "";
  if (view === "home") html = homeView();
  else if (view === "quiz") html = quiz ? (quiz.done ? quizResult() : quizRunner()) : quizSetup();
  else if (view === "cards") html = fc ? (fc.done ? cardsResult() : cardRunner()) : decksView();
  else if (view === "topics") html = topicsView();
  else if (view === "papers") html = papersView();
  else if (view === "videos") html = videosView();
  else if (view === "exam") html = examView();
  else if (view === "calendar") html = calView();
  else if (view === "profile") html = profileView();
  else if (view === "focus") html = focusView();
  else if (view === "trophies") html = trophiesView();
  main.innerHTML = html;
  if (animNext) { animNext = false; main.classList.remove("enter"); void main.offsetWidth; main.classList.add("enter"); clearTimeout(animT); animT = setTimeout(() => main.classList.remove("enter"), 1300); }
  if (view === "exam") initPads();
}
function go(v) {
  if (v !== view) { if (v !== "quiz") quiz = quiz && !quiz.done ? quiz : null; }
  if (v !== view) animNext = true;
  view = v;
  if (location.hash !== "#" + v) history.replaceState(null, "", "#" + v);
  render(); window.scrollTo(0, 0);
}


/* ================= DAILY PLAN ================= */
function seeded(str) { let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; }
/* weekly minutes per subject (Mon–Sun) */
const weekKeys = () => { const now = new Date(), dow = (now.getDay() + 6) % 7; return Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - dow + i); return dkey(d); }); };
const weekMins = sid => Math.floor(weekKeys().reduce((a, k) => a + (((S.days[k] || {}).subjSec || {})[sid] || 0), 0) / 60);
const weekTarget = () => S.weekMin || 25;
const daysLeftInWeek = () => 7 - (new Date().getDay() + 6) % 7;
function behind() {  // subjects sorted by how far behind this week's target they are, weakest first on ties
  const T = weekTarget();
  return SUBJECTS.map(s => ({ id: s.id, left: Math.max(0, T - weekMins(s.id)), weak: (accuracy(s.id) ?? 60) + confidence(s.id) * .5 }))
    .sort((a, b) => b.left - a.left || a.weak - b.weak);
}
function timeTask() {
  const b = behind().filter(x => x.left > 0); if (!b.length) return null;
  // spread what's left this week over the days left: at least 10 min, at most 30, in 5-min steps
  const totalLeft = b.reduce((a, x) => a + x.left, 0), perDay = totalLeft / daysLeftInWeek();
  const x = b[0]; const min = Math.max(10, Math.min(30, x.left, Math.ceil(Math.max(perDay, 10) / 5) * 5));
  return { s: x.id, min: Math.min(min, x.left) };
}
function makePlan(k) {
  const rnd = seeded("plan" + k);
  const bh = behind(), lagging = bh.filter(x => x.left > 0);
  const ranked = (lagging.length >= 2 ? lagging : bh).slice();
  const time = timeTask();
  const pool = ranked.filter(x => !time || x.id !== time.s);
  const quizS = (pool[Math.floor(rnd() * Math.min(3, pool.length))] || ranked[0]).id;
  const cands = [];
  SUBJECTS.forEach(s => s.topics.forEach((t, i) => {
    if (!topicHasQs(s.id, t[1]) || s.id === quizS) return;
    const r = (S.rag[s.id] || {})[i]; const w = r === "R" ? 4 : r === "A" ? 1.5 : r === "G" ? .3 : 2.2;
    cands.push([s.id, t[1], w]);
  }));
  let tot = cands.reduce((a, c) => a + c[2], 0) * rnd(), topic = cands[0];
  for (const c of cands) { tot -= c[2]; if (tot <= 0) { topic = c; break; } }
  const decks = DECKS.slice().sort((a, b) => deckMastery(a) / a.cards.length - deckMastery(b) / b.cards.length).slice(0, 4);
  const deck = decks[Math.floor(rnd() * decks.length)].id;
  return { quiz: quizS, topic: [topic[0], topic[1]], deck, time, v: 2 };
}
function todayPlan() { const d = dayRec(today()); if (!d.plan || !d.plan.v) { d.plan = makePlan(today()); saveLocal(); } return d; }
const TASK_XP = 15, PLAN_BONUS = 40;
function planTasks() {
  const d = todayPlan(), p = d.plan; const deck = DECKS.find(x => x.id === p.deck) || DECKS[0];
  return [
    { id: "quiz", icon: SUBJ[p.quiz].id, c: SUBJ[p.quiz].color, title: `Answer 10 ${SUBJ[p.quiz].name} questions`, sub: `Behind this week · ${weekMins(p.quiz)}/${weekTarget()} min so far`, n: d.subjQ[p.quiz] || 0, of: 10, act: `data-act="plan-quiz" data-s="${p.quiz}"` },
    { id: "topic", icon: "target", c: SUBJ[p.topic[0]].color, title: `Topic of the day: ${p.topic[1]}`, sub: `${SUBJ[p.topic[0]].name} · watch the video, then get 3 right`, n: d.topicC[p.topic.join("|")] || 0, of: 3, act: `data-act="plan-topic" data-s="${p.topic[0]}" data-t="${esc(p.topic[1])}"`, watch: watchLink(p.topic[0], p.topic[1]) },
    { id: "cards", icon: "cards", c: SUBJ[deck.s].color, title: `Review 10 cards: ${deck.name}`, sub: "Flashcards", n: d.deckC[deck.id] || 0, of: 10, act: `data-act="open-deck" data-d="${deck.id}"` },
    p.time ? { id: "focus", icon: p.time.s, c: SUBJ[p.time.s].color, title: `${p.time.min} min of ${SUBJ[p.time.s].name}`, sub: `Pick ${SUBJ[p.time.s].short} in Focus, or do its quizzes/exam Qs · ${weekMins(p.time.s)}/${weekTarget()} min this week`, n: Math.floor((d.subjSec[p.time.s] || 0) / 60), of: p.time.min, act: `data-act="plan-focus" data-s="${p.time.s}" data-n="${p.time.min}"` }
      : { id: "focus", icon: "focus", c: "#4f7dff", title: "15 minutes of focus time", sub: "Every subject's hit its weekly target. Nice.", n: Math.floor(d.fsec / 60), of: 15, act: `data-act="plan-focus"` }
  ];
}
function checkPlan() {
  const d = dayRec(today()); if (!d.plan) return;
  let gained = false;
  planTasks().forEach(t => { if (t.n >= t.of && !d.tasks[t.id]) { d.tasks[t.id] = 1; gained = true; addXP(TASK_XP); toast("check", "Daily task done", t.title + " · +" + TASK_XP + " XP"); } });
  if (!d.planDone && ["quiz", "topic", "cards", "focus"].every(id => d.tasks[id])) {
    d.planDone = 1; addXP(PLAN_BONUS); toast("trophy", "Daily plan complete!", "+" + PLAN_BONUS + " XP bonus. See you tomorrow."); confetti();
  }
  if (gained) save();
}
function planCard() {
  const d = todayPlan(), tasks = planTasks(), done = tasks.filter(t => d.tasks[t.id]).length;
  return `<section class="plan">
    <div class="plan-head">
      <div><div class="eyebrow">Today's revision</div><h2>${done === 4 ? "All done. Legend." : done ? `${4 - done} task${4 - done === 1 ? "" : "s"} to go` : "Your plan for today"}</h2>
      <p>${done === 4 ? "You earned the full bonus. Anything else today is extra XP." : `Each task is worth +${TASK_XP} XP, plus a +${PLAN_BONUS} XP bonus when you finish all four.`}</p></div>
      <div class="plan-ring">${ring(done / 4, 92, 9, "#fff", "rgba(255,255,255,.18)")}<b class="num">${done}/4</b></div>
    </div>
    <div class="tasks">${tasks.map(t => { const ok = !!d.tasks[t.id]; return `<div class="task${ok ? " ok" : ""}" style="--c:${t.c}">
      <div class="task-ico">${svg(ok ? "check" : t.icon)}</div>
      <div class="task-body"><b>${esc(t.title)}</b><span>${esc(t.sub)}</span>
        <div class="task-bar"><i style="width:${Math.min(100, t.n / t.of * 100)}%"></i></div></div>
      <div class="task-side"><span class="num">${Math.min(t.n, t.of)}/${t.of}</span>${t.watch && !ok ? t.watch : ""}${ok ? "" : `<button class="btn small task-go" ${t.act}>Start</button>`}</div>
    </div>`; }).join("")}</div>
  </section>`;
}

function weekCard() {
  const T = weekTarget(), rows = SUBJECTS.map(x => ({ x, m: weekMins(x.id) }));
  const done = rows.filter(r => r.m >= T).length, tot = rows.reduce((a, r) => a + Math.min(r.m, T), 0);
  const dl = daysLeftInWeek();
  return `<section class="card week-card" style="margin-top:16px">
    <div class="card-head"><div><h2>This week</h2><span class="muted" style="font-size:13px;font-weight:600">${T} min per subject · ${done}/${SUBJECTS.length} subjects hit · ${dl} day${dl === 1 ? "" : "s"} left</span></div>
      <span class="big-stat num" style="font-size:24px">${tot}<small style="font-size:14px;color:var(--muted)"> / ${T * SUBJECTS.length} min</small></span></div>
    <div class="wk-grid">${rows.map(({ x, m }) => `<button class="wk-row${m >= T ? " ok" : ""}" style="--c:${x.color}" data-act="plan-focus" data-s="${x.id}" data-n="${Math.max(10, Math.min(25, Math.ceil(Math.max(0, T - m) / 5) * 5)) || 10}" title="Start a focus session for ${x.name}">
      <span class="wk-name">${x.short}</span><span class="wk-bar"><i style="width:${Math.min(100, m / T * 100)}%"></i></span><span class="wk-n num">${m >= T ? svg("check") : ""}${m}/${T}</span></button>`).join("")}</div>
    <p class="muted" style="font-size:12.5px;margin:10px 0 0">Time counts while you're in a quiz, flashcards, an exam question or a focus session with a subject picked.</p>
  </section>`;
}

/* ================= HOME ================= */
function ring(p, size, stroke, color, track = "#1d2742") {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return `<svg viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${track}" stroke-width="${stroke}" fill="none"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${color}" stroke-width="${stroke}" fill="none" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.max(0, Math.min(1, p)))}"/></svg>`;
}
function homeView() {
  const h = new Date().getHours();
  const greet = h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening";
  const L = levelOf(S.xp), from = lvlXP(L), to = lvlXP(L + 1), p = (S.xp - from) / (to - from);
  const tx = (S.days[today()] || {}).xp || 0, gp = tx / S.goal;
  const st = streak();
  const acc = S.stats.answered ? Math.round(S.stats.correct / S.stats.answered * 100) : 0;
  const missed = Object.keys(S.missed).length;

  // week strip (Mon–Sun)
  const now = new Date(), dow = (now.getDay() + 6) % 7;
  const days = ["M", "T", "W", "T", "F", "S", "S"].map((lab, i) => {
    const d = new Date(); d.setDate(d.getDate() - dow + i); const k = dkey(d); const rec = S.days[k] || { xp: 0 };
    const isToday = i === dow, future = i > dow, hit = rec.xp >= STREAK_XP;
    const pp = Math.min(100, Math.round(rec.xp / S.goal * 100));
    return `<div class="day"><span>${lab}</span><div class="dot${hit ? " hit" : ""}${isToday ? " today" : ""}${future ? " future" : ""}" style="--p:${pp}" title="${k}: ${rec.xp} XP">${pp ? '<span class="fill"></span>' : ""}${hit ? svg("flame") : ""}</div></div>`;
  }).join("");

  const mocks = upcoming().filter(e => e.k !== "info" && e.s).slice(0, 2).map(e => ({ label: e.t, date: e.d, d: e.days, e }));

  return topbar(`${greet}, ${esc(S.name)}`, new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })) + `
  ${planCard()}
  ${weekCard()}
  <section class="grid hero" style="margin-top:16px">
    <div class="card orb-card">
      <div class="orb">${ring(p, 128, 11, "url(#g)")}<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#4f7dff"/><stop offset="1" stop-color="#b38cff"/></linearGradient></defs></svg>
        <div class="lvl"><div><small>Level</small><b class="num">${L}</b></div></div></div>
      <div style="position:relative;z-index:1;min-width:0">
        <div class="rank">${rankOf(L)}</div>
        <div class="xp-line"><b class="num">${(to - S.xp).toLocaleString("en-GB")} XP</b> to level ${L + 1}</div>
        <button class="btn" data-act="quick">${svg("quiz")} Quick 10-question quiz</button>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h2>Daily goal</h2><span class="muted num">${Math.min(tx, S.goal)} / ${S.goal} XP</span></div>
      <div class="big-stat num">${Math.min(100, Math.round(gp * 100))}%<small> done today</small></div>
      <div class="bar gold" style="margin:14px 0 12px"><i style="width:${Math.min(100, gp * 100)}%"></i></div>
      <div class="muted" style="font-size:14px">${gp >= 1 ? "Goal smashed. Anything extra is a bonus." : todayDone() ? "Streak safe for today. Keep going for the goal." : `Earn ${STREAK_XP - tx} more XP today to keep your streak.`}</div>
    </div>
    <div class="card">
      <div class="card-head"><h2>Streak</h2><span class="muted">Best ${Math.max(S.stats.bestStreak, st)}</span></div>
      <div class="big-stat num" style="color:var(--flame);display:flex;align-items:center;gap:8px"><span class="flame-anim" style="width:34px;height:34px;display:inline-block">${svg("flame")}</span>${st}<small> day${st === 1 ? "" : "s"}</small></div>
      <div class="week" style="margin-top:16px">${days}</div>
    </div>
  </section>

  <section class="grid stats" style="margin-top:16px">
    <div class="card stat"><div class="label">Total revised</div><div class="v num">${fmtMin(S.sec)}</div></div>
    <div class="card stat"><div class="label">This week</div><div class="v num">${fmtMin(weekSec())}</div></div>
    <div class="card stat"><div class="label">Questions answered</div><div class="v num">${S.stats.answered}</div></div>
    <div class="card stat"><div class="label">Accuracy</div><div class="v num">${S.stats.answered ? acc + "<small>%</small>" : "–"}</div></div>
  </section>

  ${mocks.length || missed ? `<section class="grid" style="margin-top:16px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
    ${mocks.map(m => `<div class="mock"><div class="days num">${m.d}<small>days</small></div><div><b>${esc(m.label)}</b><div class="muted" style="font-size:13px">${new Date(m.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}${evPaper(m.e) ? " · revise " + evPaper(m.e) + " topics" : ""}</div></div>${revBtns(m.e)}</div>`).join("")}
    ${missed ? `<div class="mock"><div class="days num" style="color:var(--bad)">${missed}<small>to fix</small></div><div style="flex:1"><b>Weak spots</b><div class="muted" style="font-size:13px">Questions you got wrong</div></div><button class="btn small ghost" data-act="mistakes">Retry</button></div>` : ""}
  </section>` : ""}

  <div class="section-title"><h2>Your subjects</h2><span class="muted" style="font-size:14px">Confidence comes from your R/A/G ratings</span></div>
  <section class="grid subjects">${SUBJECTS.map(subjCard).join("")}</section>`;
}
function subjCard(s) {
  const conf = confidence(s.id), acc = accuracy(s.id);
  const nq = QUESTIONS.filter(q => q.s === s.id).length + (GEN.some(g => g.s === s.id) ? 1 : 0);
  return `<article class="subj" style="--c:${s.color}">
    <div class="subj-top"><div class="glyph">${svg(s.id)}</div><div><h3>${s.name}</h3><div class="board">${s.board} · ${s.topics.length} topics</div></div></div>
    <div><div class="mastery"><span>Confidence ${conf}%</span><span>${acc === null ? "No quizzes yet" : "Accuracy " + acc + "%"}</span></div>
    <div class="bar" style="margin-top:6px"><i style="width:${conf}%"></i></div></div>
    <div class="acts"><button data-act="subj-quiz" data-s="${s.id}"${nq ? "" : " disabled"}>Quiz</button><button data-act="subj-topics" data-s="${s.id}">Topics</button></div>
  </article>`;
}

/* ================= QUIZ ================= */
function topicHasQs(sid, t) { return QUESTIONS.some(q => q.s === sid && q.t === t) || GEN.some(g => g.s === sid && g.t === t); }
function quizSetup() {
  const s = qsetup;
  const topics = s.sid === "all" ? [] : SUBJ[s.sid].topics.filter(t => topicHasQs(s.sid, t[1]) && inPaper(s.sid, t[1], s.paper));
  const pp = papersOf(s.sid);
  const missed = Object.keys(S.missed).filter(k => s.sid === "all" || k.startsWith(s.sid + "|")).length;
  return topbar("Quizzes", "Right answers earn XP. Build a combo for bonus points.") + `
  <div class="setup">
    <div class="field"><label>Subject</label><div class="chips">
      <button class="chip${s.sid === "all" ? " on" : ""}" data-act="qs-sid" data-s="all"><i style="background:linear-gradient(90deg,#4f7dff,#ff7a2f)"></i>All subjects</button>
      ${SUBJECTS.map(x => `<button class="chip${s.sid === x.id ? " on" : ""}" style="--c:${x.color}" data-act="qs-sid" data-s="${x.id}"><i></i>${x.name}</button>`).join("")}
    </div></div>
    ${pp.length ? `<div class="field"><label>Paper</label><div class="chips"><button class="chip${!s.paper ? " on" : ""}" data-act="qs-paper" data-p="">All papers</button>${pp.map(p => `<button class="chip${s.paper === p ? " on" : ""}" data-act="qs-paper" data-p="${p}">${p} only</button>`).join("")}</div></div>` : ""}
    <div class="grid mode-row">
      <button class="mode${s.mode === "mixed" ? " on" : ""}" data-act="qs-mode" data-m="mixed"><b>Mixed</b><span>Questions from every topic</span></button>
      <button class="mode${s.mode === "topic" ? " on" : ""}" data-act="qs-mode" data-m="topic"${s.sid === "all" ? " disabled style='opacity:.45'" : ""}><b>One topic</b><span>${s.sid === "all" ? "Pick a subject first" : "Drill a single topic"}</span></button>
      <button class="mode${s.mode === "mistakes" ? " on" : ""}" data-act="qs-mode" data-m="mistakes"><b>Weak spots</b><span>${missed} question${missed === 1 ? "" : "s"} you got wrong</span></button>
    </div>
    ${s.mode === "topic" && s.sid !== "all" ? `<div class="field"><label for="qs-topic">Topic</label><select id="qs-topic" data-act="qs-topic">${topics.map(t => `<option${t[1] === s.topic ? " selected" : ""}>${esc(t[1])}</option>`).join("")}</select></div>` : ""}
    <div class="field"><label>Length</label><div class="chips">${[5, 10, 20].map(n => `<button class="chip${s.n === n ? " on" : ""}" data-act="qs-n" data-n="${n}">${n} questions</button>`).join("")}</div></div>
    <div><button class="btn" data-act="start-quiz"${s.mode === "mistakes" && !missed ? " disabled" : ""}>${svg("play")} Start quiz</button></div>
  </div>`;
}
function buildQuiz(sid, mode, topic, n, paper) {
  const inSubj = q => (sid === "all" || q.s === sid) && (mode === "topic" || inPaper(q.s, q.t, paper));
  let fixed, gens;
  if (mode === "mistakes") {
    fixed = QUESTIONS.filter(q => inSubj(q) && S.missed[qkey(q)]); gens = [];
  } else {
    fixed = QUESTIONS.filter(q => inSubj(q) && (mode !== "topic" || q.t === topic));
    gens = GEN.filter(g => inSubj(g) && (mode !== "topic" || g.t === topic));
  }
  fixed = shuffle(fixed);
  let nGen = gens.length ? Math.round(n * (sid === "maths" ? 0.6 : sid === "all" ? 0.2 : 0.35)) : 0;
  if (fixed.length < n - nGen) nGen = gens.length ? n - fixed.length : 0;
  const items = fixed.slice(0, n - nGen);
  for (let i = 0; i < nGen; i++) { const g = pick(gens); items.push({ s: g.s, t: g.t, gen: true, ...g.f() }); }
  return shuffle(items).map(q => { const order = shuffle([0, 1, 2, 3]); return { ...q, opts: order.map(i => q.o[i]), ans: order.indexOf(0) }; });
}
function startQuiz(sid, mode, topic, n, paper) {
  const qs = buildQuiz(sid, mode, topic, n, paper);
  if (!qs.length) { toast("quiz", "No questions here yet", "Try another topic or subject."); return; }
  quiz = { qs, i: 0, picked: null, score: 0, combo: 0, best: 0, xp: 0, sid, mode, wrong: [], active: true, done: false };
  view = "quiz"; history.replaceState(null, "", "#quiz"); render(); window.scrollTo(0, 0);
}
function quizRunner() {
  const q = quiz.qs[quiz.i], s = SUBJ[q.s], locked = quiz.picked !== null;
  const correct = locked && quiz.picked === q.ans;
  return `<div class="runner">
    <div class="run-top"><button class="x-btn" data-act="quit-quiz" aria-label="Quit quiz">${svg("x")}</button>
      <div class="bar"><i style="width:${(quiz.i + (locked ? 1 : 0)) / quiz.qs.length * 100}%"></i></div>
      <span class="combo${quiz.combo ? "" : " zero"}" title="Combo">${svg("flame")}×${quiz.combo}</span></div>
    <div class="card qcard">
      <div class="qmeta"><span class="tag" style="--c:${s.color}">${s.name}</span><span>${esc(q.t)}</span><span style="margin-left:auto" class="num">${quiz.i + 1} / ${quiz.qs.length}</span></div>
      <div class="qtext">${esc(q.q)}</div>
      <div class="opts${locked ? " locked" : ""}">${q.opts.map((o, i) => {
        const cls = locked ? (i === q.ans ? " right" : i === quiz.picked ? " wrong" : "") : "";
        return `<button class="opt${cls}" data-act="answer" data-i="${i}"><span class="k">${locked && i === q.ans ? svg("check") : i + 1}</span><span>${esc(o)}</span></button>`;
      }).join("")}</div>
      ${locked ? `<div class="feedback ${correct ? "good" : "badf"}"><div><b>${correct ? pick(["Nice one.", "Spot on.", "Correct!", "Nailed it."]) : "Not quite."}</b><span class="muted">${esc(q.e || "")}</span>${correct ? "" : `<div style="margin-top:10px">${watchLink(q.s, q.t)}</div>`}</div>${correct ? `<span class="gain">+${quiz.lastGain} XP</span>` : ""}</div>` : ""}
    </div>
    <div class="run-actions"><span class="kbd-hint">Keys: 1–4 to answer, Enter for next</span>${locked ? `<button class="btn" data-act="next-q" id="next-q">${quiz.i + 1 < quiz.qs.length ? "Next question" : "See results"}</button>` : ""}</div>
  </div>`;
}
function answer(i, ev) {
  if (!quiz || quiz.picked !== null) return;
  const q = quiz.qs[quiz.i]; quiz.picked = i;
  const ok = i === q.ans;
  S.stats.answered++; const d = dayRec(today()); d.q++; d.subjQ[q.s] = (d.subjQ[q.s] || 0) + 1;
  const ss = (S.subjStats[q.s] = S.subjStats[q.s] || { a: 0, c: 0 }); ss.a++;
  if (ok) {
    quiz.score++; quiz.combo++; quiz.best = Math.max(quiz.best, quiz.combo);
    S.stats.correct++; d.c++; ss.c++; d.topicC[q.s + "|" + q.t] = (d.topicC[q.s + "|" + q.t] || 0) + 1;
    if (!q.gen) delete S.missed[qkey(q)];
    const gain = 10 + Math.min(10, (quiz.combo - 1) * 2);
    quiz.lastGain = gain; quiz.xp += gain;
    if (quiz.combo > S.stats.bestCombo) S.stats.bestCombo = quiz.combo;
    const r = ev && ev.currentTarget ? ev.currentTarget.getBoundingClientRect() : null;
    addXP(gain, r ? { x: r.right - 90, y: r.top } : null);
  } else {
    quiz.combo = 0; quiz.wrong.push(q);
    if (!q.gen) S.missed[qkey(q)] = 1;
    addXP(1);
  }
  checkPlan(); save(); render();
  const nb = $("#next-q"); if (nb) nb.focus({ preventScroll: true });
}
function nextQ() {
  if (!quiz) return;
  if (quiz.i + 1 < quiz.qs.length) { quiz.i++; quiz.picked = null; render(); return; }
  quiz.done = true; quiz.active = false;
  S.stats.quizzes++; S.stats.subjQuiz[quiz.sid === "all" ? "mixed" : quiz.sid] = 1;
  if (quiz.sid === "all") new Set(quiz.qs.map(q => q.s)).forEach(s => { S.stats.subjQuiz[s] = 1; });
  const pct = quiz.score / quiz.qs.length;
  let bonus = 0;
  if (pct === 1 && quiz.qs.length >= 10) { S.stats.perfect++; bonus = 25; }
  else if (pct >= 0.8) bonus = 10;
  quiz.bonus = bonus;
  if (bonus) addXP(bonus);
  save(); checkBadges(); render();
  if (pct >= 0.8) confetti();
}
function quizResult() {
  const n = quiz.qs.length, pct = Math.round(quiz.score / n * 100);
  const verdict = pct === 100 ? "Flawless." : pct >= 80 ? "Strong work." : pct >= 50 ? "Getting there." : "Good practice. Go again?";
  return `<div class="runner"><div class="card result">
    <div class="muted" style="font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:12px">Quiz complete</div>
    <div class="score num">${quiz.score}/${n}</div>
    <div class="verdict">${verdict}</div>
    <div class="result-stats">
      <div><b class="num" style="color:var(--gold)">+${quiz.xp + (quiz.bonus || 0)}</b><span>XP earned</span></div>
      <div><b class="num">${pct}%</b><span>Accuracy</span></div>
      <div><b class="num" style="color:var(--flame)">×${quiz.best}</b><span>Best combo</span></div>
    </div>
    ${quiz.bonus ? `<div class="muted">Includes a +${quiz.bonus} XP ${quiz.bonus === 25 ? "perfect score" : "80%+"} bonus.</div>` : ""}
    <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap">
      <button class="btn" data-act="again">Go again</button>
      <button class="btn ghost" data-act="nav" data-v="home">Back home</button>
    </div>
    ${quiz.wrong.length ? `<div class="review"><h3 style="font-size:16px;margin-top:10px">To review</h3>${quiz.wrong.map(q => `<div>${esc(q.q)}<br><b>${esc(q.o[0])}</b> <span class="muted">${esc(q.e || "")}</span></div>`).join("")}</div>` : ""}
  </div></div>`;
}

/* ================= FLASHCARDS ================= */
function deckMastery(d) { const b = S.boxes[d.id] || {}; return d.cards.filter((c, i) => (b[i] || 0) >= 2).length; }
/* which exam paper each deck / card belongs to (deck-level string, or per-card list of paper numbers) */
const DECK_PAPER = { rj: "Paper 1", je: "Paper 1", fr: "Paper 2", poems: "Paper 2", geocs: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2], physeq: [1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2], peterms: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2] };
const cardInPaper = (d, i, paper) => { if (!paper) return true; const c = d.cards[i]; if (c.p !== undefined) return !c.p || "Paper " + c.p === paper; const t = DECK_PAPER[d.id]; if (!t) return true; return Array.isArray(t) ? "Paper " + t[i] === paper : t === paper; };
const deckCards = (d, paper) => d.cards.map((c, i) => i).filter(i => cardInPaper(d, i, paper));
let fcF = { sid: "all", paper: "" };
function decksView() {
  const subs = SUBJECTS.filter(x => DECKS.some(d => d.s === x.id)), pp = fcF.sid === "all" ? [] : papersOf(fcF.sid);
  if (fcF.paper && !pp.includes(fcF.paper)) fcF.paper = "";
  const list = DECKS.filter(d => (fcF.sid === "all" || d.s === fcF.sid) && deckCards(d, fcF.paper).length);
  return topbar("Flashcards", "Got it moves a card up a level; Again brings it back sooner.") + `
  <div class="chips" style="margin-bottom:${pp.length ? 10 : 18}px"><button class="chip${fcF.sid === "all" ? " on" : ""}" data-act="fc-sid" data-s="all"><i style="background:linear-gradient(90deg,#4f7dff,#ff7a2f)"></i>All decks</button>${subs.map(x => `<button class="chip${fcF.sid === x.id ? " on" : ""}" style="--c:${x.color}" data-act="fc-sid" data-s="${x.id}"><i></i>${x.name}</button>`).join("")}</div>
  ${pp.length ? `<div class="mchips pfilter" style="margin-bottom:18px"><span class="mchips-l">Paper</span><button class="mchip${!fcF.paper ? " on" : ""}" data-act="fc-paper" data-p="">All papers</button>${pp.map(p => `<button class="mchip${fcF.paper === p ? " on" : ""}" data-act="fc-paper" data-p="${p}">${p}</button>`).join("")}</div>` : ""}
  <section class="grid decks">${list.map(d => {
    const s = SUBJ[d.s], idx = deckCards(d, fcF.paper), b = S.boxes[d.id] || {}, m = idx.filter(i => (b[i] || 0) >= 2).length;
    const pn = fcF.paper && idx.length < d.cards.length ? " · " + fcF.paper : "";
    return `<button class="deck" style="--c:${s.color}" data-act="open-deck" data-d="${d.id}">
      <div class="subj-top"><div class="glyph">${svg(s.id)}</div><div><h3>${esc(d.name)}</h3><div class="board" style="font-size:12px;color:var(--muted)">${s.name}${pn}</div></div></div>
      <div class="meta"><span>${idx.length} cards</span><span>${m} mastered</span></div>
      <div class="bar"><i style="width:${m / idx.length * 100}%"></i></div></button>`;
  }).join("")}</section>`;
}
function openDeck(id) {
  const d = DECKS.find(x => x.id === id); const b = S.boxes[id] || {};
  const order = shuffle(deckCards(d, fcF.paper)).sort((a, z) => (b[a] || 0) - (b[z] || 0)).slice(0, 15);
  fc = { deck: d, queue: order, flipped: false, active: true, done: false, seen: 0, got: 0 };
  render();
}
function cardRunner() {
  const d = fc.deck, i = fc.queue[0], c = d.cards[i], s = SUBJ[d.s], box = (S.boxes[d.id] || {})[i] || 0;
  return `<div class="runner">
    <div class="run-top"><button class="x-btn" data-act="quit-deck" aria-label="Close deck">${svg("x")}</button>
      <div class="bar"><i style="width:${fc.got / (fc.got + fc.queue.length) * 100}%"></i></div>
      <span class="muted num" style="font-weight:700;font-size:14px">${fc.queue.length} left</span></div>
    <div class="flip-wrap"><div class="flip${fc.flipped ? " flipped" : ""}" data-act="flip" role="button" tabindex="0" aria-label="Flip card">
      <div class="face"><span class="label">${esc(d.name)} · level ${box}</span><div class="big">${esc(c.f)}</div><span class="hint">Tap or press space to flip</span></div>
      <div class="face back"><span class="label" style="color:${s.color}">Answer</span><div class="big">${esc(c.b)}</div>${c.n ? `<div class="note">${esc(c.n)}</div>` : ""}</div>
    </div></div>
    <div class="card-actions">${fc.flipped ? `<button class="btn again" data-act="card-again">Again <small style="opacity:.7">(1)</small></button><button class="btn got" data-act="card-got">Got it <small style="opacity:.7">(2)</small></button>` : `<button class="btn ghost" style="grid-column:1/-1" data-act="flip">Show answer</button>`}</div>
  </div>`;
}
function cardAnswer(got, ev) {
  if (!fc || !fc.flipped) return;
  const d = fc.deck, i = fc.queue.shift(); const b = (S.boxes[d.id] = S.boxes[d.id] || {});
  S.stats.cards++; fc.seen++; const dd = dayRec(today()); dd.deckC[d.id] = (dd.deckC[d.id] || 0) + 1; checkPlan();
  if (got) { b[i] = Math.min(4, (b[i] || 0) + 1); fc.got++; const r = ev && ev.currentTarget ? ev.currentTarget.getBoundingClientRect() : null; addXP(3, r ? { x: r.left + r.width / 2 - 30, y: r.top } : null); }
  else { b[i] = 0; fc.queue.splice(Math.min(3, fc.queue.length), 0, i); addXP(1); }
  fc.flipped = false;
  if (!fc.queue.length) { fc.done = true; fc.active = false; confetti(); }
  save(); render();
}
function cardsResult() {
  const d = fc.deck;
  return `<div class="runner"><div class="card result">
    <div class="muted" style="font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:12px">Deck session done</div>
    <div class="score num">${fc.got}</div><div class="verdict">cards learned from ${esc(d.name)}</div>
    <div class="result-stats"><div><b class="num">${fc.seen}</b><span>Flips</span></div><div><b class="num">${deckMastery(d)}/${d.cards.length}</b><span>Mastered</span></div></div>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn" data-act="open-deck" data-d="${d.id}">Another round</button><button class="btn ghost" data-act="quit-deck">All decks</button></div>
  </div></div>`;
}

/* ================= TOPICS ================= */
function topicsView() {
  const s = SUBJ[topicSid], r = S.rag[s.id] || {};
  const counts = { R: 0, A: 0, G: 0 }; Object.values(r).forEach(v => counts[v]++);
  const n = s.topics.length, none = n - counts.R - counts.A - counts.G;
  const tpp = papersOf(s.id); if (topicPaper && !tpp.includes(topicPaper)) topicPaper = "";
  const groups = {}; s.topics.forEach((t, i) => { if (inPaper(s.id, t[1], topicPaper)) (groups[t[0]] = groups[t[0]] || []).push([t[1], i]); });
  return topbar("Topics", "Rate every topic Red, Amber or Green. It feeds your confidence score.") + `
  <div class="chips" style="margin-bottom:18px">${SUBJECTS.map(x => `<button class="chip${x.id === topicSid ? " on" : ""}" style="--c:${x.color}" data-act="t-sid" data-s="${x.id}"><i></i>${x.name}</button>`).join("")}</div>
  ${tpp.length ? `<div class="mchips pfilter" style="margin:-8px 0 18px"><span class="mchips-l">Paper</span><button class="mchip${!topicPaper ? " on" : ""}" data-act="t-paper" data-p="">All papers</button>${tpp.map(p => `<button class="mchip${topicPaper === p ? " on" : ""}" data-act="t-paper" data-p="${p}">${p}</button>`).join("")}</div>` : ""}
  <div class="card" style="margin-bottom:20px"><div class="card-head"><h2>${s.name} <span class="muted" style="font-size:14px;font-family:var(--font-body);font-weight:600">· ${s.board}</span></h2><span class="big-stat num" style="font-size:26px">${confidence(s.id)}%</span></div>
    <div class="bar rag"><i style="width:${counts.G / n * 100}%;background:var(--good)"></i><i style="width:${counts.A / n * 100}%;background:var(--amber)"></i><i style="width:${counts.R / n * 100}%;background:var(--bad)"></i></div>
    <div class="rag-legend" style="margin-top:12px"><span><i style="background:var(--good)"></i>${counts.G} confident</span><span><i style="background:var(--amber)"></i>${counts.A} getting there</span><span><i style="background:var(--bad)"></i>${counts.R} need work</span><span><i style="background:#2a3454"></i>${none} not rated</span></div></div>
  ${Object.entries(groups).map(([g, list]) => `<div class="topic-group"><h3>${esc(g)}</h3>${list.map(([name, i]) => {
    const has = topicHasQs(s.id, name), nq = QUESTIONS.filter(q => q.s === s.id && q.t === name).length;
    return `<div class="topic"><span class="name">${esc(name)}</span>${has ? `<span class="qcount">${nq ? nq + " Q" : ""}${GEN.some(gg => gg.s === s.id && gg.t === name) ? (nq ? " + " : "") + "∞" : ""}</span><button class="mini-quiz" data-act="topic-quiz" data-t="${esc(name)}">Quiz</button>` : ""}
      ${examCount(s.id, name) ? `<button class="mini-quiz exq" data-act="topic-exam" data-s="${s.id}" data-t="${esc(name)}">Exam Qs</button>` : ""}${watchLink(s.id, name)}<span class="rag" role="group" aria-label="Rate ${esc(name)}">${["R", "A", "G"].map(v => `<button class="${v}${r[i] === v ? " on" : ""}" data-act="rag" data-i="${i}" data-v="${v}" aria-pressed="${r[i] === v}">${v}</button>`).join("")}</span></div>`;
  }).join("")}</div>`).join("")}`;
}


/* ================= PAST PAPERS ================= */
let paperSid = "geog";
function paperDone(name, key) {
  S.papers = S.papers || []; S.donePapers = S.donePapers || {};
  if (key && S.donePapers[key]) { toast("paper", "Already ticked off", name); return; }
  if (key) S.donePapers[key] = today();
  S.papers.unshift({ n: name, d: today(), s: paperSid, k: key || "" });
  addXP(50); save(); checkBadges();
  toast("paper", "Past paper logged", name + " · +50 XP");
  if (view === "papers") render();
}
function paperUndone(key) {
  S.donePapers = S.donePapers || {}; delete S.donePapers[key];
  S.papers = (S.papers || []).filter(p => p.k !== key); save(); render();
}
let inProg = [], inProgLoaded = false;
function refreshInProg() {
  if (!window.Annotator || !window.Annotator.list) return;
  window.Annotator.list().then(l => { inProg = l; inProgLoaded = true; if (view === "papers") render(); });
}
const dkeyOf = (sid, d) => sid + "|" + d.series + "|" + d.paper;
function openAnn(o) { window.Annotator && window.Annotator.open({ sid: paperSid, onChange: refreshInProg, ...o }); }
function papersView() {
  const s = SUBJ[paperSid], P = PAPERS[paperSid] || { sources: [] };
  const done = (S.papers || []).filter(p => p.s === paperSid);
  if (!inProgLoaded) refreshInProg();
  const DP = S.donePapers || {};
  const ago = t => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.round(m / 60) + " h ago" : new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };
  const link = (url, label, cls) => `<a class="${cls}" href="${url}" target="_blank" rel="noopener">${label}</a>`;
  return topbar("Past papers", "Download a paper, open it in the annotator, then log it for +50 XP.") + `
  <div class="chips" style="margin-bottom:18px">${SUBJECTS.map(x => `<button class="chip${x.id === paperSid ? " on" : ""}" style="--c:${x.color}" data-act="p-sid" data-s="${x.id}"><i></i>${x.name}</button>`).join("")}</div>
  <div class="paper-hero card">
    <div><h2>${s.name} <span class="muted" style="font-size:14px;font-family:var(--font-body);font-weight:600">· ${s.board}</span></h2><p class="muted" style="margin:6px 0 0;font-size:14px">${esc(P.note || "")}</p></div>
    <button class="btn" data-act="annotate" data-t="">${svg("pencil")} Open annotator</button>
  </div>
  ${inProg.length ? `<div class="section-title"><h2>Working on</h2><span class="muted" style="font-size:14px">Saved on this device, every subject</span></div>
  <div class="paper-list">${inProg.map(p => `<div class="paper-row prog">
      <div class="paper-name"><b>${esc(p.title || p.name)}${p.done ? ` <span class="tag" style="--c:var(--good)">done</span>` : ""}</b><span>${p.sid && SUBJ[p.sid] ? SUBJ[p.sid].short + " · " : ""}${p.marks} mark${p.marks === 1 ? "" : "s"} · ${ago(p.opened)}</span></div>
      <div class="paper-acts"><button class="plink go" data-act="resume" data-id="${esc(p.id)}">${svg("pencil")}Continue</button>
      <button class="plink del" data-act="del-prog" data-id="${esc(p.id)}" data-t="${esc(p.title || p.name)}" aria-label="Delete ${esc(p.title || p.name)}">${svg("trash")}</button></div>
    </div>`).join("")}</div>` : ""}
  ${P.direct ? `<div class="section-title"><h2>Papers and mark schemes</h2><span class="muted" style="font-size:14px">Direct PDF downloads</span></div>
  <div class="paper-list">${P.direct.map(d => { const k = dkeyOf(paperSid, d), ok = DP[k]; return `<div class="paper-row${ok ? " done" : ""}">
      <button class="pcheck${ok ? " on" : ""}" data-act="p-check" data-k="${esc(k)}" data-t="${esc(d.series + " · " + d.paper)}" aria-pressed="${!!ok}" title="${ok ? "Done " + ok + " (tap to untick)" : "Tick when you've done it (+50 XP)"}">${svg("check")}</button>
      <div class="paper-name"><b>${esc(d.series)}</b><span>${esc(d.paper)}</span></div>
      <div class="paper-acts">${link(d.qp, svg("paper") + "Question paper", "plink")}${link(d.ms, svg("check") + "Mark scheme", "plink ms")}
      <button class="plink go" data-act="annotate" data-k="${esc(k)}" data-t="${esc(d.series + " · " + d.paper)}">${svg("pencil")}Annotate</button></div>
    </div>`; }).join("")}</div>` : ""}
  <div class="section-title"><h2>${P.direct ? "More papers" : "Where to get them"}</h2><span class="muted" style="font-size:14px">Opens in a new tab</span></div>
  <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">${P.sources.map(x => `<a class="source" href="${x.url}" target="_blank" rel="noopener" style="--c:${s.color}">
    <div><b>${esc(x.name)}</b>${x.note ? `<span>${esc(x.note)}</span>` : ""}</div>${svg("ext")}</a>`).join("")}</div>
  <div class="section-title"><h2>Finished papers</h2><span class="muted" style="font-size:14px">${(S.papers || []).length} in total</span></div>
  ${done.length ? `<div class="paper-list">${done.map(p => `<div class="paper-row"><div class="paper-name"><b>${esc(p.n)}</b><span>${new Date(p.d).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span></div><span class="tag" style="--c:var(--good)">+50 XP</span></div>`).join("")}</div>`
    : `<div class="card empty">No ${s.name} papers logged yet. Open one in the annotator and press Done when you've finished.</div>`}`;
}

/* ================= VIDEOS ================= */
let vidSid = "bio";
function videosView() {
  const subs = SUBJECTS.filter(x => x.id !== "geog");
  if (!subs.some(x => x.id === vidSid)) vidSid = subs[0].id;
  const s = SUBJ[vidSid], VL = window.VIDEO_LINKS || {};
  const groups = {}; s.topics.forEach(t => (groups[t[0]] = groups[t[0]] || []).push(t[1]));
  const total = s.topics.reduce((a, t) => a + ((VL[s.id + "|" + t[1]] || []).length), 0);
  const host = u => /cognito\.org/.test(u) ? "Cognito" : /mathsgenie/.test(u) ? "Maths Genie" : /corbettmaths/.test(u) ? "Corbettmaths" : /youtu/.test(u) ? "YouTube" : "Video";
  return topbar("Videos", "Every topic's videos in one place. They open in a new tab.") + `
  <div class="chips" style="margin-bottom:18px">${subs.map(x => `<button class="chip${x.id === vidSid ? " on" : ""}" style="--c:${x.color}" data-act="v-sid" data-s="${x.id}"><i></i>${x.name}</button>`).join("")}</div>
  <div class="card" style="margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap"><h2>${s.name} <span class="muted" style="font-size:14px;font-family:var(--font-body);font-weight:600">· ${s.board}</span></h2><span class="muted" style="font-weight:700">${total} videos · ${s.topics.length} topics</span></div>
  ${Object.entries(groups).map(([g, list]) => `<div class="topic-group"><h3>${esc(g)}</h3>${list.map(name => {
    const vs = VL[s.id + "|" + name] || [], fb = vs.length ? null : video(s.id, name);
    return `<div class="vid-topic" style="--c:${s.color}"><b>${esc(name)}</b><div class="vid-links">${vs.map(([l, u]) => `<a class="vid" href="${u}" target="_blank" rel="noopener"><span class="vid-play">${svg("play")}</span><span><b>${esc(l.replace(/^[^:]+:\s*/, ""))}</b><small>${host(u)}${/cognito\.org/.test(u) ? " lesson" : ""}</small></span></a>`).join("")}
      ${fb ? `<a class="vid search" href="${fb.url}" target="_blank" rel="noopener"><span class="vid-play">${svg("play")}</span><span><b>Search ${esc(fb.label)}</b><small>YouTube search</small></span></a>` : ""}</div></div>`;
  }).join("")}</div>`).join("")}`;
}

/* ================= EXAM QUESTIONS ================= */
const mOk = q => !exq.marks || q.m === +exq.marks;
let exq = { pad: {}, paper: "", marks: "", sid: "bio", topic: "", open: null, draft: {}, reveal: {}, ticks: {}, n: 5, skipDone: true, run: null, browse: false };
const EXQ = window.EXAMQ || [];
const qHash = str => { let x = 5381; for (const c of str) x = (x * 33 ^ c.charCodeAt(0)) >>> 0; return x.toString(36); };
const exKey = q => q.k || (q.k = q.s + "|" + q.t + "|" + (q.gen ? "#" + qHash(q.q) : q.q.slice(0, 60)));
const examCount = (sid, t) => EXQ.filter(q => q.s === sid && q.t === t).length;
function exScore(q, k) {
  const t = exq.ticks[k] || {}, n = Object.values(t).filter(Boolean).length, P = q.ms.length;
  return P >= q.m ? Math.min(n, q.m) : Math.round(n / P * q.m);
}
const doneNow = k => !!(S.exDone || {})[k];
function toggleDone(k) { S.exDone = S.exDone || {}; if (S.exDone[k]) delete S.exDone[k]; else S.exDone[k] = today(); save(); }
const qTags = q => `${q.src ? `<span class="xtag school">From your school booklet</span>` : ""}${q.calc ? `<span class="xtag">${q.calc === "y" ? "Calculator" : "Non-calculator"}</span>` : ""}`;
const doneBox = k => `<button class="xdone${doneNow(k) ? " on" : ""}" data-act="x-done" data-k="${esc(k)}" aria-pressed="${doneNow(k)}" title="${doneNow(k) ? "Done – tap to untick" : "Tick when you've done it"}"><i>${svg("check")}</i><span>Done</span></button>`;
function qWork(q, k) {
  const t = exq.ticks[k] || {}, rev = exq.reveal[k];
  return `${q.s === "maths" ? `<div class="pad" data-k="${esc(k)}"><div class="pad-bar"><b>Working out</b><span class="pad-tools"><button class="pad-t on" data-pt="pen" aria-label="Pen">${svg("pencil")}</button><button class="pad-t" data-pt="erase">Rubber</button><button class="pad-t" data-pt="clear">Clear</button></span></div><canvas class="pad-c"></canvas></div>` : ""}
    <textarea class="exq-ans" data-draft="${esc(k)}" rows="${q.s === "maths" ? 2 : Math.min(12, 3 + q.m)}" placeholder="${q.s === "maths" ? "Final answer (or type your working here)…" : "Write your answer like it's the real exam…"}">${esc(exq.draft[k] || "")}</textarea>
    ${rev ? `<div class="msk"><div class="ms-h"><span>Mark scheme · tick each point you made</span><button class="ms-hide" data-act="x-hide" data-k="${esc(k)}">Hide</button></div>${q.ms.map((m, i) => `<button class="ms-pt${t[i] ? " on" : ""}" data-act="x-tick" data-k="${esc(k)}" data-i="${i}" aria-pressed="${!!t[i]}"><i>${svg("check")}</i><span>${esc(m)}</span></button>`).join("")}
      ${q.ms.length !== q.m ? `<div class="muted ms-note">${q.ms.length > q.m ? `Any ${q.m} of these ${q.ms.length} points.` : `Long answer: each point is roughly ${Math.round(q.m / q.ms.length)} marks. Be honest about quality, not just mentioning it.`}</div>` : ""}
      <div class="ms-foot"><b class="num">${exScore(q, k)} / ${q.m}</b>${exq.run ? "" : `<button class="btn" data-act="x-save" data-k="${esc(k)}">Save mark</button>`}</div></div>`
    : `<button class="btn ghost" data-act="x-reveal" data-k="${esc(k)}">${svg("check")} Show mark scheme</button>`}`;
}
function exPool() {
  const all = EXQ.filter(q => q.s === exq.sid && inPaper(q.s, q.t, exq.paper)), inTopic = exq.topic ? all.filter(q => q.t === exq.topic) : all;
  return { all, inTopic, pool: inTopic.filter(mOk) };
}
function examView() {
  if (exq.run) return exq.run.done ? examResult() : examRunner();
  const s = SUBJ[exq.sid], { all, inTopic, pool } = exPool();
  const mvals = [...new Set(inTopic.map(q => q.m))].sort((a, b) => a - b);
  if (exq.marks && !mvals.includes(+exq.marks)) return (exq.marks = "", examView());
  const E = S.exam || {}, doneN = all.filter(q => doneNow(exKey(q))).length;
  const marks = all.reduce((a, q) => a + q.m, 0), got = all.reduce((a, q) => a + ((E[exKey(q)] || {}).b || 0), 0);
  const topics = s.topics.map(t => t[1]).filter(t => examCount(s.id, t) && inPaper(s.id, t, exq.paper));
  const pp = papersOf(s.id); if (exq.paper && !pp.includes(exq.paper)) exq.paper = "";
  const fresh = pool.filter(q => !doneNow(exKey(q))), avail = exq.skipDone ? fresh : pool;
  const n = Math.min(exq.n, avail.length);
  const head = topbar("Exam questions", "Pick a subject, topic and marks. You'll get a short set, one at a time.") + `
  <div class="chips" style="margin-bottom:18px">${SUBJECTS.map(x => `<button class="chip${x.id === exq.sid ? " on" : ""}" style="--c:${x.color}" data-act="x-sid" data-s="${x.id}"><i></i>${x.name}</button>`).join("")}</div>`;
  if (exq.browse) return head + browseList(s, pool, inTopic, mvals, topics);
  return head + `
  <div class="ex-setup" style="--c:${s.color}">
    <div class="card ex-build">
      ${pp.length ? `<div class="xs-row"><span class="xs-l">Paper</span><div class="mchips"><button class="mchip${!exq.paper ? " on" : ""}" data-act="x-paper" data-p="">All papers</button>${pp.map(p => `<button class="mchip${exq.paper === p ? " on" : ""}" data-act="x-paper" data-p="${p}">${p}</button>`).join("")}</div></div>` : ""}
      <div class="xs-row"><span class="xs-l">Topic</span><select id="x-topic" class="select" aria-label="Topic"><option value="">Any topic</option>${topics.map(t => `<option value="${esc(t)}"${t === exq.topic ? " selected" : ""}>${esc(t)} (${EXQ.filter(q => q.s === s.id && q.t === t && !doneNow(exKey(q))).length} left)</option>`).join("")}</select></div>
      <div class="xs-row"><span class="xs-l">Marks</span><div class="mchips">
        <button class="mchip${!exq.marks ? " on" : ""}" data-act="x-marks" data-m="">Any <small>${inTopic.length}</small></button>
        ${mvals.map(m => `<button class="mchip${+exq.marks === m ? " on" : ""}" data-act="x-marks" data-m="${m}">${m} mark${m === 1 ? "" : "s"} <small>${inTopic.filter(q => q.m === m).length}</small></button>`).join("")}</div></div>
      <div class="xs-row"><span class="xs-l">Questions</span><div class="mchips">${[3, 5, 10, 15].map(v => `<button class="mchip${exq.n === v ? " on" : ""}" data-act="x-n" data-n="${v}">${v}</button>`).join("")}</div></div>
      <label class="xs-check"><input type="checkbox" id="x-skip"${exq.skipDone ? " checked" : ""}> Skip questions I've already done <span class="muted">(${pool.length - fresh.length} of ${pool.length} done)</span></label>
      <div class="xs-go">
        <div><b class="num">${n}</b> question${n === 1 ? "" : "s"} <span class="muted">· ${avail.length} available</span></div>
        <button class="btn" data-act="x-start"${n ? "" : " disabled"}>${svg("play")} Start</button>
      </div>
      ${!avail.length ? `<div class="muted" style="font-size:13.5px">${pool.length ? "You've done every question here. Untick “Skip questions I've done” to go again." : "Nothing matches. Try another topic or mark."}</div>` : ""}
    </div>
    <div class="card ex-stats">
      <h2>${s.name}${exq.paper ? ` <span class="muted" style="font-size:15px">· ${exq.paper}</span>` : ""}</h2>
      <div class="xs-ring">${ring(all.length ? doneN / all.length : 0, 112, 10, s.color)}<div><b class="num">${doneN}</b><span>of ${all.length} done</span></div></div>
      <div class="xs-mini"><div><b class="num">${marks ? Math.round(got / marks * 100) : 0}%</b><span>marks banked</span></div><div><b class="num">${Object.keys(E).filter(k => k.startsWith(s.id + "|")).length}</b><span>self-marked</span></div></div>
      <button class="mini-link" data-act="x-browse">Browse all ${all.length} and tick them off →</button>
    </div>
  </div>`;
}
function browseList(s, list, inTopic, mvals, topics) {
  const E = S.exam || {};
  return `<div class="card ex-head" style="--c:${s.color}">
    <div><button class="mini-link" data-act="x-browse" style="margin:0 0 6px">← Back to practice</button><h2>${s.name}: all questions</h2><span class="muted">Tick the ones you've done</span></div>
    <div class="ex-ctrl"><select id="x-topic" class="select" aria-label="Topic"><option value="">All topics</option>${topics.map(t => `<option${t === exq.topic ? " selected" : ""}>${esc(t)}</option>`).join("")}</select></div>
    <div class="mchips" role="group" aria-label="Filter by marks"><span class="mchips-l">Marks</span>
      <button class="mchip${!exq.marks ? " on" : ""}" data-act="x-marks" data-m="">All <small>${inTopic.length}</small></button>
      ${mvals.map(m => `<button class="mchip${+exq.marks === m ? " on" : ""}" data-act="x-marks" data-m="${m}">${m} mark${m === 1 ? "" : "s"} <small>${inTopic.filter(q => q.m === m).length}</small></button>`).join("")}</div>
  </div>
  <div class="ex-list">${list.map((q, n) => {
    const k = exKey(q), rec = E[k], open = exq.open === k;
    return `<div class="exq${open ? " open" : ""}${doneNow(k) ? " is-done" : ""}" id="xq-${n}" style="--c:${s.color}">
      <div class="exq-row">${doneBox(k)}<button class="exq-top" data-act="x-open" data-k="${esc(k)}" data-n="${n}" aria-expanded="${open}">
        <span class="exq-m num">${q.m}<small>mark${q.m === 1 ? "" : "s"}</small></span>
        <span class="exq-q"><small>${esc(q.t)} ${qTags(q)}</small><b>${esc(q.q)}</b></span>
        ${rec ? `<span class="tag" style="--c:${rec.b >= q.m ? "var(--good)" : "var(--amber)"}">${rec.b}/${q.m}</span>` : ""}
      </button></div>
      ${open ? `<div class="exq-body">${qWork(q, k)}</div>` : ""}
    </div>`;
  }).join("")}</div>`;
}
function examStart() {
  const { pool } = exPool();
  const fresh = pool.filter(q => !doneNow(exKey(q))), src = exq.skipDone ? fresh : pool;
  // mix topics: shuffle, but prefer not-yet-done first when not skipping
  const ordered = exq.skipDone ? shuffle(src) : [...shuffle(fresh), ...shuffle(pool.filter(q => doneNow(exKey(q))))];
  const list = ordered.slice(0, exq.n); if (!list.length) return;
  exq.reveal = {}; exq.ticks = {};
  exq.run = { list, i: 0, res: {}, done: false, t0: Date.now() };
  animNext = true; render(); window.scrollTo(0, 0);
}
function examRunner() {
  const r = exq.run, q = r.list[r.i], k = exKey(q), s = SUBJ[q.s];
  return `<div class="runner ex-runner" style="--c:${s.color}">
    <div class="run-top"><button class="x-btn" data-act="x-quit" aria-label="End this set">${svg("x")}</button>
      <div class="bar"><i style="width:${r.i / r.list.length * 100}%"></i></div>
      <span class="muted num" style="font-weight:700;font-size:14px">${r.i + 1} / ${r.list.length}</span></div>
    <div class="card exq-card" style="--c:${s.color}">
      <div class="exq-head"><span class="exq-m num">${q.m}<small>mark${q.m === 1 ? "" : "s"}</small></span>
        <div class="exq-q"><small>${esc(s.name)} · ${esc(q.t)} ${qTags(q)}</small><b>${esc(q.q)}</b></div></div>
      <div class="exq-body">${qWork(q, k)}</div>
      <div class="ex-foot">${doneBox(k)}<span style="flex:1"></span>
        <button class="btn ghost" data-act="x-skipq">Skip</button>
        <button class="btn" data-act="x-next"${exq.reveal[k] ? "" : " disabled title=\"Check the mark scheme first\""}>${r.i + 1 < r.list.length ? "Save & next" : "Save & finish"}</button></div>
    </div>
  </div>`;
}
function examNext(doSave) {
  const r = exq.run, q = r.list[r.i], k = exKey(q);
  if (doSave) {
    const sc = exScore(q, k); S.exam = S.exam || {};
    const old = S.exam[k], firstToday = !old || old.d !== today();
    S.exam[k] = { b: Math.max(sc, old ? old.b : 0), l: sc, d: today() };
    S.exDone = S.exDone || {}; S.exDone[k] = S.exDone[k] || today();
    const xp = firstToday ? Math.min(25, 3 + sc) : 0; if (xp) addXP(xp);
    r.res[k] = { sc, m: q.m, xp };
    if (sc >= q.m && q.m >= 3) toast("exam", "Full marks!", `${sc}/${q.m}${xp ? " · +" + xp + " XP" : ""}`);
  } else r.res[k] = { skip: true, m: q.m };
  if (r.i + 1 < r.list.length) { r.i++; }
  else { r.done = true; const got = Object.values(r.res).reduce((a, x) => a + (x.sc || 0), 0), tot = Object.values(r.res).reduce((a, x) => a + (x.skip ? 0 : x.m), 0); if (tot && got / tot >= .8) confetti(); }
  save(); checkBadges(); animNext = true; render(); window.scrollTo(0, 0);
}
function examResult() {
  const r = exq.run, rows = r.list.map(q => ({ q, k: exKey(q), x: r.res[exKey(q)] || { skip: true, m: q.m } }));
  const got = rows.reduce((a, x) => a + (x.x.sc || 0), 0), tot = rows.reduce((a, x) => a + (x.x.skip ? 0 : x.x.m), 0), xp = rows.reduce((a, x) => a + (x.x.xp || 0), 0);
  const pct = tot ? Math.round(got / tot * 100) : 0;
  return `<div class="runner"><div class="card result">
    <div class="muted" style="font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:12px">Set complete</div>
    <div class="score num">${got}<span style="font-size:.45em;color:var(--muted)"> / ${tot}</span></div>
    <div class="verdict">${pct >= 80 ? "Exam-ready on this lot." : pct >= 50 ? "Solid. Go over the points you missed." : tot ? "Worth another go once you've revised it." : "All skipped. Try a set again?"}</div>
    <div class="result-stats"><div><b class="num">${pct}%</b><span>Marks</span></div><div><b class="num">+${xp}</b><span>XP</span></div><div><b class="num">${fmtMin(Math.round((Date.now() - r.t0) / 1000))}</b><span>Time</span></div></div>
    <div class="ex-res">${rows.map(({ q, k, x }) => `<div class="ex-res-row">${doneBox(k)}<span class="exq-q"><small>${esc(q.t)}</small><b>${esc(q.q)}</b></span><span class="tag" style="--c:${x.skip ? "var(--muted)" : x.sc >= q.m ? "var(--good)" : x.sc ? "var(--amber)" : "var(--bad)"}">${x.skip ? "skipped" : x.sc + "/" + q.m}</span></div>`).join("")}</div>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn" data-act="x-start">Another set</button><button class="btn ghost" data-act="x-quit">Change settings</button></div>
  </div></div>`;
}
function initPads() {
  document.querySelectorAll(".pad").forEach(pad => {
    const k = pad.dataset.k, c = pad.querySelector(".pad-c"), ctx = c.getContext("2d");
    const W = c.clientWidth, H = 260, dpr = devicePixelRatio || 1;
    c.width = W * dpr; c.height = H * dpr; c.style.height = H + "px"; ctx.scale(dpr, dpr);
    let tool = "pen", down = false, last = null;
    if (exq.pad[k]) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, W, H); img.src = exq.pad[k]; }
    const P = e => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    c.addEventListener("pointerdown", e => { down = true; last = P(e); c.setPointerCapture(e.pointerId); });
    c.addEventListener("pointermove", e => {
      if (!down) return; const p = P(e);
      ctx.globalCompositeOperation = tool === "erase" ? "destination-out" : "source-over";
      ctx.strokeStyle = "#e9edff"; ctx.lineWidth = tool === "erase" ? 22 : 2.4; ctx.lineCap = ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); last = p;
    });
    const end = () => { if (!down) return; down = false; exq.pad[k] = c.toDataURL(); };
    c.addEventListener("pointerup", end); c.addEventListener("pointercancel", end);
    pad.querySelectorAll(".pad-t").forEach(b => b.addEventListener("click", () => {
      if (b.dataset.pt === "clear") { ctx.clearRect(0, 0, W, H); delete exq.pad[k]; return; }
      tool = b.dataset.pt; pad.querySelectorAll(".pad-t").forEach(x => x.classList.toggle("on", x === b));
    }));
  });
}
function examSave(k, el) {
  const q = EXQ.find(x => exKey(x) === k); if (!q) return;
  const sc = exScore(q, k); S.exam = S.exam || {};
  const old = S.exam[k], firstToday = !old || old.d !== today();
  S.exam[k] = { b: Math.max(sc, old ? old.b : 0), l: sc, d: today() };
  S.exDone = S.exDone || {}; S.exDone[k] = S.exDone[k] || today();
  if (firstToday) { const r = el.getBoundingClientRect(); addXP(Math.min(25, 3 + sc), { x: r.left, y: r.top }); }
  if (sc >= q.m) confetti();
  toast("exam", sc >= q.m ? "Full marks!" : "Mark saved", `${sc}/${q.m}${firstToday ? " · +" + Math.min(25, 3 + sc) + " XP" : ""}`);
  save(); checkBadges(); exq.open = null; render();
}
function examRandom() {
  const pool = EXQ.filter(q => q.s === exq.sid && (!exq.topic || q.t === exq.topic) && mOk(q));
  const fresh = pool.filter(q => !(S.exam || {})[exKey(q)]);
  const q = pick(fresh.length ? fresh : pool); if (!q) return;
  exq.open = exKey(q); render();
  const i = pool.indexOf(q); const n = pool.indexOf(q);
  const c = document.getElementById("xq-" + n); if (c) c.scrollIntoView({ block: "center", behavior: "smooth" });
}

/* ================= PROFILE / STATS ================= */
function profileView() {
  const L = levelOf(S.xp), from = lvlXP(L), to = lvlXP(L + 1), st = S.stats;
  const dayKeys = Object.keys(S.days).sort(), active = dayKeys.filter(k => (S.days[k].xp || 0) > 0).length;
  const subjSecAll = {}; dayKeys.forEach(k => Object.entries(S.days[k].subjSec || {}).forEach(([sid, v]) => subjSecAll[sid] = (subjSecAll[sid] || 0) + v));
  const maxSubj = Math.max(1, ...Object.values(subjSecAll));
  const E = S.exam || {}, exN = Object.keys(E).length, exGot = Object.values(E).reduce((a, x) => a + (x.b || 0), 0);
  const exTot = Object.keys(E).reduce((a, k) => { const q = EXQ.find(x => exKey(x) === k); return a + (q ? q.m : 0); }, 0);
  const got = Object.keys(S.badges).length;
  // last 8 weeks of minutes (Mon–Sun)
  const weeks = []; const now = new Date(), dow = (now.getDay() + 6) % 7;
  for (let w = 7; w >= 0; w--) { let sec = 0; const start = new Date(); start.setDate(now.getDate() - dow - 7 * w);
    for (let i = 0; i < 7; i++) { const d = new Date(start); d.setDate(start.getDate() + i); sec += (S.days[dkey(d)] || {}).sec || 0; }
    weeks.push({ label: start.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), min: Math.round(sec / 60) }); }
  const wmax = Math.max(30, ...weeks.map(w => w.min));
  const tile = (v, l, c) => `<div class="card stat pf-tile"${c ? ` style="--c:${c}"` : ""}><div class="label">${l}</div><div class="v num">${v}</div></div>`;
  return topbar("Your stats", "Everything you've done so far.") + `
  <section class="card pf-hero">
    <div class="avatar big">${esc((S.name || "J")[0].toUpperCase())}</div>
    <div class="pf-id"><h2>${esc(S.name)}</h2><div class="muted">Level ${L} · ${rankOf(L)} · ${S.xp.toLocaleString("en-GB")} XP</div>
      <div class="bar" style="margin-top:10px"><i style="width:${(S.xp - from) / (to - from) * 100}%"></i></div>
      <div class="muted" style="font-size:12.5px;margin-top:6px">${(to - S.xp).toLocaleString("en-GB")} XP to level ${L + 1}</div></div>
    <div class="pf-acc">${ACC.server ? (ACC.user ? `<span class="sync-pill on">${svg("check")} Synced as <b>${esc(ACC.user)}</b></span><button class="mini-link" data-act="sign-out">Sign out</button>`
      : `<span class="sync-pill">Only saved on this device</span><button class="btn small" data-act="sign-in">${svg("user")} Sign in to sync</button>`)
      : `<span class="sync-pill${synced ? " on" : ""}">${synced ? "Saved to your account" : "Saved on this device"}</span>`}</div>
  </section>
  <section class="grid pf-tiles">
    ${tile(fmtMin(S.sec), "Time revised")}${tile(streak() + "<small> days</small>", "Current streak")}${tile(Math.max(st.bestStreak, streak()) + "<small> days</small>", "Best streak")}${tile(active, "Days revised")}
    ${tile(st.answered.toLocaleString("en-GB"), "Questions answered")}${tile(st.answered ? Math.round(st.correct / st.answered * 100) + "%" : "–", "Quiz accuracy")}${tile(st.quizzes, "Quizzes done")}${tile(st.perfect, "Perfect quizzes")}
    ${tile(st.cards.toLocaleString("en-GB"), "Flashcards flipped")}${tile(st.focus, "Focus sessions")}${tile(exN, "Exam Qs marked")}${tile(exTot ? Math.round(exGot / exTot * 100) + "%" : "–", "Exam marks banked")}
    ${tile((S.papers || []).length, "Past papers done")}${tile(st.bestCombo, "Best combo")}${tile(got + "<small> / " + BADGES.length + "</small>", "Badges")}${tile(Object.keys(S.exDone || {}).length, "Exam Qs ticked off")}
  </section>
  <section class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));margin-top:16px">
    <div class="card"><div class="card-head"><h2>Last 8 weeks</h2><span class="muted" style="font-size:13px;font-weight:600">minutes revised</span></div>
      <div class="pf-weeks">${weeks.map((w, i) => `<div class="pf-wk${i === 7 ? " now" : ""}" title="${w.min} min, week of ${w.label}"><span class="num">${w.min || ""}</span><i style="height:${Math.max(3, w.min / wmax * 100)}%"></i><small>${w.label}</small></div>`).join("")}</div></div>
    <div class="card"><div class="card-head"><h2>By subject</h2><span class="muted" style="font-size:13px;font-weight:600">time · quiz accuracy</span></div>
      ${SUBJECTS.map(x => { const sec = subjSecAll[x.id] || 0, acc = accuracy(x.id); return `<div class="pf-sub" style="--c:${x.color}"><span class="wk-name">${x.short}</span><span class="wk-bar"><i style="width:${sec / maxSubj * 100}%"></i></span><span class="num pf-sub-v">${fmtMin(sec)}</span><span class="num pf-sub-a">${acc == null ? "–" : acc + "%"}</span></div>`; }).join("")}
      <p class="muted" style="font-size:12px;margin:8px 0 0">Subject time counts from when weekly targets were added.</p></div>
  </section>`;
}

/* ================= CALENDAR ================= */
const revBtns = e => { const p = evPaper(e); return `<span class="rev-btns"><button class="plink" data-act="rev-quiz" data-s="${e.s}" data-p="${p}" title="Quiz on ${esc(SUBJ[e.s].name)}${p ? " " + p : ""} topics">${svg("quiz")}Quiz</button><button class="plink go" data-act="rev-exam" data-s="${e.s}" data-p="${p}" title="Exam questions for ${esc(SUBJ[e.s].name)}${p ? " " + p : ""}">${svg("exam")}Exam Qs</button></span>`; };
const allEvents = () => [...(window.EVENTS || []), ...(S.events || []).map(e => ({ ...e, k: "own", mine: true }))];
const daysTo = d => Math.round((new Date(d + "T00:00:00") - new Date(today() + "T00:00:00")) / 86400000);
const upcoming = () => allEvents().map(e => ({ ...e, days: daysTo(e.d) })).filter(e => e.days >= 0).sort((a, b) => a.d.localeCompare(b.d) || (a.time || "").localeCompare(b.time || ""));
const shortEv = t => t.replace(/ \(mock\)$/, "").replace(/^Combined Science Paper \d: /, "Sci ").replace(/Paper (\d)[^]*$/, "P$1").replace(/Component (\d)[^]*$/, "P$1")
  .replace("English Literature", "Eng Lit").replace("English Language", "Eng Lang").replace("Geography", "Geog").replace("Design & Technology", "D&T").replace("Biology", "Bio").replace("Chemistry", "Chem").replace("Physics", "Phys")
  .replace(" (no school)", "").replace(" (keep free)", "");
let cal = { y: new Date().getFullYear(), m: new Date().getMonth(), sel: today() };
const KIND = { mock: ["Mock", "#ff9f43"], gcse: ["GCSE", "#ff5d73"], info: ["Key date", "#9ba4c2"], own: ["Yours", "#4f7dff"] };
function calView() {
  const first = new Date(cal.y, cal.m, 1), start = (first.getDay() + 6) % 7, dim = new Date(cal.y, cal.m + 1, 0).getDate();
  const ev = allEvents(), byDay = {}; ev.forEach(e => (byDay[e.d] = byDay[e.d] || []).push(e));
  const monthName = first.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const cells = [];
  for (let i = 0; i < start; i++) cells.push(`<div class="cal-cell blank"></div>`);
  for (let d = 1; d <= dim; d++) {
    const k = cal.y + "-" + pad(cal.m + 1) + "-" + pad(d), list = byDay[k] || [], rec = S.days[k], wd = (start + d - 1) % 7;
    const hit = rec && rec.xp >= STREAK_XP;
    cells.push(`<button class="cal-cell${k === today() ? " today" : ""}${k === cal.sel ? " sel" : ""}${wd > 4 ? " wkend" : ""}${list.some(e => e.k === "gcse") ? " has-gcse" : list.some(e => e.k === "mock") ? " has-mock" : ""}" data-act="cal-day" data-d="${k}" aria-label="${d} ${monthName}${list.length ? ", " + list.length + " events" : ""}">
      <span class="cal-n">${d}${hit ? `<i class="cal-hit" title="Revised: ${rec.xp} XP">${svg("flame")}</i>` : ""}${rec && rec.sec >= 60 ? `<em class="cal-min" title="${fmtMin(rec.sec)} revised">${fmtMin(rec.sec).replace(" min", "m")}</em>` : ""}</span>
      ${list.slice(0, 3).map(e => `<span class="cal-ev" style="--c:${e.s && SUBJ[e.s] ? SUBJ[e.s].color : KIND[e.k][1]}">${e.time ? `<b>${e.time}</b> ` : ""}${esc(shortEv(e.t))}</span>`).join("")}
      ${list.length > 3 ? `<span class="cal-more">+${list.length - 3} more</span>` : ""}
    </button>`);
  }
  const selList = (byDay[cal.sel] || []).slice().sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  const selRec = S.days[cal.sel], selDays = daysTo(cal.sel);
  const up = upcoming().slice(0, 8);
  const label = d => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const evRow = e => `<div class="cal-item" style="--c:${e.s && SUBJ[e.s] ? SUBJ[e.s].color : KIND[e.k][1]}"><i></i><div><b>${esc(e.t)}</b><span>${[e.time, e.len, KIND[e.k][0]].filter(Boolean).join(" · ")}</span></div>${e.s && !e.mine ? revBtns(e) : ""}${e.mine ? `<button class="plink del" data-act="cal-del" data-id="${esc(e.id)}" aria-label="Delete ${esc(e.t)}">${svg("trash")}</button>` : ""}</div>`;
  return topbar("Calendar", "Your mocks, GCSEs and revision days in one place.") + `
  <div class="cal-wrap">
    <div class="card cal-card">
      <div class="cal-head"><button class="ann-btn cal-nav" data-act="cal-mv" data-n="-1" aria-label="Previous month">‹</button><h2>${monthName}</h2><button class="ann-btn cal-nav" data-act="cal-mv" data-n="1" aria-label="Next month">›</button>
        <div class="cal-jumps"><button class="mchip" data-act="cal-jump" data-d="${today()}">Today</button><button class="mchip" data-act="cal-jump" data-d="2027-01-04">Mocks</button><button class="mchip" data-act="cal-jump" data-d="2027-05-11">GCSEs</button></div></div>
      <div class="cal-grid">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => `<div class="cal-dow">${d}</div>`).join("")}${cells.join("")}</div>
      <div class="cal-legend"><span><i style="background:#ff9f43"></i>Mock</span><span><i style="background:#ff5d73"></i>GCSE</span><span class="cal-hit">${svg("flame")}</span><span>Streak day</span><span><em class="cal-min">25m</em> time revised</span><span class="muted">Colours on events match the subject</span></div>
    </div>
    <div class="cal-side">
      <div class="card">
        <h2 style="margin-bottom:2px">${label(cal.sel)}</h2>
        <div class="muted" style="font-size:13px;font-weight:600;margin-bottom:12px">${selDays === 0 ? "Today" : selDays > 0 ? "In " + selDays + " day" + (selDays === 1 ? "" : "s") : -selDays + " day" + (selDays === -1 ? "" : "s") + " ago"}${selRec && selRec.xp ? " · " + selRec.xp + " XP, " + fmtMin(selRec.sec || 0) + " revised" : ""}</div>
        ${selList.length ? selList.map(evRow).join("") : `<div class="muted" style="font-size:14px;margin-bottom:6px">Nothing on this day.</div>`}
        <form class="cal-add" data-form="cal-add"><input id="cal-new" maxlength="80" placeholder="Add something, e.g. Science homework" aria-label="New event"><button class="btn" type="submit">Add</button></form>
      </div>
      <div class="card">
        <h2 style="margin-bottom:12px">Coming up</h2>
        ${up.map(e => `<button class="cal-up" data-act="cal-jump" data-d="${e.d}" style="--c:${e.s && SUBJ[e.s] ? SUBJ[e.s].color : KIND[e.k][1]}"><span class="cal-days num">${e.days === 0 ? "Today" : e.days}<small>${e.days === 0 ? "" : e.days === 1 ? "day" : "days"}</small></span><span><b>${esc(e.t)}</b><small>${label(e.d)}${e.time ? " · " + e.time : ""}</small></span></button>`).join("")}
      </div>
    </div>
  </div>`;
}

/* ================= FOCUS ================= */
function focusView() {
  const p = focus.left / focus.len, m = Math.floor(focus.left / 60), s = focus.left % 60;
  const t = S.days[today()] || { sec: 0 };
  return topbar("Focus", "Revise away from the screen. Every minute counts towards your total and earns 2 XP.") + `
  <div class="focus">
    <div class="card timer">
      <div class="f-sub"><span>What are you revising?</span><div class="chips">${SUBJECTS.map(x => `<button class="chip small${focus.sid === x.id ? " on" : ""}" style="--c:${x.color}" data-act="f-sid" data-s="${x.id}"${focus.running ? " disabled" : ""}><i></i>${x.short}</button>`).join("")}</div></div>
      <div class="chips">${[...new Set([10, 15, 20, 25, 45, 60, focus.len / 60])].sort((a, b) => a - b).map(n => `<button class="chip${focus.len === n * 60 ? " on" : ""}" data-act="f-len" data-n="${n}"${focus.running ? " disabled" : ""}>${n} min</button>`).join("")}</div>
      <div class="timer-ring">${ring(p, 300, 14, focus.running ? "#4f7dff" : "#3a4a7a")}<div class="t"><div><b id="f-time">${pad(m)}:${pad(s)}</b><span>${focus.running ? "Focusing" : focus.left < focus.len ? "Paused" : "Ready"}</span></div></div></div>
      <div class="timer-controls">
        <button class="btn" data-act="f-toggle">${focus.running ? svg("pause") + " Pause" : svg("play") + (focus.left < focus.len ? " Resume" : " Start")}</button>
        <button class="btn ghost" data-act="f-reset">${svg("reset")} Reset</button>
      </div>
    </div>
    <div class="grid">
      <div class="card stat"><div class="label">Revised today</div><div class="v num">${fmtMin(t.sec || 0)}</div></div>
      <div class="card stat"><div class="label">Revised in total</div><div class="v num">${fmtMin(S.sec)}</div></div>
      <div class="card stat"><div class="label">Focus sessions finished</div><div class="v num">${S.stats.focus}</div></div>
      <div class="card"><h2 style="margin-bottom:8px">How to use it</h2><div class="muted" style="font-size:14px">Your school guide's 30-minute session: 5 min writing what you remember, 8 min checking notes, 12 min exam questions, 5 min marking. Finish a session for a +20 XP bonus.</div></div>
    </div>
  </div>`;
}
function focusTick() {
  if (!focus.running) return;
  focus.left--; addSec(1, focus.sid); focus.tick++; dayRec(today()).fsec++; if (focus.tick % 60 === 0) checkPlan();
  if (focus.tick % 60 === 0) addXP(2);
  const el = $("#f-time");
  if (focus.left <= 0) {
    focus.running = false; focus.left = focus.len; focus.tick = 0; S.stats.focus++;
    addXP(20); save(); toast("focus", "Focus session done", "+20 XP bonus. Take a 5-minute break."); confetti();
    if (view === "focus") render(); else renderRail();
    return;
  }
  ["#nav-ftime", "#nav-ftime2"].forEach(id => { const nt = $(id); if (nt) nt.textContent = fmtLeft(); });
  if (view === "focus" && el) {
    el.textContent = pad(Math.floor(focus.left / 60)) + ":" + pad(focus.left % 60);
    const c = $(".timer-ring circle:nth-child(2)"); if (c) { const len = parseFloat(c.getAttribute("stroke-dasharray")); c.setAttribute("stroke-dashoffset", len * (1 - focus.left / focus.len)); }
  }
}

/* ================= TROPHIES ================= */
function trophiesView() {
  const L = levelOf(S.xp); const got = BADGES.filter(b => S.badges[b[0]]).length;
  const ladder = []; for (let l = Math.max(1, L - 2); l <= L + 4; l++) ladder.push(l);
  return topbar("Trophies", `${got} of ${BADGES.length} badges unlocked`) + `
  <section class="grid badges">${BADGES.map(([id, name, desc]) => `<div class="badge${S.badges[id] ? " got" : ""}"><div class="ico">${svg(S.badges[id] ? "medal" : "lock")}</div><div><b>${name}</b><span>${desc}</span></div></div>`).join("")}</section>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr));margin-top:26px">
    <div><div class="section-title" style="margin-top:0"><h2>Level road</h2></div><div class="ladder">${ladder.map(l => `<div class="rung${l < L ? " done" : l === L ? " now" : ""}"><b class="num">Lv ${l}</b><span style="flex:1">${rankOf(l)}</span><span class="muted num">${lvlXP(l).toLocaleString("en-GB")} XP</span></div>`).join("")}</div></div>
    <div><div class="section-title" style="margin-top:0"><h2>Settings</h2></div><div class="card setup" style="gap:18px">
      <div class="field"><label for="set-name">Your name</label><input id="set-name" value="${esc(S.name)}" maxlength="24" style="background:var(--panel-2);border:1px solid var(--line);border-radius:12px;padding:11px 14px;color:var(--text);font:inherit;font-weight:600"></div>
      <div class="field"><label for="set-week">Weekly minutes per subject</label><select id="set-week">${[15, 20, 25, 30, 45, 60].map(g => `<option value="${g}"${weekTarget() === g ? " selected" : ""}>${g} min${g === 25 ? " (default)" : ""}</option>`).join("")}</select></div>
      <div class="field"><label for="set-goal">Daily XP goal</label><select id="set-goal">${[50, 100, 150, 200, 300].map(g => `<option value="${g}"${S.goal === g ? " selected" : ""}>${g} XP${g === 100 ? " (recommended)" : ""}</option>`).join("")}</select></div>
      <div class="muted" style="font-size:13px">A day counts towards your streak once you earn ${STREAK_XP} XP. Correct answers give 10 XP plus up to 10 XP combo bonus, cards give 3 XP, and focus time gives 2 XP a minute.</div>
      <div><button class="btn small ghost" data-act="reset" style="color:var(--bad);box-shadow:inset 0 0 0 1.5px rgba(255,93,115,.4)">Reset all progress</button></div>
    </div></div>
  </div>`;
}

/* ================= feedback FX ================= */
function toast(icon, title, sub) {
  const t = document.createElement("div"); t.className = "toast";
  t.innerHTML = `<span class="ico">${svg(icon)}</span><div>${esc(title)}${sub ? `<small>${esc(sub)}</small>` : ""}</div>`;
  $("#toasts").appendChild(t); setTimeout(() => t.remove(), 3800);
}
function floatXP(text, at) {
  const f = document.createElement("div"); f.className = "float-xp"; f.textContent = text;
  f.style.left = Math.max(10, at.x) + "px"; f.style.top = at.y + "px"; document.body.appendChild(f); setTimeout(() => f.remove(), 1000);
}
function levelUp(L) {
  const bg = document.createElement("div"); bg.className = "modal-bg";
  bg.innerHTML = `<div class="card modal" role="dialog" aria-modal="true" aria-label="Level up"><div class="muted" style="font-weight:800;letter-spacing:.14em;text-transform:uppercase;font-size:12px">Level up</div><div class="lvl-big num">${L}</div><h2>${rankOf(L)}</h2><p>${(lvlXP(L + 1) - S.xp).toLocaleString("en-GB")} XP to level ${L + 1}.</p><div class="row"><button class="btn" data-act="close-modal">Keep going</button></div></div>`;
  document.body.appendChild(bg); confetti();
  bg.addEventListener("click", e => { if (e.target === bg || e.target.closest("[data-act=close-modal]")) bg.remove(); });
}
function confirmBox(title, body, yes, onYes) {
  const bg = document.createElement("div"); bg.className = "modal-bg";
  bg.innerHTML = `<div class="card modal" role="dialog" aria-modal="true"><h2>${esc(title)}</h2><p>${esc(body)}</p><div class="row"><button class="btn ghost" data-x="no">Cancel</button><button class="btn again" data-x="yes">${esc(yes)}</button></div></div>`;
  document.body.appendChild(bg);
  bg.addEventListener("click", e => { const b = e.target.closest("[data-x]"); if (e.target === bg || b) { bg.remove(); if (b && b.dataset.x === "yes") onYes(); } });
}
function confetti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = $("#confetti"), ctx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = ["#4f7dff", "#ff7a2f", "#ffc93d", "#34d399", "#ff5d8f", "#c77dff"];
  const ps = Array.from({ length: 120 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 12 - 4, s: 4 + Math.random() * 6, c: pick(cols), r: Math.random() * 6, vr: (Math.random() - .5) * .3 }));
  let f = 0;
  (function step() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .35; p.vx *= .99; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); });
    if (++f < 110) requestAnimationFrame(step); else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}

/* ================= events ================= */
document.addEventListener("click", e => {
  if (view === "exam" && exq.open && exq.reveal[exq.open] && !e.target.closest(".exq.open") && !e.target.closest(".modal-bg")) { exq.reveal[exq.open] = false; if (!e.target.closest("[data-act]")) render(); }
  const el = e.target.closest("[data-act]"); if (!el || el.disabled) return;
  const a = el.dataset.act;
  switch (a) {
    case "nav": if (el.dataset.v === "cards") fc = null; if (el.dataset.v === "quiz" && quiz && quiz.done) quiz = null; go(el.dataset.v); break;
    case "quick": startQuiz("all", "mixed", "", 10); break;
    case "mistakes": startQuiz("all", "mistakes", "", 10); break;
    case "subj-quiz": qsetup = { ...qsetup, sid: el.dataset.s, mode: "mixed" }; startQuiz(el.dataset.s, "mixed", "", 10); break;
    case "plan-quiz": startQuiz(el.dataset.s, "mixed", "", 10); break;
    case "plan-topic": qsetup = { sid: el.dataset.s, mode: "topic", topic: el.dataset.t, n: 5 }; startQuiz(el.dataset.s, "topic", el.dataset.t, 5); break;
    case "plan-focus": if (!focus.running) { focus.len = focus.left = (+el.dataset.n || 15) * 60; focus.tick = 0; focus.sid = el.dataset.s || focus.sid || ""; } go("focus"); break;
    case "f-sid": if (!focus.running) { focus.sid = focus.sid === el.dataset.s ? "" : el.dataset.s; render(); } break;
    case "p-sid": paperSid = el.dataset.s; render(); break;
    case "annotate": { const k = el.dataset.k; openAnn({ title: el.dataset.t, pk: k || "", onDone: (n, kk) => paperDone(n, kk) }); break; }
    case "resume": openAnn({ resume: el.dataset.id, onDone: (n, kk) => paperDone(n, kk) }); break;
    case "del-prog": confirmBox("Delete this paper?", "Removes \"" + el.dataset.t + "\" and its annotations from this device. Download it first if you want to keep your work.", "Delete", () => { window.Annotator.remove(el.dataset.id).then(refreshInProg); }); break;
    case "p-check": if (S.donePapers && S.donePapers[el.dataset.k]) confirmBox("Untick this paper?", "It'll come off your finished list. The XP stays.", "Untick", () => paperUndone(el.dataset.k)); else paperDone(el.dataset.t, el.dataset.k); break;
    case "v-sid": vidSid = el.dataset.s; render(); break;
    case "x-sid": exq.sid = el.dataset.s; exq.paper = ""; exq.topic = ""; exq.marks = ""; exq.open = null; exq.run = null; render(); break;
    case "topic-exam": exq = { ...exq, sid: el.dataset.s, paper: "", topic: el.dataset.t, marks: "", open: null, run: null, browse: false }; go("exam"); break;
    case "sign-in": openAuth(S.updated ? "register" : "login"); break;
    case "sign-out": confirmBox("Sign out?", "Your progress stays saved on the server and on this device.", "Sign out", async () => { try { await apiFetch("POST", "/api/logout"); } catch (e) {} signOutLocal(); render(); }); break;
    case "cal-mv": { const d = new Date(cal.y, cal.m + +el.dataset.n, 1); cal.y = d.getFullYear(); cal.m = d.getMonth(); render(); break; }
    case "cal-day": cal.sel = el.dataset.d; render(); break;
    case "cal-jump": { const d = new Date(el.dataset.d + "T00:00:00"); cal.y = d.getFullYear(); cal.m = d.getMonth(); cal.sel = el.dataset.d; render(); break; }
    case "cal-del": S.events = (S.events || []).filter(e => e.id !== el.dataset.id); save(); render(); break;
    case "x-marks": exq.marks = el.dataset.m; exq.open = null; render(); break;
    case "x-n": exq.n = +el.dataset.n; render(); break;
    case "x-start": examStart(); break;
    case "x-quit": if (exq.run && !exq.run.done && exq.run.i > 0) confirmBox("End this set?", "Marks you've saved stay saved.", "End set", () => { exq.run = null; render(); }); else { exq.run = null; render(); } break;
    case "x-next": examNext(true); break;
    case "x-skipq": examNext(false); break;
    case "x-done": toggleDone(el.dataset.k); render(); break;
    case "x-browse": exq.browse = !exq.browse; exq.open = null; render(); window.scrollTo(0, 0); break;
    case "x-open": exq.reveal = {}; exq.open = exq.open === el.dataset.k ? null : el.dataset.k; render(); { const c = document.getElementById("xq-" + el.dataset.n); if (c) c.scrollIntoView({ block: "nearest" }); } break;
    case "x-reveal": exq.reveal[el.dataset.k] = true; render(); break;
    case "x-hide": exq.reveal[el.dataset.k] = false; render(); break;
    case "x-tick": { const k = el.dataset.k, i = +el.dataset.i, t = (exq.ticks[k] = exq.ticks[k] || {}); t[i] = !t[i]; render(); break; }
    case "x-save": examSave(el.dataset.k, el); break;
    case "x-random": examRandom(); break;
    case "subj-topics": topicSid = el.dataset.s; topicPaper = el.dataset.p || ""; go("topics"); break;
    case "qs-sid": qsetup.sid = el.dataset.s; qsetup.paper = ""; if (qsetup.sid === "all" && qsetup.mode === "topic") qsetup.mode = "mixed"; qsetup.topic = ""; render(); break;
    case "qs-mode": if (el.dataset.m === "topic" && qsetup.sid === "all") break; qsetup.mode = el.dataset.m;
      if (qsetup.mode === "topic" && !qsetup.topic) { const t = SUBJ[qsetup.sid].topics.find(t => topicHasQs(qsetup.sid, t[1])); qsetup.topic = t ? t[1] : ""; } render(); break;
    case "qs-n": qsetup.n = +el.dataset.n; render(); break;
    case "start-quiz": startQuiz(qsetup.sid, qsetup.mode, qsetup.topic, qsetup.n, qsetup.paper); break;
    case "qs-paper": qsetup.paper = el.dataset.p; if (qsetup.mode === "topic") { const t = SUBJ[qsetup.sid].topics.find(t => inPaper(qsetup.sid, t[1], qsetup.paper) && topicHasQs(qsetup.sid, t[1])); qsetup.topic = t ? t[1] : ""; } render(); break;
    case "x-paper": exq.paper = el.dataset.p; exq.topic = ""; exq.marks = ""; render(); break;
    case "rev-quiz": qsetup = { ...qsetup, sid: el.dataset.s, paper: el.dataset.p || "", mode: "mixed", topic: "", n: 10 }; startQuiz(el.dataset.s, "mixed", "", 10, el.dataset.p || ""); break;
    case "rev-exam": exq = { ...exq, sid: el.dataset.s, paper: el.dataset.p || "", topic: "", marks: "", run: null, browse: false, open: null }; go("exam"); break;
    case "answer": answer(+el.dataset.i, { currentTarget: el }); break;
    case "next-q": nextQ(); break;
    case "quit-quiz": confirmBox("Quit this quiz?", "XP you've already earned stays.", "Quit", () => { quiz = null; render(); }); break;
    case "again": { const q = quiz; quiz = null; startQuiz(q.sid, q.mode === "mistakes" ? "mistakes" : qsetup.mode === "topic" ? "topic" : "mixed", qsetup.topic, q.qs.length); break; }
    case "open-deck": openDeck(el.dataset.d); break;
    case "quit-deck": fc = null; render(); break;
    case "flip": if (fc) { fc.flipped = !fc.flipped; render(); } break;
    case "card-again": cardAnswer(false, { currentTarget: el }); break;
    case "card-got": cardAnswer(true, { currentTarget: el }); break;
    case "t-sid": if (topicSid !== el.dataset.s) topicPaper = ""; topicSid = el.dataset.s; render(); break;
    case "t-paper": topicPaper = el.dataset.p; render(); break;
    case "fc-sid": fcF = { sid: el.dataset.s, paper: "" }; render(); break;
    case "fc-paper": fcF.paper = el.dataset.p; render(); break;
    case "rag": { const r = (S.rag[topicSid] = S.rag[topicSid] || {}); const i = el.dataset.i; r[i] = r[i] === el.dataset.v ? undefined : el.dataset.v; if (!r[i]) delete r[i]; save(); checkBadges(); render(); break; }
    case "topic-quiz": qsetup = { sid: topicSid, mode: "topic", topic: el.dataset.t, n: 10 }; startQuiz(topicSid, "topic", el.dataset.t, 10); break;
    case "f-len": focus.len = focus.left = +el.dataset.n * 60; focus.tick = 0; render(); break;
    case "f-toggle": focus.running = !focus.running; render(); break;
    case "f-reset": focus.running = false; focus.left = focus.len; focus.tick = 0; render(); break;
    case "reset": confirmBox("Reset all progress?", "This wipes your XP, streak, minutes, badges and ratings. It can't be undone.", "Reset everything", () => { S = blank(); save(); flushRemote(); render(); }); break;
  }
});
document.addEventListener("submit", e => {
  if (e.target.dataset.form !== "cal-add") return; e.preventDefault();
  const v = $("#cal-new").value.trim(); if (!v) return;
  S.events = S.events || []; S.events.push({ id: Date.now().toString(36), d: cal.sel, t: v }); save(); render();
});
document.addEventListener("input", e => { if (e.target.dataset && e.target.dataset.draft) exq.draft[e.target.dataset.draft] = e.target.value; });
document.addEventListener("change", e => {
  if (e.target.id === "qs-topic") { qsetup.topic = e.target.value; }
  if (e.target.id === "x-skip") { exq.skipDone = e.target.checked; render(); }
  if (e.target.id === "x-topic") { exq.topic = e.target.value; exq.open = null; render(); }
  if (e.target.id === "set-week") { S.weekMin = +e.target.value; const d = dayRec(today()); if (d.plan && !d.tasks.focus) d.plan.time = timeTask(); save(); render(); }
  if (e.target.id === "set-goal") { S.goal = +e.target.value; save(); updateStatus(); }
  if (e.target.id === "set-name") { S.name = e.target.value.trim() || "Josh"; save(); }
});
document.addEventListener("keydown", e => {
  if (e.target.matches("input, select, textarea")) return;
  if ($(".modal-bg")) { if (e.key === "Escape") $(".modal-bg").remove(); return; }
  if (view === "quiz" && quiz && !quiz.done) {
    if (/^[1-4]$/.test(e.key) && quiz.picked === null) { const b = document.querySelectorAll(".opt")[+e.key - 1]; if (b) answer(+e.key - 1, { currentTarget: b }); }
    else if (e.key === "Enter" && quiz.picked !== null) { e.preventDefault(); nextQ(); }
  } else if (view === "cards" && fc && !fc.done) {
    if (e.key === " ") { e.preventDefault(); fc.flipped = !fc.flipped; render(); }
    else if (fc.flipped && e.key === "1") cardAnswer(false, { currentTarget: $("[data-act=card-again]") });
    else if (fc.flipped && e.key === "2") cardAnswer(true, { currentTarget: $("[data-act=card-got]") });
  }
});
addEventListener("hashchange", () => { const v = location.hash.slice(1); if ((NAV.some(n => n[0] === v) || v === "profile") && v !== view) { view = v; animNext = true; render(); } });
addEventListener("visibilitychange", () => { if (document.hidden) save(); });

/* time on task: counts while you're in a quiz or flashcard session and active in the last 90 s */
setInterval(() => {
  if (focus.running) { focusTick(); return; }
  if (document.hidden || Date.now() - lastAct >= 90000) return;
  if (view === "quiz" && quiz && !quiz.done) addSec(1, (quiz.qs[quiz.i] || {}).s);
  else if (view === "cards" && fc && !fc.done) addSec(1, fc.deck.s);
  else if (view === "exam" && exq.run && !exq.run.done) addSec(1, exq.run.list[exq.run.i].s);
  else if (view === "exam" && exq.open) addSec(1, exq.sid);
}, 1000);

/* boot */
const startV = location.hash.slice(1);
if (NAV.some(n => n[0] === startV) || startV === "profile") view = startV;
render();
connect();
})();
