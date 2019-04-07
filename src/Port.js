import { getParentSvg } from './utils';

export default class Port {
  constructor({ id, type, direction, brick, ref }) {
    if (!['in', 'out'].includes(direction))
      throw "port direction must be 'in' or 'out'";
    if (!['data', 'flow'].includes(type))
      throw "type must be 'data' or 'flow'";
    // var attrs = { width: 30, height: 30, fill: '#B8D430', stroke: 'black', 'stroke-width': 3 };
    var attrs = { r: 7, fill: '#B8D430', stroke: 'black', 'stroke-width': 2.5 };

    // Object.assign(attrs, { wrapper: this, type: 'port', direction: direction });
    // this._el = createElement('circle', attrs);

    console.debug("ref", ref);
    this._el = ref;
    this._el.wrapper = this;
    this._el.type = 'port';
    this._el.direction = direction;

    for (let key in attrs)
      this._el.setAttribute(key, attrs[key]);

    this._brick = brick;
    this._maxcon = 2;
    this._conn = [];
    this.id = id;
    this.type = type;
    this.direction = direction; //direction -> directionection, not directionectory
  }

  get x() {
    const [portBBox, nodeBBox] = this.getBBoxes();
    return portBBox.x - nodeBBox.x + portBBox.width / 2;
    return this.attr('cx') * 1;
  }

  get y() {
    const [portBBox, nodeBBox] = this.getBBoxes();
    return portBBox.y - nodeBBox.y + portBBox.height / 2;
    return this.attr('cy') * 1;
  }

  get available () { return this._conn.length < this._maxcon; }

  getBBoxes() {
    const portSVG = getParentSvg(this._el);
    const nodeSVG = this._brick._el;

    return [portSVG.getBoundingClientRect(), nodeSVG.getBoundingClientRect()];
  }

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
    // guess it's not working ^
    this._conn.splice(index1, 1);
    to._conn.splice(index2, 1);
  }

  canAttach (to) {
    return this.available && to.available && (this.type === to.type);
  }
}