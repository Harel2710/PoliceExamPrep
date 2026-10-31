// js/dashboard.js - Dashboard, path, time tracking, navigation, readiness
let _liveCountCache=null,_liveCountTime=0;
// Auto-extracted from index.html

// ===== TIME TRACKING =====
function startTimeTracking(){
  sessionStart=Date.now();
  _timeTrackCounter=0;
  // Write presence immediately when session starts
  if(db&&user){const uid=user.uid||user.name;if(uid)db.collection('appConfig').doc('presence').set({[uid]:Date.now()},{merge:true}).catch(()=>{})}
  if(timeTracker)clearInterval(timeTracker);
  timeTracker=setInterval(()=>{
    if(!user)return;
    user.totalTime=(user.totalTime||0)+1;
    const today=new Date().toDateString();
    if(!user.dailyTimePoints)user.dailyTimePoints={};
    if(!user.dailyTimePoints[today])user.dailyTimePoints[today]=0;
    if(user.dailyTimePoints[today]<60){user.points+=2;user.dailyTimePoints[today]+=2}
    _timeTrackCounter++;
    // Save locally every minute, sync to Firestore every 5 minutes
    const us=getUsers();const key=user.uid||user.name;us[key]=user;saveUsers(us);
    if(_timeTrackCounter>=5){_timeTrackCounter=0;syncUserToFirestore(user)}
    // Refresh live count every 2 minutes
    if(_timeTrackCounter%2===0){_liveCountCache=null;getTotalUserCount()}
  },60000);
}


// ===== TAB NAVIGATION =====

function switchTab(tab){
  activeTab=tab;
  document.querySelectorAll('.tab-item').forEach(t=>t.classList.toggle('active',t.dataset.tab===tab));
  switch(tab){
    case 'path':showDash();break;
    case 'boost':showScreen('boost-screen');break;
    case 'leaderboard':showTrophyScreen();break;
    case 'analytics':showAnalytics();break;
    case 'more':showMore();break;
  }
}

function showMore(){
  if(!user)return;
  document.getElementById('u-name').textContent=user.name;
  document.getElementById('me-avatar').textContent=(user.name||'?').trim()[0]||'?';
  document.getElementById('s-best-streak').textContent=Math.max(user.bestStreak||0,getStreak(user));
  renderSettings();
  const done=(user.completed||[]).length;
  const pct=Math.round(done/PATH.length*100);
  const lv=getUserLevel(user.points);
  const ni=LEVELS.indexOf(lv);
  const nextLv=ni<LEVELS.length-1?LEVELS[ni+1]:null;
  document.getElementById('rank-label').textContent=lv.i+' '+lv.n+' (רמה '+lv.lv+')';
  document.getElementById('pts-next').textContent=nextLv?`${user.points}/${nextLv.min}`:`${user.points} נק׳ - מקסימום!`;
  document.getElementById('rank-prog').style.width=getLevelProgress(user.points)+'%';
  document.getElementById('s-done').textContent=done;
  document.getElementById('s-progress').textContent=pct+'%';
  document.getElementById('s-time').textContent=user.totalTime||0;
  document.getElementById('admin-reports-btn').style.display=user.isAdmin?'flex':'none';
  document.getElementById('admin-lb-config-btn').style.display=user.isAdmin?'flex':'none';
  document.getElementById('admin-push-overrides-btn').style.display=user.isAdmin?'flex':'none';
  document.getElementById('admin-qbank-btn').style.display=user.isAdmin?'flex':'none';
  document.getElementById('admin-seed-count-btn').style.display=user.isAdmin?'flex':'none';
  // Profile display
  const pDisp=document.getElementById('profile-display-content');
  const pCard=document.getElementById('profile-display');
  if(user.profile){
    pCard.style.display='';
    const p=user.profile;
    if(p.role==='active'){
      pDisp.innerHTML=`<div>סטטוס: <strong>שוטר פעיל</strong></div><div>מחוז/אגף: <strong>${p.district||'--'}</strong></div>${p.unit?`<div>יחידה: <strong>${p.unit}</strong></div>`:''}`;
    } else if(p.role==='trainee'){
      pDisp.innerHTML=`<div>סטטוס: <strong>חניך בהכשרה</strong></div><div>פלוגה: <strong>${p.platoon||'--'}</strong></div><div>מחלקה: <strong>${p.department||'--'}</strong></div>`;
    } else {
      pDisp.innerHTML=`<div>סטטוס: <strong>מועמד לגיוס</strong></div>`;
    }
  } else {
    pCard.style.display='';
    pDisp.innerHTML='<div style="color:var(--txtm)">לא הוגדר פרופיל</div>';
  }
  showScreen('more-screen');
}

