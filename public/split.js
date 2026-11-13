/* English is now two subjects: anything tagged "eng" on a Literature topic moves to "lit". */
(function () {
  const lit = new Set(SUBJECTS.find(s => s.id === "lit").topics.map(t => t[1]));
  [window.QUESTIONS, window.EXAMQ].forEach(arr => (arr || []).forEach(q => { if (q.s === "eng" && lit.has(q.t)) q.s = "lit"; }));
  [window.VIDEO_LINKS, window.VIDEO_Q].forEach(o => { if (!o) return; Object.keys(o).forEach(k => { const [s, t] = k.split("|"); if (s === "eng" && lit.has(t)) { o["lit|" + t] = o[k]; delete o[k]; } }); });
})();
