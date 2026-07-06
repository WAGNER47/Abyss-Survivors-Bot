/* ===== RENDER ===== */
function render(){
 ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=1;ctx.clearRect(0,0,W,H);ctx.save();
 if(!isFinite(player.x)||!isFinite(player.y)){player.x=player._lgx||0;player.y=player._lgy||0;}
 const VW=W/VIEW,VH=H/VIEW;
 let _cz=VIEW*(camZoom+camPunch);if(!isFinite(_cz))_cz=VIEW;_cz=Math.max(VIEW*0.6,Math.min(VIEW*1.8,_cz));
 let _cx=isFinite(camCX)?camCX:player.x,_cy=isFinite(camCY)?camCY:player.y;if(!isFinite(_cx))_cx=0;if(!isFinite(_cy))_cy=0;
 ctx.translate(W/2+shakeX,H/2+shakeY);ctx.scale(_cz,_cz);ctx.translate(-_cx,-_cy);
 camIx=_cx;camIy=_cy;camIz=_cz;
 const camX=_cx-VW/2,camY=_cy-VH/2;
 // Frustum cull rect (world space), refreshed once per frame. Everything drawn checks against it
 // so off-screen entities cost nothing - the single biggest win on big boss arenas post-L50.
 _cullX0=camX-90;_cullY0=camY-90;_cullX1=camX+VW+90;_cullY1=camY+VH+90;
 drawGridBg(camX,camY,VW,VH);drawRoads(camX,camY,VW,VH);
 drawZones();
 for(const sd of seeds){ctx.save();const pz=0.6+0.4*Math.sin(time*10);ctx.globalAlpha=0.8*pz;ctx.fillStyle='#6cffb0';if(QX&&QX.glow){ctx.shadowColor='#6cffb0';ctx.shadowBlur=14;}ctx.beginPath();ctx.arc(sd.x,sd.y,sd.r*pz,0,TAU);ctx.fill();ctx.globalAlpha=0.4;ctx.strokeStyle='#6cffb0';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(sd.x,sd.y,sd.r+5+pz*4,0,TAU);ctx.stroke();ctx.restore();}
 for(const tr of trails){if(!onScreen(tr.x,tr.y,tr.r))continue;const _ta=ctx.globalAlpha;ctx.globalAlpha=Math.min(0.55,tr.life*0.4);stampBloom('rgba(255,140,55,0.95)',tr.x,tr.y,tr.r,1);ctx.globalAlpha=_ta;}
 drawArenaRing();
 for(const hz of hazards){ctx.save();
  if(hz.tele>0){ctx.globalAlpha=0.45+0.3*Math.sin(time*12);ctx.strokeStyle=hz.box?'#9fb6e0':(hz.type==='meteor'?'#ff9b4b':(hz.type==='blackhole'?'#b07bff':(hz.type==='tar'?'#8a6bd8':(hz.type==='solar'?'#ffb04b':'#ff7b9b'))));ctx.lineWidth=2;ctx.setLineDash([8,8]);if(hz.box){ctx.strokeRect(hz.x-hz.r,hz.y-hz.r,hz.r*2,hz.r*2);}else{ctx.beginPath();ctx.arc(hz.x,hz.y,hz.r,0,TAU);ctx.stroke();}ctx.setLineDash([]);}
  else if(hz.type==='blackhole'){if(!hz._g||hz._gr!==hz.r){hz._gr=hz.r;hz._g=ctx.createRadialGradient(0,0,2,0,0,hz.r);hz._g.addColorStop(0,'rgba(15,0,35,0.96)');hz._g.addColorStop(0.3,'rgba(80,20,150,0.5)');hz._g.addColorStop(1,'rgba(140,90,255,0.04)');}ctx.translate(hz.x,hz.y);ctx.fillStyle=hz._g;ctx.beginPath();ctx.arc(0,0,hz.r,0,TAU);ctx.fill();ctx.translate(-hz.x,-hz.y);ctx.strokeStyle='#b07bff';ctx.shadowColor='#b07bff';ctx.shadowBlur=14;ctx.lineWidth=2;ctx.beginPath();ctx.arc(hz.x,hz.y,hz.coreR,0,TAU);ctx.stroke();ctx.globalAlpha=0.5;ctx.beginPath();ctx.arc(hz.x,hz.y,hz.r*(0.5+0.3*Math.sin(time*4)),0,TAU);ctx.stroke();ctx.globalAlpha=0.3;ctx.beginPath();ctx.arc(hz.x,hz.y,hz.r*(0.78+0.18*Math.sin(time*3+1.3)),0,TAU);ctx.stroke();}
  else if(hz.type==='meteor'){ctx.globalAlpha=clamp(hz.life/0.25,0,1)*0.6;ctx.fillStyle='rgba(255,155,75,0.6)';ctx.beginPath();ctx.arc(hz.x,hz.y,hz.r,0,TAU);ctx.fill();}
  else if(hz.type==='tar'){ctx.globalAlpha=0.5;if(!hz._g||hz._gr!==hz.r){hz._gr=hz.r;hz._g=ctx.createRadialGradient(0,0,8,0,0,hz.r);hz._g.addColorStop(0,'rgba(90,60,160,0.55)');hz._g.addColorStop(1,'rgba(40,25,80,0.25)');}ctx.translate(hz.x,hz.y);ctx.fillStyle=hz._g;ctx.beginPath();ctx.arc(0,0,hz.r,0,TAU);ctx.fill();ctx.translate(-hz.x,-hz.y);ctx.globalAlpha=0.7;ctx.strokeStyle='#8a6bd8';ctx.setLineDash([4,9]);ctx.lineWidth=2;ctx.beginPath();ctx.arc(hz.x,hz.y,hz.r*0.96,0,TAU);ctx.stroke();ctx.setLineDash([]);}
  else if(hz.type==='solar'){if(!hz._g||hz._gr!==hz.r){hz._gr=hz.r;hz._g=ctx.createRadialGradient(0,0,hz.r*0.2,0,0,hz.r);hz._g.addColorStop(0,'rgba(255,170,70,0.34)');hz._g.addColorStop(1,'rgba(255,90,40,0.16)');}ctx.translate(hz.x,hz.y);ctx.fillStyle=hz._g;ctx.beginPath();ctx.arc(0,0,hz.r,0,TAU);ctx.fill();ctx.translate(-hz.x,-hz.y);ctx.strokeStyle='rgba(255,170,80,0.7)';ctx.lineWidth=2;ctx.stroke();}
  else if(hz.type==='boxzone'){const pul=0.5+0.5*Math.sin(time*8);ctx.globalAlpha=0.2+0.12*pul;const g=ctx.createLinearGradient(hz.x-hz.r,hz.y-hz.r,hz.x+hz.r,hz.y+hz.r);g.addColorStop(0,'rgba(159,182,224,0.35)');g.addColorStop(1,'rgba(120,150,210,0.5)');ctx.fillStyle=g;ctx.fillRect(hz.x-hz.r,hz.y-hz.r,hz.r*2,hz.r*2);ctx.globalAlpha=0.6;ctx.strokeStyle='#9fb6e0';if(QX&&QX.glow){ctx.shadowColor='#9fb6e0';ctx.shadowBlur=12;}ctx.lineWidth=2.4;ctx.strokeRect(hz.x-hz.r,hz.y-hz.r,hz.r*2,hz.r*2);ctx.shadowBlur=0;ctx.globalAlpha=0.35;ctx.beginPath();ctx.moveTo(hz.x-hz.r,hz.y);ctx.lineTo(hz.x+hz.r,hz.y);ctx.moveTo(hz.x,hz.y-hz.r);ctx.lineTo(hz.x,hz.y+hz.r);ctx.stroke();}
  else{const a=0.12+hz.ramp*0.42,_ak=(a*20)|0;if(!hz._g||hz._gr!==hz.r||hz._ga!==_ak){hz._gr=hz.r;hz._ga=_ak;hz._g=ctx.createRadialGradient(0,0,hz.r*0.2,0,0,hz.r);hz._g.addColorStop(0,`rgba(255,90,80,${a*0.55})`);hz._g.addColorStop(1,`rgba(170,40,120,${a})`);}ctx.translate(hz.x,hz.y);ctx.fillStyle=hz._g;ctx.beginPath();ctx.arc(0,0,hz.r,0,TAU);ctx.fill();ctx.translate(-hz.x,-hz.y);ctx.strokeStyle=`rgba(255,90,130,${0.45+hz.ramp*0.5})`;ctx.lineWidth=2;ctx.stroke();}
  ctx.restore();}
 for(const o of orbs)glowDot(o.x,o.y,o.r,'#6cffb0',8);
 for(const c of chests){ctx.save();const pulse=0.7+0.3*Math.sin(time*6);ctx.globalAlpha=pulse;ctx.shadowColor='#ffd24b';ctx.shadowBlur=18;ctx.fillStyle='#ffd24b';ctx.fillRect(c.x-9,c.y-7,18,14);ctx.fillStyle='#5a4410';ctx.fillRect(c.x-9,c.y-1,18,3);ctx.restore();}
 for(const d of drops){if(d.type==='gold')glowDot(d.x,d.y,d.r,'#ffc24b',8);
  else if(d.type==='heart'){ctx.save();ctx.shadowColor='#ff5a6e';ctx.shadowBlur=14;ctx.fillStyle='#ff8a9e';ctx.font='18px sans-serif';ctx.textAlign='center';ctx.fillText('❤',d.x,d.y+6);ctx.restore();}
  else if(d.type==='magnet')drawSymbol(d.x,d.y,'⊚','#5cd0ff');else if(d.type==='bomb')drawSymbol(d.x,d.y,'✸','#ffc24b');else if(d.type==='shard')drawSymbol(d.x,d.y,'◈','#9bd0ff');
  if(d.type!=='gold'){ctx.save();const pu=0.5+0.5*Math.sin(time*5+d.x*0.01);const dc=d.type==='heart'?'#ff5a6e':(d.type==='magnet'?'#5cd0ff':'#ffc24b');ctx.globalAlpha=0.35+0.4*pu;ctx.strokeStyle=dc;ctx.shadowColor=dc;ctx.shadowBlur=12;ctx.lineWidth=2;ctx.beginPath();ctx.arc(d.x,d.y,13+5*pu,0,TAU);ctx.stroke();ctx.restore();}}
 const aw=player.weapons.find(x=>x.id==='aura');
 if(aw&&aw._render){const r=aw._render.radius;ctx.save();if(!aw._gr||aw._grR!==r){aw._grR=r;aw._gr=ctx.createRadialGradient(0,0,r*0.3,0,0,r);aw._gr.addColorStop(0,'rgba(155,109,255,0)');aw._gr.addColorStop(0.7,'rgba(155,109,255,0.10)');aw._gr.addColorStop(1,'rgba(155,109,255,0.28)');}ctx.translate(player.x,player.y);ctx.fillStyle=aw._gr;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.strokeStyle='rgba(155,109,255,0.5)';ctx.lineWidth=2;ctx.stroke();ctx.restore();}
 const dw=player.weapons.find(x=>x.id==='deflect');
 if(dw&&dw._render){const r=dw._render.radius;ctx.save();ctx.globalAlpha=0.4;ctx.strokeStyle='#9bd0ff';ctx.lineWidth=1.5;ctx.setLineDash([5,7]);ctx.beginPath();ctx.arc(player.x,player.y,r,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
 for(const p of epjs)drawProjectile(p);
 for(const e of enemies)drawEnemy(e);
 drawBeams();
 for(const p of pjs){ctx.save();
  if(p.kind==='catalyst'){const pz=0.7+0.3*Math.sin(time*14);if(QX&&QX.glow){ctx.shadowColor='#ff5cf0';ctx.shadowBlur=22;}ctx.globalAlpha=0.95;ctx.fillStyle='#d65cff';ctx.beginPath();ctx.arc(p.x,p.y,p.r*pz,0,TAU);ctx.fill();ctx.globalAlpha=0.8;ctx.strokeStyle='#5cd0ff';ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(p.x,p.y,p.r*pz+3,0,TAU);ctx.stroke();ctx.shadowBlur=0;ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p.x,p.y,p.r*0.4,0,TAU);ctx.fill();ctx.restore();continue;}
  var _pc=projSkinCol(p,p.color)||p.color,_ps2=projSkin(),_core=(_ps2&&_ps2.mode&&_ps2.mode!=='native')?_ps2.core:null,_gm=(_ps2&&_ps2.mode&&_ps2.mode!=='native'&&_ps2.glow)?_ps2.glow:1;
  if(p.spirit)ctx.globalAlpha=0.8;if(QX.glowMul===0)stampBloom(_pc,p.x,p.y,(p.r||3)*3+(p.big?8:0),0.4);ctx.shadowColor=_pc;ctx.shadowBlur=(p.big?18:12)*_gm;ctx.fillStyle=_pc;
  if(p.big){const a=Math.atan2(p.vy,p.vx);ctx.translate(p.x,p.y);ctx.rotate(a);ctx.fillRect(-10,-p.r/2,20,p.r);if(_core){ctx.shadowBlur=0;ctx.fillStyle=_core;ctx.fillRect(-6,-Math.max(1,p.r/4),12,Math.max(2,p.r/2));}}
  else{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,TAU);ctx.fill();if(_core){ctx.shadowBlur=0;ctx.globalAlpha=1;ctx.fillStyle=_core;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1,p.r*0.45),0,TAU);ctx.fill();}}ctx.restore();}
 const ow=player.weapons.find(x=>x.id==='orbit');
 if(ow&&ow._render){const{count,radius}=ow._render;for(let i=0;i<count;i++){const a=(ow.orbAngle||0)+i/count*TAU;glowDot(player.x+Math.cos(a)*radius,player.y+Math.sin(a)*radius,9*player.area,'#6cffb0',16);}}
 const sw=player.weapons.find(x=>x.id==='saber');
 if(sw&&sw._render){const{blades,radius,hitR}=sw._render;for(let i=0;i<blades;i++){const a=(sw.orbAngle||0)+i/blades*TAU,x=player.x+Math.cos(a)*radius,y=player.y+Math.sin(a)*radius;ctx.save();ctx.shadowColor='#7fe6ff';ctx.shadowBlur=16;ctx.strokeStyle='#cdfaff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(player.x+Math.cos(a)*radius*0.4,player.y+Math.sin(a)*radius*0.4);ctx.lineTo(x+Math.cos(a)*hitR,y+Math.sin(a)*hitR);ctx.stroke();ctx.restore();}}
 const bw=player.weapons.find(x=>x.id==='beam');
 if(bw&&bw._render){const{tx,ty,width}=bw._render;ctx.save();ctx.globalAlpha=0.85;ctx.strokeStyle='#ff9bf0';ctx.shadowColor='#ff9bf0';ctx.shadowBlur=16;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(player.x,player.y);ctx.lineTo(tx,ty);ctx.stroke();ctx.globalAlpha=1;ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(2,width*0.3);ctx.beginPath();ctx.moveTo(player.x,player.y);ctx.lineTo(tx,ty);ctx.stroke();ctx.restore();}
 for(const a of arcs){ctx.save();ctx.globalAlpha=clamp(a.life/0.18,0,1);ctx.strokeStyle=a.color;ctx.shadowColor=a.color;ctx.shadowBlur=14;ctx.lineWidth=3;drawBoltLine(a.x1,a.y1,a.x2,a.y2);ctx.restore();}
 for(const f of fx){ctx.save();ctx.globalAlpha=clamp(f.life/0.35,0,1);ctx.strokeStyle=f.color;ctx.shadowColor=f.color;ctx.shadowBlur=12;ctx.lineWidth=3;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,TAU);ctx.stroke();ctx.restore();}
 for(const c of player.companions){ctx.save();ctx.shadowColor='#8affc0';ctx.shadowBlur=12;ctx.fillStyle='#8affc0';ctx.beginPath();ctx.arc(c.x,c.y,6,0,TAU);ctx.fill();ctx.restore();}
 drawPlayer();
 for(const s of shards){ctx.save();ctx.globalAlpha=clamp(s.life/s.max,0,1)*0.9;ctx.translate(s.x,s.y);ctx.rotate(s.rot);ctx.fillStyle=s.color;ctx.beginPath();ctx.moveTo(s.size,0);ctx.lineTo(-s.size*0.6,s.size*0.6);ctx.lineTo(-s.size*0.6,-s.size*0.6);ctx.closePath();ctx.fill();ctx.restore();}
 for(const pt of particles){if(!onScreen(pt.x,pt.y,pt.r+4))continue;ctx.globalAlpha=clamp(pt.life*2,0,1);ctx.fillStyle=pt.color;ctx.beginPath();ctx.arc(pt.x,pt.y,pt.r,0,TAU);ctx.fill();}ctx.globalAlpha=1;
 ctx.textAlign='center';
 for(const t of texts){ctx.save();ctx.globalAlpha=clamp(t.life*1.6,0,1);ctx.fillStyle=t.color;ctx.font=`${t.big?'bold 18px':'600 13px'} Rajdhani, sans-serif`;
  if(t.glitch){let v=t.val;if(Math.random()<0.45){const i2=(Math.random()*v.length)|0;v=v.slice(0,i2)+GLITCH_CH[(Math.random()*GLITCH_CH.length)|0]+v.slice(i2+1);}
   ctx.shadowColor=t.color;ctx.shadowBlur=12;ctx.fillText(v,t.x+rand(-2,2),t.y+rand(-1.5,1.5));}
  else ctx.fillText(t.val,t.x,t.y);ctx.restore();}
 ctx.restore();
 if(obj&&state==='playing'){ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);
  const small=W<560,pw=small?Math.min(340,W-20):420,ph=small?58:64,ox=W/2,oy=TGINS.top+84+ph/2;
  const urgent=obj.t<6&&obj.kind!=='nohit',pulse=urgent?0.5+0.5*Math.sin(time*14):1;
  const prog=obj.kind==='nohit'?Math.max(0,obj.t)/18:Math.min(1,obj.count/obj.target);
  ctx.globalAlpha=0.82;ctx.fillStyle='rgba(8,16,30,0.85)';ctx.fillRect(ox-pw/2,oy-ph/2,pw,ph);
  ctx.globalAlpha=pulse;ctx.strokeStyle=urgent?'#ff5a6e':'#6cffb0';ctx.lineWidth=2;ctx.shadowColor=urgent?'#ff5a6e':'#6cffb0';ctx.shadowBlur=14;
  ctx.strokeRect(ox-pw/2,oy-ph/2,pw,ph);ctx.shadowBlur=0;
  ctx.textAlign='center';ctx.globalAlpha=1;
  ctx.font='700 '+(small?12:14)+'px Orbitron,sans-serif';ctx.fillStyle='#eaf2ff';
  ctx.fillText(obj.label+(obj.kind==='nohit'?'':'  '+obj.count+'/'+obj.target),ox,oy-ph/2+(small?17:19));
  ctx.font='600 '+(small?10:11)+'px Orbitron,sans-serif';ctx.fillStyle='#ffd24b';
  ctx.fillText('REWARD: '+obj.reward.label+'   ·   '+Math.ceil(Math.max(0,obj.t))+'s',ox,oy-ph/2+(small?33:37));
  ctx.fillStyle='rgba(108,255,176,0.16)';ctx.fillRect(ox-pw/2+10,oy+ph/2-11,pw-20,5);
  ctx.fillStyle=urgent?'#ff5a6e':'#6cffb0';ctx.fillRect(ox-pw/2+10,oy+ph/2-11,(pw-20)*Math.min(1,prog),5);
  ctx.restore();}
 drawMenuArmBanner();
 if(alertTime>0){ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);const a=Math.min(1,alertTime/0.4)*Math.min(1,(2.6-alertTime)/0.3+0.3);const cy=H*(IS_TOUCH?0.36:0.28);
  ctx.globalAlpha=a*0.16;ctx.fillStyle=alertColor;ctx.fillRect(0,cy-34,W,68);
  ctx.globalAlpha=a;ctx.strokeStyle=alertColor;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,cy-34);ctx.lineTo(W,cy-34);ctx.moveTo(0,cy+34);ctx.lineTo(W,cy+34);ctx.stroke();
  if(alertSub){ctx.font='600 '+(W<560?10:12)+'px Orbitron,sans-serif';ctx.fillStyle=alertColor;ctx.fillText(alertSub.toUpperCase(),W/2,cy+46);}
  ctx.fillStyle='#fff';ctx.shadowColor=alertColor;ctx.shadowBlur=20;ctx.font='700 '+(W<560?22:30)+'px Orbitron,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('⚠  '+alertText+'  ⚠',W/2,cy);ctx.restore();}
 if(touchActive){ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=0.3;ctx.strokeStyle='#00e5d4';ctx.lineWidth=2;ctx.beginPath();ctx.arc(touchOrigin.x,touchOrigin.y,46,0,TAU);ctx.stroke();ctx.globalAlpha=0.55;ctx.fillStyle='#00e5d4';ctx.beginPath();ctx.arc(touchOrigin.x+touchVec.x*40,touchOrigin.y+touchVec.y*40,15,0,TAU);ctx.fill();ctx.restore();}
}
function drawGridBg(camX,camY,VW,VH){VW=VW||W;VH=VH||H;const s=56;ctx.strokeStyle='rgba(60,90,150,0.10)';ctx.lineWidth=1;const x0=Math.floor(camX/s)*s,y0=Math.floor(camY/s)*s;ctx.beginPath();for(let x=x0;x<camX+VW+s;x+=s){ctx.moveTo(x,camY);ctx.lineTo(x,camY+VH);}for(let y=y0;y<camY+VH+s;y+=s){ctx.moveTo(camX,y);ctx.lineTo(camX+VW,y);}ctx.stroke();}
let _laneGV=null,_laneGH=null,_laneW=0;
function drawRoads(camX,camY,VW,VH){VW=VW||W;VH=VH||H;ctx.save();
 if(_laneW!==ROAD.w||!_laneGV){_laneW=ROAD.w;
  _laneGV=ctx.createLinearGradient(0,0,ROAD.w,0);_laneGH=ctx.createLinearGradient(0,0,0,ROAD.w);
  for(const g of [_laneGV,_laneGH]){g.addColorStop(0,'rgba(0,229,212,0.03)');g.addColorStop(0.5,'rgba(0,229,212,0.11)');g.addColorStop(1,'rgba(0,229,212,0.03)');}}
 const lane=(vert,period,w)=>{let p=Math.floor((vert?camX:camY)/period)*period;
  for(;p<(vert?camX+VW:camY+VH)+period;p+=period){
   ctx.fillStyle=vert?_laneGV:_laneGH;
   if(vert){ctx.translate(p,0);ctx.fillRect(0,camY,w,VH);ctx.translate(-p,0);}else{ctx.translate(0,p);ctx.fillRect(camX,0,VW,w);ctx.translate(0,-p);}
   ctx.fillStyle='rgba(0,229,212,0.26)';
   const off=(time*140)%64;
   if(vert){for(let y=camY-64+off;y<camY+VH;y+=64){ctx.beginPath();ctx.moveTo(p+w/2-9,y+12);ctx.lineTo(p+w/2,y);ctx.lineTo(p+w/2+9,y+12);ctx.lineTo(p+w/2,y+7);ctx.closePath();ctx.fill();}}
   else{for(let x=camX-64+off;x<camX+VW;x+=64){ctx.beginPath();ctx.moveTo(x+12,p+w/2-9);ctx.lineTo(x,p+w/2);ctx.lineTo(x+12,p+w/2+9);ctx.lineTo(x+7,p+w/2);ctx.closePath();ctx.fill();}}}};
 lane(true,ROAD.px,ROAD.w);lane(false,ROAD.py,ROAD.w);ctx.restore();}
