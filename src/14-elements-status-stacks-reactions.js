/* ===== ELEMENTS / STATUS STACKS / REACTIONS ===== */
const ELEMENTS={kinetic:{name:'Kinetic',icon:'◆',color:'#cdd6e8',st:'bleed',pow:0.35},fire:{name:'Fire',icon:'🔥',color:'#ff7a3c',st:'burn',pow:1},ice:{name:'Ice',icon:'❄',color:'#7fdfff',st:'chill',pow:1},lightning:{name:'Lightning',icon:'⚡',color:'#ffe27a',st:'shock',pow:1},void:{name:'Void',icon:'◐',color:'#b8a3ff',st:'mark',pow:1},plasma:{name:'Plasma',icon:'✸',color:'#ff5cf0',st:'weak',pow:1},toxic:{name:'Toxic',icon:'☣',color:'#9bff5c',st:'corr',pow:1},radiation:{name:'Radiation',icon:'☢',color:'#b6ff3c',st:'rad',pow:1}};
const STATUS={inferno:{dps:13,color:'#ff9b3c'},plaguefire:{dps:24,color:'#b6ff5c'},burn:{dps:4,color:'#ff7a3c'},bleed:{dps:2.2,color:'#ff3b5e'},shock:{dps:1.6,color:'#ffe27a'},corr:{dps:2,color:'#9bff5c'},rad:{dps:1.8,color:'#b6ff3c'},chill:{dps:0,color:'#7fdfff'},mark:{dps:0,color:'#b8a3ff'},weak:{dps:0.5,color:'#ff5cf0'}};
const STEL={inferno:'fire',plaguefire:'toxic',burn:'fire',chill:'ice',shock:'lightning',mark:'void',weak:'plasma',corr:'toxic',rad:'radiation',bleed:'kinetic'};
function eSt(e){return e.st||(e.st={});}
function addSt(e,key,amt){if(key==='chill'&&player&&player.chillExtra>0&&!isBig(e))amt+=player.chillExtra;const s=eSt(e),fresh=!s[key],o=s[key]||(s[key]={n:0,t:0});o.n=Math.min(600,o.n+amt);o.t=4;if(fresh&&amt>=1){const _el=STEL[key];if(_el&&ELEMENTS[_el]&&particles.length<430)burst(e.x,e.y,ELEMENTS[_el].color,3);}
 if(key==='burn'&&o.n>=12&&!s.inferno){const inf=s.inferno=(s.inferno||{n:0,t:0});inf.n=Math.min(200,Math.ceil(o.n/3));inf.t=5;delete s.burn;spawnText(e.x,e.y-e.r-16,'INFERNO','#ff9b3c',true);ring(e.x,e.y,40,'#ff9b3c');}
 if(key==='burn'&&o.n>=300&&!e._ignited){e._ignited=true;toast('THE SCREEN IGNITES');screenShake=10;for(const x of enemies)if(!x._dead)addSt(x,'burn',60);}}
function applyEl(e,el,amt){const E=ELEMENTS[el];if(!E||e._dead)return;
 if(e.reactCd==null)e.reactCd=0;
 const sC=eSt(e);
 if(el==='toxic'&&sC.inferno){const pf=sC.plaguefire=(sC.plaguefire||{n:0,t:0});pf.n=Math.min(200,pf.n+Math.ceil(sC.inferno.n*0.8)+4);pf.t=5;delete sC.inferno;spawnText(e.x,e.y-e.r-16,'PLAGUEFIRE','#b6ff5c',true);ring(e.x,e.y,52,'#b6ff5c');}
 else if(el==='void'&&sC.plaguefire){const pn=sC.plaguefire.n;delete sC.plaguefire;const dmC=player.damageMult;
  ring(e.x,e.y,120,'#9b6dff');ring(e.x,e.y,60,'#b6ff5c');screenShake=Math.max(screenShake,7);
  dealDamage(e,(80+pn*6)*dmC,{tick:true});
  for(const x of queryNear(e.x,e.y,130)){if(x._dead)continue;const ix=e.x-x.x,iy=e.y-x.y,idd=Math.hypot(ix,iy)||1,im=Math.max(0.6,x.m||x.r*x.r/100);x.kvx=(x.kvx||0)+ix/idd*420/im;x.kvy=(x.kvy||0)+iy/idd*420/im;if(x!==e)dealDamage(x,(30+pn*2)*dmC,{tick:true});}
  spawnText(e.x,e.y-e.r-16,'ABYSSAL COLLAPSE','#9b6dff',true);}
 if(e.reactCd<=0){const s=eSt(e);for(const k in s){if(s[k].n>=1&&STEL[k]!==el){if(tryReact(e,el,STEL[k],k))break;}}}
 addSt(e,E.st,amt*E.pow*(isBig(e)?0.65:1));}
