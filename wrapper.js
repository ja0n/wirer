var Wrapper = function(el, that) {
	// this._el = el;
	this._el = lokor();

	arrangePorts.call(this);

	var main = this._el.getElementById('main');
	main.addEventListener('mousedown', turnDrag.bind(this, true), true);
	main.addEventListener('mouseup', turnDrag.bind(this, false), true);
	main.addEventListener('mouseout', turnDrag.bind(this, false), true);

	main.addEventListener('mousemove', dragMove.bind(this), true);
	//this._svg.addEventListener('mousemove', attachMove.bind(this), true);
};

Wrapper.prototype = {
	_id: null,
	_container: null,
	_ports: {
		in0: { conn: [], side: 'left' },
		out0: { conn: [], side: 'right' }
	},
	get _svg() { return getSvg(this._el); },
  get x () { return this._el.getAttribute('x'); },
  get y () { return this._el.getAttribute('y'); },
	get text () { return this._el.innerHTML; },
  set x (val) { return this._el.setAttribute('x', val); },
  set y (val) { return this._el.setAttribute('y', val); },
	set text (val) { return (this._el.innerHTML = val); },
	_states: {
		dragging: false
	},
	attr: function(key, value) {
		if (value) return this._el.setAttribute(key, value);
		else if (key) return this._el.getAttribute(key);
	},
	detach: function() {
		this._el.parentNode.removeChild(this._el);
		return this;
	},
	_aux: {
		attaching: {},

	},
	arrangePorts: function() {

	},
};

function turnDrag(val, e) {
	this._states.dragging = val;
	if(val) {
		var SVGbox = this._svg.getBoundingClientRect();
		var OffsetX = e.x - SVGbox.left;
		var OffsetY =  e.y - SVGbox.top;
		this._aux.mouseDown = { x: OffsetX - this.x, y: OffsetY - this.y };
	}

}

function dragMove(e) {
	if(this._states.dragging) {
		var SVGbox = this._svg.getBoundingClientRect();
		var OffsetX = e.x - SVGbox.left;
		var OffsetY =  e.y - SVGbox.top;

		var firstState = this._aux.mouseDown;
		this.x = OffsetX - firstState.x;
		this.y = OffsetY - firstState.y;

	}
}

function getSvg(el) {
  if(el.parentNode.nodeName === 'svg') {
      return el.parentNode;
  }
  return getSvg(el.parentNode);
}

function getPosition(el) {

    var elPos = el.getBoundingClientRect();
    var vpPos = getSvg(el).getBoundingClientRect();


    return {
        top: elPos.top - vpPos.top,
        left: elPos.left - vpPos.left,
        width: elPos.width,
        bottom: elPos.bottom - vpPos.top,
        height: elPos.height,
        right: elPos.right - vpPos.left
    };

}

function lokor() {
  var svg = Sticky.createElement('svg');
  var strokeWidth = 3;
  var marginLeft = 10;

  var attrs = {
    x: marginLeft + strokeWidth/2,
    y: strokeWidth/2,
    width: 150,
    height: 50,
    rx: 20,
    ry: 20,
    'stroke-width': strokeWidth,
    style: 'fill: red; stroke: black; opacity: 1',
    id: 'main'
  };

  var rect = Sticky.createElement('rect', attrs);

  // var forei = Sticky.createElement('foreignObject', { width: 100, height: 40 });
  // var body = Sticky.createElement('body', { xmlns: 'http://www.w3.org/1999/xhtml' });
  // var input = Sticky.createElement('input', { type: 'text' });
  // body.appendChild(input);
  // forei.appendChild(body);
  // rect.appendChild(forei);

  svg.appendChild(rect);
  return svg;
}

function arrangePorts() {
	var radius = 10;
	var strokeWidth = 3.5;
	var ports = this._ports;
	var port = null;
	var rectBox = this._el.getElementById('main').getBBox();
	rectBox.width = this._el.getElementById('main').getAttribute('width');
	rectBox.height = this._el.getElementById('main').getAttribute('height');
  var attrs = { id: null, cx: 12.5, cy: 27.5, r: radius, fill: 'yellow', stroke: 'black', 'stroke-width': strokeWidth };

	var margin = radius + strokeWidth/2;

	for (var name in ports) {
		var that = this;
		attrs.id = name;
		switch (ports[name].side) {
			case 'top': attrs.cx = rectBox.width/2; attrs.cy = margin; break;
			case 'right': attrs.cx = rectBox.width + margin; attrs.cy = rectBox.height/2; break;
			case 'bottom': attrs.cx = rectBox.width/2; attrs.cy = rectBox.height; break;
			case 'left': attrs.cx = margin; attrs.cy = rectBox.height/2; break;
		}
		port = Sticky.createElement('circle', attrs);
		port.owner = this;
		port.type = 'port';

		port.attr = function(key, value) {
			if(value) return this.setAttribute(key, value);
			else return this.getAttribute(key);
		};

		//port.addEventListener('mousedown', startAttach.bind(this));
		//port.addEventListener('mouseup', endAttach.bind(this));
  	this._el.appendChild(port);
	}

}
