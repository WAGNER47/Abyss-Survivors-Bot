/* ===== CHEST GACHA (non-skippable) ===== */
function rollChest(){
 const r=Math.random();
 if(r<BAL.chestRarity.legendary){
  let avail=RELICS.filter(R=>R.stack||!player.relics[R.id]);if(!avail.length)avail=RELICS.filter(R=>R.stack);
  if(avail.length){const R=pick(avail);return{rarity:'LEGENDARY',color:'#9bd0ff',icon:'❖',name:t(R.name),desc:t(R.desc),apply(){R.apply();player.relics[R.id]=(player.relics[R.id]||0)+1;recalc(player);refreshDock();toast('LEGENDARY RELIC');pushFeed('LEGENDARY DROP','#9bd0ff');}};}
  return{rarity:'LEGENDARY',color:'#ffc24b',icon:'◈',name:t('Vault of Credits'),desc:t('+400 credits.'),apply(){gold+=400;}};
 }
 if(r<BAL.chestRarity.legendary+BAL.chestRarity.rare){
  const upg=[];player.weapons.forEach(w=>{if(w.level<WEAPONS[w.id].max)upg.push({t:'wlvl',w});});
  if(player.weapons.length<BAL.weaponSlots)for(const id in WEAPONS){if(!player.weapons.find(w=>w.id===id))upg.push({t:'wnew',id});}
  if(upg.length){const o=pick(upg);
   if(o.t==='wnew'){const d=WEAPONS[o.id];return{rarity:'RARE',color:d.color,icon:d.icon,name:t(d.name),desc:t('New weapon:')+' '+faWD(o.id,1),apply(){player.weapons.push({id:o.id,level:1,timer:0,orbAngle:0});recalc(player);refreshDock();}};}
   const d=WEAPONS[o.w.id];return{rarity:'RARE',color:d.color,icon:d.icon,name:t(d.name)+' +2',desc:t('This weapon gains two levels.'),apply(){o.w.level=Math.min(d.max,o.w.level+2);recalc(player);refreshDock();}};}
  return{rarity:'RARE',color:'#ffc24b',icon:'◈',name:t('Credit Stash'),desc:t('+150 credits.'),apply(){gold+=150;}};
 }
 if(Math.random()<0.5){const all=player.weapons.filter(w=>w.level<WEAPONS[w.id].max);
  if(all.length){const w=pick(all),d=WEAPONS[w.id];return{rarity:'COMMON',color:d.color,icon:d.icon,name:t(d.name)+' +1',desc:t('This weapon gains a level.'),apply(){w.level++;recalc(player);refreshDock();}};}
  return{rarity:'COMMON',color:'#ffc24b',icon:'◈',name:t('Credits'),desc:t('+60 credits.'),apply(){gold+=60;}};}
 return{rarity:'COMMON',color:'#ff8a6e',icon:'❤',name:t('Repair Kit'),desc:t('Restore 35% of max hull.'),apply(){player.hp=clamp(player.hp+player.maxHp*0.35,0,player.maxHp);}};
}
function grantChest(){
 const prize=rollChest();prize.apply();sfx('chest');
 toast('+ '+prize.name);
 texts.push({x:player.x,y:player.y-32,val:'+ '+prize.name,color:prize.color,life:1.9,vy:-24,big:true});
}

