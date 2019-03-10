const flowsJSON = [
  [
    {
      "refBlock": "start",
      "inputs": {},
      "id": 0,
      "x": 207,
      "y": 90,
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
      "x": 75,
      "y": 206,
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
      "x": 30,
      "y": 343,
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
      "x": 563,
      "y": 236,
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
      "refBlock": "Operation",
      "inputs": {
        "op": "+"
      },
      "id": 4,
      "x": 159,
      "y": 371,
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
      "refBlock": "Operation",
      "inputs": {
        "op": "=="
      },
      "id": 5,
      "x": 274,
      "y": 264,
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
      "x": 404,
      "y": 161,
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
      "x": 328,
      "y": 77,
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
      "x": 132.42070311501737,
      "y": 417.0035438954401,
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
      "x": 146.7657232622189,
      "y": 264.94658309523123,
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
      "x": 491.8058720595286,
      "y": 110.76782457857433,
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
      "refBlock": "Operation",
      "inputs": {
        "op": "+"
      },
      "id": 5,
      "x": 398.87990154309523,
      "y": 223.98002449406113,
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
      "refBlock": "Operation",
      "inputs": {
        "op": "+"
      },
      "id": 6,
      "x": 286.5586575710936,
      "y": 310.17411831475874,
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
      "x": 189.05671119774888,
      "y": 163.25361968931247,
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