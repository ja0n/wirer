function Port(id, dir, brick) {
  if(['in','out'].indexOf(dir) === -1) throw "port direction must be 'in' or 'out'";
  var attrs = { width: 30, height: 30, fill: '#B8D430', stroke: 'black', 'stroke-width': 3 };
  this._el = Sticky.createElement('rect', attrs);
  this._el.wrapper = this;
  this._brick = brick;
  this._maxcon = null;
  this.id = id;
  this.type = 'port';
  this.dir = dir; //dir -> direction, not directory

  return this;
}

Port.prototype = {
  get x () { return this.attr('cx') *1; }, //force coercion to number
  get y () { return this.attr('cy') *1; },
  attr(key, value) {
    if(value) return this._el.setAttribute(key, value);
    else return this._el.getAttribute(key);
  },
  value() {
    this._brick.getValue();
    // this.wrapper.getValue(this._id);
  },
  getPoint() {
    return { x: this._brick.x + this.x, y: this._brick.y + this.y };

  },
  attach(to) {
    if(this._conn.length <= this._maxcon) {
      this._conn.push({ brick: to._brick._id, id: to.id });
      return true;
    } else {
      return false;
    }
  }
};
