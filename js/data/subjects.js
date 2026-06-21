/* Subjects for the Chong Hwa Independent High School entrance exam (入学试).
 * Each subject carries its own display language so questions & explanations
 * are shown in the linguistically correct medium:
 *   华文  -> Chinese (zh)
 *   数学  -> Chinese medium (the school teaches Math in Chinese)
 *   英文  -> English (en)
 *   国文  -> Malay  (ms)
 * `color`/`stripe` drive the card theme. `lang` sets the text direction/font hints.
 */
window.SUBJECTS = [
  {
    id: "chinese",
    name: "华文",
    latin: "Bahasa Cina · Chinese",
    emoji: "📖",
    lang: "zh",
    color: "#c8102e",
    blurb: "字词、阅读理解、语法与作文基础。",
  },
  {
    id: "math",
    name: "数学",
    latin: "Matematik · Mathematics",
    emoji: "🔢",
    lang: "zh",
    color: "#2563eb",
    blurb: "数与计算、几何、应用题与逻辑思维。",
  },
  {
    id: "english",
    name: "English",
    latin: "英文 · Bahasa Inggeris",
    emoji: "🔤",
    lang: "en",
    color: "#1faa59",
    blurb: "Grammar, vocabulary and reading comprehension.",
  },
  {
    id: "malay",
    name: "Bahasa Melayu",
    latin: "国文 · Malay",
    emoji: "🌺",
    lang: "ms",
    color: "#f59e0b",
    blurb: "Tatabahasa, kosa kata dan pemahaman.",
  },
];

/* Level thresholds — XP needed cumulatively to reach each level. */
window.LEVELS = [
  { lvl: 1, xp: 0,   title: "新苗 Seedling" },
  { lvl: 2, xp: 50,  title: "学童 Learner" },
  { lvl: 3, xp: 120, title: "好学 Diligent" },
  { lvl: 4, xp: 220, title: "进步 Riser" },
  { lvl: 5, xp: 350, title: "高材 Scholar" },
  { lvl: 6, xp: 520, title: "栋梁 Achiever" },
  { lvl: 7, xp: 750, title: "状元 Top Scholar" },
];

window.BADGES = [
  { id: "first_quiz",  emoji: "🎯", name: "首战 First Quiz",  test: (s) => s.totalAnswered >= 1 },
  { id: "ten_correct", emoji: "✅", name: "十全 10 Correct", test: (s) => s.totalCorrect >= 10 },
  { id: "streak3",     emoji: "🔥", name: "连胜 3-Streak",   test: (s) => s.bestStreak >= 3 },
  { id: "streak7",     emoji: "⚡", name: "神勇 7-Streak",   test: (s) => s.bestStreak >= 7 },
  { id: "perfect",     emoji: "🏆", name: "满分 Perfect",    test: (s) => s.perfectQuizzes >= 1 },
  { id: "polyglot",    emoji: "🌏", name: "全科 All Subjects", test: (s) => Object.keys(s.subjectsTried||{}).length >= 4 },
  { id: "century",     emoji: "💯", name: "百题 100 Q",      test: (s) => s.totalAnswered >= 100 },
  { id: "scholar",     emoji: "🎓", name: "状元 Top Lv",     test: (s) => s.level >= 7 },
];
