/* ===== end i18n ===== */
/* ===== FULL PERSIAN (FA) CONTENT — literary localization =====
   trDyn(root): generic walker for dynamically-built screens (captain, profile, cosmetics,
   codex, social, archive). Translates every exact-match text node; caches originals so
   switching languages stays lossless. FA_WD / FA_PD mirror the weapon & passive desc
   functions with native Persian phrasing (numbers stay live). */
function trDyn(root){
 if(!root)return;
 try{
  const w=document.createTreeWalker?document.createTreeWalker(root,4):null;
  if(w){let n;while(n=w.nextNode()){if(n._raw===undefined)n._raw=n.nodeValue;const tr=(n._raw||'').trim();if(tr.length>1)n.nodeValue=n._raw.replace(tr,t(tr));}}
  else{(function walk(el){el.childNodes&&el.childNodes.forEach(n=>{if(n.nodeType===3){if(n._raw===undefined)n._raw=n.nodeValue;const tr=n._raw.trim();if(tr.length>1)n.nodeValue=n._raw.replace(tr,t(tr));}else if(n.nodeType===1&&n.tagName!=='SCRIPT'&&n.tagName!=='STYLE')walk(n);});})(root);}
 }catch(e){}
}
const FA_WD={
bolt:l=>`${1+Math.floor(l/2)} تیرِ تندِ تپش، با ${2+Math.floor(l/3)} رخنه، بُردِ بلند.`,
orbit:l=>`${l} خُردخورشید گِردت می‌چرخند و هر چه را بسایند می‌سوزانند. هر برخورد، دوزخ‌آتش را برمی‌افروزد؛ جرقه‌ی فروریزشِ مغاک.`,
aura:l=>`میدانی از فروغ، هر دشمنی را که در برد باشد می‌گدازد.`,
spread:l=>`مخروطی از ${4+l} نیزه به سوی نزدیک‌ترین گله.`,
chain:l=>`آذرخش تا ${3+Math.floor(l/2)} دشمن زنجیر می‌شود.`,
seek:l=>`${1+Math.floor(l/2)} ذره‌ی جوینده که خود شکار را می‌یابند.`,
fireaoe:l=>`شکوفه‌ی اخگر: آسیبِ انفجاری و سوختنِ پیوسته.`,
iceaoe:l=>`ترکشِ یخ گِردِ تو؛ آسیب همراهِ سرمازدگی (کندی).`,
bleedaoe:l=>`خون‌ریزیِ انباشته بر نزدیک‌ترین گله.`,
poison:l=>`ابرِ زهر، با زهرِ انباشته.`,
sling:l=>`گلوله‌ی سنگین، پس‌رانشِ بزرگ، کمانه به ${1+Math.floor(l/3)} دشمنِ دیگر.`,
spirit:l=>`${1+Math.floor(l/3)} شبحِ اثیری که از میانِ همه می‌گذرند.`,
chaos:l=>`دشمنی به تصادف؛ آسیبِ آشوب، وحشی و ناپایدار.`,
rifle:l=>`شلیکی بلند که یک هدف را از هستی می‌روبد. در دستِ تک‌انداز، مرگ‌بار.`,
fists:l=>`ضربه‌های رزمی هرچه را در دسترس باشد می‌کوبند؛ مشت‌ها یک‌درمیان، با پس‌رانش.`,
saber:l=>`تیغ‌های چرخان هر نزدیک‌شونده‌ای را می‌شکافند. بر افعی: بردِ بلندتر، پس‌رانشِ عظیم، تا ۸ تیغ.`,
lightaoe:l=>`آذرخش را بر ${2+Math.floor(l/2)} دشمنِ نزدیک فرا می‌خواند و سرمازده‌شان می‌کند.`,
deflect:l=>`آتشِ دشمن را در هوا می‌شکند و نزدیکان را برق‌زده می‌کند.`,
siege:l=>`در برابرِ سیاهی‌لشکر فروتن، بر یلان و فرمانروایان ویرانگر (x${(2.5+l*0.3).toFixed(1)}).`,
glint:l=>`${3+l} شمشیرِ شبح‌گون فرا می‌خواند که بادبزنی می‌گشایند و رخنه می‌کنند.`,
chaosspirit:l=>`${1+Math.floor(l/3)} روحِ آشوب که شکار را می‌جویند و از همه می‌گذرند.`,
duality:l=>`گویِ آمیزگر را می‌افکند که بر نزدیک‌ترین گله می‌ترکد و آذرخش و پلاسما را در دم به «بیش‌بار» می‌آمیزد. آسیبِ سنگین، و گله را می‌پراکند.`,
trident:l=>`رگباری ${3+(l>=8?2:(l>=5?1:0))}تیره می‌کوبد. ${24+l*9} آسیب بر هر تیر، رخنه ${2+Math.floor(l/3)}. رئیسِ لنگرگاه با این دندان‌هایش را خلال می‌کند.`
};
const FA_PD={
power:l=>`+${l*15}٪ آسیب بر همه‌چیز.`,
haste:l=>`+${Math.round((1-Math.pow(0.88,l))*100)}٪ شتابِ آتش.`,
vitality:l=>`+${l*25} بدنه‌ی بیشینه (و ترمیم نیز می‌کند).`,
swift:l=>`+${l*9}٪ شتابِ حرکت.`,
multi:l=>`+${l} گلوله بر همه‌ی سلاح‌ها، حتی تفنگِ تک‌انداز. انباشته کن تا توفان ببارد.`,
area:l=>`+${l*14}٪ پهنه و اندازه‌ی گلوله.`,
wisdom:l=>`+${l*20}٪ رِزونانسِ (تجربه‌ی) دریافتی.`,
magnet:l=>`+${l*50} شعاعِ ربایشِ غنیمت.`,
regen:l=>`بازسازیِ ${(l*1.0).toFixed(1)} بدنه در ثانیه.`,
armor:l=>`-${l*3} آسیبِ دریافتی از هر ضربه.`,
crit:l=>`+${l*9}٪ بختِ ضربه‌ی کاری.`,
bulwark:l=>`+${l*2} زره و +${l*15} بدنه‌ی بیشینه.`,
pierce:l=>`+${l} رخنه بر همه‌ی گلوله‌ها.`,
knock:l=>`+${l*35}٪ پس‌رانش بر هر ضربه. به پروازشان درآور.`,
thorns:l=>`بازتابِ ${l*18} آسیب بر هر که تو را بزند.`,
greed:l=>`+${l*18}٪ اعتبار، +${l*12}٪ تجربه، +${l*30} بردِ ربایش.`,
energyshield:l=>`+${l*25} سپرِ خودترمیم که ضربه‌ها را می‌بلعد.`,
capacitor:l=>`سپرها و حائل ${Math.round((1-Math.pow(0.8,l))*100)}٪ تندتر پر می‌شوند.`,
drone:l=>`+${l} پهپادِ همرزم.`
};
function faWD(id,l){try{return (LANG==='fa'&&FA_WD[id])?FA_WD[id](l):WEAPONS[id].desc(l);}catch(e){try{return WEAPONS[id].desc(l);}catch(_){return '';}}}
function faPD(id,l){try{return (LANG==='fa'&&FA_PD[id])?FA_PD[id](l):PASSIVES[id].desc(l);}catch(e){try{return PASSIVES[id].desc(l);}catch(_){return '';}}}
Object.assign(I18N.fa,{
/* — elements — */
"Fire":"آتش","Ice":"یخ","Lightning":"آذرخش","Toxic":"زهر","Radiation":"تابش","Void":"نیستی","Plasma":"پلاسما","Kinetic":"جنبشی","base":"پایه",
/* — weapon names — */
"Pulse Bolt":"تیرِ تپش","Mini Suns":"خُردخورشیدها","Lumen Field":"میدانِ فروغ","Scatter Lance":"نیزه‌پاش","Arc Tether":"زنجیرِ آذرخش","Seeker Motes":"ذره‌های جوینده","Cinder Bloom":"شکوفه‌ی اخگر","Frost Nova":"ترکشِ یخ","Rupture":"شکافت","Venom Spores":"هاگ‌های زهر","Slingshot":"فلاخن","Spirit Lash":"تازیانه‌ی روح","Chaos Bolt":"تیرِ آشوب","Sharpshooter":"تک‌تیرانداز","Iron Fists":"مشت‌های آهنین","Light Saber":"شمشیرِ نور","Storm Caller":"توفان‌خوان","Deflector Field":"سپرِ بازتاب","Siege Breaker":"دژشکن","Glintblade":"برق‌تیغ","Chaos Spirit":"روحِ آشوب","Catalyst":"آمیزگر",
/* — passive names — */
"Overcharge":"بیش‌توان","Synaptic":"تندپیوند","Plating":"زره‌پوش","Thrusters":"رانشگرها","Splitter":"چندپار","Resonate":"هم‌آوایی","Attunement":"هم‌کوکی","Lure Field":"میدانِ ربایش","Mendgel":"ژلِ ترمیم","Carapace":"سخت‌پوست","Focus Lens":"عدسیِ تمرکز","Bulwark":"بارو","Penetrator":"رخنه‌گر","Impact Driver":"کوبنده","Retaliate":"کین‌خواه","Scavenger":"غنیمت‌گر","Energy Shield":"سپرِ انرژی","Capacitor":"انباره","Drone Bay":"آشیانه‌ی پهپاد",
/* — characters — */
"Vanguard":"پیشتاز","The Reliable One":"استوارِ همیشگی",
"\"Point me at the dark. I'll empty the mag and reload before you blink.\" Old school trigger discipline. Fast, far, and it hits where it counts.":"«مرا رو به تاریکی بگیر؛ پیش از آن‌که پلک بزنی خشاب را خالی کرده و پر کرده‌ام.» انضباطِ ماشه به سبکِ کهن. تند، دوررس، و درست همان‌جا می‌زند که باید.",
"Sentinel":"دیده‌بان","The Immovable":"جنبش‌ناپذیر",
"\"Bullets? Cute. Come closer.\" A wall with a grudge. Fodder fire just pings off the field while the cold drags them in to die.":"«گلوله؟ بامزه است. نزدیک‌تر بیا.» دیواری کینه‌به‌دل. آتشِ سیاهی‌لشکر از میدانش کمانه می‌کند و سرما آنان را به درون می‌کشد تا بمیرند.",
"Ranger":"تکاور","The Opportunist":"فرصت‌شکار",
"\"In, paid, gone. Heroics don't pay rent.\" Light on her feet, heavy on the loot, and the longest blink dash in the deep.":"«می‌روم، می‌گیرم، می‌گریزم. پهلوانی اجاره‌خانه نمی‌دهد.» سبک‌پا، سنگین‌غنیمت، با بلندترین جهشِ برق‌آسای ژرفا.",
"Sniper":"تک‌انداز","The Cold Hand":"دستِ سرد",
"\"One breath. One target. One hole.\" Made of glass and patience. The drone watches her back so she never has to.":"«یک نفس. یک هدف. یک سوراخ.» از شیشه و شکیبایی ساخته شده. پهپاد پشتش را می‌پاید تا او هرگز ناچار نشود.",
"Vyper":"افعی","The Whirlwind":"گردباد",
"\"Stay close. It's more fun when they can see it coming.\" Spins through the swarm flinging bodies, and the field eats their bullets so you never have to.":"«نزدیک بمان؛ وقتی مرگ را ببینند تماشایی‌تر است.» چرخان از دلِ انبوه می‌گذرد و پیکرها را می‌پراکَنَد؛ میدانش گلوله‌هاشان را می‌بلعد تا تو ناچار نباشی.",
"Yujin":"یوجین","The Fallen Samurai":"سامورایِ فروافتاده",
"\"A blade I lost. A discipline I kept.\" No dash, no shield, just footwork and a perfect parry with no cooldown. Glass body, river feet. Read the deep and turn its fury back on it.":"«تیغی را گم کردم؛ آیینی را نگاه داشتم.» نه جهشی، نه سپری؛ تنها پاورزی و دفعی بی‌نقص، بی‌هیچ بازدمی. تنی از شیشه، پاهایی چون رود. ژرفا را بخوان و خشمش را به خودش بازگردان.",
"Rhino":"کرگدن","The Juggernaut":"کوه‌پیکر",
"Flux":"فلاکس","The Reaction Weaver":"بافنده‌ی واکنش‌ها",
/* char perk lines (HTML preserved) */
"<span>+20%</span> dmg · <span>+18%</span> fire rate · <b style=\"color:#ffe27a\">+12% crit</b> · +1 pierce · dodge":"<span>+20%</span> آسیب · <span>+18%</span> شتابِ آتش · <b style=\"color:#ffe27a\">+12% ضربه‌ی کاری</b> · +1 رخنه · جاخالی",
"<span>permanent shield</span> · <b style=\"color:#9b6dff\">chilling field</b> · faster guns in a crowd · no dodge, doesn't need it":"<span>سپرِ همیشگی</span> · <b style=\"color:#9b6dff\">میدانِ سرما</b> · در شلوغی تندتر می‌بارد · جاخالی ندارد، نیازی هم ندارد",
"<span>+16%</span> speed · huge lure · <b style=\"color:#ffc24b\">+25% loot</b> · +1 shot · <b style=\"color:#ffc24b\">long dodge</b>":"<span>+16%</span> شتاب · ربایشِ پهناور · <b style=\"color:#ffc24b\">+25% غنیمت</b> · +1 شلیک · <b style=\"color:#ffc24b\">جاخالیِ بلند</b>",
"<span>one shot rifle</span> · <b style=\"color:#8affc0\">2 companion drones</b> · <b style=\"color:#ff5a6e\">rifle kills feed resonance instantly</b> · fragile · long dodge":"<span>تفنگِ تک‌شلیک</span> · <b style=\"color:#8affc0\">۲ پهپادِ همراه</b> · <b style=\"color:#ff5a6e\">شکارِ تفنگ بی‌درنگ رِزونانس می‌دهد</b> · شکننده · جاخالیِ بلند",
"<span>+35%</span> speed · <span>+120</span> hull · <b style=\"color:#7fe6ff\">projectile shield</b> · spinning Light Saber · dodge":"<span>+35%</span> شتاب · <span>+120</span> بدنه · <b style=\"color:#7fe6ff\">سپرِ گلوله‌گیر</b> · شمشیرِ نورِ چرخان · جاخالی",
"<span>parry anything</span> (no cooldown) · <b style=\"color:#ffe27a\">fastest movement</b> · martial fists · low hull · no dodge":"<span>دفعِ هر چیز</span> (بی‌بازدم) · <b style=\"color:#ffe27a\">تندترین گام</b> · مشتِ رزمی · بدنه‌ی کم · بی‌جاخالی",
"<span>no weapon, the charge is everything</span> · <b style=\"color:#ff9b4b\">hold up to 4s: more range, damage, knockback</b> · invincible mid-charge · trample + aftershock · huge hull":"<span>بی‌سلاح؛ یورش همه‌چیز است</span> · <b style=\"color:#ff9b4b\">تا ۴ ثانیه نگه دار: بردِ بیشتر، آسیب و پس‌رانشِ بیشتر</b> · در میانه‌ی یورش رویین‌تن · لگدمال + پس‌لرزه · بدنه‌ی عظیم",
"<span>starts with the Catalyst (instant Overload)</span> · <b style=\"color:#b6ff3c\">stronger reactions and bigger zones</b> · Hex: warp the swarm + go untouchable · shrugs off fields · walks through black holes":"<span>با آمیزگر می‌آغازد (بیش‌بارِ آنی)</span> · <b style=\"color:#b6ff3c\">واکنش‌های نیرومندتر و پهنه‌های بزرگ‌تر</b> · طلسم: انبوه را دگرگون کن و رویین‌تن شو · میدان‌ها را به هیچ می‌گیرد · از دلِ سیاه‌چاله می‌گذرد",
/* — boons — */
"+22% Damage":"+۲۲٪ آسیب","More teeth. No catch. Just bite harder.":"دندانِ بیشتر. بی‌هیچ اما و اگر. فقط سخت‌تر گاز بگیر.",
"+70 Max Hull":"+۷۰ بدنه‌ی بیشینه","Bolt on more plate. The deep hits back.":"ورقِ زرهِ تازه ببند؛ ژرفا پاسخِ ضربه را می‌دهد.",
"+10% Attack Speed":"+۱۰٪ شتابِ آتش","Trigger finger's twitching. Let it.":"انگشتِ ماشه می‌پرد؛ بگذار بپرد.",
"Twin Chamber":"خزانه‌ی دوقلو","Double load the chamber. One trigger, two answers.":"خزانه را دوبار پر کن. یک ماشه، دو پاسخ.",
"+12% Move Speed":"+۱۲٪ شتابِ حرکت","Lighter on the fins. Catch me if you can.":"سبک‌بال‌تر بران. اگر می‌توانی مرا بگیر.",
"+10% Crit Chance":"+۱۰٪ بختِ ضربه‌ی کاری","You see the seams in everything now. Aim there.":"اکنون درزِ هر چیز را می‌بینی. همان‌جا را نشانه برو.",
"+16% Area":"+۱۶٪ پهنه","Bigger blast radius. Subtlety's overrated.":"شعاعِ انفجارِ بزرگ‌تر. ظرافت را زیادی بزرگش کرده‌اند.",
"+40 Energy Shield":"+۴۰ سپرِ انرژی","One more layer of 'not today.' +40 shield.":"یک لایه‌ی دیگر از «امروز نه». +۴۰ سپر.",
"Heal 1.2% per Kill":"ترمیمِ ۱٫۲٪ با هر شکار","Kill, heal, repeat. The deep pays its debts.":"بکش، ترمیم شو، تکرار کن. ژرفا بدهی‌اش را می‌پردازد.",
"Evolution Catalyst":"آمیزگرِ تکامل","Push a maxed gun past its limits. Watch it become something else.":"سلاحِ به‌سقف‌رسیده را از مرزش فراتر بران و تماشا کن که چیزِ دیگری می‌شود.",
"Elemental Graft":"پیوندِ عنصر","Lock an element into a weapon that has none. Choose your reactions.":"عنصری را در سلاحی بی‌عنصر قفل کن. واکنش‌هایت را خودت برگزین.",
"Phoenix Protocol":"آیینِ ققنوس","Titan Slayer":"یل‌افکن","Event Ward":"طلسمِ رخداد","Bounty Surge":"خیزابِ غنیمت","+30% Reaction Power":"+۳۰٪ توانِ واکنش","Lingering Deep":"ژرفای ماندگار","Reactive Ward":"طلسمِ واکنشی","Deep Freeze":"یخ‌بندانِ ژرف",
"A lasting power for slaying a Warden.":"نیرویی ماندگار، پاداشِ برافکندنِ یک نگهبان.","BOON":"موهبت","Permanent":"دائمی","Acquire":"برداشتن",
/* — relics — */
"Twin Cores":"هسته‌های دوقلو","Why fire one when the deep brought friends? +1 projectile, everything.":"چرا یکی شلیک کنی وقتی ژرفا مهمان آورده؟ +۱ گلوله بر همه‌چیز.",
"Bloodthirst":"خون‌خواهی","Every kill tops you off. The abyss feeds you back. +2% hull per body.":"هر شکار جانی تازه‌ات می‌دهد. مغاک بازت می‌خورانَد. +۲٪ بدنه با هر پیکر.",
"Glass Cannon":"توپِ شیشه‌ای","Hit like a god, fold like paper. +50% damage, -25% hull. Live fast.":"چون خدایان بزن، چون کاغذ تا شو. +۵۰٪ آسیب، -۲۵٪ بدنه. تند زندگی کن.",
"Avarice":"آز","Greed is a survival trait down here. Double credits, double rez.":"این پایین، آز خصلتِ زنده‌ماندن است. اعتبارِ دوبرابر، رِزونانسِ دوبرابر.",
"Aegis Reactor":"رآکتورِ سپر","Spin up the ablative field. +60 shield between you and oblivion.":"میدانِ سپر را به چرخش درآور. +۶۰ سپر میانِ تو و نیستی.",
"Executioner":"جلاد","No wounded. Only deleted. +20% crit, crits hit for x3.":"زخمی نمی‌ماند؛ فقط محو می‌شود. +۲۰٪ ضربه‌ی کاری، و کاری‌ها ×۳ می‌زنند.",
"Overclock":"فراچرخ","Redline the rig, ignore the warnings. +20% attack speed.":"دستگاه را به خطِ سرخ بران و هشدارها را نشنیده بگیر. +۲۰٪ شتابِ آتش.",
"Detonator":"چاشنی","Every crit leaves a crater. They go off in a chain. 35% splash.":"هر ضربه‌ی کاری دهانه‌ای بر جا می‌گذارد و زنجیره‌وار می‌ترکند. ۳۵٪ آسیبِ پاشش.",
"Unstable Catalyst":"آمیزگرِ ناپایدار","Your elemental reactions hit much harder. +60% reaction and ground-zone damage.":"واکنش‌های عنصری‌ات بسیار سخت‌تر می‌کوبند. +۶۰٪ آسیبِ واکنش و پهنه‌های زمینی.",
"Deep Wellspring":"چشمه‌ی ژرف","Reactive Plating":"زرهِ واکنشی","Permafrost Lattice":"شبکه‌ی یخ‌بندانِ جاوید",
/* — cosmetics — */
"Native Signature":"امضای بومی","Each diver's original colors.":"رنگ‌های اصیلِ هر غواص.","Abyssal Teal":"فیروزه‌ی مغاک","Deep-current cyan.":"آبیِ جریانِ ژرف.","Magma Core":"هسته‌ی گدازه","Molten orange and gold.":"نارنجی و زرِ مذاب.","Void Violet":"بنفشِ نیستی","Singularity purple.":"ارغوانِ تکینگی.","Toxic Bloom":"شکوفه‌ی زهر","Irradiated green.":"سبزِ پرتوخورده.","Plasma Pink":"صورتیِ پلاسما","Searing magenta.":"سرخابیِ سوزان.","Royal Gold":"زرِ شاهانه","Sovereign gold.":"طلای فرمانروایان.","Glacier":"یخچالِ کهن","Frozen pale blue.":"آبیِ رنگ‌پریده‌ی یخ‌زده.","Crimson Tide":"موجِ سرخ","Arterial red.":"سرخِ شریانی.","Phantom White":"سپیدِ شبح","Pure ghost white.":"سپیدیِ نابِ ارواح.","Electric Sky":"آسمانِ برق","Lightning blue.":"آبیِ آذرخش.","Sunset Coral":"مرجانِ شفق","Warm coral pink.":"صورتیِ گرمِ مرجانی.","Spectrum":"رنگین‌طیف","A slowly shifting rainbow hue.":"رنگین‌کمانی که آهسته می‌گردد.","Native Wake":"ردِ بومی","Per-diver default trail.":"دنباله‌ی پیش‌فرضِ هر غواص.","None":"هیچ","No trail at all.":"بی‌هیچ دنباله‌ای.","Comet":"دنباله‌دار","A long, fading comet tail.":"دُمِ بلند و محوشونده‌ی یک دنباله‌دار.","Ribbon":"روبان","A smooth, wide flowing ribbon.":"روبانی پهن و روان.","Echo":"پژواک","Afterimages of your hull.":"پس‌تصویرهای بدنه‌ات.","Bubbles":"حباب‌ها","Rising deep-sea bubbles.":"حباب‌هایی که از ژرفا برمی‌خیزند.","Embers":"اخگرها","Trailing sparks of fire.":"جرقه‌های دنباله‌دارِ آتش.","Neon Wisp":"شعله‌نئون","Long glowing electric wisp.":"رشته‌ی بلند و تابانِ برق.","Stardust":"غبارِ ستاره","Twinkling particle dust.":"غبارِ ذره‌های چشمک‌زن.","Ink Cloud":"ابرِ مرکب","A dark spreading smear.":"لکه‌ای تیره که می‌گسترد.","Plasma Arc":"کمانِ پلاسما","A crackling dual-tone ribbon.":"روبانی دوسویه و جرقه‌زن.","Frost Trail":"ردِ یخ","Glittering ice crystals.":"بلورهای درخشانِ یخ.","Native Aura":"هاله‌ی بومی","Per-diver signature aura.":"هاله‌ی امضای هر غواص.","No aura.":"بی‌هاله.","Halo":"هاله","A soft radiant halo.":"هاله‌ای نرم و تابان.","Orbit Rings":"حلقه‌های مداری","Three counter-rotating rings.":"سه حلقه‌ی واگرد.","Ion Orbit":"مدارِ یونی","Orbiting energy nodes.":"گره‌های انرژیِ چرخان.","Pulse":"تپش","Expanding sonar pulses.":"تپش‌های گسترنده‌ی سونار.","Rune Crown":"تاجِ رمز","Rotating runic glyphs.":"نشان‌های رمزیِ چرخان.","Flame Crown":"تاجِ شعله","A licking corona of fire.":"تاجی از زبانه‌های آتش.","Frost Veil":"چادرِ یخ","A crystalline frost ring.":"حلقه‌ای بلورین از یخ.","Vortex":"گرداب","A swirling particle vortex.":"گردابی از ذره‌های چرخان.","Implosion":"فروریزش","The signature teal burst.":"ترکشِ فیروزه‌ایِ امضا.","Supernova":"اَبَرنواختر","A blinding white shockwave.":"موجی سپید و کورکننده.","Void Collapse":"فروپاشیِ نیستی","An inward purple singularity.":"تکینگیِ ارغوانیِ درون‌کِش.","Shatter":"خُردشدن","A spray of crystal shards.":"افشانه‌ای از تکه‌های بلور.","Spore Bloom":"شکوفه‌ی هاگ","A slow toxic cloud.":"ابرِ زهرِ آهسته.","Gilded End":"پایانِ زراندود","A golden farewell.":"بدرودی زرین.","Meltdown":"ذوبِ کامل","A molten eruption.":"فورانی مذاب.","Native":"بومی","Each weapon keeps its colors.":"هر سلاح رنگِ خودش را نگه می‌دارد.","Neon":"نئون","Bright glowing neon rounds.":"گلوله‌های نئونیِ تابان.","Bone":"استخوان","Pale ivory shards.":"تکه‌های عاجِ رنگ‌پریده.","Electric pink and blue.":"صورتی و آبیِ برقی.","Gold":"زر","Molten gold rounds.":"گلوله‌های زرِ مذاب.","Dark-matter bolts.":"تیرهای ماده‌ی تاریک.","Ember":"اخگر","Burning ember rounds.":"گلوله‌های اخگرِ سوزان.","Frost":"یخ‌زده","Icy crystal shots.":"شلیک‌های بلورِ یخ.","Hue-shifting prismatic rounds.":"گلوله‌های منشوریِ رنگ‌گردان.",
/* — captain tiers + labels — */
"DRIFTER":"سرگردان","DEEP DIVER":"ژرف‌غوص","TRENCH STALKER":"شکارچیِ گودال","ABYSS REAPER":"دروگرِ مغاک","HADAL WRAITH":"شبحِ ژرفنا","VOIDBORNE":"نیستی‌زاد","LEVIATHAN":"لویاتان","NIGHTMARE SOVEREIGN":"فرمانروای کابوس","ELDER OF THE DEEP":"پیرِ ژرفا","THE HOLLOW GOD":"خدای تهی",
"APEX RANK ACHIEVED":"به فرازینه‌رتبه رسیدی","TIER":"رده","MAX":"بیشینه","LIFETIME XP":"تجربه‌ی همه‌ی عمر","NEXT RANK":"رتبه‌ی بعد","LV":"سطح",
/* — profile axes + flavors — */
"AGGRESSION":"تهاجم","ENDURANCE":"پایداری","MOBILITY":"چابکی","PRECISION":"دقت","GREED":"آز","SURVIVOR":"بازمانده","TANK":"سپرِ گوشتی","DEADEYE":"چشمِ مرگ","JUGGERNAUT":"کوه‌پیکر","STORMBRINGER":"توفان‌آور","DEEP DWELLER":"ساکنِ ژرفا","TREASURE DIVER":"گنج‌غواص","MOVEMENT RUNNER":"دونده‌ی بی‌قرار","UNWRITTEN":"نانوشته","RUNNER LINK STABLE":"پیوندِ دونده پایدار","SOMETHING MOVED BELOW":"چیزی آن پایین جنبید","DO NOT FOLLOW THE LIGHT":"از پیِ نور مرو",
/* — social labels — */
"Accept":"پذیرفتن","Add":"افزودن","Captain rank":"رتبه‌ی کاپیتان","Copy":"رونوشت","Decline":"رد کردن","Friend Requests":"درخواست‌های دوستی","My Diver Code":"کدِ غواصِ من","Network Diagnostics":"عیب‌یابیِ شبکه","Online":"برخط","Open Inside Telegram":"در تلگرام باز کن","Send":"فرستادن","Your Divers":"غواصانِ تو",
/* — archive / misc — */
"VICTORY":"پیروزی","FELL":"فروافتاد","New weapon:":"سلاحِ نو:","This weapon gains two levels.":"این سلاح دو سطح بالا می‌رود.","This weapon gains a level.":"این سلاح یک سطح بالا می‌رود.","Credit Stash":"اندوخته‌ی اعتبار","+150 credits.":"+۱۵۰ اعتبار.","+60 credits.":"+۶۰ اعتبار.","Restore 30% of your max hull.":"۳۰٪ از بدنه‌ی بیشینه‌ات را بازمی‌گرداند.","Gain 25 credits.":"۲۵ اعتبار می‌گیری.","+35% power, +1 projectile, faster & wider.":"+۳۵٪ توان، +۱ گلوله، تندتر و پهن‌تر.",
"You will be remembered, champion. The deep keeps your light now.":"از یاد نخواهی رفت، ای پهلوان. اکنون ژرفا نورِ تو را نگاه می‌دارد.",
"You didn't just fail. You disappointed me.":"تو فقط شکست نخوردی؛ مرا ناامید کردی."
});
Object.assign(I18N.fa,{
/* — statuses — */
"Burn":"سوختن","Fire damage over time. Stacks add up fast: 1 stack is 4 dmg/sec, 50 stacks is 200/sec. Hit 300 stacks on one target and the whole screen ignites.":"آسیبِ آتش در گذرِ زمان. انباشته‌ها تند بالا می‌روند: ۱ انباشته ۴ آسیب بر ثانیه است و ۵۰ انباشته ۲۰۰. به ۳۰۰ انباشته بر یک هدف برس تا سراسرِ پرده شعله‌ور شود.",
"Chill":"سرمازدگی","Ice slows enemies. More stacks, slower foes. Pairs beautifully with anything that wants targets to sit still.":"یخ دشمنان را کند می‌کند. انباشته‌ی بیشتر، دشمنِ کندتر. با هر چه هدفِ بی‌حرکت بخواهد، هم‌نشینِ زیبایی است.",
"Shock":"برق‌زدگی","Lightning damage over time that loves a crowd. Cheap to apply, great for softening packs.":"آسیبِ آذرخش در گذرِ زمان، که عاشقِ شلوغی است. ارزان می‌نشیند و گله‌ها را خوب نرم می‌کند.",
"Corrosion":"خوردگی","Toxic rot that eats hull steadily. The patient killer.":"پوسیدگیِ زهرآگین که بدنه را پیوسته می‌خورَد. قاتلِ شکیبا.",
"Radiation":"تابش","Nuclear decay damage. Feeds the Mutation reaction for fatter loot.":"آسیبِ واپاشیِ هسته‌ای. واکنشِ «جهش» را می‌خورانَد تا غنیمت فربه‌تر شود.",
"Marked":"نشان‌خورده","Void brand. Marked enemies take escalating bonus damage from every hit, up to +75%.":"داغِ نیستی. نشان‌خورده از هر ضربه آسیبِ افزوده‌ی فزاینده می‌گیرد، تا +۷۵٪.",
"Weakened":"سست‌شده","Plasma overload. Weakened enemies hit you softer. Survival through suppression.":"بیش‌بارِ پلاسما. سست‌شده‌ها نرم‌تر می‌زنند. زنده‌ماندن از راهِ فروکوفتن.",
"Bleed":"خون‌ریزی","Raw kinetic wounds that drip damage. The honest status.":"زخم‌های جنبشیِ خام که آسیب می‌چکانند. صادق‌ترینِ حالت‌ها.",
/* — reactions — */
"Thermal Shock":"شوکِ گرمایی","A shock burst that knocks the whole pack outward. If the target was frozen, it shatters for far more and clears the freeze.":"ترکشی که همه‌ی گله را به بیرون می‌کوبد. اگر هدف یخ‌زده باشد، با آسیبی بس بیشتر می‌شکند و یخ می‌پرد.",
"Combustion":"احتراق","Drops a burning fire pool on the ground. Anything that stands in it keeps taking fire damage.":"برکه‌ای از آتش بر زمین می‌نهد. هر چه در آن بایستد، پیوسته می‌سوزد.",
"Chain Storm":"توفانِ زنجیره","A six jump lightning chain, and it leaves a conductive zone behind that keeps zapping anything that walks in.":"زنجیره‌ی آذرخش با شش جهش؛ و پهنه‌ای رسانا بر جا می‌گذارد که هر واردشونده‌ای را برق می‌زند.",
"Overload":"بیش‌بار","A hard scatter that flings enemies away and briefly stuns everyone caught in it.":"پراکنشی سخت که دشمنان را به دوردست می‌افکند و گرفتاران را دمی گیج می‌کند.",
"Entropy":"آشفتگی","Burn loses its ceiling and snowballs, plus a void rift opens that pulls enemies inward. Soak them, then ignite.":"سوختن سقفش را گم می‌کند و بهمن‌وار می‌بالد؛ و شکافی از نیستی گشوده می‌شود که دشمنان را به درون می‌کشد. خیسشان کن، سپس برافروز.",
"Mutation":"جهش","The enemy grows stronger but drops far richer loot, and lets out a fear pulse that sends nearby fodder fleeing. Risk for reward.":"دشمن نیرومندتر می‌شود اما غنیمتی بس فربه‌تر می‌ریزد، و تپشی از هراس می‌پراکَنَد که خردگان را می‌گریزانَد. خطر در برابرِ پاداش.",
"Superconduct":"اَبَررسانش","The target takes +50% from everything, and a frozen ground zone forms that slows all who cross it.":"هدف از همه‌چیز +۵۰٪ آسیب می‌گیرد، و پهنه‌ای یخ‌زده بر زمین می‌بندد که هر گذرنده‌ای را کند می‌کند.",
"Absolute Zero":"صفرِ مطلق","Total freeze. The enemy locks solid and becomes an immovable wall the horde piles into.":"یخ‌بندانِ کامل. دشمن سنگ می‌شود؛ دیواری ناجنبیدنی که انبوه بر آن تلنبار می‌گردد.",
"Swirl":"چرخش","Spreads the strongest status on the target out to every enemy nearby. Turn one burning foe into a burning crowd.":"نیرومندترین حالتِ روی هدف را به همه‌ی دشمنانِ پیرامون می‌گسترد. یک سوزنده را به انبوهی سوزان بدل کن.",
"Crystallize":"بلورش","Drops a crystal shard. Walk over it for a chunk of shield, or hull if you have no shield.":"تکه‌بلوری می‌اندازد. از رویش بگذر تا پاره‌ای سپر بگیری، و اگر سپر نداری، بدنه.",
"Bloom":"شکوفایی","Plants a seed that blooms after about 1.5 seconds, detonating on the nearest pack with a homing burst.":"دانه‌ای می‌کارد که پس از حدودِ ۱٫۵ ثانیه می‌شکفد و با ترکشی جوینده بر نزدیک‌ترین گله می‌ترکد.",
"Corrosive Mist":"مِهِ خورنده","Lays down a poison fog that stacks corrosion and slows everything caught inside it.":"مِهی زهرآگین می‌گسترد که خوردگی می‌انبارد و هر گرفتاری را کند می‌کند.",
"Magnetize":"مغناطش","Opens a strong pull rift that yanks enemies into a tight cluster. Set it up, then blow the cluster apart.":"شکافی پرکشش می‌گشاید که دشمنان را در خوشه‌ای تنگ گرد می‌آورد. بچین، سپس خوشه را از هم بپاش.",
"Irradiate":"پرتوباران","Leaves a radioactive zone that applies radiation and makes everything inside take extra damage.":"پهنه‌ای پرتوزا بر جا می‌گذارد که تابش می‌نشانَد و هر چه درون باشد آسیبِ افزوده می‌گیرد.",
/* — items — */
"Credit Cache":"بسته‌ی اعتبار","Pickup":"برداشتنی","Loose salvage. Bank it. Credits feed your greed perks and the run archive.":"غنیمتِ پراکنده. بیندوزش. اعتبار، خصلت‌های آز و آرشیوِ ران‌هایت را می‌خورانَد.",
"Repair Cell":"سلولِ ترمیم","Patches a chunk of hull back on. Grab it before the next wave reads you.":"پاره‌ای از بدنه را بازمی‌دوزد. پیش از آن‌که موجِ بعد تو را بخواند، بردار.",
"Resonance Magnet":"آهن‌ربای رِزونانس","Every resonance orb on the whole map screams toward you at once. Pure dopamine.":"هر گویِ رِزونانسِ سراسرِ نقشه یک‌باره به سویت فریادکشان می‌آید. دوپامینِ ناب.",
"Void Burst":"ترکشِ نیستی","Wipes the entire floor of fodder in one flash. Rare, on a cooldown, and always satisfying.":"در یک درخشش، سراسرِ کف را از خردگان می‌روبد. کمیاب، با بازدم، و همیشه دل‌چسب.",
"Supply Cache":"محموله‌ی تدارکات","Map Drop":"افتاده در نقشه","Walk over it for an instant gacha pull. Bigger foes guard the best ones.":"از رویش بگذر تا قرعه‌ای آنی بکشی. بهترین‌ها را دشمنانِ بزرگ‌تر پاس می‌دارند.",
"Resonance Orb":"گویِ رِزونانس","The deep's currency for power. Collect it to level up and reshape your build.":"پولِ رایجِ ژرفا برای قدرت. گِردش آور تا سطح بگیری و ساختت را از نو بریزی.",
"Acceleration Lane":"باندِ شتاب","Terrain":"زمین","The glowing teal roads. Ride one for faster movement, faster fire, and a damage bump.":"جاده‌های فیروزه‌ایِ تابان. بر یکی بران تا گامِ تندتر، آتشِ تندتر و آسیبِ افزون بگیری.",
/* — hazards — */
"Black Hole":"سیاه‌چاله","The Singularity's gift. It drags you toward a lethal core and pulls enemies in to be crushed. Respect it. Route around it. Or use Event Ward and laugh.":"ارمغانِ تکینگی. تو را به سوی هسته‌ای مرگ‌بار می‌کشد و دشمنان را به درون می‌بلعد تا خرد شوند. حرمتش را نگه دار؛ راهت را گِردش بپیچ. یا طلسمِ رخداد بردار و بخند.",
"Solar Storm":"توفانِ خورشیدی","Standing fire fields from the Solar Construct. Walk out, do not camp.":"میدان‌های آتشِ ایستا از ساخته‌ی خورشیدی. بیرون برو؛ اردو مزن.",
"Meteor Strike":"شهاب‌باران","Corruption rain. Telegraphed, then it lands hard. The blast clears enemies too if you bait them in.":"بارانِ فساد. نخست نشانش می‌آید، سپس سخت فرود می‌آید. اگر دشمنان را به دام بکشی، انفجارش آنان را نیز می‌روبد.",
"Hazard":"مخاطره","Modifier":"نشان‌دار",
/* — chains — */
"Inferno":"دوزخ‌آتش","Stack burn to 12 and it ignites into Inferno, a hotter self feeding blaze.":"سوختن را به ۱۲ برسان تا به دوزخ‌آتش بدل شود؛ شعله‌ای داغ‌تر که خود را می‌خورانَد.",
"Plaguefire":"طاعون‌آتش","Poison the flame. It becomes Plaguefire and melts hull at terrifying speed.":"شعله را زهرآگین کن تا طاعون‌آتش شود و بدنه را با شتابی هولناک بگدازد.",
"Abyssal Collapse":"فروریزشِ مغاک","The deep folds inward. A crushing implosion that drags and devastates everything nearby.":"ژرفا به درون تا می‌خورد. فروریزشی له‌کننده که هر چه نزدیک باشد را می‌کشد و ویران می‌کند.",
"Burn x3":"سوختن ×۳","Inferno + Toxic":"دوزخ‌آتش + زهر","Plaguefire + Void":"طاعون‌آتش + نیستی",
/* — enemy modifiers — */
"Volatile":"ناپایدار","Explodes on death. Kill it at a distance or eat the blast.":"با مرگش می‌ترکد. از دور بکشش، یا انفجار را نوش کن.",
"Magnetic":"مغناطیسی","Hoards your resonance orbs while alive. Kill it and they all fly home to you.":"تا زنده است گوی‌های رِزونانست را می‌انبارد. بکشش تا همه یک‌جا به خانه بازپرند.",
"Phaseborn":"فازوَرزاد","Phases in and out of solidity. While ghosted it slips through crowds and walls of bodies.":"میانِ جسم و شبح می‌لغزد. تا شبح است، از میانِ انبوه و دیوارِ پیکرها می‌گذرد.",
"Infernal":"دوزخی","Leaves a burning trail. Do not chase it through the fire.":"ردی سوزان بر جا می‌گذارد. از میانِ آتش دنبالش مکن.",
"Necrotic":"مُرده‌خیز","Rises once from death at half strength. Kill it twice.":"یک بار از مرگ برمی‌خیزد، با نیمی از توان. دوبار بکشش.",
/* — codex section notes — */
"Things the deep leaves behind. Most of it flies to you the moment you get close. Tap any card for the full read.":"آنچه ژرفا بر جا می‌گذارد. بیشترش همین که نزدیک شوی به سویت پر می‌کشد. برای خواندنِ کامل روی هر کارت بزن.",
"Marked enemies: some foes spawn with a glyph overhead. Learn them fast:":"دشمنانِ نشان‌دار: برخی با نشانی بر فرازِ سر زاده می‌شوند. زود بشناس‌شان:",
"Hazards to avoid:":"مخاطره‌هایی که باید ازشان گریخت:",
"Your guns fire on their own. Your job is choosing which ones grow. Max a weapon to unlock four Evolution tiers, then feed it elements in the draft. Tap any weapon for the full read.":"سلاح‌هایت خود می‌بارند؛ کارِ تو گزینشِ آن است که کدام ببالد. سلاحی را به سقف برسان تا چهار رده‌ی تکامل بگشاید، سپس در قرعه به آن عنصر بخوران. برای خواندنِ کامل روی هر سلاح بزن.",
/* — codex long-reads — */
"Dodge, Guard, Parry":"جاخالی، گارد، دفع","Space or the dive button":"کلیدِ Space یا دکمه‌ی شیرجه","Every diver has one survival tool. Learn yours first.":"هر غواص یک ابزارِ بقا دارد. نخست از آنِ خود را بیاموز.",
"Every diver answers danger differently.\n\nMost divers blink a short distance with full invulnerability. Ranger blinks farthest and fastest, on the shortest cooldown in the game. Her whole life is dodge, shotgun, dodge.\n\nVanguard does not dodge. He plants his feet and raises an unbreakable Guard for over a second. While it holds, nothing hurts him and slows wash off his hull.\n\nYujin parries. Tap the button and a quarter second window opens where everything breaks against your fists: bullets, lasers, stampedes, even black hole cores. The parry has only a brief cooldown, so quick taps still open windows back to back. With perfect reads Yujin survives anything. And because he cannot dodge, a black hole would be a guaranteed death, so while caught in one his button instead blinks him out to safety. With lazy thumbs Yujin still dies fast.\n\nRhino charges. The dive button sends him barreling forward, untouchable the whole way, flinging every enemy he touches aside and trampling them for damage. When the charge ends a shockwave bursts out and scatters the rest. Slow on foot, unstoppable in motion.\n\nThe Sorcerer hexes. His button does not move him. Instead he becomes untouchable for a few seconds and mutates the whole swarm around him, turning fodder into richer loot and forcing them to flee. It is his survival button and his early treasure engine at once.":"هر غواص به خطر پاسخی از آنِ خود می‌دهد.\n\nبیشترِ غواصان جهشی کوتاه می‌زنند، سراپا رویین‌تن. تکاور دورتر و تندتر از همه می‌جهد، با کوتاه‌ترین بازدمِ بازی. سراسرِ زندگی‌اش همین است: جاخالی، شلیک، جاخالی.\n\nپیشتاز جاخالی نمی‌زند. پا سفت می‌کند و گاردی نشکستنی برمی‌افرازد، بیش از یک ثانیه. تا برپاست، هیچ چیز نمی‌آزاردش و کندی‌ها از بدنه‌اش می‌شویند.\n\nیوجین دفع می‌کند. دکمه را بزن تا پنجره‌ای ربع‌ثانیه‌ای گشوده شود که در آن همه‌چیز بر مشت‌هایت می‌شکند: گلوله، لیزر، یورشِ گله، حتی هسته‌ی سیاه‌چاله. دفع تنها بازدمی کوتاه دارد، پس ضربه‌های پیاپیِ انگشت، پنجره‌های پیاپی می‌گشایند. با خواندنِ بی‌نقص، یوجین از هر چیزی جانِ سالم به در می‌برد. و چون جاخالی ندارد، سیاه‌چاله برایش مرگی حتمی می‌بود؛ پس چون در آن گرفتار شود، دکمه‌اش او را به بیرون، به امنیت می‌جهانَد. با شستِ تنبل، یوجین همچنان زود می‌میرد.\n\nکرگدن یورش می‌برد. دکمه‌ی شیرجه او را غرّان به پیش می‌راند، سراسرِ راه دست‌نیافتنی؛ هر دشمنی را که بساید به کناری می‌افکند و لگدمالش می‌کند. چون یورش پایان گیرد، موجی می‌ترکد و باقی را می‌پراکند. بر پا کند است، در حرکت بازناایستادنی.\n\nجادوگر طلسم می‌کند. دکمه‌اش او را نمی‌جنبانَد؛ چند ثانیه دست‌نیافتنی می‌شود و سراسرِ انبوهِ پیرامونش را دگرگون می‌کند: خردگان به غنیمتِ فربه‌تر بدل می‌شوند و به گریز وادار. این هم دکمه‌ی بقای اوست و هم موتورِ گنجِ آغازینش.",
"Shields":"سپرها","Vyper and Sentinel":"افعی و دیده‌بان","A permanent field that eats incoming fire.":"میدانی همیشگی که آتشِ رسیده را می‌بلعد.",
"Vyper and Sentinel carry a permanent energy field that swallows every non boss projectile on contact. It does not block body slams, so keep moving.\n\nEvery other diver earns a recharging Barrier as they level. When the blue bar under your hull is up, you can afford one mistake. Watch it. Tank when it is full, run when it is empty.":"افعی و دیده‌بان میدانی همیشگی از انرژی دارند که هر گلوله‌ی غیرِ فرمانروا را در دمِ برخورد می‌بلعد. کوبشِ تن‌به‌تن را نمی‌گیرد؛ پس در حرکت بمان.\n\nدیگر غواصان با سطح‌گرفتن، حائلی خودپُرشونده به دست می‌آورند. تا نوارِ آبیِ زیرِ بدنه‌ات برپاست، یک خطا جا داری. بپایش. پُر که بود تن بده، خالی که بود بگریز.",
"Wardens and Boons":"نگهبانان و موهبت‌ها","Every 5 levels":"هر ۵ سطح","Kill the giant, claim a permanent gift.":"غول را بکش و ارمغانی جاودانه بردار.",
"Every fifth level a Warden descends: a giant with a name and a trick. Fell it and you claim a Boon, a permanent change to your run that no draft can offer.\n\nIf a Warden drifts off your screen too long it calls escorts to push you back toward the fight. The deep does not let you ignore its champions.":"هر پنج سطح یک نگهبان فرود می‌آید: غولی با نامی و نیرنگی. برافکنش تا موهبتی برداری؛ دگرگونی‌ای جاودانه در رانَت که هیچ قرعه‌ای نمی‌بخشد.\n\nاگر نگهبان دیرزمانی از پرده‌ات دور بمانَد، ملازمانش را فرا می‌خواند تا تو را به سوی پیکار بازپس برانند. ژرفا نمی‌گذارد پهلوانانش را نادیده بگیری.",
"The Three Suns":"سه خورشید","L20, L50, L80":"سطحِ ۲۰، ۵۰، ۸۰","Half screen titans that walk with you for entire levels.":"یلانی به پهنای نیم‌پرده که سطح‌ها با تو گام برمی‌دارند.",
"Three times on the way down, something the size of half your screen arrives and simply refuses to die fast.\n\nHelios, the Dying Sun. A burning sphere at level 20 that alternates radial rings with aimed bursts.\n\nThe Monolith. A rotating fortress square at level 50, firing cross volleys from its corners and birthing drones.\n\nThe Spear of the Deep. A fast triangle at level 80 that fires from its tip and lunges across the floor at you.\n\nThey are built to last five or more levels beside you. That is on purpose. Fighting a Sun while the horde presses in is the heart of this game. Past level 70 the cycle continues every five levels, and each new Sun arrives with double the hull of the last.":"سه بار در راهِ فرود، چیزی به پهنای نیمِ پرده‌ات از راه می‌رسد و به‌سادگی از مردنِ زود سر باز می‌زند.\n\nهلیوس، خورشیدِ محتضر. گویی سوزان در سطحِ ۲۰ که حلقه‌های شعاعی را با رگبارهای نشانه‌رفته یک‌درمیان می‌کند.\n\nمونولیت. دژی چهارگوش و چرخان در سطحِ ۵۰ که از گوشه‌هایش رگبارِ چلیپایی می‌بارد و پهپاد می‌زاید.\n\nنیزه‌ی ژرفا. سه‌گوشی تندرو در سطحِ ۸۰ که از نوکش می‌بارد و سراسرِ کف به سویت خیز برمی‌دارد.\n\nساخته شده‌اند تا پنج سطح و بیشتر در کنارت بپایند. و این به‌عمد است: پیکار با یک خورشید در حالی که انبوه می‌فشارد، قلبِ این بازی است. از سطحِ ۷۰ به بعد این چرخه هر پنج سطح ادامه می‌یابد، و هر خورشیدِ تازه با بدنه‌ای دوچندانِ پیشین از راه می‌رسد.",
"Named Wardens":"نگهبانانِ نامدار","The rotation":"گردشِ نوبت","Learn their faces. They do not change their tricks.":"چهره‌هاشان را بیاموز؛ نیرنگ‌هاشان را عوض نمی‌کنند.",
"The Collector vacuums your resonance orbs into a hoard while it lives. Kill it and everything it stole erupts back, magnetized to you with interest.\n\nThe Judge marks you with a gold sigil. While judged you take thirty percent more from everything. Kill it fast or play like a coward for five seconds.\n\nThe Twin divides at half health into two faster copies. The Boon comes when the last one falls.\n\nThe Shepherd never stops calling its flock, with something Epic every third call.\n\nTitan, the Solar Construct, and the Singularity round out the rotation with raw violence, sun fields, and black holes.":"گردآورنده تا زنده است گوی‌های رِزونانست را به خزانه‌اش می‌مکد. بکشش تا هر چه ربوده با بهره به سویت بازبجوشد.\n\nداور با نشانی زرین داغت می‌زند. تا داغ برپاست، از همه‌چیز سی‌درصد بیشتر آسیب می‌گیری. یا زود بکشش، یا پنج ثانیه بزدلانه بازی کن.\n\nهمزاد در نیمه‌ی جان به دو رونوشتِ تندتر می‌شکافد. موهبت آن‌گاه می‌رسد که واپسین فروافتد.\n\nچوپان هرگز از فراخواندنِ گله بازنمی‌ایستد، و هر سومین فراخوان چیزی حماسی می‌آورد.\n\nتیتان، ساخته‌ی خورشیدی و تکینگی، گردشِ نوبت را با خشونتِ خام، میدان‌های خورشیدی و سیاه‌چاله‌ها کامل می‌کنند.",
"The Leviathan":"لویاتان","Level 90":"سطحِ ۹۰","The biggest thing in the game. Everything stops for it.":"بزرگ‌ترین چیزِ بازی. همه‌چیز برایش می‌ایستد.",
"At level 90 the deep holds its breath. Leveling freezes. The horde stops spawning. And a circle nearly a thousand pixels wide rises to meet you.\n\nThe Leviathan births one of the original Suns every sixty seconds while it lives. Kill it and the deep exhales: ascent resumes, the horde returns, and level 100 waits.\n\nThis is the wall before the door. Bring your whole build.":"در سطحِ ۹۰ ژرفا نفسش را نگه می‌دارد. سطح‌گرفتن می‌ایستد. انبوه از زادن بازمی‌ماند. و دایره‌ای نزدیک به هزار پیکسل پهنا برمی‌خیزد تا به دیدارت آید.\n\nلویاتان تا زنده است هر شصت ثانیه یکی از خورشیدهای نخستین را می‌زاید. بکشش تا ژرفا بازدَم برآورد: فراز از سر گرفته می‌شود، انبوه بازمی‌گردد، و سطحِ ۱۰۰ چشم‌به‌راه است.\n\nاین دیوارِ پیش از در است. همه‌ی ساختت را بیاور.",
"Hazards of the Floor":"مخاطره‌های کف","Read the telegraphs":"نشانه‌ها را بخوان","Tar, black holes, solar fields, meteors. The floor itself fights you.":"قیر، سیاه‌چاله، میدانِ خورشیدی، شهاب. خودِ کف با تو می‌جنگد.",
"Tar Fields ripple for a moment before they set. Step in one and your thrusters bog down: movement drops hard until you escape. Vanguard, Sentinel and Yujin resist the pull. Vanguard inside his Guard ignores it completely.\n\nBlack Holes drag everything toward a crushing core, and the Singularity likes to drop them ahead of where you are running, not behind.\n\nSolar fields burn anything that lingers. Meteors mark the ground before they land. Every hazard in this game announces itself once. After that, it assumes you were listening.":"میدان‌های قیر دمی موج می‌زنند و سپس می‌بندند. پا در یکی بگذار تا رانشگرهایت به گِل بنشیند: گام سخت می‌افتد تا بگریزی. پیشتاز، دیده‌بان و یوجین در برابرِ این کشش پایدارند؛ پیشتاز درونِ گاردش یکسره نادیده‌اش می‌گیرد.\n\nسیاه‌چاله‌ها همه‌چیز را به سوی هسته‌ای له‌کننده می‌کشند، و تکینگی خوش دارد آن‌ها را پیشِ پایت بیندازد، نه پشتِ سرت.\n\nمیدان‌های خورشیدی هر درنگ‌کننده‌ای را می‌سوزانند. شهاب‌ها پیش از فرود، زمین را نشان می‌زنند. هر مخاطره‌ی این بازی یک بار خود را اعلام می‌کند؛ از آن پس می‌پندارد که گوش می‌داده‌ای.",
"The Pace of the Deep":"آهنگِ ژرفا","How leveling works":"سطح‌گرفتن چگونه کار می‌کند","The deep feeds you on its own schedule. About 18 minutes to the floor.":"ژرفا به زمان‌بندیِ خودش می‌خوراندت. تا کف، نزدیکِ ۱۸ دقیقه.",
"Resonance is not a faucet you can force open. The deep meters what it feeds you.\n\nThe first 20 levels come one choice at a time and you will feel the grind. After that, a draft opens every fifth level, with your final pick at 95. Push your build hard and you will run a little ahead of schedule. The deep notices, and tightens the flow until the floor catches up.\n\nA full descent to level 100 takes fifteen to twenty minutes. At level 40 the Seal breaks and kills feed you directly, no orbs on the floor. Objectives, Wardens and the Suns are how you get rich faster than the schedule allows.":"رِزونانس شیری نیست که به زور بگشایی؛ ژرفا خوراکت را پیمانه می‌کند.\n\nبیست سطحِ نخست، هر بار یک گزینش می‌آید و سنگینیِ کار را حس خواهی کرد. از آن پس، هر پنجمین سطح قرعه‌ای می‌گشاید، و واپسین گزینشت در ۹۵ است. ساختت را سخت بران تا اندکی از زمان‌بندی پیش بیفتی؛ ژرفا درمی‌یابد و جریان را تنگ می‌کند تا کف به تو برسد.\n\nفرودِ کامل تا سطحِ ۱۰۰ پانزده تا بیست دقیقه می‌کشد. در سطحِ ۴۰ مُهر می‌شکند و شکارها یک‌راست می‌خورانندت؛ دیگر گویی بر کف نیست. مأموریت‌ها، نگهبانان و خورشیدها راهِ توانگرشدنِ زودتر از زمان‌بندی‌اند.",
"Reading Your Build":"خواندنِ ساختت","Press Tab, or the small corner button on touch, and your whole run opens in one card: every weapon with its stars and evolution tier, every augment, every element you carry, and which Reactions are live right now.\n\nCheck it before every draft. The best pick is usually the one that completes a pair, not the one with the biggest number.":"کلیدِ Tab را بزن، یا بر لمسی دکمه‌ی کوچکِ گوشه را، تا سراسرِ رانت در یک کارت گشوده شود: هر سلاح با ستاره‌ها و رده‌ی تکاملش، هر تقویت، هر عنصری که با خود داری، و این‌که هم‌اکنون کدام واکنش‌ها زنده‌اند.\n\nپیش از هر قرعه نگاهی بینداز. بهترین گزینش معمولاً آن است که جفتی را کامل می‌کند، نه آن که بزرگ‌ترین عدد را دارد.",
"The Corruption":"فساد","Reach level 100, watch the victory, then choose to keep going. The Corruption rewrites the rules: every level past 100 raises the tier, stacks a brutal modifier, and sends another named Warden down after you.\n\nA fresh draft opens every 10 corrupted levels and a Boon lands every 20. The level counter itself starts to lie to you. Words appear that should not.\n\nThe floor of the world sits at C100. Nothing descends further. Nothing needs to.":"به سطحِ ۱۰۰ برس، پیروزی را بنگر، و آن‌گاه ماندن را برگزین. فساد قانون‌ها را از نو می‌نویسد: هر سطحِ پس از ۱۰۰ رده را بالا می‌برد، نشانی بی‌رحم می‌انبارد، و نگهبانِ نامدارِ دیگری را از پی‌ات فرومی‌فرستد.\n\nهر ۱۰ سطحِ فاسد قرعه‌ای تازه می‌گشاید و هر ۲۰ سطح موهبتی فرود می‌آید. خودِ شمارگرِ سطح به تو دروغ می‌گوید. واژه‌هایی پدیدار می‌شوند که نباید.\n\nکفِ جهان بر C100 نشسته است. هیچ‌چیز فروتر نمی‌رود. نیازی هم نیست."
});
Object.assign(I18N.fa,{
"No gun. No brakes. He hunts the way a real beast does, by running things down. Hold to dig in and build a charge, release to barrel through the swarm untouchable and send bodies flying. The longer the hold, the harder the deep breaks.":"نه تفنگی، نه ترمزی. چون دَدی راستین شکار می‌کند: با زیر گرفتن. نگه دار تا پا سفت کند و نیرو بینبارد؛ رها کن تا رویین‌تن از دلِ انبوه بغرّد و پیکرها را به پرواز درآورد. هرچه فشردن بلندتر، شکستنِ ژرفا سخت‌تر.",
"Elements never settle around him, they collide. His Catalyst fuses lightning and plasma into instant Overloads, his Hex warps the swarm into walking loot, and he drifts untouched through the black holes that swallow everyone else.":"عنصرها گِردِ او آرام نمی‌گیرند؛ به هم می‌کوبند. آمیزگرش آذرخش و پلاسما را در دم به «بیش‌بار» می‌آمیزد، طلسمش انبوه را به غنیمتِ راه‌رونده بدل می‌کند، و خود آسوده از دلِ سیاه‌چاله‌هایی می‌گذرد که دیگران را می‌بلعند.",
"<span>starts with the Catalyst (instant Overload)</span> · <b style=\"color:#b6ff3c\">stronger reactions and bigger zones</b> · Hex: warp the swarm + go untouchable · shrugs off fields · walks black holes":"<span>با آمیزگر می‌آغازد (بیش‌بارِ آنی)</span> · <b style=\"color:#b6ff3c\">واکنش‌های نیرومندتر و پهنه‌های بزرگ‌تر</b> · طلسم: انبوه را دگرگون کن و رویین‌تن شو · میدان‌ها را به هیچ می‌گیرد · از دلِ سیاه‌چاله می‌گذرد",
"Chronostasis":"ایست‌زمان","You bent the clock. They're wading through syrup now. -12% enemy speed.":"زمان را خم کردی؛ اکنون در شیره دست‌وپا می‌زنند. -۱۲٪ شتابِ دشمن.",
"Titan Heart":"قلبِ تیتان","A second heart, bigger than the first. +120 hull. Stack 'em.":"قلبی دوم، بزرگ‌تر از نخست. +۱۲۰ بدنه. رویش بینبار.",
"The pools, fogs and rifts you leave behind grow larger and linger longer. +40% zone size and duration.":"برکه‌ها، مِه‌ها و شکاف‌هایی که بر جا می‌گذاری بزرگ‌تر می‌شوند و دیرتر می‌پایند. +۴۰٪ اندازه و ماندگاریِ پهنه.",
"Triggering a reaction feeds your shield. Heals 8 shield (or hull) on every reaction, a few times a second.":"هر واکنش سپرت را می‌خورانَد. با هر واکنش ۸ سپر (یا بدنه) ترمیم می‌شود، چند بار در ثانیه.",
"Your ice bites deeper. Chill always lands with extra stacks, freezing crowds in place for longer.":"یخِ تو ژرف‌تر گاز می‌گیرد. سرمازدگی همیشه با انباشته‌ی افزوده می‌نشیند و انبوه را دیرتر در جای خود می‌خشکانَد.",
"Die once, get up anyway. The dark isn't done with you. Revive at 50%.":"یک بار بمیر و باز برخیز؛ تاریکی هنوز با تو کار دارد. با ۵۰٪ جان بازخیز.",
"The big ones bleed too. +35% to anything that thinks it's a boss.":"بزرگان هم خون دارند. +۳۵٪ بر هر چه خود را فرمانروا می‌پندارد.",
"Stand in the storm and grin. 35% less hazard pain, 40% less black hole pull.":"در دلِ توفان بایست و بخند. ۳۵٪ دردِ مخاطره کمتر، ۴۰٪ کششِ سیاه‌چاله کمتر.",
"Skim a little extra off the top. +20% credits & rez.":"سهمی افزون از سرِ سفره بردار. +۲۰٪ اعتبار و رِزونانس.",
"Your elemental reactions and the zones they leave hit noticeably harder.":"واکنش‌های عنصری‌ات و پهنه‌هایی که بر جا می‌گذارند، آشکارا سخت‌تر می‌کوبند.",
"Fire pools, poison fog, frost ground and rifts grow bigger and last longer.":"برکه‌های آتش، مِهِ زهر، زمینِ یخ و شکاف‌ها بزرگ‌تر می‌شوند و بیشتر می‌پایند.",
"Every reaction you trigger tops up a little shield. Great for staying in the thick of it.":"هر واکنش اندکی سپرت را پر می‌کند. برای ماندن در دلِ معرکه بی‌همتاست.",
"Your chill lands with extra bite, slowing and locking down crowds for longer.":"سرمازدگی‌ات گزنده‌تر می‌نشیند و انبوه را دیرتر کند و قفل می‌کند.",
"One panel that shows everything you are.":"یک صفحه که هر آنچه هستی را نشانت می‌دهد.",
"Beat the deep, then let it rewrite itself.":"ژرفا را شکست بده؛ آن‌گاه بگذار خود را از نو بنویسد."
});
Object.assign(I18N.fa,{
"Triton Burst":"رگبارِ تریتون",
"Angler":"صیاد","The Strongarm":"پنجه‌فولاد",
"\"Haul anchor, sweetheart. The deep and I go way back.\" A dockside legend with arms like mooring chains and a grin to match. Hold to spin the hook, release to throw: almost anything he catches gets DRAGGED to his boots. Only true giants can anchor him, and then he rides the rope in, laughing, healing with every meter.":"«لنگر بکش، عزیزِ دل. من و ژرفا رفیقِ دیرینه‌ایم.» افسانه‌ی لنگرگاه، با بازوانی چون زنجیرِ لنگر و نیشخندی به همان پهنا. نگه دار تا قلاب را بچرخاند، رها کن تا پرتاب شود: کمابیش هر چه به چنگ آورد، کشان‌کشان تا پیشِ چکمه‌هایش می‌آید. تنها غول‌های راستین لنگرش می‌شوند؛ آن‌گاه خندان سوارِ ریسمان می‌تازد و با هر گام که می‌پیماید، جان می‌گیرد.",
"<span>grapple hook dive button</span> · <b style=\"color:#4bd8ff\">drags almost ANYTHING to your boots</b> · only giants anchor you: ride the rope + heal per distance · mouse aim on desktop · Triton Burst sidearm":"<span>قلابِ زوبین بر دکمه‌ی شیرجه</span> · <b style=\"color:#4bd8ff\">کمابیش هر چیزی را تا پیشِ چکمه‌هایت می‌کشد</b> · تنها غول‌ها لنگرت می‌شوند: سوارِ ریسمان شو و به اندازه‌ی راه جان بگیر · نشانه‌گیری با موس روی دسکتاپ · سلاحِ کمری: رگبارِ تریتون",
"HOOKED":"به قلاب افتاد"
});
/* ===== end FA content ===== */
Object.assign(I18N.fa,{
/* — runtime weapon renames (override pass) — */
"Pulse Cannon":"توپِ تپش","Chain Arc":"کمانِ زنجیره","Nova Generator":"نوازا","Void Lance":"نیزه‌ی نیستی",
/* — warden / boss display names — */
"TITAN CORE":"هسته‌ی تیتان","SOLAR CONSTRUCT":"ساخته‌ی خورشیدی","THE SINGULARITY":"تکینگی","THE COLLECTOR":"گردآورنده","THE JUDGE":"داور","THE TWIN":"همزاد","THE SHEPHERD":"چوپان","HELIOS, THE DYING SUN":"هلیوس، خورشیدِ محتضر","THE MONOLITH":"مونولیت","THE SPEAR OF THE DEEP":"نیزه‌ی ژرفا","THE LEVIATHAN":"لویاتان","THE VOID LORD":"سرورِ نیستی","A WARDEN":"نگهبانی",
" DESCENDS. SLAY IT FOR A BOON":" فرود می‌آید. برای موهبت، برافکنش",
"THE VOID LORD AWAKENS":"سرورِ نیستی بیدار می‌شود","OMEGA PROTOCOL AWAKENS":"آیینِ اُمگا بیدار می‌شود","A LEGENDARY HORROR ARRIVES":"هراسی افسانه‌ای از راه می‌رسد",
"THE JUDGE MARKS YOU":"داور داغت می‌زند","THE COLLECTOR'S HOARD IS YOURS":"خزانه‌ی گردآورنده از آنِ توست",
/* — canvas alerts + subs — */
"NEW OBJECTIVE":"مأموریتِ تازه","THE SWARM":"انبوه","they come like a storm of knives":"چون توفانی از چاقو می‌آیند","ARROWHEAD VOLLEY":"رگبارِ پیکان","sharp things, incoming":"چیزهای تیز در راه‌اند","SWARM INBOUND":"انبوه در راه است","THE DARK SURGES":"تاریکی می‌خروشد","HORDE BREACH":"رخنه‌ی خیل","THEY COME IN NUMBERS":"بی‌شمار می‌آیند","TIDE OF THE DEEP":"خیزابِ ژرفا",
"THE SEAL IS BROKEN":"مُهر شکست","the deep now feeds you directly":"ژرفا اکنون یک‌راست می‌خوراندت",
"THE LEVIATHAN RISES":"لویاتان برمی‌خیزد","the deep holds its breath \u00b7 ascent locked":"ژرفا نفسش را نگه می‌دارد · فراز بسته شد",
"THE LEVIATHAN FALLS":"لویاتان فرومی‌افتد","the deep exhales \u00b7 ascent resumes":"ژرفا بازدَم برمی‌آورد · فراز از سر گرفته می‌شود",
"A SUN DESCENDS":"خورشیدی فرود می‌آید",
/* — objectives — */
"DESTROY {N} ENEMIES":"{N} دشمن را نابود کن","SHATTER {N} TRIANGLES":"{N} سه‌گوش را بشکن","POP {N} FAST BALLS":"{N} گویِ تندرو را بترکان","BREAK {N} SQUARES":"{N} چهارگوش را بشکن","COLLECT {N} RESONANCE ORBS":"{N} گویِ رِزونانس گِرد آور","TAKE NO HULL DAMAGE":"هیچ آسیبی به بدنه نگیر",
"OBJECTIVE COMPLETE: SUPPLY CACHE":"مأموریت انجام شد: محموله‌ی تدارکات","OBJECTIVE COMPLETE: WARDEN BOON":"مأموریت انجام شد: موهبتِ نگهبان","OBJECTIVE COMPLETE: AUGMENT DRAFT":"مأموریت انجام شد: قرعه‌ی تقویت","OBJECTIVE COMPLETE: INSTANT ASCENT":"مأموریت انجام شد: فرازِ آنی","OBJECTIVE COMPLETE: CREDIT JACKPOT":"مأموریت انجام شد: گنجِ اعتبار","OBJECTIVE FAILED":"مأموریت شکست خورد",
/* — build card + misc — */
"Current Build":"ساختِ کنونی","Weapons":"سلاح‌ها","Augments":"تقویت‌ها","Synergy":"هم‌افزایی",
"Restore 35% of max hull.":"۳۵٪ از بدنه‌ی بیشینه را بازمی‌گرداند.","Vault of Credits":"گنجینه‌ی اعتبار","+400 credits.":"+۴۰۰ اعتبار.",
"written by Claude":"به قلمِ کلود","OBJECTIVE COMPLETE":"مأموریت انجام شد",
/* — corrected codex notes (post-rework copy) — */
"Six ways to descend. Each one plays a different game. Tap a diver to study them before your next run.":"شش راه برای فرود. هر یک بازیِ خودش را دارد. پیش از رانِ بعدی، روی هر غواص بزن و بشناسش.",
"Eight damage types. Every weapon carries exactly one element - its innate one, or the single element you lock in with an Infusion. Land two different elements on the same enemy, from two different weapons, and a Reaction fires.":"هشت گونه آسیب. هر سلاح درست یک عنصر دارد - عنصرِ ذاتی‌اش، یا همان یک عنصری که با «عنصرافشانی» در آن قفل می‌کنی. دو عنصرِ ناهمسان را، از دو سلاحِ جدا، بر یک دشمن بنشان تا واکنشی برافروخته شود.",
"Effects stack as pips over an enemy. The more pips, the harder it bites.":"اثرها چون نشانه‌هایی بر فرازِ دشمن می‌انبارند. نشانه‌ی بیشتر، گزشِ سخت‌تر.",
"Land two different elements on the same enemy and the deep answers. There are 14 reactions, and most leave something on the battlefield: fire pools, poison fog, pull rifts, frozen ground, freeze walls, even crystal shards you can grab. Each weapon carries one element for the whole run, so reactions come from pairing different weapons. This is where builds get broken.":"دو عنصرِ ناهمسان بر یک دشمن بنشان تا ژرفا پاسخ دهد. چهارده واکنش هست و بیشترشان چیزی بر میدان به جا می‌گذارند: برکه‌های آتش، مِهِ زهر، شکاف‌های کِشنده، زمینِ یخ‌زده، دیوارهای یخ، حتی تکه‌بلورهایی که می‌توانی برداری. هر سلاح در سراسرِ ران یک عنصر دارد؛ پس واکنش‌ها از هم‌جفت‌کردنِ سلاح‌های جداگانه می‌آیند. این‌جاست که ساخت‌ها افسارگسیخته می‌شوند.",
"Escalation chains. Stack deeper, burn brighter:":"زنجیره‌های اوج‌گیری. ژرف‌تر بینبار، درخشان‌تر بسوز:",
"How the deep actually works. Tap any card to read the whole thing before your next run.":"ژرفا به‌راستی چگونه کار می‌کند. پیش از رانِ بعدی، روی هر کارت بزن و همه‌اش را بخوان."
});


