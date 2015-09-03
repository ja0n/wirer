//constructor
function Stricky(sel) {
  this.el = document.querySelector(sel);
  if(!this.el) throw "Couldn't find element :(";
  this._svg = Sticky.createElement('svg', { class: 'svg-content', width: 1200, height: 500 });
  this.el.appendChild(this._svg);

  this._uid = 0;
  this._aux = { attaching: {} };
  this._states = {};
  this._objects = [ ];
  this._wires = [ ];

  var that = this;

  this._svg.addEventListener('mousedown', e => {
    if(e.target.type === 'port')
      return this.startAttach(e.target);

  });

  this._svg.addEventListener('mouseup', e => {
    if(e.target.type === 'port')
      return this.endAttach(e.target);

    if(this._states.attaching) {
      this._states.attaching = false;
      this._svg.removeChild(this._aux.attaching.wire._el);
    }
  });

  this._svg.addEventListener('mousemove', e => {
    return this.attachMove(e);
  });

  this.colors = ["#B8D430", "#3AB745", "#029990", "#3501CB",
                 "#2E2C75", "#673A7E", "#CC0071", "#F80120",
                 "#F35B20", "#FB9A00", "#FFCC00", "#FEF200"];

  return this;
}

//static methods

Sticky.createElement = function(name, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', name);

  for(var key in attrs) el.setAttribute(key, attrs[key]);

  return el;
};

//prototype
Sticky.prototype = {
  // __proto__: null,
  Brick(name, attrs) {
    var el = Sticky.createElement(name, attrs);
    var brick = new Brick(el, this);
    brick._id = this._uid++;
    this._objects.push(brick);

    return brick;
  },
  addObj(obj) {
    obj._id = this._uid++;
    this._objects.push(obj);
    this.addElement(obj);
  },
  removeObj(obj) {
    return this._objects.splice(this._objects.indexOf(obj), 1);
  },
  addElement(wrapper) {
    this._svg.appendChild(wrapper._el);
  },
  startAttach(port) {
    var wire = new Wire(port);
    wire._inverted = port.dir === 'in';
    this._states.attaching = true;
    this._aux.attaching.wire = wire;
    this._svg.appendChild(wire._el);
  },

  endAttach(port) {
    if(this._states.attaching) {
      this._states.attaching = false;
      var wire = this._aux.attaching.wire;
      wire._cp2 = port;
      wire.seal();
      wire.render();
      this._wires.push(wire);
      delete this._aux.attaching.wire;

    }
  },
  attachMove(mouse) {
    if(this._states.attaching) {
      var wire = this._aux.attaching.wire;
      var SVGbox = this._svg.getBoundingClientRect();
      //(below) pixel for removing the wire from the way so we can detect the event on port
      var offset = wire._inverted ? 1 : -1;
      var mouse = { x: mouse.x - SVGbox.left + offset, y: mouse.y - SVGbox.top };
      var port = wire._cp1.getPoint();

      wire._render(port, mouse, wire._inverted);
    }
  }

};
