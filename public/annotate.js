/* Paper annotator: open a PDF, draw / highlight / type on it, download it with your annotations baked in. */
window.Annotator = (() => {
  "use strict";
  const LIBS = [
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
  ];
  const COLORS = [["Black", "#111827"], ["Blue", "#2f5bea"], ["Red", "#e3354f"], ["Green", "#12a873"]];
  const SIZES = [["S", 2], ["M", 3.5], ["L", 6]];
  const I = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5a6 6 0 0 1-5-2.7L3 15.5a1.6 1.6 0 0 1 2.6-1.8L8 16"/>',
    pen: '<path d="M4 20l4-1L19 8a2.1 2.1 0 0 0-3-3L5 16z"/><path d="M14 7l3 3"/>',
    hl: '<path d="M9 15l-5 5h6l2-2"/><path d="M8 13l7-9 5 5-9 7z"/>',
    text: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
    erase: '<path d="M8 20h12"/><path d="M4.5 15.5l9-9a2 2 0 0 1 2.8 0l2.2 2.2a2 2 0 0 1 0 2.8L12 18H7z"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    redo: '<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>',
    down: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
    check: '<path d="M5 12l5 5 9-11"/>'
  };
  const ic = n => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[n] + "</svg>";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let root, pdfDoc = null, pages = [], tool = "pen", color = COLORS[2][1], size = SIZES[1][1];
  let undoStack = [], redoStack = [], fileName = "", storeKey = "", title = "", onDone = null, busy = false, sid = "", onChange = null, pk = "";

  /* ---------- in-progress papers (IndexedDB, this device) ---------- */
  let dbP = null;
  function db() {
    if (!dbP) dbP = new Promise((res, rej) => {
      try {
        const r = indexedDB.open("rhq-papers", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("papers", { keyPath: "id" });
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      } catch (e) { rej(e); }
    });
    return dbP;
  }
  async function tx(mode, fn) {
    const d = await db();
    return new Promise((res, rej) => { const t = d.transaction("papers", mode); const st = t.objectStore("papers"); const out = fn(st); t.oncomplete = () => res(out && out.result); t.onerror = () => rej(t.error); });
  }
  const idbGet = id => tx("readonly", st => st.get(id));
  const idbPut = rec => tx("readwrite", st => st.put(rec));
  async function list() { try { const all = await tx("readonly", st => st.getAll()); return (all || []).map(({ blob, items, ...m }) => ({ ...m, marks: (items || []).reduce((a, p) => a + p.length, 0) })).sort((a, b) => b.opened - a.opened); } catch (e) { return []; } }
  async function remove(id) { try { await tx("readwrite", st => st.delete(id)); localStorage.removeItem(id); } catch (e) {} }
  async function saveMeta(extra) {
    if (!storeKey) return;
    try { const old = (await idbGet(storeKey)) || {}; await idbPut({ ...old, ...extra, id: storeKey, opened: Date.now() }); if (onChange) onChange(); } catch (e) {}
  }

  function loadScript(src) {
    return new Promise((res, rej) => {
      if (document.querySelector('script[src="' + src + '"]')) return res();
      const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("Couldn't load the PDF tools. Check your connection and try again."));
      document.head.appendChild(s);
    });
  }
  async function libs() { for (const s of LIBS) await loadScript(s); }

  /* ---------- UI ---------- */
  function open(opts = {}) {
    title = opts.title || ""; onDone = opts.onDone || null; sid = opts.sid || ""; pk = opts.pk || ""; onChange = opts.onChange || null; storeKey = ""; fileName = "";
    if (!root) { root = document.createElement("div"); root.className = "ann"; document.body.appendChild(root); bind(); }
    root.hidden = false; document.body.style.overflow = "hidden";
    pdfDoc = null; pages = []; undoStack = []; redoStack = [];
    root.innerHTML = shell();
    paintTools();
    if (opts.resume) resume(opts.resume);
  }
  async function resume(id) {
    try {
      const rec = await idbGet(id);
      if (!rec || !rec.blob) { status("Couldn't find that saved paper on this device.", 4000); return; }
      title = rec.title || title; sid = rec.sid || sid; pk = rec.pk || pk;
      const t = root.querySelector(".ann-title b"); if (t) t.textContent = title || "Annotate a paper";
      await loadFile(new File([rec.blob], rec.name, { type: "application/pdf" }), rec.items);
    } catch (e) { status("Couldn't reopen that paper.", 4000); }
  }
  function close() { if (!root) return; root.hidden = true; root.innerHTML = ""; document.body.style.overflow = ""; pdfDoc = null; pages = []; }

  function shell() {
    return `<div class="ann-bar">
      <button class="ann-btn" data-a="close" title="Back to papers">${ic("back")}</button>
      <div class="ann-title"><b>${esc(title || "Annotate a paper")}</b><span id="ann-file">${fileName && pdfDoc ? esc(fileName) : "No PDF open"}</span></div>
      <div class="ann-tools" id="ann-tools"></div>
      <div class="ann-right">
        <button class="ann-btn" data-a="undo" title="Undo">${ic("undo")}</button>
        <button class="ann-btn" data-a="redo" title="Redo">${ic("redo")}</button>
        <button class="ann-pill ghost" data-a="done" title="Mark this paper as done">${ic("check")}<span>Done</span></button>
        <button class="ann-pill" data-a="export">${ic("down")}<span>Download</span></button>
      </div>
    </div>
    <div class="ann-scroll" id="ann-scroll">${pick()}</div>
    <div class="ann-status" id="ann-status" hidden></div>`;
  }
  function pick() {
    return `<label class="ann-drop" id="ann-drop" for="ann-input">
      <div class="ann-drop-ico">${ic("file")}</div>
      <b>Open a past paper (PDF)</b>
      <span>Download the question paper from the list first, then choose it here or drop it on this box. You can draw, highlight and type on it, then download your marked-up copy.</span>
      <span class="ann-pill">Choose PDF</span>
      <input id="ann-input" type="file" accept="application/pdf,.pdf" hidden>
    </label>`;
  }
  function paintTools() {
    const t = document.getElementById("ann-tools"); if (!t) return;
    const tools = [["hand", "Scroll"], ["pen", "Pen"], ["hl", "Highlight"], ["text", "Text"], ["erase", "Eraser"]];
    t.innerHTML = tools.map(([k, n]) => `<button class="ann-btn${tool === k ? " on" : ""}" data-a="tool" data-t="${k}" title="${n}" aria-pressed="${tool === k}">${ic(k)}</button>`).join("") +
      '<span class="ann-sep"></span>' +
      COLORS.map(([n, c]) => `<button class="ann-swatch${color === c ? " on" : ""}" data-a="color" data-c="${c}" title="${n}" style="--s:${c}" aria-pressed="${color === c}"></button>`).join("") +
      '<span class="ann-sep"></span>' +
      SIZES.map(([n, s]) => `<button class="ann-size${size === s ? " on" : ""}" data-a="size" data-s="${s}" title="Size ${n}"><i style="width:${s * 2 + 2}px;height:${s * 2 + 2}px"></i></button>`).join("");
    pages.forEach(p => { p.ink.style.pointerEvents = tool === "hand" ? "none" : "auto"; p.ink.style.cursor = tool === "text" ? "text" : tool === "erase" ? "cell" : "crosshair"; });
  }
  function status(msg, ms) {
    const s = document.getElementById("ann-status"); if (!s) return;
    if (!msg) { s.hidden = true; return; }
    s.hidden = false; s.textContent = msg;
    if (ms) setTimeout(() => { if (s.textContent === msg) s.hidden = true; }, ms);
  }

  /* ---------- load PDF ---------- */
  async function loadFile(file, savedItems) {
    if (!file || !/pdf$/i.test(file.type || file.name)) { status("That isn't a PDF. Choose the .pdf file you downloaded.", 4000); return; }
    status("Opening " + file.name + "…");
    try {
      await libs();
      const buf = await file.arrayBuffer();
      pdfDoc = await window.pdfjsLib.getDocument({ data: buf }).promise;
      fileName = file.name; storeKey = "rhq-ann:" + file.name + ":" + file.size;
      const saved = savedItems || readSaved();
      const scroll = document.getElementById("ann-scroll"); scroll.innerHTML = '<div class="ann-pages" id="ann-pages"></div>';
      document.getElementById("ann-file").textContent = file.name + " · " + pdfDoc.numPages + " pages";
      pages = [];
      const wrap = document.getElementById("ann-pages");
      for (let n = 1; n <= pdfDoc.numPages; n++) {
        const page = await pdfDoc.getPage(n);
        const vp = page.getViewport({ scale: 1 });
        const el = document.createElement("div"); el.className = "ann-page";
        el.innerHTML = '<canvas class="ann-pdf"></canvas><canvas class="ann-ink"></canvas><span class="ann-num">' + n + "</span>";
        wrap.appendChild(el);
        const p = { n, page, vp, el, pdfC: el.querySelector(".ann-pdf"), ink: el.querySelector(".ann-ink"), items: (saved && saved[n - 1]) || [], W: 0 };
        pages.push(p); wireInk(p);
      }
      await layout();
      paintTools();
      saveMeta({ title: title || file.name.replace(/\.pdf$/i, ""), name: file.name, size: file.size, sid, pk, blob: file, items: pages.map(p => p.items) });
      status(saved ? "Opened with your saved annotations." : "Ready. Pick a tool and start writing.", 2600);
    } catch (e) { status((e && e.message) || "Couldn't open that PDF.", 5000); }
  }
  async function layout() {
    const wrap = document.getElementById("ann-pages"); if (!wrap) return;
    const W = Math.min(900, wrap.clientWidth || 800); const dpr = Math.min(2, window.devicePixelRatio || 1);
    for (const p of pages) {
      const H = W * p.vp.height / p.vp.width; p.W = W; p.H = H;
      p.el.style.width = W + "px"; p.el.style.height = H + "px";
      for (const c of [p.pdfC, p.ink]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); c.style.width = W + "px"; c.style.height = H + "px"; }
      p.dpr = dpr;
      const vp = p.page.getViewport({ scale: W / p.vp.width * dpr });
      await p.page.render({ canvasContext: p.pdfC.getContext("2d"), viewport: vp }).promise;
      redraw(p);
    }
  }

  /* ---------- drawing ---------- */
  function drawItem(ctx, it, W) {
    if (it.t === "text") {
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = it.c;
      const fs = it.fs * W; ctx.font = "600 " + fs + "px Figtree, Arial, sans-serif"; ctx.textBaseline = "top";
      it.s.split("\n").forEach((line, i) => ctx.fillText(line, it.x * W, it.y * W + i * fs * 1.25));
      return;
    }
    const pts = it.p; if (!pts.length) return;
    ctx.save();
    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = it.c; ctx.lineWidth = it.w * W;
    if (it.t === "hl") { ctx.globalAlpha = .32; ctx.globalCompositeOperation = "multiply"; }
    ctx.beginPath(); ctx.moveTo(pts[0][0] * W, pts[0][1] * W);
    if (pts.length === 1) ctx.lineTo(pts[0][0] * W + .01, pts[0][1] * W);
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      ctx.quadraticCurveTo(x0 * W, y0 * W, (x0 + x1) / 2 * W, (y0 + y1) / 2 * W);
    }
    ctx.lineTo(pts[pts.length - 1][0] * W, pts[pts.length - 1][1] * W);
    ctx.stroke(); ctx.restore();
  }
  function redraw(p, live) {
    const ctx = p.ink.getContext("2d"); ctx.setTransform(p.dpr, 0, 0, p.dpr, 0, 0); ctx.clearRect(0, 0, p.W, p.H);
    p.items.forEach(it => drawItem(ctx, it, p.W)); if (live) drawItem(ctx, live, p.W);
  }
  function pos(p, e) { const r = p.ink.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.width]; }
  function wireInk(p) {
    let cur = null;
    p.ink.addEventListener("pointerdown", e => {
      if (tool === "hand") return;
      e.preventDefault();
      const pt = pos(p, e);
      if (tool === "text") { placeText(p, pt); return; }
      p.ink.setPointerCapture(e.pointerId);
      if (tool === "erase") { cur = { erase: true }; eraseAt(p, pt); return; }
      const W = p.W;
      cur = { t: tool === "hl" ? "hl" : "pen", c: tool === "hl" ? (color === COLORS[0][1] ? "#ffd400" : color) : color, w: (tool === "hl" ? size * 4.5 : size) / W, p: [pt] };
      redraw(p, cur);
    });
    p.ink.addEventListener("pointermove", e => {
      if (!cur) return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      for (const ev of evs) { const pt = pos(p, ev); if (cur.erase) eraseAt(p, pt); else cur.p.push(pt); }
      if (!cur.erase) redraw(p, cur);
    });
    const end = () => {
      if (!cur) return;
      if (!cur.erase) { p.items.push(cur); pushUndo({ k: "add", p: p.n, it: cur }); }
      cur = null; redraw(p); persist();
    };
    p.ink.addEventListener("pointerup", end); p.ink.addEventListener("pointercancel", end);
  }
  function eraseAt(p, [x, y]) {
    const r = 12 / p.W;
    for (let i = p.items.length - 1; i >= 0; i--) {
      const it = p.items[i]; let hit = false;
      if (it.t === "text") { const lines = it.s.split("\n"); const w = Math.max(...lines.map(l => l.length)) * it.fs * .55, h = lines.length * it.fs * 1.25; hit = x >= it.x - r && x <= it.x + w + r && y >= it.y - r && y <= it.y + h + r; }
      else hit = it.p.some(([px, py]) => Math.hypot(px - x, py - y) < r + it.w / 2);
      if (hit) { p.items.splice(i, 1); pushUndo({ k: "del", p: p.n, it, i }); redraw(p); }
    }
  }
  function placeText(p, [x, y]) {
    const ta = document.createElement("textarea"); ta.className = "ann-text";
    const fs = Math.max(13, size * 4 + 6);
    ta.style.left = x * p.W + "px"; ta.style.top = y * p.W + "px"; ta.style.color = color; ta.style.fontSize = fs + "px";
    ta.placeholder = "Type…"; ta.rows = 1;
    p.el.appendChild(ta); setTimeout(() => ta.focus(), 0);
    const grow = () => { ta.style.height = "auto"; ta.style.height = ta.scrollHeight + "px"; ta.style.width = Math.max(120, Math.min(p.W - x * p.W - 8, ta.value.split("\n").reduce((m, l) => Math.max(m, l.length), 0) * fs * .58 + 24)) + "px"; };
    ta.addEventListener("input", grow); grow();
    const commit = () => {
      const s = ta.value.replace(/\s+$/, ""); ta.remove();
      if (!s) return;
      const it = { t: "text", x, y, s, c: color, fs: fs / p.W };
      p.items.push(it); pushUndo({ k: "add", p: p.n, it }); redraw(p); persist();
    };
    ta.addEventListener("blur", commit);
    ta.addEventListener("keydown", e => { if (e.key === "Escape") { ta.value = ""; ta.blur(); } if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) ta.blur(); });
  }

  /* ---------- undo / persistence ---------- */
  function pushUndo(op) { undoStack.push(op); if (undoStack.length > 300) undoStack.shift(); redoStack = []; }
  function apply(op, reverse) {
    const p = pages[op.p - 1]; if (!p) return;
    const add = (op.k === "add") !== reverse;
    if (add) { if (op.k === "del") p.items.splice(op.i, 0, op.it); else p.items.push(op.it); }
    else { const i = p.items.indexOf(op.it); if (i >= 0) p.items.splice(i, 1); }
    redraw(p); persist();
  }
  function undo() { const op = undoStack.pop(); if (op) { apply(op, true); redoStack.push(op); } }
  function redo() { const op = redoStack.pop(); if (op) { apply(op, false); undoStack.push(op); } }
  let persistT = null;
  function persist() { clearTimeout(persistT); persistT = setTimeout(() => { const items = pages.map(p => p.items); try { localStorage.setItem(storeKey, JSON.stringify(items)); } catch (e) {} saveMeta({ items }); }, 400); }
  function readSaved() { try { const r = localStorage.getItem(storeKey); return r ? JSON.parse(r) : null; } catch (e) { return null; } }

  /* ---------- export ---------- */
  async function exportPdf() {
    if (!pdfDoc) { status("Open a PDF first.", 2500); return; }
    if (busy) return; busy = true;
    try {
      const dl = window.claude && window.claude.use ? await window.claude.use("downloads") : null;
      const { jsPDF } = window.jspdf; let doc = null;
      for (const p of pages) {
        status("Preparing page " + p.n + " of " + pages.length + "…");
        const scale = 2, vp = p.page.getViewport({ scale });
        const c = document.createElement("canvas"); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
        const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
        await p.page.render({ canvasContext: ctx, viewport: vp }).promise;
        p.items.forEach(it => drawItem(ctx, it, c.width));
        const img = c.toDataURL("image/jpeg", 0.86);
        const w = p.vp.width, h = p.vp.height, o = w > h ? "l" : "p";
        if (!doc) doc = new jsPDF({ orientation: o, unit: "pt", format: [w, h], compress: true });
        else doc.addPage([w, h], o);
        doc.addImage(img, "JPEG", 0, 0, w, h);
      }
      status("Saving…");
      const blob = doc.output("blob");
      const name = fileName.replace(/\.pdf$/i, "") + " (annotated).pdf";
      if (dl) await dl.save({ filename: name, data: blob });
      else { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
      status("Saved " + name, 3500);
    } catch (e) {
      const code = e && e.code;
      status(code === "declined" ? "Download cancelled." : code === "rate_limited" ? "A download prompt is already open." : "Couldn't make the download. Try again.", 4000);
    } finally { busy = false; }
  }

  /* ---------- events ---------- */
  function bind() {
    root.addEventListener("click", e => {
      const b = e.target.closest("[data-a]"); if (!b) return;
      const a = b.dataset.a;
      if (a === "close") close();
      else if (a === "tool") { tool = b.dataset.t; paintTools(); }
      else if (a === "color") { color = b.dataset.c; if (tool === "hand" || tool === "erase") tool = "pen"; paintTools(); }
      else if (a === "size") { size = +b.dataset.s; paintTools(); }
      else if (a === "undo") undo();
      else if (a === "redo") redo();
      else if (a === "export") exportPdf();
      else if (a === "done") { if (!pdfDoc) { status("Open the paper first.", 2500); return; } if (onDone) onDone(title || fileName, pk || storeKey); saveMeta({ done: true }); status("Logged as done. +50 XP", 3000); }
    });
    root.addEventListener("change", e => { if (e.target.id === "ann-input") loadFile(e.target.files[0]); });
    root.addEventListener("dragover", e => { e.preventDefault(); const d = document.getElementById("ann-drop"); if (d) d.classList.add("over"); });
    root.addEventListener("dragleave", () => { const d = document.getElementById("ann-drop"); if (d) d.classList.remove("over"); });
    root.addEventListener("drop", e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); });
    document.addEventListener("keydown", e => {
      if (!root || root.hidden || e.target.matches("textarea, input")) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if (e.key === "Escape") close();
      else if ({ h: 1, p: 1, l: 1, t: 1, e: 1 }[e.key]) { tool = { h: "hand", p: "pen", l: "hl", t: "text", e: "erase" }[e.key]; paintTools(); }
    });
    let rt = null; addEventListener("resize", () => { if (!pdfDoc || root.hidden) return; clearTimeout(rt); rt = setTimeout(layout, 250); });
  }

  return { open, close, list, remove };
})();