function editProfile(){
  _profileRole=null;
  document.querySelectorAll('.profile-role-btn').forEach(b=>{b.classList.remove('btn-primary');b.classList.add('btn-secondary')});
  document.getElementById('profile-active-fields').style.display='none';
  document.getElementById('profile-trainee-fields').style.display='none';
  document.getElementById('profile-save-btn').style.display='none';
  document.getElementById('profile-error').textContent='';
  document.getElementById('profile-back-btn').style.display='';
  if(user&&user.profile){
    const p=user.profile;
    selectProfileRole(p.role);
    if(p.role==='active'){
      document.getElementById('profile-district').value=p.district||'';
      document.getElementById('profile-unit').value=p.unit||'';
    } else if(p.role==='trainee'){
      document.getElementById('profile-platoon').value=p.platoon||'';
      const depEl=document.getElementById('profile-department');
      if(depEl)depEl.value=p.department||'';
    }
  }
  showScreen('profile-screen');
}

// ===== READINESS =====
function getReadiness(){
  if(!user)return 0;
  const done=(user.completed||[]).length;
  return Math.round((done/PATH.length)*100);
}

function updateReadiness(){
  const score=getReadiness();
  document.getElementById('readiness-val').textContent=score;
  // readiness-fill is the badge outline (pathLength=100): reveal it proportionally
  document.getElementById('readiness-fill').style.strokeDashoffset=100-score;
}

// ===== HOME (Path) =====
function getBoostCount(){
  if(!user||!user.quizResults)return 0;
  return user.boostCount||0;
}

function getTotalUserCount(){
  const el=document.getElementById('h-user-count');
  const liveEl=document.getElementById('h-live-count');
  if(liveEl)liveEl.textContent='0';
  // Use cached stats counter (1 doc read, cached for 10 min)
  if(_userCountCache!==null&&(Date.now()-_userCountCacheTime<USER_COUNT_CACHE_TTL)){
    if(el)el.textContent=_userCountCache;
  } else {
    const local=Object.keys(getUsers()).length;
    if(el)el.textContent=local;
    if(db){
      db.collection('appConfig').doc('stats').get().then(doc=>{
        if(doc.exists&&doc.data().totalUsers){
          _userCountCache=doc.data().totalUsers;
          _userCountCacheTime=Date.now();
          if(el)el.textContent=_userCountCache;
        }
      }).catch(()=>{});
    }
  }
  // Live count from presence doc (1 read, cached 2 min)
  if(liveEl){
    if(_liveCountCache!==null&&Date.now()-_liveCountTime<120000){
      liveEl.textContent=_liveCountCache;
    } else if(db){
      liveEl.textContent=_liveCountCache||'1';
      db.collection('appConfig').doc('presence').get().then(doc=>{
        if(!doc.exists){if(liveEl)liveEl.textContent='1';return}
        const data=doc.data();const tenMinAgo=Date.now()-10*60*1000;
        let count=0;
        Object.values(data).forEach(ts=>{if(typeof ts==='number'&&ts>tenMinAgo)count++});
        count=Math.max(count,user?1:0);
        _liveCountCache=count;_liveCountTime=Date.now();
        if(liveEl)liveEl.textContent=count;
      }).catch(()=>{if(liveEl)liveEl.textContent='1'});
    } else {
      liveEl.textContent=user?'1':'0';
    }
  }
}

