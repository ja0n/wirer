export default {
  'start': {
    id: 'start',
    width: 35,
    height: 60,
    rx: 10,
    ry: 10,
    fill: '#AF2B37',
    ports: { data_in: 0, data_out: 0, flow_in: 0, flow_out: 1 },
    title: 'Start',
    icon: 'img/icon.png',
    behavior: () => 0
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
      op: { label: 'Operation', type: 'select', options: ['==', '!=', '===', '!==', '>', '>=', '<', '<=', '+', '-', '*', '/' ] },
    },
    behavior: function(findById) {
      const conn1 = (this._ports['in'][0].connections[0]);
      const conn2 = (this._ports['in'][1].connections[0]);
      const node1 = findById(conn1.nodeId);
      const node2 = findById(conn2.nodeId);
      const val1 = node1.behavior(findById)[conn1.id];
      const val2 = node2.behavior(findById)[conn2.id];

      return [eval(`${JSON.stringify(val1)} ${this.inputs.op} ${JSON.stringify(val2)}`)];
    }
  },
  'Alert': {
    id: 'Alert',
    fill: '#EC962F',
    ports: { data_in: 1, data_out: 0, flow_in: 1, flow_out: 1 },
    title: 'Alert',
    behavior: function(findById) {
      const conn = this._ports['in'][0].connections[0];
      const node = findById(conn.nodeId);
      const data = node.behavior(findById)[conn.id];

      alert(data);

      return 0;
    }
  },
  'Sum': {
    id: 'Sum',
    fill: '#cfec2f',
    ports: { data_in: 2, data_out: 1, flow_in: 0, flow_out: 0 },
    title: 'Sum',
    behavior: function(findById) {
      const conn1 = (this._ports['in'][0].connections[0]);
      const conn2 = (this._ports['in'][1].connections[0]);
      const node1 = findById(conn1.nodeId);
      const node2 = findById(conn2.nodeId);
      const val1 = node1.behavior(findById)[conn1.id];
      const val2 = node2.behavior(findById)[conn2.id];

      return [val1 + val2];
    }
  },
  'If': {
    id: 'If',
    fill: '#EC962F',
    ports: { data_in: 1, data_out: 0, flow_in: 1, flow_out: 2 },
    title: 'If',
    behavior: function(findById) {
      const conn = this._ports['in'][0].connections[0];
      const node = findById(conn.nodeId);
      const data = node.behavior(findById)[conn.id];

      return data ? 0 : 1;
    }
  },
}