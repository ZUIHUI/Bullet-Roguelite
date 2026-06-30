const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  score: document.querySelector("#scoreText"),
  wave: document.querySelector("#waveText"),
  kills: document.querySelector("#killText"),
  hpFill: document.querySelector("#hpFill"),
  chargeFill: document.querySelector("#chargeFill"),
  waveFill: document.querySelector("#waveFill"),
  waveBanner: document.querySelector("#waveBanner"),
  startOverlay: document.querySelector("#startOverlay"),
  upgradeOverlay: document.querySelector("#upgradeOverlay"),
  endOverlay: document.querySelector("#endOverlay"),
  startButton: document.querySelector("#startButton"),
  restartButton: document.querySelector("#restartButton"),
  pauseButton: document.querySelector("#pauseButton"),
  absorbButton: document.querySelector("#absorbButton"),
  ultimateButton: document.querySelector("#ultimateButton"),
  upgradeChoices: document.querySelector("#upgradeChoices"),
  finalScore: document.querySelector("#finalScore"),
  endLabel: document.querySelector("#endLabel"),
  endTitle: document.querySelector("#endTitle"),
  bossHud: document.querySelector("#bossHud"),
  bossName: document.querySelector("#bossNameText"),
  bossHpFill: document.querySelector("#bossHpFill"),
  skillHud: document.querySelector("#skillHud"),
  gold: document.querySelector("#goldText"),
  scales: document.querySelector("#scaleText"),
  idle: document.querySelector("#idleText"),
  dragonPreview: document.querySelector("#dragonPreview"),
  dragonRole: document.querySelector("#dragonRoleText"),
  dragonName: document.querySelector("#dragonNameText"),
  dragonInfo: document.querySelector("#dragonInfoText"),
  dragonGrid: document.querySelector("#dragonGrid"),
  formPanel: document.querySelector("#formPanel"),
  artifactPanel: document.querySelector("#artifactPanel"),
  storyPanel: document.querySelector("#storyPanel"),
  stageGrid: document.querySelector("#stageGrid"),
  selectedStage: document.querySelector("#selectedStageText"),
  power: document.querySelector("#powerText"),
  levelButton: document.querySelector("#levelButton"),
  starButton: document.querySelector("#starButton"),
  claimIdleButton: document.querySelector("#claimIdleButton"),
  claimIdleText: document.querySelector("#claimIdleText"),
  equipButton: document.querySelector("#equipButton"),
  equipmentText: document.querySelector("#equipmentText"),
  equipmentCostText: document.querySelector("#equipmentCostText"),
  equipmentGrid: document.querySelector("#equipmentGrid"),
  skillButton: document.querySelector("#skillButton"),
  skillText: document.querySelector("#skillText"),
  summonButton: document.querySelector("#summonButton"),
  summonText: document.querySelector("#summonText"),
  entryButtons: [...document.querySelectorAll(".entry-button")],
  tabs: [...document.querySelectorAll(".tab-button")],
  tabPanels: {
    dragons: document.querySelector("#dragonsTab"),
    artifact: document.querySelector("#artifactTab"),
    stage: document.querySelector("#stageTab"),
    growth: document.querySelector("#growthTab"),
  },
};

