import Sticky from './Sticky.js';

export default function Wire(p1, p2) {
  this._el = Sticky.createElement('path', { stroke: 'red', 'stroke-width': 6, fill: 'none', opacity: 0.8 });
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
    this._el.setAttribute('d', d);
  },
  seal() {
    if(this._cp1.dir == this._cp2.dir) return false;
    var wrapper1 = this._cp1._brick;
    var wrapper2 = this._cp2._brick;

    if(this._cp1.attach(this._cp2)) {
      wrapper1.wires.push(this);
      wrapper2.wires.push(this);
      return true;
    } else {
      return false;
    }

  },
  render() {
    this._render(this._cp1.getPoint(), this._cp2.getPoint(), this._inverted);
  }

};
