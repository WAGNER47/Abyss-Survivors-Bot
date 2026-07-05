/* ===== UI WIRING ===== */
function buildCharSelect(){const list=document.getElementById('charlist');list.innerHTML='';
 CHARS.forEach(c=>{const el=document.createElement('div');el.className='char';el.style.setProperty('--c',c.color);
  el.innerHTML=`<div class="glyph" style="color:${c.color};filter:drop-shadow(0 0 12px ${c.color})">${c.glyph}</div><h3>${c.name}</h3><div class="role">${c.role}</div><p>${c.desc}</p><div class="perks">${c.perks}</div>`;
  el.onclick=()=>{if(!AC)initAudio();startRun(c);};list.appendChild(el);});}
function toMenu(){tgHideShare(); // TELEGRAM MINI APP
 const __bc=document.getElementById('buildcard');if(__bc)__bc.classList.add('hidden');state='menu';showHUD(false);hideAllScreens();showNavToggle();document.getElementById('menu').classList.remove('hidden');try{refreshMenuChip();}catch(e){}player=null;try{ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,W,H);}catch(e){}}
function toCharSelect(){hideAllScreens();buildCharSelect();document.getElementById('charselect').classList.remove('hidden');}
document.getElementById('startbtn').onclick=()=>{if(!AC)initAudio();toCharSelect();};
var _cosBtn=document.getElementById('cosbtn');if(_cosBtn)_cosBtn.onclick=()=>{if(!AC)initAudio();openCosmetics();};
var _mSoc=document.getElementById('navsocial');if(_mSoc)_mSoc.onclick=()=>{if(!AC)initAudio();openSocial('friends');};
var _mProf=document.getElementById('navprofile');if(_mProf)_mProf.onclick=()=>{if(!AC)initAudio();openProfile();};
var _mGuide=document.getElementById('navguide');if(_mGuide)_mGuide.onclick=()=>{if(!AC)initAudio();openCodex();};
var _mLore=document.getElementById('loreBtn');if(_mLore)_mLore.onclick=()=>{if(!AC)initAudio();openLore();};
var _mLoreBack=document.getElementById('loreback');if(_mLoreBack)_mLoreBack.onclick=toMenu;
