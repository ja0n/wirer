import Sticky from './Sticky.js';
import { DataPort, FlowPort } from './ports.js';
// var Port = require('./Port');
export default function Brick({ title, ports, icon, gui }) {
  this._el = SVGBuilder(arguments[0]);
  this._id = null;
  this._container = null;

  this._ports = {
    in: [],
    out: []
  };

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

function SVGBuilder({ strokeWidth, marginLeft, width, opacity, height, rx, ry, fill, stroke }) {
// { strokeWidth = 3, marginLeft = 10, width = 150, opacity = 1, height = 50, rx = 20, ry = 20, fill = '#1F8244', stroke = '#000000' }
  strokeWidth = strokeWidth || 3;
  marginLeft = marginLeft || 10;
  width = width || 150;
  opacity = opacity || 1;
  height = height || 50;
  rx = rx || 20;
  ry = ry || 20;
  fill = fill || '#1F8244';
  stroke = '#000000';

  var svg = Sticky.createElement('svg');

  var attrs = {
    x: marginLeft + strokeWidth/2,
    y: strokeWidth/2,
    width,
    height,
    rx,
    ry,
    'stroke-width': strokeWidth,
    style: 'fill: ' + fill + '; stroke: ' + stroke + '; opacity: ' + opacity,
    id: 'main',
    type: 'block'
  };

  var rect = Sticky.createElement('rect', attrs);

  svg.appendChild(rect);
  return svg;
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
