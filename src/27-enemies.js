/* ===== ENEMIES ===== */
const ETYPES={
swarm:{hp:10,speed:130,dmg:5,r:9,color:'#ff8ad0',xp:1,gold:.25,after:0},
runner:{hp:20,speed:94,dmg:8,r:12,color:'#ff5a6e',xp:1,gold:.35,after:0},
brute:{hp:46,speed:60,dmg:13,r:18,color:'#ff7a4b',xp:3,gold:.5,after:28},
shooter:{hp:32,speed:50,dmg:0,r:14,color:'#5cd0ff',xp:4,gold:.6,after:55,ranged:true},
tank:{hp:150,speed:36,dmg:20,r:26,color:'#9b6dff',xp:7,gold:.8,after:62},
splitter:{hp:38,speed:70,dmg:10,r:16,color:'#6cffb0',xp:4,gold:.6,after:92,splits:true},
fastball:{hp:16,speed:210,dmg:9,r:10,color:'#ff5ad0',xp:2,gold:.3,after:26},
boulder:{hp:900,speed:64,dmg:0,r:46,color:'#8a93a8',xp:9,gold:.8,after:60,shape:'hex',boulder:true},
bigball:{hp:320,speed:42,dmg:22,r:34,color:'#ff9b4b',xp:8,gold:.9,after:55},
squish:{hp:70,speed:96,dmg:11,r:20,color:'#7cff9b',xp:4,gold:.6,after:85,squish:true},
laserball:{hp:130,speed:34,dmg:0,r:22,color:'#ff3b6e',xp:9,gold:1,after:130,laser:true},
sqM:{hp:650,speed:30,dmg:18,r:24,color:'#9fb6e0',xp:7,gold:.8,after:95,shape:'square'},
sqL:{hp:1600,speed:24,dmg:26,r:36,color:'#8aa6da',xp:13,gold:1,after:140,shape:'square'},
sqH:{hp:3600,speed:20,dmg:32,r:56,color:'#7a93c8',xp:22,gold:1.2,after:220,shape:'square'},
tri:{hp:38,speed:380,dmg:15,r:15,color:'#ff5a6e',xp:4,gold:.5,after:75,shape:'tri',sharp:true},
sunball:{hp:16000,speed:44,dmg:34,r:280,color:'#ffd24b',xp:550,special:true,warden:true,arch:'sun'},
sunsq:{hp:30000,speed:34,dmg:42,r:300,color:'#9fb6e0',xp:800,special:true,warden:true,arch:'monolith',shape:'square'},
suntri:{hp:45000,speed:95,dmg:50,r:240,color:'#ff5a6e',xp:1100,special:true,warden:true,arch:'spear',shape:'tri'},
leviathan:{hp:120000,speed:22,dmg:60,r:480,color:'#ff3df0',xp:3000,special:true,warden:true,arch:'leviathan',noEscort:true},
collector:{hp:7000,speed:52,dmg:28,r:88,color:'#5cd0ff',xp:120,special:true,warden:true,arch:'collector'},
judge:{hp:7400,speed:48,dmg:30,r:90,color:'#ffe27a',xp:120,special:true,warden:true,arch:'judge'},
twin:{hp:8200,speed:50,dmg:30,r:94,color:'#ff8ad0',xp:120,special:true,warden:true,arch:'twin'},
shepherd:{hp:6600,speed:46,dmg:26,r:86,color:'#8affc0',xp:120,special:true,warden:true,arch:'shepherd'},
colossus:{hp:11000,speed:30,dmg:40,r:160,color:'#ff7a3c',xp:200,special:true,elite:true,shape:'square'},
behemoth:{hp:30000,speed:26,dmg:48,r:210,color:'#ffae3c',xp:400,special:true,warden:true,arch:'titan'},
stamped:{hp:55,speed:0,dmg:16,r:16,color:'#ff9b4b',xp:2,gold:.6,special:true,stamp:true},
epic:{hp:820,speed:62,dmg:26,r:42,color:'#ffd24b',xp:26,special:true,elite:true},
legendary:{hp:5200,speed:50,dmg:34,r:68,color:'#c77bff',xp:130,special:true,legendary:true},
mage:{hp:70,speed:46,dmg:0,r:16,color:'#7b9bff',xp:8,special:true,mage:true,ranged:true},
titan:{hp:9500,speed:40,dmg:36,r:104,color:'#ffae3c',xp:90,special:true,warden:true,arch:'titan'},
solar:{hp:6200,speed:46,dmg:30,r:92,color:'#ff7a3c',xp:90,special:true,warden:true,arch:'solar',ranged:true},
singularity:{hp:6800,speed:44,dmg:32,r:96,color:'#9b6dff',xp:90,special:true,warden:true,arch:'void'},
omega:{hp:52000,speed:40,dmg:55,r:150,color:'#ff3df0',xp:500,special:true,finalboss:true,arch:'omega',ranged:true},
voidlord:{hp:90000,speed:30,dmg:64,r:230,color:'#9b6dff',xp:4000,special:true,warden:true,arch:'blackhole',noEscort:true},
};
function enemyMix(t){const m=['swarm','runner','runner'];for(const id in ETYPES){const e=ETYPES[id];if(e.special)continue;if(t>=e.after&&id!=='swarm'&&id!=='runner'){const w=id==='boulder'?2:((id==='tri'||id==='fastball')?5:((e.shape==='square'||id==='bigball')?3:2));for(let k=0;k<w;k++)m.push(id);}}return m;}
const EMODS={volatile:{icon:'\u26a1',color:'#ffb04b'},magnetic:{icon:'\ud83e\uddf2',color:'#5cd0ff'},phase:{icon:'\ud83d\udc7b',color:'#b9c8ff'},infernal:{icon:'\ud83d\udd25',color:'#ff7a3c'},necrotic:{icon:'\ud83d\udc80',color:'#b6ff3c'}};
function maybeModify(e){if(e.special||e.warden||e.finalboss||e.elite||e.stamp)return e;
 const ch=Math.min(0.14,0.03+time/1800*0.12);
 if(Math.random()<ch){const ks=Object.keys(EMODS);e.emod=ks[Math.floor(Math.random()*ks.length)];e.hp*=1.4;e.maxhp*=1.4;
  if(e.emod==='phase'){e.phT=rand(1,3);}if(e.emod==='infernal')e.trailT=0.25;}
 return e;}
