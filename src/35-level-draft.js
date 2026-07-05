/* ===== LEVEL DRAFT ===== */
function buildOffers(){const pool=[];
 player.weapons.forEach(w=>{
  if(w.level<WEAPONS[w.id].max)pool.push({type:'wlvl',id:w.id});
  else if((w.evo||0)<4)pool.push({type:'evo',id:w.id},{type:'evo',id:w.id});
  if(!(w.inf&&w.inf.length)){const innate=WEAPON_EL[w.id]||'kinetic';const opts=Object.keys(ELEMENTS).filter(el=>el!=='kinetic'&&el!==innate);if(opts.length){const _e1=pick(opts),_e2=pick(opts.filter(x=>x!==_e1));pool.push({type:'infuse',id:w.id,el:_e1});if(_e2)pool.push({type:'infuse',id:w.id,el:_e2});}}});
 if(player.weapons.length<BAL.weaponSlots)for(const id in WEAPONS){if(!player.weapons.find(w=>w.id===id))pool.push({type:'wnew',id});}
 for(const id in player.passives){if(player.passives[id]<PASSIVES[id].max)pool.push({type:'plvl',id});}
 if(Object.keys(player.passives).length<BAL.passiveSlots)for(const id in PASSIVES){if(!(id in player.passives))pool.push({type:'pnew',id});}
for(let i=pool.length-1;i>0;i--){const j=randi(0,i);[pool[i],pool[j]]=[pool[j],pool[i]];}
 // RANDOM DRAWS with a safety net: the pool stays fully shuffled (variety every level),
 // at most ONE element offer per draw, and before level 20 - while the player cannot yet
 // trigger a reaction (fewer than 2 elemented weapons) - one element offer is guaranteed.
 const out=[];let _infN=0;const _seen=new Set();for(const o of pool){if(out.length>=3)break;const _sig=o.type+':'+(o.id||'')+':'+(o.el||'');if(_seen.has(_sig))continue;if(o.type==='infuse'){if(_infN>=1||_seen.has('EL:'+o.el))continue;_infN++;_seen.add('EL:'+o.el);}_seen.add(_sig);out.push(o);}
 if(player.level<20&&_infN===0){
  const _elw=player.weapons.filter(w=>w.inf&&w.inf.length).length;
  if(_elw<2){const g=pool.find(o=>o.type==='infuse'&&!_seen.has(o.type+':'+(o.id||'')+':'+(o.el||'')));
   if(g){if(out.length>=3)out[out.length-1]=g;else out.push(g);}}
 }
 if(out.length)while(out.length<3)out.push(Math.random()<0.5?{type:'heal'}:{type:'gold'});return out;}
