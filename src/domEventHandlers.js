import _throttle from 'lodash/throttle';

import Node from './Node';
import { getParentSvg, inIframe } from './utils/dom';
import { _p } from './utils/points';

const normalizeEvent = e => {
  if (e.x == undefined) e.x = e.clientX;
  if (e.y == undefined) e.y = e.clientY;
};

export function registerEvents () {
  const store = {};
  const svg = this._svg;

  // DOM Events
  svg.addEventListener('mousedown', event => {
    console.debug(`Render - mouseDown - inIframe: ${inIframe()}`);
    normalizeEvent(event);
    this.lastSelected = null;

    let { target } = event;
    const mouse = event;

    if (target.type === 'container') {
      this.dragging = target;

      const { x, y } = _p.divide(event, this.zoom);
      this._aux.mouseDown = { x, y, offset: { ...this.offset } };

      // const { x, y } = _p.add(e, 0);
      // this._aux.mouseDown = { x, y, offset: _p.divide(this.offset, this.zoom)};

      return null;
    }

    if (target.classList.value.includes('leader-line')) {
      target = getParentSvg(target);
    }

    if (target.type === 'wire') {
      this.lastSelected = target.wrapper;
      this.selectedWire = target.wrapper;

      return null;
    }

    if (target.type === 'port') {
      this.startAttach(target);

      const { wire } = this._aux;
      const SVGbox = this._svg.getBoundingClientRect();
      const vMouse = _p.subtract(mouse, [SVGbox.left, SVGbox.top]);
      wire.addControlPoints(vMouse);
      forceUpdate();

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
    }

  }, false);

  svg.addEventListener('mouseup', event => {
    let { target } = event;

    this.dragging = null;

    if (this.isState('attaching')) {
      if (target.type === 'port') {
        this.endAttach(target);
      } else {
        if (this.internalRender) {
          this.removeElement(this._aux['wire']._el);
        }

        this.setState(null)
        this._aux['wire'] = null;
      }
    }

    forceUpdate();
  });

  const forceUpdate = _throttle(() => {
    if (this.react)
      this.react.forceUpdate(() => this.renderWires());
  }, 1);

  svg.addEventListener('mousemove', e => {
    normalizeEvent(e);

    const { dragging, zoom } = this;
    const mouse = e;

    if (this.isState('attaching')) {
      const { wire } = this._aux;
      const SVGbox = this._svg.getBoundingClientRect();

      if (this.internalRender) {
        // offset the wire away so we can detect the event on port
        const padding = wire._inverted ? 4 : -4;
        const vMouse = _p.add(_p.subtract(mouse, [SVGbox.left, SVGbox.top]), padding);
        const vOffset = _p.multiply(this.offset, this.zoom);
        const port = wire.getControlPoints()[0].getPoint(this.zoom);

        wire.renderPoints(_p.add(port, vOffset), vMouse, wire._inverted);
      }
      else {
        const vMouse =_p.subtract(mouse, [SVGbox.left, SVGbox.top]);

        if (wire._el && wire._el.leaderLine) {
          wire.setTarget(vMouse);
        }

        forceUpdate();
      }

      return true;
    }

    if (dragging && dragging.type == 'container') {
      const firstState = this._aux.mouseDown;
      this.offset = _p.add(firstState.offset, _p.subtract(_p.divide(e, zoom), firstState));
      console.debug('offset', this.offset);
      forceUpdate();
      this.renderGrid(this.offset, zoom);
      return true;
    }


    if (dragging) {
      const wrapper = this.dragging.wrapper;
      const firstState = this._aux.mouseDown;
      const mouse = _p.divide(e, this.zoom);
      const dtMouse = _p.subtract(e, firstState.barePos);
      const { x, y } = _p.add(firstState.wrapper, _p.divide(dtMouse, zoom));
      wrapper.x = x;
      wrapper.y = y;

      forceUpdate();
      return true;
    }
  });

  const zoomVelocity = 0.05;
  let lastTime = null;
  window.addEventListener('wheel', event => {
    if (this.disableZoom && this.dragging)
      return false;

    if (lastTime === null)
      lastTime = Date.now();

    const delta = Math.sign(event.deltaY);
    const zoomDt = (zoomVelocity * delta);
    this.setZoom(_p.clamp(0.3, (this.zoom - zoomDt), 3));
    // svg.style.transform = `scale(${this.zoom})`;
    console.info('MouseWheel - zoomDt', zoomDt);
    console.info('MouseWheel - zoom', this.zoom);

    this.renderGrid(this.offset, this.zoom);
    this.forceUpdate();
    this.renderWires();

    lastTime = Date.now();
    return false;
  });

  document.addEventListener('keydown', e => {
    if (e.keyCode === 46 || e.code === 'Delete') {
      console.debug('Keydown - deleting', this.lastSelected);

      // @TODO should remove from state (node, wire, port)
      if (this.lastSelected instanceof Node) {
        this.config.wrapper.removeNode(this.lastSelected, true);
        // avoid forceUpdate and renew wrapper.nodes array instead
        this.forceUpdate();
      }

      if (this.lastSelected) {
        this.lastSelected.delete();
      }
    }
  }, false);


  return store;
}