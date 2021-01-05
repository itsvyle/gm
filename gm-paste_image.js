(function () {
	var PasteImage;
	PasteImage = function (el) {
		this._el = el;
		this._listenForPaste();
	};

	PasteImage.prototype._getURLObj = function () {
		return window.URL || window.webkitURL;
	};

	PasteImage.prototype._pasteImage = function (image) {
		this.emit('paste-image', image);
	};

	PasteImage.prototype._pasteImageSource = function (src) {
		var self = this,
			image = new Image();

		image.onload = function () {
			self._pasteImage(image);
		};

		image.src = src;
	};

	PasteImage.prototype._onPaste = function (e) {

		// We need to check if event.clipboardData is supported (Chrome & IE)
		if (e.clipboardData && e.clipboardData.items) {

			// Get the items from the clipboard
			var items = e.clipboardData.items;

			// Loop through all items, looking for any kind of image
			for (var i = 0; i < items.length; i++) {
				if (items[i].type.indexOf('image') !== -1) {
					// We need to represent the image as a file
					var blob = items[i].getAsFile();

					// Use a URL or webkitURL (whichever is available to the browser) to create a
					// temporary URL to the object
					var URLObj = this._getURLObj();
					var source = URLObj.createObjectURL(blob);

					// The URL can then be used as the source of an image
					this._pasteImageSource(source);

					// Prevent the image (or URL) from being pasted into the contenteditable element
					e.preventDefault();
				}
			}
		}
	};

	PasteImage.prototype._listenForPaste = function () {
		var self = this;

		self._origOnPaste = self._el.onpaste;

		self._el.addEventListener('paste', function (e) {

			self._onPaste(e);

			// Preserve an existing onpaste event handler
			if (self._origOnPaste) {
				self._origOnPaste.apply(this, arguments);
			}

		});
	};

	PasteImage.prototype.on = function (event, callback) {
		this._callback = callback;
	};

	PasteImage.prototype.emit = function (event, arg) {
		this._callback(arg);
	};

	var simple_create = function (element, callback) {
		var p = new window.gm.PasteImage(element);
		p.on('paste-image', callback);
		return p;
	}
	if (window.gm && window.gm._importAsset) {
		window.gm._importAsset({
			key: "PasteImage",
			value: PasteImage
		});
		window.gm._importAsset({
			key: "addPasteImageListenner",
			value: simple_create
		});
	} else {
		if (!Array.isArray(window._gm_assets)) {
			window._gm_assets = [];
		}
		window._gm_assets.push({
			key: "PasteImage",
			value: PasteImage
		});
		window.gm._importAsset({
			key: "addPasteImageListenner",
			value: simple_create
		});
	}
})();