const TAU = Math.PI * 2;
const SAVE_KEY = "starSwallowDragonSave.v1";
const DEVICE_ID_KEY = "starSwallowDragonDeviceId.v1";
const FIREBASE_SDK_VERSION = "10.12.5";
const FIREBASE_COLLECTION = "players";
const ASSET_VERSION = "38";
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDxQqZWabxFJ0RWc5Xr3bVjBj1QctS4hGE",
  authDomain: "swallow-5407f.firebaseapp.com",
  projectId: "swallow-5407f",
  storageBucket: "swallow-5407f.firebasestorage.app",
  messagingSenderId: "662410867493",
  appId: "1:662410867493:web:9f44641f6b29cca6f060cc",
  measurementId: "G-85NW99ELDQ",
};
const rand = (min, max) => min + Math.random() * (max - min);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (edge0, edge1, value) => {
  const t = clamp((value - edge0) / Math.max(0.0001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
const dist2 = (a, b, c, d) => {
  const x = a - c;
  const y = b - d;
  return x * x + y * y;
};

const DRAGONS = [
  {
    id: "astral",
    name: "星夢幻龍",
    role: "星空幻術",
    element: "星空",
    artifactId: "starCore",
    colors: ["#202a8f", "#a678ff", "#14194f"],
    cost: 0,
    cardNo: 4,
    tags: ["星空", "夢境", "幻術", "神助"],
    cardArt: "dragon-void",
    palette: ["#202a8f", "#4b4fd8", "#8f73ff", "#f5a3e7", "#9fe2ff", "#f2d27a"],
    passive: "吞彈能量 +10%，反吐星彈會輕微追蹤。",
    stats: { hp: 6, attack: 1, speed: 1, swallow: 1, counter: 1 },
    ultimateName: "星夢回流",
    ultimateDesc: "把所有吞下的彈化成追蹤星雨。",
  },
  {
    id: "ember",
    name: "烈焰椒龍",
    role: "辛辣爆發",
    element: "火焰",
    artifactId: "emberFang",
    colors: ["#ff6b6b", "#ffd166", "#6f1d2b"],
    cost: 120,
    cardNo: 7,
    tags: ["火焰", "辛辣", "活力", "爆發"],
    cardArt: "dragon-ember",
    palette: ["#d92f32", "#ff9140", "#ffca35", "#6ca944", "#32120f", "#7d3327"],
    passive: "反吐火球傷害高，但吞噬槽較窄。",
    stats: { hp: 5, attack: 1.28, speed: 0.98, swallow: 0.9, counter: 1.25 },
    ultimateName: "辣焰飛椒",
    ultimateDesc: "向前落下高傷害火隕。",
  },
  {
    id: "tide",
    name: "泡泡海龍",
    role: "泡泡治癒",
    element: "水系",
    artifactId: "tideConch",
    colors: ["#7aa7ff", "#42efd2", "#17345f"],
    cost: 160,
    cardNo: 8,
    tags: ["水系", "泡泡", "軟樂", "治癒"],
    cardArt: "dragon-tide",
    palette: ["#5b9fe6", "#b8f2f7", "#33c0df", "#f48aa6", "#ece7de", "#7567b2"],
    passive: "吞噬槽更寬，反吐會附帶緩速。",
    stats: { hp: 7, attack: 0.9, speed: 0.95, swallow: 1.26, counter: 0.92 },
    ultimateName: "泡海漩渦",
    ultimateDesc: "產生漩渦吸住敵彈並反射。",
  },
  {
    id: "jade",
    name: "森語芽龍",
    role: "森林守護",
    element: "森林",
    artifactId: "jadeSeed",
    colors: ["#77f5a6", "#42efd2", "#204f3a"],
    cost: 180,
    cardNo: 9,
    tags: ["森林", "治癒", "自然", "守護"],
    cardArt: "dragon-jade",
    palette: ["#4f8d39", "#dce86a", "#9ac34d", "#ffe45e", "#f08c96", "#8b5d3c"],
    passive: "每次升級回復生命，生命上限較高。",
    stats: { hp: 8, attack: 0.86, speed: 0.9, swallow: 1.04, counter: 0.92 },
    ultimateName: "森語再生",
    ultimateDesc: "回血並釋放穿透藤息。",
  },
  {
    id: "volt",
    name: "霆電迅龍",
    role: "迅捷雷擊",
    element: "雷電",
    artifactId: "voltNeedle",
    colors: ["#ffd166", "#f7fbff", "#4d3f12"],
    cost: 220,
    cardNo: 10,
    tags: ["雷電", "迅捷", "靈動", "爆擊"],
    cardArt: "dragon-volt",
    palette: ["#ffd400", "#2388ff", "#171b55", "#47d3ec", "#f3f4f6"],
    passive: "移動快、連射快，容錯較低。",
    stats: { hp: 5, attack: 1.06, speed: 1.24, swallow: 0.96, counter: 1.08 },
    ultimateName: "霆電連鎖",
    ultimateDesc: "連鎖電擊場上多個目標。",
  },
  {
    id: "frost",
    name: "霜晶雪龍",
    role: "冰霜控制",
    element: "冰霜",
    artifactId: "frostCrown",
    colors: ["#c7f4ff", "#7aa7ff", "#213c62"],
    cost: 260,
    cardNo: 12,
    tags: ["冰霜", "晶體", "優雅", "控制"],
    cardArt: "dragon-frost",
    palette: ["#b6ceff", "#70dcff", "#5ac7ec", "#9f8dff", "#f4f6fb", "#c9b79d"],
    passive: "反吐會削弱敵人射速，Boss 戰穩定。",
    stats: { hp: 6, attack: 0.94, speed: 0.96, swallow: 1.06, counter: 1 },
    ultimateName: "霜晶結界",
    ultimateDesc: "短暫凍結彈幕並造成冰裂傷害。",
  },
  {
    id: "shadow",
    name: "月影幽龍",
    role: "暗影連擊",
    element: "暗影",
    artifactId: "shadowBell",
    colors: ["#9b7cff", "#ff6bff", "#211637"],
    cost: 320,
    cardNo: 11,
    tags: ["暗影", "隱匿", "詭秘", "連擊"],
    cardArt: "dragon-shadow",
    palette: ["#3f1b82", "#734ad9", "#5a45a2", "#09091e", "#b9bbca"],
    passive: "吞彈得分高，生命低。",
    stats: { hp: 4, attack: 1.18, speed: 1.1, swallow: 1.08, counter: 1.18 },
    ultimateName: "月影逆鳴",
    ultimateDesc: "把近身彈幕反轉成暗刃。",
  },
  {
    id: "metal",
    name: "齒輪機龍",
    role: "科技策略",
    element: "機械",
    artifactId: "ironScale",
    colors: ["#35c8d8", "#d8a647", "#3a322b"],
    cost: 360,
    cardNo: 6,
    tags: ["機械", "齒輪", "科技", "策略"],
    cardArt: "dragon-metal",
    palette: ["#3a322b", "#6e6e6e", "#35c8d8", "#2fb8c4", "#d8a647", "#d8d1c0"],
    passive: "生命厚，吞噬時受傷減少。",
    stats: { hp: 10, attack: 0.82, speed: 0.78, swallow: 1.02, counter: 0.88 },
    ultimateName: "齒輪震波",
    ultimateDesc: "震碎周圍彈幕並擊退敵人。",
  },
  {
    id: "bloom",
    name: "櫻風舞龍",
    role: "櫻花輔助",
    element: "櫻花",
    artifactId: "bloomLantern",
    colors: ["#ff8ab3", "#f7d4df", "#5a1f3b"],
    cost: 420,
    cardNo: 2,
    tags: ["櫻花", "風", "治癒", "輔助"],
    cardArt: "dragon-bloom",
    palette: ["#f35f8e", "#f7b8cc", "#9bd189", "#c8e1df", "#ead8d0", "#8f76b6"],
    passive: "反吐會留下櫻風治癒花火區。",
    stats: { hp: 6, attack: 1.02, speed: 1, swallow: 1.08, counter: 1.08 },
    ultimateName: "櫻風花燈",
    ultimateDesc: "召喚花火燈雨覆蓋全場。",
  },
  {
    id: "void",
    name: "砂遺古龍",
    role: "遺跡尋寶",
    element: "沙漠",
    artifactId: "voidMirror",
    colors: ["#d9a64a", "#55c2ba", "#5a3320"],
    cost: 520,
    cardNo: 1,
    tags: ["沙漠", "遺跡", "尋寶", "冒險"],
    cardArt: "dragon-astral",
    palette: ["#7b3a1d", "#f0ad52", "#e4b84e", "#66d1c7", "#155f68", "#3b2d25"],
    passive: "滿槽反吐會追加砂塵裂隙傷害。",
    stats: { hp: 6, attack: 1.16, speed: 1.04, swallow: 1.18, counter: 1.22 },
    ultimateName: "古砂秘寶",
    ultimateDesc: "開啟砂塵裂隙吸彈並向 Boss 反射。",
  },
];

const ARTIFACTS = [
  { id: "starCore", dragonId: "astral", name: "星夢法環", glyph: "星", cost: 0 },
  { id: "emberFang", dragonId: "ember", name: "辣焰椒冠", glyph: "火", cost: 90 },
  { id: "tideConch", dragonId: "tide", name: "泡海珍珠", glyph: "泡", cost: 120 },
  { id: "jadeSeed", dragonId: "jade", name: "森語芽杖", glyph: "森", cost: 140 },
  { id: "voltNeedle", dragonId: "volt", name: "霆電迅核", glyph: "雷", cost: 170 },
  { id: "frostCrown", dragonId: "frost", name: "霜晶雪杖", glyph: "霜", cost: 210 },
  { id: "shadowBell", dragonId: "shadow", name: "月影幽刃", glyph: "月", cost: 260 },
  { id: "ironScale", dragonId: "metal", name: "齒輪策盤", glyph: "機", cost: 300 },
  { id: "bloomLantern", dragonId: "bloom", name: "櫻風花鈴", glyph: "櫻", cost: 360 },
  { id: "voidMirror", dragonId: "void", name: "砂遺秘卷", glyph: "砂", cost: 460 },
];

const EQUIPMENT_CRYSTALS = [
  { id: "scale", name: "吞星鱗", stat: "生命", color: "#42efd2", unlock: 0 },
  { id: "fang", name: "反吐牙", stat: "攻擊", color: "#ffd166", unlock: 1 },
  { id: "wing", name: "迅翼核", stat: "速度", color: "#7aa7ff", unlock: 2 },
  { id: "vortex", name: "漩渦晶", stat: "吞噬", color: "#9b7cff", unlock: 3 },
  { id: "guard", name: "護心玉", stat: "防禦", color: "#77f5a6", unlock: 4 },
  { id: "relic", name: "古龍印", stat: "大絕", color: "#ff8ab3", unlock: 5 },
];

const STAGES = [
  {
    id: "1-1",
    chapter: 1,
    stageNo: 1,
    chapterTitle: "星塵甦醒",
    name: "1-1 星塵溪谷",
    artId: "valley",
    boss: "星塵吞噬者",
    objective: "找回第一枚星核碎片",
    storyIntro: "沉睡的星核在溪谷上空裂開，幼龍團必須穿過第一波星塵彈幕，確認災厄源頭。",
    storyClear: "星核碎片回到法環，第一條星路重新亮起。",
    waves: 10,
    waveSeconds: 20,
    power: 80,
    gold: 70,
    scales: 18,
    theme: "#42efd2",
    trait: "基礎彈幕",
    bg: ["#05070d", "#091019", "#130c14"],
    mods: { enemyHp: 1, enemySpeed: 1, bulletSpeed: 1, hazardDelay: 1 },
  },
  {
    id: "1-2",
    chapter: 1,
    stageNo: 2,
    chapterTitle: "星塵甦醒",
    name: "1-2 潮光礁灘",
    artId: "reef",
    boss: "潮光貝衛",
    objective: "回收被泡海封住的星圖邊角",
    storyIntro: "星圖碎片被潮光泡泡包住，敵人的彈幕變慢卻變寬，考驗吞噬角度。",
    storyClear: "星圖邊角拼回星盤，指向溪谷深處的第二枚碎片。",
    waves: 10,
    waveSeconds: 20,
    power: 115,
    gold: 86,
    scales: 21,
    theme: "#7aa7ff",
    trait: "寬幅泡彈",
    bg: ["#04111e", "#062a35", "#0d1028"],
    mods: { enemyHp: 1.06, enemySpeed: 0.96, bulletSpeed: 0.92, bulletSize: 1.14, hazardDelay: 1.08 },
  },
  {
    id: "1-3",
    chapter: 1,
    stageNo: 3,
    chapterTitle: "星塵甦醒",
    name: "1-3 燼火岔道",
    artId: "forge",
    boss: "熔牙斥候",
    objective: "截斷熔牙軍團搬運星核的路線",
    storyIntro: "燼火岔道開始出現快彈，龍群必須邊閃邊吃，把熔牙斥候逼出來。",
    storyClear: "熔牙斥候留下灼熱徽記，證明星核正在被搬往遺跡高塔。",
    waves: 10,
    waveSeconds: 20,
    power: 150,
    gold: 104,
    scales: 24,
    theme: "#ff6b6b",
    trait: "高壓快彈",
    bg: ["#14080b", "#251012", "#2d1410"],
    mods: { enemyHp: 1.12, enemySpeed: 1.05, bulletSpeed: 1.1, hazardDelay: 0.98 },
  },
  {
    id: "1-4",
    chapter: 1,
    stageNo: 4,
    chapterTitle: "星塵甦醒",
    name: "1-4 雷霜石橋",
    artId: "spire",
    boss: "霜雷巡守",
    objective: "通過雷霜石橋並記錄雷射規律",
    storyIntro: "雷霜石橋的光束會預警後落下，這一關開始要求玩家看路線抓吸收時機。",
    storyClear: "霜雷巡守被擊退，石橋盡頭露出古代龍族的封印紋。",
    waves: 10,
    waveSeconds: 20,
    power: 190,
    gold: 124,
    scales: 27,
    theme: "#ffd166",
    trait: "雷射密集",
    bg: ["#07101b", "#142034", "#1a1432"],
    mods: { enemyHp: 1.18, enemySpeed: 1.04, bulletSpeed: 1.08, hazardDelay: 0.9, laserRate: 0.82 },
  },
  {
    id: "1-5",
    chapter: 1,
    stageNo: 5,
    chapterTitle: "星塵甦醒",
    name: "1-5 微光裂谷",
    artId: "rift",
    boss: "微光裂影",
    objective: "追查封印紋指向的裂谷",
    storyIntro: "微光裂谷裡的彈幕會左右偏移，龍尾的擺動和玩家拖曳節奏都會被考驗。",
    storyClear: "裂影消散後，星盤第一次顯示出完整的第一章主線路徑。",
    waves: 10,
    waveSeconds: 20,
    power: 235,
    gold: 146,
    scales: 31,
    theme: "#9b7cff",
    trait: "裂隙亂流",
    bg: ["#090718", "#161132", "#250f30"],
    mods: { enemyHp: 1.25, enemySpeed: 1.08, bulletSpeed: 1.14, hazardDelay: 0.86, bulletDrift: 1 },
  },
  {
    id: "1-6",
    chapter: 1,
    stageNo: 6,
    chapterTitle: "星塵甦醒",
    name: "1-6 星藤古林",
    artId: "valley",
    boss: "星藤護衛",
    objective: "取得古林中的龍族路標",
    storyIntro: "古林裡藏著舊冒險團留下的路標，敵人血量提高，適合測試局內升級組合。",
    storyClear: "龍族路標指出星塵不是災難本體，而是某種更大的封印反應。",
    waves: 10,
    waveSeconds: 20,
    power: 285,
    gold: 170,
    scales: 36,
    theme: "#77f5a6",
    trait: "耐久小怪",
    bg: ["#06120e", "#0d2418", "#111925"],
    mods: { enemyHp: 1.34, enemySpeed: 1.02, bulletSpeed: 1.12, hazardDelay: 0.9 },
  },
  {
    id: "1-7",
    chapter: 1,
    stageNo: 7,
    chapterTitle: "星塵甦醒",
    name: "1-7 櫻風斷崖",
    artId: "reef",
    boss: "櫻風弓影",
    objective: "護送星盤穿越斷崖風流",
    storyIntro: "斷崖風流讓彈幕變得密集，玩家需要用吞噬槽清出可移動空間。",
    storyClear: "星盤吸收了櫻風弓影的殘光，開啟通往高塔底層的風徑。",
    waves: 10,
    waveSeconds: 20,
    power: 340,
    gold: 196,
    scales: 41,
    theme: "#ff8ab3",
    trait: "密集散射",
    bg: ["#150914", "#251225", "#15182a"],
    mods: { enemyHp: 1.42, enemySpeed: 1.08, bulletSpeed: 1.16, bulletSize: 0.94, hazardDelay: 0.82 },
  },
  {
    id: "1-8",
    chapter: 1,
    stageNo: 8,
    chapterTitle: "星塵甦醒",
    name: "1-8 齒輪外環",
    artId: "forge",
    boss: "齒輪守門者",
    objective: "破解外環齒輪門",
    storyIntro: "齒輪外環會把彈幕節奏推快，神器大絕在這裡會第一次顯得很關鍵。",
    storyClear: "齒輪門停轉，門後的星核反應已經接近失控。",
    waves: 10,
    waveSeconds: 20,
    power: 400,
    gold: 225,
    scales: 48,
    theme: "#35c8d8",
    trait: "節奏加速",
    bg: ["#071014", "#10252b", "#11151d"],
    mods: { enemyHp: 1.5, enemySpeed: 1.12, bulletSpeed: 1.2, hazardDelay: 0.76 },
  },
  {
    id: "1-9",
    chapter: 1,
    stageNo: 9,
    chapterTitle: "星塵甦醒",
    name: "1-9 星夢門廊",
    artId: "spire",
    boss: "星夢門衛",
    objective: "進入星夢門廊並守住星盤",
    storyIntro: "門廊會交錯出現雷射與範圍預警，這是 Boss 戰前的總複習。",
    storyClear: "星夢門衛低頭讓路，第一章最深處的星核暴走點終於出現。",
    waves: 10,
    waveSeconds: 20,
    power: 470,
    gold: 258,
    scales: 56,
    theme: "#a678ff",
    trait: "雷射範圍混合",
    bg: ["#09091b", "#17113a", "#21122d"],
    mods: { enemyHp: 1.62, enemySpeed: 1.14, bulletSpeed: 1.24, hazardDelay: 0.7, laserRate: 0.72 },
  },
  {
    id: "1-10",
    chapter: 1,
    stageNo: 10,
    chapterTitle: "星塵甦醒",
    name: "1-10 星核祭壇",
    artId: "rift",
    boss: "暴走星核龍",
    objective: "擊敗暴走星核龍並完成第一章封印",
    storyIntro: "祭壇中心的星核已經孵出暴走龍影，十波彈幕後才會露出本體。",
    storyClear: "暴走星核龍被反吐擊碎，第一章封印完成，新的冒險地圖在星盤上展開。",
    waves: 10,
    waveSeconds: 20,
    power: 550,
    gold: 320,
    scales: 70,
    theme: "#f2d27a",
    trait: "章節 Boss",
    bg: ["#0c0714", "#1d1230", "#2c1424"],
    mods: { enemyHp: 1.78, enemySpeed: 1.18, bulletSpeed: 1.3, hazardDelay: 0.64, laserRate: 0.68, bulletDrift: 1 },
  },
];

const DRAGON_FORMS = [
  {
    id: "origin",
    name: "原生形態",
    label: "平衡",
    stars: 1,
    multipliers: { hp: 1, attack: 1, speed: 1, swallow: 1, counter: 1 },
    effect: "均衡出戰",
  },
  {
    id: "devour",
    name: "吞星形態",
    label: "吞噬",
    stars: 1,
    multipliers: { hp: 1.05, attack: 0.92, speed: 0.94, swallow: 1.24, counter: 1.08 },
    effect: "吞彈能量提高",
  },
  {
    id: "swift",
    name: "迅翼形態",
    label: "機動",
    stars: 2,
    multipliers: { hp: 0.92, attack: 1.02, speed: 1.22, swallow: 0.98, counter: 1.04 },
    effect: "移動與連射更快",
  },
  {
    id: "flare",
    name: "龍息形態",
    label: "爆發",
    stars: 3,
    multipliers: { hp: 0.9, attack: 1.18, speed: 0.98, swallow: 0.92, counter: 1.24 },
    effect: "半槽可出吐息",
  },
];

const RUN_SKILLS = [
  {
    id: "flameOrbit",
    icon: "火",
    title: "環焰",
    element: "火",
    detail: "反吐命中後濺射灼燒",
    max: 4,
    apply(level) {
      state.upgrades.splashBurn = level;
    },
  },
  {
    id: "frostBite",
    icon: "冰",
    title: "霜咬",
    element: "冰",
    detail: "子彈命中延後敵方射擊",
    max: 4,
    apply(level) {
      state.upgrades.slowPower = level;
    },
  },
  {
    id: "wideMaw",
    icon: "喉",
    title: "闊喉",
    element: "吞噬",
    detail: "吞噬槽變寬並延伸",
    max: 5,
    apply(level) {
      state.upgrades.swallowWidth += 8 + level * 2;
      state.upgrades.swallowLength += 10;
    },
  },
  {
    id: "dragonBelly",
    icon: "腹",
    title: "龍腹",
    element: "蓄能",
    detail: "儲彈上限與反吐數增加",
    max: 5,
    apply(level) {
      state.upgrades.storedBonus += 2 + Math.floor(level / 2);
    },
  },
  {
    id: "splitBreath",
    icon: "裂",
    title: "分裂吐息",
    element: "星",
    detail: "自動射擊彈道增加",
    max: 3,
    apply() {
      state.upgrades.shotSpread = clamp(state.upgrades.shotSpread + 1, 1, 3);
    },
  },
  {
    id: "quickFang",
    icon: "迅",
    title: "迅牙",
    element: "雷",
    detail: "自動射擊速度提升",
    max: 5,
    apply() {
      state.upgrades.shotCooldown = Math.max(0.08, state.upgrades.shotCooldown * 0.86);
    },
  },
  {
    id: "counterCore",
    icon: "核",
    title: "反擊核心",
    element: "神器",
    detail: "吞彈反擊與大絕傷害提升",
    max: 5,
    apply() {
      state.upgrades.counterMult += 0.22;
    },
  },
  {
    id: "scaleGuard",
    icon: "鱗",
    title: "護鱗",
    element: "防禦",
    detail: "生命上限提升並回復",
    max: 4,
    apply(level) {
      state.player.maxHp += 1;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 1 + level * 0.25);
    },
  },
];

function artifactForDragon(dragon) {
  return ARTIFACTS.find((artifact) => artifact.id === dragon.artifactId);
}

function createDefaultMeta() {
  const dragons = {};
  const artifacts = {};
  for (const dragon of DRAGONS) {
    dragons[dragon.id] = {
      owned: dragon.cost === 0,
      level: dragon.cost === 0 ? 1 : 0,
      stars: dragon.cost === 0 ? 1 : 0,
    };
  }
  for (const artifact of ARTIFACTS) {
    artifacts[artifact.id] = {
      unlocked: artifact.cost === 0,
      level: artifact.cost === 0 ? 1 : 0,
    };
  }
  return {
    gold: 260,
    scales: 80,
    idleGold: 0,
    equipmentLevel: 0,
    skillLevel: 0,
    selectedDragonId: "astral",
    selectedFormId: "origin",
    selectedStageId: "1-1",
    highestStageIndex: 0,
    clearedStages: {},
    lastSeenAt: Date.now(),
    dragons,
    artifacts,
  };
}

let saveStore = {
  type: "local",
  deviceId: "",
};

function getDeviceId() {
  try {
    const saved = localStorage.getItem(DEVICE_ID_KEY);
    if (saved) return saved;
    const nextId = crypto.randomUUID?.() || `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_ID_KEY, nextId);
    return nextId;
  } catch {
    return `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function readLocalMetaRaw() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function mergeMeta(saved) {
  const fallback = createDefaultMeta();
  if (!saved) return fallback;
  const merged = { ...fallback, ...saved };
  merged.dragons = { ...fallback.dragons, ...saved.dragons };
  merged.artifacts = { ...fallback.artifacts, ...saved.artifacts };
  merged.clearedStages = { ...fallback.clearedStages, ...saved.clearedStages };
  if (!DRAGON_FORMS.some((form) => form.id === merged.selectedFormId)) {
    merged.selectedFormId = fallback.selectedFormId;
  }
  if (!STAGES.some((stage) => stage.id === merged.selectedStageId)) {
    merged.selectedStageId = fallback.selectedStageId;
  }
  merged.idleGold += calculateIdleGold(merged.lastSeenAt);
  merged.lastSeenAt = Date.now();
  return merged;
}

function persistLocalMeta(meta) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(meta));
  } catch {
    // Storage can be unavailable in private browsing; the current in-memory run still works.
  }
}

function withTimeout(promise, ms, fallback) {
  return Promise.race([
    promise,
    new Promise((resolve) => {
      window.setTimeout(() => resolve(fallback), ms);
    }),
  ]);
}

async function initFirebaseStore() {
  try {
    const modules = await withTimeout(
      Promise.all([
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore.js`),
      ]),
      4500,
      null,
    );
    if (!modules) throw new Error("Firebase SDK load timed out");
    const [{ initializeApp }, { doc, getDoc, getFirestore, serverTimestamp, setDoc }] = modules;
    const app = initializeApp(FIREBASE_CONFIG);
    if (FIREBASE_CONFIG.measurementId) {
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-analytics.js`)
        .then(({ getAnalytics, isSupported }) => isSupported().then((supported) => supported && getAnalytics(app)))
        .catch(() => {});
    }
    const db = getFirestore(app);
    const deviceId = getDeviceId();
    return {
      type: "firebase",
      deviceId,
      docRef: doc(db, FIREBASE_COLLECTION, deviceId),
      getDoc,
      serverTimestamp,
      setDoc,
    };
  } catch (error) {
    console.warn("Firebase save unavailable; using local save.", error);
    return { type: "local", deviceId: getDeviceId() };
  }
}

async function loadMeta() {
  const localMeta = mergeMeta(readLocalMetaRaw());
  syncFirebaseMeta(localMeta).catch((error) => {
    console.warn("Firebase background sync failed; local save remains active.", error);
  });
  return localMeta;
}

async function syncFirebaseMeta(localMeta) {
  saveStore = await initFirebaseStore();
  if (saveStore.type !== "firebase") return;

  try {
    const snapshot = await withTimeout(saveStore.getDoc(saveStore.docRef), 4500, null);
    if (snapshot?.exists()) {
      const data = snapshot.data();
      const remoteMeta = mergeMeta(data.meta || data);
      state.meta = remoteMeta;
      persistLocalMeta(remoteMeta);
      renderHome();
      updateHud();
      return;
    }

    await withTimeout(
      saveStore.setDoc(
        saveStore.docRef,
        {
          deviceId: saveStore.deviceId,
          meta: JSON.parse(JSON.stringify(state.meta || localMeta)),
          updatedAt: saveStore.serverTimestamp(),
        },
        { merge: true },
      ),
      4500,
      null,
    );
  } catch (error) {
    console.warn("Firebase save read failed; using local save.", error);
  }
}

function saveMeta() {
  if (!state.meta) return;
  state.meta.lastSeenAt = Date.now();
  persistLocalMeta(state.meta);
  if (saveStore.type !== "firebase") return;

  const meta = JSON.parse(JSON.stringify(state.meta));
  saveStore
    .setDoc(
      saveStore.docRef,
      {
        deviceId: saveStore.deviceId,
        meta,
        updatedAt: saveStore.serverTimestamp(),
      },
      { merge: true },
    )
    .catch((error) => console.warn("Firebase save write failed; local cache kept.", error));
}

function calculateIdleGold(lastSeenAt) {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - (lastSeenAt || Date.now())) / 1000));
  return Math.min(720, Math.floor(elapsedSeconds / 8));
}

function getDragonMeta(dragon = selectedDragon()) {
  return state.meta.dragons[dragon.id];
}

function getArtifactMeta(artifact = selectedArtifact()) {
  return state.meta.artifacts[artifact.id];
}

function selectedDragon() {
  if (!state.meta) return DRAGONS[0];
  return DRAGONS.find((dragon) => dragon.id === state.meta.selectedDragonId) || DRAGONS[0];
}

function selectedArtifact() {
  return artifactForDragon(selectedDragon());
}

function selectedStage() {
  if (!state.meta) return STAGES[0];
  return STAGES.find((stage) => stage.id === state.meta.selectedStageId) || STAGES[0];
}

function selectedForm(dragon = selectedDragon()) {
  const dragonMeta = state.meta?.dragons?.[dragon.id] || { stars: 1 };
  const form = DRAGON_FORMS.find((item) => item.id === state.meta?.selectedFormId) || DRAGON_FORMS[0];
  return dragonMeta.stars >= form.stars ? form : DRAGON_FORMS[0];
}

function dragonStats(dragon = selectedDragon(), form = selectedForm(dragon)) {
  return {
    hp: dragon.stats.hp * form.multipliers.hp,
    attack: dragon.stats.attack * form.multipliers.attack,
    speed: dragon.stats.speed * form.multipliers.speed,
    swallow: dragon.stats.swallow * form.multipliers.swallow,
    counter: dragon.stats.counter * form.multipliers.counter,
  };
}

function activeDragonStats() {
  return dragonStats(state.currentDragon || selectedDragon(), state.currentForm || selectedForm());
}

function applyBootParams(params) {
  const dragonId = params.get("dragon");
  if (dragonId && DRAGONS.some((dragon) => dragon.id === dragonId)) {
    state.meta.selectedDragonId = dragonId;
  }

  const stageId = params.get("stage");
  if (stageId && STAGES.some((stage) => stage.id === stageId)) {
    state.meta.selectedStageId = stageId;
  }
}

function dragonPower(dragon = selectedDragon()) {
  const dragonMeta = state.meta.dragons[dragon.id];
  const artifact = artifactForDragon(dragon);
  const artifactMeta = state.meta.artifacts[artifact.id];
  const form = selectedForm(dragon);
  const stats = dragonStats(dragon, form);
  const level = dragonMeta.level || 0;
  const stars = dragonMeta.stars || 0;
  const artifactLevel = artifactMeta.level || 0;
  return Math.floor(
    55 +
      level * 18 +
      stars * 48 +
      artifactLevel * 30 +
      state.meta.equipmentLevel * 22 +
      state.meta.skillLevel * 24 +
      (stats.attack + stats.swallow + stats.counter) * 18 +
      (form.stars - 1) * 20,
  );
}

function dragonLevelCost(dragon = selectedDragon()) {
  return 45 + getDragonMeta(dragon).level * 35;
}

function dragonStarCost(dragon = selectedDragon()) {
  return 60 + getDragonMeta(dragon).stars * 90;
}

function artifactUpgradeCost(artifact = selectedArtifact()) {
  return artifact.cost + getArtifactMeta(artifact).level * 120;
}

