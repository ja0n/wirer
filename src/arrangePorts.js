import { DataPort, FlowPort } from './ports.js';

export default function arrangePorts({ data_in = 1, data_out = 1, flow_in = 1, flow_out = 1 } = {}, gui = {}) {
  var radius = 10;
  var distance = 0; //distance beetween ports
  var strokeWidth = 3.5;
  var marginTop = 30;
  var ports = this._ports;
  var main = this.main;
  // var rectBox = main.getBBox ? main.getBBox() : main.getBoundingClientRect();
  var rectBox =  main.getBoundingClientRect();
  var maxPorts = Math.max(data_in + flow_in, data_out + flow_out);
  // var maxPorts = Math.max(ports.in.length, ports.out.length);
  var Radius = radius + strokeWidth/2; //total radius -> circle radius plus its stroke width
  var tRadius = distance + Radius;
  var height = (tRadius * 2) * Math.max(maxPorts, 1 + Object.keys(gui).length); //distance + diameter * number of ports + final distance
  var width = main.getAttribute('width') * 1;

  this._ports.in = [];
  this._ports.out = [];
  this._ports.flow_in = [];
  this._ports.flow_out = [];

  main.setAttribute('height', height + marginTop + marginTop/4);

  var attrs = { id: null, r: radius, fill: '#B8D430', stroke: 'black', 'stroke-width': strokeWidth };
  var flow_attrs = { id: null, r: radius, fill: '#2549e4', stroke: 'black', 'stroke-width': strokeWidth };
  var i, y, ds;
  // attrs.cx = margin; attrs.cy = rectBox.height/2;

  ds = height/(data_in + flow_in);
  y = marginTop + ds/2; // center circle origin

  for (i = 0; i < flow_in; i++, y+=ds) {
    let port = new FlowPort({ id: i, dir: 'in', brick: this });
    port.attr('cy', y);
    ports.flow_in.push(port);
    this._el.appendChild(port._el);
  }

  for (i = 0; i < data_in; i++, y+=ds) {
    let port = new DataPort({ id: i, dir: 'in', brick: this });
    port.attr('cy', y);
    ports.in.push(port);
    this._el.appendChild(port._el);
  }

  ds = height/(data_out + flow_out);
  y = marginTop + ds/2;

  for (i = 0; i < flow_out; i++, y+=ds) {
    let port = new FlowPort({ id: i, dir: 'out', brick: this });
    port.attr('cx', width);
    port.attr('cy', y);
    ports.flow_out.push(port);
    this._el.appendChild(port._el);
  }

  for (i = 0; i < data_out; i++, y+=ds) {
    let port = new DataPort({ id: i, dir: 'out', brick: this });
    port.attr('cx', width);
    port.attr('cy', y);
    ports.out.push(port);
    this._el.appendChild(port._el);
  }

}