// V9 PERF: baked bloom. Each glow color is rendered ONCE to a small offscreen sprite
// (soft radial falloff + hot core), then stamped with drawImage - GPU-cheap, no live blur.
// Visually ~identical to shadowBlur at a fraction of the cost; used on every tier.
const _bloomCache={};let _bloomN=0;
function bloomSprite(color){
 let sp=_bloomCache[color];if(sp)return sp;
 if(_bloomN>96){for(const k in _bloomCache){delete _bloomCache[k];}_bloomN=0;}
 const S=64,c=document.createElement('canvas');c.width=S;c.height=S;const g2=c.getContext('2d');
 const gr=g2.createRadialGradient(S/2,S/2,1,S/2,S/2,S/2);
 gr.addColorStop(0,color);gr.addColorStop(0.28,color);gr.addColorStop(1,'rgba(0,0,0,0)');
 g2.globalAlpha=0.9;g2.fillStyle=gr;g2.beginPath();g2.arc(S/2,S/2,S/2,0,Math.PI*2);g2.fill();
 _bloomCache[color]=c;_bloomN++;return c;
}
function stampBloom(color,x,y,r,alpha){const sp=bloomSprite(color);const pa=ctx.globalAlpha;ctx.globalAlpha=pa*(alpha==null?0.55:alpha);ctx.drawImage(sp,x-r,y-r,r*2,r*2);ctx.globalAlpha=pa;}
function glowDot(x,y,r,color,blur){if(!onScreen(x,y,r+blur))return;stampBloom(color,x,y,r+blur*0.9,0.6);ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}
// Banner shown during the grace window before a level-up / boon menu opens, so the
// player knows a reward is queued and can dash clear of danger before play freezes.
function drawMenuArmBanner(){
 const ma=document.getElementById('menuarm');
 if(state!=='playing'||(pendingLevels<=0&&pendingBoons<=0)){if(ma&&!ma.classList.contains('hidden'))ma.classList.add('hidden');return;}
 const lvl=pendingLevels>0;const col=lvl?'#ffd24b':'#c77bff';
 const frac=Math.max(0,Math.min(1,menuArmT/MENU_DELAY));
 const _now=performance.now();
 const pulse=0.6+0.4*Math.sin(_now*0.012);
 // full-canvas colour wash on the gameplay layer; the DOM pill (above) carries the text
 {const _fg=ctx.createLinearGradient(0,0,0,H);_fg.addColorStop(0,hexA(col,0.16*pulse));_fg.addColorStop(0.42,hexA(col,0.02*pulse));_fg.addColorStop(0.58,hexA(col,0.02*pulse));_fg.addColorStop(1,hexA(col,0.16*pulse));ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=1;ctx.fillStyle=_fg;ctx.fillRect(0,0,W,H);ctx.restore();}
 // DOM notification pill (lives on #notif, always above HUD + gameplay)
 const inDanger=player._inBlackhole||(_now-(player._lastHitT||0)<450)||(_now-(player._lastHazardT||0)<450)||(_now-(player._lastBurnT||0)<450);
 const sub=(menuArmT<=0&&inDanger)?'GET TO SAFETY':'CHOOSE YOUR REWARD';
 if(ma){
  if(ma.classList.contains('hidden'))ma.classList.remove('hidden');
  ma.style.setProperty('--mac',col);
  const lb=document.getElementById('malabel');const _lt=t(lvl?'LEVEL UP':'WARDEN BOON');if(lb&&lb.textContent!==_lt)lb.textContent=_lt;
  const sb=document.getElementById('masub');const _st=t(sub);if(sb&&sb.textContent!==_st)sb.textContent=_st;
  const mf=document.getElementById('mafill');if(mf)mf.style.width=((1-frac)*100).toFixed(1)+'%';
 }
}
function drawProjectile(p){
 const glow=QX&&QX.glow;const spd=Math.hypot(p.vx,p.vy)||1;const ux=p.vx/spd,uy=p.vy/spd;
 ctx.save();
 if(p.boss){
  // BOSS PROJECTILE: large, menacing, pulsing, with an energy ring + element aura + comet trail.
  const pulse=0.5+0.5*Math.sin(time*9+(p._ph||0));const R=p.r;
  // long motion trail
  const tg=ctx.createLinearGradient(p.x-ux*R*4,p.y-uy*R*4,p.x,p.y);
  tg.addColorStop(0,'rgba(0,0,0,0)');tg.addColorStop(1,p.color);
  ctx.globalAlpha=0.5;ctx.strokeStyle=tg;ctx.lineWidth=R*1.5;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(p.x-ux*R*4,p.y-uy*R*4);ctx.lineTo(p.x,p.y);ctx.stroke();
  // outer aura
  if(glow){ctx.shadowColor=p.color;ctx.shadowBlur=26;}
  ctx.globalAlpha=0.9;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,R*(1+0.12*pulse),0,TAU);ctx.fill();
  // rotating energy ring (effect tied to element)
  ctx.globalAlpha=0.7;ctx.strokeStyle=p.aura||'#ffffff';ctx.lineWidth=2.2;ctx.shadowBlur=glow?14:0;
  ctx.beginPath();ctx.arc(p.x,p.y,R*1.45+pulse*3,0,TAU);ctx.stroke();
  // white-hot core
  ctx.shadowBlur=0;ctx.globalAlpha=1;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(p.x,p.y,R*0.42,0,TAU);ctx.fill();
 } else {
  // NORMAL ENEMY SHOT: small but ALWAYS visible — bright core, colored halo, short trail.
  const R=Math.max(3.4,p.r);
  // trail
  ctx.globalAlpha=0.4;ctx.strokeStyle=p.color;ctx.lineWidth=R*0.9;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(p.x-ux*R*2.6,p.y-uy*R*2.6);ctx.lineTo(p.x,p.y);ctx.stroke();
  // colored glow body
  if(glow){ctx.shadowColor=p.color;ctx.shadowBlur=12;}
  ctx.globalAlpha=0.95;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,R,0,TAU);ctx.fill();
  // white-hot core for contrast on any background
  ctx.shadowBlur=0;ctx.globalAlpha=1;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(p.x,p.y,R*0.45,0,TAU);ctx.fill();
 }
 ctx.restore();
}
function drawSymbol(x,y,ch,color){ctx.save();ctx.shadowColor=color;ctx.shadowBlur=12;ctx.fillStyle=color;ctx.font='17px sans-serif';ctx.textAlign='center';ctx.fillText(ch,x,y+6);ctx.restore();}
function drawBoltLine(x1,y1,x2,y2){const seg=6;ctx.beginPath();ctx.moveTo(x1,y1);for(let i=1;i<seg;i++){const t=i/seg;ctx.lineTo(x1+(x2-x1)*t+rand(-7,7),y1+(y2-y1)*t+rand(-7,7));}ctx.lineTo(x2,y2);ctx.stroke();}
function drawEnemy(e){if(!onScreen(e.x,e.y,e.r+70))return;ctx.save();const big=e.elite||e.mage||isBig(e);
 if(e.warden||e.finalboss||e.legendary||(e.elite&&e.r>=60)){try{drawBossAura(e);}catch(_e){}}
 if(e._sorbs){try{drawBossSats(e);}catch(_e){}}
 if(big&&((QX&&QX.glow)||e.finalboss||e.warden||e.legendary)){ctx.shadowColor=e.color;ctx.shadowBlur=e.finalboss?Math.min(70,Math.max(42,e.r*0.5)):((e.legendary||e.warden)?Math.min(60,Math.max(30,e.r*0.42)):18);}
 if(e.phased)ctx.globalAlpha*=0.35;
 ctx.fillStyle=e.hitFlash>0?'#ffffff':((e.st&&e.st.chill)?'#bfeaff':(e.mut?'#d6ff8a':(e.color+'66')));ctx.strokeStyle=e.mut?'#b6ff3c':e.color;ctx.lineWidth=(e.legendary||e.warden||e.finalboss)?3:2;
 if(e.shape==='square'){const a=(e.spin=(e.spin||0)+0.4*DT);ctx.translate(e.x,e.y);ctx.rotate(a*0.15);ctx.beginPath();ctx.rect(-e.r,-e.r,e.r*2,e.r*2);ctx.fill();ctx.stroke();}
 else if(e.shape==='tri'){const ang=Math.atan2(player.y-e.y,player.x-e.x);ctx.translate(e.x,e.y);ctx.rotate(ang+Math.PI/2);ctx.beginPath();ctx.moveTo(0,-e.r*1.3);ctx.lineTo(e.r,e.r*0.9);ctx.lineTo(-e.r,e.r*0.9);ctx.closePath();ctx.fill();ctx.stroke();}
 else if(e.shape==='hex'){const a=(e.spin=(e.spin||0)+0.6*DT);ctx.translate(e.x,e.y);ctx.rotate(a*0.2);ctx.beginPath();for(let k=0;k<6;k++){const ha=k/6*TAU;k?ctx.lineTo(Math.cos(ha)*e.r,Math.sin(ha)*e.r):ctx.moveTo(Math.cos(ha)*e.r,Math.sin(ha)*e.r);}ctx.closePath();ctx.fill();ctx.stroke();ctx.globalAlpha=0.35;ctx.beginPath();for(let k=0;k<6;k++){const ha=k/6*TAU;k?ctx.lineTo(Math.cos(ha)*e.r*0.6,Math.sin(ha)*e.r*0.6):ctx.moveTo(Math.cos(ha)*e.r*0.6,Math.sin(ha)*e.r*0.6);}ctx.closePath();ctx.stroke();}
 else{ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,TAU);ctx.fill();ctx.stroke();
  if(e.squish){ctx.globalAlpha=0.4;ctx.beginPath();ctx.arc(e.x,e.y,e.r*0.6,0,TAU);ctx.stroke();}
  if(e.laser&&e.laserCharge>0){ctx.globalAlpha=0.6;ctx.strokeStyle='#ff3b6e';ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(e.x-2000,e.y);ctx.lineTo(e.x+2000,e.y);ctx.stroke();ctx.setLineDash([]);}}
 ctx.restore();
 if(e.emod&&EMODS[e.emod]){ctx.save();ctx.font='12px sans-serif';ctx.textAlign='center';ctx.globalAlpha=0.95;ctx.fillText(EMODS[e.emod].icon,e.x,e.y-e.r-8);ctx.restore();}
 if(e.laser&&e.laserT>0){ctx.save();ctx.globalAlpha=0.85;const g=ctx.createLinearGradient(0,e.laserY-14,0,e.laserY+14);g.addColorStop(0,'rgba(255,59,110,0)');g.addColorStop(0.5,'rgba(255,90,110,0.95)');g.addColorStop(1,'rgba(255,59,110,0)');ctx.fillStyle=g;ctx.shadowColor='#ff3b6e';ctx.shadowBlur=18;ctx.fillRect(e.x-2200,e.laserY-14,4400,28);ctx.restore();}
 if(e.frozenT>0){ctx.save();const fp=0.7+0.3*Math.sin(time*4+e.x*0.05);ctx.globalAlpha=0.85*fp;ctx.strokeStyle='#cfeeff';ctx.fillStyle='rgba(180,225,255,0.18)';ctx.shadowColor='#bfeaff';ctx.shadowBlur=12;ctx.lineWidth=2.4;const fr=e.r+4;ctx.beginPath();ctx.rect(e.x-fr,e.y-fr,fr*2,fr*2);ctx.fill();ctx.stroke();ctx.globalAlpha=0.5*fp;ctx.beginPath();ctx.moveTo(e.x-fr,e.y);ctx.lineTo(e.x+fr,e.y);ctx.moveTo(e.x,e.y-fr);ctx.lineTo(e.x,e.y+fr);ctx.stroke();ctx.restore();}
 else if(e.stunT>0){ctx.save();ctx.globalAlpha=0.9;ctx.strokeStyle='#bfeaff';ctx.shadowColor='#bfeaff';ctx.shadowBlur=10;ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,e.r+3,0,TAU);ctx.stroke();ctx.restore();}
 if(e.fearT>0){ctx.save();ctx.globalAlpha=0.85;ctx.fillStyle='#b6ff3c';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText('‼',e.x,e.y-e.r-7);ctx.restore();}
 if(e.st){let i=0;for(const k in e.st){if(i>=4)break;ctx.save();ctx.globalAlpha=0.95;if(!STATUS[k])continue;ctx.fillStyle=STATUS[k].color;ctx.beginPath();ctx.arc(e.x-9+i*6,e.y-e.r-5,2.4,0,TAU);ctx.fill();ctx.restore();i++;}}
 if((e.elite||isBig(e))&&e.hp<e.maxhp){ctx.save();ctx.strokeStyle=e.color;ctx.lineWidth=6;ctx.beginPath();ctx.arc(e.x,e.y,e.r+10,-Math.PI/2,-Math.PI/2+TAU*(e.hp/e.maxhp));ctx.stroke();ctx.restore();}}
