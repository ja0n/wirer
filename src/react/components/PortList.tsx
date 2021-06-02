import React from 'react';
import _findIndex from 'lodash/findIndex';
import _times from 'lodash/times';
import NodeModel from '../../Node';

import { _p } from '../../utils/points';

const PortList = ({ wrapper, type, direction, length, zoom }) => (
  <React.Fragment>
    {_times(length, (index) => (
      <Port key={index} id={index} node={wrapper} type={type} direction={direction} zoom={zoom} />
    ))}
  </React.Fragment>
);

const Port = ({ node, id, type, direction, zoom }: { node: NodeModel, id: number, type: string, direction: string, zoom: number  }) => {
  const port = node.getPort(`${type === 'flow' ? 'flow_' : ''}${direction}`, id)
  const circleProps = { r: 8 * zoom, fill: port.color, stroke: 'black', strokeWidth: 2.5 };

  return (
    <svg style={{ overflow: 'visible' }}>
      <circle
        {...circleProps}
        ref={ ref => port.setupInstance(ref) }
      />
    </svg>
  );
};

export default PortList;