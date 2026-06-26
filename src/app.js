(function () {
  "use strict";
  /* ===================================================================
     Chong Hwa Junior-1 Entrance Exam · Star Quest
     Iteration 7 — 9 milestone mini-games (adds 🎯 24-Point Sprint),
     timed mock exams, reading-comprehension passages, a Star Shop
     (themes + avatars), daily-goal streak and a 243-question bank.
     Portable: single file, offline, localStorage progress.
  =================================================================== */
  // Distribution builds ship a compact bank (window.QB) to save space;
  // expand it to the full shape the app expects. Readable builds already
  // define window.QUESTION_BANK, so this is a no-op there.
  if (window.QB && !window.QUESTION_BANK) {
    var c = window.QB, o = { meta: c.meta, subjects: {} };
    Object.keys(c.subjects).forEach(function (k) {
      var s = c.subjects[k];
      o.subjects[k] = {
        key: s.k, name: s.name, enName: s.en, icon: s.icon, color: s.color, blurb: s.blurb,
        notes: (s.notes || []).map(function (n) { return { title: n[0], body: n[1] }; }),
        questions: s.Q.map(function (q, i) {
          var obj = { id: k + "-" + i, topic: q[0], stem: q[1], answer: q[3], explanation: q[4] };
          if (q[2] === 0) obj.type = "fill"; else obj.options = q[2];
          if (q[5]) obj.diff = q[5];
          return obj;
        })
      };
    });
    o.passages = c.passages || [];
    window.QUESTION_BANK = o;
  }
  var BANK = window.QUESTION_BANK;
  var SUBJECTS = BANK.subjects;
  var PASSAGES = BANK.passages || [];
  var LETTERS = ["A", "B", "C", "D", "E"];
  var STORE_KEY = "chonghwa_starquest_v2";
  // Per-question difficulty / academic standard (shown as a badge in the quiz).
  var DIFF = {
    1: { label: "基础 Basic", color: "#19402f", ink: "#7be0a4" },
    2: { label: "进阶 Intermediate", color: "#2a2655", ink: "#b6b0ff" },
    3: { label: "挑战 Challenge", color: "#3a1a22", ink: "#ff9aa6" }
  };

  /* ---------- star economy tuning ---------- */
  var STAR_RIGHT = 2;        // base stars for a correct answer (stars are earned, not handed out)
  var STAR_WRONG = -4;       // stars deducted for a wrong answer (balance never < 0)
  function streakBonus(s) { return Math.min(Math.floor(s / 3), 3); } // +1 per 3-in-a-row, max +3
  function milestoneAt(k) { return 70 * k + 20 * k * k; } // 90,220,390,600,850,...
  var DAY_GOAL = 30;     // stars to earn in a day to hit the daily goal
  var DAILY_BONUS = 8;   // bonus stars for meeting the daily goal

  var state = load();
  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) {}
    if (!s || !s.seen) {
      s = {
        stars: 0, lifetime: 0, offered: 0,
        streak: 0, bestStreak: 0,
        seen: {}, wrong: {}, totalAns: 0, totalCorrect: 0
      };
    }
    // ---- migrations / defaults for fields added in later iterations ----
    if (s.day == null || s.day.date == null) s.day = { date: "", stars: 0 };
    if (s.dayStreak == null) s.dayStreak = 0;
    if (s.lastGoalDate === undefined) s.lastGoalDate = null;
    if (s.dailyAwarded == null) s.dailyAwarded = false;
    if (s.theme == null) s.theme = "default";
    if (s.avatar == null) s.avatar = "📚";
    if (!s.owned) s.owned = { default: true };
    if (!s.ownedAvatars) s.ownedAvatars = { "📚": true };
    return s;
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }

  /* ---------- daily goal + streak ---------- */
  function dateStr(d) { d = d || new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function yesterdayStr() { var d = new Date(); d.setDate(d.getDate() - 1); return dateStr(d); }
  function rollDay() {
    var t = dateStr();
    if (state.day.date !== t) {
      // a new calendar day: if the goal wasn't met yesterday, the daily streak breaks
      if (state.lastGoalDate !== yesterdayStr() && state.lastGoalDate !== t) state.dayStreak = 0;
      state.day = { date: t, stars: 0 };
      state.dailyAwarded = false;
      save();
    }
  }
  function checkDailyGoal() {
    if (!state.dailyAwarded && state.day.stars >= DAY_GOAL) {
      state.dailyAwarded = true;
      state.lastGoalDate = state.day.date;
      state.dayStreak += 1;
      state.stars += DAILY_BONUS;
      state.lifetime += DAILY_BONUS;
      save();
      toast("🎯 完成今日目标！连续打卡 " + state.dayStreak + " 天 · 奖励 +" + DAILY_BONUS + "⭐");
      burst(40);
    }
  }
  function toast(msg) {
    var t = el("toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2800);
  }

  var el = function (s) { return document.getElementById(s); };
  function levelFromLife(n) { return Math.floor(n / 120) + 1; }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0; var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function allQuestions() {
    var out = [];
    Object.keys(SUBJECTS).forEach(function (k) {
      SUBJECTS[k].questions.forEach(function (q) { out.push(Object.assign({ _subj: k }, q)); });
    });
    return out;
  }
  function normalize(s) {
    return String(s).trim().toLowerCase().replace(/\s+/g, "").replace(/[，,]/g, ",")
      .replace(/[（(]/g, "(").replace(/[）)]/g, ")").replace(/rm/g, "").replace(/[％%]/g, "%")
      .replace(/[：:]/g, ":").replace(/。\.?$/, "");
  }
  function show(id) {
    var nodes = document.querySelectorAll(".screen");
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.remove("active");
    el(id).classList.add("active");
    window.scrollTo(0, 0);
  }

  /* ---------- star awarding + milestone detection ---------- */
  function addStars(n, countLifetime) {
    state.stars = Math.max(0, state.stars + n);
    if (countLifetime && n > 0) {
      state.lifetime += n;
      rollDay();
      state.day.stars += n;
      checkDailyGoal();
    }
    save();
  }
  // how many milestones the lifetime total has crossed
  function reachedCount() {
    var k = 0;
    while (state.lifetime >= milestoneAt(k + 1)) k++;
    return k;
  }
  var snoozeReached = -1; // suppress re-offering after "later" until more stars earned

  /* ---------- reset progress (stars, score, streaks) ---------- */
  function resetProgress() {
    state.stars = 0; state.lifetime = 0; state.offered = 0;
    state.streak = 0; state.bestStreak = 0;
    state.seen = {}; state.wrong = {};
    state.totalAns = 0; state.totalCorrect = 0;
    state.day = { date: "", stars: 0 };
    state.dayStreak = 0; state.lastGoalDate = null; state.dailyAwarded = false;
    snoozeReached = -1;
    // Purchased themes/avatars are cosmetic and intentionally kept.
    save();
    renderHome();
    toast("♻️ 已重置星星与成绩。已购买的主题和头像仍保留。");
  }

  /* ---------- HOME ---------- */
  function renderHome() {
    rollDay();
    var av = el("hero-avatar"); if (av) av.textContent = state.avatar;
    el("stat-stars").textContent = state.stars;
    el("stat-level").textContent = levelFromLife(state.lifetime);
    el("stat-streak").textContent = state.streak;
    el("stat-life").textContent = state.lifetime;
    el("stat-acc").textContent = state.totalAns ? Math.round((state.totalCorrect / state.totalAns) * 100) + "%" : "–";

    // milestone progress toward the next unlock
    var reached = reachedCount();
    var prev = milestoneAt(reached);
    var next = milestoneAt(reached + 1);
    var span = next - prev, into = Math.min(span, state.lifetime - prev);
    el("ms-fill").style.width = Math.max(2, Math.round((into / span) * 100)) + "%";
    el("ms-count").textContent = "已解锁 " + reached + " 个";
    var gname = GAMES[reached % GAMES.length];
    el("ms-hint").innerHTML = "再赚 <b>" + Math.max(0, next - state.lifetime) +
      "</b> 颗星即可解锁：<b>" + gname.icon + " " + gname.name + "</b>";

    // daily goal progress
    var dpct = Math.min(100, Math.round((state.day.stars / DAY_GOAL) * 100));
    el("day-fill").style.width = Math.max(3, dpct) + "%";
    el("day-streak").textContent = "🔥 连续 " + state.dayStreak + " 天";
    el("day-hint").innerHTML = state.day.stars >= DAY_GOAL
      ? "今日目标已完成 ✅ 太棒了！明天再来保持连胜。"
      : "今日已赚 <b>" + state.day.stars + "</b> / " + DAY_GOAL + " ⭐，再赚 <b>" +
        (DAY_GOAL - state.day.stars) + "</b> 颗即可达标，额外得 +" + DAILY_BONUS + "⭐";

    el("foot-meta").textContent = BANK.meta.school + "\n" + BANK.meta.exam +
      " · 题库 " + allQuestions().length + " 题 · 第 " + BANK.meta.builtIteration + " 次迭代";

    var grid = el("subject-grid"); grid.innerHTML = "";
    Object.keys(SUBJECTS).forEach(function (k) {
      var s = SUBJECTS[k];
      var total = s.questions.length;
      var done = s.questions.filter(function (q) { return state.seen[q.id]; }).length;
      var pct = total ? Math.round((done / total) * 100) : 0;
      var card = document.createElement("button");
      card.className = "subject-card";
      card.style.background = "linear-gradient(150% 120% at 0 0, " + s.color + "33, transparent), var(--card)";
      card.innerHTML = '<span class="pill">' + done + "/" + total + '</span><div class="ic">' + s.icon +
        '</div><div class="nm">' + s.name + '</div><div class="en">' + s.enName + '</div><div class="bl">' +
        s.blurb + '</div><div class="pbar"><i style="width:' + pct + "%;background:" + s.color + '"></i></div>';
      card.onclick = function () { openSubject(k); };
      grid.appendChild(card);
    });

    if (reached > state.offered && reached !== snoozeReached) maybeOfferMilestone();
  }

  /* ---------- SUBJECT ---------- */
  function openSubject(key) {
    var s = SUBJECTS[key];
    el("subj-title").textContent = s.name;
    var head = el("subj-head");
    head.style.background = "linear-gradient(135deg, " + s.color + ", " + s.color + "aa)";
    var done = s.questions.filter(function (q) { return state.seen[q.id]; }).length;
    head.innerHTML = '<div class="big">' + s.icon + " " + s.name + '</div><div class="sm">' + s.enName +
      " · " + s.blurb + "<br/>题目 " + s.questions.length + " 题 · 已练 " + done + " 题</div>";
    var topics = {};
    s.questions.forEach(function (q) { topics[q.topic] = (topics[q.topic] || 0) + 1; });
    el("topic-stats").innerHTML = Object.keys(topics).map(function (t) {
      return '<span class="t">' + t + " · " + topics[t] + "</span>";
    }).join("");
    var nw = el("notes-wrap");
    nw.innerHTML = (s.notes || []).length ? '<h2 class="section-h">温习笔记 · Study Notes</h2>' : "";
    (s.notes || []).forEach(function (n) {
      var d = document.createElement("div"); d.className = "note";
      d.innerHTML = "<h4>" + n.title + "</h4><p>" + n.body + "</p>"; nw.appendChild(d);
    });
    el("start-practice").onclick = function () {
      startQuiz(shuffle(s.questions.map(function (q) { return Object.assign({ _subj: key }, q); })), s.name);
    };
    show("screen-subject");
  }

  /* ---------- QUIZ ---------- */
  var quiz = null;
  function startQuiz(questions, label, opts) {
    opts = opts || {};
    if (!questions.length) { alert("暂无可练习的题目。"); return; }
    clearQuizTimer();
    var count = opts.count || 15;
    quiz = { qs: questions.slice(0, count), i: 0, correct: 0, label: label, stars: 0, opts: opts };
    show("screen-quiz");
    if (opts.timed) { startQuizTimer(opts.seconds || quiz.qs.length * 45); }
    else { el("q-timer").hidden = true; }
    renderQuestion();
  }
  /* ---------- mock-exam countdown ---------- */
  var quizTimerId = null;
  function clearQuizTimer() { if (quizTimerId) { clearInterval(quizTimerId); quizTimerId = null; } }
  function startQuizTimer(total) {
    quiz.timeLeft = total;
    var tEl = el("q-timer"); tEl.hidden = false;
    function paint() {
      var m = Math.floor(quiz.timeLeft / 60), s = quiz.timeLeft % 60;
      tEl.textContent = "⏱ " + m + ":" + (s < 10 ? "0" : "") + s;
      tEl.classList.toggle("urgent", quiz.timeLeft <= 30);
    }
    paint();
    quizTimerId = setInterval(function () {
      quiz.timeLeft--; paint();
      if (quiz.timeLeft <= 0) { clearQuizTimer(); toast("⏰ 时间到！自动交卷 · Time's up!"); finishQuiz(); }
    }, 1000);
  }
  function renderQuestion() {
    var q = quiz.qs[quiz.i];
    var subj = SUBJECTS[q._subj];
    // reading-comprehension passage panel (same passage for the whole set)
    var pp = el("q-passage");
    if (quiz.opts && quiz.opts.passage) {
      var p = quiz.opts.passage;
      var bodyHtml = String(p.body).split("\n").map(function (ln) {
        return ln.trim() ? "<p>" + ln + "</p>" : "";
      }).join("");
      pp.hidden = false;
      pp.innerHTML = '<button type="button" class="pg-head" id="pg-toggle"><span>📖 ' + p.title +
        '</span><span class="pg-caret">收起 ▾</span></button>' +
        '<div class="pg-body" id="pg-body"><div class="pg-src">' + (p.intro || "") + "</div>" + bodyHtml + "</div>";
      el("pg-toggle").onclick = function () {
        pp.classList.toggle("collapsed");
        el("pg-toggle").querySelector(".pg-caret").textContent =
          pp.classList.contains("collapsed") ? "展开 ▸" : "收起 ▾";
      };
    } else { pp.hidden = true; pp.innerHTML = ""; }
    el("q-total").textContent = quiz.qs.length;
    el("q-index").textContent = quiz.i + 1;
    el("q-stars").textContent = quiz.stars;
    el("qprogress-fill").style.width = (quiz.i / quiz.qs.length) * 100 + "%";
    var sc = el("q-subject"); sc.textContent = subj.icon + " " + subj.name; sc.style.background = subj.color;
    var db = el("q-diff");
    if (q.diff && DIFF[q.diff]) {
      db.hidden = false; db.textContent = DIFF[q.diff].label;
      db.style.background = DIFF[q.diff].color; db.style.color = DIFF[q.diff].ink;
    } else { db.hidden = true; }
    el("q-topic").textContent = q.topic;
    el("q-stem").textContent = q.stem;
    el("q-feedback").hidden = true;
    el("q-next").hidden = true;
    var optsBox = el("q-options"), fillBox = el("q-fill");
    if (q.type === "fill") {
      optsBox.hidden = true; optsBox.innerHTML = "";
      fillBox.hidden = false;
      var inp = el("q-input"); inp.value = ""; inp.disabled = false;
      el("q-submit").disabled = false;
      el("q-submit").onclick = function () { submitFill(q); };
      inp.onkeydown = function (e) { if (e.key === "Enter") submitFill(q); };
      setTimeout(function () { inp.focus(); }, 120);
    } else {
      fillBox.hidden = true; optsBox.hidden = false; optsBox.innerHTML = "";
      q.options.forEach(function (opt, idx) {
        var b = document.createElement("button");
        b.className = "opt";
        b.innerHTML = '<span class="lt">' + LETTERS[idx] + "</span><span>" + opt + "</span>";
        b.onclick = function () { answerMcq(q, idx); };
        optsBox.appendChild(b);
      });
    }
  }
  function answerMcq(q, idx) {
    var correct = idx === q.answer;
    var btns = document.querySelectorAll("#q-options .opt");
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
      if (i === q.answer) btns[i].classList.add("correct");
      else if (i === idx) btns[i].classList.add("wrong");
      else btns[i].classList.add("dim");
    }
    grade(q, correct, q.options[q.answer], LETTERS[q.answer]);
  }
  function submitFill(q) {
    var raw = el("q-input").value;
    if (!raw.trim()) { el("q-input").focus(); return; }
    var ok = q.answer.some(function (a) { return normalize(a) === normalize(raw); }) ||
      q.answer.some(function (a) { return normalize(a).length > 1 && normalize(raw).indexOf(normalize(a)) >= 0; });
    el("q-input").disabled = true; el("q-submit").disabled = true;
    grade(q, ok, q.answer[0]);
  }
  function grade(q, correct, answerText, letter) {
    state.seen[q.id] = true; state.totalAns++;
    var delta;
    if (correct) {
      state.totalCorrect++; quiz.correct++;
      state.streak++; state.bestStreak = Math.max(state.bestStreak, state.streak);
      delete state.wrong[q.id];
      delta = STAR_RIGHT + streakBonus(state.streak);
      quiz.stars += delta;
      addStars(delta, true);
      burst(14);
    } else {
      state.streak = 0;
      // store how many times this question was missed → review resurfaces the worst first
      state.wrong[q.id] = (typeof state.wrong[q.id] === "number" ? state.wrong[q.id] : 0) + 1;
      delta = STAR_WRONG;
      addStars(delta, false);
    }
    save();
    el("q-stars").textContent = quiz.stars;
    var fb = el("q-feedback"); fb.hidden = false;
    fb.className = "feedback " + (correct ? "ok" : "bad");
    var head = correct ? "✅ 答对了！ Correct!" : "❌ 答错了 Not quite";
    var deltaTxt = (delta >= 0 ? "+" : "") + delta + " ⭐";
    var ansLine = correct ? "" : '<div>正确答案 · Answer：<span class="ans">' +
      (letter ? letter + ". " : "") + answerText + "</span></div>";
    fb.innerHTML = '<div class="ftitle"><span>' + head + '</span><span class="delta" style="color:' +
      (delta >= 0 ? "var(--gold)" : "var(--bad)") + '">' + deltaTxt + "</span></div>" + ansLine +
      '<div style="margin-top:6px">' + q.explanation + "</div>";
    var next = el("q-next"); next.hidden = false;
    next.textContent = quiz.i + 1 < quiz.qs.length ? "下一题 ›" : "查看成绩 ›";
    next.onclick = function () { quiz.i++; quiz.i < quiz.qs.length ? renderQuestion() : finishQuiz(); };
  }
  function finishQuiz() {
    clearQuizTimer();
    el("q-timer").hidden = true;
    el("qprogress-fill").style.width = "100%";
    var total = quiz.qs.length, c = quiz.correct, pct = Math.round((c / total) * 100);
    el("result-correct").textContent = c;
    el("result-total").textContent = total;
    el("result-stars").textContent = "本次获得 +" + quiz.stars + " ⭐　·　🔥 连胜 " + state.streak;
    var emoji, title, msg;
    if (pct === 100) { emoji = "🏆"; title = "满分！太厉害了！"; msg = "Perfect score! 你已经掌握了这一组题目，继续保持！"; }
    else if (pct >= 80) { emoji = "🎉"; title = "非常棒！"; msg = "Great job! 再复习一下错题就更稳了。"; }
    else if (pct >= 50) { emoji = "💪"; title = "继续加油！"; msg = "Keep going! 看看讲解，错题重练一次会进步很快。"; }
    else { emoji = "📚"; title = "别灰心，慢慢来"; msg = "Don't give up! 先读讲解再练一次，你一定可以的。"; }
    el("result-emoji").textContent = emoji;
    el("result-title").textContent = title;
    el("result-msg").textContent = msg;
    var againOpts = quiz.opts || {};
    el("result-again").onclick = function () { startQuiz(shuffle(quiz.qs), quiz.label, againOpts); };
    if (pct >= 80) burst(60);
    show("screen-result");
  }

  /* ---------- mode cards ---------- */
  function startMode(mode) {
    if (mode === "mixed") { startQuiz(shuffle(allQuestions()), "综合挑战"); }
    else if (mode === "review") {
      var ids = Object.keys(state.wrong);
      var qs = allQuestions().filter(function (q) { return ids.indexOf(q.id) >= 0; });
      if (!qs.length) { alert("太棒了，目前没有错题需要重练！🎉"); return; }
      // spaced repetition: resurface the most-often-missed questions first
      qs = shuffle(qs).sort(function (a, b) {
        return (state.wrong[b.id] || 1) - (state.wrong[a.id] || 1);
      });
      startQuiz(qs, "错题重练");
    }
    else if (mode === "mock") { openMockPicker(); }
    else if (mode === "reading") { openReadingPicker(); }
  }

  /* ---------- reading comprehension ---------- */
  function openReadingPicker() {
    if (!PASSAGES.length) { alert("暂无阅读理解篇章。"); return; }
    var box = el("reading-opts"); box.innerHTML = "";
    PASSAGES.forEach(function (p) {
      var subj = SUBJECTS[p.subj];
      var b = document.createElement("button");
      b.className = "btn primary read-pick";
      b.style.background = "linear-gradient(135deg," + subj.color + "," + subj.color + "aa)";
      b.innerHTML = '<span class="rp-ic">' + (p.icon || subj.icon) + '</span><span class="rp-tx"><b>' +
        p.title + '</b><small>' + subj.icon + " " + subj.name + " · " + p.questions.length + " 题</small></span>";
      b.onclick = function () { el("modal-reading").classList.remove("show"); startReading(p); };
      box.appendChild(b);
    });
    el("modal-reading").classList.add("show");
  }
  function startReading(p) {
    var qs = p.questions.map(function (q) { return Object.assign({ _subj: p.subj }, q); });
    startQuiz(qs, "阅读理解 · " + p.title, { count: qs.length, passage: p });
  }

  /* ---------- timed mock exam ---------- */
  function openMockPicker() {
    var box = el("mock-opts"); box.innerHTML = "";
    var choices = [];
    Object.keys(SUBJECTS).forEach(function (k) {
      choices.push({ key: k, label: SUBJECTS[k].icon + " " + SUBJECTS[k].name, n: 20 });
    });
    choices.push({ key: "__mix", label: "🎯 全科混合 Mixed", n: 20 });
    choices.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "btn primary mock-pick";
      b.textContent = c.label;
      b.onclick = function () { el("modal-mock").classList.remove("show"); startMockExam(c.key, c.n); };
      box.appendChild(b);
    });
    el("modal-mock").classList.add("show");
  }
  function startMockExam(key, n) {
    var pool = key === "__mix"
      ? allQuestions()
      : SUBJECTS[key].questions.map(function (q) { return Object.assign({ _subj: key }, q); });
    var qs = shuffle(pool);
    n = Math.min(n, qs.length);
    var label = key === "__mix" ? "模拟考 · 全科混合" : "模拟考 · " + SUBJECTS[key].name;
    startQuiz(qs, label, { count: n, timed: true, seconds: n * 45 });
  }

  /* =================================================================
     MILESTONE MINI-GAMES
     Each milestone unlocks a DIFFERENT game (cycled) at rising
     difficulty so the student can earn bonus stars. Interface:
       game.start(host, level, onDone)  ->  onDone(starsEarned)
  ================================================================= */
  function goHome() { clearGameTimers(); clearQuizTimer(); el("q-timer").hidden = true; show("screen-home"); renderHome(); }

  function maybeOfferMilestone() {
    var m = state.offered + 1;                 // the milestone number being offered (1-based)
    var game = GAMES[(m - 1) % GAMES.length];   // cycle through games -> different each time
    var diff = Math.min(m, 6);                  // difficulty rises with each milestone
    el("ms-em").textContent = game.icon;
    el("ms-tt").textContent = "🎉 解锁小游戏：" + game.name;
    el("ms-desc").innerHTML = game.blurb + "<br><br>难度 Lv." + diff + " · 玩得越好，赚得越多 ⭐";
    var modal = el("modal-ms"); modal.classList.add("show");
    el("ms-later").onclick = function () { modal.classList.remove("show"); snoozeReached = reachedCount(); };
    el("ms-play").onclick = function () {
      modal.classList.remove("show");
      state.offered = m; save();
      launchGame(game, diff);
    };
  }

  function launchGame(game, level) {
    el("game-title").textContent = game.icon + " " + game.name;
    el("game-reward").textContent = "⭐ 0";
    var host = el("game-host"); host.innerHTML = "";
    show("screen-game");
    // intro then play
    host.innerHTML = '<div class="intro"><div class="ic">' + game.icon + '</div><h3>' + game.name +
      '</h3><p>' + game.howto + '</p><button class="btn gold" id="go">开始 ▶</button></div>';
    el("go").onclick = function () {
      host.innerHTML = "";
      gameLive = true;
      game.start(host, level, function (earned) { if (!gameLive) return; gameLive = false; finishGame(game, earned); });
    };
  }
  function finishGame(game, earned) {
    gameLive = false;
    earned = Math.max(0, earned | 0);
    addStars(earned, true); // bonus stars count toward lifetime (may chain unlocks)
    var host = el("game-host");
    host.innerHTML = '<div class="intro"><div class="ic">' + (earned > 0 ? "🌟" : "🙂") + '</div><h3>' +
      (earned > 0 ? "赢得 +" + earned + " ⭐！" : "再接再厉！") +
      '</h3><p>' + (earned > 0 ? "干得漂亮！这些星星已存入你的账户。" : "没关系，多练习几题再回来挑战。") +
      '</p><button class="btn primary" id="g-home">回到主页</button></div>';
    if (earned > 0) burst(50);
    el("g-home").onclick = goHome;
  }

  /* ---------- shared helpers for games ---------- */
  function fmtTime(s) { return s + "s"; }
  function pickMany(arr, n) { return shuffle(arr).slice(0, n); }
  // Game timers are tracked so they can be stopped when the player quits a
  // game mid-play (otherwise an interval keeps firing on removed DOM nodes).
  var gameIntervals = [];
  var gameLive = false; // true only while a game is actively being played
  function gInterval(fn, ms) { var id = setInterval(fn, ms); gameIntervals.push(id); return id; }
  function clearGameTimers() {
    for (var i = 0; i < gameIntervals.length; i++) clearInterval(gameIntervals[i]);
    gameIntervals = []; gameLive = false;
  }

  // small pools derived from the bank for matching/scramble games
  function pairPool() {
    // [display, meaning] pairs across subjects
    var pairs = [];
    SUBJECTS.chinese.questions.forEach(function (q) {
      if (q.options && q.topic.indexOf("成语") < 0 && q.options[q.answer]) {
        // skip; chinese MCQ not ideal as pairs
      }
    });
    // hand-curated bilingual concept pairs (always correct, exam-relevant)
    return [
      ["虚怀若谷", "形容十分谦虚"], ["授人以渔", "教方法比给结果更重要"],
      ["雪中送炭", "在别人困难时给予帮助"], ["画蛇添足", "多此一举，反而坏事"],
      ["守株待兔", "死守经验，不知变通"], ["亡羊补牢", "出问题后及时补救"],
      ["abundant", "plentiful 丰富的"], ["reluctant", "unwilling 不情愿的"],
      ["fragile", "easily broken 易碎的"], ["sprinter", "a fast runner 短跑选手"],
      ["rajin", "diligent 勤劳"], ["gembira", "happy 高兴"],
      ["½ of 60", "30"], ["15% of 200", "30"], ["7 × 8", "56"], ["144 ÷ 12", "12"]
    ];
  }
  function scramblePool(level) {
    var easy = [
      ["apple", "a fruit 苹果"], ["water", "you drink it 水"], ["happy", "feeling glad 高兴的"],
      ["buku", "book 书 (Malay)"], ["meja", "table 桌子 (Malay)"]
    ];
    var hard = [
      ["diligent", "hardworking 勤奋的"], ["orchestra", "a band of musicians 管弦乐团"],
      ["determination", "strong will 决心"], ["prasekolah", "pre-school 学前 (Malay)"],
      ["bertepuk", "to clap 拍 (Malay)"]
    ];
    return level <= 2 ? easy : easy.concat(hard);
  }

  /* =========== GAME 1: ⚡ Speed Math Sprint =========== */
  var gameSpeed = {
    name: "口算闪电 Speed Math", icon: "⚡",
    blurb: "在限定时间内尽量多做心算题。",
    howto: "30 秒内连续作答心算题，从四个选项中点选正确答案。答对越多，星星越多 ⭐！",
    start: function (host, level, done) {
      var time = 30, score = 0, max = 6 + level;
      host.innerHTML = '<div class="gamehud"><span class="timer">⏱ <span id="t">30</span>s</span>' +
        '<span class="sc">✔ <span id="s">0</span></span></div>' +
        '<div class="game-q" id="q"></div><div class="game-opts" id="o"></div>';
      function newQ() {
        if (!gameLive) return;
        var a, b, op, ans, text;
        var r = Math.random();
        if (level >= 3 && r < 0.35) { // percentage
          var base = [200, 50, 80, 120, 40][(Math.random() * 5) | 0];
          var p = [10, 15, 20, 25, 50][(Math.random() * 5) | 0];
          ans = base * p / 100; text = p + "% × " + base;
        } else if (r < 0.6) {
          a = 2 + ((Math.random() * (3 + level * 2)) | 0); b = 2 + ((Math.random() * 9) | 0);
          ans = a * b; text = a + " × " + b;
        } else if (r < 0.8) {
          b = 2 + ((Math.random() * 9) | 0); ans = 2 + ((Math.random() * (9 + level)) | 0); a = ans * b;
          text = a + " ÷ " + b;
        } else {
          a = 10 + ((Math.random() * (40 + level * 10)) | 0); b = 5 + ((Math.random() * 40) | 0);
          ans = a + b; text = a + " + " + b;
        }
        el("q").textContent = text + " = ?";
        var opts = [ans];
        while (opts.length < 4) { var d = ans + (((Math.random() * 9) | 0) - 4) + (Math.random() < .5 ? 0 : 1); if (d !== ans && opts.indexOf(d) < 0 && d >= 0) opts.push(d); }
        opts = shuffle(opts);
        var o = el("o"); o.innerHTML = "";
        opts.forEach(function (v) {
          var b2 = document.createElement("button"); b2.textContent = v;
          b2.onclick = function () {
            if (v === ans) { score++; el("s").textContent = score; b2.classList.add("good"); }
            else { b2.classList.add("bad"); }
            setTimeout(newQ, 120);
          };
          o.appendChild(b2);
        });
      }
      newQ();
      var iv = gInterval(function () {
        time--; el("t").textContent = time;
        if (time <= 0) { clearInterval(iv); done(score); }
      }, 1000);
    }
  };

  /* =========== GAME 2: 🧩 Memory Match =========== */
  var gameMemory = {
    name: "记忆配对 Memory Match", icon: "🧩",
    blurb: "翻牌找出配对的词语与意思。",
    howto: "翻开卡片，把「词语 / 单词」和它的「意思」配成一对。用越少步数完成，星星越多 ⭐！",
    start: function (host, level, done) {
      var nPairs = Math.min(4 + level, 8);
      var chosen = pickMany(pairPool(), nPairs);
      var cards = [];
      chosen.forEach(function (p, i) {
        cards.push({ g: i, t: p[0] }); cards.push({ g: i, t: p[1] });
      });
      cards = shuffle(cards);
      var cols = nPairs <= 5 ? 3 : 4;
      host.innerHTML = '<div class="gamehud"><span>🧩 配对</span><span class="sc">步数 <span id="mv">0</span></span></div>' +
        '<div class="mem-grid" id="grid" style="grid-template-columns:repeat(' + cols + ',1fr)"></div>';
      var grid = el("grid"), first = null, lock = false, moves = 0, matched = 0;
      cards.forEach(function (c, idx) {
        var d = document.createElement("div"); d.className = "mem-card";
        d.innerHTML = '<span class="face">' + c.t + "</span>";
        d.onclick = function () {
          if (lock || d.classList.contains("up") || d.classList.contains("done")) return;
          d.classList.add("up");
          if (!first) { first = { d: d, c: c }; return; }
          moves++; el("mv").textContent = moves; lock = true;
          if (first.c.g === c.g && first.d !== d) {
            first.d.classList.add("done"); d.classList.add("done");
            first.d.classList.remove("up"); d.classList.remove("up");
            matched++; first = null; lock = false; burst(8);
            if (matched === nPairs) {
              var perfect = nPairs; // ideal moves
              var stars = Math.round(nPairs * 1.5 - (moves - perfect));
              setTimeout(function () { done(Math.max(Math.ceil(nPairs / 2), stars)); }, 400);
            }
          } else {
            setTimeout(function () {
              first.d.classList.remove("up"); d.classList.remove("up");
              first = null; lock = false;
            }, 750);
          }
        };
        grid.appendChild(d);
      });
    }
  };

  /* =========== GAME 3: 🌠 Star Catcher =========== */
  var gameCatch = {
    name: "流星接星 Star Catcher", icon: "🌠",
    blurb: "点击带有正确答案的流星，躲开错误的。",
    howto: "题目显示在上方，点击落下的、写着正确答案的流星 ⭐。点对加分，点错扣分。30 秒挑战！",
    start: function (host, level, done) {
      var time = 30, score = 0;
      host.innerHTML = '<div class="gamehud"><span class="timer">⏱ <span id="t">30</span>s</span>' +
        '<span class="sc">⭐ <span id="s">0</span></span></div>' +
        '<div class="game-q" id="q" style="font-size:20px;margin:6px 0"></div>' +
        '<div class="catch-field" id="field"></div>';
      var field = el("field");
      var cur = null;
      function setQ() {
        var a = 2 + ((Math.random() * (4 + level * 2)) | 0), b = 2 + ((Math.random() * 9) | 0);
        cur = { text: a + " × " + b, ans: a * b };
        el("q").textContent = "正确答案：" + cur.text + " = ?";
      }
      setQ();
      var colors = ["#ffd23f", "#ff9d3d", "#4f8cff", "#34c77b"];
      function drop() {
        if (!gameLive || time <= 0) return;
        var good = Math.random() < 0.5;
        var val = good ? cur.ans : cur.ans + (Math.random() < .5 ? -1 : 1) * (1 + ((Math.random() * 6) | 0));
        if (!good && val === cur.ans) val += 2;
        var s = document.createElement("div"); s.className = "fstar";
        s.textContent = val;
        s.style.background = "radial-gradient(circle at 35% 30%, #fff7, " + colors[(Math.random() * colors.length) | 0] + ")";
        var w = field.clientWidth - 64;
        s.style.left = ((Math.random() * w) | 0) + "px";
        var dur = 2600 - level * 150 + (Math.random() * 600 - 300);
        s.style.transition = "top " + dur + "ms linear";
        field.appendChild(s);
        requestAnimationFrame(function () { s.style.top = (field.clientHeight - 10) + "px"; });
        var killed = false;
        s.onclick = function () {
          if (killed) return; killed = true;
          if (val === cur.ans) { score++; el("s").textContent = score; burst(6); setQ(); }
          else { score = Math.max(0, score - 1); el("s").textContent = score; }
          s.remove();
        };
        setTimeout(function () { if (!killed) s.remove(); }, dur + 50);
      }
      var di = gInterval(drop, 750 - level * 30);
      var ti = gInterval(function () {
        time--; el("t").textContent = time;
        if (time <= 0) { clearInterval(ti); clearInterval(di); field.innerHTML = ""; done(score); }
      }, 1000);
    }
  };

  /* =========== GAME 4: 🔤 Word Scramble =========== */
  var gameScramble = {
    name: "字母拼拼乐 Word Scramble", icon: "🔤",
    blurb: "把打乱的字母重新排成正确的单词。",
    howto: "看提示，把打乱的字母按顺序点选，拼出正确的英文 / 马来文单词。每拼对一个得 ⭐！",
    start: function (host, level, done) {
      var rounds = 3 + Math.min(level, 4), idx = 0, score = 0;
      var words = pickMany(scramblePool(level), rounds);
      host.innerHTML = '<div class="gamehud"><span>🔤 <span id="rd">1</span>/' + rounds + '</span>' +
        '<span class="sc">⭐ <span id="s">0</span></span></div>' +
        '<div class="scr-wrap"><div class="scr-hint" id="hint"></div>' +
        '<div class="scr-slots" id="answer"></div>' +
        '<div class="scr-slots" id="pool"></div>' +
        '<button class="btn ghost" id="reset" style="margin-top:8px;max-width:240px;margin-left:auto;margin-right:auto">重排 Reset</button></div>';
      function load() {
        if (!gameLive) return;
        var w = words[idx][0], hint = words[idx][1];
        el("rd").textContent = idx + 1;
        el("hint").textContent = "提示：" + hint;
        var ans = el("answer"); ans.innerHTML = "";
        var pool = el("pool"); pool.innerHTML = "";
        var letters = shuffle(w.split(""));
        if (letters.join("") === w) letters = shuffle(letters); // avoid already-solved
        var built = [];
        function refresh() {
          ans.innerHTML = "";
          built.forEach(function (ch) {
            var t = document.createElement("div"); t.className = "scr-tile placed"; t.textContent = ch; ans.appendChild(t);
          });
          if (built.join("") === w) {
            score++; el("s").textContent = score; burst(10);
            idx++;
            setTimeout(function () { idx < rounds ? load() : done(score); }, 500);
          }
        }
        letters.forEach(function (ch) {
          var t = document.createElement("div"); t.className = "scr-tile"; t.textContent = ch;
          t.onclick = function () {
            if (t.style.visibility === "hidden") return;
            t.style.visibility = "hidden"; built.push(ch); refresh();
          };
          pool.appendChild(t);
        });
        el("reset").onclick = function () {
          built = [];
          var tiles = pool.querySelectorAll(".scr-tile");
          for (var i = 0; i < tiles.length; i++) tiles[i].style.visibility = "visible";
          ans.innerHTML = "";
        };
      }
      load();
    }
  };

  /* =========== GAME 5: 🔢 Sequence Sprint =========== */
  var gameSequence = {
    name: "数列规律 Sequence", icon: "🔢",
    blurb: "找出数列的规律，选出问号处的数。",
    howto: "观察数列的规律（等差、等比、平方、递增差或斐波那契……），从四个选项中选出「？」处正确的数。30 秒内答对越多越好 ⭐！",
    start: function (host, level, done) {
      var time = 30, score = 0;
      host.innerHTML = '<div class="gamehud"><span class="timer">⏱ <span id="t">30</span>s</span>' +
        '<span class="sc">✔ <span id="s">0</span></span></div>' +
        '<div class="game-q" id="q" style="font-size:21px"></div><div class="game-opts" id="o"></div>';
      function genSeq() {
        var type = (Math.random() * (level >= 3 ? 5 : 3)) | 0;
        var seq = [], i, cur, d;
        if (type === 0) {                       // arithmetic
          var start = 1 + ((Math.random() * 9) | 0); d = 2 + ((Math.random() * (3 + level)) | 0);
          for (i = 0; i < 5; i++) seq.push(start + d * i);
        } else if (type === 1) {                // geometric ×2 / ×3
          var s0 = 1 + ((Math.random() * 4) | 0), r = 2 + ((Math.random() * 2) | 0);
          for (i = 0; i < 5; i++) seq.push(s0 * Math.pow(r, i));
        } else if (type === 2) {                // increasing differences
          cur = 1 + ((Math.random() * 5) | 0); d = 1 + ((Math.random() * 3) | 0);
          seq.push(cur); for (i = 1; i < 5; i++) { cur += d; d++; seq.push(cur); }
        } else if (type === 3) {                // perfect squares
          var b = 1 + ((Math.random() * 4) | 0);
          for (i = 0; i < 5; i++) seq.push((i + b) * (i + b));
        } else {                                 // fibonacci-like
          seq.push(1 + ((Math.random() * 3) | 0)); seq.push(1 + ((Math.random() * 3) | 0));
          for (i = 2; i < 5; i++) seq.push(seq[i - 1] + seq[i - 2]);
        }
        var ans = seq[4]; seq[4] = "?";
        return { text: seq.join(",  "), ans: ans };
      }
      function newQ() {
        if (!gameLive) return;
        var Q = genSeq();
        el("q").textContent = Q.text;
        var opts = [Q.ans], guard = 0;
        while (opts.length < 4 && guard++ < 60) {
          var d = Q.ans + (((Math.random() * 9) | 0) - 4) + (Math.random() < .5 ? 0 : (1 + ((Math.random() * 3) | 0)));
          if (d !== Q.ans && opts.indexOf(d) < 0 && d > 0) opts.push(d);
        }
        while (opts.length < 4) opts.push(Q.ans + opts.length * 2);
        opts = shuffle(opts);
        var o = el("o"); o.innerHTML = "";
        opts.forEach(function (v) {
          var b2 = document.createElement("button"); b2.textContent = v;
          b2.onclick = function () {
            if (v === Q.ans) { score++; el("s").textContent = score; b2.classList.add("good"); }
            else b2.classList.add("bad");
            setTimeout(newQ, 150);
          };
          o.appendChild(b2);
        });
      }
      newQ();
      var iv = gInterval(function () { time--; el("t").textContent = time; if (time <= 0) { clearInterval(iv); done(score); } }, 1000);
    }
  };

  /* =========== GAME 6: 📚 Meaning Match =========== */
  function meaningPool() {
    return [
      ["守株待兔", "死守经验、不知变通"], ["画蛇添足", "多此一举，反而坏事"],
      ["雪中送炭", "在别人困难时及时帮助"], ["亡羊补牢", "出问题后及时补救"],
      ["虚怀若谷", "非常谦虚"], ["全力以赴", "用尽全部力量去做"],
      ["一丝不苟", "认真细致，毫不马虎"], ["掉以轻心", "太轻视、不当回事"],
      ["abundant", "plentiful 丰富的"], ["reluctant", "unwilling 不情愿的"],
      ["fragile", "easily broken 易碎的"], ["generous", "willing to give 慷慨的"],
      ["ancient", "very old 古老的"], ["rapid", "very fast 快速的"],
      ["rajin", "diligent 勤劳的 (Malay)"], ["gembira", "happy 高兴的 (Malay)"],
      ["berani", "brave 勇敢的 (Malay)"], ["pandai", "clever 聪明的 (Malay)"]
    ];
  }
  var gameMeaning = {
    name: "词义大挑战 Meaning Match", icon: "📚",
    blurb: "看词语 / 单词，快速选出正确的意思。",
    howto: "屏幕上方会显示一个成语或单词（华文 / English / Malay），从四个意思中点选正确的一个。30 秒内答对越多 ⭐！",
    start: function (host, level, done) {
      var time = 30, score = 0, pool = meaningPool();
      host.innerHTML = '<div class="gamehud"><span class="timer">⏱ <span id="t">30</span>s</span>' +
        '<span class="sc">✔ <span id="s">0</span></span></div>' +
        '<div class="game-q" id="q"></div><div class="game-opts" id="o" style="grid-template-columns:1fr"></div>';
      function newQ() {
        if (!gameLive) return;
        var pick = pool[(Math.random() * pool.length) | 0];
        var wrongs = shuffle(pool.filter(function (p) { return p[1] !== pick[1]; })).slice(0, 3)
          .map(function (p) { return p[1]; });
        var opts = shuffle([pick[1]].concat(wrongs));
        el("q").textContent = pick[0];
        var o = el("o"); o.innerHTML = "";
        opts.forEach(function (v) {
          var b2 = document.createElement("button"); b2.textContent = v; b2.style.fontSize = "15px";
          b2.onclick = function () {
            if (v === pick[1]) { score++; el("s").textContent = score; b2.classList.add("good"); }
            else b2.classList.add("bad");
            setTimeout(newQ, 170);
          };
          o.appendChild(b2);
        });
      }
      newQ();
      var iv = gInterval(function () { time--; el("t").textContent = time; if (time <= 0) { clearInterval(iv); done(score); } }, 1000);
    }
  };

  /* =========== GAME 7: ⚡ True / False Blitz =========== */
  function tfPool() {
    // [statement, isTrue] — each cross-checked; languages kept subject-correct
    return [
      ["「画蛇添足」的意思是多此一举，反而把事情弄坏。", true],
      ["端午节的传统习俗之一是吃汤圆。", false],
      ["7 × 8 = 56。", true],
      ["一个三角形的内角和是 360 度。", false],
      ["《红楼梦》的作者是曹雪芹。", true],
      ["「孔子」是法家的代表人物。", false],
      ["「亡羊补牢」比喻事情发生前就做好万全准备。", false],
      ["质数 7 只能被 1 和它本身整除。", true],
      ["12 的因数包括 1、2、3、4、6 和 12。", true],
      ["平行四边形的对边互相平行。", true],
      ["½ + ¼ 等于 ¾。", true],
      ["1 公里等于 100 米。", false],
      ["'Abundant' means scarce or very rare.", false],
      ["The plural of the word 'child' is 'children'.", true],
      ["'Once in a blue moon' means something happens very often.", false],
      ["A square has four sides of equal length.", true],
      ["'Rajin' dalam bahasa Melayu bermaksud malas.", false],
      ["Lawan kata bagi perkataan 'tinggi' ialah 'rendah'.", true],
      ["'Pandai' bermaksud bijak dalam bahasa Melayu.", true],
      ["Penjodoh bilangan bagi 'kerbau' ialah 'biji'.", false]
    ];
  }
  var gameTrueFalse = {
    name: "是非急转弯 True/False Blitz", icon: "⚡",
    blurb: "快速判断句子的对与错，考验知识与反应。",
    howto: "屏幕会闪出一句陈述（华文 / 数学 / English / Malay），判断它是「✔ 对」还是「✘ 错」。30 秒内答对越多 ⭐！答错会扣分哦。",
    start: function (host, level, done) {
      var time = 30, score = 0, pool = shuffle(tfPool()), idx = 0, cur = null;
      host.innerHTML = '<div class="gamehud"><span class="timer">⏱ <span id="t">30</span>s</span>' +
        '<span class="sc">⭐ <span id="s">0</span></span></div>' +
        '<div class="game-q tf-q" id="q"></div>' +
        '<div class="tf-btns"><button class="btn good-btn" id="tf-yes">✔ 对 True</button>' +
        '<button class="btn bad-btn" id="tf-no">✘ 错 False</button></div>';
      function newQ() {
        if (!gameLive) return;
        cur = pool[idx % pool.length]; idx++;
        el("q").textContent = cur[0];
      }
      function answer(val) {
        if (!gameLive || !cur) return;
        if (val === cur[1]) { score++; el("s").textContent = score; burst(6); }
        else { score = Math.max(0, score - 1); el("s").textContent = score; }
        cur = null; setTimeout(newQ, 120);
      }
      el("tf-yes").onclick = function () { answer(true); };
      el("tf-no").onclick = function () { answer(false); };
      newQ();
      var iv = gInterval(function () { time--; el("t").textContent = time; if (time <= 0) { clearInterval(iv); done(score); } }, 1000);
    }
  };

  /* =========== GAME 8: 🀄 Idiom Chain (成语接龙) =========== */
  function idiomPool() {
    // {a: 给出的成语, link: 末字, b: 正确接龙(以末字开头), wrongs:[不以该字开头的成语]}
    return [
      { a:"一心一意", link:"意", b:"意气风发", wrongs:["三心二意","全力以赴","名列前茅"] },
      { a:"千变万化", link:"化", b:"化险为夷", wrongs:["变本加厉","万事如意","一帆风顺"] },
      { a:"名落孙山", link:"山", b:"山清水秀", wrongs:["落叶归根","水落石出","名正言顺"] },
      { a:"画蛇添足", link:"足", b:"足智多谋", wrongs:["添油加醋","守株待兔","画龙点睛"] },
      { a:"自强不息", link:"息", b:"息息相关", wrongs:["强词夺理","不耻下问","力争上游"] },
      { a:"入木三分", link:"分", b:"分秒必争", wrongs:["木已成舟","三言两语","入乡随俗"] },
      { a:"锦上添花", link:"花", b:"花言巧语", wrongs:["添砖加瓦","上行下效","锦绣前程"] },
      { a:"后来居上", link:"上", b:"上行下效", wrongs:["来日方长","居安思危","后顾之忧"] }
    ];
  }
  var gameIdiom = {
    name: "成语接龙 Idiom Chain", icon: "🀄",
    blurb: "用上一个成语的末字，接出下一个成语。",
    howto: "屏幕显示一个成语，末字会标红。从四个选项中，选出「以这个红字开头」的成语来接龙。30 秒内接对越多 ⭐！",
    start: function (host, level, done) {
      var time = 30, score = 0, pool = shuffle(idiomPool()), idx = 0;
      host.innerHTML = '<div class="gamehud"><span class="timer">⏱ <span id="t">30</span>s</span>' +
        '<span class="sc">✔ <span id="s">0</span></span></div>' +
        '<div class="game-q" id="q" style="font-size:20px"></div>' +
        '<div class="idiom-link" id="lk"></div>' +
        '<div class="game-opts" id="o" style="grid-template-columns:1fr"></div>';
      function newQ() {
        if (!gameLive) return;
        var it = pool[idx % pool.length]; idx++;
        el("q").innerHTML = '上一个成语：' + it.a.slice(0, -1) +
          '<span class="lk-char">' + it.link + '</span>';
        el("lk").innerHTML = '请接出以「<b>' + it.link + '</b>」开头的成语：';
        var opts = shuffle([it.b].concat(it.wrongs));
        var o = el("o"); o.innerHTML = "";
        opts.forEach(function (v) {
          var b2 = document.createElement("button"); b2.textContent = v; b2.style.fontSize = "16px";
          b2.onclick = function () {
            if (v === it.b) { score++; el("s").textContent = score; b2.classList.add("good"); }
            else b2.classList.add("bad");
            setTimeout(newQ, 200);
          };
          o.appendChild(b2);
        });
      }
      newQ();
      var iv = gInterval(function () { time--; el("t").textContent = time; if (time <= 0) { clearInterval(iv); done(score); } }, 1000);
    }
  };

  /* =========== GAME 9: 🎯 24-Point Sprint (二十四点) =========== */
  function pointsPool(level) {
    // {nums:[四个数], ok:"正确算式(=24)", wrongs:[三个≠24的算式]}  — all verified by computation.
    var easy = [
      { nums:[1,2,3,4], ok:"1 × 2 × 3 × 4", wrongs:["1 + 2 + 3 + 4","(1 + 2) × 3 + 4","1 × 2 + 3 × 4"] },
      { nums:[4,4,4,4], ok:"4 × 4 + 4 + 4", wrongs:["4 × 4 + 4 × 4","4 × 4 − 4 − 4","4 + 4 + 4 + 4"] },
      { nums:[3,3,4,4], ok:"3 × 4 + 3 × 4", wrongs:["3 + 3 + 4 + 4","3 × 3 + 4 + 4","(3 + 4) × 3 + 4"] },
      { nums:[2,2,3,3], ok:"(3 + 3) × 2 × 2", wrongs:["2 × 2 × 3 × 3","2 + 2 + 3 + 3","3 × 3 × 2 + 2"] },
      { nums:[2,2,6,6], ok:"6 × 2 + 6 × 2", wrongs:["6 + 6 + 2 + 2","6 × 6 − 2 − 2","6 × 2 × 2 − 6"] }
    ];
    var hard = [
      { nums:[2,3,4,6], ok:"6 × 4 × (3 − 2)", wrongs:["6 + 4 × 3 + 2","6 × 4 − 3 × 2","(6 + 2) × 3 − 4"] },
      { nums:[2,4,6,8], ok:"(2 + 6) × 4 − 8", wrongs:["2 + 4 + 6 + 8","8 × 2 + 6 − 4","8 × 6 ÷ 4 + 2"] },
      { nums:[5,5,5,5], ok:"5 × 5 − 5 ÷ 5", wrongs:["5 + 5 + 5 + 5","5 × 5 − 5 − 5","5 × 5 ÷ 5 + 5"] },
      { nums:[1,3,4,6], ok:"6 ÷ (1 − 3 ÷ 4)", wrongs:["6 × 4 − 3 − 1","6 + 4 × 3 + 1","(6 + 1) × 4 − 3"] },
      { nums:[1,2,4,6], ok:"6 × 4 ÷ (2 − 1)", wrongs:["6 + 4 + 2 + 1","6 × 4 − 2 × 1","(6 + 2) × 4 ÷ 1"] }
    ];
    return level <= 2 ? easy : easy.concat(hard);
  }
  var gameTwentyFour = {
    name: "二十四点 24-Point", icon: "🎯",
    blurb: "用四个数字凑出 24 点，挑选正确的算式。",
    howto: "屏幕给出四个数字（每个用一次）。从四个算式中，选出「结果正好等于 24」的那一个。30 秒内答对越多 ⭐！这是最考验心算的一关哦。",
    start: function (host, level, done) {
      var time = 30, score = 0, pool = shuffle(pointsPool(level)), idx = 0;
      host.innerHTML = '<div class="gamehud"><span class="timer">⏱ <span id="t">30</span>s</span>' +
        '<span class="sc">✔ <span id="s">0</span></span></div>' +
        '<div class="pt-nums" id="nums"></div>' +
        '<div class="idiom-link" id="lk">选出结果「正好 = 24」的算式：</div>' +
        '<div class="game-opts" id="o" style="grid-template-columns:1fr"></div>';
      function newQ() {
        if (!gameLive) return;
        var it = pool[idx % pool.length]; idx++;
        el("nums").innerHTML = it.nums.map(function (n) { return '<span class="pt-chip">' + n + '</span>'; }).join("");
        var opts = shuffle([it.ok].concat(it.wrongs));
        var o = el("o"); o.innerHTML = "";
        opts.forEach(function (v) {
          var b2 = document.createElement("button"); b2.textContent = v; b2.style.fontSize = "16px";
          b2.onclick = function () {
            if (v === it.ok) { score++; el("s").textContent = score; b2.classList.add("good"); }
            else b2.classList.add("bad");
            setTimeout(newQ, 220);
          };
          o.appendChild(b2);
        });
      }
      newQ();
      var iv = gInterval(function () { time--; el("t").textContent = time; if (time <= 0) { clearInterval(iv); done(score); } }, 1000);
    }
  };

  var GAMES = [gameSpeed, gameMemory, gameCatch, gameScramble, gameSequence, gameMeaning, gameTrueFalse, gameIdiom, gameTwentyFour];

  /* =================================================================
     STAR SHOP — a sink for stars. Buying spends the current balance
     (state.stars) but never touches lifetime/level. Themes restyle the
     app; avatars change the home badge.
  ================================================================= */
  var THEMES = [
    { id: "default", name: "经典红 Classic", emoji: "❤️", cost: 0, vars: { brand: "#e23d3d", b1: "#0f1226", b2: "#141938", b3: "#1a1330" } },
    { id: "ocean", name: "海洋蓝 Ocean", emoji: "🌊", cost: 80, vars: { brand: "#1f8bd6", b1: "#081a2c", b2: "#0c2438", b3: "#0a1f30" } },
    { id: "forest", name: "森林绿 Forest", emoji: "🌳", cost: 80, vars: { brand: "#2e9e5b", b1: "#0c1f16", b2: "#102a1d", b3: "#0e2418" } },
    { id: "sunset", name: "日落橙 Sunset", emoji: "🌅", cost: 140, vars: { brand: "#ff7a3d", b1: "#241023", b2: "#2e1326", b3: "#1f1020" } },
    { id: "grape", name: "葡萄紫 Grape", emoji: "🍇", cost: 200, vars: { brand: "#8b5cf6", b1: "#160f2b", b2: "#1d1438", b3: "#160f2b" } },
    { id: "sakura", name: "樱花粉 Sakura", emoji: "🌸", cost: 280, vars: { brand: "#ff5d8f", b1: "#241020", b2: "#301428", b3: "#1f0f1c" } }
  ];
  var AVATARS = [
    { e: "📚", name: "书本", cost: 0 }, { e: "🦊", name: "小狐狸", cost: 40 },
    { e: "🐼", name: "熊猫", cost: 40 }, { e: "🚀", name: "火箭", cost: 60 },
    { e: "🦉", name: "猫头鹰", cost: 60 }, { e: "🐯", name: "小虎", cost: 100 },
    { e: "🦁", name: "狮子", cost: 150 }, { e: "🐲", name: "神龙", cost: 240 }
  ];
  function themeById(id) { for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i]; return THEMES[0]; }
  function applyTheme(id) {
    var v = themeById(id).vars, root = document.documentElement.style;
    root.setProperty("--brand", v.brand);
    document.body.style.background = "linear-gradient(160deg," + v.b1 + "," + v.b2 + " 60%," + v.b3 + ")";
  }
  function openShop() { renderShop(); show("screen-shop"); }
  function renderShop() {
    el("shop-bal").textContent = state.stars;
    function statusBtn(active, owned, cost) {
      return active ? '<button class="si-btn on">使用中 ✓</button>'
        : owned ? '<button class="si-btn use">使用</button>'
        : '<button class="si-btn buy">⭐ ' + cost + '</button>';
    }
    var tg = el("shop-themes"); tg.innerHTML = "";
    THEMES.forEach(function (t) {
      var owned = !!state.owned[t.id], active = state.theme === t.id;
      var card = document.createElement("div");
      card.className = "shop-item" + (active ? " active" : "");
      card.innerHTML = '<div class="si-em" style="background:' + t.vars.brand + '33;border-color:' + t.vars.brand + '">' +
        t.emoji + '</div><div class="si-nm">' + t.name + '</div>' + statusBtn(active, owned, t.cost);
      card.querySelector(".si-btn").onclick = function () {
        if (active) return;
        if (owned) { state.theme = t.id; }
        else if (state.stars >= t.cost) { state.stars -= t.cost; state.owned[t.id] = true; state.theme = t.id; burst(18); }
        else { toast("⭐ 不够啦！再去练习赚星星吧。"); return; }
        applyTheme(state.theme); save(); renderShop();
      };
      tg.appendChild(card);
    });
    var ag = el("shop-avatars"); ag.innerHTML = "";
    AVATARS.forEach(function (a) {
      var owned = !!state.ownedAvatars[a.e], active = state.avatar === a.e;
      var card = document.createElement("div");
      card.className = "shop-item" + (active ? " active" : "");
      card.innerHTML = '<div class="si-em">' + a.e + '</div><div class="si-nm">' + a.name + '</div>' +
        statusBtn(active, owned, a.cost);
      card.querySelector(".si-btn").onclick = function () {
        if (active) return;
        if (owned) { state.avatar = a.e; }
        else if (state.stars >= a.cost) { state.stars -= a.cost; state.ownedAvatars[a.e] = true; state.avatar = a.e; burst(18); }
        else { toast("⭐ 不够啦！再去练习赚星星吧。"); return; }
        save(); renderShop();
      };
      ag.appendChild(card);
    });
  }

  /* ---------- confetti ---------- */
  function burst(n) {
    n = n || 18;
    var box = el("confetti");
    var colors = ["#ffd23f", "#e23d3d", "#34c77b", "#2e7d32", "#1565c0", "#ff6a3d"];
    for (var i = 0; i < n; i++) {
      var c = document.createElement("div"); c.className = "cf";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[(Math.random() * colors.length) | 0];
      c.style.animationDuration = 1.2 + Math.random() * 1.3 + "s";
      c.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      box.appendChild(c);
      (function (node) { setTimeout(function () { node.remove(); }, 2600); })(c);
    }
  }

  /* ---------- wiring ---------- */
  var homeBtns = document.querySelectorAll("[data-home]");
  for (var i = 0; i < homeBtns.length; i++) homeBtns[i].onclick = goHome;
  var modeBtns = document.querySelectorAll(".mode-card");
  for (var j = 0; j < modeBtns.length; j++) (function (b) { b.onclick = function () { startMode(b.dataset.mode); }; })(modeBtns[j]);
  el("quit-quiz").onclick = function () { if (confirm("退出本次练习？进度已保存。")) goHome(); };
  el("quit-game").onclick = function () { if (confirm("退出小游戏？")) goHome(); };
  el("open-shop").onclick = openShop;
  el("mock-cancel").onclick = function () { el("modal-mock").classList.remove("show"); };
  el("reading-cancel").onclick = function () { el("modal-reading").classList.remove("show"); };
  el("reset-progress").onclick = function () {
    if (confirm("确定要重置所有星星与成绩吗？\n（练习进度、连胜、每日打卡与里程碑都会清零；已购买的主题和头像会保留。）\n此操作无法撤销。")) {
      resetProgress();
    }
  };

  applyTheme(state.theme);
  renderHome();

  // Test seam (no effect in normal use): when loaded with ?test=1, expose the
  // game registry & launcher so the jsdom smoke test can exercise every game.
  try {
    if (window.location && window.location.search.indexOf("test=1") >= 0) {
      window.__chq = { GAMES: GAMES, launchGame: launchGame, startMockExam: startMockExam };
    }
  } catch (e) {}
})();
