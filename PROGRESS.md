# 进度记录 · Progress Log

**App:** 中华独中 · 初一备考 ⭐ Star Quest
**School / Exam:** 吉隆坡中华独立中学 (Chong Hwa Independent High School, KL) — 初一新生考试 / Junior‑1 Entrance Examination
**Source material:** `ChongHwa/2026小六历届试题（修订版).pdf` in Google Drive (PDF password: `chonghwakl.edu.my`) — past papers 2022–2026, four subjects each.

This file is the source of truth between iterations. **Read it first, then continue from "Next up".**

---

## How it's built (architecture)

A maintainable source tree that compiles to **one portable, offline HTML file**:

```
data/questions.js     window.QUESTION_BANK — all questions + explanations + study notes
src/index.html        app shell (placeholders: /*{{CSS}}*/ /*{{DATA}}*/ /*{{APP}}*/)
src/styles.css        all styling (dark, mobile-first, safe-area aware)
src/app.js            quiz engine + star economy + milestone mini-games
build.py              inlines the above into dist/ChongHwa-Prep-App.html
dist/                 the built, distributable single file
```

**Build:** `python3 build.py` → writes `dist/ChongHwa-Prep-App.html` (no external deps, works by
double‑clicking on iPhone/iPad/Mac/Windows; supports iOS "Add to Home Screen").

**Validate before shipping:** `node -c src/app.js` and the jsdom smoke test (see Iteration 2 notes).

---

## Design decisions

- **Languages are subject‑correct:** 华文 questions & explanations in Chinese; Bahasa Melayu wholly in
  Malay; English wholly in English; 数学 in Chinese (as in the real Chinese‑medium paper).
- **Every question has a full worked explanation** (字词辨析理由 / langkah / reasoning / 解题步骤).
- **Star economy (the gamification core), tuned to be hard to grind:** correct answer **+2⭐**
  plus a streak bonus of **+1 per 3‑in‑a‑row (max +3)**; wrong answer **−4⭐** (balance never
  drops below 0). `lifetime` stars only ever go up and drive milestones.
- **Milestones unlock a *different* mini‑game each time.** Thresholds: `milestoneAt(k)=70k+20k²`
  → 90, 220, 390, 600, 850… Games cycle `[Speed, Memory, Catcher, Scramble]`; difficulty rises with k.
  Game payouts are modest (≈1× score) so the games supplement rather than replace real practice.

---

## Iteration history

### Iteration 1 (prior — existed only in Google Drive, not in repo)
- Single HTML in Drive with 112 questions, XP/level/streak, notes, MCQ + fill, confetti, mixed/review modes.
- **Gaps vs. the brief:** no ⭐ add/deduct system; **no milestone mini‑games**; lived outside the repo.

### Iteration 2 (this repo — current) ✅
- Re‑established everything **in the repo** as a build pipeline (resumable).
- **Star economy** added: +5/−3 with streak bonus, lifetime tracking, level from lifetime.
- **Four distinct milestone mini‑games**, cycled + difficulty‑scaled:
  1. ⚡ **口算闪电 Speed Math** — 30s mental‑arithmetic sprint (×, ÷, +, % at higher levels).
  2. 🧩 **记忆配对 Memory Match** — flip‑and‑match 词语/单词 ↔ 意思 pairs; fewer moves = more ⭐.
  3. 🌠 **流星接星 Star Catcher** — tap falling stars showing the correct answer, avoid wrong ones.
  4. 🔤 **字母拼拼乐 Word Scramble** — reorder letters into the right English/Malay word.
- **Question bank grown 112 → 147** with verified items from the **2025** paper
  (Chinese 字形/多音字/文化常识; Math 质数和、近似值、单利、找规律 etc.) plus solid English/Malay grammar.
  Per subject: 华文 31 · Bahasa Melayu 30 · English 46 · 数学 40.
- Built `dist/ChongHwa-Prep-App.html` and uploaded to the Drive `ChongHwa` folder.
- Tested with jsdom: home/subject/quiz/result render, all 4 games launch with 0 runtime errors.

### Iteration 3 (this repo — current) ✅
- **Daily goal & streak** added: earn **30⭐/day** to bank a **+8⭐ bonus** and grow a 🔥 day‑streak
  (resets if a day is missed). New home bar shows today's progress. State migrates cleanly from v2.
- **🛍️ Star Shop** — the long‑planned **star sink**. Spend the *current* balance (never lifetime/level)
  on **6 themes** (recolour the whole app live) and **8 avatars** (home badge). Owned items persist.
- **Two more milestone mini‑games → 6 in rotation**, so unlocks feel fresher:
  5. 🔢 **数列规律 Sequence Sprint** — find the next number (等差/等比/平方/递增差/斐波那契); ties into 找规律.
  6. 📚 **词义大挑战 Meaning Match** — flash a 成语/word (华文/English/Malay), pick the right meaning; reinforces vocab.
- **Bug fix (pre‑existing):** quitting a game mid‑play leaked its `setInterval` (threw on removed nodes).
  Game timers are now tracked via `gInterval()` and cleared in `goHome()`/quit.
- **Question bank 147 → 157**: +华文2 (标点、量词) · +国文2 (imbuhan、peribahasa) · +英文2 (vocab、articles) ·
  +数学4 (分数、折扣、平均数、找规律). Per subject now: 华文 33 · BM 32 · English 48 · 数学 44. Math answers re‑verified.
