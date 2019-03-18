
const config = { width: 800, height: 600 };

export default class Render () {
  constructor (id, cfg) {
    const { width, height } = { ...config, ...cfg };
    this.el = document.getElementById(id);

    if (!this.el)
      throw "Couldn't find element :(";

    this.el.classList.add('sticky__canvas');

    const svg = Sticky.createElement('svg', { class: 'svg-content', preserveAspectRatio: "xMidYMid meet" });
    this._svg = svg;
    this.el.appendChild(this._svg);
    this.matchViewBox();
  }

  addElement (el) {
    this._svg.appendChild(el);
  }

  removeElement (el) {
    if (this._svg.contains(el))
      this._svg.removeChild(el);
  }

  startAttach (port) {
    let wire = new Wire(port.wrapper);
    wire._inverted = port.wrapper.dir === 'in';
    this.setState('attaching');
    this._aux['wire'] = wire;
    this.addElement(wire._el);
  }

  startDrag (port) {
    this.setState('attaching');
    this._aux['wire'] = wire;
    this.addElement(wire._el);
  }

  endAttach (port) {
    if (this.isState('attaching')) {
      this.setState(null);
      var wire = this._aux['wire'];
      wire._cp2 = port.wrapper;

      if (wire.seal()) {
        wire.render();
        this._wires.push(wire);
      } else {
        this.removeElement(wire._el);
      }
      delete this._aux['wire'];
    }
  }

  setState (state) {
    return this._state = state;
  }

  isState (state) {
    return this._state === state;
  }

  attachMove (mouse) {
    if (this.isState('attaching')) {
      var wire = this._aux['wire'];
      var SVGbox = this._svg.getBoundingClientRect();
      //(below) pixel for removing the wire from the way so we can detect the event on port
      var offset = wire._inverted ? 4 : -4;
      var mouse = { x: mouse.x - SVGbox.left + offset, y: mouse.y - SVGbox.top };
      var port = wire._cp1.getPoint();

      wire._render(port, mouse, wire._inverted);
    }
  }
}