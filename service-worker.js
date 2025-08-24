// service-worker.js
// Simpan file ini di root directory website Anda

const CACHE_NAME = '4ever-chat-v1';
const urlsToCache = [
  '/',
  '/4ever.ico',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  if (event.request.url.startsWith('http')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
});

// Push event - handle incoming push notifications
self.addEventListener('push', event => {
  console.log('Service Worker: Push received', event);
  
  let notificationData = {
    title: '4ever Chat',
    body: 'You have a new message',
    icon: '/4ever.ico',
    badge: '/4ever.ico',
    tag: 'chat-message',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Message',
        icon: '/4ever.ico'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  // Parse push data if available
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (e) {
      console.log('Push data is not JSON:', event.data.text());
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Check if chat window is already open
        for (const client of clientList) {
          if (client.url.includes('4ever') && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if not found
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Background sync for offline message queue
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event);
  
  if (event.tag === 'chat-sync') {
    event.waitUntil(
      // Handle offline message synchronization
      syncOfflineMessages()
    );
  }
});

async function syncOfflineMessages() {
  try {
    // Get offline messages from IndexedDB or localStorage
    // Send them when connection is restored
    console.log('Syncing offline messages...');
  } catch (error) {
    console.error('Error syncing offline messages:', error);
  }
}
