var canvas = new Sticky.default('test', { width: 1200, height: 800 });

const initialNodes = ['SourceNumber', 'SourceNumber', 'Alert', 'Sum', 'Operation', 'Operation', 'If', 'SourceString'];

const getRandom = (min, max) => min + (Math.random() * (max - min));

const nodes = initialNodes.map(nodeName => {
  const x = getRandom(200, 800);
  const y = getRandom(200, 600);
  return canvas.createNode(nodeName, { x, y });
});

canvas.addNodes(nodes);

document.getElementById('run').onclick = function() {
  canvas.run();
};

function loadExample (event) {
  canvas.loadJSON(flowsJSON[event.target.dataset.index]);
};

for (let button of document.getElementsByClassName('load')) {
  button.addEventListener('click', loadExample);
}