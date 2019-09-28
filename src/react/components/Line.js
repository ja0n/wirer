import LeaderLine from 'leader-line';
import React from 'react';
export default class Line extends React.Component {
  componentWillUnmount () {
    if (this.line)
      this.line.remove();
  }

  shouldComponentUpdate() {
    if (!this.line && this.mockRef && this.props.start && this.props.end) {
      this.initLine();
      return false;
    }

    if (this.line) {
      this.line.position(false);
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

    const lineEl = this.line.getProps().svg;
    const { parentNode } = this.mockRef;
    parentNode.replaceChild(lineEl, this.mockRef);

    if (typeof(this.props.onLoad) === 'function')
      this.props.onLoad(this.line);
  }

  render() {
    return <svg ref={ ref => this.mockRef = ref } />;
  }
}