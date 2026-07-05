// ===== LORE: chapter codex (left sidebar reader). Panels arrays are empty for now;
// future hand-drawn comic panels drop straight into each chapter's `panels`: {img, text}. =====
var LORE_CHAPTERS=[
 {id:'interlude',num:'0',kind:'Interlude',title:'The Light We Carried',epi:'Every diver carries a light out into the dark. The void has been waiting a very long time to see one.',panels:[]},
 {id:'act1',num:'I',kind:'Act I',title:'The Descent',epi:'Past the last star, where the light finally gives out, the dark stops pressing on your hull - and starts learning the shape of you.',panels:[]},
 {id:'act2',num:'II',kind:'Act II',title:'Bioluminescence',epi:'Beautiful things glow out in the black. You will want to drift toward them. That is exactly what they are counting on.',panels:[]},
 {id:'act3',num:'III',kind:'Act III',title:'The Watchers',epi:'You are not lost. You were never lost. From the moment your lamp first flickered on, you were seen.',panels:[]},
 {id:'act4',num:'IV',kind:'Act IV',title:'Corruption',epi:'The void does not kill the ones it likes. It rewrites them - slowly, gently - until they forget they were ever afraid of it.',panels:[]},
 {id:'act5',num:'V',kind:'Act V',title:'The Hollow God',epi:'At the bottom of everything, past the dark behind the dark, something the size of a sky opens a single eye.',panels:[]},
 {id:'epilogue',num:'\u2756',kind:'Epilogue',title:'The Surface Forgets',epi:'You came back. The lights came back. Only you can feel that something out there stayed behind, wearing your name like a borrowed coat.',panels:[]}
];
var _loreSel='interlude';
function openLore(){hideAllScreens();state='lore';document.getElementById('lore').classList.remove('hidden');renderLoreSide();selectLore(_loreSel);}
function renderLoreSide(){
 var host=document.getElementById('loreChaps');if(!host)return;
 host.innerHTML=LORE_CHAPTERS.map(function(c){return '<div class="lore-chap'+(c.id===_loreSel?' on':'')+'" data-cid="'+c.id+'"><div class="lore-num"><span>'+c.num+'</span></div><div class="lore-cmeta"><div class="lore-ckind">'+c.kind+'</div><div class="lore-ctitle">'+c.title+'</div></div></div>';}).join('');
 host.querySelectorAll('.lore-chap').forEach(function(el){el.onclick=function(){try{sfx('thock');}catch(e){}selectLore(el.dataset.cid);};});
}
function selectLore(id){
 _loreSel=id;var ch=null;for(var i=0;i<LORE_CHAPTERS.length;i++)if(LORE_CHAPTERS[i].id===id)ch=LORE_CHAPTERS[i];if(!ch)ch=LORE_CHAPTERS[0];
 var host=document.getElementById('loreChaps');if(host)host.querySelectorAll('.lore-chap').forEach(function(el){el.classList.toggle('on',el.dataset.cid===id);});
 var main=document.getElementById('loreMain');if(main)main.innerHTML=loreMainHTML(ch);
 try{var ae=document.querySelector('#loreChaps .lore-chap.on');if(ae&&ae.scrollIntoView)ae.scrollIntoView({block:'nearest'});}catch(e){}
}
function loreMainHTML(ch){
 var body;
 if(ch.panels&&ch.panels.length){
  body=ch.panels.map(function(p){return '<div class="lore-panel">'+(p.img?'<img src="'+p.img+'" alt="">':'')+(p.text?'<div class="lore-panel-cap">'+p.text+'</div>':'')+'</div>';}).join('');
 } else {
  body='<div class="lore-frame"><div class="lore-frame-sigil">\u2756</div><div class="lore-soon">NOT YET SURFACED</div><div class="lore-soon-sub">This chapter is still descending. Hand-inked panels are being drawn in the studio above - they will sink into place here, one dive at a time.</div><div class="lore-depthtag">&gt; record sealed \u00b7 awaiting transmission</div></div>';
 }
 return '<div class="lore-page" key="'+ch.id+'"><div class="lore-kind">'+ch.kind+'</div><h1 class="lore-h">'+ch.title+'</h1><div class="lore-rule"></div><p class="lore-epi">'+ch.epi+'</p>'+body+'</div>';
}
function openLeaderboard(){hideAllScreens();state='leaderboard';
 const B=document.getElementById('leaderbody');
 B.innerHTML=`<div class="pcard" style="text-align:center;padding:30px 20px">
   <div style="font-size:40px;margin-bottom:12px;filter:drop-shadow(0 0 16px rgba(0,229,212,.6))">\u2691</div>
   <div style="font-family:var(--disp);font-size:16px;letter-spacing:.08em;color:#eaf4ff;margin-bottom:10px">GLOBAL RANKINGS</div>
   <div style="font-size:13.5px;color:var(--dim);line-height:1.6;max-width:340px;margin:0 auto">The global leaderboard is being forged in the deep. Compete with every diver worldwide, ranked by their best descent.<br><br>Coming in a future transmission.</div>
 </div>`;
 document.getElementById('leaderboard').classList.remove('hidden');}

document.getElementById('pausebtn').onclick=()=>{if(state==='playing')doPause();else if(state==='paused')doResume();};
const dodgeBtn=document.getElementById('dodgebtn');
if(IS_TOUCH){const fire=e=>{e.preventDefault();if(state==='playing'){dodgeReq=true;dodgeHeld=true;}};const rel=e=>{dodgeHeld=false;};dodgeBtn.addEventListener('touchstart',fire,{passive:false});dodgeBtn.addEventListener('mousedown',fire);dodgeBtn.addEventListener('touchend',rel);dodgeBtn.addEventListener('touchcancel',rel);dodgeBtn.addEventListener('mouseup',rel);dodgeBtn.addEventListener('mouseleave',rel);}
document.getElementById('resumebtn').onclick=doResume;
document.getElementById('quitbtn').onclick=toMenu;
document.getElementById('againbtn').onclick=toCharSelect;
document.getElementById('menubtn').onclick=toMenu;
document.getElementById('vagainbtn').onclick=toCharSelect;
document.getElementById('endgamebtn').onclick=enterEndgame;
document.getElementById('vmenubtn').onclick=toMenu;
document.getElementById('mutebtn').onclick=function(){muted=!muted;this.textContent=muted?'✕':'♪';this.style.color=muted?'#6c83b0':'';};