function predictDodgeLanding(dirx,diry,press){
 // mirrors the EXACT dodge+slide integration in update() so the landing dot is accurate.
 const cid=player.char.id,dc=DODGE[cid]||DODGE.vanguard;if(!(dc.d>0))return null;
 const dl=Math.hypot(dirx,diry)||1;dirx/=dl;diry/=dl;
 const pr=(press==null)?1:Math.max(0.45,Math.min(1,press));
 // Mark the END OF THE IFRAME DASH: the safe landing spot where invulnerability ends.
 // Frame-identical to update()'s dodge burst (incl. pressure), so the O is always accurate.
 let pvx=dirx*dc.d*7*pr,pvy=diry*dc.d*7*pr,x=0,y=0;
 const dt=1/60;let dodgeT=Math.min(0.5,(dc.d*pr)/900);
 const sp=(player.speed||130)*(player.onRoad?1.35:1);const acc=Math.min(1,dt*9*((player.mods&&player.mods.accelMul)||1));
 // replicate update() EXACTLY: decrement dodgeT, accel-lerp toward zero (no input), dodge friction, move.
 while(dodgeT>0){dodgeT-=dt;pvx+=(0-pvx)*acc;pvy+=(0-pvy)*acc;if(dodgeT>0){const f=Math.pow(0.45,dt);pvx*=f;pvy*=f;}x+=pvx*dt;y+=pvy*dt;}
 return {x:x,y:y};
}
function drawMoveLine(){const p=player;if(!IS_TOUCH)return;
 let ax=_aimX||0,ay=_aimY||0;const pv=Math.hypot(p.pvx,p.pvy);
 if(!ax&&!ay){if(pv>14){ax=p.pvx/pv;ay=p.pvy/pv;}else{ax=(p._face||1);ay=0;}}
 const al=Math.hypot(ax,ay)||1;ax/=al;ay/=al;
 const cid=p.char.id,dc=DODGE[cid]||{d:0},canDodge=(dc.d>0&&p.dodgeCd<=0);
 // live joystick pressure sets how far this dodge will go, so the line + O react to your push.
 const livePress=(touchActive&&typeof touchVec!=='undefined')?Math.max(0.45,Math.min(1,(Math.hypot(touchVec.x,touchVec.y))/0.92)):1;
 ctx.save();
 // direction line: dashed, grows with speed, soft glowing grey, fits the deep-sea light theme
 const speedFrac=Math.min(1,pv/Math.max(80,p.speed*1.15));
 const lineLen=(p.r+16)+speedFrac*72;
 const sx=p.x+ax*(p.r+8),sy=p.y+ay*(p.r+8),ex=p.x+ax*lineLen,ey=p.y+ay*lineLen;
 ctx.globalAlpha=0.42;ctx.strokeStyle='#aec6dd';ctx.lineWidth=2.3;ctx.lineCap='round';
 ctx.setLineDash([5,8]);ctx.lineDashOffset=-(time*60)%13;
 if(QX&&QX.glow){ctx.shadowColor='#aec6dd';ctx.shadowBlur=6;}
 ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;
 // landing indicator: the 'O' where a dodge lands RIGHT NOW, in the diver's light
 if(canDodge){const land=predictDodgeLanding(ax,ay,livePress);if(land){const lx=p.x+land.x,ly=p.y+land.y;
  const lc=p.color||p.char.color;const pulse=0.5+0.5*Math.sin(time*6);
  ctx.globalAlpha=0.3;ctx.strokeStyle=lc;ctx.lineWidth=1.8;ctx.setLineDash([4,9]);ctx.lineDashOffset=-(time*60)%13;
  ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(lx,ly);ctx.stroke();ctx.setLineDash([]);
  if(QX&&QX.glow){ctx.shadowColor=lc;ctx.shadowBlur=14;}
  ctx.globalAlpha=0.55+0.33*pulse;ctx.strokeStyle=lc;ctx.lineWidth=2.6;
  ctx.beginPath();ctx.arc(lx,ly,p.r*0.9,0,TAU);ctx.stroke();
  ctx.globalAlpha=0.2+0.16*pulse;ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(lx,ly,p.r*0.9+4+pulse*3,0,TAU);ctx.stroke();
  ctx.shadowBlur=0;ctx.globalAlpha=0.5+0.3*pulse;ctx.fillStyle=lc;
  ctx.beginPath();ctx.arc(lx,ly,2.4,0,TAU);ctx.fill();
 }}
 ctx.restore();
}
function drawCharAura(p){
 const id=p.char.id,t=time,sp=Math.hypot(p.pvx,p.pvy),moving=sp>50;const glow=(QX&&QX.glow);
 // TRAIL: a chosen cosmetic trail overrides the native afterimage
 if(cos.trail!=='native'){drawCosTrail(p);}
 else if(id==='ranger'||id==='vyper'){if(!p._trailPts)p._trailPts=[];if(moving){p._trailPts.unshift({x:p.x,y:p.y});if(p._trailPts.length>7)p._trailPts.pop();}else if(p._trailPts.length){p._trailPts.pop();}
  ctx.save();const tc=id==='ranger'?'#6cffb0':'#9bff5c';for(let i=0;i<p._trailPts.length;i++){const g=p._trailPts[i],aa=(1-i/p._trailPts.length)*0.32;ctx.globalAlpha=aa;ctx.fillStyle=tc;ctx.beginPath();ctx.arc(g.x,g.y,p.r*(1-i*0.08),0,TAU);ctx.fill();}ctx.restore();}
 // AURA: a chosen cosmetic aura overrides the native per-diver aura
 if(cos.aura!=='native'){drawCosAura(p);return;}
 ctx.save();
 if(id==='vanguard'){ctx.globalAlpha=0.5;ctx.strokeStyle='#00e5d4';if(glow){ctx.shadowColor='#00e5d4';ctx.shadowBlur=7;}ctx.lineWidth=2;for(let i=0;i<3;i++){const a=t*0.6+i/3*TAU,ox=p.x+Math.cos(a)*(p.r+16),oy=p.y+Math.sin(a)*(p.r+16);ctx.beginPath();for(let k=0;k<6;k++){const ha=k/6*TAU+a,hx=ox+Math.cos(ha)*5,hy=oy+Math.sin(ha)*5;k?ctx.lineTo(hx,hy):ctx.moveTo(hx,hy);}ctx.closePath();ctx.stroke();}}
 else if(id==='sentinel'){ctx.globalAlpha=0.45;ctx.fillStyle='#5cf0d0';if(glow){ctx.shadowColor='#5cf0d0';ctx.shadowBlur=6;}for(let i=0;i<8;i++){const a=t*0.8+i/8*TAU;ctx.beginPath();ctx.arc(p.x+Math.cos(a)*(p.r+14),p.y+Math.sin(a)*(p.r+14),1.6,0,TAU);ctx.fill();}const sa=t*2.2;ctx.globalAlpha=0.22;ctx.strokeStyle='#5cf0d0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+Math.cos(sa)*(p.r+22),p.y+Math.sin(sa)*(p.r+22));ctx.stroke();}
 else if(id==='sniper'){ctx.globalAlpha=0.4;ctx.strokeStyle='#6cf0ff';if(glow){ctx.shadowColor='#6cf0ff';ctx.shadowBlur=5;}ctx.lineWidth=1.3;const R=p.r+18,ra=t*0.5;ctx.beginPath();ctx.arc(p.x,p.y,R,0,TAU);ctx.stroke();for(let k=0;k<4;k++){const a=ra+k/4*TAU;ctx.beginPath();ctx.moveTo(p.x+Math.cos(a)*(R-5),p.y+Math.sin(a)*(R-5));ctx.lineTo(p.x+Math.cos(a)*(R+5),p.y+Math.sin(a)*(R+5));ctx.stroke();}}
 else if(id==='vyper'){if(moving&&particles.length<340&&Math.random()<0.17)particles.push({x:p.x+rand(-p.r,p.r),y:p.y+rand(-p.r,p.r),vx:rand(-10,10),vy:rand(20,52),life:0.5,color:'#9bff5c',r:1.6});ctx.globalAlpha=0.3+0.15*Math.sin(t*4);ctx.strokeStyle='#9bff5c';if(glow){ctx.shadowColor='#9bff5c';ctx.shadowBlur=9;}ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,p.r+8,t%TAU,t%TAU+Math.PI*1.3);ctx.stroke();}
 else if(id==='yujin'){if(particles.length<340&&Math.random()<0.09)particles.push({x:p.x+rand(-20,20),y:p.y+rand(-20,20),vx:rand(-15,15),vy:rand(-26,-8),life:1.0,color:'#ffd0e0',r:1.8});ctx.globalAlpha=0.32;ctx.strokeStyle='#ffe27a';if(glow){ctx.shadowColor='#ffe27a';ctx.shadowBlur=8;}ctx.lineWidth=1.6;const ba=t*1.2;ctx.beginPath();ctx.arc(p.x,p.y,p.r+12,ba,ba+0.85);ctx.stroke();}
 else if(id==='rhino'){if(moving&&particles.length<340&&Math.random()<0.16)particles.push({x:p.x+rand(-p.r,p.r),y:p.y+p.r*0.5,vx:rand(-30,30),vy:rand(-6,16),life:0.42,color:'#caa37a',r:2.6});}
 else if(id==='angler'){if(moving&&particles.length<340&&Math.random()<0.10)particles.push({x:p.x+rand(-p.r,p.r),y:p.y+rand(-p.r,p.r),vx:rand(-14,14),vy:rand(-20,-4),life:0.5,color:'#bfefff',r:1.6});}
 else if(id==='sorcerer'){ctx.globalAlpha=0.75;const a1=t*1.6,a2=-t*1.3;if(glow)ctx.shadowBlur=8;ctx.fillStyle='#ff5cf0';if(glow)ctx.shadowColor='#ff5cf0';ctx.beginPath();ctx.arc(p.x+Math.cos(a1)*(p.r+12),p.y+Math.sin(a1)*(p.r+12),2.4,0,TAU);ctx.fill();ctx.fillStyle='#5cd0ff';if(glow)ctx.shadowColor='#5cd0ff';ctx.beginPath();ctx.arc(p.x+Math.cos(a2)*(p.r+12),p.y+Math.sin(a2)*(p.r+12),2.4,0,TAU);ctx.fill();}
 ctx.restore();
}
function drawPlayer(){const p=player;
 drawMoveLine();
 drawCharAura(p);
 if(time<BAL.instantXpTime){ctx.save();ctx.globalAlpha=0.10+0.06*Math.sin(time*6);ctx.fillStyle='#6cffb0';ctx.beginPath();ctx.arc(p.x,p.y,p.r+26,0,TAU);ctx.fill();ctx.restore();}
 ctx.save();const col=p.hurtFlash>0?'#ff5a6e':(cosBody(p)||p.color||'#00e5d4');ctx.shadowColor=col;ctx.shadowBlur=24;ctx.fillStyle=p.hurtFlash>0?'#ffd0d6':col;
 ctx.beginPath();
 if(p.pshape==='diamond'){ctx.moveTo(p.x,p.y-p.r*1.2);ctx.lineTo(p.x+p.r*1.2,p.y);ctx.lineTo(p.x,p.y+p.r*1.2);ctx.lineTo(p.x-p.r*1.2,p.y);ctx.closePath();}
 else if(p.pshape==='hex'){for(let k=0;k<6;k++){const a=k/6*TAU-Math.PI/2,hx=p.x+Math.cos(a)*p.r*1.15,hy=p.y+Math.sin(a)*p.r*1.15;k?ctx.lineTo(hx,hy):ctx.moveTo(hx,hy);}ctx.closePath();}
 else if(p.pshape==='delta'){ctx.moveTo(p.x,p.y-p.r*1.3);ctx.lineTo(p.x+p.r*1.15,p.y+p.r*0.95);ctx.lineTo(p.x-p.r*1.15,p.y+p.r*0.95);ctx.closePath();}
 else ctx.arc(p.x,p.y,p.r,0,TAU);
 ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=col;ctx.stroke();
 if(p.iframes>0){ctx.globalAlpha=0.5+0.5*Math.sin(time*40);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,p.r+5,0,TAU);ctx.stroke();}ctx.restore();
 if(p.esMax>0&&p.es>0){ctx.save();ctx.globalAlpha=0.35+0.4*(p.es/p.esMax);ctx.strokeStyle='#9bd0ff';ctx.shadowColor='#9bd0ff';ctx.shadowBlur=10;ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,p.r+9,0,TAU);ctx.stroke();ctx.restore();}
 if((DODGE[p.char.id]||{}).d>0&&p.char.id!=='rhino'){ctx.save();const dc=DODGE[p.char.id],rdy=p.dodgeCd<=0,frac=rdy?1:1-p.dodgeCd/dc.cd;ctx.globalAlpha=rdy?0.9:0.4;ctx.strokeStyle=rdy?(p.color||p.char.color):'#6680a8';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(p.x,p.y,p.r+13,-Math.PI/2,-Math.PI/2+TAU*frac);ctx.stroke();ctx.restore();}
 if(p.char.id==='vanguard'){ctx.save();const rdy=p.dodgeCd<=0,frac=rdy?1:1-p.dodgeCd/BULWARK.cd;ctx.globalAlpha=rdy?0.85:0.4;ctx.strokeStyle=rdy?'#00e5d4':'#6680a8';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(p.x,p.y,p.r+13,-Math.PI/2,-Math.PI/2+TAU*frac);ctx.stroke();ctx.restore();}
 if(p.char.id==='sorcerer'){ctx.save();const rdy=p.dodgeCd<=0,frac=rdy?1:1-p.dodgeCd/HEX.cd;ctx.globalAlpha=rdy?0.85:0.4;ctx.strokeStyle=rdy?'#b6ff3c':'#6680a8';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(p.x,p.y,p.r+13,-Math.PI/2,-Math.PI/2+TAU*frac);ctx.stroke();ctx.restore();}
 if(p.bulwarkT>0){ctx.save();ctx.globalAlpha=0.5+0.4*Math.sin(time*20);ctx.strokeStyle='#00e5d4';ctx.fillStyle='rgba(0,229,212,0.12)';ctx.shadowColor='#00e5d4';ctx.shadowBlur=20;ctx.lineWidth=4;ctx.beginPath();ctx.arc(p.x,p.y,p.r+18,0,TAU);ctx.fill();ctx.stroke();ctx.restore();}
 // ===== ANGLER visuals: the strongman, his rope, his ritual =====
 if(p.char.id==='angler'){ctx.save();
  // signature: a coiled rope slung around him, slowly rotating - and now and then a flex glint
  const ra=time*0.7;
  ctx.globalAlpha=0.55;ctx.strokeStyle='#2c6d86';ctx.lineWidth=3.4;
  for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(p.x,p.y,p.r+7,ra+k*2.1,ra+k*2.1+1.15);ctx.stroke();}
  ctx.globalAlpha=0.35;ctx.strokeStyle='#4bd8ff';ctx.lineWidth=1.2;
  for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(p.x,p.y,p.r+7,ra+k*2.1+0.12,ra+k*2.1+1.0);ctx.stroke();}
  const gph=(time%2.2);
  if(gph<0.35){const gf=Math.sin(gph/0.35*Math.PI);const gx=p.x+p.r*0.85,gy=p.y-p.r*0.6;
   if(QX&&QX.glow){ctx.shadowColor='#ffffff';ctx.shadowBlur=10*gf;}
   ctx.globalAlpha=0.85*gf;ctx.strokeStyle='#dff8ff';ctx.lineWidth=1.6;
   ctx.beginPath();ctx.moveTo(gx-5*gf,gy);ctx.lineTo(gx+5*gf,gy);ctx.moveTo(gx,gy-5*gf);ctx.lineTo(gx,gy+5*gf);ctx.stroke();}
  ctx.restore();}
 // cooldown ring
 if(p.char.id==='angler'){ctx.save();const rdy=p.dodgeCd<=0,frac=rdy?1:1-p.dodgeCd/(p._grapLastCd||1);ctx.globalAlpha=rdy?0.9:0.4;ctx.strokeStyle=rdy?'#4bd8ff':'#6680a8';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(p.x,p.y,p.r+13,-Math.PI/2,-Math.PI/2+TAU*Math.max(0,Math.min(1,frac)));ctx.stroke();ctx.restore();}
 // WINDUP: he spins the hook overhead like a lasso; a ghost line shows where it will fly
 if(p.char.id==='angler'&&p._grapUp){ctx.save();const cf=Math.min(1,(p._grapHold||0)/GRAPPLE.maxHold);const col=cf>0.78?'#ffffff':(cf>0.45?'#bfefff':'#4bd8ff');
  const aim=anglerAim();
  const len=GRAPPLE.baseLen+cf*(GRAPPLE.maxLen-GRAPPLE.baseLen);
  ctx.globalAlpha=0.3+0.25*cf;ctx.strokeStyle=col;ctx.lineWidth=1.6;ctx.setLineDash([5,11]);ctx.lineDashOffset=-(time*100)%16;
  ctx.beginPath();ctx.moveTo(p.x+aim.dx*(p.r+8),p.y+aim.dy*(p.r+8));ctx.lineTo(p.x+aim.dx*len,p.y+aim.dy*len);ctx.stroke();ctx.setLineDash([]);
  // spinning lasso: rope arc trail + hook head orbiting faster and wider with charge
  const sa=time*(8+9*cf),rr=p.r+16+26*cf;
  ctx.globalAlpha=0.7;ctx.strokeStyle='#2c6d86';ctx.lineWidth=2.6;
  ctx.beginPath();ctx.arc(p.x,p.y,rr,sa-1.6,sa);ctx.stroke();
  ctx.globalAlpha=0.9;ctx.strokeStyle=col;ctx.lineWidth=1.4;
  ctx.beginPath();ctx.arc(p.x,p.y,rr,sa-0.9,sa);ctx.stroke();
  const hx=p.x+Math.cos(sa)*rr,hy=p.y+Math.sin(sa)*rr;
  if(QX&&QX.glow){ctx.shadowColor=col;ctx.shadowBlur=12;}
  ctx.translate(hx,hy);ctx.rotate(sa+Math.PI/2);ctx.fillStyle='#dff8ff';
  ctx.beginPath();ctx.moveTo(9,0);ctx.lineTo(-3,-5);ctx.lineTo(-1,0);ctx.lineTo(-3,5);ctx.closePath();ctx.fill();
  ctx.restore();ctx.save();
  // charge arc
  ctx.globalAlpha=0.75;ctx.strokeStyle=col;ctx.lineWidth=3;if(QX&&QX.glow){ctx.shadowColor=col;ctx.shadowBlur=10;}
  ctx.beginPath();ctx.arc(p.x,p.y,p.r+30+28*cf,-Math.PI/2,-Math.PI/2+TAU*cf);ctx.stroke();
  ctx.restore();}
 // LIVE ROPE: a real rope - sagging while flying, snapping taut under load, with twist texture
 if(p.char.id==='angler'&&p._grap){ctx.save();const g=p._grap;
  const tx=g.tx,ty=g.ty;
  const dx=tx-p.x,dy=ty-p.y,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
  const flying=g.ph==='out';
  const amp=flying?(7*(1-Math.min(1,g.trav/(g.len||1)))+3):2.2;
  const frq=flying?1.15:2.3, spd=flying?14:26;
  const SEG=14,pts=[];
  for(let i=0;i<=SEG;i++){const t=i/SEG;const sag=Math.sin(t*Math.PI)* (flying?4:1.5);
   const w=Math.sin(i*frq - time*spd)*amp*Math.sin(t*Math.PI);
   pts.push({x:p.x+dx*t+nx*(w+sag),y:p.y+dy*t+ny*(w+sag)});}
  if(QX&&QX.glow){ctx.shadowColor='#4bd8ff';ctx.shadowBlur=8;}
  ctx.globalAlpha=0.55;ctx.strokeStyle='#1e4f63';ctx.lineWidth=5;
  ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<=SEG;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke();
  ctx.globalAlpha=0.95;ctx.strokeStyle=g.ph==='pull'?'#dff8ff':'#4bd8ff';ctx.lineWidth=2.2;
  ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<=SEG;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke();
  // rope twist ticks
  ctx.globalAlpha=0.5;ctx.strokeStyle='#9fdcef';ctx.lineWidth=1.1;
  for(let i=2;i<SEG;i+=2){const q=pts[i];ctx.beginPath();ctx.moveTo(q.x-nx*3,q.y-ny*3);ctx.lineTo(q.x+nx*3,q.y+ny*3);ctx.stroke();}
  // harpoon head
  const a=Math.atan2(ty-pts[SEG-1].y,tx-pts[SEG-1].x);
  ctx.globalAlpha=1;ctx.translate(tx,ty);ctx.rotate(a);ctx.fillStyle='#dff8ff';
  ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(-5,-7);ctx.lineTo(-2,0);ctx.lineTo(-5,7);ctx.closePath();ctx.fill();
  ctx.restore();}
 if(p.char.id==='rhino'){ctx.save();const rdy=p.dodgeCd<=0,frac=rdy?1:1-p.dodgeCd/(p._lastChargeCd||1);ctx.globalAlpha=rdy?0.9:0.4;ctx.strokeStyle=rdy?'#ff9b4b':'#6680a8';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(p.x,p.y,p.r+13,-Math.PI/2,-Math.PI/2+TAU*frac);ctx.stroke();ctx.restore();}
 if(p.char.id==='rhino'&&p._chargingUp){ctx.save();const cf=Math.min(1,(p._chargeHold||0)/RHINO.maxHold);const col=cf>0.78?'#ffffff':(cf>0.45?'#ffe0a0':'#ff9b4b');
  // pulsing buildup aura (grows + brightens with charge)
  const pulse=0.5+0.5*Math.sin(time*(10+18*cf));ctx.globalAlpha=0.25+0.5*cf*pulse;ctx.fillStyle=col;if(QX&&QX.glow){ctx.shadowColor=col;ctx.shadowBlur=14+26*cf;}ctx.beginPath();ctx.arc(p.x,p.y,p.r+10+14*cf,0,TAU);ctx.fill();
  // crackling energy spokes spinning faster as it builds
  ctx.globalAlpha=0.55*cf+0.2;ctx.strokeStyle=col;ctx.lineWidth=2;const spokes=6;for(let k=0;k<spokes;k++){const a=time*(3+5*cf)+k/spokes*TAU,r1=p.r+16+18*cf,r2=r1+10+24*cf;ctx.beginPath();ctx.moveTo(p.x+Math.cos(a)*r1,p.y+Math.sin(a)*r1);ctx.lineTo(p.x+Math.cos(a)*r2,p.y+Math.sin(a)*r2);ctx.stroke();}
  // radial CHARGE METER ring (fills as you hold)
  ctx.shadowBlur=0;ctx.globalAlpha=0.9;ctx.strokeStyle=col;ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(p.x,p.y,p.r+30+8*cf,-Math.PI/2,-Math.PI/2+TAU*cf);ctx.stroke();
  // label
  ctx.globalAlpha=0.85;ctx.fillStyle=col;ctx.font='700 11px '+(getComputedStyle(document.documentElement).getPropertyValue('--disp')||'monospace');ctx.textAlign='center';ctx.fillText(cf>=1?'MAX CHARGE':'CHARGING',p.x,p.y-p.r-30);ctx.restore();}
 if(p.char.id==='rhino'&&p.dodgeT>0){ctx.save();const a=Math.atan2(p.pvy,p.pvx);ctx.globalAlpha=0.55+0.35*Math.sin(time*30);ctx.strokeStyle='#ff9b4b';ctx.fillStyle='rgba(255,155,75,0.16)';if(QX&&QX.glow){ctx.shadowColor='#ff9b4b';ctx.shadowBlur=22;}ctx.lineWidth=4;ctx.beginPath();ctx.arc(p.x,p.y,p.r+14,0,TAU);ctx.fill();ctx.stroke();ctx.globalAlpha=0.4;ctx.lineWidth=2;for(let k=1;k<=3;k++){ctx.beginPath();ctx.arc(p.x-Math.cos(a)*k*10,p.y-Math.sin(a)*k*10,p.r+14-k*3,0,TAU);ctx.stroke();}ctx.restore();}
 if(p.char.id==='rhino'&&p.dodgeT>0){ctx.save();const a=Math.atan2(p.pvy,p.pvx),cf=(p._chargePow&&p._chargePow.cf)||0.3;const tipX=p.x+Math.cos(a)*(p.r+22+18*cf),tipY=p.y+Math.sin(a)*(p.r+22+18*cf),bx=p.x+Math.cos(a)*(p.r-2),by=p.y+Math.sin(a)*(p.r-2),px=-Math.sin(a),py=Math.cos(a),w=p.r*0.72;ctx.fillStyle=cf>0.6?'#ffffff':'#ffd0a0';if(QX&&QX.glow){ctx.shadowColor='#ff9b4b';ctx.shadowBlur=16;}ctx.beginPath();ctx.moveTo(tipX,tipY);ctx.lineTo(bx+px*w,by+py*w);ctx.lineTo(bx-px*w,by-py*w);ctx.closePath();ctx.fill();ctx.strokeStyle='#ff9b4b';ctx.lineWidth=2;ctx.stroke();ctx.restore();}
 if(p.char.id==='rhino'&&p.dodgeT>0){ctx.save();const a=Math.atan2(p.pvy,p.pvx);ctx.globalAlpha=0.5;ctx.strokeStyle='#ffd0a0';ctx.lineWidth=2;for(let k=0;k<7;k++){const off=(k-3)*9,px=p.x-Math.sin(a)*off,py=p.y+Math.cos(a)*off,len=30+Math.random()*40;ctx.beginPath();ctx.moveTo(px-Math.cos(a)*10,py-Math.sin(a)*10);ctx.lineTo(px-Math.cos(a)*(10+len),py-Math.sin(a)*(10+len));ctx.stroke();}ctx.restore();}
 if(p.hexT>0){ctx.save();const hp=0.5+0.4*Math.sin(time*8);ctx.globalAlpha=0.5*hp;ctx.strokeStyle='#b6ff3c';ctx.fillStyle='rgba(182,255,60,0.10)';if(QX&&QX.glow){ctx.shadowColor='#b6ff3c';ctx.shadowBlur=18;}ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,p.r+16,0,TAU);ctx.fill();ctx.stroke();ctx.globalAlpha=0.3*hp;ctx.beginPath();ctx.arc(p.x,p.y,p.r+16+6*Math.sin(time*5),0,TAU);ctx.stroke();ctx.restore();}
 if(p.char.id==='yujin'){ctx.save();const rdy=p.parryCdT<=0;ctx.globalAlpha=p.parryActive?0.95:(rdy?0.7:0.3);ctx.strokeStyle='#ffe27a';if(p.parryActive)ctx.shadowColor='#ffe27a',ctx.shadowBlur=16;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(p.x,p.y,p.r+13,0,TAU);ctx.stroke();ctx.restore();}
 if(p.parryFlash>0){ctx.save();ctx.globalAlpha=p.parryFlash*3;ctx.strokeStyle='#fff';ctx.shadowColor='#ffe27a';ctx.shadowBlur=24;ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,p.r+18+(0.25-p.parryFlash)*60,0,TAU);ctx.stroke();ctx.restore();}
 let stx=null,stc='#fff';
 if(p.bulwarkT>0){stx='GUARD';stc='#00e5d4';}
 else if(p.char.id==='rhino'&&p.dodgeT>0){stx='CHARGE';stc='#ff9b4b';}
 else if(p.hexT>0){stx='HEX';stc='#b6ff3c';}
 else if(p.parryActive){stx='PARRY';stc='#ffe27a';}
 else if(p.judgedT>0){stx='JUDGED';stc='#ffe27a';}
 else if(p.slowT>0){stx='SLOWED';stc='#8a6bd8';}
 if(stx){ctx.save();ctx.font='700 11px Orbitron,sans-serif';ctx.textAlign='center';ctx.fillStyle=stc;ctx.shadowColor=stc;ctx.shadowBlur=10;ctx.fillText(stx,p.x,p.y-p.r-36);ctx.restore();}
 const fw=p.weapons.find(w=>w.id==='fists');if(fw&&fw._render&&fw._render.flash>0){const R=fw._render;ctx.save();ctx.globalAlpha=R.flash*7;ctx.strokeStyle='#ffe27a';ctx.shadowColor='#ffe27a';ctx.shadowBlur=12;ctx.lineWidth=4;const ex=p.x+Math.cos(R.ang)*R.reach,ey=p.y+Math.sin(R.ang)*R.reach;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(ex,ey);ctx.stroke();ctx.restore();}
 if(p.hasBarrier){const br=p.r+22;ctx.save();ctx.globalAlpha=p.barrier.ready?0.8:0.22;ctx.strokeStyle='#9bd0ff';ctx.shadowColor='#9bd0ff';ctx.shadowBlur=p.barrier.ready?14:4;ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,br,0,TAU);ctx.stroke();ctx.restore();}
 if(p.judgedT>0){ctx.save();ctx.globalAlpha=0.6+0.3*Math.sin(time*10);ctx.strokeStyle='#ffe27a';ctx.shadowColor='#ffe27a';ctx.shadowBlur=14;ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,p.r+27,0,TAU);ctx.stroke();ctx.font='bold 13px Orbitron,sans-serif';ctx.fillStyle='#ffe27a';ctx.textAlign='center';ctx.fillText('!',p.x,p.y-p.r-30);ctx.restore();}
 ctx.save();ctx.globalAlpha=0.05;ctx.strokeStyle='#00e5d4';ctx.beginPath();ctx.arc(p.x,p.y,p.pickupRange,0,TAU);ctx.stroke();ctx.restore();}

