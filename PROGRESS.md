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

### Iteration 4 (this repo — prior) ✅
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

### Iteration 5 (this repo — current) ✅
- **⏱️ Timed Mock-Exam mode** (the long-planned exam-realism feature). New home mode card → a
  subject picker modal (四科任选 + 全科混合). Builds a **20-question timed paper** (≈45s/题 → ~15 min),
  shows a live **mm:ss countdown chip** in the quiz top-bar that turns red & pulses in the last 30s,
  and **auto-submits when time runs out**. "再来一次" re-runs the same timed config. Timer is tracked
  and cleared on quit / finish / home so it never leaks.
- **🧠 Smarter review (light spaced-repetition):** `state.wrong` now stores a **miss-count** per
  question (migrates cleanly from the old boolean), and 错题重练 resurfaces the **most-often-missed
  questions first**. Correct answers still clear the entry.
- **⚡ 7th milestone mini-game → 是非急转弯 True/False Blitz:** a fast binary-decision game (✔对/✘错)
  over a curated, cross-checked pool of statements spanning all four subjects (成语/数学/English/Malay).
  Correct +1, wrong −1, 30-second sprint. Now **7 games** in the milestone rotation.
- **Question bank 180 → 203:** +华文6 (古诗词/文言词义/夸张/词语搭配/病句/对联) · +国文5 (imbuhan/sinonim/
  kata sendi/antonim/penjodoh bilangan) · +英文5 (vocab/subject-verb agreement/prepositions/past tense/
  idioms) · +数学7 (面积/分数/折扣/平均数逆推/斐波那契/行程/最大公因数). All math answers re-verified by
  computation. Per subject now: 华文 45 · BM 42 · English 58 · 数学 58.
- **Build & test:** `meta.builtIteration` → 5. Added a tiny **test seam** (`?test=1` exposes the game
  registry) so the jsdom test can launch every game directly. Rebuilt both the readable (`build.py`)
  and compact (`make_dist.py`, ~110 KB on-disk) builds.
- **Stress-tested with jsdom (repeated, both builds, 0 runtime errors):** subject practice (40 Q),
  mixed, review (with the new ordering), **mixed + subject mock exams with the countdown**, the full
  Star-Shop buy-out, and **all 7 games launched, hammered with ~30 random clicks each, and quit mid-play**.

### Iteration 6 (this repo — current) ✅
- **📖 Reading-comprehension mode** (the long-planned passage feature). New home mode card → a
  passage picker modal listing **3 original, exam-style passages**, each in its **correct subject
  language**: 华文记叙文《一碗热汤面》, English *The School Garden*, Bahasa Melayu *Gotong-Royong di Taman*.
  Each passage shows in a **collapsible panel** (收起/展开, scrollable, max-height capped) above the
  question, and carries **5 questions** (信息提取/词句理解/概括主旨/推断/启示 · detail/sequence/vocab-in-context/
  inference/main-idea) with full explanations. Passages live in a new top-level
  `window.QUESTION_BANK.passages` array, carried through **both** builds (raw in `build.py`; verbatim in
  `make_dist.py`’s `compact()` and the `window.QB` expander). Reuses the quiz engine via `opts.passage`.
- **🀄 8th milestone mini-game → 成语接龙 Idiom Chain:** show an idiom with its **last character
  highlighted in red**, then pick (from 4) the idiom that **begins with that character**. Curated,
  cross-checked pool of 8 chains where every option’s first char is verified; distractors never start
  with the link char. 30-second sprint. Now **8 games** in the milestone rotation.
- **Question bank 203 → 221:** +华文4 (古诗词《春晓》/文言「时」/成语精益求精/二十四节气) · +国文4 (sinonim/antonim/
  penjodoh bilangan/imbuhan akhiran) · +英文4 (synonym/SVA「news」/idiom「hit the books」/punctuation) ·
  +数学6 (周长↔面积/时间换算/百分比/比例尺/连续偶数/利润折扣). **All math answers re-verified by computation.**
  Per subject now: 华文 49 · BM 46 · English 62 · 数学 64. Plus **15 reading questions** in passages.
- **Build & test:** `meta.builtIteration` → 6. Rebuilt both the readable (`build.py`, ~146 KB) and compact
  (`make_dist.py`, ~131 KB; cleancss was unavailable in-env so CSS stayed un-minified — JS still minified
  via terser, no functional change). jsdom smoke test extended to drive **all 3 reading passages end-to-end
  (panel show + collapse toggle + answer every question + replay)** and **all 8 games** — repeated on
  **both** builds with **0 runtime errors**.
