/* ===== PLAYER ===== */
function makePlayer(charDef){
  const m=charDef.mods||{};
  const p={x:0,y:0,pvx:0,pvy:0,r:13,baseSpeed:230*(m.speedMul||1),baseMaxHp:110+(m.hpBase||0),
   hp:0,maxHp:0,level:1,xp:0,xpNext:BAL.xpNext(1),iframes:0,hurtFlash:0,moving:false,
   weapons:charDef.start?[{id:charDef.start,level:1,timer:0,orbAngle:0}]:[],passives:{},char:charDef,
   speed:0,damageMult:1,cdMul:1,charCdMul:1,area:1,xpMult:1,goldMult:1,pickupRange:140,
   regen:0,armor:0,crit:0,critMult:2,extraProj:0,projSpeed:1,projLife:1,pierceBonus:0,
   thorns:0,killHeal:0,enemySlow:1,companionCount:0,companions:[],
   es:0,esMax:0,esDelay:0,esRecMul:1,_esShatterT:0,hasBarrier:false,hasRegen:false,barrier:{ready:true,cd:0},barrierRecharge:BAL.barrierRecharge,
   relics:{},_deflectR:0,_deflectCharges:3,_deflectCd:0,_halo:null,permShield:(charDef.id==='sentinel'||charDef.id==='vyper'),fieldHaste:1,boonNames:[],dodgeCd:0,dodgeT:0,_slideT:0,slowT:0,color:(profColor||charDef.color),pshape:profShape,parryActive:false,parryT:0,parryCdT:0,parryFlash:0,bulwarkT:0,hexT:0,_charging:false,_chargingUp:false,_chargeHold:0,_chargePow:null,_lastChargeCd:1,_inBlackhole:false,_bhImmuneT:0,_bhEscX:1,_bhEscY:0,
   perm:{dmg:0,maxhp:0,speed:0,crit:0,area:0,attackspeed:0,extraProj:0,killHeal:0,enemySlow:1,critMult:2,es:0,lootMul:1,glassHpMult:1,critBoom:false,hazardRes:0,titanMul:1,reactAmp:1,zoneScale:1,reactShield:0,chillExtra:0},
   mods:m};
  if(m.hazResBase)p.perm.hazardRes=Math.max(p.perm.hazardRes||0,m.hazResBase);
  recalc(p,true);p.hp=p.maxHp;p.es=p.esMax;return p;
}
function recalc(p,init){
  const m=p.mods,ps=p.passives,pm=p.perm,g=id=>ps[id]||0;const prevMax=p.maxHp,prevEs=p.esMax;
  p.damageMult=(1+(m.powerBase||0))+0.15*g('power')+pm.dmg;
  p.cdMul=Math.pow(0.88,g('haste'))*(1-pm.attackspeed);
  p.charCdMul=(m.charCdMul||1);
  p.projSpeed=(m.projSpeedMul||1);p.projLife=(m.projLifeMul||1);
  p.pierceBonus=(m.pierceBase||0)+g('pierce');
  p.maxHp=Math.round((p.baseMaxHp+25*g('vitality')+15*g('bulwark')+pm.maxhp)*pm.glassHpMult);
  p.speed=p.baseSpeed*(1+0.09*g('swift')+pm.speed);
  p.area=(1+(m.areaBase||0))+0.14*g('area')+pm.area;
  const greedL=g('greed'),loot=(m.lootBase||0);
  p.xpMult=(1+0.20*g('wisdom')+0.12*greedL+loot)*pm.lootMul;
  p.goldMult=(1+0.18*greedL+loot)*pm.lootMul;
  p.pickupRange=140+(m.magnetBase||0)+50*g('magnet')+30*greedL;
  p.regen=(m.regenBase||0)+1.0*g('regen');
  p.armor=(m.armorBase||0)+3*g('armor')+2*g('bulwark');
  p.crit=(m.critBase||0)+0.09*g('crit')+pm.crit;
  p.critMult=pm.critMult;
  p.extraProj=Math.min(11,g('multi')+(m.multiBase||0)+pm.extraProj);
  p.thorns=(m.thornsBase||0)+18*g('thorns');
  p.knockMul=1+0.35*g('knock')+(m.knockBase||0);
  p.slowRes=m.slowResBase||0;
  p.killHeal=pm.killHeal;
  p.reactAmp=(pm.reactAmp||1)+(m.reactAmpBase||0);p.zoneScale=(pm.zoneScale||1)+(m.zoneScaleBase||0);p.reactShield=pm.reactShield||0;p.chillExtra=pm.chillExtra||0;
  p.enemySlow=pm.enemySlow;
  p.esMax=25*g('energyshield')+pm.es;
  p.esRecMul=Math.pow(0.8,g('capacitor'));
  p.barrierRecharge=BAL.barrierRecharge*p.esRecMul;
  p.companionCount=Math.min(4,(m.companionBase||0)+g('drone'));
  if(!init&&p.maxHp>prevMax)p.hp+=(p.maxHp-prevMax);
  if(!init&&p.esMax>prevEs)p.es=(p.es||0)+(p.esMax-prevEs);
  p.hp=clamp(p.hp,0,p.maxHp);p.es=clamp(p.es||0,0,p.esMax);
}

