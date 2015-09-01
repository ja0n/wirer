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
      this._svg.removeChild(this._aux.attaching.wire._el);
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

Sticky.createElement = function(name, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', name);

  for(var key in attrs) el.setAttribute(key, attrs[key]);

  return el;
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
  _wires: [

  ],
  Wrapper: function(name, attrs) {
    var el = Sticky.createElement(name, attrs);
    var wrapper = new Wrapper(el, this);
    wrapper._id = this._uid++;
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
  var wire = new Wire(e.target);
  wire._inverted = e.target.dir === 'in';
  this._states.attaching = true;
  this._aux.attaching.wire = wire;
  this._svg.appendChild(wire._el);
}

function endAttach(e) {
  if(this._states.attaching) {
    this._states.attaching = false;
    var wire = this._aux.attaching.wire;
    wire._cp2 = e.target;
    wire.seal();
    wire.render();
    this._wires.push(wire);
    delete this._aux.attaching.wire;

  }
}

function attachMove(e) {
  if(this._states.attaching) {
    var wire = this._aux.attaching.wire;
    var SVGbox = this._svg.getBoundingClientRect();
    var offset = wire._inverted ? 1 : -1; //pixel for removing the wire from the way so we can detect the event on port
    var mouse = { x: e.x - SVGbox.left + offset, y: e.y - SVGbox.top };
    var port = wire._cp1.getPoint();

    wire._render(port, mouse, wire._inverted);
  }
}
