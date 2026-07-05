/* ===== CODEX / GUIDES ===== */
const ST_INFO={
 burn:{name:'Burn',el:'fire',txt:'Fire damage over time. Stacks add up fast: 1 stack is 4 dmg/sec, 50 stacks is 200/sec. Hit 300 stacks on one target and the whole screen ignites.'},
 chill:{name:'Chill',el:'ice',txt:'Ice slows enemies. More stacks, slower foes. Pairs beautifully with anything that wants targets to sit still.'},
 shock:{name:'Shock',el:'lightning',txt:'Lightning damage over time that loves a crowd. Cheap to apply, great for softening packs.'},
 corr:{name:'Corrosion',el:'toxic',txt:'Toxic rot that eats hull steadily. The patient killer.'},
 rad:{name:'Radiation',el:'radiation',txt:'Nuclear decay damage. Feeds the Mutation reaction for fatter loot.'},
 mark:{name:'Marked',el:'void',txt:'Void brand. Marked enemies take escalating bonus damage from every hit, up to +75%.'},
 weak:{name:'Weakened',el:'plasma',txt:'Plasma overload. Weakened enemies hit you softer. Survival through suppression.'},
 bleed:{name:'Bleed',el:'kinetic',txt:'Raw kinetic wounds that drip damage. The honest status.'}};
const REACT_INFO=[
 ['fire','ice','Thermal Shock','A shock burst that knocks the whole pack outward. If the target was frozen, it shatters for far more and clears the freeze.'],
 ['fire','toxic','Combustion','Drops a burning fire pool on the ground. Anything that stands in it keeps taking fire damage.'],
 ['lightning','toxic','Chain Storm','A six jump lightning chain, and it leaves a conductive zone behind that keeps zapping anything that walks in.'],
 ['lightning','plasma','Overload','A hard scatter that flings enemies away and briefly stuns everyone caught in it.'],
 ['fire','void','Entropy','Burn loses its ceiling and snowballs, plus a void rift opens that pulls enemies inward. Soak them, then ignite.'],
 ['radiation','toxic','Mutation','The enemy grows stronger but drops far richer loot, and lets out a fear pulse that sends nearby fodder fleeing. Risk for reward.'],
 ['ice','lightning','Superconduct','The target takes +50% from everything, and a frozen ground zone forms that slows all who cross it.'],
 ['ice','void','Absolute Zero','Total freeze. The enemy locks solid and becomes an immovable wall the horde piles into.'],
 ['fire','lightning','Swirl','Spreads the strongest status on the target out to every enemy nearby. Turn one burning foe into a burning crowd.'],
 ['kinetic','void','Crystallize','Drops a crystal shard. Walk over it for a chunk of shield, or hull if you have no shield.'],
 ['toxic','plasma','Bloom','Plants a seed that blooms after about 1.5 seconds, detonating on the nearest pack with a homing burst.'],
 ['ice','toxic','Corrosive Mist','Lays down a poison fog that stacks corrosion and slows everything caught inside it.'],
 ['lightning','void','Magnetize','Opens a strong pull rift that yanks enemies into a tight cluster. Set it up, then blow the cluster apart.'],
 ['fire','radiation','Irradiate','Leaves a radioactive zone that applies radiation and makes everything inside take extra damage.']];
const ITEM_INFO=[
 ['◈','#ffc24b','Credit Cache','Pickup','Loose salvage. Bank it. Credits feed your greed perks and the run archive.'],
 ['❤','#ff5a6e','Repair Cell','Pickup','Patches a chunk of hull back on. Grab it before the next wave reads you.'],
 ['⊚','#5cd0ff','Resonance Magnet','Pickup','Every resonance orb on the whole map screams toward you at once. Pure dopamine.'],
 ['✸','#ffc24b','Void Burst','Pickup','Wipes the entire floor of fodder in one flash. Rare, on a cooldown, and always satisfying.'],
 ['❖','#9bd0ff','Supply Cache','Map Drop','Walk over it for an instant gacha pull. Bigger foes guard the best ones.'],
 ['◆','#6cffb0','Resonance Orb','Pickup','The deep\'s currency for power. Collect it to level up and reshape your build.'],
 ['◉','#00e5d4','Acceleration Lane','Terrain','The glowing teal roads. Ride one for faster movement, faster fire, and a damage bump.']];