function tgShareText(){try{const d=Math.floor(time*8).toLocaleString();return 'ABYSS // SURVIVORS \u00b7 '+(player&&player.char?player.char.name:'Diver')+' \u00b7 LV '+(player?player.level:0)+' \u00b7 '+d+'m deep \u00b7 '+kills+' kills \u00b7 by @'+(TG_USER.username||TG_USER.first_name||'survivor');}catch(e){return 'ABYSS // SURVIVORS';}}
function tgShowShare(){try{if(TG)TG.MainButton.show();}catch(e){}}
// ---- DIVE NETWORK: presence + friends relay ----
let NET={online:false,friends:[],inbox:0,lastSync:0,gamesPlayed:0,stats:null,fcache:{}};
let _sfx={t:0};
// Merge runs the server returns into the local archive (server is the durable source of truth).
// Dedup by date; keep local copies (which carry the full build snapshot) when a run exists on both sides.
function mergeServerRuns(sr){try{if(!Array.isArray(sr)||!sr.length)return false;const byDate={};for(const r of (runArchive||[]))if(r&&r.date!=null)byDate[r.date]=r;let added=false;for(const r of sr){if(!r||r.date==null)continue;if(!byDate[r.date]){byDate[r.date]=r;added=true;}}if(!added)return false;runArchive=Object.values(byDate).sort((a,b)=>(b.date||0)-(a.date||0)).slice(0,30);saveRuns();return true;}catch(e){return false;}}
function netId(){return TG_USER&&TG_USER.id!=='guest'?String(TG_USER.id):'';}
async function netSync(){const id=netId();if(!id)return;
 try{const s=computeStats();let _cxp=0,_clv=1;try{_cxp=captainTotalXP();_clv=captainLevelInfo(_cxp).level;}catch(e){}const r=await apiFetch('sync',{id,name:profName,username:TG_USER.username||'',photo:TG_USER.photo||'',about:'',stats:{level:s.highLevel,wins:s.wins,kills:s.kills,best:s.bestTime,total:s.total,timeIn:s.timeIn,gold:s.gold,maxCorr:s.maxCorr,main:s.main,mainRuns:s.mainRuns,axes:s.axes,favEl:s.favEl,favRe:s.favRe,favGear:s.favGear,perDiver:s.perDiver,cap:_clv,capXp:_cxp},runs:(runArchive||[]).slice(0,8).map(r=>({date:r.date,result:r.result,char:r.char,time:r.time,level:r.level,kills:r.kills,corruption:r.corruption,gold:r.gold,peak:r.peak,total:r.total,taken:r.taken,reacts:r.reacts||{},build:r.build||null}))});
  const j=await r.json();if(j&&j.ok){NET.online=true;NET.friends=j.friends||[];const wasInbox=NET.inbox;NET.inbox=j.inboxCount||0;NET.lastSync=Date.now();
   // SYNC PERF (V8): friend stats ride on the sync payload, so the cache fills here with ZERO
   // extra requests - the old hydrateFriends fetch storm (up to 14 calls) is gone.
   try{const _n=Date.now();for(const f of (NET.friends||[])){const st=f.stats||{};NET.fcache[f.id]={_t:_n,cap:st.cap||0,capXp:st.capXp||0,best:st.level||0,level:st.level||0,kills:st.kills||0,total:st.total||0,wins:st.wins||0,timeIn:st.timeIn||0,maxCorr:st.maxCorr||0,seen:f.lastSeen||0};}}catch(e){}
   // Durable stats: the server holds the real games-played count (Redis, survives relaunches).
   if(j.stats){NET.stats=j.stats;if(typeof j.stats.total==='number')NET.gamesPlayed=Math.max(NET.gamesPlayed||0,j.stats.total|0);}
   const changed=mergeServerRuns(j.runs);
   try{refreshNavHead();}catch(e){}
   try{if(state==='menu')refreshMenuChip();}catch(e){}
   if(state==='captain'){try{openCaptain();}catch(e){}}
   if(state==='social'){try{const ft=document.getElementById('friendgrid');if(ft)hydrateFriends();}catch(e){}}
   if((changed)&&state==='profile'){const ae=document.activeElement;if(!ae||ae.id!=='pname')openProfile();}
   if(NET.inbox>wasInbox)toast('NEW FRIEND REQUEST \u00b7 check Social');updateSocialBadge();}
  else NET.online=false;
 }catch(e){NET.online=false;}}
