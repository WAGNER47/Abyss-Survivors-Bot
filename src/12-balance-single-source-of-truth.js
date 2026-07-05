/* ===== BALANCE (single source of truth) ===== */
const BAL={
  enemyHp(t){const lv=(typeof player!=='undefined'&&player&&player.level)?player.level:1;return (1+t/52+Math.pow(t/250,2))*(1+lv*0.009);},
  enemyDmg(t){const lv=(typeof player!=='undefined'&&player&&player.level)?player.level:1;return (1+t/210)*(1+lv*0.004);},
  spawnInterval(t){return Math.max(0.28,0.95-t*0.011);},
  spawnBatch(t){return 2+Math.floor(t/18);},
  enemyCap:260,
  xpNext(level){const base=52+level*16+Math.pow(level,2.02);let m=1;if(level<=3)m=0.6;else if(level<=8)m=0.85;else if(level<10)m=1.1;return Math.floor(base*m);},
  playerIFrames:0.5, cellSize:80,
  barrierLevel:5, barrierRecharge:0.8,
  regenLevel:10, regenPctPerSec:0.012,
  levelUpHealPct:0.08,
  epicLevels:[2,6,7,10,15,30,34,35,36,100],
  mageCap:3, hazardCap:8, hazardMaxDps:900,
  weaponSlots:7, passiveSlots:7,
  chestChance:0.02, chestEpicChance:0.22, chestCooldown:22,
  chestRarity:{legendary:0.10, rare:0.34}, // else common
  finalLevel:100, wardenEvery:5,
  instantXpTime:20,
};

