# 进度状态 · Progress Status

> This file is the single source of truth for resuming work across iterations.
> Read it first at the start of every iteration.

## Project
A **fun, portable learning app** for the **Chong Hwa Independent High School, Kuala Lumpur
(吉隆坡中华独立中学) Junior 1 entrance exam (初一新生考试)**.
Portable PWA — installable on iPhone / iPad / laptop, works **offline**.

## Source material
- Google Drive folder **ChongHwa** (`id 1c9V64JEo0ZGoR8tw_HmljJAWUgDhW8ED`).
- File: `2026小六历届试题（修订版).pdf` (138 pages, **password = `chonghwakl.edu.my`**).
- Contains past entrance papers for **2022, 2023, 2024/2025, 2025, 2026** across
  **4 subjects**: 华文 (Chinese), Bahasa Melayu (国文), English, 数学 (Math),
  plus an **answer-key section** (pages 128–138).
- Extracted text cached at `material/exam_full.txt` (decoded copy `material/exam.pdf`).
  `material/` is git-ignored; re-extract from Drive with the unlock script if missing.

## Tech / architecture
- Pure static **PWA** in `app/` — no build step, no dependencies.
  - `index.html`, `styles.css`, `app.js`
  - `data/questions.js` → `window.QUESTION_BANK` (the question bank)
  - `manifest.webmanifest`, `sw.js` (offline cache), `icons/`
- Progress (XP, level, streak, seen/correct/wrong) stored in `localStorage`.
- Gamification: XP + levels, 🔥 streak bonus, per-subject progress bars,
  instant answer feedback with **detailed explanations in the subject's own language**,
  confetti, Mixed-challenge & Review-mistakes modes.
- Distributable zip output to the ChongHwa Drive folder each iteration
  (`ChongHwa-Prep-App-vN.zip`).

## Done — Iteration 1 (current)
- ✅ Unlocked PDF, extracted & analysed all 5 years × 4 subjects + answer keys.
- ✅ Built the full PWA shell (home / subject / quiz / result screens).
- ✅ Question bank: **112 questions** from the **2026** paper, all with explanations:
  - 华文 Chinese: 23 MCQ (answers determined by analysis; reading-comp & 作文 as notes)
  - Bahasa Melayu: 25 MCQ (Bahagian C — verified against official key)
  - English: 40 MCQ (Reading/Vocab/Grammar/Cloze/Idioms — verified against official key)
  - 数学 Math: 24 fill-in-the-blank with full worked solutions (verified)
- ✅ Study notes per subject (essay prompts, comprehension tips, imbuhan key).
- ✅ Offline support, installable, iOS-friendly (safe-area, apple meta tags), app icon.
- ✅ Validated: question indices + JS syntax pass; icon renders.

## TODO — next iterations (priority order)
1. **Add more years** (2025, 2024/2025, 2023, 2022) — answer keys already extracted.
   - Chinese 2022 has a full MCQ key; 2025/2024 keys present for BM/Eng/Math.
2. **Math**: add the harder Group-B logic problems (Q21, Q25, Q30) with diagrams.
3. **Chinese**: digitise the full reading-comprehension passages as interactive
   short-answer items (currently summarised in notes).
4. **Composition/Karangan**: add guided writing with model outlines & checklists.
5. **Features**: daily-goal reminder, spaced-repetition for wrong answers,
   timed "mock exam" mode mirroring real paper structure & marks, audio for 拼音.
6. **i18n toggle** (zh / en / ms UI labels).
7. Consider real PNG composition images for English/Chinese picture essays.

## How to verify / run
- Open `app/index.html` in any modern browser, or serve `app/` statically.
- No headless browser in the build env, so UI is reviewed manually + data validated
  with `node` (see commit). Add a screenshot test when a browser is available.

## Distribution
- Latest zip uploaded to Drive **ChongHwa** folder as `ChongHwa-Prep-App-v1.zip`.
- To use on iPhone/iPad: unzip, open `index.html` in Safari → Share → **Add to Home Screen**.
