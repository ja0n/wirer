import LeaderLine from 'leader-line';
import React from 'react';

function shimPointAnchor (point) {
  return point instanceof Element
    ? LeaderLine.pointAnchor( point, { x: 0, y: 0 } )
    : LeaderLine.pointAnchor( document.body, point )
    ;
}

export default class Line extends React.Component {
  componentWillUnmount () {
    if (this.line) {
      const { svg } = this.line.getProps();
      const { parentNode } = svg;

      if (parentNode)
        parentNode.removeChild(svg);

      this.line.remove();
    }
  }

  initLine() {
    const { start, end, options } = this.props;
    const startPoint = shimPointAnchor(start);
    const endPoint = shimPointAnchor(end);

    this.line = new LeaderLine({
      path: 'fluid',
      dash: true,
      ...options,
      start: startPoint,
      end: endPoint,
      disableViewBox: true,
    });

    const { svg } = this.line.getProps();
    const { parentNode } = this.mockSvg;
    svg.leaderLine = this.line;

    if (parentNode)
      parentNode.appendChild(svg);

    if (typeof(this.props.onLoad) === 'function')
      this.props.onLoad(this.line);
  }

  shouldComponentUpdate (nextProps) {
    if (!this.line && this.mockSvg && this.props.start && this.props.end) {
      this.initLine();
      return false;
    }

    if (this.line) {

      if (this.props.start != nextProps.start) {
        this.line.start = shimPointAnchor(nextProps.start);
      }

      if (this.props.end != nextProps.end) {
        this.line.end = shimPointAnchor(nextProps.end);
      }

      this.line.position();
    }

    return false;
  }


  render() {
    return <svg ref={ ref => this.mockSvg = ref } />;
  }
}