- `meta.builtIteration` → 3. Rebuilt `dist/ChongHwa-Prep-App.html` (~104 KB) via `python3 build.py`.
- Tested with jsdom: home/quiz/shop render + all **6** games launch & quit cleanly with **0** runtime errors.

### Iteration 4 (this repo — current) ✅
- **Syllabus / standards & content uplift:** bank **157 → 180** questions and added a per‑question
  **difficulty标准** (`diff` 1=基础 Basic / 2=进阶 Intermediate / 3=挑战 Challenge), shown as a badge in the quiz.
  New items broaden coverage: 华文 古诗词/文言词义/对偶/语序病句/感情色彩; BM 同义反义/被动句/形容词/谚语;
  English synonyms/antonyms/prepositions/future‑perfect/idioms; 数学 周长/比例分配/行程/分数/百分比逆推/平方数规律.
  Per subject now: 华文 39 · BM 37 · English 53 · 数学 51. All math answers re‑verified.
- **Responsive “maximise to screen” layout:** `#app` widens on tablets/desktops (880→1040px); game area
  fills the viewport (`min-height: 100svh − …`, flex column); fonts/buttons/grids use `clamp()`/`vw`/`svh`;
  subject & shop grids gain columns on wide screens. Star‑catcher field and memory grid now grow to fill height.
- **♻️ Reset Stars & Score** on the home screen — clears progress/streaks/milestones (keeps bought cosmetics),
  with a confirm dialog.
- **Bug fix (pre‑existing, found by the stress test):** after quitting a game, a queued `setTimeout`
  continuation (e.g. `newQ`) fired on removed DOM and threw. Added a `gameLive` flag guarding every
  timer‑driven continuation; `done()` payouts are also gated on it.
- **Build plumbing:** `diff` carried through both `build.py` (readable) and `make_dist.py` (compact);
  the `window.QB` loader expands it. `meta.builtIteration` → 4. Rebuilt dist (~113 KB).
- **Stress‑tested with jsdom:** 150+ answered questions across all subjects + Mixed/Review, full Star‑Shop
  buy‑out + theme/avatar switching, reset, and **all 6 games launched, hammered with random clicks, and quit**
  — repeated 4× on **both** the readable and compact builds with **0** runtime errors.

---

## ⚠️ Known constraint — Google Drive delivery of the built app
The built single file is ~75 KB (~63 K characters). The available Google Drive MCP
tools (`create_file`) require the **entire file content inline**, with **no
append/update/delete** tool. A 63 K‑char payload cannot be emitted faithfully in one
tool call (a single bad char in the minified JSON = blank app, and it can't be deleted).
Netlify deploy is also blocked unattended (no CLI; the MCP refuses to create a new site
without explicit user confirmation). **Workaround used in Iteration 2:** the full app is
committed to `dist/` in the repo, and a small instructions Google Doc was placed in the
Drive `ChongHwa` folder ("中华备考 App · 第2次迭代更新说明") telling the user to drag
`dist/ChongHwa-Prep-App.html` into the folder.
**For Iteration 3:** ask the user to either (a) point me at an **existing Netlify site
id** so I can `deploy-site` (reliable, gives a portable URL), or (b) confirm they're OK
with the manual drag, or (c) keep the per‑iteration instructions doc approach.

## Next up (ideas for Iteration 4+)

- [ ] **Mine more real questions** from the 2024/2023/2022 papers (Chinese & English passages, more Malay).
      Helper: decrypt with `pikepdf.open(pdf, password="chonghwakl.edu.my")` →
      `pdfminer.high_level.extract_text`. Verify each math answer by computing it.
- [ ] **Reading‑comprehension mode**: show a passage (e.g. 林海音《迟到》, the Melaka & mooncake texts) then its questions.
- [ ] **Timed mock‑exam mode** per subject matching real mark allocations (华文 选择 50分; 数学 30题 甲/乙组).
- [ ] **Spaced repetition** for wrong questions (resurface after N days) — fields exist (`state.wrong`).
- [ ] **More shop depth**: spend ⭐ on power‑ups (50/50, skip), badges/titles, or a streak‑freeze.
- [ ] One more mini‑game idea: 🀄 成语接龙 idiom‑chain or Malay peribahasa match.
- [ ] Optional **service worker + manifest** for a true installable PWA (still single‑folder portable).

✅ Done in Iteration 3: daily goal/streak, Star Shop (themes + avatars), two new mini‑games.
✅ Done in Iteration 4: +23 questions (180 total) with difficulty标准 badges, responsive full‑screen
   layout, ♻️ reset stars/score, and a quit‑game timer‑leak fix — all stress‑tested on both builds.

## Resume checklist for the next agent
1. Read this file. Confirm Drive `ChongHwa` folder + PDF still accessible (password `chonghwakl.edu.my`).
2. `python3 build.py` to confirm the current build is reproducible; run `node -c src/app.js`.
3. Pick an item from **Next up**, edit `data/questions.js` / `src/*`, keep languages subject‑correct,
   give every question a full explanation, verify math answers.
4. Bump `meta.builtIteration` in `data/questions.js`. Rebuild. Smoke‑test with jsdom (0 errors).
   (jsdom isn't committed; `npm install jsdom --no-save` then load `dist/...html` with `url:"https://localhost/"`.)
5. Update this log, commit to the iteration's working branch, push, merge to `main`, and upload the new
   `dist/ChongHwa-Prep-App.html` to the Drive `ChongHwa` folder.