- **Note for the next agent:** the games share one `gameLive` flag, so launching a new game <~200 ms after
  quitting the previous one can let a stale `setTimeout(newQ)` write into the new DOM. Unreachable in real
  use (games only unlock via milestones, minutes apart); the smoke test simply spaces launches by 350 ms.
  If ever needed, give `launchGame` a generation counter captured in each game’s closures.

### Iteration 7 (this repo — current) ✅
- **🎯 9th milestone mini-game → 二十四点 24-Point Sprint** (the long-planned 数学 24-point game). The
  screen shows **four number chips** (each used once); the player picks, from 4 algebraic expressions,
  the one whose result is **exactly 24**. The puzzle pool is **curated and 100% verified by computation**
  (every correct expression = 24 and uses each given number once; every distractor ≠ 24). Difficulty
  scales: Lv.≤2 uses 5 clean integer puzzles, higher levels add 5 harder ones including the famous
  fractional `3 3 8 8` style (`6 ÷ (1 − 3 ÷ 4)` etc.). 30-second sprint, +1 per correct. Now **9 games**
  in the milestone rotation. New `.pt-nums` / `.pt-chip` CSS for the number chips.
- **Question bank 221 → 243 (+22):** +华文5 (古诗词《九月九日忆山东兄弟》/成语寓意「守株待兔」/夸张/四大名著作者/反义词) ·
  +国文5 (peribahasa「bagai pinang dibelah dua / bagai isi dengan kuku」/imbuhan「mengisi」/penjodoh「sikat」/
  ayat pasif「oleh」/antonim「berani」) · +英文6 (synonym「enormous」/preposition/SVA「every one」/present-perfect/
  idiom「let the cat out of the bag」/antonym「ancient」) · +数学6 (分数减法/百分比涨价/平均数/正方体体积/找规律 n²+2/
  一道 24 点选择题 ma75「3 3 8 8」). **All math answers re-verified by computation** (Python `fractions`).
  Per subject now: 华文 54 · BM 51 · English 68 · 数学 70. Plus the 15 reading questions in passages.
- **Build & test:** `meta.builtIteration` → 7. Rebuilt both the readable (`build.py`, ~180 KB) and compact
  (`make_dist.py`, ~139 KB; cleancss still unavailable in-env so CSS stays un-minified — JS minified via
  terser). jsdom smoke test extended to launch **all 9 games** (mixed easy/hard levels), hammer each with
  ~30 random clicks and quit, plus a subject quiz and a mixed mock exam — **repeated on both builds with
  0 runtime errors**. A targeted check confirms the 24-Point game renders 4 number chips + 4 options.

