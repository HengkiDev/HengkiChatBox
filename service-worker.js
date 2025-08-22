// service-worker.js
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  console.log('Service Worker activated');
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const payload = event.data.json();
  const options = {
    body: payload.body,
    icon: '/4ever.ico',
    badge: '/4ever.ico',
    vibrate: [200, 100, 200],
    tag: 'chat-message',
    data: {
      url: payload.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
