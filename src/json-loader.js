export const toJSON = (nodes, nodeRefs) => {
  const fluxgram = nodes.map(node => {
    let nodeect = {
      refBlock: node._refBlock,
      inputs: node.inputs,
      id: node._id,
      x: node.x,
      y: node.y,
      ports: {} // flow_in, flow_out, in, out
    };

    for (let type in node._ports) {
      console.debug('to JSON - ', type, node._ports[type]);
      nodeect.ports[type] = node._ports[type].map(port => [...port._conn]);
    }

    return nodeect;
  });


  let refBlock = Object.entries(nodeRefs).map(
    ([blockId, block]) => ({
      ...block,
      behavior: block.behavior.toString(),
    })
  );

  const string = JSON.stringify({ refBlock, fluxgram }, null, 2);
  copy(string);
  return JSON.parse(string);
} 