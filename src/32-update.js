/* ===== UPDATE ===== */
function update(dt){
 time+=dt;buildGrid();player._deflectR=0;player._halo=null;if(player._deflectCd>0){player._deflectCd-=dt;if(player._deflectCd<=0){player._deflectCharges=3;toast('DEFLECTOR ONLINE');}}
 if(chestCdT>0)chestCdT-=dt;
 player.fieldHaste=1;player.onRoad=onRoadAt(player.x,player.y);if(player.onRoad)player.fieldHaste*=0.78;
 if(player.char.id==='sentinel'){const aw=player.weapons.find(w=>w.id==='aura');if(aw){const r=(90+aw.level*14)*player.area;for(const e of queryNear(player.x,player.y,r+20)){if(!e._dead&&dist2(player.x,player.y,e.x,e.y)<(r+e.r)*(r+e.r)){player.fieldHaste=0.7;break;}}}}
 if(!surgeEnded&&time>=BAL.instantXpTime){surgeEnded=true;toast('SURGE ENDED. COLLECT RESONANCE ORBS');}
 let mx=0,my=0;
 if(keys['w']||keys['arrowup'])my-=1;if(keys['s']||keys['arrowdown'])my+=1;
 if(keys['a']||keys['arrowleft'])mx-=1;if(keys['d']||keys['arrowright'])mx+=1;
 let touchMag=0;if(touchActive){mx+=touchVec.x;my+=touchVec.y;touchMag=Math.min(1,Math.hypot(touchVec.x,touchVec.y));}
 if(player.dodgeCd>0)player.dodgeCd-=dt;
 if(player.dodgeT>0)player.dodgeT-=dt;
 // SORCERER hex: tick the untouchable window, keep iframes topped up.
 if(player.hexT>0){player.hexT-=dt;player.iframes=Math.max(player.iframes,0.05);}
 if(player._bhImmuneT>0)player._bhImmuneT-=dt;
 // RHINO: HOLD-TO-CHARGE. Hold the button to wind up (anime-style), release to charge.
 // Longer hold => more distance, damage, knockback, but a longer cooldown. Rapid taps stay strong.
 if(player.char.id==='rhino'){
  const _held=(keys[' ']||dodgeHeld);
  // WINDUP: gather power while the button is held (off cooldown, not mid-dash).
  if(_held&&player.dodgeCd<=0&&player.dodgeT<=0){
   player._chargingUp=true;player._chargeHold=Math.min(RHINO.maxHold,(player._chargeHold||0)+dt);
   const cf=player._chargeHold/RHINO.maxHold;
   camZoomTarget=1+0.13*cf;
   // inward-spiralling energy (anime charge), brighter and faster as it builds
   if(Math.random()<0.7){const a=Math.random()*TAU,rr=player.r+55+50*Math.random();particles.push({x:player.x+Math.cos(a)*rr,y:player.y+Math.sin(a)*rr,vx:-Math.cos(a)*(170+300*cf),vy:-Math.sin(a)*(170+300*cf),life:0.28,color:cf>0.78?'#ffffff':(cf>0.45?'#ffe0a0':'#ff9b4b'),r:1.5+2.5*cf});}
   if(cf>0.35)screenShake=Math.max(screenShake,1+3.5*cf);
   if(!player._windSfxT||time>player._windSfxT){player._windSfxT=time+0.16;sfx('thock');}
  }
  // RELEASE: launch. Power scales with how long it was held.
  else if(player._chargingUp&&!_held){player._chargingUp=false;
   const hold=player._chargeHold||0;player._chargeHold=0;const cf=hold/RHINO.maxHold;
   let dx=mx,dy=my;if(dx===0&&dy===0){const pv=Math.hypot(player.pvx,player.pvy);if(pv>10){dx=player.pvx/pv;dy=player.pvy/pv;}else{dx=player._face||1;dy=0;}}
   const dl=Math.hypot(dx,dy)||1;dx/=dl;dy/=dl;
   const dist=560+hold*235;
   player.pvx=dx*dist*7;player.pvy=dy*dist*7;player.dodgeT=Math.min(0.95,dist/900);player.iframes=Math.max(player.iframes,player.dodgeT);
   player.dodgeCd=0.55+hold*0.95;player._lastChargeCd=player.dodgeCd;
   player._chargePow={dmg:1.5+cf*3.8,knock:1.0+cf*1.8,cf};
   if(rs)rs.dodges=(rs.dodges||0)+1;
   camPunch=0.14+0.16*cf;screenShake=Math.max(screenShake,9+11*cf);
   ring(player.x,player.y,player.r+28+44*cf,cf>0.6?'#ffffff':'#ff9b4b');ring(player.x,player.y,player.r+12,'#ffd0a0');burst(player.x,player.y,'#ff9b4b',14+18*cf);
   for(let i=0;i<10;i++){const a=Math.atan2(dy,dx)+rand(-0.5,0.5);particles.push({x:player.x,y:player.y,vx:-Math.cos(a)*300,vy:-Math.sin(a)*300,life:0.35,color:'#ffd0a0',r:2});}
   hap('impact','rigid');sfx('bomb');
  }
  // ACTIVE DASH: plow through the horde, trample + knockback scaled by stored charge power.
  if(player.dodgeT>0){player._charging=true;const cp=player._chargePow||{dmg:1.6,knock:1.2,cf:0.3};
   for(const e of queryNear(player.x,player.y,player.r+85)){if(e._dead)continue;const dx=e.x-player.x,dy=e.y-player.y,d=Math.hypot(dx,dy)||1;if(d>player.r+e.r+50)continue;
    const m=Math.max(0.6,e.m||e.r*e.r/100),f=RHINO.knock*cp.knock/m;e.kvx=(e.kvx||0)+dx/d*f;e.kvy=(e.kvy||0)+dy/d*f;
    if(!isBig(e)&&e.stunT!==undefined)e.stunT=Math.max(e.stunT||0,0.25);
    if((e._trampleT||0)<=0){e._trampleT=0.15;dealDamage(e,(RHINO.trampleDmg+player.level*1.7)*cp.dmg*player.damageMult,{tick:true});if(!e._dead)burst(e.x,e.y,'#ff9b4b',3);}}
  } else if(player._charging){player._charging=false;const cp=player._chargePow||{dmg:1.6,knock:1.2,cf:0.3};
   // AFTERSHOCK scaled by charge.
   const R=280+170*cp.cf;
   ring(player.x,player.y,player.r+90,'#ff9b4b');ring(player.x,player.y,player.r+150,'#ffd0a0');burst(player.x,player.y,'#ff9b4b',22+14*cp.cf);screenShake=Math.max(screenShake,9+9*cp.cf);camPunch=Math.max(camPunch,0.1+0.08*cp.cf);sfx('bomb');
   radialImpulse(player.x,player.y,R,RHINO.aftershock*cp.knock);
   for(const e of queryNear(player.x,player.y,R)){if(e._dead)continue;if(dist2(player.x,player.y,e.x,e.y)>R*R)continue;dealDamage(e,(RHINO.aftershockDmg+player.level*2.4)*cp.dmg*player.damageMult,{tick:true});}
   player._chargePow=null;
  }
 }
 // ANGLER: GRAPPLING HARPOON. Hold to charge line length, release to fire where you aim
 // (mouse cursor on desktop, movement keys otherwise). He is the strongest arm in the deep:
 // anything short of a true giant gets DRAGGED to his feet. Giants and wardens anchor him -
 // he rides the rope in, healing for the distance traveled, scattering the corridor.
 // Hook tip and zip targets are clamped inside an active boss arena ring.
 if(player.char.id==='angler'){
  const _held=(keys[' ']||dodgeHeld);
  player._aimx=mx;player._aimy=my;
  const _clampArena=(px,py)=>{if(player._arenaR>0){const dx=px-player._arenaX,dy=py-player._arenaY,d=Math.hypot(dx,dy)||1;const lim=player._arenaR-10;if(d>lim)return{x:player._arenaX+dx/d*lim,y:player._arenaY+dy/d*lim,hit:true};}return{x:px,y:py,hit:false};};
  const _snapBack=(tx,ty)=>{if(particles.length<430)for(let k=1;k<=7;k++){const t=k/8,px=player.x+(tx-player.x)*t,py=player.y+(ty-player.y)*t;particles.push({x:px,y:py,vx:(player.x-px)*4.5+rand(-30,30),vy:(player.y-py)*4.5+rand(-30,30),life:0.2,color:'#bfefff',r:1.7});}};
  // A hook only "catches" on something worth fighting; small fry get skewered clean through.
  const _bigEnough=e=>isBig(e)||e.warden||e.finalboss||e.elite||(e.maxhp||e.hp)>=(160+player.level*14);
  // SKEWER: punch damage through a point, one-shotting fodder with a kill-through feel.
  const _skewer=(sx,sy,r,dmg,pierce)=>{for(const e of queryNear(sx,sy,r+20)){if(e._dead||e._skwT>time)continue;if(Math.hypot(e.x-sx,e.y-sy)>r+e.r)continue;
    e._skwT=time+0.05;const kill=!_bigEnough(e);dealDamage(e,kill?1e9:dmg,{tick:true});
    if(e._dead){burst(e.x,e.y,'#dff8ff',9);ring(e.x,e.y,e.r+8,'#4bd8ff');if(particles.length<440)for(let q=0;q<5;q++)particles.push({x:e.x,y:e.y,vx:rand(-140,140),vy:rand(-140,140),life:0.28,color:'#bfefff',r:2});}
    else if(!pierce){const mm=Math.max(0.6,e.m||e.r*e.r/100);const a=Math.atan2(e.y-sy,e.x-sx);e.kvx=(e.kvx||0)+Math.cos(a)*GRAPPLE.knock/mm;e.kvy=(e.kvy||0)+Math.sin(a)*GRAPPLE.knock/mm;}}};
  // WINDUP: he spins the hook overhead while held (off cooldown, no live line)
  if(_held&&player.dodgeCd<=0&&!player._grap&&player.dodgeT<=0){
   player._grapUp=true;player._grapHold=Math.min(GRAPPLE.maxHold,(player._grapHold||0)+dt);
   const cf=player._grapHold/GRAPPLE.maxHold;
   camZoomTarget=1+0.08*cf;
   if(Math.random()<0.45){const a=time*(8+8*cf);const rr=player.r+16+26*cf;particles.push({x:player.x+Math.cos(a)*rr,y:player.y+Math.sin(a)*rr,vx:Math.cos(a+1.7)*(90+140*cf),vy:Math.sin(a+1.7)*(90+140*cf),life:0.2,color:cf>0.7?'#dff8ff':'#4bd8ff',r:1.8});}
   if(cf>0.4&&Math.random()<0.2)particles.push({x:player.x+rand(-player.r,player.r),y:player.y+player.r*0.6,vx:rand(-40,40),vy:rand(6,26),life:0.3,color:'#2c6d86',r:2});
   if(!player._grapSfxT||time>player._grapSfxT){player._grapSfxT=time+0.18;sfx('thock');}
  }
  // RELEASE: hurl the harpoon where you aim
  else if(player._grapUp&&!_held){player._grapUp=false;
   const hold=player._grapHold||0;player._grapHold=0;const cf=hold/GRAPPLE.maxHold;
   const aim=anglerAim();const dx=aim.dx,dy=aim.dy;
   player._grap={ph:'out',dx,dy,trav:0,len:GRAPPLE.baseLen+cf*(GRAPPLE.maxLen-GRAPPLE.baseLen),cf,tx:player.x,ty:player.y,rode:0};
   if(rs)rs.dodges=(rs.dodges||0)+1;
   camPunch=0.06+0.08*cf;screenShake=Math.max(screenShake,3+4*cf);
   ring(player.x,player.y,player.r+14,'#4bd8ff');burst(player.x,player.y,'#4bd8ff',6+8*cf);
   for(let i=0;i<6;i++)particles.push({x:player.x,y:player.y,vx:-dx*260+rand(-60,60),vy:-dy*260+rand(-60,60),life:0.24,color:'#bfefff',r:2});
   hap('impact','light');sfx('thock');
  }
  // LIVE LINE
  const g=player._grap;
  if(g){
   if(g.ph==='out'){
    g.trav+=GRAPPLE.hookSpeed*dt;
    let tx=player.x+g.dx*g.trav,ty=player.y+g.dy*g.trav;
    const cl=_clampArena(tx,ty);tx=cl.x;ty=cl.y;g.tx=tx;g.ty=ty;
    // the flying hook skewers small fry it passes through (kills them) and only catches on the big
    _skewer(tx,ty,GRAPPLE.skewerR+g.cf*10,(GRAPPLE.corridorDmg+player.level*1.4)*(1+g.cf),true);
    let hitE=null;for(const e of queryNear(tx,ty,30+g.cf*12)){if(e._dead||!_bigEnough(e))continue;const d=Math.hypot(e.x-tx,e.y-ty);if(d<e.r+14+g.cf*8){hitE=e;break;}}
    if(hitE){
     // HOOK BITE: the harpoon sinks into a real target for heavy damage.
     dealDamage(hitE,(GRAPPLE.hookHit+player.level*3.4)*(1+g.cf)*player.damageMult,{});
     burst(tx,ty,'#dff8ff',14);ring(tx,ty,hitE.r+14,'#dff8ff');ring(tx,ty,hitE.r+26,'#4bd8ff');screenShake=Math.max(screenShake,7+5*g.cf);camPunch=Math.max(camPunch,0.07+0.05*g.cf);hap('impact','heavy');
     if(hitE.stunT!==undefined)hitE.stunT=Math.max(hitE.stunT||0,0.35);
     // THE STRONGARM RULE: only true giants and wardens can anchor him. Everything else gets dragged.
     const heavy=isBig(hitE)||hitE.warden||hitE.finalboss;
     if(!hitE._dead&&!heavy){g.ph='pull';g.e=hitE;hitE._grapT=0;if(hitE.stunT!==undefined)hitE.stunT=Math.max(hitE.stunT||0,0.6);toast('HOOKED');sfx('shield');}
     else{g.ph='zip';g.e=hitE._dead?null:hitE;g.px=tx;g.py=ty;player.iframes=Math.max(player.iframes,0.12);sfx('bomb');}
    }
    else if(cl.hit||g.trav>=g.len){g.ph='zip';g.e=null;g.px=tx;g.py=ty;player.iframes=Math.max(player.iframes,0.1);}
   }
   else if(g.ph==='zip'){
    let tx=g.e&&!g.e._dead?g.e.x:g.px,ty=g.e&&!g.e._dead?g.e.y:g.py;
    const cl=_clampArena(tx,ty);tx=cl.x;ty=cl.y;g.tx=tx;g.ty=ty;g.px=tx;g.py=ty;
    const dx=tx-player.x,dy=ty-player.y,d=Math.hypot(dx,dy)||1;
    const stopAt=g.e?player.r+g.e.r+8:10;
    const sp=(GRAPPLE.zipSpeed+g.cf*650)*dt;
    player.iframes=Math.max(player.iframes,0.07);
    if(d<=stopAt+sp){ // ARRIVAL: harpoon slam + rope snap-back + RIDE HEAL
     player.x=tx-dx/d*stopAt;player.y=ty-dy/d*stopAt;g.rode=(g.rode||0)+Math.max(0,d-stopAt);
     // LANDING SLAM: he drops onto the target with his full weight. Real fight damage.
     if(g.e&&!g.e._dead){dealDamage(g.e,(GRAPPLE.slamHit+player.level*4.2)*(1+g.cf)*player.damageMult,{});const mm=Math.max(0.6,g.e.m||g.e.r*g.e.r/100);g.e.kvx=(g.e.kvx||0)+dx/d*GRAPPLE.knock*0.6/mm;g.e.kvy=(g.e.kvy||0)+dy/d*GRAPPLE.knock*0.6/mm;if(g.e.stunT!==undefined)g.e.stunT=Math.max(g.e.stunT||0,0.5);}
     _skewer(player.x,player.y,player.r+56,(GRAPPLE.corridorDmg+player.level*1.6)*(1+g.cf),false);
     const hf=Math.min(GRAPPLE.rideHealCap,(g.rode||0)*GRAPPLE.rideHeal);
     if(hf>0.004){player.hp=Math.min(player.maxHp,player.hp+player.maxHp*hf);spawnText(player.x,player.y-player.r-14,'+'+Math.round(hf*player.maxHp),'#6cffb0',false);}
     ring(player.x,player.y,player.r+34,'#4bd8ff');ring(player.x,player.y,player.r+64,'#dff8ff');burst(player.x,player.y,'#4bd8ff',16+10*g.cf);
     _snapBack(tx,ty);
     radialImpulse(player.x,player.y,170+80*g.cf,650*(1+g.cf*0.7));
     screenShake=Math.max(screenShake,8+7*g.cf);camPunch=Math.max(camPunch,0.1+0.08*g.cf);hap('impact','heavy');sfx('bomb');
     player._grap=null;player.dodgeCd=0.9+g.cf*0.8;player._grapLastCd=player.dodgeCd;
    } else {
     player.x+=dx/d*sp;player.y+=dy/d*sp;player.pvx=dx/d*260;player.pvy=dy/d*260;g.rode=(g.rode||0)+sp;
     // KILL-DASH: the diver punches through the swarm, skewering fodder and helping him escape.
     _skewer(player.x,player.y,player.r+40,(GRAPPLE.corridorDmg+player.level*1.4)*(1+g.cf*0.6),false);
     for(const e2 of queryNear(player.x,player.y,player.r+70)){if(e2._dead||e2===g.e)continue;const ex=e2.x-player.x,ey=e2.y-player.y,ed=Math.hypot(ex,ey)||1;if(ed>player.r+e2.r+42)continue;
      const m2=Math.max(0.6,e2.m||e2.r*e2.r/100);e2.kvx=(e2.kvx||0)+ex/ed*GRAPPLE.knock/m2;e2.kvy=(e2.kvy||0)+ey/ed*GRAPPLE.knock/m2;}
     if(particles.length<430&&Math.random()<0.7){particles.push({x:player.x,y:player.y,vx:-dx/d*300+rand(-40,40),vy:-dy/d*300+rand(-40,40),life:0.2,color:'#4bd8ff',r:2});particles.push({x:player.x-dx/d*10,y:player.y-dy/d*10,vx:-dx/d*180,vy:-dy/d*180,life:0.14,color:'#dff8ff',r:1.4});}
    }
   }
   else if(g.ph==='pull'){
    const e=g.e;
    if(!e||e._dead){if(e)_snapBack(g.tx,g.ty);player._grap=null;player.dodgeCd=0.55;player._grapLastCd=player.dodgeCd;}
    else{
     g.tx=e.x;g.ty=e.y;
     const dx=player.x-e.x,dy=player.y-e.y,d=Math.sqrt(dx*dx+dy*dy)||1;
     const m=Math.max(0.6,e.m||e.r*e.r/100);
     const sp=(GRAPPLE.pullSpeed/Math.max(1,m*0.4))*dt;
     if(e.stunT!==undefined)e.stunT=Math.max(e.stunT||0,0.12);
     if(d<=player.r+e.r+8+sp){ // LANDED at his feet
      e.x=player.x-dx/d*(player.r+e.r+6);e.y=player.y-dy/d*(player.r+e.r+6);
      dealDamage(e,(GRAPPLE.slamHit*0.7+player.level*2.6)*(1+g.cf)*player.damageMult,{});
      if(!e._dead&&e.stunT!==undefined)e.stunT=Math.max(e.stunT||0,0.7);
      ring(e.x,e.y,e.r+14,'#dff8ff');burst(e.x,e.y,'#4bd8ff',10);_snapBack(e.x,e.y);screenShake=Math.max(screenShake,5);hap('impact','medium');
      player._grap=null;player.dodgeCd=0.7+g.cf*0.5;player._grapLastCd=player.dodgeCd;
     } else {e.x+=dx/d*sp;e.y+=dy/d*sp;if(particles.length<430&&Math.random()<0.5)particles.push({x:e.x,y:e.y,vx:rand(-60,60),vy:rand(-60,60),life:0.18,color:'#4bd8ff',r:1.6});}
    }
   }
   if(player._grap&&player.hp<=0)player._grap=null;
  }
 }
 if(player.parryT>0)player.parryT-=dt;else player.parryActive=false;
 if(player.parryCdT>0)player.parryCdT-=dt;
 if(player.parryFlash>0)player.parryFlash-=dt;
 if(player.judgedT>0)player.judgedT-=dt;
 if(player.bulwarkT>0){player.bulwarkT-=dt;player.iframes=Math.max(player.iframes,0.05);player.slowT=0;}
 if(player.parryActive){for(const e of queryNear(player.x,player.y,player.r+30)){if(e._dead)continue;const rr=player.r+24+e.r;if(dist2(player.x,player.y,e.x,e.y)<rr*rr){const kx=e.x-player.x,ky=e.y-player.y,kd=Math.hypot(kx,ky)||1,m=Math.max(0.6,e.m||e.r*e.r/100);e.kvx=(e.kvx||0)+kx/kd*500/m;e.kvy=(e.kvy||0)+ky/kd*500/m;if(e.sharp){e._dead=true;burst(e.x,e.y,'#ffe27a',8);}player.parryFlash=Math.max(player.parryFlash,0.18);}}}
 const cid=player.char.id,dcfg=DODGE[cid]||DODGE.vanguard;
 const abilityReq=keys[' ']||dodgeReq;
 if(dodgeReq&&cid==='yujin'){dodgeReq=false;
  if(player._inBlackhole){
   // BLACK HOLE ESCAPE: Yujin cannot dodge normally, but a black hole would otherwise be a guaranteed kill.
   // While caught in one, the button blinks him outward to safety (his one escape).
   const ex=player._bhEscX||player._face||1,ey=player._bhEscY||0,el=Math.hypot(ex,ey)||1;
   player.pvx=ex/el*540*7;player.pvy=ey/el*540*7;player.dodgeT=0.42;player.iframes=Math.max(player.iframes,0.5);player._bhImmuneT=0.5;
   if(rs)rs.dodges=(rs.dodges||0)+1;ring(player.x,player.y,player.r+22,'#ffe27a');burst(player.x,player.y,'#ffe27a',12);for(let i=0;i<8;i++){const a=Math.atan2(ey,ex)+rand(-0.6,0.6);particles.push({x:player.x,y:player.y,vx:-Math.cos(a)*240,vy:-Math.sin(a)*240,life:0.3,color:'#ffe27a',r:2});}sfx('shield');toast('BLINK');
  } else if(player.parryCdT<=0){
   if(rs)rs.dodges=(rs.dodges||0)+1;player.parryT=PARRY.win;player.parryActive=true;player.parryCdT=PARRY.cd;ring(player.x,player.y,player.r+16,'#ffe27a');sfx('shing');
   // PARRY PULSE: a successful parry shoves and damages everything close (rewards aggressive timing)
   const PR=player.r+92;ring(player.x,player.y,PR,'#ffe27a');burst(player.x,player.y,'#ffe27a',14);screenShake=Math.max(screenShake,4);
   for(const e of queryNear(player.x,player.y,PR)){if(e._dead)continue;const kx=e.x-player.x,ky=e.y-player.y,kd=Math.hypot(kx,ky)||1;if(kd>PR+e.r)continue;const m=Math.max(0.6,e.m||e.r*e.r/100);e.kvx=(e.kvx||0)+kx/kd*940/m;e.kvy=(e.kvy||0)+ky/kd*940/m;dealDamage(e,player.damageMult*95+(isBig(e)?e.maxhp*0.012:0),{tick:true});if(!e._dead&&e.sharp){e._dead=true;burst(e.x,e.y,'#ffe27a',6);}}
  }
 }
 else if(abilityReq&&cid==='vanguard'&&player.dodgeCd<=0){dodgeReq=false;player.bulwarkT=BULWARK.dur;player.dodgeCd=BULWARK.cd;player.iframes=Math.max(player.iframes,BULWARK.dur);ring(player.x,player.y,player.r+24,'#00e5d4');sfx('shield');}
 else if(abilityReq&&cid==='sorcerer'&&player.dodgeCd<=0){dodgeReq=false;
  // HEX: become untouchable and MUTATE the swarm around you (mutated foes drop rich loot + chests).
  player.hexT=HEX.dur;player.dodgeCd=HEX.cd;player.iframes=Math.max(player.iframes,HEX.dur);
  ring(player.x,player.y,HEX.radius,'#b6ff3c');ring(player.x,player.y,HEX.radius*0.6,'#9bff5c');burst(player.x,player.y,'#b6ff3c',20);screenShake=Math.max(screenShake,6);sfx('react');
  let _mc=0;for(const x of queryNear(player.x,player.y,HEX.radius)){if(x._dead||isBig(x))continue;if(dist2(player.x,player.y,x.x,x.y)>HEX.radius*HEX.radius)continue;
   if(!x.mut){x.mut=true;x.hp=Math.min(x.maxhp*1.3,x.hp*1.3);x.maxhp*=1.3;x.dmg*=1.2;x.speed*=1.1;_mc++;}
   x.fearT=Math.max(x.fearT||0,1.2);}
  if(_mc>0)spawnText(player.x,player.y-player.r-20,'MUTATE x'+_mc,'#b6ff3c',true);toast('HEX: THE SWARM MUTATES');}
 else if((abilityReq)&&player.dodgeCd<=0&&dcfg.d>0&&cid!=='rhino'){dodgeReq=false;
  let dx=mx,dy=my;if(dx===0&&dy===0){const pv2=Math.hypot(player.pvx,player.pvy);if(pv2>10){dx=player.pvx/pv2;dy=player.pvy/pv2;}else{dx=player._face||1;dy=0;}}
  const dl=Math.hypot(dx,dy)||1;dx/=dl;dy/=dl;
  // DODGE DISTANCE scales with joystick push depth: light tap = short hop, full push = max range.
  // Keyboard / no-touch always full. Read live so the move line predicts it accurately.
  const press=(touchActive&&touchMag>0)?Math.max(0.45,Math.min(1,touchMag/0.92)):1;
  player._dodgePress=press;
  player.pvx=dx*dcfg.d*7*press;player.pvy=dy*dcfg.d*7*press;
  if(rs)rs.dodges=(rs.dodges||0)+1;hap('impact','soft');player.dodgeCd=dcfg.cd;player.dodgeT=Math.min(0.5,(dcfg.d*press)/900);player.iframes=Math.max(player.iframes,player.dodgeT);
  ring(player.x,player.y,player.r+22,player.color||player.char.color);for(let i=0;i<8;i++)particles.push({x:player.x,y:player.y,vx:-dx*220+rand(-60,60),vy:-dy*220+rand(-60,60),life:0.32,color:player.color||player.char.color,r:2});
  sfx('shield');}
 dodgeReq=false;
 if(mx!==0)player._face=mx>0?1:-1;
 const ml=Math.hypot(mx,my);if(ml>0){mx/=ml;my/=ml;}
 _aimX=ml>0?mx:0;_aimY=ml>0?my:0;
 if(player.slowT>0)player.slowT-=dt;
 const sp=player.speed*(player.onRoad?1.35:1)*(player.slowT>0?(0.35+0.65*(player.slowRes||0)):1)*(player._chargingUp?0.24:1);
 const acc=Math.min(1,dt*12*(player.mods.accelMul||1));
 var _kbd=(keys['w']||keys['a']||keys['s']||keys['d']||keys['arrowup']||keys['arrowdown']||keys['arrowleft']||keys['arrowright']);
 var _throttle=1;if(touchActive&&!_kbd&&ml>0)_throttle=Math.max(0.2,Math.min(1,touchMag/0.92));
 player.pvx+=(mx*sp*_throttle-player.pvx)*acc;player.pvy+=(my*sp*_throttle-player.pvy)*acc;
 if(player.dodgeT>0){const dfr=Math.pow(0.45,dt);player.pvx*=dfr;player.pvy*=dfr;player._slideT=0.6;}
 else if(ml===0){
  var spd=Math.hypot(player.pvx,player.pvy);
  if(player._slideT>0&&spd>player.speed*0.5){player._slideT-=dt;var fr1=Math.pow(0.35,dt);player.pvx*=fr1;player.pvy*=fr1;}
  else{player._slideT=0;var coasting=spd>player.speed*1.1;var fr=Math.pow(coasting?0.12:0.02,dt);player.pvx*=fr;player.pvy*=fr;}
 }
 else{player._slideT=0;}
 player.x+=player.pvx*dt;player.y+=player.pvy*dt;
 // ===== BOSS ARENA: you cannot flee a major boss. Clamp the diver inside a ring around it. =====
 {const _mb=majorBoss();
  if(_mb){const arR=Math.min(780,Math.max(480,Math.max(W,H)/VIEW*0.58))+_mb.r*0.32;
   player._arenaR=arR;player._arenaX=_mb.x;player._arenaY=_mb.y;
   const ddx=player.x-_mb.x,ddy=player.y-_mb.y,dq=Math.hypot(ddx,ddy)||1;
   if(dq>arR){const ux=ddx/dq,uy=ddy/dq;player.x=_mb.x+ux*arR;player.y=_mb.y+uy*arR;
    const vn=player.pvx*ux+player.pvy*uy;if(vn>0){player.pvx-=ux*vn;player.pvy-=uy*vn;}player.pvx-=ux*60;player.pvy-=uy*60;
    if(!player._wallFx||time-player._wallFx>0.14){player._wallFx=time;ring(player.x,player.y,player.r+14,'#ff3df0');if(particles.length<460)for(let i=0;i<5;i++)particles.push({x:player.x,y:player.y,vx:-ux*120+rand(-40,40),vy:-uy*120+rand(-40,40),life:0.4,color:'#ff5cf0',r:2});}}
  }else{player._arenaR=0;}
  // when a boss fight begins, banish the trash for a clean souls-like arena (adds/elites stay)
  const _an=!!_mb;
  if(_an&&!_arenaWasActive){for(const e of enemies){if(e._dead||e.warden||e.finalboss||e.elite||e.legendary)continue;e._dead=true;if(particles.length<460)burst(e.x,e.y,e.color,3);}}
  _arenaWasActive=_an;
 }
 const pv=Math.hypot(player.pvx,player.pvy);player.moving=pv>24;
 if(player.onRoad&&pv>sp*0.5&&Math.random()<dt*30&&particles.length<500)particles.push({x:player.x-player.pvx*0.05,y:player.y-player.pvy*0.05,vx:-player.pvx*0.2,vy:-player.pvy*0.2,life:0.3,color:'#00e5d4',r:2});
 if(player.onRoad&&!roadShown){roadShown=true;toast('ACCELERATION LANE. FASTER MOVES & ATTACKS');}

 if(player.regen>0)player.hp=clamp(player.hp+player.regen*dt,0,player.maxHp);
 if(player.hasRegen)player.hp=clamp(player.hp+player.maxHp*BAL.regenPctPerSec*dt,0,player.maxHp);
 if(player._esShatterT>0)player._esShatterT-=dt;
 if(player.esMax>0){if(player.esDelay>0)player.esDelay-=dt;else{const recRate=player._esShatterT>0?0.12:0.5;player.es=Math.min(player.esMax,player.es+player.esMax*recRate*dt/Math.max(0.2,player.esRecMul));}}
 if(player.hasBarrier&&!player.barrier.ready){player.barrier.cd-=dt;if(player.barrier.cd<=0)player.barrier.ready=true;}
 if(player.iframes>0)player.iframes-=dt;if(player.hurtFlash>0)player.hurtFlash-=dt;

 spawnTimer-=dt;
 if(spawnTimer<=0&&enemies.length<BAL.enemyCapQ()&&!leviathanLock&&!bossArenaActive()){spawnTimer=BAL.spawnInterval(time);const batch=BAL.spawnBatch(time),mix=enemyMix(time);for(let i=0;i<batch&&enemies.length<BAL.enemyCapQ();i++)spawnEnemy(pick(mix));}
 recycleT-=dt;
 if(recycleT<=0){recycleT=0.5;const rr=Math.max(W,H)/VIEW*0.85+260,rr2=rr*rr;const pv=Math.hypot(player.pvx,player.pvy);
  for(const e of enemies){if(e._dead||e.stamp)continue;
   if((e.warden||e.finalboss)&&e.r>=200)continue; // giant bosses are held by the arena leash, never wrapped
   if(dist2(e.x,e.y,player.x,player.y)>rr2){let a;
    if(pv>30&&Math.random()<0.7)a=Math.atan2(player.pvy,player.pvx)+rand(-0.9,0.9);else a=Math.random()*TAU;
    const dr=Math.max(W,H)/VIEW/2+rand(70,220),nx=player.x+Math.cos(a)*dr,ny=player.y+Math.sin(a)*dr;
    if(isBig(e)||e.elite){burst(e.x,e.y,e.color,5);burst(nx,ny,e.color,7);ring(nx,ny,e.r+12,e.color);} // mirror-blink so big foes can't be outrun
    e.x=nx;e.y=ny;e.kvx=0;e.kvy=0;}}}
 if(legendaryArmed&&player.level>=10&&player.level<BAL.finalLevel){legendaryWindowT+=dt;if(legendaryWindowT>=300){legendaryWindowT-=300;if(Math.random()<0.10)spawnSpecial('legendary');}}
 if(time>90&&!bossArenaActive()){eliteTimer-=dt;if(eliteTimer<=0){eliteTimer=rand(40,60);spawnSpecial('epic');if(corruptMods.double)spawnSpecial('epic');}}
  if(time>150&&!leviathanLock&&!bossArenaActive()){stampT-=dt;if(stampT<=0){stampT=rand(55,80);spawnStampede();}}
  // SWARM DIRECTOR: timed surges that escalate with the run, denser past L100
  if(!leviathanLock){swarmT-=dt;if(player.level>=12&&!bossArenaActive()){triVolleyT-=dt;if(triVolleyT<=0){const eg=endgame||player.level>=100;triVolleyT=eg?rand(7,12):rand(14,22);spawnTriVolley();}}}
  if(swarmT<=0&&!bossArenaActive()){swarmCount++;
   const lv=player.level,deep=endgame?(1+corruption*0.15):1;
   const interval=Math.max(28,(lv>100?34:62)-lv*0.25)/deep;
   swarmT=interval;swarmMax=interval;runSwarm();}
  // BIG-BOSS RANDOMIZER: huge balls / squares on a randomized timer, more in major levels
  if(time>150&&!leviathanLock&&!bossArenaActive()){bigT-=dt;if(bigT<=0){const lv=player.level;bigT=rand(lv>40?28:50,lv>40?52:80)/(endgame?1.5:1);
   const r=Math.random();
   if(lv>=75&&r<0.25)spawnSpecial('behemoth');
   else if(lv>=50&&r<0.55)spawnSpecial('colossus');
   else if(lv>=30&&r<0.5){spawnSpecial('epic');spawnSpecial('epic');}
   else spawnSpecial('epic');}}
  if(alertTime>0)alertTime-=dt;
  if(comboT>0){comboT-=dt;if(comboT<=0)comboN=0;}
  if(feedReactT>0)feedReactT-=dt;
  updateZones(dt);
  updateBeams(dt);
  // BLACK HOLE BOSS (prototype): awakens deep in corruption mode, once per run, when the arena is clear.
  if(false&&corruption>=1&&!bhBossDone){bhBossT-=dt; /* V10: superseded by the level-150 REFLECTION gate */if(bhBossT<=0&&!bossArenaActive()){bhBossDone=true;spawnSpecial('voidlord');gameAlert('THE VOID LORD AWAKENS','#9b6dff','the 150th seal breaks \u00b7 it devours light itself');}}
  if(seeds.length){for(const sd of seeds){sd.t-=dt;if(sd.t<=0){const tgt=nearestEnemy(sd.x,sd.y,420)||{x:sd.x,y:sd.y};ring(sd.x,sd.y,70,'#6cffb0');burst(sd.x,sd.y,'#6cffb0',16);for(const x of queryNear(tgt.x,tgt.y,90)){if(x._dead)continue;dealDamage(x,sd.dmg,{tick:true});}sd._dead=true;}}for(let i=seeds.length-1;i>=0;i--)if(seeds[i]._dead)seeds.splice(i,1);}
  if(corruption>0){corrWhisperT=(corrWhisperT||0)-dt;if(corrWhisperT<=0){corrWhisperT=rand(7,12);spawnText(player.x+rand(-80,80),player.y+rand(-60,-20),pick(CORRUPT_LINES),'#ff3df0',Math.random()<0.3,true);}}
  fpsWatchdog(dt);
  if(corrFrozen){
   corrScaleMul=corrMulFor(player.level);
   const _gate=(player.level>=TIER1_END&&!reflectionDown);
   if(player.level<TIER2_END&&!_gate){corrClock+=dt;
    if(corrClock>=CORR_LEVEL_SEC){corrClock-=CORR_LEVEL_SEC;
     player.level++;onLevelUp(player.level);player.xp=0;player.xpNext=BAL.xpNext(player.level);
     player.hp=clamp(player.hp+player.maxHp*0.03,0,player.maxHp);
     if(player.level===125){spawnSpecial('voidlord');gameAlert('THE VOID LORD','#9b6dff','the herald of what waits at 150');}
     else if(player.level===TIER1_END){spawnReflection();}
     else if(player.level%10===0)gameAlert('DEPTH MARK '+player.level,'#ff3df0','the pressure tightens');
    }}
   if(player.level>=TIER1_END){pressureT-=dt;if(pressureT<=0){pressureT=4;pressureTick();}}
  }
  while(orbs.length>900){const oo=orbs.pop();if(orbs.length)orbs[(Math.random()*orbs.length)|0].v+=oo.v;}
  if(drops.length>200){for(let i=0;i<drops.length&&drops.length>200;i++){if(drops[i].type==='gold'){gold+=drops[i].v||1;drops.splice(i,1);i--;}}if(drops.length>220)drops.length=220;}
  if(epjs.length>650)epjs.splice(0,epjs.length-650);
  if(particles.length>QX.maxParticles)particles.length=QX.maxParticles;
  for(let i=trails.length-1;i>=0;i--){const tr=trails[i];tr.life-=dt;
   if(tr.life<=0){trails.splice(i,1);continue;}
   if(player.iframes<=0&&player.bulwarkT<=0&&dist2(tr.x,tr.y,player.x,player.y)<(tr.r+player.r)*(tr.r+player.r)){player._lastBurnT=performance.now();hazardHit(tr.dps*dt);}}
  if(!obj&&time>60){objT-=dt;if(objT<=0)startObjective();}
  else if(obj){obj.t-=dt;
   const done=obj.kind==='nohit'?(obj.t<=0&&!obj.fail):(obj.count>=obj.target);
   const failed=obj.kind==='nohit'?obj.fail:(obj.t<=0);
   if(done){objReward();obj=null;objT=rand(70,110);}
   else if(failed){toast('THE DEEP WITHHOLDS ITS GIFT');gold+=30;obj=null;objT=rand(70,110);}}
 if(endgame&&corruptMods.meteors){meteorT-=dt;if(meteorT<=0){meteorT=rand(5,8);const a=Math.random()*TAU,rr=rand(60,260);spawnHazard(player.x+Math.cos(a)*rr,player.y+Math.sin(a)*rr,'meteor');}}

 for(const e of enemies){
  if(e._dead)continue;
  e._svx=0;e._svy=0;
 let dot=0,spmul=player.enemySlow*(1+0.08*(corruptMods.speed||0)),stunned=false;
  if(e.reactCd>0)e.reactCd-=dt;
  if(e.vulnT>0)e.vulnT-=dt;
  if(e.stunT>0){e.stunT-=dt;stunned=true;}
  if(e.frozenT>0){e.frozenT-=dt;stunned=true;e.kvx=0;e.kvy=0;if(e.frozenT<=0)e._mMul=-1;/* force mass recompute on thaw */}
  if(e.fearT>0)e.fearT-=dt;
  if(e._trampleT>0)e._trampleT-=dt;
  if(e.st){let chill=0,weak=0;
   for(const k in e.st){const o=e.st[k];o.t-=dt;if(o.t<=0){delete e.st[k];continue;}
    const sd=STATUS[k];if(sd.dps)dot+=sd.dps*o.n;if(k==='chill')chill=o.n;if(k==='weak')weak=o.n;}
   if(chill>0)spmul*=Math.max(0.4,1-0.04*Math.min(15,chill));
   e._weak=weak;
   const sFire=(e.st.inferno||e.st.burn||e.st.plaguefire),sChill=e.st.chill,sShock=e.st.shock,sVoid=e.st.mark;
   if(sFire){e._panicT=(e._panicT||0)-dt;if(e._panicT<=0){e._panicT=rand(0.15,0.35);const pa=Math.random()*TAU,pf=120+Math.random()*160;e.kvx=(e.kvx||0)+Math.cos(pa)*pf;e.kvy=(e.kvy||0)+Math.sin(pa)*pf;}}
   const mMul=(e.frozenT>0?60:1)*(sChill?2:1)*(sVoid?0.4:1);
   if(e._mMul!==mMul){e._mMul=mMul;const baseM=Math.max(0.5,e.r*e.r/100)*(e.shape==='square'?1.6:(e.boulder?3.4:1))*mMul;e.m=baseM;e.invM=isBig(e)?1/(baseM*PHYS.bossInv):1/baseM;}
   if(sShock&&!e._shockKick){e._shockKick=1;const sa=Math.random()*TAU,sf=200+Math.random()*200;e.kvx=(e.kvx||0)+Math.cos(sa)*sf;e.kvy=(e.kvy||0)+Math.sin(sa)*sf;e.stunT=Math.max(e.stunT||0,0.25);}
   if(!sShock)e._shockKick=0;
  }else{e._mMul=1;e._panicT=0;e._shockKick=0;}
  if(dot>0){dealDamage(e,dot*dt,{tick:true});if(e._dead)continue;}
  if(e.emod){
   if(e.emod==='phase'){e.phT=(e.phT==null?2:e.phT)-dt;if(e.phT<=0){e.phased=!e.phased;e.phT=e.phased?3:2.5;}}
   else if(e.emod==='magnetic'){for(const o of orbs){if(o.mag)continue;const md=dist2(e.x,e.y,o.x,o.y);if(md<25600){const ma=Math.atan2(e.y-o.y,e.x-o.x);o.x+=Math.cos(ma)*220*dt;o.y+=Math.sin(ma)*220*dt;}}}
   else if(e.emod==='infernal'){e.trailT-=dt;if(e.trailT<=0){e.trailT=0.28;if(trails.length<70)trails.push({x:e.x,y:e.y,r:24,life:2.4,dps:9*bDmg()});}}
  }
  if(e.arch==='leviathan'){e._sunT=(e._sunT==null?60:e._sunT)-dt;if(e._sunT<=0){e._sunT=60;spawnSpecial(pick(['sunball','sunsq','suntri']));gameAlert('THE LEVIATHAN BIRTHS A SUN','#ff3df0');}}
  if(e.arch==='collector'){for(const o of orbs){if(o._got)continue;const od=dist2(e.x,e.y,o.x,o.y);
   if(od<260000){const oa=Math.atan2(e.y-o.y,e.x-o.x);o.x+=Math.cos(oa)*330*dt;o.y+=Math.sin(oa)*330*dt;o.mag=false;
    if(od<(e.r*0.8)*(e.r*0.8)){o._got=true;e._hoard=(e._hoard||0)+1;e._hoardV=(e._hoardV||0)+o.v;}}}}
  if(e.arch==='twin'&&!e._split&&e.hp<e.maxhp*0.5){e._split=true;e._dead=true;
   for(let i=0;i<2;i++){const a2=Math.random()*TAU,hp2=e.maxhp*0.42;
    enemies.push({type:'twin',def:e.def,x:e.x+Math.cos(a2)*70,y:e.y+Math.sin(a2)*70,r:e.r*0.7,hp:hp2,maxhp:hp2,speed:e.speed*1.25,dmg:e.dmg*0.85,color:e.color,elite:true,_twinChild:true,shape:'ball',shootCd:1,hitFlash:0,escortChecked:true,arch:null,mechTimer:999});}
   burst(e.x,e.y,e.color,30);toast('THE TWIN DIVIDES');continue;}
  if((e.warden||e.finalboss)&&!e.escortChecked){const edist=Math.hypot(player.x-e.x,player.y-e.y);e.escortTrack=(e.escortTrack||0);if(edist>Math.max(W,H)/VIEW*0.62){e.escortTrack+=dt;if(e.escortTrack>2.5){e.escortChecked=true;spawnEscort(e);spawnEscort(e);toast('IT CALLS FOR REINFORCEMENTS');}}else e.escortTrack=0;}
  if(e.arch==='reflection'&&!stunned)reflTick(e,dt);
  if(!stunned&&(e.warden||e.finalboss)){e.mechTimer-=dt;if(e.mechTimer<=0){bossMechanic(e);e.mechTimer=e.finalboss?1.8:(e.arch==='spear'?1.2:(e.arch==='sun'?1.5:(e.arch==='leviathan'?1.7:(e.arch==='blackhole'?1.6:(e.arch==='reflection'?2.2:2.4)))));}}
  // orbiting sun-orbs (Helios + big round wardens) keep firing on their own cadence
  if((e.warden||e.finalboss)&&!stunned&&e.arch!=='blackhole'&&(e.arch==='sun'||(e.r>=80&&(e.shape==='ball'||!e.shape)&&!e.boulder)))bossSats(e,dt);
  // Black Hole boss: a constant gravity drag toward it, so positioning is a fight in itself
  if(e.arch==='blackhole'){const gdx=e.x-player.x,gdy=e.y-player.y,gd=Math.hypot(gdx,gdy)||1;if(gd>e.r*0.5&&gd<1400){const pf=Math.min(150,260*(1-gd/1400))*(1-((player.perm.hazardRes||0)*0.5));player.x+=gdx/gd*pf*dt;player.y+=gdy/gd*pf*dt;}}
  // SQUARE BOSS MELEE PUNISH: a searing field around box bosses — getting close burns (challenges melee)
  if((e.shape==='square'||e.arch==='monolith')&&(e.warden||e.finalboss||e.elite||e.r>=60)&&!e._dead&&!player.parryActive&&player.bulwarkT<=0){
   const mdz=e.r+(e.r>=200?70:42),mdx=player.x-e.x,mdy=player.y-e.y,mdd=Math.hypot(mdx,mdy)||1;
   if(mdd<mdz&&player.iframes<=0){let v=player.maxHp*0.10*dt*(1-(player.perm.hazardRes||0));if(player.es>0){const ab=Math.min(player.es,v);player.es-=ab;v-=ab;}if(v>0)player.hp-=v;player.hurtFlash=Math.max(player.hurtFlash,0.12);player._lastHazardT=performance.now();if(Math.random()<0.25&&particles.length<460)burst(player.x,player.y,'#ff5a6e',2);if(player.hp<=0){if(player.phoenix){player.phoenix=false;player.hp=player.maxHp*0.5;player.iframes=2;player.hurtFlash=0.4;ring(player.x,player.y,140,'#ff7a3c');toast('PHOENIX PROTOCOL');sfx('boss');}else{player.hp=0;runOver='dead';}}}}
  const big=isBig(e);
  if(e.m==null){e.m=Math.max(0.5,e.r*e.r/100)*(e.shape==='square'?1.6:(e.boulder?3.4:1));e.invM=big?1/(e.m*PHYS.bossInv):1/e.m;}
  if(e._flingT>0)e._flingT-=dt;
  if(e.kvx||e.kvy){
   e.x+=e.kvx*dt;e.y+=e.kvy*dt;
   const ks=Math.sqrt(e.kvx*e.kvx+e.kvy*e.kvy);
   if(ks>PHYS.kvMax){e.kvx*=PHYS.kvMax/ks;e.kvy*=PHYS.kvMax/ks;}
   const kf=Math.pow(PHYS.fric,dt);e.kvx*=kf;e.kvy*=kf;
   if(ks<6){e.kvx=0;e.kvy=0;}}
  const near=queryNear(e.x,e.y,e.r+34);
  for(const o of near){
   if(o===e||o._dead||o._pi<=e._pi||o.phased||e.phased)continue;
   if(o.m==null){o.m=Math.max(0.5,o.r*o.r/100);o.invM=isBig(o)?1/(o.m*PHYS.bossInv):1/o.m;}
   let dx2=o.x-e.x,dy2=o.y-e.y;const md=e.r+o.r,dd2=dx2*dx2+dy2*dy2;
   if(dd2>=md*md)continue;
   let d2=Math.sqrt(dd2);if(d2<0.01){d2=0.01;dx2=0.01;dy2=0;}
   const nx=dx2/d2,ny=dy2/d2,invSum=e.invM+o.invM;if(invSum<=0)continue;
   const rvn=(((o.kvx||0)+(o._svx||0))-((e.kvx||0)+(e._svx||0)))*nx+(((o.kvy||0)+(o._svy||0))-((e.kvy||0)+(e._svy||0)))*ny;
   if(rvn<0){
    const j=-(1+PHYS.rest)*rvn/invSum;
    e.kvx=(e.kvx||0)-j*nx*e.invM;e.kvy=(e.kvy||0)-j*ny*e.invM;
    o.kvx=(o.kvx||0)+j*nx*o.invM;o.kvy=(o.kvy||0)+j*ny*o.invM;
    if(j>PHYS.impDmg){const hit=j*PHYS.impK*player.damageMult;dealDamage(o,hit,{tick:true});if(!e._dead)dealDamage(e,hit*0.6,{tick:true});burst(e.x+nx*e.r,e.y+ny*e.r,'#ffffff',3);}}
   const pen=md-d2,c=Math.max(pen-PHYS.slop,0)/invSum*PHYS.corr;
   e.x-=nx*c*e.invM;e.y-=ny*c*e.invM;o.x+=nx*c*o.invM;o.y+=ny*c*o.invM;}
  if(e._dead)continue;
  if(stunned){if(e.hitFlash>0)e.hitFlash-=dt;continue;}
  const dx=player.x-e.x,dy=player.y-e.y,d=Math.sqrt(dx*dx+dy*dy)||1;
  if(e.stamp){e.stampLife-=dt;e.kvx=(e.kvx||0)+e.cdx*1300*dt;e.kvy=(e.kvy||0)+e.cdy*1300*dt;
   if(e.dmg>0&&d<e.r+player.r&&player.iframes<=0&&!player.parryActive)hitPlayer(e.dmg,'heavy',0.15);
   if(e.stampLife<=0)e._dead=true;
   if(e.hitFlash>0)e.hitFlash-=dt;continue;}
  if(e.laser){const want=300,dir=d>want?1:(d<want-80?-0.5:0);e.x+=dx/d*e.speed*spmul*dir*dt;e.y+=dy/d*e.speed*spmul*dir*dt;
   e.laserCd-=dt;
   if(e.laserT>0){e.laserT-=dt;const ly=e.laserY;if(Math.abs(player.y-ly)<14+player.r&&player.iframes<=0&&!player.parryActive)hitPlayer(26*bDmg()*dt*4,'field');if(e.laserT<=0)e.laserCd=rand(3,4.5);}
   else if(e.laserCd<=0){e.laserCharge=(e.laserCharge||0)+dt;if(e.laserCharge>=1.1){e.laserCharge=0;e.laserT=0.7;e.laserY=e.y;sfx('boss');}}
   if(e.hitFlash>0)e.hitFlash-=dt;continue;}
  if(e.mage){const want=360,dir=d>want?1:(d<want-80?-0.7:0);e.x+=dx/d*e.speed*spmul*dir*dt;e.y+=dy/d*e.speed*spmul*dir*dt;e.castCd-=dt;if(e.castCd<=0&&hazards.length<BAL.hazardCap){e.castCd=rand(5,7);spawnHazard(player.x,player.y,Math.random()<0.35?'tar':'mage');}}
  else if(e.ranged){const want=big?280:300,dir=d>want?1:(d<want-60?-0.6:0);e.x+=dx/d*e.speed*spmul*dir*dt;e.y+=dy/d*e.speed*spmul*dir*dt;e.shootCd-=dt;
   if(e.shootCd<=0&&d<720){e.shootCd=big?0.9:rand(1.6,2.6);
    if(e.finalboss){for(let k=0;k<16;k++)enemyShot(e.x,e.y,k/16*TAU+time,250,7,e.dmg*0.5,3.5,'#ff7df0',true);}
    else if(big){const col=e.arch==='solar'?'#ff8a3c':'#ffd24b';for(let k=0;k<10;k++)enemyShot(e.x,e.y,k/10*TAU,220,7,e.dmg*0.5,3,col,true);}
    else{const a=Math.atan2(dy,dx);enemyShot(e.x,e.y,a,240,6,ETYPES.shooter.dmg*bDmg()+10,3,'#5cd0ff',false);}}}
  else{const esE=(e.sharp||e.speed>=300)?earlySpeedEase():1;const fdir=(e.fearT>0)?-1.15:1;if(e.sharp||e.stamp||e.speed>=180){e._svx=dx/d*e.speed*spmul*esE*fdir;e._svy=dy/d*e.speed*spmul*esE*fdir;}e.x+=dx/d*e.speed*spmul*esE*fdir*dt;e.y+=dy/d*e.speed*spmul*esE*fdir*dt;}
  if(e.hitFlash>0)e.hitFlash-=dt;
  if(e.dmg>0&&d<e.r+player.r&&player.iframes<=0&&!player.parryActive){
    hitPlayer(e.dmg*(e._weak?Math.max(0.5,1-0.02*e._weak):1),(e.sharp||e.r>=40)?'heavy':'contact',(e.warden||e.finalboss)?0.24:((e.sharp||e.r>=40)?0.12:0.065));
    if(e.sharp){player.slowT=2.2*(1-0.5*(player.slowRes||0));burst(e.x,e.y,e.color,8);e._dead=true;ring(player.x,player.y,player.r+20,'#ff5a6e');
     // ENERGY SHIELD: a single triangle shatters it completely, no matter the stats.
     if(player.es>0){player.es=0;player.esDelay=Math.max(player.esDelay,5*player.esRecMul);player._esShatterT=5;
      // MASSIVE knockback shockwave: shove every nearby enemy hard, and a screen punch.
      ring(player.x,player.y,player.r+90,'#9bd0ff');ring(player.x,player.y,player.r+150,'#cfe9ff');burst(player.x,player.y,'#9bd0ff',40);
      screenShake=Math.max(screenShake,22);sfx('bomb');
      for(const o of queryNear(player.x,player.y,360)){if(o._dead||o===e)continue;const ox=o.x-player.x,oy=o.y-player.y,od=Math.hypot(ox,oy)||1;const force=1700*(1-od/360);if(force>0){o.kvx=(o.kvx||0)+ox/od*force;o.kvy=(o.kvy||0)+oy/od*force;if(o.stunT!==undefined)o.stunT=Math.max(o.stunT||0,0.4);}}
      toast('SHIELD SHATTERED');}
     // same shatter for the recharging Barrier (the blue one-mistake shield)
     if(player.hasBarrier&&player.barrier.ready){player.barrier.ready=false;player.barrier.cd=player.barrierRecharge;}}
    if(player.thorns>0&&!e._dead)dealDamage(e,player.thorns);}
 }

 DT=dt;
 if(rs){rs.t+=dt;if(rs.t>=1){rs.peak=Math.max(rs.peak,rs.acc/rs.t);rs.acc=0;rs.t=0;}}
 for(const w of player.weapons){const def=WEAPONS[w.id],evo=w.evo||0;
  const dm0=player.damageMult,ep0=player.extraProj,ar0=player.area,cd0=player.cdMul;
  if(evo>0){player.damageMult*=1+0.35*evo;player.extraProj+=evo;player.area*=1+0.06*evo;player.cdMul*=Math.pow(0.92,evo);}
  if(w.cosmic&&def.continuous)player.damageMult*=1.4;
  if(player.onRoad)player.damageMult*=1.1;
  const els=wEls(w),pow=1.3+0.35*w.level;
  if(def.continuous){CURW={els,rate:0.8+0.13*w.level};def.tick(player,w.level,dt,w);CURW=null;}
  else{w.timer-=dt;if(w.timer<=0){w.timer=def.cd(w.level,player)*player.fieldHaste;const n0=pjs.length;def.fire(player,def.stats(w.level,player));if(w.cosmic)def.fire(player,def.stats(w.level,player));for(let i=n0;i<pjs.length;i++){pjs[i].els=els;pjs[i].elPow=pow;pjs[i].srcW=w.id;}}}
  player.damageMult=dm0;player.extraProj=ep0;player.area=ar0;player.cdMul=cd0;}

 // companion drones
 if(player.companionCount>0){
  while(player.companions.length<player.companionCount)player.companions.push({ang:Math.random()*TAU,timer:rand(0,0.6),x:player.x,y:player.y});
  while(player.companions.length>player.companionCount)player.companions.pop();
  for(let i=0;i<player.companions.length;i++){const c=player.companions[i];c.ang+=dt*1.1;const cr=46;
   c.x=player.x+Math.cos(c.ang+i*TAU/player.companions.length)*cr;c.y=player.y+Math.sin(c.ang+i*TAU/player.companions.length)*cr;
   c.timer-=dt;
   if(c.timer<=0){c.timer=0.6*player.cdMul;const t=nearestEnemy(c.x,c.y,560);
    if(t){const a=Math.atan2(t.y-c.y,t.x-c.x),dmg=(10+player.level*1.5)*player.damageMult;
     pjs.push({x:c.x,y:c.y,vx:Math.cos(a)*660,vy:Math.sin(a)*660,r:5,dmg,pierce:1+player.pierceBonus,life:1.4,color:'#8affc0',kind:'bolt',hit:new Set()});}}}
 } else player.companions.length=0;

 for(const p of pjs){
  if(p.kind==='seek'){const t=nearestEnemy(p.x,p.y,520);if(t){const a=Math.atan2(t.y-p.y,t.x-p.x),ca=Math.atan2(p.vy,p.vx),na=ca+clamp(((a-ca+Math.PI*3)%TAU)-Math.PI,-4*dt,4*dt);p.vx=Math.cos(na)*p.speed;p.vy=Math.sin(na)*p.speed;}}
  p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
  for(const e of queryNear(p.x,p.y,80)){if(e._dead||p.hit.has(e))continue;
   if(dist2(p.x,p.y,e.x,e.y)<(p.r+e.r)*(p.r+e.r)){
    let dmg=p.dmg;if(p.eliteMul&&(e.elite||isBig(e)))dmg*=p.eliteMul;
    CURP=p;dealDamage(e,dmg);CURP=null;if(p.els&&p.elPow&&!e._dead)for(const el of p.els)applyEl(e,el,p.elPow);
    p.hit.add(e);burst(p.x,p.y,p.color,2);
    {const kx=e.x-player.x,ky=e.y-player.y,kd=Math.hypot(kx,ky)||1,m=Math.max(0.6,e.m||e.r*e.r/100),kb=(p.kind==='sling'?760:200)*(player.knockMul||1)/m;e.kvx=(e.kvx||0)+kx/kd*kb;e.kvy=(e.kvy||0)+ky/kd*kb;}
    if(p.kind==='catalyst'){
     // CATALYST DETONATION: twin-element burst that forces an instant Overload on the whole pack.
     const R=p.burstR||90;ring(p.x,p.y,R,'#ff5cf0');ring(p.x,p.y,R*0.62,'#5cd0ff');burst(p.x,p.y,'#d65cff',12);screenShake=Math.max(screenShake,4);
     for(const x of queryNear(p.x,p.y,R+40)){if(x._dead)continue;if(dist2(p.x,p.y,x.x,x.y)>R*R)continue;
      if(x!==e)dealDamage(x,p.dmg*0.6,{tick:true});
      // slam both elements so tryReact fires OVERLOAD immediately (lightning+plasma)
      x.reactCd=0;applyEl(x,'plasma',5);applyEl(x,'lightning',5);}
     p.life=0;break;}
    else if(p.kind==='sling'){const nt=nearestEnemy(p.x,p.y,360,p.hit);if(p.bounce>0&&nt){p.bounce--;const a=Math.atan2(nt.y-p.y,nt.x-p.x),sp=Math.hypot(p.vx,p.vy);p.vx=Math.cos(a)*sp;p.vy=Math.sin(a)*sp;}else{p.life=0;break;}}
    else{if(--p.pierce<=0){p.life=0;break;}}}}}
 for(let i=pjs.length-1;i>=0;i--)if(pjs[i].life<=0)pjs.splice(i,1);

 const halo=player._halo;
 for(const p of epjs){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
  if(p.hp==null)p.hp=1;
  const dpx=player.x-p.x,dpy=player.y-p.y,dd=Math.hypot(dpx,dpy);
  if(halo&&Math.abs(dd-halo.r)<halo.band){p.hp-=halo.dps*dt;if(p.hp<=0){p.life=0;burst(p.x,p.y,'#6cffb0',3);continue;}}
  if(player._deflectR>0&&dd<player._deflectR){if(p.boss){if(player._deflectCd<=0){p.life=0;burst(p.x,p.y,'#9bd0ff',3);if(--player._deflectCharges<=0){player._deflectCd=rand(5,10);toast('DEFLECTOR OVERLOADED');sfx('shield');}continue;}}else{p.life=0;burst(p.x,p.y,'#9bd0ff',3);continue;}}
  if(player.permShield&&!p.boss){const sr=player.r+18;if(dd<sr+p.r){p.life=0;burst(p.x,p.y,'#9b6dff',4);continue;}}
  if(player.hasBarrier&&player.barrier.ready){const br=player.r+22;if(dd<br+p.r){p.life=0;player.barrier.ready=false;player.barrier.cd=player.barrierRecharge;burst(p.x,p.y,'#9bd0ff',5);sfx('shield');continue;}}
  if(dd<player.r+p.r){
    if(player.parryActive){
     // REFLECT: bounce the shot back at 20x its damage as a golden lance that tears through enemies
     const sp=Math.hypot(p.vx,p.vy)||1,bs=Math.max(sp,680)*1.25;
     pjs.push({x:p.x,y:p.y,vx:-p.vx/sp*bs,vy:-p.vy/sp*bs,r:Math.max(7,p.r),dmg:(p.dmg||10)*20,pierce:5,life:2.2,color:'#ffe27a',kind:'bolt',hit:new Set(),_reflect:true});
     p.life=0;burst(p.x,p.y,'#ffe27a',9);ring(p.x,p.y,p.r+18,'#ffe27a');player.parryFlash=0.3;player.parryT=Math.max(player.parryT,0.14);hap('impact','rigid');sfx('shing');
     if(player.char.id==='yujin'){player.hp=clamp(player.hp+player.maxHp*0.015,0,player.maxHp);player.parryCdT=0;}
     continue;}
    if(player.iframes<=0)hitPlayer(p.dmg,'projectile',p.pct);p.life=0;}}
 for(let i=epjs.length-1;i>=0;i--)if(epjs[i].life<=0)epjs.splice(i,1);

 player._inBlackhole=false;
 for(const hz of hazards){if(hz.tele>0){hz.tele-=dt;if(hz.tele<=0){hz.active=true;if(hz.box&&Math.abs(player.x-hz.x)<hz.r&&Math.abs(player.y-hz.y)<hz.r){hz.trapping=true;toast('TRAPPED');sfx('boss');}}continue;}hz.life-=dt;
  const dxh=player.x-hz.x,dyh=player.y-hz.y,dh=Math.hypot(dxh,dyh)||1;
  const sink=(v,pct)=>{if(player.parryActive)return;if(pct)v=Math.max(v,player.maxHp*pct);v*=(1-(player.perm.hazardRes||0));if(rs)rs.taken+=v;player.esDelay=2*player.esRecMul;if(player.es>0){const ab=Math.min(player.es,v);player.es-=ab;v-=ab;}if(v>0)player.hp-=v;player.hurtFlash=Math.max(player.hurtFlash,0.14);if(player.hp<=0){if(player.phoenix){player.phoenix=false;player.hp=player.maxHp*0.5;player.iframes=2;player.hurtFlash=0.4;ring(player.x,player.y,140,'#ff7a3c');toast('PHOENIX PROTOCOL');sfx('boss');}else{player.hp=0;runOver='dead';}}};
  if(hz.type==='meteor'){if(!hz._boom){hz._boom=true;ring(hz.x,hz.y,hz.r,'#ff9b4b');screenShake=Math.max(screenShake,8);sfx('bomb');if(dh<hz.r)sink(40*bDmg());for(const x of queryNear(hz.x,hz.y,hz.r+40)){if(!x._dead&&dist2(hz.x,hz.y,x.x,x.y)<hz.r*hz.r)dealDamage(x,(80+time*0.4),{tick:true});}radialImpulse(hz.x,hz.y,hz.r+30,650);}}
  else if(hz.type==='blackhole'){
   if(dh<hz.r&&!(player._bhImmuneT>0)){player._inBlackhole=true;player._bhEscX=dxh/dh;player._bhEscY=dyh/dh;const _bh=1-((player.mods&&player.mods.bhResist)||0);const f=hz.pull*earlyEase()*(1-dh/hz.r)*(1-(player.perm.hazardRes||0)*0.6)*_bh;const step=Math.min(f*dt,Math.max(0,dh-hz.coreR*0.55));if(step>0){player.x-=dxh/dh*step;player.y-=dyh/dh*step;}}
   if(dh<hz.coreR&&!(player._bhImmuneT>0))sink(hz.dps*earlyEase()*dt*(1-((player.mods&&player.mods.bhResist)||0)*0.7),(hz.pctps||0)*earlyEase()*dt);
   for(const x of queryNear(hz.x,hz.y,hz.r)){if(x._dead||isBig(x))continue;const ex=hz.x-x.x,ey=hz.y-x.y,ed=Math.hypot(ex,ey)||1;if(ed>hz.r)continue;const xm=Math.max(0.6,x.m||x.r*x.r/100),aa=hz.pull*1.1*(1-ed/hz.r)/xm;x.kvx=(x.kvx||0)+ex/ed*aa*dt;x.kvy=(x.kvy||0)+ey/ed*aa*dt;if(ed<hz.coreR+x.r)dealDamage(x,hz.dps*0.8*dt,{tick:true});}
   for(const o of orbs){const ox=hz.x-o.x,oy=hz.y-o.y,od=Math.hypot(ox,oy)||1;if(od<hz.r){o.vx+=ox/od*500*dt;o.vy+=oy/od*500*dt;}}}
  else if(hz.type==='tar'){if(dh<hz.r)player.slowT=Math.max(player.slowT,0.22);}
  else if(hz.type==='solar'){if(dh<hz.r)sink(earlyEase()*hz.dps*dt,0.10*earlyEase()*dt);}
  else if(hz.type==='boxzone'){if(hz.active&&Math.abs(dxh)<hz.r&&Math.abs(dyh)<hz.r)sink(0,(hz.pctps||0.12)*earlyEase()*dt);if(hz.trapping&&hz.active){if(player.iframes>0){if(Math.abs(dxh)>hz.r||Math.abs(dyh)>hz.r)hz.trapping=false;}else{player.x=clamp(player.x,hz.x-hz.r+player.r,hz.x+hz.r-player.r);player.y=clamp(player.y,hz.y-hz.r+player.r,hz.y+hz.r-player.r);}}}
  else{const inside=dh<hz.r;if(inside)hz.ramp=Math.min(1,hz.ramp+dt*0.1);else hz.ramp=Math.max(0,hz.ramp-dt*0.5);if(inside&&hz.active)sink((3+Math.pow(hz.ramp,2)*BAL.hazardMaxDps)*earlyEase()*dt);}
  if(runOver)break;}
 for(let i=hazards.length-1;i>=0;i--)if(hazards[i].tele<=0&&hazards[i].life<=0)hazards.splice(i,1);

 for(const o of orbs){const d=Math.hypot(player.x-o.x,player.y-o.y);
  if(o.mag){const a=Math.atan2(player.y-o.y,player.x-o.x),sp=Math.min(1700,900+d*1.5);o.x+=Math.cos(a)*sp*dt;o.y+=Math.sin(a)*sp*dt;}
  else if(d<player.pickupRange||o.pull){o.pull=true;const a=Math.atan2(player.y-o.y,player.x-o.x),sp=Math.min(620,180+(player.pickupRange-d)*3);o.x+=Math.cos(a)*sp*dt;o.y+=Math.sin(a)*sp*dt;}
  else{o.x+=o.vx*dt;o.y+=o.vy*dt;const f=Math.pow(0.05,dt);o.vx*=f;o.vy*=f;}
  if(d<player.r+12){gainXP(o.v);if(obj&&obj.kind==='orbs')obj.count++;o._got=true;}}
 for(let i=orbs.length-1;i>=0;i--)if(orbs[i]._got)orbs.splice(i,1);
 for(const dk of drops){const d=Math.hypot(player.x-dk.x,player.y-dk.y),pr=dk.type==='gold'?player.pickupRange:player.pickupRange*0.7;if(d<pr||dk.pull){dk.pull=true;const a=Math.atan2(player.y-dk.y,player.x-dk.x);dk.x+=Math.cos(a)*440*dt;dk.y+=Math.sin(a)*440*dt;}else{dk.x+=dk.vx*dt;dk.y+=dk.vy*dt;const f=Math.pow(0.05,dt);dk.vx*=f;dk.vy*=f;}if(d<player.r+10){collectDrop(dk);dk._got=true;}}
 for(let i=drops.length-1;i>=0;i--)if(drops[i]._got)drops.splice(i,1);
 // chests: walked over -> queue non-skippable draw
 for(let i=chests.length-1;i>=0;i--){const c=chests[i];c.x+=c.vx*dt;c.y+=c.vy*dt;{const f=Math.pow(0.05,dt);c.vx*=f;c.vy*=f;}
  if(dist2(player.x,player.y,c.x,c.y)<(player.r+16)*(player.r+16)){chests.splice(i,1);grantChest();}}

 for(const f of fx){f.r+=(f.maxR-f.r)*dt*9;f.life-=dt;}for(let i=fx.length-1;i>=0;i--)if(fx[i].life<=0)fx.splice(i,1);
 for(const s of shards){s.x+=s.vx*dt;s.y+=s.vy*dt;const f=Math.pow(0.08,dt);s.vx*=f;s.vy*=f;s.rot+=s.vr*dt;s.life-=dt;}
 for(let i=shards.length-1;i>=0;i--)if(shards[i].life<=0)shards.splice(i,1);
 for(const pt of particles){pt.x+=pt.vx*dt;pt.y+=pt.vy*dt;pt.vx*=0.92;pt.vy*=0.92;pt.life-=dt;}for(let i=particles.length-1;i>=0;i--)if(particles[i].life<=0)particles.splice(i,1);
 for(const t of texts){t.y+=t.vy*dt;t.life-=dt;}for(let i=texts.length-1;i>=0;i--)if(texts[i].life<=0)texts.splice(i,1);
 for(const a of arcs)a.life-=dt;for(let i=arcs.length-1;i>=0;i--)if(arcs[i].life<=0)arcs.splice(i,1);
 for(let i=enemies.length-1;i>=0;i--)if(enemies[i]._dead)enemies.splice(i,1);
 for(let i=corpses.length-1;i>=0;i--){const c=corpses[i];c.life-=dt;if(c.life<=0){corpses.splice(i,1);continue;}c.x+=c.vx*dt;c.y+=c.vy*dt;c.rot+=c.vr*dt;c.vx*=Math.pow(0.06,dt);c.vy*=Math.pow(0.06,dt);}

 if(screenShake>0){screenShake-=dt*40;shakeX=rand(-screenShake,screenShake);shakeY=rand(-screenShake,screenShake);}else{shakeX=0;shakeY=0;screenShake=0;}
  // --- safety net: a non-finite position must never vanish the diver or fling the camera ---
 if(isFinite(player.x)&&isFinite(player.y)){player._lgx=player.x;player._lgy=player.y;}
 else{player.x=player._lgx||0;player.y=player._lgy||0;player.pvx=0;player.pvy=0;}
 // --- camera zoom (Rhino charge): clamped + softened so it can never blow up ---
 if(!(player&&player.char&&player.char.id==='rhino'&&player._chargingUp))camZoomTarget=1;
 camZoom+=(camZoomTarget-camZoom)*Math.min(1,dt*9);camPunch*=0.88;if(Math.abs(camPunch)<0.004)camPunch=0;
 if(!isFinite(camZoom))camZoom=1;if(!isFinite(camPunch))camPunch=0;
 camZoom=clamp(camZoom,0.75,1.5);camPunch=clamp(camPunch,-0.45,0.6);
 // --- smoothed camera centre with subtle look-ahead + a hard leash that keeps the diver on screen ---
 {let _tx=player.x+clamp(player.pvx*0.06,-70,70),_ty=player.y+clamp(player.pvy*0.06,-70,70);
  if(!isFinite(camCX)||!isFinite(camCY)){camCX=player.x;camCY=player.y;}
  const _k=1-Math.exp(-dt/0.05);camCX+=(_tx-camCX)*_k;camCY+=(_ty-camCY)*_k;
  const _lx=camCX-player.x,_ly=camCY-player.y,_ld=Math.hypot(_lx,_ly),_maxL=Math.min(W,H)*0.16/(VIEW||1);
  if(_ld>_maxL&&_ld>0){const _s=_maxL/_ld;camCX=player.x+_lx*_s;camCY=player.y+_ly*_s;}
  if(!isFinite(camCX))camCX=isFinite(player.x)?player.x:0;if(!isFinite(camCY))camCY=isFinite(player.y)?player.y:0;}
 updateHUD();

 // resolve end-of-frame events (order matters; chest is non-skippable)
 if(runOver==='dead'){gameOver();return;}
 if(runOver==='victory'){victory();return;}
 // Arm the grace timer the instant a choice first becomes pending during play.
 {const _np=pendingLevels+pendingBoons;if(_np>0&&_menuPend<=0){menuArmT=MENU_DELAY;menuMaxT=MENU_MAX;}_menuPend=_np;}
 if(pendingLevels>0||pendingBoons>0){
  if(menuArmT>0)menuArmT-=dt;if(menuMaxT>0)menuMaxT-=dt;
  const _now=performance.now();
  const inDanger=player._inBlackhole||(_now-(player._lastHitT||0)<450)||(_now-(player._lastHazardT||0)<450)||(_now-(player._lastBurnT||0)<450);
  // open once the base delay elapses AND you're momentarily safe — or the hard cap forces it.
  if(menuArmT<=0&&(!inDanger||menuMaxT<=0)){
   if(pendingLevels>0){openLevelUp();return;}
   if(pendingBoons>0){openBoon();return;}
  }
 }
}

