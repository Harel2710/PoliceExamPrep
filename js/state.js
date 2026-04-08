// js/state.js - Global state, constants, PATH, LEVELS
// Auto-extracted from index.html

/* APP FRAMEWORK - Police Exam Prep (Glass UI)
   ============================================================ */

// ===== LEARNING PATH =====
const PATH=[
  {id:'intro',type:'lesson',cat:'general',title:'מבוא - הכנה למבחנים',icon:'📋',desc:'מבנה המבחן, ציונים וטיפים'},
  // === מסלול עברית ===
  {id:'level_sim_heb',type:'sim',cat:'hebrew',title:'מבחן רמה עברית',icon:'📝',desc:'סימולציה למיפוי רמתך בעברית',simCat:'hebrew',simKey:'level'},
  {id:'vocab',type:'lesson',cat:'hebrew',title:'רשימת אוצר מילים ומילים דומות',icon:'📖',desc:'רשימת מילים, מילים דומות וביטויים'},
  {id:'heb_ex1',type:'quiz',cat:'hebrew',title:'תרגול עברית 1',icon:'✏️',desc:'אביון, אוושה, אצטבא, אשתקד, בגפו, בדיעבד',dataKey:'ex1'},
  {id:'heb_ex2',type:'quiz',cat:'hebrew',title:'תרגול עברית 2',icon:'✏️',desc:'גהר, בעתה, גוויה, גשמי, גילופין, דופי',dataKey:'ex2'},
  {id:'heb_ex3',type:'quiz',cat:'hebrew',title:'תרגול עברית 3',icon:'✏️',desc:'הסלמה, התאחה, התבוללות, התגודדות, התחוור',dataKey:'ex3'},
  {id:'heb_ex4',type:'quiz',cat:'hebrew',title:'תרגול עברית 4',icon:'✏️',desc:'כסיות, כמיהה, חרף, יהירות, חוצץ',dataKey:'ex4'},
  {id:'heb_ex5',type:'quiz',cat:'hebrew',title:'תרגול עברית 5',icon:'✏️',desc:'כתישה, לאלתר, כסיל, להונות, לדחוק, להדחיק',dataKey:'ex5'},
  {id:'heb_ex6',type:'quiz',cat:'hebrew',title:'תרגול עברית 6',icon:'✏️',desc:'רובד, טופינים, שכיחות, קצף, תורפה, שגגה',dataKey:'ex6'},
  {id:'expr_learn',type:'lesson',cat:'hebrew',title:'הסבר ביטויים ומילים דומות',icon:'💬',desc:'40 ביטויים ומילים דומות לתרגול'},
  {id:'expr_ex1',type:'quiz',cat:'hebrew',title:'תרגול ביטויים 1',icon:'✏️',desc:'15 שאלות על ביטויים',dataKey:'expr1'},
  {id:'expr_ex2',type:'quiz',cat:'hebrew',title:'תרגול ביטויים 2',icon:'✏️',desc:'8 שאלות התאמה',dataKey:'expr2'},
  {id:'word_match',type:'quiz',cat:'hebrew',title:'תרגול מילים ומשמעותם',icon:'🔗',desc:'28 שאלות התאמה',dataKey:'wordMatch'},
  {id:'opposites',type:'quiz',cat:'hebrew',title:'תרגול הפכים',icon:'🔄',desc:'23 זוגות הפכים',dataKey:'opposites'},
  {id:'comprehension',type:'quiz',cat:'hebrew',title:'הבנת הנקרא',icon:'📰',desc:'15 שאלות הבנה',dataKey:'comprehension'},
  {id:'comprehension2',type:'quiz',cat:'hebrew',title:'הבנת הנקרא 2',icon:'📰',desc:'שאלות הבנה נוספות',dataKey:'comprehension2'},
  {id:'spelling',type:'quiz',cat:'hebrew',title:'שגיאות כתיב',icon:'🔍',desc:'תרגול איתור שגיאות כתיב',dataKey:'spelling'},
  {id:'spelling2',type:'quiz',cat:'hebrew',title:'שגיאות כתיב 2',icon:'🔍',desc:'תרגול נוסף באיתור שגיאות',dataKey:'spelling2'},
  {id:'final_sim_heb',type:'sim',cat:'hebrew',title:'מבחן סיום - עברית',icon:'🏆',desc:'סימולציית סיום למדידת ההתקדמות',simCat:'hebrew',simKey:'final'},
  // === מסלול דפ"ר ===
  {id:'level_sim_dpr',type:'sim',cat:'dpr',title:'מבחן רמה דפ"ר',icon:'📝',desc:'סימולציה למיפוי רמתך בדפ"ר',simCat:'dpr',simKey:'level'},
  {id:'instr_learn',type:'lesson',cat:'dpr',title:'הסבר מילוי הוראות',icon:'📋',desc:'5 סוגי שאלות, טיפים ודוגמאות'},
  {id:'instr_ex1',type:'quiz',cat:'dpr',title:'תרגול מילוי הוראות',icon:'✏️',desc:'שאלות מילוי הוראות',dataKey:'instr1'},
  {id:'dict_ex',type:'quiz',cat:'dpr',title:'תרגול הוראות ומילון',icon:'📖',desc:'שאלות סדר אלפביתי והוראות',dataKey:'dictEx'},
  {id:'dict_practice',type:'quiz',cat:'dpr',title:'תרגול מילון - מי קודם?',icon:'🔤',desc:'33 שאלות סדר מילוני',dataKey:'dictPractice'},
  {id:'compass_ex',type:'quiz',cat:'dpr',title:'תרגול מצפן',icon:'🧭',desc:'8 שאלות כיוונים',dataKey:'compass'},
  {id:'instr_test',type:'quiz',cat:'dpr',title:'תרגול מילוי הוראות מקיף',icon:'📝',desc:'18 שאלות מגוונות',dataKey:'instrTest'},
  {id:'seq_learn',type:'lesson',cat:'dpr',title:'הסבר סדרות',icon:'📋',desc:'5 סוגי סדרות ודוגמאות'},
  {id:'seq_ex3',type:'quiz',cat:'dpr',title:'תרגול סדרות',icon:'🔢',desc:'39 שאלות סדרות',dataKey:'seq3'},
  {id:'seq_ex4',type:'quiz',cat:'dpr',title:'תרגול סדרות 2',icon:'🔢',desc:'49 שאלות סדרות',dataKey:'seq4'},
  {id:'seq_ex5',type:'quiz',cat:'dpr',title:'תרגול סדרות 3',icon:'🔢',desc:'20 שאלות סדרות',dataKey:'seq5'},
  {id:'seq_ex6',type:'quiz',cat:'dpr',title:'תרגול סדרות 4',icon:'🔢',desc:'12 שאלות סדרות',dataKey:'seq6'},
  {id:'seq_ex7',type:'quiz',cat:'dpr',title:'תרגול סדרות 5',icon:'🔢',desc:'20 שאלות סדרות',dataKey:'seq7'},
  {id:'seq_ex8',type:'quiz',cat:'dpr',title:'תרגול סדרות 6',icon:'🔢',desc:'20 שאלות סדרות',dataKey:'seq8'},
  {id:'shapes_learn',type:'lesson',cat:'dpr',title:'הסבר צורות',icon:'📋',desc:'5 סוגי דפוסים צורניים'},
  {id:'shapes_ex',type:'quiz',cat:'dpr',title:'תרגול צורות ודפוסים 1',icon:'🔷',desc:'שאלות על לוגיקה צורנית',dataKey:'shapes'},
  {id:'shapes_ex2',type:'quiz',cat:'dpr',title:'תרגול צורות ודפוסים 2',icon:'🔶',desc:'המשך שאלות דפוסים צורניים',dataKey:'shapes2'},
  {id:'shapes_ex3',type:'quiz',cat:'dpr',title:'תרגול צורות ודפוסים 3',icon:'🔷',desc:'שאלות מתקדמות בלוגיקה צורנית',dataKey:'shapes3'},
  {id:'shapes_ex4',type:'quiz',cat:'dpr',title:'תרגול צורות 4',icon:'🔷',desc:'שאלות דפוסים מתקדמים',dataKey:'shapes4'},
  {id:'final_sim_dpr',type:'sim',cat:'dpr',title:'מבחן סיום - דפ"ר',icon:'🏆',desc:'סימולציית סיום למדידת ההתקדמות',simCat:'dpr',simKey:'final'},
  // === סיכום ===
  {id:'summary',type:'lesson',cat:'general',title:'סיכום',icon:'🎓',desc:'סיכום וטיפים אחרונים לקראת המבחן'},
];

