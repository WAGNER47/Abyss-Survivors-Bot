"use strict";
/* =========================================================================
   ABYSS // SURVIVORS
   A neon deep sea roguelite survivor by veil & wire studio.
   ========================================================================= */
const cv=document.getElementById('game');
const ctx=cv.getContext('2d');
// OPTIONS: global glow gate. On low quality, shadowBlur becomes a no-op for big perf wins on weak devices.
try{const _sbDesc=Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype,'shadowBlur');
 if(_sbDesc&&_sbDesc.set){Object.defineProperty(ctx,'shadowBlur',{configurable:true,get(){return _sbDesc.get.call(this);},set(v){_sbDesc.set.call(this,QX.glow?v:0);}});}}catch(e){}
let W=0,H=0,DPR=1,VIEW=1;const IS_TOUCH=('ontouchstart' in window)||navigator.maxTouchPoints>0;
function resize(){DPR=Math.min(window.devicePixelRatio||1,2);const r=cv.getBoundingClientRect();W=Math.round(r.width)||window.innerWidth;H=Math.round(r.height)||window.innerHeight;cv.width=Math.floor(W*DPR);cv.height=Math.floor(H*DPR);ctx.setTransform(DPR,0,0,DPR,0,0);VIEW=IS_TOUCH?(W<560?0.66:0.8):1;sizeDock();}
window.addEventListener('resize',resize);window.addEventListener('orientationchange',()=>setTimeout(resize,60));if(window.visualViewport){visualViewport.addEventListener('resize',resize);visualViewport.addEventListener('scroll',resize);}resize();setTimeout(resize,120);setTimeout(resize,400);

const rand=(a,b)=>a+Math.random()*(b-a);
const randi=(a,b)=>Math.floor(rand(a,b+1));
const pick=arr=>arr[Math.floor(Math.random()*arr.length)];
const clamp=(v,a,b)=>v<a?a:(v>b?b:v);
const dist2=(ax,ay,bx,by)=>{const dx=ax-bx,dy=ay-by;return dx*dx+dy*dy;};
const TAU=Math.PI*2;