function stageIndex(stage = selectedStage()) {
  return STAGES.findIndex((item) => item.id === stage.id);
}

function stageMods(stage = state.currentStage || selectedStage()) {
  return stage?.mods || STAGES[0].mods;
}

function drawDragonPortrait(targetCtx, dragon, width, height, time = 0) {
  const [main, accent, dark] = dragon.colors;
  targetCtx.clearRect(0, 0, width, height);
  targetCtx.save();
  targetCtx.translate(width / 2, height * 0.58);
  targetCtx.scale(width / 220, width / 220);

  const glow = targetCtx.createRadialGradient(0, 0, 10, 0, 0, 86);
  glow.addColorStop(0, `${main}66`);
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  targetCtx.fillStyle = glow;
  targetCtx.beginPath();
  targetCtx.arc(0, 0, 88, 0, TAU);
  targetCtx.fill();

  targetCtx.fillStyle = accent;
  targetCtx.globalAlpha = 0.92;
  targetCtx.beginPath();
  targetCtx.moveTo(-18, -6);
  targetCtx.quadraticCurveTo(-72, 12, -24, 40);
  targetCtx.quadraticCurveTo(-38, 16, -18, -6);
  targetCtx.moveTo(18, -6);
  targetCtx.quadraticCurveTo(72, 12, 24, 40);
  targetCtx.quadraticCurveTo(38, 16, 18, -6);
  targetCtx.fill();
  targetCtx.globalAlpha = 1;

  targetCtx.shadowColor = main;
  targetCtx.shadowBlur = 20;
  targetCtx.fillStyle = main;
  targetCtx.beginPath();
  targetCtx.moveTo(0, -64);
  targetCtx.bezierCurveTo(42, -39, 44, 28, 13, 58);
  targetCtx.bezierCurveTo(4, 70, -16, 64, -13, 35);
  targetCtx.bezierCurveTo(-45, 18, -42, -42, 0, -64);
  targetCtx.fill();
  targetCtx.shadowBlur = 0;

  targetCtx.fillStyle = dark;
  targetCtx.beginPath();
  targetCtx.moveTo(-18, -48);
  targetCtx.lineTo(-36, -82);
  targetCtx.lineTo(-5, -58);
  targetCtx.moveTo(18, -48);
  targetCtx.lineTo(36, -82);
  targetCtx.lineTo(5, -58);
  targetCtx.fill();

  targetCtx.fillStyle = "#06100f";
  targetCtx.beginPath();
  targetCtx.arc(-11, -24, 4.8, 0, TAU);
  targetCtx.arc(11, -24, 4.8, 0, TAU);
  targetCtx.fill();

  targetCtx.fillStyle = accent;
  targetCtx.beginPath();
  targetCtx.arc(0, -3 + Math.sin(time * 3) * 2, 10, 0, TAU);
  targetCtx.fill();

  targetCtx.restore();
}

function spriteMarkup(symbolId, className, label = "") {
  const aria = label ? `role="img" aria-label="${label}"` : `aria-hidden="true"`;
  return `<svg class="${className}" ${aria}><use href="./assets/visuals.svg#${symbolId}"></use></svg>`;
}

function dragonArtMarkup(dragon, className, label = "") {
  const alt = label ? `alt="${label}"` : `alt="" aria-hidden="true"`;
  return `<img class="${className} dragon-image" src="${dragonImagePath(dragon)}" ${alt} />`;
}

const dragonImageCache = new Map();

function dragonImagePath(dragon) {
  return `./assets/dragons-clean/dragon-${dragon.id}.png?v=${ASSET_VERSION}`;
}

function getDragonImage(dragon) {
  if (!dragonImageCache.has(dragon.id)) {
    const image = new Image();
    image.src = dragonImagePath(dragon);
    dragonImageCache.set(dragon.id, image);
  }
  return dragonImageCache.get(dragon.id);
}

const battleDragonImageCache = new Map();
const imageAlphaFrameCache = new WeakMap();

function battleDragonImagePath(dragon) {
  return `./assets/battle-dragons/battle-${dragon.id}.png?v=${ASSET_VERSION}`;
}

function getBattleDragonImage(dragon) {
  if (!battleDragonImageCache.has(dragon.id)) {
    const image = new Image();
    image.src = battleDragonImagePath(dragon);
    battleDragonImageCache.set(dragon.id, image);
  }
  return battleDragonImageCache.get(dragon.id);
}

function getImageAlphaFrame(image) {
  if (imageAlphaFrameCache.has(image)) return imageAlphaFrameCache.get(image);
  const fallback = { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight };
  if (!image.naturalWidth || !image.naturalHeight) return fallback;

  try {
    const probe = document.createElement("canvas");
    probe.width = image.naturalWidth;
    probe.height = image.naturalHeight;
    const probeCtx = probe.getContext("2d", { willReadFrequently: true });
    probeCtx.drawImage(image, 0, 0);
    const data = probeCtx.getImageData(0, 0, probe.width, probe.height).data;
    let minX = probe.width;
    let minY = probe.height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < probe.height; y += 1) {
      const row = y * probe.width * 4;
      for (let x = 0; x < probe.width; x += 1) {
        if (data[row + x * 4 + 3] <= 12) continue;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }

    if (maxX < minX || maxY < minY) {
      imageAlphaFrameCache.set(image, fallback);
      return fallback;
    }

    const pad = 6;
    const frame = {
      x: Math.max(0, minX - pad),
      y: Math.max(0, minY - pad),
      w: Math.min(image.naturalWidth, maxX + pad + 1) - Math.max(0, minX - pad),
      h: Math.min(image.naturalHeight, maxY + pad + 1) - Math.max(0, minY - pad),
    };
    imageAlphaFrameCache.set(image, frame);
    return frame;
  } catch (error) {
    imageAlphaFrameCache.set(image, fallback);
    return fallback;
  }
}

function preloadDragonImages() {
  for (const dragon of DRAGONS) {
    getDragonImage(dragon);
    getBattleDragonImage(dragon);
  }
}

const BATTLE_POSES = {
  astral: { scale: 0.18, mouth: [0.5, 0.16], body: 0.98, slices: 18, phase: 0.1 },
  ember: { scale: 0.18, mouth: [0.5, 0.16], body: 0.98, slices: 17, phase: 0.4 },
  tide: { scale: 0.18, mouth: [0.5, 0.15], body: 1.02, slices: 18, phase: 0.8 },
  jade: { scale: 0.175, mouth: [0.5, 0.15], body: 1, slices: 18, phase: 1.2 },
  volt: { scale: 0.18, mouth: [0.5, 0.15], body: 0.96, slices: 16, phase: 1.6 },
  frost: { scale: 0.175, mouth: [0.5, 0.15], body: 1, slices: 18, phase: 2 },
  shadow: { scale: 0.18, mouth: [0.5, 0.16], body: 1, slices: 17, phase: 2.4 },
  metal: { scale: 0.172, mouth: [0.5, 0.15], body: 1.05, slices: 16, phase: 2.8 },
  bloom: { scale: 0.178, mouth: [0.5, 0.15], body: 1, slices: 18, phase: 3.2 },
  void: { scale: 0.172, mouth: [0.5, 0.15], body: 1.04, slices: 17, phase: 3.6 },
};

function colorAlpha(hex, alpha) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(
    normalized.length === 3
      ? normalized
          .split("")
          .map((part) => part + part)
          .join("")
      : normalized,
    16,
  );
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function renderDragonPreview() {
  const dragon = selectedDragon();
  ui.dragonPreview.innerHTML = dragonArtMarkup(dragon, "dragon-preview-art", dragon.name);
}

function renderHome() {
  const dragon = selectedDragon();
  const dragonMeta = getDragonMeta(dragon);
  const form = selectedForm(dragon);
  const artifact = selectedArtifact();
  const artifactMeta = getArtifactMeta(artifact);
  const stage = selectedStage();
  const power = dragonPower(dragon);

  ui.gold.textContent = Math.floor(state.meta.gold).toLocaleString("zh-TW");
  ui.scales.textContent = Math.floor(state.meta.scales).toLocaleString("zh-TW");
  ui.idle.textContent = Math.floor(state.meta.idleGold).toLocaleString("zh-TW");
  ui.claimIdleText.textContent = state.meta.idleGold > 0 ? `領取 ${Math.floor(state.meta.idleGold).toLocaleString("zh-TW")}金` : "暫無收益";
  ui.claimIdleButton.disabled = state.meta.idleGold <= 0;
  ui.dragonRole.textContent = `${dragon.element} / ${dragon.role} / ${form.label}`;
  ui.dragonName.textContent = dragon.name;
  ui.dragonInfo.textContent = `Lv.${dragonMeta.level} / ${dragonMeta.stars}星 · ${form.name} · ${dragon.passive}`;
  ui.selectedStage.textContent = `${stage.name} · ${stage.trait}`;
  ui.power.textContent = `戰力 ${power}`;
  ui.levelButton.textContent = `強化 ${dragonLevelCost(dragon)}金`;
  ui.starButton.textContent = `升星 ${dragonStarCost(dragon)}晶`;
  ui.equipmentText.textContent = `吞星鱗 +${state.meta.equipmentLevel}`;
  ui.equipmentCostText.textContent = `強化 ${equipmentUpgradeCost()}金`;
  ui.skillText.textContent = `吞噬學 +${state.meta.skillLevel}`;
  ui.summonText.textContent = "80晶";

  renderDragonPreview();
  renderFormPanel();
  renderDragonGrid();
  renderArtifactPanel();
  renderEquipmentGrid();
  renderStoryPanel();
  renderStageGrid();
}

function equipmentUpgradeCost() {
  return 120 + state.meta.equipmentLevel * 80;
}

function renderEquipmentGrid() {
  ui.equipmentGrid.innerHTML = "";
  const level = state.meta.equipmentLevel;
  for (const [index, item] of EQUIPMENT_CRYSTALS.entries()) {
    const active = level >= item.unlock;
    const tier = active ? Math.floor((level - item.unlock) / EQUIPMENT_CRYSTALS.length) + 1 : 0;
    const card = document.createElement("button");
    card.type = "button";
    card.className = `hex-card${active ? " is-active" : " is-locked"}`;
    card.style.setProperty("--crystal", item.color);
    card.innerHTML = `
      <span class="hex-gem">${item.stat.slice(0, 1)}</span>
      <span>
        <strong>${item.name}</strong>
        <em>${active ? `${item.stat} +${tier + 1}` : `+${item.unlock}解鎖`}</em>
      </span>
    `;
    card.addEventListener("click", () => {
      if (state.meta.gold < equipmentUpgradeCost()) return;
      state.meta.gold -= equipmentUpgradeCost();
      state.meta.equipmentLevel += 1;
      saveMeta();
      renderHome();
    });
    ui.equipmentGrid.append(card);
    if (index === 2) {
      const spacer = document.createElement("span");
      spacer.className = "hex-break";
      ui.equipmentGrid.append(spacer);
    }
  }
}

function renderFormPanel() {
  const dragon = selectedDragon();
  const dragonMeta = getDragonMeta(dragon);
  const selected = selectedForm(dragon);
  ui.formPanel.innerHTML = "";

  const title = document.createElement("div");
  title.className = "form-panel-title";
  title.innerHTML = `<span>幻化</span><strong>${selected.name}</strong>`;
  ui.formPanel.append(title);

  const grid = document.createElement("div");
  grid.className = "form-grid";
  for (const form of DRAGON_FORMS) {
    const locked = dragonMeta.stars < form.stars;
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = locked;
    button.className = `form-card${selected.id === form.id ? " is-selected" : ""}${locked ? " is-locked" : ""}`;
    button.innerHTML = `
      <span>${form.label}</span>
      <strong>${form.name}</strong>
      <em>${locked ? `${form.stars}星解鎖` : form.effect}</em>
    `;
    button.addEventListener("click", () => {
      if (locked) return;
      state.meta.selectedFormId = form.id;
      saveMeta();
      renderHome();
    });
    grid.append(button);
  }
  ui.formPanel.append(grid);
}

