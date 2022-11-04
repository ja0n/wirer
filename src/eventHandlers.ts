import BaseWire from './BaseWire';
import Node from './Node';
import Render from './Render';
import { TargetElement } from './types';
import { getParentSvg, inIframe } from './utils/dom';
import { _p } from './utils/points';

const normalizeEvent = (event: MouseEvent) => {
  // @ts-ignore
  if (event.x == undefined) event.x = event.clientX;
  // @ts-ignore
  if (event.y == undefined) event.y = event.clientY;
};

export function registerEvents (this: Render) {
  const store = {};
  const svg = this._svg;

  // register DOM Events
  svg.addEventListener('mousedown', onMouseDown.bind(this), false);
  svg.addEventListener('mouseup', onMouseUp.bind(this));
  svg.addEventListener('mousemove', onMouseMove.bind(this));
  window.addEventListener('wheel', onMouseWheel.bind(this));
  document.addEventListener('keydown', onKeyDown.bind(this), false);

  return store;
}


function onMouseDown (this: Render, event: MouseEvent) {
  console.debug(`Render - mouseDown - inIframe: ${inIframe()}`);
  normalizeEvent(event);
  this.lastSelected = null;

  let target = event.target as TargetElement;
  const mouse = event;

  if (target.type === 'container') {
    this.dragging = target;
    const { x, y } = _p.divide(mouse, this.zoom);
    // save first click event position
    this._aux.mouseDown = { x, y, offset: { ...this.offset } };
    this.lastSelected = null;
    this.throttleUpdate();
    return null;
  }

  if (target.classList.value.includes('leader-line')) {
    target = getParentSvg(target);
  }

  if (target.type === 'wire') {
    console.debug('Wire selected:', target.wrapper, 'Triggered by: ', target);
    this.lastSelected = target.wrapper;
    this.throttleUpdate();
    return null;
  }

  if (target.type === 'port') {
    this.startAttach(target);

    const { wire } = this._aux;
    const SVGbox = this._svg.getBoundingClientRect();
    const vMouse = _p.subtract(mouse, [SVGbox.left, SVGbox.top]);
    wire.addControlPoints(vMouse);
    this.throttleUpdate();

    return true;
  }

  const captureList = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'];
  const shouldCapture = tagName => !captureList.includes(tagName);
  const parentSvg = getParentSvg(target);
  const isNode = shouldCapture(target.tagName) && parentSvg && parentSvg.type == 'node';

  if (isNode) {
    if (this.disableDragging)
      return true;

    const node = parentSvg;
    console.debug('Node selected:', node, 'Triggered by: ', target);
    const wrapper = node.wrapper;
    this.lastSelected = wrapper;
    this.dragging = node;
    const SVGbox = wrapper._svg.getBoundingClientRect();
    const mouse = _p.divide(event, this.zoom);
    const offset = _p.subtract(mouse, [SVGbox.left, SVGbox.top]);
    this._aux.mouseDown = {
      wrapper: _p.add(wrapper, 1),
      barePos: _p.add(event, 1),
      mouse,
      x: offset.x - wrapper.x,
      y: offset.y - wrapper.y,
    };
    this._svg.appendChild(this.dragging);

    wrapper.wires.forEach(
      wire => wire._el && this._svg.appendChild(wire._el)
    );
    this.throttleUpdate();
  }
}

function onMouseUp (this: Render, event: MouseEvent) {
  let target = event.target as TargetElement;

  this.dragging = null;

  if (this.isState('attaching')) {
    if (target.type === 'port') {
      this.endAttach(target);
    } else {
      this._aux['wire'] = null;
      this.setState(null)
    }
    this.throttleUpdate();
  }
}

function onMouseMove (this: Render, event: MouseEvent) {
  normalizeEvent(event);

  const { dragging, zoom } = this;
  const mouse = event;

  if (this.isState('attaching')) {
    const { wire } = this._aux;
    const SVGbox = this._svg.getBoundingClientRect();

    if (this.internalRender) {
      // offset the wire away so we can detect the event on port
      // this is due the wire is rendered on top of node
      const padding = wire._inverted ? 4 : -4;
      const vMouse = _p.add(_p.subtract(mouse, [SVGbox.left, SVGbox.top]), padding);
      wire.setTarget(vMouse);
      this.throttleUpdate();
    } else {
      const vMouse =_p.subtract(mouse, [SVGbox.left, SVGbox.top]);

      if (wire._el && wire._el['leaderLine']) {
        wire.setTarget(vMouse);
      }

      this.throttleUpdate();
    }

    return true;
  }

  if (dragging && dragging.type == 'container') {
    const firstState = this._aux.mouseDown;
    this.offset = _p.add(firstState.offset, _p.subtract(_p.divide(event, zoom), firstState));
    console.debug('Updating offset', this.offset);
    this.throttleUpdate();
    return true;
  }

  if (dragging && dragging.wrapper instanceof Node) {
    const wrapper = dragging.wrapper;
    const firstState = this._aux.mouseDown;
    const mouse = _p.divide(event, this.zoom);
    const dtMouse = _p.subtract(event, firstState.barePos);
    const { x, y } = _p.add(firstState.wrapper, _p.divide(dtMouse, zoom));
    wrapper.x = x;
    wrapper.y = y;

    this.throttleUpdate();
    return true;
  }
}

const zoomVelocity = 0.05;
function onMouseWheel (this: Render, event: WheelEvent) {
  if (this.disableZoom && this.dragging)
    return false;

  if (this._aux.lastZoomTime === null)
    this._aux.lastZoomTime = Date.now();

  const delta = Math.sign(event.deltaY);
  const zoomDt = (zoomVelocity * delta);
  this.setZoom(_p.clamp(0.3, (this.zoom - zoomDt), 3));
  // svg.style.transform = `scale(${this.zoom})`;
  console.info('MouseWheel - zoomDt', zoomDt);
  console.info('MouseWheel - zoom', this.zoom);

  this.forceUpdate();
  this._aux.lastZoomTime = Date.now();
  return false;
}

function onKeyDown (this: Render, event: KeyboardEvent) {
  if (event.keyCode === 46 || event.code === 'Delete') {
    console.debug('Keydown - deleting', this.lastSelected);

    // @TODO should remove from state (node, wire, port)
    if (this.lastSelected instanceof Node) {
      this.config.wrapper.removeNode(this.lastSelected, true);
      // avoid forceUpdate and renew wrapper.nodes array instead
      this.forceUpdate();
    }
    if (this.lastSelected instanceof BaseWire) {
      this.removeWire(this.lastSelected);
      this.forceUpdate();
    }
  }
}