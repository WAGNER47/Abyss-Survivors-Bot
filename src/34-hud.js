/* ===== HUD ===== */
function showHUD(on){if(IS_TOUCH&&document.getElementById('dodgebtn')){const db=document.getElementById('dodgebtn');const cid=player&&player.char?player.char.id:'';db.textContent=cid==='yujin'?'PARRY':(cid==='vanguard'?'GUARD':(cid==='rhino'?'CHARGE':(cid==='sorcerer'?'HEX':(cid==='sentinel'?'':'DODGE'))));db.classList.toggle('hidden',!on||cid==='sentinel');}['hud','hudstats','topright','dock','threatwrap'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.toggle('hidden',!on);});}
function updateHUD(){
 const tf=document.getElementById('threatfill');if(tf){const pct=Math.max(0,Math.min(100,(1-swarmT/Math.max(1,swarmMax))*100));tf.style.width=pct+'%';const tw=document.getElementById('threatwrap');if(tw)tw.classList.toggle('hot',pct>85);const hh=document.getElementById('threatheat');if(hh)hh.style.opacity=String(0.35+pct/150);}
 document.getElementById('hpfill').style.width=(player.hp/player.maxHp*100)+'%';
 const ew=document.getElementById('esbarwrap');if(ew){ew.classList.toggle('hidden',!(player.esMax>0));if(player.esMax>0)document.getElementById('esfill').style.width=(player.es/player.esMax*100)+'%';}
 document.getElementById('hptext').textContent=`${Math.ceil(player.hp)} / ${player.maxHp}`+(player.esMax>0?`  ◈ ${Math.ceil(player.es)}`:'');
 document.getElementById('xpfill').style.width=(player.xp/player.xpNext*100)+'%';
 document.getElementById('xptext').textContent=`${player.xp} / ${player.xpNext}`;
 const m=Math.floor(time/60),s=Math.floor(time%60);
 document.getElementById('clock').textContent=(Math.floor(time*8)).toLocaleString()+'m';document.getElementById('clock').title='DEPTH';
 {const __lk=document.getElementById('lvlk'),__ln=document.getElementById('lvlnum');if(corruption>0){__lk.textContent='\u26e7';__ln.textContent=Math.random()<0.05?'\u2593\u2593':'C'+corruption;__ln.style.color='#ff3df0';}else{__lk.textContent='LV';__ln.textContent=player.level;__ln.style.color='';}}
 document.getElementById('killnum').textContent=kills;
 document.getElementById('goldnum').textContent=gold;}
function refreshDock(){const dock=document.getElementById('dock');dock.innerHTML='';
 player.weapons.forEach(w=>{const d=WEAPONS[w.id];const el=document.createElement('div');el.className='slot';el.style.color=w.evo?'#ffd24b':d.color;el.innerHTML=`${d.icon}<span class="pip">${w.evo?'E'+w.evo:w.level}</span>`;dock.appendChild(el);});
 Object.entries(player.passives).forEach(([id,lv])=>{const d=PASSIVES[id];const el=document.createElement('div');el.className='slot pass';el.style.color=d.color;el.innerHTML=`${d.icon}<span class="pip">${lv}</span>`;dock.appendChild(el);});
 sizeDock();}
// Keep the dock to a single row that always clears the HULL bar above it: shrink the
// slots to fit the available width so it never wraps (works in portrait and landscape).
function sizeDock(){const dock=document.getElementById('dock');if(!dock)return;const n=dock.children.length;if(!n)return;
 const gap=4,avail=Math.min((window.innerWidth||360)*0.94,660);
 let size=Math.floor((avail-(n-1)*gap)/n);size=Math.max(16,Math.min(44,size));
 dock.style.setProperty('--slot',size+'px');dock.style.setProperty('--dockgap',gap+'px');}

