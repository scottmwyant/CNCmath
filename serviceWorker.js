//
//  Reference https://www.pwabuilder.com/serviceworker and  https://www.youtube.com/watch?v=ksXwaWHCW6k
//

(function myServiceWorker(){

  const cacheName = "myCache";
  const cacheAssets = ['app.html', 'doc.html' , 'index.html',  './assets/favicon.ico'];

  function activateHandler(event){
    console.log("ServiceWorker: activated")
  }

  function fetchHandler(event){
    console.log("ServiceWorker: fetching requested resources");
    event.respondWith(
      fetch(event.request)
      .catch(function(){
        window.caches.match(event.request)
      })
    );
  }

  function installHandler(event){    
    console.log("ServiceWorker: installed");
    event.waitUntil(
      caches.open(cacheName).then(function (cache){
        console.log("ServiceWorker: files cached");
        cache.addAll(cacheAssets);
      })
      .then(function() {
        self.skipWaiting;
      })
    );
  }

// Handle the INSTALL event; cache files for offline use
self.addEventListener("install", installHandler);

// Handle the ACTIVATE event; delete old caches
self.addEventListener("activate", activateHandler);

// If any fetch fails, it will show the offline page.
self.addEventListener("fetch", fetchHandler);

})();
