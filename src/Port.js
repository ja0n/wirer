import { getParentSvg } from './utils';
import { _p } from './points';

export default class Port {
  constructor({ id, type, direction, node, ref }) {
    if (!['in', 'out'].includes(direction))
      throw "port direction must be 'in' or 'out'";
    if (!['data', 'flow'].includes(type))
      throw "type must be 'data' or 'flow'";
    console.debug("Port ref", ref);
    this._el = ref;

    Object.assign(this._el, {
      wrapper: this,
      type: 'port',
      direction: direction,
    });

    Object.assign(this, {
      _node: node,
      _max_conn: 2,
      _conn: [],
      id: id,
      type: type,
      direction: direction,
    });
  }

  get x() {
    const [portBBox, nodeBBox] = this.getBBoxes();
    return portBBox.x - nodeBBox.x + portBBox.width / 2;
  }

  get y() {
    const [portBBox, nodeBBox] = this.getBBoxes();
    return portBBox.y - nodeBBox.y + portBBox.height / 2;
  }

  get available () { return this._conn.length < this._max_conn; }

  getBBoxes() {
    const portSVG = getParentSvg(this._el);
    const nodeSVG = this._node._el;

    return [portSVG.getBoundingClientRect(), nodeSVG.getBoundingClientRect()];
  }

  attr (key, value) {
    if (value) return this._el.setAttribute(key, value);
    else return this._el.getAttribute(key);
  }

  value () {
    this._node.getValue();
    // this.wrapper.getValue(this._id);
  }

  getPoint (zoom = 1) {
    return _p.add(_p.multiply(this._node, zoom), this);
  }

  attach (to) {
    if(this.canAttach(to)) {
      this._conn.push({ brick: to._node._id, id: to.id });
      to._conn.push({ brick: this._node._id, id: this.id });
      // console.log(this, to);
      return true;
    }
    return false;
  }

  dettach (to) {
    let index1 = this._conn.indexOf({ brick: to._node._id, id: to.id });
    let index2 = this._conn.indexOf({ brick: this._node._id, id: this.id });
    // guess it's not working ^
    this._conn.splice(index1, 1);
    to._conn.splice(index2, 1);
  }

  canAttach (to) {
    return this.available && to.available && (this.type === to.type);
  }
}