// ===== LEVELS (10) - engagement only =====
const LEVELS=[
  {n:'מתחיל',min:0,lv:1,i:'🔰'},
  {n:'מתרגל',min:100,lv:2,i:'📝'},
  {n:'חרוץ',min:300,lv:3,i:'💪'},
  {n:'מתמיד',min:600,lv:4,i:'🎯'},
  {n:'מקצועי',min:1000,lv:5,i:'⭐'},
  {n:'מומחה',min:1500,lv:6,i:'🏅'},
  {n:'אלוף',min:2200,lv:7,i:'🌟'},
  {n:'מאסטר',min:3000,lv:8,i:'💎'},
  {n:'גרנד מאסטר',min:4000,lv:9,i:'👑'},
  {n:'אגדה',min:5500,lv:10,i:'🏆'}
];
function getUserLevel(pts){let l=LEVELS[0];for(const lv of LEVELS){if((pts||0)>=lv.min)l=lv}return l}
function getLevelProgress(pts){const l=getUserLevel(pts);const ni=LEVELS.indexOf(l);if(ni>=LEVELS.length-1)return 100;const next=LEVELS[ni+1];return Math.round((pts-l.min)/(next.min-l.min)*100)}

// Analytics - grouped by Hebrew / DPR
const ANALYTICS_GROUPS=[
  {group:'עברית',icon:'📝',color:'var(--p)',cats:[
    {name:'אוצר מילים',keys:['ex1','ex2','ex3','ex4','ex5','ex6']},
    {name:'ביטויים',keys:['expr1','expr2']},
    {name:'הפכים והתאמות',keys:['opposites','wordMatch']},
    {name:'הבנת הנקרא',keys:['comprehension','comprehension2']},
    {name:'כתיב',keys:['spelling','spelling2']}
  ]},
  {group:'דפ"ר',icon:'📐',color:'#2dd4bf',cats:[
    {name:'מילוי הוראות',keys:['instr1','dictEx','dictPractice','compass','instrTest']},
    {name:'סדרות',keys:['seq3','seq4','seq5','seq6','seq7','seq8']},
    {name:'צורות ודפוסים',keys:['shapes','shapes2','shapes3']}
  ]}
];
const ANALYTICS_EXTRA=[
  {name:'בוסט עברית',keys:['boost_hebrew'],g:'heb'},
  {name:'בוסט דפ"ר',keys:['boost_dpr'],g:'dpr'},
  {name:'סימולציית עברית',keys:['sim_hebrew'],g:'heb'},
  {name:'סימולציית דפ"ר',keys:['sim_dpr'],g:'dpr'},
  {name:'מבחן רמה - עברית',keys:['level_hebrew'],g:'heb'},
  {name:'מבחן רמה - דפ"ר',keys:['level_dpr'],g:'dpr'},
  {name:'מבחן סיום - עברית',keys:['final_hebrew'],g:'heb'},
  {name:'מבחן סיום - דפ"ר',keys:['final_dpr'],g:'dpr'},
  {name:'כרטיסיות לימוד',keys:['flashcards'],g:'heb'}
];
// Flat list for legacy compat
const ANALYTICS_CATS=[...ANALYTICS_GROUPS[0].cats,...ANALYTICS_GROUPS[1].cats,...ANALYTICS_EXTRA];

