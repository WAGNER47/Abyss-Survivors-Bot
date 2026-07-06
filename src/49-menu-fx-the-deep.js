/* ===== MENU FX: The Deep ===== */
const mfx={p:[],sil:[],frag:[],t:0,lines:['SIGNAL LOST...','DEPTH: 18,492m','OXYGEN: UNKNOWN','RUNNER LINK STABLE','SOMETHING MOVED BELOW','TRANSMISSION 7 OF ?','DO NOT FOLLOW THE LIGHT','HULL INTEGRITY: FINE. PROBABLY.'],li:0,lt:0};
for(let i=0;i<46;i++)mfx.p.push({x:Math.random(),y:Math.random(),s:rand(0.5,2.2),v:rand(4,16),c:pick(['#3cc8ff','#b06bff','#ff9b3c','#6cffb0'])});
for(let i=0;i<3;i++)mfx.sil.push({x:Math.random(),y:rand(0.2,0.8),r:rand(60,150),v:rand(2,6),d:Math.random()<0.5?1:-1});
for(let i=0;i<14;i++)mfx.frag.push({x:Math.random(),y:Math.random(),v:rand(8,26),ch:pick(['0','1','▌','▒','◈','>','_','7'])});
function menuFX(dtm){const mc=document.getElementById('menufx');if(!mc)return;const menuEl=document.getElementById('menu');if(menuEl.classList.contains('hidden'))return;
 if(mc.width!==mc.clientWidth*DPR){mc.width=mc.clientWidth*DPR;mc.height=mc.clientHeight*DPR;}
 const g=mc.getContext('2d');g.setTransform(DPR,0,0,DPR,0,0);const mw=mc.clientWidth,mh=mc.clientHeight;g.clearRect(0,0,mw,mh);
 mfx.t+=dtm;
 for(const s of mfx.sil){s.x+=s.d*s.v*dtm/mw;if(s.x>1.3)s.x=-0.3;if(s.x<-0.3)s.x=1.3;
  g.save();g.globalAlpha=0.07;g.fillStyle='#000';g.shadowColor='#b06bff';g.shadowBlur=40;g.beginPath();g.arc(s.x*mw,s.y*mh+Math.sin(mfx.t*0.4+s.r)*12,s.r,0,TAU);g.fill();g.restore();}
 for(const p of mfx.p){p.y-=p.v*dtm/mh;if(p.y<-0.02){p.y=1.02;p.x=Math.random();}
  g.globalAlpha=0.5;g.fillStyle=p.c;g.beginPath();g.arc(p.x*mw,p.y*mh,p.s,0,TAU);g.fill();}
 g.globalAlpha=0.35;g.fillStyle='#6cffb0';g.font='10px monospace';
 for(const f of mfx.frag){f.y+=f.v*dtm/mh;if(f.y>1.02){f.y=-0.02;f.x=Math.random();}g.fillText(f.ch,f.x*mw,f.y*mh);}
 g.globalAlpha=1;
 mfx.lt-=dtm;if(mfx.lt<=0){mfx.lt=2.6;mfx.li=(mfx.li+1)%mfx.lines.length;}
 const tEl=document.getElementById('transmission');if(tEl){const cur=mfx.lines[mfx.li],pn=Math.min(cur.length,Math.floor((2.6-mfx.lt)*26));tEl.textContent='> '+cur.slice(0,pn)+((mfx.t*2|0)%2?'_':' ');}}
