// Also update the service worker number ins index.html when changing this!
var CACHE_NAME = 'ou-fa-v6';
var SHOULD_CACHE = (location.hostname !== 'localhost');

console.log("Will I be using a service worker? " + SHOULD_CACHE);
console.log("Defined service worker name=" + CACHE_NAME);

// Delete old caches that are not our current one!
self.addEventListener("activate", event => {
	const cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys()
			.then(keyList =>
				Promise.all(keyList.map(key => {
					if (!cacheWhitelist.includes(key)) {
						console.log('Deleting cache: ' + key);
						return caches.delete(key);
					}
				}))
			)
	);
});

// The first time the user starts up the PWA, 'install' is triggered.
self.addEventListener('install', function (event) {
	if (SHOULD_CACHE) {
		event.waitUntil(
			caches.open(CACHE_NAME)
				.then(function (cache) {
					// Get the assets manifest so we can see what our js file is named
					// This is because webpack hashes it
					fetch("/asset-manifest.json")
						.then(response => response.json())
						.then(assets => {
							// Open a cache and cache our files
							// We want to cache the page and the main.js generated by webpack
							// We could also cache any static assets like CSS or images
							const urlsToCache = [
								"/",
								assets["main.js"],
								assets["main.css"],
								assets["static/media/logo.svg"],
							];
							cache.addAll(urlsToCache);
							console.log('cached ' + urlsToCache);
						})
				})
		);
	}
});

// When the webpage goes to fetch files, we intercept that request and serve up the matching files
// if we have them
self.addEventListener('fetch', function (event) {
	if (SHOULD_CACHE) {
		event.respondWith(
			caches.match(event.request).then(function (response) {
				const url = event.request.url.split('?')[0];
				if (url.endsWith("/") || url.endsWith('/index.html')) {
					// Always try to fetch the main source from the remove if possible
					console.log('Detected main url');
					try {
						return fetch(event.request) || response;
					} catch (e) {
						console.warn('Triggered an exception', e);
						return response;
					}
				}
				// All other may use fallbacks
				return response || fetch(event.request);
			})
		);
	}
});
