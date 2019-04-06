import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _find from 'lodash/find';

import Brick from './Brick.js';
import Render from './Render.js';
import defaultBlocks from './blocks.js';
import { toJSON } from './json-loader.js';

import "./styles/default.scss";

export default class Sticky {
  constructor(id, { width, height } = { width: 800, height: 600 }) {
    this._uid = 0;
    this.blocks = {};
    this._objects = [];
    this._wires = [];

    this.render = new Render(id, { width, height });
    this.clearCanvas();
    this.addStartNode();

    return this;
  }

  addObj(obj) {
    if (obj._id == null) obj._id = this._uid++;
    this._objects.push(obj);
    this.render.addElement(obj._el);
  }

  removeObj(obj, update) {
    let index = this._objects.indexOf(obj);
    if (index == -1) return;

    for (let port_type of Object.keys(obj._ports)) {
      if (obj._ports[port_type].length) { // if there's any connection
        for (let port of obj._ports[port_type]) {
          // port.dettach();
        }
      }
    }

    for (let wire of [...obj.wires]) {
      wire.delete();
    }

    this.render.removeElement(obj._el);

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
    const startNode = this.createBlock('start');
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

  registerBlock(name, cfg) {
    this.blocks[name] = this._formatNodeRef(name, cfg);
  }

  static registerBlock(name, cfg) {
    this.prototype._refBlocks[name] = this._formatNodeRef(name, cfg);
  }

  createBlock(name, data = {}) {
    const cfg = this.blocks[name] || this._refBlocks[name];
    if (!cfg) throw `Block '${name}' not registered`;
    return new Brick({ ...cfg, ...data });
  }

  static createBlock(name, data = {}) {
    const cfg = this.prototype._refBlocks[name];
    if (!cfg) throw "Block not registered";
    return new Brick({ ...cfg, ...data });
  }

  getNode (id) {
    if (_isNil(id)) return null;
    return _find(this._objects, { '_id': id });
  }

  toJSON () {
    return toJSON(this._objects, this._refBlocks);
  }

  loadPorts (blocky, ports, [from, to]) {
    ports.forEach((port, index) => {
      for (let conn of port) {
        const blocky2 = this.getNode(conn.brick);
        const cps = [
          blocky._ports[from][index],
          blocky2._ports[to][conn.id],
        ];
        this.render.sealOrDiscard(...cps)
      }
    });
  }

  loadJSON (data) {
    this.clearCanvas(false);

    for (let block of data) {
      const { refBlock, inputs, x, y, value, id } = block;
      const obj = this.createBlock(refBlock, { inputs });
      obj.x = x;
      obj.y = y;
      obj.value = value;
      obj._id = id;
      this.addObj(obj);
    }

    // load wires
    for (let block of data) {
      const blocky = this.getNode(block.id);
      this.loadPorts(blocky, block.ports.out, ['out', 'in']);
      this.loadPorts(blocky, block.ports.flow_out, ['flow_out', 'flow_in']);
    }
  }

  reload () {
    const flow = this.toJSON().fluxgram;
    this.loadJSON(flow);
  }

  run () {
    let flow, id, refBlock;
    let block = _find(this._objects, { _refBlock: 'start' });

    if (!block) {
      console.warn('Start block not found');
      return false;
    }

    console.debug('Start block found:', block);

    // flow = start.behavior();
    // an ActuatorBrick should return the flow_out port id
    // it'll be useful for if block
    const getNode = this.getNode.bind(this);

    let step = 0;
    do {
      refBlock = this.blocks[block._refBlock] || this._refBlocks[block._refBlock];
      flow = refBlock.behavior.call(block, getNode);
      id = _get(block._ports, ['flow_out', flow, '_conn', 0, 'brick'], null);
      block = getNode(id);
      console.debug('Step', ++step, refBlock);
      console.debug('Next Step', flow, block);
    } while(block);
  }

  __compile () {
    // TODO(ja0n): a pretty method name huh
  }
}

Sticky.prototype._refBlocks = defaultBlocks || {};