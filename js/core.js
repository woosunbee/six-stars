'use strict';
// ── 기본 상수·수학 ─────────────────────────────────────────
const W=640,H=360,TAU=Math.PI*2,PI=Math.PI;
const rnd=(a=1,b)=>b===undefined?Math.random()*a:a+Math.random()*(b-a);
const rint=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const hyp=Math.hypot;
const ang=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
const wrapA=a=>{while(a>PI)a-=TAU;while(a<-PI)a+=TAU;return a};

const gc=document.getElementById('g'),g=gc.getContext('2d');
const uc=document.getElementById('u'),u=uc.getContext('2d');
const cab=document.getElementById('cab');
const TOUCHDEV=!!(window.matchMedia&&matchMedia('(hover: none) and (pointer: coarse)').matches);
let dockOn=false,sideOn=false;
g.imageSmoothingEnabled=false;
let US=1;
function resize(){
  // 터치 기기를 세로로 들면 게임을 위에, 조작부를 아래에 둔다
  dockOn=I.touch&&innerHeight>innerWidth*1.05;
  document.body.classList.toggle('dock',dockOn);
  const wr=document.getElementById('wrap').getBoundingClientRect();
  const s=Math.max(.3,Math.min(wr.width/W,(dockOn?wr.height*.62:wr.height)/H));
  const cw=Math.floor(W*s),ch=Math.floor(H*s),dpr=Math.min(window.devicePixelRatio||1,2);
  cab.style.width=cw+'px';cab.style.height=ch+'px';
  gc.style.width=uc.style.width=cw+'px';gc.style.height=uc.style.height=ch+'px';
  layoutSides();
  uc.width=Math.floor(cw*dpr);uc.height=Math.floor(ch*dpr);US=uc.width/W;
}
// 터치 가로 화면에서 게임 좌우에 남는 여백을 조작 영역으로 쓴다
function layoutSides(){
  const r=cab.getBoundingClientRect(),lw=Math.floor(r.left),rw=Math.floor(innerWidth-r.right);
  sideOn=I.touch&&!dockOn&&Math.min(lw,rw)>=14;
  const L=document.getElementById('sideL'),R=document.getElementById('sideR');
  L.hidden=R.hidden=!sideOn;
  if(sideOn){L.style.width=lw+'px';R.style.width=rw+'px'}
}
addEventListener('resize',resize);addEventListener('orientationchange',()=>setTimeout(resize,220));

