import React from 'react';
import _findIndex from 'lodash/findIndex';
import _times from 'lodash/times';

import { DataPort, FlowPort } from '../../ports.js';
import { _p } from '../../points';

const PortList = ({ wrapper, type, direction, length, zoom }) => (
  <React.Fragment>
    {_times(length, (index) => (
      <Port key={index} id={index} node={wrapper} type={type} direction={direction} zoom={zoom} />
    ))}
  </React.Fragment>
);

const Port = ({ children, node, id, type, direction, zoom }) => {
  // node._ports.{ in: [], out: [], flow_in: [], flow_out: [] };
  const circleProps = { r: 8 * zoom, fill: '#B8D430', stroke: 'black', strokeWidth: 2.5 };

  return (
    <svg style={{ overflow: 'visible' }}>
      <circle
        {...circleProps}
        ref={ ref => setupPort({ ref, node, id, type, direction }) }
      />
    </svg>
  );
};

function setupPort ({ ref, node, id, type, direction }) {
  if (!ref) return null;
  const types = {
    'data': { constructor: DataPort, key: `${direction}` },
    'flow': { constructor: FlowPort, key: `flow_${direction}` },
  };

  if (!types[type])
    throw `Port of type "${type}" not found`;

  const { constructor, key } = types[type];
  const port = new constructor({ id, node, direction, ref });
  const currentIndex = _findIndex(node._ports[key], { id })
  if (currentIndex != -1)
    node._ports[key][currentIndex] = port;
  else
    node._ports[key].push(port);
}

export default PortList;