// === USER CLASSIFICATION ===
const USER_TYPES=[
  {id:'citizen',label:'אזרח / מועמד לגיוס',icon:'👤'},
  {id:'officer',label:'שוטר פעיל',icon:'👮'},
  {id:'trainee',label:'חניך בהכשרה',icon:'🎓'}
];
const DEFAULT_LB_CONFIG={
  districts:['מחוז תל אביב','מחוז מרכז','מחוז ירושלים','מחוז צפון','מחוז חוף','מחוז דרום','מחוז ש"י','אגף חקירות ומודיעין','אגף משאבי אנוש','את"ל','אג"ת','אגף התנועה','משמר הגבול','מתפ"א','להב 433','אחר'],
  traineeCompanies:['פלוגת הדר','פלוגת עוז','פלוגת יעל','פלוגת דוד','פלוגת דקל','פלוגת דרור','פלוגת דולב'],
  traineeDepartments:[1,2,3,4]
};
const getLBConfig=()=>{try{return{...DEFAULT_LB_CONFIG,...JSON.parse(localStorage.getItem('pApp_lbConfig')||'{}')}}catch{return DEFAULT_LB_CONFIG}};
const saveLBConfig=c=>localStorage.setItem('pApp_lbConfig',JSON.stringify(c));

const LETTERS=['א','ב','ג','ד','ה','ו'];

