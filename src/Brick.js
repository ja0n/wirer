import { DataPort, FlowPort } from './ports.js';
import blockBuilder from './blockBuilder.js';

export default function Brick({ title, ports, icon, gui, id, x, y }) {
  this._el = blockBuilder(arguments[0]);
  this._el.wrapper = this;

  this._id = id;
  this._container = null;
  this._refBlock = id;
  this.x = x || 0;
  this.y = y || 0;

  this._ports = {
    in: [],
    out: []
  };

  this.wires = [];

  this._aux = { attaching: {} };
  this._states = { dragging: false };

  arrangePorts.call(this, ports);

  return this;
}

Brick.prototype = {
  get data () { return this.behavior(); },
  get main() { return this._el.getElementById('main'); },
  get _svg() { return getSvg(this._el); },
  get x () { return this._el.getAttribute('x') * 1; }, // multiply by one just to convert from string to number
  get y () { return this._el.getAttribute('y') * 1; }, //
  get text () { return this._el.innerHTML; },
  set x (val) { return this._el.setAttribute('x', val); },
  set y (val) { return this._el.setAttribute('y', val); },
  set text (val) { return (this._el.innerHTML = val); },

  attr(key, value) {
    if (value) return this._el.setAttribute(key, value);
    else if (key) return this._el.getAttribute(key);
  },
  detach() {
    this._el.parentNode.removeChild(this._el);
    return this;
  },
  arrangePorts() {

  },
  updateWires() {
    this.wires.forEach( wire => wire.render() );
  },
  getValue(id) {
    // var args = this._
    var args = [];
    var In = this._ports.in;
    var i, j;
    for(i = 0; i < In.length; i++) {
      args.push([]);
      for(j = 0; j < In[i].length; j++)
        args[i].push(In[i][j].value());
    }

    console.log(id);

    if (id) return (this._behavior(args))[id];
    else    return this._behavior(args);
  }
};

function getSvg(el) {
  if(el.parentNode.nodeName === 'svg') {
    return el.parentNode;
  }
  return getSvg(el.parentNode);
}

function arrangePorts({ data_in = 1, data_out = 1, flow_in = 1, flow_out = 1 } = {}) {
  var radius = 10;
  var dist = 10; //distance beetween ports
  var strokeWidth = 3.5;
  var ports = this._ports;
  var main = this.main;
  var rectBox = main.getBBox();
  var maxPorts = Math.max(data_in + flow_in, data_out + flow_out);
  // var maxPorts = Math.max(ports.in.length, ports.out.length);
  var Radius = radius + strokeWidth/2; //total radius -> circle radius plus its stroke width
  var tRadius = dist + Radius;
  var height = (dist + Radius * 2) * maxPorts + dist; //dist + diameter * number of ports + final dist
  var width = main.getAttribute('width') * 1;

  this._ports.in = [];
  this._ports.out = [];
  this._ports.flow_in = [];
  this._ports.flow_out = [];

  main.setAttribute('height', height);

  var attrs = { id: null, r: radius, fill: '#B8D430', stroke: 'black', 'stroke-width': strokeWidth };
  var flow_attrs = { id: null, r: radius, fill: '#2549e4', stroke: 'black', 'stroke-width': strokeWidth };
  var i, y, ds;
  // attrs.cx = margin; attrs.cy = rectBox.height/2;

  ds = height/(data_in + flow_in);
  y = ds/2;

  for (i = 0; i < flow_in; i++, y+=ds) {
    let port = new FlowPort(i, 'in', this);
    port.attr('cx', Radius);
    port.attr('cy', y);
    ports.flow_in.push(port);
    this._el.appendChild(port._el);
  }

  for (i = 0; i < data_in; i++, y+=ds) {
    let port = new DataPort(i, 'in', this);
    port.attr('cx', Radius);
    port.attr('cy', y);
    ports.in.push(port);
    this._el.appendChild(port._el);
  }

  ds = height/(data_out + flow_out);
  y = ds/2; //initially get half the distance cuz we drawin a circle, then we increment by the total distance
            //cuz it means the missing half for the current circle and the initial half for the next circle
            //so every 'y' means one center of circle
  for (i = 0; i < flow_out; i++, y+=ds) {
    let port = new FlowPort(i, 'out', this);
    port.attr('cx', width + Radius);
    port.attr('cy', y);
    ports.flow_out.push(port);
    this._el.appendChild(port._el);
  }

  for (i = 0; i < data_out; i++, y+=ds) {
    let port = new DataPort(i, 'out', this);
    port.attr('cx', width + Radius);
    port.attr('cy', y);
    ports.out.push(port);
    this._el.appendChild(port._el);
  }

}
