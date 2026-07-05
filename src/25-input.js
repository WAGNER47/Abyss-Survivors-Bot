/* ===== INPUT ===== */
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='tab'){e.preventDefault();if(state==='playing'||state==='paused')toggleBuild();return;}if(k===' '&&!keys[' ']&&state==='playing')dodgeReq=true;keys[k]=true;if(k==='p'){if(state==='playing')doPause();else if(state==='paused')doResume();}if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();});
window.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
let touchActive=false,touchOrigin={x:0,y:0},touchVec={x:0,y:0},dodgeReq=false,dodgeHeld=false,_aimX=0,_aimY=0;
function touchPt(t){const r=cv.getBoundingClientRect();return{x:t.clientX-r.left,y:t.clientY-r.top};}
cv.addEventListener('touchstart',e=>{e.preventDefault();const p=touchPt(e.touches[0]);touchActive=true;touchOrigin={x:p.x,y:p.y};touchVec={x:0,y:0};if(!AC)initAudio();},{passive:false});
cv.addEventListener('touchmove',e=>{e.preventDefault();if(!touchActive)return;const p=touchPt(e.touches[0]);let dx=p.x-touchOrigin.x,dy=p.y-touchOrigin.y;const m=Math.hypot(dx,dy)||1,cl=Math.min(m,60)/60;touchVec={x:dx/m*cl,y:dy/m*cl};},{passive:false});
document.addEventListener('gesturestart',e=>e.preventDefault());
document.body.addEventListener('touchmove',e=>{if(state==='playing')e.preventDefault();},{passive:false});
cv.addEventListener('touchend',()=>{touchActive=false;touchVec={x:0,y:0};},{passive:true});