function spawnEnemy(typeId){const def=ETYPES[typeId],ang=Math.random()*TAU,dr=Math.max(W,H)/VIEW/2+70,hp=def.hp*BAL.enemyHp(time);
 enemies.push(maybeModify({type:typeId,def,x:player.x+Math.cos(ang)*dr,y:player.y+Math.sin(ang)*dr,r:def.r,hp,maxhp:hp,speed:def.speed*rand(.9,1.1),dmg:def.dmg*BAL.enemyDmg(time),color:def.color,ranged:!!def.ranged,splits:!!def.splits,shape:def.shape||'ball',laser:!!def.laser,squish:!!def.squish,sharp:!!def.sharp,boulder:!!def.boulder,laserCd:rand(2.5,4),shootCd:rand(1.2,2.4),hitFlash:0}));}
function spawnSpecial(id,hpMul){const def=ETYPES[id],ang=Math.random()*TAU,dr=Math.max(W,H)/VIEW/2+90+def.r,sc=BAL.enemyHp(time)*(1+0.25*corruption+0.3*(corruptMods.bossUp||0))*corrScaleMul;
 enemies.push({type:id,def,x:player.x+Math.cos(ang)*dr,y:player.y+Math.sin(ang)*dr,r:def.r,hp:def.hp*sc*(hpMul||1),maxhp:def.hp*sc*(hpMul||1),speed:def.speed,dmg:(def.dmg||0)*BAL.enemyDmg(time),color:def.color,ranged:!!def.ranged,elite:!!def.elite,legendary:!!def.legendary,mage:!!def.mage,warden:!!def.warden,finalboss:!!def.finalboss,arch:def.arch||null,shape:def.shape||'ball',escortChecked:!!def.noEscort,mechTimer:rand(2.5,4),shootCd:rand(1,2),castCd:rand(1.5,3),hitFlash:0});if(corrScaleMul>1){const _e=enemies[enemies.length-1];_e.hp*=corrScaleMul;_e.maxhp*=corrScaleMul;_e.dmg=(_e.dmg||0)*corrScaleMul;}
 {const _se=enemies[enemies.length-1];if(_se&&_se.arch==='sun'&&Math.random()<0.35){_se.dying=true;_se.color='#ff5a3c';}}
 const names={titan:'TITAN CORE',solar:'SOLAR CONSTRUCT',singularity:'THE SINGULARITY',collector:'THE COLLECTOR',judge:'THE JUDGE',twin:'THE TWIN',shepherd:'THE SHEPHERD',sunball:'HELIOS, THE DYING SUN',sunsq:'THE MONOLITH',suntri:'THE SPEAR OF THE DEEP',leviathan:'THE LEVIATHAN',voidlord:'THE VOID LORD'};
 if(id==='voidlord'){toast('THE VOID LORD AWAKENS');sfx('boss');screenShake=20;}
 else if(id==='omega'){toast('OMEGA PROTOCOL AWAKENS');sfx('boss');screenShake=18;}
 else if(def.warden){toast(t(names[id]||'A WARDEN')+t(' DESCENDS. SLAY IT FOR A BOON'));sfx('boss');screenShake=12;}
 else if(id==='legendary'){toast('A LEGENDARY HORROR ARRIVES');sfx('boss');screenShake=12;}
 else if(id==='epic'){toast('AN EPIC FOE APPROACHES');sfx('boss');}}
