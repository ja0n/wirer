import Wire from './Wire.js';
import Brick from './Brick.js';

export default class Sticky {
  constructor(id) {
    this.el = document.getElementById(id);

    if (!this.el)
      throw "Couldn't find element :(";

    const svg = Sticky.createElement('svg', { class: 'svg-content', viewBox: "0 0 800 600", preserveAspectRatio: "xMidYMid meet" });
    // let svg = Sticky.createElement('svg', { class: 'svg-content', width: 800, height: 400 });
    this._uid = 0;
    this._aux = {};
    this.blocks = {};
    this._objects = [];
    this._wires = [];
    this._state = null;

    let lastDownTarget;

    svg.addEventListener('mousedown', e => {
      normalizeEvent(e);
      // lastDownTarget = svg;
      this.lastSelected = null;

      if (e.target.type === 'wire') {
        this.lastSelected = e.target.wrapper;
        return this.selectedWire = e.target.wrapper;
      }

      if (e.target.type === 'port' && e.target.dir === 'out') {
        return this.startAttach(e.target);
      }

      if (e.target.type === 'block' || e.target.type === 'title') {
        this.lastSelected = e.target.parentNode.wrapper;
        this.dragging = e.target.parentNode;
        var wrapper = this.dragging.wrapper;
        var SVGbox = wrapper._svg.getBoundingClientRect();
        var OffsetX = e.x - SVGbox.left;
        var OffsetY =  e.y - SVGbox.top;
        this._aux.mouseDown = { x: OffsetX - wrapper.x, y: OffsetY - wrapper.y };
        this._svg.appendChild(this.dragging);
        wrapper.wires.forEach(wire => this._svg.appendChild(wire._el));
      }

    }, false);


    document.addEventListener('mousedown', e => {
      // lastDownTarget = e.target;
      // console.log(lastDownTarget);
    }, false);

    document.addEventListener('keydown', e => {
      // if (lastDownTarget == svg) {
      if (e.keyCode == 46) {
        console.log(this.lastSelected);
        this.lastSelected.delete();
      }
    }, false);

    svg.addEventListener('keydown', e => {
      console.log(e);
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

    this._svg = svg;
    this.el.appendChild(this._svg);
    this.matchViewBox();

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
      if (obj._ports[port_type][0]) { // if there's any connection
        for (let port of obj._ports[port_type]) {
          // port.dettach();
        }
      }
    }

    for (let wire of obj.wires) {
      wire.delete();
    }

    this.removeElement(obj._el);
    if (update)
      return this._objects.splice(index, 1);
  }
  addElement(el) {
    this._svg.appendChild(el);
  }
  removeElement(el) {
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
      var offset = wire._inverted ? 1 : -1;
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
        if (!port[0]) {
          console.log('end of flux');
          break;
        }
        let blocky2 = this.findById(port[0].brick);
        let wire = new Wire(blocky._ports['out'][0], blocky2._ports['in'][port[0].id]);
        this.addElement(wire._el);
        if (wire.seal()) {
          wire.render();
          this._wires.push(wire);
        } else {
          this.removeElement(wire._el);
        }
      }

      for (let port of block.ports.flow_out) {
        console.log(port);
        if (!port[0]) {
          console.log('end of flux');
          break;
        }
        let blocky2 = this.findById(port[0].brick);
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
  run() {
    let block = this._objects[0], flow, id, refBlock;
    console.log(block);

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

Sticky.prototype.__blocks = {
  'start': {
    id: 'start',
    width: 35,
    height: 60,
    rx: 10,
    ry: 10,
    fill: '#AF2B37',
    ports: { data_in: 0, data_out: 0, flow_in: 0, flow_out: 1 },
    title: '',
    icon: 'img/icon.png',
    behavior: () => 0
  },
  'Source': {
    id: 'Source',
    fill: '#4fec2f',
    ports: { data_in: 0, data_out: 1, flow_in: 0, flow_out: 0 },
    title: 'Source Block',
    gui: {
      number: { label: 'Number', type: 'number' }
    },
    behavior: function() {
      return [this.inputs.number];
    }
  },
  'Comparison': {
    id: 'Comparison',
    fill: '#4fec2f',
    ports: { data_in: 2, data_out: 1, flow_in: 0, flow_out: 0 },
    title: 'Comparison Block',
    gui: {
      op: { label: 'Operation', type: 'select', options: ['==', '!=', '===', '!==', '>', '>=', '<', '<='] },
    },
    behavior: function(findById) {
      const conn1 = (this._ports['in'][0]._conn[0]);
      const conn2 = (this._ports['in'][1]._conn[0]);
      const brick1 = findById(conn1.brick);
      const brick2 = findById(conn2.brick);
      const val1 = brick1.behavior(findById)[conn1.id];
      const val2 = brick2.behavior(findById)[conn2.id];

      return [eval(`${val1} ${this.inputs.op} ${val2}`)];
    }
  },
  'Alert': {
    id: 'Alert',
    fill: '#EC962F',
    ports: { data_in: 1, data_out: 0, flow_in: 1, flow_out: 1 },
    title: 'Alert Block',
    behavior: function(findById) {
      const conn = this._ports['in'][0]._conn[0];
      const brick = findById(conn.brick);
      const data = brick.behavior(findById)[conn.id];

      alert(data);

      return 0;
    }
  },
  'Sum': {
    id: 'Sum',
    fill: '#3e67c2',
    ports: { data_in: 2, data_out: 1, flow_in: 0, flow_out: 0 },
    title: 'Sum Block',
    behavior: function(findById) {
      const conn1 = (this._ports['in'][0]._conn[0]);
      const conn2 = (this._ports['in'][1]._conn[0]);
      const brick1 = findById(conn1.brick);
      const brick2 = findById(conn2.brick);
      const val1 = brick1.behavior(findById)[conn1.id];
      const val2 = brick2.behavior(findById)[conn2.id];

      return [val1 + val2];
    }
  },
  'If': {
    id: 'If',
    fill: '#3e67c2',
    ports: { data_in: 1, data_out: 0, flow_in: 1, flow_out: 2 },
    title: 'If Block',
    behavior: function(findById) {
      const conn = this._ports['in'][0]._conn[0];
      const brick = findById(conn.brick);
      const data = brick.behavior(findById)[conn.id];

      return data ? 0 : 1;
    }
  },
};


const normalizeEvent = e => {
  if (e.x == undefined) e.x = e.clientX;
  if (e.y == undefined) e.y = e.clientY;
};
