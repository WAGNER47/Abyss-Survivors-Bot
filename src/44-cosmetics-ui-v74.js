/* ===================== COSMETICS UI (v7.4) ===================== */
let _cosTab='palette';
const COS_TABS=[['palette','Palette'],['trail','Trail'],['aura','Aura'],['proj','Projectile'],['death','Death FX']];
function spectrumColP(T,off){const h=((T*42+off)%360+360)%360;return 'hsl('+h.toFixed(0)+',92%,62%)';}
function cosSwatchStyle(cat,o){
 if(cat==='palette'){if(o.body==null)return 'background:conic-gradient(from 0deg,#00e5d4,#5cf0d0,#9b6dff,#ff5cf0,#ffd24b,#6cffb0,#00e5d4)';if(o.body==='spectrum')return 'background:linear-gradient(90deg,#ff5cf0,#ffd24b,#6cffb0,#5cd0ff,#9b6dff,#ff5cf0);background-size:220% 100%;animation:cosrnb 4s linear infinite';return 'background:radial-gradient(circle at 34% 32%,'+o.glow+','+o.body+' 72%)';}
 if(cat==='proj'){if(o.mode==='native')return 'background:linear-gradient(120deg,#5cd0ff,#ff5cf0)';if(o.mode==='duo')return 'background:linear-gradient(90deg,'+o.col+' 0%,'+o.col+' 45%,'+o.col2+' 55%,'+o.col2+' 100%)';if(o.mode==='rainbow')return 'background:linear-gradient(90deg,#ff5cf0,#ffd24b,#6cffb0,#5cd0ff);background-size:220% 100%;animation:cosrnb 4s linear infinite';return 'background:radial-gradient(circle at 42% 40%,'+(o.core||'#fff')+' 0%,'+o.col+' 60%)';}
 if(cat==='death')return 'background:radial-gradient(circle,'+o.col+' 0%,rgba(8,14,26,0.15) 72%)';
 const vibe={none:'#33405a',native:'#00e5d4',comet:'#00e5d4',ribbon:'#5cd0ff',echo:'#6cffb0',bubbles:'#5cf0d0',ember:'#ff7a3c',wisp:'#5cffd0',stardust:'#ffd24b',ink:'#7a5cff',plasma:'#ff5cf0',frostT:'#bfeaff',halo:'#5cf0d0',rings:'#5cd0ff',orbs:'#6cffb0',pulse:'#00e5d4',runes:'#c46cff',flame:'#ff7a3c',frost:'#bfeaff',vortex:'#9b6dff'};
 const cc=vibe[o.id]||'#00e5d4';return 'background:linear-gradient(120deg,'+cc+' 0%,rgba(8,14,26,0.45) 95%)';
}
function cosCardCol(cat,o){
 if(cat==='palette')return o.body==null?'#6cffd0':(o.body==='spectrum'?'#ff5cf0':o.sw);
 if(cat==='proj')return o.mode==='native'?'#6cffd0':(o.col||'#6cffd0');
 if(cat==='death')return o.col||'#6cffd0';
 const vibe={none:'#6680a8',native:'#00e5d4',comet:'#00e5d4',ribbon:'#5cd0ff',echo:'#6cffb0',bubbles:'#5cf0d0',ember:'#ff7a3c',wisp:'#5cffd0',stardust:'#ffd24b',ink:'#9b6dff',plasma:'#ff5cf0',frostT:'#bfeaff',halo:'#5cf0d0',rings:'#5cd0ff',orbs:'#6cffb0',pulse:'#00e5d4',runes:'#c46cff',flame:'#ff7a3c',frost:'#bfeaff',vortex:'#9b6dff'};
 return vibe[o.id]||'#6cffd0';
}
function buildCosGrid(){
 const grid=document.getElementById('cosgrid');if(!grid)return;grid.innerHTML='';
 const arr=COSMETICS[_cosTab]||[],selId=cos[_cosTab];
 arr.forEach(o=>{
  const card=document.createElement('div');card.className='cos-card'+(o.id===selId?' on':'');
  card.style.setProperty('--cc',cosCardCol(_cosTab,o));
  card.innerHTML='<div class="cos-sw" style="'+cosSwatchStyle(_cosTab,o)+'"></div><div class="cos-name">'+o.name+'</div><div class="cos-desc">'+(o.desc||'')+'</div>';
  card.onclick=()=>{cos[_cosTab]=o.id;saveCos();try{sfx&&sfx('pickup');}catch(e){}try{hap&&hap('selection');}catch(e){}buildCosGrid();};
  grid.appendChild(card);
 });
}
function buildCosTabs(){
 const tb=document.getElementById('costabs');if(!tb)return;tb.innerHTML='';
 COS_TABS.forEach(([k,label])=>{
  const b=document.createElement('button');b.className='cos-tab'+(k===_cosTab?' on':'');b.textContent=label;
  b.onclick=()=>{_cosTab=k;buildCosTabs();buildCosGrid();};
  tb.appendChild(b);
 });
}
function openCosmetics(){
 hideAllScreens();state='cosmetics';
 const scr=document.getElementById('cosmetics');if(scr){scr.classList.remove('hidden');try{trDyn(scr);}catch(e){}}
 _cosTab='palette';buildCosTabs();buildCosGrid();
}
/* ---- live animated preview (v7.4.2: wider, richer, shows ALL five cosmetics) ---- */
let _cp={t:0,trail:[],parts:[],shots:[],rings:[],fireT:0.6,deathT:5.5,diverA:1};
function cosPreviewTick(dt){
 const cv2=document.getElementById('cospreview');if(!cv2)return;const scr=document.getElementById('cosmetics');if(!scr||scr.classList.contains('hidden'))return;
 if(!isFinite(dt)||dt<0)dt=0.016;if(dt>0.05)dt=0.05;
 const pctx=cv2.getContext('2d');if(!pctx)return;
 const cssW=cv2.clientWidth||520,cssH=cv2.clientHeight||220,dpr=Math.min(2,window.devicePixelRatio||1);
 const pw=Math.max(1,Math.round(cssW*dpr)),ph=Math.max(1,Math.round(cssH*dpr));
 if(cv2.width!==pw||cv2.height!==ph){cv2.width=pw;cv2.height=ph;}
 pctx.setTransform(dpr,0,0,dpr,0,0);pctx.globalAlpha=1;pctx.clearRect(0,0,cssW,cssH);
 _cp.t+=dt;const T=_cp.t;
 const cA=(c,a)=>{try{return hexA(c,a);}catch(e){return 'rgba(0,229,212,'+a+')';}};
 const CAP=170,PUSH=(o)=>{if(_cp.parts.length<CAP)_cp.parts.push(o);};
 const pdef=cosFind('palette',cos.palette);
 const body=pdef&&pdef.body==='spectrum'?spectrumColP(T,0):((pdef&&pdef.body)||'#00e5d4');
 const glowc=pdef&&pdef.glow==='spectrum'?spectrumColP(T,45):((pdef&&pdef.glow)||body);
 const r=Math.max(9,Math.min(cssW,cssH)*0.075);
 const cx=cssW*0.5,cy=cssH*0.46;
 const ox=cx+Math.cos(T*0.9)*cssW*0.26,oy=cy+Math.sin(T*1.3)*cssH*0.18;
 // ---- ambient deep-sea backdrop ----
 pctx.save();pctx.globalAlpha=0.5;pctx.strokeStyle='rgba(60,90,150,0.08)';pctx.lineWidth=1;const gs=38;for(let gx=gs;gx<cssW;gx+=gs){pctx.beginPath();pctx.moveTo(gx,0);pctx.lineTo(gx,cssH);pctx.stroke();}for(let gy=gs;gy<cssH;gy+=gs){pctx.beginPath();pctx.moveTo(0,gy);pctx.lineTo(cssW,gy);pctx.stroke();}pctx.restore();
 if(Math.random()<0.3)PUSH({x:Math.random()*cssW,y:cssH+6,vx:rand(-4,4),vy:rand(-20,-9),life:rand(2,3.6),color:'rgba(130,185,235,0.45)',r:rand(0.6,1.5),amb:1});
 // ---- update particles / rings / shots ----
 for(let i=_cp.parts.length-1;i>=0;i--){const q=_cp.parts[i];q.x+=q.vx*dt;q.y+=q.vy*dt;if(!q.amb){q.vx*=0.94;q.vy*=0.94;}q.life-=dt;if(q.life<=0)_cp.parts.splice(i,1);}
 for(let i=_cp.rings.length-1;i>=0;i--){const g=_cp.rings[i];g.r+=(g.maxR-g.r)*dt*7;g.life-=dt;if(g.life<=0)_cp.rings.splice(i,1);}
 for(let i=_cp.shots.length-1;i>=0;i--){const s=_cp.shots[i];s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;if(s.life<=0||s.x<-24||s.x>cssW+24||s.y<-24||s.y>cssH+24)_cp.shots.splice(i,1);}
 _cp.diverA=Math.min(1,_cp.diverA+dt*1.6);
 // ===== TRAIL =====
 const last=_cp.trail[0];if(_cp.diverA>0.5&&(!last||((ox-last.x)*(ox-last.x)+(oy-last.y)*(oy-last.y))>9))_cp.trail.unshift({x:ox,y:oy});
 const tdef=cosFind('trail',cos.trail),maxL=(tdef&&tdef.len)||16;while(_cp.trail.length>maxL)_cp.trail.pop();
 const tid=cos.trail;pctx.save();
 if(tid==='comet'||tid==='ribbon'||tid==='wisp'||tid==='plasma'||tid==='ink'||tid==='native'){
  if(_cp.trail.length>=2){const col=(tid==='ink')?'#160c28':body,wm=(tdef&&tdef.w)||1;
   for(let i=0;i<_cp.trail.length-1;i++){const a=_cp.trail[i],b=_cp.trail[i+1],f=1-i/_cp.trail.length;pctx.globalAlpha=_cp.diverA*f*(tid==='wisp'?0.5:0.42);pctx.strokeStyle=(tid==='plasma'&&(i&1))?glowc:col;pctx.shadowColor=glowc;pctx.shadowBlur=tid==='ink'?0:10*f;pctx.lineWidth=Math.max(0.5,r*1.5*f*wm);pctx.lineCap='round';pctx.beginPath();pctx.moveTo(a.x,a.y);pctx.lineTo(b.x,b.y);pctx.stroke();}}
 }else if(tid==='echo'){for(let i=0;i<_cp.trail.length;i++){const g=_cp.trail[i],aa=_cp.diverA*(1-i/_cp.trail.length)*0.32;pctx.globalAlpha=aa;pctx.fillStyle=body;pctx.shadowColor=glowc;pctx.shadowBlur=8;pctx.beginPath();pctx.arc(g.x,g.y,Math.max(1,r*(1-i*0.05)),0,TAU);pctx.fill();}}
 else if(tid==='bubbles'&&_cp.diverA>0.5)PUSH({x:ox+rand(-r,r),y:oy,vx:rand(-8,8),vy:rand(-34,-12),life:1.2,color:glowc,r:rand(1.4,3.4)});
 else if(tid==='ember'&&_cp.diverA>0.5)PUSH({x:ox+rand(-r,r),y:oy,vx:rand(-22,22),vy:rand(10,42),life:0.6,color:Math.random()<0.5?body:glowc,r:rand(1.4,3)});
 else if(tid==='stardust'&&_cp.diverA>0.5)PUSH({x:ox+rand(-r,r),y:oy+rand(-r,r),vx:rand(-12,12),vy:rand(-12,12),life:0.9,color:Math.random()<0.5?'#ffffff':glowc,r:rand(1,2.4)});
 else if(tid==='frostT'&&_cp.diverA>0.5)PUSH({x:ox+rand(-r,r),y:oy,vx:rand(-14,14),vy:rand(-10,26),life:0.8,color:Math.random()<0.5?'#bfeaff':'#e6f4ff',r:rand(1.2,2.6)});
 pctx.restore();
 // draw particles + rings
 pctx.save();for(const q of _cp.parts){pctx.globalAlpha=Math.max(0,Math.min(1,q.life*(q.amb?0.8:1.6)));pctx.fillStyle=q.color;if(!q.amb){pctx.shadowColor=q.color;pctx.shadowBlur=8;}pctx.beginPath();pctx.arc(q.x,q.y,q.r,0,TAU);pctx.fill();}pctx.restore();
 pctx.save();for(const g of _cp.rings){pctx.globalAlpha=Math.max(0,Math.min(1,g.life*1.4));pctx.strokeStyle=g.color;pctx.shadowColor=g.color;pctx.shadowBlur=12;pctx.lineWidth=2.5;pctx.beginPath();pctx.arc(g.x,g.y,g.r,0,TAU);pctx.stroke();}pctx.restore();
 // ===== AURA =====
 if(_cp.diverA>0.3){const aid=cos.aura;pctx.save();
  if(aid==='halo'){const g=pctx.createRadialGradient(ox,oy,Math.max(0.1,r*0.5),ox,oy,r+18);g.addColorStop(0,cA(glowc,0));g.addColorStop(0.62,cA(glowc,0.16));g.addColorStop(1,cA(glowc,0));pctx.fillStyle=g;pctx.beginPath();pctx.arc(ox,oy,r+18,0,TAU);pctx.fill();pctx.globalAlpha=0.45;pctx.strokeStyle=glowc;pctx.shadowColor=glowc;pctx.shadowBlur=12;pctx.lineWidth=2;pctx.beginPath();pctx.arc(ox,oy,r+9+2*Math.sin(T*3),0,TAU);pctx.stroke();}
  else if(aid==='rings'){for(let i=0;i<3;i++){const a=T*(0.6+i*0.22)*((i&1)?-1:1);pctx.globalAlpha=0.45-i*0.1;pctx.strokeStyle=glowc;pctx.shadowColor=glowc;pctx.shadowBlur=8;pctx.lineWidth=2;pctx.beginPath();pctx.arc(ox,oy,r+8+i*6,a,a+TAU*0.7);pctx.stroke();}}
  else if(aid==='orbs'){for(let i=0;i<5;i++){const a=T*1.2+i/5*TAU;pctx.globalAlpha=0.9;pctx.fillStyle=(i&1)?glowc:body;pctx.shadowColor=glowc;pctx.shadowBlur=10;pctx.beginPath();pctx.arc(ox+Math.cos(a)*(r+14),oy+Math.sin(a)*(r+14),2.6,0,TAU);pctx.fill();}}
  else if(aid==='pulse'){for(let k=0;k<2;k++){const phc=((T*1.5)+k*0.5)%1;pctx.globalAlpha=(1-phc)*0.55;pctx.strokeStyle=glowc;pctx.shadowColor=glowc;pctx.shadowBlur=10;pctx.lineWidth=2.5;pctx.beginPath();pctx.arc(ox,oy,r+phc*26,0,TAU);pctx.stroke();}}
  else if(aid==='runes'){pctx.globalAlpha=0.65;pctx.strokeStyle=glowc;pctx.shadowColor=glowc;pctx.shadowBlur=8;pctx.lineWidth=2;const a0=T*0.7;for(let i=0;i<6;i++){const a=a0+i/6*TAU,rx=ox+Math.cos(a)*(r+14),ry=oy+Math.sin(a)*(r+14);pctx.beginPath();for(let k=0;k<3;k++){const ha=k/3*TAU+a*2,hx=rx+Math.cos(ha)*4,hy=ry+Math.sin(ha)*4;k?pctx.lineTo(hx,hy):pctx.moveTo(hx,hy);}pctx.closePath();pctx.stroke();}}
  else if(aid==='flame'){if(Math.random()<0.6){const a=Math.random()*TAU;PUSH({x:ox+Math.cos(a)*r,y:oy+Math.sin(a)*r,vx:Math.cos(a)*10,vy:-22-Math.random()*22,life:0.5,color:Math.random()<0.5?'#ff7a3c':'#ffd24b',r:rand(1.5,3)});}pctx.globalAlpha=0.45;pctx.strokeStyle='#ff9b4b';pctx.shadowColor='#ff7a3c';pctx.shadowBlur=12;pctx.lineWidth=2;pctx.beginPath();pctx.arc(ox,oy,r+8+2*Math.sin(T*8),0,TAU);pctx.stroke();}
  else if(aid==='frost'){pctx.globalAlpha=0.55;pctx.strokeStyle='#bfeaff';pctx.shadowColor='#9bd0ff';pctx.shadowBlur=10;pctx.lineWidth=1.6;const a0=T*0.4;for(let i=0;i<8;i++){const a=a0+i/8*TAU;pctx.beginPath();pctx.moveTo(ox+Math.cos(a)*(r+5),oy+Math.sin(a)*(r+5));pctx.lineTo(ox+Math.cos(a)*(r+13),oy+Math.sin(a)*(r+13));pctx.stroke();}pctx.globalAlpha=0.3;pctx.beginPath();pctx.arc(ox,oy,r+9,0,TAU);pctx.stroke();}
  else if(aid==='vortex'){if(Math.random()<0.7){const a=Math.random()*TAU,rr=r+20;PUSH({x:ox+Math.cos(a)*rr,y:oy+Math.sin(a)*rr,vx:Math.cos(a+1.4)*60,vy:Math.sin(a+1.4)*60,life:0.5,color:Math.random()<0.5?body:glowc,r:rand(1.4,2.6)});}pctx.globalAlpha=0.32;pctx.strokeStyle=glowc;pctx.shadowColor=glowc;pctx.shadowBlur=8;pctx.lineWidth=1.6;for(let i=0;i<2;i++){const a=T*2*((i&1)?-1:1);pctx.beginPath();pctx.arc(ox,oy,r+11+i*5,a,a+TAU*0.8);pctx.stroke();}}
  else if(aid==='native'){pctx.globalAlpha=0.4;pctx.strokeStyle=glowc;pctx.shadowColor=glowc;pctx.shadowBlur=8;pctx.lineWidth=1.5;pctx.beginPath();pctx.arc(ox,oy,r+11,T%TAU,T%TAU+Math.PI*1.3);pctx.stroke();}
  pctx.restore();}
 // ===== DIVER BODY =====
 if(_cp.diverA>0.02){pctx.save();pctx.globalAlpha=_cp.diverA;pctx.shadowColor=glowc;pctx.shadowBlur=22;pctx.fillStyle=body;pctx.beginPath();pctx.arc(ox,oy,r,0,TAU);pctx.fill();pctx.lineWidth=2.5;pctx.strokeStyle=body;pctx.stroke();pctx.restore();}
 // ===== PROJECTILE BURST (radial, every ~1.8s) — shows the projectile skin in motion =====
 _cp.fireT-=dt;
 if(_cp.fireT<=0&&_cp.diverA>0.6){_cp.fireT=1.8;const n=10;for(let i=0;i<n;i++){const a=i/n*TAU+T*0.3,spd=118+Math.random()*44;_cp.shots.push({x:ox,y:oy,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,r:4,sd:Math.random(),sh:Math.random()*360,life:1.7});}}
 const sk=cosFind('proj',cos.proj);
 pctx.save();for(const s of _cp.shots){let pc=body,core=null,gm=1;if(sk&&sk.mode&&sk.mode!=='native'){if(sk.mode==='duo')pc=s.sd<0.5?sk.col:sk.col2;else if(sk.mode==='rainbow')pc='hsl('+(((T*120+s.sh)%360+360)%360).toFixed(0)+',95%,62%)';else pc=sk.col;core=sk.core;gm=sk.glow||1;}else pc=glowc;
  const spd=Math.hypot(s.vx,s.vy)||1,ux=s.vx/spd,uy=s.vy/spd,al=Math.max(0,Math.min(1,s.life*1.1));
  pctx.globalAlpha=al*0.4;pctx.strokeStyle=pc;pctx.lineWidth=s.r*0.9;pctx.lineCap='round';pctx.beginPath();pctx.moveTo(s.x-ux*s.r*2.4,s.y-uy*s.r*2.4);pctx.lineTo(s.x,s.y);pctx.stroke();
  pctx.globalAlpha=al*0.95;pctx.shadowColor=pc;pctx.shadowBlur=12*gm;pctx.fillStyle=pc;pctx.beginPath();pctx.arc(s.x,s.y,s.r,0,TAU);pctx.fill();
  if(core){pctx.shadowBlur=0;pctx.globalAlpha=al;pctx.fillStyle=core;pctx.beginPath();pctx.arc(s.x,s.y,s.r*0.45,0,TAU);pctx.fill();}}
 pctx.restore();
 // ===== DEATH FX demo (every ~5.5s) — shows the death cosmetic, then the diver fades back =====
 _cp.deathT-=dt;
 if(_cp.deathT<=0&&_cp.diverA>0.6){_cp.deathT=5.5;const d=cosFind('death',cos.death)||{col:'#00e5d4'},c=d.col;
  _cp.diverA=-0.25;
  _cp.rings.push({x:ox,y:oy,r:r,maxR:r+74,life:0.5,color:c});
  if(d.id==='nova'||d.id==='shatter'||d.id==='gold')_cp.rings.push({x:ox,y:oy,r:r,maxR:r+112,life:0.6,color:'#ffffff'});
  const nn=24;for(let i=0;i<nn;i++){const a=i/nn*TAU,sp=rand(80,210);PUSH({x:ox,y:oy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:rand(0.5,0.95),color:Math.random()<0.5?c:(d.id==='nova'?'#ffffff':glowc),r:rand(2,4)});}}
 // ===== bottom legend: names all five active selections =====
 const names=[cosFind('palette',cos.palette),cosFind('trail',cos.trail),cosFind('aura',cos.aura),cosFind('proj',cos.proj),cosFind('death',cos.death)];
 const legend=names.map(o=>o?o.name:'').join('   \u00b7   ').toUpperCase();
 pctx.save();let fs=10;pctx.font='600 '+fs+'px Orbitron,sans-serif';while(pctx.measureText(legend).width>cssW-22&&fs>7){fs-=0.5;pctx.font='600 '+fs+'px Orbitron,sans-serif';}
 pctx.globalAlpha=1;pctx.fillStyle='rgba(6,12,24,0.62)';pctx.fillRect(0,cssH-21,cssW,21);
 pctx.globalAlpha=0.92;pctx.fillStyle='#bfe8ff';pctx.textAlign='center';pctx.textBaseline='middle';pctx.fillText(legend,cssW/2,cssH-10);pctx.restore();
 // top-left label
 pctx.save();pctx.globalAlpha=0.55;pctx.fillStyle='#9fb4d6';pctx.font='600 9px Orbitron,sans-serif';pctx.textAlign='left';pctx.textBaseline='alphabetic';pctx.fillText('LIVE PREVIEW',10,15);pctx.restore();
}
function openCaptain(){
 hideAllScreens();state='captain';
 var xp=captainTotalXP();var info=captainLevelInfo(xp);var rk=captainRank(info.level);
 var runs=Math.max((typeof runArchive!=='undefined'?runArchive.length:0),(typeof NET!=='undefined'&&NET.gamesPlayed)||0);
 var curIdx=0;for(var i=0;i<CAP_TIERS.length;i++){if(info.level>=CAP_TIERS[i].lv)curIdx=i;}
 var ladder='';
 for(var j=0;j<CAP_TIERS.length;j++){
  var t=CAP_TIERS[j];var tr=captainRank(t.lv);
  var cls=j<curIdx?'cap-tier done':(j===curIdx?'cap-tier on':'cap-tier');
  var right=info.level>=t.lv?('<span class="tl">Lv '+t.lv+'</span>'):('<span class="lock">Lv '+t.lv+'</span>');
  ladder+='<div class="'+cls+'" style="--tc:'+tr.c1+'"><span class="tnum">'+(j+1)+'</span><span class="dot"></span><span class="tn">'+t.name+'</span>'+right+'</div>';
 }
 var nextLine;
 if(curIdx>=CAP_TIERS.length-1){nextLine='APEX RANK ACHIEVED';}
 else{var nt=CAP_TIERS[curIdx+1];var dl=Math.max(1,nt.lv-info.level);nextLine='&#9656; '+dl+' LEVEL'+(dl===1?'':'S')+' TO '+nt.name;}
 var barRight,nextRow;
 if(info.max){barRight='MAX';nextRow='<div class="cap-next cap-max">Maximum Depth Reached</div>';}
 else{barRight=fmtN(info.into)+' / '+fmtN(info.need)+' XP';nextRow='<div class="cap-next"><b>'+fmtN(Math.max(0,info.need-info.into))+'</b> XP to Level '+(info.level+1)+'</div>';}
 var body=''+
  '<div class="cap-emblem"><div class="cap-halo"></div>'+
   '<div class="cap-ring"></div><div class="cap-ring r2"></div><div class="cap-ring r3"></div>'+
   '<div class="cap-core"><div class="cap-lvlnum">'+info.level+'</div><div class="cap-lvllbl">CAPTAIN</div></div></div>'+
  '<div class="cap-rank">'+rk.name+'</div>'+
  '<div class="cap-tierbadge">TIER '+(curIdx+1)+' / '+CAP_TIERS.length+'</div>'+
  '<div class="cap-nextrank">'+nextLine+'</div>'+
  '<div class="cap-barwrap">'+
   '<div class="cap-barlbls"><span class="l">LV '+info.level+'</span><span class="r">'+barRight+'</span></div>'+
   '<div class="cap-bar"><div class="cap-fill" style="width:'+(info.pct*100).toFixed(1)+'%"></div></div>'+
   nextRow+'</div>'+
  '<div class="cap-stats">'+
   '<div class="cap-stat"><div class="v">'+fmtN(info.total)+'</div><div class="k">Lifetime XP</div></div>'+
   '<div class="cap-stat"><div class="v">'+fmtN(runs)+'</div><div class="k">Total Runs</div></div></div>'+
  '<div class="cap-laddertitle">Rank Ladder</div><div class="cap-ladder">'+ladder+'</div>';
 var host=document.getElementById('captainbody');if(host)host.innerHTML=body;
 var scr=document.getElementById('captain');
 if(scr){scr.style.setProperty('--c1',rk.c1);scr.style.setProperty('--c2',rk.c2);scr.style.setProperty('--glow',rk.glow);scr.classList.remove('hidden');try{trDyn(scr);}catch(e){}}
 showNavToggle();
}