function updateSocialBadge(){try{const b=document.getElementById('socialbtn');if(b){const base='\u21c4 Social';b.textContent=NET.inbox>0?base+' ('+NET.inbox+')':base;}}catch(e){}}
setInterval(()=>{if(netId())netSync();},45000);
// Keep presence + runs fresh: sync the moment the app regains focus / becomes visible.
try{document.addEventListener('visibilitychange',()=>{if(!document.hidden&&netId()&&Date.now()-NET.lastSync>8000){netSync();if(state==='social')hydrateFriends();}});}catch(e){}
try{window.addEventListener('focus',()=>{if(netId()&&Date.now()-NET.lastSync>8000)netSync();});}catch(e){}
setTimeout(()=>{if(netId())netSync();},2500);
setTimeout(()=>{try{refreshMenuChip();}catch(e){}},500);
setTimeout(()=>{try{refreshMenuChip();}catch(e){}},1800);
function tgHideShare(){try{if(TG)TG.MainButton.hide();}catch(e){}}
let profName='SURVIVOR',profColor='',profShape='orb',profLogo='⌖';
let FRIENDS=[];
(async()=>{try{const r=await window.storage.get('abyss_friends');if(r&&r.value)FRIENDS=JSON.parse(r.value)||[];}catch(e){}})();
function saveFriends(){try{window.storage.set('abyss_friends',JSON.stringify(FRIENDS.slice(0,60)));}catch(e){}}
// TELEGRAM MINI APP: Telegram identity replaces the hardcoded default name (stored custom name still wins)
if(TG_USER&&TG_USER.id!=='guest'){const __tn=(TG_USER.first_name||TG_USER.username||'').toUpperCase().slice(0,14);if(__tn)profName=__tn;}
const NEONS=['#00e5d4','#5cd0ff','#3cc8ff','#4b9bff','#7b9bff','#9bd0ff','#9b6dff','#b06bff','#c77bff','#ff5cf0','#ff3df0','#ff5ad0','#ff8ad0','#ff5a6e','#ff7a3c','#ff9b3c','#ffae3c','#ffc24b','#ffd24b','#ffe27a','#d6ff5c','#b6ff3c','#9bff5c','#7cff9b','#6cffb0','#8affc0','#5cffd0','#00ffc8','#66ffe9','#bfeaff','#eaf2ff','#ff2d4e','#ff6b9b','#8a6bd8','#5c79ff','#34d2eb'];
const PSHAPES=['orb','diamond','hex','delta'];
const PLOGOS=['⌖','🜂','🜃','🜁','🜄','🜅','武','◈','✦','♆','∞','☄'];
(async()=>{try{const c=await window.storage.get('abyss_color');if(c&&c.value)profColor=c.value;
 const s=await window.storage.get('abyss_shape');if(s&&s.value)profShape=s.value;
 const l=await window.storage.get('abyss_logo');if(l&&l.value)profLogo=l.value;}catch(e){}})();