function resumeOrNext(){
 if(state==='gameover'||state==='victory')return;
 if(pendingLevels>0){openLevelUp();return;}
 if(pendingBoons>0){openBoon();return;}
 state='playing';lastT=performance.now();
}

function hapDamage(kind){try{if(!OPT.vibration||!TG||!TG.HapticFeedback)return;const now=performance.now();if(now<_dmgHapT)return;_dmgHapT=now+90;const H=TG.HapticFeedback;
 // distinct, intentional patterns per damage source. soft+creamy for light, buzzy+layered for heavy.
 if(kind==='heavy'){ // big triangle/boss hit: a firm double buzz
  H.impactOccurred('heavy');setTimeout(()=>{try{H.impactOccurred('medium');}catch(e){}},70);}
 else if(kind==='fire'){ // burning: a quick warning notification, feels like a sizzle
  H.notificationOccurred('warning');}
 else if(kind==='field'){ // standing in a damaging field: a soft low pulse
  H.impactOccurred('soft');}
 else if(kind==='projectile'){ // shot: a light crisp tap
  H.impactOccurred('light');}
 else { // normal contact
  H.impactOccurred('medium');}
}catch(e){}}
function hitPlayer(dmg,srcType,pct){if(obj&&obj.kind==='nohit')obj.fail=true;player._lastHitT=performance.now();
 // percentage-of-max-hull contact damage: touching mobs costs a slice of your hull, so stacking
 // max HP or healing can't trivialize positioning. pct is a fraction (0.08 = 8% of max hull).
 if(pct){dmg=Math.max(dmg*0.35, player.maxHp*pct);}
 const sev=dmg/Math.max(1,player.maxHp);const onFire=(performance.now()-(player._lastBurnT||0)<600);
 let hk = srcType==='projectile'?'projectile':(srcType==='field'?'field':(sev>=0.18?'heavy':'contact'));
 if(onFire&&hk!=='heavy')hk='fire';
 hapDamage(hk);
 if(player.judgedT>0)dmg*=1.3;
const _prc=(corrFrozen&&reflectionDown&&player.level>TIER1_END)?Math.min(0.6,(player.level-TIER1_END)*0.012):0;
let real=Math.max(1,dmg-player.armor*(1-_prc));if(rs)rs.taken+=real;player.esDelay=2.0*player.esRecMul;
 if(player.es>0){const ab=Math.min(player.es,real);player.es-=ab;real-=ab;if(real<=0){player.iframes=BAL.playerIFrames;player.hurtFlash=0.2;sfx('shield');return;}}
 player.hp-=real;player.iframes=BAL.playerIFrames;player.hurtFlash=0.3;screenShake=Math.max(screenShake,7);const _nowS=performance.now();if(_nowS>=_hurtSfxT){_hurtSfxT=_nowS+140;sfx('hurt');}
 if(player.hp<=0){if(player.phoenix){player.phoenix=false;player.hp=player.maxHp*0.5;player.iframes=2;player.hurtFlash=0.4;ring(player.x,player.y,140,'#ff7a3c');toast('PHOENIX PROTOCOL');sfx('boss');}else{player.hp=0;runOver='dead';}}}
