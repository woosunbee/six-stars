'use strict';
// ── 보스 공통 ─────────────────────────────────────────────
function spawnBoss(key,opt={}){
  const d=BOSS[key],phases=opt.only!==undefined?[d.phases[opt.only]]:d.phases,hpm=opt.hpm||1;
  const b={isBoss:true,key,def:d,x:W+200,y:d.ay,ay:d.ay,t:0,ph:0,pt:0,phases,hpm,hp:phases[0].hp*D.hp*hpm,maxhp:phases[0].hp*D.hp*hpm,timer:phases[0].time,
    trans:0,active:false,flash:0,hex:0,hexT:0,inv:0,hits:[],big:true,r:40,ghost:opt.ghost,mid:d.mid,name:(opt.ghost?'잔영 · ':'')+d.name,dying:0,s:[]};
  if(d.init)d.init(b);if(d.move)d.move(b);b.hits=d.hits(b);EN.push(b);G.boss=b;return b;
}
function updateBoss(b){
  const d=b.def;
  if(b.dying>0){b.dying--;b.y+=.35;if(d.move)d.move(b,true);b.hits=d.hits(b);
    if(b.dying%5===0){const h=pick(b.hits);boom(h.x+rnd(-h.r,h.r),h.y+rnd(-h.r,h.r),1.6);sfx('kill');G.shake=Math.max(G.shake,5)}
    if(b.dying===0)finishBoss(b);return}
  if(!b.active){b.x+=(d.ax-b.x)*.045;if(d.move)d.move(b);b.hits=d.hits(b);if(Math.abs(b.x-d.ax)<4){b.active=true;b.pt=0}return}
  if(d.move)d.move(b);b.hits=d.hits(b);
  if(b.trans>0){b.trans--;return}
  b.pt++;b.timer--;
  if(G.noFire<=0)b.phases[b.ph].fn(b,b.pt);
  if(b.timer<=0)bossBreak(b,true);
}
function bossBreak(b,timeout){
  if(b.dying>0)return;
  cancelBullets(!timeout);LZ.length=0;G.flash=5;G.flashC='#fff';G.shake=Math.max(G.shake,10);sfx('big');
  if(!timeout){addScore(b.mid?12000:30000);gain(30)}
  const h=b.hits[0];if(h){boom(h.x,h.y,3);ringFx(h.x,h.y,190,'#ffe6a0',28,3)}
  b.ph++;
  if(b.ph>=b.phases.length){b.dying=b.mid?44:120;b.active=false;EN.forEach(e=>{if(e.parent===b&&!e.dead)killE(e)});return}
  const q=b.phases[b.ph];b.hp=b.maxhp=q.hp*D.hp*b.hpm;b.timer=q.time;b.trans=64;b.pt=0;
  if(b.def.onPhase)b.def.onPhase(b);
}
function finishBoss(b){
  b.dead=true;b.noReward=true;G.boss=null;G.shake=20;G.flash=14;G.flashC='#fff';sfx('big');
  const h=b.hits[0]||b;for(let i=0;i<6;i++)boom(h.x+rnd(-80,80),h.y+rnd(-60,60),3.4);
  if(!b.ghost){dropItem(h.x,h.y-20,'p');if(!b.mid){dropItem(h.x-20,h.y+20,'b')}}
  for(let i=0;i<(b.mid?16:40);i++)IT.push(Object.assign(mkItem(h.x+rnd(-90,90),h.y+rnd(-70,70),'coin'),{magnet:true}));
  addScore(b.mid?30000:120000);
}
const BOSS={};
const part=(b,fl,s,x,y,rot,sc)=>{const al=b.ghost?.62:1;dr(s,x,y,rot,sc,al);if(fl)dr(s,x,y,rot,sc,.5,true)};

// ── 중간 보스 ─────────────────────────────────────────────
BOSS.m1={name:'대비차 「귀수호」',mid:true,ax:490,ay:130,
 move(b){b.y=b.ay+Math.sin(b.t*.025)*44},hits:b=>[{x:b.x,y:b.y+6,r:40},{x:b.x-48,y:b.y+6,r:18},{x:b.x+48,y:b.y+6,r:18}],
 draw(b,fl){part(b,fl,SP.m1,b.x,b.y)},
 phases:[{name:'화포 일제',hp:340,time:1800,fn(b,t){
  if(every(t,60))for(let i=0;i<5;i++)bul(b.x-44+i*22,b.y+14,aimA({x:b.x-44+i*22,y:b.y+14})+(i-2)*.08,vS(2.6),'orb','orange');
  if(every(t,110))ring(b.x-64,b.y+6,vS(2),rS(14),t*.1,'dot','yellow')}}]};
