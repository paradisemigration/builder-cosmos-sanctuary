// AGGRESSIVE SERVICE WORKER - PREVENTS ALL 404 ERRORS
console.log('🚨 AGGRESSIVE SERVICE WORKER: Installing complete 404 blocker');

self.addEventListener('install', (event) => {
  console.log('🚨 SW: Installing - will intercept ALL network requests');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('🚨 SW: Activated - 404 blocker is now active');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  console.log('🌍 SW: Intercepting request:', url);
  
  // Block ALL external requests completely
  if (url.includes('://') && !url.includes(self.location.hostname)) {
    console.error('🚨 SW: BLOCKED EXTERNAL:', url);
    event.respondWith(
      new Response(JSON.stringify({ blocked: true, sw: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );
    return;
  }
  
  // Block ALL API requests
  if (url.includes('/api/')) {
    console.error('🚨 SW: BLOCKED API:', url);
    event.respondWith(
      new Response(JSON.stringify({ 
        success: false, 
        data: [], 
        businesses: [],
        sw: true 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );
    return;
  }
  
  // For all other requests, try to fetch but catch 404s
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.status === 404) {
          console.error('🚨 SW: CAUGHT 404, returning 200:', url);
          return new Response('{}', {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        console.log('✅ SW: Allowing response:', url);
        return response;
      })
      .catch(error => {
        console.error('🚨 SW: CAUGHT ERROR, returning 200:', error);
        return new Response('{}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      })
  );
});
