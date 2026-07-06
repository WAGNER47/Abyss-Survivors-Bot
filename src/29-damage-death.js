/* ===== DAMAGE / DEATH ===== */
function dealDamage(e,amount,opt){opt=opt||{};let dmg=amount,crit=false;
 if(e.bhGate&&!e.bhOpen)dmg*=BH_TRICKLE; // the Reflection bleeds, barely, until it breathes
 if(!opt.tick&&player.crit>0&&Math.random()<player.crit){dmg*=(player.critMult||2);crit=true;}
 if(e.vulnT>0)dmg*=1.5;
 const mk=e.st&&e.st.mark;if(mk)dmg*=1+Math.min(0.75,0.015*mk.n);
 if((e.elite||isBig(e))&&player.perm.titanMul>1)dmg*=player.perm.titanMul;
 e.hp-=dmg;e.hitFlash=0.07;
 if(rs){rs.dmg+=dmg;rs.acc+=dmg;}
 if(crit&&player.perm.critBoom&&!opt.boom){ring(e.x,e.y,60,'#ff7a3c');for(const x of queryNear(e.x,e.y,60)){if(x!==e&&!x._dead&&dist2(e.x,e.y,x.x,x.y)<3600)dealDamage(x,dmg*0.35,{tick:true,boom:true});}}
 if(opt.tick&&CURW&&CURW.els&&!e._dead){for(const el of CURW.els)applyEl(e,el,CURW.rate*DT);}
 if(DMGNUM!=='off'){
  if(DMGNUM==='diablo'){spawnText(e.x,e.y-e.r-4,Math.round(dmg),crit?'#ffe27a':(opt.tick?'#cfe8ff':'#ffffff'),crit);}
  else if(DMGNUM==='minimal'){if(crit||(!opt.tick&&dmg>=player.damageMult*30))spawnText(e.x,e.y-e.r-4,Math.round(dmg),crit?'#ffe27a':'#ffffff',crit);}
  else{if(!opt.tick)spawnText(e.x,e.y-e.r-4,Math.round(dmg),crit?'#ffe27a':'#ffffff',crit);
   else if(Math.random()<0.05)spawnText(e.x,e.y-e.r-4,Math.round(dmg),'#cfe8ff',false);}}
 if(!opt.tick&&Math.random()<0.10)sfx('hit');
 if(e.hp<=0)killEnemy(e);return crit;}