BOSS.m2={name:'설귀 대장 「한백」',mid:true,ax:500,ay:170,
 move(b){b.y=b.ay+Math.sin(b.t*.02)*60},hits:b=>[{x:b.x,y:b.y,r:50}],draw(b,fl){part(b,fl,SP.m2,b.x,b.y,Math.sin(b.t*.03)*.05)},
 phases:[{name:'한파의 숨결',hp:420,time:1800,fn(b,t){
  if(t%4===0&&t%150<80)bul(b.x-28,b.y+28,PI+Math.sin(t*.06)*.9,vS(2.8),'needle','cyan');
  if(every(t,75))ring(b.x-20,b.y-10,vS(1.7),rS(14),t*.1,'orb','blue')}}]};
BOSS.m3={name:'성문 수호거상',mid:true,ax:500,ay:180,
 move(b){b.y=b.ay+Math.sin(b.t*.02)*30},hits:b=>[{x:b.x,y:b.y+4,r:30},{x:b.x,y:b.y-42,r:20},{x:b.x-40,y:b.y+36,r:14},{x:b.x+40,y:b.y+36,r:14}],draw(b,fl){part(b,fl,SP.m3,b.x,b.y)},
 phases:[{name:'노심 개방',hp:560,time:2000,fn(b,t){
  if(every(t,10))for(let i=0;i<2;i++)bul(b.x,b.y+3,t*.06+i*PI,vS(2.2),'rice','orange');
  if(every(t,70))for(const s of[-1,1])fan(b.x+s*40,b.y+36,aimA({x:b.x+s*40,y:b.y+36}),vS(2.8),nS(3),.18,'orb','red')}}]};
BOSS.m4={name:'강습 포드 「카론」',mid:true,ax:490,ay:180,
 move(b){b.y=b.ay+Math.sin(b.t*.03)*90},hits:b=>[{x:b.x,y:b.y,r:40},{x:b.x-44,y:b.y,r:20}],draw(b,fl){part(b,fl,SP.m4,b.x,b.y)},
 phases:[{name:'요격 프로토콜',hp:640,time:2000,fn(b,t){
  if(every(t,110))laser(b.x-60,b.y,aimA({x:b.x-60,y:b.y}),{w:10,warn:42,dur:32,c:'#26e0ff'});
  if(every(t,16))bul(b.x-44,b.y,PI+Math.sin(t*.05)*1.1,vS(3),'needle','cyan');
  if(every(t,90))ring(b.x,b.y,vS(1.8),rS(16),t*.03,'dot','red')}}]};

// ── 1막: 철갑 귀선 ────────────────────────────────────────
const b1Ports=b=>[0,1,2,3,4].map(i=>({x:b.x-78+i*40,y:b.y+18}));
const b1Head=b=>({x:b.x-146+Math.sin(b.t*.05)*3,y:b.y-12+Math.cos(b.t*.04)*3});
BOSS.turtle={name:'철갑 귀선 「흑룡호」',ax:462,ay:165,bgm:'boss',
 move(b){b.y=b.ay+Math.sin(b.t*.02)*26},
 hits:b=>{const h=b1Head(b);return[{x:b.x,y:b.y,r:58},{x:b.x-78,y:b.y+10,r:42},{x:b.x+78,y:b.y+10,r:42},{x:h.x,y:h.y,r:24}]},
 draw(b,fl){part(b,fl,SP.b1hull,b.x,b.y);const h=b1Head(b);part(b,fl,SP.b1head,h.x,h.y,Math.sin(b.t*.04)*.12)},
 phases:[
 {name:'포문 일제',hp:520,time:1900,fn(b,t){const pp=b1Ports(b);
  if(every(t,34)){const p=pp[Math.floor(t/20)%5];fan(p.x,p.y,aimA(p),vS(2.8),nS(3),.26,'orb','orange')}
  if(every(t,130)){const h=b1Head(b);ring(h.x,h.y,vS(1.9),rS(18),t*.1,'dot','cyan')}}},
 {name:'용두 화염',hp:640,time:2000,fn(b,t){const h=b1Head(b);
  if(t%3===0&&t%170<110)bul(h.x-18,h.y+6,PI+Math.sin(t*.035)*.95+rnd(-.05,.05),vS(3.2),'rice','orange');
  if(every(t,62))fan(h.x-18,h.y,aimA(h),vS(2.5),nS(5),.2,'orb','red')}},
 {name:'철침 호우',hp:720,time:2200,fn(b,t){
  if(every(t,7)){const x=b.x+rnd(-90,90);bul(x,b.y-30,-PI/2+rnd(-.75,-.1)*(x>b.x?1:1),vS(rnd(3,4.4)),'needle','white',{ay:.05*D.spd})}
  if(every(t,50)){const pp=b1Ports(b);for(const p of pp)bul(p.x,p.y,aimA(p),vS(2.4),'orb','pink')}
  if(every(t,140)){const h=b1Head(b);ring(h.x,h.y,vS(2.2),rS(22),t*.05,'orb','orange')}}}
 ]};