// ── 저장 옵션 ──────────────────────────────────────────────
const store={
  get(k,d){try{const v=localStorage.getItem('sixstar.'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem('sixstar.'+k,JSON.stringify(v))}catch(e){}}
};
const OPT=Object.assign({diff:1,extraLives:0,autofire:false,autofireT:true,hitbox:true,shake:true,autobomb:false,bgm:6,sfx:7},store.get('opt',{}));
const saveOpt=()=>store.set('opt',OPT);
const AFK=()=>I.touch?'autofireT':'autofire'; // 터치 환경은 상시 연사가 기본
const autoOn=()=>OPT[AFK()];

// ── 입력 (키보드/게임패드/터치/마우스) ────────────────────
const KEYMAP={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',
  KeyZ:'shot',KeyJ:'shot',KeyX:'skill',KeyK:'skill',KeyC:'bomb',KeyL:'bomb',Space:'bomb',ShiftLeft:'focus',ShiftRight:'focus',
  Escape:'pause',KeyP:'pause',Enter:'ok'};
const I={k:{},h:{},p:{},touch:TOUCHDEV};
const ACTS=['up','down','left','right','shot','skill','bomb','focus','pause','ok'];
addEventListener('keydown',e=>{
  audioInit();
  const a=KEYMAP[e.code];
  if(a){I.k[a]=true;e.preventDefault()}
  if(e.code==='KeyF'&&!e.repeat)toggleFS();
  if(e.code==='KeyM'&&!e.repeat){OPT.bgm=OPT.bgm?0:6;saveOpt();applyVol()}
});
addEventListener('keyup',e=>{const a=KEYMAP[e.code];if(a){I.k[a]=false;
  // 같은 동작에 키가 여러 개여도 눌린 키가 남아 있으면 유지
  for(const c in KEYMAP)if(KEYMAP[c]===a&&keysDown[c]&&c!==e.code)I.k[a]=true}});
const keysDown={};
addEventListener('keydown',e=>keysDown[e.code]=true);
addEventListener('keyup',e=>keysDown[e.code]=false);
addEventListener('blur',()=>{for(const a of ACTS)I.k[a]=false;for(const c in keysDown)keysDown[c]=false;if(typeof onBlurPause==='function')onBlurPause()});
function toggleFS(){
  try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})}catch(e){}
}
const T={mv:null,skill:null,bomb:null,shot:null,dx:0,dy:0,lx:0,ly:0};
function toL(e){const r=uc.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H}}
const inR=(p,r)=>p.x>=r[0]&&p.x<=r[0]+r[2]&&p.y>=r[1]&&p.y<=r[1]+r[3];
const BTN_SKILL=[496,272,72,72],BTN_BOMB=[566,196,68,68],BTN_SHOT=[418,286,58,58],BTN_PAUSE=[590,28,44,28];
let UIH=[],MOUSE={x:-1,y:-1};
uc.addEventListener('pointerdown',e=>{
  audioInit();uc.focus({preventScroll:true});
  const p=toL(e);
  if(e.pointerType==='touch'&&!I.touch){I.touch=true;resize()}
  const playing=typeof G!=='undefined'&&G.state==='play'&&!G.dialog;
  if(playing&&I.touch){
    if(!dockOn){
      if(inR(p,BTN_PAUSE)){pauseGame();return}
      if(inR(p,BTN_SKILL)){T.skill=e.pointerId;return}
      if(inR(p,BTN_BOMB)){T.bomb=e.pointerId;return}
      if(!autoOn()&&inR(p,BTN_SHOT)){T.shot=e.pointerId;return}
    }
    T.mv=e.pointerId;T.lx=p.x;T.ly=p.y;return;
  }
  if(typeof G!=='undefined'&&G.state==='play'&&G.dialog){I.k.ok=true;setTimeout(()=>I.k.ok=false,60);return}
  for(let i=UIH.length-1;i>=0;i--){const h=UIH[i];if(inR(p,h.r)){h.fn();return}}
});
addEventListener('pointermove',e=>{
  const p=toL(e);MOUSE=p;
  if(e.pointerId===T.mv){T.dx+=p.x-T.lx;T.dy+=p.y-T.ly;T.lx=p.x;T.ly=p.y}
});
const ptrUp=e=>{audioInit();for(const k of['mv','skill','bomb','shot'])if(e.pointerId===T[k])T[k]=null};
addEventListener('pointerup',ptrUp);addEventListener('pointercancel',ptrUp);
// 세로 화면 조작부
const $=id=>document.getElementById(id);
function bindDock(id,k){$(id).addEventListener('pointerdown',e=>{e.preventDefault();audioInit();T[k]=e.pointerId})}
bindDock('bSkill','skill');bindDock('bBomb','bomb');bindDock('bShot','shot');
bindDock('sSkill','skill');bindDock('sBomb','bomb');bindDock('sShot','shot');
for(const id of['pad','sideL'])$(id).addEventListener('pointerdown',e=>{e.preventDefault();audioInit();const p=toL(e);T.mv=e.pointerId;T.lx=p.x;T.ly=p.y});
$('bPause').addEventListener('pointerdown',e=>{e.preventDefault();audioInit();if(G.state==='play')pauseGame();else if(G.state==='pause')resume()});
uc.addEventListener('contextmenu',e=>e.preventDefault());
const prevH={};
function pollInput(){
  const c={};for(const a of ACTS)c[a]=!!I.k[a];
  let pads=[];try{pads=navigator.getGamepads?navigator.getGamepads():[]}catch(e){}
  for(const p of pads){if(!p)continue;
    const b=i=>p.buttons[i]&&p.buttons[i].pressed;
    if(p.axes[0]<-.35||b(14))c.left=true;if(p.axes[0]>.35||b(15))c.right=true;
    if(p.axes[1]<-.35||b(12))c.up=true;if(p.axes[1]>.35||b(13))c.down=true;
    if(b(0))c.shot=true;if(b(2))c.skill=true;if(b(1)||b(3))c.bomb=true;if(b(4)||b(5))c.focus=true;if(b(9))c.pause=true;
  }
  if(T.skill!==null)c.skill=true;if(T.bomb!==null)c.bomb=true;if(T.shot!==null)c.shot=true;
  for(const a of ACTS){I.p[a]=c[a]&&!prevH[a];I.h[a]=c[a];prevH[a]=c[a]}
}
const mOK=()=>I.p.ok||I.p.shot||I.p.bomb;
const mBack=()=>I.p.skill||I.p.pause;

