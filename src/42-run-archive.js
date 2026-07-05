/* ===== RUN ARCHIVE ===== */
function buildSnapshot(){
 const cores=[];for(const w of player.weapons){const e=WEAPON_EL[w.id];if(e&&CORE_NAME[e]&&!cores.includes(CORE_NAME[e]))cores.push(CORE_NAME[e]);for(const el of (w.inf||[]))if(CORE_NAME[el]&&!cores.includes(CORE_NAME[el]))cores.push(CORE_NAME[el]);}
 return{
  weapons:player.weapons.map(w=>{const D=WEAPONS[w.id]||{};let nm;try{nm=w.evo?evoName(w.id,w.evo):(D.name||String(w.id));}catch(e){nm=D.name||String(w.id);}return{name:nm,level:w.level,evo:w.evo||0,inf:(w.inf||[]).map(el=>(ELEMENTS[el]&&ELEMENTS[el].name)||String(el))};}),
  passives:Object.entries(player.passives).map(([id,lv])=>({name:(PASSIVES[id]&&PASSIVES[id].name)||String(id),lv})),
  relics:Object.keys(player.relics).map(id=>{const R=RELICS.find(r=>r.id===id);return R?R.name:id;}),
  boons:player.boonNames.slice(),
  cores};
}