// ===== MEDALS =====
const MEDALS=[
  // Final exam accuracy — Hebrew
  {id:'final_heb_bronze',icon:'🥉',title:'ארד עברית',desc:'מבחן סיום עברית 80%+',cat:'hebrew',type:'final_acc',minPct:80},
  {id:'final_heb_silver',icon:'🥈',title:'כסף עברית',desc:'מבחן סיום עברית 90%+',cat:'hebrew',type:'final_acc',minPct:90},
  {id:'final_heb_gold',icon:'🥇',title:'זהב עברית',desc:'מבחן סיום עברית 97%+',cat:'hebrew',type:'final_acc',minPct:97},
  {id:'final_heb_platinum',icon:'💎',title:'פלטינום עברית',desc:'מבחן סיום עברית 100%',cat:'hebrew',type:'final_acc',minPct:100},
  // Final exam accuracy — DPR
  {id:'final_dpr_bronze',icon:'🥉',title:'ארד דפ"ר',desc:'מבחן סיום דפ"ר 80%+',cat:'dpr',type:'final_acc',minPct:80},
  {id:'final_dpr_silver',icon:'🥈',title:'כסף דפ"ר',desc:'מבחן סיום דפ"ר 90%+',cat:'dpr',type:'final_acc',minPct:90},
  {id:'final_dpr_gold',icon:'🥇',title:'זהב דפ"ר',desc:'מבחן סיום דפ"ר 97%+',cat:'dpr',type:'final_acc',minPct:97},
  {id:'final_dpr_platinum',icon:'💎',title:'פלטינום דפ"ר',desc:'מבחן סיום דפ"ר 100%',cat:'dpr',type:'final_acc',minPct:100},
  // Speed — accuracy + time
  {id:'speed_heb',icon:'⚡',title:'מהיר כברק - עברית',desc:'מבחן סיום עברית 85%+ בפחות מ-12 דק\'',cat:'hebrew',type:'final_speed',minPct:85,maxMin:12},
  {id:'speed_dpr',icon:'⚡',title:'מהיר כברק - דפ"ר',desc:'מבחן סיום דפ"ר 85%+ בפחות מ-15 דק\'',cat:'dpr',type:'final_speed',minPct:85,maxMin:15},
  // Practice excellence — boosts
  {id:'boost_perfect',icon:'🎯',title:'בוסט מושלם',desc:'10/10 בבוסט בודד',type:'boost',launch:'boost'},
  {id:'boost_perfect_x5',icon:'🎯',title:'בוסט מושלם x5',desc:'5 סשנים שונים עם 10/10',type:'boost_count',count:5,launch:'boost'},
  {id:'boost_both',icon:'🎯',title:'בוסט מושלם עברית+דפ"ר',desc:'10/10 גם בעברית וגם בדפ"ר',type:'boost_both',launch:'boost'},
  {id:'boost_speed',icon:'⏱️',title:'בוסט בזק',desc:'10/10 בפחות מ-2 דק\'',type:'boost_speed',maxSec:120,launch:'boost'}
];

// ===== STATE =====
let user=null,curStep=null,qList=[],qIdx=0,qCorrect=0,timerInt=null,elapsed=0;
let sessionStart=Date.now(),timeTracker=null;
// Boost/Sim state
let boostTimer=null,boostRemaining=0,isBoostMode=false,boostCat='';
let simTimer=null,simRemaining=0,isSimMode=false,simCat='',simAnswers=[],simEndTime=0;


// === Additional state (moved from other modules) ===
let editingQuestion=null;
let adminEditMode=null; // 'question','path_titles','intro_content'
let _lbGroupCache=null; // cached leaderboard for user's local group
let classifyType=null;
let _timeTrackCounter=0;
let activeTab='path';
const INACTIVITY_LIMIT=30*24*60*60*1000; // 1 month
let _profileRole=null;
