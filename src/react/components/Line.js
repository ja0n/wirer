import LeaderLine from 'leader-line';
import React from 'react';

export default class Line extends React.Component {
  componentWillUnmount () {
    if (this.line)
      this.line.remove();
  }

  shouldComponentUpdate() {
    if (!this.line && this.props.start && this.props.end) {
      this.initLine();
      return false;
    }
    if (this.line) {
      this.line.position();
    }
    return false;
  }

  initLine() {
    const { start, end } = this.props;
    this.line = new LeaderLine({
      start,
      end,
      path: 'fluid',
      dash: true,
    });
  }

  render() {
    return null;
  }
}

export const Connections = ({ connections }) => {
  return connections.map((connection, index) => {
    const [sourcePort, targetPort] = connection.getControlPoints();
    if (sourcePort && targetPort)
      return <Line key={index} start={sourcePort._el} end={targetPort._el} />
    return null;
  })
}