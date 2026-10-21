// sim-endgame-v10.js - proves the endgame math on the SHIPPED code, not a copy of it.
// Extracts corrMulFor and the pressure formula straight from the patched HTML, then simulates:
//  1) the difficulty curve 100 -> 200 -> forever (bounded, monotonic, finite)
//  2) the Reflection gate fight across the full realistic DPS range
//  3) a maximum-sustain "god build" running the descent - MUST die by level 200
const fs = require('fs');
const html = fs.readFileSync(process.argv[2] || 'dist/index.html', 'utf8');

// ---- extract the real shipped functions ----
const mCurve = html.match(/function corrMulFor\(lv\)\{[\s\S]*?return a\*Math\.pow\(CORR_G2,Math\.min\(lv,TIER2_END\)-TIER1_END\);\}/);
const mConst = html.match(/const TIER1_END=(\d+),TIER2_END=(\d+),CORR_LEVEL_SEC=(\d+),CORR_G1=([\d.]+),CORR_G2=([\d.]+);/);
const mBH = html.match(/const REFL_HP=(\d+),BH_CYCLE=(\d+),BH_OPEN=([\d.]+),BH_TRICKLE=([\d.]+);/);
const mPress = html.match(/const pct=\(!reflectionDown\)\?([\d.]+):Math\.min\(([\d.]+),([\d.]+)\+([\d.]+)\*\(lv-TIER1_END\)\);/);
if (!mCurve || !mConst || !mBH || !mPress) { console.error('EXTRACTION FAILED - shipped code does not match spec'); process.exit(1); }

const TIER1_END = +mConst[1], TIER2_END = +mConst[2], CORR_LEVEL_SEC = +mConst[3];
const CORR_G1 = +mConst[4], CORR_G2 = +mConst[5];
const REFL_HP = +mBH[1], BH_CYCLE = +mBH[2], BH_OPEN = +mBH[3], BH_TRICKLE = +mBH[4];
const P_GATE = +mPress[1], P_CAP = +mPress[2], P_BASE = +mPress[3], P_RAMP = +mPress[4];
const CORR_CAP_LEVEL = 103;
const corrMulFor = eval('(' + mCurve[0].replace('function corrMulFor', 'function') + ')');

let pass = 0, fail = 0;
function T(name, cond, detail) { if (cond) { pass++; console.log('  PASS  ' + name + (detail ? '  [' + detail + ']' : '')); } else { fail++; console.log('  FAIL  ' + name + (detail ? '  [' + detail + ']' : '')); } }

console.log('== 1. DIFFICULTY CURVE (from shipped corrMulFor) ==');
const m150 = corrMulFor(150), m200 = corrMulFor(200);
console.log('  level 103: x' + corrMulFor(103) + '   level 125: x' + corrMulFor(125).toFixed(1) + '   level 150: x' + m150.toFixed(1) + '   level 175: x' + corrMulFor(175).toFixed(1) + '   level 200: x' + m200.toFixed(0));
T('x1 at the freeze', corrMulFor(103) === 1);
T('tier-1 ceiling sane (x10-x25 at 150)', m150 > 10 && m150 < 25, 'x' + m150.toFixed(1));
T('tier-2 ceiling sane (x500-x2500 at 200)', m200 > 500 && m200 < 2500, 'x' + m200.toFixed(0));
let mono = true, finite = true;
for (let lv = 100; lv <= 10000; lv++) { const v = corrMulFor(lv); if (!isFinite(v)) finite = false; if (lv > 100 && v < corrMulFor(lv - 1)) mono = false; }
T('monotonic non-decreasing to lv 10000', mono);
T('finite forever (hard plateau, no overflow)', finite && corrMulFor(10000) === m200, 'plateau x' + corrMulFor(10000).toFixed(0));

console.log('== 2. THE REFLECTION GATE (HP ' + REFL_HP.toLocaleString() + ', breathes ' + BH_OPEN + 's every ' + BH_CYCLE + 's, trickle ' + (BH_TRICKLE * 100) + '%) ==');
for (const dps of [5000, 12000, 20000, 30000, 40000]) {
  const perCycle = dps * BH_OPEN + dps * BH_TRICKLE * (BH_CYCLE - BH_OPEN);
  const mins = (REFL_HP / perCycle) * BH_CYCLE / 60;
  console.log('  ' + (dps / 1000) + 'k dps build -> ~' + mins.toFixed(1) + ' min fight');
}
const strongest = (REFL_HP / (40000 * BH_OPEN + 40000 * BH_TRICKLE * (BH_CYCLE - BH_OPEN))) * BH_CYCLE / 60;
const typical = (REFL_HP / (20000 * BH_OPEN + 20000 * BH_TRICKLE * (BH_CYCLE - BH_OPEN))) * BH_CYCLE / 60;
T('strongest realistic build still needs 8+ min', strongest >= 8, strongest.toFixed(1) + ' min at 40k dps');
T('typical endgame build needs 15+ min', typical >= 15, typical.toFixed(1) + ' min at 20k dps');
// camper at the gate: 1.8%/s sustain vs 0.8%/s gate pressure + enraging boss chip (starts 0.35%/s, +8%/min)
{
  let hp = 1.0, t = 0, dead = false;
  while (t < 7200) { const chip = 0.0035 * (1 + Math.min(2, Math.floor(t / 60) * 0.08)); hp += (0.018 - P_GATE / 4 - chip) * 1; if (hp > 1) hp = 1; if (hp <= 0) { dead = true; break; } t++; }
  T('camping the gate fight is fatal', dead, dead ? ('dies after ' + (t / 60).toFixed(1) + ' min') : 'survives forever');
}

