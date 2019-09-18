import LeaderLine from 'leader-line';
import React from 'react';

export default class Line extends React.Component {
  
  componentDidMount () {
		console.debug('leaderline', window.LeaderLine);
  }
  
  componentWillUnmount () {
    if (this.line)
      this.line.remove();
  }
  
  shouldComponentUpdate () {
		if (!this.line && this.props.start && this.props.end) {
			this.initLine();
			return false;
		}
    window.setTimeout(() => {
      if (this.line) {
        this.line.position();
      }
    }, 0);
    return false;
  }
  
  initLine () {
		const {start, end} = this.props;
    this.line = new LeaderLine({
      start,
      end,
      path: 'magnet',
      dash: true,
    });
  }
  
  render () {
		return <span>debug</span>;
		return null;
  }
}

export const Connections = ({ connections }) => {
	return connections.map(({ sourcePort, targetPort }) => sourcePort && targetPort && (
		<Line start={sourcePort._el} end={targetPort._el} />
	));
}