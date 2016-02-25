import createElement from './utils.js';

// function SVGBuilder({ strokeWidth, marginLeft, width, opacity, height, rx, ry, fill, stroke, ...rest }) {
export default function blockBuilder({ strokeWidth, marginLeft, width, opacity, height, rx, ry, fill, stroke, title }) {
// { strokeWidth = 3, marginLeft = 10, width = 150, opacity = 1, height = 50, rx = 20, ry = 20, fill = '#1F8244', stroke = '#000000' }
    strokeWidth = strokeWidth || 3;
    marginLeft = marginLeft || 10;
    width = width || 150;
    opacity = opacity || 1;
    height = height || 50;
    rx = rx || 20;
    ry = ry || 20;
    fill = fill || '#1F8244';
    stroke = '#000000';

    var svg = createElement('svg');

    var attrs = {
      x: marginLeft + strokeWidth/2,
      y: strokeWidth/2,
      width,
      height,
      rx,
      ry,
      'stroke-width': strokeWidth,
      style: 'fill: ' + fill + '; stroke: ' + stroke + '; opacity: ' + opacity,
      id: 'main'
    };

    var rect = createElement('rect', attrs);
    rect.type = 'block';
    var text = createElement('text', { x: 25, y: 30, style: 'cursor: default' });
    text.type = 'title';
    var txtNode = document.createTextNode(title);
    text.appendChild(txtNode);

    svg.appendChild(rect);
    svg.appendChild(text);
    return svg;
}


blockBuilder.prototype = {

};

      let test = {
  fill: '#31dfaf',
  border: '#e695bf',
  ports: { data_in: 0, data_out: 0, flow_in: 1, flow_out: 1 },
  title: 'Test Block',
  icon: 'img/icon.png',
  gui: [
    { type: 'select', options: ['USA', 'BR', 'CND'] },
    { type: 'text' },
    { type: 'number' }
  ],

};
