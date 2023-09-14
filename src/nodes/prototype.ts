import { NodeConfig } from '../Node'

export const prototypeMap = {
  'CanvasRenderingContext2D': require('./prototypes/CanvasRenderingContext2D.json'),
}

class InstanceData {
  instanceType: string;
  instance: any;

  constructor (instanceType: string, instance: any) {
    this.instanceType = instanceType;
    this.instance = instance;
  }
}

const instanceOptions = Object.keys(prototypeMap);

const nodeMap: Record<string, NodeConfig> = {
  'getInstance': {
    id: 'getInstance',
    fill: '#F5E867',
    ports: { data_in: 0, data_out: 1, flow_in: 0, flow_out: 0 },
    title: 'getInstance',
    gui: {
      instance: { label: 'instance', type: 'select', options: instanceOptions },
    },
    inputs: {
      'instance': instanceOptions[0],
    },
    behavior (findById, { canvasElement }) {
      const instanceType = this.inputs['instance'];
      if (!this.instance && canvasElement) {
        this.instance = canvasElement.getContext('2d');
      }
      return [new InstanceData(instanceType, this.instance)];
    }
  },
  'actInstance': {
    id: 'actInstance',
    fill: '#FF8D4F',
    ports: { data_in: 1, data_out: 1, flow_in: 1, flow_out: 1 },
    title: 'actInstance',
    gui: {
      method: { label: 'method', type: 'select', options: [] },
    },
    async behavior (findById, context) {
      let instanceData = await this.getPortValue('in', 0, 0, context);
      let instance;

      if (instanceData instanceof InstanceData) {
        instance = instanceData.instance;
      }

      if (!instance) {
        return null;
      }

      const params = [];
      for (let i = 1; i < this._ports.in.length; i++) {
        params.push(await this.getPortValue('in', i));
      }

      let method = this.inputs.method;
      instance[method](...params);
      return 0;
    },
    onInputChange (node, change) {
      let instanceData = node.getPortValueSync('in', 0, 0);

      if (!(instanceData instanceof InstanceData)) {
        return null;
      }

      if (change.id == 'method') {
        const prototype = prototypeMap[instanceData.instanceType].prototype;
        const methodData = prototype[change.value];
        // node.removePorts(node._ports.in.slice(1));
        // node.removePorts(node._ports.out);
        // node._ports.in = node._ports.in.slice(0, 1);
        node._ports.out = []; // disable data output for now

        if (methodData?.type == 'function') {
          const length = methodData.parameters.length;
          node.setupPorts({ type: 'data', direction: 'in', length }, 1);
          node.wirer.render.throttleUpdate();
        }
      }
    },
    onAttach (node, { from, to }) {
      let portIndex = node._ports.in.indexOf(from);

      if (portIndex == -1) {
        portIndex = node._ports.in.indexOf(to);
      }

      // first index is the instance port
      if (portIndex != 0) {
        return null;
      }

      let instanceData = node.getPortValueSync('in', 0, 0);

      if (!(instanceData instanceof InstanceData)) {
        return null;
      }

      const options = Object.keys(prototypeMap[instanceData.instanceType].prototype);
      node.gui = {
        method: { label: 'method', type: 'select', options },
      }

      if (this.inputs['method'] === undefined) {
        this.inputs = options[0];
      }
      this.onInputChange(node, { id: 'method', value: this.inputs['method'] });
    }
  },
};

export default nodeMap;