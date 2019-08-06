var canvas = new Sticky.default('test', { width: 200, height: 200 });

document.getElementById('run').onclick = function() {
  canvas.run();
};

canvas.render.disableDragging = true;
canvas.loadJSON(flowsJSON[0]);

function setZoom (event) {
  const { value } = event.target.dataset;
  canvas.render.zoom = value;
  canvas.render.react.forceUpdate();
};
for (let button of document.getElementsByClassName('load')) {
  button.addEventListener('click', setZoom);
}

canvas.render.setCenterPoint([0, 0]);
// window.setInterval(() => {
//   window.setTimeout(() => canvas.render.setCenterPoint([100, 100]), 2000);
//   window.setTimeout(() => canvas.render.setCenterPoint([-100, -100]), 4000);
//   window.setTimeout(() => canvas.render.setCenterPoint([0, 0]), 6000);
// }, 6000);