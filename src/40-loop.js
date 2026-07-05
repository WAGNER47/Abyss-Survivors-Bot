/* ===== LOOP ===== */
let lastT=performance.now();
function sanitizeState(){try{
 if(player){if(!isFinite(player.hp))player.hp=player.maxHp*0.5;if(!isFinite(player.es))player.es=0;
  if(!isFinite(player.x)||!isFinite(player.y)){player.x=0;player.y=0;}
  if(!isFinite(player.pvx))player.pvx=0;if(!isFinite(player.pvy))player.pvy=0;}
 const fix=a=>{if(!a)return;for(let i=a.length-1;i>=0;i--){const o=a[i];if(!o||!isFinite(o.x)||!isFinite(o.y)||(o.r!=null&&(!isFinite(o.r)||o.r<0)))a.splice(i,1);}};
 fix(enemies);fix(orbs);fix(drops);fix(pjs);fix(epjs);fix(shards);fix(hazards);fix(particles);fix(chests);fix(zones);fix(seeds);
 const tcap=(typeof DMGNUM!=='undefined'&&DMGNUM==='diablo')?260:140;if(texts&&texts.length>tcap)texts.length=tcap;if(epjs&&epjs.length>500)epjs.length=500;if(arcs&&arcs.length>120)arcs.length=120;
}catch(e2){}}
let _f30last=0;
// FPS counter chip: tiny fixed DOM readout (top-left, under the safe area). DOM beats canvas
// here - it works in every state (menu, dive, screens) and costs nothing when hidden.
let _fpsChip=null,_fpsCf=0,_fpsCt=0;
function fpsChipEl(){if(_fpsChip)return _fpsChip;try{const d=document.createElement('div');d.id='fpschip';d.style.cssText='position:fixed;top:calc(env(safe-area-inset-top,0px) + 8px);left:8px;z-index:99999;font:600 10px Rajdhani,monospace;letter-spacing:.08em;color:#6cffb0;background:rgba(6,12,24,0.55);padding:2px 6px;border-radius:4px;pointer-events:none;display:none;text-shadow:0 0 6px rgba(0,0,0,0.8)';document.body.appendChild(d);_fpsChip=d;}catch(e){}return _fpsChip;}
function fpsChipTick(dt){const el=fpsChipEl();if(!el)return;if(!OPT.fps){if(el.style.display!=='none')el.style.display='none';return;}
 _fpsCf++;_fpsCt+=dt;
 if(_fpsCt>=0.5){const f=Math.round(_fpsCf/_fpsCt);_fpsCf=0;_fpsCt=0;
  el.style.display='block';el.textContent=f+' FPS';
  el.style.color=f>=50?'#6cffb0':(f>=30?'#ffd24b':'#ff5a6e');}}
function loop(now){requestAnimationFrame(loop);
 // V9 PERF: frame governor. On the lowest tiers a locked 30fps is smoother than a
 // stuttering 40-50 and roughly halves heat. Skipped frames cost nothing at all.
 if(QX.fps30&&now-_f30last<31)return;_f30last=now;
 const dt=Math.min((now-lastT)/1000,0.05);lastT=now;
 try{fpsChipTick(dt);}catch(e){}
 try{if(state==='playing')update(dt);}
 catch(err){console.error('ABYSS update error:',err);sanitizeState();if(!window._abyssErr){window._abyssErr=true;try{toast('GLITCH CONTAINED. RUN CONTINUES');}catch(e3){}}}
 try{if(player)render();}
 catch(err){console.error('ABYSS render error:',err);sanitizeState();}
 try{if(state==='menu'||state==='profile'||state==='credits'||state==='codex')menuFX(dt);}catch(err){}
 try{if(state==='cosmetics')cosPreviewTick(dt);}catch(err){}
 try{if(state==='social')socialFXTick(dt);}catch(err){}}
requestAnimationFrame(loop);

