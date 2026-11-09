'use strict';
// ── 적 스프라이트 (모두 왼쪽을 향함) ───────────────────────
function buildEnemyArt(){
  const fr=(n,w,h,fn)=>[...Array(n).keys()].map(f=>S(w,h,x=>fn(x,f)));
  // 1막 · 한양
  SP.wisp=fr(3,20,20,(x,f)=>{const q=[0,1.5,-1][f];poly(x,'#27c4ff',4,12,6+q,3,10,7,14-q,1,16,12,10,18);poly(x,'#c8f8ff',7,12,9,7,12,12,10,15);circ(x,'#123',8,11,1);circ(x,'#123',12,11,1)});
  SP.kite=fr(2,28,30,(x,f)=>{poly(x,'#efe6c8',4,3,24,3,24,25,4,25);circ(x,'#d7263d',14,13,5);poly(x,'#2b3a8c',4,3,24,3,24,6,4,6);pline(x,'#1b1320',1,4,3,24,25);pline(x,'#1b1320',1,24,3,4,25);rect(x,'#1b1320',11,10,2,2);rect(x,'#1b1320',16,10,2,2);pline(x,'#d7263d',1.5,14,25,14+(f?3:-3),29)});
  SP.bicha=fr(2,50,30,(x,f)=>{poly(x,'#8a5a2c',4,16,16,10,44,12,46,20,12,23);poly(x,'#5f3c1c',12,18,46,17,46,20,12,23);poly(x,'#efe6c8',18,2,36,1,38,12,20,12);rect(x,'#a3312e',26,1,2,11);pline(x,'#3a2410',1.4,27,12,27,20);pline(x,'#cbb98a',2,f?10:20,5,f?44:34,5);rect(x,'#2b1a10',8,17,4,2);circ(x,'#ffbf3a',5,17,1.6)});
  SP.jang=fr(1,24,44,x=>{poly(x,'#6e4a28',6,6,18,6,19,42,5,42);ell(x,'#8a5e34',12,7,7,5);poly(x,'#1b1320',7,15,11,13,11,17);poly(x,'#1b1320',17,15,13,13,13,17);poly(x,'#efe6c8',8,24,16,24,15,28,9,28);rect(x,'#1b1320',11,24,2,4);rect(x,'#d7263d',7,31,10,2);rect(x,'#d7263d',7,36,10,2);poly(x,'#27292f',2,4,22,4,18,0,6,0)});
  SP.goblin=fr(2,44,44,(x,f)=>{ell(x,'#e8e2f0',20,38,17,5);ell(x,'#c2bcd4',28,39,9,3);poly(x,'#c23b3b',10,12,14,4,32,4,36,14,34,32,12,32);poly(x,'#ffd76a',13,6,10,-2,18,3);poly(x,'#ffd76a',32,6,37,-2,28,3);circ(x,'#fff',17,14,3.5);circ(x,'#fff',27,14,3.5);circ(x,'#1b1320',16,14,1.6);circ(x,'#1b1320',26,14,1.6);poly(x,'#fff',16,22,20,28,23,22,27,28,30,22);poly(x,'#7a4a24',f?2:6,f?20:16,8,34,12,32,f?8:12,f?16:12);circ(x,'#c9973c',f?3:7,f?19:15,1.6);rect(x,'#2c5ca8',12,28,22,4)});
  // 2막 · 설원
  SP.crow=fr(2,34,24,(x,f)=>{poly(x,'#141626',8,10,14,6,26,8,32,12,26,15,12,15);poly(x,'#ffbf3a',2,11,8,9,8,13);circ(x,'#ff4040',11,9.5,1.2);if(f)poly(x,'#232a44',14,10,24,10,28,23,18,19);else poly(x,'#232a44',14,10,24,10,28,0,18,3);pline(x,'#141626',1,26,14,30,20);pline(x,'#141626',1,23,15,25,21)});
  SP.foxfire=SP.wisp.map(s=>tinted(s,'hue-rotate(160deg) saturate(1.6)'));
  SP.ice=fr(1,30,30,x=>{poly(x,'#7fd8ff',15,1,22,11,29,15,22,19,15,29,8,19,1,15,8,11);poly(x,'#dcf6ff',15,6,19,13,24,15,19,17,15,24,11,17,6,15,11,13);circ(x,'#1a5a8a',15,15,2.6)});
  SP.monk=fr(2,40,42,(x,f)=>{ell(x,'#dfe9f8',20,36,17,5);ell(x,'#aebfd8',11,37,8,3);poly(x,'#3a3f6e',10,34,12,16,28,16,30,34);poly(x,'#d7263d',12,16,28,16,27,20,13,20);circ(x,'#e5bd97',20,10,6.5);rect(x,'#1b1320',15,9,3,1.5);rect(x,'#1b1320',22,9,3,1.5);pline(x,'#7a4a24',2,7,3,7,34);circ(x,f?'#ffe27a':'#ffbf3a',7,4,3.2)});
  SP.yeti=fr(1,66,66,x=>{poly(x,'#d4e6f4',7,50,3,24,14,8,32,3,52,8,62,24,58,50,48,62,17,62);poly(x,'#a5c6df',8,48,20,58,45,58,58,48,48,62,17,62);poly(x,'#5f8fb3',16,22,29,26,28,33,17,31);poly(x,'#5f8fb3',49,22,36,26,37,33,48,31);circ(x,'#7fe8ff',23,28,3);circ(x,'#7fe8ff',42,28,3);poly(x,'#14203a',18,41,48,41,44,54,22,54);poly(x,'#fff',20,41,26,41,23,47);poly(x,'#fff',46,41,40,41,43,47);poly(x,'#7fd8ff',14,10,6,0,22,6);poly(x,'#7fd8ff',52,10,60,0,44,6)});
  // 3막 · 부유성
  SP.garg=fr(2,42,34,(x,f)=>{f?poly(x,'#4d4a63',18,14,32,14,40,30,28,26):poly(x,'#4d4a63',18,14,32,14,40,1,28,5);poly(x,'#6c6887',12,12,30,12,34,24,14,26);circ(x,'#6c6887',10,12,7);poly(x,'#4d4a63',5,6,4,0,9,5);poly(x,'#4d4a63',13,6,14,0,10,5);circ(x,'#ffda4a',7,12,1.6);poly(x,'#fff',3,16,9,16,6,19);f?poly(x,'#57536f',20,14,28,14,20,31,14,26):poly(x,'#57536f',20,14,28,14,16,0,12,6)});
  SP.eye=fr(2,30,30,(x,f)=>{circ(x,'#5e1f6e',15,15,12);circ(x,'#f4e8d8',13,15,8.5);circ(x,'#d7263d',11,15,5);circ(x,'#1b1320',10,15,2.4);for(let i=0;i<5;i++){const a=i/5*TAU+f*.4;pline(x,'#5e1f6e',2,15+Math.cos(a)*11,15+Math.sin(a)*11,15+Math.cos(a)*14,15+Math.sin(a)*14)}});
  SP.knight=fr(2,40,50,(x,f)=>{poly(x,'#7f8fb5',14,10,30,10,34,36,12,36);poly(x,'rgba(150,180,255,.85)',12,36,34,36,f?36:30,49,24,42,f?12:18,49);circ(x,'#8d9cc2',22,8,7);rect(x,'#3b1050',16,7,10,2.4);rect(x,'#d7263d',22,0,3,4);poly(x,'#a23b4b',4,14,16,14,16,34,10,40,4,34);rect(x,'#e7c063',9,18,2,14);rect(x,'#5a6688',5,23,10,2)});
  SP.wyvern=fr(2,64,44,(x,f)=>{f?poly(x,'#a43a3a',26,18,44,18,56,42,36,34):poly(x,'#a43a3a',26,18,44,18,58,2,38,6);poly(x,'#c75045',12,18,20,14,48,16,62,24,48,28,22,28);circ(x,'#c75045',9,16,6.5);poly(x,'#ffd76a',1,14,6,12,6,18);circ(x,'#ffe27a',8,14,1.3);poly(x,'#8c99a8',26,4,36,4,38,16,26,16);circ(x,'#8c99a8',31,4,3.6);pline(x,'#c8a040',1.4,28,4,17,18)});
  SP.crys=fr(2,26,40,(x,f)=>{poly(x,'#2d2545',3,39,23,39,20,31,6,31);poly(x,f?'#ff77c8':'#c455ff',13,1,21,12,18,31,8,31,5,12);poly(x,'#ffd8f4',13,6,17,13,13,26,9,13)});
  // 4막 · 궤도
  SP.droneE=fr(2,28,28,(x,f)=>{poly(x,'#5e6a84',14,1,25,7,25,21,14,27,3,21,3,7);poly(x,'#3a4560',14,5,21,9,21,19,14,23,7,19,7,9);circ(x,f?'#ff4040':'#ff9a40',14,14,4);circ(x,'#fff',13,13,1.2)});
  SP.fighter=fr(1,48,24,x=>{poly(x,'#8894ac',2,12,20,7,44,6,46,18,20,17);poly(x,'#505c78',22,1,36,6,30,8);poly(x,'#505c78',22,23,36,18,30,16);poly(x,'#54e8ff',12,10.4,22,8.6,22,12);rect(x,'#ff7a1a',44,8,3,8)});
  SP.sat=fr(2,44,36,(x,f)=>{rect(x,'#2a4a9a',1,8,11,20);rect(x,'#2a4a9a',32,8,11,20);for(let i=0;i<4;i++){pline(x,'#5a8aee',1,1,12+i*4,12,12+i*4);pline(x,'#5a8aee',1,32,12+i*4,43,12+i*4)}rect(x,'#a8b4c8',12,16,20,4);circ(x,'#a8b4c8',22,18,11);circ(x,f?'#ff5a5a':'#b81c1c',18,18,6);circ(x,'#fff',16.5,16.5,2)});
  SP.mine=fr(2,26,26,(x,f)=>{for(let i=0;i<8;i++){const a=i/8*TAU;pline(x,'#7a8296',2.4,13,13,13+Math.cos(a)*12,13+Math.sin(a)*12)}circ(x,'#4c5468',13,13,8);circ(x,f?'#ff4040':'#6a1818',13,13,3.2)});
  SP.pod=fr(1,64,42,x=>{poly(x,'#6e7a94',4,21,18,5,58,5,62,21,58,37,18,37);poly(x,'#4a5470',18,27,60,27,58,37,18,37);rect(x,'#ffd42e',24,5,4,32);rect(x,'#ffd42e',44,5,4,32);poly(x,'#54e8ff',7,21,16,12,22,12,22,22);rect(x,'#ff7a1a',60,12,3,5);rect(x,'#ff7a1a',60,25,3,5)});
  // 5막 · 허무
  SP.voidl=fr(2,32,32,(x,f)=>{poly(x,'#1b0a3a',16,1,26,8,31,18,24,30,16,25,8,30,1,18,6,8);poly(x,'#54219a',16,6,23,11,26,18,21,25,16,21,11,25,6,18,9,11);circ(x,f?'#7dffd4':'#3df2c4',16,15,4);circ(x,'#07050f',15,15,2)});
  SP.rift=fr(2,54,54,(x,f)=>{poly(x,'#0b0620',27,2,36,14,50,12,44,26,52,40,36,40,27,52,18,40,2,40,10,26,4,12,18,14);poly(x,'#5b1fc4',27,10,33,20,43,19,39,27,44,35,33,35,27,44,21,35,10,35,15,27,11,19,21,20);ell(x,'#f4e8d8',27,27,12,8);circ(x,f?'#ff2b66':'#d7263d',24+f*2,27,5.4);circ(x,'#07050f',24+f*2,27,2.4)});
  ['garg','eye','crow','bicha','droneE','fighter'].forEach(k=>{SP[k+'V']=SP[k].map(s=>tinted(s,'hue-rotate(250deg) saturate(1.7) brightness(.82)'))});

  // ── 중간 보스 ────────────────────────────────────────────
  SP.m1=S(140,84,x=>{poly(x,'#8a5a2c',6,50,26,38,126,40,136,50,122,72,26,72);poly(x,'#5f3c1c',26,60,126,60,122,72,26,72);poly(x,'#efe6c8',38,6,66,2,70,38,44,38);poly(x,'#efe6c8',82,4,110,2,110,38,86,38);rect(x,'#a3312e',52,3,3,35);rect(x,'#a3312e',96,3,3,35);for(let i=0;i<5;i++){circ(x,'#20150c',42+i*20,54,5);circ(x,'#ffbf3a',42+i*20,54,2.6)}poly(x,'#c23b3b',2,44,16,36,20,52,10,58);circ(x,'#fff',9,44,2.4);circ(x,'#1b1320',8,44,1);rect(x,'#3a2410',66,18,3,24);rect(x,'#3a2410',98,16,3,24)});
  SP.m2=S(116,116,x=>{poly(x,'#d4e6f4',14,86,6,44,22,14,56,4,92,14,110,44,102,86,84,108,32,108);poly(x,'#9fc2de',14,84,32,100,84,100,102,84,84,108,32,108);poly(x,'#5f8fb3',26,38,50,46,48,60,30,56);poly(x,'#5f8fb3',86,38,64,46,66,60,84,56);circ(x,'#7fe8ff',38,50,5.4);circ(x,'#fff',36,48,2);circ(x,'#7fe8ff',76,50,5.4);circ(x,'#fff',74,48,2);poly(x,'#14203a',32,72,84,72,76,96,40,96);for(let i=0;i<5;i++){poly(x,'#fff',34+i*10,72,44+i*10,72,39+i*10,83);poly(x,'#fff',40+i*8,96,48+i*8,96,44+i*8,86)}poly(x,'#7fd8ff',22,16,8,0,36,8);poly(x,'#7fd8ff',92,16,106,0,80,8);poly(x,'#7fd8ff',52,6,58,-4,64,6)});
  SP.m3=S(120,130,x=>{poly(x,'#5a5570',34,40,86,40,96,104,24,104);poly(x,'#7d7897',44,44,76,44,82,92,38,92);circ(x,'#ff7a1a',60,68,12);circ(x,'#ffe27a',60,68,6);circ(x,'#7d7897',60,24,20);poly(x,'#3a3650',42,20,78,20,74,32,46,32);rect(x,'#ffbf3a',47,24,8,3);rect(x,'#ffbf3a',65,24,8,3);poly(x,'#5a5570',14,48,36,40,40,88,18,94);poly(x,'#5a5570',106,48,84,40,80,88,102,94);poly(x,'#7d7897',8,92,28,88,30,116,6,116);poly(x,'#7d7897',112,92,92,88,90,116,114,116);poly(x,'#3a3650',34,104,54,104,50,128,30,128);poly(x,'#3a3650',86,104,66,104,70,128,90,128)});
  SP.m4=S(132,88,x=>{poly(x,'#6e7a94',6,44,34,10,116,10,128,44,116,78,34,78);poly(x,'#4a5470',34,56,124,56,116,78,34,78);rect(x,'#ffd42e',60,10,6,68);rect(x,'#ffd42e',92,10,6,68);poly(x,'#54e8ff',12,44,30,24,44,24,44,46);circ(x,'#23293c',78,34,10);circ(x,'#ff5a5a',78,34,5.6);circ(x,'#fff',76,32,2);rect(x,'#ff7a1a',124,24,5,10);rect(x,'#ff7a1a',124,54,5,10)});

  // ── 보스 1: 철갑 귀선 ────────────────────────────────────
  SP.b1hull=S(260,120,x=>{
    poly(x,'#5c3a1c',8,76,30,62,232,62,254,74,236,104,28,104);
    x.fillStyle='#2e3442';x.beginPath();x.moveTo(30,64);x.bezierCurveTo(50,8,210,8,232,64);x.closePath();x.fill();
    x.fillStyle='#454d60';x.beginPath();x.moveTo(44,64);x.bezierCurveTo(66,20,196,20,218,64);x.closePath();x.fill();
    for(let j=0;j<4;j++)for(let i=0;i<14-j*2;i++){const px=46+j*14+i*14,py=58-j*11;poly(x,'#c4ccda',px,py,px+3,py-8,px+6,py)}
    for(let i=0;i<9;i++)pline(x,'#20150c',1,28+i*26,66,28+i*26,102);
    poly(x,'#3f2812',28,88,236,88,236,104,28,104);
    for(let i=0;i<5;i++){circ(x,'#141018',52+i*40,78,7);circ(x,'#ff7a1a',52+i*40,78,3.6)}
    for(let i=0;i<8;i++)pline(x,'#c9a062',3,44+i*25,98,34+i*25,118);
    rect(x,'#d7263d',128,8,4,20);poly(x,'#efe6c8',132,6,152,11,132,18);
  });
  SP.b1head=S(70,56,x=>{
    poly(x,'#2b7a5c',66,22,48,8,22,8,6,20,2,30,14,36,10,44,26,46,48,42,66,36);
    poly(x,'#1d5a44',66,30,48,40,26,46,10,44,14,36,40,34);
    poly(x,'#ffd76a',46,8,62,-4,54,12);poly(x,'#ffd76a',38,8,48,-6,44,10);
    circ(x,'#fff',26,17,5);circ(x,'#d7263d',24,17,2.8);
    poly(x,'#fff',4,30,9,36,13,29,18,36,22,30);poly(x,'#ff5a30',8,36,22,36,18,42,10,42);
    pline(x,'#ffd76a',1.6,6,22,0,16);pline(x,'#ffd76a',1.6,8,26,0,28);
  });
  // ── 보스 2: 구미호 ───────────────────────────────────────
  SP.b2body=S(150,150,x=>{
    poly(x,'#d7263d',44,146,52,84,74,70,104,70,120,92,128,146);poly(x,'#f3ead6',66,146,70,84,88,80,92,146);poly(x,'#e7c063',52,112,124,108,126,120,50,124);poly(x,'#7a1224',96,146,100,88,120,96,128,146);
    poly(x,'#f2eadf',22,50,14,0,44,24,70,18,96,24,126,0,118,50,108,72,84,82,74,106,62,82,36,72);
    poly(x,'#ffb0c2',24,40,20,12,40,28);poly(x,'#ffb0c2',116,40,120,12,100,28);
    poly(x,'#c7bcae',36,72,62,82,74,106,84,82,108,72,92,74,74,94,52,74);
    poly(x,'#e8b23a',38,46,60,50,58,57,42,55);poly(x,'#e8b23a',102,46,80,50,82,57,98,55);
    circ(x,'#b81c30',50,51,2.6);circ(x,'#b81c30',90,51,2.6);pline(x,'#20141c',1.4,36,44,60,48);pline(x,'#20141c',1.4,104,44,80,48);
    poly(x,'#20141c',68,92,80,92,74,102);
    poly(x,'#d7263d',66,30,70,16,74,30,70,38);circ(x,'#d7263d',48,63,2);circ(x,'#d7263d',92,63,2);
  });
  SP.b2tail=S(26,24,x=>{ell(x,'#f2eadf',13,12,12,9.6);ell(x,'#c7bcae',12,16,9,4)},{});
  SP.b2tip=S(30,26,x=>{ell(x,'#f2eadf',15,13,13,10);poly(x,'#ff6b8a',18,4,29,13,18,22,22,13);circ(x,'#ffc8d8',20,13,3)});
  SP.b2orb=S(26,26,x=>{circ(x,'#4ad8ff',13,13,11);circ(x,'#d8faff',10,10,4.4);arc(x,'#fff',1.3,13,13,8,.3,1.5)});
  // ── 보스 3: 쌍두룡 ───────────────────────────────────────
  const dragonHead=(c1,c2,c3)=>S(84,64,x=>{
    poly(x,c1,80,24,58,10,28,10,6,26,2,36,18,40,6,50,30,54,56,48,80,38);
    poly(x,c2,80,34,56,46,30,54,6,50,18,40,50,38);
    poly(x,c3,50,10,76,-2,66,14);poly(x,c3,38,10,58,-6,52,12);
    circ(x,'#ffd76a',32,22,5);circ(x,'#20141c',30,22,2.4);
    poly(x,'#fff',4,36,10,44,14,37,20,44,24,38);poly(x,'#fff',12,50,14,44,20,50);
  });
  SP.b3headR=dragonHead('#b52c2c','#7a1a24','#ffd76a');SP.b3headB=dragonHead('#2f6fb5','#1a3f7a','#c8f0ff');
  SP.b3neckR=S(30,30,x=>{circ(x,'#a02828',15,15,13);poly(x,'#e0a860',11,3,19,3,20,27,10,27)});
  SP.b3neckB=S(30,30,x=>{circ(x,'#28609e',15,15,13);poly(x,'#a0d4e8',11,3,19,3,20,27,10,27)});
  SP.b3body=S(170,150,x=>{ell(x,'#5a3a3e',84,80,66,50);ell(x,'#8f6a50',66,96,44,30);for(let i=0;i<6;i++)pline(x,'#5f4034',2,32+i*14,76,28+i*14,126);for(let i=0;i<6;i++)poly(x,'#ffd76a',46+i*18,34-Math.sin(i/5*PI)*6,54+i*18,12-Math.sin(i/5*PI)*6,62+i*18,34-Math.sin(i/5*PI)*6);poly(x,'#5a3a3e',140,70,168,56,166,112,140,106);circ(x,'#7dffd4',84,74,9);circ(x,'#fff',82,72,3)});
  SP.b3wing=S(150,120,x=>{poly(x,'#3d2433',10,108,8,52,28,6,146,2,112,42,126,52,90,70,100,84,58,92,60,104,30,104);pline(x,'#7c5266',3,12,106,28,6);pline(x,'#7c5266',3,12,106,146,2);pline(x,'#7c5266',3,12,106,126,52);pline(x,'#7c5266',3,12,106,100,84);pline(x,'#7c5266',3,12,106,60,104)},{ox:12,oy:106});
  // ── 보스 4: 자율 전함 ────────────────────────────────────
  SP.b4hull=S(330,290,x=>{
    poly(x,'#3d4660',60,145,100,40,250,20,328,50,328,240,250,270,100,250);
    poly(x,'#5a6682',96,145,124,62,240,44,300,60,300,230,240,246,124,228);
    poly(x,'#2c3248',0,145,62,108,116,116,116,174,62,182);
    poly(x,'#5a6682',12,145,64,120,104,124,104,166,64,170);
    rect(x,'#ffd42e',160,50,8,190);rect(x,'#ffd42e',232,48,8,196);
    for(let i=0;i<7;i++){rect(x,'#2c3248',136+i*24,92,14,6);rect(x,'#2c3248',136+i*24,192,14,6)}
    for(let i=0;i<14;i++)circ(x,i%3?'#54e8ff':'#ff7a1a',128+i*13,145+Math.sin(i)*2,1.8);
    poly(x,'#2c3248',170,20,250,12,258,40,178,48);poly(x,'#2c3248',170,270,250,278,258,250,178,242);
  });
  SP.b4core=[0,1].map(f=>S(46,46,x=>{circ(x,'#23293c',23,23,20);circ(x,f?'#ff7070':'#ff3a3a',23,23,13);circ(x,'#ffd8d8',20,20,5)}));
  SP.turret=S(42,34,x=>{ell(x,'#3d4660',24,22,16,11);poly(x,'#7a86a2',30,6,38,6,38,30,30,30);rect(x,'#8a96b2',2,13,28,4);rect(x,'#8a96b2',2,20,28,4);circ(x,'#ffbf3a',32,18,3)},{ox:26,oy:17});
  // ── 보스 5: 공허왕 ───────────────────────────────────────
  SP.b5halo=S(290,290,x=>{arc(x,'#e7c063',7,145,145,132);arc(x,'#6a2bd8',3,145,145,120);for(let i=0;i<24;i++){const a=i/24*TAU;poly(x,i%2?'#e7c063':'#ff2b66',145+Math.cos(a)*138,145+Math.sin(a)*138,145+Math.cos(a+.05)*124,145+Math.sin(a+.05)*124,145+Math.cos(a-.05)*124,145+Math.sin(a-.05)*124);}for(let i=0;i<6;i++){const a=i/6*TAU;circ(x,'#7dffd4',145+Math.cos(a)*132,145+Math.sin(a)*132,8);circ(x,'#07050f',145+Math.cos(a)*132,145+Math.sin(a)*132,3.5)}},{o:null});
  SP.b5body=S(190,220,x=>{poly(x,'#1a0f36',20,214,28,92,62,54,128,54,162,92,170,214);poly(x,'#35206a',46,206,52,100,76,74,114,74,138,100,144,206);poly(x,'#e7c063',84,74,106,74,112,190,95,212,78,190);poly(x,'#07050f',90,88,100,88,104,184,95,196,86,184);circ(x,'#7dffd4',95,120,9);circ(x,'#07050f',95,120,4);poly(x,'#e7c063',20,92,8,62,50,48,62,62);poly(x,'#e7c063',170,92,182,62,140,48,128,62);for(let i=0;i<3;i++){poly(x,'#ff2b66',30+i*10,210,36+i*10,180,42+i*10,210);poly(x,'#ff2b66',150-i*10,210,144-i*10,180,138-i*10,210)}});
  SP.b5mask=S(94,120,x=>{poly(x,'#e8e0d0',16,34,47,14,78,34,76,84,47,114,18,84);poly(x,'#b8ab94',47,114,18,84,16,34,28,40,28,80,47,96);poly(x,'#07050f',24,50,42,56,40,64,26,62);poly(x,'#07050f',70,50,52,56,54,64,68,62);circ(x,'#ff2b66',33,58,2.6);circ(x,'#ff2b66',61,58,2.6);poly(x,'#07050f',36,80,58,80,47,98);poly(x,'#e7c063',12,36,6,4,24,22,32,0,47,16,62,0,70,22,88,4,82,36,47,22);poly(x,'#7dffd4',47,34,53,44,47,52,41,44)});
  SP.b5arm=S(130,44,x=>{poly(x,'#35206a',128,12,84,8,74,32,128,34);poly(x,'#e7c063',86,6,72,4,62,36,76,36);poly(x,'#1a0f36',74,10,20,14,20,30,70,34);poly(x,'#e7c063',28,10,12,8,12,36,28,34);circ(x,'#e8e0d0',8,22,7.6);pline(x,'#e8e0d0',2.4,6,16,0,10);pline(x,'#e8e0d0',2.4,3,20,-2,18);pline(x,'#e8e0d0',2.4,3,26,-2,28);circ(x,'#7dffd4',8,22,3)},{ox:124,oy:22});
}