function collectDrop(d){
 if(d.type==='gold'){gold+=Math.round(randi(1,3)*player.goldMult);sfx('pickup');}
 else if(d.type==='shard'){const amt=Math.max(20,Math.round(player.maxHp*0.12));if(player.esMax>0){player.es=clamp((player.es||0)+amt,0,player.esMax);}else{player.hp=clamp(player.hp+amt,0,player.maxHp);}ring(player.x,player.y,player.r+30,'#9bd0ff');toast('CRYSTAL SHARD');sfx('shield');}
 else if(d.type==='heart'){player.hp=clamp(player.hp+player.maxHp*0.25,0,player.maxHp);toast('+HULL');sfx('levelup');}
 else if(d.type==='magnet'){for(const o of orbs)o.mag=true;ring(player.x,player.y,180,'#5cd0ff');toast('RESONANCE MAGNET');sfx('levelup');}
 else if(d.type==='bomb'){toast('VOID BURST');sfx('bomb');screenShake=12;radialImpulse(player.x,player.y,420,820);for(const c of corpses){const a=Math.max(0,c.life/c.maxlife);ctx.save();ctx.globalAlpha=a*0.7;ctx.fillStyle=c.color;ctx.shadowColor=c.color;ctx.shadowBlur=8;ctx.translate(c.x,c.y);ctx.rotate(c.rot);const r=c.r*(0.6+0.4*a);if(c.shape==='square')ctx.fillRect(-r,-r,r*2,r*2);else if(c.shape==='tri'){ctx.beginPath();ctx.moveTo(0,-r*1.2);ctx.lineTo(r,r*0.9);ctx.lineTo(-r,r*0.9);ctx.closePath();ctx.fill();}else if(c.shape==='hex'){ctx.beginPath();for(let k=0;k<6;k++){const ha=k/6*TAU;k?ctx.lineTo(Math.cos(ha)*r,Math.sin(ha)*r):ctx.moveTo(Math.cos(ha)*r,Math.sin(ha)*r);}ctx.closePath();ctx.fill();}else{ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();}ctx.restore();}
 for(const e of enemies){if(!isBig(e))dealDamage(e,99999);else dealDamage(e,e.maxhp*0.18);}}}
