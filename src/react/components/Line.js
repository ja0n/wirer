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

    if (typeof(this.props.onLoad) === 'function')
      this.props.onLoad(this.line);
  }

  render() {
    return null;
  }
}