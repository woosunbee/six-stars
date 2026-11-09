'use strict';
// ── 진행 ──────────────────────────────────────────────────
const REDUCED=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const FT="'Black Han Sans','Malgun Gothic','Apple SD Gothic Neo',sans-serif",FB="'Do Hyeon','Malgun Gothic','Apple SD Gothic Neo',sans-serif";
const GOLD='#e7c063',INK='#07050f',PAPER='#f3ead6',DIM='#a79fbc';
function setState(s,m=0){G.state=s;G.menu=m;G.fade=14}
function setDiff(i){OPT.diff=i;D=DIFFS[i];saveOpt();G.hi=store.get('hi.'+D.id,0)}
function resetWorld(){EB.length=PS.length=EN.length=IT.length=FX.length=LZ.length=TICKQ.length=0;G.boss=null;G.dialog=null;G.cutin=null;G.mirror=G.scarlet=G.noFire=0;G.warn=0;G.ts=1;G.eAcc=0;G.shake=G.flash=0;G.clearing=false;G.autoExit=false}
function newGame(stage,practice){
  G.practice=practice;G.score=0;G.conts=0;G.kills=0;G.nextExt=[200000,500000,1000000,2000000,3500000];G.hi=store.get('hi.'+D.id,0);
  P=newPlayer(G.char);if(practice){P.power=3;P.lives+=2;G.nextExt=[]}
  startStage(stage);
}
function startStage(i){
  resetWorld();G.stage=i;G.st=0;G.co=[];fork(SCR[i]());G.mainDone=false;G.clearT=0;G.autoExit=false;G.scroll=0;G.scrollV=STAGES[i].scroll;G.stageCard=200;BGP.length=0;
  P.x=-30;P.y=H/2;P.enter=46;P.inv=170;P.ham=null;P.locks=[];P.grip=[];P.dead=0;P.bombT=0;P.gauge=100;
  playBGM(STAGES[i].bgm);setState('play');
}
function pauseGame(){if(G.state==='play'&&!G.dialog){setState('pause');G.fade=0;if(A.ctx&&A.ctx.state==='running')A.ctx.suspend()}}
function onBlurPause(){pauseGame()}
function resume(){G.state='play';if(A.ctx)A.ctx.resume()}
function saveHi(){const k='hi.'+D.id;if(!G.practice&&G.score>store.get(k,0))store.set(k,G.score)}
function gameOver(){saveHi();G.contT=600;P.x=-60;setState('over');G.fade=0}
function doContinue(){G.conts++;P.lives=D.lives-1;P.bombs=D.bombs;P.dead=0;P.x=-30;P.y=H/2;P.enter=34;P.inv=220;P.gauge=100;G.score=Math.floor(G.score/10)*10+G.conts;EB.length=0;LZ.length=0;G.state='play'}
function stageClear(){
  const b=(P.lives*6000+P.bombs*3000+Math.floor(P.gauge)*20);addScore(b);G.clearBonus=Math.round(b*D.score);setState('clear');
}
function advance(){
  if(G.practice){saveHi();titleScreen();return}
  if(G.stage>=STAGES.length-1){saveHi();setState('ending');playBGM('title');return}
  startStage(G.stage+1);
}
function titleScreen(){resetWorld();P=null;G.stage=0;G.scrollV=1.6;BGP.length=0;playBGM('title');setState('title')}

