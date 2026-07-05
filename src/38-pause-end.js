/* ===== PAUSE / END ===== */
function doPause(){if(state!=='playing')return;state='paused';document.getElementById('pause').classList.remove('hidden');}
function doResume(){if(state!=='paused')return;state='playing';document.getElementById('pause').classList.add('hidden');lastT=performance.now();}
function hideAllScreens(){['menu','charselect','levelup','pause','gameover','boon','chest','victory','archive','rundetail','credits','codex','profile','social','options','leaderboard','captain','cosmetics','lore'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.add('hidden');});if(window._closeNav)window._closeNav();const nt=document.getElementById('navToggle');if(nt)nt.style.display='none';}
function showNavToggle(){const nt=document.getElementById('navToggle');if(nt)nt.style.display='flex';}

function runStats(){return{time,level:player.level,kills,dodges:rs?rs.dodges:0,reacts:rs?rs.reacts:{},taken:rs?Math.round(rs.taken):0,peak:rs?Math.round(rs.peak):0,gold,char:chosenChar.name,
 weapons:player.weapons.map(w=>`${WEAPONS[w.id].name} Lv${w.level}`),
 passives:Object.entries(player.passives).map(([id,lv])=>`${PASSIVES[id].name} Lv${lv}`),
 relics:Object.keys(player.relics).map(id=>{const R=RELICS.find(r=>r.id===id);return R?R.name:id;})};}
async function gameOver(){
 state='gameover';TG_SHARE=tgShareText();tgShowShare(); // TELEGRAM MINI APP
 try{const __dl=document.getElementById('deathline');if(__dl)__dl.textContent=corruption>0?'You will be remembered, champion. The deep keeps your light now.':"You didn't just fail. You disappointed me.";}catch(e){}runOver=false;
 if(time>bestTime){bestTime=time;saveBest();}
 cosDeathFx();screenShake=16;sfx('hurt');
 const m=Math.floor(time/60),s=Math.floor(time%60);
 document.getElementById('go-time').textContent=`${m}:${String(s).padStart(2,'0')}`;
 document.getElementById('go-level').textContent=player.level;
 document.getElementById('go-kills').textContent=kills;
 const bm=Math.floor(bestTime/60),bs=Math.floor(bestTime%60);
 document.getElementById('go-best').textContent=`${bm}:${String(bs).padStart(2,'0')}`;
 showHUD(false);try{recordRun(endgame?'Victory':'Defeat');}catch(e){}
 document.getElementById('gameover').classList.remove('hidden');
 }
async function victory(){
 state='victory';TG_SHARE=tgShareText();tgShowShare(); // TELEGRAM MINI APP
 runOver=false;
 if(time>bestTime){bestTime=time;saveBest();}
 sfx('levelup');screenShake=16;
 const m=Math.floor(time/60),s=Math.floor(time%60);
 document.getElementById('vy-time').textContent=`${m}:${String(s).padStart(2,'0')}`;
 document.getElementById('vy-level').textContent=player.level;
 document.getElementById('vy-kills').textContent=kills;
 document.getElementById('vy-gold').textContent=gold;
 showHUD(false);try{recordRun('Victory');}catch(e){}
 document.getElementById('victory').classList.remove('hidden');
 }

