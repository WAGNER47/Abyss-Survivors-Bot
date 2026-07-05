/* ===== PHYSICS CORE =====
   Impulse-based rigid bodies: mass m = r^2/100, inverse-mass solver with
   restitution (bubble bounce) + Baumgarte positional correction (soft packing).
   Damage only on high-energy impacts so crowds jostle safely but launches hurt. */
const PHYS={rest:0.28,slop:0.5,corr:0.4,kvMax:900,fric:0.05,impDmg:180,impK:0.085,bossInv:6};
function radialImpulse(x,y,R,power){for(const e of queryNear(x,y,R+40)){if(e._dead)continue;const dx=e.x-x,dy=e.y-y,d=Math.hypot(dx,dy)||1;if(d>R+e.r)continue;const m=Math.max(0.6,e.m||e.r*e.r/100);const f=power*(1-Math.min(1,d/R))/m;e.kvx=(e.kvx||0)+dx/d*f;e.kvy=(e.kvy||0)+dy/d*f;}}

