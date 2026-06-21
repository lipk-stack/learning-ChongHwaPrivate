/* Chong Hwa Junior 1 Entrance Exam — prep app logic */
(function () {
  "use strict";
  const BANK = window.QUESTION_BANK;
  const SUBJECTS = BANK.subjects;
  const LETTERS = ["A", "B", "C", "D", "E"];
  const STORE_KEY = "chonghwa_prep_v1";

  /* ---------- persistent state ---------- */
  const state = load();
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && s.seen) return s;
    } catch (e) {}
    return { xp: 0, streak: 0, bestStreak: 0, seen: {}, correct: {}, wrong: {}, totalAns: 0, totalCorrect: 0 };
  }
  function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

  /* ---------- helpers ---------- */
  const $ = (s) => document.querySelector(s);
  const el = (s) => document.getElementById(s);
  function allQuestions() {
    const out = [];
    Object.values(SUBJECTS).forEach((s) => s.questions.forEach((q) => out.push(Object.assign({ _subj: s.key }, q))));
    return out;
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; }
  function levelFromXp(xp) { return Math.floor(xp / 100) + 1; }
  function normalize(s) {
    return String(s).trim().toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[，,]/g, ",")
      .replace(/[（(]/g, "(").replace(/[）)]/g, ")")
      .replace(/rm/g, "").replace(/[％%]/g, "%")
      .replace(/。\.$/,"");
  }

  function show(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    el(id).classList.add("active");
    window.scrollTo(0, 0);
  }

  /* ---------- HOME ---------- */
  function renderHome() {
    el("stat-level").textContent = levelFromXp(state.xp);
    el("stat-xp").textContent = state.xp;
    el("stat-streak").textContent = state.streak;
    el("stat-acc").textContent = state.totalAns ? Math.round((state.totalCorrect / state.totalAns) * 100) + "%" : "–";
    const intoLevel = state.xp % 100;
    el("xp-fill").style.width = intoLevel + "%";
    el("xp-hint").textContent = `距离下一级还差 ${100 - intoLevel} XP · 最佳连胜 ${state.bestStreak}`;
    el("foot-meta").textContent = `${BANK.meta.school} · 第 ${BANK.meta.builtIteration} 次迭代`;

    const grid = el("subject-grid");
    grid.innerHTML = "";
    Object.values(SUBJECTS).forEach((s) => {
      const total = s.questions.length;
      const done = s.questions.filter((q) => state.seen[q.id]).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      const card = document.createElement("button");
      card.className = "subject-card";
      card.style.background = `linear-gradient(150% 120% at 0 0, ${s.color}33, transparent), var(--card)`;
      card.innerHTML = `
        <span class="pill">${done}/${total}</span>
        <div class="ic">${s.icon}</div>
        <div class="nm">${s.name}</div>
        <div class="en">${s.enName}</div>
        <div class="bl">${s.blurb}</div>
        <div class="pbar"><i style="width:${pct}%;background:${s.color}"></i></div>`;
      card.onclick = () => openSubject(s.key);
      grid.appendChild(card);
    });
  }

  /* ---------- SUBJECT ---------- */
  function openSubject(key) {
    const s = SUBJECTS[key];
    el("subj-title").textContent = s.name;
    const head = el("subj-head");
    head.style.background = `linear-gradient(135deg, ${s.color}, ${s.color}aa)`;
    const done = s.questions.filter((q) => state.seen[q.id]).length;
    head.innerHTML = `<div class="big">${s.icon} ${s.name}</div><div class="sm">${s.enName} · ${s.blurb}<br/>题目 ${s.questions.length} 题 · 已练 ${done} 题</div>`;

    // topic breakdown
    const topics = {};
    s.questions.forEach((q) => { topics[q.topic] = (topics[q.topic] || 0) + 1; });
    el("topic-stats").innerHTML = Object.entries(topics)
      .map(([t, n]) => `<span class="t">${t} · ${n}</span>`).join("");

    // notes
    const nw = el("notes-wrap");
    nw.innerHTML = (s.notes || []).length ? `<h2 class="section-h" style="margin-left:0">温习笔记 · Study Notes</h2>` : "";
    (s.notes || []).forEach((n) => {
      const d = document.createElement("div");
      d.className = "note";
      d.innerHTML = `<h4>${n.title}</h4><p>${n.body}</p>`;
      nw.appendChild(d);
    });

    el("start-practice").onclick = () => startQuiz(shuffle(s.questions.map((q) => Object.assign({ _subj: key }, q))), s.name);
    show("screen-subject");
  }

  /* ---------- QUIZ ---------- */
  let quiz = null;
  function startQuiz(questions, label) {
    if (!questions.length) { alert("暂无可练习的题目。"); return; }
    quiz = { qs: questions.slice(0, 15), i: 0, correct: 0, label, xpGain: 0 };
    show("screen-quiz");
    renderQuestion();
  }

  function renderQuestion() {
    const q = quiz.qs[quiz.i];
    const subj = SUBJECTS[q._subj];
    el("q-total").textContent = quiz.qs.length;
    el("q-index").textContent = quiz.i + 1;
    el("qprogress-fill").style.width = ((quiz.i) / quiz.qs.length) * 100 + "%";
    const sc = el("q-subject"); sc.textContent = subj.icon + " " + subj.name; sc.style.background = subj.color + "44";
    el("q-topic").textContent = q.topic;
    el("q-stem").textContent = q.stem;
    el("q-feedback").hidden = true;
    el("q-next").hidden = true;

    const optsBox = el("q-options");
    const fillBox = el("q-fill");
    if (q.type === "fill") {
      optsBox.hidden = true; optsBox.innerHTML = "";
      fillBox.hidden = false;
      const inp = el("q-input"); inp.value = ""; inp.disabled = false;
      el("q-submit").disabled = false;
      el("q-submit").onclick = () => submitFill(q);
      inp.onkeydown = (e) => { if (e.key === "Enter") submitFill(q); };
      setTimeout(() => inp.focus(), 120);
    } else {
      fillBox.hidden = true;
      optsBox.hidden = false;
      optsBox.innerHTML = "";
      q.options.forEach((opt, idx) => {
        const b = document.createElement("button");
        b.className = "opt";
        b.innerHTML = `<span class="lt">${LETTERS[idx]}</span><span>${opt}</span>`;
        b.onclick = () => answerMcq(q, idx, b);
        optsBox.appendChild(b);
      });
    }
  }

  function answerMcq(q, idx, btn) {
    const correct = idx === q.answer;
    document.querySelectorAll("#q-options .opt").forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) b.classList.add("correct");
      else if (i === idx) b.classList.add("wrong");
      else b.classList.add("dim");
    });
    grade(q, correct, q.options[q.answer], LETTERS[q.answer]);
  }

  function submitFill(q) {
    const raw = el("q-input").value;
    if (!raw.trim()) { el("q-input").focus(); return; }
    const ok = q.answer.some((a) => normalize(a) === normalize(raw)) ||
               q.answer.some((a) => normalize(raw).includes(normalize(a)) && normalize(a).length > 1);
    el("q-input").disabled = true; el("q-submit").disabled = true;
    grade(q, ok, q.answer[0]);
  }

  function grade(q, correct, answerText, letter) {
    // record
    state.seen[q.id] = true;
    state.totalAns++;
    if (correct) {
      state.totalCorrect++; quiz.correct++;
      state.streak++; state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.correct[q.id] = true; delete state.wrong[q.id];
      const gain = 10 + Math.min(state.streak, 10); // streak bonus
      state.xp += gain; quiz.xpGain += gain;
    } else {
      state.streak = 0; state.wrong[q.id] = true;
    }
    save();

    const fb = el("q-feedback");
    fb.hidden = false;
    fb.className = "q-feedback " + (correct ? "ok" : "bad");
    const head = correct ? "✅ 答对了！ Correct!" : "❌ 答错了 Not quite";
    const ansLine = correct ? "" :
      `<div>正确答案 · Answer：<span class="ans">${letter ? letter + ". " : ""}${answerText}</span></div>`;
    fb.innerHTML = `<div class="ftitle">${head}</div>${ansLine}<div style="margin-top:6px">${q.explanation}</div>`;
    if (correct) burst();

    const next = el("q-next");
    next.hidden = false;
    next.textContent = quiz.i + 1 < quiz.qs.length ? "下一题 ›" : "查看成绩 ›";
    next.onclick = () => { quiz.i++; quiz.i < quiz.qs.length ? renderQuestion() : finishQuiz(); };
  }

  function finishQuiz() {
    el("qprogress-fill").style.width = "100%";
    const total = quiz.qs.length, c = quiz.correct, pct = Math.round((c / total) * 100);
    el("result-correct").textContent = c;
    el("result-total").textContent = total;
    el("result-xp").textContent = `+${quiz.xpGain} XP　·　🔥 连胜 ${state.streak}`;
    let emoji, title, msg;
    if (pct === 100) { emoji = "🏆"; title = "满分！太厉害了！"; msg = "Perfect score! 你已经掌握了这一组题目，继续保持！"; }
    else if (pct >= 80) { emoji = "🎉"; title = "非常棒！"; msg = "Great job! 再复习一下错题就更稳了。"; }
    else if (pct >= 50) { emoji = "💪"; title = "继续加油！"; msg = "Keep going! 看看讲解，错题重练一次会进步很快。"; }
    else { emoji = "📚"; title = "别灰心，慢慢来"; msg = "Don't give up! 先读讲解再练一次，你一定可以的。"; }
    el("result-emoji").textContent = emoji;
    el("result-title").textContent = title;
    el("result-msg").textContent = msg;
    el("result-again").onclick = () => startQuiz(shuffle(quiz.qs), quiz.label);
    if (pct >= 80) burst(60);
    show("screen-result");
  }

  /* ---------- modes ---------- */
  function startMode(mode) {
    if (mode === "mixed") {
      startQuiz(shuffle(allQuestions()), "综合挑战");
    } else if (mode === "review") {
      const wrongIds = Object.keys(state.wrong);
      const qs = allQuestions().filter((q) => wrongIds.includes(q.id));
      if (!qs.length) { alert("太棒了，目前没有错题需要重练！🎉"); return; }
      startQuiz(shuffle(qs), "错题重练");
    }
  }

  /* ---------- confetti ---------- */
  function burst(n) {
    n = n || 18;
    const box = el("confetti");
    const colors = ["#ffd23f", "#e23d3d", "#34c77b", "#2e7d32", "#1565c0", "#ff6a3d"];
    for (let i = 0; i < n; i++) {
      const c = document.createElement("div");
      c.className = "cf";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[(Math.random() * colors.length) | 0];
      c.style.animationDuration = 1.2 + Math.random() * 1.3 + "s";
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      box.appendChild(c);
      setTimeout(() => c.remove(), 2600);
    }
  }

  /* ---------- wire up ---------- */
  document.querySelectorAll("[data-home]").forEach((b) => (b.onclick = () => { renderHome(); show("screen-home"); }));
  document.querySelectorAll(".mode-card").forEach((b) => (b.onclick = () => startMode(b.dataset.mode)));
  el("quit-quiz").onclick = () => { if (confirm("退出本次练习？进度已保存。")) { renderHome(); show("screen-home"); } };

  renderHome();

  /* service worker for offline use */
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