function renderDragonGrid() {
  ui.dragonGrid.innerHTML = "";
  for (const dragon of DRAGONS) {
    const meta = state.meta.dragons[dragon.id];
    const button = document.createElement("button");
    button.type = "button";
    button.className = `dragon-card setting-card${dragon.id === state.meta.selectedDragonId ? " is-selected" : ""}${
      meta.owned ? "" : " is-locked"
    }`;
    button.style.setProperty("--dragon-main", dragon.colors[0]);
    button.style.setProperty("--dragon-accent", dragon.colors[1]);
    button.style.setProperty("--dragon-dark", dragon.colors[2]);
    const tags = (dragon.tags || [dragon.element, dragon.role]).map((tag) => `<em>${tag}</em>`).join("");
    const swatches = (dragon.palette || dragon.colors).map((color) => `<i style="background:${color}"></i>`).join("");
    button.innerHTML = `
      <span class="card-no">${dragon.cardNo || ""}</span>
      <span class="card-main">
        ${dragonArtMarkup(dragon, "dragon-card-art", dragon.name)}
      </span>
      <span class="card-copy">
        <strong>${dragon.name}</strong>
        <span class="tag-row">${tags}</span>
        <span>${dragon.role} · ${meta.owned ? `Lv.${meta.level} / ${meta.stars}星` : `${dragon.cost}晶解鎖`}</span>
        <span class="view-row">表情 / 側視 / 背視 / 小圖示</span>
        <span class="palette-row">${swatches}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      if (!meta.owned) {
        if (state.meta.scales < dragon.cost) return;
        state.meta.scales -= dragon.cost;
        meta.owned = true;
        meta.level = 1;
        meta.stars = 1;
      }
      state.meta.selectedDragonId = dragon.id;
      saveMeta();
      renderHome();
    });
    ui.dragonGrid.append(button);
  }
}

function renderArtifactPanel() {
  const dragon = selectedDragon();
  const artifact = selectedArtifact();
  const artifactMeta = getArtifactMeta(artifact);
  const unlockText = artifactMeta.unlocked
    ? `升級 ${artifactUpgradeCost(artifact)}晶`
    : `解鎖 ${artifact.cost}晶`;

  ui.artifactPanel.innerHTML = `
    <div class="artifact-title">
      <div>
        <span>${dragon.name} 專屬神器</span>
        <strong>${artifact.name}</strong>
      </div>
      ${spriteMarkup(`artifact-${artifact.id}`, "art-sprite artifact-art", artifact.name)}
    </div>
    <p class="info-text">${dragon.ultimateName}：${dragon.ultimateDesc}</p>
    <p class="info-text">神器 Lv.${artifactMeta.level} · ${artifactMeta.unlocked ? "大絕已解鎖" : "尚未解鎖大絕"}</p>
    <button id="artifactActionButton" class="primary-button" type="button">${unlockText}</button>
  `;

  document.querySelector("#artifactActionButton").addEventListener("click", () => {
    const cost = artifactMeta.unlocked ? artifactUpgradeCost(artifact) : artifact.cost;
    if (state.meta.scales < cost) return;
    state.meta.scales -= cost;
    artifactMeta.unlocked = true;
    artifactMeta.level += 1;
    saveMeta();
    renderHome();
  });
}

function renderStageGrid() {
  ui.stageGrid.innerHTML = "";
  for (const stage of STAGES) {
    const index = stageIndex(stage);
    const locked = index > state.meta.highestStageIndex;
    const cleared = Boolean(state.meta.clearedStages?.[stage.id]);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `stage-card${stage.id === state.meta.selectedStageId ? " is-selected" : ""}${cleared ? " is-cleared" : ""}`;
    button.disabled = locked;
    button.innerHTML = `
      <span class="stage-node">${stage.stageNo}</span>
      <span class="stage-main">
        <span>${locked ? "未解鎖" : `第${stage.chapter}章 · ${stage.waves}波 · 每波${stage.waveSeconds}秒`}</span>
        <strong>${stage.name}</strong>
        <span>${stage.trait} · 建議 ${stage.power}</span>
        <span>${cleared ? "主線已推進" : stage.objective}</span>
        <span>通關 ${stage.gold}金 / ${stage.scales}晶</span>
      </span>
    `;
    button.addEventListener("click", () => {
      if (locked) return;
      state.meta.selectedStageId = stage.id;
      saveMeta();
      renderHome();
    });
    ui.stageGrid.append(button);
  }
}

function renderStoryPanel() {
  const stage = selectedStage();
  const index = stageIndex(stage);
  const locked = index > state.meta.highestStageIndex;
  const cleared = Boolean(state.meta.clearedStages?.[stage.id]);
  ui.storyPanel.innerHTML = `
    <div class="story-title">
      <span>第${stage.chapter}章</span>
      <strong>${stage.chapterTitle}</strong>
    </div>
    <p>${locked ? "章節尚未解鎖，先完成前面的冒險。" : stage.storyIntro}</p>
    <p>${locked ? stage.objective : cleared ? stage.storyClear : `任務：${stage.objective}`}</p>
  `;
}

function setHomeTab(tabId) {
  for (const button of ui.tabs) {
    button.classList.toggle("is-active", button.dataset.tab === tabId);
  }
  for (const [id, panel] of Object.entries(ui.tabPanels)) {
    panel.classList.toggle("active", id === tabId);
  }
}

function openHomeEntry(entryId) {
  if (entryId === "battle") {
    resetRun();
    return;
  }
  if (entryId === "summon") {
    setHomeTab("growth");
    ui.summonButton.focus?.();
    return;
  }
  setHomeTab(entryId);
}

const input = {
  target: null,
  pointerId: null,
  absorbPointerId: null,
  absorbing: false,
  keys: new Set(),
};

const state = {
  w: 0,
  h: 0,
  dpr: 1,
  mode: "start",
  last: 0,
  time: 0,
  score: 0,
  kills: 0,
  wave: 1,
  nextUpgrade: 9,
  spawnTimer: 0,
  stageElapsed: 0,
  announcedWave: 0,
  waveBannerTimer: 0,
  shake: 0,
  flash: 0,
  player: null,
  stars: [],
  enemies: [],
  bullets: [],
  shots: [],
  hazards: [],
  particles: [],
  swallowBursts: [],
  breaths: [],
  currentDragon: null,
  currentForm: null,
  currentArtifact: null,
  currentStage: null,
  currentBoss: null,
  stageKills: 0,
  stageTargetKills: 0,
  bossSpawned: false,
  elitesSpawned: 0,
  absorbDemo: false,
  absorbDemoTimer: 0,
  ultimateDemo: false,
  ultimateCharge: 0,
  ultimateCooldown: 0,
  ultimateActive: null,
  runSkills: {},
  meta: null,
  upgrades: {
    shotDamage: 13,
    shotCooldown: 0.17,
    shotTimer: 0,
    shotSpread: 1,
    swallowLength: 108,
    swallowWidth: 42,
    storedBonus: 0,
    counterMult: 1,
  },
};

function createPlayer() {
  const dragon = state.currentDragon || selectedDragon();
  const stats = activeDragonStats();
  const meta = state.meta?.dragons?.[dragon.id] || { level: 1, stars: 1 };
  const hpBonus = Math.floor(meta.level / 4) + meta.stars - 1 + Math.floor((state.meta?.equipmentLevel || 0) / 2);
  const chargeBonus = (state.meta?.skillLevel || 0) * 5;
  const maxHp = Math.max(3, Math.round(stats.hp + hpBonus));
  return {
    x: state.w / 2,
    y: state.h * 0.76,
    r: 20,
    hp: maxHp,
    maxHp,
    charge: 0,
    maxCharge: 100 + chargeBonus,
    swallowed: [],
    invulnerable: 0,
    absorbTime: 0,
    releasePulse: 0,
  };
}

function resetRun() {
  state.mode = "playing";
  state.currentDragon = selectedDragon();
  state.currentForm = selectedForm(state.currentDragon);
  state.currentArtifact = artifactForDragon(state.currentDragon);
  state.currentStage = selectedStage();
  state.currentBoss = null;
  state.time = 0;
  state.score = 0;
  state.kills = 0;
  state.wave = 1;
  state.nextUpgrade = 9;
  state.stageKills = 0;
  state.stageTargetKills = state.currentStage.waves * 10;
  state.stageElapsed = 0;
  state.announcedWave = 1;
  state.waveBannerTimer = 1.4;
  state.bossSpawned = false;
  state.elitesSpawned = 0;
  state.absorbDemo = false;
  state.absorbDemoTimer = 0;
  state.ultimateDemo = false;
  state.ultimateCharge = 0;
  state.ultimateCooldown = 0;
  state.ultimateActive = null;
  state.runSkills = {};
  state.spawnTimer = 0.4;
  state.shake = 0;
  state.flash = 0;
  state.player = createPlayer();
  state.enemies = [];
  state.bullets = [];
  state.shots = [];
  state.hazards = [];
  state.particles = [];
  state.swallowBursts = [];
  state.breaths = [];
  const stats = activeDragonStats();
  state.upgrades = {
    shotDamage: 13 * stats.attack + (state.meta.skillLevel || 0) * 1.2,
    shotCooldown: (state.currentForm.id === "swift" ? 0.145 : 0.17) / stats.speed,
    shotTimer: 0,
    shotSpread: 1,
    swallowLength: 108 * stats.swallow,
    swallowWidth: 42 * stats.swallow,
    storedBonus: 0,
    counterMult: stats.counter,
    splashBurn: 0,
    slowPower: 0,
  };
  input.target = { x: state.player.x, y: state.player.y };
  input.absorbing = false;
  ui.startOverlay.classList.remove("active");
  ui.endOverlay.classList.remove("active");
  ui.upgradeOverlay.classList.remove("active");
  ui.absorbButton.classList.remove("is-active", "is-ready");
  showWaveBanner(`Wave 1 / ${state.currentStage.waves}`);
  renderSkillHud();
  updateHud();
}

function spawnAbsorbDemoBullet(index = 0) {
  const maw = getMawZone();
  const dragon = state.currentDragon || selectedDragon();
  const colors = dragon.colors || ["#42efd2", "#ffd166", "#9b7cff"];
  const progress = rand(0.36, 0.98);
  const side = index % 2 === 0 ? -1 : 1;
  const halfWidth = maw.width * (0.58 + progress * 0.72);
  state.bullets.push({
    x: maw.x + side * rand(halfWidth * 0.35, halfWidth * 1.05),
    y: maw.y - maw.length * progress + rand(-16, 16),
    vx: -side * rand(18, 60),
    vy: rand(28, 78),
    r: rand(5.5, 8.5),
    color: colors[index % colors.length],
    power: rand(7, 13),
    spin: rand(0, TAU),
    vortexSide: side,
    demo: true,
  });
}

function maintainAbsorbDemo(dt) {
  if (!state.player) return;
  input.absorbing = true;
  input.absorbPointerId = null;
  if (!state.ultimateDemo) {
    state.ultimateCharge = Math.min(state.ultimateCharge, 86);
  }
  state.player.hp = state.player.maxHp;
  state.player.invulnerable = Math.max(state.player.invulnerable || 0, 0.2);
  state.player.absorbTime = Math.max(state.player.absorbTime || 0, 0.7);
  state.spawnTimer = Math.max(state.spawnTimer, 1.4);
  ui.absorbButton.classList.add("is-active");

  state.absorbDemoTimer -= dt;
  if (state.absorbDemoTimer > 0 && state.bullets.length >= 10) return;

  const needed = Math.max(0, 16 - state.bullets.length);
  for (let i = 0; i < needed; i += 1) {
    spawnAbsorbDemoBullet(state.bullets.length + i);
  }
  state.absorbDemoTimer = 0.42;
}

function startAbsorbDemo() {
  state.absorbDemo = true;
  state.absorbDemoTimer = 0;
  state.enemies = [];
  state.shots = [];
  state.hazards = [];
  state.spawnTimer = 2.2;
  maintainAbsorbDemo(0);
  showWaveBanner("吞噬測試");
}

function startUltimateDemo() {
  state.ultimateDemo = true;
  state.ultimateCharge = 100;
  state.spawnTimer = Math.max(state.spawnTimer, 1.6);
  for (let i = 0; i < 5; i += 1) {
    state.enemies.push({
      x: state.w * (0.18 + i * 0.16),
      y: 110 + (i % 2) * 54,
      phase: rand(0, TAU),
      shoot: 1.8,
      pattern: i % 2 ? "fan" : "single",
      color: i % 2 ? "#ffd166" : "#9b7cff",
      score: 0,
      kind: "demo",
      type: "demo",
      hazard: 99,
      r: 20,
      hp: 520,
      maxHp: 520,
      speed: 0,
    });
  }
  showWaveBanner("大絕測試");
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);
  state.w = rect.width;
  state.h = rect.height;
  canvas.width = Math.round(rect.width * state.dpr);
  canvas.height = Math.round(rect.height * state.dpr);
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  seedStars();
  if (!state.player) {
    state.player = createPlayer();
  }
  state.player.x = clamp(state.player.x, 28, state.w - 28);
  state.player.y = clamp(state.player.y, 92, state.h - 82);
}

function seedStars() {
  const count = Math.round((state.w * state.h) / 5800);
  state.stars = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * state.w,
    y: Math.random() * state.h,
    z: rand(0.25, 1),
    r: i % 11 === 0 ? rand(1.2, 2.2) : rand(0.45, 1.1),
    hue: ["#42efd2", "#ffd166", "#ff8a8a", "#f7fbff"][i % 4],
  }));
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: clamp(event.clientX - rect.left, 22, state.w - 22),
    y: clamp(event.clientY - rect.top, 88, state.h - 72),
  };
}

function addParticles(x, y, amount, color, speed = 120) {
  for (let i = 0; i < amount; i += 1) {
    const angle = rand(0, TAU);
    const velocity = rand(speed * 0.35, speed);
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      life: rand(0.28, 0.72),
      maxLife: 0.72,
      r: rand(1.4, 4.2),
      color,
    });
  }
}

function addSwallowBurst(x, y, color) {
  state.swallowBursts.push({
    x,
    y,
    color,
    life: 0.18,
    maxLife: 0.18,
  });
}

function getMawZone() {
  const player = state.player;
  const length = state.upgrades.swallowLength;
  const width = state.upgrades.swallowWidth;
  return {
    x: player.x,
    y: player.y - 48,
    length,
    width,
  };
}

function getMawHit(bullet) {
  const maw = getMawZone();
  const ahead = maw.y - bullet.y;
  if (ahead < -10 || ahead > maw.length) return null;

  const progress = clamp(ahead / maw.length, 0, 1);
  const halfWidth = maw.width * (0.58 + progress * 0.72);
  const lateral = Math.abs(bullet.x - maw.x);
  if (lateral > halfWidth + bullet.r) return null;

  const mouthDistance = Math.hypot(bullet.x - maw.x, bullet.y - maw.y);
  return {
    maw,
    progress,
    lateral,
    halfWidth,
    pull: clamp(1 - ahead / maw.length, 0.36, 1),
    mouthDistance,
  };
}

function storeBullet(bullet) {
  const player = state.player;
  const form = state.currentForm || selectedForm();
  const maxStored = 10 + state.upgrades.storedBonus;
  if (player.swallowed.length >= maxStored) {
    player.swallowed.shift();
  }

  player.swallowed.push({
    color: bullet.color,
    power: bullet.power,
    radius: bullet.r,
  });
  const absorbBonus = form.id === "devour" ? 1.2 : 1;
  player.charge = clamp(player.charge + bullet.power * 1.35 * absorbBonus, 0, player.maxCharge);
  state.ultimateCharge = clamp(state.ultimateCharge + bullet.power * 0.85 * absorbBonus, 0, 100);
  state.score += 24;
  addParticles(bullet.x, bullet.y, 12, bullet.color, 230);
  addSwallowBurst(player.x, player.y - 48, bullet.color);
  state.shake = Math.max(state.shake, 0.04);

  if (player.charge >= player.maxCharge) {
    ui.absorbButton.classList.add("is-ready");
  }
}

function nearestEnemy(x, y) {
  let best = null;
  let bestDistance = Infinity;
  for (const enemy of state.enemies) {
    const distance = dist2(x, y, enemy.x, enemy.y);
    if (distance < bestDistance) {
      best = enemy;
      bestDistance = distance;
    }
  }
  return best;
}

function spawnEnemy(kind = "normal") {
  const wave = state.wave;
  const roll = Math.random();
  const mods = stageMods();
  const enemy = {
    x: rand(34, state.w - 34),
    y: -34,
    phase: rand(0, TAU),
    shoot: rand(0.6, 1.4),
    pattern: "single",
    color: "#ff6b6b",
    score: 90,
    kind,
    hazard: rand(2.6, 4.2),
  };

  if (kind === "boss") {
    Object.assign(enemy, {
      type: "boss",
      r: 38,
      hp: 520 + wave * 70 + state.currentStage.power,
      speed: 16,
      pattern: "fan",
      color: state.currentStage.theme,
      score: 1200,
      shoot: 0.7,
      hazard: 1.8,
      name: state.currentStage.boss,
    });
  } else if (kind === "elite") {
    Object.assign(enemy, {
      type: "elite",
      r: 29,
      hp: 190 + wave * 28,
      speed: 28 + wave * 2,
      pattern: roll < 0.5 ? "fan" : "spray",
      color: "#ffd166",
      score: 430,
      hazard: 2.3,
    });
  } else if (roll < 0.18 + wave * 0.015) {
    Object.assign(enemy, {
      type: "brute",
      r: 24,
      hp: 72 + wave * 8,
      speed: 38 + wave * 3,
      pattern: "fan",
      color: "#ffd166",
      score: 160,
    });
  } else if (roll < 0.46) {
    Object.assign(enemy, {
      type: "skimmer",
      r: 15,
      hp: 30 + wave * 4,
      speed: 86 + wave * 6,
      pattern: "spray",
      color: "#9b7cff",
      score: 115,
    });
  } else {
    Object.assign(enemy, {
      type: "wisp",
      r: 18,
      hp: 42 + wave * 5,
      speed: 58 + wave * 4,
      pattern: wave > 3 && roll > 0.82 ? "fan" : "single",
      color: "#42efd2",
      score: 125,
    });
  }

  enemy.hp = Math.round(enemy.hp * (mods.enemyHp || 1));
  enemy.speed *= mods.enemySpeed || 1;
  enemy.hazard *= mods.hazardDelay || 1;
  enemy.maxHp = enemy.hp;
  if (kind === "boss") {
    state.currentBoss = enemy;
  }
  state.enemies.push(enemy);
}

function fireEnemyBullet(enemy, angle, speed, radius = 6, color = enemy.color) {
  const mods = stageMods();
  const drift = mods.bulletDrift ? Math.sin(state.time * 1.7 + enemy.phase) * 34 : 0;
  state.bullets.push({
    x: enemy.x,
    y: enemy.y + enemy.r * 0.7,
    vx: Math.cos(angle) * speed * (mods.bulletSpeed || 1) + drift,
    vy: Math.sin(angle) * speed * (mods.bulletSpeed || 1),
    r: radius * (mods.bulletSize || 1),
    color,
    power: radius > 7 ? 11 : 7,
    spin: rand(0, TAU),
    swallowed: false,
  });
}

function enemyShoot(enemy) {
  const player = state.player;
  const angleToPlayer = Math.atan2(player.y - enemy.y, player.x - enemy.x);
  const speed = 145 + state.wave * 9;

  if (enemy.pattern === "fan") {
    for (const offset of [-0.48, -0.24, 0, 0.24, 0.48]) {
      fireEnemyBullet(enemy, angleToPlayer + offset, speed * 0.9, 7);
    }
  } else if (enemy.pattern === "spray") {
    for (let i = -2; i <= 2; i += 1) {
      fireEnemyBullet(enemy, Math.PI / 2 + i * 0.2 + Math.sin(state.time + enemy.phase) * 0.16, speed * 0.98, 5);
    }
  } else {
    fireEnemyBullet(enemy, angleToPlayer - 0.14, speed, 6);
    fireEnemyBullet(enemy, angleToPlayer + 0.14, speed, 6);
  }
}

function spawnEnemyHazard(enemy) {
  const player = state.player;
  const color = enemy.kind === "boss" ? state.currentStage.theme : enemy.color;
  const mods = stageMods();
  const laserChance = clamp(0.58 + (1 - (mods.laserRate || 1)) * 0.36, 0.36, 0.86);
  if (enemy.kind === "boss" && Math.random() < laserChance) {
    state.hazards.push({
      type: "laser",
      x: clamp(player.x + rand(-34, 34), 26, state.w - 26),
      width: 30 + state.wave * 2,
      warning: 0.9 * (mods.hazardDelay || 1),
      duration: 0.48,
      life: 1.38 * (mods.hazardDelay || 1),
      damage: 2,
      color,
      hit: false,
    });
  } else {
    state.hazards.push({
      type: "blast",
      x: clamp(player.x + rand(-42, 42), 42, state.w - 42),
      y: clamp(player.y + rand(-34, 24), 140, state.h - 92),
      r: enemy.kind === "boss" ? 72 : 54,
      warning: (enemy.kind === "boss" ? 1.0 : 0.82) * (mods.hazardDelay || 1),
      duration: 0.44,
      life: (enemy.kind === "boss" ? 1.44 : 1.26) * (mods.hazardDelay || 1),
      damage: enemy.kind === "boss" ? 2 : 1,
      color,
      hit: false,
    });
  }
}

function firePlayerShots() {
  const player = state.player;
  const spread = state.upgrades.shotSpread;
  const form = state.currentForm || selectedForm();
  const offsets = spread === 1 ? [0] : spread === 2 ? [-8, 8] : [-15, 0, 15];

  for (const offset of offsets) {
    state.shots.push({
      x: player.x + offset,
      y: player.y - 50,
      vx: offset * 2.2,
      vy: -510,
      r: 4.8,
      damage: state.upgrades.shotDamage * (form.id === "flare" ? 1.08 : 1),
      color: form.id === "flare" ? "#ffd166" : offset === 0 ? "#42efd2" : "#ffd166",
    });
  }
}

function releaseBreath() {
  const player = state.player;
  if (!player || state.mode !== "playing") return;
  if (player.charge < 14) {
    player.releasePulse = Math.max(player.releasePulse || 0, 0.18);
    return;
  }

  const charge = player.charge;
  const stored = player.swallowed.splice(0);
  const fallbackCount = stored.length ? 0 : Math.max(2, Math.floor(charge / 26));
  const payload = stored.length
    ? stored
    : Array.from({ length: fallbackCount }, () => ({ color: "#ffd166", power: 8, radius: 6 }));
  const count = Math.min(payload.length, 12 + state.upgrades.storedBonus);

  for (let i = 0; i < count; i += 1) {
    const item = payload[i];
    const middle = (count - 1) / 2;
    const spread = count <= 1 ? 0 : (i - middle) * 0.13;
    state.shots.push({
      x: player.x + spread * 48,
      y: player.y - 54,
      vx: Math.sin(spread) * 180,
      vy: -460 - charge * 1.2,
      r: 7 + item.radius * 0.22,
      damage: (state.upgrades.shotDamage + item.power * 5.8 + charge * 0.22) * state.upgrades.counterMult,
      color: item.color,
      homing: true,
      turn: 5.2,
      life: 2.6,
    });
  }

  const breathThreshold = state.currentForm?.id === "flare" ? player.maxCharge * 0.58 : player.maxCharge * 0.86;
  if (charge >= breathThreshold) {
    state.breaths.push({
      x: player.x,
      width: 46 + charge * (state.currentForm?.id === "flare" ? 0.48 : 0.36),
      life: 0.34 + charge * 0.0025,
      maxLife: 0.34 + charge * 0.0025,
      damage: (140 + charge * (state.currentForm?.id === "flare" ? 1.9 : 1.6)) * state.upgrades.counterMult,
    });
  }

  addParticles(player.x, player.y - 18, 34, "#ffd166", 220);
  state.shake = Math.max(state.shake, 12);
  state.flash = 0.18;
  player.releasePulse = 1;
  player.charge = 0;
  ui.absorbButton.classList.remove("is-ready");
}

function tryActivateUltimate() {
  if (state.mode !== "playing" || state.ultimateCooldown > 0 || state.ultimateActive) return;
  const artifactMeta = getArtifactMeta(state.currentArtifact);
  if ((!artifactMeta.unlocked && !state.ultimateDemo) || state.ultimateCharge < 100) return;

  const player = state.player;
  const dragonId = state.currentDragon.id;
  const duration = 4.4 + artifactMeta.level * 0.28;
  state.ultimateCharge = 0;
  state.ultimateCooldown = duration + 4.8;
  state.ultimateActive = {
    dragonId,
    level: artifactMeta.level,
    time: duration,
    maxTime: duration,
    tick: 0,
    phase: rand(0, TAU),
  };
  state.flash = 0.18;
  state.shake = Math.max(state.shake, 10);
  player.releasePulse = 1;
  if (dragonId === "jade") {
    player.hp = Math.min(player.maxHp, player.hp + 2 + artifactMeta.level * 0.6);
  }
  addParticles(player.x, player.y - 34, 48, state.currentDragon.colors[1], 240);
  showWaveBanner(state.currentDragon.ultimateName);
  updateHud();
}

function updateUltimate(dt) {
  const active = state.ultimateActive;
  if (!active || state.mode !== "playing") return;
  const player = state.player;
  const dragon = state.currentDragon;
  const levelMult = 1 + active.level * 0.16;
  active.time -= dt;
  active.tick -= dt;
  active.phase += dt * 2.8;

  if (active.dragonId === "jade") {
    player.hp = Math.min(player.maxHp, player.hp + dt * (0.35 + active.level * 0.08));
  }

  if (active.dragonId === "metal") {
    absorbOrShatterBullets(player.x, player.y, 170 + active.level * 9, false, "#b8c0c8");
  } else if (active.dragonId === "tide" || active.dragonId === "void") {
    absorbOrShatterBullets(player.x, player.y, active.dragonId === "void" ? 255 : 215, true, dragon.colors[1]);
  } else if (active.dragonId === "frost") {
    for (const enemy of state.enemies) {
      enemy.shoot += dt * 0.48;
    }
  }

  if (active.tick <= 0) {
    emitUltimatePulse(active, levelMult);
    active.tick = active.dragonId === "volt" ? 0.09 : active.dragonId === "ember" ? 0.16 : 0.12;
  }

  if (active.time <= 0) {
    state.ultimateActive = null;
  }
}

function absorbOrShatterBullets(x, y, radius, store, color) {
  for (let i = state.bullets.length - 1; i >= 0; i -= 1) {
    const bullet = state.bullets[i];
    if (dist2(bullet.x, bullet.y, x, y) >= radius ** 2) continue;
    if (store) {
      storeBullet(bullet);
    }
    addParticles(bullet.x, bullet.y, 4, color, 110);
    state.bullets.splice(i, 1);
  }
}

function emitUltimatePulse(active, levelMult) {
  const player = state.player;
  const dragonId = active.dragonId;
  const [main, accent] = state.currentDragon.colors;
  const progress = 1 - active.time / active.maxTime;
  const wave = Math.sin(active.phase + progress * TAU);
  const widthByDragon = {
    astral: 94,
    ember: 72,
    tide: 112,
    jade: 86,
    volt: 68,
    frost: 118,
    shadow: 82,
    metal: 128,
    bloom: 104,
    void: 132,
  };
  const damageByDragon = {
    astral: 72,
    ember: 118,
    tide: 64,
    jade: 58,
    volt: 52,
    frost: 62,
    shadow: 86,
    metal: 74,
    bloom: 76,
    void: 92,
  };

  state.breaths.push({
    x: clamp(player.x + wave * 22, 28, state.w - 28),
    width: (widthByDragon[dragonId] || 92) * levelMult,
    life: 0.32,
    maxLife: 0.32,
    damage: (damageByDragon[dragonId] || 72) * state.upgrades.counterMult * levelMult,
    colorA: main,
    colorB: accent,
    ultimate: true,
  });

  const shotCountByDragon = {
    astral: 3,
    ember: 2,
    tide: 2,
    jade: 2,
    volt: 4,
    frost: 2,
    shadow: 3,
    metal: 2,
    bloom: 3,
    void: 4,
  };
  const count = shotCountByDragon[dragonId] || 3;
  for (let i = 0; i < count; i += 1) {
    const middle = (count - 1) / 2;
    const lane = i - middle;
    const angle = -Math.PI / 2 + lane * (dragonId === "ember" ? 0.09 : dragonId === "volt" ? 0.18 : 0.24) + wave * 0.05;
    const fromEnemy = dragonId === "shadow" || dragonId === "bloom" || dragonId === "void";
    const target = fromEnemy ? nearestEnemy(player.x, player.y) : null;
    const speed = dragonId === "volt" ? 720 : dragonId === "metal" ? 430 : dragonId === "ember" ? 500 : 560;
    state.shots.push({
      x: target ? target.x + lane * 22 : player.x + lane * 16,
      y: target ? target.y + 18 : player.y - 56,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: dragonId === "ember" ? 12 : dragonId === "metal" ? 13 : dragonId === "volt" ? 6 : 8,
      damage: (34 + state.upgrades.shotDamage * (dragonId === "ember" ? 1.5 : 1.1)) * state.upgrades.counterMult * levelMult,
      color: i % 2 ? accent : main,
      homing: dragonId !== "metal" && dragonId !== "ember",
      turn: dragonId === "volt" || dragonId === "void" ? 8 : 4.8,
      life: dragonId === "ember" ? 1.2 : 2.2,
      burn: dragonId === "bloom" || dragonId === "ember",
      slow: dragonId === "frost" || dragonId === "tide",
    });
  }

  if (dragonId === "shadow" || dragonId === "void" || dragonId === "metal") {
    const radius = dragonId === "void" ? 230 : 175;
    for (const enemy of state.enemies) {
      if (dist2(enemy.x, enemy.y, player.x, player.y) < radius ** 2) {
        enemy.hp -= (dragonId === "metal" ? 32 : 48) * levelMult;
      }
    }
  }

  addParticles(player.x + wave * 12, player.y - 44, dragonId === "volt" ? 6 : 4, accent, 180);
}

function updatePlayer(dt) {
  const player = state.player;
  if (!player) return;

  let keyX = 0;
  let keyY = 0;
  if (input.keys.has("ArrowLeft") || input.keys.has("a")) keyX -= 1;
  if (input.keys.has("ArrowRight") || input.keys.has("d")) keyX += 1;
  if (input.keys.has("ArrowUp") || input.keys.has("w")) keyY -= 1;
  if (input.keys.has("ArrowDown") || input.keys.has("s")) keyY += 1;

  const speedMult = activeDragonStats().speed;
  const speed = (input.absorbing ? 230 : 330) * speedMult;
  if (keyX || keyY) {
    const length = Math.hypot(keyX, keyY) || 1;
    player.x += (keyX / length) * speed * dt;
    player.y += (keyY / length) * speed * dt;
    input.target = { x: player.x, y: player.y };
  } else if (input.target) {
    const follow = input.absorbing ? 8 : 12;
    player.x = lerp(player.x, input.target.x, 1 - Math.exp(-follow * dt));
    player.y = lerp(player.y, input.target.y, 1 - Math.exp(-follow * dt));
  }

  player.x = clamp(player.x, 26, state.w - 26);
  player.y = clamp(player.y, 94, state.h - 78);
  player.invulnerable = Math.max(0, player.invulnerable - dt);
  player.absorbTime = input.absorbing ? player.absorbTime + dt : Math.max(0, player.absorbTime - dt * 4);
  player.releasePulse = Math.max(0, (player.releasePulse || 0) - dt * 3.2);

  if (!input.absorbing) {
    state.upgrades.shotTimer -= dt;
    if (state.upgrades.shotTimer <= 0) {
      firePlayerShots();
      state.upgrades.shotTimer = state.upgrades.shotCooldown;
    }
  }
}

function updateEnemies(dt) {
  for (let i = state.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = state.enemies[i];
    enemy.y += enemy.speed * dt;
    enemy.x += Math.sin(state.time * 1.35 + enemy.phase) * (enemy.type === "skimmer" ? 74 : 34) * dt;
    enemy.x = clamp(enemy.x, enemy.r + 8, state.w - enemy.r - 8);
    enemy.shoot -= dt;
    enemy.hazard -= dt;

    if (enemy.y > 32 && enemy.shoot <= 0) {
      enemyShoot(enemy);
      enemy.shoot = enemy.type === "brute" ? rand(1.05, 1.55) : rand(0.82, 1.34);
    }

    if (enemy.y > 72 && enemy.kind !== "normal" && enemy.hazard <= 0) {
      spawnEnemyHazard(enemy);
      enemy.hazard = enemy.kind === "boss" ? rand(2.0, 3.0) : rand(3.1, 4.5);
    }

    if (dist2(enemy.x, enemy.y, state.player.x, state.player.y) < (enemy.r + state.player.r) ** 2) {
      damagePlayer(2);
      enemy.hp = 0;
    }

    if (enemy.hp <= 0) {
      defeatEnemy(enemy);
      state.enemies.splice(i, 1);
    } else if (enemy.y > state.h + 52) {
      state.enemies.splice(i, 1);
    }
  }
}

function defeatEnemy(enemy) {
  state.score += enemy.score;
  state.kills += 1;
  state.stageKills += enemy.kind === "boss" ? 5 : enemy.kind === "elite" ? 3 : 1;
  state.ultimateCharge = clamp(state.ultimateCharge + (enemy.kind === "boss" ? 100 : enemy.kind === "elite" ? 24 : 8), 0, 100);
  state.player.charge = clamp(state.player.charge + 2, 0, state.player.maxCharge);
  addParticles(enemy.x, enemy.y, enemy.type === "brute" ? 30 : 18, enemy.color, 190);
  if (state.currentDragon?.id === "jade") {
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 0.15);
  }
  if (enemy.kind === "boss") {
    completeStage();
    return;
  }
  if (state.kills >= state.nextUpgrade) {
    openUpgrade();
  }
}

function damagePlayer(amount) {
  const player = state.player;
  if (player.invulnerable > 0 || state.mode !== "playing") return;
  if (input.absorbing && state.currentDragon?.id === "metal") {
    amount = Math.max(0.5, amount * 0.65);
  }
  player.hp -= amount;
  player.invulnerable = 1.05;
  state.shake = Math.max(state.shake, 9);
  addParticles(player.x, player.y, 18, "#ff6b6b", 170);
  if (player.hp <= 0) {
    endRun();
  }
}

function completeStage() {
  const stage = state.currentStage;
  const index = stageIndex(stage);
  const bonus = Math.floor(state.score / 100);
  state.meta.gold += stage.gold + bonus;
  state.meta.scales += stage.scales;
  state.meta.highestStageIndex = Math.max(state.meta.highestStageIndex, Math.min(index + 1, STAGES.length - 1));
  state.meta.clearedStages[stage.id] = true;
  saveMeta();
  state.mode = "clear";
  state.currentBoss = null;
  state.ultimateActive = null;
  state.ultimateDemo = false;
  input.absorbing = false;
  ui.absorbButton.classList.remove("is-active", "is-ready");
  ui.ultimateButton.classList.remove("is-ready");
  hideWaveBanner();
  updateBossHud();
  ui.endLabel.textContent = `第${stage.chapter}章 clear`;
  ui.endTitle.textContent = stage.chapterTitle;
  ui.finalScore.textContent = `${stage.storyClear} +${stage.gold + bonus}金 / +${stage.scales}晶`;
  ui.restartButton.textContent = "回主畫面";
  ui.endOverlay.classList.add("active");
}

function showHome() {
  state.mode = "home";
  input.absorbing = false;
  input.pointerId = null;
  state.ultimateActive = null;
  state.ultimateDemo = false;
  state.enemies = [];
  state.bullets = [];
  state.shots = [];
  state.hazards = [];
  state.particles = [];
  state.breaths = [];
  state.currentBoss = null;
  state.currentForm = null;
  state.runSkills = {};
  ui.endOverlay.classList.remove("active");
  ui.upgradeOverlay.classList.remove("active");
  ui.startOverlay.classList.add("active");
  ui.absorbButton.classList.remove("is-active", "is-ready");
  ui.ultimateButton.classList.remove("is-ready");
  hideWaveBanner();
  updateBossHud();
  renderSkillHud();
  ui.restartButton.textContent = "重新開始";
  state.meta.idleGold += calculateIdleGold(state.meta.lastSeenAt);
  saveMeta();
  renderHome();
}

function updateBullets(dt) {
  const player = state.player;

  for (let i = state.bullets.length - 1; i >= 0; i -= 1) {
    const bullet = state.bullets[i];
    bullet.spin += dt * 5;
    bullet.absorbT = Math.max(0, (bullet.absorbT || 0) - dt * 2.2);
    bullet.absorbSnap = Math.max(0, (bullet.absorbSnap || 0) - dt * 3);

    if (input.absorbing) {
      const hit = getMawHit(bullet);
      if (hit) {
        const dx = hit.maw.x - bullet.x;
        const dy = hit.maw.y - bullet.y;
        const distance = Math.hypot(dx, dy) || 1;
        const tangentX = -dy / distance;
        const tangentY = dx / distance;
        const vortexSide = bullet.vortexSide || (Math.random() < 0.5 ? -1 : 1);
        const vortexGrip = clamp(1 - hit.mouthDistance / Math.max(96, hit.maw.width * 2.8), 0.26, 1);
        const mouthSnap = 1 - smoothstep(22 + bullet.r, Math.max(86, hit.maw.width * 2.1), hit.mouthDistance);
        const pull = (1320 + state.wave * 28) * (0.72 + hit.pull * 0.88) * (1 + vortexGrip * 0.62 + mouthSnap * 1.2);
        const swirl = vortexSide * (340 + hit.progress * 240 + hit.pull * 230) * vortexGrip * (1 - mouthSnap * 0.28);
        bullet.vortexSide = vortexSide;
        bullet.absorbT = clamp(Math.max(bullet.absorbT || 0, 0.26) + dt * (7 + hit.pull * 8 + vortexGrip * 3), 0, 1);
        bullet.absorbProgress = hit.progress;
        bullet.absorbWidth = hit.halfWidth;
        bullet.absorbMouthDistance = hit.mouthDistance;
        bullet.absorbSnap = mouthSnap;
        bullet.vx += (dx / distance) * pull * dt;
        bullet.vy += (dy / distance) * pull * dt;
        bullet.vx += tangentX * swirl * dt;
        bullet.vy += tangentY * swirl * dt;
        bullet.vx *= 1 - dt * 0.18;
        bullet.vy *= 1 - dt * 0.18;
        const speed = Math.hypot(bullet.vx, bullet.vy);
        const maxSwallowSpeed = 820 + hit.pull * 420 + mouthSnap * 620;
        if (speed > maxSwallowSpeed) {
          const scale = maxSwallowSpeed / speed;
          bullet.vx *= scale;
          bullet.vy *= scale;
        }
        bullet.spin += dt * vortexSide * (18 + hit.pull * 24 + mouthSnap * 18);

        if (hit.mouthDistance < 26 + bullet.r + mouthSnap * 10) {
          storeBullet(bullet);
          state.bullets.splice(i, 1);
          continue;
        }
      }
    }

    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;

    if (input.absorbing) {
      const hit = getMawHit(bullet);
      if (hit && hit.mouthDistance < 26 + bullet.r + (bullet.absorbSnap || 0) * 10) {
        storeBullet(bullet);
        state.bullets.splice(i, 1);
        continue;
      }
    }

    if (dist2(bullet.x, bullet.y, player.x, player.y) < (bullet.r + player.r * 0.72) ** 2) {
      if (state.absorbDemo && bullet.demo) {
        state.bullets.splice(i, 1);
        continue;
      }
      damagePlayer(1);
      state.bullets.splice(i, 1);
      continue;
    }

    if (bullet.x < -40 || bullet.x > state.w + 40 || bullet.y < -60 || bullet.y > state.h + 60) {
      state.bullets.splice(i, 1);
    }
  }
}

function updateShots(dt) {
  for (let i = state.shots.length - 1; i >= 0; i -= 1) {
    const shot = state.shots[i];
    if (shot.life != null) {
      shot.life -= dt;
      if (shot.life <= 0) {
        state.shots.splice(i, 1);
        continue;
      }
    }

    if (shot.homing) {
      const target = nearestEnemy(shot.x, shot.y);
      if (target) {
        const angle = Math.atan2(target.y - shot.y, target.x - shot.x);
        const speed = Math.hypot(shot.vx, shot.vy) || 520;
        const desiredVx = Math.cos(angle) * speed;
        const desiredVy = Math.sin(angle) * speed;
        const steer = 1 - Math.exp(-shot.turn * dt);
        shot.vx = lerp(shot.vx, desiredVx, steer);
        shot.vy = lerp(shot.vy, desiredVy, steer);
      }
    }

    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;

    let used = false;
    for (const enemy of state.enemies) {
      if (dist2(shot.x, shot.y, enemy.x, enemy.y) < (shot.r + enemy.r) ** 2) {
        enemy.hp -= shot.damage;
        const slowPower = state.upgrades.slowPower || 0;
        const splashBurn = state.upgrades.splashBurn || 0;
        if (shot.slow || slowPower) {
          enemy.shoot += (shot.slow ? 0.45 : 0) + slowPower * 0.14;
        }
        if (shot.burn || splashBurn) {
          const splashRadius = shot.burn ? 92 : 58 + splashBurn * 11;
          const splashDamage = shot.burn ? 0.28 : 0.1 + splashBurn * 0.045;
          addParticles(enemy.x, enemy.y, 10, "#ffd166", 110);
          for (const nearby of state.enemies) {
            if (nearby !== enemy && dist2(enemy.x, enemy.y, nearby.x, nearby.y) < splashRadius ** 2) {
              nearby.hp -= shot.damage * splashDamage;
            }
          }
        }
        addParticles(shot.x, shot.y, 4, shot.color, 80);
        used = true;
        break;
      }
    }

    if (used || shot.y < -40 || shot.x < -50 || shot.x > state.w + 50 || shot.y > state.h + 50) {
      state.shots.splice(i, 1);
    }
  }
}

function updateBreaths(dt) {
  for (let i = state.breaths.length - 1; i >= 0; i -= 1) {
    const breath = state.breaths[i];
    breath.life -= dt;

    for (const enemy of state.enemies) {
      const beamWidth = breath.width * (0.55 + breath.life / breath.maxLife * 0.45);
      const withinX = Math.abs(enemy.x - breath.x) < beamWidth / 2 + enemy.r;
      if (withinX && enemy.y < state.player.y + 4) {
        enemy.hp -= breath.damage * dt;
      }
    }

    if (breath.life <= 0) {
      state.breaths.splice(i, 1);
    }
  }
}

function updateHazards(dt) {
  const player = state.player;
  for (let i = state.hazards.length - 1; i >= 0; i -= 1) {
    const hazard = state.hazards[i];
    hazard.life -= dt;
    const active = hazard.life <= hazard.duration;

    if (active && !hazard.hit) {
      if (hazard.type === "laser") {
        if (Math.abs(player.x - hazard.x) < hazard.width / 2 + player.r * 0.55) {
          damagePlayer(hazard.damage);
          hazard.hit = true;
        }
      } else if (dist2(player.x, player.y, hazard.x, hazard.y) < (hazard.r + player.r * 0.55) ** 2) {
        damagePlayer(hazard.damage);
        hazard.hit = true;
      }
    }

    if (hazard.life <= 0) {
      state.hazards.splice(i, 1);
    }
  }
}

function updateParticles(dt) {
  for (let i = state.particles.length - 1; i >= 0; i -= 1) {
    const p = state.particles[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 1 - dt * 1.8;
    p.vy *= 1 - dt * 1.8;
    if (p.life <= 0) {
      state.particles.splice(i, 1);
    }
  }

  for (let i = state.swallowBursts.length - 1; i >= 0; i -= 1) {
    const burst = state.swallowBursts[i];
    burst.life -= dt;
    if (burst.life <= 0) {
      state.swallowBursts.splice(i, 1);
    }
  }
}

function updateStars(dt) {
  for (const star of state.stars) {
    star.y += (22 + state.wave * 2) * star.z * dt;
    if (star.y > state.h + 4) {
      star.x = Math.random() * state.w;
      star.y = -8;
    }
  }
}

function update(dt) {
  updateStars(dt);
  if (state.mode !== "playing") return;

  state.time += dt;
  state.stageElapsed += dt;
  const stageWaveSeconds = state.currentStage?.waveSeconds || 20;
  const totalStageSeconds = (state.currentStage?.waves || 1) * stageWaveSeconds;
  state.wave = Math.min(state.currentStage?.waves || 1, 1 + Math.floor(state.stageElapsed / stageWaveSeconds));
  state.spawnTimer -= dt;
  state.shake = Math.max(0, state.shake - dt * 22);
  state.flash = Math.max(0, state.flash - dt);
  state.ultimateCooldown = Math.max(0, state.ultimateCooldown - dt);
  state.waveBannerTimer = Math.max(0, state.waveBannerTimer - dt);
  ui.waveBanner.classList.toggle("active", state.waveBannerTimer > 0);

  if (state.absorbDemo) {
    maintainAbsorbDemo(dt);
  }

  tryActivateUltimate();
  updateUltimate(dt);

  if (!state.bossSpawned && state.wave !== state.announcedWave) {
    state.announcedWave = state.wave;
    showWaveBanner(`Wave ${state.wave} / ${state.currentStage.waves}`);
  }

  if (!state.bossSpawned && state.stageElapsed >= totalStageSeconds) {
    spawnEnemy("boss");
    state.bossSpawned = true;
    showWaveBanner("Boss 來襲");
    state.spawnTimer = 2.4;
  } else if (!state.bossSpawned && state.elitesSpawned < state.currentStage.waves - 1) {
    const eliteWave = state.elitesSpawned + 2;
    const killPressure = state.stageKills >= (state.elitesSpawned + 1) * 12;
    if (state.wave >= eliteWave || killPressure) {
      spawnEnemy("elite");
      state.elitesSpawned += 1;
      state.spawnTimer = 1.4;
    }
  }

  if (!state.bossSpawned && state.spawnTimer <= 0) {
    spawnEnemy();
    const pace = Math.max(0.42, 1.18 - state.wave * 0.055);
    state.spawnTimer = rand(pace * 0.68, pace * 1.18);
  }

  updatePlayer(dt);
  updateEnemies(dt);
  updateBullets(dt);
  updateShots(dt);
  updateBreaths(dt);
  updateHazards(dt);
  updateParticles(dt);
  updateHud();
}

function renderSkillHud() {
  ui.skillHud.innerHTML = "";
  for (const skill of RUN_SKILLS) {
    const level = state.runSkills[skill.id] || 0;
    if (!level) continue;
    const chip = document.createElement("span");
    chip.className = "skill-chip active";
    chip.innerHTML = `<span>${skill.element}</span><strong>${skill.title} ${level}</strong>`;
    ui.skillHud.append(chip);
  }
}

function updateBossHud() {
  const boss = state.currentBoss && state.enemies.includes(state.currentBoss) ? state.currentBoss : null;
  state.currentBoss = boss;
  ui.bossHud.classList.toggle("active", Boolean(boss && state.mode === "playing"));
  if (!boss) return;
  ui.bossName.textContent = boss.name || "裂隙巨龍";
  ui.bossHpFill.style.transform = `scaleX(${clamp(boss.hp / boss.maxHp, 0, 1)})`;
}

function showWaveBanner(text) {
  ui.waveBanner.textContent = text;
  ui.waveBanner.classList.add("active");
  state.waveBannerTimer = 1.45;
}

function hideWaveBanner() {
  state.waveBannerTimer = 0;
  ui.waveBanner.textContent = "";
  ui.waveBanner.classList.remove("active");
}

function updateHud() {
  const player = state.player || createPlayer();
  ui.score.textContent = Math.floor(state.score).toLocaleString("zh-TW");
  if (state.currentStage) {
    const waveSeconds = state.currentStage.waveSeconds || 20;
    const remaining = state.bossSpawned ? 0 : Math.max(1, Math.ceil(waveSeconds - (state.stageElapsed % waveSeconds)));
    const totalStageSeconds = state.currentStage.waves * waveSeconds;
    ui.waveFill.style.transform = `scaleX(${clamp(state.stageElapsed / totalStageSeconds, 0, 1)})`;
    ui.wave.textContent = state.bossSpawned ? "Boss" : `${state.wave}/${state.currentStage.waves} · ${remaining}s`;
  } else {
    ui.wave.textContent = state.wave;
    ui.waveFill.style.transform = "scaleX(0)";
  }
  ui.kills.textContent = state.kills;
  ui.hpFill.style.transform = `scaleX(${clamp(player.hp / player.maxHp, 0, 1)})`;
  ui.chargeFill.style.transform = `scaleX(${clamp(player.charge / player.maxCharge, 0, 1)})`;
  ui.absorbButton.textContent = input.absorbing ? "吞" : player.charge >= 14 ? "吐" : "吞";
  ui.absorbButton.classList.toggle("is-ready", player.charge >= player.maxCharge * 0.86 && state.mode === "playing");
  const artifact = state.currentArtifact || selectedArtifact();
  const artifactMeta = state.meta?.artifacts?.[artifact.id];
  const ultimateReady =
    state.mode === "playing" && artifactMeta?.unlocked && state.ultimateCharge >= 100 && state.ultimateCooldown <= 0;
  ui.ultimateButton.classList.toggle("is-ready", ultimateReady);
  updateBossHud();
}

function drawBackground() {
  const stage = state.currentStage || selectedStage();
  const bgColors = stage.bg || STAGES[0].bg;
  const bg = ctx.createLinearGradient(0, 0, 0, state.h);
  bg.addColorStop(0, bgColors[0]);
  bg.addColorStop(0.45, bgColors[1]);
  bg.addColorStop(1, bgColors[2]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, state.w, state.h);

  ctx.save();
  ctx.globalAlpha = 0.12;
  for (let y = -120; y < state.h + 120; y += 92) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(state.time + y * 0.02) * 14);
    for (let x = 0; x <= state.w; x += 42) {
      ctx.lineTo(x, y + Math.sin(state.time * 0.9 + x * 0.025 + y * 0.018) * 18);
    }
    ctx.strokeStyle = y % 184 === 0 ? stage.theme : "#ff6b6b";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();

  drawStageThemeProps(stage);

  for (const star of state.stars) {
    ctx.globalAlpha = 0.22 + star.z * 0.62;
    ctx.fillStyle = star.hue;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawStageThemeProps(stage) {
  const theme = stage.theme || "#42efd2";
  const accent = stage.bg?.[1] || "#111827";
  const artId = stage.artId || "valley";
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  if (artId === "reef") {
    for (let i = 0; i < 14; i += 1) {
      const x = ((i * 83 + state.time * 12) % (state.w + 90)) - 45;
      const y = (i * 71 + Math.sin(state.time * 0.7 + i) * 16) % state.h;
      const r = 5 + (i % 4) * 3;
      ctx.globalAlpha = 0.12 + (i % 3) * 0.04;
      ctx.strokeStyle = i % 2 ? theme : "#7defff";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.stroke();
    }
    for (let i = 0; i < 5; i += 1) {
      const x = (i + 0.5) * state.w / 5;
      const y = state.h - 28 - (i % 2) * 22;
      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = theme;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x - 18, y - 38, x - 6, y - 72);
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 22, y - 32, x + 14, y - 66);
      ctx.stroke();
    }
  } else if (artId === "forge") {
    for (let i = 0; i < 8; i += 1) {
      const y = (i * 118 + state.time * 18) % (state.h + 90) - 45;
      const x = i % 2 ? state.w - 18 : 18;
      ctx.globalAlpha = 0.13;
      ctx.fillStyle = i % 2 ? "#ff6b6b" : theme;
      ctx.beginPath();
      ctx.moveTo(x, y - 54);
      ctx.lineTo(x + (i % 2 ? -46 : 46), y);
      ctx.lineTo(x, y + 54);
      ctx.closePath();
      ctx.fill();
    }
    for (let i = 0; i < 16; i += 1) {
      const x = (i * 49 + Math.sin(state.time + i) * 18) % state.w;
      const y = (state.h - ((state.time * 95 + i * 67) % (state.h + 80))) + 40;
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#ffd166";
      ctx.beginPath();
      ctx.arc(x, y, 1.5 + (i % 3), 0, TAU);
      ctx.fill();
    }
  } else if (artId === "spire") {
    for (let i = 0; i < 6; i += 1) {
      const x = state.w * (0.12 + i * 0.16);
      const sway = Math.sin(state.time * 1.2 + i) * 8;
      ctx.globalAlpha = 0.13;
      ctx.strokeStyle = i % 2 ? "#ffd166" : theme;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + sway, -20);
      for (let y = 0; y <= state.h + 40; y += 70) {
        ctx.lineTo(x + sway + Math.sin(y * 0.05 + state.time * 2 + i) * 14, y);
      }
      ctx.stroke();
    }
    for (let i = 0; i < 4; i += 1) {
      const y = state.h * (0.18 + i * 0.19);
      ctx.globalAlpha = 0.09;
      ctx.fillStyle = theme;
      ctx.beginPath();
      ctx.moveTo(state.w * 0.5, y - 34);
      ctx.lineTo(state.w * 0.5 + 34, y + 24);
      ctx.lineTo(state.w * 0.5 - 34, y + 24);
      ctx.closePath();
      ctx.fill();
    }
  } else if (artId === "rift") {
    for (let i = 0; i < 7; i += 1) {
      const x = (i * 77 + state.time * 9) % (state.w + 80) - 40;
      const y = state.h * (0.14 + (i % 6) * 0.14);
      const spin = state.time * 0.6 + i;
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = i % 2 ? theme : "#ff8ab3";
      ctx.beginPath();
      for (let p = 0; p < 5; p += 1) {
        const angle = spin + p * TAU / 5;
        const r = p % 2 ? 13 : 24;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r * 1.45;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = theme;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(state.w * 0.5, 0);
    for (let y = 0; y <= state.h; y += 58) {
      ctx.lineTo(state.w * 0.5 + Math.sin(state.time * 1.3 + y * 0.035) * 30, y);
    }
    ctx.stroke();
  } else {
    for (let i = 0; i < 8; i += 1) {
      const x = (i * 67 + Math.sin(state.time * 0.8 + i) * 18) % state.w;
      const y = (i * 101 + state.time * 10) % (state.h + 80) - 40;
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = i % 2 ? theme : accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 18, y);
      ctx.lineTo(x, y - 12);
      ctx.lineTo(x + 18, y);
      ctx.lineTo(x, y + 12);
      ctx.closePath();
      ctx.stroke();
    }
    for (let i = 0; i < 5; i += 1) {
      const x = state.w * (0.08 + i * 0.23);
      const y = state.h - 44 - (i % 2) * 30;
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = theme;
      ctx.fillRect(x, y, 32, 10);
      ctx.fillRect(x + 8, y - 28, 16, 28);
    }
  }

  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawDragon(player) {
  const dragon = state.currentDragon || selectedDragon();
  const image = getBattleDragonImage(dragon);
  const [mainColor, accentColor, darkColor] = dragon.colors;
  const pose = BATTLE_POSES[dragon.id] || BATTLE_POSES.astral;
  const flicker = player.invulnerable > 0 && Math.floor(player.invulnerable * 18) % 2 === 0;
  const absorbTime = player.absorbTime || 0;
  const releasePulse = player.releasePulse || 0;
  const chargeRatio = clamp(player.charge / Math.max(1, player.maxCharge), 0, 1);
  const absorbTension = input.absorbing && state.mode === "playing" ? 1 : 0;
  const targetDx = input.target ? input.target.x - player.x : 0;
  const flightTilt = clamp(targetDx / 150, -0.22, 0.22);
  const mouthY = -48;

  ctx.save();
  if (flicker) ctx.globalAlpha = 0.52;
  ctx.translate(player.x, player.y);
  drawBattleSwallowField(mouthY, mainColor, accentColor, chargeRatio, absorbTension, absorbTime);

  ctx.save();
  ctx.globalAlpha = 0.3 + chargeRatio * 0.1;
  ctx.fillStyle = "rgba(0, 0, 0, 0.48)";
  ctx.beginPath();
  ctx.ellipse(0, 39 + releasePulse * 4, 48 + releasePulse * 13, 11, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  if (releasePulse > 0.02) {
    ctx.save();
    ctx.globalAlpha = releasePulse * 0.46;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.ellipse(0, -10, 42 + releasePulse * 28, 54 + releasePulse * 32, 0, 0, TAU);
    ctx.stroke();
    ctx.globalAlpha = releasePulse * 0.14;
    ctx.fillStyle = mainColor;
    ctx.beginPath();
    ctx.ellipse(0, 2, 46 + releasePulse * 18, 72 + releasePulse * 22, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.rotate(flightTilt + Math.sin(state.time * 2.2 + pose.phase) * 0.025 + releasePulse * 0.05);
  ctx.translate(0, Math.sin(state.time * 5 + pose.phase) * 2 - releasePulse * 4);

  if (image.complete && image.naturalWidth > 0) {
    drawAnimatedDragonImage(image, pose, mouthY, mainColor, accentColor, darkColor, {
      absorbTension,
      chargeRatio,
      flightTilt,
      releasePulse,
    });
  } else {
    drawLoadingDragonSilhouette(mainColor, accentColor, darkColor, absorbTension, chargeRatio);
  }

  drawBattleStoredEnergy(player, chargeRatio, mainColor, accentColor);
  ctx.restore();
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawBattleSwallowField(mouthY, mainColor, accentColor, chargeRatio, absorbTension, absorbTime) {
  if (!absorbTension) return;

  const pullCharge = clamp(absorbTime * 1.35 + chargeRatio * 0.5, 0, 1.4);
  const length = state.upgrades.swallowLength * (1 + pullCharge * 0.12);
  const width = state.upgrades.swallowWidth * (1 + pullCharge * 0.08);
  const pulse = 1 + Math.sin(state.time * (9 + pullCharge * 4)) * (0.04 + pullCharge * 0.025);
  const cone = ctx.createLinearGradient(0, mouthY, 0, mouthY - length);
  cone.addColorStop(0, colorAlpha(accentColor, 0.5 + chargeRatio * 0.22));
  cone.addColorStop(0.35, colorAlpha(mainColor, 0.24 + chargeRatio * 0.18));
  cone.addColorStop(0.7, colorAlpha(accentColor, 0.12 + chargeRatio * 0.12));
  cone.addColorStop(1, colorAlpha(mainColor, 0));
  const conePoints = [
    [-18, mouthY + 5],
    [-width * 1.36 * pulse, mouthY - length],
    [width * 1.36 * pulse, mouthY - length],
    [18, mouthY + 5],
  ];
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.moveTo(conePoints[0][0], conePoints[0][1]);
  ctx.quadraticCurveTo(-width * pulse, mouthY - length * 0.5, conePoints[1][0], conePoints[1][1]);
  ctx.lineTo(conePoints[2][0], conePoints[2][1]);
  ctx.quadraticCurveTo(width * pulse, mouthY - length * 0.5, conePoints[3][0], conePoints[3][1]);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = colorAlpha(accentColor, 0.48 + chargeRatio * 0.18);
  ctx.lineWidth = 2;
  ctx.setLineDash([9, 8]);
  ctx.lineDashOffset = -state.time * 42;
  ctx.beginPath();
  ctx.moveTo(-19, mouthY + 6);
  ctx.quadraticCurveTo(-width * pulse, mouthY - length * 0.5, -width * 1.34 * pulse, mouthY - length);
  ctx.moveTo(19, mouthY + 6);
  ctx.quadraticCurveTo(width * pulse, mouthY - length * 0.5, width * 1.34 * pulse, mouthY - length);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let lane = -2; lane <= 2; lane += 1) {
    const laneOffset = lane * 0.19;
    ctx.beginPath();
    for (let step = 0; step <= 26; step += 1) {
      const t = step / 26;
      const streamY = mouthY - length * t;
      const localWidth = width * (0.22 + t * 0.98);
      const twist = Math.sin(state.time * 8.5 + t * 9.2 + lane * 1.7) * localWidth * (0.08 + t * 0.18);
      const streamX = laneOffset * localWidth * (1 - t * 0.22) + twist;
      if (step === 0) ctx.moveTo(streamX, streamY);
      else ctx.lineTo(streamX, streamY);
    }
    ctx.globalAlpha = 0.22 + Math.abs(lane) * 0.03 + chargeRatio * 0.12;
    ctx.strokeStyle = lane % 2 ? accentColor : mainColor;
    ctx.lineWidth = lane === 0 ? 2.2 : 1.4;
    ctx.stroke();
  }

  for (let i = 0; i < 22; i += 1) {
    const t = (state.time * (0.9 + pullCharge * 0.24) + i / 22) % 1;
    const streamY = mouthY - length * t;
    const localWidth = width * (0.2 + t * 1.05);
    const angle = state.time * 7 + i * 2.19 + t * 5;
    const streamX = Math.sin(angle) * localWidth * (0.34 + t * 0.28);
    const tailX = Math.sin(angle + 0.55) * localWidth * (0.24 + t * 0.2);
    ctx.globalAlpha = (1 - t) * (0.12 + pullCharge * 0.08) + 0.08;
    ctx.strokeStyle = i % 2 ? colorAlpha(accentColor, 0.74) : colorAlpha(mainColor, 0.68);
    ctx.lineWidth = 1.1 + (1 - t) * 1.2;
    ctx.beginPath();
    ctx.moveTo(streamX, streamY);
    ctx.lineTo(tailX, streamY + 12 + pullCharge * 8);
    ctx.stroke();
  }
  ctx.restore();
  ctx.globalAlpha = 1;

  ctx.strokeStyle = colorAlpha(accentColor, 0.72);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, mouthY + 1, 18 + Math.sin(state.time * 12) * 2, Math.PI * 1.05, Math.PI * 1.95);
  ctx.stroke();

  for (let i = 0; i < 3; i += 1) {
    const ringT = (state.time * 1.8 + i / 3) % 1;
    ctx.globalAlpha = (1 - ringT) * (0.18 + chargeRatio * 0.12);
    ctx.strokeStyle = i % 2 ? accentColor : mainColor;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(0, mouthY - ringT * length * 0.72, width * (0.34 + ringT * 0.56), 8 + ringT * 18, 0, 0, TAU);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawAnimatedDragonImage(image, pose, mouthY, mainColor, accentColor, darkColor, motion) {
  const frame = getImageAlphaFrame(image);
  const spriteW = frame.w * pose.scale * pose.body;
  const spriteH = frame.h * pose.scale * (0.96 + motion.absorbTension * 0.035);
  const mouthX = pose.mouth[0] * spriteW;
  const mouthLocalY = pose.mouth[1] * spriteH;
  const drawX = -mouthX;
  const drawY = mouthY - mouthLocalY;
  const time = state.time + pose.phase;
  const wingPulse = Math.sin(time * (motion.absorbTension ? 12 : 8));
  const tailPulse = Math.sin(time * 5.6);

  drawSpriteRegion(
    image,
    { x: 0, y: 0, w: 1, h: 1 },
    { x: drawX + tailPulse * 1.5, y: drawY + 5, w: spriteW, h: spriteH },
    {
      alpha: 0.14,
      frame,
      shadowColor: mainColor,
      shadowBlur: 24 + motion.chargeRatio * 18,
    },
  );

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.17 + motion.chargeRatio * 0.14 + motion.absorbTension * 0.14;
  ctx.fillStyle = colorAlpha(mainColor, 0.55);
  ctx.beginPath();
  ctx.ellipse(0, -4, spriteW * 0.42 + wingPulse * 3, spriteH * 0.38, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  drawWingBeatLayer(image, frame, drawX, drawY, spriteW, spriteH, time, wingPulse, mainColor, motion);
  drawTailLayer(image, frame, drawX, drawY, spriteW, spriteH, time, motion);
  drawCentralBodyLayer(image, frame, drawX, drawY, spriteW, spriteH, time, mainColor, accentColor, motion);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = colorAlpha(darkColor, 0.18);
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(Math.sin(time * 5.6) * 4, spriteH * 0.28);
  for (let i = 0; i <= 5; i += 1) {
    const p = i / 5;
    ctx.lineTo(Math.sin(time * 5.6 + p * 2.4) * (5 + p * 26), spriteH * (0.28 + p * 0.34));
  }
  ctx.stroke();
  ctx.restore();

  drawMouthEnergyLayer(mouthY, spriteW, spriteH, pose, mainColor, accentColor, darkColor, motion);
}

function drawSpriteRegion(image, source, dest, transform = {}) {
  const frame = transform.frame || { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight };
  const sx = frame.x + source.x * frame.w;
  const sy = frame.y + source.y * frame.h;
  const sw = Math.min(source.w * frame.w, frame.x + frame.w - sx);
  const sh = Math.min(source.h * frame.h, frame.y + frame.h - sy);
  if (sw <= 0 || sh <= 0) return;
  const pivotX = transform.pivotX ?? 0.5;
  const pivotY = transform.pivotY ?? 0.5;
  ctx.save();
  ctx.globalAlpha = transform.alpha ?? 1;
  if (transform.composite) ctx.globalCompositeOperation = transform.composite;
  if (transform.shadowColor) ctx.shadowColor = transform.shadowColor;
  if (transform.shadowBlur) ctx.shadowBlur = transform.shadowBlur;
  const centerX = dest.x + dest.w * pivotX + (transform.x || 0);
  const centerY = dest.y + dest.h * pivotY + (transform.y || 0);
  ctx.translate(centerX, centerY);
  ctx.rotate(transform.rotate || 0);
  ctx.scale(transform.scaleX || 1, transform.scaleY || 1);
  ctx.drawImage(image, sx, sy, sw, sh, -dest.w * pivotX, -dest.h * pivotY, dest.w, dest.h);
  ctx.restore();
}

function drawWingBeatLayer(image, frame, drawX, drawY, spriteW, spriteH, time, wingPulse, mainColor, motion) {
  const wingTop = 0.1;
  const wingHeight = 0.58;
  for (const side of [-1, 1]) {
    const isLeft = side < 0;
    const region = {
      x: isLeft ? 0 : 0.5,
      y: wingTop,
      w: 0.5,
      h: wingHeight,
    };
    const dest = {
      x: drawX + (isLeft ? 0 : spriteW * 0.5),
      y: drawY + spriteH * wingTop,
      w: spriteW * 0.5,
      h: spriteH * wingHeight,
    };
    const flapDepth = Math.abs(wingPulse);
    drawSpriteRegion(image, region, dest, {
      alpha: 0.9,
      frame,
      pivotX: isLeft ? 0.86 : 0.14,
      pivotY: 0.32,
      rotate: side * wingPulse * (0.045 + motion.absorbTension * 0.03),
      y: -flapDepth * (3.5 + motion.absorbTension * 3),
      scaleY: 1 + flapDepth * 0.055,
      shadowColor: mainColor,
      shadowBlur: 8 + motion.chargeRatio * 8,
    });
  }
}

function drawTailLayer(image, frame, drawX, drawY, spriteW, spriteH, time, motion) {
  const tailStart = 0.46;
  const segments = 9;
  const band = (1 - tailStart) / segments;
  for (let i = segments - 1; i >= 0; i -= 1) {
    const p = i / Math.max(1, segments - 1);
    const sourceY = tailStart + i * band;
    const tailWeight = smoothstep(0.05, 1, p);
    const sway =
      Math.sin(time * 5.6 + p * TAU * 0.82) * (1.5 + tailWeight * 17) +
      Math.sin(time * 3.1 + p * 5.2) * tailWeight * 4 +
      motion.flightTilt * (4 + tailWeight * 16);
    const lift = Math.cos(time * 5.2 + p * TAU) * tailWeight * 1.6;
    drawSpriteRegion(
      image,
      { x: 0, y: sourceY, w: 1, h: band + 0.006 },
      {
        x: drawX,
        y: drawY + spriteH * sourceY,
        w: spriteW,
        h: spriteH * (band + 0.006),
      },
      {
        frame,
        x: sway,
        y: lift,
        rotate: Math.sin(time * 5.3 + p * TAU) * tailWeight * 0.045,
        scaleX: 1 + Math.sin(time * 4.9 + p * TAU) * tailWeight * 0.018,
      },
    );
  }
}

function drawCentralBodyLayer(image, frame, drawX, drawY, spriteW, spriteH, time, mainColor, accentColor, motion) {
  const bodyX = 0.18;
  const bodyW = 0.64;
  const bodyEnd = 0.74;
  const segments = 11;
  const band = bodyEnd / segments;
  ctx.save();
  ctx.shadowColor = motion.absorbTension ? accentColor : mainColor;
  ctx.shadowBlur = motion.absorbTension ? 20 + motion.chargeRatio * 18 : 10 + motion.releasePulse * 22;
  for (let i = segments - 1; i >= 0; i -= 1) {
    const progress = i / Math.max(1, segments - 1);
    const flex = smoothstep(0.18, 1, progress);
    const headWeight = 1 - smoothstep(0, 0.42, progress);
    const sway =
      Math.sin(time * 4.7 + progress * TAU * 1.1) * (0.5 + flex * 4.5) +
      motion.flightTilt * (1.5 + flex * 8) -
      motion.releasePulse * headWeight * 4;
    const breathe = 1 + Math.sin(time * 4.4 + progress * TAU) * (0.01 + flex * 0.012) + motion.absorbTension * headWeight * 0.024;
    const sourceY = frame.y + frame.h * i * band;
    const sourceH = Math.min(frame.h * (band + 0.004), frame.y + frame.h - sourceY);
    if (sourceH > 0) {
      ctx.drawImage(
        image,
        frame.x + frame.w * bodyX,
        sourceY,
        frame.w * bodyW,
        sourceH,
        drawX + spriteW * bodyX + sway - ((breathe - 1) * spriteW * bodyW) / 2,
        drawY + spriteH * i * band,
        spriteW * bodyW * breathe,
        spriteH * (band + 0.004) + 1.2,
      );
    }
  }
  ctx.shadowBlur = 0;
  ctx.restore();

  drawSpriteRegion(
    image,
    { x: 0.12, y: 0, w: 0.76, h: 0.3 },
    { x: drawX + spriteW * 0.12, y: drawY, w: spriteW * 0.76, h: spriteH * 0.3 },
    {
      frame,
      x: motion.flightTilt * 3 - motion.releasePulse * 3,
      y: -motion.absorbTension * 2,
      shadowColor: motion.absorbTension ? accentColor : mainColor,
      shadowBlur: 8 + motion.chargeRatio * 8,
    },
  );
}

function drawMouthEnergyLayer(mouthY, spriteW, spriteH, pose, mainColor, accentColor, darkColor, motion) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = colorAlpha(accentColor, 0.56 + motion.chargeRatio * 0.18);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, mouthY + 2, 11 + motion.chargeRatio * 8, 6 + motion.absorbTension * 7, 0, 0, TAU);
  ctx.stroke();

  const runeCount = dragonRuneCount(mainColor, accentColor, darkColor);
  for (let i = 0; i < runeCount; i += 1) {
    const angle = state.time * (1.8 + motion.chargeRatio) + (i / runeCount) * TAU + pose.phase;
    const radius = 28 + motion.chargeRatio * 10 + Math.sin(state.time * 5 + i) * 2;
    ctx.fillStyle = i % 2 ? accentColor : mainColor;
    ctx.globalAlpha = 0.42 + motion.chargeRatio * 0.22;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * radius, mouthY + 18 + Math.sin(angle) * 8, 2.4 + motion.chargeRatio * 1.2, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function dragonRuneCount(mainColor, accentColor, darkColor) {
  return new Set([mainColor, accentColor, darkColor]).size + 3;
}

function drawLoadingDragonSilhouette(mainColor, accentColor, darkColor, absorbTension, chargeRatio) {
  ctx.save();
  ctx.shadowColor = mainColor;
  ctx.shadowBlur = 18;
  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.ellipse(0, -8, 24 + absorbTension * 4, 52, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = colorAlpha(accentColor, 0.78);
  ctx.beginPath();
  ctx.ellipse(-32, -8, 16, 38 + Math.sin(state.time * 9) * 3, -0.55, 0, TAU);
  ctx.ellipse(32, -8, 16, 38 - Math.sin(state.time * 9) * 3, 0.55, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = darkColor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 25);
  ctx.quadraticCurveTo(Math.sin(state.time * 7) * 16, 48, Math.sin(state.time * 8) * 26, 66);
  ctx.stroke();
  ctx.fillStyle = colorAlpha(accentColor, 0.72 + chargeRatio * 0.2);
  ctx.beginPath();
  ctx.arc(0, -50, 8 + chargeRatio * 4, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawBattleStoredEnergy(player, chargeRatio, mainColor, accentColor) {
  const stored = player.swallowed.length;
  if (!stored) return;
  const count = Math.min(stored, 12);
  for (let i = 0; i < count; i += 1) {
    const angle = state.time * 3 + (i / count) * TAU;
    const item = player.swallowed[i % stored];
    ctx.fillStyle = item.color || (i % 2 ? accentColor : mainColor);
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * (32 + chargeRatio * 6), -2 + Math.sin(angle) * 17, 2.8 + chargeRatio * 1.4, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawEnemies() {
  for (const enemy of state.enemies) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.shadowColor = enemy.color;
    ctx.shadowBlur = 16;
    ctx.fillStyle = enemy.color;

    if (enemy.type === "brute") {
      ctx.beginPath();
      for (let i = 0; i < 8; i += 1) {
        const a = (i / 8) * TAU + state.time * 0.8;
        const r = i % 2 === 0 ? enemy.r : enemy.r * 0.68;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(0, 0, enemy.r * 0.9, enemy.r * 1.15, Math.sin(state.time + enemy.phase) * 0.28, 0, TAU);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(5, 7, 13, 0.65)";
    ctx.beginPath();
    ctx.arc(0, 3, enemy.r * 0.36, 0, TAU);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
    ctx.fillRect(-enemy.r, -enemy.r - 10, enemy.r * 2, 3);
    ctx.fillStyle = "#77f5a6";
    ctx.fillRect(-enemy.r, -enemy.r - 10, enemy.r * 2 * clamp(enemy.hp / enemy.maxHp, 0, 1), 3);
    ctx.restore();
  }
}

function drawProjectiles() {
  for (const shot of state.shots) {
    ctx.save();
    ctx.translate(shot.x, shot.y);
    ctx.rotate(Math.atan2(shot.vy, shot.vx) + Math.PI / 2);
    ctx.shadowColor = shot.color;
    ctx.shadowBlur = shot.homing ? 18 : 12;
    ctx.fillStyle = shot.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, shot.r * 0.72, shot.homing ? shot.r * 1.35 : shot.r * 1.9, 0, 0, TAU);
    ctx.fill();
    if (shot.homing) {
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(0, shot.r * 0.8);
      ctx.lineTo(-shot.r * 0.62, shot.r * 3.2);
      ctx.lineTo(shot.r * 0.62, shot.r * 3.2);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  for (const bullet of state.bullets) {
    const absorbT = bullet.absorbT || 0;
    if (absorbT > 0.02) {
      const pullT = Math.max(absorbT, (bullet.absorbSnap || 0) * 0.85);
      const maw = getMawZone();
      const dx = maw.x - bullet.x;
      const dy = maw.y - bullet.y;
      const distance = Math.hypot(dx, dy) || 1;
      const nx = dx / distance;
      const ny = dy / distance;
      const side = bullet.vortexSide || 1;
      const controlX = bullet.x + dx * 0.48 + -ny * side * (18 + absorbT * 24);
      const controlY = bullet.y + dy * 0.48 + nx * side * (18 + absorbT * 24);
      const tether = ctx.createLinearGradient(bullet.x, bullet.y, maw.x, maw.y);
      tether.addColorStop(0, colorAlpha(bullet.color, 0.9 * pullT));
      tether.addColorStop(0.62, "rgba(66, 239, 210, 0.38)");
      tether.addColorStop(1, "rgba(255, 209, 102, 0)");

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = tether;
      ctx.lineWidth = 2 + pullT * 3.4;
      ctx.beginPath();
      ctx.moveTo(bullet.x, bullet.y);
      ctx.quadraticCurveTo(controlX, controlY, maw.x, maw.y + 4);
      ctx.stroke();

      ctx.globalAlpha = 0.36 + pullT * 0.5;
      ctx.strokeStyle = colorAlpha(bullet.color, 0.72);
      ctx.lineWidth = 1.4 + pullT * 0.8;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.r + 8 + pullT * 7 + Math.sin(state.time * 16 + bullet.spin) * 2, state.time * side * 6, state.time * side * 6 + Math.PI * 1.55);
      ctx.stroke();

      ctx.globalAlpha = pullT * 0.7;
      ctx.strokeStyle = colorAlpha(bullet.color, 0.76);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bullet.x - nx * (bullet.r + 8), bullet.y - ny * (bullet.r + 8));
      ctx.lineTo(bullet.x - nx * (bullet.r + 34 + pullT * 38), bullet.y - ny * (bullet.r + 34 + pullT * 38));
      ctx.stroke();

      ctx.globalAlpha = pullT * 0.42;
      ctx.strokeStyle = "rgba(255, 244, 197, 0.88)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(bullet.x, bullet.y);
      ctx.lineTo(bullet.x + nx * (12 + pullT * 18), bullet.y + ny * (12 + pullT * 18));
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(bullet.x, bullet.y);
    ctx.rotate(bullet.spin);
    ctx.shadowColor = bullet.color;
    ctx.shadowBlur = 14 + absorbT * 26;
    ctx.scale(1 + absorbT * 0.2, 1 - absorbT * 0.12);
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(0, 0, bullet.r, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = absorbT > 0.02 ? "rgba(255, 244, 197, 0.86)" : "rgba(255, 255, 255, 0.55)";
    ctx.lineWidth = 1.2 + absorbT * 1.2;
    ctx.beginPath();
    ctx.moveTo(-bullet.r * 0.65, 0);
    ctx.lineTo(bullet.r * 0.65, 0);
    ctx.stroke();
    ctx.restore();
  }
}

function drawHazards() {
  for (const hazard of state.hazards) {
    const active = hazard.life <= hazard.duration;
    const warnT = active ? 1 : 1 - clamp((hazard.life - hazard.duration) / hazard.warning, 0, 1);
    ctx.save();
    ctx.globalAlpha = active ? 0.72 : 0.18 + warnT * 0.3;
    ctx.strokeStyle = active ? "#fff4c5" : hazard.color;
    ctx.fillStyle = active ? `${hazard.color}88` : `${hazard.color}22`;
    ctx.lineWidth = active ? 3 : 2;

    if (hazard.type === "laser") {
      const width = active ? hazard.width : hazard.width * (0.42 + warnT * 0.58);
      ctx.fillRect(hazard.x - width / 2, 0, width, state.h);
      ctx.beginPath();
      ctx.moveTo(hazard.x, 0);
      ctx.lineTo(hazard.x, state.h);
      ctx.stroke();
    } else {
      const radius = hazard.r * (active ? 1 : 0.55 + warnT * 0.45);
      ctx.beginPath();
      ctx.arc(hazard.x, hazard.y, radius, 0, TAU);
      if (active) ctx.fill();
      ctx.stroke();
      if (!active) {
        ctx.beginPath();
        ctx.arc(hazard.x, hazard.y, radius * 0.55, 0, TAU);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function drawBreaths() {
  const player = state.player;
  for (const breath of state.breaths) {
    const t = clamp(breath.life / breath.maxLife, 0, 1);
    const width = breath.width * (0.42 + t * 0.58);
    const main = breath.colorA || "#42efd2";
    const accent = breath.colorB || "#ffd166";
    const gradient = ctx.createLinearGradient(breath.x - width / 2, 0, breath.x + width / 2, 0);
    gradient.addColorStop(0, colorAlpha(main, 0));
    gradient.addColorStop(0.32, colorAlpha(main, 0.2 + t * 0.3));
    gradient.addColorStop(0.5, colorAlpha(accent, breath.ultimate ? 0.58 + t * 0.38 : 0.42 + t * 0.42));
    gradient.addColorStop(0.68, colorAlpha(main, 0.2 + t * 0.3));
    gradient.addColorStop(1, colorAlpha(main, 0));
    ctx.fillStyle = gradient;
    ctx.fillRect(breath.x - width / 2, 0, width, player.y);

    if (breath.ultimate) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.24 + t * 0.24;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.2 + t * 1.8;
      ctx.beginPath();
      ctx.moveTo(breath.x - width * 0.28, player.y);
      ctx.quadraticCurveTo(breath.x + Math.sin(state.time * 9) * 24, player.y * 0.45, breath.x + width * 0.22, 0);
      ctx.stroke();
      ctx.restore();
    }
  }
}

function drawParticles() {
  for (const p of state.particles) {
    const alpha = clamp(p.life / p.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * alpha, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawSwallowBursts() {
  if (!state.swallowBursts.length) return;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const burst of state.swallowBursts) {
    const t = 1 - clamp(burst.life / burst.maxLife, 0, 1);
    const alpha = (1 - t) * 0.82;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = colorAlpha(burst.color, 0.92);
    ctx.lineWidth = 2.2 + t * 2.4;
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, 12 + t * 34, 0, TAU);
    ctx.stroke();

    ctx.globalAlpha = alpha * 0.52;
    ctx.fillStyle = colorAlpha("#fff4c5", 0.65);
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, 6 + t * 14, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function draw() {
  ctx.save();
  if (state.shake > 0) {
    ctx.translate(rand(-state.shake, state.shake), rand(-state.shake, state.shake));
  }

  drawBackground();
  drawBreaths();
  drawHazards();
  drawProjectiles();
  drawEnemies();
  drawParticles();
  drawSwallowBursts();
  drawDragon(state.player);

  if (state.flash > 0) {
    ctx.globalAlpha = state.flash * 1.8;
    ctx.fillStyle = "#fff4c5";
    ctx.fillRect(0, 0, state.w, state.h);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function applyRunSkill(skill) {
  const nextLevel = (state.runSkills[skill.id] || 0) + 1;
  state.runSkills[skill.id] = nextLevel;
  skill.apply(nextLevel);
  renderSkillHud();
}

function openUpgrade() {
  state.mode = "upgrade";
  input.absorbing = false;
  ui.absorbButton.classList.remove("is-active", "is-ready");
  hideWaveBanner();
  ui.upgradeChoices.innerHTML = "";
  state.nextUpgrade += 10 + Math.floor(state.nextUpgrade / 18) * 2;

  const choices = RUN_SKILLS.filter((skill) => (state.runSkills[skill.id] || 0) < skill.max)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  if (!choices.length) {
    state.mode = "playing";
    return;
  }

  for (const skill of choices) {
    const nextLevel = (state.runSkills[skill.id] || 0) + 1;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "upgrade-choice";
    button.innerHTML = `
      <span class="icon">${skill.icon}</span>
      <span>
        <strong>${skill.title} Lv.${nextLevel}/${skill.max}</strong>
        <span>${skill.element} · ${skill.detail}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      applyRunSkill(skill);
      state.mode = "playing";
      ui.upgradeOverlay.classList.remove("active");
      updateHud();
    });
    ui.upgradeChoices.append(button);
  }

  ui.upgradeOverlay.classList.add("active");
}

