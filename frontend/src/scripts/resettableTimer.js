/*jslint unused:false*/
var ResettableTimer = (function(){

	var RTimer = function(options) {
		this.timeout = null;
		this.cb = options.cb;
		this.time = options.time;

		return this;
	};

	var PROTO = RTimer.prototype;

	PROTO.setTime = function(time) {
		this.time = time;
	};

	PROTO.reset = function() {
		if(this.timeout && this.cb) {
			window.clearTimeout(this.timeout);
		}
		this.start();
	};

	PROTO.start = function() {
		if(this.time && this.cb) {
			this.timeout = window.setTimeout(this.cb, this.time);
		}
	};

	PROTO.setCB = function(cb) {
		this.cb = cb;
	};

	return RTimer;
})();