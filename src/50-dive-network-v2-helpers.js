/* ===================== DIVE NETWORK v2 helpers ===================== */
function hashStr(s){let h=0;s=String(s);for(let i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))|0;}return h;}
// presence tier from a last-seen timestamp (ms). Honest tiers, nicer than raw "11d ago".
function presenceTier(seen,onlineFlag){
 const d=Date.now()-(seen||0);
 if(onlineFlag||d<70000)return{cls:'dot-on',label:'ONLINE NOW',color:'#6cffb0',glow:'#6cffb0',rank:5};
 if(d<600000)return{cls:'dot-act',label:'active '+fmtAgo(seen),color:'#5cd0ff',glow:'#5cd0ff',rank:4};
 if(d<86400000)return{cls:'dot-rec',label:fmtAgo(seen),color:'#7b9bff',glow:'#7b9bff',rank:3};
 if(d<604800000)return{cls:'dot-away',label:fmtAgo(seen),color:'#8aa0c0',glow:'#6c83b0',rank:2};
 return{cls:'dot-dorm',label:fmtAgo(seen),color:'#6a7a98',glow:'#46546f',rank:1};
}
// compact Captain rank chip (used in friend cards + lists)
function capChip(level){
 const lv=level||0;
 if(!lv)return '<span class="caprank dim" style="--rc:#6c83b0;--rc2:#9fb4d6;--rcg:rgba(108,131,176,.4)"><span class="cgem"></span><span class="clv">?</span><span class="ctt">unsynced</span></span>';
 const rk=captainRank(lv);
 return '<span class="caprank" style="--rc:'+rk.c1+';--rc2:'+rk.c2+';--rcg:'+rk.glow+'"><span class="cgem"></span><span class="clv">'+lv+'</span><span class="ctt">'+rk.name+'</span></span>';
}
// full animated Captain emblem + rank head (used in own + friend profile)
function capEmblem(level,info){
 const lv=level||0,rk=captainRank(lv);
 let xpLine='',bar='';
 if(info){
  if(info.max){xpLine='<div class="cxp" style="color:'+rk.c1+';font-weight:800;letter-spacing:.16em;text-transform:uppercase">Maximum Depth Reached</div>';bar='<div class="capmini-bar"><div class="capmini-fill" style="width:100%"></div></div>';}
  else{xpLine='<div class="cxp"><b>'+fmtN(Math.max(0,info.need-info.into))+'</b> XP to Level '+(lv+1)+'</div>';bar='<div class="capmini-bar"><div class="capmini-fill" style="width:'+(info.pct*100).toFixed(1)+'%"></div></div>';}
 }
 let ci=0;for(let i=0;i<CAP_TIERS.length;i++)if(lv>=CAP_TIERS[i].lv)ci=i;
 return '<div class="caphead" style="--c1:'+rk.c1+';--c2:'+rk.c2+';--glow:'+rk.glow+'">'+
  '<div class="capbadge" style="--c1:'+rk.c1+';--c2:'+rk.c2+';--glow:'+rk.glow+'"><div class="cbh"></div><div class="cb-ring"></div><div class="cb-ring2"></div><div class="cb-core"><div class="cb-lv">'+lv+'</div><div class="cb-lbl">CAPTAIN</div></div></div>'+
  '<div class="ci"><div class="crank">'+rk.name+'</div><div class="ctier">Tier '+(ci+1)+' / '+CAP_TIERS.length+'</div>'+xpLine+bar+'</div>'+
 '</div>';
}
// lazily pull each friend's freshest synced profile so cards show real Captain level,
// best level + accurate presence even if the friends-list endpoint is minimal. Caches 60s.
// V8 SYNC PERF: friend stats now arrive ON the sync payload and are cached there, so
// hydrating cards costs zero network. The old version fired up to 14 profile fetches
// every time the Social screen opened - across ~27k DAU that was a Redis storm.
function hydrateFriends(){
 const fr=NET.friends||[];if(!fr.length)return;
 for(const f of fr){const cached=NET.fcache[f.id];if(cached)applyFriendCard(f.id,cached);}
}
function applyFriendCard(id,data){try{
 let card=null;document.querySelectorAll('.fcard').forEach(c=>{if(c.dataset.fid===String(id))card=c;});if(!card)return;
 const chipEl=card.querySelector('.fcap');if(chipEl)chipEl.innerHTML=capChip(capFromStats(data));
 const bestEl=card.querySelector('.fbest');if(bestEl&&data.best)bestEl.innerHTML='Best Lv <b>'+data.best+'</b>';
 if(data.seen){const tier=presenceTier(data.seen,false);const dotEl=card.querySelector('.fdot');if(dotEl)dotEl.className='fdot '+tier.cls;const lblEl=card.querySelector('.fpreslbl');if(lblEl){lblEl.textContent=tier.label;lblEl.style.color=tier.color;}card.style.setProperty('--pc',tier.glow);}
}catch(e){}}
// VS-You comparison: who leads each headline metric. The flex engine.
function vsCard(theirStats,theirName){
 const s=computeStats();let myCap=1;try{myCap=captainLevelInfo(captainTotalXP()).level;}catch(e){}
 const t=theirStats||{};
 const rows=[
  {l:'CAPTAIN LV',me:myCap,them:t.cap||0,fmt:function(v){return v||'-';}},
  {l:'HIGH LV',me:s.highLevel||0,them:t.level||0,fmt:function(v){return v||'-';}},
  {l:'VICTORIES',me:s.wins||0,them:t.wins||0,fmt:function(v){return v;}},
  {l:'KILLS',me:s.kills||0,them:t.kills||0,fmt:function(v){return fmtN(v);}},
  {l:'BEST TIME',me:s.bestTime||0,them:t.best||0,fmt:function(v){return v?fmtT(v):'-';}},
  {l:'TIME IN DEEP',me:s.timeIn||0,them:t.timeIn||0,fmt:function(v){return v?fmtT(v):'-';}}
 ];
 let youWins=0,themWins=0,html='';
 for(const r of rows){const a=r.me||0,b=r.them||0,tot=(a+b)||1,yf=a/tot,tf=b/tot,youLead=a>b,tie=a===b;
  if(youLead)youWins++;else if(b>a)themWins++;
  html+='<div class="vsrow"><span class="vl">'+r.l+'</span><div class="vsbar">'+
   '<div class="vyou" style="width:'+(yf*100).toFixed(1)+'%"></div>'+
   '<div class="vthem" style="width:'+(tf*100).toFixed(1)+'%"></div>'+
   '<div class="vmid"></div>'+
   '<span class="vyv">'+r.fmt(a)+(youLead&&!tie?' \u25b4':'')+'</span>'+
   '<span class="vtv">'+r.fmt(b)+(b>a?' \u25b4':'')+'</span>'+
   '</div></div>';
 }
 const verdict=youWins>themWins?'<span class="you">YOU LEAD</span>':(themWins>youWins?'<span class="them">'+esc((theirName||'THEY').toUpperCase())+' LEADS</span>':'<span style="color:#ffd24b">DEAD EVEN</span>');
 return '<div class="pcard"><div class="ptitle">VS You \u00b7 head to head</div>'+
  '<div class="vstally"><span class="you">'+youWins+'</span><span class="sep">vs</span><span class="them">'+themWins+'</span></div>'+
  '<div style="text-align:center;font-family:var(--disp);font-size:12px;letter-spacing:.08em;margin-bottom:10px">'+verdict+'</div>'+
  html+'</div>';
}
// live "Dive Network" constellation: you at the centre, friends orbiting, coloured by presence
let _sfxParts=[];
function socialFXTick(dt){
 const cv2=document.getElementById('fnetcanvas');if(!cv2)return;const scr=document.getElementById('social');if(!scr||scr.classList.contains('hidden'))return;
 if(!isFinite(dt)||dt<0)dt=0.016;if(dt>0.05)dt=0.05;
 const g=cv2.getContext('2d');if(!g)return;
 const W2=cv2.clientWidth||600,H2=cv2.clientHeight||190,dpr=Math.min(2,window.devicePixelRatio||1);
 const pw=Math.max(1,Math.round(W2*dpr)),ph=Math.max(1,Math.round(H2*dpr));
 if(cv2.width!==pw||cv2.height!==ph){cv2.width=pw;cv2.height=ph;}
 g.setTransform(dpr,0,0,dpr,0,0);g.globalAlpha=1;g.clearRect(0,0,W2,H2);
 _sfx.t+=dt;const T=_sfx.t;
 const cx=W2*0.5,cy=H2*0.52;
 if(_sfxParts.length<60&&Math.random()<0.3)_sfxParts.push({x:Math.random()*W2,y:H2+5,vx:rand(-5,5),vy:rand(-16,-7),life:rand(2,3.5),r:rand(0.5,1.6)});
 for(let i=_sfxParts.length-1;i>=0;i--){const p=_sfxParts[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(p.life<=0)_sfxParts.splice(i,1);}
 g.save();for(const p of _sfxParts){g.globalAlpha=Math.max(0,Math.min(0.55,p.life*0.4));g.fillStyle='rgba(130,185,235,0.6)';g.beginPath();g.arc(p.x,p.y,p.r,0,TAU);g.fill();}g.restore();
 const fr=NET.friends||[],n=fr.length,ringR=Math.min(W2,H2)*0.36;
 const nodes=[];
 for(let i=0;i<n;i++){const f=fr[i];const seen=(NET.fcache[f.id]&&NET.fcache[f.id].seen)||f.lastSeen;const tier=presenceTier(seen,f.online);
  const a=T*0.16+i/Math.max(1,n)*TAU,rr=ringR*(n>7?(0.72+0.36*(i%2)):1),bob=Math.sin(T*1.3+i)*4;
  nodes.push({x:cx+Math.cos(a)*rr,y:cy+Math.sin(a)*rr*0.8+bob,c:tier.glow,on:tier.cls==='dot-on',act:tier.cls==='dot-on'||tier.cls==='dot-act'});}
 g.save();for(const nd of nodes){g.globalAlpha=nd.act?0.4:0.15;g.strokeStyle=nd.c;g.lineWidth=nd.act?1.4:1;if(nd.on){g.shadowColor=nd.c;g.shadowBlur=6;}g.beginPath();g.moveTo(cx,cy);g.lineTo(nd.x,nd.y);g.stroke();g.shadowBlur=0;}g.restore();
 g.save();for(const nd of nodes){const pz=nd.on?(0.6+0.4*Math.sin(T*4)):1;g.globalAlpha=nd.act?0.95:0.6;g.fillStyle=nd.c;g.shadowColor=nd.c;g.shadowBlur=nd.act?12:5;g.beginPath();g.arc(nd.x,nd.y,(nd.on?5:4)*pz,0,TAU);g.fill();}g.restore();
 const myc=profColor||'#00e5d4';
 g.save();const pz=0.5+0.5*Math.sin(T*2);
 const grd=g.createRadialGradient(cx,cy,2,cx,cy,28);grd.addColorStop(0,hexA(myc,0.5));grd.addColorStop(1,hexA(myc,0));g.fillStyle=grd;g.beginPath();g.arc(cx,cy,28,0,TAU);g.fill();
 g.globalAlpha=0.9;g.strokeStyle=myc;g.lineWidth=2;g.shadowColor=myc;g.shadowBlur=12;g.beginPath();g.arc(cx,cy,12+pz*2,0,TAU);g.stroke();
 g.shadowBlur=18;g.fillStyle=myc;g.globalAlpha=1;g.beginPath();g.arc(cx,cy,7,0,TAU);g.fill();
 g.restore();
 g.save();g.globalAlpha=0.72;g.fillStyle='#cfe9ff';g.font='600 8px Orbitron,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('YOU',cx,cy+24);g.restore();
}

function openSocial(tab){hideAllScreens();state='social';tab=tab||'friends';
 const id=netId();
 document.querySelectorAll&&document.querySelectorAll('.stab').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
 const B=document.getElementById('socialbody');let s='';
 if(!id){
  s='<div class="pcard"><div class="ptitle">Open Inside Telegram</div><div style="font-size:13px;color:#cde4ff;line-height:1.6">The friend network runs on your Telegram identity. Open ABYSS from <b style="color:#3cc8ff">@AbyssSurvivorsbot</b> to link up, add friends, and see who is online.</div></div>';
  B.innerHTML=s;document.querySelectorAll&&document.querySelectorAll('.stab').forEach(b=>{b.onclick=()=>openSocial(b.dataset.t);});
  document.getElementById('social').classList.remove('hidden');try{trDyn(document.getElementById('social'));}catch(e){}return;
 }
 if(tab==='friends'){
  // live network constellation header + pulse stats
  let onlineN=0;(NET.friends||[]).forEach(f=>{const seen=(NET.fcache[f.id]&&NET.fcache[f.id].seen)||f.lastSeen;if(f.online||Date.now()-(seen||0)<70000)onlineN++;});
  let myCap=1;try{myCap=captainLevelInfo(captainTotalXP()).level;}catch(e){}const myRk=captainRank(myCap);
  s+=`<div class="fnet-hero"><canvas id="fnetcanvas" class="fnet-canvas"></canvas><div class="fnet-overlay">`+
     `<div class="fnet-title">\u25c8 Dive Network</div>`+
     `<div class="fnet-pulse">`+
      `<div class="fp"><div class="v">${onlineN}</div><div class="l">Online</div></div>`+
      `<div class="fp"><div class="v">${(NET.friends||[]).length}</div><div class="l">Friends</div></div>`+
      `<div class="fp"><div class="v rk" style="color:${myRk.c1}">LV ${myCap}</div><div class="l">${myRk.name}</div></div>`+
     `</div></div></div>`;
  s+=`<div class="ptitle" style="margin:2px 2px 10px 4px">Your Divers <span style="color:var(--dim);font-weight:400">\u00b7 ${NET.online?'relay online':'relay offline'}</span></div>`;
  if(NET.friends.length){
   const sorted=NET.friends.slice().map(f=>{const seen=(NET.fcache[f.id]&&NET.fcache[f.id].seen)||f.lastSeen;return Object.assign({},f,{_tier:presenceTier(seen,f.online),_seen:seen});}).sort((a,b)=>(b._tier.rank-a._tier.rank)||((b._seen||0)-(a._seen||0)));
   s+=`<div class="fgrid" id="friendgrid">`;
   s+=sorted.map(f=>{const cached=NET.fcache[f.id]||{};const ac=NEONS[Math.abs(hashStr(f.id))%NEONS.length];const _fp=safePhoto(f.photo);const av=_fp?`<img src="${esc(_fp)}">`:esc((f.name||'?').slice(0,1).toUpperCase());const tier=f._tier;
    return `<div class="fcard" data-fid="${esc(f.id)}" data-fname="${esc(f.name||'')}" data-fphoto="${esc(_fp)}" style="--pc:${tier.glow};--ac:${ac};--acg:${ac}66"><div class="fav">${av}</div><div class="fmid"><div class="fnm">${esc(f.name||('Diver '+f.id))}</div><div class="fpres"><span class="fdot ${tier.cls}"></span><span class="fpreslbl" style="color:${tier.color}">${tier.label}</span></div><div class="fbest">${(cached.best||f.best)?('Best Lv <b>'+(cached.best||f.best)+'</b>'):'\u00b7 \u00b7 \u00b7'}</div></div><div class="fright"><span class="fcap">${capChip(capFromStats(cached||{cap:f.cap,capXp:f.capXp,level:f.best,total:f.total||0,kills:f.kills||0}))}</span></div><span class="fchev">\u203a</span></div>`;
   }).join('');
   s+=`</div>`;
  } else {
   s+=`<div class="pcard"><div style="color:var(--dim);font-size:13px;line-height:1.65">No divers linked yet. Open the <b style="color:#5cd0ff">Add</b> tab, share your code, and watch your network light up. Every friend shows their <b style="color:#bff7e4">Captain rank</b>, live status, and how you stack up head to head.</div></div>`;
  }
  s+=`<div class="pcard" style="margin-top:12px"><div class="ptitle">Party \u00b7 up to 3 divers</div>
   <div class="pslot full"><span style="font-size:17px;color:${profColor||'#00e5d4'}">${profLogo}</span> ${profName} <span style="color:var(--dim);font-size:11px;margin-left:auto">you</span></div>
   <div class="pslot">\u2205 open slot</div><div class="pslot">\u2205 open slot</div>
   <button class="btn ghost" id="pinv" style="width:100%;margin-top:6px">\u29c9 Copy Party Invite Link</button>
   <div style="font-size:11.5px;color:var(--dim);margin-top:8px">Live co-diving arrives in a future patch. Invites already work.</div></div>`;
 }else if(tab==='invites'){
  s+=`<div class="pcard"><div class="ptitle">Friend Requests</div><div id="inboxlist"><div style="color:var(--dim);font-size:12.5px">Loading...</div></div></div>`;
 }else{
  s+=`<div class="pcard"><div class="ptitle">My Diver Code</div><div style="display:flex;gap:8px;align-items:center"><span style="font-family:var(--disp);font-size:15px;color:#6cffb0;letter-spacing:.12em">${id}</span><button class="btn ghost" id="ccopy" style="padding:8px 14px;font-size:11px">Copy</button></div><div style="font-size:11.5px;color:var(--dim);margin-top:7px">Give this to a friend so they can send you a request.</div></div>`;
  s+=`<div class="pcard"><div class="ptitle">Add Friend</div><div style="display:flex;gap:8px"><input id="fadd" maxlength="24" placeholder="FRIEND DIVER CODE" style="flex:1;background:rgba(8,13,26,.8);border:1px solid var(--line);border-radius:6px;color:#eaf2ff;font-family:var(--disp);font-size:12px;letter-spacing:.1em;padding:10px 12px"><button class="btn ghost" id="faddgo" style="padding:10px 16px;font-size:11px">Send</button></div><div style="font-size:11.5px;color:var(--dim);margin-top:8px">They get a request in game with accept or decline.</div></div>`;
  s+=`<div class="pcard"><div class="ptitle">Network Diagnostics</div><div id="netdiag" style="font-size:12px;color:var(--dim);font-family:var(--disp);letter-spacing:.08em">checking relay...</div></div>`;
 }
 B.innerHTML=s;
 document.querySelectorAll&&document.querySelectorAll('.stab').forEach(b=>{b.onclick=()=>openSocial(b.dataset.t);});
 const pv=document.getElementById('pinv');if(pv)pv.onclick=()=>{const code=id+'-'+Math.random().toString(36).slice(2,7);const link=`https://t.me/${TG_BOT}/${TG_APP}?startapp=party_${code}`;try{navigator.clipboard&&navigator.clipboard.writeText(link);}catch(e){}toast('PARTY LINK COPIED');};
 const cc=document.getElementById('ccopy');if(cc)cc.onclick=()=>{try{navigator.clipboard&&navigator.clipboard.writeText(id);}catch(e){}toast('CODE COPIED');};
 const fg=document.getElementById('faddgo');if(fg)fg.onclick=async()=>{const v=(document.getElementById('fadd').value||'').trim();if(!v)return;try{const r=await apiFetch('request',{id,target:v});const j=await r.json();if(j&&j.ok){if(j.already)showPopup('Already Friends','You and this diver are already linked.','\u2713','#3cc8ff');else showPopup('Request Sent','Your friend request is on its way. They will see it in their Invites tab and can accept or decline.','\u2713','#6cffb0');document.getElementById('fadd').value='';}else{showPopup('Could Not Send','Double check the diver code and try again.','!','#ff9b4b');}}catch(e){showPopup('Relay Offline','The friend network is unreachable right now. Try again in a moment.','!','#ff5a6e');}};
 const nd=document.getElementById('netdiag');if(nd){fetch('/api/social?action=health').then(r=>r.json()).then(j=>{if(j&&j.relay==='configured'&&j.ping&&j.ping.indexOf('OK')>=0)nd.innerHTML='\u25cf RELAY ONLINE \u00b7 friends active';else if(j&&j.relay==='offline')nd.innerHTML='\u25cb RELAY OFFLINE<br><span style="color:#ff9b4b">Add a Redis integration in Vercel, then redeploy</span>';else nd.innerHTML='\u25cb relay error';}).catch(()=>{nd.textContent='\u25cb relay unreachable';});}
 // friend rows -> profile
 B.querySelectorAll&&B.querySelectorAll('.fcard').forEach(el=>{el.onclick=()=>{openFriendProfile(el.dataset.fid,el.dataset.fname,el.dataset.fphoto);};});
 // inbox load
 if(tab==='invites'){apiFetch('inbox',{id}).then(r=>r.json()).then(j=>{const box=document.getElementById('inboxlist');if(!box)return;const reqs=(j&&j.requests)||[];if(!reqs.length){box.innerHTML='<div style="color:var(--dim);font-size:12.5px">No pending requests.</div>';return;}box.innerHTML=reqs.map(rq=>`<div class="frow" data-from="${esc(rq.id)}"><span>\u25c8 ${esc(rq.name||rq.id)}</span><span><button class="btn ghost fac" style="padding:6px 12px;font-size:11px;color:#6cffb0;border-color:#6cffb0">Accept</button> <button class="btn ghost fde" style="padding:6px 12px;font-size:11px;color:#ff5a6e;border-color:#ff5a6e">Decline</button></span></div>`).join('');box.querySelectorAll('.frow').forEach(row=>{const from=row.dataset.from;row.querySelector('.fac').onclick=async()=>{await apiFetch('respond',{id,from,accept:true});toast('FRIEND ADDED');hap('notify','success');netSync();openSocial('invites');};row.querySelector('.fde').onclick=async()=>{await apiFetch('respond',{id,from,accept:false});toast('DECLINED');openSocial('invites');};});}).catch(()=>{const box=document.getElementById('inboxlist');if(box)box.innerHTML='<div style="color:var(--dim)">Relay offline.</div>';});}
 // group roster

 if(id&&Date.now()-NET.lastSync>20000)netSync();
 if(tab==='friends')hydrateFriends();
 document.getElementById('social').classList.remove('hidden');try{trDyn(document.getElementById('social'));}catch(e){}}
function showPopup(title,sub,icon,color){const m=document.getElementById('popmodal');document.getElementById('poptitle').textContent=title;document.getElementById('popsub').textContent=sub||'';const ic=document.getElementById('popicon');ic.textContent=icon||'\u2713';ic.style.color=color||'#6cffb0';m.querySelector('.popbox').style.borderColor=color||'#6cffb0';m.querySelector('.popbox').style.boxShadow='0 0 40px '+(color||'#6cffb0')+'55';m.classList.remove('hidden');const ok=document.getElementById('popok');ok.onclick=()=>m.classList.add('hidden');try{hap('notify','success');}catch(e){}}
function qLabel(q){return {potato:'Potato',low:'Low',medium:'Medium',high:'High',ultra:'Ultra (Full)'}[q]||q;}
let optReturn='menu';
function openOptions(from){optReturn=from||'menu';hideAllScreens();state='options';
 const B=document.getElementById('optbody');
 const seg=(id,val,opts)=>`<div class="optseg" data-opt="${id}">`+opts.map(o=>`<button class="optb ${val===o?'on':''}" data-opt="${id}" data-val="${o}">${qLabel(o)}</button>`).join('')+`</div>`;
 let s='';
 s+=`<div class="pcard"><div class="ptitle">Visual Quality</div><div style="font-size:11.5px;color:var(--dim);margin-bottom:9px">Lower it if the game stutters on your device. Potato strips effects for max speed.</div>${seg('quality',OPT.quality,QUALITY_LEVELS)}</div>`;
 s+=`<div class="pcard"><div class="ptitle">Physics Quality</div><div style="font-size:11.5px;color:var(--dim);margin-bottom:9px">Controls corpse flinging and debris. Potato turns them off entirely.</div>${seg('physics',OPT.physics,QUALITY_LEVELS)}</div>`;
 s+=`<div class="pcard"><div class="ptitle">Damage Numbers</div><div style="font-size:11.5px;color:var(--dim);margin-bottom:9px">How floating damage shows over enemies.</div><div class="optseg" data-opt="dmgnum">`+['off','minimal','full','diablo'].map(o=>`<button class="optb ${DMGNUM===o?'on':''}" data-opt="dmgnum" data-val="${o}">${o}</button>`).join('')+`</div></div>`;
 s+=`<div class="pcard"><div class="ptitle">Vibration</div><div class="optseg" data-opt="vibration"><button class="optb ${OPT.vibration?'on':''}" data-opt="vibration" data-val="on">On</button><button class="optb ${!OPT.vibration?'on':''}" data-opt="vibration" data-val="off">Off</button></div><div style="font-size:11.5px;color:var(--dim);margin-top:8px">Haptic feedback on mobile in Telegram.</div></div>`;
 s+=`<div class="pcard"><div class="ptitle">FPS Counter</div><div class="optseg" data-opt="fps"><button class="optb ${OPT.fps?'on':''}" data-opt="fps" data-val="on">On</button><button class="optb ${!OPT.fps?'on':''}" data-opt="fps" data-val="off">Off</button></div><div style="font-size:11.5px;color:var(--dim);margin-top:8px">Shows a tiny frame rate readout in the corner.</div></div>`;
 s+=`<div class="pcard"><div class="ptitle">Audio Volume <span id="volval" style="color:#6cffb0;font-weight:400">${Math.round(OPT.volume/0.6*100)}%</span></div><input type="range" id="volslider" min="0" max="100" value="${Math.round(OPT.volume/0.6*100)}" style="width:100%;margin-top:8px;accent-color:#3cc8ff"></div>`;
 B.innerHTML=s;
 B.querySelectorAll('.optb').forEach(btn=>{btn.onclick=()=>{const o=btn.dataset.opt,v=btn.dataset.val;
  if(o==='vibration'){OPT.vibration=(v==='on');if(OPT.vibration)hap('impact','soft');}
  else if(o==='fps'){OPT.fps=(v==='on');}
  else if(o==='dmgnum'){DMGNUM=v;syncDmgBtn();try{window.storage.set('abyss_dmgnum',DMGNUM);}catch(e){}}
  else{OPT[o]=v;applyQuality();}
  saveOpt();
  btn.parentElement.querySelectorAll('.optb').forEach(b=>b.classList.toggle('on',b===btn));
 };});
 const vs=document.getElementById('volslider');if(vs)vs.oninput=()=>{const pct=+vs.value;OPT.volume=pct/100*0.6;document.getElementById('volval').textContent=pct+'%';muted=(OPT.volume<=0);if(master)master.gain.value=OPT.volume;saveOpt();};
 if(vs)vs.onchange=()=>{if(!muted)sfx('pickup');};
 document.getElementById('options').classList.remove('hidden');}
function closeOptions(){if(optReturn==='pause'){hideAllScreens();state='paused';document.getElementById('pause').classList.remove('hidden');}else toMenu();}
document.getElementById('optbtn').onclick=()=>openOptions('menu');
const _ob2=document.getElementById('optbtn2');if(_ob2)_ob2.onclick=()=>openOptions('pause');
document.getElementById('optback').onclick=closeOptions;
const _lb=document.getElementById('leaderback');if(_lb)_lb.onclick=toMenu;
const _c2=document.getElementById('creditsbtn2');if(_c2)_c2.onclick=openCredits;
{const _sb=document.getElementById('socialbtn');if(_sb)_sb.onclick=()=>openSocial('friends');}
try{updateSocialBadge();}catch(e){}
document.getElementById('socialback').onclick=toMenu;
{const _p=document.getElementById('profilebtn');if(_p)_p.onclick=openProfile;}
document.getElementById('profileback').onclick=toMenu;
var _capb=document.getElementById('captainback');if(_capb)_capb.onclick=toMenu;
var _cosb=document.getElementById('cosmeticsback');if(_cosb)_cosb.onclick=toMenu;
{const _g=document.getElementById('guidebtn');if(_g)_g.onclick=openCodex;}
document.getElementById('codexback').onclick=toMenu;
{const _c=document.getElementById('creditsbtn');if(_c)_c.onclick=()=>{hideAllScreens();document.getElementById('credits').classList.remove('hidden');};}
document.getElementById('creditsback').onclick=toMenu;
document.getElementById('archback').onclick=toMenu;
document.getElementById('detailback').onclick=()=>{hideAllScreens();if(detailBack==='archive')openArchive();else if(detailBack==='victory'){state='victory';document.getElementById('victory').classList.remove('hidden');}else if(detailBack==='gameover'){state='gameover';document.getElementById('gameover').classList.remove('hidden');}else toMenu();};
document.getElementById('go-detail').onclick=()=>{if(lastRecord)openDetail(lastRecord,'gameover');};
document.getElementById('vy-detail').onclick=()=>{if(lastRecord)openDetail(lastRecord,'victory');};

