/* ===== FX ===== */
function ring(x,y,maxR,color){if(fx.length<60)fx.push({x,y,r:maxR*0.25,maxR,life:0.35,color});}
const CORRUPT_LINES=['YOU CANT','OXYGEN WARNING','TURN BACK','IT SEES YOU','NO SURFACE','DEPTH ERR0R','SIGNAL EATEN','HULL?? HULL??','THE LIGHT LIES','DO NOT BLINK','PRESSURE 0VERRUN','ASCENT DENIED'];
const GLITCH_CH='#@%&\u2593!?\u25aa';
function spawnText(x,y,val,color,big,glitch){if(texts.length>140)return;texts.push({x,y,val:String(val),color,life:glitch?1.1:0.7,vy:-34,big:!!big,glitch:!!glitch});}
function spawnShards(e){if(shards.length>160)return;const n=(e.boss||e.legendary||e.warden||e.finalboss)?12:(e.elite?9:6);
 let bx,by;const ks=Math.hypot(e.kvx||0,e.kvy||0);
 if(ks>60){bx=e.kvx/ks;by=e.kvy/ks;}else{const dd=Math.hypot(e.x-player.x,e.y-player.y)||1;bx=(e.x-player.x)/dd;by=(e.y-player.y)/dd;}
 const base=Math.atan2(by,bx);
 for(let i=0;i<n;i++){const a=base+rand(-1.2,1.2),s=rand(120,380)+ks*0.5;
  shards.push({x:e.x,y:e.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,rot:rand(0,TAU),vr:rand(-9,9),size:Math.max(3,e.r*rand(0.3,0.55)),life:rand(0.5,0.9),max:0.9,color:e.color});}}
function burst(x,y,color,n0){let n=Math.ceil(n0*QX.particleMul*(particles.length>QX.maxParticles*0.65?0.4:1));if(n<1&&n0>0)n=1;return __burst(x,y,color,n);}
function __burst(x,y,color,n){if(particles.length>=QX.maxParticles)return;if(particles.length>QX.maxParticles*0.75)n=Math.min(n,3);for(let i=0;i<n;i++){const a=Math.random()*TAU,s=rand(40,220);particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(.25,.6),color,r:rand(1.5,3.5)});}}
function toast(msg){const t0=document.getElementById('toast');t0.textContent=t(msg);clearTimeout(toast._t);clearTimeout(toast._h);t0.style.display='block';t0.classList.remove('show');void t0.offsetWidth;t0.classList.add('show');toast._t=setTimeout(()=>{t0.classList.remove('show');toast._h=setTimeout(()=>{t0.style.display='none';},420);},1700);}

