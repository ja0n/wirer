import { _p } from './points';
import { spliceByIndex } from './utils'

export default class BaseWire {
  constructor ( config ) {
    const { controlPoints, render } = config;
    this.controlPoints = controlPoints || [];
    this._inverted = false;
    this._behavior = undefined;
    this.renderInstance = render;
    this.custom = false;

    return this;
  }

  getControlPoints () {
    const [head, ...tail] = this.controlPoints;
    return [head, tail.pop()];
  }

  addControlPoints (...controlPoints) {
    this.controlPoints = [...this.controlPoints, ...controlPoints];
  }

  setTarget (value) {
    const [head, ...tail] = this.controlPoints;
    this.controlPoints = [head, value];
  }

  setupInstance (ref) {
    this._el = ref;
    this._el.type = 'wire';
    this._el.wrapper = this;
  }

  getNodes () {
    const [sourcePort, targetPort] = this.getControlPoints();
    return [sourcePort.node, targetPort.node]
  }

  seal() {
    const [sourcePort, targetPort] = this.getControlPoints();

    if (sourcePort.direction == targetPort.direction)
      return false;

    const canAttach = sourcePort.attach(targetPort);

    if (canAttach) {
      sourcePort.node.wires.push(this);
      targetPort.node.wires.push(this);
    }

    if ( !canAttach && this._el && this.renderInstance && this.renderInstance.internalRender)
      this.renderInstance.removeElement(this._el);

    return canAttach;
  }

  delete () {
    const [sourcePort, targetPort] = this.getControlPoints();

    spliceByIndex( sourcePort.node.wires, this );
    spliceByIndex( targetPort.node.wires, this );

    sourcePort.dettach(targetPort);

    if (!this.custom)
      this.removeFromParent();
  }

  removeFromParent () {
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
    if (this.custom)
      return null;

    const [sourcePort, targetPort] = this.getControlPoints();
    this.renderTranslated(
      sourcePort.getPoint(zoom),
      targetPort.getPoint(zoom),
      offset,
      zoom
    );
  }
}
