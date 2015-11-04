function blockBuilder() {

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
