function DataPort(id, dir, brick) {
  Port.call(this, { id, dir, brick, type: 'data' });

  var opts = { fill: '#B8D43' };

  return this;
}

DataPort.prototype = {
  __proto__: Object.create(Port.prototype)
};

function FluxPort(id, dir, brick) {
  Port.call(this, { id, dir, brick, type: 'flux' });

  this._maxcon = 1;

  this._el.setAttribute('fill', '#2549e4');

  var opts = { fill: '#2549e4' };

  return this;
}

FluxPort.prototype = {
  __proto__: Object.create(Port.prototype)
};
