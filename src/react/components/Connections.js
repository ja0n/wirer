import React from 'react';
import { uid } from 'react-uid';
import Line from './Line';
import _get from 'lodash/get'

const Connections = ({ connections, canvas, onLoad }) => {
  if (canvas.render.internalRender)
    return null;

  return connections.map((wire) => {
    const [sourcePort, targetPort] = wire.getControlPoints();
    if (sourcePort && targetPort)
      return (
        <Line
          key={uid(wire)}
          start={_get(sourcePort, '_el', sourcePort)}
          end={_get(targetPort, '_el', targetPort)}
          size={4 * canvas.render.zoom}
          onLoad={(line) => {
            const { svg } = line.getProps();
            wire.setupInstance(svg);
            wire.custom = !canvas.render.internalRender;
            if (typeof(onLoad) === 'function')
              onLoad(line, svg);
          }}
          />
      );
    return null;
  });
}

export default Connections;
