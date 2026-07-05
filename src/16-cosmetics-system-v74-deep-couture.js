/* ===================== COSMETICS SYSTEM (v7.4 "Deep Couture") ===================== */
const COSMETICS={
 palette:[
  {id:'native',  name:'Native Signature', desc:"Each diver's original colors.", body:null,      glow:null,      sw:'#00e5d4'},
  {id:'teal',    name:'Abyssal Teal',      desc:'Deep-current cyan.',            body:'#00e5d4', glow:'#5cf0d0', sw:'#00e5d4'},
  {id:'magma',   name:'Magma Core',        desc:'Molten orange and gold.',       body:'#ff7a3c', glow:'#ffd24b', sw:'#ff7a3c'},
  {id:'void',    name:'Void Violet',       desc:'Singularity purple.',           body:'#9b6dff', glow:'#c46cff', sw:'#9b6dff'},
  {id:'toxic',   name:'Toxic Bloom',       desc:'Irradiated green.',             body:'#9bff5c', glow:'#b6ff3c', sw:'#9bff5c'},
  {id:'plasma',  name:'Plasma Pink',       desc:'Searing magenta.',              body:'#ff5cf0', glow:'#ff9bf0', sw:'#ff5cf0'},
  {id:'gold',    name:'Royal Gold',        desc:'Sovereign gold.',               body:'#ffd24b', glow:'#fff0a0', sw:'#ffd24b'},
  {id:'ice',     name:'Glacier',           desc:'Frozen pale blue.',             body:'#9bd0ff', glow:'#e6f4ff', sw:'#9bd0ff'},
  {id:'blood',   name:'Crimson Tide',      desc:'Arterial red.',                 body:'#ff3b5e', glow:'#ff8a9e', sw:'#ff3b5e'},
  {id:'mono',    name:'Phantom White',     desc:'Pure ghost white.',             body:'#eaf2ff', glow:'#ffffff', sw:'#eaf2ff'},
  {id:'sky',     name:'Electric Sky',      desc:'Lightning blue.',               body:'#5cd0ff', glow:'#bfefff', sw:'#5cd0ff'},
  {id:'ember2',  name:'Sunset Coral',      desc:'Warm coral pink.',              body:'#ff7a9b', glow:'#ffd0a0', sw:'#ff7a9b'},
  {id:'spectrum',name:'Spectrum',          desc:'A slowly shifting rainbow hue.',body:'spectrum',glow:'spectrum',sw:'spectrum'}
 ],
 trail:[
  {id:'native',  name:'Native Wake',  desc:'Per-diver default trail.'},
  {id:'none',    name:'None',         desc:'No trail at all.'},
  {id:'comet',   name:'Comet',        desc:'A long, fading comet tail.',     len:20, w:1.0},
  {id:'ribbon',  name:'Ribbon',       desc:'A smooth, wide flowing ribbon.', len:30, w:1.35},
  {id:'echo',    name:'Echo',         desc:'Afterimages of your hull.',      len:14},
  {id:'bubbles', name:'Bubbles',      desc:'Rising deep-sea bubbles.'},
  {id:'ember',   name:'Embers',       desc:'Trailing sparks of fire.'},
  {id:'wisp',    name:'Neon Wisp',    desc:'Long glowing electric wisp.',    len:26, w:0.8},
  {id:'stardust',name:'Stardust',     desc:'Twinkling particle dust.'},
  {id:'ink',     name:'Ink Cloud',    desc:'A dark spreading smear.',        len:18, w:1.6},
  {id:'plasma',  name:'Plasma Arc',   desc:'A crackling dual-tone ribbon.',  len:24, w:1.1},
  {id:'frostT',  name:'Frost Trail',  desc:'Glittering ice crystals.'}
 ],
 aura:[
  {id:'native', name:'Native Aura',  desc:'Per-diver signature aura.'},
  {id:'none',   name:'None',         desc:'No aura.'},
  {id:'halo',   name:'Halo',         desc:'A soft radiant halo.'},
  {id:'rings',  name:'Orbit Rings',  desc:'Three counter-rotating rings.'},
  {id:'orbs',   name:'Ion Orbit',    desc:'Orbiting energy nodes.'},
  {id:'pulse',  name:'Pulse',        desc:'Expanding sonar pulses.'},
  {id:'runes',  name:'Rune Crown',   desc:'Rotating runic glyphs.'},
  {id:'flame',  name:'Flame Crown',  desc:'A licking corona of fire.'},
  {id:'frost',  name:'Frost Veil',   desc:'A crystalline frost ring.'},
  {id:'vortex', name:'Vortex',       desc:'A swirling particle vortex.'}
 ],
 death:[
  {id:'default',name:'Implosion',     desc:'The signature teal burst.', col:'#00e5d4'},
  {id:'nova',   name:'Supernova',     desc:'A blinding white shockwave.', col:'#ffffff'},
  {id:'void',   name:'Void Collapse', desc:'An inward purple singularity.', col:'#9b6dff'},
  {id:'shatter',name:'Shatter',       desc:'A spray of crystal shards.', col:'#9bd0ff'},
  {id:'bloom',  name:'Spore Bloom',   desc:'A slow toxic cloud.', col:'#9bff5c'},
  {id:'gold',   name:'Gilded End',    desc:'A golden farewell.', col:'#ffd24b'},
  {id:'magmaD', name:'Meltdown',      desc:'A molten eruption.', col:'#ff7a3c'}
 ],
 proj:[
  {id:'default',name:'Native',  desc:'Each weapon keeps its colors.', mode:'native'},
  {id:'neon',   name:'Neon',    desc:'Bright glowing neon rounds.',   mode:'tint', col:'#5cffd0', core:'#ffffff', glow:1.6},
  {id:'bone',   name:'Bone',    desc:'Pale ivory shards.',            mode:'tint', col:'#f2ead6', core:'#fffaf0', glow:0.7},
  {id:'plasma', name:'Plasma',  desc:'Electric pink and blue.',       mode:'duo',  col:'#ff5cf0', col2:'#5cd0ff', core:'#ffffff', glow:1.5},
  {id:'gold',   name:'Gold',    desc:'Molten gold rounds.',           mode:'tint', col:'#ffd24b', core:'#fff4c0', glow:1.3},
  {id:'void',   name:'Void',    desc:'Dark-matter bolts.',            mode:'tint', col:'#9b6dff', core:'#e0c4ff', glow:1.4},
  {id:'ember',  name:'Ember',   desc:'Burning ember rounds.',         mode:'tint', col:'#ff7a3c', core:'#ffd24b', glow:1.4},
  {id:'frost',  name:'Frost',   desc:'Icy crystal shots.',            mode:'tint', col:'#9bd0ff', core:'#ffffff', glow:1.2},
  {id:'rainbow',name:'Spectrum',desc:'Hue-shifting prismatic rounds.',mode:'rainbow',core:'#ffffff',glow:1.4}
 ]
};
let cos={palette:'native',trail:'native',aura:'native',death:'default',proj:'default'};
function cosFind(cat,id){const a=COSMETICS[cat];if(!a)return null;for(const o of a)if(o.id===id)return o;return a[0];}
function saveCos(){try{window.storage.set('abyss_cosmetics',JSON.stringify(cos));}catch(e){}}
(async()=>{try{const r=await window.storage.get('abyss_cosmetics');if(r&&r.value){const o=JSON.parse(r.value);if(o&&typeof o==='object')cos=Object.assign(cos,o);}}catch(e){}})();
function spectrumCol(off){const h=((time*42+off)%360+360)%360;return 'hsl('+h.toFixed(0)+',92%,62%)';}
function cosBody(p){const pa=cosFind('palette',cos.palette);if(!pa||pa.body==null)return null;if(pa.body==='spectrum')return spectrumCol(0);return pa.body;}
function cosGlow(p){const pa=cosFind('palette',cos.palette);if(!pa||pa.glow==null)return null;if(pa.glow==='spectrum')return spectrumCol(45);return pa.glow;}

