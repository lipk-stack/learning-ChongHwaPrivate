/* Question bank for the Chong Hwa entrance-exam trainer.
 * Every question carries a DETAILED explanation written in the subject's own
 * language. Schema:
 *   { id, subject, topic, difficulty, passage?, q, options[], answer(index), explain }
 *
 * Iteration 1 seed set — authored to match the style/level of the Primary-6
 * 入学试 past papers. Real items extracted from the official PDF are layered in
 * over subsequent iterations (see PROGRESS.md).
 */
window.QUESTIONS = [

  /* ================= 华文 Chinese (zh) ================= */
  {
    id: "zh-1", subject: "chinese", topic: "成语 · 词义", difficulty: "易",
    q: "下列哪一个成语用来形容“做事专心、毫不分心”？",
    options: ["三心二意", "全神贯注", "心不在焉", "东张西望"],
    answer: 1,
    explain: "“全神贯注”指把全部精神都集中在一件事上，形容非常专心。\n• 三心二意：犹豫不定，不专一（反义）。\n• 心不在焉：心思不在这里，注意力不集中（反义）。\n• 东张西望：向四处张望，形容心神不定。\n因此答案是 **全神贯注**。"
  },
  {
    id: "zh-2", subject: "chinese", topic: "近义词", difficulty: "易",
    q: "“立刻”一词的近义词是：",
    options: ["渐渐", "马上", "偶尔", "始终"],
    answer: 1,
    explain: "“立刻”表示时间很短、马上就做。\n• 马上：同样表示“很快、立即”，是最贴切的近义词。\n• 渐渐：慢慢地（相反）。\n• 偶尔：有时候。\n• 始终：自始至终。\n所以正确答案是 **马上**。"
  },
  {
    id: "zh-3", subject: "chinese", topic: "量词", difficulty: "中",
    q: "选出正确的量词：一（ ）清泉。",
    options: ["条", "股", "片", "把"],
    answer: 1,
    explain: "细而长的水流用量词“**股**”，如“一股清泉”“一股暖流”。\n• “条”多用于河流、绳子（一条河）。\n• “片”用于平而薄或成片的东西（一片树叶）。\n• “把”用于有柄的工具（一把伞）。\n这里形容泉水细细流动，应用 **股**。"
  },
  {
    id: "zh-4", subject: "chinese", topic: "病句辨析", difficulty: "中",
    q: "下列哪一句没有语病？",
    options: [
      "为了避免类似事故不再发生，学校加强了安全教育。",
      "他大约用了十分钟左右就完成了作业。",
      "通过这次活动，使我明白了团结的重要。",
      "我们要养成爱护公物的好习惯。"
    ],
    answer: 3,
    explain: "逐句分析：\n① “避免……不再发生”双重否定，意思说反了，应删去“不”。\n② “大约”与“左右”重复，删去其一。\n③ “通过……使……”句子缺主语，应删去“通过”或“使”。\n④ “我们要养成爱护公物的好习惯”结构完整、搭配正确。\n故选 **第四句**。"
  },
  {
    id: "zh-5", subject: "chinese", topic: "阅读理解", difficulty: "中",
    passage: "小华每天放学后都会先帮妈妈做家务，再温习功课。虽然功课很多，但他从不抱怨，总是把当天的内容复习好才睡觉。老师常常称赞他自律。",
    q: "根据短文，老师称赞小华的原因是：",
    options: ["功课很少", "他很会做家务", "他做事自律，懂得自我管理", "他很早睡觉"],
    answer: 2,
    explain: "短文最后一句说“老师常常称赞他自律”。“自律”指能管好自己、自觉完成该做的事。文中小华主动做家务、坚持复习，正体现了自我管理的态度。\n• 选项A、D只是细节，不是被称赞的根本原因；\n• 选项B只是其中一件事。\n因此答案是 **他做事自律，懂得自我管理**。"
  },
  {
    id: "zh-6", subject: "chinese", topic: "标点符号", difficulty: "易",
    q: "下列句子的标点使用正确的是：",
    options: [
      "你今天怎么这么高兴。",
      "妈妈问我：“作业做完了吗？”",
      "他喜欢苹果、香蕉、和橙子。",
      "多么美丽的风景啊。"
    ],
    answer: 1,
    explain: "① 是疑问句，句末应用问号“？”。\n② 引用别人的话用冒号加引号，问句用问号，**正确**。\n③ 并列词语之间用顿号即可，“、和”重复，应删去顿号或“和”。\n④ 是感叹句，句末应用感叹号“！”。\n所以正确的是 **第二句**。"
  },

  /* ================= 数学 Math (zh medium) ================= */
  {
    id: "ma-1", subject: "math", topic: "四则运算", difficulty: "易",
    q: "计算：125 × 8 = ？",
    options: ["1000", "900", "1025", "1080"],
    answer: 0,
    explain: "125 × 8 是一个常用的速算组合。\n125 × 8 = 125 × 8 = 1000（因为 125 = 1000 ÷ 8）。\n记住这个搭配能帮你快速心算。答案是 **1000**。"
  },
  {
    id: "ma-2", subject: "math", topic: "分数", difficulty: "中",
    q: "计算：3/4 + 1/6 = ？",
    options: ["4/10", "11/12", "1/2", "5/6"],
    answer: 1,
    explain: "异分母相加要先通分。\n4 和 6 的最小公倍数是 12。\n3/4 = 9/12，1/6 = 2/12。\n9/12 + 2/12 = 11/12（已是最简）。\n所以答案是 **11/12**。"
  },
  {
    id: "ma-3", subject: "math", topic: "百分比", difficulty: "中",
    q: "一件衣服原价 80 令吉，打八折出售。现价是多少？",
    options: ["RM64", "RM72", "RM16", "RM60"],
    answer: 0,
    explain: "“打八折”表示按原价的 80% 出售。\n现价 = 80 × 80% = 80 × 0.8 = 64。\n（也可理解为减去 20%：80 × 20% = 16，80 − 16 = 64。）\n所以现价是 **RM64**。"
  },
  {
    id: "ma-4", subject: "math", topic: "应用题 · 速度", difficulty: "中",
    q: "一辆汽车以每小时 60 公里的速度行驶，行驶 150 公里需要多少时间？",
    options: ["2 小时", "2.5 小时", "3 小时", "1.5 小时"],
    answer: 1,
    explain: "时间 = 路程 ÷ 速度。\n时间 = 150 ÷ 60 = 2.5（小时）。\n2.5 小时也就是 2 小时 30 分钟。\n所以答案是 **2.5 小时**。"
  },
  {
    id: "ma-5", subject: "math", topic: "几何 · 周长", difficulty: "易",
    q: "一个长方形的长是 9 厘米，宽是 5 厘米，它的周长是多少？",
    options: ["14 厘米", "45 厘米", "28 厘米", "23 厘米"],
    answer: 2,
    explain: "长方形周长 =（长 + 宽）× 2。\n=（9 + 5）× 2 = 14 × 2 = 28（厘米）。\n注意：若求“面积”才是 9 × 5 = 45 平方厘米，别混淆。\n周长答案是 **28 厘米**。"
  },
  {
    id: "ma-6", subject: "math", topic: "平均数", difficulty: "中",
    q: "小明四次考试的分数是 80、85、90 和 85，他的平均分是多少？",
    options: ["85", "84", "86", "80"],
    answer: 0,
    explain: "平均数 = 总和 ÷ 个数。\n总和 = 80 + 85 + 90 + 85 = 340。\n平均分 = 340 ÷ 4 = 85。\n所以答案是 **85**。"
  },
  {
    id: "ma-7", subject: "math", topic: "规律", difficulty: "难",
    q: "找规律，填出下一个数：2, 6, 12, 20, 30, ___",
    options: ["36", "40", "42", "44"],
    answer: 2,
    explain: "观察相邻两数的差：6−2=4，12−6=6，20−12=8，30−20=10。\n差依次是 4、6、8、10，每次增加 2，下一个差是 12。\n所以下一个数 = 30 + 12 = 42。\n（另一种看法：这些数是 1×2, 2×3, 3×4, 4×5, 5×6, **6×7=42**。）"
  },

  /* ================= English (en) ================= */
  {
    id: "en-1", subject: "english", topic: "Grammar · Tenses", difficulty: "Easy",
    q: "Choose the correct word: She ____ to school every day.",
    options: ["go", "goes", "going", "gone"],
    answer: 1,
    explain: "With a singular third-person subject (he / she / it) in the present simple tense, the verb takes an **-s/-es** ending.\n• “She goes” is correct.\n• “go” would be used with I / you / we / they.\n• “going” needs a helping verb (is going).\n• “gone” is the past participle (has gone).\nSo the answer is **goes**."
  },
  {
    id: "en-2", subject: "english", topic: "Vocabulary", difficulty: "Easy",
    q: "Choose the word closest in meaning to “happy”.",
    options: ["angry", "joyful", "tired", "afraid"],
    answer: 1,
    explain: "“Happy” means feeling pleasure or gladness. **Joyful** carries the same positive feeling, so it is the closest synonym.\n• angry, tired and afraid all describe different, mostly negative feelings.\nThe answer is **joyful**."
  },
  {
    id: "en-3", subject: "english", topic: "Prepositions", difficulty: "Medium",
    q: "Fill in the blank: The cat is hiding ____ the table.",
    options: ["on", "under", "of", "at"],
    answer: 1,
    explain: "We need a preposition showing the cat is below the table. **Under** means ‘below / beneath’.\n• “on” means on top of the surface.\n• “of” shows belonging, not position.\n• “at” points to a general spot, not below.\nSo the correct preposition is **under**."
  },
  {
    id: "en-4", subject: "english", topic: "Articles", difficulty: "Medium",
    q: "Choose the correct article: I saw ____ elephant at the zoo.",
    options: ["a", "an", "the", "no article"],
    answer: 1,
    explain: "Use **“an”** before a word that begins with a vowel SOUND. “Elephant” starts with the vowel sound /e/, so it takes **an**.\n• “a” is used before consonant sounds (a dog, a unit).\nHere the answer is **an** elephant."
  },
  {
    id: "en-5", subject: "english", topic: "Reading Comprehension", difficulty: "Medium",
    passage: "Ali woke up early on Saturday. He packed his bag with a water bottle, a towel and his goggles. Then he rode his bicycle to the swimming pool to meet his coach.",
    q: "Where was Ali going?",
    options: ["To school", "To the swimming pool", "To the market", "To his friend's house"],
    answer: 1,
    explain: "The passage says Ali packed his **goggles** and a towel, then rode “to the swimming pool to meet his coach.” These clues all point to swimming.\nThe correct answer is **to the swimming pool**."
  },
  {
    id: "en-6", subject: "english", topic: "Plurals", difficulty: "Easy",
    q: "What is the plural form of “child”?",
    options: ["childs", "childes", "children", "childrens"],
    answer: 2,
    explain: "“Child” is an irregular noun. Its plural is **children** (not formed by adding -s).\n• “childs” / “childes” are wrong forms.\n• “childrens” is a double plural and incorrect.\nThe answer is **children**."
  },

  /* ================= Bahasa Melayu (ms) ================= */
  {
    id: "ms-1", subject: "malay", topic: "Kata Nama", difficulty: "Mudah",
    q: "Pilih kata nama yang betul: Burung itu terbang ke ____ .",
    options: ["pokok", "berlari", "cantik", "tidur"],
    answer: 0,
    explain: "Kata nama ialah perkataan yang merujuk benda, tempat, orang atau haiwan. **“Pokok”** ialah kata nama (sejenis benda/tempat).\n• “berlari” dan “tidur” ialah kata kerja.\n• “cantik” ialah kata adjektif.\nJadi jawapannya ialah **pokok**."
  },
  {
    id: "ms-2", subject: "malay", topic: "Kata Kerja", difficulty: "Mudah",
    q: "Pilih kata kerja dalam ayat: “Adik makan nasi di dapur.”",
    options: ["Adik", "makan", "nasi", "dapur"],
    answer: 1,
    explain: "Kata kerja menunjukkan perbuatan. Dalam ayat ini, perbuatan yang dilakukan ialah **“makan”**.\n• “Adik” ialah kata nama (pelaku).\n• “nasi” ialah kata nama (benda).\n• “dapur” ialah kata nama (tempat).\nJadi kata kerjanya ialah **makan**."
  },
  {
    id: "ms-3", subject: "malay", topic: "Antonim", difficulty: "Sederhana",
    q: "Apakah lawan (antonim) bagi perkataan “rajin”?",
    options: ["pandai", "malas", "baik", "cepat"],
    answer: 1,
    explain: "Antonim ialah perkataan yang berlawanan makna. Lawan bagi **“rajin”** ialah **“malas”**.\n• “pandai”, “baik” dan “cepat” bukan lawan kepada rajin.\nJadi jawapannya ialah **malas**."
  },
  {
    id: "ms-4", subject: "malay", topic: "Imbuhan", difficulty: "Sederhana",
    q: "Lengkapkan: Pelajar itu sedang ____ buku di perpustakaan.",
    options: ["baca", "membaca", "dibaca", "bacaan"],
    answer: 1,
    explain: "Selepas kata bantu “sedang”, kita perlukan kata kerja aktif. Imbuhan **meN-** membentuk kata kerja aktif: baca → **membaca**.\n• “baca” (kata dasar) kurang sesuai selepas “sedang”.\n• “dibaca” ialah bentuk pasif.\n• “bacaan” ialah kata nama.\nJawapan yang betul ialah **membaca**."
  },
  {
    id: "ms-5", subject: "malay", topic: "Pemahaman", difficulty: "Sederhana",
    passage: "Setiap pagi, Aminah membantu ibunya menyiram pokok bunga di halaman rumah. Dia juga memberi makan kepada ayam peliharaannya sebelum pergi ke sekolah.",
    q: "Apakah yang dilakukan oleh Aminah sebelum ke sekolah?",
    options: [
      "Membaca buku cerita",
      "Menyiram pokok dan memberi makan ayam",
      "Bermain dengan rakan",
      "Menonton televisyen"
    ],
    answer: 1,
    explain: "Menurut petikan, Aminah **menyiram pokok bunga** dan **memberi makan kepada ayam** sebelum pergi ke sekolah.\nPilihan lain tidak disebut dalam petikan.\nJadi jawapannya ialah **menyiram pokok dan memberi makan ayam**."
  },
  {
    id: "ms-6", subject: "malay", topic: "Simpulan Bahasa", difficulty: "Sukar",
    q: "Maksud simpulan bahasa “ringan tulang” ialah:",
    options: ["lemah badan", "rajin bekerja", "suka tidur", "cepat marah"],
    answer: 1,
    explain: "Simpulan bahasa **“ringan tulang”** bermaksud rajin dan suka membantu, sentiasa sanggup melakukan kerja.\n• Ia bukan bermaksud lemah badan.\nMaksud yang betul ialah **rajin bekerja**."
  },

];

/* Helper: group counts per subject — used by the home screen. */
window.questionsBySubject = function (id) {
  return window.QUESTIONS.filter((q) => q.subject === id);
};