function gameTick(){
  G.t++;if(G.fade>0)G.fade--;
  if(G.state!=='play')T.dx=T.dy=0;
  const fn=STATE[G.state];if(fn)fn();
}
const moveMenu=(n)=>{if(I.p.up){G.menu=(G.menu+n-1)%n;sfx('sel')}if(I.p.down){G.menu=(G.menu+1)%n;sfx('sel')}};
const STATE={
 title(){G.scroll+=G.scrollV;moveMenu(4);if(mOK()){sfx('ok');TITLE_MENU[G.menu].fn()}},
 howto(){if(mOK()||mBack()){sfx('sel');setState('title',3)}},
 diff(){G.scroll+=G.scrollV;moveMenu(4);if(mOK()){sfx('ok');setDiff(G.menu);G.practice?setState('stagepick'):setState('select',G.char)}if(mBack()){sfx('sel');setState('title',G.practice?1:0)}},
 stagepick(){G.scroll+=G.scrollV;moveMenu(5);if(mOK()){sfx('ok');G.pickStage=G.menu;setState('select',G.char)}if(mBack()){sfx('sel');setState('diff',OPT.diff)}},
 select(){
  const m=G.menu;
  if(I.p.left){G.menu=m%3===0?m+2:m-1;sfx('sel')}if(I.p.right){G.menu=m%3===2?m-2:m+1;sfx('sel')}
  if(I.p.up||I.p.down){G.menu=(m+3)%6;sfx('sel')}
  if(mOK())confirmHero();
  if(mBack()){sfx('sel');G.char=G.menu;G.practice?setState('stagepick',G.pickStage||0):setState('diff',OPT.diff)}
 },
 options(){G.scroll+=G.scrollV;const n=OPTS.length;moveMenu(n);const o=OPTS[G.menu];
  if(I.p.left&&o.chg){o.chg(-1);sfx('sel')}if(I.p.right&&o.chg){o.chg(1);sfx('sel')}
  if(mOK()){if(o.act)o.act();else if(o.chg)o.chg(1);sfx('sel')}
  if(mBack()){sfx('sel');setState('title',2)}},
 pause(){moveMenu(3);if(I.p.pause){resume();return}if(mOK())PAUSE_MENU[G.menu].fn()},
 over(){G.t;const can=G.conts<D.cont;if(can){G.contT--;if(mOK()){sfx('ok');doContinue();return}if(G.contT<=0||mBack()){titleScreen()}}else if(mOK()||mBack())titleScreen()},
 clear(){if(G.fade<=0&&mOK()){sfx('ok');advance()}},
 ending(){if(G.fade<=0&&mOK()){sfx('ok');titleScreen()}},
 play(){
  if(I.p.pause&&!G.dialog){pauseGame();return}
  if(G.stageCard>0)G.stageCard--;if(BANNER.t>0)BANNER.t--;if(G.cutin&&--G.cutin.t<=0)G.cutin=null;
  if(G.shake>0){G.shake*=.88;if(G.shake<.5)G.shake=0}if(G.flash>0)G.flash--;
  G.scroll+=G.scrollV;
  if(G.dialog){const d=G.dialog;d.w=(d.w||0)+1;if(d.w>14&&(I.p.ok||I.p.shot||I.p.bomb)){d.i++;d.w=0;sfx('sel');if(d.i>=d.lines.length)G.dialog=null}T.dx=T.dy=0;updateFX();return}
  G.ts=1;if(G.mirror>0)G.mirror--;if(G.scarlet>0)G.scarlet--;if(G.noFire>0)G.noFire--;
  if(G.clearT>0&&P)P.inv=Math.max(P.inv,60);
  updatePlayer();if(G.state!=='play')return;
  G.eAcc+=G.ts;
  while(G.eAcc>=1){G.eAcc-=1;G.st++;if(G.warn>0)G.warn--;runScript();updateEnemies();if(G.dialog)break}
  if(G.mainDone&&G.clearT<=0&&!G.clearing){G.clearing=true;G.clearT=170;IT.forEach(i=>i.magnet=true)}
  if(G.clearing){G.clearT--;if(G.clearT===70){G.autoExit=true;IT.forEach(i=>i.magnet=true)}if(G.clearT<=0){G.clearing=false;G.autoExit=false;stageClear();return}}
  runTickQ();updateShots();updateBullets(G.ts);updateLasers(G.ts);updateItems();updateFX();
 }
};
const TITLE_MENU=[
 {t:'게임 시작',fn(){G.practice=false;setState('diff',OPT.diff)}},
 {t:'스테이지 연습',fn(){G.practice=true;setState('diff',OPT.diff)}},
 {t:'옵션',fn(){setState('options')}},
 {t:'조작 방법',fn(){setState('howto')}},
];
const PAUSE_MENU=[
 {t:'계속하기',fn(){sfx('ok');resume()}},
 {t:'이 막 처음부터',fn(){if(A.ctx)A.ctx.resume();sfx('ok');P.lives=Math.max(P.lives,D.lives-1);startStage(G.stage)}},
 {t:'타이틀로',fn(){if(A.ctx)A.ctx.resume();saveHi();titleScreen()}},
];
const onoff=b=>b?'켜짐':'꺼짐';
const OPTS=[
 {n:'난이도',v:()=>DIFFS[OPT.diff].name+' ('+DIFFS[OPT.diff].en+')',chg(d){setDiff((OPT.diff+d+4)%4)}},
 {n:'시작 목숨 추가',v:()=>'+'+OPT.extraLives,chg(d){OPT.extraLives=(OPT.extraLives+d+4)%4;saveOpt()}},
 {n:()=>I.touch?'상시 연사 (샷 버튼 없이 계속 발사)':'상시 연사 (Z 없이 계속 발사)',v:()=>onoff(autoOn()),chg(){OPT[AFK()]=!OPT[AFK()];saveOpt()}},
 {n:'피격 시 자동 필살기',v:()=>onoff(OPT.autobomb),chg(){OPT.autobomb=!OPT.autobomb;saveOpt()}},
 {n:'판정점 항상 표시',v:()=>onoff(OPT.hitbox),chg(){OPT.hitbox=!OPT.hitbox;saveOpt()}},
 {n:'화면 흔들림',v:()=>onoff(OPT.shake),chg(){OPT.shake=!OPT.shake;saveOpt()}},
 {n:'배경음',v:()=>'■'.repeat(OPT.bgm)+'□'.repeat(10-OPT.bgm),chg(d){OPT.bgm=clamp(OPT.bgm+d,0,10);saveOpt();applyVol()},tap(){OPT.bgm=(OPT.bgm+1)%11;saveOpt();applyVol()}},
 {n:'효과음',v:()=>'■'.repeat(OPT.sfx)+'□'.repeat(10-OPT.sfx),chg(d){OPT.sfx=clamp(OPT.sfx+d,0,10);saveOpt();applyVol();sfx('item')},tap(){OPT.sfx=(OPT.sfx+1)%11;saveOpt();applyVol();sfx('item')}},
 ...(document.documentElement.requestFullscreen?[{n:'전체화면',v:()=>onoff(!!document.fullscreenElement),act(){toggleFS()}}]:[]),
 {n:'돌아가기',v:()=>'',act(){setState('title',2)}},
];
function confirmHero(){sfx('ok');G.char=G.menu;newGame(G.practice?(G.pickStage||0):0,G.practice)}

