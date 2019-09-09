var game = new DumbBox('canvas', { controls: false });
var canvas = new Sticky.default('test');
var sum = [];
var nodeConfig = {
  'PushUp': {
    fill: '#F5E867',
    ports: { data_in: 0, data_out: 0, flow_in: 1, flow_out: 1 },
    title: 'Up',
    behavior: function () {
      sum.push('up');
      return 0;
    }
  },
  'PushDown': {
    fill: '#FF8D4F',
    ports: { data_in: 0, data_out: 0, flow_in: 1, flow_out: 1 },
    title: 'Down',
    behavior: function () {
      sum.push('down');
      return 0;
    }
  },
  'PushLeft': {
    fill: '#D592F7',
    ports: { data_in: 0, data_out: 0, flow_in: 1, flow_out: 1 },
    title: 'Left',
    behavior: function () {
      sum.push('left');
      return 0;
    }
  },
  'PushRight': {
    fill: '#289E71',
    ports: { data_in: 0, data_out: 0, flow_in: 1, flow_out: 1 },
    title: 'Right',
    behavior: function () {
      sum.push('right');
      return 0;
    }
  },
};

Object.keys(nodeConfig).forEach(key => canvas.registerNode(key, nodeConfig[key]));

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addNode(direction) {
  var rect = canvas.createNode('Push' + direction);
  rect.x = 150 + getRandomInt(-25, 25);
  rect.y = 200 + getRandomInt(-25, 25);

  canvas.addNode(rect);
}

window.addEventListener('keyup', function (e) {
  var translate = { 37: 'Left', 38: 'Up', 39: 'Right', 40: 'Down' };
  var direction = translate[e.keyCode];

  if (direction) {
    addNode(diretion);
  }
});

document.getElementById('run').onclick = function () {
  sum = [];
  canvas.run();
  for (var i = 0; i < sum.length; i++) {
    console.log(sum[i]);
    game.player.pushMove(sum[i]);
  }

};

document.getElementById('reset').onclick = function () {
  game.reset();
};

document.getElementById('gameshark').onclick = function () {
  canvas.loadJSON(flowsJSON[0]);
};

['Left', 'Up', 'Right', 'Down'].forEach(function (dir) {
  document.getElementById(dir.toLowerCase()).onclick = function () {
    addNode(dir);
  };
});
var map = {
  initialPos: [1, 0],
  tiled: [
    "10100000",
    "00110101",
    "01000101",
    "00101000",
    "10001011"
  ]
};

var matargetPort = [
  "0000000000",
  "0000000000",
  "0000000000"
];
game.loadMap(50, map, { 0: 'red', 1: 'blue' });
game.start();