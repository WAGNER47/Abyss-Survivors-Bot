// ===== NAV DRAWER =====
(function(){
 const tog=document.getElementById('navToggle'),drw=document.getElementById('navDrawer'),scrim=document.getElementById('navScrim');
 function openNav(){drw.classList.remove('closed');scrim.classList.remove('hidden');tog.classList.add('open');refreshNavHead();}
 function closeNav(){drw.classList.add('closed');scrim.classList.add('hidden');tog.classList.remove('open');}
 window._closeNav=closeNav;
 if(tog)tog.onclick=()=>{if(drw.classList.contains('closed'))openNav();else closeNav();};
 if(scrim)scrim.onclick=closeNav;
 document.querySelectorAll('.nav-link').forEach(b=>{b.onclick=()=>{const nav=b.dataset.nav;closeNav();
  if(nav==='profile')openProfile();
  else if(nav==='captain')openCaptain();
  else if(nav==='cosmetics')openCosmetics();
  else if(nav==='social')openSocial('friends');
  else if(nav==='leaderboard')openLeaderboard();
  else if(nav==='archive')openArchive();
  else if(nav==='guide')openCodex();
  else if(nav==='settings')openOptions('menu');
  else if(nav==='credits')openCredits();
 };});
 const navHead=document.getElementById('navHead');if(navHead)navHead.onclick=()=>{closeNav();openProfile();};
 const navAv=document.getElementById('navAv');if(navAv)navAv.onclick=()=>{closeNav();openProfile();};
})();
function refreshMenuChip(){try{const el=document.getElementById('mplayer');if(!el)return;
 let lv=1;try{lv=captainLevelInfo(captainTotalXP()).level;}catch(e){}
 const photo=(typeof TG_USER!=='undefined'&&TG_USER&&TG_USER.photo)?TG_USER.photo:'';
 const av=photo?'<img src="'+photo+'" alt="">':(profLogo||'\u25c6');
 el.innerHTML='<div class="mp-av" style="--ac:'+(profColor||'#00e5d4')+'">'+av+'</div><div class="mp-nm">'+(profName||'SURVIVOR')+'</div>'+capChip(lv);
 el.style.display='flex';
 el.onclick=()=>openProfile();
}catch(e){}}
function refreshNavHead(){try{
 const nm=document.getElementById('navName');if(nm)nm.textContent=(profName||'SURVIVOR');
 const clv=document.getElementById('capNavLv');if(clv){try{clv.textContent='Lv '+captainLevelInfo(captainTotalXP()).level;}catch(e){clv.textContent='';}}
 const av=document.getElementById('navAv');if(av){
  const photo=(typeof TG_USER!=='undefined'&&TG_USER&&TG_USER.photo)?TG_USER.photo:'';
  if(photo)av.innerHTML='<img src="'+photo+'" alt="">';
  else av.innerHTML=profLogo||'\u25c6';
  if(profColor){av.style.background='linear-gradient(145deg,'+profColor+',#00e5d4)';av.style.boxShadow='0 0 30px '+profColor+'99';}
 }
 const st=document.getElementById('navStats');if(st){try{const s=computeStats();
  const ns=NET.stats||{};
  const runs=Math.max(s.total||0,NET.gamesPlayed||0);
  const wins=Math.max(s.wins||0,ns.wins||0);
  const bestLv=Math.max(s.highLevel||0,ns.level||0);
  st.innerHTML='<div class="nav-stat"><div class="v">'+runs+'</div><div class="l">Runs</div></div>'+
   '<div class="nav-stat"><div class="v">'+wins+'</div><div class="l">Wins</div></div>'+
   '<div class="nav-stat"><div class="v">'+bestLv+'</div><div class="l">Best Lv</div></div>';
 }catch(e){}}
}catch(e){}}
function openCredits(){hideAllScreens();state='credits';document.getElementById('credits').classList.remove('hidden');}
