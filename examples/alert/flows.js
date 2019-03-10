const flowsJSON = [
  [
    {
      "refBlock": "start",
      "inputs": {},
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
      "refBlock": "SourceNumber",
      "inputs": {
        "number": 4
      },
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
      "refBlock": "SourceNumber",
      "inputs": {
        "number": 2
      },
      "id": 2,
      "x": 57,
      "y": 556,
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
      "inputs": {},
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
      "refBlock": "Comparison",
      "inputs": {
        "op": "+"
      },
      "id": 4,
      "x": 299,
      "y": 509,
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
      "inputs": {
        "op": "=="
      },
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
      "inputs": {},
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
  ],
  [
    {
      "refBlock": "start",
      "inputs": {},
      "id": 0,
      "x": 325,
      "y": 42,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [],
        "flow_out": [
          [
            {
              "brick": 3,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refBlock": "SourceNumber",
      "inputs": {
        "number": 2
      },
      "id": 1,
      "x": 242.42070311501737,
      "y": 588.0035438954401,
      "ports": {
        "in": [],
        "out": [
          [
            {
              "brick": 6,
              "id": 1
            }
          ]
        ],
        "flow_in": [],
        "flow_out": []
      }
    },
    {
      "refBlock": "SourceNumber",
      "inputs": {
        "number": 2
      },
      "id": 2,
      "x": 232.7657232622189,
      "y": 392.94658309523123,
      "ports": {
        "in": [],
        "out": [
          [
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
      "refBlock": "Alert",
      "inputs": {},
      "id": 3,
      "x": 661.8058720595286,
      "y": 119.76782457857433,
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
          []
        ]
      }
    },
    {
      "refBlock": "Comparison",
      "inputs": {
        "op": "+"
      },
      "id": 5,
      "x": 534.8799015430952,
      "y": 303.9800244940611,
      "ports": {
        "in": [
          [
            {
              "brick": 8,
              "id": 0
            }
          ],
          [
            {
              "brick": 6,
              "id": 0
            }
          ]
        ],
        "out": [
          [
            {
              "brick": 3,
              "id": 0
            }
          ]
        ],
        "flow_in": [],
        "flow_out": []
      }
    },
    {
      "refBlock": "Comparison",
      "inputs": {
        "op": "+"
      },
      "id": 6,
      "x": 413.5586575710936,
      "y": 472.17411831475874,
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
              "brick": 1,
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
      "refBlock": "SourceString",
      "inputs": {
        "text": "the result is "
      },
      "id": 8,
      "x": 251.05671119774888,
      "y": 207.25361968931247,
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
    }
  ] 
];