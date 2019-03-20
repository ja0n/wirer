import React from 'react';
import ReactDOM from 'react-dom';

import blockBuilder, { htmlBlockBuilder, blockContainer } from './blockBuilder.js';
import { getParentSvg } from './utils';
import arrangePorts from './arrangePorts';

const RENDER_HTML = true;

const defaultConfig = {
  strokeWidth: 3,
  marginLeft: 0,
  width: 90,
  opacity: 1,
  height: 50,
  rx: 20,
  ry: 20,
  fill: '#1F8244',
  stroke: '#000000',
  gui: {},
}

const Component = ({ title, width }) => (
  <foreignObject id="main" className="sticky-block-html" width={Math.max(width, 60)}>
    <body>
      <header>{title}</header>
      <h1>hey</h1>
    </body>
  </foreignObject>
)

export default class Brick {
  constructor (custom = {}) {
    const cfg = { ...defaultConfig, ...custom };
    const { behavior, title, ports, icon, gui, id, x, y, inputs } = cfg;

    // this._id = id;
    this.inputs = inputs || {};
    this._container = null;
    // this._el = (RENDER_HTML ? htmlBlockBuilder : blockBuilder)(this, cfg);
    this._el = blockContainer(this, cfg);
    ReactDOM.render(<Component title={title} width={cfg.width} />, this._el);
    this.behavior = behavior;
    this._refBlock = id;
    this.x = x || 0;
    this.y = y || 0;

    this._ports = {
      in: [],
      out: []
    };

    this.wires = [];
    this._states = { dragging: false };

    arrangePorts.call(this, ports, gui);

    return this;
  }

  get data () { return this.behavior(); }
  get main () { return this._el.querySelector('#main'); }
  get _svg () { return getParentSvg(this._el); }
  get x () { return this._el.getAttribute('x') * 1; } // force coercion
  get y () { return this._el.getAttribute('y') * 1; }
  set x (val) { return this._el.setAttribute('x', val); }
  set y (val) { return this._el.setAttribute('y', val); }

  detach () {
    this._el.parentNode.removeChild(this._el);
    return this;
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