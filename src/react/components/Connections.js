import React from 'react';
import Line from './Line';

const Connections = ({ connections, canvas }) => {
  return connections.map((wire, index) => {
    const [sourcePort, targetPort] = wire.getControlPoints();
    if (sourcePort && targetPort)
      return (
        <Line
          key={index}
          start={sourcePort._el}
          end={targetPort._el}
          onLoad={line => {
            const lineEl = line.getProps().svg;
            wire.setupInstance(lineEl);
            // wire.removeFromParent();
            wire.custom = true;
            const containerEl = document.getElementById('container');
            // canvas.render.addElement(lineEl);
            // containerEl.appendChild(lineEl);
          }}
          />
      );
    return null;
  });
}

export default Connections;