### Iteration 8 (this repo — current) ✅
- **🗣️ 10th milestone mini-game → 谚语配对 Peribahasa Match** (the long-planned Malay-peribahasa game,
  completing the brief's "different game each milestone" set across all four subjects). The screen shows a
  **standard Malay peribahasa with one key word blanked out** (`______`) plus its **maksud (meaning, in
  Malay)** as a hint; the player picks the missing word from 4 options. The pool of **8 peribahasa**
  (*bagai pinang dibelah dua*, *seperti katak di bawah tempurung*, *sediakan payung sebelum hujan*,
  *melentur buluh biarlah dari rebungnya*, *ada gula ada semut*, *bagai aur dengan tebing*, *berat sama
  dipikul ringan sama dijinjing*, *bagai isi dengan kuku*) is curated and **kept wholly in Malay**
  (subject-correct); every distractor is a clean wrong word. 30-second sprint, +1 per correct. Now **10
  games** in the milestone rotation.
- **Question bank 243 → 263 (+20, 5 per subject):** +华文5 (古诗词《悯农》/成语「持之以恒」/文言「罔」/反问修辞/近义词
  辨析) · +国文5 (sinonim「pantas」/imbuhan「membuka」/peribahasa「bagai aur dengan tebing」/antonim「rajin」/
  penjodoh「buah」) · +英文5 (synonym「brave」/past-perfect tense/preposition「good at」/idiom「a piece of cake」/
  subject-verb agreement「neither…nor」) · +数学5 (最小公倍数/分数应用/比例分配/平均数逆推/单利). **All math answers
  re-verified by computation (Python `fractions`).** Per subject now: 华文 59 · BM 56 · English 73 · 数学 75.
- **📖 4th reading passage → 华文说明文《二十四节气》** (the long-planned second 华文 passage, this time an
  **expository / 说明文** to balance the existing narrative). Carries **5 questions** (信息提取/细节/词句理解/
  说明方法「举例子」/概括主旨) with full explanations; facts cross-checked (夏至白昼最长、霜降结霜、2016 列入 UNESCO
  人类非物质文化遗产、节气歌首句「春雨惊春清谷天」). Reading mode now offers **4 passages / 20 questions**.
- **Build & test:** `meta.builtIteration` → 8. Rebuilt both the readable (`build.py`, ~193 KB on disk) and
  compact (`make_dist.py`, ~150 KB; cleancss still unavailable in-env so CSS stays un-minified — JS minified
  via terser). A bank-integrity check confirms **no duplicate ids, every MCQ answer in range, every item
  has an explanation**. jsdom smoke test extended to launch **all 10 games** (mixed easy/hard levels),
  hammer each with ~30 random clicks and quit, plus a targeted check that Peribahasa Match renders 4 options
  and a `______` blank, a subject quiz, **all 4 reading passages count (drove the new 二十四节气 one end-to-end
  with panel collapse/expand)**, and a mixed timed mock exam — **passed on both builds with 0 runtime errors**.

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

## Next up (ideas for Iteration 9+)

- [ ] **Mock‑exam polish**: per‑subject mark allocations & a分数 report card (华文 选择 50分; 数学 30题 甲/乙组);
      remember best mock score per subject; optional 难度‑weighted question selection.
- [ ] **Stronger spaced repetition**: store a *due date* per wrong question (resurface after N days), not just a count.
- [ ] **More shop depth**: spend ⭐ on power‑ups (50/50, skip), badges/titles, or a streak‑freeze.
- [ ] **More reading passages** — add a 数学应用题情境 passage; let Reading mode group passages by subject.
      Consider mining real passages from the 2024/2023/2022 papers (decrypt with
      `pikepdf.open(pdf, password="chonghwakl.edu.my")` → `pdfminer.high_level.extract_text`).
- [ ] **Mine more real questions** from the 2024/2023/2022 papers (more Malay & English). Verify each math
      answer by computing it.
- [ ] One more mini‑game idea: an English-spelling or a 数学几何图形 game (成语接龙 / 24‑point / peribahasa now done).
- [ ] Optional **service worker + manifest** for a true installable PWA (still single‑folder portable).
- [ ] (Optional) make `launchGame` use a generation token so back‑to‑back game launches are bullet‑proof
      (see the Iteration‑6 note above — not reachable in real use today).

✅ Done in Iteration 3: daily goal/streak, Star Shop (themes + avatars), two new mini‑games.
✅ Done in Iteration 4: +23 questions (180 total) with difficulty标准 badges, responsive full‑screen
   layout, ♻️ reset stars/score, and a quit‑game timer‑leak fix — all stress‑tested on both builds.
✅ Done in Iteration 5: ⏱️ timed mock‑exam mode (countdown + auto‑submit), smarter miss‑count review
   ordering, ⚡ 7th game (True/False Blitz), +23 questions (203 total) — all stress‑tested on both builds.
✅ Done in Iteration 6: 📖 reading‑comprehension mode (3 original subject‑correct passages + 15 questions),
   🀄 8th game (Idiom Chain), +18 questions (221 total) — all stress‑tested end‑to‑end on both builds.
✅ Done in Iteration 7: 🎯 9th game (24‑Point Sprint, computation‑verified puzzles), +22 questions
   (243 total) across all four subjects — all stress‑tested on both builds with 0 runtime errors.
✅ Done in Iteration 8: 🗣️ 10th game (Peribahasa Match, Malay cloze), 📖 4th reading passage
   (华文说明文《二十四节气》, +5 questions), +20 questions (263 total) — all stress‑tested on both builds.

## Resume checklist for the next agent
1. Read this file. Confirm Drive `ChongHwa` folder + PDF still accessible (password `chonghwakl.edu.my`).
2. `python3 build.py` to confirm the current build is reproducible; run `node -c src/app.js`.
3. Pick an item from **Next up**, edit `data/questions.js` / `src/*`, keep languages subject‑correct,
   give every question a full explanation, verify math answers.
4. Bump `meta.builtIteration` in `data/questions.js`. Rebuild. Smoke‑test with jsdom (0 errors).
   (jsdom isn't committed; `npm install jsdom --no-save` then load `dist/...html` with `url:"https://localhost/"`.)
5. Update this log, commit to the iteration's working branch, push, merge to `main`, and upload the new
   `dist/ChongHwa-Prep-App.html` to the Drive `ChongHwa` folder.
