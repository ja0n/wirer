import React from 'react';
import NodeModel from '../../Node';
import PortModel from '../../Port';
import { StickyContext } from './Container';

import { _p } from '../../utils/points';
type Props = { node: NodeModel, type: string, direction: string };

const PortList = ({ node, type, direction }: Props) => {
  const portKey = `${type === 'flow' ? 'flow_' : ''}${direction}`;
  return (
    <React.Fragment>
      {node.getPorts(portKey).map((port, index) => (
        <Port key={index} port={port} />
      ))}
    </React.Fragment>
  );
};

const Port = ({ port }: { port: PortModel }) => {
  const sticky = React.useContext(StickyContext);
  const themeStyles = sticky.render.themeStyles;
  const circleStyles = {...themeStyles.nodePortCircle, r: 8, fill: port.color };

  return (
    <svg style={themeStyles.nodePortContainer}>
      <circle style={circleStyles} ref={ ref => port.setupInstance(ref) } />
    </svg>
  );
};

export default PortList;