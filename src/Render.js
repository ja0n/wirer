import React from 'react';
import ReactDOM from 'react-dom';

import Wire from './Wire.js';
import { createElement } from './utils';

import { register } from './dom-handler.js'
import { NodeGraph } from './react/components';
import { _p } from './points';

const config = { width: 800, height: 600 };

export default class Render {
  constructor (id, cfg) {
    this.config = { ...config, ...cfg };
    this._aux = {};
    this._state = null;
    this._wires = [];
    this.offset = { x: 0, y: 0 };
    this.zoom = 1;

    const element = document.getElementById(id);
    if (element) {
      this.reactDOM(element);
    }

    return this;
  }

  registerEvents () {
    register.call(this);
  }

  reactDOM (element) {
    const { wrapper, Component } = this.config;
    const svg = createElement('svg', { class: 'svg-content', preserveAspectRatio: "xMidYMid meet" });
    this.loadContainer(svg);

    element.classList.add('sticky__canvas');
    element.appendChild(this._svg);

    ReactDOM.render(
      <NodeGraph
        ref={ref => this.react = ref}
        getNodes={() => wrapper.nodes}
        getOffset={() => this.offset}
        getZoom={() => this.zoom}
       />,
       svg
    );
  }

  loadContainer (svg) {
    const { width, height } = this.config;
    this._svg = svg;
    svg.type = 'container';
    this.matchViewBox();
    this.setCanvasSize({ width, height });
    this.registerEvents();
  }

  matchViewBox() {
    const { width, height } = this._svg.getBoundingClientRect();
    this._svg.setAttribute('viewBox', `0, 0, ${width} ${height}`);
  }

  setCanvasSize({ width, height }) {
    this._svg.style.width = width;
    this._svg.style.height = height;
    this._svg.setAttribute('width', width);
    this._svg.setAttribute('height', height);
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
    this.setState('dragging');
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

    wire.render(this.offset, this.zoom);
    this._wires.push(wire);
    this.addElement(wire._el);
    return true;
  }

  removeWire (wire) {
    const index = this._wires.indexOf(wire);
    if (index == -1) return;
    this._wires.splice(index, 1);
  }

  renderWires () {
    this._wires.forEach(wire => {
      wire.render(this.offset, this.zoom);
    })
  }

  renderGrid (offset, zoom = 1) {
    const zOffset = _p.multiply(offset, zoom);
    this._svg.style.backgroundPositionX = `${zOffset.x}px`;
    this._svg.style.backgroundPositionY = `${zOffset.y}px`;
    this._svg.style.backgroundSize = `${50 * zoom}px ${50 * zoom}px`;
    this._svg.style.backgroundImage = `
      linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px);
    `;

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
      const wire = this._aux['wire'];
      const SVGbox = this._svg.getBoundingClientRect();
      // offset the wire away so we can detect the event on port
      const padding = wire._inverted ? 4 : -4;
      const vMouse = _p.add(_p.subtract(mouse, [SVGbox.left, SVGbox.top]), padding);
      const vOffset = _p.multiply(this.offset, this.zoom);
      const port = wire._cp1.getPoint(this.zoom);

      wire.renderPoints(_p.add(port, vOffset), vMouse, wire._inverted);
      return true;
    }

    mouse.stopPropagation();
    return false;
  }
}