import React from 'react';
import _throttle from 'lodash/throttle';

import BaseWire from './BaseWire';
import Sticky from './Sticky';
import Wire from './Wire';
import { registerEvents } from './eventHandlers'
import { _p } from './utils/points';
import { Offset, Position, TargetElement, TargetWrappers, Zoom } from './types';

const defaultConfig = { width: 800, height: 600 };
export type Config = typeof defaultConfig & { wrapper: Sticky };

type MouseDownContext = Position & { offset?: Offset; wrapper?: Position; barePos?: Position; mouse?: Position; };
type TemporaryContext = { wire?: BaseWire; lastZoomTime?: number; mouseDown?: MouseDownContext; };

// TODO:
// change id argument approach, use 'element' from config
// move reactDom outside
export default class Render {
  _svg: SVGElement & { type?: string };
  zoom: Zoom = 1;
  offset: Offset = { x: 0, y: 0 };
  disableZoom = false;
  disableDragging = false;
  internalRender = true;
  gridSize = 20;
  gridColor = 'grey';
  backgroundColor = '#CCCCCC75';
  config: Config;
  lastSelected?: TargetWrappers;
  dragging?: TargetElement;
  _state: null | string;
  _wires: BaseWire[];
  _aux: TemporaryContext;
  react?: React.Component;

  constructor (config) {
    this.config = { ...defaultConfig, ...config };
    this._aux = {};
    this._state = null;
    this._wires = [];
    this.lastSelected = null;
    this.dragging = null;

    // this._p = _p;

    return this;
  }

  get selectedWire() { 
    return this.lastSelected instanceof BaseWire ? this.lastSelected : null;
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

  loadContainer (svg: SVGElement) {
    const { width, height } = this.config;
    this._svg = svg;
    this._svg.type = 'container';
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
    // this._aux['wire'] = wire;
    // this.addElement(wire._el);
  }

  startAttach (port) {
    const controlPoints = [port.wrapper];
    const wire = new Wire({ controlPoints, render: this });
    wire._inverted = port.wrapper.direction === 'in';
    this.setState('attaching');
    this._aux['wire'] = wire;

    if (this.internalRender) {
      // this.addElement(wire._el);
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

  removeWire (wire: BaseWire) {
    const index = this._wires.indexOf(wire);
    if (index == -1) return null;
    const removed = this._wires.splice(index, 1)[0];
    removed.delete();
    return removed;
  }

  getGridStyle () {
    const { offset, zoom, gridSize, gridColor, backgroundColor } = this;
    const zOffset = _p.multiply(offset, zoom);
    const zGridSize = gridSize * zoom;
    const lineWidth = `${parseInt(_p.clamp(1, 1 * zoom, 10).toString())}px`;

    return {
      backgroundColor,
      backgroundPositionX: `${zOffset.x}px`,
      backgroundPositionY: `${zOffset.y}px`,
      backgroundSize: `${zGridSize}px ${zGridSize}px`,
      backgroundImage: `linear-gradient(to right, ${gridColor} ${lineWidth}, transparent ${lineWidth}), linear-gradient(to bottom, ${gridColor} ${lineWidth}, transparent ${lineWidth})`,
    };
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
  }

  throttleUpdate = _throttle(this.forceUpdate, 1)

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
