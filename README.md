# 中华独中 初一备考 · Chong Hwa Junior 1 Entrance Exam Prep

A fun, portable learning app for the **吉隆坡中华独立中学 (Chong Hwa Independent High
School, Kuala Lumpur) Junior 1 new-student entrance exam (初一新生考试)**.

It covers all four exam subjects with real past-paper questions and **detailed,
language-correct explanations** for every answer:

| Subject | 语言 | Explanations in |
|---|---|---|
| 华文 Chinese | 中文 | 中文 |
| Bahasa Melayu (国文) | Melayu | Bahasa Melayu |
| English | English | English |
| 数学 Mathematics | 中文 | 中文（含完整解题步骤） |

## Features
- 🎮 Fun & gamified — XP, levels, 🔥 streaks, progress bars, confetti
- 🧠 Instant feedback with a full explanation after every question
- 🎲 Practice by subject, **Mixed Challenge**, and **Review Mistakes** modes
- 📱 **Portable PWA** — install to the Home Screen on iPhone / iPad / laptop
- ✈️ **Works offline** once opened (service worker cache)
- 💾 Saves your progress locally on the device

## Run it
Open `app/index.html` in any modern browser. To install on a device:

**iPhone / iPad (Safari):** open `app/index.html` → Share → **Add to Home Screen**.
**Laptop (Chrome/Edge):** open the page → install icon in the address bar.

A ready-to-share zip is also published to the **ChongHwa** folder in Google Drive.

## Source
Questions are drawn from *《2026 小六历届试题（修订版）》* (Chong Hwa past entrance
papers). Iteration 1 covers the **2026** paper (112 questions). See
[`PROGRESS.md`](PROGRESS.md) for the roadmap and how iterations resume.

## Project layout
```
app/
  index.html  styles.css  app.js
  data/questions.js        # the question bank
  manifest.webmanifest  sw.js  icons/
PROGRESS.md                # iteration status / roadmap
```
