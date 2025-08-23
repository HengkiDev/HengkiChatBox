self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : {};
  const options = {
    body: payload.body || 'New message received',
    icon: '/4ever.ico',
    badge: '/4ever.ico',
    vibrate: [200, 100, 200],
    tag: 'chat-message',
    data: {
      url: payload.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || '4ever Notification', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
