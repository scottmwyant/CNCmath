# CNC math

## ToDo

- Helical milling
- 3 +2axis positioning  

## Progressive Web App (PWA)

While iOS and Android both support progressive web apps, they each have their own set of standards.  This section identifies the elements of each standard that are used.

### for iOS

**pwa** - first, the page needs to be  identified as a PWA with the following `<meta>` element in the `<head>`:

`<meta name="apple-mobile-web-app-capable" content="yes" />`

**icon** - the app icon is specified with the following `<link>` element:

`<link rel="apple-touch-icon" sizes="57x57" href="assets/icon-57x57.png" />`

Note that the 57x57pt icon has a 10pt radius on each corner.  Each larger icon has a proportionally larger corner radius.

**splash** - the splash screen is also specified with a `<link>` element:

` <link rel="apple-touch-startup-image" href="assets/splash-port-0640x1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />`

### Service Worker

- Registering a service worker: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register
- Example of how to register a service worker: https://gist.github.com/deanhume/ccf1bb609b03a4bcee19

## References

 - https://www.netguru.com/codestories/few-tips-that-will-make-your-pwa-on-ios-feel-like-native
 - https://iconifier.net/
 - https://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions
 - https://developers.google.com/web/ilt/pwa/introduction-to-service-worker