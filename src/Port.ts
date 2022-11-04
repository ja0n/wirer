import { getParentSvg, safeSplice } from './utils/dom';
import { _p } from './utils/points';
import Node from './Node';

const directionTypes = ['in', 'out'] as const
const portTypes = ['data', 'flow'] as const
export type DirectionName = typeof directionTypes[number];
export type PortName = typeof portTypes[number];
export type Connection = { nodeId?: string, node?: string, id: string };

const makeFinder = (node, port) => ({ nodeId, id }) => nodeId === node && id === port;

export default class Port {
  id: string;
  _el: HTMLElement | SVGAElement;
  direction: DirectionName;
  type: PortName;
  connections: Connection[];
  maxConnections: number = 1;
  node: Node;
  color?: string;

  constructor ({ id, type, direction, node, ref }) {
    if (!directionTypes.includes(direction))
      throw "port direction must be 'in' or 'out'";

    if (!portTypes.includes(type))
      throw "type must be 'data' or 'flow'";

    Object.assign(this, { id, type, direction, node });
    Object.assign(this, { connections: [] });
    if (ref) this.setupInstance(ref);
  }

  setupInstance (ref) {
    this._el = ref;

    if (ref) {
      Object.assign(this._el, {
        wrapper: this,
        type: 'port',
        direction: this.direction,
      });
    }
  }

  get position () {
    const [portBBox, nodeBBox] = this.getBBoxes();
    return [
      portBBox.x - nodeBBox.x + portBBox.width / 2,
      portBBox.y - nodeBBox.y + portBBox.height / 2,
    ];
  }

  get x () {
    return this.position[0];
  }

  get y () {
    return this.position[1];
  }

  get available () {
    if (this.maxConnections === null) {
      return true;
    }
    return this.connections.length < this.maxConnections;
  }

  getBBoxes () {
    if (!this._el) {
      return [new DOMRect(), new DOMRect()];
    }

    const portSVG = getParentSvg(this._el);
    const nodeSVG = this.node._el;

    return [portSVG.getBoundingClientRect(), nodeSVG.getBoundingClientRect()];
  }

  attr (key: string, value: string) {
    if (value)
      return this._el.setAttribute(key, value);
    else
      return this._el.getAttribute(key);
  }

  getPoint (offset = { x: 0, y: 0 }, zoom = 1) {
    return _p.add(_p.multiply(this.node, zoom), _p.multiply(offset, zoom), this);
  }

  isCompatible (to: Port) {
    return this.type === to.type && this.direction !== to.direction;
  }

  canAttach (to: Port) {
    return this.isCompatible(to) && this.available && to.available;
  }

  hasConnection (to: Port) {
    return this.connections.find(makeFinder(to.node._id, to.id))
  }

  pushConnection (to: Port) {
    this.connections.push({ nodeId: to.node._id, id: to.id });
  }

  attach (to: Port) {
    if (this.hasConnection(to)) {
      return false
    }
    if (this.canAttach(to)) {
      this.pushConnection(to)
      to.pushConnection(this)
      this.node.onAttach({ from: this, to });
      to.node.onAttach({ from: this, to });
      console.debug('Port attaching', { from: this, 'to': to });
      return true;
    }
    return false;
  }

  dettach (from: Port) {
    if (!this.isCompatible(from)) {
      return false;
    }
    // maybe we should create a Node.connectionSignature symbol
    const index = this.connections.findIndex(makeFinder(from.node._id, from.id));
    const fromIndex = from.connections.findIndex(makeFinder(this.node._id, this.id));
    safeSplice(this.connections, index)
    safeSplice(from.connections, fromIndex)
    // console.debug('Port detaching', { port: this, to });
    return index !== -1 || fromIndex !== -1;
  }
}