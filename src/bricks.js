function StartBrick() {
  Brick.call(this, { data_in: 0, data_out: 0, flow_in: 0, flow_out: 1 });

  this.behavior = () => 0;
  var opts = { width: 35, height: 60, rx: 10, ry: 10, fill: '#AF2B37' };
  this._el = SVGBuilder(opts);
  arrangePorts.call(this, { data_in: 0, data_out: 0, flow_in: 0, flow_out: 1 });

  return this;
}

StartBrick.prototype = {
  __proto__: Object.create(Brick.prototype)
};

function ActuatorBrick() {
  Brick.call(this, { data_in: 0, data_out: 0, flow_in: 1, flow_out: 1 });

  var opts = { fill: '#EC962F' };
  this._el = SVGBuilder(opts);
  arrangePorts.call(this, { data_in: 0, data_out: 0, flow_in: 1, flow_out: 1 });

  return this;
}

ActuatorBrick.prototype = {
  __proto__: Object.create(Brick.prototype)
};

function SourceBrick() {
  Brick.call(this, { data_in: 0, data_out: 1, flow_in: 0, flow_out: 0 });

  var opts = { fill: '#4fec2f' };
  this._el = SVGBuilder(opts);
  arrangePorts.call(this, { data_in: 0, data_out: 1, flow_in: 0, flow_out: 0 });

  return this;
}

SourceBrick.prototype = {
  __proto__: Object.create(Brick.prototype)
};

function AlertBrick() {
  Brick.call(this, { data_in: 1, data_out: 0, flow_in: 1, flow_out: 1 });

  var opts = { fill: '#EC962F' };
  this._el = SVGBuilder(opts);
  arrangePorts.call(this, { data_in: 1, data_out: 0, flow_in: 1, flow_out: 1 });

  return this;
}

AlertBrick.prototype = {
  __proto__: Object.create(Brick.prototype)
};