// ── 2막: 구미호 ───────────────────────────────────────────
BOSS.fox={name:'천년 구미호 「월화」',ax:480,ay:165,bgm:'boss',
 init(b){b.tips=[];b.orbs=5;b.cl=0;b.clones=[]},
 move(b){const yy=b.ay+Math.sin(b.t*.018)*(b.ghost?30:40);b.y=yy;b.tails=[];b.tips=[];
  for(let i=0;i<9;i++){const base=-1.75+i*3.5/8;let x=b.x+26,y=b.y+6,a=base;const pts=[];for(let j=0;j<6;j++){a+=Math.sin(b.t*.045+i*.8+j*.55)*.13;x+=Math.cos(a)*18;y+=Math.sin(a)*18;pts.push({x,y,a})}b.tails.push(pts);b.tips.push(pts[5])}},
 hits:b=>[{x:b.x,y:b.y+4,r:50},{x:b.x,y:b.y-42,r:30}],
 draw(b,fl){
  const dt=(ox,oy,al)=>{for(const tl of b.tails){for(let j=0;j<5;j++){const q=tl[j];dr(SP.b2tail,q.x+ox,q.y+oy,q.a,1,al)}const q=tl[5];dr(SP.b2tip,q.x+ox,q.y+oy,q.a,1,al)}dr(SP.b2body,b.x+ox,b.y+oy,0,1,al)};
  for(const c of b.clones)dt(c.x-b.x,c.y-b.y,.45);
  dt(0,0,b.ghost?.62:1);
  if(fl)part(b,fl,SP.b2body,b.x,b.y);
  if(b.ph===0&&!b.ghost&&b.active||(b.ghost&&false)){for(let i=0;i<5;i++){const a=b.t*.03+i/5*TAU;dr(SP.b2orb,b.x-20+Math.cos(a)*88,b.y+Math.sin(a)*72)}}
 },
 onPhase(b){b.clones=[]},
 phases:[
 {name:'여우구슬',hp:640,time:2000,fn(b,t){
  if(every(t,16)){const i=Math.floor(t/16)%5,a=b.t*.03+i/5*TAU,x=b.x-20+Math.cos(a)*88,y=b.y+Math.sin(a)*72;bul(x,y,aimA({x,y}),vS(2.6),'orb','cyan')}
  if(every(t,110))ring(b.x-10,b.y-40,vS(1.8),rS(22),t*.04,'petal','pink')}},
 {name:'구미난무',hp:760,time:2100,fn(b,t){
  if(every(t,6)){const i=Math.floor(t/6)%9,q=b.tips[i];if(q)bul(q.x,q.y,PI+Math.sin(t*.04+i*.7)*1.25,vS(2.5),'rice','pink')}
  if(every(t,90))fan(b.x-34,b.y-40,aimA({x:b.x-34,y:b.y-40}),vS(3),nS(5),.18,'star','yellow')}},
 {name:'환영술',hp:860,time:2300,fn(b,t){
  if(t%200===1){const ys=[80,180,280],real=rint(0,2);b.clones=ys.filter((_,i)=>i!==real).map(y=>({x:d2x(),y}));b.ay=ys[real];sfx('phase');ringFx(b.x,b.y,120,'#ff6b8a',24,3)}
  if(every(t,46)){for(const c of b.clones)ring(c.x-20,c.y,vS(1.6),rS(12),t*.07,'petal','violet');ring(b.x-20,b.y,vS(2),rS(18),t*.11,'petal','pink')}
  if(every(t,24))bul(b.x-20,b.y-30,aimA({x:b.x-20,y:b.y-30}),vS(3.3),'needle','yellow')}}
 ]};
