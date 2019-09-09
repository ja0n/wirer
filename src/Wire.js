import BaseWire from './BaseWire';
import { createElement } from './utils';
import { _p } from './points';

export default class Wire extends BaseWire {
  constructor(sourcePort, targetPort) {
    super(sourcePort, targetPort);
    this.initDom();
    return this;
  }

  initDom () {
    const group = createElement('g');
    this._path = styles.map(style => {
      const path = createElement('path', style);
      path.type = 'wire';
      path.wrapper = this;
      group.appendChild(path);
      return path;
    });
    this.setupInstance(group);
  }

  renderPoints (sourcePort, targetPort, invert) {
    const direction = invert ? -1 : 1;
    const offset = dt2p(sourcePort.x, sourcePort.y, targetPort.x, targetPort.y)/2;
    const d = describeJoint(sourcePort.x, sourcePort.y, targetPort.x, targetPort.y, offset * direction);
    for (let element of this._path)
      element.setAttribute('d', d);
  }
}

const describeJoint = (x1, y1, x2, y2, offset) =>
  [ "M", x1, y1,
    "C", x1 + offset, y1, x2 - offset, y2, x2, y2
  ].join(" ");

const dt2p = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
const styles = [
  {
    'stroke': '#000000',
    'stroke-width': 7,
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round',
    'fill': 'none',
    'opacity': 1
  },
  {
    'stroke': '#505050',
    'stroke-width': 6,
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round',
    'fill': 'none',
    'opacity': 0.8
  },
  {
    'stroke': '#F3F375',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-dasharray': 6,
    'fill': 'none',
    'opacity': 0.8
  },
];