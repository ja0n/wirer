import React from 'react';
import Line from './Line';
import _get from 'lodash/get'

import { internalRender } from '../../Render';

const Connections = ({ connections, canvas, onLoad }) => {
  if (internalRender)
    return null;

  return connections.map((wire, index) => {
    const [sourcePort, targetPort] = wire.getControlPoints();
    if (sourcePort && targetPort)
      return (
        <Line
          key={index}
          start={_get(sourcePort, '_el', sourcePort)}
          end={_get(targetPort, '_el', targetPort)}
          onLoad={(line) => {
            const { svg } = line.getProps();
            wire.setupInstance(svg);
            wire.custom = !internalRender;
            if (typeof(onLoad) === 'function')
              onLoad(line, svg);
          }}
          />
      );
    return null;
  });
}

export default Connections;