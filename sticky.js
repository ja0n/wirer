//constructor
var Sticky = function(sel) {
  this.el = document.querySelector(sel);
  if(!this.el) return { error: "Couldn't initialize :(" };
  this._svg = Sticky.createElement('svg', { class: "svg-content", width: 1200, height: 500 }, true);
  this.el.appendChild(this._svg);

  var that = this;

  this._svg.addEventListener('mousedown', (function(e) {
    if(e.target.type === 'port') return startAttach.call(this, e);

  }).bind(this));

  this._svg.addEventListener('mouseup', (function(e) {
    if(e.target.type === 'port') return endAttach.call(this, e);

    if(this._states.attaching) {
      this._states.attaching = false;
      this._svg.removeChild(this._aux.attaching.wire);
    }
  }).bind(this));

  this._svg.addEventListener('mousemove', (function(e) {
    attachMove.call(that, e);
  }).bind(this));

  this.colors = ["#B8D430", "#3AB745", "#029990", "#3501CB",
                "#2E2C75", "#673A7E", "#CC0071", "#F80120",
                "#F35B20", "#FB9A00", "#FFCC00", "#FEF200"];
};

//static methods
Sticky.Wrapper = function(name, attrs) {
  var el = Sticky.createElement(name, attrs);

  return new Wrapper(el, this);
};

Sticky.createElement = function(name, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', name);

  for(var key in attrs) el.setAttribute(key, attrs[key]);

  return el;
};

Sticky.describeJoint = function(x1, y1, x2, y2, pad) {
  var d = [
    "M", x1, y1,
    "C", x1 + pad, y1, x2 - pad, y2, x2, y2
  ].join(" ");

  return d;
};

//prototype
Sticky.prototype = {
  _uid: 0,
  _aux: {
    attaching: {}
  },
  _states: {

  },
  _objects: [

  ],
  Wrapper: function(name, attrs) {
    var el = Sticky.createElement(name, attrs);
    var wrapper = new Wrapper(el, this);
    wrapper._id = _uid++;
    this._objects.push(wrapper);

    return wrapper;
  },
  addObj: function(obj) {
    obj._id = this._uid++;
    this._objects.push(obj);
    this.addElement(obj);
  },
  removeObj: function(obj) {
    return this._objects.splice(this._objects.indexOf(obj), 1);
  },
  addElement: function(wrapper) {
    this._svg.appendChild(wrapper._el);
  }

};

function startAttach(e) {
  console.log('eae');
	var wire = Sticky.createElement('path', { stroke: 'black', 'stroke-width': 6, fill: 'none' });
	this._states.attaching = true;
	this._aux.attaching.from = e.target;
	this._aux.attaching.wire = wire;
  this._svg.appendChild(wire);

	// if(val) {
	// 	var SVGbox = this._svg.getBoundingClientRect();
	// 	var OffsetX = e.x - SVGbox.left;
	// 	var OffsetY =  e.y - SVGbox.top;
	// 	this._aux.mouseDown = { x: OffsetX - this.x, y: OffsetY - this.y };
	// }
}

function endAttach(e) {
	 if(this._states.attaching) {
    this._states.attaching = false;
		console.log(this._aux.attaching.from);
		console.log(e.target);

	}
}

function dt2p(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function attachMove(e) {
	if(this._states.attaching) {
		var wire = this._aux.attaching.wire;
    var from = this._aux.attaching.from;
		var SVGbox = this._svg.getBoundingClientRect();
		var mouse = { x: e.x - SVGbox.left, y: e.y - SVGbox.top };
    var port = { x: from.owner.x *1 + from.attr('cx') *1, y: from.owner.y *1 + from.attr('cy') *1 };

    var dt = dt2p(port.x, port.y, mouse.x, mouse.y)/2;
    var cp = this._aux.attaching.from.dir === 'in' ? -dt : dt;
	  var d = Sticky.describeJoint(port.x, port.y, mouse.x, mouse.y, cp);
		this._aux.attaching.wire.setAttribute('d', d);
	}
}
