export const toJSON = (nodes, nodeRefs) => {
  const fluxgram = nodes.map(node => {
    let object = {
      refNode: node._refNode,
      inputs: node.inputs,
      id: node._id,
      x: node.x,
      y: node.y,
      ports: {} // flow_in, flow_out, in, out
    };

    for (let type in node._ports) {
      console.debug('to JSON - ', type, node._ports[type]);
      object.ports[type] = node._ports[type].map(port => [...port.connections]);
    }

    return object;
  });


  let refNode = Object.entries(nodeRefs).map(
    ([nodeId, node]) => ({
      ...node,
      behavior: node.behavior.toString(),
    })
  );

  const string = JSON.stringify({ refNode, fluxgram }, null, 2);
  return JSON.parse(string);
} 