let AC=null,master=null,muted=false;
// ---- PERSISTENCE LAYER (real storage for deployed builds) ----
// window.storage only exists inside the Claude.ai sandbox. In the live Telegram/Vercel
// build it is undefined, so saves were silently failing. This shim makes saving real:
// it uses localStorage everywhere, and mirrors to Telegram CloudStorage when available
// so progress can follow the player across devices.
(function(){
 const mem={};
 const hasLS=(()=>{try{localStorage.setItem('__t','1');localStorage.removeItem('__t');return true;}catch(e){return false;}})();
 const lsGet=k=>{try{return hasLS?localStorage.getItem(k):(mem[k]!=null?mem[k]:null);}catch(e){return mem[k]!=null?mem[k]:null;}};
 const lsSet=(k,v)=>{try{if(hasLS)localStorage.setItem(k,v);else mem[k]=v;}catch(e){mem[k]=v;}};
 const cloud=()=>{try{return (window.Telegram&&window.Telegram.WebApp&&window.Telegram.WebApp.CloudStorage)||null;}catch(e){return null;}};
 // shim API matches what the game already calls: get -> Promise<{value}|null>, set/remove -> Promise
 window.storage={
  get(key){return new Promise(res=>{
   const local=lsGet(key);
   const c=cloud();
   if(c&&c.getItem){c.getItem(key,(err,val)=>{ if(!err&&val!=null&&val!=='')res({value:val}); else res(local!=null?{value:local}:null); });}
   else res(local!=null?{value:local}:null);
  });},
  set(key,value){const v=String(value);lsSet(key,v);const c=cloud();if(c&&c.setItem){try{c.setItem(key,v,()=>{});}catch(e){}}return Promise.resolve({value:v});},
  delete(key){try{if(hasLS)localStorage.removeItem(key);}catch(e){}delete mem[key];const c=cloud();if(c&&c.removeItem){try{c.removeItem(key,()=>{});}catch(e){}}return Promise.resolve();}
 };
})();
// ---- OPTIONS / settings (persisted) ----
const QUALITY_LEVELS=['potato','low','medium','ultra'];
let OPT={quality:'ultra',physics:'ultra',vibration:true,volume:0.28};
let QX={particleMul:1,maxParticles:700,corpses:true,corpseMax:120,trails:true,shadows:true,glow:true};
let PX={iterMul:1,corpsePhys:true};
let _fpsWatch={t:0,frames:0,warned:false,lowFrames:0};
function fpsWatchdog(dt){if(OPT.quality==='potato')return;_fpsWatch.frames++;_fpsWatch.t+=dt;if(_fpsWatch.t>=1){const fps=_fpsWatch.frames/_fpsWatch.t;_fpsWatch.frames=0;_fpsWatch.t=0;if(fps<22){_fpsWatch.lowFrames++;if(_fpsWatch.lowFrames>=3&&!_fpsWatch.warned){_fpsWatch.warned=true;const order=['ultra','medium','low','potato'];const i=order.indexOf(OPT.quality);OPT.quality=order[Math.min(order.length-1,i+1)];OPT.physics=OPT.quality;applyQuality();saveOpt();toast('PERFORMANCE: quality lowered to '+qLabel(OPT.quality)+' \u00b7 change in Options');}}else{_fpsWatch.lowFrames=Math.max(0,_fpsWatch.lowFrames-1);}}}
function applyQuality(){
 const q=OPT.quality;
 QX.particleMul = q==='potato'?0.18 : q==='low'?0.45 : q==='medium'?0.75 : 1;
 QX.maxParticles= q==='potato'?120 : q==='low'?260 : q==='medium'?460 : 700;
 QX.shadows = q!=='potato' && q!=='low';
 QX.glow = q!=='potato';
 QX.trails = q!=='potato';
 const p=OPT.physics;
 QX.corpses = p!=='potato';
 QX.corpseMax = p==='potato'?0 : p==='low'?40 : p==='medium'?80 : 120;
 PX.corpsePhys = p!=='potato';
}
function saveOpt(){try{window.storage.set('abyss_opt',JSON.stringify(OPT));}catch(e){}}
(async()=>{try{const r=await window.storage.get('abyss_opt');if(r&&r.value){const o=JSON.parse(r.value);if(o&&typeof o==='object'){OPT=Object.assign(OPT,o);}}}catch(e){}applyQuality();muted=(OPT.volume<=0);})();
function initAudio(){try{AC=new (window.AudioContext||window.webkitAudioContext)();
 master=AC.createGain();master.gain.value=(OPT&&OPT.volume!=null)?OPT.volume:0.28;
 // creamy bus: gentle lowpass + soft compression so nothing is ever harsh
 ACfilt=AC.createBiquadFilter();ACfilt.type='lowpass';ACfilt.frequency.value=4200;ACfilt.Q.value=0.3;
 ACcomp=AC.createDynamicsCompressor();ACcomp.threshold.value=-22;ACcomp.knee.value=30;ACcomp.ratio.value=4;ACcomp.attack.value=0.004;ACcomp.release.value=0.18;
 master.connect(ACfilt);ACfilt.connect(ACcomp);ACcomp.connect(AC.destination);
 // soft reverb tail for that smooth ASMR space
 try{ACrev=AC.createConvolver();const len=Math.floor(AC.sampleRate*0.45),buf=AC.createBuffer(2,len,AC.sampleRate);
  for(let ch=0;ch<2;ch++){const d=buf.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2);}
  ACrev.buffer=buf;ACrevGain=AC.createGain();ACrevGain.gain.value=0.10;ACrev.connect(ACrevGain);ACrevGain.connect(ACfilt);}catch(e){}
 }catch(e){}}
function _voice(freq,dur,type,vol,t0,opts){opts=opts||{};const t=t0!=null?t0:AC.currentTime;
 const o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';
 o.frequency.setValueAtTime(freq,t);
 if(opts.glide!=null)o.frequency.exponentialRampToValueAtTime(Math.max(20,opts.glide),t+dur);
 // soft per-voice lowpass = the creamy roundness
 const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(opts.lp||2400,t);if(opts.lpGlide)lp.frequency.exponentialRampToValueAtTime(opts.lpGlide,t+dur);
 o.connect(lp);lp.connect(g);
 const peak=vol==null?0.3:vol,atk=opts.atk!=null?opts.atk:0.012;
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+atk);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
 g.connect(master);if(ACrev&&opts.wet!==0){const s=AC.createGain();s.gain.value=(opts.wet!=null?opts.wet:0.25)*peak;g.connect(s);s.connect(ACrev);}
 o.start(t);o.stop(t+dur+0.02);}
