import React from 'react';
import { NodeModel } from '../../types';
import PortList from './PortList';

const splitPorts = ({ node }: { node: NodeModel }) => [
  [
    <PortList key="flow_in" node={node} type="flow" direction="in" />,
    <PortList key="data_in" node={node} type="data" direction="in" />,
  ],
  [
    <PortList key="flow_out" node={node} type="flow" direction="out" />,
    <PortList key="data_out" node={node} type="data" direction="out" />,
  ],
];

export default splitPorts;
