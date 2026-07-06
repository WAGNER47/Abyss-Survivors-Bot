/* ===== ELEMENT IDENTITIES / RENAMES / EVOLUTIONS / BEAM ===== */
WEAPONS.bolt.name='Pulse Cannon';WEAPONS.orbit.name='Mini Suns';WEAPONS.chain.name='Chain Arc';WEAPONS.fireaoe.name='Nova Generator';WEAPONS.spirit.name='Void Lance';
WEAPONS.beam={name:'Beam Emitter',icon:'═',color:'#ff9bf0',max:8,continuous:true,desc:l=>`A continuous laser melts the nearest foe and everything along the line.`,
 stats(l,P){return{range:(380+l*20)*P.area,width:(10+l*2)*P.area,dps:(26+l*9)*P.damageMult};},
 tick(P,l,dt,w){const st=this.stats(l,P),t=nearestEnemy(P.x,P.y,st.range);if(!t){w._render=null;return;}
  const ang=Math.atan2(t.y-P.y,t.x-P.x),tx=P.x+Math.cos(ang)*st.range,ty=P.y+Math.sin(ang)*st.range;
  for(const e of queryNear((P.x+tx)/2,(P.y+ty)/2,st.range/2+60)){if(e._dead)continue;
   const ex=e.x-P.x,ey=e.y-P.y,proj=ex*Math.cos(ang)+ey*Math.sin(ang);if(proj<0||proj>st.range)continue;
   const perp=Math.abs(-ex*Math.sin(ang)+ey*Math.cos(ang));if(perp<st.width+e.r)dealDamage(e,st.dps*dt,{tick:true});}
  w._render={tx,ty,width:st.width};}};
const WEAPON_EL={trident:'kinetic',bolt:'kinetic',orbit:'fire',aura:'radiation',spread:'kinetic',chain:'lightning',seek:'plasma',fireaoe:'fire',iceaoe:'ice',bleedaoe:'kinetic',poison:'toxic',sling:'kinetic',spirit:'void',chaos:'plasma',rifle:'kinetic',saber:'plasma',lightaoe:'lightning',deflect:'plasma',siege:'kinetic',glint:'void',chaosspirit:'void',beam:'plasma',fists:'kinetic',duality:'lightning'};
const EVOS={
 bolt:{names:['Twin Pulse','Scatter Pulse','Storm Pulse','Singularity Pulse'],els:['lightning','void']},
 orbit:{names:['Twin Suns','Solar Crown','Coronal Halo','The Inferno Crown'],els:['fire','fire']},
 chain:{names:['Twin Arc','Storm Arc','Tempest Arc','Worldstorm'],els:['plasma','radiation']},
 fireaoe:{names:['Nova Core','Twin Nova','Helion Nova','Supernova'],els:['radiation','void']},
 spirit:{names:['Dark Lance','Twin Lance','Umbral Lance','Event Horizon'],els:['ice','radiation']},
 beam:{names:['Twin Beam','Prism Beam','Gamma Beam','Annihilator'],els:['radiation','fire']},
 iceaoe:{names:['Shard Nova','Glacier Nova','Cryo Storm','Absolute Nova'],els:['void','lightning']},
};
function wEls(w){return [(w.inf&&w.inf[0])||WEAPON_EL[w.id]||'kinetic'];}
function evoName(id,tier){const n=EVOS[id]&&EVOS[id].names;return n?n[tier-1]:WEAPONS[id].name+' '+['Mk II','Mk III','Prime','Omega'][tier-1];}
let CURW=null,CURP=null,DT=0;
const DODGE={angler:{d:0,cd:99},vanguard:{d:0,cd:99},sentinel:{d:0,cd:99},ranger:{d:430,cd:0.85},sniper:{d:340,cd:1.4},vyper:{d:300,cd:1.3},yujin:{d:0,cd:99},rhino:{d:560,cd:1.0},sorcerer:{d:0,cd:99}};
const BULWARK={dur:1.4,cd:4.5};const PARRY={win:0.34,cd:0.42};
const RHINO={trampleDmg:48,knock:1400,aftershock:1500,aftershockDmg:120,maxHold:4};
const GRAPPLE={maxHold:1.15,baseLen:430,maxLen:820,hookSpeed:2600,zipSpeed:1950,pullSpeed:2450,dmg:34,corridorDmg:26,knock:950,rideHeal:0.00015,rideHealCap:0.12,hookHit:210,slamHit:340,skewer:600,skewerR:52};
let mseX=0,mseY=0,mseOn=false,camIx=0,camIy=0,camIz=1;
// Angler aim priority: mouse cursor (desktop) > movement keys > velocity > last facing.
function anglerAim(){
 if(!IS_TOUCH&&mseOn){const wx=camIx+(mseX-W/2)/camIz,wy=camIy+(mseY-H/2)/camIz;const dx=wx-player.x,dy=wy-player.y,d=Math.hypot(dx,dy);if(d>6)return{dx:dx/d,dy:dy/d};}
 let dx=player._aimx||0,dy=player._aimy||0;
 if(dx===0&&dy===0){const pv=Math.hypot(player.pvx,player.pvy);if(pv>10){dx=player.pvx/pv;dy=player.pvy/pv;}else{dx=player._face||1;dy=0;}}
 const dl=Math.hypot(dx,dy)||1;return{dx:dx/dl,dy:dy/dl};
}
const HEX={dur:2.6,cd:9,radius:200,pull:300};