const d2x=()=>BOSS.fox.ax;
// ── 3막: 쌍두룡 ───────────────────────────────────────────
const neck=(b,hd,ry)=>{const pts=[];const x0=b.x-50,y0=b.y+ry,cx=lerp(x0,hd.x,.5)+18,cy=lerp(y0,hd.y,.5)-ry*.1+Math.sin(b.t*.04)*16;for(let i=1;i<=8;i++){const t=i/9,u=1-t;pts.push({x:u*u*x0+2*u*t*cx+t*t*hd.x,y:u*u*y0+2*u*t*cy+t*t*hd.y})}return pts};
BOSS.dragon={name:'쌍두룡 「바르노그」',ax:488,ay:178,bgm:'boss',
 move(b){b.y=b.ay+Math.sin(b.t*.018)*16;const t=b.t;b.hR={x:b.x-150+Math.sin(t*.031)*18,y:b.y-92+Math.cos(t*.025)*16};b.hB={x:b.x-142+Math.sin(t*.027+2)*18,y:b.y+84+Math.cos(t*.03+1)*16}},
 hits:b=>[{x:b.x,y:b.y,r:52},{x:b.hR.x,y:b.hR.y,r:24},{x:b.hB.x,y:b.hB.y,r:24}],
 draw(b,fl){
  const w=Math.sin(b.t*.08)*.32;
  dr(SP.b3wing,b.x+16,b.y-30,-.22+w,1,b.ghost?.62:1);
  neck(b,b.hR,-24).reverse().forEach(p=>part(b,fl,SP.b3neckR,p.x,p.y));
  neck(b,b.hB,24).reverse().forEach(p=>part(b,fl,SP.b3neckB,p.x,p.y));
  part(b,fl,SP.b3body,b.x,b.y);
  dr(SP.b3wing,b.x+36,b.y-14,.22+w*.8,1,b.ghost?.62:1);
  part(b,fl,SP.b3headR,b.hR.x,b.hR.y,Math.sin(b.t*.05)*.12);part(b,fl,SP.b3headB,b.hB.x,b.hB.y,Math.sin(b.t*.05+1)*.12);
 },
 phases:[
 {name:'쌍룡 포효',hp:800,time:2000,fn(b,t){
  if(every(t,44))fan(b.hR.x-24,b.hR.y+8,aimA(b.hR),vS(2.6),nS(7),.17,'orb','orange');
  if(every(t,26))fan(b.hB.x-24,b.hB.y+8,aimA(b.hB),vS(3.4),nS(2),.14,'needle','cyan')}},
 {name:'폭풍 날개',hp:900,time:2200,fn(b,t){
  if(every(t,5)){const a=t*.13;bul(b.x-20,b.y,a,vS(2.2),'rice','violet',{turn:.008});bul(b.x-20,b.y,a+PI,vS(2.2),'rice','pink',{turn:-.008})}
  if(every(t,80)){fan(b.hR.x-20,b.hR.y,aimA(b.hR),vS(3),nS(3),.3,'big','red')}}},
 {name:'멸살 브레스',hp:1020,time:2400,fn(b,t){
  if(t%210===20){laser(b.hR.x-26,b.hR.y+8,PI+.9,{w:18,warn:50,dur:96,va:-.0115,c:'#ff7a1a',follow(l){l.x=b.hR.x-26;l.y=b.hR.y+8}});laser(b.hB.x-26,b.hB.y+8,PI-.9,{w:18,warn:50,dur:96,va:.0115,c:'#26e0ff',follow(l){l.x=b.hB.x-26;l.y=b.hB.y+8}})}
  if(every(t,10))bul(b.x-20,b.y,PI+rnd(-1.3,1.3),vS(rnd(2,3.2)),'dot','white');
  if(every(t,74)){ring(b.hR.x,b.hR.y,vS(2),rS(16),t*.1,'orb','orange');ring(b.hB.x,b.hB.y,vS(2),rS(16),t*.2,'orb','cyan')}}}
 ]};