function showDash(){
  if(!user)return;
  clearAllTimers();isBoostMode=false;isSimMode=false;
  document.getElementById('h-pts').textContent=user.points;
  document.getElementById('h-time').textContent=user.totalTime||0;
  document.getElementById('h-boost').textContent=getBoostCount();
  // Level badge
  const lv=getUserLevel(user.points);
  const lvProg=getLevelProgress(user.points);
  const ni=LEVELS.indexOf(lv);
  const nextLv=ni<LEVELS.length-1?LEVELS[ni+1]:null;
  document.getElementById('dash-level-icon').textContent=lv.i;
  document.getElementById('dash-level-name').textContent=lv.n;
  document.getElementById('dash-level-num').textContent=lv.lv;
  document.getElementById('dash-level-prog').style.width=lvProg+'%';
  document.getElementById('dash-level-next').textContent=nextLv?`עוד ${nextLv.min-(user.points||0)} נקודות לרמת ${nextLv.n}`:'רמה מקסימלית!';
  document.getElementById('dash-name').textContent=(user.name||'').split(' ')[0];
  getTotalUserCount();
  updateReadiness();
  renderHeroEngage();
  renderNextMission();
  renderPath();
  document.querySelectorAll('.tab-item').forEach(t=>t.classList.toggle('active',t.dataset.tab==='path'));
  activeTab='path';
  showScreen('dash-screen');
  setTimeout(checkLevelUp,350);
}

// ===== STEP STATE (lock rules) =====
// Hebrew and DPR progress independently; sims and summary gate on their tracks
function stepState(i,comp){
  const step=PATH[i];
  const done=comp.includes(step.id);
  let locked=false;
  if(!done&&!user.isAdmin){
    if(step.id==='intro'){
      locked=false;
    } else if(step.id==='level_sim_heb'||step.id==='level_sim_dpr'){
      locked=!comp.includes('intro');
    } else if(step.id==='final_sim_heb'){
      locked=!PATH.filter(s=>s.cat==='hebrew'&&s.id!=='final_sim_heb').every(s=>comp.includes(s.id));
    } else if(step.id==='final_sim_dpr'){
      locked=!PATH.filter(s=>s.cat==='dpr'&&s.id!=='final_sim_dpr').every(s=>comp.includes(s.id));
    } else if(step.id==='summary'){
      locked=!comp.includes('final_sim_heb')||!comp.includes('final_sim_dpr');
    } else if(step.cat==='hebrew'||step.cat==='dpr'){
      let prevInCat=null;
      for(let j=i-1;j>=0;j--){if(PATH[j].cat===step.cat){prevInCat=PATH[j];break}}
      locked=prevInCat?!comp.includes(prevInCat.id):!comp.includes('intro');
    }
  }
  return{done,locked,current:!done&&!locked};
}

const TRACK_META={hebrew:{n:'עברית',i:'📝'},dpr:{n:'דפ"ר',i:'📐'},general:{n:'כללי',i:'🏛️'}};
const STEP_TYPE_LBL={lesson:'שיעור',quiz:'תרגול',sim:'מבחן'};
let pathTrack=(()=>{try{return localStorage.getItem('pApp_track')||'all'}catch(e){return 'all'}})();
function setPathTrack(t){
  pathTrack=t;try{localStorage.setItem('pApp_track',t)}catch(e){}
  renderNextMission();renderPath();
}
function trackProgress(cat,comp){
  const steps=PATH.filter(s=>s.cat===cat);
  return{done:steps.filter(s=>comp.includes(s.id)).length,total:steps.length};
}

