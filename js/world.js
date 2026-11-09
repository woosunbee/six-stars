'use strict';
// ── 난이도 ────────────────────────────────────────────────
const DIFFS=[
 {id:'easy',name:'수련',en:'EASY',desc:'느린 탄, 적은 탄막. 처음 하는 분께. 이어하기 무제한.',spd:.68,fire:1.7,ext:-1,hp:.8,lives:4,bombs:4,cont:99,score:.5,rev:0,col:'#7dffb0'},
 {id:'normal',name:'무관',en:'NORMAL',desc:'기본 난이도. 이어하기 3회.',spd:.9,fire:1.2,ext:0,hp:1,lives:3,bombs:3,cont:3,score:1,rev:0,col:'#7dd4ff'},
 {id:'hard',name:'장군',en:'HARD',desc:'빠르고 촘촘한 탄막. 적이 죽을 때 가끔 반격합니다. 이어하기 1회.',spd:1.12,fire:.92,ext:1,hp:1.25,lives:3,bombs:3,cont:1,score:1.8,rev:.25,col:'#ffc95e'},
 {id:'hell',name:'천벌',en:'HELL',desc:'모든 적이 반격탄을 남깁니다. 이어하기 없음. 점수 3배.',spd:1.32,fire:.72,ext:2,hp:1.5,lives:2,bombs:2,cont:0,score:3,rev:.9,col:'#ff5f7e'}
];
let D=DIFFS[OPT.diff]||DIFFS[1];
const G={state:'boot',t:0,st:0,stage:0,score:0,hi:0,char:0,conts:0,practice:false,ts:1,eAcc:0,scroll:0,scrollV:1.6,shake:0,flash:0,flashC:'#fff',
  dialog:null,cutin:null,co:[],mainDone:false,boss:null,bossDead:false,clearT:0,warn:0,noFire:0,stageCard:0,fade:0,fadeTo:null,kills:0,mirror:0,scarlet:0,menu:0,nextExt:[200000,500000,1000000,2000000,3500000],clearBonus:0};
const EB=[],PS=[],EN=[],IT=[],FX=[],LZ=[];
let P=null;
const CH=()=>CHARS[P.c];
const every=(t,n)=>t%Math.max(2,Math.round(n*D.fire))===0;
const aimA=e=>Math.atan2(P.y-e.y,P.x-e.x);
const onS=e=>e.x>-30&&e.x<W+6&&e.y>-30&&e.y<H+30;

