var canvas = new Sticky('test', { width: 1200, height: 800 });

const initialBlocks = ['Source', 'Source', 'Alert', 'Sum', 'Comparison', 'If'];

const getRandom = (min, max) => min + (Math.random() * (max - min));

const blocks = initialBlocks.map(blockName => {
  const block = canvas.createBlock(blockName);
  block.x = getRandom(200, 800);
  block.y = getRandom(200, 600);
  canvas.addObj(block);
})

document.getElementById('run').onclick = function() {
  canvas.run();
};


document.getElementById('load').onclick = function() {
  canvas.clearCanvas(false);
  canvas.loadJSON(flowJSON);
};

const flowJSON = [
  {
    "refBlock": "start",
    "id": 0,
    "x": 269,
    "y": 68,
    "ports": {
      "in": [],
      "out": [],
      "flow_in": [],
      "flow_out": [
        [
          {
            "brick": 6,
            "id": 0
          }
        ]
      ]
    }
  },
  {
    "refBlock": "Source",
    "id": 1,
    "x": 22,
    "y": 199,
    "ports": {
      "in": [],
      "out": [
        [
          {
            "brick": 5,
            "id": 0
          }
        ]
      ],
      "flow_in": [],
      "flow_out": []
    }
  },
  {
    "refBlock": "Source",
    "id": 2,
    "x": 30,
    "y": 578,
    "ports": {
      "in": [],
      "out": [
        [
          {
            "brick": 4,
            "id": 0
          },
          {
            "brick": 4,
            "id": 1
          }
        ]
      ],
      "flow_in": [],
      "flow_out": []
    }
  },
  {
    "refBlock": "Alert",
    "id": 3,
    "x": 836,
    "y": 264,
    "ports": {
      "in": [
        [
          {
            "brick": 5,
            "id": 0
          }
        ]
      ],
      "out": [],
      "flow_in": [
        [
          {
            "brick": 6,
            "id": 0
          }
        ]
      ],
      "flow_out": [
        []
      ]
    }
  },
  {
    "refBlock": "Sum",
    "id": 4,
    "x": 304,
    "y": 551,
    "ports": {
      "in": [
        [
          {
            "brick": 2,
            "id": 0
          }
        ],
        [
          {
            "brick": 2,
            "id": 0
          }
        ]
      ],
      "out": [
        [
          {
            "brick": 5,
            "id": 1
          }
        ]
      ],
      "flow_in": [],
      "flow_out": []
    }
  },
  {
    "refBlock": "Comparison",
    "id": 5,
    "x": 449,
    "y": 333,
    "ports": {
      "in": [
        [
          {
            "brick": 1,
            "id": 0
          }
        ],
        [
          {
            "brick": 4,
            "id": 0
          }
        ]
      ],
      "out": [
        [
          {
            "brick": 3,
            "id": 0
          },
          {
            "brick": 6,
            "id": 0
          }
        ]
      ],
      "flow_in": [],
      "flow_out": []
    }
  },
  {
    "refBlock": "If",
    "id": 6,
    "x": 537,
    "y": 119,
    "ports": {
      "in": [
        [
          {
            "brick": 5,
            "id": 0
          }
        ]
      ],
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
            "brick": 3,
            "id": 0
          }
        ],
        []
      ]
    }
  }
]