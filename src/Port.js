import createElement from './utils.js';

export default class Port {
  constructor({ id, type, dir, brick }) {
    if (['in', 'out'].includes(dir)) throw "port direction must be 'in' or 'out'";
    if (['data', 'flow'].includes(type)) throw "type must be 'data' or 'flow'";
    // var attrs = { width: 30, height: 30, fill: '#B8D430', stroke: 'black', 'stroke-width': 3 };
    var attrs = { r: 10, fill: '#B8D430', stroke: 'black', 'stroke-width': 3.5 };

    // Object.assign(attrs, { wrapper: this, type: 'port', dir: dir });
    this._el = createElement('circle', attrs);
    this._el.wrapper = this;
    this._el.type = 'port';
    this._el.dir = dir;

    this._brick = brick;
    this._maxcon = 2;
    this._conn = [];
    this.id = id;
    this.type = type;
    this.dir = dir; //dir -> direction, not directory
  }

  get x () { return this.attr('cx') * 1; } //force coercion to number

  get y () { return this.attr('cy') * 1; }

  get available () { return this._conn.length < this._maxcon; }

  attr (key, value) {
    if (value) return this._el.setAttribute(key, value);
    else return this._el.getAttribute(key);
  }

  value () {
    this._brick.getValue();
    // this.wrapper.getValue(this._id);
  }

  getPoint () {
    return { x: this._brick.x + this.x, y: this._brick.y + this.y };
  }

  attach (to) {
    if(this.canAttach(to)) {
      this._conn.push({ brick: to._brick._id, id: to.id });
      to._conn.push({ brick: this._brick._id, id: this.id });
      // console.log(this, to);
      return true;
    }
    return false;
  }

  dettach (to) {
    let index1 = this._conn.indexOf({ brick: to._brick._id, id: to.id });
    let index2 = this._conn.indexOf({ brick: this._brick._id, id: this.id });
    this._conn.splice(index1, 1);
    to._conn.splice(index2, 1);
  }

  canAttach (to) {
    return (this.available && to.available && this.type === to.type) ? true : false;
  }
}