// ── 사운드: 효과음 합성 + 칩튠 시퀀서 ──────────────────────
const A={ctx:null,m:null,bg:null,fx:null,nb:null,track:null,step:0,next:0,last:{}};
function audioInit(){
  if(A.ctx){if(A.ctx.state==='suspended'&&!(typeof G!=='undefined'&&G.state==='pause'))A.ctx.resume();return}
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  try{A.ctx=new C()}catch(e){return}
  const c=A.ctx;A.m=c.createDynamicsCompressor();A.m.connect(c.destination);
  A.bg=c.createGain();A.fx=c.createGain();A.bg.connect(A.m);A.fx.connect(A.m);
  const b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;A.nb=b;
  applyVol();
}
function applyVol(){if(!A.ctx)return;A.bg.gain.value=OPT.bgm/10*.5;A.fx.gain.value=OPT.sfx/10*.55}
function tone(type,f,fe,dur,v,when,dest){
  const c=A.ctx;if(!c)return;const t=when||c.currentTime,o=c.createOscillator(),a=c.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);if(fe&&fe!==f)o.frequency.exponentialRampToValueAtTime(Math.max(20,fe),t+dur);
  a.gain.setValueAtTime(v,t);a.gain.exponentialRampToValueAtTime(.0008,t+dur);
  o.connect(a);a.connect(dest||A.fx);o.start(t);o.stop(t+dur+.01);
}
function noise(dur,v,fq,when,dest,type='lowpass'){
  const c=A.ctx;if(!c)return;const t=when||c.currentTime,s=c.createBufferSource(),a=c.createGain(),f=c.createBiquadFilter();
  s.buffer=A.nb;s.loop=true;f.type=type;f.frequency.value=fq;
  a.gain.setValueAtTime(v,t);a.gain.exponentialRampToValueAtTime(.0008,t+dur);
  s.connect(f);f.connect(a);a.connect(dest||A.fx);s.start(t,Math.random()*.8);s.stop(t+dur+.01);
}
const SFX={
  shot(){tone('square',880,500,.05,.05)},
  bolt(){noise(.06,.08,5200,0,0,'highpass');tone('sawtooth',1500,300,.05,.04)},
  tal(){tone('triangle',1200,1700,.06,.07)},
  hex(){tone('sine',500,1100,.08,.08)},
  pulse(){tone('sawtooth',1900,1300,.04,.04)},
  photon(){tone('square',1400,700,.05,.045)},
  hit(){tone('square',300,200,.03,.03)},
  kill(){noise(.16,.22,1800);tone('square',220,60,.14,.1)},
  big(){noise(.6,.5,900);tone('sawtooth',130,28,.55,.28)},
  item(){tone('square',1100,1760,.07,.08)},
  coin(){tone('square',1760,2300,.04,.05)},
  power(){[660,880,1320].forEach((f,i)=>tone('square',f,f,.08,.09,A.ctx.currentTime+i*.06))},
  ext(){[523,659,784,1047,1319].forEach((f,i)=>tone('square',f,f,.12,.1,A.ctx.currentTime+i*.08))},
  die(){noise(.9,.5,700);tone('sawtooth',500,30,.8,.26)},
  bomb(){noise(1.2,.55,500);tone('sawtooth',90,30,1.1,.34);tone('square',440,1800,.5,.12)},
  lock(){tone('square',1500,1500,.04,.07)},
  rocket(){noise(.28,.22,2400);tone('sawtooth',300,900,.22,.08)},
  hammer(){noise(.18,.3,2800);tone('sawtooth',180,520,.16,.12)},
  thunder(){noise(.55,.6,3400);tone('square',70,30,.4,.25)},
  absorb(){tone('sine',600,1200,.05,.07)},
  blast(){noise(.5,.4,2600);tone('sawtooth',900,120,.42,.2)},
  warn(){[0,.32,.64].forEach(d=>tone('square',520,420,.26,.12,A.ctx.currentTime+d))},
  laser(){tone('sawtooth',200,1200,.5,.13)},
  graze(){tone('sine',2400,2100,.03,.03)},
  sel(){tone('square',760,760,.04,.07)},
  ok(){tone('square',880,1320,.12,.1)},
  phase(){tone('sine',240,720,.18,.09)},
  time(){tone('triangle',1600,200,.5,.14)}
};
function sfx(n){if(!A.ctx||!OPT.sfx)return;const now=performance.now();if(A.last[n]&&now-A.last[n]<45)return;A.last[n]=now;try{SFX[n]()}catch(e){}}