// ── 스테이지 배경 ──────────────────────────────────────────
const BW=960;const BG=[];
function pn(x,seed,amps){let s=0;for(let i=0;i<amps.length;i++)s+=Math.sin(x/BW*TAU*(i*2+1+seed%3)+seed*(i+1)*1.7)*amps[i];return s}
function tile(fn){return mk(BW,H,x=>{for(const o of[-BW,0,BW]){x.save();x.translate(o,0);fn(x);x.restore()}})}
function ridge(x,c,base,seed,amps){x.fillStyle=c;x.beginPath();x.moveTo(0,H);for(let i=0;i<=BW;i+=3)x.lineTo(i,base+pn(i,seed,amps));x.lineTo(BW,H);x.closePath();x.fill()}
function seeded(s){return()=>{s=(s*16807)%2147483647;return(s&0xffff)/0xffff}}
function roof(x,c,cx,y,w,h){
  x.fillStyle=c;x.beginPath();x.moveTo(cx-w/2-7,y-5);
  x.quadraticCurveTo(cx-w/2+w*.14,y,cx-w/2+w*.2,y-h);x.lineTo(cx+w/2-w*.2,y-h);
  x.quadraticCurveTo(cx+w/2-w*.14,y,cx+w/2+7,y-5);
  x.quadraticCurveTo(cx+w/2-w*.1,y+4,cx+w/2-w*.1,y+4);x.lineTo(cx-w/2+w*.1,y+4);x.closePath();x.fill();
}
function buildBG(){
  // 1 한양
  const rA=seeded(911);const houses=[];for(let cx=0;cx<BW;){const w=46+rA()*44;houses.push({cx:cx+w/2,w,y:262+rA()*26,lit:rA()});cx+=w+rA()*16}
  const near=[];const rB=seeded(77);for(let cx=0;cx<BW;){const w=70+rB()*60;near.push({cx:cx+w/2,w,y:318+rB()*14,lit:rB()});cx+=w+rB()*30}
  BG[0]={sky:mk(W,H,x=>{x.fillStyle=grad(x,0,0,0,H,'#171238','#3d1c58','#8c3060','#e0693a','#f4a64c');x.fillRect(0,0,W,H);
      circ(x,'#ffe6b0',470,84,38);circ(x,'rgba(255,190,110,.35)',470,84,54);
      const r=seeded(5);for(let i=0;i<70;i++)rect(x,'#fff',r()*W,r()*150,1,1);
      for(let i=0;i<7;i++){ell(x,'rgba(30,14,50,.45)',r()*W,120+r()*90,70+r()*60,5+r()*5)}}),
    layers:[{c:tile(x=>{ridge(x,'#3a1a4c',226,2,[26,12,6]);ridge(x,'#29133e',258,4,[16,9,5])}),sp:.15},
      {c:tile(x=>{for(const h of houses){rect(x,'#2a1830',h.cx-h.w*.3,h.y-2,h.w*.6,70);if(h.lit>.4){rect(x,'#ffb050',h.cx-h.w*.16,h.y+9,7,8);rect(x,'#ffb050',h.cx+h.w*.04,h.y+9,7,8)}roof(x,'#1d1230',h.cx,h.y,h.w,12)}
        for(let i=0;i<3;i++){const cx=170+i*320;rect(x,'#332038',cx-54,206,108,110);rect(x,'#1d1230',cx-20,270,40,50);roof(x,'#1a1028',cx,206,132,22);rect(x,'#c43a32',cx-30,174,60,30);rect(x,'#ffbf60',cx-10,184,20,12);roof(x,'#1a1028',cx,172,92,22)}}),sp:.42},
      {c:tile(x=>{for(const h of near){rect(x,'#150c1e',h.cx-h.w*.32,h.y,h.w*.64,60);if(h.lit>.5)rect(x,'#d8622a',h.cx-6,h.y+11,12,8);roof(x,'#0e0816',h.cx,h.y,h.w,16)}}),sp:.85}]};
  // 2 백두 운해
  const peak=(x,c,cap,base,seed,a)=>{const pts=[];for(let i=0;i<=BW;i+=48){pts.push([i,base-(Math.abs(pn(i,seed,[1,.5]))*a)-((i/48)%2?0:a*.45)])}x.fillStyle=c;x.beginPath();x.moveTo(0,H);pts.forEach(p=>x.lineTo(p[0],p[1]));x.lineTo(BW,H);x.fill();
    pts.forEach(p=>{if(p[1]<base-a*.72)poly(x,cap,p[0],p[1],p[0]+15,p[1]+24,p[0]+5,p[1]+18,p[0],p[1]+26,p[0]-6,p[1]+17,p[0]-15,p[1]+24)})};
  const pines=[];const rC=seeded(301);for(let cx=0;cx<BW;cx+=22+rC()*44)pines.push({x:cx,h:30+rC()*30});
  BG[1]={sky:mk(W,H,x=>{x.fillStyle=grad(x,0,0,0,H,'#06102c','#123a66','#2c7a96','#a8d4e0');x.fillRect(0,0,W,H);
      const r=seeded(9);for(let i=0;i<130;i++)rect(x,'#fff',r()*W,r()*190,1,1);circ(x,'#f0f6ff',130,70,26);circ(x,'#123a66',141,62,23)}),
    layers:[{c:tile(x=>peak(x,'#34557f','#dcecff',250,3,110)),sp:.12},
      {c:tile(x=>{peak(x,'#22406a','#c2d9f4',292,5,90);const r=seeded(44);for(let i=0;i<46;i++)ell(x,'rgba(226,240,255,.8)',r()*BW,282+r()*40,40+r()*56,8+r()*9)}),sp:.36},
      {c:tile(x=>{ridge(x,'#c9dcef',334,1,[8,5]);for(const p of pines){poly(x,'#183058',p.x,330-p.h,p.x+13,330,p.x-13,330);poly(x,'#eaf4ff',p.x,330-p.h,p.x+5,330-p.h+12,p.x,330-p.h+9,p.x-5,330-p.h+12)}}),sp:.9}]};
  // 3 부유성
  const spire=(x,c,cx,base,w,h)=>{rect(x,c,cx-w/2,base-h,w,h);poly(x,c,cx-w*.8,base-h,cx,base-h-w*2.2,cx+w*.8,base-h)};
  const isl=(x,c,c2,cx,y,w)=>{poly(x,c,cx-w/2,y,cx+w/2,y,cx+w*.22,y+w*.3,cx+w*.05,y+w*.44,cx-w*.14,y+w*.3);rect(x,c2,cx-w/2,y-3,w,5)};
  BG[2]={sky:mk(W,H,x=>{x.fillStyle=grad(x,0,0,0,H,'#2a0c3e','#7c1c4a','#d9502e','#f7bd5c');x.fillRect(0,0,W,H);circ(x,'#ffe9a0',120,230,60);circ(x,'rgba(255,220,130,.35)',120,230,84);
      const r=seeded(13);for(let i=0;i<14;i++)ell(x,'rgba(90,30,70,.4)',r()*W,70+r()*230,90+r()*80,5+r()*7)}),
    layers:[{c:tile(x=>{const r=seeded(61);for(let i=0;i<9;i++){const cx=r()*BW,y=120+r()*110,w=70+r()*90;isl(x,'#7a3350','#a4586a',cx,y,w);for(let j=0;j<3;j++)spire(x,'#7a3350',cx-w*.25+j*w*.25,y-2,7,18+r()*22)}}),sp:.13},
      {c:tile(x=>{for(let i=0;i<3;i++){const cx=140+i*320;isl(x,'#3f1c3c','#5d2c4a',cx,244,260);rect(x,'#3f1c3c',cx-100,172,200,72);spire(x,'#3f1c3c',cx-100,172,26,42);spire(x,'#3f1c3c',cx+100,172,26,42);spire(x,'#3f1c3c',cx,172,38,88);for(let j=0;j<7;j++){rect(x,'#ffc060',cx-90+j*29,190,7,17);circ(x,'#ffc060',cx-86.5+j*29,190,3.5)}rect(x,'#2a1028',cx-22,210,44,34)}}),sp:.38},
      {c:tile(x=>{rect(x,'#1c0d26',0,328,BW,40);for(let i=0;i<24;i++){rect(x,'#1c0d26',i*40,316,24,14)}for(let i=0;i<6;i++){const cx=80+i*160;rect(x,'#150a1e',cx-11,286,22,46);poly(x,'#150a1e',cx-16,286,cx,258,cx+16,286);rect(x,'#d0482a',cx-3,298,6,11)}}),sp:.88}]};
  // 4 궤도
  BG[3]={sky:mk(W,H,x=>{rect(x,'#03040e',0,0,W,H);
      const r=seeded(23);const blob=(cx,cy,R,c)=>{const q=x.createRadialGradient(cx,cy,0,cx,cy,R);q.addColorStop(0,c);q.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=q;x.fillRect(cx-R,cy-R,R*2,R*2)};
      blob(180,110,190,'rgba(120,40,190,.55)');blob(430,70,160,'rgba(30,110,200,.45)');blob(540,190,140,'rgba(200,50,120,.3)');
      for(let i=0;i<240;i++){const s=r();rect(x,s>.85?'#fff':s>.5?'#9ab4ff':'#4c5a8c',r()*W,r()*H,s>.95?2:1,s>.95?2:1)}
      const q=x.createRadialGradient(330,800,500,330,800,560);q.addColorStop(0,'#1a6aa8');q.addColorStop(.86,'#2ca0d8');q.addColorStop(.94,'#a8f0ff');q.addColorStop(1,'rgba(120,220,255,0)');x.fillStyle=q;x.beginPath();x.arc(330,800,560,0,TAU);x.fill();
      x.fillStyle='rgba(230,245,255,.28)';for(let i=0;i<16;i++){const a=-PI/2+(r()-.5)*.95;x.beginPath();x.ellipse(330+Math.cos(a)*520,800+Math.sin(a)*520,30+r()*50,3+r()*4,a+PI/2,0,TAU);x.fill()}
      }),
    layers:[{c:tile(x=>{for(let i=0;i<4;i++){const cx=120+i*240,y=66+(i%2)*24;for(let j=0;j<9;j++){pline(x,'#3a4670',2,cx-110+j*25,y,cx-98+j*25,y+22);pline(x,'#3a4670',2,cx-98+j*25,y+22,cx-85+j*25,y)}pline(x,'#4e5c8a',3,cx-112,y,cx+110,y);pline(x,'#4e5c8a',3,cx-112,y+22,cx+110,y+22);rect(x,'#27457a',cx-34,y-30,68,28);rect(x,'#27457a',cx-34,y+24,68,28)}}),sp:.22},
      {c:tile(x=>{rect(x,'#1a2036',0,0,BW,20);for(let i=0;i<16;i++){rect(x,'#262e4a',i*60+6,20,46,10);rect(x,'#ffbf3a',i*60+24,23,10,3)}}),sp:.56},
      {c:tile(x=>{rect(x,'#12172a',0,332,BW,40);for(let i=0;i<12;i++){poly(x,'#12172a',i*80,332,i*80+16,316,i*80+64,316,i*80+80,332);rect(x,'#262e4a',i*80+22,321,36,4);circ(x,i%3?'#54e8ff':'#ff5a5a',i*80+40,338,1.8)}}),sp:.94}]};
  // 5 허무 (이전 세계의 파편)
  BG[4]={sky:mk(W,H,x=>{const q=x.createRadialGradient(320,180,10,320,180,400);q.addColorStop(0,'#3a1a78');q.addColorStop(.45,'#150a36');q.addColorStop(1,'#04020c');x.fillStyle=q;x.fillRect(0,0,W,H)}),
    layers:[{c:tile(x=>{const r=seeded(203);const src=[BG[0].layers[1].c,BG[2].layers[1].c,BG[3].layers[0].c];
        for(let i=0;i<9;i++){const cx=i*110+50,cy=70+r()*210,R=50+r()*34,a0=r()*TAU;x.save();x.beginPath();for(let j=0;j<5;j++){const a=a0+j/5*TAU;x.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R*(.7+r()*.5))}x.closePath();x.clip();rect(x,'#1a0f36',0,0,BW,H);x.globalAlpha=.8;x.drawImage(src[i%3],-r()*400,cy>180?-120:60);x.globalAlpha=1;x.restore();
        x.strokeStyle='#7dffd4';x.lineWidth=1;x.beginPath();for(let j=0;j<=5;j++){const a=a0+j/5*TAU;x.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R*.85)}x.stroke()}}),sp:.3},
      ]};
}
const BGP=[];
function drawBG(st,sc,t){
  const b=BG[st];g.drawImage(b.sky,0,0);
  if(st===1){ // 오로라
    g.globalCompositeOperation='lighter';
    for(let k=0;k<3;k++){g.strokeStyle=['rgba(70,255,170,.09)','rgba(120,160,255,.08)','rgba(190,110,255,.06)'][k];g.lineWidth=26-k*5;g.beginPath();for(let i=0;i<=W;i+=16){const y=56+k*20+Math.sin(i*.012+t*.01+k)*18+Math.sin(i*.03-t*.006)*8;i?g.lineTo(i,y):g.moveTo(i,y)}g.stroke()}
    g.globalCompositeOperation='source-over';
  }
  if(st===4){
    g.save();g.translate(320,180);g.lineWidth=1.5;
    for(let i=0;i<13;i++){const r=(t*1.6+i*34)%440;g.strokeStyle=`hsla(${265+i*7+t*.2},90%,${48+Math.sin(i)*12}%,${clamp(r/260,0,.55)})`;g.beginPath();for(let a=0;a<=6;a++){const q=a/6*TAU+t*.002*(i%2?1:-1)+i*.4;a?g.lineTo(Math.cos(q)*r,Math.sin(q)*r*.72):g.moveTo(Math.cos(q)*r,Math.sin(q)*r*.72)}g.closePath();g.stroke()}
    g.restore();
  }
  for(const l of b.layers){const ox=((sc*l.sp)%BW+BW)%BW;g.drawImage(l.c,-Math.floor(ox),0);if(BW-ox<W)g.drawImage(l.c,Math.floor(BW-ox),0)}
  // 입자
  const kind=st;
  while(BGP.length<(kind===0?46:kind===1?90:kind===2?20:kind===3?70:50))BGP.push({x:rnd(W),y:rnd(H),s:rnd(.4,1),p:rnd(TAU)});
  for(const p of BGP){
    if(kind===0){p.x-=1.3*p.s;p.y-=.55*p.s;p.y+=Math.sin(t*.04+p.p)*.3;if(p.y<0){p.y=H;p.x=rnd(W)}if(p.x<0)p.x=W;g.fillStyle=p.s>.7?'#ffb04a':'#e04a24';g.fillRect(p.x|0,p.y|0,p.s>.7?2:1,p.s>.7?2:1)}
    else if(kind===1){p.x-=(2+p.s*3);p.y+=.7+p.s;if(p.y>H){p.y=0}if(p.x<0)p.x=W;g.fillStyle='rgba(255,255,255,.8)';g.fillRect(p.x|0,p.y|0,p.s>.7?2:1,p.s>.7?2:1)}
    else if(kind===2){p.x-=3*p.s;if(p.x<-60)p.x=W+60;g.fillStyle='rgba(255,226,180,.12)';g.fillRect(p.x|0,p.y|0,50*p.s,2)}
    else if(kind===3){p.x-=9*p.s;if(p.x<0)p.x=W;g.fillStyle='#a0b8ff';g.fillRect(p.x|0,p.y|0,6*p.s+1,1)}
    else{const q=Math.atan2(p.y-180,p.x-320);p.x+=Math.cos(q)*3*p.s;p.y+=Math.sin(q)*3*p.s;if(p.x<0||p.x>W||p.y<0||p.y>H){p.x=320+rnd(-30,30);p.y=180+rnd(-30,30)}g.fillStyle=p.s>.7?'#7dffd4':'#b05cff';g.fillRect(p.x|0,p.y|0,2,2)}
  }
}