function hazardHit(v){if(player.parryActive)return;player._lastHazardT=performance.now();hapDamage('field');v*=(1-(player.perm.hazardRes||0));if(rs)rs.taken+=v;player.esDelay=2*player.esRecMul;if(player.es>0){const ab=Math.min(player.es,v);player.es-=ab;v-=ab;}if(v>0)player.hp-=v;player.hurtFlash=Math.max(player.hurtFlash,0.1);
 if(player.hp<=0){if(player.phoenix){player.phoenix=false;player.hp=player.maxHp*0.5;player.iframes=2;toast('PHOENIX PROTOCOL');}else{player.hp=0;runOver='dead';}}}
const OBJ_REWARDS=[
 {id:'draft',label:'AUGMENT DRAFT',w:28},
 {id:'boon',label:'WARDEN BOON',w:22},
 {id:'chest',label:'SUPPLY CACHE',w:18},
 {id:'evo',label:'FORCED EVOLUTION',w:16},
 {id:'gold',label:'CREDIT JACKPOT',w:16}];
function startObjective(){
 const lv=player.level,pool=[];
 pool.push({kind:'kill',etype:null,label:'DESTROY {N} ENEMIES',target:30+Math.floor(lv*1.4),t:30});
 if(time>110)pool.push({kind:'kill',etype:'tri',label:'SHATTER {N} TRIANGLES',target:8+Math.floor(lv/7),t:35});
 if(time>40)pool.push({kind:'kill',etype:'fastball',label:'POP {N} FAST BALLS',target:10+Math.floor(lv/6),t:35});
 if(time>110)pool.push({kind:'kill',etype:'sqM',label:'BREAK {N} SQUARES',target:3+Math.floor(lv/14),t:40});
 pool.push({kind:'orbs',label:'COLLECT {N} RESONANCE ORBS',target:40+lv*2,t:30});
 pool.push({kind:'nohit',label:'TAKE NO HULL DAMAGE',target:0,t:18});
 const o=pool[Math.floor(Math.random()*pool.length)];
 let rw=Math.random()*80,rew=OBJ_REWARDS[0];for(const R of OBJ_REWARDS){rw-=R.w;if(rw<=0){rew=R;break;}}
 obj={kind:o.kind,etype:o.etype||null,label:t(o.label).replace('{N}',o.target),target:o.target,count:0,t:o.t,fail:false,reward:rew};
 gameAlert('NEW OBJECTIVE');sfx('levelup');}
