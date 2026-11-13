// The Chase service worker: shows reminders and handles their buttons. It does not cache pages,
// so new versions of the app always load fresh.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
const ACT={s10:'snooze10',s60:'snooze60',dismiss:'dismiss'};
self.addEventListener('notificationclick',e=>{const n=e.notification;const d=n.data||{};const act=ACT[e.action]||'open';n.close();
 e.waitUntil((async()=>{const list=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  if(list.length){list[0].postMessage({type:'notif-action',id:d.id,act});if(act==='open'&&list[0].focus)try{await list[0].focus()}catch(x){}return}
  if(act==='dismiss'){return} // nothing open: dismiss just clears it; the app marks it read next time it opens
  await self.clients.openWindow('/?nid='+encodeURIComponent(d.id||'')+'&nact='+act)})())});
// Ready for true push (Firebase Cloud Messaging or any Web Push sender). Payload: {title, body, id, url}
self.addEventListener('push',e=>{let p={};try{p=e.data?e.data.json():{}}catch(x){p={title:'The Chase',body:e.data&&e.data.text()}}const n=p.notification||p;
 e.waitUntil(self.registration.showNotification(n.title||'The Chase',{body:n.body||'',tag:p.id||n.tag,icon:'/icons/icon-192.png',badge:'/favicon-32.png',data:{id:p.id||n.tag||''},actions:[{action:'s10',title:'Snooze 10 min'},{action:'s60',title:'Snooze 1 hour'}]}))});
