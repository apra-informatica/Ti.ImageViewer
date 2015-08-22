# Ti.ImageViewer
Image viewer widget for Appcelerator Titanium

With this image viewer it's possible to show a single - zoomable, scrollable and pinchable - local image on iOS and Android (on iOS also remote images).

It uses module org.iotashan.TiTouchImageView (on Android), and installation of this module is necessary if you mean to use the widget on Android.

![image](docs/screenshot1.png?raw=true)

## Installation

Add in your *config.json*, under `dependencies`:

```
"dependencies": {
    "it.apra.tiimageviewer": "*"
}
```

## Usage
```javascript
widget = Alloy.createWidget('it.apra.tiimageviewer', {
	'image' : filepath,
	'title' : filename,
	'subtitle' : des
});
```

## Usage with Alloy
```xml
		<Widget src="it.apra.tiimageviewer" id="myiview" image="..." lowerGradientHidden="true" lowerInfoHidden="true"/>
```

**Args**
* **image**: image filepath
* **title**: optional image title (showed in lower panel)
* **subtitle**: optional image subtitle (showed in lower panel)
* **lowerInfoHidden**: if true hides lower info panel
* **lowerGradientHidden**: if true hides lower info panel gradient
* **backgroundColor**: backgroundColor (default is 'black')

**Functions**
* **removeEventListeners**: removes all listeners on controls
* **reloadImage**: reloads the image
* **showLowerInfo**: showes lower info
* **hideLowerInfo**: hides lower info

##Notes
* Could be useful a compatibility on Android without the native module too (using a webview?)
* The pinch-to-zoom and scroll on iOS are based on the widget https://github.com/CaffeinaLab/Ti.TiltImageView.