function objReward(){
 const id=obj.reward.id;
 if(id==='chest'){chests.push({x:player.x+rand(-40,40),y:player.y+rand(-40,40),r:14,vx:0,vy:0});toast('OBJECTIVE COMPLETE: SUPPLY CACHE');}
 else if(id==='boon'){pendingBoons++;toast('OBJECTIVE COMPLETE: WARDEN BOON');}
 else if(id==='draft'){pendingLevels++;toast('OBJECTIVE COMPLETE: AUGMENT DRAFT');}
 else if(id==='level'){forceLevels(1);toast('OBJECTIVE COMPLETE: INSTANT ASCENT');}
 else if(id==='evo'){const c=player.weapons.filter(w=>w.level>=WEAPONS[w.id].max&&(w.evo||0)<4);
  if(c.length){const w=pick(c);w.evo=(w.evo||0)+1;toast('OBJECTIVE: EVOLVED '+evoName(w.id,w.evo).toUpperCase());sfx('evolve');hap('notify','success');refreshDock();}
  else{pendingBoons++;toast('OBJECTIVE COMPLETE: WARDEN BOON');}}
 else{gold+=220+player.level*8;toast('OBJECTIVE COMPLETE: CREDIT JACKPOT');}
 ring(player.x,player.y,180,'#6cffb0');sfx('chest');screenShake=Math.max(screenShake,6);}
let alertColor='#ff5a6e',alertSub='';
let feedReactT=0,comboN=0,comboT=0,corrWhisperT=0,corrFrozen=false,corrFreezeTime=0,corrScaleStep=0,corrScaleMul=1;
let corpses=[];
function pushFeed(txt,color){const kf=document.getElementById('killfeed');if(!kf)return;
 const d=document.createElement('div');d.className='kf';d.style.setProperty('--kc',color||'#ffd24b');d.textContent=txt;
 kf.prepend(d);while(kf.children.length>5)kf.removeChild(kf.lastChild);setTimeout(()=>{if(d.parentNode)d.parentNode.removeChild(d);},2700);}
function gameAlert(txt,color,sub){alertText=t(txt);alertColor=color||'#ff5a6e';alertSub=t(sub||'');alertTime=2.8;sfx('boss');screenShake=Math.max(screenShake,8);}
function spawnTriVolley(){
 const lv=player.level;if(lv<12)return;
 const eg=endgame||lv>=100;
 // count scales: 16 at L12 up to 32 by L60, bee-swarm 40+ in endgame
 const n=eg?randi(40,64):clamp(Math.round(16+(lv-12)*0.34),16,32);
 const def=ETYPES.tri;const hpm=BAL.enemyHp(time)*0.9;
 if(eg){
  // bee-swarm: many small clusters from all directions
  const clusters=randi(4,7);
  for(let c=0;c<clusters;c++){const arc=rand(0,TAU),per=Math.ceil(n/clusters);
   for(let i=0;i<per&&enemies.length<BAL.enemyCapQ();i++){const a=arc+rand(-0.5,0.5),dr=Math.max(W,H)/VIEW/2+rand(80,260);
    const hp=def.hp*hpm;enemies.push(maybeModify({type:'tri',def,x:player.x+Math.cos(a)*dr,y:player.y+Math.sin(a)*dr,r:def.r,hp,maxhp:hp,speed:def.speed*rand(1.0,1.25),dmg:def.dmg*BAL.enemyDmg(time),color:def.color,shape:'tri',sharp:true,hitFlash:0,shootCd:1,escortChecked:true,arch:null,mechTimer:999}));}}
  gameAlert('THE SWARM','#ff5a6e','they come like a storm of knives');
 } else {
  // mid-game: 1-2 coordinated arrow-walls from a direction
  const dirs=lv>=30?2:1;
  for(let dd=0;dd<dirs;dd++){const arc=rand(0,TAU),spread=rand(0.6,1.2);
   for(let i=0;i<Math.ceil(n/dirs)&&enemies.length<BAL.enemyCapQ();i++){const a=arc+rand(-spread/2,spread/2),dr=Math.max(W,H)/VIEW/2+rand(70,180);
    const hp=def.hp*hpm;enemies.push(maybeModify({type:'tri',def,x:player.x+Math.cos(a)*dr,y:player.y+Math.sin(a)*dr,r:def.r,hp,maxhp:hp,speed:def.speed*rand(0.95,1.15),dmg:def.dmg*BAL.enemyDmg(time),color:def.color,shape:'tri',sharp:true,hitFlash:0,shootCd:1,escortChecked:true,arch:null,mechTimer:999}));}}
  gameAlert('ARROWHEAD VOLLEY','#ff5a6e','sharp things, incoming');
 }
}
function bossArenaActive(){
 for(const e of enemies){if(e._dead)continue;if((e.warden||e.finalboss)&&e.r>=200)return true;}
 return false;
}
function runSwarm(){
 const lv=player.level,base=26+Math.floor(lv*0.9)+(endgame?corruption*5:0);
 const kinds=['swarm','runner','fastball','fastball'];if(lv>=12)kinds.push('tri','tri','tri');if(lv>=25)kinds.push('squish','bigball','bigball');if(lv>=35)kinds.push('sqM','sqM','laserball');if(lv>=55)kinds.push('sqL','sqL');if(lv>=70)kinds.push('sqH');
 const arc=rand(0,TAU),spread=rand(1.0,TAU);
 for(let i=0;i<base&&enemies.length<BAL.enemyCapQ();i++){
  const a=arc+rand(-spread/2,spread/2),dr=Math.max(W,H)/VIEW/2+rand(70,260),id=pick(kinds),def=ETYPES[id],hp=def.hp*BAL.enemyHp(time)*1.05;
  enemies.push(maybeModify({type:id,def,x:player.x+Math.cos(a)*dr,y:player.y+Math.sin(a)*dr,r:def.r,hp,maxhp:hp,speed:def.speed*rand(.95,1.15),dmg:def.dmg*BAL.enemyDmg(time),color:def.color,ranged:!!def.ranged,splits:!!def.splits,shape:def.shape||'ball',laser:!!def.laser,squish:!!def.squish,sharp:!!def.sharp,laserCd:rand(2.5,4),shootCd:rand(1.2,2.4),hitFlash:0}));}
 const names=['SWARM INBOUND','THE DARK SURGES','HORDE BREACH','THEY COME IN NUMBERS','TIDE OF THE DEEP'];
 gameAlert(names[Math.min(names.length-1,swarmCount-1)]||'SWARM INBOUND');}
