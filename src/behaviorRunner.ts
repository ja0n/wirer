import _find from 'lodash/find';
import _get from 'lodash/get';
import Sticky from './Sticky';

export default async function* behaviorRunner (instance: Sticky, context?: Record<any, any>) {
  let flow, nextNodeId, refNode;
  let node = _find(instance._objects, { _refNode: 'start' });

  if (!node) {
    console.warn('Start node not found');
    return false;
  }

  console.debug('Start node found:', node);

  // flow = start.behavior();
  // an ActuatorBrick should return the flow_out port id
  // it'll be useful for if node
  const getNode = (...args) => instance.getNode(...args);

  let step = 0;
  do {
    refNode = instance.nodeRefs[node._refNode] || instance._refNodes[node._refNode];
    flow = await refNode.behavior.call(node, getNode, { ...context });
    nextNodeId = _get(node._ports, ['flow_out', flow, 'connections', 0, 'nodeId'], null);
    node = getNode(nextNodeId);
    console.debug('Step', ++step, refNode);
    console.debug('Next Step', flow, node);
    yield node
  } while (node);
}