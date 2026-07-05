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
function loop(now){requestAnimationFrame(loop);const dt=Math.min((now-lastT)/1000,0.05);lastT=now;
 try{if(state==='playing')update(dt);}
 catch(err){console.error('ABYSS update error:',err);sanitizeState();if(!window._abyssErr){window._abyssErr=true;try{toast('GLITCH CONTAINED. RUN CONTINUES');}catch(e3){}}}
 try{if(player)render();}
 catch(err){console.error('ABYSS render error:',err);sanitizeState();}
 try{if(state==='menu'||state==='profile'||state==='credits'||state==='codex')menuFX(dt);}catch(err){}
 try{if(state==='cosmetics')cosPreviewTick(dt);}catch(err){}
 try{if(state==='social')socialFXTick(dt);}catch(err){}}
requestAnimationFrame(loop);