/* ---- universal cosmetic TRAIL (longer + fancier, works on every diver) ---- */
function drawCosTrail(p){
 const id=cos.trail;if(id==='none')return;
 if(!p._ct)p._ct=[];
 const sp=Math.hypot(p.pvx,p.pvy),moving=sp>36;
 const last=p._ct[0];
 if(moving&&(!last||((p.x-last.x)*(p.x-last.x)+(p.y-last.y)*(p.y-last.y))>14))p._ct.unshift({x:p.x,y:p.y,t:time});
 const tdef=cosFind('trail',id),maxLen=(tdef&&tdef.len)||16;
 while(p._ct.length>maxLen)p._ct.pop();
 const bc=cosBody(p)||p.color||p.char.color,gc=cosGlow(p)||bc,glow=(QX&&QX.glow);
 const partCap=(OPT&&OPT.quality==='potato')?120:(OPT&&OPT.quality==='low'?240:340);
 ctx.save();
 if(id==='comet'||id==='ribbon'||id==='wisp'||id==='plasma'||id==='ink'){
  if(p._ct.length>=2){const col=(id==='ink')?'#160c28':bc,wmul=(tdef&&tdef.w)||1;
   for(let i=0;i<p._ct.length-1;i++){const a=p._ct[i],b=p._ct[i+1],f=1-i/p._ct.length;
    ctx.globalAlpha=f*(id==='wisp'?0.5:(id==='ink'?0.5:0.42));
    ctx.strokeStyle=(id==='plasma'&&(i&1))?gc:col;
    if(glow&&id!=='ink'){ctx.shadowColor=gc;ctx.shadowBlur=12*f;}
    ctx.lineWidth=Math.max(0.4,p.r*1.5*f*wmul);ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
   if(id==='wisp'||id==='plasma'){ctx.globalAlpha=0.9;ctx.fillStyle='#ffffff';if(glow){ctx.shadowColor=gc;ctx.shadowBlur=8;}ctx.beginPath();ctx.arc(p._ct[0].x,p._ct[0].y,Math.max(1,p.r*0.4),0,TAU);ctx.fill();}}
 }else if(id==='echo'){
  for(let i=0;i<p._ct.length;i++){const g=p._ct[i],aa=(1-i/p._ct.length)*0.3;ctx.globalAlpha=aa;ctx.fillStyle=bc;if(glow){ctx.shadowColor=gc;ctx.shadowBlur=8;}ctx.beginPath();ctx.arc(g.x,g.y,Math.max(1,p.r*(1-i*0.045)),0,TAU);ctx.fill();}
 }else if(id==='bubbles'){
  if(moving&&particles.length<partCap&&Math.random()<0.45)particles.push({x:p.x+rand(-p.r,p.r),y:p.y+rand(-p.r,p.r),vx:rand(-8,8),vy:rand(-34,-12),life:1.2,color:gc,r:rand(1.4,3.4)});
 }else if(id==='ember'){
  if(moving&&particles.length<partCap&&Math.random()<0.5)particles.push({x:p.x+rand(-p.r,p.r),y:p.y+rand(-p.r,p.r),vx:rand(-22,22),vy:rand(10,42),life:0.6,color:Math.random()<0.5?bc:gc,r:rand(1.4,3)});
 }else if(id==='stardust'){
  if(moving&&particles.length<partCap&&Math.random()<0.5)particles.push({x:p.x+rand(-p.r*1.3,p.r*1.3),y:p.y+rand(-p.r*1.3,p.r*1.3),vx:rand(-12,12),vy:rand(-12,12),life:0.9,color:Math.random()<0.5?'#ffffff':gc,r:rand(1,2.4)});
 }else if(id==='frostT'){
  if(moving&&particles.length<partCap&&Math.random()<0.45)particles.push({x:p.x+rand(-p.r,p.r),y:p.y+rand(-p.r,p.r),vx:rand(-14,14),vy:rand(-10,26),life:0.8,color:Math.random()<0.5?'#bfeaff':'#e6f4ff',r:rand(1.2,2.6)});
 }
 ctx.restore();
}

/* ---- universal cosmetic AURA ---- */
function drawCosAura(p){
 const id=cos.aura;if(id==='none')return;
 const bc=cosBody(p)||p.color||p.char.color,gc=cosGlow(p)||bc,t=time,glow=(QX&&QX.glow);
 const partCap=(OPT&&OPT.quality==='potato')?120:340;
 ctx.save();
 if(id==='halo'){const g=ctx.createRadialGradient(p.x,p.y,Math.max(0.1,p.r*0.5),p.x,p.y,p.r+22);g.addColorStop(0,hexA(gc,0));g.addColorStop(0.62,hexA(gc,0.14));g.addColorStop(1,hexA(gc,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r+22,0,TAU);ctx.fill();ctx.globalAlpha=0.42;ctx.strokeStyle=gc;if(glow){ctx.shadowColor=gc;ctx.shadowBlur=12;}ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,p.r+10+2*Math.sin(t*3),0,TAU);ctx.stroke();}
 else if(id==='rings'){for(let i=0;i<3;i++){const a=t*(0.6+i*0.22)*((i&1)?-1:1);ctx.globalAlpha=0.42-i*0.09;ctx.strokeStyle=gc;if(glow){ctx.shadowColor=gc;ctx.shadowBlur=8;}ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,p.r+9+i*7,a,a+TAU*0.7);ctx.stroke();}}
 else if(id==='orbs'){for(let i=0;i<5;i++){const a=t*1.2+i/5*TAU;ctx.globalAlpha=0.85;ctx.fillStyle=(i&1)?gc:bc;if(glow){ctx.shadowColor=gc;ctx.shadowBlur=10;}ctx.beginPath();ctx.arc(p.x+Math.cos(a)*(p.r+16),p.y+Math.sin(a)*(p.r+16),2.6,0,TAU);ctx.fill();}}
 else if(id==='pulse'){for(let k=0;k<2;k++){const ph=((t*1.5)+k*0.5)%1;ctx.globalAlpha=(1-ph)*0.5;ctx.strokeStyle=gc;if(glow){ctx.shadowColor=gc;ctx.shadowBlur=10;}ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(p.x,p.y,p.r+ph*30,0,TAU);ctx.stroke();}}
 else if(id==='runes'){ctx.globalAlpha=0.6;ctx.strokeStyle=gc;if(glow){ctx.shadowColor=gc;ctx.shadowBlur=8;}ctx.lineWidth=2;const a0=t*0.7;for(let i=0;i<6;i++){const a=a0+i/6*TAU,ox=p.x+Math.cos(a)*(p.r+16),oy=p.y+Math.sin(a)*(p.r+16);ctx.beginPath();for(let k=0;k<3;k++){const ha=k/3*TAU+a*2,hx=ox+Math.cos(ha)*4,hy=oy+Math.sin(ha)*4;k?ctx.lineTo(hx,hy):ctx.moveTo(hx,hy);}ctx.closePath();ctx.stroke();}}
 else if(id==='flame'){if(particles.length<partCap&&Math.random()<0.55){const a=Math.random()*TAU;particles.push({x:p.x+Math.cos(a)*p.r,y:p.y+Math.sin(a)*p.r,vx:Math.cos(a)*10,vy:-20-Math.random()*22,life:0.5,color:Math.random()<0.5?'#ff7a3c':'#ffd24b',r:rand(1.5,3)});}ctx.globalAlpha=0.4;ctx.strokeStyle='#ff9b4b';if(glow){ctx.shadowColor='#ff7a3c';ctx.shadowBlur=12;}ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,p.r+8+2*Math.sin(t*8),0,TAU);ctx.stroke();}
 else if(id==='frost'){ctx.globalAlpha=0.5;ctx.strokeStyle='#bfeaff';if(glow){ctx.shadowColor='#9bd0ff';ctx.shadowBlur=10;}ctx.lineWidth=1.6;const a0=t*0.4;for(let i=0;i<8;i++){const a=a0+i/8*TAU;ctx.beginPath();ctx.moveTo(p.x+Math.cos(a)*(p.r+6),p.y+Math.sin(a)*(p.r+6));ctx.lineTo(p.x+Math.cos(a)*(p.r+15),p.y+Math.sin(a)*(p.r+15));ctx.stroke();}ctx.globalAlpha=0.3;ctx.beginPath();ctx.arc(p.x,p.y,p.r+11,0,TAU);ctx.stroke();}
 else if(id==='vortex'){if(particles.length<partCap&&Math.random()<0.6){const a=Math.random()*TAU,rr=p.r+24;particles.push({x:p.x+Math.cos(a)*rr,y:p.y+Math.sin(a)*rr,vx:Math.cos(a+1.4)*60,vy:Math.sin(a+1.4)*60,life:0.5,color:Math.random()<0.5?bc:gc,r:rand(1.4,2.6)});}ctx.globalAlpha=0.3;ctx.strokeStyle=gc;if(glow){ctx.shadowColor=gc;ctx.shadowBlur=8;}ctx.lineWidth=1.6;for(let i=0;i<2;i++){const a=t*2*((i&1)?-1:1);ctx.beginPath();ctx.arc(p.x,p.y,p.r+12+i*5,a,a+TAU*0.8);ctx.stroke();}}
 ctx.restore();
}

