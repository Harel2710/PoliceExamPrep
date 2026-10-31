// js/engage.js - Themes, settings, sound, haptics, daily streak/goal, combo, level-up

// ===== THEMES =====
const THEMES=[
  {id:'night',name:'משמרת לילה',sw:['#0C1322','#4D8DFF','#F5B73B']},
  {id:'day',name:'אור יום',sw:['#EDF1F7','#1F57D6','#C77A00']},
  {id:'dusk',name:'דמדומים',sw:['#14112A','#8C7BFF','#FFB547']}
];
function getTheme(){try{return localStorage.getItem('pApp_theme')||'night'}catch(e){return 'night'}}
function applyTheme(id){
  if(!THEMES.some(t=>t.id===id))id='night';
  document.documentElement.setAttribute('data-theme',id);
  try{localStorage.setItem('pApp_theme',id)}catch(e){}
  const bg=getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta&&bg)meta.setAttribute('content',bg);
  renderThemePicker();
}
function renderThemePicker(){
  const el=document.getElementById('theme-picker');if(!el)return;
  const cur=getTheme();
  el.innerHTML=THEMES.map(t=>`<button class="theme-opt${t.id===cur?' active':''}" onclick="applyTheme('${t.id}')" aria-pressed="${t.id===cur}">
    <span class="theme-sw" style="background:${t.sw[0]}"><i style="background:${t.sw[1]}"></i><i style="background:${t.sw[2]}"></i></span>
    <span class="theme-name">${t.name}</span></button>`).join('');
}

// ===== SETTINGS =====
const DEFAULT_SETTINGS={sound:true,haptic:true,goal:20};
function getSettings(){try{return{...DEFAULT_SETTINGS,...JSON.parse(localStorage.getItem('pApp_settings')||'{}')}}catch(e){return{...DEFAULT_SETTINGS}}}
function saveSettings(s){try{localStorage.setItem('pApp_settings',JSON.stringify(s))}catch(e){}}
function toggleSetting(key){const s=getSettings();s[key]=!s[key];saveSettings(s);renderSettings();if(key==='sound'&&s.sound)sfx('ok')}
function setGoal(n){const s=getSettings();s.goal=n;saveSettings(s);renderSettings()}
function renderSettings(){
  const s=getSettings();
  [['sound-switch','sound'],['haptic-switch','haptic']].forEach(([id,k])=>{const b=document.getElementById(id);if(b){b.classList.toggle('on',!!s[k]);b.setAttribute('aria-checked',!!s[k])}});
  const seg=document.getElementById('goal-seg');
  if(seg)seg.innerHTML=[10,20,30,50].map(n=>`<button class="${s.goal===n?'active':''}" onclick="setGoal(${n})">${n}</button>`).join('');
  renderThemePicker();
}

// ===== SOUND (tiny WebAudio blips, no assets) =====
let _actx=null;
function sfx(kind){
  if(!getSettings().sound)return;
  try{
    _actx=_actx||new (window.AudioContext||window.webkitAudioContext)();
    if(_actx.state==='suspended')_actx.resume();
    const seqs={
      ok:[[660,0,.09],[990,.07,.12]],
      combo:[[660,0,.07],[880,.06,.07],[1320,.12,.14]],
      bad:[[220,0,.16]],
      done:[[523,0,.1],[659,.1,.1],[784,.2,.1],[1047,.3,.22]],
      level:[[392,0,.12],[523,.12,.12],[659,.24,.12],[784,.36,.12],[1047,.48,.3]]
    };
    const t0=_actx.currentTime;
    (seqs[kind]||seqs.ok).forEach(([f,at,dur])=>{
      const o=_actx.createOscillator(),g=_actx.createGain();
      o.type=kind==='bad'?'triangle':'sine';o.frequency.value=f;
      g.gain.setValueAtTime(0.0001,t0+at);
      g.gain.exponentialRampToValueAtTime(kind==='bad'?0.08:0.06,t0+at+0.015);
      g.gain.exponentialRampToValueAtTime(0.0001,t0+at+dur);
      o.connect(g);g.connect(_actx.destination);o.start(t0+at);o.stop(t0+at+dur+0.02);
    });
  }catch(e){}
}
function haptic(p){if(getSettings().haptic&&navigator.vibrate){try{navigator.vibrate(p)}catch(e){}}}

