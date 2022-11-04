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
import Wirer from './Wirer';

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
  icon?: string;
  inputs?: Record<string, any>
  ports?: PortCount;
  behavior?: (this: Node, findById: Wirer['getNode'], context: Record<any, any>) => any;
  onAttach?: (node: Node, data: AttachData) => any;
  onInputChange?: (node: Node, change: { id, value }) => any;
};

export type AttachData = { from: Port, to: Port };

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
  [key: string]: { label: string, type: string, options?: (string|boolean|number)[]}
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
  wirer: Wirer;
  _id?: string;
  _ports: PortMap;
  // TODO: split dynamic ports
  // _extraPorts: PortMap;
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
  instance?: any;

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

    this.setupPorts({ type: "data", direction: "in", length: ports.data_in })
    this.setupPorts({ type: "data", direction: "out", length: ports.data_out })
    this.setupPorts({ type: "flow", direction: "in", length: ports.flow_in })
    this.setupPorts({ type: "flow", direction: "out", length: ports.flow_out })

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

  onChange (change: { id: string, value: any }) {
    const { id, value } = change;
    this.cfg.onInputChange?.(this, change);
    this.inputs = { ...this.inputs, [id]: value };
  }

  onAttach (data: AttachData) {
    if (this.cfg.onAttach) {
      return this.cfg.onAttach(this, data);
    }
  }

  delete () {
    // for (let wire of [...this.wires])
    //   wire.delete();
  }

  getPort (type: string, id: string) {
    return this.getPorts(type)[id];
  }

  getPorts (type: string): Port[] {
    return this._ports[type];
  }

  async getPortValue (type = 'in', index = 0, connection = 0, context = {}) {
    const portConn = this._ports[type][index].connections[connection];
    const portNode = portConn && this.wirer.getNode(portConn.nodeId);
    const getNode = this.wirer.getNode.bind(this.wirer)

    if (portNode) {
      return await portNode.getValue(getNode, context, portConn.id);
    }

    return null;
  }

  getValue (getNode, context, id?) {
    const promise = Promise.resolve(this.behavior(getNode, context))

    if (_isNil(id)) {
      return promise
    }

    return promise.then(value => value[id])
  }

  removePorts (ports: Port[]) {
    for (let port of ports) this.removePort(port);
  }

  removePort (port: Port) {
    const wires = this.wires.filter(w => w.controlPoints.includes(port));
    for (let wire of wires) {
      wire.delete();
      this.wirer.render.removeWire(wire);
    }
  }

  setupPorts ({ type, direction, length }: { type: string, direction: string, length: number }, offset = 0) {
    const { key } = getPortMeta(type, direction);
    // discard surplus ports on port configuration change
    this.removePorts(this._ports[key].slice(length + offset));
    this._ports[key].splice(length + offset)

    _times(length, (index) => {
      this.setupPort({ type, direction, id: index + offset });
    });
    this._ports = { ...this._ports };
  }

  setupPort ({ id, type, direction }: { id: number, type: string, direction: string }, hard = false) {
    const { constructor, key } = getPortMeta(type, direction);
    const port = new constructor({ node: this, id, direction });
    const currentIndex = _findIndex(this._ports[key], { id })
    if (currentIndex != -1) {
      if (hard) this._ports[key][currentIndex] = port;
    } else {
      this._ports[key].push(port);
    }
  }
}

function getPortMeta (type: string, direction: string) {
  const types = {
    'data': { constructor: DataPort, key: `${direction}` },
    'flow': { constructor: FlowPort, key: `flow_${direction}` },
  };
  if (!types[type])
    throw `Port of type "${type}" not found`;
  return types[type];
}