function endRun() {
  state.mode = "end";
  state.currentBoss = null;
  state.ultimateActive = null;
  state.ultimateDemo = false;
  input.absorbing = false;
  ui.absorbButton.classList.remove("is-active", "is-ready");
  ui.ultimateButton.classList.remove("is-ready");
  hideWaveBanner();
  updateBossHud();
  const partialGold = Math.floor(state.score / 180);
  const partialScales = Math.floor(state.stageKills / 12);
  state.meta.gold += partialGold;
  state.meta.scales += partialScales;
  saveMeta();
  ui.endLabel.textContent = state.wave >= 6 ? "deep flight" : "run complete";
  ui.endTitle.textContent = state.wave >= 6 ? "龍焰仍亮著" : "再飛一次";
  ui.finalScore.textContent = partialGold || partialScales ? `+${partialGold}金 / +${partialScales}晶` : Math.floor(state.score).toLocaleString("zh-TW");
  ui.restartButton.textContent = "回主畫面";
  ui.endOverlay.classList.add("active");
}

function togglePause() {
  if (state.mode === "playing") {
    state.mode = "paused";
    input.absorbing = false;
    input.absorbPointerId = null;
    ui.absorbButton.classList.remove("is-active", "is-ready");
    ui.endLabel.textContent = "paused";
    ui.endTitle.textContent = "暫停";
    ui.finalScore.textContent = Math.floor(state.score).toLocaleString("zh-TW");
    ui.restartButton.textContent = "繼續";
    ui.endOverlay.classList.add("active");
  } else if (state.mode === "paused") {
    state.mode = "playing";
    ui.restartButton.textContent = "重新開始";
    ui.endOverlay.classList.remove("active");
  }
}

