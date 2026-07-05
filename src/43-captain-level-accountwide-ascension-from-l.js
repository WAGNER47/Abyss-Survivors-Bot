// ===== CAPTAIN LEVEL — account-wide ascension from lifetime XP =====
function captainRunXP(r){
 if(!r)return 0;
 var lvl=r.level||1,kills=r.kills||0,boss=r.boss||0,elite=r.elite||0,corr=r.corruption||0,t=r.time||0,win=(r.result==='Victory')?1:0;
 return Math.round(lvl*9 + kills*0.6 + boss*45 + elite*7 + corr*30 + t/5 + win*300);
}
function captainTotalXP(){
 var sum=0;try{for(var i=0;i<runArchive.length;i++)sum+=captainRunXP(runArchive[i]);}catch(e){}
 var net=(typeof NET!=='undefined'&&NET&&NET.stats&&(NET.stats.capXp||NET.stats.xp))||0;
 return Math.max(sum,net|0);
}
// Deep curve: early levels arrive fast, L100 is a ~5000-hour pinnacle (cumulative ~25M XP).
function captainLevelInfo(xp){
 xp=Math.max(0,Math.floor(xp||0));
 var lvl=1,floor=0,need=520;
 while(lvl<100&&xp>=floor+need){floor+=need;lvl++;need=Math.round(520*Math.pow(lvl,1.55));}
 if(lvl>=100)return {level:100,into:1,need:1,floor:floor,total:xp,pct:1,max:true};
 var into=xp-floor;
 return {level:lvl,into:into,need:need,floor:floor,total:xp,pct:Math.max(0,Math.min(1,into/need)),max:false};
}
function captainRank(lvl){
 if(lvl>=100)return {name:'THE HOLLOW GOD',c1:'#ffffff',c2:'#9beaff',glow:'rgba(180,240,255,.7)'};
 if(lvl>=78)return {name:'ELDER OF THE DEEP',c1:'#ffc24b',c2:'#ff8a3c',glow:'rgba(255,194,75,.6)'};
 if(lvl>=60)return {name:'NIGHTMARE SOVEREIGN',c1:'#ff6a8e',c2:'#ffb24b',glow:'rgba(255,106,142,.55)'};
 if(lvl>=45)return {name:'LEVIATHAN',c1:'#ff5cf0',c2:'#ff6ca8',glow:'rgba(255,92,240,.55)'};
 if(lvl>=32)return {name:'VOIDBORNE',c1:'#c46cff',c2:'#ff5cf0',glow:'rgba(196,108,255,.55)'};
 if(lvl>=22)return {name:'HADAL WRAITH',c1:'#9b6dff',c2:'#c46cff',glow:'rgba(155,109,255,.55)'};
 if(lvl>=14)return {name:'ABYSS REAPER',c1:'#5c9bff',c2:'#9b6dff',glow:'rgba(123,140,255,.5)'};
 if(lvl>=8)return {name:'TRENCH STALKER',c1:'#4fd0ff',c2:'#5c9bff',glow:'rgba(79,208,255,.5)'};
 if(lvl>=4)return {name:'DEEP DIVER',c1:'#00e5d4',c2:'#4fd0ff',glow:'rgba(0,229,212,.5)'};
 return {name:'DRIFTER',c1:'#6cffb0',c2:'#00e5d4',glow:'rgba(108,255,176,.45)'};
}
var CAP_TIERS=[{lv:1,name:'DRIFTER'},{lv:4,name:'DEEP DIVER'},{lv:8,name:'TRENCH STALKER'},{lv:14,name:'ABYSS REAPER'},{lv:22,name:'HADAL WRAITH'},{lv:32,name:'VOIDBORNE'},{lv:45,name:'LEVIATHAN'},{lv:60,name:'NIGHTMARE SOVEREIGN'},{lv:78,name:'ELDER OF THE DEEP'},{lv:100,name:'THE HOLLOW GOD'}];
// Derive a Captain level from whatever a diver has synced. Precise cap / capXp always win; otherwise
// we estimate from the durable counters (runs, kills, highest level, wins, time, corruption) that EVERY
// synced profile carries - so a friend on an older client is never falsely shown as "unsynced".
function capFromStats(st){
 if(!st)return 0;
 if(st.cap&&st.cap>0)return st.cap|0;
 var xp=capXpFromStats(st);
 if(!xp)return 0;
 try{return Math.max(1,captainLevelInfo(xp).level);}catch(e){return 1;}
}
// Best estimate of a friend's captain XP (for the progress bar) when only aggregate stats synced.
function capXpFromStats(st){
 if(!st)return 0;
 if(st.capXp&&st.capXp>0)return st.capXp|0;
 var total=st.total||st.runs||0,kills=st.kills||0,hl=st.level||st.highLevel||st.best||0,wins=st.wins||0,timeIn=st.timeIn||0,corr=st.maxCorr||0;
 if(!total&&!kills&&!hl&&!wins)return 0;
 var n=Math.max(1,total);
 return Math.round(n*hl*4.6 + kills*0.6 + timeIn/5 + wins*300 + corr*30*n*0.3);
}