// ── 적 탄 ─────────────────────────────────────────────────
function bul(x,y,a,v,k='orb',c='pink',ex){
  if(EB.length>1500)return null;
  const b={x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,k,c,s:BS(k,c),r:BK[k].r,rot:a,t:0,gz:0};
  if(ex)Object.assign(b,ex);EB.push(b);return b;
}
function fan(x,y,a,v,n,sp,k,c,ex){n=Math.max(1,n);for(let i=0;i<n;i++)bul(x,y,a+(i-(n-1)/2)*sp,v,k,c,ex)}
function ring(x,y,v,n,off,k,c,ex){n=Math.max(3,n);for(let i=0;i<n;i++)bul(x,y,off+i/n*TAU,v,k,c,ex)}
const vS=v=>v*D.spd;
const nS=n=>Math.max(1,n+D.ext);
const rS=n=>Math.max(4,Math.round(n*(D.ext<0?.65:1+D.ext*.18)));
function cancelBullets(coins){
  let n=0;
  for(const b of EB){spark1(b.x,b.y,BCOL[b.c][0]);if(coins&&n++<36&&onS(b))IT.push(mkItem(b.x,b.y,'coin'))}
  EB.length=0;
}
function updateBullets(ts){
  const p=P;
  const vuln=p&&!p.dead&&p.inv<=0&&p.bombT<=0&&!p.phase&&G.state==='play';
  for(let i=EB.length-1;i>=0;i--){
    const b=EB[i];b.t+=ts;
    if(b.delay!==undefined){if(b.t>=b.delay){const a=b.la===undefined?(p?ang(b,p):PI):b.la;b.vx=Math.cos(a)*b.lv;b.vy=Math.sin(a)*b.lv;b.rot=a;b.delay=undefined}}
    if(b.fn)b.fn(b,ts);
    if(b.turn){const c=Math.cos(b.turn*ts),s=Math.sin(b.turn*ts),vx=b.vx*c-b.vy*s;b.vy=b.vx*s+b.vy*c;b.vx=vx;b.rot=Math.atan2(b.vy,b.vx)}
    if(b.acc){b.vx*=1+b.acc*ts;b.vy*=1+b.acc*ts}
    if(b.ax||b.ay){b.vx+=(b.ax||0)*ts;b.vy+=(b.ay||0)*ts;b.rot=Math.atan2(b.vy,b.vx)}
    b.x+=b.vx*ts;b.y+=b.vy*ts;
    if(b.x<-24||b.x>W+40||b.y<-40||b.y>H+24){if(b.t>30||b.x<-24){EB[i]=EB[EB.length-1];EB.pop();continue}}
    if(p&&!p.dead){
      const dx=b.x-p.x,dy=b.y-p.y,d2=dx*dx+dy*dy,rr=b.r+p.hr;
      if(vuln&&d2<rr*rr){EB[i]=EB[EB.length-1];EB.pop();killPlayer();return}
      if(vuln&&!b.gz&&d2<17*17){b.gz=1;gain(1.1);addScore(30);sfx('graze');spark1(p.x+dx*.5,p.y+dy*.5,'#fff')}
    }
  }
}
// ── 레이저 ────────────────────────────────────────────────
function laser(x,y,a,o={}){const l=Object.assign({x,y,a,va:0,len:900,w:10,warn:50,dur:60,t:0,c:'#ff4f9f',fired:false},o);LZ.push(l);return l}
function updateLasers(ts){
  const p=P,vuln=p&&!p.dead&&p.inv<=0&&p.bombT<=0&&!p.phase;
  for(let i=LZ.length-1;i>=0;i--){const l=LZ[i];l.t+=ts;if(l.follow)l.follow(l);
    if(l.t>=l.warn){if(!l.fired){l.fired=true;sfx('laser')}l.a+=l.va*ts;
      if(vuln){const c=Math.cos(l.a),s=Math.sin(l.a),dx=p.x-l.x,dy=p.y-l.y,q=dx*c+dy*s,perp=Math.abs(-dx*s+dy*c);if(q>0&&q<l.len&&perp<l.w*.5+p.hr-1){killPlayer();return}}}
    if(l.t>l.warn+l.dur){LZ.splice(i,1)}}
}
function drawLasers(){
  for(const l of LZ){const c=Math.cos(l.a),s=Math.sin(l.a),x2=l.x+c*l.len,y2=l.y+s*l.len;
    g.lineCap='butt';
    if(l.t<l.warn){g.globalAlpha=.35+.45*(Math.floor(l.t/3)%2);g.strokeStyle=l.c;g.lineWidth=1;g.beginPath();g.moveTo(l.x,l.y);g.lineTo(x2,y2);g.stroke();g.globalAlpha=1}
    else{const e=clamp(Math.min((l.t-l.warn)/5,(l.warn+l.dur-l.t)/8),0,1);g.globalCompositeOperation='lighter';g.strokeStyle=l.c;g.lineWidth=l.w*e*1.5;g.beginPath();g.moveTo(l.x,l.y);g.lineTo(x2,y2);g.stroke();g.strokeStyle='#fff';g.lineWidth=l.w*e*.6;g.beginPath();g.moveTo(l.x,l.y);g.lineTo(x2,y2);g.stroke();g.globalCompositeOperation='source-over'}
  }
}
// ── 입자 ──────────────────────────────────────────────────
function pfx(o){if(FX.length>700)FX.shift();FX.push(o)}
const spark1=(x,y,c)=>pfx({k:0,x,y,vx:rnd(-1.4,1.4),vy:rnd(-1.4,1.4),t:0,l:rint(10,20),r:rnd(3,6),c});
function sparks(x,y,c,n=8,v=3,l=24,r=7){for(let i=0;i<n;i++){const a=rnd(TAU),q=rnd(.3,1)*v;pfx({k:0,x,y,vx:Math.cos(a)*q,vy:Math.sin(a)*q,t:0,l:rint(l*.5,l),r:rnd(r*.5,r),c})}}
const ringFx=(x,y,R,c,l=20,w=3)=>pfx({k:1,x,y,R,c,t:0,l,w});
function boltFx(x1,y1,x2,y2,c='#a8e0ff',w=2,l=9){const pts=[x1,y1],n=Math.max(3,Math.floor(hyp(x2-x1,y2-y1)/16));for(let i=1;i<n;i++){pts.push(lerp(x1,x2,i/n)+rnd(-8,8),lerp(y1,y2,i/n)+rnd(-8,8))}pts.push(x2,y2);pfx({k:2,pts,c,w,t:0,l})}
function boom(x,y,sz=1){
  const cs=['#ffcf5e','#ff7a1a','#ff3a2a'];
  for(let i=0;i<Math.floor(10*sz)+4;i++){const a=rnd(TAU),q=rnd(.5,3.6)*Math.sqrt(sz);pfx({k:0,x,y,vx:Math.cos(a)*q,vy:Math.sin(a)*q,t:0,l:rint(14,34),r:rnd(5,12)*Math.sqrt(sz),c:pick(cs)})}
  ringFx(x,y,26*sz,'#ffe6a0',16,2);
}
function updateFX(){for(let i=FX.length-1;i>=0;i--){const f=FX[i];f.t++;if(f.vx!==undefined){f.x+=f.vx;f.y+=f.vy;f.vx*=.95;f.vy*=.95}if(f.t>=f.l){FX[i]=FX[FX.length-1];FX.pop()}}}
function drawFX(){
  g.globalCompositeOperation='lighter';
  for(const f of FX){const q=f.t/f.l;
    if(f.k===0){const r=f.r*(1-q*.6);g.globalAlpha=1-q;g.drawImage(glow(f.c),f.x-r,f.y-r,r*2,r*2)}
    else if(f.k===1){g.globalAlpha=1-q;g.strokeStyle=f.c;g.lineWidth=f.w;g.beginPath();g.arc(f.x,f.y,Math.max(.5,f.R*(.25+q*.9)),0,TAU);g.stroke()}
    else if(f.k===2){g.globalAlpha=1-q*.8;g.lineCap='round';g.lineJoin='round';for(let j=0;j<2;j++){g.strokeStyle=j?'#fff':f.c;g.lineWidth=j?Math.max(1,f.w*.5):f.w*1.7;g.beginPath();g.moveTo(f.pts[0],f.pts[1]);for(let i=2;i<f.pts.length;i+=2)g.lineTo(f.pts[i],f.pts[i+1]);g.stroke()}}
  }
  g.globalAlpha=1;g.globalCompositeOperation='source-over';
  for(const f of FX)if(f.k===3){const q=f.t/f.l;dr(f.s[Math.floor(f.t/5)%f.s.length],f.x,f.y-q*20,0,1,1-q)}
}
// ── 아이템 ────────────────────────────────────────────────
function mkItem(x,y,k){return{x,y,k,t:0,vx:k==='coin'?rnd(-1.5,.5):rnd(-.6,.6),vy:k==='coin'?rnd(-2.4,-.4):rnd(-.8,.8)}}
function dropItem(x,y,k){IT.push(mkItem(x,y,k))}
function updateItems(){
  const p=P;
  for(let i=IT.length-1;i>=0;i--){const it=IT[i];it.t++;
    const d=p&&!p.dead?hyp(p.x-it.x,p.y-it.y):999,far=p&&!p.dead&&p.x>W*.74;
    if(d<70||far||it.magnet){const a=Math.atan2(p.y-it.y,p.x-it.x),v=far?9:Math.max(4,9-d*.06);it.x+=Math.cos(a)*v;it.y+=Math.sin(a)*v;it.magnet=true}
    else if(it.k==='coin'){it.vy=Math.min(1.6,it.vy+.06);it.x+=it.vx-.9;it.y+=it.vy}
    else{it.x+=it.vx-.5;it.y+=it.vy;if(it.y<24||it.y>H-12)it.vy*=-1;if(it.x>W-10)it.vx=-Math.abs(it.vx);if(it.t<200&&it.x<30)it.vx=Math.abs(it.vx)+.6}
    if(p&&!p.dead&&d<15){collect(it);IT.splice(i,1);continue}
    if(it.x<-20||it.y>H+20)IT.splice(i,1);
  }
}
function collect(it){
  const p=P;
  if(it.k==='coin'){addScore(200);sfx('coin');gain(.6)}
  else if(it.k==='p'){if(p.power<4){p.power++;sfx('power');banner(p.power===4?'최대 화력!':'화력 강화')}else{addScore(5000);sfx('item')}}
  else if(it.k==='b'){if(p.bombs<6){p.bombs++}else addScore(10000);sfx('power');banner('필살기 +1')}
  else if(it.k==='g'){gain(30);sfx('item')}
  else if(it.k==='l'){p.lives++;sfx('ext');banner('목숨 +1')}
}
let BANNER={t:0,s:''};
const banner=s=>{BANNER={t:70,s}};
function addScore(n){
  G.score+=Math.round(n*D.score);
  if(G.score>G.hi)G.hi=G.score;
  if(P&&G.nextExt.length&&G.score>=G.nextExt[0]){G.nextExt.shift();P.lives++;sfx('ext');banner('EXTEND! 목숨 +1')}
}
const gain=v=>{if(P)P.gauge=Math.min(100,P.gauge+v)};

