import Port from './Port.js';

export class DataPort extends Port {
  constructor ({ id, dir, brick, ref }) {
    super({ id, dir, brick, ref, type: 'data' });

    const opts = { fill: '#B8D43' };
  }
}

export class FlowPort extends Port {
  constructor ({ id, dir, brick, ref }) {
    super({ id, dir, brick, ref, type: 'flow' });

    this._maxcon = 1;

    this._el.setAttribute('fill', '#2549e4');

    const opts = { fill: '#2549e4' };
  }
}