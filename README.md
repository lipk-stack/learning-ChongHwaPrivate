# 中华独中 · 初一备考 ⭐ Star Quest

A fun, portable, **offline** study app for the **Chong Hwa Independent High School (吉隆坡中华独立中学)
Junior‑1 Entrance Examination (初一新生考试)**. Practise 华文 · Bahasa Melayu · English · 数学 with
fully‑explained past‑paper questions, earn ⭐ stars, and unlock challenging mini‑games at milestones.

## Run it
Open **`dist/ChongHwa-Prep-App.html`** in any browser — phone, tablet, or laptop. It's a single
self‑contained file: no install, no internet needed, progress saved on‑device.
On iPhone/iPad use Safari → Share → **Add to Home Screen** for a full‑screen app feel.

## Develop it
```
python3 build.py        # rebuilds dist/ChongHwa-Prep-App.html from data/ + src/
node -c src/app.js      # syntax check
```
Source layout and the full plan live in **[PROGRESS.md](PROGRESS.md)** — read it before each iteration.

## Features
- **180** curated questions across 4 subjects, each in its **correct language** with a **worked explanation**.
- **Difficulty / standards labels** on questions: 基础 Basic · 进阶 Intermediate · 挑战 Challenge.
- **Responsive, full‑screen layout** — content and games scale to phone, tablet, and laptop resolutions.
- **Star economy:** correct +2⭐ (+streak bonus, max +3), wrong −4⭐ — stars are earned, not handed out.
- **Daily goal & streak:** earn 30⭐ a day to bank a **+8⭐ bonus** and grow your 🔥 day‑streak.
- **🛍️ Star Shop** — spend stars (a sink that never touches your level) on **6 themes** and **8 avatars**.
- **♻️ Reset** — clear stars & score anytime (purchased themes/avatars are kept).
- **Milestone mini‑games** — a *different* game each milestone, harder each time (6 in rotation):
  ⚡ Speed Math · 🧩 Memory Match · 🌠 Star Catcher · 🔤 Word Scramble · 🔢 Sequence Sprint · 📚 Meaning Match.
- Practice by subject, **Mixed** challenge, and **Review mistakes** modes; study notes per subject.

Source material: `ChongHwa/2026小六历届试题（修订版).pdf` (Google Drive).
