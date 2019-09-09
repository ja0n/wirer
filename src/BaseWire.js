import { _p } from './points';

export default class BaseWire {
  constructor(p1, p2) {
    this.controlPoints = [p1, p2];
    this._cp1 = p1;
    this._cp2 = p2;
    this._inverted = false;
    this._behavior = undefined;

    return this;
  }

  setupInstance (ref) {
    this._el = ref;
    this._el.type = 'wire';
    this._el.wrapper = this;
  }

  seal() {
    if(this._cp1.direction == this._cp2.direction) return false;
    var wrapper1 = this._cp1._node;
    var wrapper2 = this._cp2._node;

    const canAttach = this._cp1.attach(this._cp2);
    if (canAttach) {
      wrapper1.wires.push(this);
      wrapper2.wires.push(this);
    }
    return canAttach;
  }

  delete() {
    var wrapper1 = this._cp1._node;
    var wrapper2 = this._cp2._node;
    spliceByIndex(wrapper1.wires, this);
    spliceByIndex(wrapper2.wires, this);
    this._cp1.dettach(this._cp2);
    if (this._el)
      this._el.parentNode.removeChild(this._el);
  }

  renderTranslated (cpA, cpB, offset = { x: 0, y: 0 }, zoom = 1) {
    const vOffset = _p.multiply(offset, zoom);
    const pointA = _p.add(cpA, vOffset);
    const pointB = _p.add(cpB, vOffset);
    this.renderPoints(pointA, pointB, this._inverted);
  }

  render (offset, zoom) {
    this.renderTranslated(
      this._cp1.getPoint(zoom),
      this._cp2.getPoint(zoom),
      offset,
      zoom
    );
  }
}

function spliceByIndex(arr, obj) {
  let index = arr.indexOf(obj);

  if (index != -1) {
    arr.splice(index, 1);
    return true;
  }
  return false;
}