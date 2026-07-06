/* ===== AI REPORT ===== */
function fallbackReport(s,mode){const m=Math.floor(s.time/60),sec=Math.floor(s.time%60);
 if(LANG==='fa'){
  if(mode==='victory')return`\u063a\u0648\u0627\u0635 ${t(s.char)} \u067e\u0633 \u0627\u0632 ${m} \u062f\u0642\u06cc\u0642\u0647 \u0648 ${sec} \u062b\u0627\u0646\u06cc\u0647\u060c \u0628\u0627 ${s.kills} \u0647\u06cc\u0648\u0644\u0627\u06cc \u0641\u0631\u0648\u0627\u0641\u062a\u0627\u062f\u0647\u060c \u0642\u0644\u0628\u0650 \u0645\u063a\u0627\u06a9 \u0631\u0627 \u0634\u06a9\u0627\u0641\u062a. \u0698\u0631\u0641\u0627 \u0627\u06a9\u0646\u0648\u0646 \u062e\u0627\u0645\u0648\u0634 \u0627\u0633\u062a - \u0628\u0647 \u062e\u0627\u0637\u0631\u0650 \u062a\u0648.`;
  return`\u063a\u0648\u0627\u0635 ${t(s.char)} ${m} \u062f\u0642\u06cc\u0642\u0647 \u0648 ${sec} \u062b\u0627\u0646\u06cc\u0647 \u062f\u0631 \u0628\u0631\u0627\u0628\u0631\u0650 \u0645\u063a\u0627\u06a9 \u0627\u06cc\u0633\u062a\u0627\u062f \u0648 ${s.kills} \u0645\u0648\u062c\u0648\u062f \u0631\u0627 \u0627\u0632 \u067e\u0627 \u062f\u0631\u0622\u0648\u0631\u062f\u060c \u062a\u0627 \u0622\u0646\u200c\u06a9\u0647 \u062a\u0627\u0631\u06cc\u06a9\u06cc \u062f\u0631 \u0633\u0637\u062d\u0650 ${s.level} \u0641\u0631\u0648\u0628\u0633\u062a. \u0686\u0631\u0627\u063a\u200c\u0647\u0627 \u062e\u0627\u0645\u0648\u0634\u200c\u0627\u0646\u062f\u060c \u0627\u0645\u0627 \u0698\u0631\u0641\u0627 \u0622\u0646\u0627\u0646 \u0631\u0627 \u06a9\u0647 \u0631\u0648\u0634\u0646 \u0633\u0648\u062e\u062a\u0646\u062f \u0627\u0632 \u06cc\u0627\u062f \u0646\u0645\u06cc\u200c\u0628\u0631\u062f.`;
 }
 if(mode==='victory')return`Diver ${s.char} pierced the Abyss Heart after ${m}m ${sec}s and ${s.kills} fallen horrors. The deep is quiet now, because of you.`;
 return`Diver ${s.char} held the abyss for ${m}m ${sec}s, felling ${s.kills} creatures before the dark closed in at Level ${s.level}. The lights are out, but the deep remembers those who burn brightly.`;}
async function generateReport(s,mode,elId){
 const m=Math.floor(s.time/60),sec=Math.floor(s.time%60);
 const tone=mode==='victory'
  ?'a triumphant commendation for a diver who slew the Abyss Heart and conquered the deep'
  :'a short, vivid, slightly ominous field report about a diver\'s final run';
 const _faNote=(LANG==='fa')?' Write the ENTIRE report in Persian (Farsi), in a literary, epic tone \u2014 the voice of the Shahnameh.':'';
 const prompt=`You are the laconic archivist of a deep-sea survival expedition. Write ${tone} (2-3 sentences, second person addressing "you").${_faNote} No markdown, headers, or bullets. Stats:
- Diver class: ${t(s.char)}
- ${mode==='victory'?'Run length':'Survived'}: ${m}m ${sec}s
- Level reached: ${s.level}
- Creatures destroyed: ${s.kills}
- Credits salvaged: ${s.gold}
- Weapons: ${s.weapons.map(x=>t(x)).join(', ')||'none'}
- Augments: ${s.passives.map(x=>t(x)).join(', ')||'none'}
- Legendary relics: ${s.relics.map(x=>t(x)).join(', ')||'none'}
Be evocative and specific to these numbers. End on a memorable line.`;
 try{
  const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
  if(!res.ok)throw new Error('http '+res.status);
  const data=await res.json(),text=(data.content||[]).map(i=>i.type==='text'?i.text:'').join(' ').trim();
  setReport(elId,text||fallbackReport(s,mode));
 }catch(err){setReport(elId,fallbackReport(s,mode));}}
function setReport(elId,txt){const el=document.getElementById(elId);el.textContent=txt;const sig=document.createElement('div');sig.className='reportsig';sig.textContent=t('written by Claude');el.appendChild(sig);}

