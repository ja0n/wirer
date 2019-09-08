import React from 'react';

class SVGContainer extends React.Component {
  shouldComponentUpdate(nextProps) {
    const hasZoomChanged = () => {
      return this.props.zoom !== nextProps.zoom;
    }
    const hasPositionChanged = () => {
      return this.props.x !== nextProps.x || this.props.y !== nextProps.y;
    }

    const hasOffsetChanged = () => {
      if (!this.props.offset || !nextProps.offset) return false;
      return this.props.offset.x !== nextProps.offset.x || this.props.offset.y !== nextProps.offset.y;
    }

    if (!this.ref) return false;

    if (hasPositionChanged()) {
      this.ref.setAttribute('x', nextProps.x);
      this.ref.setAttribute('y', nextProps.y);
      this.onComponentUpdate();
    }

    if (hasPositionChanged() || hasOffsetChanged()) {
      this.props.wrapper.updateWires(nextProps.offset, nextProps.zoom);
      this.onComponentUpdate();
    }

    if (hasZoomChanged()) {
      this.props.wrapper.updateWires(nextProps.offset, nextProps.zoom);
      this.onComponentUpdate();
    }

    return false;
  }

  onComponentUpdate () {
    const { onComponentUpdate } = this.props;

    if (typeof(onComponentUpdate) === 'function') {
      onComponentUpdate(this);
    }
  }

  setupInstance (ref) {
    const { wrapper } = this.props;
    this.ref = ref;

    if (!ref)
      return null;

    ref.style.overflow = 'visible';
    ref.wrapper = wrapper;
    ref.type = 'node';
    wrapper._el = ref;

    if (typeof(this.props.ref) === 'function') {
      return this.props.ref(ref);
    }
  }

  render () {
    const { children, x, y } = this.props;
    return (
      <svg x={x} y={y} ref={ref => this.setupInstance(ref)}>
        {children}
      </svg>
    );
  }
}

export default SVGContainer;
