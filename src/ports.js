import Port from './Port';

export class DataPort extends Port {

  constructor ({ ...args }) {
    super({ ...args, type: 'data' });
    this.color = '#B8D430';

    if (this.direction == 'out') {
      this.maxConnections = null;
    }
    const opts = { fill: '#B8D43' };
  }
}

export class FlowPort extends Port {

  constructor ({ ...args }) {
    super({ ...args, type: 'flow' });
    this.color = '#2549e4';
    this.maxConnections = 1;
    // this._el.setAttribute('fill', '#2549e4');
    const opts = { fill: '#2549e4' };
  }
}