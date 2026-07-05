/* ===== ELEMENTAL GROUND ZONES (battlefield states left by reactions) =====
   Cheap pooled list. Each zone lingers, affects enemies/player standing in it,
   then fades. Capped + quality-gated so hordes stay smooth on low-end mobile. */
let zones=[];let seeds=[];
const ZONE_CAP_BY_Q={potato:0,low:8,medium:16,ultra:26};
function zoneCap(){return ZONE_CAP_BY_Q[OPT.quality]!=null?ZONE_CAP_BY_Q[OPT.quality]:16;}
function addZone(z){
 const cap=zoneCap();if(cap<=0)return null;
 // merge into a same-type zone if one is very close (keeps the list short, feels natural)
 for(const o of zones){if(o.type===z.type&&!o._dead){const dx=o.x-z.x,dy=o.y-z.y;if(dx*dx+dy*dy<(o.r*0.6)*(o.r*0.6)){o.life=Math.max(o.life,z.life);o.r=Math.min(z.r*1.5,Math.max(o.r,z.r));return o;}}}
 if(zones.length>=cap){let oi=0,ol=1e9;for(let i=0;i<zones.length;i++)if(zones[i].life<ol){ol=zones[i].life;oi=i;}zones.splice(oi,1);}
 const zs=(player&&player.zoneScale)||1;z.r*=zs;z.life*=zs;
 z.maxlife=z.life;z._dead=false;zones.push(z);return z;
}
// per-frame: fade zones, apply their effect to enemies + player inside.
function updateZones(dt){
 if(!zones.length)return;
 for(const z of zones){
  if(z._dead)continue;z.life-=dt;if(z.life<=0){z._dead=true;continue;}
  const near=queryNear(z.x,z.y,z.r+30);
  for(const e of near){if(e._dead)continue;const dx=e.x-z.x,dy=e.y-z.y,d2=dx*dx+dy*dy,rr=z.r+e.r;if(d2>rr*rr)continue;
   if(z.el&&!isBig(e)){if((e._zelT=(e._zelT||0)-dt)<=0){e._zelT=0.25;applyEl(e,z.el,z.elAmt||3);}}
   if(z.dps){dealDamage(e,z.dps*dt,{tick:true});if(e._dead)continue;}
   if(z.slow&&!isBig(e)){addSt(e,'chill',Math.max(1,Math.round(z.slow)));}
   if(z.pull&&!isBig(e)){const d=Math.sqrt(d2)||1,m=Math.max(0.6,e.m||e.r*e.r/100),f=z.pull*(1-Math.min(1,d/z.r))/m;e.kvx=(e.kvx||0)-dx/d*f;e.kvy=(e.kvy||0)-dy/d*f;}
   if(z.dmgAmp)e.vulnT=Math.max(e.vulnT||0,0.3);
  }
  // conductive zone: occasionally re-chain lightning between enemies inside it
  if(z.type==='conductive'){z._arcT=(z._arcT||0)-dt;if(z._arcT<=0){z._arcT=0.35;const inside=near.filter(e=>!e._dead&&dist2(e.x,e.y,z.x,z.y)<z.r*z.r);if(inside.length>=2){let from=inside[0];for(let j=1;j<Math.min(4,inside.length);j++){const c=inside[j];arcs.push({x1:from.x,y1:from.y,x2:c.x,y2:c.y,life:0.18,color:'#5cd0ff'});dealDamage(c,(8+player.level*0.6)*player.damageMult,{tick:true});addSt(c,'shock',3);from=c;}}}}
  // player standing in a hostile zone? only radioactive/void-rift sting the player lightly
 }
 for(let i=zones.length-1;i>=0;i--)if(zones[i]._dead)zones.splice(i,1);
}
