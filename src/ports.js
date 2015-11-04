import Port from './Port.js';

export function DataPort(id, dir, brick) {
  Port.call(this, { id, dir, brick, type: 'data' });

  var opts = { fill: '#B8D43' };

  return this;
}

DataPort.prototype = {
  __proto__: Object.create(Port.prototype)
};

export function FlowPort(id, dir, brick) {
  Port.call(this, { id, dir, brick, type: 'flow' });

  this._maxcon = 1;

  this._el.setAttribute('fill', '#2549e4');

  var opts = { fill: '#2549e4' };

  return this;
}

FlowPort.prototype = {
  __proto__: Object.create(Port.prototype)
};
