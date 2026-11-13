/*
  Revise server: serves the site and syncs progress between devices.
  No dependencies — needs Node 18 or newer.

    node server.js            → http://localhost:3000

  Environment variables (all optional):
    PORT        port to listen on (hosts like Render/Railway set this for you)
    DATA_DIR    folder for saved accounts + progress (default ./data). On a host,
                point this at a persistent disk/volume or data is lost on redeploy.
    UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
                use a free Upstash Redis database instead of files (good for hosts
                without a persistent disk, e.g. Render's free tier).
    ALLOW_SIGNUPS  set to "false" to stop new accounts being created.
*/
"use strict";
const http = require("http");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const crypto = require("crypto");

const PORT = +process.env.PORT || 3000;
const ROOT = path.join(__dirname, "public");
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, "data"));
const ALLOW_SIGNUPS = process.env.ALLOW_SIGNUPS !== "false";
const MAX_BODY = 5 * 1024 * 1024;

/* ---------------- storage: files or Upstash Redis ---------------- */
const UP_URL = process.env.UPSTASH_REDIS_REST_URL, UP_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const store = UP_URL && UP_TOKEN ? {
  kind: "upstash",
  async get(key) {
    const r = await fetch(UP_URL + "/get/" + encodeURIComponent(key), { headers: { Authorization: "Bearer " + UP_TOKEN } });
    const j = await r.json(); return j.result ? JSON.parse(j.result) : null;
  },
  async set(key, val) {
    const r = await fetch(UP_URL, { method: "POST", headers: { Authorization: "Bearer " + UP_TOKEN, "Content-Type": "application/json" }, body: JSON.stringify(["SET", key, JSON.stringify(val)]) });
    if (!r.ok) throw new Error("Upstash write failed");
  },
  async del(key) { await fetch(UP_URL, { method: "POST", headers: { Authorization: "Bearer " + UP_TOKEN, "Content-Type": "application/json" }, body: JSON.stringify(["DEL", key]) }); }
} : {
  kind: "files",
  file: key => path.join(DATA_DIR, key.replace(/[^a-z0-9_.-]/gi, "_") + ".json"),
  async get(key) { try { return JSON.parse(await fsp.readFile(this.file(key), "utf8")); } catch (e) { return null; } },
  async set(key, val) {  // write to a temp file then rename, so a crash can't leave half a file
    await fsp.mkdir(DATA_DIR, { recursive: true });
    const f = this.file(key), tmp = f + "." + process.pid + ".tmp";
    await fsp.writeFile(tmp, JSON.stringify(val)); await fsp.rename(tmp, f);
  },
  async del(key) { try { await fsp.unlink(this.file(key)); } catch (e) {} }
};

/* ---------------- accounts ---------------- */
const norm = u => String(u || "").trim().toLowerCase();
const validUser = u => /^[a-z0-9_.-]{3,24}$/.test(u);
const hash = (pw, salt) => new Promise((res, rej) => crypto.scrypt(pw, salt, 64, (e, k) => e ? rej(e) : res(k.toString("hex"))));
const newToken = () => crypto.randomBytes(32).toString("hex");
const tokenKey = t => "token_" + crypto.createHash("sha256").update(t).digest("hex");

async function issueToken(user) {
  const t = newToken(); await store.set(tokenKey(t), { user, at: Date.now() }); return t;
}
async function userFromReq(req) {
  const m = /^Bearer ([a-f0-9]{64})$/.exec(req.headers.authorization || ""); if (!m) return null;
  const rec = await store.get(tokenKey(m[1])); return rec ? rec.user : null;
}

// simple brute-force protection: 10 failed logins per username+IP per 15 minutes
const fails = new Map();
const failKey = (req, u) => (req.socket.remoteAddress || "") + "|" + u;
function tooMany(req, u) { const f = fails.get(failKey(req, u)); return f && f.n >= 10 && Date.now() - f.t < 15 * 60e3; }
function noteFail(req, u) { const k = failKey(req, u), f = fails.get(k); fails.set(k, f && Date.now() - f.t < 15 * 60e3 ? { n: f.n + 1, t: f.t } : { n: 1, t: Date.now() }); }

/* ---------------- http helpers ---------------- */
function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Content-Length": Buffer.byteLength(body) });
  res.end(body);
}
function readJSON(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on("data", c => { size += c.length; if (size > MAX_BODY) { reject(Object.assign(new Error("Too large"), { code: 413 })); req.destroy(); } else chunks.push(c); });
    req.on("end", () => { try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {}); } catch (e) { reject(Object.assign(new Error("Bad JSON"), { code: 400 })); } });
    req.on("error", reject);
  });
}

