import { getParentSvg } from './utils.js';

const normalizeEvent = e => {
  if (e.x == undefined) e.x = e.clientX;
  if (e.y == undefined) e.y = e.clientY;
};

export function register () {
  const store = {};
  const svg = this._svg;
  // DOM Events
  svg.addEventListener('mousedown', e => {
    normalizeEvent(e);
    this.lastSelected = null;
    const { target } = e;

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
      const offset = {
        x: e.x - SVGbox.left,
        y: e.y - SVGbox.top,
      };
      this._aux.mouseDown = { x: offset.x - wrapper.x, y: offset.y - wrapper.y };
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

  svg.addEventListener('mousemove', e => {
    normalizeEvent(e);

    return this.attachMove(e);
  });

  svg.addEventListener('mousemove', e => {
    normalizeEvent(e);

    if (this.dragging) {
      var wrapper = this.dragging.wrapper;
      var SVGbox = wrapper._svg.getBoundingClientRect();
      var OffsetX = e.x - SVGbox.left;
      var OffsetY =  e.y - SVGbox.top;

      var firstState = this._aux.mouseDown;
      wrapper.x = OffsetX - firstState.x;
      wrapper.y = OffsetY - firstState.y;
      wrapper.updateWires();
    }
  });

  return store;
}