import React from 'react';
import NodeModel from '../../Node';
import Node from './Node';
import NodeContainer from './NodeContainer';

export const NodeList = ({ renderNode, ...props }) => {
  const { nodes, offset, zoom } = props;
  console.debug(`NodeList - customNode: ${renderNode != null}`)
  const NodeComponent = renderNode || Node;

  return (
    <React.Fragment>
      {nodes.map(node => (
        <NodeContainer key={node._id} node={node} offset={offset} zoom={zoom}>
          <NodeComponent {...deriveProps(node)} zoom={zoom} />
        </NodeContainer>
      ))}
    </React.Fragment>
  );
};

NodeList.defaultProps = {
  zoom: 1,
  offset: { x: 0, y: 0 },
}

const deriveProps = (node: NodeModel) => ({
  wrapper: node,
  gui: node.gui,
  inputs: node.inputs,
  // values: node.values,
  onChange: node.onChange,
  title: node.cfg.title,
  width: node.cfg.width,
  bgColor: node.cfg.fill,
  ports: node.cfg.ports || {},
});

export default NodeList;
