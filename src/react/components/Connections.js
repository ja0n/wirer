import React from 'react';
import Line from './Line';

const Connections = ({ connections, canvas, onLoad }) => {
  return connections.map((wire, index) => {
    const [sourcePort, targetPort] = wire.getControlPoints();
    if (sourcePort && targetPort)
      return (
        <Line
          key={index}
          start={sourcePort._el}
          end={targetPort._el}
          onLoad={(line) => {
            const lineEl = line.getProps().svg;
            wire.setupInstance(lineEl);
            wire.custom = true;
            if (typeof(onLoad) === 'function')
              onLoad(line, lineEl);
          }}
          />
      );
    return null;
  });
}

export default Connections;