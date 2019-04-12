import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _find from 'lodash/find';

import Brick from './Brick.js';
import Render from './Render.js';
import defaultNodes from './nodeRefs.js';
import { toJSON } from './json-loader.js';

import "./styles/default.scss";

export default class Sticky {
  constructor(id, { width, height } = { width: 800, height: 600 }) {
    this._uid = 0;
    this.nodeRefs = {};
    this._objects = [];
    this._wires = [];

    this.render = new Render(id, { width, height, wrapper: this });
    this.clearCanvas();

    return this;
  }

  get nodes() {
    return this._objects;
  }

  addNodes(nodes) {
    for (let node of nodes) {
      if (node._id == null) node._id = this._uid++;
      // this._objects = [...this._objects, node];
      this._objects.push(node);
    }

    if (this.render.react)
      this.render.react.forceUpdate();
  }

  addObj(obj) {
    this.addNodes([obj]);
  }

  removeObj(obj, update) {
    let index = this._objects.indexOf(obj);
    if (index == -1) return;

    for (let wire of [...obj.wires]) {
      wire.delete();
      this.render.removeWire(wire);
    }

    // TODO(ja0n): should splice wires too
    if (update)
      return this._objects.splice(index, 1);
  }

  clearCanvas (start = true) {
    this._objects.forEach(node => this.removeObj(node, false));
    this._objects = [];
    this._wires = [];

    if (start) this.addStartNode();
  }

  addStartNode () {
    const startNode = this.createNode('start');
    startNode.x = 30; startNode.y = 30;
    startNode.behavior = () => 0;
    this.addObj(startNode);
  }

  _formatNodeRef (name, cfg) {
    return {
      ...cfg,
      id: name,
      behavior: typeof cfg.behavior !== 'function'
        ? new Function('getNode', cfg.behavior)
        : cfg.behavior,
    };
  }

  registerNode(name, cfg) {
    this.nodeRefs[name] = this._formatNodeRef(name, cfg);
  }

  static registerNode(name, cfg) {
    this.prototype._refNodes[name] = this._formatNodeRef(name, cfg);
  }

  createNode(name, data = {}) {
    const cfg = this.nodeRefs[name] || this._refNodes[name];
    if (!cfg) throw `Node '${name}' not registered`;
    return new Brick({ ...cfg, ...data });
  }

  static createNode(name, data = {}) {
    const cfg = this.prototype._refNodes[name];
    if (!cfg) throw "Node not registered";
    return new Brick({ ...cfg, ...data });
  }

  getNode (id) {
    if (_isNil(id)) return null;
    return _find(this._objects, { '_id': id });
  }

  toJSON () {
    return toJSON(this._objects, this._refNodes);
  }

  loadPorts (nodey, ports, [from, to]) {
    ports.forEach((port, index) => {
      for (let conn of port) {
        const nodey2 = this.getNode(conn.brick);
        const cps = [
          nodey._ports[from][index],
          nodey2._ports[to][conn.id],
        ];
        this.render.sealOrDiscard(...cps)
      }
    });
  }

  loadJSON (data) {
    this.clearCanvas(false);

    for (let node of data) {
      const { refNode, inputs, x, y, value, id } = node;
      const obj = this.createNode(refNode, { inputs });
      obj.x = x;
      obj.y = y;
      obj.value = value;
      obj._id = id;
      this.addObj(obj);
    }

    // load wires
    for (let node of data) {
      const nodey = this.getNode(node.id);
      this.loadPorts(nodey, node.ports.out, ['out', 'in']);
      this.loadPorts(nodey, node.ports.flow_out, ['flow_out', 'flow_in']);
    }
  }

  reload () {
    const flow = this.toJSON().fluxgram;
    this.loadJSON(flow);
  }

  run () {
    let flow, id, refNode;
    let node = _find(this._objects, { _refNode: 'start' });

    if (!node) {
      console.warn('Start node not found');
      return false;
    }

    console.debug('Start node found:', node);

    // flow = start.behavior();
    // an ActuatorBrick should return the flow_out port id
    // it'll be useful for if node
    const getNode = this.getNode.bind(this);

    let step = 0;
    do {
      refNode = this.nodeRefs[node._refNode] || this._refNodes[node._refNode];
      flow = refNode.behavior.call(node, getNode);
      id = _get(node._ports, ['flow_out', flow, '_conn', 0, 'brick'], null);
      node = getNode(id);
      console.debug('Step', ++step, refNode);
      console.debug('Next Step', flow, node);
    } while(node);
  }

  __compile () {
    // TODO(ja0n): a pretty method name huh
  }
}

Sticky.prototype._refNodes = defaultNodes || {};