var canvas = new Sticky.default('test', { width: 1200, height: 800 });

const initialBlocks = ['SourceNumber', 'SourceNumber', 'Alert', 'Sum', 'Comparison', 'Comparison', 'If', 'SourceString'];

const getRandom = (min, max) => min + (Math.random() * (max - min));

const blocks = initialBlocks.map(blockName => {
  const block = canvas.createBlock(blockName);
  block.x = getRandom(200, 800);
  block.y = getRandom(200, 600);
  canvas.addObj(block);
})

document.getElementById('run').onclick = function() {
  canvas.run();
};


function loadExample (event) {
  canvas.clearCanvas(false);
  canvas.loadJSON(flowsJSON[event.target.dataset.index]);
};

for (let button of document.getElementsByClassName('load')) {
  button.addEventListener('click', loadExample);
}