const HAZ_INFO=[
 ['⊙','#b07bff','Black Hole','The Singularity\'s gift. It drags you toward a lethal core and pulls enemies in to be crushed. Respect it. Route around it. Or use Event Ward and laugh.'],
 ['☀','#ffb04b','Solar Storm','Standing fire fields from the Solar Construct. Walk out, do not camp.'],
 ['☄','#ff9b4b','Meteor Strike','Corruption rain. Telegraphed, then it lands hard. The blast clears enemies too if you bait them in.']];
const CHAIN_INFO=[
 ['Burn x3','Inferno','Stack burn to 12 and it ignites into Inferno, a hotter self feeding blaze.','#ff9b3c'],
 ['Inferno + Toxic','Plaguefire','Poison the flame. It becomes Plaguefire and melts hull at terrifying speed.','#b6ff5c'],
 ['Plaguefire + Void','Abyssal Collapse','The deep folds inward. A crushing implosion that drags and devastates everything nearby.','#9b6dff']];
const MOD_INFO=[
 ['\u26a1','#ffb04b','Volatile','Explodes on death. Kill it at a distance or eat the blast.'],
 ['\ud83e\uddf2','#5cd0ff','Magnetic','Hoards your resonance orbs while alive. Kill it and they all fly home to you.'],
 ['\ud83d\udc7b','#b9c8ff','Phaseborn','Phases in and out of solidity. While ghosted it slips through crowds and walls of bodies.'],
 ['\ud83d\udd25','#ff7a3c','Infernal','Leaves a burning trail. Do not chase it through the fire.'],
 ['\ud83d\udc80','#b6ff3c','Necrotic','Rises once from death at half strength. Kill it twice.']];
function codexEntry(swatch,color,title,tag,body,full){
 title=t(title);if(tag)tag=t(tag);body=t(body);if(full)full=t(full);
 return `<div class="gentry clickable" style="--gc:${color}" data-sw="${swatch}" data-color="${color}" data-title="${encodeURIComponent(title)}" data-tag="${encodeURIComponent(tag||'')}" data-full="${encodeURIComponent(full||body)}"><div class="gswatch" style="color:${color}">${swatch}</div><div class="gtext"><h4>${title}${tag?`<span class="gtag">${tag}</span>`:''}</h4><p>${body}</p></div><span class="gchev">\u203a</span></div>`;}
