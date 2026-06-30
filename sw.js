// PETROSAR · Inspecciones de Servicio · Service Worker
const CACHE='is-petrosar-v1';
const ASSETS=['./','./index.html','./manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(
    ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const url=e.request.url;
  // nunca cachear llamadas a Supabase (API/storage) -> siempre red
  if(url.includes('supabase.co')){
    e.respondWith(fetch(e.request).catch(()=>new Response('{"offline":true}',{status:503})));
    return;
  }
  // app shell: cache-first
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    const copy=resp.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
    return resp;
  }).catch(()=>caches.match('./index.html'))));
});
