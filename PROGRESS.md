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
- **Star economy (the gamification core):** correct answer **+5⭐** plus a streak bonus (up to +5);
  wrong answer **−3⭐** (balance never drops below 0). `lifetime` stars only ever go up and drive milestones.
- **Milestones unlock a *different* mini‑game each time.** Thresholds: `milestoneAt(k)=40k+10k²`
  → 50, 120, 210, 320, 450, 600… Games cycle `[Speed, Memory, Catcher, Scramble]`; difficulty rises with k.
  Games award bonus stars, can chain into the next milestone.

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

## Next up (ideas for Iteration 3+)

- [ ] **Mine more real questions** from the 2024/2025, 2023, 2022 papers (Chinese & English passages, more Malay).
      Helper already in place: decrypt with `pikepdf.open(pdf, password="chonghwakl.edu.my")` →
      `pdfminer.high_level.extract_text`. Verify each math answer by computing it.
- [ ] **Reading‑comprehension mode**: show a passage (e.g. 林海音《迟到》, the Melaka & mooncake texts) then its questions.
- [ ] **Timed mock‑exam mode** per subject matching real mark allocations (华文 选择 50分; 数学 30题 甲/乙组).
- [ ] **Two more mini‑games** (e.g. 成语接龙 idiom‑chain; Malay peribahasa match) so milestones feel fresher.
- [ ] **Daily streak / daily goal** and a small **shop** to spend ⭐ (avatars, themes) — gives stars a sink.
- [ ] **Spaced repetition** for wrong questions (resurface after N days).
- [ ] Optional **service worker + manifest** for a true installable PWA (still single‑folder portable).

## Resume checklist for the next agent
1. Read this file. Confirm Drive `ChongHwa` folder + PDF still accessible (password `chonghwakl.edu.my`).
2. `python3 build.py` to confirm the current build is reproducible; run `node -c src/app.js`.
3. Pick an item from **Next up**, edit `data/questions.js` / `src/*`, keep languages subject‑correct,
   give every question a full explanation, verify math answers.
4. Bump `meta.builtIteration` in `data/questions.js`. Rebuild. Smoke‑test with jsdom (0 errors).
5. Update this log, commit to branch `claude/cool-ramanujan-iby9qi`, push, and upload the new
   `dist/ChongHwa-Prep-App.html` to the Drive `ChongHwa` folder.
