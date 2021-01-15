(function () {
	// =========================== IMPORTING METHODS FOR OLD BROWSERS ===========================
	
	// =========================== NODE.REMOVE() ===========================
	(function (arr) {
	  arr.forEach(function (item) {
		if (item.hasOwnProperty('remove')) {
		  return;
		}
		Object.defineProperty(item, 'remove', {
		  configurable: true,
		  enumerable: true,
		  writable: true,
		  value: function remove() {
			this.parentNode.removeChild(this);
		  }
		});
	  });
	})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
	// =========================== STRING.ENDSWITH / STRING.STARTSWITH ===========================
	if (!String.prototype.endsWith) {
	  String.prototype.endsWith = function(searchString, position) {
		var subjectString = this.toString();
		if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
		  position = subjectString.length;
		}
		position -= searchString.length;
		var lastIndex = subjectString.lastIndexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	  };
	}
	if (!String.prototype.startsWith) {
	  String.prototype.startsWith = function(searchString, position) {
		position = position || 0;
		return this.indexOf(searchString, position) === position;
	  };
	}
	// =========================== NODE CHILD ELEMENT COUNT ===========================
	(function(constructor) {
	  if (constructor &&
		  constructor.prototype &&
		  constructor.prototype.childElementCount == null) {
		Object.defineProperty(constructor.prototype, 'childElementCount', {
		  get: function() {
			var i = 0, count = 0, node, nodes = this.childNodes;
			while (node = nodes[i++]) {
			  if (node.nodeType === 1) count++;
			}
			return count;
		  }
		});
	  }
	  
	  if (constructor &&
			constructor.prototype &&
			constructor.prototype.firstElementChild == null) {
			Object.defineProperty(constructor.prototype, 'firstElementChild', {
				get: function() {
					var node, nodes = this.childNodes, i = 0;
					while (node = nodes[i++]) {
						if (node.nodeType === 1) {
							return node;
						}
					}
					return null;
				}
			});
		}
	})(window.Node || window.Element);

	// =========================== STRING/ARRAY .INCLUDES() ===========================
	if (!String.prototype.includes) {
	  String.prototype.includes = function(search, start) {
		'use strict';

		if (search instanceof RegExp) {
		  throw TypeError('first argument must not be a RegExp');
		} 
		if (start === undefined) { start = 0; }
		return this.indexOf(search, start) !== -1;
	  };
	}
	if (!Array.prototype.includes) {
	  Array.prototype.includes = function(search, start) {
		'use strict';

		if (search instanceof RegExp) {
		  throw TypeError('first argument must not be a RegExp');
		} 
		if (start === undefined) { start = 0; }
		return this.indexOf(search, start) !== -1;
	  };
	}
	
	if (!String.prototype.replaceAll) {
		String.prototype.replaceAll = function (search,replace) {
			return this.split(search).join(replace);
		};
	}
})();