function beginAbsorb(pointerId = null) {
  if (state.mode !== "playing") return;
  input.absorbing = true;
  input.absorbPointerId = pointerId;
  ui.absorbButton.classList.add("is-active");
}

function finishAbsorb(pointerId = null) {
  if (pointerId != null && input.absorbPointerId != null && pointerId !== input.absorbPointerId) return;
  if (!input.absorbing) return;
  input.absorbing = false;
  input.absorbPointerId = null;
  ui.absorbButton.classList.remove("is-active");
  releaseBreath();
}

function trySetPointerCapture(element, pointerId) {
  try {
    element.setPointerCapture?.(pointerId);
  } catch {
    // Some synthetic or desktop pointer events cannot be captured; dragging still works.
  }
}

function handleCanvasDown(event) {
  if (state.mode !== "playing") return;
  event.preventDefault();
  input.pointerId = event.pointerId;
  input.target = canvasPoint(event);
  trySetPointerCapture(canvas, event.pointerId);
  beginAbsorb(event.pointerId);
}

function handleCanvasMove(event) {
  if (event.pointerId !== input.pointerId || state.mode !== "playing") return;
  input.target = canvasPoint(event);
}

function handleCanvasUp(event) {
  if (event.pointerId !== input.pointerId) return;
  input.pointerId = null;
  finishAbsorb(event.pointerId);
}

