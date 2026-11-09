'use strict';
// ── 여섯 영웅 ─────────────────────────────────────────────
function homing(s,tg,turn,sp){
  if(!tg)return;const t=targetOf(tg),a=Math.atan2(t.y-s.y,t.x-s.x),cur=Math.atan2(s.vy,s.vx),n=cur+clamp(wrapA(a-cur),-turn,turn);
  s.vx=Math.cos(n)*sp;s.vy=Math.sin(n)*sp;s.rot=n;
}
function rocket(x,y,a,tg,dmg,v0=4){
  shot({x,y,vx:Math.cos(a)*v0,vy:Math.sin(a)*v0,s:SP.rocket,solid:true,rot:a,r:6,dmg,hc:'#ff9a40',tg,sp:v0,life:220,
    upd(s){s.sp=Math.min(13,s.sp+.35);if(!s.tg||s.tg.dead)s.tg=nearest(s.x,s.y);if(s.tg)homing(s,s.tg,.18,s.sp);else{const c=Math.atan2(s.vy,s.vx);s.vx=Math.cos(c)*s.sp;s.vy=Math.sin(c)*s.sp}
      if(s.t%2===0)pfx({k:0,x:s.x-Math.cos(s.rot)*9,y:s.y-Math.sin(s.rot)*9,vx:0,vy:0,t:0,l:14,r:5,c:'#ff8a30'})},
    onHit(s){boom(s.x,s.y,.5)}});
}
function chain(from,n,d,seen){
  if(n<=0)return;const b=nearest(from.x,from.y,e=>!seen.has(e),135);if(!b)return;
  seen.add(b);const t=targetOf(b);boltFx(from.x,from.y,t.x,t.y,'#8fd4ff',1.6);hurt(b,d);chain(t.x?{x:t.x,y:t.y}:b,n-1,d*.85,seen);
}
function reticle(x,y,r,rot,c){
  g.strokeStyle=c;g.lineWidth=1.5;for(let i=0;i<4;i++){const a=rot+i*PI/2;g.beginPath();g.arc(x,y,r,a-.42,a+.42);g.stroke()}
}
const CHARS=[
{id:'iron',name:'윤화륜',title:'화륜갑의 괴짜 양반',origin:'조선 · 증기공학',motif:'가슴의 심장로로 움직이는 붉은 화륜갑. 세상을 구하는 것도 발명품 시험이라 우기는 양반가의 망나니 천재.',
 speed:3.0,stat:[4,3,3,3],accent:'#ff8a3a',
 shotName:'장심포',shotDesc:'양 손바닥에서 쏘는 직선 광탄. 화력을 올리면 소형 신기전이 자동 유도됩니다.',
 skillName:'신기전 조준',skillDesc:'누르는 동안 적을 최대 8곳 조준. 떼면 조준한 곳으로 유도 신기전 일제 발사.',
 bombName:'화륜군단 출격',bombDesc:'무인 화륜갑 8기를 소환해 화면 전체에 일제 심장포를 쏩니다.',bombDur:210,
 fire(p){const L=p.power;sfx('shot');p.sc=(p.sc||0)+1;
  const sh=(dy,a)=>shot({x:p.x+24,y:p.y+3+dy,vx:Math.cos(a)*15,vy:Math.sin(a)*15,s:SP.ironB,rot:a,r:5,dmg:1.6,hc:'#7feaff'});
  sh(-4,0);sh(4,0);if(L>=2){sh(-11,-.05);sh(11,.05)}if(L>=3)sh(0,0);
  if(L>=3&&p.sc%5===0){rocket(p.x+6,p.y-12,-.8,null,4,3);if(L>=4)rocket(p.x+6,p.y+14,.8,null,4,3)}
  p.cd=7},
 skill(p,on,st,end){
  if(st){p.locks=[];p.lockT=0}
  if(on){p.lockT++;
   if(p.lockT%7===1&&p.locks.length<8){
    const cnt=e=>p.locks.filter(l=>l===e).length;
    const list=eList().filter(e=>e.isBoss||cnt(e)===0).sort((a,b)=>(cnt(a)*220+hyp(a.x-p.x,a.y-p.y))-(cnt(b)*220+hyp(b.x-p.x,b.y-p.y)));
    if(list[0]){p.locks.push(list[0]);p.gauge-=6;sfx('lock')}
   }
  }
  if(end&&p.locks&&p.locks.length){p.locks.forEach((e,i)=>setTimeoutTick(i*3,()=>{if(P===p&&!p.dead)rocket(p.x+8,p.y+(i%2?12:-12),i%2?.9:-.9,e,12,3)}));sfx('rocket');p.locks=[]}
  else if(end)p.locks=[];
 },
 drawFront(p){if(p.skillOn&&p.locks){g.lineWidth=1;p.locks.forEach((e,i)=>{if(e.dead)return;const t=targetOf(e);reticle(t.x,t.y,12+i*2.5,G.t*.08,'#ff5a40')});
   g.strokeStyle='rgba(255,120,70,.5)';g.lineWidth=1;g.beginPath();g.arc(p.x+70,p.y,20+Math.sin(G.t*.2)*3,0,TAU);g.stroke()}
   if(p.bombT>0){this.bombDraw(p,p.bombD-p.bombT)}},
 onDeath(p){p.locks=[]},
 bomb(p){p.drones=[...Array(8).keys()].map(i=>({x:-60-i*16,y:44+i*40,tx:70+(i%2)*56,f:0}));cancelBullets(true)},
 bombU(p,t){for(const d of p.drones){d.x+=(d.tx-d.x)*.09;if(t>46&&t<190)beamHit(d.x+18,d.y-13,W+20,d.y+13,.8,true)}
  if(t===46){sfx('blast');G.shake=10}if(t>46&&t%4===0)G.shake=Math.max(G.shake,2);
  if(t>190)for(const d of p.drones)d.tx=W+80},
 bombDraw(p,t){for(const d of p.drones){dr(SP.drone[Math.floor(G.t/4)%2],d.x,d.y);
   if(t>46&&t<190){const e=clamp(Math.min((t-46)/6,(190-t)/10),0,1),h=26*e,x0=d.x+18;g.globalCompositeOperation='lighter';g.globalAlpha=.55;g.fillStyle='#d8561a';g.fillRect(x0,d.y-h/2-2,W,h+4);g.globalAlpha=.8;g.fillStyle='#1fa8d8';g.fillRect(x0,d.y-h*.36,W,h*.72);g.globalAlpha=1;g.fillStyle='#e9fdff';g.fillRect(x0,d.y-h*.13,W,h*.26);g.globalCompositeOperation='source-over'}}}
},
{id:'thor',name:'하르칸',title:'천둥산의 왕자',origin:'서양판타지 · 북방 왕국',motif:'붉은 망토와 룬 전쟁망치 「그롬」을 든 뇌신의 후예. 싸움을 축제로 여기는 호쾌한 왕자.',
 speed:2.7,stat:[5,2,3,2],accent:'#7fc8ff',
 shotName:'뇌격탄',shotDesc:'맞은 적에서 가까운 적으로 번개가 튀어 옮겨 붙습니다. 화력을 올리면 사슬이 길어집니다.',
 skillName:'그롬 투척',skillDesc:'망치를 던져 누르는 동안 전방에 띄웁니다. 주변을 지지고 탄을 막으며, 떼면 관통하며 돌아옵니다.',
 bombName:'천공뇌정',bombDesc:'하늘에서 벼락 기둥을 연달아 내리꽂고 마지막에 화면 전체를 강타합니다.',bombDur:150,
 fire(p){const L=p.power,n=[1,2,2,3][L-1],ch=[1,1,2,3][L-1];sfx('bolt');
  for(let i=0;i<n;i++){const dy=(i-(n-1)/2)*10;shot({x:p.x+24,y:p.y+dy,vx:15,s:SP.thorB,r:6,dmg:3,hc:'#a8e0ff',onHit(s,e){chain({x:s.x,y:s.y},ch,2.2,new Set([e]))}})}
  p.cd=9},
 skill(p,on,st){
  if(st&&!p.ham){p.ham={x:p.x+20,y:p.y,st:0,t:0,rot:0};sfx('hammer')}
  const h=p.ham;if(!h)return;h.t++;h.rot+=.5;
  if(h.st===0){const tx=Math.min(W-30,p.x+190);h.x+=(tx-h.x)*.16;h.y+=(p.y-h.y)*.22;p.gauge-=.33;if(!on&&h.t>18){h.st=1;h.t=0;sfx('hammer')}}
  else{const a=ang(h,p),v=Math.min(18,8+h.t*.5);h.x+=Math.cos(a)*v;h.y+=Math.sin(a)*v;if(hyp(h.x-p.x,h.y-p.y)<20){p.ham=null;sfx('item');return}}
  if(h.t%5===0){for(const e of eList())if(hitE(e,h.x,h.y,28)){hurt(e,h.st?9:5.5);const t=targetOf(e);boltFx(h.x,h.y,t.x,t.y,'#8fd4ff',1.4,6)}
   sfx('bolt')}
  for(let i=EB.length-1;i>=0;i--){const b=EB[i];if(hyp(b.x-h.x,b.y-h.y)<22){spark1(b.x,b.y,'#a8e0ff');EB[i]=EB[EB.length-1];EB.pop()}}
 },
 onDeath(p){p.ham=null},
 drawFront(p){const h=p.ham;if(h){if(h.st===0){g.globalCompositeOperation='lighter';g.globalAlpha=.5;g.drawImage(glow('#5fb4ff'),h.x-30,h.y-30,60,60);g.globalAlpha=1;g.globalCompositeOperation='source-over'}dr(SP.hammer,h.x,h.y,h.rot)}
  if(p.bombT>0)this.bombDraw(p,p.bombD-p.bombT)},
 bomb(p){cancelBullets(true);p.strikes=[]},
 bombU(p,t){
  if(t%9===1&&t<120){const e=pick(eList());const x=e?targetOf(e).x:rnd(120,W-20);const s={x,t:0};p.strikes.push(s);sfx('thunder');G.flash=2;G.flashC='#cfeaff';G.shake=Math.max(G.shake,6);beamHit(x-34,0,x+34,H,34,true);boltFx(x+rnd(-40,40),-10,x,H,'#8fd4ff',5,14)}
  if(t===132){hurtAll(50);cancelBullets(true);G.flash=7;G.flashC='#fff';G.shake=14;sfx('thunder');for(let i=0;i<9;i++)boltFx(rnd(W),-10,rnd(W),H,'#8fd4ff',4,20)}
  p.strikes.forEach(s=>s.t++);p.strikes=p.strikes.filter(s=>s.t<14)},
 bombDraw(p,t){g.globalCompositeOperation='lighter';for(const s of p.strikes){const e=1-s.t/14;g.globalAlpha=e;g.fillStyle='#5fb4ff';g.fillRect(s.x-22*e,0,44*e,H);g.fillStyle='#fff';g.fillRect(s.x-8*e,0,16*e,H)}g.globalAlpha=1;g.globalCompositeOperation='source-over'}
},
{id:'vega',name:'베가 루멘',title:'은하연방 성단기사',origin:'SF · 은하연방',motif:'성단의 에너지를 몸에 품은 전직 시험비행사. 빛을 삼켜 더 큰 빛으로 되돌려주는 은하 최강의 격투 파일럿.',
 speed:3.5,stat:[4,5,5,3],accent:'#ffcf5e',
 shotName:'광자 산탄',shotDesc:'부챗살처럼 퍼지는 광자탄. 넓게 쓸어 담고, 가까이 붙으면 화력이 몰립니다.',
 skillName:'광자 흡수',skillDesc:'누르는 동안 전방의 적 탄을 흡수합니다(샷 불가). 많이 삼킬수록 떼는 순간의 대광탄이 커지고 위력이 크게 늘어납니다.',
 bombName:'쌍성 각성',bombDesc:'5초간 항성의 힘으로 각성. 무적 상태로 초고속 연사하고, 끝날 때 화면 전체에 신성 폭발.',bombDur:300,
 spdMod(p){return p.bombT>0?1.3:1},
 fire(p){const L=p.power,n=[3,5,7,7][L-1],d=[1.8,1.9,2,2.4][L-1],bin=p.bombT>0;sfx('photon');
  const N=bin?n+4:n;for(let i=0;i<N;i++){const a=(i-(N-1)/2)*.075;shot({x:p.x+26,y:p.y+2,vx:Math.cos(a)*13,vy:Math.sin(a)*13,s:bin?SP.vegaBig:SP.vegaB,rot:a,r:bin?8:4,dmg:bin?d*2.2:d,hc:'#ffe08a'})}
  p.cd=bin?3:9},
 skill(p,on,st,end){
  if(st){p.ch=0;p.holdT=0;sfx('phase')}
  if(on){p.noFire=true;p.gauge-=.42;p.holdT++;
   for(let i=EB.length-1;i>=0;i--){const b=EB[i],dx=b.x-p.x,dy=b.y-p.y;if(dx*dx+dy*dy<52*52&&Math.abs(Math.atan2(dy,dx))<1.45){p.ch=Math.min(VEGA_MAX,p.ch+(b.k==='big'?3:1));gain(.4);sparks(b.x,b.y,'#ffe08a',2,1.5,10,4);sfx('absorb');EB[i]=EB[EB.length-1];EB.pop()}}
  }
  if(end){const q=(p.ch||0);
   if(q===0&&(p.holdT||0)<12)return; // 짧게 눌렀다 떼는 연타로 대광탄을 쓸 수 없게 한다
   sfx('blast');if(q>5)G.shake=Math.max(G.shake,Math.min(14,3+q*.2));if(q>=25){G.flash=3;G.flashC='#ffe08a'}
   shot({x:p.x+26,y:p.y,vx:11,s:SP.vegaBig,sc:1+q*.085,r:9+q*.62,dmg:vegaPow(q),pierce:true,hc:'#ffe08a',life:90,onHit(s){if(q>8)boom(s.x+s.r*.5,s.y,1+q*.05)},upd(s){for(let i=EB.length-1;i>=0;i--){const b=EB[i];if(hyp(b.x-s.x,b.y-s.y)<s.r+2){EB[i]=EB[EB.length-1];EB.pop();addScore(40)}}if(s.t%2===0)spark1(s.x-8,s.y,'#ffcf5e')}});p.ch=0}
 },
 drawBack(p){if(p.bombT>0){g.globalCompositeOperation='lighter';const r=46+Math.sin(G.t*.5)*6;g.globalAlpha=.75;g.drawImage(glow('#ffae2a'),p.x-r,p.y-r,r*2,r*2);g.globalAlpha=1;g.globalCompositeOperation='source-over'}},
 drawFront(p){if(p.skillOn){g.strokeStyle='#ffe08a';g.lineWidth=2+(p.ch||0)*.05;g.beginPath();g.arc(p.x,p.y,50,-1.45,1.45);g.stroke();g.strokeStyle='rgba(255,180,70,.55)';g.lineWidth=1;g.beginPath();g.arc(p.x,p.y,42,-1.45,1.45);g.stroke();
   g.globalCompositeOperation='lighter';const r=8+(p.ch||0)*.5;g.drawImage(glow('#ffcf5e'),p.x+24-r,p.y+2-r,r*2,r*2);g.globalCompositeOperation='source-over'}},
 bomb(p){cancelBullets(true);G.flash=6;G.flashC='#ffe08a'},
 bombU(p,t){for(let i=EB.length-1;i>=0;i--){const b=EB[i];if(hyp(b.x-p.x,b.y-p.y)<62){spark1(b.x,b.y,'#ffae2a');EB[i]=EB[EB.length-1];EB.pop()}}
  for(const e of eList())if(hitE(e,p.x,p.y,42))hurt(e,2.6);
  if(t%3===0)sparks(p.x-14,p.y,'#ffae2a',2,2.4,18,7)},
 bombEnd(p){hurtAll(60);cancelBullets(true);G.flash=9;G.flashC='#fff3c0';G.shake=14;sfx('blast');ringFx(p.x,p.y,700,'#ffe08a',36,8);ringFx(p.x,p.y,520,'#ff7a1a',30,5)}
},
{id:'strange',name:'현월',title:'앙부일구의 도사',origin:'조선 · 도술',motif:'어의였다가 손을 잃을 뻔한 뒤 도술에 입문한 도사. 시간을 재는 앙부일구 목걸이와 스스로 나는 붉은 도포를 지녔다.',
 speed:2.9,stat:[3,3,4,5],accent:'#ffb43a',
 shotName:'유도 부적',shotDesc:'적을 쫓아가는 부적. 3단계부터는 공간문을 열어 적의 등 뒤에서 금빛 탄을 꽂습니다.',
 skillName:'시류정지',skillDesc:'누르는 동안 적과 탄의 시간을 4분의 1로 늦춥니다. 내 샷과 움직임은 그대로입니다.',
 bombName:'명경계',bombDesc:'세계를 거울 차원으로 뒤집어 적을 멈추고, 모든 탄을 되돌려 적에게 쏘아 보냅니다.',bombDur:190,
 fire(p){const L=p.power,n=[2,3,4,5][L-1];sfx('tal');p.sc=(p.sc||0)+1;
  for(let i=0;i<n;i++){const a=(i-(n-1)/2)*.42;shot({x:p.x+22,y:p.y,vx:Math.cos(a)*8,vy:Math.sin(a)*8,s:SP.tal,solid:true,rot:a,r:5,dmg:1.9,hc:'#ffe08a',
    upd(s){if(s.t>6){if(!s.tg||s.tg.dead)s.tg=nearest(s.x,s.y);homing(s,s.tg,.14,9)}}})}
  if(L>=3&&p.sc%5===0){const e=nearest(p.x,p.y);if(e){const t=targetOf(e),x=t.x-54,y=t.y+rnd(-14,14);ringFx(x,y,20,'#ffb43a',22,2);shot({x,y,vx:14,s:SP.vegaB,r:6,dmg:L>=4?12:8,hc:'#ffb43a'})}}
  p.cd=9},
 skill(p,on,st){if(st)sfx('time');if(on){G.ts=Math.min(G.ts,.25);p.gauge-=.42}},
 drawFront(p){if(p.skillOn){g.strokeStyle='#ffb43a';g.lineWidth=1;for(let k=0;k<2;k++){const R=30+k*16;g.beginPath();g.arc(p.x,p.y,R,0,TAU);g.stroke();const n=k?12:8;for(let i=0;i<n;i++){const a=i/n*TAU+G.t*(k?-.012:.03);g.beginPath();g.moveTo(p.x+Math.cos(a)*(R-3),p.y+Math.sin(a)*(R-3));g.lineTo(p.x+Math.cos(a)*(R+3),p.y+Math.sin(a)*(R+3));g.stroke()}}}},
 bomb(p){G.mirror=190;sfx('time');
  let n=0;for(const b of EB){if(n++>110)break;const a=rnd(TAU);shot({x:b.x,y:b.y,vx:Math.cos(a)*5,vy:Math.sin(a)*5,s:SP.vegaB,r:5,dmg:3.2,hc:'#ffb43a',life:200,upd(s){if(!s.tg||s.tg.dead)s.tg=nearest(s.x,s.y);homing(s,s.tg,.2,10)}})}
  EB.length=0;LZ.length=0},
 bombU(p,t){G.ts=0;if(t===170){hurtAll(45);G.flash=8;G.flashC='#ffe9b0';G.shake=12;sfx('big')}},
},
{id:'witch',name:'카르미나 헥스',title:'진홍의 마녀',origin:'서양판타지 · 금서의 탑',motif:'금서의 탑에 봉인되었던 혼돈마법의 계승자. 슬픔이 커질수록 현실의 규칙이 그녀의 뜻대로 구부러진다.',
 speed:2.9,stat:[4,3,4,4],accent:'#ff4f88',
 shotName:'저주 탄',shotDesc:'꿈틀거리며 적을 쫓는 혼돈 탄. 맞을수록 저주가 쌓여 적이 받는 피해가 최대 50% 늘어납니다.',
 skillName:'염동 구속',skillDesc:'누르는 동안 가까운 적을 붉은 기운으로 붙잡아 공격을 봉쇄합니다. 떼면 붙잡은 적을 탄환처럼 내던집니다.',
 bombName:'세계 개변',bombDesc:'현실을 다시 씁니다. 잡졸은 나비로, 탄은 금화로 바뀌고 보스는 저주받은 채 공격이 멎습니다.',bombDur:200,
 fire(p){const L=p.power,n=[1,2,3,3][L-1],d=L>=4?2.8:2.3;sfx('hex');
  for(let i=0;i<n;i++){const ph=rnd(TAU);const a=(i-(n-1)/2)*.2;shot({x:p.x+22,y:p.y,vx:Math.cos(a)*9,vy:Math.sin(a)*9,s:SP.hex,r:6,dmg:d,hc:'#ff4f88',
    upd(s){if(s.t>10){if(!s.tg||s.tg.dead)s.tg=nearest(s.x,s.y);homing(s,s.tg,.05,9.5)}s.y+=Math.sin(s.t*.35+ph)*1.5;if(s.t%3===0)spark1(s.x,s.y,'#e01550')},
    onHit(s,e){e.hex=Math.min(5,(e.hex||0)+1);e.hexT=300}})}
  p.cd=9},
 skill(p,on,st,end){
  if(st){p.grip=[];p.gT=0;sfx('phase')}
  if(on){p.gT++;p.grip=p.grip.filter(e=>!e.dead);p.gauge-=.2+.06*p.grip.length;
   if(p.gT%8===1&&p.grip.length<3+p.power){const e=nearest(p.x,p.y,x=>!p.grip.includes(x),260);if(e){p.grip.push(e);if(!e.isBoss)e.seized=true;sfx('hex')}}
   for(const e of p.grip){hurt(e,e.isBoss?.55:.3)}
  }
  if(end&&p.grip){let thrown=0;
   for(const e of p.grip){if(e.dead)continue;e.seized=false;
    if(e.isBoss||e.big){hurt(e,14);boom(targetOf(e).x,targetOf(e).y,.8);continue}
    e.dead=true;G.kills++;addScore(e.score);thrown++;
    const sp=Array.isArray(e.s)?e.s[0]:e.s;
    shot({x:e.x,y:e.y,vx:11,s:sp,solid:true,rot:0,r:Math.max(10,e.r),dmg:22,pierce:true,hc:'#ff4f88',life:90,upd(s){s.rot+=.4;if(s.t%2===0)spark1(s.x,s.y,'#ff2b66')},onHit(s){boom(s.x,s.y,.5)}});
    IT.push(mkItem(e.x,e.y,'coin'));if(e.drop)dropItem(e.x,e.y,e.drop);
   }
   if(thrown)sfx('blast');p.grip=[]}
 },
 onDeath(p){if(p.grip)p.grip.forEach(e=>e.seized=false);p.grip=[]},
 drawFront(p){if(p.skillOn&&p.grip){g.globalCompositeOperation='lighter';for(const e of p.grip){if(e.dead)continue;const t=targetOf(e);g.strokeStyle='#ff2b66';g.lineWidth=1.5;for(let k=0;k<2;k++){g.beginPath();g.moveTo(p.x+18,p.y);const mx=(p.x+t.x)/2,my=(p.y+t.y)/2;g.quadraticCurveTo(mx+Math.sin(G.t*.3+k*2)*26,my+Math.cos(G.t*.26+k*2)*26,t.x,t.y);g.stroke()}g.globalAlpha=.6;g.drawImage(glow('#ff2b66'),t.x-20,t.y-20,40,40);g.globalAlpha=1}g.globalCompositeOperation='source-over'}},
 bomb(p){G.scarlet=200;G.flash=8;G.flashC='#ff2b66';G.noFire=200;this.convert();for(const e of eList())if(e.isBoss){e.hex=5;e.hexT=320}},
 convert(){for(const b of EB){if(onS(b)&&IT.length<80)IT.push(mkItem(b.x,b.y,'coin'))}EB.length=0;LZ.length=0;
  for(const e of EN){if(e.dead||e.isBoss||e.big||e.parent||!onS(e))continue;e.dead=true;G.kills++;addScore(e.score*2);pfx({k:3,s:SP.butterfly,x:e.x,y:e.y,t:0,l:60});if(e.drop)dropItem(e.x,e.y,e.drop)}},
 bombU(p,t){G.noFire=Math.max(G.noFire,2);if(t%6===0)this.convert();for(const e of eList())if(e.isBoss||e.big||e.parent)hurt(e,.95)},
},
{id:'vision',name:'아이온-7',title:'프리즘 합성인간',origin:'SF · 잊힌 궤도연구소',motif:'이마의 프리즘 보석에서 의식을 얻은 합성인간. 밀도를 조절해 벽도 탄도 통과하며, 인간다움이 무엇인지 늘 묻는다.',
 speed:3.2,stat:[3,4,2,4],accent:'#7dffb0',
 shotName:'프리즘 펄스',shotDesc:'폭은 좁지만 적을 모두 관통하는 초고속 레이저. 일렬로 선 적에게 강합니다.',
 skillName:'위상 변환',skillDesc:'누르는 동안 몸을 비실체화해 탄과 적을 통과합니다(샷 불가). 겹친 적을 짓누르고, 떼는 순간 충격파.',
 bombName:'프리즘 대광선',bombDesc:'이마의 보석에서 거대한 광선을 쏩니다. 위아래로 움직여 전장을 베어 냅니다.',bombDur:200,
 spdMod(p){return p.bombT>0?.72:1},
 fire(p){const L=p.power,n=[1,2,3,3][L-1],d=L>=4?2.6:1.8;sfx('pulse');
  for(let i=0;i<n;i++){shot({x:p.x+26,y:p.y-6+(i-(n-1)/2)*7,vx:20,s:SP.aionB,r:3.5,dmg:d,pierce:true,hc:'#7dffb0'})}
  p.cd=5},
 skill(p,on,st,end){
  if(st)sfx('phase');
  if(on){p.noFire=true;p.phase=true;p.gauge-=.6;for(const e of eList())if(hitE(e,p.x,p.y,16))hurt(e,1.2)}
  if(end){sfx('blast');ringFx(p.x,p.y,92,'#7dffb0',18,3);for(const e of eList())if(hitE(e,p.x,p.y,58))hurt(e,14);p.inv=Math.max(p.inv,16)}
 },
 bomb(p){cancelBullets(true)},
 bombU(p,t){const y=p.y-6;if(t>16&&t<186){const h=(t<30?(t-16)/14:1)*104;beamHit(p.x+20,y-h/2,W+30,y+h/2,3.2,true);if(t%3===0)G.shake=Math.max(G.shake,3)}},
 drawFront(p){if(p.bombT>0){const t=p.bombD-p.bombT,y=p.y-6,x0=p.x+24;
   if(t<=16){g.globalCompositeOperation='lighter';const r=4+t*2.2;g.drawImage(glow('#7dffb0'),x0-r,y-r,r*2,r*2);g.globalCompositeOperation='source-over';return}
   if(t<186){const e=clamp(Math.min((t-16)/12,(186-t)/14),0,1),h=104*e,w=W;g.globalCompositeOperation='lighter';
    g.fillStyle='#1c9c60';g.fillRect(x0,y-h/2-4,w,h+8);g.fillStyle='#50ff9c';g.fillRect(x0,y-h/2+6*e,w,h-12*e);g.fillStyle='#e9c75a';g.fillRect(x0,y-h*.26,w,h*.52);g.fillStyle='#fff';g.fillRect(x0,y-h*.15,w,h*.3);
    for(let i=0;i<5;i++){g.fillStyle='rgba(255,255,255,.35)';g.fillRect(x0+((G.t*22+i*140)%w),y-h/2,60,h)}
    g.drawImage(glow('#d4ffe4'),x0-50,y-50*e-20,100,100*e+40);g.globalCompositeOperation='source-over'}}}
}];
const VEGA_MAX=60;
function vegaPow(q){return 20+q*16}
const TICKQ=[];
function setTimeoutTick(n,fn){TICKQ.push({n,fn})}
function runTickQ(){for(let i=TICKQ.length-1;i>=0;i--){const q=TICKQ[i];if(--q.n<=0){TICKQ.splice(i,1);q.fn()}}}
function buildHeroExtra(){
  SP.thorB=S(26,12,x=>{pline(x,'#5fb4ff',3,1,6,7,3,12,8,18,3,25,6);pline(x,'#fff',1.2,1,6,7,3,12,8,18,3,25,6)},{o:null});
}
// 현월·마녀 필살기 전용 보정: bombDraw 공통 가드
CHARS.forEach(c=>{if(!c.bombEnd)c.bombEnd=null});
