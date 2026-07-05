/* ===== WARDEN BOON ===== */
function openBoon(){
 state='boon';const list=document.getElementById('boonlist');list.innerHTML='';
 const pool=BOONS.filter(b=>!b.can||b.can());for(let i=pool.length-1;i>0;i--){const j=randi(0,i);[pool[i],pool[j]]=[pool[j],pool[i]];}
 sfx('levelup');
 pool.slice(0,3).forEach((b,i)=>{const el=document.createElement('div');el.className='card';el.style.setProperty('--c',b.color);el.style.animationDelay=(i*0.06)+'s';
  el.innerHTML=`<div class="tag">${t('BOON')}</div><div class="ic">★</div><h4>${t(b.name)}</h4><div class="lv">${t('Permanent')}</div><p>${t(b.desc||'A lasting power for slaying a Warden.')}</p>`;
  el.onclick=()=>{b.apply();player.boonNames.push(b.name);recalc(player);refreshDock();pendingBoons--;document.getElementById('boon').classList.add('hidden');resumeOrNext();};
  list.appendChild(el);});
 document.getElementById('boon').classList.remove('hidden');}

