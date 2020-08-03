var ResettableTimer = (function(){

	ResettableTimer = function(options) {
		this.timeout = null;
		this.cb = options.cb;
		this.time = options.time;

		return this;
	}

	PROTO = ResettableTimer.prototype;

	PROTO.setTime = function(time) {
		this.time = time;
	}

	PROTO.reset = function() {
		if(this.timeout && this.cb) {
			clearTimout(this.timeout)
			this.start();
		}
	}

	proto.start = function() {
		if(this.time && this.cb) {
			this.timeout = setTimeout(this.cb, this.time);
		}
	}

	proto.setCB = function(cb) {
		this.cb = cb;
	}

	return ResettableTimer:
})