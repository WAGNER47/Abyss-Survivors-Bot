/* ========================= COMBAT OVERHAUL v8 (souls-like bosses) ========================= */
// The single active "major boss" (giant warden/finalboss/void-lord) the arena is built around.
function majorBoss(){let huge=false,b=null;for(const e of enemies){if(e._dead)continue;if(!(e.warden||e.finalboss))continue;if(e.r>=400){huge=true;}else if(e.r>=200){if(!b||e.r>b.r)b=e;}}return huge?null:b;}

// ----- telegraphed boss beams: heavy %-HP lasers that FORCE a dodge (souls-like) -----
let bossBeams=[];
function spawnBeam(src,ang,opt){opt=opt||{};if(bossBeams.length>16)return;
 bossBeams.push({src:src||null,x:src?src.x:player.x,y:src?src.y:player.y,ang,charge:(opt.charge!=null?opt.charge:1.15),active:0,dur:opt.dur||0.55,len:opt.len||2900,wide:opt.wide||30,pct:opt.pct||0.45,color:opt.color||'#ff3df0',track:opt.track||0});
 if(player&&!player._beamWarn){player._beamWarn=1;}}
function updateBeams(dt){
 for(const b of bossBeams){
  if(b.src&&!b.src._dead){b.x=b.src.x;b.y=b.src.y;}
  if(b.charge>0){b.charge-=dt;
   if(b.track>0&&b.src&&!b.src._dead){const ta=Math.atan2(player.y-b.src.y,player.x-b.src.x);let da=ta-b.ang;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;b.ang+=da*Math.min(1,b.track*dt);}
   if(b.charge<=0){b.active=b.dur;sfx('boss');screenShake=Math.max(screenShake,9);}
  }else if(b.active>0){b.active-=dt;
   if(player.iframes<=0&&!player.parryActive&&player.bulwarkT<=0){const ca=Math.cos(b.ang),sa=Math.sin(b.ang),rx=player.x-b.x,ry=player.y-b.y,along=rx*ca+ry*sa,perp=Math.abs(-rx*sa+ry*ca);
    if(along>-player.r&&along<b.len&&perp<b.wide+player.r){hitPlayer(0,'projectile',b.pct);}}
  }
 }
 for(let i=bossBeams.length-1;i>=0;i--){const b=bossBeams[i];if(b.charge<=0&&b.active<=0)bossBeams.splice(i,1);}
}
function drawBeams(){const glow=QX&&QX.glow;
 for(const b of bossBeams){ctx.save();const ca=Math.cos(b.ang),sa=Math.sin(b.ang);
  if(b.charge>0){const f=1-Math.max(0,b.charge)/1.25,pul=0.55+0.45*Math.sin(time*22);
   ctx.globalAlpha=(0.3+0.45*f)*pul;ctx.strokeStyle=b.color;ctx.lineWidth=2+5*f;if(glow){ctx.shadowColor=b.color;ctx.shadowBlur=14;}
   ctx.setLineDash([12,9]);ctx.lineDashOffset=-(time*80)%21;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x+ca*b.len,b.y+sa*b.len);ctx.stroke();ctx.setLineDash([]);
   ctx.globalAlpha=0.55*f;ctx.fillStyle=b.color;ctx.beginPath();ctx.arc(b.x,b.y,6+7*f,0,TAU);ctx.fill();
  }else if(b.active>0){const a=Math.min(1,b.active/0.1);ctx.translate(b.x,b.y);ctx.rotate(b.ang);
   if(glow){ctx.shadowColor=b.color;ctx.shadowBlur=28;}
   const g=ctx.createLinearGradient(0,-b.wide,0,b.wide);g.addColorStop(0,hexA(b.color,0));g.addColorStop(0.5,hexA(b.color,0.92*a));g.addColorStop(1,hexA(b.color,0));
   ctx.fillStyle=g;ctx.fillRect(0,-b.wide,b.len,b.wide*2);
   ctx.globalAlpha=a;ctx.fillStyle='#ffffff';ctx.fillRect(0,-b.wide*0.32,b.len,b.wide*0.64);
  }
  ctx.restore();}
}
// ----- orbiting sun-orb satellites for round bosses (Helios & big-ball wardens) -----
function bossSats(e,dt){
 if(!e._sorbs){const n=e.arch==='sun'?4:(e.finalboss?4:(e.r>=200?3:2));e._sorbs=[];for(let i=0;i<n;i++)e._sorbs.push({a:i/n*TAU,d:e.r*1.32+rand(8,34),r:Math.max(7,e.r*0.12),fire:rand(1.0,2.4),sp:rand(0.45,0.85)*((i%2)?1:-1)});}
 for(const s of e._sorbs){s.a+=s.sp*dt;s.fire-=dt;
  if(s.fire<=0){s.fire=(e.arch==='sun')?rand(1.6,2.6):rand(2.4,3.6);const ox=e.x+Math.cos(s.a)*s.d,oy=e.y+Math.sin(s.a)*s.d,aa=Math.atan2(player.y-oy,player.x-ox);
   const col=e.dying?'#ff5a3c':((e.arch==='sun')?'#ffd24b':e.color);enemyShot(ox,oy,aa,250,7,e.dmg*0.4,3.2,col,true,e.dying?'#ffb08a':'#fff3c4',0.045);}
 }
}
function drawBossSats(e){if(!e._sorbs)return;const glow=QX&&QX.glow;
 for(const s of e._sorbs){const ox=e.x+Math.cos(s.a)*s.d,oy=e.y+Math.sin(s.a)*s.d;ctx.save();
  const col=e.dying?'#ff5a3c':((e.arch==='sun')?'#ffd24b':e.color);
  if(glow){ctx.shadowColor=col;ctx.shadowBlur=16;}
  const g=ctx.createRadialGradient(ox,oy,1,ox,oy,s.r*2.3);g.addColorStop(0,'#ffffff');g.addColorStop(0.4,col);g.addColorStop(1,hexA(col,0));
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(ox,oy,s.r*2.3,0,TAU);ctx.fill();
  ctx.shadowBlur=0;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(ox,oy,s.r*0.5,0,TAU);ctx.fill();
  ctx.restore();}
}
// ----- triangle drones (Spear of the Deep summons) -----
function spawnTriDrones(e,n){const def=ETYPES.tri,hp=def.hp*BAL.enemyHp(time)*1.2;
 for(let i=0;i<n&&enemies.length<BAL.enemyCap;i++){const a=Math.random()*TAU,d=e.r+rand(20,60);
  enemies.push(maybeModify({type:'tri',def,x:e.x+Math.cos(a)*d,y:e.y+Math.sin(a)*d,r:def.r,hp,maxhp:hp,speed:def.speed*rand(1.0,1.2),dmg:def.dmg*BAL.enemyDmg(time),color:'#ff2a4e',shape:'tri',sharp:true,hitFlash:0,shootCd:1,escortChecked:true,arch:null,mechTimer:999,_dark:true}));}}