/* ---------------- API ---------------- */
async function api(req, res, url) {
  const route = req.method + " " + url.pathname;
  if (route === "GET /api/health") return send(res, 200, { ok: true, signups: ALLOW_SIGNUPS, storage: store.kind, persistent: store.kind === "upstash" || !!process.env.DATA_DIR });

  if (route === "POST /api/register") {
    if (!ALLOW_SIGNUPS) return send(res, 403, { error: "New accounts are switched off on this server." });
    const { username, password } = await readJSON(req); const u = norm(username);
    if (!validUser(u)) return send(res, 400, { error: "Username: 3–24 letters, numbers, dots, dashes or underscores." });
    if (typeof password !== "string" || password.length < 6) return send(res, 400, { error: "Password needs at least 6 characters." });
    if (await store.get("user_" + u)) return send(res, 409, { error: "That username is taken." });
    const salt = crypto.randomBytes(16).toString("hex");
    await store.set("user_" + u, { u, salt, hash: await hash(password, salt), created: Date.now() });
    return send(res, 200, { token: await issueToken(u), username: u });
  }

  if (route === "POST /api/login") {
    const { username, password } = await readJSON(req); const u = norm(username);
    if (tooMany(req, u)) return send(res, 429, { error: "Too many attempts. Try again in 15 minutes." });
    const rec = validUser(u) ? await store.get("user_" + u) : null;
    const ok = rec && typeof password === "string" && crypto.timingSafeEqual(Buffer.from(await hash(password, rec.salt), "hex"), Buffer.from(rec.hash, "hex"));
    if (!ok) { noteFail(req, u); return send(res, 401, { error: "Wrong username or password." }); }
    return send(res, 200, { token: await issueToken(u), username: u });
  }

  const user = await userFromReq(req);
  if (!user) return send(res, 401, { error: "Not signed in." });

  if (route === "POST /api/logout") { await store.del(tokenKey(req.headers.authorization.slice(7))); return send(res, 200, { ok: true }); }
  if (route === "GET /api/me") return send(res, 200, { username: user });
  if (route === "GET /api/progress") {
    const p = await store.get("progress_" + user);
    return send(res, 200, { data: p ? p.data : null, updated: p ? p.updated : 0 });
  }
  if (route === "PUT /api/progress") {
    const { data } = await readJSON(req);
    if (!data || typeof data !== "object") return send(res, 400, { error: "Missing data." });
    const cur = await store.get("progress_" + user), updated = +data.updated || Date.now();
    // newest copy wins: if another device saved something newer, hand that back instead
    if (cur && cur.updated > updated) return send(res, 409, { data: cur.data, updated: cur.updated });
    await store.set("progress_" + user, { data, updated });
    return send(res, 200, { ok: true, updated });
  }
  return send(res, 404, { error: "Not found." });
}

/* ---------------- static files ---------------- */
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json" };
async function serveStatic(req, res, url) {
  let p = decodeURIComponent(url.pathname); if (p === "/" || p === "") p = "/index.html";
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end(); }
  try {
    const st = await fsp.stat(file); if (!st.isFile()) throw 0;
    const ext = path.extname(file);
    res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream", "Content-Length": st.size, "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=300" });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(file).pipe(res);
  } catch (e) { res.writeHead(404, { "Content-Type": "text/plain" }); res.end("Not found"); }
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "same-origin");
  try {
    if (url.pathname.startsWith("/api/")) return await api(req, res, url);
    if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end(); }
    return await serveStatic(req, res, url);
  } catch (e) {
    if (!res.headersSent) send(res, e.code === 413 ? 413 : e.code === 400 ? 400 : 500, { error: e.code === 413 ? "Too much data." : e.code === 400 ? "Bad request." : "Server error." });
    if (!e.code) console.error(e);
  }
}).listen(PORT, () => { if (store.kind === "files" && !process.env.DATA_DIR) console.warn("WARNING: saving to local files with no DATA_DIR set. On Render/Railway free tiers these get wiped on every restart, which logs everyone out. Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or a DATA_DIR on a persistent volume)."); console.log(`Revise on http://localhost:${PORT}  (storage: ${store.kind}${store.kind === "files" ? " in " + DATA_DIR : ""})`); });
