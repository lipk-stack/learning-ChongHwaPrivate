# 开发进度 · Development Progress

> This file is the **single source of truth** for resuming work across
> iterations. Each iteration: read this first, do the work, then update the
> "Status", "Changelog", and "Next up" sections before committing.

App: **中华入学试 · Chong Hwa Entrance Trainer** — a fun, gamified, portable
learning app for the 吉隆坡中华独立中学 (Chong Hwa Independent High School, KL)
初一新生入学考试 (Junior-1 entrance exam, sat by Standard-6 pupils).

---

## Current status — Iteration 1 ✅ (2026-06-21)

Foundation shipped and working end-to-end.

**Architecture (decided & in place):**
- **Pure static PWA** — plain HTML/CSS/vanilla-JS, **no build step**. This maximises
  portability: it runs by just opening `index.html`, hosts anywhere (GitHub Pages,
  Netlify), installs to the home screen on **iPhone / iPad / Android / laptop**, and
  works **fully offline** via a service worker. No framework lock-in.
- Progress saved in `localStorage` (survives reloads, per-device).
- Data-driven: questions live in `js/data/*.js`; adding content = adding objects.

**Features done:**
- Home screen: level/XP bar, 4 subject cards with per-subject mastery bars, Mixed Quiz, Badges.
- Quiz engine: shuffled questions + shuffled options, immediate feedback, **detailed
  explanation in the correct language for every question**, streak tracking.
- Gamification: XP (+streak bonus), 7 levels, 8 badges, confetti, toasts, result ring.
- Per-subject practice modes: Quick 5 / Full Set / **Past Paper (真题 only)**.
- PWA: `manifest.webmanifest`, `sw.js` offline cache, generated icons, iOS "Add to Home Screen" hint, notch-safe layout.

**Content (correct language per subject ✅):**
- 华文 Chinese — questions & explanations in Chinese.
- 数学 Math — Chinese medium (school teaches Math in Chinese).
- English — English.
- 国文 Bahasa Melayu — Malay.
- **61 questions total, of which 36 are AUTHENTIC 2026 past-paper items**, with
  answers verified against the official answer key (PDF pages 128–138).

**Source material:**
- The official PDF (password-protected with `chonghwakl.edu.my`) was downloaded from
  Google Drive, decrypted, and text-extracted. See `source-material/`:
  - `exam_extracted.txt` — full clean text of all 138 pages (5 years × 4 subjects + answer keys).
  - `exam_decrypted.pdf` — password-removed PDF (needed to read exact Math fraction layouts).

---

## Source PDF map (for mining more questions next iterations)

`source-material/exam_extracted.txt` — page markers like `===== PAGE n =====`.
- Pages 1–2: 目录 (TOC)
- **2026** exam: Chinese 3–8, Bahasa Melayu 9–15, English 16–23, Math 24–27
- **2025** exam: 28–51
- **2024/2025** exam: 52–76
- **2023** exam: 77–101
- **2022** exam: 102–127
- **Answer keys (all 5 years × 4 subjects): pages 128–138**

Subjects per year: 华文 (composition + 25 MCQ + reading comp), 国文 (essay + cloze +
affixation + 25 MCQ comprehension/grammar), English (composition + comprehension +
vocab + grammar + rational cloze + closest-meaning, all 4-option MCQ), 数学 (30
short-answer: 甲组 20 × 3.5%, 乙组 10 × 3%; Group B is olympiad-flavoured).
There is **no Science subject** — only these four.

**Mining notes:**
- Math answers are in the keys but expressions with stacked fractions are flattened in
  the text extract — open `exam_decrypted.pdf` to confirm exact operands before adding.
- The 华文 选择题 (MCQ 1–25) answer key was not in the extracted answer-key pages for
  2026; comprehension answers ARE present (p.128). Verify MCQ answers from the PDF or by
  content knowledge before tagging as "真题 verified".

---

## Next up (priority order for Iteration 2+)

1. **Mine more authentic questions** from 2025 / 2024 / 2023 / 2022 papers (huge backlog
   in `exam_extracted.txt`) — aim for ~20–25 verified items per subject per year.
   Cross-check Math operands against `exam_decrypted.pdf`.
2. **Composition / essay practice** (作文 / Karangan / English composition) — the papers
   all have a writing section. Add a guided-writing mode: show the real prompts, give
   structure tips, model paragraphs, and a self-check rubric (cannot auto-grade, but can
   scaffold). Prompts already in the extract (e.g. 2026 华文: 难忘的运动会 / 那一刻，我学会了感恩).
3. **Reading-comprehension mode** with full passages (e.g. 林海音《迟到》 already partly in)
   — show passage + multiple questions, including the short-answer model answers from the key.
4. **Timed mock-exam mode** — full paper per subject, with the real mark weighting (100 marks),
   countdown timer, and a score report.
5. **Spaced repetition / "wrong question book" (错题本)** — re-surface previously missed
   questions; track per-question accuracy in localStorage.
6. **Audio / pronunciation** for 华文 pinyin and 国文/English vocab (Web Speech API).
7. **Polish:** sound effects toggle, dark mode, daily-goal streak calendar, shareable
   result card, more badges, mascot character.
8. **Deploy** to GitHub Pages or Netlify and document the URL in README so it's one tap
   on any phone.

---

## File layout

```
index.html                 app shell (loads data + engine)
manifest.webmanifest       PWA manifest
sw.js                      service worker (offline cache) — bump CACHE version on asset change
css/styles.css             all styles (responsive, notch-safe, kid-friendly)
js/app.js                  engine: state, routing, quiz, gamification, SW registration
js/data/subjects.js        subjects, level thresholds, badge definitions
js/data/questions.js       authored seed questions (exam-style practice)
js/data/pastpaper.js       AUTHENTIC extracted 2026 past-paper questions (answer-key verified)
assets/icons/              app icons (svg + png 180/192/512 + maskable)
source-material/           decrypted PDF + full extracted text (gitignored? NO — kept for mining)
```

## How to run / test
- Run: open `index.html`, or `python3 -m http.server` then visit `http://localhost:8000`.
  (A server is recommended so the service worker registers.)
- Add questions: append objects to `js/data/questions.js` or `pastpaper.js` following the
  schema in the file header; no other wiring needed.
- Sanity check after edits: `node --check js/app.js` and the jsdom smoke flow.

## Changelog
- **Iteration 1 (2026-06-21):** Initial PWA foundation; 4 subjects; quiz engine with
  detailed multilingual explanations; gamification (XP/levels/badges/streak/confetti);
  PWA offline + installable; decrypted & extracted the official PDF; seeded 61 questions
  (36 authentic 2026 items, answer-key verified).