// ── 적 피해·처치 ──────────────────────────────────────────
function hitE(e,x,y,r){
  if(e.hits){for(const h of e.hits){const dx=h.x-x,dy=h.y-y,R=h.r+r;if(dx*dx+dy*dy<R*R)return true}return false}
  const dx=e.x-x,dy=e.y-y,R=e.r+r;return dx*dx+dy*dy<R*R;
}
function hurt(e,d){
  if(e.dead||e.inv>0||!onS(e)&&!e.isBoss)return;
  if(e.isBoss&&(!e.active||e.trans>0))return;
  if(e.hex>0)d*=1+e.hex*.1;
  e.hp-=d;if(e.flash<=0)e.flash=3;addScore(d*6);gain(d*.05);
  if(e.hp<=0){if(e.isBoss)bossBreak(e);else killE(e)}
}
function killE(e,noDrop){
  e.dead=true;G.kills++;addScore(e.score);gain(1.8);
  boom(e.x,e.y,e.big?1.8:.8);sfx(e.big?'big':'kill');if(e.big)G.shake=Math.max(G.shake,5);
  if(!noDrop){
    if(e.drop)dropItem(e.x,e.y,e.drop);
    for(let i=0;i<(e.coins||1);i++)IT.push(mkItem(e.x+rnd(-6,6),e.y+rnd(-6,6),'coin'));
    if(!e.drop&&Math.random()<.03)dropItem(e.x,e.y,'g');
  }
  if(D.rev&&Math.random()<D.rev&&e.x>W*.25&&P&&!P.dead)bul(e.x,e.y,aimA(e),vS(2.4),'dot','white');
}
function eList(){return EN.filter(e=>!e.dead&&onS(e)&&(!e.isBoss||e.active))}
function nearest(x,y,f,maxD=1e9){let best=null,bd=maxD;for(const e of EN){if(e.dead||!onS(e)||(e.isBoss&&!e.active))continue;if(f&&!f(e))continue;const t=targetOf(e),d=hyp(t.x-x,t.y-y);if(d<bd){bd=d;best=e}}return best}
const targetOf=e=>e.hits&&e.hits[0]?e.hits[0]:e;
function beamHit(x0,y0,x1,y1,dmg,clear){
  for(const e of EN){if(e.dead)continue;
    const ok=e.hits?e.hits.some(h=>h.x+h.r>x0&&h.x-h.r<x1&&h.y+h.r>y0&&h.y-h.r<y1):(e.x+e.r>x0&&e.x-e.r<x1&&e.y+e.r>y0&&e.y-e.r<y1);
    if(ok)hurt(e,dmg)}
  if(clear)for(let i=EB.length-1;i>=0;i--){const b=EB[i];if(b.x>x0&&b.x<x1&&b.y>y0&&b.y<y1){spark1(b.x,b.y,BCOL[b.c][0]);EB[i]=EB[EB.length-1];EB.pop()}}
}
function hurtAll(d){for(const e of EN)if(!e.dead&&onS(e))hurt(e,d)}

