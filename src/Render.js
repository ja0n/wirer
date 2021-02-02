import React from 'react';
import ReactDOM from 'react-dom';

import Wire from './Wire';
import { createElement } from './utils/dom';
import { registerEvents } from './domEventHandlers'
import { NodeGraph } from './react/components';
import { _p } from './utils/points';

const defaultConfig = { width: 800, height: 600 };

export default class Render {
  constructor (id, config) {
    this.config = { ...defaultConfig, ...config };
    this._aux = {};
    this._state = null;
    this._wires = [];
    this.offset = { x: 0, y: 0 };
    this.zoom = 1;
    this.disableZoom = false;
    this.disableDragging = false;
    this.internalRender = true;

    const element = document.getElementById(id);
    if (element) {
      this.reactDOM(element);
    }

    this._p = _p;

    return this;
  }

  getConnections () {
    const connections = [...this._wires];
    const { wire } = this._aux;

    // float connection
    if (wire)
      connections.push(wire);

    return connections
  }

  registerEvents () {
    registerEvents.call(this);
  }

  reactDOM (element) {
    const { wrapper, Component } = this.config;
    const svg = createElement('svg', { class: 'svg-content', preserveAspectRatio: "xMidYMid meet" });
    this.loadContainer(svg);

    element.classList.add('sticky__canvas');
    element.appendChild(this._svg);

    ReactDOM.render(
      <NodeGraph
        ref={ref => { this.react = ref }}
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
    const controlPoints = [port.wrapper];
    const wire = new Wire({ controlPoints, render: this });
    wire._inverted = port.wrapper.direction === 'in';
    this.setState('attaching');
    this._aux['wire'] = wire;

    if (this.internalRender) {
      this.addElement(wire._el);
    }
  }

  endAttach (port) {
    if (this.isState('attaching')) {
      this.setState(null);
      const { wire } = this._aux;
      wire.setTarget(port.wrapper);
      const success = this.addWire(wire);

      if (!success && this.internalRender) {
        this.removeElement(this._aux['wire']._el);
      }

      this._aux['wire'] = null;
    }
  }

  addWire (wire) {
    if (!wire.seal()) {
      return false;
    }

    wire.render(this.offset, this.zoom);
    this._wires = [...this._wires, wire];
    this.forceUpdate();
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
    });
    this.forceUpdate();
  }

  renderGrid (offset, zoom = 1) {
    const zOffset = _p.multiply(offset, zoom);
    const lineWidthPx = `${parseInt(_p.clamp(1, 1 * zoom, 10))}px`;
    this._svg.style.backgroundPositionX = `${zOffset.x}px`;
    this._svg.style.backgroundPositionY = `${zOffset.y}px`;
    this._svg.style.backgroundSize = `${50 * zoom}px ${50 * zoom}px`;
    this._svg.style.backgroundImage = `
      linear-gradient(to right, grey ${lineWidthPx}, transparent ${lineWidthPx}), linear-gradient(to bottom, grey ${lineWidthPx}, transparent ${lineWidthPx})
    `;
    console.info('rengerGrid - lineWidthPx', lineWidthPx);
  }

  sealOrDiscard (...controlPoints) {
    const wire = new Wire({ controlPoints, render: this });

    if (this.addWire(wire))
      return wire;

    this.forceUpdate();

    return null;
  }

  setState (state) {
    return this._state = state;
  }

  isState (state) {
    return this._state === state;
  }

  getCanvasSize () {
    const { width, height } = this.config;
    return _p.multiply([width, height], 1);
  }

  getCenterPoint () {
    const vOffset = _p.multiply(this.offset, this.zoom);
    const vCanvasSize = _p.multiply(this.getCanvasSize(), 1);
    const value = _p.subtract(
      _p.divide(vCanvasSize, 2),
      vOffset,
    );
    return _p.divide(value, this.zoom);
  }

  setCenterPoint (point) {
    const vPoint = _p.multiply(point, -1 * this.zoom);
    const vCanvasSize = _p.multiply(this.getCanvasSize(), 1);
    this.offset = _p.add(
      _p.divide(vCanvasSize, 2),
      vPoint,
    );
    this.offset = _p.divide(this.offset, this.zoom);
    this.forceUpdate();
  }

  forceUpdate () {
    if (this.react)
      this.react.forceUpdate();

    if (this._svg)
      this.renderGrid(this.offset, this.zoom);
  }

  setZoom (value) {
    const cameraTarget = this.getCenterPoint();
    this.zoom = value;
    this.setCenterPoint(cameraTarget);
    this.forceUpdate();
  }

  setOffset (point) {
    this.offset = point;
    this.forceUpdate();
  }
}
