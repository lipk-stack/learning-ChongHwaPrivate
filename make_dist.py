#!/usr/bin/env python3
"""Produce the compact, minified distribution file.

Generates dist/ChongHwa-Prep-App.html — the same app as build.py but with a
compact question bank (window.QB) and minified JS/CSS, so the single file stays
small enough to distribute/upload easily. Requires Node with `terser` and
`clean-css-cli` available (npx). Falls back to unminified if they are missing.

Run:  python3 make_dist.py
"""
import json, re, subprocess, pathlib, tempfile

ROOT = pathlib.Path(__file__).parent

def node_eval_bank():
    """Load data/questions.js via Node and return the bank as a dict."""
    script = (
        "global.window={};require('%s');"
        "process.stdout.write(JSON.stringify(window.QUESTION_BANK));"
        % (ROOT / "data" / "questions.js")
    )
    out = subprocess.check_output(["node", "-e", script])
    return json.loads(out)

def compact(bank):
    sub = {}
    for k, s in bank["subjects"].items():
        Q = []
        for q in s["questions"]:
            opts = 0 if q.get("type") == "fill" else q["options"]
            Q.append([q["topic"], q["stem"], opts, q["answer"], q["explanation"], q.get("diff", 0)])
        sub[k] = {
            "k": s["key"], "name": s["name"], "en": s["enName"], "icon": s["icon"],
            "color": s["color"], "blurb": s["blurb"],
            "notes": [[n["title"], n["body"]] for n in s.get("notes", [])],
            "Q": Q,
        }
    out = {"meta": bank["meta"], "subjects": sub}
    if bank.get("passages"):
        out["passages"] = bank["passages"]  # passages are small; kept verbatim
    return out

def minify(path, kind):
    try:
        if kind == "js":
            return subprocess.check_output(["npx", "terser", str(path), "-c", "-m"]).decode()
        else:
            return subprocess.check_output(["npx", "cleancss", str(path)]).decode()
    except Exception as e:
        print("  (minify skipped: %s)" % e)
        return pathlib.Path(path).read_text(encoding="utf-8")

html = (ROOT / "src" / "index.html").read_text(encoding="utf-8")
html = "\n".join(l.strip() for l in html.split("\n"))

css = minify(ROOT / "src" / "styles.css", "css")
app = minify(ROOT / "src" / "app.js", "js")
data = "window.QB=" + json.dumps(compact(node_eval_bank()), ensure_ascii=False, separators=(",", ":")) + ";"

out = (html.replace("/*{{CSS}}*/", css)
           .replace("/*{{DATA}}*/", data)
           .replace("/*{{APP}}*/", app))
out = re.sub(r"\n{2,}", "\n", out)

dist = ROOT / "dist"; dist.mkdir(exist_ok=True)
target = dist / "ChongHwa-Prep-App.html"
target.write_text(out, encoding="utf-8")
print("Built %s  (%d chars, %d bytes)" % (target, len(out), len(out.encode("utf-8"))))
