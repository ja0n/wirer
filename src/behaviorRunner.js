import _find from 'lodash/find';
import _get from 'lodash/get';

export default function behaviorRunner (instance) {
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
    flow = refNode.behavior.call(node, getNode);
    nextNodeId = _get(node._ports, ['flow_out', flow, 'connections', 0, 'nodeId'], null);
    node = getNode(nextNodeId);
    console.debug('Step', ++step, refNode);
    console.debug('Next Step', flow, node);
  } while (node);
}