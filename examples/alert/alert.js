var canvas = new Sticky.default('test', { width: 1200, height: 800 });

const initialBlocks = ['SourceNumber', 'SourceNumber', 'Alert', 'Sum', 'Operation', 'Operation', 'If', 'SourceString'];

const getRandom = (min, max) => min + (Math.random() * (max - min));

const blocks = initialBlocks.map(blockName => {
  const x = getRandom(200, 800);
  const y = getRandom(200, 600);
  return canvas.createBlock(blockName, { x, y });
});

canvas.addNodes(blocks);

document.getElementById('run').onclick = function() {
  canvas.run();
};

function loadExample (event) {
  canvas.loadJSON(flowsJSON[event.target.dataset.index]);
};

for (let button of document.getElementsByClassName('load')) {
  button.addEventListener('click', loadExample);
}