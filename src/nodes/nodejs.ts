import { NodeConfig } from '../Node'

const nodeMap: Record<string, NodeConfig> = {
  'console': {
    id: 'console',
    fill: '#F5E867',
    ports: { data_in: 2, data_out: 0, flow_in: 1, flow_out: 1 },
    title: 'console',
    gui: {
      op: { label: 'action', type: 'select', options: ['log', 'info'] },
      value: { label: 'value', type: 'text' },
    },
    async behavior (findById, { board }) {
      let op = this.inputs.op;
      const portConn = this._ports['in'][0].connections[0];
      const portNode = portConn && findById(portConn.nodeId);
      if (portNode) {
        op = portNode.behavior(findById)[portConn.id];
      }

      let value = JSON.parse(this.inputs.value);
      const valueConn = this._ports['in'][1].connections[0];
      const valueNode = valueConn && findById(valueConn.nodeId);
      if (valueNode) {
        value = (await valueNode.behavior(findById, { board }))[valueConn.id];
      }

      console[op](value);
      return 0;
    }
  },
  'readQuestion': {
    fill: '#FF8D4F',
    ports: { data_in: 1, data_out: 1, flow_in: 0, flow_out: 0 },
    title: 'readQuestion',
    gui: {
      message: { label: 'message', type: 'text' },
    },
    async behavior (findById, { board }) {
      let message = this.inputs.message;
      const portConn = this._ports['in'][0].connections[0];
      const portNode = portConn && findById(portConn.nodeId);
      if (portNode) {
        message = portNode.behavior(findById)[portConn.id];
      }

      const readline = require('readline');
      return new Promise(resolve => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        rl.question(message, (value) => {
          rl.on('close', () => resolve([value]));
          rl.close();
        });
      })

    }
  },
};

export default nodeMap;