function offerCard(o){
 if(o.type==='wlvl'||o.type==='wnew'){const d=WEAPONS[o.id],lv=o.type==='wlvl'?player.weapons.find(w=>w.id===o.id).level+1:1;const el=ELEMENTS[WEAPON_EL[o.id]||'kinetic'];return{color:d.color,icon:d.icon,tag:t(o.type==='wnew'?'NEW':'WEAPON'),name:t(d.name),lvtxt:(o.type==='wnew'?t('Acquire'):`Lv ${lv-1} → ${lv}`)+' · '+t(el.name),desc:faWD(o.id,lv)};}
 if(o.type==='evo'){const w=player.weapons.find(x=>x.id===o.id),tier=(w.evo||0)+1;let extra=t('+35% power, +1 projectile, faster & wider.');return{color:'#ffd24b',icon:WEAPONS[o.id].icon,tag:t('EVOLVE'),name:evoName(o.id,tier),lvtxt:`${t('Evolution')} ${tier} / 4`,desc:extra};}
 if(o.type==='infuse'){const E=ELEMENTS[o.el],d=WEAPONS[o.id];return{color:E.color,icon:E.icon,tag:t('INFUSE'),name:`${t(E.name)} ${t(d.name)}`,lvtxt:t('Locks Element (permanent)'),desc:(LANG==='fa')?(t(d.name)+' \u062f\u06cc\u06af\u0631 \u0628\u0631\u0627\u06cc \u0647\u0645\u06cc\u0634\u0647 '+t(E.name)+' \u0627\u0633\u062a - \u062a\u0646\u0647\u0627 \u0639\u0646\u0635\u0631\u0634. \u0628\u0631\u0627\u06cc \u0628\u0631\u0627\u0641\u0631\u0648\u062e\u062a\u0646 \u0648\u0627\u06a9\u0646\u0634\u060c \u0622\u0646 \u0631\u0627 \u0628\u0627 \u0639\u0646\u0635\u0631\u06cc \u062f\u06cc\u06af\u0631 \u0628\u0631 \u0633\u0644\u0627\u062d\u06cc \u062f\u06cc\u06af\u0631 \u0647\u0645\u200c\u062c\u0641\u062a \u06a9\u0646.'):`${d.name} is now permanently ${E.name} - its only element. Pair it with a different element on another weapon to trigger reactions.`};}
 if(o.type==='plvl'||o.type==='pnew'){const d=PASSIVES[o.id],lv=o.type==='plvl'?player.passives[o.id]+1:1;return{color:d.color,icon:d.icon,tag:t(o.type==='pnew'?'NEW':'PASSIVE'),name:t(d.name),lvtxt:o.type==='pnew'?t('Acquire'):`Lv ${lv-1} → ${lv}`,desc:faPD(o.id,lv)};}
 if(o.type==='heal')return{color:'#ff8a6e',icon:'❤',tag:t('RECOVER'),name:t('Repair Kit'),lvtxt:t('Instant'),desc:t('Restore 30% of your max hull.')};
 return{color:'#ffc24b',icon:'◈',tag:t('SALVAGE'),name:t('Credit Cache'),lvtxt:t('Instant'),desc:t('Gain 25 credits.')};}
function applyOffer(o){
 const ri=o.rar?RARITY.indexOf(o.rar):0;
 const heal=p=>player.hp=clamp(player.hp+player.maxHp*p,0,player.maxHp);
 const randEl=w=>{if(w.inf&&w.inf.length)return;const innate=WEAPON_EL[w.id]||'kinetic';const opts=Object.keys(ELEMENTS).filter(el=>el!=='kinetic'&&el!==innate);if(opts.length)w.inf=[pick(opts)];};
 const gains=[1,1,2,2,3,2,2,3][ri];
 if(o.type==='wlvl'||o.type==='wnew'){
  let w;if(o.type==='wnew'){w={id:o.id,level:0,timer:0,orbAngle:0};player.weapons.push(w);}else w=player.weapons.find(x=>x.id===o.id);
  const max=WEAPONS[o.id].max;w.level=Math.min(max,w.level+gains);
  if(ri>=1)heal(0.10);
  if(ri===3)randEl(w);
  if(ri===4&&w.level>=max&&(w.evo||0)<4)w.evo=(w.evo||0)+1;
  if(ri===5){w.evo=Math.min(4,(w.evo||0)+1);toast('MYTHIC: FORCED EVOLUTION');}
  if(ri===6){w.cosmic=true;toast('COSMIC: '+WEAPONS[o.id].name.toUpperCase()+' FIRES TWIN VOLLEYS');}
  if(ri===7){w.evo=Math.min(4,(w.evo||0)+1);randEl(w);randEl(w);heal(1);toast('TRANSCENDENT ASCENSION');}}
 else if(o.type==='evo'){const w=player.weapons.find(x=>x.id===o.id);w.evo=(w.evo||0)+1;toast('EVOLVED: '+evoName(o.id,w.evo).toUpperCase());if(ri>=5)w.level=WEAPONS[o.id].max;}
 else if(o.type==='infuse'){const w=player.weapons.find(x=>x.id===o.id);if(w&&!(w.inf&&w.inf.length)){w.inf=[o.el];toast(ELEMENTS[o.el].name.toUpperCase()+' LOCKED \u00b7 '+WEAPONS[o.id].name.toUpperCase());if(ri>=1)heal(0.10);if(ri>=3)w.level=Math.min(WEAPONS[o.id].max,w.level+1);if(ri>=5){w.level=Math.min(WEAPONS[o.id].max,w.level+1);toast('RESONANT ELEMENT: '+WEAPONS[o.id].name.toUpperCase()+' SURGES');}}}
 else if(o.type==='plvl'||o.type==='pnew'){
  const max=PASSIVES[o.id].max,cur=player.passives[o.id]||0;
  player.passives[o.id]=Math.min(max+(ri>=5?1:0),cur+gains);
  if(ri>=1)heal(0.10);
  if(ri===6){const others=Object.keys(player.passives).filter(k=>k!==o.id&&player.passives[k]<PASSIVES[k].max);if(others.length){const k=pick(others);player.passives[k]++;toast('COSMIC ECHO: +'+PASSIVES[k].name.toUpperCase());}}
  if(ri===7){for(const k in player.passives)player.passives[k]=Math.min(PASSIVES[k].max+1,player.passives[k]+1);heal(1);toast('TRANSCENDENT: ALL AUGMENTS RISE');}}
 else if(o.type==='heal')heal(0.3+0.1*ri);
 else if(o.type==='gold')gold+=25*(ri+1);
 recalc(player);refreshDock();}
