/* ===== end i18n ===== */

function tgShareText(){try{const d=Math.floor(time*8).toLocaleString();return 'ABYSS // SURVIVORS \u00b7 '+(player&&player.char?player.char.name:'Diver')+' \u00b7 LV '+(player?player.level:0)+' \u00b7 '+d+'m deep \u00b7 '+kills+' kills \u00b7 by @'+(TG_USER.username||TG_USER.first_name||'survivor');}catch(e){return 'ABYSS // SURVIVORS';}}
function tgShowShare(){try{if(TG)TG.MainButton.show();}catch(e){}}
// ---- DIVE NETWORK: presence + friends relay ----
let NET={online:false,friends:[],inbox:0,lastSync:0,gamesPlayed:0,stats:null,fcache:{}};
let _sfx={t:0};
// Merge runs the server returns into the local archive (server is the durable source of truth).
// Dedup by date; keep local copies (which carry the full build snapshot) when a run exists on both sides.
function mergeServerRuns(sr){try{if(!Array.isArray(sr)||!sr.length)return false;const byDate={};for(const r of (runArchive||[]))if(r&&r.date!=null)byDate[r.date]=r;let added=false;for(const r of sr){if(!r||r.date==null)continue;if(!byDate[r.date]){byDate[r.date]=r;added=true;}}if(!added)return false;runArchive=Object.values(byDate).sort((a,b)=>(b.date||0)-(a.date||0)).slice(0,30);saveRuns();return true;}catch(e){return false;}}
function netId(){return TG_USER&&TG_USER.id!=='guest'?String(TG_USER.id):'';}
async function netSync(){const id=netId();if(!id)return;
 try{const s=computeStats();let _cxp=0,_clv=1;try{_cxp=captainTotalXP();_clv=captainLevelInfo(_cxp).level;}catch(e){}const r=await fetch('/api/social?action=sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,name:profName,username:TG_USER.username||'',photo:TG_USER.photo||'',about:'',stats:{level:s.highLevel,wins:s.wins,kills:s.kills,best:s.bestTime,total:s.total,timeIn:s.timeIn,gold:s.gold,maxCorr:s.maxCorr,main:s.main,mainRuns:s.mainRuns,axes:s.axes,favEl:s.favEl,favRe:s.favRe,favGear:s.favGear,perDiver:s.perDiver,cap:_clv,capXp:_cxp},runs:(runArchive||[]).slice(0,8).map(r=>({date:r.date,result:r.result,char:r.char,time:r.time,level:r.level,kills:r.kills,corruption:r.corruption,gold:r.gold,peak:r.peak,total:r.total,taken:r.taken,reacts:r.reacts||{},build:r.build||null}))})});
  const j=await r.json();if(j&&j.ok){NET.online=true;NET.friends=j.friends||[];const wasInbox=NET.inbox;NET.inbox=j.inboxCount||0;NET.lastSync=Date.now();
   // Durable stats: the server holds the real games-played count (Redis, survives relaunches).
   if(j.stats){NET.stats=j.stats;if(typeof j.stats.total==='number')NET.gamesPlayed=Math.max(NET.gamesPlayed||0,j.stats.total|0);}
   const changed=mergeServerRuns(j.runs);
   try{refreshNavHead();}catch(e){}
   try{if(state==='menu')refreshMenuChip();}catch(e){}
   if(state==='captain'){try{openCaptain();}catch(e){}}
   if(state==='social'){try{const ft=document.getElementById('friendgrid');if(ft)hydrateFriends();}catch(e){}}
   if((changed)&&state==='profile'){const ae=document.activeElement;if(!ae||ae.id!=='pname')openProfile();}
   if(NET.inbox>wasInbox)toast('NEW FRIEND REQUEST \u00b7 check Social');updateSocialBadge();}
  else NET.online=false;
 }catch(e){NET.online=false;}}
function updateSocialBadge(){try{const b=document.getElementById('socialbtn');if(b){const base='\u21c4 Social';b.textContent=NET.inbox>0?base+' ('+NET.inbox+')':base;}}catch(e){}}
setInterval(()=>{if(netId())netSync();},45000);
// Keep presence + runs fresh: sync the moment the app regains focus / becomes visible.
try{document.addEventListener('visibilitychange',()=>{if(!document.hidden&&netId()&&Date.now()-NET.lastSync>8000){netSync();if(state==='social')hydrateFriends();}});}catch(e){}
try{window.addEventListener('focus',()=>{if(netId()&&Date.now()-NET.lastSync>8000)netSync();});}catch(e){}
setTimeout(()=>{if(netId())netSync();},2500);
setTimeout(()=>{try{refreshMenuChip();}catch(e){}},500);
setTimeout(()=>{try{refreshMenuChip();}catch(e){}},1800);
function tgHideShare(){try{if(TG)TG.MainButton.hide();}catch(e){}}
let profName='SURVIVOR',profColor='',profShape='orb',profLogo='⌖';
let FRIENDS=[];
(async()=>{try{const r=await window.storage.get('abyss_friends');if(r&&r.value)FRIENDS=JSON.parse(r.value)||[];}catch(e){}})();
function saveFriends(){try{window.storage.set('abyss_friends',JSON.stringify(FRIENDS.slice(0,60)));}catch(e){}}
// TELEGRAM MINI APP: Telegram identity replaces the hardcoded default name (stored custom name still wins)
if(TG_USER&&TG_USER.id!=='guest'){const __tn=(TG_USER.first_name||TG_USER.username||'').toUpperCase().slice(0,14);if(__tn)profName=__tn;}
const NEONS=['#00e5d4','#5cd0ff','#3cc8ff','#4b9bff','#7b9bff','#9bd0ff','#9b6dff','#b06bff','#c77bff','#ff5cf0','#ff3df0','#ff5ad0','#ff8ad0','#ff5a6e','#ff7a3c','#ff9b3c','#ffae3c','#ffc24b','#ffd24b','#ffe27a','#d6ff5c','#b6ff3c','#9bff5c','#7cff9b','#6cffb0','#8affc0','#5cffd0','#00ffc8','#66ffe9','#bfeaff','#eaf2ff','#ff2d4e','#ff6b9b','#8a6bd8','#5c79ff','#34d2eb'];
const PSHAPES=['orb','diamond','hex','delta'];
const PLOGOS=['⌖','🜂','🜃','🜁','🜄','🜅','武','◈','✦','♆','∞','☄'];
(async()=>{try{const c=await window.storage.get('abyss_color');if(c&&c.value)profColor=c.value;
 const s=await window.storage.get('abyss_shape');if(s&&s.value)profShape=s.value;
 const l=await window.storage.get('abyss_logo');if(l&&l.value)profLogo=l.value;}catch(e){}})();
(async()=>{try{const r=await window.storage.get('abyss_name');if(r&&r.value)profName=r.value;}catch(e){}})();
function computeStats(){const A=runArchive||[];const total=A.length,wins=A.filter(r=>r.result==='Victory').length;
 const tk=A.reduce((a,r)=>a+(r.kills||0),0),tt=A.reduce((a,r)=>a+(r.time||0),0),tg=A.reduce((a,r)=>a+(r.gold||0),0);
 const hl=A.reduce((a,r)=>Math.max(a,r.level||0),0),hc=A.reduce((a,r)=>Math.max(a,r.corruption||0),0);
 const n0=Math.max(1,total),avg=f=>A.reduce((a,r)=>a+(f(r)||0),0)/n0;
 const axes=[Math.min(1,avg(r=>(r.dodges||0)/Math.max(60,r.time||60))/0.5),Math.min(1,avg(r=>(r.kills||0)/Math.max(60,r.time||60))/45),Math.min(1,avg(r=>(r.taken||0)/Math.max(60,r.time||60))/35),Math.min(1,avg(r=>(r.peak||0))/80000),Math.min(1,avg(r=>(r.gold||0)/Math.max(60,r.time||60))/9),Math.min(1,avg(r=>(r.time||0))/1200)];
 const per={};A.forEach(r=>per[r.char]=(per[r.char]||0)+1);let main='\u2014',mn=0;for(const k in per)if(per[k]>mn){mn=per[k];main=k;}
 const elCount={},itCount={},reCount={};
 A.forEach(function(r){var b=r.build||r.snapshot||{};(b.weapons||[]).forEach(function(w){if(w.name)itCount[w.name]=(itCount[w.name]||0)+1;(w.inf||[]).forEach(function(el){if(el)elCount[el]=(elCount[el]||0)+1;});});if(r.reacts){for(var k in r.reacts)reCount[k]=(reCount[k]||0)+(r.reacts[k]||0);}});
 var topN=function(o,n){return Object.entries(o).sort(function(a,b){return b[1]-a[1];}).slice(0,n).map(function(e){return {k:e[0],c:e[1]};});};
 var favEl=topN(elCount,3),favRe=topN(reCount,3),favGear=topN(itCount,5);
 var perDiver=CHARS.map(function(c){return {name:c.name,n:per[c.name]||0};});
 return{total,wins,winRate:total?Math.round(wins/total*100):0,bestTime:bestTime||0,kills:tk,highLevel:hl,timeIn:tt,gold:tg,maxCorr:hc,axes,main,mainRuns:mn,favEl:favEl,favRe:favRe,favGear:favGear,perDiver:perDiver};}
function statCardHTML(s,name,photo,about){
 const styles=['MOVEMENT RUNNER','STORMBRINGER','JUGGERNAUT','DEADEYE','TREASURE DIVER','DEEP DWELLER'];
 const styleName=s.total?styles[s.axes.indexOf(Math.max(...s.axes))]:'UNWRITTEN';
 const mc=CHARS.find(c=>c.name===s.main);
 const stat=(v,l)=>`<div class="dstat"><div class="v">${v}</div><div class="l">${l}</div></div>`;
 const av=photo?`<img src="${photo}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid #b06bff">`:`<div class="pavatar" style="border-color:#b06bff">\ud83d\udc64</div>`;
 return `<div class="pcard"><div class="pname-row">${av}<div><div style="font-family:var(--disp);font-size:17px;letter-spacing:.1em;color:#eaf2ff">${name}</div><div style="font-size:12px;color:var(--dim);margin-top:5px">Main: <b style="color:${mc?mc.color:'#cde4ff'}">${mc?mc.glyph+' ':''}${s.main}</b> \u00b7 Style: <b style="color:#b06bff">${styleName}</b></div>${about?`<div style="font-size:12px;color:#9bb0d8;margin-top:6px;font-style:italic">${about}</div>`:''}</div></div></div>`+
  `<div class="pcard"><div class="ptitle">Stats</div><div class="dgrid">`+stat(s.total,'Total Runs')+stat(s.wins,'Victories')+stat(s.winRate+'%','Win Rate')+stat(fmtT(s.bestTime),'Best Time')+stat(fmtN(s.kills),'Total Kills')+stat(s.highLevel||'\u2014','Highest Level')+stat(fmtT(s.timeIn),'Time in the Deep')+stat(fmtN(s.gold),'Credits')+stat(s.maxCorr||'\u2014','Max Corruption')+`</div></div>`+
  `<div class="pcard"><div class="ptitle">Playstyle Analysis</div>${svgRadar(s.axes,['MOBILITY','AGGRESSION','TANK','PRECISION','GREED','ENDURANCE'])}</div>`;}
function svgRadar(vals,labels){const cx=110,cy=104,R=78,n=vals.length;
 const pt=(i,f)=>{const a=i/n*TAU-Math.PI/2;return (cx+Math.cos(a)*R*f).toFixed(1)+','+(cy+Math.sin(a)*R*f).toFixed(1);};
 let grid='';for(const f of [0.33,0.66,1])grid+='<polygon points="'+vals.map((_,i)=>pt(i,f)).join(' ')+'" fill="none" stroke="rgba(110,140,200,0.25)" stroke-width="1"/>';
 let axes='';for(let i=0;i<n;i++)axes+='<line x1="'+cx+'" y1="'+cy+'" x2="'+pt(i,1).replace(',',' " y2="')+'" stroke="rgba(110,140,200,0.18)"/>';
 const poly=vals.map((v,i)=>pt(i,Math.max(0.06,Math.min(1,v)))).join(' ');
 let labs='';for(let i=0;i<n;i++){const a=i/n*TAU-Math.PI/2,lx=cx+Math.cos(a)*(R+16),ly=cy+Math.sin(a)*(R+14);labs+='<text x="'+lx+'" y="'+ly+'" fill="#8aa6da" font-size="8.5" font-family="Orbitron,sans-serif" text-anchor="middle" letter-spacing="1">'+labels[i]+'</text>';}
 return '<svg viewBox="0 0 220 208" style="width:min(280px,72vw);display:block;margin:0 auto">'+grid+axes+'<polygon points="'+poly+'" fill="rgba(176,107,255,0.28)" stroke="#b06bff" stroke-width="2"/>'+labs+'</svg>';}
function openProfile(){hideAllScreens();state='profile';
 const total=runArchive.length,wins=runArchive.filter(r=>r.result==='Victory').length;
 const gamesShown=Math.max(total,NET.gamesPlayed||0);
 const tk=runArchive.reduce((a,r)=>a+(r.kills||0),0),tt=runArchive.reduce((a,r)=>a+(r.time||0),0),tg=runArchive.reduce((a,r)=>a+(r.gold||0),0);
 const hl=runArchive.reduce((a,r)=>Math.max(a,r.level||0),0),hc=runArchive.reduce((a,r)=>Math.max(a,r.corruption||0),0);
 // Fold in the DURABLE server totals: NET.stats holds the monotonic all-time numbers, while the local
 // runArchive is capped at 30 runs - so without this the own profile under-reports lifetime stats.
 const _ns=(typeof NET!=='undefined'&&NET&&NET.stats)||{};
 const winsD=Math.max(wins,_ns.wins||0),tkD=Math.max(tk,_ns.kills||0),ttD=Math.max(tt,_ns.timeIn||0),tgD=Math.max(tg,_ns.gold||0),hlD=Math.max(hl,_ns.level||0),hcD=Math.max(hc,_ns.maxCorr||0);
 const per={};runArchive.forEach(r=>per[r.char]=(per[r.char]||0)+1);
 let main='\u2014',mn=0;for(const k in per)if(per[k]>mn){mn=per[k];main=k;}
 const mc=CHARS.find(c=>c.name===main);
 const stat=(v,l)=>`<div class="dstat"><div class="v">${v}</div><div class="l">${l}</div></div>`;
 const mx=Math.max(1,...Object.values(per).concat([1]));
 const bars=CHARS.map(c=>{const n=per[c.name]||0;return `<div class="pbar-row"><span class="pl" style="color:${c.color}">${c.glyph} ${c.name}</span><div class="pbar"><i style="width:${n/mx*100}%"></i></div><span class="pv">${n}</span></div>`;}).join('');
 // playstyle radar from run data
 const A=runArchive,n0=Math.max(1,A.length);
 const avg=f=>A.reduce((a,r)=>a+(f(r)||0),0)/n0;
 const mob=Math.min(1,avg(r=>(r.dodges||0)/Math.max(60,r.time||60))/0.5);
 const agg=Math.min(1,avg(r=>(r.kills||0)/Math.max(60,r.time||60))/45);
 const tank=Math.min(1,avg(r=>(r.taken||0)/Math.max(60,r.time||60))/35);
 const prec=Math.min(1,avg(r=>(r.peak||0))/80000);
 const greed=Math.min(1,avg(r=>(r.gold||0)/Math.max(60,r.time||60))/9);
 const endur=Math.min(1,avg(r=>(r.time||0))/1200);
 const axesV=[mob,agg,tank,prec,greed,endur],axesL=['MOBILITY','AGGRESSION','TANK','PRECISION','GREED','ENDURANCE'];
 const styles=['MOVEMENT RUNNER','STORMBRINGER','JUGGERNAUT','DEADEYE','TREASURE DIVER','DEEP DWELLER'];
 const styleName=total?styles[axesV.indexOf(Math.max(...axesV))]:'UNWRITTEN';
 // favorites: elements / reactions / items from snapshots
 const elCount={},itCount={},reCount={};
 A.forEach(r=>{(r.snapshot&&r.snapshot.weapons||[]).forEach(w=>{itCount[w.name]=(itCount[w.name]||0)+1;const base=WEAPON_EL[w.id]||'kinetic';elCount[base]=(elCount[base]||0)+1;(w.inf||[]).forEach(el=>elCount[el]=(elCount[el]||0)+1);});(r.snapshot&&r.snapshot.passives||[]).forEach(p2=>itCount[p2.name]=(itCount[p2.name]||0)+1);if(r.reacts)for(const k in r.reacts)reCount[k]=(reCount[k]||0)+(r.reacts[k]||0);});
 const top=(o,n)=>Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,n);
 const elPills=top(elCount,3).map(([id,c])=>{const E=ELEMENTS[id];return E?`<span class="gpill" style="color:${E.color};border-color:${E.color}">${E.icon} ${E.name} \u00d7${c}</span>`:'';}).join(' ')||'<span style="color:var(--dim)">no data yet</span>';
 const rePills=top(reCount,3).map(([k,c])=>`<span class="gpill" style="color:#ffd24b;border-color:#ffd24b">${k} \u00d7${c}</span>`).join(' ')||'<span style="color:var(--dim)">no data yet \u00b7 reactions tracked from your next run</span>';
 const itList=top(itCount,5).map(([k,c])=>`${k} \u00d7${c}`).join(' \u00b7 ')||'no data yet';
 const swatches=NEONS.map(c=>`<span class="csw${profColor===c?' on':''}" data-c="${c}" style="background:${c};box-shadow:0 0 10px ${c}66"></span>`).join('');
 const shapeBtns=PSHAPES.map(s=>`<span class="pshapeb${profShape===s?' on':''}" data-s="${s}">${s==='orb'?'\u25cf':s==='diamond'?'\u25c6':s==='hex'?'\u2b22':'\u25b2'}</span>`).join('');
 const logoBtns=PLOGOS.map(l=>`<span class="plogob${profLogo===l?' on':''}" data-l="${l}">${l}</span>`).join('');
 let _myXp=0,_myInfo=null;try{_myXp=captainTotalXP();_myInfo=captainLevelInfo(_myXp);}catch(e){}
 const capCard=_myInfo?`<div class="pcard">${capEmblem(_myInfo.level,_myInfo)}<div style="display:flex;gap:18px;margin-top:13px;flex-wrap:wrap;align-items:center"><div><div style="font-family:var(--disp);font-weight:800;font-size:16px;color:#eafffd">${fmtN(_myInfo.total)}</div><div style="font-family:var(--ui);font-size:9px;letter-spacing:.14em;color:var(--dim);text-transform:uppercase;margin-top:2px">Lifetime XP</div></div><button class="btn ghost" id="capView" style="margin-left:auto;padding:9px 18px;font-size:11px">View Ascension \u203a</button></div></div>`:'';
 document.getElementById('profilebody').innerHTML=
  `<div class="pcard"><div class="pname-row"><div class="pavatar" id="pavatar" style="border-color:${profColor||'#b06bff'};box-shadow:0 0 22px ${(profColor||'#b06bff')}66">${profLogo}</div><div><input id="pname" maxlength="14" value="${profName}"><div style="font-size:12px;color:var(--dim);margin-top:5px">Main Diver: <b style="color:${mc?mc.color:'#cde4ff'}">${mc?mc.glyph+' ':''}${main}</b>${mn?` \u00b7 ${mn} run${mn===1?'':'s'}`:''} \u00b7 Style: <b style="color:#b06bff">${styleName}</b></div></div></div></div>`+
  capCard+
  `<div class="pcard"><div class="ptitle">Identity \u00b7 your light in the deep</div>
    <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:10px"><div id="pball" style="width:42px;height:42px;border-radius:50%;background:${profColor||'#00e5d4'};box-shadow:0 0 24px ${profColor||'#00e5d4'}"></div><span style="font-size:12px;color:var(--dim)">live preview \u00b7 this is your diver in game</span></div>
    <div class="ptitle" style="margin-top:8px">Neon</div><div class="cswgrid">${swatches}<span class="csw reset${profColor?'':' on'}" data-c="">\u00d8</span></div>
    <div class="ptitle" style="margin-top:10px">Shape</div><div class="shaperow">${shapeBtns}</div>
    <div class="ptitle" style="margin-top:10px">Sigil</div><div class="shaperow">${logoBtns}</div></div>`+
  `<div class="pcard"><div class="ptitle">Stats</div><div class="dgrid">`+
   stat(gamesShown,'Total Runs')+stat(winsD,'Victories')+stat(gamesShown?Math.round(winsD/gamesShown*100)+'%':'\u2014','Win Rate')+
   stat(fmtT(bestTime),'Best Time')+stat(fmtN(tkD),'Total Kills')+stat(hlD||'\u2014','Highest Level')+
   stat(fmtT(ttD),'Time in the Deep')+stat(fmtN(tgD),'Credits Earned')+stat(hcD||'\u2014','Max Corruption')+
  `</div></div>`+
  `<div class="pcard"><div class="ptitle">Playstyle Analysis</div>${svgRadar(axesV,axesL)}</div>`+
  `<div class="pcard"><div class="ptitle">Loadout Affinity</div>
    <div class="ptitle" style="font-size:9px">Favorite Elements</div><div style="margin-bottom:9px">${elPills}</div>
    <div class="ptitle" style="font-size:9px">Favorite Reactions</div><div style="margin-bottom:9px">${rePills}</div>
    <div class="ptitle" style="font-size:9px">Most Used Gear</div><div style="font-size:12.5px;color:#cde4ff">${itList}</div></div>`+
  `<div class="pcard"><div class="ptitle">Analytics \u00b7 Runs per Diver</div>${bars}</div>`+
  '';
 document.getElementById('profilebody').querySelectorAll('.csw').forEach(el=>{el.onclick=()=>{profColor=el.dataset.c||'';try{window.storage.set('abyss_color',profColor);}catch(e){}openProfile();};});
 document.getElementById('profilebody').querySelectorAll('.pshapeb').forEach(el=>{el.onclick=()=>{profShape=el.dataset.s;try{window.storage.set('abyss_shape',profShape);}catch(e){}openProfile();};});
 document.getElementById('profilebody').querySelectorAll('.plogob').forEach(el=>{el.onclick=()=>{profLogo=el.dataset.l;try{window.storage.set('abyss_logo',profLogo);}catch(e){}openProfile();};});
 const pi=document.getElementById('pname');
 pi.onchange=()=>{profName=(pi.value||'SURVIVOR').toUpperCase().slice(0,14);pi.value=profName;try{window.storage.set('abyss_name',profName);}catch(e){}};
 const cvw=document.getElementById('capView');if(cvw)cvw.onclick=()=>openCaptain();
 if(netId()&&Date.now()-NET.lastSync>15000)netSync();
 document.getElementById('profile').classList.remove('hidden');}
