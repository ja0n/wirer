export default {
  'start': {
    id: 'start',
    width: 35,
    height: 60,
    rx: 10,
    ry: 10,
    fill: '#AF2B37',
    ports: { data_in: 0, data_out: 0, flow_in: 0, flow_out: 1 },
    title: '',
    icon: 'img/icon.png',
    behavior: () => 0
  },
  'Source': {
    id: 'Source',
    fill: '#4fec2f',
    ports: { data_in: 0, data_out: 1, flow_in: 0, flow_out: 0 },
    title: 'Source Block',
    gui: {
      number: { label: 'Number', type: 'number' }
    },
    behavior: function() {
      return [this.inputs.number];
    }
  },
  'Comparison': {
    id: 'Comparison',
    fill: '#4fec2f',
    ports: { data_in: 2, data_out: 1, flow_in: 0, flow_out: 0 },
    title: 'Comparison Block',
    gui: {
      op: { label: 'Operation', type: 'select', options: ['==', '!=', '===', '!==', '>', '>=', '<', '<='] },
    },
    behavior: function(findById) {
      const conn1 = (this._ports['in'][0]._conn[0]);
      const conn2 = (this._ports['in'][1]._conn[0]);
      const brick1 = findById(conn1.brick);
      const brick2 = findById(conn2.brick);
      const val1 = brick1.behavior(findById)[conn1.id];
      const val2 = brick2.behavior(findById)[conn2.id];

      return [eval(`${val1} ${this.inputs.op} ${val2}`)];
    }
  },
  'Alert': {
    id: 'Alert',
    fill: '#EC962F',
    ports: { data_in: 1, data_out: 0, flow_in: 1, flow_out: 1 },
    title: 'Alert Block',
    behavior: function(findById) {
      const conn = this._ports['in'][0]._conn[0];
      const brick = findById(conn.brick);
      const data = brick.behavior(findById)[conn.id];

      alert(data);

      return 0;
    }
  },
  'Sum': {
    id: 'Sum',
    fill: '#3e67c2',
    ports: { data_in: 2, data_out: 1, flow_in: 0, flow_out: 0 },
    title: 'Sum Block',
    behavior: function(findById) {
      const conn1 = (this._ports['in'][0]._conn[0]);
      const conn2 = (this._ports['in'][1]._conn[0]);
      const brick1 = findById(conn1.brick);
      const brick2 = findById(conn2.brick);
      const val1 = brick1.behavior(findById)[conn1.id];
      const val2 = brick2.behavior(findById)[conn2.id];

      return [val1 + val2];
    }
  },
  'If': {
    id: 'If',
    fill: '#3e67c2',
    ports: { data_in: 1, data_out: 0, flow_in: 1, flow_out: 2 },
    title: 'If Block',
    behavior: function(findById) {
      const conn = this._ports['in'][0]._conn[0];
      const brick = findById(conn.brick);
      const data = brick.behavior(findById)[conn.id];

      return data ? 0 : 1;
    }
  },
}