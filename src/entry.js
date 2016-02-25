import Sticky from './Sticky.js';
console.log(Sticky);
var canvas = new Sticky('test');

canvas.registerBlock('Source', {
  fill: '#4fec2f',
  ports: { data_in: 0, data_out: 1, flow_in: 0, flow_out: 0 },
  title: 'Source Block',
  behavior: function() {
    return this.value;
  }
});

canvas.registerBlock('Actuator', {
  fill: '#673A7E',
  ports: { data_in: 0, data_out: 0, flow_in: 1, flow_out: 1 },
  title: 'Actuator Block',
  behavior: `console.log(this);
    alert(this.value);
    return 0;
  `
});

canvas.registerBlock('Alert', {
  fill: '#EC962F',
  ports: { data_in: 1, data_out: 0, flow_in: 1, flow_out: 1 },
  title: 'Alert Block',
  behavior: function(findById) {
    var conn = this._ports['in'][0]._conn[0];
    console.log(conn, conn.brick)
    var brick = findById(conn.brick);
    var data = brick.behavior(findById)[conn.id];
    alert(data);

    return 0;
  }
});

canvas.registerBlock('Sum', {
  fill: '#3e67c2',
  ports: { data_in: 2, data_out: 1, flow_in: 0, flow_out: 0 },
  title: 'Sum Block',
  behavior: function(findById) {
    var val1 = (this._ports['in'][0]._conn[0]);
    var val2 = (this._ports['in'][1]._conn[0]);
    var brick = findById(val1.brick);
    var data = brick.behavior(findById)[val2.id];
    brick = findById(val2.brick);
    data += brick.behavior(findById)[val2.id];

    return [data];
  }
});


let rect = canvas.createBlock('Actuator');
let rect2 = canvas.createBlock('Actuator');
let rect3 = canvas.createBlock('Source');
let rect4 = canvas.createBlock('Alert');
let rect5 = canvas.createBlock('Sum');
let rect6 = canvas.createBlock('Source');
let rect7 = canvas.createBlock('Source');
let rect8 = canvas.createBlock('Alert');
let rect9 = canvas.createBlock('Sum');

rect.x = 130; rect.y = 230;
rect2.x = 330; rect2.y = 200;
rect3.x = 330; rect3.y = 100;
rect4.x = 130; rect4.y = 300;

rect.value = 'helloooooo';
rect2.value = 'world';
rect3.value = 'nayn cat';
rect6.value = [4];
rect7.value = [2];

window.canvas = canvas;
// canvas.addObj(rect);
// canvas.addObj(rect2);
// canvas.addObj(rect3);
// canvas.addObj(rect4);
canvas.addObj(rect5);
canvas.addObj(rect6);
canvas.addObj(rect7);
canvas.addObj(rect8);
canvas.addObj(rect9);

document.getElementById('run').onclick = function() {
  canvas.run();
};

const loadTest = [
  {
    "refBlock": "start",
    "id": 0,
    "x": 14,
    "y": 154,
    "ports": {
      "in": [],
      "out": [],
      "flow_in": [],
      "flow_out": [
        [
          {
            "brick": 1,
            "id": 0
          }
        ]
      ]
    }
  },
  {
    "refBlock": "Actuator",
    "id": 1,
    "x": 61,
    "y": 246,
    "value": "hello",
    "ports": {
      "in": [],
      "out": [],
      "flow_in": [
        [
          {
            "brick": 0,
            "id": 0
          }
        ]
      ],
      "flow_out": [
        [
          {
            "brick": 2,
            "id": 0
          }
        ]
      ]
    }
  },
  {
    "refBlock": "Actuator",
    "id": 2,
    "x": 244,
    "y": 170,
    "value": "world",
    "ports": {
      "in": [],
      "out": [],
      "flow_in": [
        [
          {
            "brick": 1,
            "id": 0
          }
        ]
      ],
      "flow_out": []
    }
  }
];

// canvas.loadJSON(loadTest);