// ── 플레이어 ──────────────────────────────────────────────
function newPlayer(c){return{c,x:-30,y:H/2,t:0,hr:2.4,power:1,gauge:100,bombs:D.bombs,lives:D.lives+OPT.extraLives,inv:120,dead:0,enter:40,cd:0,bombT:0,bombD:0,skillOn:false,gLock:false,noFire:false,phase:false,bank:0}}
function shot(o){PS.push(Object.assign({vx:0,vy:0,r:4,dmg:1,rot:0,life:150,t:0},o))}
function useBomb(){
  const p=P,C=CH();p.bombs--;p.bombD=p.bombT=C.bombDur;C.bomb(p);
  G.cutin={t:64,c:p.c,name:C.bombName};sfx('bomb');G.shake=8;
}
function killPlayer(){
  const p=P;if(p.dead||p.inv>0||p.bombT>0||p.phase)return;
  if(OPT.autobomb&&p.bombs>0){useBomb();return}
  sfx('die');boom(p.x,p.y,3);sparks(p.x,p.y,'#fff',30,6,40,9);G.shake=14;G.flash=8;G.flashC='#ff5050';
  const C=CH();if(C.onDeath)C.onDeath(p);
  p.skillOn=false;p.noFire=false;p.phase=false;
  if(p.power>1){p.power--;dropItem(p.x,p.y,'p')}
  p.lives--;p.dead=56;p.bombs=Math.max(p.bombs,D.bombs);p.gauge=Math.max(p.gauge,60);
  EB.length=0;
}
function updatePlayer(){
  const p=P;if(!p)return;p.t++;
  if(p.inv>0)p.inv--;
  if(p.dead>0){p.dead--;if(p.dead===0){if(p.lives<0){gameOver();return}p.x=-30;p.y=H/2;p.enter=34;p.inv=190}return}
  const C=CH();
  if(p.enter>0){p.enter--;p.x+=(84-p.x)*.1;T.dx=T.dy=0}
  else if(!G.dialog&&!G.autoExit){
    let dx=(I.h.right?1:0)-(I.h.left?1:0),dy=(I.h.down?1:0)-(I.h.up?1:0);
    if(dx&&dy){dx*=.7071;dy*=.7071}
    let v=I.h.focus?C.speed*.5:C.speed;if(C.spdMod)v*=C.spdMod(p);
    p.x+=dx*v;p.y+=dy*v;const tg=dockOn?1.25:1.7;p.x+=T.dx*tg;p.y+=T.dy*tg;T.dx=T.dy=0;p.bank=lerp(p.bank,dy,.2);
    p.x=clamp(p.x,16,W-22);p.y=clamp(p.y,30,H-14);
  }
  if(G.autoExit){p.x+=(p.x-40)*.06+1;p.bank=0;return}
  if(G.dialog)return;
  // 홀드 고유기술
  const want=I.h.skill&&p.enter<=0;
  let on=want&&p.gauge>0&&!p.gLock&&!(!p.skillOn&&p.gauge<8);
  if(p.gauge<=0&&want)p.gLock=true;if(!want)p.gLock=false;
  const was=p.skillOn;p.skillOn=on;p.noFire=false;p.phase=false;
  C.skill(p,on,on&&!was,!on&&was);
  p.gauge=clamp(p.gauge,0,100);
  if(!on)p.gauge=Math.min(100,p.gauge+.085);
  // 샷
  if(p.cd>0)p.cd--;
  if((I.h.shot||autoOn())&&p.cd<=0&&!p.noFire&&p.enter<=0){C.fire(p)}
  // 필살기
  if(p.bombT>0){p.bombT--;C.bombU(p,p.bombD-p.bombT);if(p.bombT===0){p.inv=Math.max(p.inv,50);if(C.bombEnd)C.bombEnd(p)}}
  else if(I.p.bomb&&p.bombs>0&&p.enter<=0)useBomb();
  // 적 몸통 충돌
  if(p.inv<=0&&p.bombT<=0&&!p.phase){for(const e of EN){if(e.dead||e.ground&&false)continue;if(e.isBoss&&!e.active)continue;if(hitE(e,p.x,p.y,1)){killPlayer();break}}}
}
// 판정점: 원형인 적 탄과 겹치지 않도록 마름모 + 십자 조준선으로 그린다
function drawHitMark(p){
  const x=Math.round(p.x),y=Math.round(p.y),gap=6+Math.floor(Math.abs(Math.sin(p.t*.09))*2),len=5;
  const arms=(c,o)=>{g.fillStyle=c;g.fillRect(x-gap-len-o,y-1-o,len+o*2,2+o*2);g.fillRect(x+gap-o,y-1-o,len+o*2,2+o*2);g.fillRect(x-1-o,y-gap-len-o,2+o*2,len+o*2);g.fillRect(x-1-o,y+gap-o,2+o*2,len+o*2)};
  arms('#07050f',1);arms('#7dffd4',0);
  const dia=(c,r)=>{g.fillStyle=c;g.beginPath();g.moveTo(x,y-r);g.lineTo(x+r,y);g.lineTo(x,y+r);g.lineTo(x-r,y);g.closePath();g.fill()};
  dia('#07050f',6);dia('#7dffd4',4.6);dia('#ffffff',2.8);
}
function drawPlayer(){
  const p=P;if(!p||p.dead)return;const C=CH();
  const f=SP.hero[C.id][Math.floor(p.t/5)%4];
  if(C.drawBack)C.drawBack(p);
  const blink=p.inv>0&&p.bombT<=0&&Math.floor(p.t/3)%2;
  if(!blink)dr(f,p.x,p.y,p.bank*.14,1,p.phase?.42:1);
  if(C.drawFront)C.drawFront(p);
  if(p.phase){g.globalCompositeOperation='lighter';dr(f,p.x+rnd(-1.5,1.5),p.y,0,1,.35);g.globalCompositeOperation='source-over'}
  if(I.h.focus||OPT.hitbox)drawHitMark(p);
}
// ── 샷 갱신 ───────────────────────────────────────────────
function updateShots(){
  for(let i=PS.length-1;i>=0;i--){
    const s=PS[i];s.t++;if(s.upd)s.upd(s);
    s.x+=s.vx;s.y+=s.vy;
    let gone=s.t>s.life||s.x>W+24||s.x<-24||s.y<-24||s.y>H+24;
    if(!gone){
      for(const e of EN){
        if(e.dead||(s.hit&&s.hit.has(e)))continue;
        if(!onS(e)||(e.isBoss&&(!e.active)))continue;
        if(hitE(e,s.x,s.y,s.r)){
          if(e.isBoss&&e.trans>0){if(!s.pierce){gone=true;break}continue}
          hurt(e,s.dmg);if(s.onHit)s.onHit(s,e);
          if(s.pierce){(s.hit=s.hit||new Set()).add(e)}
          else{gone=true;spark1(s.x,s.y,s.hc||'#fff');sfx('hit');break}
        }
      }
    }
    if(gone){PS[i]=PS[PS.length-1];PS.pop()}
  }
}
function drawShots(){
  g.globalCompositeOperation='lighter';
  for(const s of PS){if(s.s&&!s.solid)dr(s.s,s.x,s.y,s.rot||0,s.sc||1)}
  g.globalCompositeOperation='source-over';
  for(const s of PS){if(s.s&&s.solid)dr(s.s,s.x,s.y,s.rot||0,s.sc||1)}
}
