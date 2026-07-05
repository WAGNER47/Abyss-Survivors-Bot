/* ===== STATE ===== */
let state='menu';
let player,enemies,pjs,epjs,orbs,drops,particles,texts,arcs,fx,hazards,chests;
let time=0,kills=0,gold=0,spawnTimer=0,screenShake=0,shakeX=0,shakeY=0;
let camZoom=1,camZoomTarget=1,camPunch=0,camCX=0,camCY=0;
let pendingLevels=0,pendingBoons=0,pendingChests=0,bestTime=0,runOver=false;
// Grace delay before a level-up / boon choice menu interrupts active play. A menu that
// pops the instant you level up can freeze you to death in a hazard. menuArmT is the base
// countdown; menuMaxT is a hard cap so it always eventually opens even if you stay in danger.
let menuArmT=0,menuMaxT=0,_menuPend=0;
const MENU_DELAY=1.0,MENU_MAX=2.8;
let legendaryArmed=false,legendaryFirstLevel=5,legendaryWindowT=0,surgeEnded=false,chestCdT=0;
let endgame=false,corruption=0,eliteTimer=75,meteorT=8,stampT=170,lastBombT=-999;
let swarmT=150,swarmCount=0,bigT=200,alertText='',alertTime=0,swarmMax=150,trails=[],obj=null,objT=75,recycleT=0.5,megaCount=0,leviathanLock=false,triVolleyT=18;
let _arenaWasActive=false,bhBossDone=false,bhBossT=40;
let shards=[],roadShown=false;
const ROAD={px:1100,py:1300,w:96};
function onRoadAt(x,y){const mx=((x%ROAD.px)+ROAD.px)%ROAD.px,my=((y%ROAD.py)+ROAD.py)%ROAD.py;return mx<ROAD.w||my<ROAD.w;}
let corruptMods={speed:0,explode:false,double:false,meteors:false,bless:0,bossUp:0};
let ACfilt=null,ACcomp=null,ACrev=null,ACrevGain=null,_sfxBudget=0,_sfxBudgetT=0,_hitSfxT=0,_hurtFbT=0,_hurtSfxT=0,_reactFbT=0,_dmgHapT=0;
const keys={};let chosenChar=CHARS[0];
async function loadBest(){try{const r=await window.storage.get('abyss_best');if(r&&r.value)bestTime=parseFloat(r.value)||0;}catch(e){}}
async function saveBest(){try{await window.storage.set('abyss_best',String(bestTime));}catch(e){}}
loadBest();
let DMGNUM='full';
(async()=>{try{const r=await window.storage.get('abyss_dmgnum');if(r&&r.value)DMGNUM=r.value;syncDmgBtn();}catch(e){}})();
function syncDmgBtn(){const t='Damage Numbers: '+DMGNUM.toUpperCase();for(const id of ['dmgbtn','dmgbtn2']){const b=document.getElementById(id);if(b)b.textContent=t;}}
function cycleDmg(){const order=['off','minimal','full','diablo'];DMGNUM=order[(order.indexOf(DMGNUM)+1)%order.length];syncDmgBtn();try{window.storage.set('abyss_dmgnum',DMGNUM);}catch(e){}}

