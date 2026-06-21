/* ===========================================================================
 * 中华入学试 · Chong Hwa Entrance Trainer — app engine
 * Pure vanilla JS single-page app. No build step, fully offline-capable PWA.
 * State persists in localStorage so progress survives reloads on any device.
 * =========================================================================== */
(function () {
  "use strict";

  /* ---------- Data ---------- */
  const SUBJECTS = window.SUBJECTS || [];
  const LEVELS = window.LEVELS || [];
  const BADGES = window.BADGES || [];
  // Merge authored seed questions with authentic past-paper questions.
  const ALL_Q = [].concat(window.QUESTIONS || [], window.PASTPAPER || []);

  /* ---------- State ---------- */
  const SAVE_KEY = "chonghwa_progress_v1";
  const defaultState = () => ({
    xp: 0,
    level: 1,
    streak: 0,
    bestStreak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    perfectQuizzes: 0,
    subjectsTried: {},           // {subjectId: answeredCount}
    subjectCorrect: {},          // {subjectId: correctCount}
    seenQuestions: {},           // {questionId: true}
    badges: {},                  // {badgeId: true}
    lastPlayed: null,
  });

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) { /* ignore */ }
    return defaultState();
  }
  function save() {
    state.lastPlayed = Date.now();
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {}
    refreshMini();
  }

  /* ---------- Helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const view = $("#view");
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const subjectById = (id) => SUBJECTS.find((s) => s.id === id);
  const qForSubject = (id) => ALL_Q.filter((q) => q.subject === id);

  function levelFor(xp) {
    let cur = LEVELS[0];
    for (const L of LEVELS) if (xp >= L.xp) cur = L;
    return cur;
  }
  function nextLevel(xp) {
    return LEVELS.find((L) => L.xp > xp) || null;
  }

  /* ---------- Top bar / mini stats ---------- */
  function refreshMini() {
    $("#miniStreak").textContent = state.streak;
    $("#miniXp").textContent = state.xp;
  }

  let currentRoute = "home";
  const backBtn = $("#backBtn");
  backBtn.addEventListener("click", () => {
    if (currentRoute === "quiz") {
      if (!confirm("退出练习？本次进度不会保存。\nQuit this quiz? Current run won't be saved.")) return;
    }
    if (currentRoute === "subject" || currentRoute === "badges" || currentRoute === "quiz" || currentRoute === "result") {
      routeHome();
    }
  });
  function setBack(show) { backBtn.hidden = !show; }

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), 1800);
  }

  /* ---------- Confetti ---------- */
  function confetti(n) {
    const colors = ["#c8102e", "#f4b400", "#1faa59", "#2563eb", "#ff7eb6"];
    for (let i = 0; i < (n || 28); i++) {
      const c = el("div", "confetti");
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      const dur = 1.6 + Math.random() * 1.4;
      c.animate(
        [
          { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
          { transform: `translateY(100vh) rotate(${720 + Math.random() * 360}deg)`, opacity: 0.9 },
        ],
        { duration: dur * 1000, easing: "cubic-bezier(.3,.7,.5,1)" }
      );
      document.body.appendChild(c);
      setTimeout(() => c.remove(), dur * 1000);
    }
  }

  /* ---------- Badge checking ---------- */
  function checkBadges() {
    const newly = [];
    for (const b of BADGES) {
      if (!state.badges[b.id] && b.test(state)) {
        state.badges[b.id] = true;
        newly.push(b);
      }
    }
    return newly;
  }

  /* ===================== Views ===================== */

  function routeHome() {
    currentRoute = "home";
    setBack(false);
    view.innerHTML = "";

    const lvl = levelFor(state.xp);
    state.level = lvl.lvl;
    const nxt = nextLevel(state.xp);
    const pct = nxt
      ? Math.round(((state.xp - lvl.xp) / (nxt.xp - lvl.xp)) * 100)
      : 100;

    // Hero
    const hero = el("section", "hero");
    hero.innerHTML = `
      <h1>你好，未来的中华人！👋</h1>
      <p>准备好挑战<strong>吉隆坡中华独中</strong>入学试了吗？选一科开始闯关吧！</p>
      <div class="level-row">
        <div class="level-badge"><b>Lv${lvl.lvl}</b>${lvl.title.split(" ")[0]}</div>
        <div class="xpbar">
          <div class="bar"><span style="width:${pct}%"></span></div>
          <small>${state.xp} XP ${nxt ? `· 距 Lv${nxt.lvl} 还差 ${nxt.xp - state.xp} XP` : "· 已封顶 🏆"}</small>
        </div>
      </div>`;
    view.appendChild(hero);

    // Subject grid
    view.appendChild(el("h2", "section-title", "选择科目 · Pilih Subjek · Choose a Subject"));
    const grid = el("div", "grid");
    for (const s of SUBJECTS) {
      const qs = qForSubject(s.id);
      const tried = state.subjectsTried[s.id] || 0;
      const correct = state.subjectCorrect[s.id] || 0;
      const mastery = tried ? Math.round((correct / tried) * 100) : 0;
      const card = el("button", "subject-card");
      card.innerHTML = `
        <div class="stripe" style="background:${s.color}"></div>
        <div class="emoji">${s.emoji}</div>
        <div class="s-name">${s.name}<span class="latin">${s.latin}</span></div>
        <div class="count">${qs.length} 题 · 已答 ${tried}</div>
        <div class="s-prog">
          <div class="bar"><span style="width:${mastery}%;background:${s.color}"></span></div>
        </div>`;
      card.addEventListener("click", () => routeSubject(s.id));
      grid.appendChild(card);
    }
    view.appendChild(grid);

    // Quick actions
    const actions = el("div", "btn-row");
    const bMixed = el("button", "btn btn-gold", "🎲 混合挑战 Mixed Quiz");
    bMixed.addEventListener("click", () => startQuiz(null));
    const bBadge = el("button", "btn btn-ghost", "🏅 我的徽章 Badges");
    bBadge.addEventListener("click", routeBadges);
    actions.appendChild(bMixed);
    actions.appendChild(bBadge);
    view.appendChild(actions);

    view.appendChild(
      el("p", "note",
        `共 ${ALL_Q.length} 道题目 · 含 ${(window.PASTPAPER || []).length} 道 2026 历届真题<br>` +
        `资料来源：吉隆坡中华独立中学《2026 小六历届试题》`)
    );
    refreshMini();
  }

  function routeSubject(id) {
    currentRoute = "subject";
    setBack(true);
    const s = subjectById(id);
    const qs = qForSubject(id);
    view.innerHTML = "";

    const head = el("section", "hero");
    head.innerHTML = `
      <h1>${s.emoji} ${s.name}</h1>
      <p>${s.blurb}</p>
      <p class="muted" style="margin-top:6px">${qs.length} 道题目 · ${qs.filter(q=>q.year).length} 道历届真题</p>`;
    view.appendChild(head);

    // Topic chips
    const topics = Array.from(new Set(qs.map((q) => q.topic.split(" · ")[0])));
    view.appendChild(el("h2", "section-title", "练习模式 · Mod Latihan"));

    const list = el("div", "list-card");
    const modes = [
      { emoji: "⚡", title: "快速练习 Quick 5", sub: "随机 5 题，立刻开始", run: () => startQuiz(id, 5) },
      { emoji: "📝", title: "完整练习 Full Set", sub: `全部 ${qs.length} 题`, run: () => startQuiz(id, qs.length) },
      { emoji: "📜", title: "历届真题 Past Paper", sub: "只做官方真题", run: () => startQuiz(id, 99, (q) => !!q.year) },
    ];
    for (const m of modes) {
      const it = el("div", "list-item");
      it.innerHTML = `<div class="li-emoji">${m.emoji}</div>
        <div class="li-main"><div class="li-title">${m.title}</div><div class="li-sub">${m.sub}</div></div>
        <div class="li-go">›</div>`;
      it.addEventListener("click", m.run);
      list.appendChild(it);
    }
    view.appendChild(list);

    view.appendChild(el("h2", "section-title", "涵盖知识点 · Topics"));
    const pills = el("div", "pill-row");
    topics.forEach((t) => pills.appendChild(el("span", "pill", t)));
    view.appendChild(pills);
  }

  /* ---------- Quiz engine ---------- */
  let quiz = null;

  function startQuiz(subjectId, limit, filter) {
    let pool = subjectId ? qForSubject(subjectId) : ALL_Q.slice();
    if (filter) pool = pool.filter(filter);
    if (!pool.length) { toast("暂无题目 No questions yet"); return; }
    // Prefer unseen questions first, then fill with seen.
    const unseen = pool.filter((q) => !state.seenQuestions[q.id]);
    const seen = pool.filter((q) => state.seenQuestions[q.id]);
    let ordered = shuffle(unseen).concat(shuffle(seen));
    const n = Math.min(limit || ordered.length, ordered.length);
    quiz = {
      subjectId,
      items: ordered.slice(0, n),
      idx: 0,
      correct: 0,
      answers: [],
    };
    currentRoute = "quiz";
    setBack(true);
    renderQuestion();
  }

  function renderQuestion() {
    const q = quiz.items[quiz.idx];
    const s = subjectById(q.subject);
    view.innerHTML = "";

    // progress
    const head = el("div", "quiz-head");
    const pct = Math.round((quiz.idx / quiz.items.length) * 100);
    head.innerHTML = `
      <div class="quiz-progress"><span style="width:${pct}%"></span></div>
      <div class="quiz-progress-label">${quiz.idx + 1}/${quiz.items.length} · 🔥${state.streak}</div>`;
    view.appendChild(head);

    // card
    const card = el("section", "qcard");
    let inner = `<div class="q-topic">${s.emoji} ${q.topic}<span class="q-diff">${q.difficulty || ""}</span></div>`;
    if (q.passage) inner += `<div class="q-passage">${escapeHtml(q.passage)}</div>`;
    const langClass = q.subject === "english" ? "lang-en" : "";
    inner += `<div class="q-text ${langClass}">${escapeHtml(q.q)}</div>`;
    card.innerHTML = inner;

    const opts = el("div", "options");
    // randomise option order but track correct index
    const order = shuffle(q.options.map((_, i) => i));
    order.forEach((origIdx, pos) => {
      const b = el("button", "opt");
      b.innerHTML = `<span class="key">${"ABCD"[pos]}</span><span class="opt-text">${escapeHtml(q.options[origIdx])}</span>`;
      b.addEventListener("click", () => choose(b, origIdx, q, opts));
      opts.appendChild(b);
    });
    card.appendChild(opts);
    view.appendChild(card);
  }

  function choose(btn, origIdx, q, optsWrap) {
    // lock all
    Array.from(optsWrap.children).forEach((c) => (c.disabled = true));
    const isCorrect = origIdx === q.answer;

    // mark chosen + correct
    if (isCorrect) {
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
      // reveal the correct one
      Array.from(optsWrap.children).forEach((c) => {
        const t = $(".opt-text", c).textContent;
        if (t === q.options[q.answer]) c.classList.add("correct");
      });
    }

    // update state
    state.totalAnswered++;
    state.subjectsTried[q.subject] = (state.subjectsTried[q.subject] || 0) + 1;
    state.seenQuestions[q.id] = true;
    if (isCorrect) {
      quiz.correct++;
      state.totalCorrect++;
      state.subjectCorrect[q.subject] = (state.subjectCorrect[q.subject] || 0) + 1;
      state.streak++;
      if (state.streak > state.bestStreak) state.bestStreak = state.streak;
      const gain = 10 + Math.min(state.streak, 5) * 2; // streak bonus
      state.xp += gain;
      toast(`✅ 答对了！+${gain} XP`);
      if (state.streak >= 3) confetti(20);
    } else {
      state.streak = 0;
      state.xp += 2; // small consolation for trying
      toast("再接再厉 Keep going!");
    }
    quiz.answers.push({ id: q.id, correct: isCorrect });
    save();

    // explanation
    const ex = el("div", "explain " + (isCorrect ? "ok" : "no"));
    ex.innerHTML =
      `<h4>${isCorrect ? "✅ 正确！Correct!" : "❌ 答错了 Not quite"}</h4>` +
      `<p><span class="label">正确答案 / Answer：</span>${"ABCD"[q.answer]}. ${escapeHtml(q.options[q.answer])}</p>` +
      `<p>${formatExplain(q.explain)}</p>`;
    view.querySelector(".qcard").appendChild(ex);

    // next button
    const nextWrap = el("div", "btn-row");
    const isLast = quiz.idx === quiz.items.length - 1;
    const nb = el("button", "btn btn-primary", isLast ? "🏁 查看成绩 See Result" : "下一题 Next ›");
    nb.addEventListener("click", () => {
      if (isLast) finishQuiz();
      else { quiz.idx++; renderQuestion(); }
    });
    nextWrap.appendChild(nb);
    view.appendChild(nextWrap);
    ex.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function finishQuiz() {
    const total = quiz.items.length;
    const score = quiz.correct;
    const pct = Math.round((score / total) * 100);
    if (score === total && total >= 3) state.perfectQuizzes++;

    const newBadges = checkBadges();
    save();

    currentRoute = "result";
    setBack(true);
    view.innerHTML = "";

    let emoji = "💪", line = "继续加油，你会更好！";
    if (pct === 100) { emoji = "🏆"; line = "满分！太厉害了！Perfect!"; }
    else if (pct >= 80) { emoji = "🌟"; line = "非常棒！Excellent!"; }
    else if (pct >= 60) { emoji = "👍"; line = "做得不错！Good job!"; }

    const card = el("section", "result-card");
    card.innerHTML = `
      <div class="result-emoji">${emoji}</div>
      <div class="ring" style="--p:${pct}">
        <div class="inner"><div><b>${score}/${total}</b><br><span class="muted">${pct}%</span></div></div>
      </div>
      <div class="result-score">+${quiz.answers.length ? "" : ""}${score * 10} XP</div>
      <div class="result-sub">${line}</div>`;
    view.appendChild(card);

    if (pct >= 60) confetti(40);

    if (newBadges.length) {
      const bWrap = el("section", "qcard");
      bWrap.innerHTML = `<div class="q-topic">🎉 解锁新徽章 New Badge!</div>`;
      const bg = el("div", "badge-grid");
      newBadges.forEach((b) => {
        const bb = el("div", "badge earned");
        bb.innerHTML = `<div class="b-emoji">${b.emoji}</div><div class="b-name">${b.name}</div>`;
        bg.appendChild(bb);
      });
      bWrap.appendChild(bg);
      view.appendChild(bWrap);
    }

    const row = el("div", "btn-row");
    const again = el("button", "btn btn-gold", "🔁 再来一组 Again");
    again.addEventListener("click", () => startQuiz(quiz.subjectId, quiz.items.length));
    const home = el("button", "btn btn-ghost", "🏠 回首页 Home");
    home.addEventListener("click", routeHome);
    row.appendChild(again);
    row.appendChild(home);
    view.appendChild(row);
  }

  /* ---------- Badges view ---------- */
  function routeBadges() {
    currentRoute = "badges";
    setBack(true);
    view.innerHTML = "";
    const earned = Object.keys(state.badges).length;
    const head = el("section", "hero");
    head.innerHTML = `<h1>🏅 我的徽章</h1><p>已解锁 ${earned} / ${BADGES.length} 个徽章。继续努力收集全部！</p>`;
    view.appendChild(head);

    view.appendChild(el("h2", "section-title", "成就 · Achievements"));
    const bg = el("div", "badge-grid");
    BADGES.forEach((b) => {
      const got = !!state.badges[b.id];
      const bb = el("div", "badge" + (got ? " earned" : ""));
      bb.innerHTML = `<div class="b-emoji">${b.emoji}</div><div class="b-name">${b.name}</div>`;
      bg.appendChild(bb);
    });
    view.appendChild(bg);

    // stats
    const stats = el("section", "qcard");
    stats.innerHTML = `
      <div class="q-topic">📊 学习统计 · Statistics</div>
      <p>总答题数 Total answered: <b>${state.totalAnswered}</b></p>
      <p>答对题数 Correct: <b>${state.totalCorrect}</b> (${state.totalAnswered ? Math.round(state.totalCorrect/state.totalAnswered*100) : 0}%)</p>
      <p>最佳连胜 Best streak: <b>🔥 ${state.bestStreak}</b></p>
      <p>满分次数 Perfect quizzes: <b>${state.perfectQuizzes}</b></p>
      <p>等级 Level: <b>Lv${levelFor(state.xp).lvl} — ${levelFor(state.xp).title}</b></p>`;
    view.appendChild(stats);

    const row = el("div", "btn-row");
    const reset = el("button", "btn btn-ghost", "♻️ 重置进度 Reset");
    reset.addEventListener("click", () => {
      if (confirm("确定要清除所有学习进度吗？此操作无法撤销。\nReset all progress? This cannot be undone.")) {
        state = defaultState();
        save();
        routeHome();
        toast("进度已重置 Progress reset");
      }
    });
    row.appendChild(reset);
    view.appendChild(row);
  }

  /* ---------- text helpers ---------- */
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }
  // explanations may contain **bold** and newlines; render safely
  function formatExplain(str) {
    let s = escapeHtml(str);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    s = s.replace(/\n/g, "<br>");
    return s;
  }

  /* ---------- iOS install hint ---------- */
  function maybeShowIosHint() {
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = window.navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
    const dismissed = localStorage.getItem("ios_hint_dismissed");
    if (isIos && !standalone && !dismissed) {
      const box = $("#iosInstall");
      box.hidden = false;
      $("#iosClose").addEventListener("click", () => {
        box.hidden = true;
        localStorage.setItem("ios_hint_dismissed", "1");
      });
    }
  }

  /* ---------- Service worker ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  /* ---------- Boot ---------- */
  refreshMini();
  routeHome();
  maybeShowIosHint();
})();
