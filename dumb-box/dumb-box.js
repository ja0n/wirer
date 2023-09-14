window.DumbBox = DumbBox;

function DumbBox(id, obj) {
  var el = document.getElementById(id);
  this.ctx = el.getContext('2d');

  if (obj.controls)
  window.addEventListener('keyup', e => {

    var moveMap = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };

    var move = moveMap[e.keyCode];

    if (move) {
      this.player.pushMove(move);
    }
  });
}


DumbBox.prototype = {
  drawHLine: function(y, w, c) {
    var ctx = this.ctx;
    ctx.save();
    ctx.lineWidth = (w || 1);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ctx.canvas.width, y);
    ctx.stroke();
    ctx.restore();
  },
  drawVLine: function(x, w) {
    var ctx = this.ctx;
    ctx.save();
    ctx.lineWidth = (w || 1);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ctx.canvas.height);
    ctx.stroke();
    ctx.restore();
  },
  drawPlayer: function(x, y) {
    var ctx = this.ctx, size = this.map.size;
    ctx.beginPath();
    ctx.rect(this.player.x * size, this.player.y * size, size, size);
    ctx.fillStyle = 'black';
    ctx.fill();
  },
  loadMap: function(size, map, colors) {
    var initialPos = map.initialPos;
    this.map = {
      initialPos: initialPos,
      size: size,
      data: map,
      colors: colors,
      coord: (x, y) => this.map.data[y][x]
    };
    this.map.data = map.tiled.map(line => Array.from(line));
    this.player = new Player(initialPos[0], initialPos[1], this.map);
  },
  drawMap: function() {
    var map = this.map.data;
    for (var i = 0; i < map.length; i++) {
      var row = map[i];
      for (var j = 0; j < row.length; j++) {
        this.drawTile(j, i, row[j]);
      }
    }
  },
  drawTile: function(x, y, type) {
    var ctx = this.ctx, size = this.map.size, colors = this.map.colors;
    ctx.beginPath();
    ctx.rect(x * size, y * size, size, size);
    ctx.fillStyle = colors[type];
    ctx.fill();
  },
  runCycle: function(dt) {
    if (this.paused) return null;

    this.player.update(dt);

    this.clearCanvas();
    this.drawMap();
    this.drawPlayer();
  },
  clearCanvas: function() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  },
  reset: function() {
    this.player.x = this.map.initialPos[0];
    this.player.y = this.map.initialPos[1];
    this.player.clearMoves();
  },
  start: function() {
    var lastTime = null;
    var anim = function(timestamp) {
      if (!lastTime) lastTime = timestamp;
      var dt = timestamp - lastTime;
      lastTime = timestamp;
      this.runCycle(dt);

      window.requestAnimationFrame(anim);
    };
    anim = anim.bind(this);

    window.requestAnimationFrame(anim);
  }

};

var Player = function(x, y, map) {
  this.x = x || 0;
  this.y = y || 0;
  this.map = map;
  this.moves = [];
  this.actions = [];
}

Player.prototype = {
  pushMove: function(move) {
    if (!(['left', 'right', 'up', 'down'].includes(move))) return null;
    this.moves.push(move);
  },
  clearMoves: function () {
    this.moves = [];
    this.actions = [];
  },
  pushNextAction: function(){
    var move = this.moves.splice(0, 1)[0];
    switch (move) {
      case 'left':
        this.actions.push(this.makeMove(this.x - 1, this.y));
        break;
      case 'right':
        this.actions.push(this.makeMove(this.x + 1, this.y));
        break;
      case 'up':
        this.actions.push(this.makeMove(this.x, this.y - 1));
        break;
      case 'down':
        this.actions.push(this.makeMove(this.x, this.y + 1));
        break;
    }

  },
  update: function(dt) {
    if (!this.actions[0] && this.moves[0]) this.pushNextAction();

    if (this.actions[0] && this.actions[0].call(this, dt)) {
      this.actions.shift();
    }
    return;
    for (var i = 0; i < this.actions.length; i++) {
      if(this.actions[i].call(this, dt))
        this.actions.splice(i, 1);
    }
  },
  makeMove: function(x, y) {
    return function(dt) {
      var map = this.map;

      var vel = 0.0025;

      var invalid = x < 0 || x >= map.data[0].length || y < 0 || y >= map.data.length || (map.coord(x, y) != '0');

      if ((this.x == x && this.y == y) || invalid) return true;

      if (x < this.x) {
        this.x = this.x - (dt*vel) <= x ? x : this.x - (dt*vel);
      } else {
        this.x = this.x + (dt*vel) >= x ? x : this.x + (dt*vel);
      }

      if (y < this.y) {
        this.y = this.y - (dt*vel) <= y ? y : this.y - (dt*vel);
      } else {
        this.y = this.y + (dt*vel) >= y ? y : this.y + (dt*vel);
      }
    };
  }
};