const CODEX_TABS={
 Items(){let s='<div class="gsectnote">'+t('Things the deep leaves behind. Most of it flies to you the moment you get close. Tap any card for the full read.')+'</div>'+'<div class="gsectnote">'+t('Marked enemies: some foes spawn with a glyph overhead. Learn them fast:')+'</div>'+MOD_INFO.map(m=>codexEntry(m[0],m[1],m[2],'Modifier',m[3])).join('');for(const[i,c,n,t,d] of ITEM_INFO)s+=codexEntry(i,c,n,t,d);s+='<div class="gsectnote" style="margin-top:8px">'+t('Hazards to avoid:')+'</div>';for(const[i,c,n,d] of HAZ_INFO)s+=codexEntry(i,c,n,'Hazard',d);return s;}
 ,Weapons(){let s='<div class="gsectnote">'+t('Your guns fire on their own. Your job is choosing which ones grow. Max a weapon to unlock four Evolution tiers, then feed it elements in the draft. Tap any weapon for the full read.')+'</div>';for(const id in WEAPONS){const w=WEAPONS[id],el=ELEMENTS[WEAPON_EL[id]||'kinetic'];s+=codexEntry(w.icon,w.color,w.name,t(el.name)+' '+t('base'),(typeof w.desc==='function'?faWD(id,1):w.desc||'').replace(/`/g,''));}return s;}
 ,Divers(){let s='<div class="gsectnote">'+t('Six ways to descend. Each one plays a different game. Tap a diver to study them before your next run.')+'</div>';for(const c of CHARS)s+=codexEntry(c.glyph,c.color,c.name,c.role,c.desc);return s;}
 ,Elements(){let s='<div class="gsectnote">'+t('Eight damage types. Every weapon carries exactly one element - its innate one, or the single element you lock in with an Infusion. Land two different elements on the same enemy, from two different weapons, and a Reaction fires.')+'</div>';for(const id in ELEMENTS){const e=ELEMENTS[id],st=ST_INFO[e.st];s+=codexEntry(e.icon,e.color,e.name,'applies '+(st?st.name:e.st),st?st.txt:'');}return s;}
 ,Status(){let s='<div class="gsectnote">'+t('Effects stack as pips over an enemy. The more pips, the harder it bites.')+'</div>';for(const k in ST_INFO){const si=ST_INFO[k],c=(STATUS[k]||{}).color||'#fff',e=ELEMENTS[si.el];s+=codexEntry(e.icon,c,si.name,'from '+e.name,si.txt);}return s;}
 ,Reactions(){let s='<div class="gsectnote">'+t('Land two different elements on the same enemy and the deep answers. There are 14 reactions, and most leave something on the battlefield: fire pools, poison fog, pull rifts, frozen ground, freeze walls, even crystal shards you can grab. Each weapon carries one element for the whole run, so reactions come from pairing different weapons. This is where builds get broken.')+'</div>';for(const[a,b,name,d] of REACT_INFO){const ea=ELEMENTS[a],eb=ELEMENTS[b];s+=`<div class="gentry" style="--gc:${eb.color}"><div class="gtext" style="width:100%"><div class="greact"><span class="gpill" style="color:${ea.color};border-color:${ea.color}">${ea.icon} ${ea.name}</span><span class="gplus">+</span><span class="gpill" style="color:${eb.color};border-color:${eb.color}">${eb.icon} ${eb.name}</span><span class="gplus">=</span><b style="color:#eaf2ff">${name}</b></div><p>${d}</p></div></div>`;}s+='<div class="gsectnote" style="margin-top:10px">'+t('Escalation chains. Stack deeper, burn brighter:')+'</div>';for(const[from,name,d,c] of CHAIN_INFO){s+=`<div class="gentry" style="--gc:${c}"><div class="gtext" style="width:100%"><div class="greact"><span class="gpill" style="color:${c};border-color:${c}">${from}</span><span class="gplus">=</span><b style="color:#eaf2ff">${name}</b></div><p>${d}</p></div></div>`;}return s;}
 ,Combat(){return '<div class="gsectnote">'+t('How the deep actually works. Tap any card to read the whole thing before your next run.')+'</div>'
  +codexEntry('\u25c7','#00e5d4','Dodge, Guard, Parry','Space or the dive button','Every diver has one survival tool. Learn yours first.','Every diver answers danger differently.\n\nMost divers blink a short distance with full invulnerability. Ranger blinks farthest and fastest, on the shortest cooldown in the game. Her whole life is dodge, shotgun, dodge.\n\nVanguard does not dodge. He plants his feet and raises an unbreakable Guard for over a second. While it holds, nothing hurts him and slows wash off his hull.\n\nYujin parries. Tap the button and a quarter second window opens where everything breaks against your fists: bullets, lasers, stampedes, even black hole cores. The parry has only a brief cooldown, so quick taps still open windows back to back. With perfect reads Yujin survives anything. And because he cannot dodge, a black hole would be a guaranteed death, so while caught in one his button instead blinks him out to safety. With lazy thumbs Yujin still dies fast.\n\nRhino charges. The dive button sends him barreling forward, untouchable the whole way, flinging every enemy he touches aside and trampling them for damage. When the charge ends a shockwave bursts out and scatters the rest. Slow on foot, unstoppable in motion.\n\nThe Sorcerer hexes. His button does not move him. Instead he becomes untouchable for a few seconds and mutates the whole swarm around him, turning fodder into richer loot and forcing them to flee. It is his survival button and his early treasure engine at once.')
  +codexEntry('\u23e3','#9b6dff','Shields','Vyper and Sentinel','A permanent field that eats incoming fire.','Vyper and Sentinel carry a permanent energy field that swallows every non boss projectile on contact. It does not block body slams, so keep moving.\n\nEvery other diver earns a recharging Barrier as they level. When the blue bar under your hull is up, you can afford one mistake. Watch it. Tank when it is full, run when it is empty.')
  +codexEntry('\u2605','#ffd24b','Wardens and Boons','Every 5 levels','Kill the giant, claim a permanent gift.','Every fifth level a Warden descends: a giant with a name and a trick. Fell it and you claim a Boon, a permanent change to your run that no draft can offer.\n\nIf a Warden drifts off your screen too long it calls escorts to push you back toward the fight. The deep does not let you ignore its champions.')
  +codexEntry('\u2609','#ffd24b','The Three Suns','L20, L50, L80','Half screen titans that walk with you for entire levels.','Three times on the way down, something the size of half your screen arrives and simply refuses to die fast.\n\nHelios, the Dying Sun. A burning sphere at level 20 that alternates radial rings with aimed bursts.\n\nThe Monolith. A rotating fortress square at level 50, firing cross volleys from its corners and birthing drones.\n\nThe Spear of the Deep. A fast triangle at level 80 that fires from its tip and lunges across the floor at you.\n\nThey are built to last five or more levels beside you. That is on purpose. Fighting a Sun while the horde presses in is the heart of this game. Past level 70 the cycle continues every five levels, and each new Sun arrives with double the hull of the last.')
  +codexEntry('\u265b','#5cd0ff','Named Wardens','The rotation','Learn their faces. They do not change their tricks.','The Collector vacuums your resonance orbs into a hoard while it lives. Kill it and everything it stole erupts back, magnetized to you with interest.\n\nThe Judge marks you with a gold sigil. While judged you take thirty percent more from everything. Kill it fast or play like a coward for five seconds.\n\nThe Twin divides at half health into two faster copies. The Boon comes when the last one falls.\n\nThe Shepherd never stops calling its flock, with something Epic every third call.\n\nTitan, the Solar Construct, and the Singularity round out the rotation with raw violence, sun fields, and black holes.')
  +codexEntry('\u29d6','#ff3df0','The Leviathan','Level 90','The biggest thing in the game. Everything stops for it.','At level 90 the deep holds its breath. Leveling freezes. The horde stops spawning. And a circle nearly a thousand pixels wide rises to meet you.\n\nThe Leviathan births one of the original Suns every sixty seconds while it lives. Kill it and the deep exhales: ascent resumes, the horde returns, and level 100 waits.\n\nThis is the wall before the door. Bring your whole build.')
  +codexEntry('\u26a0','#8a6bd8','Hazards of the Floor','Read the telegraphs','Tar, black holes, solar fields, meteors. The floor itself fights you.','Tar Fields ripple for a moment before they set. Step in one and your thrusters bog down: movement drops hard until you escape. Vanguard, Sentinel and Yujin resist the pull. Vanguard inside his Guard ignores it completely.\n\nBlack Holes drag everything toward a crushing core, and the Singularity likes to drop them ahead of where you are running, not behind.\n\nSolar fields burn anything that lingers. Meteors mark the ground before they land. Every hazard in this game announces itself once. After that, it assumes you were listening.')
  +codexEntry('\u23f3','#6cffb0','The Pace of the Deep','How leveling works','The deep feeds you on its own schedule. About 18 minutes to the floor.','Resonance is not a faucet you can force open. The deep meters what it feeds you.\n\nThe first 20 levels come one choice at a time and you will feel the grind. After that, a draft opens every fifth level, with your final pick at 95. Push your build hard and you will run a little ahead of schedule. The deep notices, and tightens the flow until the floor catches up.\n\nA full descent to level 100 takes fifteen to twenty minutes. At level 40 the Seal breaks and kills feed you directly, no orbs on the floor. Objectives, Wardens and the Suns are how you get rich faster than the schedule allows.')
  +codexEntry('\u2630','#3cc8ff','Reading Your Build','Tab or the corner button','One panel that shows everything you are.','Press Tab, or the small corner button on touch, and your whole run opens in one card: every weapon with its stars and evolution tier, every augment, every element you carry, and which Reactions are live right now.\n\nCheck it before every draft. The best pick is usually the one that completes a pair, not the one with the biggest number.')
  +codexEntry('\u2620','#ff3df0','The Corruption','Past level 100','Beat the deep, then let it rewrite itself.','Reach level 100, watch the victory, then choose to keep going. The Corruption rewrites the rules: every level past 100 raises the tier, stacks a brutal modifier, and sends another named Warden down after you.\n\nA fresh draft opens every 10 corrupted levels and a Boon lands every 20. The level counter itself starts to lie to you. Words appear that should not.\n\nThe floor of the world sits at C100. Nothing descends further. Nothing needs to.');}
};
let codexCur='Items';
function openCodexDetail(g){const d=document.getElementById('codexdetail');
 document.getElementById('cdsw').textContent=g.dataset.sw;document.getElementById('cdsw').style.color=g.dataset.color;
 document.querySelector('.cdbox').style.setProperty('--cdg',g.dataset.color);
 document.getElementById('cdtitle').textContent=decodeURIComponent(g.dataset.title);
 const tg2=decodeURIComponent(g.dataset.tag||'');const te=document.getElementById('cdtag');te.textContent=tg2;te.style.display=tg2?'':'none';
 document.getElementById('cdbody').textContent=decodeURIComponent(g.dataset.full);
 d.classList.remove('hidden');}
function openCodex(){hideAllScreens();state='codex';const tabs=document.getElementById('codextabs');tabs.innerHTML='';
 try{const cb=document.getElementById('codexbody');cb.onclick=e=>{const g=e.target.closest?e.target.closest('.gentry.clickable'):null;if(g)openCodexDetail(g);};
  document.getElementById('cdclose').onclick=()=>document.getElementById('codexdetail').classList.add('hidden');
  document.getElementById('codexdetail').onclick=e=>{if(e.target.id==='codexdetail')e.target.classList.add('hidden');};}catch(e){}
 Object.keys(CODEX_TABS).forEach(name=>{const b=document.createElement('div');b.className='ctab'+(name===codexCur?' on':'');b.textContent=name;b.onclick=()=>{codexCur=name;openCodex();};tabs.appendChild(b);});
 document.getElementById('codexbody').innerHTML=CODEX_TABS[codexCur]();
 document.getElementById('codex').classList.remove('hidden');try{trDyn(document.getElementById('codex'));}catch(e){}}
// TELEGRAM MINI APP: init, identity, theme, main button
let TG=null,TG_USER={id:'guest',username:'Guest',first_name:'Player'},TG_SHARE='';
const TG_BOT='AbyssSurvivorsbot',TG_APP='play'; // TELEGRAM MINI APP: set TG_APP to your /newapp short name
let TG_START='',linkedGroup='',incomingParty='';
try{
 if(window.Telegram&&window.Telegram.WebApp){
  TG=window.Telegram.WebApp;
  TG.ready(); // TELEGRAM MINI APP: signal ready (script runs at end of body, DOM is parsed)
  try{TG.expand();}catch(e){}
  // FULLSCREEN: claim the entire screen for more canvas + immersion (Bot API 8.0+); gracefully no-ops on older clients.
  try{
   if(typeof TG.disableVerticalSwipes==='function')TG.disableVerticalSwipes(); // dragging to move must never pull-to-close
   var _onTGViewport=function(){try{applyTGInsets();}catch(e){}try{resize();}catch(e){}};
   try{TG.onEvent('safeAreaChanged',applyTGInsets);}catch(e){}
   try{TG.onEvent('contentSafeAreaChanged',applyTGInsets);}catch(e){}
   try{TG.onEvent('fullscreenChanged',_onTGViewport);}catch(e){}
   try{TG.onEvent('fullscreenFailed',applyTGInsets);}catch(e){}
   try{TG.onEvent('viewportChanged',_onTGViewport);}catch(e){}
   if(typeof TG.unlockOrientation==='function')try{TG.unlockOrientation();}catch(e){} // allow portrait AND landscape
   if(typeof TG.requestFullscreen==='function')try{TG.requestFullscreen();}catch(e){}
  }catch(e){}
  try{applyTGInsets();}catch(e){}
  const __u=TG.initDataUnsafe&&TG.initDataUnsafe.user;
  if(__u)TG_USER={id:__u.id,username:__u.username||'',first_name:__u.first_name||'',photo:__u.photo_url||''};
  // TELEGRAM MINI APP: deep-link foundation (group + party invites)
  try{TG_START=(TG.initDataUnsafe&&TG.initDataUnsafe.start_param)||'';
   if(TG_START.indexOf('group_')===0){linkedGroup=TG_START.slice(6);setTimeout(()=>{try{toast('GROUP LINK ESTABLISHED');if(TG_USER&&TG_USER.id!=='guest')apiFetch('group',{id:String(TG_USER.id),group:linkedGroup}).catch(()=>{});}catch(e){}},900);}
   else if(TG_START.indexOf('party_')===0){incomingParty=TG_START.slice(6);setTimeout(()=>{try{toast('PARTY SIGNAL RECEIVED \u00b7 docks open soon');}catch(e){}},900);}
  }catch(e){}
  // TELEGRAM MINI APP: theme sync
  try{const __sc=TG.colorScheme||'dark';
   if(document.documentElement&&document.documentElement.setAttribute){document.documentElement.setAttribute('data-tg-theme',__sc);if(document.documentElement.classList)document.documentElement.classList.add('tg-'+__sc);}}catch(e){}
  // TELEGRAM MINI APP: main button (shown only on run-end screens)
  TG.MainButton.setText('Share Score');
  TG.MainButton.onClick(()=>{try{
   if(TG_SHARE&&navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(TG_SHARE);
   if(TG.HapticFeedback)TG.HapticFeedback.notificationOccurred('success');
   toast('SCORE COPIED \u00b7 PASTE IT ANYWHERE');
  }catch(e){}});
 }
}catch(e){}
// ---- SECURE RELAY TRANSPORT (V8) ----
// Every API call now carries the raw Telegram initData so the server can verify WHO is talking
// (HMAC signed by Telegram). esc()/safePhoto() harden every render of other players' data.
let TG_INIT='';try{TG_INIT=(TG&&TG.initData)||'';}catch(e){}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function safePhoto(u){u=String(u||'');return (/^https:\/\/[\w.\-\/%?=&+]+$/.test(u))?u:'';}
function apiFetch(action,body){const h={'Content-Type':'application/json'};if(TG_INIT)h['x-tg-init']=TG_INIT;return fetch('/api/social?action='+encodeURIComponent(action),{method:'POST',headers:h,body:JSON.stringify(body||{})});}
// TELEGRAM MINI APP: share text + button visibility helpers
// Combine device safe-area + Telegram content safe-area (the fullscreen close-button zone) into CSS inset vars.
var TGINS={top:0,bottom:0,left:0,right:0};
function applyTGInsets(){
 try{
  var sa=(TG&&TG.safeAreaInset)||null, ca=(TG&&TG.contentSafeAreaInset)||null;
  if(!sa&&!ca)return; // no TG insets available -> CSS env() fallback stays in effect
  sa=sa||{top:0,bottom:0,left:0,right:0}; ca=ca||{top:0,bottom:0,left:0,right:0};
  var t=(sa.top||0)+(ca.top||0), b=(sa.bottom||0)+(ca.bottom||0), l=(sa.left||0)+(ca.left||0), r=(sa.right||0)+(ca.right||0);
  TGINS.top=t;TGINS.bottom=b;TGINS.left=l;TGINS.right=r;
  var st=document.documentElement.style;
  st.setProperty('--ins-top','max(env(safe-area-inset-top,0px),'+t+'px)');
  st.setProperty('--ins-bottom','max(env(safe-area-inset-bottom,0px),'+b+'px)');
  st.setProperty('--ins-left','max(env(safe-area-inset-left,0px),'+l+'px)');
  st.setProperty('--ins-right','max(env(safe-area-inset-right,0px),'+r+'px)');
 }catch(e){}
}
// TELEGRAM MINI APP: haptic engine (soft, creamy, reactive)
let _hapBudget=0,_hapT=0;
function hap(kind,style){try{if(!OPT.vibration)return;if(!TG||!TG.HapticFeedback)return;const now=performance.now();
 if(now>_hapT){_hapT=now+90;_hapBudget=3;}
 if(kind==='impact'){if(_hapBudget<=0)return;_hapBudget--;const s=style||'soft';TG.HapticFeedback.impactOccurred(s==='heavy'?'medium':s);}
 else if(kind==='notify')TG.HapticFeedback.notificationOccurred(style||'success');
 else if(kind==='select')TG.HapticFeedback.selectionChanged();
}catch(e){}}
function hapPop(){try{if(!OPT.vibration)return;if(!TG||!TG.HapticFeedback)return;TG.HapticFeedback.impactOccurred('soft');setTimeout(function(){try{TG.HapticFeedback.impactOccurred('light');}catch(e){}},55);}catch(e){}}