const SC={p5:[0,3,5,7,10],ko:[0,2,5,7,9],min:[0,2,3,5,7,8,10],ins:[0,1,5,7,8],hij:[0,1,4,5,7,8,11]};
const TRACKS={
 title:{bpm:92,key:45,sc:SC.ko,wave:'triangle',ch:[0,-2,3,0, 5,3,-2,0],
  mel:['5---6-8-7---5-3-','5---3-2-0-------','7---8-a-8---7-5-','6-5-3-5---------','a---8-7-8---a-c-','a-8-7-5-6-------','5-6-8-a-c---a-8-','7-------5-------'],
  drum:'k.......s.......',bass:'x.......x...x...',arp:0},
 s1:{bpm:148,key:50,sc:SC.p5,wave:'square',ch:[0,-2,0,-4,3,5,-2,0],
  mel:['5.7.8.7-5.3.5...','3.5.7.5-3.2.0...','5.8.a.8-7.5.7...','8.7.5.3-5---....','a.a.8.a-c.a.8...','7.8.a.8-7.5.3...','5.7.8.a-8.7.5.3.','5---7---5-------'],
  drum:'k..h.s..k.h.s.h.',bass:'x..x..x.x..x..x.',arp:1},
 s2:{bpm:126,key:52,sc:SC.ko,wave:'triangle',ch:[0,5,-3,2,0,5,7,0],
  mel:['7-8-a---c-a-8---','7-5-3---5-------','8-a-c---d-c-a---','8-7-5---7-------','a---c-a-8---7-5-','8---a-8-7---5-3-','5-7-8-a-c-a-8-7-','5---------------'],
  drum:'k...h...s...h.h.',bass:'x...x.x.x...x...',arp:2},
 s3:{bpm:164,key:48,sc:SC.min,wave:'sawtooth',ch:[0,8,3,10,0,8,5,7],
  mel:['7.7.9.a-9.7.6.7.','4.4.5.7-5.4.2.4.','7.a.c.a-9.7.9.a.','9.7.6.4-7---....','e.e.c.a-c.e.c.a.','9.9.a.c-a.9.7.9.','a.c.e.c-a.9.7.9.','a---7---a-------'],
  drum:'k.h.s.h.k.k.s.hh',bass:'x.xxx.xxx.xxx.xx',arp:1},
 s4:{bpm:172,key:45,sc:SC.p5,wave:'square',ch:[0,0,-4,-4,3,3,-2,-2],
  mel:['5...7...8.7.5...','a...8...7.5.3...','5...7...8.a.c...','a.8.7.8.a---....','c.a.c.d.c.a.8.a.','8.7.8.a.8.7.5.7.','5.7.8.a.c.d.c.a.','c-------a-------'],
  drum:'k.hhs.hhk.hhs.hk',bass:'x.x.x.x.x.x.x.xx',arp:3},
 s5:{bpm:178,key:43,sc:SC.ins,wave:'sawtooth',ch:[0,1,0,-4,0,1,5,-1],
  mel:['5.6.8.6-5.3.5...','8.9.a.9-8.6.5...','5.6.8.a-9.8.6.8.','5-------3---....','a.b.a.8-9.a.b.c.','b.a.9.8-a.9.8.6.','5.8.a.c-b.a.8.6.','5-------0-------'],
  drum:'k.hsk.hsk.hsk.ss',bass:'xxx.xxx.xxx.xxx.',arp:3},
 boss:{bpm:182,key:45,sc:SC.min,wave:'square',ch:[0,1,-2,1,0,1,3,-2],
  mel:['7.8.a.8.7.6.4.6.','7.7.8.a-c.a.8.7.','e.d.c.a.c.a.8.7.','8.a.c.a-8---....','7.a.c.e.d.c.a.8.','a.8.7.6.7.a.c.a.','e.e.d.c.d.d.c.a.','c---a---7-------'],
  drum:'k.hsk.hsk.hsk.ss',bass:'x.xxx.xxx.xxx.xx',arp:1},
 last:{bpm:196,key:41,sc:SC.hij,wave:'sawtooth',ch:[0,1,0,4,0,1,5,-1],
  mel:['7.8.b.8.7.4.2.4.','7.8.b.c-b.8.7.4.','e.c.b.8.b.c.e.g.','e.c.b.8-7---....','7.b.e.b.7.b.e.g.','g.e.c.b.c.e.c.b.','a.b.c.e.g.e.c.b.','c---b---7-------'],
  drum:'kshskshskshskshs',bass:'xxxxxxxxxxxxxxxx',arp:3}
};
function midi(n){return 440*Math.pow(2,(n-69)/12)}
const melN=(t,ch)=>{const i=parseInt(ch,36);if(isNaN(i))return null;const L=t.sc.length;return t.key+12+t.sc[i%L]+12*Math.floor(i/L)};
function playBGM(n){if(A.track===n)return;A.track=n;A.step=0;if(A.ctx)A.next=A.ctx.currentTime+.08;}
function schedule(){
  if(!A.ctx||!A.track||A.ctx.state!=='running'||!OPT.bgm)return;
  const t=TRACKS[A.track];if(!t)return;
  const dt=60/t.bpm/4,c=A.ctx;
  if(A.next<c.currentTime)A.next=c.currentTime+.04;
  while(A.next<c.currentTime+.14){stepBGM(t,A.step,A.next,dt);A.next+=dt;A.step++}
}
function stepBGM(t,s,when,dt){
  const bar=Math.floor(s/16),st=s%16,chord=t.ch[bar%t.ch.length],line=t.mel[bar%t.mel.length],ch=line[st];
  if(ch&&ch!=='.'&&ch!=='-'){
    let len=1;while(line[st+len]==='-')len++;
    const n=melN(t,ch);
    if(n!==null){const d=len*dt*.96;tone(t.wave,midi(n),midi(n),d,t.wave==='triangle'?.2:.085,when,A.bg);
      tone('sine',midi(n+12),midi(n+12),d*.7,.04,when,A.bg)}
  }
  if(t.bass[st]==='x'){const n=t.key-12+chord;tone('triangle',midi(n),midi(n),dt*1.7,.24,when,A.bg)}
  if(t.arp){
    const pat=t.arp===2?[0,7,12,7]:t.arp===3?[0,12,7,15]:[0,7,12,15];
    if(t.arp!==2||st%2===0){const n=t.key+chord+pat[st%4];tone('square',midi(n),midi(n),dt*.75,.028,when,A.bg)}
  }
  const dr=t.drum[st];
  if(dr==='k'){tone('sine',150,42,.11,.34,when,A.bg)}
  else if(dr==='s'){noise(.11,.17,2600,when,A.bg);tone('triangle',210,120,.07,.1,when,A.bg)}
  else if(dr==='h'){noise(.035,.055,8000,when,A.bg,'highpass')}
}
setInterval(schedule,28);
resize();