function spawnStampede(){const ang=Math.random()*TAU,dr=Math.max(W,H)/VIEW/2+170,cx=player.x+Math.cos(ang)*dr,cy=player.y+Math.sin(ang)*dr;
 const px=-Math.sin(ang),py=Math.cos(ang),n=7+Math.floor(time/240),cdx=-Math.cos(ang),cdy=-Math.sin(ang),hp=ETYPES.stamped.hp*BAL.enemyHp(time)*1.1;
 for(let i=0;i<n;i++){const off=(i-(n-1)/2)*46+rand(-12,12);
  enemies.push({type:'stamped',def:ETYPES.stamped,x:cx+px*off,y:cy+py*off,r:16,hp,maxhp:hp,speed:0,dmg:16*BAL.enemyDmg(time),color:'#ff9b4b',stamp:true,cdx,cdy,stampLife:12,kvx:cdx*420,kvy:cdy*420,shootCd:99,hitFlash:0});}
 toast('STAMPEDE INBOUND');sfx('boss');screenShake=Math.max(screenShake,6);}
function spawnEscort(boss){const def=ETYPES[boss.type]||ETYPES.titan,ang=Math.random()*TAU,dr=Math.max(W,H)/VIEW/2+120,sc=BAL.enemyHp(time)*0.6*(1+0.25*corruption);
 enemies.push({type:boss.type,def,x:player.x+Math.cos(ang)*dr,y:player.y+Math.sin(ang)*dr,r:def.r*0.8,hp:def.hp*sc,maxhp:def.hp*sc,speed:def.speed*1.15,dmg:(def.dmg||0)*BAL.enemyDmg(time),color:def.color,ranged:!!def.ranged,warden:!!def.warden,finalboss:false,elite:true,arch:def.arch||null,shape:def.shape||'ball',escortChecked:true,mechTimer:rand(3,5),shootCd:rand(1,2),castCd:rand(2,3),hitFlash:0});}