function buildCardHTML(){if(!player)return'';
 let s='<h5>Current Build</h5>';
 const elc={};for(const w of player.weapons)for(const el of wEls(w))elc[el]=(elc[el]||0)+1;
 s+=Object.entries(elc).map(([id,c])=>{const E=ELEMENTS[id];return E?`<span class="gpill" style="color:${E.color};border-color:${E.color};margin:0 4px 4px 0;display:inline-block">${E.icon} ${E.name} \u00d7${c}</span>`:'';}).join('');
 s+='<h5>Weapons</h5>';
 for(const w of player.weapons){const W2=WEAPONS[w.id];s+=`<div class="bw"><span style="color:${W2.color}">${W2.icon} ${evoName(w.id,w.evo||0)}</span><span class="st">${'\u2605'.repeat(Math.min(w.level,8))}${(w.evo||0)?' E'+w.evo:''}</span></div>`;}
 if(player.passives&&Object.keys(player.passives).length){s+='<h5>Augments</h5>';
  for(const id in player.passives){const P2=PASSIVES[id];if(P2)s+=`<div class="bw"><span style="color:${P2.color}">${P2.icon} ${P2.name}</span><span class="st">LV ${player.passives[id]}</span></div>`;}}
 const RN={'fire|ice':'Thermal Shock','fire|toxic':'Combustion','lightning|toxic':'Chain Storm','lightning|plasma':'Overload','fire|void':'Entropy','radiation|toxic':'Mutation','ice|lightning':'Superconduct','ice|void':'Absolute Zero','fire|lightning':'Swirl','kinetic|void':'Crystallize','plasma|toxic':'Bloom','ice|toxic':'Corrosive Mist','lightning|void':'Magnetize','fire|radiation':'Irradiate'};
 const els=Object.keys(elc),act=[];
 for(const k in RN){const[a,b]=k.split('|');if(els.includes(a)&&els.includes(b))act.push(RN[k]);}
 s+='<h5>Synergy</h5>'+(act.length?act.map(n=>`<div class="syn">\u25c8 ${n.toUpperCase()} ACTIVE</div>`).join(''):'<div style="color:var(--dim);font-size:12px">mix two elements to unlock reactions</div>');
 return s;}
function toggleBuild(){const bc=document.getElementById('buildcard');if(!player){bc.classList.add('hidden');return;}
 const show=bc.classList.contains('hidden');bc.classList.toggle('hidden',!show);if(show){bc.innerHTML=buildCardHTML();try{trDyn(bc);}catch(e){}}}
try{if(IS_TOUCH){const hl=document.getElementById('hintline');if(hl)hl.innerHTML='<b>DRAG</b> anywhere to move &nbsp;\u00b7&nbsp; <b>TAP</b> the dive button to dodge / parry / guard &nbsp;\u00b7&nbsp; guns auto fire';}}catch(e){}
document.getElementById('buildbtn').onclick=toggleBuild;
function fpRunRow(r,i){const win=r.result==='Victory';const c=CHARS.find(x=>x.name===r.char);
 return `<div class="frow fprow" data-ri="${i}"><span>${win?'<span style="color:#6cffb0">\u25b2</span>':'<span style="color:#ff7a8a">\u25bc</span>'} ${c?c.glyph+' ':''}${r.char||'Diver'} \u00b7 LV ${r.level||0}</span><span style="color:var(--dim);font-size:11px">${fmtT(r.time||0)} \u00b7 \u203a</span></div>`;}
function fpRunDetail(r){const win=r.result==='Victory';const c=CHARS.find(x=>x.name===r.char);
 const row=(a,b)=>`<span style="display:inline-block;min-width:120px;color:var(--dim)">${a}</span><span style="color:#dbe8ff">${b}</span><br>`;
 return `<div class="fp-run-detail">`+
  row('Result', win?'Victory':(r.corruption>0?'Fell in Corruption':'Defeat'))+
  row('Diver', (c?c.glyph+' ':'')+(r.char||'Diver'))+
  row('Reached', 'Level '+(r.level||0)+(r.corruption>0?' \u00b7 C'+r.corruption:''))+
  row('Time', fmtT(r.time||0))+
  row('Kills', fmtN(r.kills||0))+
  row('Peak Hit', fmtN(r.peak||0))+
  row('Total Dmg', fmtN(r.total||0))+
  row('Damage Taken', fmtN(r.taken||0))+
  row('Credits', fmtN(r.gold||0))+
 `</div>`;}
