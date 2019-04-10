import React from 'react';
import { Node, SVGContainer } from './node';
export { default as Container } from './container'

export { Node, SVGContainer };
const deriveProps = node => ({
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

export const NodeList = ({ nodes }) => {
  console.debug("NodeList - nodes prop:", nodes)
  return (
    <React.Fragment>
      {nodes.map(node => (
        <SVGContainer key={node._id} wrapper={node} title={node.cfg.title}>
          <Node {...deriveProps(node)} />
        </SVGContainer>
      ))}
    </React.Fragment>
  );
};

export class NodeGraph extends React.Component {
  render() {
    return <NodeList nodes={this.props.getNodes()} />
  }
}