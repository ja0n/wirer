import Sticky from './Sticky.js';

var canvas = new Sticky('test');

let rect1 = canvas.createBlock('Sum');
let rect2 = canvas.createBlock('Source');
let rect3 = canvas.createBlock('Source');
let rect4 = canvas.createBlock('Alert');
let rect5 = canvas.createBlock('Sum');
let rect6 = canvas.createBlock('Comparison');

rect1.x = 130; rect1.y = 230;
rect2.x = 330; rect2.y = 200;
rect3.x = 330; rect3.y = 100;
rect4.x = 130; rect4.y = 300;

window.canvas = canvas;
canvas.addObj(rect1);
canvas.addObj(rect2);
canvas.addObj(rect3);
canvas.addObj(rect4);
canvas.addObj(rect5);
canvas.addObj(rect6);

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
