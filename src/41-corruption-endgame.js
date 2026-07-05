/* ===== CORRUPTION ENDGAME ===== */
const CMODS=[
 {k:'speed',n:'SWIFT HORDE. Enemies move faster'},
 {k:'explode',n:'VOLATILE. Enemies detonate on death'},
 {k:'double',n:'TWIN ELITES. Elites hunt in pairs'},
 {k:'meteors',n:'METEOR STORM. Fire rains from above'},
 {k:'bless',n:'DEEP BLESSING. Extra hull, shield, healing'},
 {k:'bossUp',n:'EMPOWERED WARDENS. Bosses grow stronger'}];
function applyCorruption(){
 const m=CMODS[(corruption-1)%CMODS.length];
 if(m.k==='speed')corruptMods.speed++;
 else if(m.k==='explode')corruptMods.explode=true;
 else if(m.k==='double')corruptMods.double=true;
 else if(m.k==='meteors')corruptMods.meteors=true;
 else if(m.k==='bless'){corruptMods.bless++;player.perm.maxhp+=40;player.perm.es+=20;recalc(player);player.hp=clamp(player.hp+player.maxHp*0.3,0,player.maxHp);}
 else if(m.k==='bossUp')corruptMods.bossUp++;
 player.perm.lootMul*=1.10;recalc(player);
 toast('CORRUPTION '+corruption+': '+m.n);sfx('boss');screenShake=Math.max(screenShake,8);}
function enterEndgame(){hideAllScreens();showHUD(true);endgame=true;runOver=false;leviathanLock=false;try{document.getElementById('buildcard').classList.add('hidden');}catch(e){}gameAlert('THE CORRUPTION TAKES HOLD','#ff3df0','the deep rewrites itself \u00b7 survive');if(corruption===0){corruption=1;applyCorruption();}state='playing';lastT=performance.now();}

