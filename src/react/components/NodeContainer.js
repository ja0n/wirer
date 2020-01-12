import React from 'react';
import SVGContainer from './SVGContainer';
import { _p } from '../../points';
import { get } from 'lodash';

const reduceMax = (key) => (max, obj) => {
  const currentValue = get(obj, key);
  return currentValue > max ? currentValue : max;
}
class NodeContainer extends React.Component {
  componentDidUpdate () {
    this.updateDimensions();
  }

  updateDimensions () {
    if (!this.ref)
      return null;

    const { node, zoom } = this.props;
    const childList = [...this.ref.childNodes];
    node.cfg.width = childList.reduce(reduceMax('offsetWidth'), 0);
    node.cfg.height = childList.reduce(reduceMax('offsetHeight'), 0);
    this.ref.style.width = node.cfg.width;
    this.ref.style.height = node.cfg.height;
    this.ref.style.transform = `scale(${zoom})`;
    this.ref.setAttribute('width', node.cfg.width);
    this.ref.setAttribute('height', node.cfg.height);
  }

  render () {
    const { node, width, height, zoom, offset } = this.props;
    const { x, y } = _p.multiply(_p.add(node, offset), zoom);
    const zOffset = _p.multiply(offset, 1);
    const style = {
      transform: `scale(${zoom})`,
      width: Math.max(node.cfg.width || width, 60),
      height: Math.max(node.cfg.height || height, 60),
    }

    return (
      <SVGContainer wrapper={node} x={x} y={y} offset={zOffset} zoom={zoom}
        onComponentUpdate={() => this.updateDimensions()}
      >
        <foreignObject
          ref={ref => this.ref = ref}
          className="sticky-node-html"
          style={style}
          width={style.width}
          height={style.height}
        >
          {this.props.children}
        </foreignObject>
      </SVGContainer>
    );
  }
}

export default NodeContainer;
