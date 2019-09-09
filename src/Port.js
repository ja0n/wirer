import { getParentSvg } from './utils';
import { _p } from './points';

export default class Port {
  constructor({ id, type, direction, node, ref }) {
    if (!['in', 'out'].includes(direction))
      throw "port direction must be 'in' or 'out'";
    if (!['data', 'flow'].includes(type))
      throw "type must be 'data' or 'flow'";
    Object.assign(this, { id, type, direction, node});
    Object.assign(this, { connections: [], maxConnections: 2 });
    this.setupInstance(ref);
  }

  setupInstance (ref) {
    this._el = ref;
    console.debug("Port ref", this.id, this.node, ref);
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
    return this.available && to.available && (this.type === to.type);
  }

  attach (to) {
    if(this.canAttach(to)) {
      this.connections.push({ nodeId: to.node._id, id: to.id });
      to.connections.push({ nodeId: this.node._id, id: this.id });
      // console.log(this, to);
      return true;
    }
    return false;
  }

  dettach (to) {
    let index1 = this.connections.indexOf({ nodeId: to.node._id, id: to.id });
    let index2 = this.connections.indexOf({ nodeId: this.node._id, id: this.id });
    // guess it's not working ^
    this.connections.splice(index1, 1);
    to.connections.splice(index2, 1);
  }
}