var gm = {
	onDocLoad: function (e) {
		if (gm.ondocload) {
			gm.ondocload(e);
		}
	},
	onload: function (clb) {
		if (typeof (clb) == "function") {
			gm.ondocload = clb;
		}
	},
	newItem: function (n, opts, appendTo) {
		if (typeof(opts) == "string") {
			opts = {className: opts};
		} else if (typeof (opts) != "object") {
			opts = {};
		}
		var ob = document.createElement(n);
		for (var na in opts) {
			if (na in ob) {
				ob[na] = opts[na];
			} else {
				ob.setAttribute(na, opts[na]);
			}
		}
		if (typeof (appendTo) == "object" && appendTo !== null && appendTo !== undefined) {
			appendTo.appendChild(ob);
		}
		return ob;
	},
	_importAsset: function(o) {
		gm[o.key] = o.value;
	}

};
window.addEventListener("load",gm.onDocLoad);
(function () {
	// =========================== FORMAT NUMBER ===========================
	gm.formatNumber = function (n) {
		if (typeof (n) != "number") {
			return null;
		}
		if (!gm.formatNumberFormatter) {
			gm.formatNumberFormatter = new Intl.NumberFormat();
		}
		return gm.formatNumberFormatter.format(n);
	};
	
	// =========================== VALIDATE OPTIONS ===========================
	gm.validateOptions = function (options, defaults, required) {
		if (!Array.isArray(required)) {
			required = [];
		}
		if (typeof (options) != "object") {
			return "Options should be object";
		}
		for (var d in defaults) {
			if (!(d in options)) {
				options[d] = defaults[d];
			}
		}
		for (var i = 0; i < required.length; i++) {
			if (!(required[i] in options)) {
				return "Missing required argument: " + required[i];
			}
		}
		return true;
	};
	
	// =========================== REQUEST ===========================
	gm.request = function (url,opts,callback) {
		if (typeof(opts) == "function") {callback = opts;opts = {};} else if (!opts) {
			opts = {};
		}
		if (typeof(opts.headers) != "object") {
            opts.headers = {
                "content-type": "application/x-www-form-urlencoded"
            };
        } else {
            if (!opts.headers['content-type']) {
                opts.headers['content-type'] = "application/x-www-form-urlencoded";
            }
        }
		var xhttp
		if (window.XMLHttpRequest) {
		   // code for modern browsers
		   xhttp = new XMLHttpRequest();
		 } else {
		   // code for old IE browsers
		   xhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				// && this.status == 200
				var r = {status: null,http_code: this.status,res: null,error_level: 0,error: null};
				r.headers = this.getAllResponseHeaders();
				if (this.status != 200) {
					r.status = 0;
					r.error_level = 1;
					r.error = "Error making request(" + String(this.status) + ": " + this.responseText + ")";
				} else {
					r.status = 1;
					if (opts.json === true) {
						try {
							r.res = JSON.parse(this.responseText);
						} catch (err) {
							r.status = 0;
							r.res = null;
							r.error = "Error reading response";
						}
					} else {
						r.res = this.responseText;
					}
				}
				return callback(r);
			}
		};
		xhttp.error = function (e) {
			callback({status: 0,error_level: 2,error: "Error making request"});
			return xhttp.abort();
		};
		if (!opts.method) {opts.method = "GET";}
		xhttp.open(opts.method, url, true);
			
		for(var h in opts.headers) {
            xhttp.setRequestHeader(h,opts.headers[h]);
        }

		
		if (opts.body) {
			xhttp.send(opts.body);
		} else {
			xhttp.send();
		}
	};
	
	// =========================== GET DATA URL =============================
	gm.getDataURL = function (img,type) {
		if (!type) {type = "image/png";}
	   // Create canvas
	   const canvas = document.createElement('canvas');
	   const ctx = canvas.getContext('2d');
	   // Set width and height
	   canvas.width = img.width;
	   canvas.height = img.height;
	   // Draw the image
	   ctx.drawImage(img, 0, 0);
	   try {
		   return canvas.toDataURL(type);
	   } catch (err) {
		   return null;
	   }
	}
	
	// =========================== MODAL =============================
	gm.Modal = function (className) {
		if (className) {
			className = " " + className;
		} else {
			className = " __modal-full-screen";
		}
		this.modal = gm.newItem("div", {
			className: "__modal" + className
		});
		this.iframe = null;
		this.createIframe = function () {
			this.iframe = gm.newItem("iframe", {},this.modal);
			return this;
		};
		this.append = function () {
			document.body.appendChild(this.modal);
			return this;
		};

		this.navigate = function (url) {
			if (!this.iframe) {
				throw("[gm,FullScreenModal] cannot navigate without first initializing iframe");
			}
			this.iframe.src = url;
			this.open();
			return this;
		};
		
		this.navigateHTML = function (html,addHTMLBase) {
			if (!this.iframe) {
				throw("[gm,FullScreenModal] cannot navigate without first initializing iframe");
			}
			if (addHTMLBase === true) {
				html = '<html><head><title>Frame</title><meta content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" name="viewport"></head><body>' + html + '</body></html>';
			}
			var url = 'data:text/html;charset=utf-8,' + encodeURI(html);
			this.navigate(url);
		}
		
		this.open = function (showCloseButton) {
			var cl = this.modal.getElementsByClassName("__close")[0];
			if (showCloseButton !== false) {
				if (!cl) {
					var par = this;
					cl = gm.newItem("span",{className: "__close",innerHTML: "&times;",onclick: function (e) {
						par.close();
					}
					});
					if (this.iframe) {
						this.modal.insertBefore(cl,this.iframe);
					} else {
						this.modal.appendChild(cl);
					}
				}
			} else {
				if (cl) {cl.remove();}
			}
			this.modal.setAttribute("style", "display: block;");
		};
		this.close = function (clb) {
			this.modal.setAttribute("style", "");
			if (this.iframe) {
				this.iframe.src = "about:blank";
			}
			if (typeof (clb) == "function") {
				return clb();
			}
		};

	}; //closing of modal function

	// =========================== NOTIFICATION MESSAGES ===========================
	gm.NotificationMessages = function (style_) {
		if (!style_) {
			style_ = "";
		}
		this.container = gm.newItem("div", {
			className: "__notification-messages-container",
			style: style_
		}, document.body);
	
		this.showTimeBar = true;
		
		this.addMessage = function (message, style, timeout, closeOnClick) {
			if (typeof (style) != "string") {
				style = "";
			}
			if (!timeout) {
				timeout = false;
			}
			var m = gm.newItem("div", {
				className: "__notification-message",
				style: style,
				innerText: message
			});
			var timer = null;
			var timebarTimer = null;
			if (closeOnClick === true) {
				m.className += " __notification-message-clickable";
				m.onclick = function (e) {
					m.remove();
					if (timer) {
						clearTimeout(timer);
						 if (!!timebarTimer) {clearInterval(timebarTimer);}
					}
				};
				m.title = "Close";
			}

			this.container.appendChild(m);
			if (timeout !== false) {				
				var left = timeout;
				if (this.showTimeBar === true) {
					setTimeout(function () {
						var s = "width: 100%;";
						var bar = gm.newItem("div",{
							className: "__notification-message-timebar",
							style: s
						},m);
						timebarTimer = setInterval(function () {
							bar.setAttribute("style","width: " + String((left / timeout) * 100) + "%;");
							left -= 10;
						},10);
					},0.000000000000000000000000001);
				}
				
				timer = setTimeout(function () {
					m.remove();
					timer = null;
					if (!!timebarTimer) {clearInterval(timebarTimer);}
				}, timeout);
			}
			return m;
		}; //closing of addMessag

	}; //closing of gm.NotificationMessages

	// =========================== MULTILINE TEXT AREA ===========================
	gm.multilineTextArea = function (textarea,minheight_,submit) {
		if (!minheight_) {minheight_ = textarea.clientHeight;}
		var handler = function (event,isLast) {
			if (!event) {event = {which: -1};}
			if (isLast !== true) {
				if (event.which == 13 && !event.shiftKey && textarea.value.trim() != "") {
					event.preventDefault();
					if (typeof(submit) == "function") {submit(textarea);}
				} else if (event.which == 13 && event.shiftKey) {
					textarea.value += '\n';
				} else if (event.which == 13) {
					event.preventDefault();
				}	
			}
			
			textarea.setAttribute("style","height: 1px");
			var n = textarea.scrollHeight;
			if (n < minheight_) {n = minheight_;}
			textarea.setAttribute("style","height: " + String(n)+"px");
			if (isLast !== true) {/*handler(null,true);*/}
		};
		textarea.addEventListener("keypress",handler);
		textarea.addEventListener("keyup",handler);
		handler();
	};

	// =========================== CONTEXT MENU ===========================
	gm.ContextMenu = function (menuType_) {
		if (!menuType_) {menuType_ = 1;}
		this.menu = gm.newItem("div",{
			className: "__context-menu __context-menu-" + String(menuType_)
		},document.body);
		this.menu_ul = gm.newItem("ul","__context-menu-ul",this.menu);
		var par = this;
		
		this.contextMenu = function (event,items) {
			if (!Array.isArray(items)) {throw("[gm,contextMenu] items should be an array");}
			event.preventDefault();
			var st = "top: " + String(event.clientY) + "px;left: " + String(event.clientX) + "px;";
			par.menu.setAttribute("style",st);
			par.menu_ul.innerHTML = "";
			for(var i = 0;i < items.length;i++) {
				(function () {
					var ev = function (e) {
						e.preventDefault();
						if (it.disabled == true) {return;}
						par.close();
						if (typeof(it.onclick) == "function") {it.onclick(e);}
					};					
					var it = items[i];
					if (!it.style || typeof(it.style) != "string") {it.style = "";}
					if (it.type == "separator" || it.type == "sep") {
						var li = gm.newItem("li","__context-menu-sep",par.menu_ul);
					} else {
						var s = "";
						if (it.disabled == true) {
							s += ' __context-menu-li-disabled';
						}
						var li = gm.newItem("li",{
							className: "__context-menu-li" + s,
							innerText: it.label,
							onclick: ev,
							oncontextmenu: ev,
							style: it.style
						},par.menu_ul);
						if (it.title) {li.title = it.title;}
					}
				})();
			}
			par.menu.className += ' __context-menu-show';
			setTimeout(function (e) {
				window.addEventListener("click",par.windowhandlerClick);
			},1);
		};//closing of contextMenu()
		this.windowhandlerClick = function (e) {
			e.preventDefault();
			if (!e.target) {return par.close();}
			if (!e.target.className || typeof(e.target.className) != "string") {return par.close();}
			if (e.target.className.includes("__context-menu") === false) {
				par.close();
			}
		};
		
		this.fullContext = function (element,items,events) {
			if (!events) {throw "Events must be an array of a string with a js event";}
			if (!Array.isArray(events)) {events = [events];}
			for(var i = 0;i < events.length;i++) {
				element.addEventListener(events[i],function (e) {
					e.preventDefault();
					par.contextMenu(e,items);
				});
			}
		};
		
		this.close = function (clb) {
			this.menu.className = this.menu.className.replaceAll("__context-menu-show","").trim();
			this.menu_ul.innerHTML = "";
			setTimeout(function (e) {
				window.removeEventListener("click",par.windowhandlerClick);
			},1);
		};
	};

	// =========================== PROGRESS BAR ===========================
	gm.ProgressBar = function (styleType,content,barStyle) {
		//content = 1: Bar text = percentage;content = 2: Bar text = current/total
		if (!content) {content = 0;}
		if (!styleType) {styleType = "1";}
		if (!barStyle || typeof(barStyle) != "string") {barStyle = "color: #fff;background-color: #2196F3;";}
		if (barStyle.endsWith(";") === false) {barStyle += ";";}
		this.container = gm.newItem("div",{
			className: "__progress-bar-container __progress-bar-container-" + styleType
		});
		
		this.bar = gm.newItem("div",{
			style: barStyle
		},this.container);
		
		this.full = 100;
		this.current = 0;
		this.getTextContent = function () {
			if (content === 0) {return "";}
			if (content === 1) {return String(Math.ceil(this.current / this.full * 100)) + "%";}
			if (content === 2) {return String(this.content) + "/" + String(this.full);}
			return "";
		};
		this.refresh = function () {
			var w = this.current / this.full;
			this.bar.setAttribute("style",barStyle + "width: " + String(w * 100) + "%;");
		};
		this.changeProgress = function (n,text) {
			if (typeof(n) != "number") {throw "New progress must be a number";}
			this.current = n;
			this.refresh();
			if (!text) {
				text = this.getTextContent();
			}
			this.bar.innerText = text;
		};
		this.appendTo = function (item) {
			if (!item) {throw "Missing item parameter";}
			item.appendChild(this.container);
		}
	};
	// =========================== COPYTEXT ===========================
	gm.copyText = function (text,clb) {
		if (typeof(clb) != "function") {clb = function () {};}
		if (!gm.copyTextTextArea) {
			gm.copyTextTextArea = gm.newItem("textarea",{style: "width: 0;height: 0;opacity: 1;position: fixed;left: -10px;"},document.body);
		}
		gm.copyTextTextArea.value = text;
		
		var selected = document.getSelection().rangeCount > 0;
		if (selected) {
			selected = document.getSelection().getRangeAt(0);
		} else {
			selected = false;
		}
			
		gm.copyTextTextArea.select();
		gm.copyTextTextArea.setSelectionRange(0, 99999);
		document.execCommand("copy");
		
		if (selected) {
			document.getSelection().removeAllRanges();
			document.getSelection().addRange(selected);
		}
		clb();
	};
	
	// =========================== CHANGEURL ===========================
	gm.changeURL = function (url,title) {
		if (!title) {title = "";}
		window.history.replaceState({},title,url);
	};
	
	gm.UTCTime = function (d1) {
		if (!d1) {d1 = new Date();}
        var now = new Date(d1.getUTCFullYear(),d1.getUTCMonth(),d1.getUTCDate(),d1.getUTCHours(),d1.getUTCMinutes(),d1.getUTCSeconds(),d1.getUTCMilliseconds());
        return now.getTime();
	};
	
	gm.JSONParse = function (s) {
		try {return JSON.parse(s);} catch (err) {return null;}
	};
	
	gm.parseInt = function (s) {
		var r = parseInt(s);
		if (isNaN(r)) {return null;}
		return r;
	};
	
	gm.randomString = function (length) {
	   var result = '';
	   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   var charactersLength = characters.length;
	   for ( var i = 0; i < length; i++ ) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	};
	
	gm.setCookie = function(cname, cvalue, exdays) {
		var expires = "";
		if (exdays != null) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays*24*60*60*1000));
			var expires = ";expires="+ d.toUTCString();
		}
	  document.cookie = cname + "=" + cvalue + expires + ";path=/";
	};
	
	gm.deleteCookie = function (cname) {
		gm.setCookie(cname,"null",-100);
	}
	
	gm.getCookie = function(cname) {
	  var name = cname + "=";
	  var decodedCookie = decodeURIComponent(document.cookie);
	  var ca = decodedCookie.split(';');
	  for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
		  c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
		  return c.substring(name.length, c.length);
		}
	  }
	  return null;
	};

	gm.limitLength = function (str,len) {
		if (typeof(str) != "string") {return null;}
		if (str.length < len + 1) {return str;}
		return str.slice(0,len);
	};
	
	gm.escapeHTML = function (str) {
		return str
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
	};
	
	gm.buildQuery = function (args) {
		if (!args || typeof(args) != "object") {return "";}
		var ret = "";var v;
		for(var n in args) {
			v = args[n];
			if (v === null || v === undefined) {continue;}
			if (typeof(v) == "object" || Array.isArray(v)) {v = JSON.stringify(v);}
			if (typeof(v) == "number") {v = String(v);}
			if (typeof(v) == "boolean") {if (v === true) {v = "1";} else {v = "0";}}
			v = encodeURIComponent(v);
			if (ret != "") {ret += "&";}
			ret += n + "=" + v;
		}
		return ret;
	};
	
	if (window._gm_assets) {
		for (var i = 0; i < window._gm_assets.length; i++) {
			gm._importAsset(window._gm_assets[i]);
		}
	}
	window._gm_assets = null;
})(); /*closing of initialization function*/