/* ---- projectile skin lookup (used in the player projectile draw loop) ---- */
function projSkin(){return cosFind('proj',cos.proj);}
function projSkinCol(p,base){const s=projSkin();if(!s||s.mode==='native')return null;if(s.mode==='duo'){if(p._sd==null)p._sd=Math.random();return p._sd<0.5?s.col:s.col2;}if(s.mode==='rainbow'){if(p._sh==null)p._sh=Math.random()*360;return 'hsl('+(((time*120+p._sh)%360+360)%360).toFixed(0)+',95%,62%)';}return s.col;}

/* ---- cosmetic death effect ---- */
function cosDeathFx(){
 const d=cosFind('death',cos.death)||{id:'default',col:'#00e5d4'},c=d.col,x=player.x,y=player.y;
 const cap=(OPT&&OPT.quality==='potato')?18:60;
 if(d.id==='nova'){burst(x,y,'#ffffff',cap);ring(x,y,player.r+120,'#ffffff');ring(x,y,player.r+210,c);for(let i=0;i<Math.min(28,cap);i++){const a=i/28*TAU;particles.push({x,y,vx:Math.cos(a)*420,vy:Math.sin(a)*420,life:0.6,color:'#ffffff',r:3});}}
 else if(d.id==='void'){burst(x,y,c,cap);ring(x,y,player.r+170,c);for(let i=0;i<Math.min(30,cap);i++){const a=Math.random()*TAU,rr=190;particles.push({x:x+Math.cos(a)*rr,y:y+Math.sin(a)*rr,vx:-Math.cos(a)*320,vy:-Math.sin(a)*320,life:0.7,color:c,r:rand(2,4)});}}
 else if(d.id==='shatter'){burst(x,y,c,Math.min(30,cap));for(let i=0;i<Math.min(20,cap);i++){const a=i/20*TAU,sp=rand(180,360);particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:0.8,color:Math.random()<0.5?c:'#ffffff',r:rand(2,4)});}ring(x,y,player.r+70,'#ffffff');}
 else if(d.id==='bloom'){burst(x,y,c,cap);ring(x,y,player.r+90,c);ring(x,y,player.r+150,'#6cffb0');for(let i=0;i<Math.min(22,cap);i++){const a=Math.random()*TAU;particles.push({x,y,vx:Math.cos(a)*rand(60,190),vy:Math.sin(a)*rand(60,190),life:1.4,color:c,r:rand(3,6)});}}
 else if(d.id==='gold'){burst(x,y,c,cap);ring(x,y,player.r+110,c);ring(x,y,player.r+180,'#fff0a0');for(let i=0;i<Math.min(20,cap);i++){const a=i/20*TAU;particles.push({x,y,vx:Math.cos(a)*360,vy:Math.sin(a)*360,life:0.7,color:Math.random()<0.5?c:'#fff0a0',r:3});}}
 else if(d.id==='magmaD'){burst(x,y,c,cap);ring(x,y,player.r+90,c);ring(x,y,player.r+150,'#ffd24b');for(let i=0;i<Math.min(24,cap);i++){const a=Math.random()*TAU;particles.push({x,y,vx:Math.cos(a)*rand(80,260),vy:Math.sin(a)*rand(80,260)-60,life:1.0,color:Math.random()<0.5?'#ff7a3c':'#ffd24b',r:rand(2,5)});}}
 else {burst(x,y,c,cap);ring(x,y,player.r+90,c);ring(x,y,player.r+150,'#5cf0d0');}
}