(async()=>{try{const r=await window.storage.get('abyss_name');if(r&&r.value)profName=r.value;}catch(e){}})();
function computeStats(){const A=runArchive||[];const total=A.length,wins=A.filter(r=>r.result==='Victory').length;
 const tk=A.reduce((a,r)=>a+(r.kills||0),0),tt=A.reduce((a,r)=>a+(r.time||0),0),tg=A.reduce((a,r)=>a+(r.gold||0),0);
 const hl=A.reduce((a,r)=>Math.max(a,r.level||0),0),hc=A.reduce((a,r)=>Math.max(a,r.corruption||0),0);
 const n0=Math.max(1,total),avg=f=>A.reduce((a,r)=>a+(f(r)||0),0)/n0;
 const axes=[Math.min(1,avg(r=>(r.dodges||0)/Math.max(60,r.time||60))/0.5),Math.min(1,avg(r=>(r.kills||0)/Math.max(60,r.time||60))/45),Math.min(1,avg(r=>(r.taken||0)/Math.max(60,r.time||60))/35),Math.min(1,avg(r=>(r.peak||0))/80000),Math.min(1,avg(r=>(r.gold||0)/Math.max(60,r.time||60))/9),Math.min(1,avg(r=>(r.time||0))/1200)];
 const per={};A.forEach(r=>per[r.char]=(per[r.char]||0)+1);let main='-',mn=0;for(const k in per)if(per[k]>mn){mn=per[k];main=k;}
 const elCount={},itCount={},reCount={};
 A.forEach(function(r){var b=r.build||r.snapshot||{};(b.weapons||[]).forEach(function(w){if(w.name)itCount[w.name]=(itCount[w.name]||0)+1;(w.inf||[]).forEach(function(el){if(el)elCount[el]=(elCount[el]||0)+1;});});if(r.reacts){for(var k in r.reacts)reCount[k]=(reCount[k]||0)+(r.reacts[k]||0);}});
 var topN=function(o,n){return Object.entries(o).sort(function(a,b){return b[1]-a[1];}).slice(0,n).map(function(e){return {k:e[0],c:e[1]};});};
 var favEl=topN(elCount,3),favRe=topN(reCount,3),favGear=topN(itCount,5);
 var perDiver=CHARS.map(function(c){return {name:c.name,n:per[c.name]||0};});
 return{total,wins,winRate:total?Math.round(wins/total*100):0,bestTime:bestTime||0,kills:tk,highLevel:hl,timeIn:tt,gold:tg,maxCorr:hc,axes,main,mainRuns:mn,favEl:favEl,favRe:favRe,favGear:favGear,perDiver:perDiver};}
