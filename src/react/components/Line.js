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
    const { svg } = this.line.getProps();
    const { parentNode } = svg;

    if (parentNode)
      parentNode.replaceChild( this.mockSvg, svg );

    if (this.line)
      this.line.remove();
  }

  initLine() {
    const { start, end } = this.props;
    const startPoint = shimPointAnchor(start);
    const endPoint = shimPointAnchor(end);

    this.line = new LeaderLine({
      start: startPoint,
      end: endPoint,
      path: 'fluid',
      dash: true,
    });

    const { svg } = this.line.getProps();
    const { parentNode } = this.mockSvg;
    svg.leaderLine = this.line;

    if (parentNode)
      parentNode.replaceChild( svg, this.mockSvg );

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

      this.line.position(false);
    }

    return false;
  }


  render() {
    return <svg ref={ ref => this.mockSvg = ref } />;
  }
}