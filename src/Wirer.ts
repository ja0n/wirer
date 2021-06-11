import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _find from 'lodash/find';

import Node from './Node';
import Render from './Render';
import BaseWire from './BaseWire';
import standardNodes from './nodes/standard';
import behaviorRunner from './behaviorRunner';
import { toJSON } from './jsonLoader';

export default class Wirer {
  static _refNodes: {};
  _uid: number;
  _objects: Node[];
  _wires: BaseWire[];
  nodeRefs: {};
  render: Render;

  constructor({ width, height } = { width: 800, height: 600 }) {
    this._uid = 0;
    this.nodeRefs = {};
    this._objects = [];
    this._wires = [];

    this.render = new Render({ width, height, wrapper: this });
    this.clearCanvas();

    return this;
  }

  get nodes() {
    return this._objects;
  }

  addNodes(nodes: Node[]) {
    for (let node of nodes) {
      // TODO: use uuid4
      if (node._id == null)
        node._id = (this._uid++).toString();
      // this._objects = [...this._objects, node];
      this._objects.push(node);
    }

    if (this.render.react)
      this.render.react.forceUpdate();
  }

  addNode(node: Node) {
    this.addNodes([node]);
  }

  removeNode(node: Node, update?: boolean) {
    let index = this._objects.indexOf(node);

    if (index == -1) return;

    for (let wire of [...node.wires]) {
      this.render.removeWire(wire);
    }

    if (update) {
      const removed = this._objects.splice(index, 1)[0];
      this.render.throttleUpdate();
      return removed;
    }
  }

  addStartNode () {
    const startNode = this.createNode('start');
    startNode.x = 30; startNode.y = 30;
    startNode.behavior = () => 0;
    this.addNode(startNode);
  }

  clearCanvas (start = true) {
    this._objects.forEach(node => this.removeNode(node, false));
    this._objects = [];
    this._wires = [];

    if (start)
      this.addStartNode();

    this.render.forceUpdate();
  }

  static _formatNodeRef (name, cfg) {
    // TODO(ja0n); split behavior to a middleware architecture
    const behavior = typeof(cfg.behavior) !== 'function'
      ? new Function('getNode', cfg.behavior)
      : cfg.behavior;

    return {
      ...cfg,
      id: name,
      behavior,
    };
  }

  registerNode(name, cfg) {
    this.nodeRefs[name] = Wirer._formatNodeRef(name, cfg);
  }

  static registerNode(name, cfg) {
    this._refNodes[name] = this._formatNodeRef(name, cfg);
  }

  getNodeRef (name) {
    return this.nodeRefs[name] || Wirer._refNodes[name];
  }

  createNode(name, data = {}) {
    const cfg = this.getNodeRef(name);

    if (!cfg)
      throw `Node '${name}' not registered`;

    return new Node({ ...cfg, ...data });
  }

  static createNode(name, data = {}) {
    const cfg = this._refNodes[name];

    if (!cfg)
      throw "Node not registered";

    return new Node({ ...cfg, ...data });
  }

  getNode (id: string) {
    if (_isNil(id))
      return null;
    return this._objects.find(node => node._id == id);
  }

  loadPorts (nodey, ports, [from, to]) {
    ports.forEach((port, index) => {
      for (let conn of port) {
        // TODO: Fix 'node' and 'nodeId' difference
        const nodey2 = this.getNode(conn.node || conn.nodeId);
        const cps = [
          nodey._ports[from][index],
          nodey2._ports[to][conn.id],
        ];
        // TODO: sealOrDiscard should be defined here
        this.render.sealOrDiscard(...cps)
      }
    });
  }

  toJSON () {
    // FIXME: export both internal _refNodes and instance nodeRefs
    return toJSON(this._objects, Wirer._refNodes);
  }

  loadJSON (data) {
    this.clearCanvas(false);

    for (let node of data) {
      const { refNode, inputs, x, y, value, id } = node;
      const instance = this.createNode(refNode, { inputs });
      instance._id = id;
      instance.x = x;
      instance.y = y;
      // instance.value = value;
      this.addNode(instance);
    }

    // loop again to load wires
    for (let node of data) {
      const instance = this.getNode(node.id);
      this.loadPorts(instance, node.ports.out, ['out', 'in']);
      this.loadPorts(instance, node.ports.flow_out, ['flow_out', 'flow_in']);
    }
  }

  reload () {
    const flow = this.toJSON().fluxgram;
    this.loadJSON(flow);
  }

  async run (context) {
    const runner = behaviorRunner(this, context)
    let result = await runner.next();

    while (!result.done) {
      result = await runner.next();
    }

    return result.value;
  }

  __compile () {
    // TODO(ja0n): a fancy method name huh
  }
}

Wirer._refNodes = standardNodes || {};
