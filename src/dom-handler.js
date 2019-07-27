import { getParentSvg } from './utils.js';
import _throttle from 'lodash/throttle';
import { sumPoints, minusPoints, multiplyPoints, dividePoints } from './points';

export function register () {
  const store = {};
  const svg = this._svg;

  const normalizeEvent = e => {
    if (e.x == undefined) e.x = e.clientX;
    if (e.y == undefined) e.y = e.clientY;
  };

  // DOM Events
  svg.addEventListener('mousedown', e => {
    normalizeEvent(e);
    this.lastSelected = null;
    const { target } = e;

    if (target.type === 'container') {
      this.dragging = target;
      // const { x, y } = sumPoints(e, 0);
      const { x, y } = dividePoints(e, this.zoom);
      // this._aux.mouseDown = { x, y, offset: dividePoints(this.offset, this.zoom)};
      this._aux.mouseDown = { x, y, offset: { ...this.offset } };
      return ;
    }

    if (target.type === 'wire') {
      this.lastSelected = target.wrapper;
      return this.selectedWire = target.wrapper;
    }

    if (target.type === 'port' && target.direction === 'out') {
      return this.startAttach(target);
    }

    const parentSvg = getParentSvg(target);
    const shouldCapture = tagName => !['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(tagName);
    if (shouldCapture(target.tagName) && parentSvg && parentSvg.type == 'node') {
      const nodeNode = parentSvg;
      console.debug('Node selected:', nodeNode, 'Triggered by: ', target);
      var wrapper = nodeNode.wrapper;
      this.lastSelected = wrapper;
      this.dragging = nodeNode;
      var SVGbox = wrapper._svg.getBoundingClientRect();
      const mouse = dividePoints(e, this.zoom);
      const offset = minusPoints(mouse, [SVGbox.left, SVGbox.top]);
      this._aux.mouseDown = {
        wrapper: sumPoints(wrapper, 1),
        barePos: sumPoints(e, 1),
        mouse,
        x: offset.x - wrapper.x,
        y: offset.y - wrapper.y,
      };
      this._svg.appendChild(this.dragging);
      wrapper.wires.forEach(wire => this._svg.appendChild(wire._el));
    }

  }, false);

  document.addEventListener('keydown', e => {
    if (e.keyCode == 46) {
      console.debug('deleting', this.lastSelected);
      this.lastSelected.delete();
      // @TODO should remove from state (brick, wire, port)
    }
  }, false);

  svg.addEventListener('mouseup', e => {
    this.dragging = null;
    if(e.target.type === 'port')
      return this.endAttach(e.target);

    if(this.isState('attaching')) {
      this.setState(null)
      svg.removeChild(this._aux['wire']._el);
    }
  });



  const forceUpdate = _throttle(() => {
    if (this.react)
      this.react.forceUpdate();
  }, 1);

  svg.addEventListener('mousemove', e => {
    normalizeEvent(e);
    const { dragging, zoom } = this;

    if (this.attachMove(e)) return false;

    if (dragging && dragging.type == 'container') {
      const firstState = this._aux.mouseDown;
      this.offset = sumPoints(firstState.offset, minusPoints(dividePoints(e, zoom), firstState));
      console.debug('offset', this.offset);
      forceUpdate();
      return true;
    }


    if (dragging) {
      const wrapper = this.dragging.wrapper;
      const firstState = this._aux.mouseDown;
      const mouse = dividePoints(e, this.zoom);
      const dtMouse = minusPoints(e, firstState.barePos);
      const { x, y } = sumPoints(firstState.wrapper, dtMouse);
      wrapper.x = x;
      wrapper.y = y;
      wrapper.updateWires(this.offset);

      forceUpdate();
      return true;
    }
  });

  const zoomVelocity = 0.1;
  window.addEventListener("wheel", event => {
    if (this.dragging) return false;

    const delta = Math.sign(event.deltaY);
    console.info('MouseWheel delta', delta);
    this.zoom -= zoomVelocity * delta;
    // svg.style.transform = `scale(${this.zoom})`;
    if (this.react)
      this.react.forceUpdate();


    event.stopPropagation();
    event.preventDefault();
    return false;
  });

  return store;
}
