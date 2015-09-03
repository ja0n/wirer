function Wire(p1, p2) {
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
    var wrapper1 = this._cp1.wrapper;
    var wrapper2 = this._cp2.wrapper;
    var that = this;

    wrapper1.main.addEventListener('mousemove', att.bind(wrapper1));
    wrapper2.main.addEventListener('mousemove', att.bind(wrapper2));

    wrapper1._ports[this._cp1.dir][this._cp1.id].push(this._cp2);
    wrapper2._ports[this._cp2.dir][this._cp2.id].push(this._cp1);

    function att() {
      if(this._states.dragging) that.render();
    }
  },
  render() {
    this._render(this._cp1.getPoint(), this._cp2.getPoint(), this._inverted);
  }

};
