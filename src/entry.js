import Sticky from './Sticky.js';
import Brick from './Brick.js';

var canvas = new Sticky('test');

canvas.registerBlock('Source', {
  fill: '#4fec2f',
  ports: { data_in: 0, data_out: 1, flow_in: 0, flow_out: 0 },
  title: 'Source Block'
});

canvas.registerBlock('Actuator', {
  fill: '#673A7E',
  ports: { data_in: 0, data_out: 0, flow_in: 1, flow_out: 1 },
  title: 'Actuator Block'
});

canvas.registerBlock('Alert', {
  fill: '#EC962F',
  ports: { data_in: 1, data_out: 0, flow_in: 1, flow_out: 1 },
  title: 'Alert Block'
});

canvas.registerBlock('Sum', {
  fill: '#3e67c2',
  ports: { data_in: 2, data_out: 1, flow_in: 0, flow_out: 0 },
  title: 'Sum Block'
});


let rect = canvas.createBlock('Actuator');
let rect2 = canvas.createBlock('Actuator');
let rect3 = canvas.createBlock('Source');
let rect4 = canvas.createBlock('Alert');
let rect5 = canvas.createBlock('Sum');
let rect6 = canvas.createBlock('Source');
let rect7 = canvas.createBlock('Source');

rect6.behavior = function() {
  return [4];
};

rect7.behavior = function() {
  return [2];
};

rect5.behavior = function(findById) {
  console.log(findById);
  var val1 = (this._ports['in'][0]._conn[0]);
  var val2 = (this._ports['in'][1]._conn[0]);
  var brick = findById(val1.brick);
  var data = brick.behavior()[val2.id];
  brick = findById(val2.brick);
  data += brick.behavior()[val2.id];

  return [data];
};

rect3.x = 330; rect3.y = 100;
rect2.x = 330; rect2.y = 200;
rect.x = 130; rect.y = 230;
rect4.x = 130; rect4.y = 300;

rect.behavior = function() {
  alert('hello');
  return 0;
};

rect2.behavior = function() {
  alert('world');
  return 0;
};

rect3.behavior = function() {
  return ["FODA-SE"];
};

rect4.behavior = function(findById) {
  var conn = (this._ports['in'][0]._conn[0]);
  console.log(conn);
  var brick = findById(conn.brick);
  var data = brick.behavior(findById)[conn.id];
  alert(data);
};

canvas.addObj(rect);
// canvas.addObj(rect2);
// canvas.addObj(rect3);
canvas.addObj(rect4);
canvas.addObj(rect5);
canvas.addObj(rect6);
canvas.addObj(rect7);

console.log(canvas);


document.getElementById('run').onclick = function() {
  canvas.run();
};