// ----- Black Hole boss (prototype, lvl-150 corruption) -----
function bhBossMech(e){e._bm=(e._bm||0)+1;const a=Math.atan2(player.y-e.y,player.x-e.x);
 for(let k=-2;k<=2;k++)enemyShot(e.x,e.y,a+k*0.22,160,10,e.dmg*0.5,5,'#9b6dff',true,'#d0b8ff',0.05);
 if(e._bm%3===0){const s=bhSpot();spawnHazard(s.x,s.y,'blackhole');}
 if(e._bm%3===0)spawnBeam(e,a,{color:'#ff3df0',pct:0.5,track:0.5,charge:1.4,wide:42,len:3400});
 if(e._bm%4===0){for(let k=0;k<22;k++)enemyShot(e.x,e.y,k/22*TAU+time*0.3,180,9,e.dmg*0.45,4.5,'#9b6dff',true,'#d0b8ff',0.045);}
 toast('THE VOID CONTRACTS');}
// ----- boss visual identity: scary auras + effects per shape -----
function drawBossAura(e){const glow=QX&&QX.glow,t=time;ctx.save();
 if(e.arch==='blackhole'){
  for(let i=0;i<3;i++){const rr=e.r*(1.18+i*0.24)+Math.sin(t*2+i)*6;ctx.globalAlpha=0.4;ctx.strokeStyle=hexA((i%2)?'#9b6dff':'#ff3df0',0.5);ctx.lineWidth=3;if(glow){ctx.shadowColor='#9b6dff';ctx.shadowBlur=18;}ctx.beginPath();ctx.arc(e.x,e.y,rr,0,TAU);ctx.stroke();}
  ctx.save();ctx.translate(e.x,e.y);ctx.rotate(t*0.5);ctx.scale(1,0.4);ctx.globalAlpha=0.45;ctx.strokeStyle='#ffae3c';if(glow){ctx.shadowColor='#ffae3c';ctx.shadowBlur=16;}ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,e.r*1.45,0,TAU);ctx.stroke();ctx.restore();
  const g=ctx.createRadialGradient(e.x,e.y,1,e.x,e.y,e.r);g.addColorStop(0,'#000000');g.addColorStop(0.68,'#05010a');g.addColorStop(1,hexA('#9b6dff',0.35));ctx.globalAlpha=1;ctx.fillStyle=g;ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,TAU);ctx.fill();
  if(particles.length<440&&Math.random()<0.5){const aa=Math.random()*TAU,dd=e.r*rand(1.4,2.2);particles.push({x:e.x+Math.cos(aa)*dd,y:e.y+Math.sin(aa)*dd,vx:-Math.cos(aa)*rand(60,140),vy:-Math.sin(aa)*rand(60,140),life:0.6,color:Math.random()<0.5?'#9b6dff':'#ff3df0',r:rand(1.4,2.8)});}
 } else if(e.shape==='tri'||e.arch==='spear'){
  const col='#ff2a4e';
  const gg=ctx.createRadialGradient(e.x,e.y,e.r*0.4,e.x,e.y,e.r*1.8);gg.addColorStop(0,hexA('#3a0010',0));gg.addColorStop(0.65,hexA('#6a0014',0.55));gg.addColorStop(1,hexA('#150006',0));ctx.globalAlpha=0.7;ctx.fillStyle=gg;ctx.beginPath();ctx.arc(e.x,e.y,e.r*1.8,0,TAU);ctx.fill();
  ctx.globalAlpha=0.5;ctx.strokeStyle=col;ctx.lineWidth=2;if(glow){ctx.shadowColor=col;ctx.shadowBlur=16;}
  for(let i=0;i<7;i++){const a=t*1.5+i/7*TAU,r1=e.r*1.1,r2=e.r*(1.45+0.32*Math.sin(t*5+i));ctx.beginPath();ctx.moveTo(e.x+Math.cos(a)*r1,e.y+Math.sin(a)*r1);ctx.lineTo(e.x+Math.cos(a)*r2,e.y+Math.sin(a)*r2);ctx.stroke();}
  if(particles.length<440&&Math.random()<0.45){const a=Math.random()*TAU;particles.push({x:e.x+Math.cos(a)*e.r,y:e.y+Math.sin(a)*e.r,vx:Math.cos(a)*rand(20,70),vy:Math.sin(a)*rand(20,70),life:0.5,color:Math.random()<0.5?'#ff2a4e':'#7a0018',r:rand(1.5,3)});}
 } else if(e.shape==='square'||e.arch==='monolith'){
  const col=e.color,dz=e.r+(e.r>=200?72:42);
  ctx.globalAlpha=0.1+0.05*Math.sin(t*4);ctx.fillStyle=hexA('#ff3b6e',0.5);if(glow){ctx.shadowColor='#ff3b6e';ctx.shadowBlur=10;}ctx.beginPath();ctx.arc(e.x,e.y,dz,0,TAU);ctx.fill();
  ctx.globalAlpha=0.5;ctx.strokeStyle='#ff5a6e';ctx.lineWidth=2;ctx.setLineDash([8,9]);ctx.lineDashOffset=-(t*30)%17;ctx.beginPath();ctx.arc(e.x,e.y,dz,0,TAU);ctx.stroke();ctx.setLineDash([]);
  ctx.globalAlpha=0.55;ctx.strokeStyle=hexA(col,0.9);ctx.lineWidth=2;for(let i=0;i<4;i++){const a=t*0.6+i/4*TAU;ctx.beginPath();drawBoltLine(e.x+Math.cos(a)*e.r*1.05,e.y+Math.sin(a)*e.r*1.05,e.x+Math.cos(a)*e.r*1.5,e.y+Math.sin(a)*e.r*1.5);ctx.stroke();}
 } else if(e.arch==='sun'||(e.r>=80&&(e.shape==='ball'||!e.shape)&&!e.boulder)){
  const dying=e.dying,c1=dying?'#ff5a3c':'#ffd24b',c2=dying?'#7a1500':'#ff9b3c';
  const g=ctx.createRadialGradient(e.x,e.y,e.r*0.4,e.x,e.y,e.r*1.8);g.addColorStop(0,hexA(c1,0.5));g.addColorStop(0.55,hexA(c2,0.34));g.addColorStop(1,hexA(c2,0));ctx.globalAlpha=0.7;ctx.fillStyle=g;if(glow){ctx.shadowColor=c1;ctx.shadowBlur=24;}ctx.beginPath();ctx.arc(e.x,e.y,e.r*1.8,0,TAU);ctx.fill();
  ctx.globalAlpha=0.5;ctx.strokeStyle=c1;ctx.lineWidth=2.4;for(let i=0;i<12;i++){const a=t*0.5+i/12*TAU,r2=e.r*(1.2+0.2*Math.sin(t*3+i*1.7));ctx.beginPath();ctx.moveTo(e.x+Math.cos(a)*e.r*1.04,e.y+Math.sin(a)*e.r*1.04);ctx.lineTo(e.x+Math.cos(a)*r2,e.y+Math.sin(a)*r2);ctx.stroke();}
 } else {
  const g=ctx.createRadialGradient(e.x,e.y,e.r*0.5,e.x,e.y,e.r*1.6);g.addColorStop(0,hexA(e.color,0.32));g.addColorStop(1,hexA(e.color,0));ctx.globalAlpha=0.6;ctx.fillStyle=g;if(glow){ctx.shadowColor=e.color;ctx.shadowBlur=18;}ctx.beginPath();ctx.arc(e.x,e.y,e.r*1.6,0,TAU);ctx.fill();
 }
 ctx.restore();
}
// ----- arena boundary ring (you cannot flee a major boss) -----
function drawArenaRing(){if(!player||!player._arenaR)return;const t=time,R=player._arenaR,cx=player._arenaX,cy=player._arenaY;const glow=QX&&QX.glow;
 const dpx=player.x-cx,dpy=player.y-cy,dd=Math.hypot(dpx,dpy),near=dd>R*0.82;ctx.save();
 ctx.globalAlpha=near?0.5:0.22;ctx.strokeStyle='#ff3df0';ctx.lineWidth=near?4:2.5;if(glow){ctx.shadowColor='#ff3df0';ctx.shadowBlur=near?20:10;}
 ctx.setLineDash([16,12]);ctx.lineDashOffset=-(t*40)%28;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.stroke();ctx.setLineDash([]);
 if(near){ctx.globalAlpha=0.12;const g=ctx.createRadialGradient(cx,cy,R*0.7,cx,cy,R);g.addColorStop(0,hexA('#ff3df0',0));g.addColorStop(1,hexA('#ff3df0',0.5));ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();}
 ctx.restore();}

