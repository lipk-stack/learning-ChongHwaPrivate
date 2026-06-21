#!/usr/bin/env python3
"""Build the portable single-file app for Chong Hwa Star Quest.

Inlines src/styles.css, data/questions.js and src/app.js into src/index.html
and writes the self-contained, offline-ready result to dist/ChongHwa-Prep-App.html.

Run:  python3 build.py
"""
import pathlib

ROOT = pathlib.Path(__file__).parent
html = (ROOT / "src" / "index.html").read_text(encoding="utf-8")
css = (ROOT / "src" / "styles.css").read_text(encoding="utf-8")
data = (ROOT / "data" / "questions.js").read_text(encoding="utf-8")
app = (ROOT / "src" / "app.js").read_text(encoding="utf-8")

out = (html
       .replace("/*{{CSS}}*/", css)
       .replace("/*{{DATA}}*/", data)
       .replace("/*{{APP}}*/", app))

dist = ROOT / "dist"
dist.mkdir(exist_ok=True)
target = dist / "ChongHwa-Prep-App.html"
target.write_text(out, encoding="utf-8")
print(f"Built {target}  ({len(out):,} bytes)")