function openFriendProfile(fid,fname,fphoto){hideAllScreens();state='social';
 const B=document.getElementById('socialbody');
 document.querySelectorAll&&document.querySelectorAll('.stab').forEach(b=>b.classList.remove('on'));
 B.innerHTML='<div class="pcard"><div style="color:var(--dim);font-family:var(--disp);font-size:11px;letter-spacing:.14em">LOADING DIVER RECORD...</div></div>';
 document.getElementById('social').classList.remove('hidden');try{trDyn(document.getElementById('social'));}catch(e){}
 apiFetch('profile',{id:String(fid)}).then(r=>r.json()).then(j=>{
  if(j&&j.ok&&j.profile){const p=j.profile,st=p.stats||{};const runs=p.runs||[];
   const axes=(st.axes&&st.axes.length===6)?st.axes:[0.3,0.5,0.4,0.3,0.4,0.3];
   const s={total:st.total||st.runs||0,wins:st.wins||0,winRate:(st.total||0)?Math.round((st.wins||0)/st.total*100):0,bestTime:st.best||0,kills:st.kills||0,highLevel:st.level||0,timeIn:st.timeIn||0,gold:st.gold||0,maxCorr:st.maxCorr||0,axes,main:st.main||'-',mainRuns:0};
   const styles=['MOVEMENT RUNNER','STORMBRINGER','JUGGERNAUT','DEADEYE','TREASURE DIVER','DEEP DWELLER'];
   const styleName=s.total?styles[axes.indexOf(Math.max(...axes))]:'UNWRITTEN';
   const mc=CHARS.find(c=>c.name===s.main);
   const online=(Date.now()-(p.seen||0)<70000);
   const tier=presenceTier(p.seen||0,false);
   try{NET.fcache[fid]={_t:Date.now(),cap:st.cap||0,capXp:st.capXp||0,best:st.level||0,level:st.level||0,kills:st.kills||0,total:st.total||0,wins:st.wins||0,timeIn:st.timeIn||0,maxCorr:st.maxCorr||0,seen:p.seen||0};}catch(e){}
   const fcap=capFromStats(st);let fInfo=null;
   if(st.capXp&&st.capXp>0){try{fInfo=captainLevelInfo(st.capXp);}catch(e){}}
   else if(!(st.cap&&st.cap>0)){const _ex=capXpFromStats(st);if(_ex>0){try{fInfo=captainLevelInfo(_ex);}catch(e){}}}
   const _fpp=safePhoto(p.photo||fphoto);const av=_fpp?`<img src="${esc(_fpp)}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid #b06bff">`:`<div class="pavatar" style="border-color:#b06bff;width:72px;height:72px">\ud83d\udc64</div>`;
   const stat=(v,l)=>`<div class="dstat"><div class="v">${v}</div><div class="l">${l}</div></div>`;
   let html='<button class="btn ghost" id="fpback" style="margin-bottom:14px">\u2039 Back to Friends</button>';
   // header
   html+=`<div class="pcard"><div class="pname-row" style="gap:16px">${av}<div><div style="font-family:var(--disp);font-size:20px;letter-spacing:.08em;color:#eaf2ff">${esc(p.name||fname||'Diver')}</div><div style="font-size:12.5px;margin-top:6px;display:flex;align-items:center;gap:7px"><span class="fdot ${tier.cls}"></span><span style="color:${tier.color}">${tier.label}</span></div><div style="font-size:12.5px;color:var(--dim);margin-top:5px">Main <b style="color:${mc?mc.color:'#cde4ff'}">${mc?mc.glyph+' ':''}${s.main}</b> \u00b7 Style <b style="color:#b06bff">${styleName}</b></div></div></div></div>`;
   // captain rank emblem
   html+=`<div class="pcard">${capEmblem(fcap,fInfo)}</div>`;
   // wide grid: stats + radar
   html+='<div class="fp-grid">';
   html+=`<div class="pcard"><div class="ptitle">Career Stats</div><div class="dgrid">`+stat(s.total,'Total Runs')+stat(s.wins,'Victories')+stat(s.winRate+'%','Win Rate')+stat(fmtT(s.bestTime),'Best Time')+stat(fmtN(s.kills),'Total Kills')+stat(s.highLevel||'-','Highest Level')+stat(fmtT(s.timeIn),'Time in Deep')+stat(fmtN(s.gold),'Credits')+stat(s.maxCorr||'-','Max Corruption')+`</div></div>`;
   html+=`<div class="pcard"><div class="ptitle">Playstyle</div>${svgRadar(axes,['MOBILITY','AGGRESSION','TANK','PRECISION','GREED','ENDURANCE'])}</div>`;
   html+='</div>';
   // head-to-head comparison vs you
   html+=vsCard(st,p.name||fname||'They');
   // favorite diver banner (from synced main)
   if(mc){html+=`<div class="pcard"><div class="ptitle">Favorite Diver</div><div style="display:flex;align-items:center;gap:12px"><div style="font-size:30px;color:${mc.color};text-shadow:0 0 14px ${mc.color}">${mc.glyph}</div><div><div style="font-family:var(--disp);font-size:16px;letter-spacing:.06em;color:${mc.color}">${mc.name}</div><div style="font-size:11.5px;color:var(--dim)">${(st.mainRuns||0)} run${(st.mainRuns||0)===1?'':'s'} \u00b7 most played</div></div></div></div>`;}
   // loadout affinity (favorite elements / reactions / gear), synced
   var favEl=st.favEl||[],favRe=st.favRe||[],favGear=st.favGear||[];
   var elPills=favEl.map(function(e){var E=ELEMENTS[e.k]||Object.values(ELEMENTS).find(function(x){return x.name===e.k;});return E?`<span class="gpill" style="color:${E.color};border-color:${E.color}">${E.icon} ${E.name} \u00d7${e.c}</span>`:`<span class="gpill">${e.k} \u00d7${e.c}</span>`;}).join(' ')||'<span style="color:var(--dim);font-size:12px">no data yet</span>';
   var rePills=favRe.map(function(e){return `<span class="gpill" style="color:#ffd24b;border-color:#ffd24b">${e.k} \u00d7${e.c}</span>`;}).join(' ')||'<span style="color:var(--dim);font-size:12px">no data yet</span>';
   var gearTxt=favGear.map(function(e){return e.k+' \u00d7'+e.c;}).join(' \u00b7 ')||'no data yet';
   html+=`<div class="pcard"><div class="ptitle">Loadout Affinity</div>`+
    `<div class="ptitle" style="font-size:9px">Favorite Elements</div><div style="margin-bottom:9px">${elPills}</div>`+
    `<div class="ptitle" style="font-size:9px">Favorite Reactions</div><div style="margin-bottom:9px">${rePills}</div>`+
    `<div class="ptitle" style="font-size:9px">Most Used Gear</div><div style="font-size:12.5px;color:#cde4ff">${gearTxt}</div></div>`;
   // runs per diver bars (synced perDiver)
   var pd=st.perDiver||[];if(pd.length){var mxp=Math.max.apply(null,pd.map(function(d){return d.n;}).concat([1]));
    var bars=pd.map(function(d){var c=CHARS.find(function(x){return x.name===d.name;})||{color:'#6c83b0',glyph:'\u25c6'};return `<div class="pbar-row"><span class="pl" style="color:${c.color}">${c.glyph} ${d.name}</span><div class="pbar"><i style="width:${Math.round(d.n/mxp*100)}%;background:${c.color}"></i></div><span style="font-size:11px;color:var(--dim);min-width:20px;text-align:right">${d.n}</span></div>`;}).join('');
    html+=`<div class="pcard"><div class="ptitle">Runs per Diver</div>${bars}</div>`;}
   // recent runs (expandable)
   html+=`<div class="pcard fp-runs"><div class="ptitle">Recent Runs</div>`+(runs.length?`<div id="fpRunList">`+runs.map((r,i)=>fpRunRow(r,i)).join('')+`</div>`:`<div style="color:var(--dim);font-size:12.5px">No runs recorded yet, or this diver has not synced recently.</div>`)+`</div>`;
   B.innerHTML=html;
   const bk=document.getElementById('fpback');if(bk)bk.onclick=()=>openSocial('friends');
   // expandable run rows
   B.querySelectorAll('.fprow').forEach(row=>{row.onclick=()=>{const i=+row.dataset.ri;const existing=row.nextElementSibling;if(existing&&existing.classList.contains('fp-run-detail')){existing.remove();return;}B.querySelectorAll('.fp-run-detail').forEach(d=>d.remove());const div=document.createElement('div');div.innerHTML=fpRunDetail(runs[i]);row.after(div.firstChild);};});
  }else{B.innerHTML='<div class="pcard"><div style="color:var(--dim)">Could not load this diver. The relay may be offline.</div></div><button class="btn ghost" id="fpback2">Back</button>';const b2=document.getElementById('fpback2');if(b2)b2.onclick=()=>openSocial('friends');}
 }).catch(()=>{B.innerHTML='<div class="pcard"><div style="color:var(--dim)">Relay offline.</div></div><button class="btn ghost" id="fpback3">Back</button>';const b3=document.getElementById('fpback3');if(b3)b3.onclick=()=>openSocial('friends');});}
function fmtAgo(ts){if(!ts)return 'unknown';const d=Date.now()-ts,m=Math.floor(d/60000),h2=Math.floor(d/3600000),dy=Math.floor(d/86400000);if(dy>0)return dy+(dy===1?' day ago':' days ago');if(h2>0)return h2+'h ago';if(m>0)return m+'m ago';return 'moments ago';}
