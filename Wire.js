var Wire = function(p1, p2) {
  this._el = Sticky.createElement('path', { stroke: 'red', 'stroke-width': 6, fill: 'none', opacity: 0.5 });
  this._cp1 = p1;
  this._cp2 = p2;
};

Wire.describeJoint = function(x1, y1, x2, y2, pad) {
  var d = [
    "M", x1, y1,
    "C", x1 + pad, y1, x2 - pad, y2, x2, y2
  ].join(" ");

  return d;
};

Wire.Point = function(x, y) {
  //just in case of need for some methods
  this.x = x;
  this.y = y;

  return this;
  // return { x:x, y: y };
};

Wire.dt2p = function(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

Wire.prototype = {
  _cp1: new Wire.Point(null, null),
  _cp2: new Wire.Point(null, null),
  _inverted: false,
  _render: function(p1, p2, inv) {
    inv = inv ? -1 : 1;
    var offset = Wire.dt2p(p1.x, p1.y, p2.x, p2.y)/2;
    var d = Wire.describeJoint(p1.x, p1.y, p2.x, p2.y, offset*inv);
    this._el.setAttribute('d', d);
  },
  seal: function() {
    var main1 = this._cp1.wrapper._el.getElementById('main');
    var main2 = this._cp2.wrapper._el.getElementById('main');
    var that = this;

    main1.addEventListener('mousemove', att.bind(this._cp1.wrapper));
    main2.addEventListener('mousemove', att.bind(this._cp2.wrapper));

    function att() {
      if(this._states.dragging) that.render();
    }
  },
  render: function() {
    // var inv = this._inverted ? -1 : 1;
    this._render(this._cp1.getPoint(), this._cp2.getPoint(), this._inverted);
  }

};
