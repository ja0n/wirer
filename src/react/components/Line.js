import LeaderLine from 'leader-line';
import React from 'react';
import _get from 'lodash/get';

function shimPointAnchor (point, padding) {
  if (point instanceof Element) {
    if (padding)
      return LeaderLine.pointAnchor( point, padding )
    return point;
  }
  return LeaderLine.pointAnchor( document.body, point );
}

export default class Line extends React.Component {

  static defaultProps = {
    float: false,
  }

  componentWillUnmount () {
    if (this.line) {
      this.line.remove();
      this.line = null;
      this.svg = null;
    }
  }

  setupInstance (ref) {
    if (ref) {
      this.shouldInitLine();
      this.svg = ref;
    } else {
      this.componentWillUnmount();
    }
  }

  shouldComponentUpdate (nextProps) {
    this.shouldInitLine(nextProps);

    if (this.line) {
      if (this.props.start != nextProps.start)
        this.line.start = shimPointAnchor(nextProps.start);

      if (this.props.end != nextProps.end)
        this.line.end = shimPointAnchor(nextProps.end);

      const options = _get(nextProps, 'options', {});
      options['size'] = nextProps.size || 4;
      this.line.setOptions(options);
      this.line.position();

      if (nextProps.float)
        this.svg.parentNode.appendChild(this.svg);
    }

    return false;
  }

  initLine ({ start, end, options }) {
    const startPoint = shimPointAnchor(start);
    const endPoint = shimPointAnchor(end);

    this.line = new LeaderLine({
      path: 'fluid',
      dash: true,
      ...options,
      start: startPoint,
      end: endPoint,
      disableViewBox: true,
      svg: this.svg
    });

    const { svg } = this.line.getProps();
    svg.leaderLine = this.line;
    svg.removeAttribute('viewBox');

    if (typeof(this.props.onLoad) === 'function')
      this.props.onLoad(this.line);
  }

  shouldInitLine (nextProps) {
    if (this.line)
      return false;

    const start = _get(nextProps, 'start', this.props.start);
    const end = _get(nextProps, 'end', this.props.end);
    const options = _get(nextProps, 'options', this.props.options);

    if (this.svg && start && end)
      this.initLine({ start, end, options });

    return true;
  }

  render() {
    return <svg ref={ ref => this.setupInstance(ref) } />;
  }
}

Line.defaultProps = {
  options: {
    path: 'fluid',
    dash: true,
    startSocket: 'right',
    endSocket: 'left',
    disableViewBox: true,
    size: 4,
  },
};