function spawnDroneAt(x,y){const def=ETYPES.runner,hp=def.hp*BAL.enemyHp(time);enemies.push({type:'runner',def,x:x+rand(-30,30),y:y+rand(-30,30),r:12,hp,maxhp:hp,speed:112,dmg:9*BAL.enemyDmg(time),color:'#ffae3c',shootCd:2,hitFlash:0});}
function enemyShot(x,y,a,sp,r,dmg,life,color,boss,aura,pct){epjs.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:boss?r*1.7:r,dmg:boss?dmg*1.25:dmg,life,color,boss:!!boss,aura:aura||null,pct:pct||0,_ph:Math.random()*6.28,hp:boss?(15+player.level*1.2):1});}
function bossMechanic(e){const dmg=e.dmg;e._mech=(e._mech||0)+1;const aim=Math.atan2(player.y-e.y,player.x-e.x);
 if(e.arch==='titan'){for(let i=0;i<4;i++)spawnDroneAt(e.x,e.y);
  for(let k=-2;k<=2;k++)enemyShot(e.x,e.y,aim+k*0.16,260,8,dmg*0.5,3.4,'#ffae3c',true,'#ffe0a8',0.05);
  if(e._mech%3===0)spawnBeam(e,aim,{color:'#ffae3c',pct:0.4,track:1.2,charge:1.2});toast('TITAN ASSAULT');}
 else if(e.arch==='solar'){for(let i=0;i<3;i++)spawnHazard(player.x+rand(-130,130),player.y+rand(-130,130),'solar');
  for(let k=0;k<14;k++)enemyShot(e.x,e.y,k/14*TAU+time*0.5,200,8,dmg*0.45,3.4,'#ff8a3c',true,'#ffd0a0',0.05);toast('SOLAR STORM');}
 else if(e.arch==='void'){const s=bhSpot();spawnHazard(s.x,s.y,'blackhole');
  for(let k=-3;k<=3;k++)enemyShot(e.x,e.y,aim+k*0.12,230,8,dmg*0.45,3.4,'#9b6dff',true,'#d0b8ff',0.05);toast('SINGULARITY PULSE');}
 else if(e.arch==='sun'){e._alt=!e._alt;
  if(e._alt){for(let k=0;k<26;k++)enemyShot(e.x,e.y,k/26*TAU+time*0.7,210,9,dmg*0.5,3.6,e.dying?'#ff5a3c':'#ffd24b',true,'#fff3c4',0.05);}
  else{for(let k=-4;k<=4;k++)enemyShot(e.x,e.y,aim+k*0.12,300,9,dmg*0.55,3.4,'#ff9b3c',true,'#ffe0a8',0.05);for(let i=0;i<2;i++)spawnHazard(player.x+rand(-100,100),player.y+rand(-100,100),'solar');}
  if(e._mech%4===0){spawnBeam(e,aim,{color:e.dying?'#ff5a3c':'#ffe27a',pct:0.5,track:0.8,charge:1.3,wide:34});toast('SOLAR LANCE CHARGES');}}
 else if(e.arch==='monolith'){const sp=(e.spin||0)*0.15;
  for(const a0 of [0,Math.PI/2,Math.PI,Math.PI*1.5]){for(let k=0;k<4;k++)enemyShot(e.x,e.y,a0+sp+k*0.1-0.15,230,9,dmg*0.5,3.5,'#9fb6e0',true,'#dce8ff',0.05);}
  for(let i=0;i<3;i++)spawnHazard(player.x+rand(-160,160),player.y+rand(-160,160),'boxzone');
  if(e._mech%3===0)spawnBeam(e,aim,{color:'#9fb6e0',pct:0.45,charge:1.2,wide:36});
  if(Math.random()<0.5)spawnDroneAt(e.x,e.y);toast('MONOLITH JUDGEMENT');}
 else if(e.arch==='spear'){const tx=e.x+Math.cos(aim)*e.r*1.2,ty=e.y+Math.sin(aim)*e.r*1.2;
  for(let k=0;k<5;k++)enemyShot(tx,ty,aim+rand(-0.05,0.05),440,7,dmg*0.45,3,'#ff2a4e',true,'#ffd0d6',0.05);
  if(e._mech%2===0)spawnTriDrones(e,3);
  e.kvx=(e.kvx||0)+Math.cos(aim)*640;e.kvy=(e.kvy||0)+Math.sin(aim)*640;ring(e.x,e.y,e.r*0.6,'#ff2a4e');toast('THE SPEAR LUNGES');}
 else if(e.arch==='collector'){for(let k=0;k<10;k++)enemyShot(e.x,e.y,k/10*TAU+time,210,8,dmg*0.45,3.2,'#5cd0ff',true,'#bfeaff',0.045);if(e._mech%3===0)spawnBeam(e,aim,{color:'#5cd0ff',pct:0.4,track:1.0});}
 else if(e.arch==='judge'){player.judgedT=5;ring(player.x,player.y,60,'#ffe27a');toast('THE JUDGE MARKS YOU');
  for(let k=-2;k<=2;k++)enemyShot(e.x,e.y,aim+k*0.18,260,8,dmg*0.5,3.2,'#ffe27a',true,'#fff3c4',0.05);if(e._mech%3===0)spawnBeam(e,aim,{color:'#ffe27a',pct:0.45,charge:1.0});}
 else if(e.arch==='leviathan'){for(let k=0;k<36;k++)enemyShot(e.x,e.y,k/36*TAU+time*0.4,190,11,dmg*0.45,5,'#ff3df0',true,'#ffc4f6',0.05);
  for(let k=-4;k<=4;k++)enemyShot(e.x,e.y,aim+k*0.08,340,10,dmg*0.55,3.6,'#ff5cf0',true,'#ffd0fa',0.05);
  if(Math.random()<0.4){const s=bhSpot();spawnHazard(s.x,s.y,'blackhole');}if(e._mech%3===0)spawnBeam(e,aim,{color:'#ff3df0',pct:0.5,track:0.6,charge:1.4,wide:40});}
 else if(e.arch==='shepherd'){for(let i=0;i<5;i++)spawnDroneAt(e.x,e.y);e._herd=(e._herd||0)+1;if(e._herd%3===0)spawnSpecial('epic');for(let k=-2;k<=2;k++)enemyShot(e.x,e.y,aim+k*0.2,240,8,dmg*0.45,3.2,'#8affc0',true,null,0.045);}
 else if(e.arch==='omega'){const r=randi(0,3);if(r===0){for(let i=0;i<5;i++)spawnDroneAt(e.x,e.y);}else if(r===1){spawnHazard(player.x,player.y,'solar');for(let i=0;i<3;i++)spawnHazard(player.x+rand(-150,150),player.y+rand(-150,150),'boxzone');}else if(r===2){const s=bhSpot();spawnHazard(s.x,s.y,'blackhole');}else{spawnBeam(e,aim,{color:'#ff3df0',pct:0.5,track:0.9,charge:1.2,wide:38});}
  for(let k=0;k<16;k++)enemyShot(e.x,e.y,k/16*TAU+time,250,8,dmg*0.5,3.4,'#ff7df0',true,'#ffd0fa',0.05);}
 else if(e.arch==='blackhole'){bhBossMech(e);}}