function pushGold(o){if(player.level>=40){gold+=o.v;}else drops.push(o);}
function killEnemy(e){
 if(e._dead)return;
 if(e.emod==='necrotic'&&!e._revived){e._revived=true;e.hp=e.maxhp*0.5;ring(e.x,e.y,e.r+24,'#b6ff3c');burst(e.x,e.y,'#b6ff3c',10);spawnText(e.x,e.y-e.r-16,'NECROTIC RISE','#b6ff3c',true);return;}
 try{if(PX.corpsePhys&&!e.warden&&!e.finalboss&&!e.boulder&&e.r<70){
  const kx=(e.kvx||0),ky=(e.kvy||0),bk=Math.hypot(kx,ky);
  const ax=bk>30?kx/bk:(e.x-player.x),ay=bk>30?ky/bk:(e.y-player.y),al=Math.hypot(ax,ay)||1;
  corpses.push({x:e.x,y:e.y,vx:ax/al*(220+bk*0.6)+rand(-40,40),vy:ay/al*(220+bk*0.6)+rand(-40,40),rot:Math.random()*TAU,vr:rand(-14,14),r:e.r,color:e.color,shape:e.shape||'ball',life:0.5,maxlife:0.5});
  if(QX.corpseMax<=0){corpses.length=0;}else if(corpses.length>QX.corpseMax)corpses.shift();}}catch(e2){}
 e._dead=true;kills++;comboN++;comboT=1.5;
 if([25,50,100,200,400,800,1600].includes(comboN)){pushFeed(comboN+' KILL COMBO','#ffd24b');}
 if(e.warden&&e.arch!=='leviathan'){pushFeed('WARDEN DOWN','#ff5cf0');}
 if(e.arch==='collector'&&e._hoard){const n=Math.min(60,e._hoard);
  for(let i=0;i<n;i++){const a3=Math.random()*TAU;orbs.push({x:e.x+Math.cos(a3)*30,y:e.y+Math.sin(a3)*30,v:Math.max(1,Math.round((e._hoardV||n)/n)),r:6,vx:Math.cos(a3)*200,vy:Math.sin(a3)*200,pull:false,mag:true});}
  toast("THE COLLECTOR'S HOARD IS YOURS");}
 if(e._twinChild&&!enemies.some(x=>x!==e&&!x._dead&&x._twinChild))pendingBoons++;
 if(e.arch==='leviathan'){leviathanLock=false;gameAlert('THE LEVIATHAN FALLS','#6cffb0','the deep exhales \u00b7 ascent resumes');}
 if(obj&&obj.kind==='kill'&&(!obj.etype||e.type===obj.etype))obj.count++;
 if(e.emod==='volatile'){ring(e.x,e.y,80,'#ffb04b');burst(e.x,e.y,'#ffb04b',16);if(dist2(e.x,e.y,player.x,player.y)<6400&&player.iframes<=0&&!player.parryActive&&player.bulwarkT<=0)hitPlayer(10*bDmg());for(const x of queryNear(e.x,e.y,80)){if(x!==e&&!x._dead)dealDamage(x,14*player.damageMult,{tick:true});}}
 if(e.emod==='magnetic'){for(const o of orbs){if(dist2(e.x,e.y,o.x,o.y)<40000)o.mag=true;}}
 if(rs){if(e.elite)rs.elite++;if(e.warden||e.finalboss||e.legendary)rs.boss++;}
 if(endgame&&corruptMods.explode&&!e.elite&&!e.mage&&!isBig(e)){burst(e.x,e.y,'#ff5a3c',6);if(dist2(e.x,e.y,player.x,player.y)<4900&&player.iframes<=0)hitPlayer(7*bDmg());}
 burst(e.x,e.y,e.color,e.finalboss?90:(e.legendary||e.warden?60:(e.elite?20:9)));spawnShards(e);
 const xpv=Math.ceil(e.def.xp||1);
 if(time<BAL.instantXpTime){gainXP(xpv);spawnText(e.x,e.y-e.r-14,'+'+Math.ceil(xpv*player.xpMult)+' rez','#6cffb0',false);}
 else if(player.level>=40){gainXP(xpv);}
 else if(player.char.id==='sniper'&&CURP&&CURP.srcW==='rifle'){gainXP(xpv);spawnText(e.x,e.y-e.r-14,'+'+Math.ceil(xpv*player.xpMult)+' rez','#ff5a6e',false);}
 else orbs.push({x:e.x,y:e.y,v:xpv,r:(e.legendary||e.warden||e.finalboss)?9:(e.elite?7:5),vx:(e.kvx||0)*0.5+rand(-170,170),vy:(e.kvy||0)*0.5+rand(-170,170),pull:false});
 let gc;
 if(e.finalboss)gc=randi(40,60);else if(e.legendary||e.warden)gc=randi(15,30);else if(e.elite)gc=randi(4,8);else gc=(Math.random()<(e.def.gold||0.4)?randi(1,3):0);
 if(e.mut){gc+=randi(4,8);if(Math.random()<0.5)chests.push({x:e.x,y:e.y,r:14,vx:rand(-20,20),vy:rand(-20,20)});}
 for(let i=0;i<gc;i++)pushGold({type:'gold',x:e.x+rand(-16,16),y:e.y+rand(-16,16),r:5,vx:(e.kvx||0)*0.4+rand(-240,240),vy:(e.kvy||0)*0.4+rand(-240,240)});
 if(e.legendary||e.warden||e.finalboss){drops.push({type:'heart',x:e.x,y:e.y,r:9,vx:0,vy:0});drops.push({type:'magnet',x:e.x+18,y:e.y,r:9,vx:0,vy:0});chests.push({x:e.x-18,y:e.y,r:14,vx:rand(-20,20),vy:rand(-20,20)});}
 else if(e.elite){if(Math.random()<0.5)drops.push({type:'magnet',x:e.x,y:e.y,r:9,vx:0,vy:0});if(Math.random()<0.3)drops.push({type:'heart',x:e.x+14,y:e.y,r:9,vx:0,vy:0});if(Math.random()<BAL.chestEpicChance)chests.push({x:e.x,y:e.y,r:14,vx:rand(-20,20),vy:rand(-20,20)});}
 else{const roll=Math.random();
  if(roll<0.014)drops.push({type:'heart',x:e.x,y:e.y,r:9,vx:rand(-30,30),vy:rand(-30,30)});
  else if(roll<0.027)drops.push({type:'magnet',x:e.x,y:e.y,r:9,vx:0,vy:0});
  else if(roll<0.0295&&time-lastBombT>75){lastBombT=time;drops.push({type:'bomb',x:e.x,y:e.y,r:9,vx:0,vy:0});}
  else if(roll<0.032+BAL.chestChance&&chestCdT<=0){chests.push({x:e.x,y:e.y,r:14,vx:rand(-30,30),vy:rand(-30,30)});chestCdT=BAL.chestCooldown;}}
 if(e.splits){for(let i=0;i<2;i++){const a=Math.random()*TAU,hp=18*bHp();enemies.push({type:'runner',def:ETYPES.runner,x:e.x+Math.cos(a)*14,y:e.y+Math.sin(a)*14,r:12,hp,maxhp:hp,speed:100,dmg:8*bDmg(),color:'#ff5a6e',shootCd:2,hitFlash:0});}}
 if(player.killHeal>0)player.hp=clamp(player.hp+player.maxHp*player.killHeal,0,player.maxHp);
 if(e.warden){if(e.r>=200||e.finalboss)pendingBoons++;else{gold+=40+Math.floor(player.level*1.5);if(Math.random()<0.5)pendingChests++;}}
 if(e.reflection){reflectionDown=true;reflRef=null;pressureT=6;gold+=800;pendingBoons+=2;
  gameAlert('THE REFLECTION SHATTERS','#6cffb0','beyond this point the deep itself is the enemy');}
 if(e.finalboss)runOver='victory';
}

