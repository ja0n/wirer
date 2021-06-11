import _find from 'lodash/find';
import _get from 'lodash/get';
import Wirer from './Wirer';

async function* behaviorRunner (instance: Wirer, context?: Record<any, any>) {
  let node = _find(instance._objects, { _refNode: 'start' });
  const internalContext = { ...context };

  if (!node) {
    throw new Error('Start node not found')
  }

  console.debug('Start node found:', node);

  const getNode = instance.getNode.bind(instance)

  let step = 0;
  do {
    const refNode = instance.getNodeRef(node._refNode);
    // TODO(ja0n): merge { getNode, context } into one parameter structure
    const nodeBehavior = refNode.behavior.call(node, getNode, internalContext)
    const flowPort = await Promise.resolve(nodeBehavior);
    const nextNodeId = _get(node._ports, ['flow_out', flowPort, 'connections', 0, 'nodeId'], null);
    node = getNode(nextNodeId);
    console.debug('Step', ++step, refNode);
    console.debug('Next Step', flowPort, node);
    yield { node, context };
  } while (node);

  return { context };
}

export default behaviorRunner
