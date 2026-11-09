'use strict';
// ── 절차적 스프라이트 도구 ─────────────────────────────────
// 벡터로 저해상도 캔버스에 그린 뒤 알파를 이진화하고 1px 외곽선을 둘러 픽셀아트 질감을 만든다.
const SP={};
const OUT=[14,8,26];
function mk(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');if(fn)fn(x,w,h);return c}
function pixelize(c,o){
  const x=c.getContext('2d'),w=c.width,h=c.height,im=x.getImageData(0,0,w,h),d=im.data,on=new Uint8Array(w*h);
  for(let i=0;i<w*h;i++){if(d[i*4+3]>=110){d[i*4+3]=255;on[i]=1}else d[i*4+3]=0}
  if(o)for(let y=0;y<h;y++)for(let X=0;X<w;X++){const i=y*w+X;if(on[i])continue;
    if((X>0&&on[i-1])||(X<w-1&&on[i+1])||(y>0&&on[i-w])||(y<h-1&&on[i+w])){d[i*4]=o[0];d[i*4+1]=o[1];d[i*4+2]=o[2];d[i*4+3]=255}}
  x.putImageData(im,0,0);return c;
}
function S(w,h,fn,o={}){
  const c=mk(w,h,fn);if(o.px!==false)pixelize(c,o.o===undefined?OUT:o.o);
  return{c,w,h,ox:o.ox===undefined?w/2:o.ox,oy:o.oy===undefined?h/2:o.oy,wh:null};
}
function whiteOf(s){if(!s.wh){s.wh=mk(s.w,s.h,x=>{x.drawImage(s.c,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#fff';x.fillRect(0,0,s.w,s.h)})}return s.wh}
function tinted(s,filter){
  const c=mk(s.w,s.h,x=>{if('filter'in x)x.filter=filter;x.drawImage(s.c,0,0)});
  return{c,w:s.w,h:s.h,ox:s.ox,oy:s.oy,wh:null};
}
function dr(s,x,y,rot,sc,al,fl){
  const c=fl?whiteOf(s):s.c;
  if(al!==undefined&&al<1)g.globalAlpha=al;
  if(rot||(sc&&sc!==1)){
    g.save();g.translate(x,y);if(rot)g.rotate(rot);if(sc)g.scale(sc,sc);g.drawImage(c,-s.ox,-s.oy);g.restore();
  }else g.drawImage(c,Math.round(x-s.ox),Math.round(y-s.oy));
  if(al!==undefined&&al<1)g.globalAlpha=1;
}
const poly=(x,c,...p)=>{x.fillStyle=c;x.beginPath();x.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)x.lineTo(p[i],p[i+1]);x.closePath();x.fill()};
const circ=(x,c,a,b,r)=>{x.fillStyle=c;x.beginPath();x.arc(a,b,r,0,TAU);x.fill()};
const ell=(x,c,a,b,rx,ry,rot=0)=>{x.fillStyle=c;x.beginPath();x.ellipse(a,b,rx,ry,rot,0,TAU);x.fill()};
const rect=(x,c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h)};
const pline=(x,c,w,...p)=>{x.strokeStyle=c;x.lineWidth=w;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)x.lineTo(p[i],p[i+1]);x.stroke()};
const arc=(x,c,w,a,b,r,s=0,e=TAU)=>{x.strokeStyle=c;x.lineWidth=w;x.beginPath();x.arc(a,b,r,s,e);x.stroke()};
const grad=(x,x0,y0,x1,y1,...st)=>{const q=x.createLinearGradient(x0,y0,x1,y1);st.forEach((c,i)=>q.addColorStop(i/(st.length-1),c));return q};

// ── 영웅 비행 스프라이트 (오른쪽을 향한 56×40, 4프레임) ────
const HERO_DRAW={
iron(x,f){const w=Math.sin(f/4*TAU);
  poly(x,'#ff7a1a',10,19,1-w*2,22,10,26);poly(x,'#ffe27a',10,20.5,5-w,22.5,10,24.5);
  poly(x,'#e9e2cf',22,12,9,8+w*2,4,13+w*3,15,18);poly(x,'#b9ae96',22,15,10,13+w*2,15,19);
  poly(x,'#a02028',11,18,25,15,27,24,12,26);poly(x,'#cf9f3c',8,18,15,17,15,26,8,26);rect(x,'#cf9f3c',19,16,2,9);
  poly(x,'#c52f34',24,12,38,11,40,22,26,25);
  for(let i=0;i<4;i++){circ(x,'#e7c063',27+i*3,14,.8);circ(x,'#e7c063',28+i*3,22,.8)}
  circ(x,'#54e8ff',34,17,3.2);circ(x,'#fff',34,17,1.5);
  poly(x,'#a02028',31,19,41,20,41,25,31,26);poly(x,'#dcae48',39,20,49,21,49,25,39,26);circ(x,'#9ff6ff',50,23,2.6);circ(x,'#fff',50,23,1.1);
  circ(x,'#c52f34',42,13,6.2);poly(x,'#e6bb52',43,10,48.6,12,48,17.5,44,18.5,42,14);rect(x,'#9ff6ff',45,12.6,3.4,1.4);
  ell(x,'#1e1630',42,7.6,12,2.3,-.12);poly(x,'#1e1630',37.5,7.6,38,1.6,46,1.2,46.5,7);rect(x,'#e7c063',38,5.4,8.2,1.1);
},
thor(x,f){const w=Math.sin(f/4*TAU);
  poly(x,'#c81f2e',24,10,12,7+w,1,12+w*3,5,20-w*2,3,27+w*2,16,24,24,20);
  poly(x,'#7f1421',20,14,8,15+w*2,8,23,18,22);
  poly(x,'#39506e',12,18,26,15,28,24,13,26);poly(x,'#8f6a3c',8,19,15,18,15,26,8,26);
  poly(x,'#9fb4c8',25,11,39,11,41,22,27,25);circ(x,'#dfeaf5',30,15,2.2);circ(x,'#dfeaf5',35,15,2.2);circ(x,'#dfeaf5',30,20,2.2);circ(x,'#dfeaf5',35,20,2.2);
  rect(x,'#5d3f22',27,22,13,2);
  poly(x,'#e6c9a3',32,18,42,17,43,22,33,23);
  rect(x,'#7c5a35',41,14,3,14);poly(x,'#8c99a8',39,7,54,7,54,17,39,17);rect(x,'#c8d6e4',41,9,11,2);rect(x,'#6cc4ff',44,11,5,3);circ(x,'#e8fbff',46.5,12.4,1);
  circ(x,'#e6c9a3',43,12,5);
  poly(x,'#f2cd5a',38,7,33,3,28,11,33,18,39,15);poly(x,'#d9a93c',33,12,29,16,33,20,37,15);
  poly(x,'#aebccb',38,9,41,4,47,5,49,9);poly(x,'#e9f0f7',38,6,33,0,37,8);poly(x,'#e9f0f7',46,5,50,0,48,7);rect(x,'#1c2a3e',45,11,2.2,1.4);
},
vega(x,f){const w=Math.sin(f/4*TAU);
  ell(x,'rgba(255,200,90,.9)',8-w,21,6+w,3);
  poly(x,'#ffcf5e',38,6,24,3+w,12,6-w*2,20,10,10,13+w*2,24,14,36,15);
  poly(x,'#ff9e3a',36,8,24,8+w,16,10,26,12);
  poly(x,'#3b2a78',11,19,26,16,27,24,12,25);poly(x,'#e7c063',6,19,13,19,13,25,6,25);
  poly(x,'#5a3fb0',25,12,39,12,41,21,27,24);poly(x,'#d43a5c',28,13,37,13,38,20,30,22);
  poly(x,'#ffe27a',33,13.5,34.2,16,36.8,16.4,34.9,18,35.4,20.6,33,19.4,30.8,20.6,31.3,18,29.4,16.4,32,16);
  poly(x,'#5a3fb0',33,19,44,19,44,24,34,25);poly(x,'#e7c063',42,19,49,19,49,24,42,24);circ(x,'#fff1b0',51,21.5,3);circ(x,'#fff',51,21.5,1.4);
  circ(x,'#ecc6a0',42,11.5,5.2);poly(x,'#ffcf5e',38,6,44,4,48,8,44,8,40,11,38,12);rect(x,'#fff',44.4,11,2.4,1.6);
},
strange(x,f){const w=Math.sin(f/4*TAU);
  poly(x,'#c5243a',25,8,13,4+w*2,3,9+w*3,8,15,2,21-w*2,12,24,25,20);
  poly(x,'#e7c063',24,8,14,5+w*2,14,6.6+w*2,24,10);
  poly(x,'#22407d',10,18,26,15,27,25,11,26);poly(x,'#172c58',12,22,26,21,27,25,11,26);
  poly(x,'#2c55a0',25,11,39,11,41,22,27,25);poly(x,'#efe7d3',33,11,37,11,38,19,35,22);rect(x,'#e7c063',26,19,14,2);
  circ(x,'#e7c063',35,16,2.8);circ(x,'#3df2c4',35,16,1.5);
  poly(x,'#2c55a0',33,18,43,18,44,23,34,24);poly(x,'#efe7d3',42,18,46,18.4,46,23,42,23.4);circ(x,'#ecc6a0',48,20.5,2.4);
  arc(x,'#ffb43a',1.2,51,20.5,3.4);
  circ(x,'#ecc6a0',43,12,5);poly(x,'#191627',38,10,40,6,46,6,48,9,44,9,41,12,39,14);
  ell(x,'#191627',42,5,2.4,2.6);rect(x,'#e7c063',38.6,8.2,9,1);rect(x,'#191627',45,11.6,2,1.3);poly(x,'#191627',43,16,44.4,20,45.6,16);
},
witch(x,f){const w=Math.sin(f/4*TAU);
  poly(x,'#a4123c',24,12,12,10+w*2,1,17+w*3,8,20,2,28-w*2,14,25,26,22);
  poly(x,'#6c0d2e',22,17,10,18+w,11,24,20,22);
  poly(x,'#e0416f',4,17+w*2,1,12+w*3,8,14);
  poly(x,'#31101f',12,19,26,17,27,24,13,25);poly(x,'#6c0d2e',8,19,14,19,14,25,8,25);
  poly(x,'#c9184f',25,12,38,12,40,21,27,24);poly(x,'#8c1038',29,13,35,13,36,21,30,23);circ(x,'#ff7aa8',33,16,1.5);
  poly(x,'#ecc6a0',33,18,44,18,44,22,34,23);poly(x,'#c9184f',36,17.6,41,17.8,41,22.6,36,22.8);
  circ(x,'#ff4080',47,20,3);circ(x,'#ffc0d8',47,20,1.3);pline(x,'#ff2b66',1,44,22,47,26+w,51,23,53,27-w);pline(x,'#ff2b66',1,44,18,48,14-w,51,17,54,13+w);
  poly(x,'#8a1a2b',38,7,31,6+w,24,12,26,18,33,15,39,16);
  circ(x,'#ecc6a0',42.4,12,5);poly(x,'#8a1a2b',38,8,41,6,46,7,42,10,39,14);
  poly(x,'#c9184f',39,9,41,1,44,6,47,0.5,48,9,43.6,8);circ(x,'#ff7aa8',44,7,1);rect(x,'#2a0a18',45,11.6,2,1.3);
},
vision(x,f){const w=Math.sin(f/4*TAU);
  poly(x,'#e9c75a',25,11,12,9+w*2,2,15+w*3,7,20,3,28-w*2,15,26,26,21);poly(x,'#b1912f',22,15,11,16+w,11,24,20,22);
  poly(x,'#25706e',11,18,26,16,27,24,12,26);poly(x,'#163f4a',7,19,13,19,13,26,7,26);
  poly(x,'#2f8f88',25,12,39,12,41,21,27,24);poly(x,'#6a4fae',29,13,38,13,39,21,31,23);
  pline(x,'#e9c75a',.9,30,14,37,20);pline(x,'#e9c75a',.9,37,14,31,21);
  poly(x,'#2f8f88',33,18,44,18,44,23,34,24);poly(x,'#163f4a',41,18,47,18,47,23,41,23);
  circ(x,'#2f8f88',42.4,12,5.4);poly(x,'#24746e',38,9,44,7,47,9,43,10,40,14);
  rect(x,'#d9fff0',45,11.6,2.6,1.3);poly(x,'#7dffb0',44,5.4,46.8,7.4,46,10,43.2,9.6);circ(x,'#fff',45,7.6,.9);
  rect(x,'#7dffb0',47,20,6,1);circ(x,'#7dffb0',53,20.5,1.5);
}};

// ── 초상화 (96×118) ────────────────────────────────────────
const HERO_ORDER=['iron','thor','vega','strange','witch','vision'];
function face(x,sk,shadow,eye='#16121f'){
  ell(x,sk,48,50,17,22);poly(x,shadow,31,52,36,68,48,73,41,66,35,52);
  ell(x,'#fff',41,49,3.5,1.9);ell(x,'#fff',56,49,3.5,1.9);circ(x,eye,41.5,49,1.6);circ(x,eye,56,49,1.6);
  pline(x,'#2b1a28',1.6,36,44,45,44);pline(x,'#2b1a28',1.6,52,44,61,44);
  pline(x,shadow,1.1,48,52,47,59,50,60);pline(x,'#7a3a3e',1.2,43,65,53,65);
}
const PORT={
iron(x,w,h){x.fillStyle=grad(x,0,0,0,h,'#3a1216','#7a2a1c','#d8862e');x.fillRect(0,0,w,h);
  for(let i=0;i<7;i++)arc(x,'rgba(255,200,120,.16)',2,70,86,10+i*11);
  poly(x,'#efe8d4',6,118,12,84,34,76,62,76,84,84,90,118);poly(x,'#c52f34',22,118,26,86,70,86,74,118);
  for(let i=0;i<6;i++)for(let j=0;j<3;j++)circ(x,'#e7c063',28+i*8,92+j*10,1.2);
  circ(x,'#e7c063',48,103,9);circ(x,'#54e8ff',48,103,6.5);circ(x,'#fff',48,103,3);
  face(x,'#e5bd97','#b98a6a');rect(x,'#e6bb52',28,47,40,6);rect(x,'#9ff6ff',36,48.4,8,3);rect(x,'#9ff6ff',52,48.4,8,3);rect(x,'#c52f34',46,47,4,6);
  poly(x,'#231a2a',38,74,48,80,58,74,56,66,50,70,46,70,40,66);
  ell(x,'#1a1228',48,30,41,6.5,-.04);poly(x,'#1a1228',30,30,31,6,65,6,66,30);rect(x,'#e7c063',30,23,36,3.4);
  pline(x,'#e7c063',1.4,32,33,29,60);pline(x,'#e7c063',1.4,64,33,67,60);},
thor(x,w,h){x.fillStyle=grad(x,0,0,0,h,'#10223f','#2c5a8c','#8cc8ea');x.fillRect(0,0,w,h);
  pline(x,'#d6f2ff',2,80,0,70,22,82,34,72,60);pline(x,'#d6f2ff',1.4,14,8,24,30,12,44);
  poly(x,'#c81f2e',0,118,2,88,30,76,66,76,94,88,96,118);poly(x,'#9fb4c8',22,118,28,84,68,84,74,118);
  for(let i=0;i<3;i++)for(let j=0;j<2;j++)circ(x,'#e6eef6',36+i*12,94+j*12,3.6);
  poly(x,'#f2cd5a',26,44,28,18,48,10,68,18,70,44,72,84,62,76,62,46,34,46,34,76,24,84);
  face(x,'#ecc9a6','#c09a78','#3b7bd1');poly(x,'#d9a93c',36,66,38,74,48,79,58,74,60,66,54,69,48,67,42,69);
  poly(x,'#aebccb',28,32,32,14,48,8,64,14,68,32,48,28);rect(x,'#6cc4ff',44,18,8,8);
  poly(x,'#e9f0f7',30,26,14,2,20,24,28,34);poly(x,'#e9f0f7',66,26,82,2,76,24,68,34);},
vega(x,w,h){x.fillStyle=grad(x,0,0,0,h,'#0d0a2c','#2a1f6c','#6a3ea8');x.fillRect(0,0,w,h);
  for(let i=0;i<34;i++)circ(x,'#fff',(i*37)%96,(i*59)%118,i%5?.5:1.1);
  for(let i=0;i<14;i++){const a=i/14*TAU;pline(x,'rgba(255,210,110,.55)',3,48,50,48+Math.cos(a)*62,50+Math.sin(a)*62)}
  poly(x,'#5a3fb0',8,118,14,86,36,78,60,78,82,86,88,118);poly(x,'#d43a5c',28,118,32,86,64,86,68,118);
  poly(x,'#ffe27a',48,88,51.5,96,60,97,53.5,102,55.5,111,48,106.5,40.5,111,42.5,102,36,97,44.5,96);
  poly(x,'#ffcf5e',26,76,24,38,34,18,48,14,64,18,72,38,70,76,62,62,62,44,48,34,36,44,34,62);
  face(x,'#ecc6a0','#bd9270','#ffdf8a');ell(x,'#ffe9a8',41,49,3.6,2);ell(x,'#ffe9a8',56,49,3.6,2);
  poly(x,'#ffe27a',34,34,48,22,60,30,50,30,40,40);},
strange(x,w,h){x.fillStyle=grad(x,0,0,0,h,'#11233f','#1f3c58','#6f6236');x.fillRect(0,0,w,h);
  arc(x,'#ffb43a',2,48,54,44);arc(x,'#ffb43a',1,48,54,38);
  for(let i=0;i<8;i++){const a=i/8*TAU;const cx=48+Math.cos(a)*41,cy=54+Math.sin(a)*41;for(let j=0;j<3;j++)pline(x,'#ffb43a',1.4,cx-4,cy-3+j*3,cx+4,cy-3+j*3)}
  poly(x,'#c5243a',2,118,6,76,30,62,66,62,90,76,94,118);poly(x,'#7e1427',14,118,26,84,34,118);poly(x,'#7e1427',82,118,70,84,62,118);
  poly(x,'#2c55a0',28,118,32,84,64,84,68,118);poly(x,'#efe7d3',42,118,44,78,52,78,54,118);
  circ(x,'#e7c063',48,96,8);circ(x,'#3df2c4',48,96,5);circ(x,'#0c5a4a',48,96,2);
  face(x,'#e6c29e','#b48d6c');poly(x,'#191627',32,48,32,28,48,20,64,28,64,48,60,36,48,31,36,36);
  poly(x,'#efefef',32,30,34,36,36,30);poly(x,'#191627',42,12,48,6,54,12,54,24,42,24);rect(x,'#e7c063',31,32,34,2.6);
  poly(x,'#191627',38,66,48,86,58,66,54,68,48,66,42,68);},
witch(x,w,h){x.fillStyle=grad(x,0,0,0,h,'#1a0612','#4a0b24','#a8123f');x.fillRect(0,0,w,h);
  for(let i=0;i<5;i++){x.strokeStyle='rgba(255,60,110,.5)';x.lineWidth=2;x.beginPath();x.moveTo(0,20+i*22);x.bezierCurveTo(30,i*14,60,110-i*16,96,30+i*18);x.stroke()}
  poly(x,'#8a1033',0,118,4,84,30,74,66,74,92,84,96,118);poly(x,'#c9184f',28,118,32,84,64,84,68,118);poly(x,'#31101f',40,118,44,86,52,86,56,118);
  poly(x,'#8a1a2b',22,84,24,36,36,18,48,14,62,18,72,36,76,84,62,74,62,44,34,44,34,74);
  face(x,'#efcfb2','#bd9275','#c81f53');ell(x,'rgba(255,50,110,.35)',41,49,6,4);ell(x,'rgba(255,50,110,.35)',56,49,6,4);
  poly(x,'#c9184f',32,36,28,8,40,24,48,2,56,24,68,8,64,36,48,32);circ(x,'#ff7aa8',48,24,3);
  circ(x,'#ff4080',16,104,7);circ(x,'#ffc0d8',16,104,3);circ(x,'#ff4080',80,104,7);circ(x,'#ffc0d8',80,104,3);},
vision(x,w,h){x.fillStyle=grad(x,0,0,0,h,'#071a24','#124146','#6c8a54');x.fillRect(0,0,w,h);
  for(let i=0;i<9;i++)pline(x,'rgba(125,255,176,.22)',1,0,i*14,96,i*14);for(let i=0;i<8;i++)pline(x,'rgba(125,255,176,.22)',1,i*14,0,i*14,118);
  poly(x,'#e9c75a',2,118,8,78,30,68,66,68,88,78,94,118);poly(x,'#b1912f',12,118,28,84,36,118);
  poly(x,'#2f8f88',26,118,30,84,66,84,70,118);poly(x,'#6a4fae',36,118,38,88,58,88,60,118);
  pline(x,'#e9c75a',1.5,36,92,60,116);pline(x,'#e9c75a',1.5,60,92,36,116);
  face(x,'#2f8f88','#1d6460','#d9fff0');ell(x,'#d9fff0',41,49,3.5,1.7);ell(x,'#d9fff0',56,49,3.5,1.7);
  pline(x,'#1d6460',1.2,31,40,40,28);pline(x,'#1d6460',1.2,65,40,56,28);pline(x,'#1d6460',1.2,36,60,40,72);pline(x,'#1d6460',1.2,60,60,56,72);
  poly(x,'#24746e',31,40,34,26,48,20,62,26,65,40,48,30);
  poly(x,'#7dffb0',48,24,55,31,51,40,45,40,41,31);poly(x,'#d4ffe4',48,27,51,31,48,36,45,31);}
};

// ── 탄환 ───────────────────────────────────────────────────
const BCOL={pink:['#ff4f9f','#ffe3f0'],red:['#ff3838','#ffe0d4'],orange:['#ff8418','#fff0c8'],yellow:['#ffd42e','#fffbdc'],green:['#3fe862','#e8ffe8'],
  cyan:['#26e0ff','#e6fdff'],blue:['#4a78ff','#e2eaff'],violet:['#ac55ff','#f2e6ff'],white:['#d8d8ff','#ffffff']};
const BK={dot:{s:11,r:2.4},orb:{s:15,r:3.6},big:{s:29,r:9},needle:{s:19,r:2.4},rice:{s:15,r:2.6},star:{s:15,r:3.4},petal:{s:15,r:3.2}};
const BCACHE={};
function BS(k,c){
  const key=k+c;if(BCACHE[key])return BCACHE[key];
  const z=BK[k].s,m=z/2,[o,i]=BCOL[c];
  const q=S(z,z,x=>{
    if(k==='dot'){circ(x,o,m,m,3.8);circ(x,i,m,m,2.2)}
    else if(k==='orb'){circ(x,o,m,m,5.8);circ(x,i,m,m,3.6)}
    else if(k==='big'){circ(x,o,m,m,12.6);circ(x,i,m,m,9);circ(x,'#fff',m-2,m-2,3.4)}
    else if(k==='needle'){poly(x,o,1,m,m,m-3,z-1,m,m,m+3);poly(x,i,4,m,m,m-1.2,z-3,m,m,m+1.2)}
    else if(k==='rice'){ell(x,o,m,m,6.4,3.4);ell(x,i,m,m,4,1.7)}
    else if(k==='star'){for(let n=0;n<2;n++){const R=n?3.8:6.6,r=n?1.7:2.9,c2=n?i:o;const p=[];for(let j=0;j<10;j++){const a=j/10*TAU-PI/2,q2=j%2?r:R;p.push(m+Math.cos(a)*q2,m+Math.sin(a)*q2)}poly(x,c2,...p)}}
    else if(k==='petal'){ell(x,o,m,m,6.4,3.8);poly(x,o,1.5,m,m,m-2,m,m+2);ell(x,i,m+1,m,3.2,1.5)}
  });
  return BCACHE[key]=q;
}
// 빛 입자(가산 혼합용)
const GLOWC={};
function glow(col){if(GLOWC[col])return GLOWC[col];return GLOWC[col]=mk(32,32,x=>{const q=x.createRadialGradient(16,16,0,16,16,16);q.addColorStop(0,'#fff');q.addColorStop(.3,col);q.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=q;x.fillRect(0,0,32,32)})}

function buildHeroArt(){
  SP.hero={};SP.port={};
  HERO_ORDER.forEach(id=>{
    SP.hero[id]=[0,1,2,3].map(f=>S(56,40,x=>HERO_DRAW[id](x,f)));
    SP.port[id]=S(96,118,PORT[id],{o:null});
  });
  // 영웅 탄환
  SP.ironB=S(18,8,x=>{ell(x,'#26d8ff',9,4,8,2.8);ell(x,'#e9fdff',11,4,5,1.4)},{o:null});
  SP.rocket=S(20,10,x=>{poly(x,'#8a2024',2,1,6,3,6,7,2,9);rect(x,'#d9d3c0',5,3,10,4);rect(x,'#c52f34',9,3,2,4);poly(x,'#e7c063',15,3,19,5,15,7)});
  SP.vegaB=S(16,8,x=>{ell(x,'#ffae2a',8,4,7,3);ell(x,'#fff6c8',10,4,4,1.5)},{o:null});
  SP.vegaBig=S(20,12,x=>{ell(x,'#ff8a2a',10,6,9,5);ell(x,'#fff6c8',12,6,6,3)},{o:null});
  SP.tal=S(16,10,x=>{rect(x,'#f3e6b0',1,1,14,8);rect(x,'#d22a2a',3,3,10,1);pline(x,'#d22a2a',1,5,7,8,4,11,7);},{o:[120,60,10]});
  SP.hex=S(14,14,x=>{circ(x,'#e01550',7,7,5.4);circ(x,'#ff86aa',7,7,2.6);pline(x,'#ff2b66',1,1,3,5,1);pline(x,'#ff2b66',1,13,11,9,13)},{o:null});
  SP.aionB=S(26,5,x=>{rect(x,'#50ff9c',1,1,24,3);rect(x,'#f4fff8',4,2,20,1)},{o:null});
  SP.hammer=S(30,30,x=>{rect(x,'#7c5a35',13.5,3,3,24);poly(x,'#8c99a8',4,5,26,5,26,16,4,16);rect(x,'#c8d6e4',6,7,18,2.4);rect(x,'#6cc4ff',12,10,6,4);circ(x,'#e8fbff',15,12,1.2)});
  SP.drone=[0,1].map(f=>S(44,30,x=>{
    poly(x,f?'#ffe27a':'#ff9e3a',7,14,1,17,7,20);poly(x,'#8c6a2a',8,12,20,10,22,20,9,21);
    poly(x,'#7d868f',20,8,32,8,34,18,22,20);circ(x,'#54e8ff',28,13,2.5);
    poly(x,'#60696f',24,16,36,16,36,20,24,21);circ(x,'#9ff6ff',37,18,2);
    circ(x,'#7d868f',34,8,4.6);rect(x,'#9ff6ff',35,6.6,3,1.3);ell(x,'#1e1630',34,4.4,8,1.6,-.1);rect(x,'#1e1630',31,0.6,6,4);
  }));
  SP.butterfly=[0,1].map(f=>S(16,14,x=>{const w=f?3:6.5;ell(x,'#ff4f88',8-w/1.3,5,w/1.4,4);ell(x,'#ff4f88',8+w/1.3,5,w/1.4,4);ell(x,'#ff9cbc',8-w/1.3,10,w/2,2.5);ell(x,'#ff9cbc',8+w/1.3,10,w/2,2.5);rect(x,'#2a0a18',7.3,3,1.4,9)}));
  // 아이템
  // 적 탄은 모두 곡선형이므로, 아이템은 각진 금테 패로 만들어 형태만으로 구분되게 한다
  const tag=(c1,c2,icon)=>S(26,32,x=>{
    poly(x,'#e7c063',9,1,17,1,19,5,7,5);rect(x,'#fff3c0',11,2,4,2);
    rect(x,'#e7c063',3,5,20,22);rect(x,'#fff3c0',3,5,20,1.4);rect(x,'#9a6a1c',3,25.6,20,1.4);
    rect(x,c1,5.5,7.5,15,17);rect(x,c2,5.5,7.5,15,3);
    icon(x);
    poly(x,'#e7c063',9,27,17,27,15,31,11,31);
  });
  const W_='#ffffff';
  SP.itemP=tag('#c8201f','#ff6a55',x=>{poly(x,W_,13,9,19,15,16.5,15,13,11.6,9.5,15,7,15);poly(x,W_,13,14,19,20,16.5,20,13,16.6,9.5,20,7,20);rect(x,W_,11.6,20,2.8,3)});
  SP.itemB=tag('#1f46c8','#6a90ff',x=>{const p=[];for(let i=0;i<16;i++){const a=i/16*TAU,r=i%2?3.3:7.6;p.push(13+Math.cos(a)*r,16+Math.sin(a)*r)}poly(x,'#ffe27a',...p);circ(x,W_,13,16,2.4)});
  SP.itemL=tag('#128a3c','#58e088',x=>{circ(x,W_,10,13.6,3.1);circ(x,W_,16,13.6,3.1);poly(x,W_,7,15,19,15,13,22.5)});
  SP.itemG=tag('#7420b8','#c07aff',x=>{poly(x,'#ffe27a',15,8.6,8,17,12,17,10.6,23.6,18,14.6,14,14.6)});
  SP.coin=[0,1,2,3].map(f=>S(11,11,x=>{const w=[4.4,3,1.2,3][f];ell(x,'#e0a830',5.5,5.5,w,4.4);ell(x,'#fff0b0',5.5,5.5,Math.max(.5,w-2.1),2.3);rect(x,'#a06a10',5,4,1,3)}));
}
