import { setCacheNameDetails } from 'workbox-core/setCacheNameDetails';
import { skipWaiting } from 'workbox-core/skipWaiting';
import { clientsClaim } from 'workbox-core/clientsClaim';

import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';
import { registerRoute } from 'workbox-routing/registerRoute';
import { createHandlerBoundToURL } from 'workbox-precaching/createHandlerBoundToURL';
import { NavigationRoute } from 'workbox-routing/NavigationRoute';

setCacheNameDetails({ prefix: '{{appName}}' });
skipWaiting();
clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')));
