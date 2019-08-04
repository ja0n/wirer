import React from 'react';
import PortList from './PortList';

const SplitPorts = ({ children, node, ports: { data_in, data_out, flow_in, flow_out } }) => {
  return children({
    InputPorts: [
      <PortList key="flow_in" wrapper={node} type="flow" direction="in" length={flow_in} />,
      <PortList key="data_in" wrapper={node} type="data" direction="in" length={data_in} />,
    ],
    OutputPorts: [
      <PortList key="flow_out" wrapper={node} type="flow" direction="out" length={flow_out} />,
      <PortList key="data_out" wrapper={node} type="data" direction="out" length={data_out} />,
    ],
  });
};

export default SplitPorts;
