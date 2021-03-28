export default {
  'start': {
    id: 'start',
    width: 35,
    height: 60,
    rx: 10,
    ry: 10,
    fill: '#AF2B37',
    ports: { data_in: 0, data_out: 0, flow_in: 1, flow_out: 1 },
    title: 'Start',
    icon: 'img/icon.png',
    behavior: () => 0
  },
  'delay': {
    id: 'delay',
    fill: '#FF8D4F',
    title: 'delay',
    ports: { data_in: 0, data_out: 0, flow_in: 1, flow_out: 1 },
    gui: {
      value: { label: 'value (ms)', type: 'number' },
    },
    async behavior () {
      return new Promise(resolve => setTimeout(() => resolve(0), this.inputs.value))
    }
  },
  'SourceNumber': {
    id: 'SourceNumber',
    fill: '#cfec2f',
    ports: { data_in: 0, data_out: 1, flow_in: 0, flow_out: 0 },
    title: 'Number',
    gui: {
      number: { label: 'Number', type: 'number' }
    },
    behavior: function() {
      return [this.inputs.number];
    }
  },
  'SourceString': {
    id: 'SourceString',
    fill: '#cfec2f',
    ports: { data_in: 0, data_out: 1, flow_in: 0, flow_out: 0 },
    title: 'String',
    gui: {
      text: { label: 'Text', type: 'text' }
    },
    behavior: function() {
      return [this.inputs.text];
    }
  },
  'Operation': {
    id: 'Operation',
    fill: '#cfec2f',
    ports: { data_in: 2, data_out: 1, flow_in: 0, flow_out: 0 },
    title: 'Operation',
    gui: {
      op: { label: 'Operation', type: 'select', options: ['==', '!=', '===', '!==', '>', '>=', '<', '<=', '+', '-', '*', '/'] },
    },
    behavior: async function (findById, context) {
      const conn1 = (this._ports['in'][0].connections[0]);
      const conn2 = (this._ports['in'][1].connections[0]);
      const node1 = findById(conn1.nodeId);
      const node2 = findById(conn2.nodeId);
      const val1 = await node1.getValue(findById, context, conn1.id);
      const val2 = await node2.getValue(findById, context, conn2.id);

      return [eval(`${JSON.stringify(val1)} ${this.inputs.op} ${JSON.stringify(val2)}`)];
    }
  },
  'Alert': {
    id: 'Alert',
    fill: '#EC962F',
    ports: { data_in: 1, data_out: 0, flow_in: 1, flow_out: 1 },
    title: 'Alert',
    behavior: async function (findById, context) {
      const conn = this._ports['in'][0].connections[0];
      const node = findById(conn.nodeId);
      const value = await node.getValue(findById, context, conn.id)

      alert(value);

      return 0;
    }
  },
  'If': {
    id: 'If',
    fill: '#EC962F',
    ports: { data_in: 1, data_out: 0, flow_in: 1, flow_out: 2 },
    title: 'If',
    behavior: async function (findById, context) {
      const conn = this._ports['in'][0].connections[0];
      const node = findById(conn.nodeId);
      const value = await node.getValue(findById, context, conn.id)

      return value ? 0 : 1;
    }
  },
}