import { _p } from './utils/points';
import { spliceByIndex } from './utils/dom'
import type { Position } from './types'
import Port from './Port';

type ControlPoint = Port|Position

export default class BaseWire {
  controlPoints: ControlPoint[];
  _inverted: Boolean = false;
  custom: Boolean = false;
  _el: SVGElement;

  constructor ( config ) {
    const { controlPoints, render } = config;
    this.controlPoints = controlPoints || [];
    this._inverted = false;
    // this.renderInstance = render;
    this.custom = false;

    return this;
  }

  getControlPoints () {
    const [head, ...tail] = this.controlPoints;
    return [head, tail.pop()];
  }

  getPorts () {
    return this.getControlPoints().filter(<(v) => v is Port>(v => v instanceof Port));
  }

  addControlPoints (...controlPoints: ControlPoint[]) {
    this.controlPoints = [...this.controlPoints, ...controlPoints];
  }

  setTarget (value) {
    const [head, ...tail] = this.controlPoints;
    this.controlPoints = [head, value];
  }

  setupInstance (ref: SVGElement) {
    this._el = ref;
    this._el['type'] = 'wire';
    this._el['wrapper'] = this;
  }

  getNodes () {
    const [sourcePort, targetPort] = this.getPorts() as Port[];
    return [sourcePort?.node, targetPort?.node]
  }

  seal() {
    const [sourcePort, targetPort] = this.getPorts();

    if (sourcePort?.direction == targetPort?.direction)
      return false;

    const canAttach = sourcePort.attach(targetPort);

    if (canAttach) {
      sourcePort.node.wires.push(this);
      targetPort.node.wires.push(this);
    }

    return canAttach;
  }

  delete () {
    const [sourcePort, targetPort] = this.getPorts();
    spliceByIndex( sourcePort.node.wires, this );
    spliceByIndex( targetPort.node.wires, this );
    sourcePort.dettach(targetPort);
  }

  getPointTranslated (point, offset = { x: 0, y: 0 }, zoom = 1) {
    const vOffset = _p.multiply(offset, zoom);
    return _p.add(point, vOffset);
  }

  render (offset, zoom) {
    return null;
  }
}
