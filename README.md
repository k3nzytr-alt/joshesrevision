# Revision HQ

A static site: plain HTML, CSS and JavaScript. No build step and no server code.

## Deploy

Pick any one of these.

**Netlify (easiest).** Go to https://app.netlify.com/drop and drag the `revision-hq` folder onto the page.

**Vercel.** Run `npx vercel` inside this folder, or import it as a project. Framework: "Other". There's no build command, and the output directory is `.` (the folder itself).

**GitHub Pages.** Push this folder to a repo, then go to Settings → Pages → Deploy from branch → `main` / root.

**Cloudflare Pages.** Upload the folder directly. There's no build command.

`index.html` must sit at the root of whatever you deploy.

## Things to know

- **Progress:** XP, streak, weekly subject minutes, ratings, exam marks and calendar events save in the browser's localStorage, one device and browser at a time. Clearing site data wipes them. (The claude.ai version also synced to your account; that only works inside Claude.)
- **Papers in progress:** the PDFs and annotations you're working on are saved in IndexedDB on that device.
- **CDN dependencies:** the PDF annotator loads pdf.js 3.11.174 and jsPDF 2.5.1 from cdnjs. Fonts come from Google Fonts, so the site needs internet access.
- **Annotated PDFs:** these download as a normal browser download.

## Files

| File | What it holds |
|---|---|
| `index.html` | Page shell |
| `style.css` | All styling |
| `app.js` | The app: views, XP, streaks, quizzes, calendar and so on |
| `annotate.js` | The PDF annotator |
| `data.js` | Subjects, topics, quiz questions, flashcards, past paper links, exam and mock dates |
| `extra.js`, `geogq.js` | Extra quiz questions |
| `examq1.js`, `examq2.js`, `examq3.js`, `examq_geog.js` | Exam-style questions with mark schemes |
| `videos.js` | Video links per topic |
| `split.js` | Moves Literature content out of English Language (must load after the data files) |

To change exam or mock dates, edit `window.EVENTS` in `data.js`.
