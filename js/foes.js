'use strict';
// ── 이동 패턴 ─────────────────────────────────────────────
const M={
  str:(v=2,vy=0)=>e=>{e.x-=v;e.y+=vy},
  sine:(v,a,f)=>e=>{if(e.y0===undefined)e.y0=e.y;e.x-=v;e.y=e.y0+Math.sin(e.t*f)*a},
  hover:(tx,hold=130,v=2.4)=>e=>{if(e.t<hold)e.x+=(tx-e.x)*.05;else e.x-=v*Math.min(1.6,(e.t-hold)/30)},
  swoop:(v,dir)=>e=>{const a=PI+clamp((e.t-36)*.02,0,PI*.92)*dir;e.x+=Math.cos(a)*v;e.y+=Math.sin(a)*v},
  dash:(tx,wait=46)=>e=>{if(e.t<wait)e.x+=(tx-e.x)*.08;else{if(e.da===undefined)e.da=aimA(e);e.x+=Math.cos(e.da)*5.5;e.y+=Math.sin(e.da)*5.5}},
  ground:()=>e=>{e.x-=G.scrollV*.86},
  drift:(v,tx)=>e=>{e.x-=e.x>tx?v*2.4:v*.32}
};
// ── 사격 패턴 ─────────────────────────────────────────────
const canShoot=e=>e.x>70&&e.x<W-2;
const F={
  aim:(n,k='orb',c='pink',v=2.4,cnt=1,sp=.24,st=26)=>e=>{if(e.t>st&&every(e.t,n)&&canShoot(e))fan(e.x,e.y,aimA(e),vS(v),nS(cnt),sp,k,c)},
  ring:(n,cnt,k='dot',c='cyan',v=1.9,st=30)=>e=>{if(e.t>st&&every(e.t,n)&&canShoot(e))ring(e.x,e.y,vS(v),rS(cnt),e.t*.07,k,c)},
  burst:(n,k,c,v)=>e=>{if(e.t>30&&e.t%n<14&&e.t%4===0&&canShoot(e))bul(e.x,e.y,aimA(e),vS(v),k,c)},
};
const ET={
  wisp:{s:()=>SP.wisp,hp:2,r:8,score:150},
  kite:{s:()=>SP.kite,hp:8,r:13,score:500,fire:F.aim(70,'rice','orange',2.4,1)},
  bicha:{s:()=>SP.bicha,hp:12,r:15,score:800,coins:2,fire:F.aim(58,'orb','orange',2.5,2,.26)},
  jang:{s:()=>SP.jang,hp:22,r:15,score:1000,coins:3,ground:true,m:M.ground(),fire:F.aim(66,'needle','red',3,1)},
  goblin:{s:()=>SP.goblin,hp:75,r:20,score:4000,coins:6,big:true,fire:F.ring(62,12,'orb','red',2)},
  crow:{s:()=>SP.crow,hp:4,r:11,score:250},
  foxfire:{s:()=>SP.foxfire,hp:3,r:8,score:200,fire:F.aim(110,'dot','pink',2.2)},
  ice:{s:()=>SP.ice,hp:16,r:14,score:900,coins:2,onDie(e){ring(e.x,e.y,vS(2.2),rS(10),rnd(TAU),'needle','cyan')}},
  monk:{s:()=>SP.monk,hp:26,r:16,score:1400,coins:3,fire:F.burst(90,'star','yellow',2.8)},
  yeti:{s:()=>SP.yeti,hp:110,r:28,score:5000,coins:8,big:true,fire:e=>{if(e.t>30&&every(e.t,50)&&canShoot(e))fan(e.x-14,e.y+14,aimA(e),vS(2.4),nS(5),.2,'needle','cyan')}},
  garg:{s:()=>SP.garg,hp:10,r:14,score:600,coins:2,fire:F.aim(90,'rice','violet',2.6)},
  eye:{s:()=>SP.eye,hp:24,r:13,score:1300,coins:3,fire:F.ring(70,10,'dot','violet',1.9)},
  knight:{s:()=>SP.knight,hp:48,r:17,score:2400,coins:4,fire:F.aim(60,'orb','blue',2.2,3,.18)},
  wyvern:{s:()=>SP.wyvern,hp:130,r:24,score:6000,coins:9,big:true,fire:e=>{if(e.t>30&&e.t%70<26&&e.t%4===0&&canShoot(e))bul(e.x-20,e.y,PI+Math.sin(e.t*.1)*.6,vS(3),'orb','orange')}},
  crys:{s:()=>SP.crys,hp:28,r:13,score:1500,coins:3,ground:true,m:M.ground(),fire:F.aim(46,'star','pink',2.4,1)},
  drone:{s:()=>SP.droneE,hp:6,r:12,score:400},
  fighter:{s:()=>SP.fighter,hp:12,r:13,score:800,coins:2,fire:F.aim(46,'needle','cyan',3.4,1)},
  sat:{s:()=>SP.sat,hp:40,r:17,score:2600,coins:4,fire:e=>{if(e.t>36&&every(e.t,130)&&canShoot(e))laser(e.x,e.y,aimA(e),{w:6,warn:44,dur:26,c:'#ff5a5a',len:760})}},
  mine:{s:()=>SP.mine,hp:18,r:11,score:900,coins:2,onDie(e){ring(e.x,e.y,vS(1.9),rS(12),rnd(TAU),'orb','red')}},
  pod:{s:()=>SP.pod,hp:150,r:24,score:6500,coins:10,big:true,fire:e=>{if(e.t>30&&every(e.t,40)&&canShoot(e)){ring(e.x,e.y,vS(1.8),rS(10),e.t*.05,'dot','cyan');bul(e.x-20,e.y,aimA(e),vS(3.4),'big','red')}}},
  turret:{s:()=>[SP.turret],hp:90,r:15,score:5000,coins:6},
  voidl:{s:()=>SP.voidl,hp:9,r:12,score:700,coins:2,fire:F.aim(72,'dot','violet',2.8,2,.3)},
  rift:{s:()=>SP.rift,hp:170,r:24,score:7000,coins:10,big:true,fire:e=>{if(e.t>30&&every(e.t,18)&&canShoot(e)){const a=e.t*.09;for(let i=0;i<3;i++)bul(e.x,e.y,a+i/3*TAU,vS(2),'rice','violet')}}},
  gargV:{s:()=>SP.gargV,hp:14,r:14,score:900,coins:2,fire:F.aim(70,'rice','violet',3,2)},
  eyeV:{s:()=>SP.eyeV,hp:32,r:13,score:1500,coins:3,fire:F.ring(56,12,'dot','pink',2)},
  crowV:{s:()=>SP.crowV,hp:6,r:11,score:350},
  bichaV:{s:()=>SP.bichaV,hp:18,r:15,score:1000,coins:2,fire:F.aim(46,'orb','violet',2.8,2)},
  droneV:{s:()=>SP.droneEV,hp:10,r:12,score:500},
  fighterV:{s:()=>SP.fighterV,hp:16,r:13,score:1000,coins:2,fire:F.aim(40,'needle','pink',3.6)},
};
function spawn(type,x,y,o={}){
  const d=ET[type];
  const e=Object.assign({type,x,y,t:0,s:d.s(),r:d.r,hp:d.hp*D.hp,score:d.score,coins:d.coins||1,big:d.big,ground:d.ground,m:d.m,fire:d.fire,onDie:d.onDie,hex:0,hexT:0,flash:0,inv:0},o);
  if(!e.m)e.m=M.str(2.4);
  EN.push(e);return e;
}
function updateEnemies(){
  for(const e of EN){
    if(e.dead)continue;e.t++;
    if(e.flash>0)e.flash--;
    if(e.hexT>0&&--e.hexT===0)e.hex=0;
    if(e.isBoss){updateBoss(e);continue}
    if(e.seized){e.x+=rnd(-.7,.7);e.y+=rnd(-.7,.7)}
    else{e.m(e);if(e.fire&&G.noFire<=0)e.fire(e)}
    if(e.x<-80||e.y<-90||e.y>H+90||(e.x>W+100&&e.t>70))e.dead=true,e.noReward=true;
  }
  for(let i=EN.length-1;i>=0;i--){const e=EN[i];
    if(e.dead){if(e.onDie&&!e.noReward&&G.noFire<=0)e.onDie(e);EN.splice(i,1)}}
}
function drawEnemy(e){
  const f=e.s.length===1?e.s[0]:e.s[Math.floor(e.t/6)%e.s.length];
  if(e.spin)dr(f,e.x,e.y,e.t*e.spin,1,1,e.flash>0&&e.flash%2===1);
  else dr(f,e.x,e.y,0,1,1,e.flash>0&&e.flash%2===1);
  drawMarks(e,e.x,e.y-e.r-5);
}
function drawMarks(e,x,y){
  if(e.hex>0){g.fillStyle='#ff2b66';for(let i=0;i<e.hex;i++)g.fillRect(x-(e.hex*3)/2+i*3,y,2,2)}
  if(e.seized){g.globalCompositeOperation='lighter';g.globalAlpha=.5;g.drawImage(glow('#ff2b66'),e.x-22,e.y-22,44,44);g.globalAlpha=1;g.globalCompositeOperation='source-over'}
}