// ── 4막: 자율 전함 ────────────────────────────────────────
const b4Core=b=>({x:b.x-120,y:b.y});
function b4Turrets(b){[[-30,-92],[60,-104],[-30,92],[60,104]].forEach(([ox,oy],i)=>{
  spawn('turret',b.x+ox,b.y+oy,{parent:b,big:true,m:e=>{e.x=b.x+ox;e.y=b.y+oy;if(b.dying)e.dead=true},fire:e=>{if(e.t>20&&every(e.t,40+i*7)&&!b.trans&&b.active)fan(e.x-22,e.y,aimA(e),vS(2.8),nS(3),.2,'needle','cyan')}})
})}
BOSS.ship={name:'자율 전함 「오메가-0」',ax:486,ay:180,bgm:'boss',
 init(b){b.spawned=false},
 move(b){b.y=b.ay+Math.sin(b.t*.012)*14},
 hits:b=>{const c=b4Core(b);return[{x:c.x,y:c.y,r:26},{x:b.x-50,y:b.y,r:58},{x:b.x+70,y:b.y,r:80}]},
 draw(b,fl){part(b,fl,SP.b4hull,b.x+30,b.y);const c=b4Core(b);part(b,fl,SP.b4core[Math.floor(b.t/10)%2],c.x,c.y)},
 phases:[
 {name:'전포대 사격',hp:860,time:2100,fn(b,t){
  if(!b.spawned&&!b.ghost){b.spawned=true;b4Turrets(b)}
  const c=b4Core(b);
  if(every(t,70))ring(c.x,c.y,vS(2),rS(20),t*.06,'orb','red');
  if(every(t,32))fan(c.x,c.y,aimA(c),vS(3),nS(1),.3,'big','orange')}},
 {name:'광역 레이저',hp:980,time:2300,fn(b,t){const c=b4Core(b);
  if(t%130===10){const up=Math.floor(t/130)%2===0;for(let i=0;i<4;i++)setTimeoutTick(i*14,()=>{if(b.dead)return;laser(c.x,c.y,PI+(up?1:-1)*(.85-i*.55),{w:12,warn:38,dur:46,c:'#ff5a5a',follow(l){l.x=b4Core(b).x;l.y=b4Core(b).y}})})}
  if(every(t,20))bul(c.x,c.y,PI+Math.sin(t*.05)*1.2,vS(2.6),'rice','cyan');
  if(every(t,96))ring(c.x,c.y,vS(1.7),rS(18),t*.07,'dot','yellow')}},
 {name:'중력탄',hp:1120,time:2500,fn(b,t){const c=b4Core(b);
  if(every(t,60)){const a=PI+rnd(-.8,.8);bul(c.x,c.y,a,vS(1.4),'big','violet',{fn(q,ts){if(q.t>30&&Math.floor(q.t)%34===0&&q.lt!==Math.floor(q.t)){q.lt=Math.floor(q.t);ring(q.x,q.y,vS(1.9),rS(8),q.t*.2,'dot','violet')}}})}
  if(every(t,14)){const px=P?P.x:200,py=P?P.y:180,a=rnd(TAU),d=240,x=px+Math.cos(a)*d,y=py+Math.sin(a)*d;if(x>10&&x<W-10&&y>24&&y<H-10){bul(x,y,a+PI,vS(.9),'orb','pink',{acc:.018})}}
  if(every(t,100))fan(c.x,c.y,aimA(c),vS(2.6),nS(7),.15,'needle','cyan')}}
 ]};
