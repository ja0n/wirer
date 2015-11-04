import Wire from './Wire.js';
import Brick2 from './Brick2.js';
// import { StartBrick, ActuatorBrick } from './bricks';
// var EventEmitter = require('events').eventEmitter;
// var Brick = require('./Brick');

//constructor
export default class Sticky {
  constructor(id) {
    this.el = document.getElementById(id);
    if(!this.el) throw "Couldn't find element :(";
    let svg = Sticky.createElement('svg', { class: 'svg-content', viewBox: "0 0 800 400", preserveAspectRatio: "xMidYMid meet" });
    // let svg = Sticky.createElement('svg', { class: 'svg-content', width: 800, height: 400 });

    this._uid = 0;
    this._aux = {};
    this._blocks = {};
    this._objects = [];
    this._wires = [];
    this._state = null;

    svg.addEventListener('mousedown', e => {
      if(e.target.type === 'port' && e.target.dir === 'out')
        return this.startAttach(e.target);
      if(e.target.type === 'block')
        return this.startDrag(e.target);

    });

    svg.addEventListener('mouseup', e => {
      if(e.target.type === 'port')
        return this.endAttach(e.target);

      if(this.isState('attaching')) {
        this.setState(null)
        svg.removeChild(this._aux['wire']._el);
      }
    });

    svg.addEventListener('mousemove', e => {
      return this.attachMove(e);
    });

    this._svg = svg;
    this.el.appendChild(this._svg);

    this.registerBlock('start', { width: 35, height: 60, rx: 10, ry: 10, fill: '#AF2B37', ports: { data_in: 0, data_out: 0, flow_in: 0, flow_out: 1 },
      title: 'Start Block',
      icon: 'img/icon.png',
      behavior: () => 0
    });
    // this.registerBlock('actuator', ActuatorBrick);

    this.clearCanvas();

    this.colors = ["#B8D430", "#3AB745", "#029990", "#3501CB",
                   "#2E2C75", "#673A7E", "#CC0071", "#F80120",
                   "#F35B20", "#FB9A00", "#FFCC00", "#FEF200"];


    return this;
  }

//static methods
  static createElement(name, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', name);

    for (let key in attrs) el.setAttribute(key, attrs[key]);

    return el;
  }
  Brick(name, attrs) {
    var el = Sticky.createElement(name, attrs);
    var brick = new Brick(el, this);
    brick._id = this._uid++;
    this._objects.push(brick);

    return brick;
  }
  addObj(obj) {
    obj._id = this._uid++;
    this._objects.push(obj);
    this.addElement(obj._el);

    let main = obj.main;
    main.addEventListener('mousedown', turnDrag.bind(obj, true), true);
    main.addEventListener('mouseup', turnDrag.bind(obj, false), true);
    main.addEventListener('mouseout', turnDrag.bind(obj, false), true);

    main.addEventListener('mousemove', dragMove.bind(obj), false);
  }
  removeObj(obj) {
    let index = this._objects.indexOf(obj);
    if(index == -1) return;

    this.removeElement(this._objects[index]._el);
    return this._objects.splice(index, 1);
  }
  addElement(el) {
    this._svg.appendChild(el);
  }
  removeElement(el) {
    this._svg.removeChild(el);
  }
  startAttach(port) {
    var wire = new Wire(port.wrapper);
    wire._inverted = port.wrapper.dir === 'in';
    this.setState('attaching');
    this._aux['wire'] = wire;
    this.addElement(wire._el);
  }

  endAttach(port) {
    if(this.isState('attaching')) {
      this.setState(null);
      var wire = this._aux['wire'];
      wire._cp2 = port.wrapper;

      if(wire.seal()) {
        wire.render();
        this._wires.push(wire);
      } else {
        this.removeElement(wire._el);
      }
      delete this._aux['wire'];
    }
  }
  setState(state) {
    return this._state = state;
  }
  isState(state) {
    return this._state === state;
  }
  attachMove(mouse) {
    if(this.isState('attaching')) {
      var wire = this._aux['wire'];
      var SVGbox = this._svg.getBoundingClientRect();
      //(below) pixel for removing the wire from the way so we can detect the event on port
      var offset = wire._inverted ? 1 : -1;
      var mouse = { x: mouse.x - SVGbox.left + offset, y: mouse.y - SVGbox.top };
      var port = wire._cp1.getPoint();

      wire._render(port, mouse, wire._inverted);
    }
  }
  toJSON() {
    var json = this._objects.map(obj => ({
      id: obj._id,
      x: obj.x,
      y: obj.y,
      con: obj._ports.out.map(port => port._conn)
    }));

    return json;
  }
  clearCanvas() {
    let length = this._objects.length;
    for(let i = 0; i < length; i++) {
      this.removeElement(this._objects[i]._el);
    }

    this._objects = [];

    var start = this.createBlock('start');
    start.x = 10; start.y = this._svg.getAttribute('height')/2;
    start.behavior = () => 0
    this.addObj(start);
  }
  registerBlock(name, obj) {
    this._blocks[name] = obj;
  }
  createBlock(name) {
    if(!this._blocks[name]) throw "Block not registered";
    return new Brick2(this._blocks[name]);
  }
  findById(id) {
    if(!id) return null;
    for(let obj of this._objects) {
      if(obj._id === id) return obj;
    }
    // for(let i = 0; i < this._objects.length; i++) {
    //   obj = this._objects[i];
    //   if(obj._id === id) return obj;
    // }
  }
  run() {
    let block = this._objects[0], flow, id;

    // flow = start.behavior(); //an ActuatorBrick should return the flow_out port id
                             //it'll be useful for if block
    do {
      flow = block.behavior(this.findById.bind(this));
      // console.log(block._ports);
      id = (block._ports['flow_out'][flow]._conn[0]) ?
            (block._ports['flow_out'][flow]._conn[0]).brick :
              null;
      block = this.findById(id);
    } while(block);


  behavior: () => 0  //return json;
  }

}

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
