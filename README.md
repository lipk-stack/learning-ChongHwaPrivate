# 中华入学试 · Chong Hwa Entrance Trainer

A **fun, gamified, portable** learning app to prepare for the
**吉隆坡中华独立中学 (Chong Hwa Independent High School, Kuala Lumpur)**
初一新生入学考试 — the Junior-1 entrance exam sat by Standard-6 pupils.

> 一款有趣、好玩、随身携带的学习应用，帮助小六生备考吉隆坡中华独立中学入学试。

## ✨ Features

- **4 subjects, each in its correct language**
  华文 (Chinese) · 数学 (Math, Chinese medium) · English · 国文 (Bahasa Melayu)
- **Authentic past-paper questions** extracted from the official 2026 exam, with
  answers verified against the official answer key — plus exam-style practice items.
- **Detailed explanation for every question** (in that subject's language) so you
  learn *why*, not just the answer.
- **Gamified & fun:** XP, levels, daily streaks 🔥, badges 🏅, confetti 🎉.
- **Practice modes:** Quick 5 · Full Set · Past Paper (真题) · Mixed Quiz.

## 📱 Works on iPhone, iPad & laptop (installable, offline)

It's a **Progressive Web App** — no app store needed:

1. Open the app's web page in **Safari (iPhone/iPad)** or **Chrome (laptop/Android)**.
2. **iPhone/iPad:** tap **Share** ⬆️ → **Add to Home Screen**.
   **Desktop Chrome/Edge:** click the **Install** icon in the address bar.
3. Launch it like a normal app — it even works **offline**.

## 🚀 Run locally

```bash
# from the project folder
python3 -m http.server 8000
# then open http://localhost:8000
```
(Opening `index.html` directly also works; a local server is recommended so the
offline service worker registers.)

## 🗂️ Project structure & roadmap

See **[PROGRESS.md](PROGRESS.md)** for the architecture, the source-PDF page map,
the iteration changelog, and the prioritised roadmap (essay practice, full mock
exams, spaced-repetition "wrong-question book", more years of past papers, etc.).

## 📚 Source material

Built from the official 《2026 小六历届试题（修订版)》 (5 years of past entrance
exams). The password-protected PDF was decrypted and text-extracted into
`source-material/` for question mining across iterations.

---
*This is an independent study aid and is not officially affiliated with the school.*
