import blockBuilder, { htmlBlockBuilder } from './blockBuilder.js';
import { getParentSvg } from './utils';
import arrangePorts from './arrangePorts';

const RENDER_HTML = true;

const defaultConfig = {
  strokeWidth: 3,
  marginLeft: 0,
  width: 140,
  opacity: 1,
  height: 50,
  rx: 20,
  ry: 20,
  fill: '#1F8244',
  stroke: '#000000',
  gui: {},
}

export default class Brick {
  constructor (custom = {}) {
    const cfg = { ...defaultConfig, ...custom };
    const { behavior, title, ports, icon, gui, id, x, y, inputs } = cfg;

    // this._id = id;
    this.inputs = inputs || {};
    this._el = (RENDER_HTML ? htmlBlockBuilder : blockBuilder)(this, cfg);
    this.behavior = behavior;
    this._container = null;
    this._refBlock = id;
    this.x = x || 0;
    this.y = y || 0;

    this._ports = {
      in: [],
      out: []
    };

    this.wires = [];

    this._aux = { attaching: {} };
    this._states = { dragging: false };

    arrangePorts.call(this, ports, gui);

    return this;
  }

  get data () { return this.behavior(); }
  get main () { return this._el.querySelector('#main'); }
  get _svg () { return getParentSvg(this._el); }
  get x () { return this._el.getAttribute('x') * 1; } // force coercion
  get y () { return this._el.getAttribute('y') * 1; }
  get text () { return this._el.innerHTML; }
  set x (val) { return this._el.setAttribute('x', val); }
  set y (val) { return this._el.setAttribute('y', val); }
  set text (val) { return (this._el.innerHTML = val); }

  attr (key, value) {
    if (value) return this._el.setAttribute(key, value);
    else if (key) return this._el.getAttribute(key);
  }

  detach () {
    this._el.parentNode.removeChild(this._el);
    return this;
  }

  arrangePorts () {

  }

  delete () {
    for (let wire of [...this.wires])
      wire.delete();

    this.detach();
  }

  updateWires () {
    this.wires.forEach( wire => wire.render() );
  }

  getValue (id) {
    // var args = this._
    var args = [];
    var In = this._ports.in;

    for (let i = 0; i < In.length; i++) {
      args.push([]);
      for (let j = 0; j < In[i].length; j++)
        args[i].push(In[i][j].value());
    }

    if (id) return (this._behavior(args))[id];
    else    return this._behavior(args);
  }
}