function recordRun(result){
 let __snap=null;try{__snap=buildSnapshot();}catch(e){__snap=null;}
 const rec={
  date:Date.now(),result,char:chosenChar.name,
  time:Math.round(time),level:player.level,kills,
  elite:rs?rs.elite:0,boss:rs?rs.boss:0,
  peak:Math.round(rs?rs.peak:0),total:Math.round(rs?rs.dmg:0),taken:Math.round(rs?rs.taken:0),
  gold,corruption:corruption||Math.floor(time/210),
  reacts:rs?Object.assign({},rs.reacts):{},
  build:__snap};
 lastRecord=rec;runArchive.unshift(rec);if(runArchive.length>30)runArchive.length=30;saveRuns();
 NET.gamesPlayed=Math.max((NET.gamesPlayed||0)+1,runArchive.length);
 try{refreshNavHead();}catch(e){}
 try{if(netId())netSync();}catch(e){}
}
function fmtT(s){const m=Math.floor(s/60);return `${m}:${String(Math.floor(s%60)).padStart(2,'0')}`;}
function fmtN(n){return (n||0).toLocaleString();}
function openArchive(){
 state='archive';hideAllScreens();
 document.getElementById('archcount').textContent=`${runArchive.length} recorded descent${runArchive.length===1?'':'s'}`;
 const list=document.getElementById('archlist');list.innerHTML='';
 if(!runArchive.length){list.innerHTML='<div style="color:var(--dim);text-align:center;padding:30px;font-size:14px">No runs yet. Descend to begin your archive.</div>';}
 runArchive.forEach((r,i)=>{const el=document.createElement('div');el.className='archrow';
  const d=new Date(r.date),ds=`${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  el.innerHTML=`<span class="res ${r.result==='Victory'?'win':'loss'}">${r.result==='Victory'?'VICTORY':'FELL'}</span><div class="meta">${r.char} · Lv ${r.level} · ${fmtN(r.kills)} kills<small>${fmtT(r.time)} · ${fmtN(r.total)} total dmg · ${ds}</small></div><span style="color:var(--dim);font-size:18px">›</span>`;
  el.onclick=()=>openDetail(r,'archive');list.appendChild(el);});
 document.getElementById('archive').classList.remove('hidden');try{trDyn(document.getElementById('archive'));}catch(e){}
}
function openDetail(r,back){
 detailBack=back||'archive';state='rundetail';hideAllScreens();
 const b=r.build,d=new Date(r.date);
 const stat=(v,l)=>`<div class="dstat"><div class="v">${v}</div><div class="l">${l}</div></div>`;
 const tags=(arr)=>arr.length?arr.map(x=>`<span class="btag">${x}</span>`).join(''):'<span class="btag" style="color:var(--dim)">none</span>';
 const wtags=b.weapons.map(w=>`<span class="btag">${w.name} <b>${w.evo?'E'+w.evo:'Lv'+w.level}</b>${w.inf&&w.inf.length?' <span style="color:#9bff5c">['+w.inf.join('/')+']</span>':''}</span>`).join('');
 const ptags=b.passives.map(p=>`<span class="btag">${p.name} <b>${p.lv}</b></span>`).join('')||'<span class="btag" style="color:var(--dim)">none</span>';
 document.getElementById('detailwrap').innerHTML=
  `<h4 style="color:${r.result==='Victory'?'#ffd24b':'#ff5a6e'}">RUN ${r.result==='Victory'?'VICTORY':'COMPLETE'}</h4>`+
  `<div class="when">${r.char} · ${d.toLocaleString()}</div>`+
  `<div class="dgrid">`+
   stat(fmtT(r.time),'Duration')+stat(r.level,'Level Reached')+stat(fmtN(r.kills),'Kills')+
   stat(fmtN(r.elite),'Elite Kills')+stat(fmtN(r.boss),'Bosses')+stat(fmtN(r.peak),'Highest DPS')+
   stat(fmtN(r.total),'Total Damage')+stat(fmtN(r.taken),'Damage Taken')+stat(fmtN(r.gold),'Credits')+
   stat(r.corruption,'Corruption')+stat(`<span style="color:${r.result==='Victory'?'#ffd24b':'#ff5a6e'}">${r.result}</span>`,'Result')+
  `</div>`+
  `<div class="bsec"><h5>Weapons</h5>${wtags||'<span class="btag" style="color:var(--dim)">none</span>'}</div>`+
  `<div class="bsec"><h5>Passives</h5>${ptags}</div>`+
  `<div class="bsec"><h5>Relics</h5>${tags(b.relics)}</div>`+
  `<div class="bsec"><h5>Boons</h5>${tags(b.boons)}</div>`+
  `<div class="bsec"><h5>Core Type</h5>${tags(b.cores)}</div>`;
 document.getElementById('rundetail').classList.remove('hidden');try{trDyn(document.getElementById('rundetail'));}catch(e){}
}

