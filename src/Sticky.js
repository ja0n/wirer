import Wire from './Wire.js';
import Brick from './Brick.js';
import defaultBlocks from './blocks.js'
import { getParentSvg } from './utils.js';

export default class Sticky {
  constructor(id, { width, height } = { width: 800, height: 600 }) {
    this.el = document.getElementById(id);

    if (!this.el)
      throw "Couldn't find element :(";

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

    // DOM Events
    svg.addEventListener('mousedown', e => {
      normalizeEvent(e);
      this.lastSelected = null;
      const { target } = e;

      if (target.type === 'wire') {
        this.lastSelected = target.wrapper;
        return this.selectedWire = target.wrapper;
      }

      if (target.type === 'port' && target.dir === 'out') {
        return this.startAttach(target);
      }

      const parentSvg = getParentSvg(target);
      const shouldCapture = tagName => !['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(tagName);
      if (shouldCapture(target.tagName) && parentSvg && parentSvg.type == 'block') {
        const blockNode = parentSvg;
        console.debug('Block selected:', blockNode, 'Triggered by: ', target);
        var wrapper = blockNode.wrapper;
        this.lastSelected = wrapper;
        this.dragging = blockNode;
        var SVGbox = wrapper._svg.getBoundingClientRect();
        const offset = {
          x: e.x - SVGbox.left,
          y: e.y - SVGbox.top,
        };
        this._aux.mouseDown = { x: offset.x - wrapper.x, y: offset.y - wrapper.y };
        this._svg.appendChild(this.dragging);
        wrapper.wires.forEach(wire => this._svg.appendChild(wire._el));
      }

    }, false);

    document.addEventListener('keydown', e => {
      if (e.keyCode == 46) {
        console.debug('deleting', this.lastSelected);
        this.lastSelected.delete();
        // @TODO should remove from state (brick, wire, port)
      }
    }, false);

    svg.addEventListener('mouseup', e => {
      this.dragging = null;
      if(e.target.type === 'port')
        return this.endAttach(e.target);

      if(this.isState('attaching')) {
        this.setState(null)
        svg.removeChild(this._aux['wire']._el);
      }
    });

    svg.addEventListener('mousemove', e => {
      normalizeEvent(e);

      return this.attachMove(e);
    });

    svg.addEventListener('mousemove', e => {
      normalizeEvent(e);

      if (this.dragging) {
        var wrapper = this.dragging.wrapper;
        var SVGbox = wrapper._svg.getBoundingClientRect();
        var OffsetX = e.x - SVGbox.left;
        var OffsetY =  e.y - SVGbox.top;

        var firstState = this._aux.mouseDown;
        wrapper.x = OffsetX - firstState.x;
        wrapper.y = OffsetY - firstState.y;
        wrapper.updateWires();
      }
    });

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
    startBlock.x = 10; startBlock.y = this._svg.getAttribute('height')/2;
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

    return Object.assign(new Brick(cfg), data);
  }
  static createBlock(name, data = {}) {
    const cfg = this.prototype.__blocks[name];

    if (!cfg) throw "Block not registered";

    return Object.assign(new Brick(cfg), data);
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

    return { refBlock, fluxgram };
  }
  loadJSON(data) {
    this.clearCanvas(false);

    for (let block of data) {
      let refBlock = this.__blocks[block.refBlock];
      let obj = this.createBlock(block.refBlock, refBlock);
      obj.x = block.x;
      obj.y = block.y;
      obj.value = block.value;
      obj._id = block.id;
      console.log(block.id, obj._id);
      this.addObj(obj);
    }

    // load wires
    // PLEASE REFACTORATE ME

    for (let block of data) {
      let blocky = this.findById(block.id);
      console.log(blocky, block.id);

      for (let port of block.ports.out) {
        if (!port.length) {
          console.log('end of flux', block);
          break;
        }
        for (let conn of port) {
          let blocky2 = this.findById(conn.brick);
          let wire = new Wire(blocky._ports['out'][0], blocky2._ports['in'][conn.id]);
          this.addElement(wire._el);
          if (wire.seal()) {
            wire.render();
            this._wires.push(wire);
          } else {
            this.removeElement(wire._el);
          }
        }
      }

      for (let port of block.ports.flow_out) {
        if (!port.length) {
          console.log('end of flux', block);
          break;
        }
        for (let conn of port) {
          let blocky2 = this.findById(conn.brick);
          let wire = new Wire(blocky._ports['flow_out'][0], blocky2._ports['flow_in'][0]);
          this.addElement(wire._el);

          if (wire.seal()) {
            wire.render();
            this._wires.push(wire);
          } else {
            this.removeElement(wire._el);
          }
        }
      }

    }
  }
  run() {
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

    do {
      refBlock = this.blocks[block._refBlock] || this.__blocks[block._refBlock];
      flow = refBlock.behavior.call(block, this.findById.bind(this));
      // console.log(block._ports);
      id = (block._ports['flow_out'][flow]._conn[0]) ?
            (block._ports['flow_out'][flow]._conn[0]).brick :
              null;
      block = this.findById(id);
      console.log(refBlock, flow, block);
    } while(block);
  }
  compile() {

  }
}

Sticky.prototype.__blocks = defaultBlocks || {};

const normalizeEvent = e => {
  if (e.x == undefined) e.x = e.clientX;
  if (e.y == undefined) e.y = e.clientY;
};
