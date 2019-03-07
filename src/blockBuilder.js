import { createElement } from './utils';
import { buildForm } from './gui';

const example = {
  fill: '#31dfaf',
  border: '#e695bf',
  ports: { data_in: 0, data_out: 0, flow_in: 1, flow_out: 1 },
  title: 'Example Block',
  icon: 'img/icon.png',
  gui: {
    select: { label: 'Select', type: 'select', options: ['USA', 'BR', 'CND'] },
    text: { label: 'Text', type: 'text' },
    number: { label: 'Number', type: 'number' }
  },
};

export function htmlBlockBuilder (wrapper, cfg) {
  const { width, height, gui, title, fill } = cfg;
  const svg = createElement('svg');
  svg.wrapper = wrapper;
  svg.type = 'block';
  svg.style.overflow = 'visible';
  var attrs = {
    width: Math.max(60, width),
    height: height + Object.keys(gui).length * 25,
    class: 'sticky-block-html',
    id: 'main'
  }
  const foreign = createElement('foreignObject', { ...attrs });
  const body = document.createElement('body');
  body.innerHTML = /*html*/`
    <header>${title}</header>
  `;
  body.style.backgroundColor = fill;
  const section = document.createElement('section');
  const form = buildForm(gui, ({ id, value }) => {
    wrapper.inputs[id] = value;
  });

  section.appendChild(form);
  body.appendChild(section);
  foreign.appendChild(body);
  svg.appendChild(foreign);

  return svg;
}

// function SVGBuilder({ strokeWidth, marginLeft, width, opacity, height, rx, ry, fill, stroke, ...rest }) {
export default function blockBuilder(wrapper, cfg) {
  const { strokeWidth, marginLeft, width, opacity, height, rx, ry, fill, stroke, title, gui } = cfg;
  // { strokeWidth = 3, marginLeft = 10, width = 150, opacity = 1, height = 50, rx = 20, ry = 20, fill = '#1F8244', stroke = '#000000' }
  var svg = createElement('svg');
  svg.wrapper = wrapper;
  svg.type = 'block';
  svg.style.overflow = 'visible';

  var attrs = {
    width,
    height: height + Object.keys(gui).length * 25,
    rx,
    ry,
    'stroke-width': strokeWidth,
    style: `fill: ${fill}; stroke: ${stroke}; opacity: ${opacity};`,
    class: 'sticky-block',
    id: 'main'
  }

  var rect = createElement('rect', attrs);
  var text = createElement('text', { x: 15, y: 30, style: 'cursor: default' });
  var txtNode = document.createTextNode(title);
  text.appendChild(txtNode);

  svg.appendChild(rect);
  svg.appendChild(text);

  const foreign = createElement('foreignObject', { class: 'sticky-gui', x: 15, y: 40 });
  const guiElement = buildForm(gui, ({ id, value }) => {
    svg.wrapper.inputs[id] = value;
  });

  foreign.appendChild(guiElement);
  svg.appendChild(foreign);

  return svg;
}