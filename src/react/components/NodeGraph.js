import React from 'react';

import NodeList from './NodeList'

class NodeGraph extends React.Component {
  render() {
    const nodes = this.props.nodes || this.props.getNodes();
    const offset = this.props.offset || this.props.getOffset();
    const zoom = this.props.zoom || this.props.getZoom();

    console.debug('NodeGraph');

    return <NodeList nodes={nodes} offset={offset} zoom={zoom} />
  }
}

export default NodeGraph;