function _thock(t0,base,vol){const t=t0!=null?t0:AC.currentTime;base=base||300;vol=vol==null?0.3:vol;
 try{
  const clen=Math.floor(AC.sampleRate*0.018),nb=AC.createBuffer(1,clen,AC.sampleRate),nd=nb.getChannelData(0);
  for(let i=0;i<clen;i++)nd[i]=(Math.random()*2-1)*Math.pow(1-i/clen,3.5);
  const ns=AC.createBufferSource();ns.buffer=nb;
  const nf=AC.createBiquadFilter();nf.type='bandpass';nf.frequency.value=base*4.2;nf.Q.value=2.2;
  const ng=AC.createGain();ng.gain.setValueAtTime(vol*0.6,t);ng.gain.exponentialRampToValueAtTime(0.0001,t+0.02);
  ns.connect(nf);nf.connect(ng);ng.connect(master);ns.start(t);ns.stop(t+0.025);
 }catch(e){}
 _voice(base,0.055,'sine',vol*0.95,t,{glide:base*0.72,lp:1100,atk:0.001,wet:0.05});
 _voice(base*0.5,0.07,'triangle',vol*0.4,t,{glide:base*0.42,lp:700,atk:0.001,wet:0.04});}
function _bubble(t0,base,vol){const t=t0!=null?t0:AC.currentTime;
 // signature creamy bubble-pop: quick upward pitch blip through a soft filter
 _voice(base||520,0.13,'sine',vol||0.34,t,{glide:(base||520)*2.4,lp:1500,lpGlide:3200,atk:0.006,wet:0.18});
 _voice((base||520)*1.5,0.06,'sine',(vol||0.34)*0.5,t+0.005,{glide:(base||520)*3,lp:2600,atk:0.004,wet:0.12});}
function sfx(type){if(!AC||muted)return;try{const t=AC.currentTime;
 // tiny rate limiter so dense fights stay smooth, never machine-gun harsh
 if(t>_sfxBudgetT){_sfxBudgetT=t+0.05;_sfxBudget=5;}
 // hard, separate throttle for the combat tick sound: never more than ~1 per 70ms
 if(type==='hit'){if(t<_hitSfxT)return;_hitSfxT=t+0.07;}
 if(type==='pickup'){_thock(t,520,0.24);}
 else if(type==='levelup'){
  _thock(t,420,0.22);_thock(t+0.07,560,0.24);_thock(t+0.145,740,0.26);
  _voice(360,0.5,'sine',0.20,t+0.16,{glide:720,lp:2400,atk:0.04,wet:0.16});
  _voice(540,0.45,'triangle',0.10,t+0.20,{glide:900,lp:2600,atk:0.05,wet:0.12});
 }
 else if(type==='hurt')_voice(140,0.2,'sine',0.34,t,{glide:78,lp:760,atk:0.006,wet:0.18});
 else if(type==='boss')_voice(70,0.8,'sine',0.5,t,{glide:52,lp:700,atk:0.04,wet:0.5});
 else if(type==='hit')_thock(t,300+Math.random()*90,0.085);
 else if(type==='bomb'){_voice(320,0.5,'sine',0.46,t,{glide:46,lp:1400,lpGlide:300,atk:0.006,wet:0.5});_bubble(t+0.02,200,0.3);}
 else if(type==='shield')_voice(720,0.12,'sine',0.2,t,{glide:980,lp:2800,atk:0.005,wet:0.35});
 else if(type==='chest'){_thock(t,480,0.26);_bubble(t+0.08,700,0.26);_bubble(t+0.17,940,0.22);}
 else if(type==='react'){_bubble(t,460,0.34);_voice(880,0.16,'sine',0.14,t+0.03,{glide:1280,lp:3000,atk:0.006,wet:0.12});_bubble(t+0.08,1120,0.2);}
 else if(type==='evolve'){_voice(500,0.6,'sine',0.4,t,{glide:1200,lp:2600,lpGlide:4000,atk:0.02,wet:0.6});_bubble(t+0.1,800,0.3);_bubble(t+0.22,1200,0.26);}
 else if(type==='evolve'){_voice(500,0.6,'sine',0.36,t,{glide:1200,lp:2600,lpGlide:4000,atk:0.02,wet:0.6});_bubble(t+0.1,800,0.26);_bubble(t+0.22,1200,0.22);}
 else if(type==='thock')_thock(t,340,0.2);
 else if(type==='shing'){_voice(1400,0.18,'sawtooth',0.16,t,{glide:3200,lp:5200,atk:0.003,wet:0.1});_voice(2100,0.1,'triangle',0.1,t+0.01,{glide:3600,lp:6000,atk:0.002,wet:0.08});}
 else _voice(420,0.12,'sine',0.26,t,{glide:500,lp:2200,atk:0.012,wet:0.3});
}catch(e){}}