function loop(timestamp) {
  if (!state.last) state.last = timestamp;
  const dt = Math.min(0.033, (timestamp - state.last) / 1000);
  state.last = timestamp;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

canvas.addEventListener("pointerdown", handleCanvasDown);
canvas.addEventListener("pointermove", handleCanvasMove);
canvas.addEventListener("pointerup", handleCanvasUp);
canvas.addEventListener("pointercancel", handleCanvasUp);
ui.startButton.addEventListener("click", resetRun);
ui.levelButton.addEventListener("click", () => {
  const dragon = selectedDragon();
  const meta = getDragonMeta(dragon);
  const cost = dragonLevelCost(dragon);
  if (!meta.owned || state.meta.gold < cost) return;
  state.meta.gold -= cost;
  meta.level += 1;
  saveMeta();
  renderHome();
});
ui.starButton.addEventListener("click", () => {
  const dragon = selectedDragon();
  const meta = getDragonMeta(dragon);
  const cost = dragonStarCost(dragon);
  if (!meta.owned || state.meta.scales < cost) return;
  state.meta.scales -= cost;
  meta.stars += 1;
  saveMeta();
  renderHome();
});
ui.claimIdleButton.addEventListener("click", () => {
  state.meta.gold += state.meta.idleGold;
  state.meta.idleGold = 0;
  saveMeta();
  renderHome();
});
ui.equipButton.addEventListener("click", () => {
  const cost = equipmentUpgradeCost();
  if (state.meta.gold < cost) return;
  state.meta.gold -= cost;
  state.meta.equipmentLevel += 1;
  saveMeta();
  renderHome();
});
ui.skillButton.addEventListener("click", () => {
  const cost = 80 + state.meta.skillLevel * 55;
  if (state.meta.scales < cost) return;
  state.meta.scales -= cost;
  state.meta.skillLevel += 1;
  saveMeta();
  renderHome();
});
ui.summonButton.addEventListener("click", () => {
  const cost = 80;
  if (state.meta.scales < cost) return;
  state.meta.scales -= cost;
  const locked = DRAGONS.filter((dragon) => !state.meta.dragons[dragon.id].owned);
  if (locked.length) {
    const dragon = locked[Math.floor(Math.random() * locked.length)];
    const meta = state.meta.dragons[dragon.id];
    meta.owned = true;
    meta.level = 1;
    meta.stars = 1;
    state.meta.selectedDragonId = dragon.id;
    setHomeTab("dragons");
  } else {
    const dragon = selectedDragon();
    state.meta.dragons[dragon.id].stars += 1;
    state.meta.scales += 25;
  }
  saveMeta();
  renderHome();
});
for (const tabButton of ui.tabs) {
  tabButton.addEventListener("click", () => setHomeTab(tabButton.dataset.tab));
}
for (const entryButton of ui.entryButtons) {
  entryButton.addEventListener("click", () => openHomeEntry(entryButton.dataset.entry));
}
ui.restartButton.addEventListener("click", () => {
  if (state.mode === "paused") {
    togglePause();
  } else {
    showHome();
  }
});
ui.pauseButton.addEventListener("click", togglePause);

window.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
  }
  if (event.key === "Escape") {
    togglePause();
    return;
  }
  input.keys.add(key);
});

window.addEventListener("keyup", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  input.keys.delete(key);
});

window.addEventListener("resize", resize);
window.addEventListener("blur", () => {
  input.absorbing = false;
  input.absorbPointerId = null;
  input.keys.clear();
  ui.absorbButton.classList.remove("is-active");
});

async function bootGame() {
  state.meta = await loadMeta();
  state.mode = "home";
  const bootParams = new URLSearchParams(window.location.search);
  applyBootParams(bootParams);
  preloadDragonImages();
  renderHome();
  resize();
  if (bootParams.has("battle")) {
    resetRun();
    if (bootParams.has("absorb")) {
      startAbsorbDemo();
    }
    if (bootParams.has("ultimate")) {
      startUltimateDemo();
    }
  } else {
    updateHud();
  }
  requestAnimationFrame(loop);
}

bootGame();
