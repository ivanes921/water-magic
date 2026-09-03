const CACHE='water-magic-v1';
const ASSETS=['/','/index.html','/style.css','/app.js','/manifest.json','/icon.svg','/admin.html','/admin.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method==='GET')e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{const copy=x.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return x}).catch(()=>caches.match('/'))))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>cs.length?cs[0].focus():clients.openWindow('/')))});
