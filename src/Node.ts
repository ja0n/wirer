import _isNil from 'lodash/isNil';
import set from 'lodash/set';
import forEach from 'lodash/forEach';
import Port from './Port'
import Wire from './Wire'

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
  wires: Wire[];
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

  setupElement () {
    this._el = SVGContainer(this);
  }

  onChange ({ id, value }) {
    set(this.inputs, [id], value);
    this.inputs = { ...this.inputs, [id]: value };
  }

  delete () {
    for (let wire of [...this.wires])
      wire.delete();

    this._el.parentNode.removeChild(this._el);
  }

  updateWires (offset, zoom) {
    this.wires.forEach( wire => wire.render(offset, zoom) );
  }

  getValue (getNode, context, id?) {
    const promise = Promise.resolve(this.behavior(getNode, context))

    if (_isNil(id)) {
      return promise
    }

    return promise.then(value => value[id])
  }

}