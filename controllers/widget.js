var args = arguments[0] || {};
$.image = args.image;
var title = args.title || "",
	subtitle = args.subtitle || "",
	lowerInfoHidden = args.lowerInfoHidden || args.lowerInfoHided || false,
	lowerGradientHidden = args.lowerGradientHidden || args.lowerGradientHided || false,
	backgroundColor = args.backgroundColor || 'black';

var lastValidOrientation, imageView, imageLoad, orientationChange, removeEventListeners, showLowerInfo;

lastValidOrientation = null;

showLowerInfo = function(){
	if (!lowerInfoHidden){
		$.title.visible = true;
		$.description.visible = true;
	}
};
hideLowerInfo = function(){
	$.title.visible = false;
	$.description.visible = false;
};

if (OS_IOS) {
	(function(){
		var getMaxOffset, IMGS, OUTS, SS, LAYOUT, MINZOOMSCALE;

		imageView = Ti.UI.createImageView({
			'image' : $.image,
			'height': Ti.UI.SIZE,
			'width': Ti.UI.SIZE,
			'touchEnabled': false
		});
		$.imageViewContainer.add(imageView);

		getMaxOffset = function() {
			return (IMGS.width*$.imageViewContainer.zoomScale)-OUTS.width;
		};

		imageLoad = function(){
			Ti.API.debug('Loading imagetView ' + title);

			var size, rect, OR, IR, zoomScaleToFit;

			if (imageView.image != $.image) {
				imageView.image = $.image;
			}
			size = imageView.size;
			rect = $.index.size;
			IMGS = { width: size.width, height: size.height };
			OUTS = { width: rect.width, height: rect.height };
			OR = OUTS.width/OUTS.height;
			IR = IMGS.width/IMGS.height;

			// Recalculate if the min-height is not sufficient
			if (IMGS.height<OUTS.height) {
				imageView.height = OUTS.height;
				IMGS = {
					width: OUTS.height*(IMGS.width/IMGS.height),
					height: OUTS.height
				};
			}

			// Scroll horizontal or vertically ?
			MINZOOMSCALE = 1;
			if (IR>OR) {
				LAYOUT = 'H';
				if (OUTS.height > 0 && IMGS.height > 0){
					MINZOOMSCALE = OUTS.height/IMGS.height;
				}
				SS = OUTS.width-40;
				$.scrollBar.applyProperties({
					bottom: 90, left: 20, right: 20, top: null,
					height: 1, width: Ti.UI.FILL
				});
				$.scrollBarInset.width = 60;
			} else {
				LAYOUT = 'V';
				if (OUTS.width > 0 && IMGS.width > 0){
					MINZOOMSCALE = OUTS.width/IMGS.width;
				}
				SS = OUTS.height-20;
				$.scrollBar.applyProperties({
					right: 20, left: null, top: 10, bottom: 10,
					height: Ti.UI.FILL, width: 1
				});
				$.scrollBarInset.height = 60;
			}

			// scalesToFit
			if (IMGS.width > OUTS.width || IMGS.height > OUTS.height) {
				zoomScaleToFit = Math.min(OUTS.height / IMGS.height, OUTS.width / IMGS.width);
				if (zoomScaleToFit > 0 && zoomScaleToFit < 1){
					MINZOOMSCALE = zoomScaleToFit;
				}
			}
			MINZOOMSCALE *= 0.95;

			$.imageViewContainer.minZoomScale = MINZOOMSCALE;
			$.imageViewContainer.zoomScale = MINZOOMSCALE;
			$.imageViewContainer.maxZoomScale = 5;
		};

		$.imageViewContainer.addEventListener('scroll', function(){
			if (LAYOUT==='H') {
				$.scrollBarInset.animate({
					left: (SS-60)*($.imageViewContainer.contentOffset.x/getMaxOffset())
				});
			} else {
				$.scrollBarInset.animate({
					top: (SS-60)*($.imageViewContainer.contentOffset.y/getMaxOffset())
				});
			}
		});

		imageView.addEventListener('load', imageLoad);
		$.index.addEventListener('singletap', function(e) {
			imageLoad();
		});
	}());
} else if (OS_ANDROID){
	(function(){
		imageView = require('org.iotashan.TiTouchImageView').createView({
			'image' : $.image,
			'width': Ti.UI.FILL,
			'height' : Ti.UI.FILL
		});
		$.imageViewContainer.add(imageView);

		imageLoad = function(){
			Ti.API.debug('Loading imagetView ' + title);

			if (imageView.image != $.image) {
				imageView.image = $.image;
			}

			imageView.resetZoom();
		};
	}());
}

(function(){
	var lastValidOrientation;

	orientationChange = function(e){
		if (e){
			Ti.API.debug('Orientation: ' + e.orientation);
			switch(e.orientation){
				case Ti.UI.PORTRAIT:
				case Ti.UI.UPSIDE_PORTRAIT:
				case Ti.UI.LANDSCAPE_LEFT:
				case Ti.UI.LANDSCAPE_RIGHT:
					if (e.orientation === lastValidOrientation){
						return;
					}
					lastValidOrientation = e.orientation;
					break;
				default:
					return;
			}
		}

		imageLoad();
	};
	Ti.Gesture.addEventListener('orientationchange', orientationChange);
}());

removeEventListeners = function(){
	Ti.API.debug('tiImageViewer: removingEventListeners ' + title);

	if (orientationChange) { Ti.Gesture.removeEventListener('orientationchange', orientationChange); }
	if (imageView && imageLoad) { imageView.removeEventListener('load', imageLoad); }
};


$.title.text = title;
$.description.text = subtitle;
$.index.backgroundColor = backgroundColor;

if (lowerInfoHidden){
	hideLowerInfo();
} else {
	showLowerInfo();
}

$.gradientImage.visible = !lowerGradientHidden;

exports.reloadImage = imageLoad;
exports.removeEventListeners = removeEventListeners;
exports.showLowerInfo = showLowerInfo;
exports.hideLowerInfo = hideLowerInfo;
