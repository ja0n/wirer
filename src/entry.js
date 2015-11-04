import Sticky from './Sticky.js';
import Brick2 from './Brick2.js';

var canvas = new Sticky('test');

canvas.registerBlock('Source', {
  fill: '#4fec2f',
  ports: { data_in: 0, data_out: 1, flow_in: 0, flow_out: 0 },
  title: 'Actuator Block'
});

canvas.registerBlock('Actuator', {
  fill: '#673A7E',
  ports: { data_in: 0, data_out: 0, flow_in: 1, flow_out: 1 },
  title: 'Actuator Block'
});

canvas.registerBlock('Alert', {
  fill: '#EC962F',
  ports: { data_in: 1, data_out: 0, flow_in: 1, flow_out: 1 },
  title: 'Actuator Block'
});


let rect = canvas.createBlock('Actuator');
let rect2 = canvas.createBlock('Actuator');
let rect3 = canvas.createBlock('Source');
let rect4 = canvas.createBlock('Alert');

rect3.x = 330; rect3.y = 100;
rect2.x = 330; rect2.y = 200;
rect.x = 130; rect.y = 230;

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
  var data = brick.behavior()[conn.id];
  alert(data);
};
canvas.addObj(rect);
canvas.addObj(rect2);
canvas.addObj(rect3);
canvas.addObj(rect4);

console.log(canvas);


document.getElementById('run').onclick = function() {
  canvas.run();
};