function hexA(c,al){al=isFinite(al)?Math.max(0,Math.min(1,al)):1;if(typeof c==='string'){var h=c.trim();if(h.charAt(0)==='#'){if(h.length===4)h='#'+h.charAt(1)+h.charAt(1)+h.charAt(2)+h.charAt(2)+h.charAt(3)+h.charAt(3);if(h.length>=7){var r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);if(isFinite(r)&&isFinite(g)&&isFinite(b))return 'rgba('+r+','+g+','+b+','+al+')';}}else if(h.indexOf('hsl')===0){var hi=h.replace(/hsla?\(|\)/g,'').split(',').slice(0,3).join(',');return 'hsla('+hi+','+al+')';}else if(h.indexOf('rgb')===0){var nums=h.replace(/rgba?\(|\)/g,'').split(',').map(function(s){return parseFloat(s);});if(nums.length>=3&&isFinite(nums[0])&&isFinite(nums[1])&&isFinite(nums[2]))return 'rgba('+nums[0]+','+nums[1]+','+nums[2]+','+al+')';}}return 'rgba(155,109,255,'+al+')';}
function drawZones(){
 for(const z of zones){if(z._dead)continue;const a=Math.min(1,z.life/Math.max(0.5,z.maxlife*0.4));ctx.save();
  const col=z.color||'#9bff5c';
  if(z.type==='void'||z.type==='magnetize'){const g=ctx.createRadialGradient(z.x,z.y,2,z.x,z.y,z.r);g.addColorStop(0,'rgba(20,0,40,'+(0.5*a)+')');g.addColorStop(0.6,hexA(col,0.3*a));g.addColorStop(1,'rgba(10,0,25,0)');ctx.fillStyle=g;ctx.globalAlpha=1;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,TAU);ctx.fill();
   ctx.globalAlpha=0.5*a;ctx.strokeStyle=col;if(QX&&QX.glow){ctx.shadowColor=col;ctx.shadowBlur=14;}ctx.lineWidth=2;const sp=time*(z.type==='magnetize'?3:-2);for(let k=0;k<3;k++){const rr=z.r*(0.4+k*0.3);ctx.beginPath();ctx.arc(z.x,z.y,rr,sp+k,sp+k+TAU*0.7);ctx.stroke();}}
  else{const g=ctx.createRadialGradient(z.x,z.y,z.r*0.2,z.x,z.y,z.r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');ctx.globalAlpha=(z.type==='frostground'?0.32:0.42)*a;ctx.fillStyle=g;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,TAU);ctx.fill();
   if(QX&&QX.glow){ctx.globalAlpha=0.3*a;ctx.strokeStyle=col;ctx.shadowColor=col;ctx.shadowBlur=10;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(z.x,z.y,z.r*(0.7+0.3*Math.sin(time*3)),0,TAU);ctx.stroke();}}
  ctx.restore();}
}
function tryReact(e,a,b,bKey){const key=[a,b].sort().join('|'),__k=key;if(rs){rs.reacts=rs.reacts||{};rs.reacts[__k]=(rs.reacts[__k]||0)+1;}if(feedReactT<=0){feedReactT=0.9;const __RN={'fire|ice':'THERMAL SHOCK','fire|toxic':'COMBUSTION','lightning|toxic':'CHAIN STORM','lightning|plasma':'OVERLOAD','fire|void':'ENTROPY','radiation|toxic':'MUTATION','ice|lightning':'SUPERCONDUCT','ice|void':'ABSOLUTE ZERO','fire|lightning':'SWIRL','kinetic|void':'CRYSTALLIZE','plasma|toxic':'BLOOM','ice|toxic':'CORROSIVE MIST','lightning|void':'MAGNETIZE','fire|radiation':'IRRADIATE'};if(__RN[__k])pushFeed(__RN[__k],'#9bff5c');}const _nowR=performance.now();if(_nowR>=_reactFbT){_reactFbT=_nowR+120;sfx('react');screenShake=Math.max(screenShake,3.5);let _grp=0;for(const _n of queryNear(e.x,e.y,90)){if(!_n._dead)_grp++;if(_grp>=4)break;}if(_grp>=4)hapPop();}const __unused=0,dm=player.damageMult*(player.reactAmp||1)*1.6,partner=eSt(e)[bKey],used=Math.max(1,partner.n*0.45);
 const R={
 'fire|ice':()=>{const fr=(e.frozenT>0||(e.st&&e.st.chill&&e.st.chill.n>=8));const R0=fr?70:50;dealDamage(e,(14+6*used)*dm*(fr?1.6:1));ring(e.x,e.y,R0,'#bfeaff');ring(e.x,e.y,R0*0.6,'#fff');radialImpulse(e.x,e.y,R0+30,fr?1200:700);if(e.frozenT>0)e.frozenT=0;burst(e.x,e.y,'#bfeaff',fr?18:8);spawnText(e.x,e.y-e.r-16,fr?'SHATTER':'THERMAL SHOCK','#bfeaff',true);},
 'fire|toxic':()=>{ring(e.x,e.y,95,'#ff7a3c');for(const x of queryNear(e.x,e.y,95)){if(x._dead)continue;dealDamage(x,(10+3*used)*dm,{tick:x!==e});addSt(x,'burn',4);}addZone({type:'firepool',x:e.x,y:e.y,r:78,life:4.5,el:'fire',elAmt:3,dps:(10+player.level*0.7)*dm,color:'#ff7a3c'});spawnText(e.x,e.y-e.r-16,'COMBUSTION','#ff7a3c',true);},
 'lightning|toxic':()=>{let from={x:e.x,y:e.y};const seen=new Set([e]);for(let j=0;j<6;j++){const c=nearestEnemy(from.x,from.y,300,seen);if(!c)break;arcs.push({x1:from.x,y1:from.y,x2:c.x,y2:c.y,life:0.18,color:'#ffe27a'});dealDamage(c,(12+3*used)*dm);seen.add(c);from={x:c.x,y:c.y};}addZone({type:'conductive',x:e.x,y:e.y,r:96,life:4,el:'lightning',elAmt:2,color:'#5cd0ff'});spawnText(e.x,e.y-e.r-16,'CHAIN STORM','#ffe27a',true);},
 'lightning|plasma':()=>{ring(e.x,e.y,100,'#ff5cf0');for(const x of queryNear(e.x,e.y,100)){if(x._dead)continue;dealDamage(x,(12+4*used)*dm,{tick:x!==e});addSt(x,'shock',5);if(!isBig(x))x.stunT=Math.max(x.stunT||0,0.4);}radialImpulse(e.x,e.y,100,650);spawnText(e.x,e.y-e.r-16,'OVERLOAD','#ff5cf0',true);},
 'fire|void':()=>{const s=eSt(e),o=s.burn||(s.burn={n:0,t:4});o.n=Math.min(600,o.n*1.6+10);o.t=5;addZone({type:'void',x:e.x,y:e.y,r:120,life:3.2,pull:520,color:'#b8a3ff'});spawnText(e.x,e.y-e.r-16,'ENTROPY','#b8a3ff',true);},
 'radiation|toxic':()=>{if(!e.mut){e.mut=true;e.hp=Math.min(e.maxhp*1.3,e.hp*1.3);e.maxhp*=1.3;e.dmg*=1.2;e.speed*=1.1;}ring(e.x,e.y,140,'#b6ff3c');for(const x of queryNear(e.x,e.y,150)){if(x._dead||isBig(x)||x===e)continue;x.fearT=Math.max(x.fearT||0,1.4);}spawnText(e.x,e.y-e.r-16,'MUTATION','#b6ff3c',true);},
 'ice|lightning':()=>{e.vulnT=5;addZone({type:'frostground',x:e.x,y:e.y,r:104,life:5,slow:7,color:'#7fdfff'});spawnText(e.x,e.y-e.r-16,'SUPERCONDUCT','#7fdfff',true);},
 'ice|void':()=>{if(isBig(e)){e.stunT=Math.max(e.stunT||0,0.7);}else{e.frozenT=Math.max(e.frozenT||0,1.1);e.stunT=Math.max(e.stunT||0,1.1);ring(e.x,e.y,e.r+18,'#bfeaff');}spawnText(e.x,e.y-e.r-16,'ABSOLUTE ZERO','#bfeaff',true);},
 'fire|lightning':()=>{ring(e.x,e.y,120,'#ffd24b');const src=eSt(e);let best=null,bn=0;for(const k in src){if(src[k].n>bn){bn=src[k].n;best=k;}}for(const x of queryNear(e.x,e.y,120)){if(x._dead||x===e)continue;dealDamage(x,(8+2*used)*dm,{tick:true});if(best&&STEL[best])addSt(x,best,Math.max(2,Math.ceil(bn*0.5)));}burst(e.x,e.y,'#ffd24b',10);spawnText(e.x,e.y-e.r-16,'SWIRL','#ffd24b',true);},
 'kinetic|void':()=>{dealDamage(e,(10+4*used)*dm);drops.push({type:'shard',x:e.x,y:e.y,r:9,vx:rand(-40,40),vy:rand(-40,40)});ring(e.x,e.y,40,'#9bd0ff');spawnText(e.x,e.y-e.r-16,'CRYSTALLIZE','#9bd0ff',true);},
 'plasma|toxic':()=>{const _scap=OPT.quality==='potato'?0:(OPT.quality==='low'?6:14);if(seeds.length<_scap)seeds.push({x:e.x,y:e.y,t:1.5,r:10,dmg:(40+player.level*2.5)*dm});ring(e.x,e.y,36,'#6cffb0');spawnText(e.x,e.y-e.r-16,'BLOOM','#6cffb0',true);},
 'ice|toxic':()=>{addZone({type:'mist',x:e.x,y:e.y,r:110,life:5.5,el:'toxic',elAmt:4,dps:(6+player.level*0.5)*dm,slow:3,color:'#9bff5c'});spawnText(e.x,e.y-e.r-16,'CORROSIVE MIST','#9bff5c',true);},
 'lightning|void':()=>{addZone({type:'magnetize',x:e.x,y:e.y,r:150,life:2.6,pull:760,color:'#7b9bff'});for(const x of queryNear(e.x,e.y,150)){if(x._dead)continue;dealDamage(x,(6+2*used)*dm,{tick:true});addSt(x,'shock',2);}spawnText(e.x,e.y-e.r-16,'MAGNETIZE','#7b9bff',true);},
 'fire|radiation':()=>{addZone({type:'radioactive',x:e.x,y:e.y,r:115,life:5,el:'radiation',elAmt:3,dps:(8+player.level*0.6)*dm,dmgAmp:true,color:'#b6ff3c'});spawnText(e.x,e.y-e.r-16,'IRRADIATE','#b6ff3c',true);}}[key];
 if(!R)return false;e.reactCd=0.8;R();if(player.reactShield>0){const _now=performance.now();if(_now>=(player._rsT||0)){player._rsT=_now+220;if(player.esMax>0)player.es=Math.min(player.esMax,(player.es||0)+player.reactShield);else player.hp=Math.min(player.maxHp,player.hp+player.reactShield);}}partner.n-=used;if(partner.n<1)delete eSt(e)[bKey];return true;}
/* legacy wrappers used inside weapon defs */
function applyBurn(e,dps,t){addSt(e,'burn',Math.max(1,dps/4));}
function applyBleed(e,dps,t){addSt(e,'bleed',Math.max(1,dps/2.2));}
function applyPoison(e,dps,t){addSt(e,'corr',Math.max(1,dps/2));}
function applySlow(e,mult,t){addSt(e,'chill',Math.round((1-mult)*20));}