function isChoiceLevel(lv){if(lv<=10)return true;if(lv<=30)return lv%2===0;if(lv<=70)return lv%5===0;if(lv<=100)return lv%10===0;return lv>100&&lv<=CORR_CAP_LEVEL;}
const CORR_CAP_LEVEL=103;
// EARLY GRACE: hazards and fast enemies are gentler until level 10, then full strength.
// Linear ramp from 0.42 at L1 to 1.0 at L10. After L10 it is always 1.0 (no mercy for vets).
function earlyEase(){const lv=player&&player.level?player.level:1;if(lv>=12)return 1;return 0.35+0.65*((lv-1)/11);}
// Triangle / fast-enemy speed ease: a touch gentler early so new players can read them.
function earlySpeedEase(){const lv=player&&player.level?player.level:1;if(lv>=10)return 1;return 0.6+0.4*((lv-1)/9);}
function paceTarget(t){
 if(t<=120)return 1+19*t/120;
 if(t<=360)return 20+40*(t-120)/240;
 if(t<=600)return 60+35*(t-360)/240;
 if(t<=660)return 95+5*(t-600)/60;
 return Math.min(CORR_CAP_LEVEL,100+(t-660)/120);}
function forceLevels(n){for(let i=0;i<(n||1);i++){if(player.level>=CORR_CAP_LEVEL)return;player.xp=0;player.level++;onLevelUp(player.level);if(isChoiceLevel(player.level))pendingLevels++;else{player.hp=clamp(player.hp+player.maxHp*0.04,0,player.maxHp);gold+=6+Math.floor(player.level/4);}player.xpNext=BAL.xpNext(player.level);}}
function gainXP(v){
 if(leviathanLock){player.xp=Math.min(player.xp+1,player.xpNext-1);return;}
 if(player.level>=CORR_CAP_LEVEL){player.xp=0;return;}
 const ahead=player.level-paceTarget(time);
 const gov=ahead<=0?1:Math.max(0.10,Math.pow(0.55,ahead));
 player.xp+=Math.ceil(v*player.xpMult*gov);
 while(player.xp>=player.xpNext){player.xp-=player.xpNext;player.level++;onLevelUp(player.level);
  if(isChoiceLevel(player.level)){pendingLevels++;hap('notify','success');}
  else{player.hp=clamp(player.hp+player.maxHp*0.04,0,player.maxHp);gold+=6+Math.floor(player.level/4);hap('impact','light');if(corruption>0&&Math.random()<0.5)spawnText(player.x,player.y-26,pick(CORRUPT_LINES),'#ff3df0',false,true);else spawnText(player.x,player.y-26,(corruption>0?'C'+corruption:'LV '+player.level),corruption>0?'#ff3df0':'#6cffb0',false,corruption>0);}
  player.xpNext=BAL.xpNext(player.level);}}