// ===== DAILY STREAK & GOAL =====
function dayKey(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function getStreak(u){
  const days=new Set((u&&u.activeDays)||[]);
  const d=new Date();
  if(!days.has(dayKey(d)))d.setDate(d.getDate()-1); // streak survives until the end of today
  let n=0;
  while(days.has(dayKey(d))){n++;d.setDate(d.getDate()-1)}
  return n;
}
function getTodayCount(u){return((u&&u.dailyQ)||{})[dayKey()]||0}
function recordAnswers(n){
  if(!user||!n)return;
  const k=dayKey();
  if(!user.dailyQ)user.dailyQ={};
  const before=user.dailyQ[k]||0;
  user.dailyQ[k]=before+n;
  // keep two weeks of daily counts
  Object.keys(user.dailyQ).sort().slice(0,-14).forEach(old=>delete user.dailyQ[old]);
  if(!user.activeDays)user.activeDays=[];
  if(!user.activeDays.includes(k)){user.activeDays.push(k);user.activeDays=user.activeDays.slice(-90)}
  user.bestStreak=Math.max(user.bestStreak||0,getStreak(user));
  const goal=getSettings().goal;
  if(before<goal&&before+n>=goal){
    setTimeout(()=>{toast(`🎯 יעד יומי הושלם! ${goal} שאלות היום`,'ach');sfx('done');haptic([20,40,20])},400);
  }
  // local save only; Firestore sync happens at the end of the session
  const us=getUsers();us[user.uid||user.name]=user;saveUsers(us);
}
function renderHeroEngage(){
  if(!user)return;
  const st=getStreak(user),today=getTodayCount(user),goal=getSettings().goal;
  const sEl=document.getElementById('h-streak');if(sEl)sEl.textContent=st;
  const chip=document.getElementById('h-streak-chip');
  if(chip){chip.classList.toggle('lit',st>0);chip.classList.toggle('at-risk',st>0&&today===0)}
  const gEl=document.getElementById('h-goal');if(gEl)gEl.textContent=Math.min(today,goal)+'/'+goal;
  const ring=document.getElementById('h-goal-ring');
  if(ring)ring.style.strokeDashoffset=100-Math.min(100,Math.round(today/goal*100));
  const gc=document.getElementById('h-goal-chip');if(gc)gc.classList.toggle('done',today>=goal);
}

// ===== IN-QUIZ COMBO & FEEDBACK =====
let comboCount=0,bestCombo=0;
const OK_LINES=['נכון!','בול!','מצוין!','יפה מאוד!','בדיוק!'];
const BAD_LINES=['לא נורא, עכשיו זה ייזכר','כמעט! שווה לקרוא את ההסבר','טעות היא חלק מהאימון'];
function resetCombo(){comboCount=0;bestCombo=0;renderCombo()}
function renderCombo(){
  const el=document.getElementById('q-combo');if(!el)return;
  if(comboCount>=2){el.textContent='🔥 '+comboCount;el.classList.add('on');el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop')}
  else{el.textContent='';el.classList.remove('on','pop')}
}
function onAnswer(correct,btn){
  if(correct){
    comboCount++;bestCombo=Math.max(bestCombo,comboCount);
    sfx(comboCount>=3?'combo':'ok');haptic(12);
    if(btn&&comboCount>=3)floatText(btn,'רצף '+comboCount+'!');
  }else{
    comboCount=0;sfx('bad');haptic([30,40,30]);
  }
  renderCombo();
  recordAnswers(1);
  const pool=correct?OK_LINES:BAD_LINES;
  return pool[0|Math.random()*pool.length];
}
function floatText(anchor,txt){
  const r=anchor.getBoundingClientRect();
  const f=document.createElement('div');f.className='float-txt';f.textContent=txt;
  f.style.left=(r.left+r.width/2)+'px';f.style.top=(r.top)+'px';
  document.body.appendChild(f);setTimeout(()=>f.remove(),900);
}

// ===== RESULTS HELPERS =====
function countUp(el,to,ms){
  if(!el)return;ms=ms||700;
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||to<=0){el.textContent='+'+to;return}
  const t0=performance.now();
  const step=t=>{const p=Math.min(1,(t-t0)/ms);el.textContent='+'+Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)};
  requestAnimationFrame(step);
}
function setScoreRing(id,pct){
  const ring=document.getElementById(id);if(!ring)return;
  const fill=ring.querySelector('.score-ring-fill');
  ring.dataset.band=pct>=80?'high':pct>=50?'mid':'low';
  fill.style.strokeDashoffset=100;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{fill.style.strokeDashoffset=100-pct}));
}
function starsFor(pct){return pct>=95?3:pct>=75?2:pct>=50?1:0}
function setStars(id,n){
  const el=document.getElementById(id);if(!el)return;
  [...el.children].forEach((s,i)=>{s.classList.toggle('on',i<n);s.style.transitionDelay=(300+i*180)+'ms'});
}

// ===== LEVEL UP =====
function checkLevelUp(){
  if(!user)return;
  const lv=getUserLevel(user.points);
  if(user.lvSeen===undefined){user.lvSeen=lv.lv;return}
  if(lv.lv>user.lvSeen){
    user.lvSeen=lv.lv;
    const us=getUsers();us[user.uid||user.name]=user;saveUsers(us);
    document.getElementById('lu-icon').textContent=lv.i;
    document.getElementById('lu-title').textContent=lv.n;
    const ni=LEVELS.indexOf(lv),next=LEVELS[ni+1];
    document.getElementById('lu-sub').textContent='רמה '+lv.lv+(next?`. עוד ${next.min-user.points} נקודות לרמת ${next.n}`:'. הרמה הגבוהה ביותר!');
    document.getElementById('levelup-modal').classList.remove('hidden');
    sfx('level');haptic([30,50,30,50,60]);confetti();
  }
}
function closeLevelUp(){document.getElementById('levelup-modal').classList.add('hidden')}

document.addEventListener('DOMContentLoaded',()=>{renderThemePicker()});
