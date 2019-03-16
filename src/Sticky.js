import get from 'lodash/get';

import Wire from './Wire.js';
import Brick from './Brick.js';
import defaultBlocks from './blocks.js';
import { register } from './dom-handler.js' 

import "./styles/default.scss";

export default class Sticky {
  constructor(id, { width, height } = { width: 800, height: 600 }) {
    this.el = document.getElementById(id);

    if (!this.el)
      throw "Couldn't find element :(";

    this.el.classList.add('sticky__canvas');

    this._uid = 0;
    this._aux = {};
    this.blocks = {};
    this._objects = [];
    this._wires = [];
    this._state = null;

    const svg = Sticky.createElement('svg', { class: 'svg-content', preserveAspectRatio: "xMidYMid meet" });
    this._svg = svg;
    this.el.appendChild(this._svg);
    this.matchViewBox();

    // this.registerBlock('actuator', ActuatorBrick);

    this.clearCanvas();
    this.setCanvasSize({ width, height });

    this.colors = ["#B8D430", "#3AB745", "#029990", "#3501CB",
                   "#2E2C75", "#673A7E", "#CC0071", "#F80120",
                   "#F35B20", "#FB9A00", "#FFCC00", "#FEF200"];

    register.call(this);

    return this;
  }

  setCanvasSize({ width, height }) {
    this._svg.style.width = width;
    this._svg.style.height = height;
    this._svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

//static methods
  static createElement(name, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', name);

    for (let key in attrs)
      el.setAttribute(key, attrs[key]);

    return el;
  }

  matchViewBox() {
    const { width, height } = this._svg.getBoundingClientRect();

    this._svg.setAttribute('viewBox', `0, 0, ${width} ${height}`);
  }
  Brick(name, attrs) {
    var el = Sticky.createElement(name, attrs);
    var brick = new Brick(el, this);
    brick._id = this._uid++;
    this._objects.push(brick);

    return brick;
  }
  addObj(obj) {
    if (obj._id == null) obj._id = this._uid++;
    this._objects.push(obj);
    this.addElement(obj._el);
  }
  removeObj(obj, update) {
    let index = this._objects.indexOf(obj);
    if (index == -1) return;

    for (let port_type of Object.keys(obj._ports)) {
      if (obj._ports[port_type].length) { // if there's any connection
        for (let port of obj._ports[port_type]) {
          // port.dettach();
        }
      }
    }

    for (let wire of [...obj.wires]) {
      wire.delete();
    }

    this.removeElement(obj._el);
    if (update)
      // should splice wires too
      return this._objects.splice(index, 1);
  }
  addElement(el) {
    this._svg.appendChild(el);
  }
  removeElement(el) {
    if (this._svg.contains(el))
      this._svg.removeChild(el);
  }
  startAttach(port) {
    let wire = new Wire(port.wrapper);
    wire._inverted = port.wrapper.dir === 'in';
    this.setState('attaching');
    this._aux['wire'] = wire;
    this.addElement(wire._el);
  }
  startDrag(port) {
    this.setState('attaching');
    this._aux['wire'] = wire;
    this.addElement(wire._el);
  }
  endAttach(port) {
    if (this.isState('attaching')) {
      this.setState(null);
      var wire = this._aux['wire'];
      wire._cp2 = port.wrapper;

      if (wire.seal()) {
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
    if (this.isState('attaching')) {
      var wire = this._aux['wire'];
      var SVGbox = this._svg.getBoundingClientRect();
      //(below) pixel for removing the wire from the way so we can detect the event on port
      var offset = wire._inverted ? 4 : -4;
      var mouse = { x: mouse.x - SVGbox.left + offset, y: mouse.y - SVGbox.top };
      var port = wire._cp1.getPoint();

      wire._render(port, mouse, wire._inverted);
    }
  }
  clearCanvas(start = true) {
    for (let obj of this._objects) {
      // this.removeElement(obj._el);
      this.removeObj(obj, false);
    }

    this._objects = [];
    this._wires = [];

    if (!start) return;

    const startBlock = this.createBlock('start');
    startBlock.x = 30; startBlock.y = 30;
    startBlock.behavior = () => 0;

    this.addObj(startBlock);
  }
  registerBlock(name, obj) {
    this.blocks[name] = {
      ...obj,
      id: name,
      behavior: typeof obj.behavior !== 'function' ? new Function('findById', obj.behavior) : obj.behavior
    }
  }
  static registerBlock(name, obj) {
    this.prototype.__blocks[name] = {
      ...obj,
      id: name,
      behavior: typeof obj.behavior !== 'function' ? new Function('findById', obj.behavior) : obj.behavior
    }
  }
  createBlock(name, data = {}) {
    const cfg = this.blocks[name] || this.__blocks[name];

    if (!cfg) throw `Block '${name}' not registered`;

    return new Brick({ ...cfg, ...data });
  }
  static createBlock(name, data = {}) {
    const cfg = this.prototype.__blocks[name];

    if (!cfg) throw "Block not registered";

    return new Brick({ ...cfg, ...data });
  }
  findById(id) {
    if (id == undefined) return null;
    for (let obj of this._objects) {
      if (obj._id === id) return obj;
    }
  }
  toJSON() {
    var fluxgram = this._objects.map(obj => {
      let object = {
        refBlock: obj._refBlock,
        inputs: obj.inputs,
        id: obj._id,
        x: obj.x,
        y: obj.y,
        ports: {} // flow_in, flow_out, in, out
      };

      for (let type in obj._ports) {
        console.log(type, obj._ports[type]);
        object.ports[type] = obj._ports[type].map(port => [...port._conn]);
      }

      return object;
    });

    let refBlock = Object.entries(this.__blocks).map(
      ([blockId, block]) => ({
        ...block,
        behavior: block.behavior.toString(),
      })
    );

    const string = JSON.stringify({ refBlock, fluxgram }, null, 2);
    copy(string);
    return JSON.parse(string);
  }

  sealOrDiscard (...cps) {
    const wire = new Wire(...cps);
    this.addElement(wire._el);
    if (wire.seal()) {
      wire.render();
      this._wires.push(wire);
    } else {
      this.removeElement(wire._el);
    }
  }

  loadPorts (blocky, ports, [from, to]) {
    ports.forEach((port, index) => {
      for (let conn of port) {
        const blocky2 = this.findById(conn.brick);
        const cps = [
          blocky._ports[from][index],
          blocky2._ports[to][conn.id],
        ];
        this.sealOrDiscard(...cps)
      }
    });
  }

  loadJSON (data) {
    this.clearCanvas(false);

    for (let block of data) {
      const { refBlock, inputs, x, y, value, id } = block;
      const obj = this.createBlock(refBlock, { inputs });
      obj.x = x;
      obj.y = y;
      obj.value = value;
      obj._id = id;
      this.addObj(obj);
    }

    // load wires
    for (let block of data) {
      const blocky = this.findById(block.id);
      this.loadPorts(blocky, block.ports.out, ['out', 'in']);
      this.loadPorts(blocky, block.ports.flow_out, ['flow_out', 'flow_in']);
    }
  }

  reload () {
    const flow = this.toJSON().fluxgram;
    this.clearCanvas(true);
    this.loadJSON(flow);
  }

  run () {
    let flow, id, refBlock;
    let block = this._objects.find(({ _refBlock }) => _refBlock == 'start');

    if (!block) {
      console.warning('Start block not found');
      return false;
    }

    console.debug('Start block found:', block);

    // flow = start.behavior();
    // an ActuatorBrick should return the flow_out port id
    // it'll be useful for if block
    const findById = this.findById.bind(this);

    let step = 0;
    do {
      refBlock = this.blocks[block._refBlock] || this.__blocks[block._refBlock];
      flow = refBlock.behavior.call(block, findById);
      id = get(block._ports, ['flow_out', flow, '_conn', 0, 'brick'], null);
      block = findById(id);
      console.debug('Step', ++step, refBlock);
      console.debug('Next Step', flow, block);
    } while(block);
  }

  compile () {

  }
}

Sticky.prototype.__blocks = defaultBlocks || {};
