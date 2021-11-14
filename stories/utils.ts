import Wirer from '../src/Wirer';

export const getRandom = (min: number, max: number) => min + (Math.random() * (max - min));

export const randomizeNodes = (nodeNames: string[]) => (canvas: Wirer) => {
  const { width, height } = canvas.render.config;
  const nodes = nodeNames.map(nodeName => {
    return canvas.createNode(nodeName, {
      x: getRandom(100, width - 200),
      y: getRandom(100, height - 200),
    });
  });

  canvas.addNodes(nodes);
}