console.log('== 3. GOD-BUILD DESCENT 103 -> 200 (the "everyone dies" check) ==');
// The most generous survivor model possible: 900 max hull, 70 armor, all sustain sources maxed
// (flat regen + % regen + drop healing ~ 4.2% of max hull per second), perfect play (takes only
// 25% of incoming enemy contact pressure), shields refreshing between pulses.
function simDescent(sustainPct, dodgeSkill) {
  // baseline enemy pressure on a god build at the freeze: ~10 effective dps (they said it: you just stand there)
  const baseEnemyDps = 10;
  let lv = CORR_CAP_LEVEL, hp = 1.0, t = 0, fightMin = typical; // pays the typical gate fight
  while (lv < TIER2_END) {
    // one level per CORR_LEVEL_SEC seconds; at 150 add the gate fight duration at gate pressure
    const isGate = (lv === TIER1_END);
    const span = isGate ? fightMin * 60 : CORR_LEVEL_SEC;
    for (let s2 = 0; s2 < span; s2++) {
      const pierce = (lv > TIER1_END) ? Math.min(0.6, (lv - TIER1_END) * 0.012) : 0;
      const enemyDps = baseEnemyDps * (corrMulFor(lv) / corrMulFor(CORR_CAP_LEVEL)) * (1 - dodgeSkill) * (1 + pierce) / 900;
      const pressPerSec = (lv >= TIER1_END) ? ((lv === TIER1_END && isGate ? P_GATE : (lv > TIER1_END ? Math.min(P_CAP, P_BASE + P_RAMP * (lv - TIER1_END)) : 0)) / 4) : 0;
      hp += (sustainPct - pressPerSec - enemyDps);
      if (hp > 1) hp = 1;
      if (hp <= 0) return { dead: true, lv, t };
      t++;
    }
    lv++;
  }
  // survived to 200: plateau - pressure is capped but permanent
  const pressAt200 = Math.min(P_CAP, P_BASE + P_RAMP * (TIER2_END - TIER1_END)) / 4;
  let extra = 0;
  while (hp > 0 && extra < 3600) { hp += (sustainPct - pressAt200 - baseEnemyDps * (m200 / corrMulFor(CORR_CAP_LEVEL)) * (1 - dodgeSkill) * 1.6 / 900); extra++; }
  return { dead: hp <= 0, lv: TIER2_END, t: t + extra, extra };
}
const god = simDescent(0.042, 0.75);      // maximum sustain, near-perfect dodging
const strong = simDescent(0.030, 0.6);    // very strong build
const average = simDescent(0.018, 0.4);   // solid endgame build
console.log('  god build (4.2%/s sustain, 75% dodge):    ' + (god.dead ? 'DIES at level ' + god.lv + (god.extra ? ' after ' + (god.extra / 60).toFixed(1) + ' min at the floor' : '') : 'SURVIVES - DESIGN BROKEN'));
console.log('  strong build (3.0%/s sustain, 60% dodge): ' + (strong.dead ? 'DIES at level ' + strong.lv : 'SURVIVES - DESIGN BROKEN'));
console.log('  average build (1.8%/s, 40% dodge):        ' + (average.dead ? 'DIES at level ' + average.lv : 'SURVIVES - DESIGN BROKEN'));
T('god build dies by/at level 200', god.dead && god.lv <= TIER2_END);
T('strong build dies by/at level 200', strong.dead && strong.lv <= TIER2_END);
T('average build dies before 200', average.dead && average.lv < TIER2_END, 'level ' + average.lv);
T('pressure at 200 alone beats max sustain', Math.min(P_CAP, P_BASE + P_RAMP * 50) / 4 > 0.042, (Math.min(P_CAP, P_BASE + P_RAMP * 50) / 4 * 100).toFixed(2) + '%/s vs 4.2%/s');

console.log('== 4. NUMERIC SAFETY AT THE CEILING ==');
const gruntHp200 = 30 * 60 * m200; // grunt base x generous freeze-time curve x max multiplier
T('max enemy HP far below float danger', gruntHp200 < 1e12, gruntHp200.toExponential(2));
T('no NaN anywhere on the curve', ![100, 103, 150, 200, 201, 99999].some(l => isNaN(corrMulFor(l))));

console.log('\n== ' + pass + ' passed, ' + fail + ' failed ==');
process.exit(fail ? 1 : 0);
