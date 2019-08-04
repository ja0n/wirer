import React from 'react';
import SVGContainer from './SVGContainer';
import { _p } from '../../points';

const NodeContainer = ({ children, width, node, zoom, offset }) => {
  const { x, y } = _p.multiply(_p.add(node, offset), zoom);
  const zOffset = _p.multiply(offset, 1);
  const style = {
    transform: `scale(${zoom})`,
    width: Math.max(node.cfg.width || width, 60),
    height: 80,
  }

  return (
    <SVGContainer wrapper={node} title={node.cfg.title} x={x} y={y} offset={zOffset} zoom={zoom}>
      <foreignObject id="main" className="sticky-node-html" width={style.width} height={style.height} style={style}>
        {children}
      </foreignObject>
    </SVGContainer>
  );
}

export default NodeContainer;
