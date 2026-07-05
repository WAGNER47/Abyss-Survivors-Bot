/* ===== AI REPORT ===== */
function fallbackReport(s,mode){const m=Math.floor(s.time/60),sec=Math.floor(s.time%60);
 if(mode==='victory')return`Diver ${s.char} pierced the Abyss Heart after ${m}m ${sec}s and ${s.kills} fallen horrors. The deep is quiet now, because of you.`;
 return`Diver ${s.char} held the abyss for ${m}m ${sec}s, felling ${s.kills} creatures before the dark closed in at Level ${s.level}. The lights are out, but the deep remembers those who burn brightly.`;}
async function generateReport(s,mode,elId){
 const m=Math.floor(s.time/60),sec=Math.floor(s.time%60);
 const tone=mode==='victory'
  ?'a triumphant commendation for a diver who slew the Abyss Heart and conquered the deep'
  :'a short, vivid, slightly ominous field report about a diver\'s final run';
 const prompt=`You are the laconic archivist of a deep-sea survival expedition. Write ${tone} (2-3 sentences, second person addressing "you"). No markdown, headers, or bullets. Stats:
- Diver class: ${s.char}
- ${mode==='victory'?'Run length':'Survived'}: ${m}m ${sec}s
- Level reached: ${s.level}
- Creatures destroyed: ${s.kills}
- Credits salvaged: ${s.gold}
- Weapons: ${s.weapons.join(', ')||'none'}
- Augments: ${s.passives.join(', ')||'none'}
- Legendary relics: ${s.relics.join(', ')||'none'}
Be evocative and specific to these numbers. End on a memorable line.`;
 try{
  const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
  if(!res.ok)throw new Error('http '+res.status);
  const data=await res.json(),text=(data.content||[]).map(i=>i.type==='text'?i.text:'').join(' ').trim();
  setReport(elId,text||fallbackReport(s,mode));
 }catch(err){setReport(elId,fallbackReport(s,mode));}}
function setReport(elId,txt){const el=document.getElementById(elId);el.textContent=txt;const sig=document.createElement('div');sig.className='reportsig';sig.textContent='written by Claude';el.appendChild(sig);}

