var canvas = new Sticky.default('test', { width: 200, height: 200 });

canvas.render.disableDragging = true;
canvas.loadJSON(flowsJSON[0]);

function setZoom (event) {
  const { value } = event.target.dataset;
  canvas.render.setZoom(value);
};

for (let button of document.getElementsByClassName('zoom')) {
  button.addEventListener('click', setZoom);
}

function setCenter (event) {
  const { value } = event.target.dataset;
  canvas.render.setCenterPoint(canvas.render._p.parse(value));
};
for (let button of document.getElementsByClassName('center')) {
  button.addEventListener('click', setCenter);
}
function setReset () {
  canvas.render.setZoom(1);
  canvas.render.setCenterPoint([0, 0]);
};
for (let button of document.getElementsByClassName('reset')) {
  button.addEventListener('click', setReset);
}

canvas.render.setCenterPoint([0, 0]);