// ── 그리기: 월드 ──────────────────────────────────────────
function drawItem(it){
  const s=it.k==='p'?SP.itemP:it.k==='b'?SP.itemB:it.k==='l'?SP.itemL:SP.itemG,y=Math.round(it.y+Math.sin(it.t*.14)*1.5),x=Math.round(it.x);
  dr(s,x,y);
  // 모서리 괄호가 맥동하며 '먹을 것'임을 알린다
  const k=Math.floor(Math.abs(Math.sin(it.t*.13))*3),hw=16+k,hh=19+k;
  g.fillStyle=Math.floor(it.t/8)%2?'#ffffff':'#ffe27a';
  for(const sx of[-1,1])for(const sy of[-1,1]){const cx=x+sx*hw,cy=y+sy*hh;g.fillRect(sx<0?cx:cx-4,sy<0?cy:cy-1,5,2);g.fillRect(sx<0?cx:cx-1,sy<0?cy:cy-4,2,5)}
}
function drawWorld(){
  const on=OPT.shake&&!REDUCED&&G.shake>0,sx=on?Math.round(rnd(-G.shake,G.shake)*.6):0,sy=on?Math.round(rnd(-G.shake,G.shake)*.6):0;
  g.setTransform(1,0,0,1,sx,sy);
  drawBG(G.stage,G.scroll,G.t);
  for(const e of EN)if(e.ground&&!e.dead)drawEnemy(e);
  for(const e of EN)if(e.isBoss&&!e.dead){const fl=e.flash>0&&e.flash%2===1;if(!(e.dying>0&&e.dying%6<2))e.def.draw(e,fl);if(e.hex>0&&e.hits[0])drawMarks(e,e.hits[0].x,e.hits[0].y-e.hits[0].r-8)}
  for(const it of IT){if(it.k==='coin')dr(SP.coin[Math.floor(G.t/4+it.x)&3],it.x,it.y);else drawItem(it)}
  for(const e of EN)if(!e.ground&&!e.isBoss&&!e.dead)drawEnemy(e);
  drawLasers();drawShots();if(P)drawPlayer();
  for(const b of EB){
    if(b.delay!==undefined){g.globalAlpha=.55+.35*Math.sin(b.t*.3)}
    if(b.k==='needle'||b.k==='rice'||b.k==='petal')dr(b.s,b.x,b.y,b.rot);
    else if(b.k==='star')dr(b.s,b.x,b.y,b.t*.15);
    else g.drawImage(b.s.c,Math.round(b.x-b.s.ox),Math.round(b.y-b.s.oy));
    g.globalAlpha=1;
  }
  drawFX();
  g.setTransform(1,0,0,1,0,0);
  if(G.state==='play'||G.state==='pause'){
    if(G.mirror>0){for(let i=0;i<6;i++){const by=i*60;g.drawImage(gc,0,by,W,60,Math.sin(G.t*.08+i*1.3)*16,by,W,60)}
      g.save();g.globalAlpha=.26;g.translate(W,0);g.scale(-1,1);g.drawImage(gc,0,0);g.restore();
      g.strokeStyle='#ffd27a';g.lineWidth=1;for(let i=0;i<7;i++){g.beginPath();g.moveTo(W/2,H/2);const a=i/7*TAU+G.t*.006;g.lineTo(W/2+Math.cos(a)*700,H/2+Math.sin(a)*700);g.stroke()}}
    else if(G.ts<1){g.fillStyle='rgba(255,176,60,.14)';g.fillRect(0,0,W,H)}
    if(G.scarlet>0){g.globalCompositeOperation='multiply';g.fillStyle='#ff6f90';g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over'}
    if(G.flash>0){g.globalAlpha=Math.min(REDUCED?.15:.6,G.flash/12);g.fillStyle=G.flashC;g.fillRect(0,0,W,H);g.globalAlpha=1}
  }
}
// ── 그리기: UI ────────────────────────────────────────────
function tx(s,x,y,sz,c,al='left',f=FB,st=true){
  u.font=sz+'px '+f;u.textAlign=al;u.textBaseline='middle';
  if(st){u.lineWidth=Math.max(2,sz/3.4);u.strokeStyle='rgba(7,5,15,.92)';u.lineJoin='round';u.strokeText(s,x,y)}
  u.fillStyle=c;u.fillText(s,x,y);
}
function wrap(s,x,y,w,lh,sz,c,f=FB,st=false){
  u.font=sz+'px '+f;let line='',yy=y;
  for(const w0 of s.split(' ')){const test=line?line+' '+w0:w0;if(u.measureText(test).width>w&&line){tx(line,x,yy,sz,c,'left',f,st);u.font=sz+'px '+f;line=w0;yy+=lh}else line=test}
  if(line)tx(line,x,yy,sz,c,'left',f,st);return yy+lh;
}
let lastM={x:-2,y:-2},moved=false;
function hit(x,y,w,h,idx,fn){UIH.push({r:[x,y,w,h],fn});if(moved&&idx!==null&&inR(MOUSE,[x,y,w,h]))G.menu=idx}
function panel(x,y,w,h,a=.82){u.fillStyle=`rgba(10,7,24,${a})`;u.fillRect(x,y,w,h);u.strokeStyle='rgba(231,192,99,.5)';u.lineWidth=.6;u.strokeRect(x+.5,y+.5,w-1,h-1)}
function bar(x,y,w,h,q,c,bg='rgba(255,255,255,.14)'){u.fillStyle=bg;u.fillRect(x,y,w,h);u.fillStyle=c;u.fillRect(x,y,w*clamp(q,0,1),h)}
function portrait(id,x,y,sc){u.imageSmoothingEnabled=false;u.drawImage(SP.port[id].c,x,y,96*sc,118*sc)}
function sprU(s,x,y,sc){u.imageSmoothingEnabled=false;u.drawImage(s.c,x-s.w*sc/2,y-s.h*sc/2,s.w*sc,s.h*sc)}
const fmt=n=>String(Math.floor(n)).padStart(9,'0');

function drawHUD(){
  const p=P,C=CH();
  tx('점수',8,9,8,GOLD);tx(fmt(G.score),30,9,12,'#fff','left',FB);
  tx('명 ',8,23,9,'#ff9c9c');for(let i=0;i<Math.min(p.lives,8);i++){u.fillStyle='#ff5a6a';u.beginPath();u.arc(23+i*9,23,3.4,0,TAU);u.fill()}
  tx('폭',8,35,9,'#9cc4ff');for(let i=0;i<Math.min(p.bombs,8);i++){u.fillStyle='#5a90ff';u.fillRect(19.5+i*9,31.5,7,7)}
  tx('최고',W-8-74-22,9,8,GOLD);tx(fmt(G.hi),W-8,9,12,'#fff','right');
  tx(D.name+' · '+STAGES[G.stage].name.split(' · ')[0],W-8,22,9,D.col,'right');
  // 게이지
  const gy=H-11;tx(C.skillName,8,gy-9,9,C.accent);bar(8,gy-2,120,6,p.gauge/100,p.skillOn?'#ffffff':C.accent);
  for(let i=0;i<4;i++){u.fillStyle=i<p.power?'#ff5a4a':'rgba(255,255,255,.2)';u.fillRect(134+i*11,gy-2,9,6)}tx('화력',134,gy-9,9,'#ff9c8c');
  // 보스 체력
  const b=G.boss;
  if(b&&(b.active||b.dying)){const q=b.dying?0:b.hp/b.maxhp;tx(b.name,170,9,10,'#ffd27a');const ph=b.phases[Math.min(b.ph,b.phases.length-1)];
    tx(ph.name,470,9,10,'#ff9cc0','right');bar(170,16,300,5,q,'#ff3a5a','rgba(255,255,255,.18)');
    const n=b.phases.length;for(let i=0;i<n;i++){u.fillStyle=i>=b.ph?'#ffd27a':'rgba(255,255,255,.2)';u.fillRect(170+i*9,24,7,3)}
    tx(String(Math.max(0,Math.ceil(b.timer/60))),470,26,9,'#fff','right')}
  if(BANNER.t>0)tx(BANNER.s,W/2,76,17,'#fff3b0','center',FT);
  if(G.stageCard>0&&!G.dialog){const a=Math.min(1,G.stageCard/30,(200-G.stageCard)/20);u.globalAlpha=a;u.fillStyle='rgba(7,5,15,.6)';u.fillRect(0,H/2-46,W,92);const s=STAGES[G.stage];tx(s.name,W/2,H/2-14,32,'#fff3d0','center',FT);tx(s.sub,W/2,H/2+21,14,DIM,'center');u.globalAlpha=1}
  if(G.warn>0){const a=.55+.45*Math.sin(G.t*.3);u.globalAlpha=a;u.fillStyle='rgba(180,10,40,.75)';u.fillRect(0,H/2-26,W,52);tx('경 고  ·  거대한 적 접근',W/2,H/2,30,'#fff','center',FT);u.globalAlpha=1}
  if(G.cutin){const c=G.cutin,k=clamp(Math.min((64-c.t)/8,c.t/8),0,1),id=CHARS[c.c].id;u.globalAlpha=k*.92;u.fillStyle='rgba(7,5,15,.8)';u.fillRect(0,H/2-52,W,104);u.save();u.beginPath();u.rect(0,H/2-52,W,104);u.clip();portrait(id,lerp(-120,24,k),H/2-64,1.9);u.restore();tx(c.name,190,H/2-8,38,CHARS[c.c].accent,'left',FT);tx(CHARS[c.c].name,192,H/2+28,14,'#fff');u.globalAlpha=1}
  if(p.skillOn&&C.id==='vega'&&!p.dead){const q=p.ch||0;tx(q>=VEGA_MAX?'흡수 최대! 위력 '+vegaPow(q):'흡수 '+q+' · 위력 '+vegaPow(q),p.x,Math.max(44,p.y-34),11,q>=VEGA_MAX?'#fff3b0':'#ffcf5e','center')}
  if(G.dialog){const d=G.dialog,l=d.lines[Math.min(d.i,d.lines.length-1)];panel(10,H-92,W-20,82,.9);
    const left=l.side==='l';if(left){u.save();u.beginPath();u.rect(14,H-88,76,74);u.clip();portrait(C.id,14,H-90,.8);u.restore()}
    const tx0=left?100:24;tx(l.who,tx0,H-76,14,left?C.accent:'#ff9cc0','left',FT,false);wrap(l.text,tx0,H-54,W-tx0-30,19,15,PAPER);
    tx('Z / 탭으로 넘기기',W-20,H-20,9,DIM,'right',FB,false)}
  if(I.touch&&!G.dialog&&!dockOn){const b1=(r,t,c)=>{u.globalAlpha=.42;u.fillStyle=c;u.beginPath();u.arc(r[0]+r[2]/2,r[1]+r[3]/2,r[2]/2,0,TAU);u.fill();u.globalAlpha=1;tx(t,r[0]+r[2]/2,r[1]+r[3]/2,12,'#fff','center')};
    b1(BTN_SKILL,'기술',C.accent);b1(BTN_BOMB,'필살','#5a90ff');if(!autoOn())b1(BTN_SHOT,'샷','#ff7a5a');u.globalAlpha=.6;panel(BTN_PAUSE[0],BTN_PAUSE[1],BTN_PAUSE[2],BTN_PAUSE[3]);u.globalAlpha=1;tx('멈춤',BTN_PAUSE[0]+19,BTN_PAUSE[1]+12,10,'#fff','center',FB,false)}
}
function backBtn(x,y,fn){hit(x,y,52,24,null,fn);panel(x,y,52,24,.92);tx('뒤로',x+26,y+12,13,GOLD,'center',FB,false)}
function drawLogo(x,y){
  tx('六星戰記',x+3,y-48,14,GOLD,'left',FB,true);
  u.font=`66px ${FT}`;u.textAlign='left';u.textBaseline='middle';
  u.lineWidth=10;u.strokeStyle='#120a22';u.lineJoin='round';u.strokeText('육성전기',x,y);
  const q=u.createLinearGradient(0,y-34,0,y+32);q.addColorStop(0,'#fff6d0');q.addColorStop(.52,'#f0c95a');q.addColorStop(.54,'#c1702a');q.addColorStop(1,'#ffcf7a');u.fillStyle=q;u.fillText('육성전기',x,y);
  tx('여섯 별이 찢어진 하늘을 닫는다',x+3,y+44,14,PAPER,'left',FB,true);
}
function menuList(items,x,y,lh,w,sz=17){items.forEach((m,i)=>{const on=G.menu===i;hit(x-10,y+i*lh-lh/2,w,lh,i,()=>{G.menu=i;sfx('ok');m.fn()});if(on){u.fillStyle='rgba(231,192,99,.22)';u.fillRect(x-10,y+i*lh-lh/2+1,w,lh-2);u.fillStyle=GOLD;u.fillRect(x-10,y+i*lh-lh/2+1,3,lh-2)}tx(m.t,x,y+i*lh,sz,on?'#fff6d0':PAPER)})}
const UI={
 title(){
  drawLogo(30,108);menuList(TITLE_MENU,40,204,27,178);
  tx('최고 점수 '+fmt(store.get('hi.'+DIFFS[OPT.diff].id,0))+' · '+DIFFS[OPT.diff].name,30,334,11,DIM);
  tx(I.touch?'메뉴를 탭해서 고르세요 · 가로 화면을 권장합니다':'Z 결정 · X 취소 · F 전체화면 · M 음악 끄기',W-12,348,10,DIM,'right');
  if(!I.touch&&!document.hasFocus()&&Math.floor(G.t/30)%2)tx('화면을 한 번 클릭하면 키보드와 소리가 켜집니다',W-12,334,12,'#fff3b0','right');
  HERO_ORDER.forEach((id,i)=>{const a=i/6*TAU+G.t*.008,cx=470+Math.cos(a)*98,cy=178+Math.sin(a)*80;sprU(SP.hero[id][Math.floor(G.t/6+i)%4],cx,cy,1.5)});
 },
 howto(){
  panel(40,24,560,312,.93);tx('조작 방법',60,48,26,GOLD,'left',FT);
  const rows=[['이동','방향키 또는 WASD'],['샷','Z 또는 J (누르고 있으면 연사)'],['고유기술','X 또는 K를 누르고 유지 · 기(氣) 게이지 소모'],['필살기','C, L, 스페이스 · 사용 중 무적, 화면의 탄 제거'],['정밀 이동','Shift (이동 속도 절반, 판정점 표시)'],['일시정지','Esc 또는 P · F 전체화면 · M 음악'],['터치','드래그해 이동, 기술·필살은 버튼 · 상시 연사가 기본으로 켜져 있음']];
  rows.forEach((r,i)=>{tx(r[0],60,84+i*25,15,'#ffd27a');tx(r[1],144,84+i*25,15,PAPER)});
  wrap('판정은 영웅 가슴의 마름모 표식뿐입니다. 탄을 스치면 기 게이지가 차고, 화면 오른쪽 끝으로 가면 아이템을 전부 끌어옵니다. 금테 패는 먹는 아이템입니다. 빨강 화력, 파랑 필살기, 보라 게이지, 초록 목숨.',60,264,520,20,14,DIM);
  tx(I.touch?'탭하면 돌아갑니다':'Z를 누르면 돌아갑니다',W-60,316,12,GOLD,'right');hit(0,0,W,H,null,()=>setState('title',3));
 },
 diff(){
  panel(60,24,520,312,.92);tx(G.practice?'연습 난이도':'난이도 선택',80,50,26,GOLD,'left',FT);
  DIFFS.forEach((d,i)=>{const y=84+i*60,on=G.menu===i;
   hit(70,y,500,54,i,()=>{G.menu=i;sfx('ok');setDiff(i);G.practice?setState('stagepick'):setState('select',G.char)});
   u.fillStyle=on?'rgba(231,192,99,.18)':'rgba(255,255,255,.04)';u.fillRect(70,y,500,54);if(on){u.fillStyle=d.col;u.fillRect(70,y,4,54)}
   tx(d.name,88,y+17,22,d.col,'left',FT,false);tx(d.en,88,y+40,10,DIM,'left',FB,false);
   tx(d.desc,170,y+17,14,PAPER,'left',FB,false);
   tx(`목숨 ${d.lives+OPT.extraLives} · 필살 ${d.bombs} · 탄속 ${Math.round(d.spd*100)}% · 적 체력 ${Math.round(d.hp*100)}% · 점수 ×${d.score}`,170,y+39,11,DIM,'left',FB,false)});
  if(I.touch)backBtn(584,8,()=>{sfx('sel');setState('title',G.practice?1:0)});
 },
 stagepick(){
  panel(100,24,440,312,.92);tx('연습할 막',120,50,26,GOLD,'left',FT);
  STAGES.forEach((s,i)=>{const y=84+i*48,on=G.menu===i;hit(110,y,420,44,i,()=>{G.menu=i;G.pickStage=i;sfx('ok');setState('select',G.char)});
   u.fillStyle=on?'rgba(231,192,99,.18)':'rgba(255,255,255,.04)';u.fillRect(110,y,420,44);if(on){u.fillStyle=GOLD;u.fillRect(110,y,4,44)}
   tx(s.name,126,y+14,17,on?'#fff6d0':PAPER,'left',FB,false);tx(s.sub,126,y+32,11,DIM,'left',FB,false)});
  if(I.touch)backBtn(584,8,()=>{sfx('sel');setState('diff',OPT.diff)});
 },
 select(){
  tx('영웅 선택',16,22,24,GOLD,'left',FT);tx(DIFFS[OPT.diff].name+(G.practice?' · 연습 '+STAGES[G.pickStage||0].name.split(' · ')[0]:''),226,24,12,DIFFS[OPT.diff].col,'right');
  CHARS.forEach((c,i)=>{const x=14+(i%3)*72,y=44+Math.floor(i/3)*94,on=G.menu===i,f=SP.hero[c.id][Math.floor(G.t/6+i)%4];
   hit(x,y,68,88,i,()=>{if(G.menu===i)confirmHero();else{G.menu=i;sfx('sel')}});
   u.fillStyle=on?'rgba(231,192,99,.26)':'rgba(10,7,24,.82)';u.fillRect(x,y,68,88);u.strokeStyle=on?c.accent:'rgba(231,192,99,.3)';u.lineWidth=on?1.6:.6;u.strokeRect(x+.5,y+.5,67,87);
   u.save();u.beginPath();u.rect(x+1,y+1,66,64);u.clip();portrait(c.id,x-3,y+1,.78);u.restore();
   tx(c.name,x+34,y+76,11,on?'#fff':PAPER,'center',FB,false)});
  const C=CHARS[G.menu];
  ['화력','속도','범위','기교'].forEach((n,i)=>{const y=246+i*18;tx(n,16,y,12,DIM,'left',FB,false);for(let j=0;j<5;j++){u.fillStyle=j<C.stat[i]?C.accent:'rgba(255,255,255,.14)';u.fillRect(52+j*33,y-4,30,8)}});
  if(I.touch){backBtn(16,324,()=>{sfx('sel');G.char=G.menu;G.practice?setState('stagepick',G.pickStage||0):setState('diff',OPT.diff)});tx('다시 탭하면 출격',78,336,12,DIM,'left',FB,false)}
  else tx('Z로 출격 · X로 뒤로',16,334,11,DIM,'left',FB,false);
  panel(238,8,394,344,.9);
  u.save();u.beginPath();u.rect(244,14,110,134);u.clip();portrait(C.id,244,14,1.145);u.restore();
  sprU(SP.hero[C.id][Math.floor(G.t/5)%4],580,40,1.5);
  tx(C.name,364,30,27,C.accent,'left',FT,false);tx(C.title,364,56,15,'#fff6d0','left',FB,false);tx(C.origin,364,74,11,DIM,'left',FB,false);
  wrap(C.motif,364,94,258,16,12.5,PAPER);
  const rows=[['탄환',C.shotName,C.shotDesc],['홀드 기술',C.skillName,C.skillDesc],['필살기',C.bombName,C.bombDesc]];
  rows.forEach((r,i)=>{const y=162+i*63;u.fillStyle='rgba(255,255,255,.05)';u.fillRect(246,y,378,58);tx(r[0],254,y+13,11,DIM,'left',FB,false);tx(r[1],312,y+13,16,C.accent,'left',FT,false);wrap(r[2],254,y+33,362,15,12.5,PAPER)});
 },
 options(){
  panel(70,16,500,328,.93);tx('옵션',90,40,26,GOLD,'left',FT);
  OPTS.forEach((o,i)=>{const y=70+i*26,on=G.menu===i;
   hit(80,y-13,480,25,i,()=>{G.menu=i;if(o.act)o.act();else if(o.tap)o.tap();else o.chg(1);sfx('sel')});
   if(on){u.fillStyle='rgba(231,192,99,.18)';u.fillRect(80,y-12,480,24);u.fillStyle=GOLD;u.fillRect(80,y-12,3,24)}
   tx(typeof o.n==='function'?o.n():o.n,94,y,15,on?'#fff6d0':PAPER,'left',FB,false);tx(o.v(),548,y,14,on?'#ffd27a':DIM,'right',FB,false)});
  tx(I.touch?'줄을 탭하면 값이 바뀝니다':'◀ ▶ 값 변경 · X 돌아가기',90,334,11,DIM,'left',FB,false);
 },
 pause(){
  drawHUD();u.fillStyle='rgba(7,5,15,.62)';u.fillRect(0,0,W,H);tx('일시정지',W/2,108,34,GOLD,'center',FT);menuList(PAUSE_MENU,W/2-60,166,32,150,18);
 },
 over(){
  const can=G.conts<D.cont;u.fillStyle='rgba(7,5,15,.72)';u.fillRect(0,0,W,H);tx('격추되었습니다',W/2,104,38,'#ff7a8a','center',FT);tx('점수 '+fmt(G.score),W/2,150,18,'#fff','center');
  if(can){tx('이어하기  '+Math.ceil(G.contT/60),W/2,196,28,GOLD,'center',FT);tx(`${I.touch?'탭하여 이어하기':'Z 이어하기 · X 포기'} · 남은 횟수 ${D.cont>=99?'무제한':D.cont-G.conts}`,W/2,232,14,PAPER,'center');hit(0,0,W,H,null,()=>{sfx('ok');doContinue()});if(I.touch)backBtn(W/2-26,262,titleScreen)}
  else{tx('여기까지입니다',W/2,196,22,PAPER,'center',FT);tx(I.touch?'탭하면 타이틀로':'Z로 타이틀',W/2,232,14,DIM,'center');hit(0,0,W,H,null,titleScreen)}
 },
 clear(){
  u.fillStyle='rgba(7,5,15,.72)';u.fillRect(0,0,W,H);const s=STAGES[G.stage];tx(s.name,W/2,92,22,PAPER,'center',FT);tx('돌파!',W/2,140,52,GOLD,'center',FT);
  tx('잔기·필살 보너스 +'+G.clearBonus.toLocaleString(),W/2,196,17,'#fff','center');tx('점수 '+fmt(G.score)+' · 격파 '+G.kills,W/2,222,15,PAPER,'center');
  tx(I.touch?'탭하여 계속':G.practice?'Z로 타이틀':'Z로 다음 막',W/2,268,15,GOLD,'center');hit(0,0,W,H,null,()=>{if(G.fade<=0){sfx('ok');advance()}});
 },
 ending(){
  const C=CH();u.fillStyle=INK;u.fillRect(0,0,W,H);tx('천문이 닫혔다',36,44,36,GOLD,'left',FT);portrait(C.id,40,80,1.6);tx(C.name,40,284,20,C.accent,'left',FT);tx(C.title,40,306,13,DIM);
  wrap(ENDINGS[C.id],212,96,392,27,18,PAPER);
  tx(`최종 점수 ${fmt(G.score)}`,212,270,18,'#fff');tx(`난이도 ${D.name} · 격파 ${G.kills} · 이어하기 ${G.conts}회`,212,296,14,DIM);tx(I.touch?'탭하면 타이틀로':'Z로 타이틀',W-36,334,14,GOLD,'right');hit(0,0,W,H,null,()=>{if(G.fade<=0){sfx('ok');titleScreen()}});
 },
};
function render(){
  moved=MOUSE.x!==lastM.x||MOUSE.y!==lastM.y;if(moved)lastM={x:MOUSE.x,y:MOUSE.y};
  const st=G.state,inGame=st==='play'||st==='pause'||st==='over'||st==='clear';
  if(inGame)drawWorld();
  else if(st==='ending'){g.fillStyle=INK;g.fillRect(0,0,W,H)}
  else{g.setTransform(1,0,0,1,0,0);drawBG(st==='title'||st==='options'||st==='howto'?0:st==='select'?2:1,G.scroll,G.t);if(st==='select'){g.fillStyle='rgba(7,5,15,.55)';g.fillRect(0,0,W,H)}}
  u.setTransform(US,0,0,US,0,0);u.clearRect(0,0,W,H);UIH=[];
  if(st==='play'&&P)drawHUD();
  if(UI[st])UI[st]();
  if(G.fade>0){u.fillStyle=`rgba(7,5,15,${G.fade/14})`;u.fillRect(0,0,W,H)}
  if(dockOn)updateDock();
}
const setT=(el,t)=>{if(el.textContent!==t)el.textContent=t};
function updateDock(){
  const play=G.state==='play';setT($('bSkill'),play?CHARS[P?P.c:0].skillName:'뒤로');setT($('bBomb'),play?'필살기':'결정');
  $('bShot').hidden=!play||autoOn();$('bPause').hidden=!(play||G.state==='pause');
  for(const[id,k]of[['bSkill','skill'],['bBomb','bomb'],['bShot','shot']])$(id).classList.toggle('on',T[k]!==null);
  $('pad').classList.toggle('on',T.mv!==null);
}
// ── 시작 ──────────────────────────────────────────────────
function boot(){
  buildHeroArt();buildHeroExtra();buildEnemyArt();buildBG();
  G.hi=store.get('hi.'+D.id,0);titleScreen();G.fade=30;
  try{if(document.fonts){document.fonts.load("20px 'Black Han Sans'","육성");document.fonts.load("20px 'Do Hyeon'","육성")}}catch(e){}
  let last=performance.now(),acc=0;const dt=1000/60;
  (function loop(now){
    requestAnimationFrame(loop);
    acc+=Math.min(100,now-last);last=now;
    while(acc>=dt){pollInput();gameTick();acc-=dt}
    render();
  })(last);
  uc.focus({preventScroll:true});
}
boot();
