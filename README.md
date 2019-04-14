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

## Html5 Canvas on Hi-Res Devices

The html5 canvas element will appear fuzzy on high-resolution screens.  This is due to a scale factor between the page style ("points") and the screen rendering ("pixels").  The property `window.devicePixelRatio` is used to detect this ratio.  The approach to making the canvas appear smooth is to set the size of the canvas using pixels (= points * dpr) then constrain the rendering with CSS.  Increase the scale of the canvas by the dpr.

```
// Use a 500x375 canvas with window.devicePixelRatio=2
canvas = document.getElementById('output')
canvas.width = 1000;
canvas.height = 750;
canvas.style.width = "500px";
canvas.style.height = "375px";
canvas.getContext('2d').scale(2,2)
```


## References

 - https://www.netguru.com/codestories/few-tips-that-will-make-your-pwa-on-ios-feel-like-native
 - https://iconifier.net/
 - https://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions
 - https://developers.google.com/web/ilt/pwa/introduction-to-service-worker
 - https://coderwall.com/p/vmkk6a/how-to-make-the-canvas-not-look-like-crap-on-retina
 