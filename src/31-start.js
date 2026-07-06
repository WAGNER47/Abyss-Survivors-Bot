/* ===== START ===== */
function startRun(charDef){tgHideShare(); // TELEGRAM MINI APP
 
 chosenChar=charDef;player=makePlayer(charDef);
 enemies=[];pjs=[];epjs=[];orbs=[];drops=[];particles=[];texts=[];arcs=[];fx=[];hazards=[];chests=[];zones=[];seeds=[];bossBeams=[];_arenaWasActive=false;bhBossDone=false;bhBossT=40;corrClock=0;reflectionDown=false;reflRef=null;pressureT=4;pressureN=0;_bhToasts=0;
 time=0;kills=0;gold=0;spawnTimer=0;screenShake=0;camZoom=1;camZoomTarget=1;camPunch=0;camCX=0;camCY=0;pendingLevels=0;pendingBoons=0;pendingChests=0;runOver=false;
 menuArmT=0;menuMaxT=0;_menuPend=0;
 legendaryArmed=false;legendaryFirstLevel=randi(3,9);legendaryWindowT=0;surgeEnded=false;chestCdT=0;
 rs={dmg:0,taken:0,elite:0,boss:0,peak:0,acc:0,t:0,dodges:0,reacts:{}};
 endgame=false;corruption=0;corrFrozen=false;corrFreezeTime=0;corrScaleStep=0;corrScaleMul=1;corpses=[];eliteTimer=75;meteorT=8;shards=[];roadShown=false;stampT=170;lastBombT=-999;swarmT=150;swarmCount=0;bigT=200;triVolleyT=18;alertText='';alertTime=0;swarmMax=150;trails=[];obj=null;objT=75;recycleT=0.5;megaCount=0;leviathanLock=false;corruptMods={speed:0,explode:false,double:false,meteors:false,bless:0,bossUp:0};
 state='playing';showHUD(true);hideAllScreens();
 toast('OPENING SURGE · KILLS GRANT XP INSTANTLY · 20s');
 document.getElementById('cnote').classList.remove('hidden');
 setTimeout(()=>document.getElementById('cnote').classList.add('hidden'),4500);
 refreshDock();lastT=performance.now();
}

