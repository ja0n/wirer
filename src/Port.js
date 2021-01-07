import { getParentSvg } from './utils';
import { _p } from './points';

const directionTypes = ['in', 'out']
const portTypes = ['data', 'flow']

export default class Port {
  constructor({ id, type, direction, node, ref }) {
    if (!directionTypes.includes(direction))
      throw "port direction must be 'in' or 'out'";

    if (!portTypes.includes(type))
      throw "type must be 'data' or 'flow'";

    Object.assign(this, { id, type, direction, node });
    Object.assign(this, { connections: [], maxConnections: 2 });
    this.setupInstance(ref);
  }

  setupInstance (ref) {
    this._el = ref;
    Object.assign(this._el, {
      wrapper: this,
      type: 'port',
      direction: this.direction,
    });
  }

  get position () {
    const [portBBox, nodeBBox] = this.getBBoxes();
    return [
      portBBox.x - nodeBBox.x + portBBox.width / 2,
      portBBox.y - nodeBBox.y + portBBox.height / 2,
    ];
  }

  get x() {
    return this.position[0];
  }

  get y() {
    return this.position[1];
  }

  get available () {
    return this.connections.length < this.maxConnections;
  }

  getBBoxes() {
    const portSVG = getParentSvg(this._el);
    const nodeSVG = this.node._el;

    return [portSVG.getBoundingClientRect(), nodeSVG.getBoundingClientRect()];
  }

  attr (key, value) {
    if (value)
      return this._el.setAttribute(key, value);
    else
      return this._el.getAttribute(key);
  }

  value () {
    this.node.getValue();
    // this.wrapper.getValue(this._id);
  }

  getPoint (zoom = 1) {
    return _p.add(_p.multiply(this.node, zoom), this);
  }

  canAttach (to) {
    return  (this.type === to.type) && this.available && to.available;
  }

  attach (to) {
    if (this.canAttach(to)) {
      this.connections.push({ nodeId: to.node._id, id: to.id });
      to.connections.push({ nodeId: this.node._id, id: this.id });
      console.debug('Port attaching', { port: this, to });
      return true;
    }
    return false;
  }

  dettach (from) {
    // guess it's not working due to equality comparison^
    // maybe we should create a Node.connectionSignature symbol or use findIndex
    const index = this.connections.indexOf({ nodeId: from.node._id, id: from.id });
    const fromIndex = from.connections.indexOf({ nodeId: this.node._id, id: this.id });
    this.connections.splice(index, 1);
    from.connections.splice(fromIndex, 1);
    console.debug('Port dettaching', { port: this, from });
  }
}