const flowsJSON = [
  [
    {
      "refNode": "start",
      "inputs": {},
      "id": 0,
      "x": 16,
      "y": 33,
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
      "refNode": "PushDown",
      "inputs": {},
      "id": 1,
      "x": 18,
      "y": 121,
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
      "refNode": "PushLeft",
      "inputs": {},
      "id": 2,
      "x": 15,
      "y": 197,
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
      "refNode": "PushDown",
      "inputs": {},
      "id": 3,
      "x": 96,
      "y": 277,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 2,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 4,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushDown",
      "inputs": {},
      "id": 4,
      "x": 80,
      "y": 354,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 3,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 5,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushRight",
      "inputs": {},
      "id": 5,
      "x": 71,
      "y": 419,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 4,
              "id": 0
            }
          ]
        ],
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
      "refNode": "PushDown",
      "inputs": {},
      "id": 6,
      "x": 143,
      "y": 467,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 5,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 7,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushRight",
      "inputs": {},
      "id": 7,
      "x": 203,
      "y": 533,
      "ports": {
        "in": [],
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
          [
            {
              "brick": 8,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushRight",
      "inputs": {},
      "id": 8,
      "x": 320,
      "y": 446,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 7,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 10,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushUp",
      "inputs": {},
      "id": 10,
      "x": 308,
      "y": 326,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 8,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 11,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushUp",
      "inputs": {},
      "id": 11,
      "x": 252,
      "y": 230,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 10,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 12,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushRight",
      "inputs": {},
      "id": 12,
      "x": 167,
      "y": 133,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 11,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 13,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushUp",
      "inputs": {},
      "id": 13,
      "x": 119,
      "y": 19,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 12,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 14,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushUp",
      "inputs": {},
      "id": 14,
      "x": 230,
      "y": 39,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 13,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 15,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushRight",
      "inputs": {},
      "id": 15,
      "x": 334,
      "y": 62,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 14,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 17,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushRight",
      "inputs": {},
      "id": 17,
      "x": 440,
      "y": 110,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 15,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 18,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushDown",
      "inputs": {},
      "id": 18,
      "x": 488,
      "y": 203,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 17,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 19,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushDown",
      "inputs": {},
      "id": 19,
      "x": 513,
      "y": 288,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 18,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 21,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushLeft",
      "inputs": {},
      "id": 20,
      "x": 534,
      "y": 459,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 21,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 22,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushDown",
      "inputs": {},
      "id": 21,
      "x": 527,
      "y": 380,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 19,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          [
            {
              "brick": 20,
              "id": 0
            }
          ]
        ]
      }
    },
    {
      "refNode": "PushDown",
      "inputs": {},
      "id": 22,
      "x": 661,
      "y": 501,
      "ports": {
        "in": [],
        "out": [],
        "flow_in": [
          [
            {
              "brick": 20,
              "id": 0
            }
          ]
        ],
        "flow_out": [
          []
        ]
      }
    }
  ]
]