function bhSpot(){const pv=Math.hypot(player.pvx,player.pvy);
 if(pv>40&&Math.random()<0.55){const ux=player.pvx/pv,uy=player.pvy/pv,dd=rand(280,460);return{x:player.x+ux*dd,y:player.y+uy*dd};}
 return{x:player.x+rand(-60,60),y:player.y+rand(-60,60)};}
function mageCount(){let c=0;for(const e of enemies)if(e.mage&&!e._dead)c++;return c;}
function spawnHazard(x,y,type){type=type||'mage';if(hazards.length>=BAL.hazardCap)hazards.shift();
 if(type==='meteor')hazards.push({type,x,y,r:95,tele:1.1,life:0.25,active:false});
 else if(type==='solar')hazards.push({type,x,y,r:135,tele:0.8,life:6,active:false,dps:72*BAL.enemyDmg(time)});
 else if(type==='tar')hazards.push({type,x,y,r:130,tele:0.65,life:6.5,active:false});
 else if(type==='blackhole')hazards.push({type,x,y,r:215,tele:0.9,life:6.5,active:false,pull:400,coreR:46,dps:140*BAL.enemyDmg(time),pctps:0.20});
 else if(type==='boxzone')hazards.push({type,x,y,r:118,tele:0.75,life:4,active:false,pctps:0.10,box:true});
 else hazards.push({type:'mage',x,y,r:140,tele:1.3,life:8,ramp:0,active:false});}

