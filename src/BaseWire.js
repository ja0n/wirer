import { _p } from './points';

export default class BaseWire {
  constructor(sourcePort, targetPort) {
    this.controlPoints = [sourcePort, targetPort];
    this.sourcePort = sourcePort;
    this.targetPort = targetPort;
    this._inverted = false;
    this._behavior = undefined;

    return this;
  }

  getControlPoints () {
    const [first] = this.controlPoints.slice(0, 1);
    const [last] = this.controlPoints.slice(-1, 1);
    return [first, last];
  }

  setupInstance (ref) {
    this._el = ref;
    this._el.type = 'wire';
    this._el.wrapper = this;
  }

  seal() {
    if (this.sourcePort.direction == this.targetPort.direction)
      return false;
    var wrapper1 = this.sourcePort.node;
    var wrapper2 = this.targetPort.node;

    const canAttach = this.sourcePort.attach(this.targetPort);
    if (canAttach) {
      wrapper1.wires.push(this);
      wrapper2.wires.push(this);
    }
    return canAttach;
  }

  delete() {
    var wrapper1 = this.sourcePort.node;
    var wrapper2 = this.targetPort.node;
    spliceByIndex(wrapper1.wires, this);
    spliceByIndex(wrapper2.wires, this);
    this.sourcePort.dettach(this.targetPort);
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
      this.sourcePort.getPoint(zoom),
      this.targetPort.getPoint(zoom),
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