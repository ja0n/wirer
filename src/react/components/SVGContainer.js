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
    }

    if (hasPositionChanged() || hasOffsetChanged()) {
      this.props.wrapper.updateWires(nextProps.offset, nextProps.zoom);
    }

    if (hasZoomChanged()) {
      this.props.wrapper.updateWires(nextProps.offset, nextProps.zoom);
      return true;
    }

    return false;
  }

  render () {
    const { children, wrapper, x, y, offset } = this.props
    console.debug('SVGContainer rendering', wrapper, offset);

    const setupInstance = ref => {
      this.ref = ref;
      if (!ref) return null;
      ref.wrapper = wrapper;
      ref.type = 'node';
      ref.style.overflow = 'visible';
      wrapper._el = ref;
    }

    return (
      <svg x={x} y={y} ref={setupInstance}>
        {children}
      </svg>
    );
  }
}

export default SVGContainer;
