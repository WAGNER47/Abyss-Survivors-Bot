/* ===== PASSIVES ===== */
const PASSIVES={
power:{name:'Overcharge',icon:'⚡',color:'#ff5a6e',max:5,desc:l=>`+${l*15}% damage on everything.`},
haste:{name:'Synaptic',icon:'⏱',color:'#5cd0ff',max:5,desc:l=>`+${Math.round((1-Math.pow(0.88,l))*100)}% attack speed.`},
vitality:{name:'Plating',icon:'❤',color:'#ff8a6e',max:5,desc:l=>`+${l*25} max hull (also heals).`},
swift:{name:'Thrusters',icon:'➳',color:'#6cffb0',max:5,desc:l=>`+${l*9}% movement speed.`},
multi:{name:'Splitter',icon:'\u22d4',color:'#ffc24b',max:6,desc:l=>`+${l} projectile to all weapons, the Sniper rifle included. Stack it to fire a storm.`},
area:{name:'Resonate',icon:'◎',color:'#9b6dff',max:5,desc:l=>`+${l*14}% area & projectile size.`},
wisdom:{name:'Attunement',icon:'✷',color:'#6cffb0',max:5,desc:l=>`+${l*20}% resonance (XP) gained.`},
magnet:{name:'Lure Field',icon:'⊚',color:'#5cd0ff',max:5,desc:l=>`+${l*50} pickup radius.`},
regen:{name:'Mendgel',icon:'✚',color:'#ff8a6e',max:5,desc:l=>`Regenerate ${(l*1.0).toFixed(1)} hull / sec.`},
armor:{name:'Carapace',icon:'⛨',color:'#9fb6e0',max:5,desc:l=>`-${l*3} damage taken per hit.`},
crit:{name:'Focus Lens',icon:'✶',color:'#ffc24b',max:5,desc:l=>`+${l*9}% critical chance.`},
bulwark:{name:'Bulwark',icon:'🛡',color:'#9fd0ff',max:4,desc:l=>`+${l*2} armor and +${l*15} max hull.`},
pierce:{name:'Penetrator',icon:'➹',color:'#00e5d4',max:4,desc:l=>`+${l} pierce to all projectiles.`},
knock:{name:'Impact Driver',icon:'\ud83d\udca5',color:'#ff9b4b',max:6,desc:l=>`+${l*35}% knockback on every hit. Send them flying.`},
thorns:{name:'Retaliate',icon:'✺',color:'#ff7a4b',max:5,desc:l=>`Reflect ${l*18} damage to foes that strike you.`},
greed:{name:'Scavenger',icon:'◈',color:'#ffc24b',max:5,desc:l=>`+${l*18}% gold, +${l*12}% XP, +${l*30} pickup range.`},
energyshield:{name:'Energy Shield',icon:'❖',color:'#9bd0ff',max:5,desc:l=>`+${l*25} regenerating shield that absorbs hits.`},
capacitor:{name:'Capacitor',icon:'⚇',color:'#5cd0ff',max:4,desc:l=>`Shields & barrier recharge ${Math.round((1-Math.pow(0.8,l))*100)}% faster.`},
drone:{name:'Drone Bay',icon:'✜',color:'#8affc0',max:3,desc:l=>`+${l} combat companion drone(s).`},
};

