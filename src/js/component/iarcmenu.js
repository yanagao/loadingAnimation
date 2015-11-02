
function iArcMenu(opt) {

	if (!opt.dom) {
		throw new Error('Please Input Major Dom');
	}

	console.log(opt);
	this._opt = opt;

	var self = this;

	setTimeout(function() {
		self._setting();

		self._adaptToScreen();
		// render basic menu html
		self._renderHTML();

		// calculate menu transform degree and distance
		self._transformDist();
	}, 200);
}

iArcMenu.prototype._setting = function() {
	// framework option
	// shape content data
	this.data = this._opt.data;

	this.control = this._opt.control;

	// wrapper dom
	this.dom = this._opt.dom;
	console.log(this._opt.dom);

	//menu type
	this.type = this._opt.type || 'arc';

	// move distance
	this.dist = this._opt.distance || 100;

	// degree of starting point
	this.startDegree = 0;

	// display offset degree, clockwise
	this.offsetDegree = this._opt.offsetDegree || 0;

	// menu display degree only those figures that mod 6 = 0  can be accepted, only for type 'arc'
	this.rangeDegree = this._opt.rangeDegree || 360;

	// distance difference between 2 shapes, only for type 'line'
	this.diffDist = this._opt.diffDist || 100;

	// diameter of cicles
	this.diameter = opt.diameter || 50;

	// another form of degree
	this.radiusPI = 2 * Math.PI / 360;

	this.duration = opt.duration || 1000;

	this.durationOffset = opt.durationOffset || 0;

	// circle elements
	this.ele = [];

	// element position array
	this.elePos = [];

	//control Button
	this.controlItem = null;

};

iArcMenu.prototype._adaptToScreen = function() {

	//screen size
	this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    this.domWidth = this.dom.clientWidth;
    this.domHeight = this.dom.clientHeight;
    
	if (this.screenWidth > this.screenHeight) {
		this.baseWidth = 1024;
	    this.baseHeight = 768;
	    this.adjustRatio = this.screenHeight / this.baseHeight;
	}
	else {
		this.baseWidth = 768;
	    this.baseHeight = 1024;
	    this.adjustRatio = this.screenWidth / this.baseWidth;
	}

	this.dist *= this.adjustRatio;

	this.diffDist *= this.adjustRatio;

	this.diameter *= this.adjustRatio;
};

// render basic menu html
iArcMenu.prototype._renderHTML = function() {

	var item = false;
	// var subItem = false;
	var len = this.data.length;

	// render control btn at last index
	for (var i = 0; i <= len; i++) {
		item = document.createElement("div");
		item.style.width = this.diameter + 'px';
		item.style.height = this.diameter + 'px';
		item.style.WebkitBorderRadius = (this.diameter / 10) + 'em';
		item.style.MozBorderRadius = (this.diameter / 10) + 'em';
		item.style.BorderRadius = (this.diameter / 10) + 'em';

		if (i === len) {
			item.className = 'iArcMenu-control iArcMenu-control-on';
			item.style.zIndex = this.data.length;

			this.dom.appendChild(item);
			this._bindControlTouchHandler(item);
			this.controlItem = item;
		}
		else {
			item.className = 'iArcMenu-shape';
			item.setAttribute('data-id', i);
			item.style.zIndex = (len - i);

			this.dom.appendChild(item);

			var subItem = document.createElement('div');
			subItem.className = (this.data[i].class) ? (' ' + this.data[i].class) : '';
			subItem.innerHTML = (this.data[i].content) ? (this.data[i].content) : '';
			item.appendChild(subItem);

			var scaleMuliplier = (this.data[i].scale) ? this.data[i].scale : 1;
			subItem.style.WebkitTransform = 'scale(' + (scaleMuliplier * this.adjustRatio) + ')';

			this.ele.push(item);
			this._bindItemTouchHandler(i);
		}

	}
		
};

iArcMenu.prototype._bindItemTouchHandler = function(index) {

	if (this.data[index].callback) {
		this.ele[index].addEventListener('touchstart', this.data[index].callback, false);
	}
};

iArcMenu.prototype._touchEvent = function(evt) {

	var self = this.arg;
	evt.target.removeEventListener('touchstart', self._touchEvent, false);
	if (self.controlToggle === 0) {
		self._animate('forward');
		self.controlToggle = 1;
		this.className = 'iArcMenu-control iArcMenu-control-off';
	}
	else {
		self._animate('backward');
		self.controlToggle = 0;
		this.className = 'iArcMenu-control iArcMenu-control-on';
	}
};

iArcMenu.prototype._bindControlTouchHandler = function(control) {

	this.controlToggle = 0;
	control.arg = this;

	control.addEventListener('touchstart', this._touchEvent, false);
};

// calculate menu transform degree and distance
iArcMenu.prototype._transformDist = function() {

	this.transformData = [];

	var len = this.data.length;

	if (this.rangeDegree === 360) {
		this.degree = this.rangeDegree / len;
	}
	else {
		this.degree = this.rangeDegree / (len - 1);
	}

	var item = false;
	var rotateDegree = this.startDegree + this.offsetDegree;
	var transferDist = this.dist;

	if (this.type === 'static') {
		for (var i = 0; i < len; i++) {
			item = {
				x: this.data[i].left || 0,
				y: this.data[i].top || 0
			};

			this.transformData.push(item);
		}
		this.duration = 1;
	}
	else if (this.type === 'line') {
		for (var i = 0; i < len; i++) {
		
			item = {
				x: Math.floor(Math.cos(rotateDegree * this.radiusPI) * transferDist * 100) / 100,
				y: Math.floor(Math.sin(rotateDegree * this.radiusPI) * transferDist * 100) / 100
			};

			this.transformData.push(item);
			transferDist += this.diffDist;
		}
	}
	else {
		for (var i = 0; i < len; i++) {
			
			item = {
				x: Math.floor(Math.cos(rotateDegree * this.radiusPI) * transferDist * 100) / 100,
				y: Math.floor(Math.sin(rotateDegree * this.radiusPI) * transferDist * 100) / 100
			};

			this.transformData.push(item);
			rotateDegree += this.degree;
		}
	}
}

// menu start translate
iArcMenu.prototype._animate = function(type) {

	var len = this.data.length;
	var self = this;
	this.duration = this._opt.duration;
	var touchEventWaitTime = this.duration - this.durationOffset;

	for (var i = 0; i < len; i++) {
		if (this.type === 'static') {
			this.ele[i].style.WebkitTransition = '-webkit-transform 0ms';
		}
		else {
			this.ele[i].style.WebkitTransition = '-webkit-transform 500ms';
		}
	}

	for (var i = 0; i < len; i++) {
		this._moveAni(i, type);
		touchEventWaitTime += this.durationOffset;
	}

	setTimeout(function() {
		self.controlItem.addEventListener('touchstart', self._touchEvent, false);
	}, touchEventWaitTime);

};

// menu translate animation, forward or backward animation
iArcMenu.prototype._moveAni = function(index, type) {

	var ele = this.ele;
	var transformData = this.transformData;

	setTimeout(function(){
			ele[index].style.WebkitTransform = (type === 'forward')? 
				'translate3d('+ transformData[index].x +'px, ' + transformData[index].y + 'px, 0)' :
				'translate3d(0, 0, 0)';
	}, this.duration);

	this.duration += this.durationOffset;
}

// reset animation
iArcMenu.prototype.reset = function() {
	this._setting();
	this._animate('backword');
}