function statCardHTML(s,name,photo,about){
 const styles=['MOVEMENT RUNNER','STORMBRINGER','JUGGERNAUT','DEADEYE','TREASURE DIVER','DEEP DWELLER'];
 const styleName=s.total?styles[s.axes.indexOf(Math.max(...s.axes))]:'UNWRITTEN';
 const mc=CHARS.find(c=>c.name===s.main);
 const stat=(v,l)=>`<div class="dstat"><div class="v">${v}</div><div class="l">${l}</div></div>`;
 const _ph=safePhoto(photo);const av=_ph?`<img src="${esc(_ph)}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid #b06bff">`:`<div class="pavatar" style="border-color:#b06bff">\ud83d\udc64</div>`;
 return `<div class="pcard"><div class="pname-row">${av}<div><div style="font-family:var(--disp);font-size:17px;letter-spacing:.1em;color:#eaf2ff">${esc(name)}</div><div style="font-size:12px;color:var(--dim);margin-top:5px">Main: <b style="color:${mc?mc.color:'#cde4ff'}">${mc?mc.glyph+' ':''}${s.main}</b> \u00b7 Style: <b style="color:#b06bff">${styleName}</b></div>${about?`<div style="font-size:12px;color:#9bb0d8;margin-top:6px;font-style:italic">${esc(about)}</div>`:''}</div></div></div>`+
  `<div class="pcard"><div class="ptitle">Stats</div><div class="dgrid">`+stat(s.total,'Total Runs')+stat(s.wins,'Victories')+stat(s.winRate+'%','Win Rate')+stat(fmtT(s.bestTime),'Best Time')+stat(fmtN(s.kills),'Total Kills')+stat(s.highLevel||'-','Highest Level')+stat(fmtT(s.timeIn),'Time in the Deep')+stat(fmtN(s.gold),'Credits')+stat(s.maxCorr||'-','Max Corruption')+`</div></div>`+
  `<div class="pcard"><div class="ptitle">Playstyle Analysis</div>${svgRadar(s.axes,['MOBILITY','AGGRESSION','TANK','PRECISION','GREED','ENDURANCE'])}</div>`;}
