/* ===== WEAPONS ===== */
const WEAPONS={
bolt:{name:'Pulse Bolt',icon:'➤',color:'#00e5d4',max:8,desc:l=>`${1+Math.floor(l/2)} fast bolt(s), pierce ${2+Math.floor(l/3)}, long range.`,
 stats(l,P){return{damage:(12+l*5)*P.damageMult,count:1+Math.floor(l/2)+P.extraProj,pierce:2+Math.floor(l/3)+P.pierceBonus,speed:720*P.projSpeed,life:2.2*P.projLife,r:6.5*P.area};},
 cd(l,P){return Math.max(0.18,0.55-l*0.045)*P.cdMul*P.charCdMul;},
 fire(P,st){const t=nearestEnemy(P.x,P.y);if(!t)return;const b=Math.atan2(t.y-P.y,t.x-P.x);for(let i=0;i<st.count;i++){const a=b+(st.count>1?(i-(st.count-1)/2)*0.12:0);pjs.push({x:P.x,y:P.y,vx:Math.cos(a)*st.speed,vy:Math.sin(a)*st.speed,r:st.r,dmg:st.damage,pierce:st.pierce,life:st.life,color:this.color,kind:'bolt',hit:new Set()});}}},
orbit:{name:'Mini Suns',icon:'\u2609',color:'#ffd24b',max:6,continuous:true,desc:l=>`${l} mini sun${l>1?'s':''} orbit you, burning all they touch. Every hit stokes INFERNO, the spark of an Abyssal Collapse.`,
 stats(l,P){return{count:Math.min(6,l),radius:(86+l*4)*P.area,dps:(20+l*7)*P.damageMult,hitR:17*P.area};},
 tick(P,l,dt,w){const st=this.stats(l,P);w.orbAngle=(w.orbAngle||0)+dt*2.3;for(let i=0;i<st.count;i++){const a=w.orbAngle+i/st.count*TAU,ox=P.x+Math.cos(a)*st.radius,oy=P.y+Math.sin(a)*st.radius;for(const e of queryNear(ox,oy,st.hitR+60)){if(e._dead)continue;const rr=st.hitR+e.r;if(dist2(ox,oy,e.x,e.y)<rr*rr){addSt(e,'burn',2.4*dt);applyEl(e,'fire',st.dps*dt*0.5);dealDamage(e,st.dps*dt,{tick:true});}}}w._render={count:st.count,radius:st.radius};P._halo={r:st.radius,band:st.hitR+14,dps:st.dps*st.count*1.6};}},
aura:{name:'Lumen Field',icon:'◉',color:'#9b6dff',max:8,continuous:true,desc:l=>`A radiant field scorches all foes in range.`,
 stats(l,P){return{radius:(90+l*14)*P.area,dps:(18+l*7)*P.damageMult};},
 tick(P,l,dt,w){const st=this.stats(l,P);for(const e of queryNear(P.x,P.y,st.radius+60)){if(e._dead)continue;const rr=st.radius+e.r;if(dist2(P.x,P.y,e.x,e.y)<rr*rr){dealDamage(e,st.dps*dt,{tick:true});if(P.char&&P.char.id==='sentinel')applySlow(e,0.6,0.4);}}w._render={radius:st.radius};}},
spread:{name:'Scatter Lance',icon:'≪',color:'#ffc24b',max:8,desc:l=>`A cone of ${4+l} lances toward the nearest pack.`,
 stats(l,P){return{pellets:4+l+P.extraProj,damage:(9+l*3)*P.damageMult,speed:520*P.projSpeed,life:0.95*P.projLife,r:5.5*P.area};},
 cd(l,P){return Math.max(0.34,0.95-l*0.06)*P.cdMul*P.charCdMul;},
 fire(P,st){const t=nearestEnemy(P.x,P.y);if(!t)return;const b=Math.atan2(t.y-P.y,t.x-P.x);for(let i=0;i<st.pellets;i++){const a=b+(st.pellets>1?(i/(st.pellets-1)-0.5)*0.95:0),sp=st.speed*rand(.92,1.08);pjs.push({x:P.x,y:P.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:st.r,dmg:st.damage,pierce:1,life:st.life,color:this.color,kind:'bolt',hit:new Set()});}}},
chain:{name:'Arc Tether',icon:'ϟ',color:'#5cd0ff',max:8,desc:l=>`Lightning chains to ${3+Math.floor(l/2)} foes.`,
 stats(l,P){return{jumps:3+Math.floor(l/2),damage:(26+l*9)*P.damageMult,range:320};},
 cd(l,P){return Math.max(0.42,1.20-l*0.07)*P.cdMul*P.charCdMul;},
 fire(P,st){let cur=nearestEnemy(P.x,P.y,st.range);if(!cur)return;const seen=new Set();let from={x:P.x,y:P.y};for(let j=0;j<=st.jumps&&cur;j++){arcs.push({x1:from.x,y1:from.y,x2:cur.x,y2:cur.y,life:0.18,color:this.color});dealDamage(cur,st.damage);seen.add(cur);from={x:cur.x,y:cur.y};cur=nearestEnemy(from.x,from.y,st.range,seen);}}},
seek:{name:'Seeker Motes',icon:'❂',color:'#ff8ad0',max:8,desc:l=>`${1+Math.floor(l/2)} homing mote(s).`,
 stats(l,P){return{count:1+Math.floor(l/2)+P.extraProj,damage:(20+l*7)*P.damageMult,pierce:2+Math.floor(l/3)+P.pierceBonus,speed:400*P.projSpeed,life:3.0*P.projLife,r:6.5*P.area};},
 cd(l,P){return Math.max(0.48,1.30-l*0.08)*P.cdMul*P.charCdMul;},
 fire(P,st){for(let i=0;i<st.count;i++){const a=Math.random()*TAU;pjs.push({x:P.x,y:P.y,vx:Math.cos(a)*150,vy:Math.sin(a)*150,r:st.r,dmg:st.damage,pierce:st.pierce,life:st.life,color:this.color,kind:'seek',hit:new Set(),speed:st.speed});}}},
fireaoe:{name:'Cinder Bloom',icon:'🔥',color:'#ff7a3c',max:8,desc:l=>`Fiery bloom: burst damage plus burn over time.`,
 stats(l,P){return{radius:(70+l*8)*P.area,dmg:(10+l*3)*P.damageMult,burn:(6+l*3)*P.damageMult};},
 cd(l,P){return Math.max(0.60,1.50-l*0.08)*P.cdMul*P.charCdMul;},
 fire(P,st){const t=nearestEnemy(P.x,P.y);if(!t)return;ring(t.x,t.y,st.radius,this.color);for(const e of queryNear(t.x,t.y,st.radius+40)){if(e._dead)continue;const rr=st.radius+e.r;if(dist2(t.x,t.y,e.x,e.y)<rr*rr){dealDamage(e,st.dmg);applyBurn(e,st.burn,3);}}}},
iceaoe:{name:'Frost Nova',icon:'❄',color:'#7fdfff',max:8,desc:l=>`Nova around you. Damage plus chill (slow).`,
 stats(l,P){return{radius:(90+l*12)*P.area,dmg:(8+l*3)*P.damageMult,slow:Math.max(0.35,0.62-l*0.03),dur:2};},
 cd(l,P){return Math.max(0.70,1.60-l*0.08)*P.cdMul*P.charCdMul;},
 fire(P,st){ring(P.x,P.y,st.radius,this.color);for(const e of queryNear(P.x,P.y,st.radius+40)){if(e._dead)continue;const rr=st.radius+e.r;if(dist2(P.x,P.y,e.x,e.y)<rr*rr){dealDamage(e,st.dmg);applySlow(e,st.slow,st.dur);}}}},
bleedaoe:{name:'Rupture',icon:'🩸',color:'#ff3b5e',max:8,desc:l=>`Stacking bleed on the nearest pack.`,
 stats(l,P){return{radius:(60+l*7)*P.area,dmg:(8+l*2)*P.damageMult,bleed:(8+l*4)*P.damageMult};},
 cd(l,P){return Math.max(0.55,1.30-l*0.07)*P.cdMul*P.charCdMul;},
 fire(P,st){const t=nearestEnemy(P.x,P.y);if(!t)return;ring(t.x,t.y,st.radius,this.color);for(const e of queryNear(t.x,t.y,st.radius+40)){if(e._dead)continue;const rr=st.radius+e.r;if(dist2(t.x,t.y,e.x,e.y)<rr*rr){dealDamage(e,st.dmg);applyBleed(e,st.bleed,4);}}}},
poison:{name:'Venom Spores',icon:'☣',color:'#9bff5c',max:8,desc:l=>`Toxic cloud, stacking poison.`,
 stats(l,P){return{radius:(70+l*8)*P.area,dmg:(5+l*2)*P.damageMult,poison:(6+l*3)*P.damageMult};},
 cd(l,P){return Math.max(0.60,1.50-l*0.07)*P.cdMul*P.charCdMul;},
 fire(P,st){const t=nearestEnemy(P.x,P.y);if(!t)return;ring(t.x,t.y,st.radius,this.color);for(const e of queryNear(t.x,t.y,st.radius+40)){if(e._dead)continue;const rr=st.radius+e.r;if(dist2(t.x,t.y,e.x,e.y)<rr*rr){dealDamage(e,st.dmg);applyPoison(e,st.poison,5);}}}},
sling:{name:'Slingshot',icon:'◓',color:'#cdd6e8',max:8,desc:l=>`Heavy slug, big knockback, ricochets to ${1+Math.floor(l/3)} more.`,
 stats(l,P){return{damage:(20+l*6)*P.damageMult,bounce:1+Math.floor(l/3),speed:600*P.projSpeed,life:1.4*P.projLife,r:8*P.area};},
 cd(l,P){return Math.max(0.45,1.00-l*0.06)*P.cdMul*P.charCdMul;},
 fire(P,st){const t=nearestEnemy(P.x,P.y);if(!t)return;const a0=Math.atan2(t.y-P.y,t.x-P.x),__n=1+(P.extraProj||0);for(let __i=0;__i<__n;__i++){const a=a0+(__i-(__n-1)/2)*(__n>1?0.07:0);pjs.push({x:P.x,y:P.y,vx:Math.cos(a)*st.speed,vy:Math.sin(a)*st.speed,r:st.r,dmg:st.damage,pierce:1,bounce:st.bounce,life:st.life,color:this.color,kind:'sling',hit:new Set()});}}},
spirit:{name:'Spirit Lash',icon:'༄',color:'#b8a3ff',max:8,desc:l=>`${1+Math.floor(l/3)} ethereal wisp(s) that pass through all.`,
 stats(l,P){return{count:1+Math.floor(l/3)+P.extraProj,damage:(14+l*5)*P.damageMult,speed:330*P.projSpeed,life:2.6*P.projLife,r:7*P.area};},
 cd(l,P){return Math.max(0.50,1.20-l*0.07)*P.cdMul*P.charCdMul;},
 fire(P,st){for(let i=0;i<st.count;i++){const a=Math.random()*TAU;pjs.push({x:P.x,y:P.y,vx:Math.cos(a)*150,vy:Math.sin(a)*150,r:st.r,dmg:st.damage,pierce:999,life:st.life,color:this.color,kind:'seek',hit:new Set(),speed:st.speed,spirit:true});}}},
chaos:{name:'Chaos Bolt',icon:'✲',color:'#ff5cf0',max:8,desc:l=>`Random foe, wildly unstable chaos damage.`,
 stats(l,P){return{lo:(6+l*2)*P.damageMult,hi:(6+l*2)*4*P.damageMult,speed:560*P.projSpeed,life:1.8*P.projLife,r:7*P.area,pierce:2+Math.floor(l/4)};},
 cd(l,P){return Math.max(0.50,1.10-l*0.06)*P.cdMul*P.charCdMul;},
 fire(P,st){let tgt=null,n=0;for(const e of enemies){if(e._dead)continue;if(Math.random()<1/(++n))tgt=e;}if(!tgt)return;const a=Math.atan2(tgt.y-P.y,tgt.x-P.x),dmg=rand(st.lo,st.hi);pjs.push({x:P.x,y:P.y,vx:Math.cos(a)*st.speed,vy:Math.sin(a)*st.speed,r:st.r,dmg,pierce:st.pierce,life:st.life,color:this.color,kind:'bolt',hit:new Set()});}},
/* v4 weapons */
rifle:{name:'Sharpshooter',icon:'🎯',color:'#ff5a6e',max:8,desc:l=>`A long shot that obliterates one target. Devastating in a Sniper's hands.`,
 stats(l,P){const sig=(P.char&&P.char.id==='sniper')?3.0:1;return{damage:(40+l*18)*P.damageMult*sig,pierce:2+Math.floor(l/3)+P.pierceBonus,speed:1200*P.projSpeed,life:2.0*P.projLife,r:6*P.area};},
 cd(l,P){const sig=(P.char&&P.char.id==='sniper')?0.85:1.15;return Math.max(0.32,(1.05-l*0.05)*sig)*P.cdMul*P.charCdMul;},
 fire(P,st){const t=nearestEnemy(P.x,P.y);if(!t)return;const a0=Math.atan2(t.y-P.y,t.x-P.x),__n=1+(P.extraProj||0);for(let __i=0;__i<__n;__i++){const a=a0+(__n>1?(__i-(__n-1)/2)*0.06:0);pjs.push({x:P.x,y:P.y,vx:Math.cos(a)*st.speed,vy:Math.sin(a)*st.speed,srcW:'rifle',r:st.r,dmg:st.damage,pierce:st.pierce,life:st.life,color:this.color,kind:'bolt',hit:new Set(),big:true});}}},
fists:{name:'Iron Fists',icon:'✊',color:'#ffe27a',max:8,continuous:true,desc:l=>`Martial strikes batter everything in arm's reach, alternating fists with knockback.`,
 stats(l,P){return{reach:(58+l*5)*P.area,dps:(40+l*13)*P.damageMult,rate:3.2+l*0.25,knock:240*(P.knockMul||1)};},
 tick(P,l,dt,w){const st=this.stats(l,P);w.punchT=(w.punchT||0)-dt;w.punchAng=(w.punchAng||0);
  if(w.punchT<=0){w.punchT=1/st.rate;w.punchAng=Math.atan2((P.pvy||0),(P.pvx||0));const t=nearestEnemy(P.x,P.y,st.reach+40);if(t)w.punchAng=Math.atan2(t.y-P.y,t.x-P.x);w.punchSide=-(w.punchSide||1);w.punchFlash=0.12;
   const hx=P.x+Math.cos(w.punchAng)*st.reach*0.6,hy=P.y+Math.sin(w.punchAng)*st.reach*0.6;
   for(const e of queryNear(hx,hy,st.reach)){if(e._dead)continue;const rr=st.reach*0.7+e.r;if(dist2(hx,hy,e.x,e.y)<rr*rr){dealDamage(e,st.dps/st.rate*3,{});const kx=e.x-P.x,ky=e.y-P.y,kd=Math.hypot(kx,ky)||1,m=Math.max(0.6,e.m||e.r*e.r/100);e.kvx=(e.kvx||0)+kx/kd*st.knock/m;e.kvy=(e.kvy||0)+ky/kd*st.knock/m;}}
   burst(hx,hy,'#ffe27a',3);}
  if(w.punchFlash>0)w.punchFlash-=dt;
  w._render={reach:st.reach,ang:w.punchAng,flash:w.punchFlash||0,side:w.punchSide||1};}},
saber:{name:'Light Saber',icon:'⚔',color:'#7fe6ff',max:8,continuous:true,desc:l=>`Whirling blades cleave everything close. On Vyper: longer reach, huge knockback, up to 8 blades.`,
 stats(l,P){const vy=P.char&&P.char.id==='vyper';return{blades:vy?Math.min(8,2+Math.floor(l*0.75)):1+Math.floor(l/3),radius:(vy?64+l*7:54+l*4)*P.area,dps:(30+l*10)*P.damageMult,hitR:(vy?30:22)*P.area,knock:(vy?6:3)*(P.knockMul||1),omega:4.5/Math.max(0.35,P.cdMul*P.charCdMul)};},
 tick(P,l,dt,w){const st=this.stats(l,P);w.orbAngle=(w.orbAngle||0)+dt*st.omega;for(let i=0;i<st.blades;i++){const a=w.orbAngle+i/st.blades*TAU,ox=P.x+Math.cos(a)*st.radius,oy=P.y+Math.sin(a)*st.radius;for(const e of queryNear(ox,oy,st.hitR+60)){if(e._dead)continue;const rr=st.hitR+e.r;if(dist2(ox,oy,e.x,e.y)<rr*rr){dealDamage(e,st.dps*dt,{tick:true});
   if((e._flingT||0)<=0){e._flingT=0.22;const m=Math.max(0.6,e.m||e.r*e.r/100),rim=st.omega*st.radius,fl=rim*(st.knock/6)/m;
    const tx=-Math.sin(a),ty=Math.cos(a),kx=e.x-P.x,ky=e.y-P.y,kd=Math.hypot(kx,ky)||1;
    e.kvx=(e.kvx||0)+(tx*0.85+kx/kd*0.35)*fl;e.kvy=(e.kvy||0)+(ty*0.85+ky/kd*0.35)*fl;}}}}w._render={blades:st.blades,radius:st.radius,hitR:st.hitR};}},
lightaoe:{name:'Storm Caller',icon:'⚡',color:'#bfe3ff',max:8,desc:l=>`Calls lightning onto ${2+Math.floor(l/2)} nearby foes, chilling them.`,
 stats(l,P){return{strikes:2+Math.floor(l/2),damage:(16+l*6)*P.damageMult,radius:420*P.area};},
 cd(l,P){return Math.max(0.55,1.30-l*0.07)*P.cdMul*P.charCdMul;},
 fire(P,st){const cand=queryNear(P.x,P.y,st.radius).filter(e=>!e._dead);for(let i=0;i<st.strikes&&cand.length;i++){const e=cand[randi(0,cand.length-1)];arcs.push({x1:e.x,y1:e.y-120,x2:e.x,y2:e.y,life:0.18,color:this.color});ring(e.x,e.y,40*P.area,this.color);dealDamage(e,st.damage);applySlow(e,0.6,1.2);}}},
deflect:{name:'Deflector Field',icon:'◈',color:'#9bd0ff',max:8,continuous:true,desc:l=>`Shatters incoming enemy fire and shocks nearby foes.`,
 stats(l,P){return{radius:(70+l*10)*P.area,dps:(8+l*3)*P.damageMult};},
 tick(P,l,dt,w){const st=this.stats(l,P);P._deflectR=st.radius;for(const e of queryNear(P.x,P.y,st.radius+40)){if(e._dead)continue;const rr=st.radius+e.r;if(dist2(P.x,P.y,e.x,e.y)<rr*rr)dealDamage(e,st.dps*dt,{tick:true});}w._render={radius:st.radius};}},
siege:{name:'Siege Breaker',icon:'☠',color:'#ffd24b',max:8,desc:l=>`Modest against fodder, devastating to elites & bosses (x${(2.5+l*0.3).toFixed(1)}).`,
 stats(l,P){return{damage:(14+l*5)*P.damageMult,eliteMul:2.5+l*0.3,speed:560*P.projSpeed,life:1.8*P.projLife,r:8*P.area,pierce:1};},
 cd(l,P){return Math.max(0.5,1.10-l*0.06)*P.cdMul*P.charCdMul;},
 fire(P,st){const t=nearestEnemy(P.x,P.y);if(!t)return;const a=Math.atan2(t.y-P.y,t.x-P.x);pjs.push({x:P.x,y:P.y,vx:Math.cos(a)*st.speed,vy:Math.sin(a)*st.speed,r:st.r,dmg:st.damage,eliteMul:st.eliteMul,pierce:st.pierce,life:st.life,color:this.color,kind:'bolt',hit:new Set()});}},
glint:{name:'Glintblade',icon:'🗡',color:'#7b9bff',max:8,desc:l=>`Conjures ${3+l} spectral swords that fan out and pierce.`,
 stats(l,P){return{count:3+l+P.extraProj,damage:(11+l*4)*P.damageMult,speed:560*P.projSpeed,life:1.5*P.projLife,r:6*P.area,pierce:3+Math.floor(l/2)+P.pierceBonus};},
 cd(l,P){return Math.max(0.5,1.20-l*0.07)*P.cdMul*P.charCdMul;},
 fire(P,st){const t=nearestEnemy(P.x,P.y);const b=t?Math.atan2(t.y-P.y,t.x-P.x):Math.random()*TAU;for(let i=0;i<st.count;i++){const a=b+(st.count>1?(i/(st.count-1)-0.5)*1.0:0);pjs.push({x:P.x,y:P.y,vx:Math.cos(a)*st.speed,vy:Math.sin(a)*st.speed,r:st.r,dmg:st.damage,pierce:st.pierce,life:st.life,color:this.color,kind:'bolt',hit:new Set()});}}},
chaosspirit:{name:'Chaos Spirit',icon:'☄',color:'#d65cff',max:8,desc:l=>`${1+Math.floor(l/3)} chaos spirit(s) that home and pierce all.`,
 stats(l,P){return{count:1+Math.floor(l/3)+P.extraProj,lo:(10+l*3)*P.damageMult,hi:(10+l*3)*3*P.damageMult,speed:300*P.projSpeed,life:3.0*P.projLife,r:7*P.area};},
 cd(l,P){return Math.max(0.6,1.40-l*0.07)*P.cdMul*P.charCdMul;},
 fire(P,st){for(let i=0;i<st.count;i++){const a=Math.random()*TAU,dmg=rand(st.lo,st.hi);pjs.push({x:P.x,y:P.y,vx:Math.cos(a)*150,vy:Math.sin(a)*150,r:st.r,dmg,pierce:999,life:st.life,color:this.color,kind:'seek',hit:new Set(),speed:st.speed,spirit:true});}}},
duality:{name:'Catalyst',icon:'⚛',color:'#d65cff',max:8,desc:l=>`Hurls a catalyst orb that bursts on the nearest pack, fusing Lightning and Plasma into an instant OVERLOAD. Heavy damage, and it scatters the crowd.`,
 stats(l,P){return{radius:(86+l*9)*P.area,dmg:(26+l*9)*P.damageMult,speed:430*P.projSpeed,life:1.6*P.projLife,r:11*P.area,count:1+P.extraProj};},
 cd(l,P){return Math.max(0.55,1.25-l*0.07)*P.cdMul*P.charCdMul;},
 fire(P,st){const t=nearestEnemy(P.x,P.y);const base=t?Math.atan2(t.y-P.y,t.x-P.x):Math.random()*TAU;const n=st.count||1;for(let i=0;i<n;i++){const a=base+(n>1?(i-(n-1)/2)*0.26:0);pjs.push({x:P.x,y:P.y,vx:Math.cos(a)*st.speed,vy:Math.sin(a)*st.speed,r:st.r,dmg:st.dmg,pierce:1,life:st.life,color:this.color,kind:'catalyst',hit:new Set(),burstR:st.radius});}}},
trident:{name:'Triton Burst',icon:'\u2942',color:'#4bd8ff',max:8,continuous:true,desc:l=>`Hammers a ${3+(l>=8?2:(l>=5?1:0))}-round burst. ${(24+l*9)} damage per round, pierce ${2+Math.floor(l/3)}. The dock boss picks his teeth with this.`,
 stats(l,P){return{damage:(24+l*9)*P.damageMult,count:1+P.extraProj,pierce:2+Math.floor(l/3)+P.pierceBonus,speed:950*P.projSpeed,life:1.8*P.projLife,r:6*P.area,burst:3+(l>=8?2:(l>=5?1:0)),cad:0.065};},
 cd(l,P){return Math.max(0.24,0.78-l*0.06)*P.cdMul*P.charCdMul;},
 tick(P,l,dt,w){const st=this.stats(l,P);w._cd=(w._cd||0)-dt;
  const shoot=()=>{const t=nearestEnemy(P.x,P.y);if(!t)return false;const b=Math.atan2(t.y-P.y,t.x-P.x);
   for(let i=0;i<st.count;i++){const a=b+(st.count>1?(i-(st.count-1)/2)*0.09:0)+rand(-0.015,0.015);
    pjs.push({x:P.x+Math.cos(a)*P.r,y:P.y+Math.sin(a)*P.r,vx:Math.cos(a)*st.speed,vy:Math.sin(a)*st.speed,r:st.r,dmg:st.damage,pierce:st.pierce,life:st.life,color:this.color,kind:'bolt',hit:new Set()});}
   if(particles.length<430)particles.push({x:P.x+Math.cos(b)*(P.r+8),y:P.y+Math.sin(b)*(P.r+8),vx:Math.cos(b)*220,vy:Math.sin(b)*220,life:0.12,color:'#bfefff',r:2.2});
   return true;};
  if((w._bq||0)>0){w._bt=(w._bt||0)-dt;if(w._bt<=0){w._bt=st.cad;if(shoot())w._bq--;else w._bq=0;}}
  else if(w._cd<=0){if(shoot()){w._cd=this.cd(l,P)*P.fieldHaste;w._bq=st.burst-1;w._bt=st.cad;}else w._cd=0.12;}}},
};
function isBig(e){return e.boss||e.legendary||e.warden||e.finalboss;}