// ===== NEXT MISSION (one tap to continue) =====
function renderNextMission(){
  const box=document.getElementById('next-mission');if(!box||!user)return;
  const comp=user.completed||[];
  const firstCurrent=cat=>{for(let i=0;i<PATH.length;i++){if(PATH[i].cat===cat&&stepState(i,comp).current)return i}return -1};
  let rows=[];
  if(!comp.includes('intro')){
    rows=[PATH.findIndex(s=>s.id==='intro')];
  } else {
    const cats=pathTrack==='all'?['hebrew','dpr']:[pathTrack];
    rows=cats.map(firstCurrent).filter(i=>i>=0);
    if(!rows.length){const si=PATH.findIndex(s=>s.id==='summary');if(stepState(si,comp).current)rows=[si]}
  }
  if(!rows.length){
    box.innerHTML=`<div class="mission-card mission-done"><span class="mission-ico">🎓</span><div class="mission-txt"><b>סיימת את כל המסלול!</b><small>שמור על כושר עם בוסטים וסימולציות</small></div><button class="btn btn-primary btn-sm" onclick="switchTab('boost')">לבוסט ⚡</button></div>`;
    return;
  }
  box.innerHTML=`<div class="mission-head">המשימה הבאה</div>`+rows.map(i=>{
    const s=PATH[i],tp=trackProgress(s.cat,comp);
    const meta=s.cat==='general'?STEP_TYPE_LBL[s.type]:`${STEP_TYPE_LBL[s.type]} ב${TRACK_META[s.cat].n}, שלב ${tp.done+1} מתוך ${tp.total}`;
    return `<button class="mission-card cat-${s.cat}" onclick="openStep(${i})">
      <span class="mission-ico">${s.icon}</span>
      <span class="mission-txt"><b>${s.title}</b><small>${meta}</small></span>
      <span class="mission-go">${s.type==='sim'?'למבחן':'קדימה'}</span></button>`;
  }).join('');
}

// Winding single-file path: node x-positions (% of width) and which side the label sits on
const ZIG=[[50,'l'],[68,'l'],[76,'l'],[68,'l'],[50,'r'],[32,'r'],[24,'r'],[32,'r']];
const NODE_ICONS={
  'intro':'📋','vocab':'📖','heb_ex1':'✍️','heb_ex2':'📝','heb_ex3':'🔤',
  'heb_ex4':'💬','heb_ex5':'📚','heb_ex6':'🧠','expr_learn':'💡','expr_ex1':'🎯',
  'expr_ex2':'🎲','word_match':'🔗','opposites':'🔄','comprehension':'📰','comprehension2':'📰',
  'spelling':'🔍','spelling2':'🔍','instr_learn':'📐','instr_ex1':'⚙️','dict_ex':'📓','dict_practice':'🔤',
  'compass_ex':'🧭','instr_test':'📝','seq_learn':'🔢','seq_ex3':'🧮','seq_ex4':'📊',
  'seq_ex5':'🎯','seq_ex6':'💡','seq_ex7':'⚡','seq_ex8':'🏅','shapes_learn':'🔷',
  'shapes_ex':'🔶','shapes_ex2':'🔷','shapes_ex3':'🔶','shapes_ex4':'🔷',
  'level_sim_heb':'🎯','level_sim_dpr':'🎯','final_sim_heb':'🏆','final_sim_dpr':'🏆',
  'summary':'🎓'
};

