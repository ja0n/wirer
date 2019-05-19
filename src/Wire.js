import { createElement } from './utils';

export default function Wire(p1, p2) {
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

  const group = createElement('g');
  this._path = styles.map(style => {
    const path = createElement('path', style);
    path.type = 'wire';
    path.wrapper = this;
    group.appendChild(path);
    return path;
  });
  this._el = group;
  this._el.type = 'wire';
  this._el.wrapper = this;
  this._cp1 = p1;
  this._cp2 = p2;
  this._inverted = false;
  this._behavior = undefined;

  return this;
}

//static methods

Wire.describeJoint = (x1, y1, x2, y2, offset) =>
  [ "M", x1, y1,
    "C", x1 + offset, y1, x2 - offset, y2, x2, y2
  ].join(" ");

Wire.dt2p = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

Wire.prototype = {
  _render(p1, p2, inv) {
    inv = inv ? -1 : 1;
    var offset = Wire.dt2p(p1.x, p1.y, p2.x, p2.y)/2;
    var d = Wire.describeJoint(p1.x, p1.y, p2.x, p2.y, offset*inv);
    for (let element of this._path)
      element.setAttribute('d', d);
  },
  seal() {
    if(this._cp1.direction == this._cp2.direction) return false;
    var wrapper1 = this._cp1._node;
    var wrapper2 = this._cp2._node;

    if(this._cp1.attach(this._cp2)) {
      wrapper1.wires.push(this);
      wrapper2.wires.push(this);
      return true;
    } else {
      return false;
    }

  },
  delete() {
    var wrapper1 = this._cp1._node;
    var wrapper2 = this._cp2._node;
    spliceByIndex(wrapper1.wires, this);
    spliceByIndex(wrapper2.wires, this);
    this._cp1.dettach(this._cp2);
    this._el.parentNode.removeChild(this._el);
  },
  render(offset = { x: 0, y: 0 }) {
    const pointA = addPoints(this._cp1.getPoint(), offset);
    const pointB = addPoints(this._cp2.getPoint(), offset);
    this._render(pointA, pointB, this._inverted);
  }

};

function addPoints (...points) {
  return points.reduce(
    (acc, curr) => ({ x: acc.x + curr.x, y: acc.y + curr.y }),
    { x: 0, y: 0 },
  );
}

function spliceByIndex(arr, obj) {
  let index = arr.indexOf(obj);

  if (index != -1) {
    arr.splice(index, 1);
    return true;
  }
  return false;
}