// ── 종막: 공허왕 ──────────────────────────────────────────
const b5Palm=(b,i)=>{const s=i<3?-1:1,k=i%3,a=PI+(s*(.5+k*.42))+Math.sin(b.t*.03+i)*.14;return{x:b.x-10+Math.cos(a)*124,y:b.y-16+s*(k*14)+Math.sin(a)*124,a}};
BOSS.king={name:'공허왕 「무량」',ax:470,ay:178,bgm:'last',
 move(b){b.y=b.ay+Math.sin(b.t*.016)*16},
 hits:b=>[{x:b.x,y:b.y+30,r:52},{x:b.x,y:b.y-56,r:34}],
 draw(b,fl){
  dr(SP.b5halo,b.x,b.y-40,b.t*.008,1,1);
  dr(SP.b5halo,b.x,b.y-40,-b.t*.013,.66,.6);
  for(let i=0;i<6;i++){const p=b5Palm(b,i),s=i<3?-1:1;part(b,fl,SP.b5arm,b.x-8,b.y-16+s*(i%3)*14,p.a-PI);}
  part(b,fl,SP.b5body,b.x,b.y+40);part(b,fl,SP.b5mask,b.x,b.y-56,Math.sin(b.t*.02)*.05);
 },
 phases:[
 {name:'허무의 바퀴',hp:1000,time:2100,fn(b,t){
  if(every(t,5)){const a=t*.021;for(let i=0;i<6;i++)bul(b.x-6,b.y-46,a+i/6*TAU,vS(2.1),'rice','violet')}
  if(every(t,80))fan(b.x-6,b.y-46,aimA({x:b.x,y:b.y-46}),vS(3.1),nS(5),.14,'star','yellow')}},
 {name:'여섯 손의 재앙',hp:1200,time:2500,fn(b,t){
  const c=Math.floor(t/70)%6,p=b5Palm(b,c);
  if(t%70===1)ringFx(p.x,p.y,70,'#7dffd4',20,3);
  if(c===0&&every(t,12)){bul(p.x,p.y,aimA(p)+rnd(-.7,.7),vS(1.2),'needle','orange',{fn(q){if(!P)return;const a=Math.atan2(P.y-q.y,P.x-q.x),cu=Math.atan2(q.vy,q.vx),n=cu+clamp(wrapA(a-cu),-.018,.018),sp=Math.min(4,hyp(q.vx,q.vy)+.03);q.vx=Math.cos(n)*sp;q.vy=Math.sin(n)*sp;q.rot=n}})}
  if(c===1&&t%70===20){for(let i=0;i<5;i++)laser(rnd(40,420),-10,PI/2,{w:14,warn:36+i*5,dur:18,c:'#8fd4ff',len:400})}
  if(c===2&&every(t,16))fan(p.x,p.y,aimA(p),vS(3),nS(7),.13,'orb','yellow');
  if(c===3&&every(t,5))bul(p.x,p.y,PI+Math.sin(t*.2)*1.1,vS(2.1),'petal','orange',{turn:Math.sin(t)*.008});
  if(c===4&&every(t,8))bul(p.x,p.y,rnd(TAU),vS(1.9),'orb','red',{fn(q){q.y+=Math.sin(q.t*.1)*.7}});
  if(c===5&&t%70===24)laser(p.x,p.y,aimA(p),{w:16,warn:34,dur:32,c:'#7dffb0'});
  }},
 {name:'시간의 종언',hp:1250,time:2500,fn(b,t){
  const q=t%200;
  if(q===2){sfx('time');const ex=Math.max(2,Math.round(5+D.ext*1.2));for(let i=0;i<14;i++)for(let j=0;j<7;j++){if(j%ex===Math.floor(t/200)%ex&&false)continue;const x=30+i*30+(j%2)*15,y=44+j*44;if(hyp(x-P.x,y-P.y)<60)continue;if((i+j)%(D.ext<0?3:2))continue;bul(x,y,0,0,'orb','white',{delay:100,lv:vS(2.5),vx:0,vy:0})}}
  if(q>=30&&q<90&&every(t,6))bul(b.x-6,b.y-46,PI+rnd(-.9,.9),vS(2.8),'needle','violet');
  if(every(t,110))ring(b.x-6,b.y-46,vS(1.7),rS(18),t*.1,'dot','cyan')}},
 {name:'세계 개변',hp:1350,time:2700,fn(b,t){
  if(every(t,58)){const gap=rnd(50,310),gh=D.ext<0?78:D.ext>1?50:62;for(let y=30;y<H-8;y+=14){if(Math.abs(y-gap)<gh/2)continue;bul(W+12,y,PI,vS(2.5),'orb','red')}}
  if(every(t,34)){const a=rnd(TAU);ring(b.x-6,b.y-46,vS(1.8),rS(10),a,'petal','pink')}
  if(every(t,120)){for(let i=0;i<3;i++){const p=b5Palm(b,i*2);laser(p.x,p.y,aimA(p),{w:8,warn:40,dur:20,c:'#ff4f9f'})}}}},
 {name:'무량공처',hp:1700,time:3400,fn(b,t){
  if(every(t,3)){const a=t*.037;bul(b.x-6,b.y-46,a,vS(2.3),'rice','violet');bul(b.x-6,b.y-46,-a*1.3+1,vS(2),'rice','cyan')}
  if(every(t,48))fan(b.x-6,b.y-46,aimA({x:b.x,y:b.y-46}),vS(3.4),nS(3),.32,'big','red');
  if(every(t,150)){for(let i=0;i<6;i++){const p=b5Palm(b,i);ring(p.x,p.y,vS(1.6),rS(10),t*.02,'star','yellow')}}}}
 ]};
