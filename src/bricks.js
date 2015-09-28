function StartBrick() {
  Brick.call(this, { data_in: 0, data_out: 0, flux_in: 0, flux_out: 1 });

  this.behavior = () => 0;
  var opts = { width: 35, height: 60, rx: 10, ry: 10, fill: '#AF2B37' };
  this._el = SVGBuilder(opts);
  arrangePorts.call(this, { data_in: 0, data_out: 0, flux_in: 0, flux_out: 1 });

  return this;
}

StartBrick.prototype = {
  __proto__: Object.create(Brick.prototype)
};

function ActuatorBrick() {
  Brick.call(this, { data_in: 0, data_out: 0, flux_in: 1, flux_out: 1 });

  var opts = { fill: '#EC962F' };
  this._el = SVGBuilder(opts);
  arrangePorts.call(this, { data_in: 0, data_out: 0, flux_in: 1, flux_out: 1 });

  return this;
}

ActuatorBrick.prototype = {
  __proto__: Object.create(Brick.prototype)
};
