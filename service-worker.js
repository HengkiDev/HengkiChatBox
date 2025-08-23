self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
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
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientsArr => {
      const client = clientsArr.find(c => c.url === event.notification.data.url && 'focus' in c);
      if (client) {
        return client.focus();
      } else if (clientsArr.length) {
        return clientsArr[0].focus();
      } else {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
