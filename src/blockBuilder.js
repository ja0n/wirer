import { createElement } from './utils';

// function SVGBuilder({ strokeWidth, marginLeft, width, opacity, height, rx, ry, fill, stroke, ...rest }) {
export default function blockBuilder(wrapper, cfg) {
  const { strokeWidth, marginLeft, width, opacity, height, rx, ry, fill, stroke, title, gui } = cfg;
  // { strokeWidth = 3, marginLeft = 10, width = 150, opacity = 1, height = 50, rx = 20, ry = 20, fill = '#1F8244', stroke = '#000000' }
  var svg = createElement('svg');
  svg.wrapper = wrapper;

  var attrs = {
    x: marginLeft + strokeWidth/2,
    y: strokeWidth/2,
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
  rect.type = 'block';
  var text = createElement('text', { x: 25, y: 30, style: 'cursor: default' });
  text.type = 'title';
  var txtNode = document.createTextNode(title);
  text.appendChild(txtNode);

  svg.appendChild(rect);
  svg.appendChild(text);

  const foreign = createElement('foreignObject', { class: 'sticky-gui', x: 25, y: 40, width: 120 });
  const body = document.createElement('body');
  body.xmlns = 'http://www.w3.org/1999/xhtml';
  // body.style.margin = '0';

  Object.keys(gui).forEach(input => {
    let label;
    const obj = gui[input];
    const _id = v => v;
    const createHandler = (f = _id)  => e => {
      svg.wrapper.inputs[input] = f(e.target.value);
    };

    switch (obj.type) {
      case 'number': {
        label = createLabel(obj.label, obj.type, createHandler(Number));
      } break;
      case 'text': {
        label = createLabel(obj.label, obj.type, createHandler());
      } break;
      case 'select': {
        label = createSelect(obj.label, obj.options, createHandler());
      } break;
    }

    body.appendChild(label);
  });

  foreign.appendChild(body);
  svg.appendChild(foreign);

  return svg;
}

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

const createLabel = (_label, type, onChange) => {
  const label = document.createElement('label');
  const txt = document.createTextNode(`${_label}: `);
  const input = document.createElement('input');
  input.type = type;

  input.addEventListener('change', onChange);
  onChange({ target: input });
  // input.style.width = '100%';

  label.appendChild(txt);
  label.appendChild(input);

  return label;
};

const createSelect = (_label, options, onChange) => {
  const label = document.createElement('label');
  const txt = document.createTextNode(`${_label}: `);
  const select = document.createElement('select');


  options.forEach(value => {
    const option = document.createElement('option');
    option.value = option.text = value;

    select.add(option, null);
  });

  select.addEventListener('change', onChange);
  onChange({ target: select });
  // input.style.width = '100%';

  label.appendChild(txt);
  label.appendChild(select);

  return label;
};