function resonanceOverflow(){
 player.hp=clamp(player.hp+player.maxHp*0.12,0,player.maxHp);gold+=30+player.level;
 if((player._ofl||0)<25){player._ofl=(player._ofl||0)+1;player.perm.dmg+=0.01;recalc(player);}
 toast('RESONANCE OVERFLOW \u00b7 +CREDITS +HULL');sfx('pickup');}
function openLevelUp(){
 const offers=buildOffers();
 if(!offers.length){resonanceOverflow();pendingLevels--;return;}
 state='levelup';const list=document.getElementById('cardlist');list.innerHTML='';
 document.getElementById('lvltitle').textContent=`LEVEL ${player.level}`;
 document.getElementById('lvlsub').textContent=pendingLevels>1?`Choose an augment · ${pendingLevels} pending`:'Choose an augment';
 sfx('levelup');
 offers.forEach((o,i)=>{o.rar=rollRarity();if(o.type==='infuse'&&player.level<20){const b=rollRarity();if(RARITY.indexOf(b)>RARITY.indexOf(o.rar))o.rar=b;}const c=offerCard(o),el=document.createElement('div');el.className='card';
  el.style.setProperty('--c',o.rar.color);el.style.animationDelay=(i*0.06)+'s';
  if(o.rar.id==='transcendent')el.style.boxShadow='0 0 34px rgba(255,255,255,.35)';
  el.innerHTML=`<div class="tag">${o.rar.name.toUpperCase()}</div><div class="ic">${c.icon}</div><h4>${c.name}</h4><div class="lv">${c.tag} · ${c.lvtxt}</div><p>${c.desc}</p>`;
  el.onclick=()=>{applyOffer(o);pendingLevels--;document.getElementById('levelup').classList.add('hidden');resumeOrNext();};
  list.appendChild(el);});
 const rb=document.getElementById('rerollbtn'),can=player.level-(player._lastReroll==null?-99:player._lastReroll)>=2;
 rb.style.opacity=can?'1':'0.35';rb.textContent=can?'\u27f3 Reroll':'\u27f3 Reroll ready at LV '+((player._lastReroll||0)+2);
 rb.onclick=()=>{if(player.level-(player._lastReroll==null?-99:player._lastReroll)<2)return;player._lastReroll=player.level;openLevelUp();};
 document.getElementById('levelup').classList.remove('hidden');}

