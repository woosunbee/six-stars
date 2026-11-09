// 오프라인 실행용: 게임 파일은 네트워크 우선(업데이트 즉시 반영), 웹폰트는 캐시 우선
const CACHE='sixstars-v1';
const FILES=["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-180.png", "js/core.js", "js/art.js", "js/art2.js", "js/world.js", "js/heroes.js", "js/foes.js", "js/bosses.js", "js/stages.js", "js/main.js"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const c=n.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return n})));
    return;
  }
  if(u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(n=>{if(n.ok){const c=n.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return n}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
