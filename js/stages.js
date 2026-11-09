'use strict';
// ── 스테이지 정보와 대사 ──────────────────────────────────
const STAGES=[
 {name:'제1막 · 불타는 한양',sub:'하늘이 찢어진 밤, 도성에 귀신과 비차가 쏟아진다',bgm:'s1',scroll:1.7},
 {name:'제2막 · 백두 운해',sub:'눈보라 너머, 천년 묵은 여우가 문을 지킨다',bgm:'s2',scroll:2.0},
 {name:'제3막 · 부유성 엘드크라운',sub:'찢어진 하늘로 흘러든 서쪽 왕국의 성',bgm:'s3',scroll:1.8},
 {name:'제4막 · 궤도요새 오메가',sub:'별 너머 제국의 무인 전함이 문을 열고 있다',bgm:'s4',scroll:2.4},
 {name:'종막 · 천문 너머',sub:'세 세계의 파편이 흐르는 허무의 경계',bgm:'s5',scroll:2.2},
];
const BOSS_TALK=[
 ['흑룡호 함장','도성은 이미 천문의 것이다. 조선의 쇠거북이 조선을 삼키는 꼴을 보아라!'],
 ['월화','후후, 여기까지 올라온 필멸자는 삼백 년 만이구나. 꼬리 하나쯤은 내어주마.'],
 ['바르노그','작은 것이여. 두 머리 중 어느 쪽에 먼저 먹히고 싶으냐.'],
 ['오메가-0','경고. 침입체 확인. 천문 개방 절차 98%. 제거를 시작합니다.'],
 ['무량','세 세계를 하나의 무(無)로 되돌리는 것이 어찌 악이겠느냐. 와라, 여섯 별의 마지막 불씨여.'],
];
const HERO_TALK={
 iron:['거북선을 하늘에 띄워? 설계는 좋은데 쓰임이 틀렸소.','꼬리가 아홉이면 제 화륜포도 아홉 배로 쏘면 그만이오.','용 비늘이라, 갑옷 재료로 탐이 나는구려.','이 철선을 내 공방으로 끌고 가고 싶을 지경이오.','무(無)라니. 나는 있는 걸 고쳐 쓰는 사람이오.'],
 thor:['하하! 나무 거북이라니, 이 땅의 축제는 참 별나군!','그 꼬리, 그롬으로 하나씩 묶어 주마!','내 고향의 용보다 머리 하나가 많을 뿐이다.','쇳덩이 주제에 천둥을 받아 낼 수 있겠느냐!','왕이라 자처했는가? 그럼 왕답게 쓰러져라!'],
 vega:['대기권 안 전투는 오랜만이네요. 금방 끝낼게요.','환영이든 실체든, 다 태우면 똑같아요.','용의 불꽃? 저는 항성 안에서도 날아 봤어요.','오메가급 전함이 여기 있다니. 연방 기록엔 없던 일이죠.','당신의 허무, 제 빛으로 다 채워 드리죠.'],
 strange:['도성의 시각이 어긋났소. 저 배가 원인이군.','천년의 도력이라, 시간 앞에선 하룻밤 꿈이오.','이 성은 본래 이 하늘의 것이 아니오. 돌려보내겠소.','일천사백만 번을 헤아려도 답은 하나였소.','내가 본 수많은 끝 가운데, 그대가 이기는 끝은 없소.'],
 witch:['불길이 예쁘네. 그래도 내가 다시 쓰겠어.','여우야, 저주는 내가 더 잘해.','이 성… 나를 가뒀던 탑과 같은 돌이야.','기계에게도 악몽을 꾸게 해 줄까.','없던 일로 만드는 건 내 전문이야. 너부터.'],
 vision:['흥미롭습니다. 목재 선체의 부양 원리는 비논리적입니다.','환영의 파장은 구분 가능합니다. 어느 쪽이 진짜인지도요.','두 개의 머리에 하나의 심장. 효율적이군요.','동족이여, 그대에게도 선택할 자유가 있었을 텐데요.','허무를 계산해 보았습니다. 결과는 “아직 아니다” 입니다.'],
};
const ENDINGS={
 iron:'천문이 닫힌 뒤, 윤화륜은 부서진 화륜갑을 끌고 공방으로 돌아갔다. 이튿날 한양에는 하늘을 나는 수레 설계도가 방으로 붙었고, 포도청은 다시 그를 찾기 시작했다.',
 thor:'하르칸은 그롬을 어깨에 메고 조선의 막걸리를 한 동이 비운 뒤 북쪽 하늘로 사라졌다. 천둥이 치는 밤이면 사람들은 그가 건배하는 소리라고 말한다.',
 vega:'베가 루멘은 연방에 보고서 한 줄을 남겼다. “위협 제거. 현지 음식 훌륭함.” 그리고 다음 구조 신호를 향해 빛처럼 날아갔다.',
 strange:'현월은 무너진 천문의 틈을 하나하나 봉인하고 앙부일구를 다시 목에 걸었다. 그는 이 결말이 몇 번째 시도였는지 아무에게도 말하지 않았다.',
 witch:'카르미나는 탑으로 돌아가지 않았다. 불탄 한양의 골목에 붉은 나비가 앉은 자리마다 무너진 집이 조용히 되살아났다는 이야기가 전해진다.',
 vision:'아이온-7은 궤도연구소 대신 한양의 작은 찻집을 택했다. 그는 매일 차를 우리는 법을 조금씩 틀리며, 그것이 인간다움의 일부라고 기록했다.',
};
// ── 스크립트 러너 ─────────────────────────────────────────
function fork(gen){G.co.push({g:gen,w:0,fn:null})}
function* chain(type,n,gap,y,o){for(let i=0;i<n;i++){spawn(type,W+24,typeof y==='function'?y(i):y,typeof o==='function'?o(i):o);yield gap}}
function runScript(){
  const list=G.co,len=list.length;
  for(let i=0;i<len;i++){const c=list[i];if(c.done)continue;
    if(c.w>0){c.w--;continue}
    if(c.fn){if(c.fn())c.fn=null;else continue}
    const r=c.g.next();
    if(r.done){c.done=true;if(i===0)G.mainDone=true}
    else if(typeof r.value==='number')c.w=r.value-1;
    else if(typeof r.value==='function')c.fn=r.value;
  }
  G.co=list.filter(c=>!c.done||list[0]===c);
}
function* mid(key,o){sfx('warn');G.warn=90;yield 90;const b=spawnBoss(key,o);yield()=>b.dead}
function* bigBoss(key,st){
  yield()=>!EN.some(e=>!e.dead&&!e.isBoss&&e.x<W+10);
  yield 40;
  G.warn=150;sfx('warn');playBGM(BOSS[key].bgm||'boss');yield 150;
  const b=spawnBoss(key);yield()=>b.active;
  G.dialog={i:0,lines:[{who:BOSS_TALK[st][0],text:BOSS_TALK[st][1],side:'r'},{who:CH().name,text:HERO_TALK[CH().id][st],side:'l'}]};
  yield()=>!G.dialog;
  yield()=>b.dead;
}
const sv=(v,a,f)=>({m:M.sine(v,a,f)});
function* scr0(){
  yield 110;
  yield* chain('wisp',8,12,90,sv(2.8,34,.06));yield 30;
  yield* chain('wisp',8,12,262,sv(2.8,34,.06));yield 30;
  spawn('kite',W+20,120,{m:M.hover(470,170),drop:'p'});spawn('kite',W+20,240,{m:M.hover(470,170)});yield 130;
  fork(chain('bicha',4,34,i=>54+i*26,{m:M.str(2.1)}));yield 180;
  fork(chain('jang',4,70,()=>288));
  fork(chain('wisp',12,10,()=>rnd(50,220),()=>sv(3,20,.08)));yield 200;
  spawn('goblin',W+30,160,{m:M.hover(460,240),drop:'p'});yield 200;
  fork(chain('kite',5,30,i=>50+i*44,{m:M.hover(380,120)}));yield 230;
  fork(chain('wisp',10,9,70,sv(3.4,10,.05)));fork(chain('wisp',10,9,290,sv(3.4,10,.05)));yield 170;
  yield* mid('m1');yield 60;
  spawn('kite',W+20,70,{m:M.hover(480,150),drop:'b'});
  fork(chain('bicha',6,28,()=>rnd(44,250),{m:M.str(2.5)}));yield 150;
  fork(chain('jang',5,58,()=>288));
  fork(chain('wisp',16,9,i=>180+Math.sin(i*.8)*130,()=>sv(3.2,8,.1)));yield 240;
  spawn('goblin',W+30,100,{m:M.hover(480,230),drop:'p'});spawn('goblin',W+30,250,{m:M.hover(480,230)});yield 240;
  fork(chain('bicha',5,30,i=>260-i*44,{m:M.str(2.8)}));yield 200;
  fork(chain('wisp',12,8,70,sv(3.6,14,.09)));fork(chain('jang',4,50,()=>288));yield 150;
  fork(chain('kite',6,26,i=>i%2?70:250,{m:M.hover(420,110)}));yield 210;
  fork(chain('goblin',3,90,i=>70+i*100,{m:M.hover(500,160)}));yield 330;
  spawn('kite',W+20,180,{m:M.hover(470,160),drop:'p'});
  fork(chain('bicha',8,20,i=>180+Math.sin(i*1.1)*120,{m:M.str(3)}));yield 240;
  fork(chain('wisp',20,6,i=>180+Math.cos(i*.45)*130,()=>sv(3.8,4,.1)));yield 200;
  yield* bigBoss('turtle',0);
}
function* scr1(){
  yield 100;
  yield* chain('crow',8,10,i=>80+i*14,{m:M.swoop(3.1,1)});yield 20;
  yield* chain('crow',8,10,i=>280-i*14,{m:M.swoop(3.1,-1)});yield 30;
  fork(chain('foxfire',14,10,()=>rnd(44,300),()=>sv(2.7,26,.07)));yield 150;
  spawn('monk',W+20,110,{m:M.hover(450,190),drop:'p'});spawn('monk',W+20,240,{m:M.hover(450,190)});yield 150;
  fork(chain('ice',4,46,i=>70+i*72,{m:M.str(1.8),spin:.03}));yield 220;
  spawn('yeti',W+40,170,{m:M.hover(470,250),drop:'p'});
  fork(chain('crow',10,14,i=>i%2?60:290,{m:M.str(4.2)}));yield 240;
  fork(chain('monk',4,40,i=>60+i*76,{m:M.hover(400,150)}));yield 240;
  yield* mid('m2');yield 50;
  fork(chain('crow',12,9,i=>180+Math.sin(i)*130,{m:M.str(4.4)}));yield 90;
  spawn('monk',W+20,180,{m:M.hover(470,200),drop:'b'});
  fork(chain('ice',6,36,()=>rnd(50,300),{m:M.str(2),spin:.03}));yield 220;
  fork(chain('foxfire',22,6,i=>180+Math.sin(i*.5)*140,()=>sv(3,6,.1)));yield 160;
  spawn('yeti',W+40,100,{m:M.hover(490,230),drop:'p'});spawn('yeti',W+40,260,{m:M.hover(490,230)});yield 260;
  fork(chain('monk',6,26,i=>40+i*50,{m:M.hover(440,110)}));yield 220;
  fork(chain('crow',16,7,i=>i%3*100+70,{m:M.swoop(3.6,1)}));yield 150;
  fork(chain('ice',8,28,i=>50+i*36,{m:M.str(2.2),spin:.03}));yield 260;
  fork(chain('yeti',3,110,i=>60+i*110,{m:M.hover(500,150)}));yield 400;
  spawn('monk',W+20,180,{m:M.hover(470,170),drop:'p'});
  fork(chain('foxfire',24,6,i=>i%2?60+i*5:300-i*5,()=>sv(3.2,8,.08)));yield 220;
  yield* bigBoss('fox',1);
}
function* scr2(){
  yield 90;
  fork(chain('garg',8,16,i=>60+i*30,{m:M.sine(2.5,18,.07)}));yield 170;
  fork(chain('crys',5,66,()=>308));
  spawn('eye',W+20,110,{m:M.hover(470,170),drop:'p'});spawn('eye',W+20,220,{m:M.hover(470,170)});yield 170;
  fork(chain('knight',3,64,i=>90+i*80,{m:M.drift(1.1,430)}));yield 230;
  fork(chain('garg',10,10,i=>i%2?50:280,{m:M.dash(420,40)}));yield 170;
  spawn('wyvern',W+40,130,{m:M.hover(470,250),drop:'p'});yield 260;
  fork(chain('eye',5,32,i=>44+i*62,{m:M.hover(390,130)}));yield 230;
  yield* mid('m3');yield 50;
  fork(chain('knight',4,46,i=>60+i*70,{m:M.drift(1.2,450)}));
  fork(chain('crys',6,52,()=>308));yield 200;
  spawn('eye',W+20,170,{m:M.hover(480,180),drop:'b'});
  fork(chain('garg',14,9,i=>180+Math.sin(i*.7)*130,{m:M.dash(460,36)}));yield 220;
  spawn('wyvern',W+40,90,{m:M.hover(490,230),drop:'p'});spawn('wyvern',W+40,250,{m:M.hover(490,230)});yield 280;
  fork(chain('eye',6,26,i=>300-i*48,{m:M.hover(420,110)}));yield 200;
  fork(chain('knight',5,40,i=>50+i*60,{m:M.drift(1.4,440)}));fork(chain('crys',5,50,()=>308));yield 280;
  fork(chain('garg',16,8,i=>i%2?44+i*6:316-i*6,{m:M.dash(470,30)}));yield 200;
  fork(chain('wyvern',3,110,i=>70+i*100,{m:M.hover(500,150)}));yield 400;
  spawn('eye',W+20,180,{m:M.hover(470,160),drop:'p'});
  fork(chain('garg',12,12,i=>60+i*20,{m:M.sine(3,24,.08)}));yield 200;
  yield* bigBoss('dragon',2);
}
function* scr3(){
  yield 90;
  fork(chain('drone',10,9,i=>60+i*24,{m:M.dash(420,36)}));yield 150;
  fork(chain('drone',10,9,i=>290-i*24,{m:M.dash(420,36)}));yield 150;
  spawn('fighter',W+20,110,{m:M.hover(450,120),drop:'p'});
  fork(chain('fighter',6,18,i=>54+i*44,{m:M.str(3.4)}));yield 170;
  fork(chain('mine',8,26,()=>rnd(44,300),{m:M.str(1.9),spin:.04}));yield 190;
  spawn('sat',W+20,90,{m:M.hover(490,300)});spawn('sat',W+20,270,{m:M.hover(490,300)});yield 280;
  spawn('pod',W+40,180,{m:M.hover(470,260),drop:'p'});
  fork(chain('drone',14,8,i=>i%2?44:310,{m:M.str(4)}));yield 300;
  yield* mid('m4');yield 40;
  fork(chain('fighter',10,16,i=>180+Math.sin(i*1.2)*130,{m:M.str(3.8)}));yield 170;
  spawn('sat',W+20,180,{m:M.hover(480,260),drop:'b'});
  fork(chain('mine',10,20,()=>rnd(44,310),{m:M.str(2.3),spin:.04}));yield 230;
  fork(chain('drone',20,6,i=>180+Math.sin(i*.6)*140,{m:M.dash(460,32)}));yield 200;
  spawn('pod',W+40,100,{m:M.hover(490,240),drop:'p'});spawn('pod',W+40,262,{m:M.hover(490,240)});yield 280;
  fork(chain('fighter',8,20,i=>44+i*38,{m:M.str(4.2)}));yield 200;
  fork(chain('sat',3,70,i=>70+i*110,{m:M.hover(500,220)}));fork(chain('drone',16,8,i=>180+Math.sin(i*.9)*130,{m:M.str(4.2)}));yield 300;
  fork(chain('mine',12,16,i=>i%2?50+i*20:310-i*20,{m:M.str(2.6),spin:.04}));yield 220;
  fork(chain('pod',3,110,i=>70+i*110,{m:M.hover(500,150)}));yield 410;
  spawn('fighter',W+20,180,{m:M.hover(470,160),drop:'p'});
  fork(chain('drone',20,6,i=>i%2?50:310,{m:M.dash(470,28)}));yield 200;
  yield* bigBoss('ship',3);
}
function* scr4(){
  yield 100;
  fork(chain('voidl',12,10,i=>180+Math.sin(i*.7)*130,()=>sv(2.8,16,.08)));yield 140;
  fork(chain('crowV',14,7,i=>i%2?60:290,{m:M.str(4.6)}));yield 120;
  spawn('rift',W+40,180,{m:M.hover(470,240),drop:'p'});yield 250;
  fork(chain('gargV',8,18,i=>44+i*34,{m:M.dash(430,40)}));
  fork(chain('eyeV',4,44,i=>70+i*72,{m:M.hover(420,130)}));yield 240;
  // 지난 보스들의 잔영
  G.warn=90;sfx('warn');yield 90;
  let b=spawnBoss('turtle',{only:1,ghost:true,hpm:.7});yield()=>b.dead;yield 20;
  b=spawnBoss('fox',{only:1,ghost:true,hpm:.65});yield()=>b.dead;yield 20;
  b=spawnBoss('dragon',{only:0,ghost:true,hpm:.65});yield()=>b.dead;yield 20;
  b=spawnBoss('ship',{only:1,ghost:true,hpm:.6});yield()=>b.dead;yield 40;
  dropItem(320,120,'p');dropItem(360,240,'b');
  fork(chain('fighterV',8,18,i=>54+i*36,{m:M.str(4)}));
  fork(chain('bichaV',6,30,()=>rnd(44,300),{m:M.str(2.6)}));yield 200;
  spawn('rift',W+40,100,{m:M.hover(500,230)});spawn('rift',W+40,260,{m:M.hover(500,230),drop:'p'});yield 260;
  fork(chain('voidl',20,6,i=>180+Math.sin(i*.6)*140,()=>sv(3.4,6,.1)));yield 170;
  fork(chain('eyeV',6,26,i=>44+i*52,{m:M.hover(420,120)}));fork(chain('droneV',20,7,i=>i%2?60:300,{m:M.str(4.4)}));yield 260;
  fork(chain('gargV',14,10,i=>180+Math.cos(i)*130,{m:M.dash(470,32)}));yield 220;
  spawn('rift',W+40,180,{m:M.hover(490,220),drop:'b'});yield 260;
  yield* bigBoss('king',4);
}
const SCR=[scr0,scr1,scr2,scr3,scr4];
