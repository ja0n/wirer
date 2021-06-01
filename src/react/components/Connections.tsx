import React from 'react';
import _get from 'lodash/get'
import { uid } from 'react-uid';
import Line from './Line';
import Wire from './Wire';


const Connections = ({ connections, canvas, ...props }) => {
  if (canvas.render.internalRender)
    return connections.map((wire) => {
      return (
        <Wire key={uid(wire)} wrapper={wire} zoom={canvas.render.zoom} offset={canvas.render.offset} />
      );
    });

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
            if (typeof(props.onLoad) === 'function')
              props.onLoad(line, svg);
          }}
        />
      );
    return null;
  });
}

export default Connections;
