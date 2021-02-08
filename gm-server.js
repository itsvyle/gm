(function (){
function Session(url_,thread_,interval_,createArguments_) {
    if (!thread_ || !url_) {throw "[Session] INVALID ARGUMENTS";}
    if (!interval_) {interval_ = 1000;}
    if (!createArguments_ || typeof(createArguments_) != "object") {createArguments_ = {};}
    createArguments_.thread = thread_;
    this.createQuery = gm.buildQuery(createArguments_);

    this.setQuery = function (args_) {
        if (args_ === null || typeof(args_) != "object" || Array.isArray(args_)) {
            args_ = {};
        }
        args_ = Object.assign({
            thread: this.thread
        },args_);
        createArguments_ = args_;
        this.createQuery = gm.buildQuery(args_);
        return this;
    }

    this.thread = thread_;
    this.url = url_;
    this.id = null;
    this.timer = null;
    this.status = 0;
    this.statusText = "Not connected";
    this.setStatus = function (n) {
        this.status = n;
        var st = "Unknown";
        if (n === 0) {
            st = "Not connected";
        } else if (n === 1) {
            st = "Connecting";
        } else if (n === 2) {
            st = "Connected";
        } else if (n === 3) {
            st = "Closed";
        }
        this.statusText = st;
    };
    this.onError = function () {};
    this.onMessage = function () {};
    this.onOpen = function () {};
    this.onClose = function () {};

    this.isWS = gm.supportWS();
    this.ws = null;
    this.sessionData = null;

    if (this.isWS !== true) {
        this.start = function () {this.create();};
        this.create = function () {
            var par = this;
            if (!!this.id) {
                return this.close(function () {
                    par.create();
                });
            }
            this.setStatus(1);
            gm.request(this.url + "/create?" + this.createQuery,{json: true},function (r) {
                if (r.status !== 1) {
                    return par.onError("[Session,create]" + r.error);
                }
                if (r.res.status !== 1) {
                    if (!r.res.error) {r.res.error = "unknown";}
                    return par.onError("[Session,create] server error: " + r.res.error);
                }
                if (!r.res.session_id) {
                    return par.onError("[Session,create]: session_id not set");
                }
                par.id = r.res.session_id;
                par.startTimer();
            });
        };

        this.startTimer = function() {
            if (this.timer !== null) {
                clearInterval(this.timer);
                this.timer = null;
            }
            if (!this.id) {throw "Tried to start timer without 'session_id' set";}
            var par = this;
            this.refresh();
            par.timer = setInterval(function () {
                par.refresh();
            },interval_);
            par.setStatus(2);
            this.onOpen();
        };

        this.close = function (clb) {
            if (!this.id) {throw "Cannot close without 'session_id' set";}
            if (typeof(clb) != "function") {clb = function () {};}
            var par = this;
            gm.request(this.url + "/close?session_id=" + encodeURIComponent(this.id),{json: true},function (r) {
                if (r.status !== 1) {
                    return par.onError("[Session,close]" + r.error);
                }
                if (r.res.status !== 1) {
                    if (!r.res.error) {r.res.error = "unknown";}
                    return par.onError("[Session,close] server error: " + r.res.error);
                }
                par.stop();
                clb();
                // par.setStatus(3);
            });
        };

        this.stop = function () {
            this.id = null;
            if (this.timer !== null) {
                clearInterval(this.timer);
            }
            this.setStatus(3);
            this.onClose();
        };

        this.refresh = function () {
            if (!this.id) {throw "Cannot refresh without 'session_id' set";}
            var par = this;
            gm.request(this.url + "/refresh?session_id=" + encodeURIComponent(this.id),{json: true},function (r) {
                if (r.http_code === 404) {
                    par.stop();
                    return par.create();
                }
                if (r.status !== 1) {
                    return par.onError("[Session,refresh]" + r.error);
                }
                if (r.res.status !== 1) {
                    if (!r.res.error) {r.res.error = "unknown";}
                    return par.onError("[Session,refresh] server error: " + r.res.error);
                }
                if (!Array.isArray(r.res.res)) {
                    return;
                }
                var re = r.res.res;
                for(var i = 0;i < re.length;i++) {
                    var m = re[i];
                    if (typeof(m) != "object" || Array.isArray(m)) {continue;}
                    if (!m.type || typeof(m.type) != "string") {continue;}
                    if (!("d" in m)) {m.d = null;}
                    if (!m.thread || m.thread !== par.thread) {continue;}
                    par.onMessage(m);
                }
            });
        };

        this.send = function (d,clb) {
            if (typeof(clb) != "function") {clb = function () {};}
            if (!this.id) {throw "Cannot send without 'session_id' set";}
            var par = this;
            gm.request(this.url + "/send?session_id=" + encodeURIComponent(this.id),{
                json: true,method: "POST",body: d
            },function (r) {
                if (r.status !== 1) {
                    clb(false);
                    return par.onError("[Session,send]" + r.error);
                }
                if (r.res.status !== 1) {
                    if (!r.res.error) {r.res.error = "unknown";}
                    clb(false);
                    return par.onError("[Session,send] server error: " + r.res.error);
                }
                clb(true);
            });
        };
        
        this.ping = function () {
            gm.request(this.url + "/ping?session_id=" + encodeURIComponent(this.id),{json: true},function (r) {});
        };
        return;
    }

    this.start = function () {this.create();};

    var lo = window.location.origin;
    if (lo.startsWith("https://")) {
        lo = lo.replace("https://","wss://");
    } else if (lo.startsWith("http://")) {
        lo = lo.replace("http://","ws://");
    } else {
        throw "Page is not valid for connectiong";
    }
    if (!this.url.startsWith("/")) {
        lo = lo + window.location.pathname;
    }
    this.url = lo + this.url;
    
    this.last_create = Date.now();
    this.startReconnectTimer = function () {
        var par =this;
        var to = setInterval(function () {
            if (par.last_create + 3000 > Date.now()) {return;}
            if (par.status === 2) {return clearInterval(to);}
            par.create();
            clearInterval(to);
        },100);
    };

    this.create = function () {
        if (this.ws !== null) {
            try {this.ws.close(1000,"normal");} catch (er) {}
            this.ws = null;
            this.stop();
        }
        this.setStatus(1);
        this.ws = new WebSocket(this.url + "/ws?"+this.createQuery);
        this.last_create = Date.now();

        var par = this;
        this.ws.onopen = function () {
            par.setStatus(2);
        };
        this.ws.onmessage = function (e) {
            if (!e.data) {return;}
            var m = gm.JSONParse(e.data);
            if (!m) {return;}
            if (typeof(m) != "object" || Array.isArray(m)) {return;}
            if (!m.type || typeof(m.type) != "string") {return;}
            if (!("d" in m)) {m.d = null;}
            if (!m.thread || (m.thread !== par.thread && m.thread !== "_")) {return;}
            if (m.thread === "_") {
                if (m.type == "init") {
                    if (!!m.d) {
                        par.sessionData = m.d;
                        if (!par.sessionData.id) {
                            return par.stop();
                        }
                        par.id = par.sessionData.id;
                        par.startTimer();
                    }
                }
                return;
            }
            par.onMessage(m);
        };

        this.ws.onerror = function (e) {console.error(e);
            par.onError(e.message);
            par.stop();
            par.startReconnectTimer();
        };
        this.ws.onclose = function (e) {
            par.stop();
            var t = "Closed: Code: " + e.code + ",Reason: " + e.reason;
            if (e.code === 1000) {
                if (e.reason === "normal") {
                    return;
                }
                return par.create();
            }
            par.onError(t);
            par.startReconnectTimer();
        };
    };
    
    this.refresh = function () {};

    this.stop = function () {
        this.sessionData = null;
        this.id = null;
        if (this.timer !== null) {
            clearInterval(this.timer);
        }
        this.setStatus(3);
    };

    this.startTimer = function () {

        if (!this.sessionData) {throw "Error starting timer: no sessionData initialized";}
        clearInterval(this.timer);
        
        var par = this;
        if (!!this.sessionData.interval) {
            this.timer = setInterval(function () {
                par.ping();
            },this.sessionData.interval);
        }
    };

    this.ping = function () {
        if (!this.id) {throw "Tried to ping without id";}
        this.send({
            thread: "_",
            type: "ping",
            d: null
        });
    };

    this.send = function (d,clb) {
        if (typeof(clb) != "function") {clb = function () {};}
        if (!this.id) {throw "Cannot refresh without 'session_id' set";}
        if (!d || typeof(d) != "object") {return;}
        try {
            this.ws.send(JSON.stringify(d));
            clb(true);
        } catch (err) {
            clb(false);
        }
    };

    this.close = function () {
        try {
            this.ws.close(1000,"normal");
        } catch (err) {}
    };
}
    var Server = {
        Session: Session  
    };
    if (window.gm && window.gm._importAsset) {
		window.gm._importAsset({
			key: "Server",
			value: Server
		});
	} else {
		if (!Array.isArray(window._gm_assets)) {
			window._gm_assets = [];
		}
		window._gm_assets.push({
			key: "Server",
			value: Server
		});
	}

})();