function svgRadar(vals,labels){const cx=110,cy=104,R=78,n=vals.length;
 const pt=(i,f)=>{const a=i/n*TAU-Math.PI/2;return (cx+Math.cos(a)*R*f).toFixed(1)+','+(cy+Math.sin(a)*R*f).toFixed(1);};
 let grid='';for(const f of [0.33,0.66,1])grid+='<polygon points="'+vals.map((_,i)=>pt(i,f)).join(' ')+'" fill="none" stroke="rgba(110,140,200,0.25)" stroke-width="1"/>';
 let axes='';for(let i=0;i<n;i++)axes+='<line x1="'+cx+'" y1="'+cy+'" x2="'+pt(i,1).replace(',',' " y2="')+'" stroke="rgba(110,140,200,0.18)"/>';
 const poly=vals.map((v,i)=>pt(i,Math.max(0.06,Math.min(1,v)))).join(' ');
 let labs='';for(let i=0;i<n;i++){const a=i/n*TAU-Math.PI/2,lx=cx+Math.cos(a)*(R+16),ly=cy+Math.sin(a)*(R+14);labs+='<text x="'+lx+'" y="'+ly+'" fill="#8aa6da" font-size="8.5" font-family="Orbitron,sans-serif" text-anchor="middle" letter-spacing="1">'+labels[i]+'</text>';}
 return '<svg viewBox="0 0 220 208" style="width:min(280px,72vw);display:block;margin:0 auto">'+grid+axes+'<polygon points="'+poly+'" fill="rgba(176,107,255,0.28)" stroke="#b06bff" stroke-width="2"/>'+labs+'</svg>';}
