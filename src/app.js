(function () {
  "use strict";
  /* ===================================================================
     Chong Hwa Junior-1 Entrance Exam · Star Quest
     Iteration 2 — adds the STAR economy and milestone mini-games.
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
          return obj;
        })
      };
    });
    window.QUESTION_BANK = o;
  }
  var BANK = window.QUESTION_BANK;
  var SUBJECTS = BANK.subjects;
  var LETTERS = ["A", "B", "C", "D", "E"];
  var STORE_KEY = "chonghwa_starquest_v2";

  /* ---------- star economy tuning ---------- */
  var STAR_RIGHT = 2;        // base stars for a correct answer (stars are earned, not handed out)
  var STAR_WRONG = -4;       // stars deducted for a wrong answer (balance never < 0)
  function streakBonus(s) { return Math.min(Math.floor(s / 3), 3); } // +1 per 3-in-a-row, max +3
  function milestoneAt(k) { return 70 * k + 20 * k * k; } // 90,220,390,600,850,...

  var state = load();
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && s.seen) return s;
    } catch (e) {}
    return {
      stars: 0, lifetime: 0, offered: 0,
      streak: 0, bestStreak: 0,
      seen: {}, wrong: {}, totalAns: 0, totalCorrect: 0
    };
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }

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
    if (countLifetime && n > 0) state.lifetime += n;
    save();
  }
  // how many milestones the lifetime total has crossed
  function reachedCount() {
    var k = 0;
    while (state.lifetime >= milestoneAt(k + 1)) k++;
    return k;
  }
  var snoozeReached = -1; // suppress re-offering after "later" until more stars earned

  /* ---------- HOME ---------- */
  function renderHome() {
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
  function startQuiz(questions, label) {
    if (!questions.length) { alert("暂无可练习的题目。"); return; }
    quiz = { qs: questions.slice(0, 15), i: 0, correct: 0, label: label, stars: 0 };
    show("screen-quiz"); renderQuestion();
  }
  function renderQuestion() {
    var q = quiz.qs[quiz.i];
    var subj = SUBJECTS[q._subj];
    el("q-total").textContent = quiz.qs.length;
    el("q-index").textContent = quiz.i + 1;
    el("q-stars").textContent = quiz.stars;
    el("qprogress-fill").style.width = (quiz.i / quiz.qs.length) * 100 + "%";
    var sc = el("q-subject"); sc.textContent = subj.icon + " " + subj.name; sc.style.background = subj.color;
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
      state.streak = 0; state.wrong[q.id] = true;
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
    el("result-again").onclick = function () { startQuiz(shuffle(quiz.qs), quiz.label); };
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
      startQuiz(shuffle(qs), "错题重练");
    }
  }

  /* =================================================================
     MILESTONE MINI-GAMES
     Each milestone unlocks a DIFFERENT game (cycled) at rising
     difficulty so the student can earn bonus stars. Interface:
       game.start(host, level, onDone)  ->  onDone(starsEarned)
  ================================================================= */
  function goHome() { show("screen-home"); renderHome(); }

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
      game.start(host, level, function (earned) { finishGame(game, earned); });
    };
  }
  function finishGame(game, earned) {
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
      var iv = setInterval(function () {
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
        if (time <= 0) return;
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
      var di = setInterval(drop, 750 - level * 30);
      var ti = setInterval(function () {
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
        '<div class="scr-hint" id="hint"></div>' +
        '<div class="scr-slots" id="answer"></div>' +
        '<div class="scr-slots" id="pool"></div>' +
        '<button class="btn ghost" id="reset" style="margin-top:8px">重排 Reset</button>';
      function load() {
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

  var GAMES = [gameSpeed, gameMemory, gameCatch, gameScramble];

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

  renderHome();
})();
