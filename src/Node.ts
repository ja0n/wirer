import _isNil from 'lodash/isNil';
import set from 'lodash/set';
import forEach from 'lodash/forEach';
import _findIndex from 'lodash/findIndex';
import _times from 'lodash/times';
import Port from './Port'
import { DataPort, FlowPort } from './ports';
import BaseWire from './BaseWire';

import { SVGContainer } from './blockBuilder';
import { getParentSvg } from './utils/dom';

export type NodeConfig = {
  id?: string;
  x?: number;
  y?: number;
  rx?: number;
  ry?: number;
  width?: number;
  height?: number;
  title?: string;
  fill?: string;
  stroke?: string;
  gui?: GuiConfig;
  behavior?: Function;
  icon?: string;
  inputs?: Record<string, any>
  ports?: PortCount;
};

export type PortCount = {
  flow_in: number;
  flow_out: number;
  data_in: number;
  data_out: number;
}

export type PortMap = {
  flow_in: Port[];
  flow_out: Port[];
  in: Port[]; // data_in
  out: Port[]; // data_out
}

export type GuiConfig = {
  [key: string]: { label: string, type: string, options?: string[]}
}

const defaultConfig = {
  x: 0,
  y: 0,
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
};

export default class Node {
  _id?: string;
  _ports: PortMap;
  _refNode: string;
  _el: HTMLElement | SVGAElement; // _domElement || _element
  _states: { dragging: boolean };
  x: number;
  y: number;
  wires: BaseWire[];
  behavior: Function; // run
  cfg: NodeConfig; // config
  gui: GuiConfig; // inputsConfig
  inputs: Record<string, any>;

  constructor (custom: NodeConfig = {}) {
    const cfg = { ...defaultConfig, ...custom };
    const { behavior, ports, gui, id, x, y, inputs } = cfg;

    this._refNode = id;
    // this._container = null;
    this.behavior = behavior;
    this.cfg = cfg;
    this.gui = Object.assign({}, gui); // inputs
    // this.values = inputs || {};
    this.inputs = inputs || {}; // inputValues
    this.x = x || 0;
    this.y = y || 0;
    this._ports = {
      in: [],
      out: [],
      flow_in: [],
      flow_out: [],
    };
    this.wires = [];
    this._states = { dragging: false };

    setupPorts({ node: this, type: "data", direction: "in", length: ports.data_in })
    setupPorts({ node: this, type: "data", direction: "out", length: ports.data_out })
    setupPorts({ node: this, type: "flow", direction: "in", length: ports.flow_in })
    setupPorts({ node: this, type: "flow", direction: "out", length: ports.flow_out })

    // TODO(ja0n): Refactor the gui|inputs|values mess
    // should value be a key inside gui objects?
    forEach(inputs, (value, id) => {
      set(this.gui, [id, 'initialValue'], value);
      set(this.gui, [id, 'value'], value);
    });

    // ReactDOM.render(<Node {...props} />, this._el);
    return this;
  }

  get data () { return this.behavior(); }
  get main () { return this._el.querySelector('#main'); }
  get _svg () { return getParentSvg(this._el); }

  toString () { return `<${[this._id, this._refNode].join(', ')}>`; }

  setupElement () {
    this._el = SVGContainer(this);
  }

  onChange ({ id, value }) {
    set(this.inputs, [id], value);
    this.inputs = { ...this.inputs, [id]: value };
  }

  delete () {
    // for (let wire of [...this.wires])
    //   wire.delete();
  }

  getPort (type: string, id: number) {
    return this.getPorts(type)[id];
  }

  getPorts (type: string): Port[] {
    return this._ports[type];
  }

  getValue (getNode, context, id?) {
    const promise = Promise.resolve(this.behavior(getNode, context))

    if (_isNil(id)) {
      return promise
    }

    return promise.then(value => value[id])
  }

}


function setupPort ({ node, id, type, direction }: { node: Node, id: number, type: string, direction: string }) {
  const types = {
    'data': { constructor: DataPort, key: `${direction}` },
    'flow': { constructor: FlowPort, key: `flow_${direction}` },
  };

  if (!types[type])
    throw `Port of type "${type}" not found`;

  const { constructor, key } = types[type];
  const port = new constructor({ id, node, direction });
  const currentIndex = _findIndex(node._ports[key], { id })
  if (currentIndex != -1)
    node._ports[key][currentIndex] = port;
  else
    node._ports[key].push(port);
}

function setupPorts ({ node, type, direction, length }: { node: Node, type: string, direction: string, length: number }) {
  return _times(length, (index) => (
    setupPort({ node, type, direction, id: index })
  ));
}