function openProfile(){hideAllScreens();state='profile';
 const total=runArchive.length,wins=runArchive.filter(r=>r.result==='Victory').length;
 const gamesShown=Math.max(total,NET.gamesPlayed||0);
 const tk=runArchive.reduce((a,r)=>a+(r.kills||0),0),tt=runArchive.reduce((a,r)=>a+(r.time||0),0),tg=runArchive.reduce((a,r)=>a+(r.gold||0),0);
 const hl=runArchive.reduce((a,r)=>Math.max(a,r.level||0),0),hc=runArchive.reduce((a,r)=>Math.max(a,r.corruption||0),0);
 // Fold in the DURABLE server totals: NET.stats holds the monotonic all-time numbers, while the local
 // runArchive is capped at 30 runs - so without this the own profile under-reports lifetime stats.
 const _ns=(typeof NET!=='undefined'&&NET&&NET.stats)||{};
 const winsD=Math.max(wins,_ns.wins||0),tkD=Math.max(tk,_ns.kills||0),ttD=Math.max(tt,_ns.timeIn||0),tgD=Math.max(tg,_ns.gold||0),hlD=Math.max(hl,_ns.level||0),hcD=Math.max(hc,_ns.maxCorr||0);
 const per={};runArchive.forEach(r=>per[r.char]=(per[r.char]||0)+1);
 let main='-',mn=0;for(const k in per)if(per[k]>mn){mn=per[k];main=k;}
 const mc=CHARS.find(c=>c.name===main);
 const stat=(v,l)=>`<div class="dstat"><div class="v">${v}</div><div class="l">${l}</div></div>`;
 const mx=Math.max(1,...Object.values(per).concat([1]));
 const bars=CHARS.map(c=>{const n=per[c.name]||0;return `<div class="pbar-row"><span class="pl" style="color:${c.color}">${c.glyph} ${c.name}</span><div class="pbar"><i style="width:${n/mx*100}%"></i></div><span class="pv">${n}</span></div>`;}).join('');
 // playstyle radar from run data
 const A=runArchive,n0=Math.max(1,A.length);
 const avg=f=>A.reduce((a,r)=>a+(f(r)||0),0)/n0;
 const mob=Math.min(1,avg(r=>(r.dodges||0)/Math.max(60,r.time||60))/0.5);
 const agg=Math.min(1,avg(r=>(r.kills||0)/Math.max(60,r.time||60))/45);
 const tank=Math.min(1,avg(r=>(r.taken||0)/Math.max(60,r.time||60))/35);
 const prec=Math.min(1,avg(r=>(r.peak||0))/80000);
 const greed=Math.min(1,avg(r=>(r.gold||0)/Math.max(60,r.time||60))/9);
 const endur=Math.min(1,avg(r=>(r.time||0))/1200);
 const axesV=[mob,agg,tank,prec,greed,endur],axesL=['MOBILITY','AGGRESSION','TANK','PRECISION','GREED','ENDURANCE'];
 const styles=['MOVEMENT RUNNER','STORMBRINGER','JUGGERNAUT','DEADEYE','TREASURE DIVER','DEEP DWELLER'];
 const styleName=total?styles[axesV.indexOf(Math.max(...axesV))]:'UNWRITTEN';
 // favorites: elements / reactions / items from snapshots
 const elCount={},itCount={},reCount={};
 A.forEach(r=>{(r.snapshot&&r.snapshot.weapons||[]).forEach(w=>{itCount[w.name]=(itCount[w.name]||0)+1;const base=WEAPON_EL[w.id]||'kinetic';elCount[base]=(elCount[base]||0)+1;(w.inf||[]).forEach(el=>elCount[el]=(elCount[el]||0)+1);});(r.snapshot&&r.snapshot.passives||[]).forEach(p2=>itCount[p2.name]=(itCount[p2.name]||0)+1);if(r.reacts)for(const k in r.reacts)reCount[k]=(reCount[k]||0)+(r.reacts[k]||0);});
 const top=(o,n)=>Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,n);
 const elPills=top(elCount,3).map(([id,c])=>{const E=ELEMENTS[id];return E?`<span class="gpill" style="color:${E.color};border-color:${E.color}">${E.icon} ${E.name} \u00d7${c}</span>`:'';}).join(' ')||'<span style="color:var(--dim)">no data yet</span>';
 const rePills=top(reCount,3).map(([k,c])=>`<span class="gpill" style="color:#ffd24b;border-color:#ffd24b">${k} \u00d7${c}</span>`).join(' ')||'<span style="color:var(--dim)">no data yet \u00b7 reactions tracked from your next run</span>';
 const itList=top(itCount,5).map(([k,c])=>`${k} \u00d7${c}`).join(' \u00b7 ')||'no data yet';
 const swatches=NEONS.map(c=>`<span class="csw${profColor===c?' on':''}" data-c="${c}" style="background:${c};box-shadow:0 0 10px ${c}66"></span>`).join('');
 const shapeBtns=PSHAPES.map(s=>`<span class="pshapeb${profShape===s?' on':''}" data-s="${s}">${s==='orb'?'\u25cf':s==='diamond'?'\u25c6':s==='hex'?'\u2b22':'\u25b2'}</span>`).join('');
 const logoBtns=PLOGOS.map(l=>`<span class="plogob${profLogo===l?' on':''}" data-l="${l}">${l}</span>`).join('');
 let _myXp=0,_myInfo=null;try{_myXp=captainTotalXP();_myInfo=captainLevelInfo(_myXp);}catch(e){}
 const capCard=_myInfo?`<div class="pcard">${capEmblem(_myInfo.level,_myInfo)}<div style="display:flex;gap:18px;margin-top:13px;flex-wrap:wrap;align-items:center"><div><div style="font-family:var(--disp);font-weight:800;font-size:16px;color:#eafffd">${fmtN(_myInfo.total)}</div><div style="font-family:var(--ui);font-size:9px;letter-spacing:.14em;color:var(--dim);text-transform:uppercase;margin-top:2px">Lifetime XP</div></div><button class="btn ghost" id="capView" style="margin-left:auto;padding:9px 18px;font-size:11px">View Ascension \u203a</button></div></div>`:'';
 document.getElementById('profilebody').innerHTML=
  `<div class="pcard"><div class="pname-row"><div class="pavatar" id="pavatar" style="border-color:${profColor||'#b06bff'};box-shadow:0 0 22px ${(profColor||'#b06bff')}66">${profLogo}</div><div><input id="pname" maxlength="14" value="${profName}"><div style="font-size:12px;color:var(--dim);margin-top:5px">Main Diver: <b style="color:${mc?mc.color:'#cde4ff'}">${mc?mc.glyph+' ':''}${main}</b>${mn?` \u00b7 ${mn} run${mn===1?'':'s'}`:''} \u00b7 Style: <b style="color:#b06bff">${styleName}</b></div></div></div></div>`+
  capCard+
  `<div class="pcard"><div class="ptitle">Identity \u00b7 your light in the deep</div>
    <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:10px"><div id="pball" style="width:42px;height:42px;border-radius:50%;background:${profColor||'#00e5d4'};box-shadow:0 0 24px ${profColor||'#00e5d4'}"></div><span style="font-size:12px;color:var(--dim)">live preview \u00b7 this is your diver in game</span></div>
    <div class="ptitle" style="margin-top:8px">Neon</div><div class="cswgrid">${swatches}<span class="csw reset${profColor?'':' on'}" data-c="">\u00d8</span></div>
    <div class="ptitle" style="margin-top:10px">Shape</div><div class="shaperow">${shapeBtns}</div>
    <div class="ptitle" style="margin-top:10px">Sigil</div><div class="shaperow">${logoBtns}</div></div>`+
  `<div class="pcard"><div class="ptitle">Stats</div><div class="dgrid">`+
   stat(gamesShown,'Total Runs')+stat(winsD,'Victories')+stat(gamesShown?Math.round(winsD/gamesShown*100)+'%':'-','Win Rate')+
   stat(fmtT(bestTime),'Best Time')+stat(fmtN(tkD),'Total Kills')+stat(hlD||'-','Highest Level')+
   stat(fmtT(ttD),'Time in the Deep')+stat(fmtN(tgD),'Credits Earned')+stat(hcD||'-','Max Corruption')+
  `</div></div>`+
  `<div class="pcard"><div class="ptitle">Playstyle Analysis</div>${svgRadar(axesV,axesL)}</div>`+
  `<div class="pcard"><div class="ptitle">Loadout Affinity</div>
    <div class="ptitle" style="font-size:9px">Favorite Elements</div><div style="margin-bottom:9px">${elPills}</div>
    <div class="ptitle" style="font-size:9px">Favorite Reactions</div><div style="margin-bottom:9px">${rePills}</div>
    <div class="ptitle" style="font-size:9px">Most Used Gear</div><div style="font-size:12.5px;color:#cde4ff">${itList}</div></div>`+
  `<div class="pcard"><div class="ptitle">Analytics \u00b7 Runs per Diver</div>${bars}</div>`+
  '';
 document.getElementById('profilebody').querySelectorAll('.csw').forEach(el=>{el.onclick=()=>{profColor=el.dataset.c||'';try{window.storage.set('abyss_color',profColor);}catch(e){}openProfile();};});
 document.getElementById('profilebody').querySelectorAll('.pshapeb').forEach(el=>{el.onclick=()=>{profShape=el.dataset.s;try{window.storage.set('abyss_shape',profShape);}catch(e){}openProfile();};});
 document.getElementById('profilebody').querySelectorAll('.plogob').forEach(el=>{el.onclick=()=>{profLogo=el.dataset.l;try{window.storage.set('abyss_logo',profLogo);}catch(e){}openProfile();};});
 const pi=document.getElementById('pname');
 pi.onchange=()=>{profName=(pi.value||'SURVIVOR').toUpperCase().slice(0,14);pi.value=profName;try{window.storage.set('abyss_name',profName);}catch(e){}};
 const cvw=document.getElementById('capView');if(cvw)cvw.onclick=()=>openCaptain();
 if(netId()&&Date.now()-NET.lastSync>15000)netSync();
 document.getElementById('profile').classList.remove('hidden');try{trDyn(document.getElementById('profile'));}catch(e){}}
