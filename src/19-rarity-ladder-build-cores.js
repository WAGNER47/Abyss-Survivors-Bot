/* ===== RARITY LADDER & BUILD CORES ===== */
const RARITY=[
 {id:'common',name:'Common',w:40,color:'#9fb6e0'},
 {id:'uncommon',name:'Uncommon',w:24,color:'#6cffb0'},
 {id:'rare',name:'Rare',w:15,color:'#5cd0ff'},
 {id:'epic',name:'Epic',w:10,color:'#9b6dff'},
 {id:'legendary',name:'Legendary',w:6,color:'#ffc24b'},
 {id:'mythic',name:'Mythic',w:3,color:'#ff5a6e'},
 {id:'cosmic',name:'Cosmic',w:1.4,color:'#ff5cf0'},
 {id:'transcendent',name:'Transcendent',w:0.6,color:'#ffffff'}];
function rollRarity(){const r=Math.random()*100;let acc=0;for(const t of RARITY){acc+=t.w;if(r<acc)return t;}return RARITY[0];}
const CORE_NAME={fire:'Fire Core',lightning:'Storm Core',void:'Singularity Core',ice:'Cryo Core',toxic:'Plague Core',plasma:'Ion Core',radiation:'Gamma Core',kinetic:'Ballistic Core'};
let rs=null,runArchive=[],lastRecord=null,detailBack='menu';
async function loadRuns(){try{const r=await window.storage.get('abyss_runs');if(r&&r.value)runArchive=JSON.parse(r.value)||[];}catch(e){runArchive=[];}}
async function saveRuns(){try{await window.storage.set('abyss_runs',JSON.stringify(runArchive.slice(0,30)));}catch(e){}}
loadRuns();