function renderPath(){
  const list=document.getElementById('path-list');
  list.innerHTML='';list.className='path-map';
  document.querySelectorAll('.track-btn').forEach(b=>{const on=b.dataset.track===pathTrack;b.classList.toggle('active',on);b.setAttribute('aria-selected',on)});

  // Apply path title overrides
  const _ovr=getOverrides();
  PATH.forEach(s=>{const t=_ovr['path_title:'+s.id];if(t)s.title=t});

  const comp=user.completed||[];
  const frag=document.createDocumentFragment();
  const sections=[];let sec=null,lastCat='',zi=0;

  PATH.forEach((step,i)=>{
    if(pathTrack!=='all'&&step.cat!=='general'&&step.cat!==pathTrack)return;
    if(step.cat!==lastCat){
      lastCat=step.cat;zi=0;
      const b=document.createElement('div');b.className='path-section-banner cat-'+step.cat;
      if(step.cat==='general'){
        b.innerHTML=`<span class="banner-icon">${step.id==='intro'?'🚩':'🏁'}</span><span class="banner-name">${step.id==='intro'?'יוצאים לדרך':'קו הסיום'}</span>`;
      } else {
        const tp=trackProgress(step.cat,comp),m=TRACK_META[step.cat];
        b.innerHTML=`<span class="banner-icon">${m.i}</span><span class="banner-name">מסלול ${m.n}</span><span class="banner-prog"><i style="width:${Math.round(tp.done/tp.total*100)}%"></i></span><span class="banner-count">${tp.done}/${tp.total}</span>`;
      }
      frag.appendChild(b);
      sec={el:document.createElement('div'),nodes:[],states:[]};sec.el.className='path-section';
      frag.appendChild(sec.el);sections.push(sec);
    }
    const st=stepState(i,comp);
    const [x,side]=ZIG[zi%ZIG.length];zi++;
    const row=document.createElement('div');row.className='pn-row';row.style.setProperty('--x',x+'%');
    const nd=document.createElement('button');
    nd.className=`path-node cat-${step.cat} type-${step.type}`+(st.done?' completed':'')+(st.current?' current':'')+(st.locked?' locked':'');
    nd.dataset.side=side;
    nd.setAttribute('aria-label',step.title+(st.done?' (הושלם)':st.locked?' (נעול)':''));
    if(st.locked)nd.disabled=true;
    const label=step.title.replace(/ - .*/,'');
    nd.innerHTML=`<span class="path-node-circle"><span>${st.done?'✓':st.locked?'🔒':(NODE_ICONS[step.id]||step.icon)}</span></span><span class="path-node-label">${label}<small>${STEP_TYPE_LBL[step.type]}</small></span>${st.current?'<span class="pn-start">התחל</span>':''}`;
    if(!st.locked)nd.onclick=()=>openStep(i);
    row.appendChild(nd);sec.el.appendChild(row);
    sec.nodes.push(nd);sec.states.push(st);
  });
  list.appendChild(frag);

  // Hero stays in view; the "next mission" card is the shortcut to the current step
  requestAnimationFrame(()=>drawPathLines(list,sections));
}

// Smooth S-curves between consecutive nodes of the same section
function drawPathLines(container,sections){
  const old=container.querySelector('svg.path-connector');if(old)old.remove();
  const NS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(NS,'svg');svg.classList.add('path-connector');svg.setAttribute('aria-hidden','true');
  const cRect=container.getBoundingClientRect();
  svg.setAttribute('width',cRect.width);svg.setAttribute('height',container.scrollHeight);
  sections.forEach(sec=>{
    const pts=sec.nodes.map(el=>{const r=el.querySelector('.path-node-circle').getBoundingClientRect();return{x:r.left+r.width/2-cRect.left,y:r.top+r.height/2-cRect.top}});
    for(let i=0;i<pts.length-1;i++){
      const a=pts[i],b=pts[i+1],my=(a.y+b.y)/2;
      const p=document.createElementNS(NS,'path');
      p.setAttribute('d',`M${a.x} ${a.y} C${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`);
      p.setAttribute('class','seg cat-'+(sec.nodes[i].className.match(/cat-(\w+)/)||[])[1]+(sec.states[i].done&&!sec.states[i+1].locked?' seg-done':''));
      svg.appendChild(p);
    }
  });
  container.insertBefore(svg,container.firstChild);
}

function showPath(){showDash()}

// ===== OPEN STEP =====
function openStep(idx){
  curStep=idx;const step=PATH[idx];
  if(step.type==='sim'){startPathSim(step);return}
  step.type==='lesson'?openLesson(step):openQuiz(step);
}

function startPathSim(step){
  const cat=step.simCat;
  const simKeyPrefix=step.simKey||'sim';
  simCat=cat;
  window._pathSimKey=simKeyPrefix+'_'+cat;
  showSimIntro(cat,simKeyPrefix+'_'+cat);
  document.getElementById('sim-intro-start').onclick=()=>launchSim(cat);
}


