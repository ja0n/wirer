import React from 'react';
import ReactDOM from 'react-dom';

import { register } from './dom-handler.js'
import Wire from './Wire.js';
import { NodeGraph } from './react/components';

import { createElement } from './utils';

const config = { width: 800, height: 600 };

export default class Render {
  constructor (id, cfg) {
    const { width, height, wrapper } = { ...config, ...cfg };
    this.el = document.getElementById(id);
    this._aux = {};
    this._state = null;
    this._wires = [];

    if (!this.el)
      throw "Couldn't find element :(";

    const svg = createElement('svg', { class: 'svg-content', preserveAspectRatio: "xMidYMid meet" });
    this._svg = svg;
    this.matchViewBox();
    this.setCanvasSize({ width, height });

    this.el.classList.add('sticky__canvas');
    this.el.appendChild(this._svg);

    register.call(this);
    ReactDOM.render(
      <NodeGraph ref={el => this.react = el} getNodes={() => wrapper.nodes} />,
      this._svg
    );

    return this;
  }

  matchViewBox() {
    const { width, height } = this._svg.getBoundingClientRect();

    this._svg.setAttribute('viewBox', `0, 0, ${width} ${height}`);
  }

  setCanvasSize({ width, height }) {
    this._svg.style.width = width;
    this._svg.style.height = height;
    this._svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }


  addElement (el) {
    this._svg.appendChild(el);
  }

  removeElement (el) {
    if (this._svg.contains(el))
      this._svg.removeChild(el);
  }

  startDrag (port) {
    this.setState('attaching');
    this._aux['wire'] = wire;
    this.addElement(wire._el);
  }

  startAttach (port) {
    let wire = new Wire(port.wrapper);
    wire._inverted = port.wrapper.direction === 'in';
    this.setState('attaching');
    this._aux['wire'] = wire;
    this.addElement(wire._el);
  }

  endAttach (port) {
    if (this.isState('attaching')) {
      this.setState(null);
      var wire = this._aux['wire'];
      wire._cp2 = port.wrapper;

      this.addWire(wire);

      delete this._aux['wire'];
    }
  }

  addWire (wire) {
    if (!wire.seal()) {
      this.removeElement(wire._el);
      return false;
    }

    wire.render();
    this._wires.push(wire);
    this.addElement(wire._el);
    return true;
  }

  sealOrDiscard (...cps) {
    const wire = new Wire(...cps);

    if (this.addWire(wire))
      return wire;

    return null;
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