function onLevelUp(lv){
 player.hp=clamp(player.hp+player.maxHp*BAL.levelUpHealPct,0,player.maxHp);
 if(lv>=BAL.barrierLevel&&!player.hasBarrier){player.hasBarrier=true;player.barrier={ready:true,cd:0};toast('BARRIER ONLINE');sfx('shield');}
 if(lv>=BAL.regenLevel&&!player.hasRegen){player.hasRegen=true;toast('REGENERATION ONLINE');sfx('levelup');}
 if(BAL.epicLevels.includes(lv))spawnSpecial('epic');
 if(!legendaryArmed&&lv>=legendaryFirstLevel){spawnSpecial('legendary');legendaryArmed=true;}
 if(lv>=10){const n=randi(1,2);for(let i=0;i<n;i++){if(mageCount()<BAL.mageCap)spawnSpecial('mage');}}
 if(lv===40)gameAlert('THE SEAL IS BROKEN','#6cffb0','the deep now feeds you directly');
 if(lv===BAL.finalLevel)spawnSpecial('omega');
 else if(lv>BAL.finalLevel&&lv<=CORR_CAP_LEVEL){corruption++;applyCorruption();gameAlert('FINAL UPGRADE '+(lv-100)+' OF 3','#ff3df0','choose what you become');if(lv===CORR_CAP_LEVEL){corrFrozen=true;corrFreezeTime=time;gameAlert('NO MORE ASCENT','#ff3df0','the deep stops feeding, now it only hunts');}}
 else if(lv%BAL.wardenEvery===0&&lv<BAL.finalLevel){
  if(lv===20)spawnSpecial('sunball');
  else if(lv===50)spawnSpecial('sunsq');
  else if(lv===80)spawnSpecial('suntri');
  else if(lv===90){leviathanLock=true;spawnSpecial('leviathan');gameAlert('THE LEVIATHAN RISES','#ff3df0','the deep holds its breath \u00b7 ascent locked');}
  else if(lv>70){megaCount++;spawnSpecial(pick(['sunball','sunsq','suntri']),Math.pow(2,megaCount));gameAlert('A SUN DESCENDS','#ffd24b','its hull is '+Math.pow(2,megaCount)+'x thicker');}
  else{const POOLW=['titan','solar','singularity','collector','judge','twin','shepherd'];spawnSpecial(POOLW[((lv/BAL.wardenEvery)-1)%POOLW.length]);}}
}

