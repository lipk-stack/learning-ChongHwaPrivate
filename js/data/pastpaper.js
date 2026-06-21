/* AUTHENTIC past-paper questions extracted from the official
 * 《2026小六历届试题（修订版)》 — 吉隆坡中华独立中学 初一新生考试 (entrance exam).
 * Source file: source-material/exam_extracted.txt (decrypted with the school password).
 * Answers verified against the official answer key (pages 128–138 of the PDF).
 *
 * Math items were short-answer in the original paper; here they are presented as
 * multiple-choice (the original numeric answer is the key, distractors added) so
 * they fit the trainer — every explanation still teaches the full working.
 *
 * Each item is tagged { source: "2026真题", year: 2026 } and merged into the main
 * bank by app.js.
 */
window.PASTPAPER = [

  /* ---------- 华文 Chinese 2026 ---------- */
  {
    id: "pp-zh-1", subject: "chinese", topic: "选词填空 · 2026真题", difficulty: "中", source: "2026真题", year: 2026,
    q: "取得好成绩时，我们应当保持“________怀若谷”的态度，继续努力，不可骄傲自满。",
    options: ["须", "许", "虚", "绪"],
    answer: 2,
    explain: "成语是“**虚怀若谷**”，意思是胸怀像山谷一样深广，形容十分谦虚。\n• “须”指必须；“许”指允许；“绪”指头绪、情绪。\n根据“不可骄傲自满”的语境，应填表示谦虚的“虚”。正确答案是 **虚**。"
  },
  {
    id: "pp-zh-2", subject: "chinese", topic: "选词填空 · 2026真题", difficulty: "中", source: "2026真题", year: 2026,
    q: "当他看见多年未见的母亲在站台上等候，他不由得“________泪下”，紧紧抱住了母亲。",
    options: ["安然", "昂首", "盎然", "潸然"],
    answer: 3,
    explain: "成语“**潸（shān）然泪下**”形容流泪的样子，多指因感动而流泪，最符合“紧紧抱住母亲”的情景。\n• “安然”指平安；“昂首”指抬头；“盎然”形容气氛、兴趣浓厚（春意盎然）。\n所以答案是 **潸然**。"
  },
  {
    id: "pp-zh-3", subject: "chinese", topic: "成语运用 · 2026真题", difficulty: "中", source: "2026真题", year: 2026,
    q: "下列哪项成语在句子中使用不恰当？",
    options: [
      "看到同伴遇到困难，小丽总是挺身而出，乐于助人。",
      "这本书的故事情节扣人心弦，让人一读就停不下来。",
      "在这个项目中，大家各执己见，提出建设性的意见。",
      "经过不断努力，她的画技已经达到出神入化的境界。"
    ],
    answer: 2,
    explain: "“**各执己见**”指各人坚持自己的意见、互不相让，含有“难以合作、谈不拢”的意味，与句中“提出建设性意见”所要表达的“合作、共识”相矛盾，使用不恰当。\n• 挺身而出、扣人心弦、出神入化在各自句中都用得贴切。\n所以答案是第三句。"
  },
  {
    id: "pp-zh-4", subject: "chinese", topic: "成语反义 · 2026真题", difficulty: "难", source: "2026真题", year: 2026,
    q: "“他明知前路充满风险，却依然毫不犹豫地站出来承担责任，展现出奋不顾身的精神。”下列哪项和画线成语“奋不顾身”意思相反？",
    options: ["畏首畏尾", "义无反顾", "勇往直前", "节节败退"],
    answer: 0,
    explain: "“奋不顾身”指奋勇向前、不顾个人安危，是勇敢的表现。要找**意思相反**的成语。\n• **畏首畏尾**：又怕前又怕后，形容胆小怕事、顾虑重重，正好相反。✔\n• 义无反顾、勇往直前都和“奋不顾身”意思相近。\n• 节节败退指接连失败，与“勇敢”无直接反义关系。\n所以答案是 **畏首畏尾**。"
  },
  {
    id: "pp-zh-5", subject: "chinese", topic: "关联词 · 2026真题", difficulty: "中", source: "2026真题", year: 2026,
    q: "“________在学习上遇到困难，________在生活中受到打击，他都表现得很乐观。”最适合填入的是：",
    options: ["如果……就", "尽管……仍然", "无论……还是", "虽然……但是"],
    answer: 2,
    explain: "句子列举了“学习上遇到困难”和“生活中受到打击”两种情况，无论哪种他都乐观，表示**任何情况下结果都一样**，应用表示无条件的关联词“**无论……还是……都**”。\n• “如果……就”表假设；“尽管/虽然……但是”表转折，只针对一种情况，搭配不当。\n所以答案是 **无论……还是**。"
  },
  {
    id: "pp-zh-6", subject: "chinese", topic: "文化常识 · 2026真题", difficulty: "易", source: "2026真题", year: 2026,
    q: "下列哪项不是端午节的传统习俗？",
    options: ["吃汤圆", "赛龙舟", "吃粽子", "佩香囊"],
    answer: 0,
    explain: "端午节（农历五月初五）的传统习俗有赛龙舟、吃粽子、佩香囊、挂艾草等。\n“**吃汤圆**”是元宵节和冬至的习俗，不是端午节的习俗。\n所以答案是 **吃汤圆**。"
  },
  {
    id: "pp-zh-7", subject: "chinese", topic: "文学常识 · 2026真题", difficulty: "易", source: "2026真题", year: 2026,
    q: "下列哪部小说是曹雪芹的代表作？",
    options: ["《西游记》", "《红楼梦》", "《水浒传》", "《三国演义》"],
    answer: 1,
    explain: "中国古典四大名著及其作者：\n• 《红楼梦》——曹雪芹 ✔\n• 《西游记》——吴承恩\n• 《水浒传》——施耐庵\n• 《三国演义》——罗贯中\n所以曹雪芹的代表作是 **《红楼梦》**。"
  },
  {
    id: "pp-zh-8", subject: "chinese", topic: "现代文阅读 · 林海音《迟到》", difficulty: "中", source: "2026真题", year: 2026,
    passage: "（节选）有一天下大雨，我赖在床上不肯起来上学。爸爸气极了，把我从床上拖起来，用鸡毛掸子打我，我哭号着、躲避着，最后像一只狼狈的小狗，被抱上了三轮车去上学。后来，爸爸又赶到学校，把花夹袄送来给我穿上，还拿出两个铜板给我。从那以后，我每天都是最早到校、等校工开大铁门的学生。",
    q: "根据选文，下列哪个成语最适合形容“爸把我从床上打到床尾”时作者的状态？",
    options: ["手忙脚乱", "精疲力竭", "忐忑不安", "狼狈不堪"],
    answer: 3,
    explain: "文中作者被父亲追打、哭号躲避，最后“像一只狼狈的小狗”被抱上车，形象十分窘迫难堪。“**狼狈不堪**”正是形容处境困窘、十分难堪的样子。（此题官方答案为 D）\n• 手忙脚乱重在慌乱；精疲力竭重在体力耗尽；忐忑不安重在心里不安，都不如“狼狈不堪”贴切。"
  },
  {
    id: "pp-zh-9", subject: "chinese", topic: "现代文阅读 · 林海音《迟到》", difficulty: "中", source: "2026真题", year: 2026,
    passage: "（承上题）从那以后，“我”每天早晨都站在学校门口，等待校工开大铁门，成了到校最早的学生。",
    q: "“从那以后，我每天早晨都是站在学校门口，等待校工开大铁门的学生。”这句话表示作者养成了什么习惯？",
    options: ["爱劳动的习惯", "守时（不迟到）的习惯", "早睡早起的习惯", "爱读书的习惯"],
    answer: 1,
    explain: "从前作者爱赖床迟到，经历父亲的严厉管教后彻底改变，变成每天最早到校的学生。这说明她养成了“**守时、不迟到**”的好习惯。（此题官方答案为“守时”）\n这也呼应了全文的主题——父亲严中有爱的管教，使作者懂得自律守时。"
  },

  /* ---------- 数学 Math 2026 (answers verified against key) ---------- */
  {
    id: "pp-ma-1", subject: "math", topic: "百分比 · 2026真题", difficulty: "中", source: "2026真题", year: 2026,
    q: "计算 150 的 53% 与 30 的 15% 的差。",
    options: ["75", "84", "79.5", "70"],
    answer: 0,
    explain: "先分别算出两个百分数：\n• 150 的 53% = 150 × 0.53 = 79.5\n• 30 的 15% = 30 × 0.15 = 4.5\n两者的差 = 79.5 − 4.5 = **75**。（官方答案：75）"
  },
  {
    id: "pp-ma-2", subject: "math", topic: "几何 · 面积 · 2026真题", difficulty: "中", source: "2026真题", year: 2026,
    q: "一个长方形的长是 9 cm，宽是 6 cm，它的面积等于一个高为 12 cm 的三角形的面积。求这个三角形的底。",
    options: ["9 cm", "4.5 cm", "18 cm", "12 cm"],
    answer: 0,
    explain: "第一步，长方形面积 = 长 × 宽 = 9 × 6 = 54（平方厘米）。\n第二步，三角形面积 =（底 × 高）÷ 2，且等于 54：\n（底 × 12）÷ 2 = 54 → 底 × 12 = 108 → 底 = 108 ÷ 12 = **9 cm**。（官方答案：9 cm）"
  },
  {
    id: "pp-ma-3", subject: "math", topic: "比例 · 2026真题", difficulty: "中", source: "2026真题", year: 2026,
    q: "一个铁片和一个铜片的重量之比为 15 : 8。若铁片重 1.2 公斤，求铜片的重量。",
    options: ["640 克", "800 克", "450 克", "2250 克"],
    answer: 0,
    explain: "比例中铁片占 15 份，重 1.2 公斤，所以每一份 = 1.2 ÷ 15 = 0.08 公斤。\n铜片占 8 份 = 0.08 × 8 = 0.64 公斤 = **640 克**。（官方答案：640 克）\n小贴士：1 公斤 = 1000 克，0.64 × 1000 = 640。"
  },
  {
    id: "pp-ma-4", subject: "math", topic: "平均数 · 2026真题", difficulty: "中", source: "2026真题", year: 2026,
    q: "已知 5 个数字的平均是 6。若其中四个数字分别为 7、3.5、4.2、6.4，求第五个数字。",
    options: ["8.9", "5.1", "9.9", "7"],
    answer: 0,
    explain: "由“平均 = 总和 ÷ 个数”可得总和 = 平均 × 个数 = 6 × 5 = 30。\n已知四个数之和 = 7 + 3.5 + 4.2 + 6.4 = 21.1。\n第五个数 = 总和 − 这四个数 = 30 − 21.1 = **8.9**。（官方答案：8.9）"
  },
  {
    id: "pp-ma-5", subject: "math", topic: "盈亏问题 · 2026真题", difficulty: "难", source: "2026真题", year: 2026,
    q: "布商卖一匹布，若卖 RM 520 则亏 20%。若他想赚 20%，应该卖多少钱？",
    options: ["RM 780", "RM 624", "RM 650", "RM 728"],
    answer: 0,
    explain: "先求成本（进价）。亏 20% 表示卖价是成本的 80%：\n成本 = 520 ÷ 80% = 520 ÷ 0.8 = RM 650。\n要赚 20%，卖价 = 成本 × (1 + 20%) = 650 × 1.2 = **RM 780**。（官方答案：RM 780）"
  },
  {
    id: "pp-ma-6", subject: "math", topic: "速度 · 2026真题", difficulty: "中", source: "2026真题", year: 2026,
    q: "以凡驾车花了 3 小时 30 分钟，行驶了相距 301 公里的两座城市。求他的平均速度（每小时多少公里）？",
    options: ["86 公里", "75 公里", "90 公里", "100 公里"],
    answer: 0,
    explain: "先把时间化成小时：3 小时 30 分钟 = 3.5 小时（30 分钟 = 0.5 小时）。\n速度 = 路程 ÷ 时间 = 301 ÷ 3.5 = **86 公里/小时**。（官方答案：86 公里）"
  },
  {
    id: "pp-ma-7", subject: "math", topic: "分数应用题 · 2026真题", difficulty: "难", source: "2026真题", year: 2026,
    q: "小萱有压岁钱 RM 160。她用 1/4 买了一本漫画书，再用剩余钱的 2/5 买了一套水彩颜料。问她还剩多少钱？",
    options: ["RM 72", "RM 48", "RM 96", "RM 80"],
    answer: 0,
    explain: "第一步，买漫画书花了 160 × 1/4 = RM 40，剩下 160 − 40 = RM 120。\n第二步，买颜料花了剩余的 2/5：120 × 2/5 = RM 48。\n第三步，最后剩下 120 − 48 = **RM 72**。（官方答案：RM 72）\n注意：第二个分数是“剩余钱”的 2/5，不是原来 160 的 2/5。"
  },
  {
    id: "pp-ma-8", subject: "math", topic: "连续奇数 · 2026真题", difficulty: "中", source: "2026真题", year: 2026,
    q: "某三个连续奇数的和是 63。求这三个数里最小的奇数。",
    options: ["19", "20", "21", "17"],
    answer: 0,
    explain: "三个连续奇数大小相邻、各差 2，中间那个数 = 总和 ÷ 3 = 63 ÷ 3 = 21。\n所以三个数是 19、21、23，最小的是 **19**。（官方答案：19）\n验算：19 + 21 + 23 = 63 ✔"
  },
  {
    id: "pp-ma-9", subject: "math", topic: "鸽笼原理 · 2026真题", difficulty: "难", source: "2026真题", year: 2026,
    q: "罐子里有红球 4 粒、白球 5 粒、黑球 6 粒。在黑暗中至少要取出多少粒球，才能保证其中有 4 粒同色？",
    options: ["10", "4", "13", "16"],
    answer: 0,
    explain: "用“最坏情况”来思考：要尽量避免出现 4 粒同色，每种颜色最多先取 3 粒。\n最坏情况：红 3 + 白 3 + 黑 3 = 9 粒，此时还没有任何一种颜色达到 4 粒。\n只要再取 1 粒，无论什么颜色，都必然使某色凑满 4 粒。\n所以至少要取 9 + 1 = **10 粒**。（官方答案：10）"
  },
  {
    id: "pp-ma-10", subject: "math", topic: "单位换算 · 2026真题", difficulty: "易", source: "2026真题", year: 2026,
    q: "把 1 桶 2 公升的油平均装进 8 个瓶子，每个瓶子可装多少毫升的油？",
    options: ["250 毫升", "16 毫升", "400 毫升", "2.5 毫升"],
    answer: 0,
    explain: "先换算：1 公升 = 1000 毫升，所以 2 公升 = 2000 毫升。\n平均分进 8 个瓶子：2000 ÷ 8 = **250 毫升**。（官方答案：250 毫升）"
  },

  /* ---------- English 2026 (answers verified against key) ---------- */
  {
    id: "pp-en-1", subject: "english", topic: "Vocabulary · 2026 Paper", difficulty: "Medium", source: "2026真题", year: 2026,
    q: "She leaned over to ____ a secret to her best friend, making sure nobody else in the room heard.",
    options: ["murmur", "whisper", "stammer", "exclaim"],
    answer: 1,
    explain: "To tell a secret so others cannot hear, you **whisper** (speak very softly). (Official key: B)\n• murmur = to speak in a low, unclear voice (not specifically secret).\n• stammer = to speak with nervous pauses.\n• exclaim = to cry out loudly — the opposite of keeping a secret.\nThe answer is **whisper**."
  },
  {
    id: "pp-en-2", subject: "english", topic: "Vocabulary · 2026 Paper", difficulty: "Medium", source: "2026真题", year: 2026,
    q: "The ____ on the ground floor of the sports complex is large and busy with students waiting for their games.",
    options: ["foyer", "cloakroom", "pantry", "nursery room"],
    answer: 0,
    explain: "A **foyer** is a large entrance hall or waiting area in a public building — exactly where students would gather and wait. (Official key: A)\n• cloakroom = a place to leave coats/bags.\n• pantry = a small room for storing food.\n• nursery room = a room for babies/young children.\nThe answer is **foyer**."
  },
  {
    id: "pp-en-3", subject: "english", topic: "Vocabulary · 2026 Paper", difficulty: "Medium", source: "2026真题", year: 2026,
    q: "The grand concert hall was filled with excitement as the conductor gracefully led the talented ____ through a masterpiece.",
    options: ["choral", "orchestra", "celebrity", "accordion"],
    answer: 1,
    explain: "A conductor leads an **orchestra** — a large group of musicians playing together. (Official key: B)\n• choral is an adjective (relating to a choir), not a group noun.\n• celebrity = a famous person.\n• accordion = a single musical instrument.\nThe answer is **orchestra**."
  },
  {
    id: "pp-en-4", subject: "english", topic: "Vocabulary · 2026 Paper", difficulty: "Medium", source: "2026真题", year: 2026,
    q: "The ____ skilfully prepared my cappuccino with latte art while chatting cheerfully with customers at the busy café.",
    options: ["receptionist", "entrepreneur", "director", "barista"],
    answer: 3,
    explain: "A **barista** is a person who makes and serves coffee in a café — the only job linked to cappuccino and latte art. (Official key: D)\n• receptionist greets visitors; entrepreneur starts businesses; director manages an organisation.\nThe answer is **barista**."
  },
  {
    id: "pp-en-5", subject: "english", topic: "Grammar · Tenses · 2026 Paper", difficulty: "Medium", source: "2026真题", year: 2026,
    q: "He ____ his favourite cartoon on television when the electricity went off and the entire house became silent.",
    options: ["watch", "watched", "have watched", "was watching"],
    answer: 3,
    explain: "One action (watching) was already in progress when a second, shorter action (the electricity going off) interrupted it. The longer background action takes the **past continuous**: *was watching*. (Official key: D)\nStructure: was/were + verb-ing. The answer is **was watching**."
  },
  {
    id: "pp-en-6", subject: "english", topic: "Grammar · Pronouns · 2026 Paper", difficulty: "Medium", source: "2026真题", year: 2026,
    q: "The coach congratulated the players on ____ victory and reminded them to take care of ____ after the tough match.",
    options: ["their, them", "they, their", "theirs, their", "their, themselves"],
    answer: 3,
    explain: "First blank needs the possessive adjective **their** (their victory). Second blank: the players take care of *themselves* — when the subject and object are the same people, use the **reflexive pronoun** *themselves*. (Official key: D)\nThe answer is **their, themselves**."
  },
  {
    id: "pp-en-7", subject: "english", topic: "Grammar · Question Tags · 2026 Paper", difficulty: "Medium", source: "2026真题", year: 2026,
    q: "She always reads her favourite mystery novels late at night under the dim lamp in her room, ____?",
    options: ["haven't they", "does she", "doesn't she", "did she"],
    answer: 2,
    explain: "A question tag reverses the main clause. The statement is **positive** and in the **present simple** with the subject *she*, so the tag must be **negative present simple**: *doesn't she*. (Official key: C)\nRule: positive statement → negative tag; match the tense and subject. The answer is **doesn't she**."
  },
  {
    id: "pp-en-8", subject: "english", topic: "Grammar · Relative Pronouns · 2026 Paper", difficulty: "Medium", source: "2026真题", year: 2026,
    q: "The scientist ____ discovered the new plant explained it to the children in the school garden.",
    options: ["who", "which", "whom", "whose"],
    answer: 0,
    explain: "We need a relative pronoun for a **person** acting as the **subject** of the verb *discovered*. That is **who**. (Official key: A)\n• which is for things/animals.\n• whom is for a person as the object.\n• whose shows possession.\nThe answer is **who**."
  },

  /* ---------- Bahasa Melayu 2026 (answers verified against key) ---------- */
  {
    id: "pp-ms-1", subject: "malay", topic: "Kata Ganti Nama · Kertas 2026", difficulty: "Sederhana", source: "2026真题", year: 2026,
    q: "Tuan Haji Azlan akan merasmikan pameran itu. ____ merupakan tokoh yang banyak terlibat dalam kerja-kerja amal.",
    options: ["Dia", "Anda", "Beliau", "Kamu"],
    answer: 2,
    explain: "Untuk merujuk orang yang **dihormati** (seperti Tuan Haji, tokoh, pemimpin), kita guna kata ganti nama **“Beliau”**. (Kunci rasmi: C)\n• “Dia” untuk orang biasa; “Anda/Kamu” untuk orang yang dilawan bercakap.\nJawapannya ialah **Beliau**."
  },
  {
    id: "pp-ms-2", subject: "malay", topic: "Penjodoh Bilangan · Kertas 2026", difficulty: "Sederhana", source: "2026真题", year: 2026,
    q: "Pak Manan mempunyai dua ____ tanah yang ditanam dengan pokok getah.",
    options: ["buah", "batang", "bidang", "rawan"],
    answer: 2,
    explain: "Penjodoh bilangan bagi **tanah / kawasan / sawah** ialah **“bidang”** — sebidang tanah, dua bidang tanah. (Kunci rasmi: C)\n• “buah” untuk benda besar (rumah, kereta); “batang” untuk benda panjang (pokok, pen).\nJawapannya ialah **bidang**."
  },
  {
    id: "pp-ms-3", subject: "malay", topic: "Kata Sendi · Kertas 2026", difficulty: "Sederhana", source: "2026真题", year: 2026,
    q: "Komunikasi ____ Internet merupakan cara perhubungan yang terkini antara individu yang berada di tempat yang jauh.",
    options: ["dilalui", "berlalu", "laluan", "melalui"],
    answer: 3,
    explain: "Untuk menyatakan sesuatu dilakukan **menggunakan perantaraan** (Internet), kita guna **“melalui”** (= menggunakan / dengan perantaraan). (Kunci rasmi: D)\n• “dilalui” bentuk pasif; “berlalu” bermaksud pergi; “laluan” ialah kata nama.\nJawapannya ialah **melalui**."
  },
  {
    id: "pp-ms-4", subject: "malay", topic: "Kata Kerja · Kertas 2026", difficulty: "Sederhana", source: "2026真题", year: 2026,
    q: "Ibu ____ sebiji pil ubat untuk melegakan sakit kepala.",
    options: ["meneguk", "memakan", "menelan", "menghisap"],
    answer: 2,
    explain: "Pil ubat ditelan bulat-bulat, jadi kata kerja yang tepat ialah **“menelan”**. (Kunci rasmi: C)\n• “meneguk” untuk air/cecair; “memakan” untuk makanan yang dikunyah; “menghisap” untuk cecair/asap melalui mulut.\nJawapannya ialah **menelan**."
  },
  {
    id: "pp-ms-5", subject: "malay", topic: "Kata Seru · Kertas 2026", difficulty: "Sederhana", source: "2026真题", year: 2026,
    q: "____ , cantiknya bunga raya yang kamu tanam itu!",
    options: ["Syabas", "Wahai", "Aduhai", "Amboi"],
    answer: 3,
    explain: "Kata seru **“Amboi”** digunakan untuk menyatakan rasa **kagum / hairan** terhadap sesuatu yang menarik (cantiknya bunga). (Kunci rasmi: D)\n• “Syabas” untuk memuji kejayaan; “Wahai” untuk memanggil; “Aduhai” untuk rasa sedih/kesal.\nJawapannya ialah **Amboi**."
  },
  {
    id: "pp-ms-6", subject: "malay", topic: "Kata Ganda · Kertas 2026", difficulty: "Sederhana", source: "2026真题", year: 2026,
    q: "Dewan sekolah itu menjadi ____ setelah lampu neon dipasang.",
    options: ["gelap-gelita", "terang-benderang", "senyap-sunyi", "riuh-rendah"],
    answer: 1,
    explain: "Apabila lampu **dipasang**, dewan menjadi sangat terang. Kata ganda yang sesuai ialah **“terang-benderang”** (sangat terang). (Kunci rasmi: B)\n• “gelap-gelita” bermaksud sangat gelap (bertentangan).\nJawapannya ialah **terang-benderang**."
  },
  {
    id: "pp-ms-7", subject: "malay", topic: "Kata Perintah · Kertas 2026", difficulty: "Sederhana", source: "2026真题", year: 2026,
    q: "“____ membuang sampah-sarap di merata-rata tempat,” kata penghulu.",
    options: ["Tolonglah", "Haraplah", "Janganlah", "Usahlah"],
    answer: 2,
    explain: "Penghulu **melarang** orang ramai membuang sampah merata tempat, jadi kata larangan yang paling sesuai ialah **“Janganlah”**. (Kunci rasmi: C)\nKata “Janganlah” menegaskan larangan dengan sopan. Jawapannya ialah **Janganlah**."
  },
  {
    id: "pp-ms-8", subject: "malay", topic: "Imbuhan Awalan 'pra-' · Kertas 2026", difficulty: "Sederhana", source: "2026真题", year: 2026,
    q: "Kanak-kanak menerima pendidikan ____ sebelum masuk sekolah rendah.",
    options: ["prasarana", "prakata", "prasyarat", "prasekolah"],
    answer: 3,
    explain: "Pendidikan yang diterima **sebelum** sekolah rendah ialah pendidikan **“prasekolah”** (awalan *pra-* bermaksud ‘sebelum’). (Kunci rasmi: D)\n• prasarana = kemudahan asas; prakata = kata pengenalan buku; prasyarat = syarat awal.\nJawapannya ialah **prasekolah**."
  },
  {
    id: "pp-ms-9", subject: "malay", topic: "Peribahasa · Kertas 2026", difficulty: "Sukar", source: "2026真题", year: 2026,
    q: "Pilih peribahasa yang sesuai: “Orang yang mengikut sahaja suruhan tanpa usul periksa.”",
    options: ["seperti kerbau dicucuk hidung", "seperti kera kena belacan", "seperti katak kena sembur", "seperti melukut di tepi gantang"],
    answer: 0,
    explain: "Peribahasa **“seperti kerbau dicucuk hidung”** bermaksud orang yang hanya menurut perintah tanpa berfikir atau membantah — sama seperti kerbau yang ditarik ke mana sahaja melalui tali di hidungnya. (Kunci rasmi: A)\nJawapannya ialah **seperti kerbau dicucuk hidung**."
  },

];
