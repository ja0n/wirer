import React from 'react';
import { Node, NodeContainer } from './node';
export { default as Container } from './container'
export { Node, NodeContainer, Section } from './node';

const deriveProps = (node) => ({
  wrapper: node,
  gui: node.gui,
  inputs: node.inputs,
  values: node.values,
  onChange: node.onChange,
  title: node.cfg.title,
  width: node.cfg.width,
  bgColor: node.cfg.fill,
  ports: node.cfg.ports || {},
});


export const NodeList = ({ nodes, offset, renderNode }) => {
  console.debug("NodeList - nodes prop:", nodes)
  const NodeComponent = renderNode || Node;
  console.debug('NodeList - NodeComponent', NodeComponent);
  return (
    <React.Fragment>
      {nodes.map(node => (
        <NodeContainer key={node._id} node={node} offset={offset}>
          <NodeComponent {...deriveProps(node, offset)} />
        </NodeContainer>
      ))}
    </React.Fragment>
  );
};

NodeList.defaultProps = {
  offset: { x: 0, y: 0 },
}

export class NodeGraph extends React.Component {
  render() {
    console.debug('NodeGraph');
    const nodes = this.props.nodes || this.props.getNodes();
    const offset = this.props.offset || this.props.getOffset();
    return <NodeList nodes={nodes} offset={offset} />
  }
}