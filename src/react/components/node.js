import React from 'react';
import _findIndex from 'lodash/findIndex';
import _times from 'lodash/times';

import Form from './form';
import { DataPort, FlowPort } from './../../ports.js';

export class SVGContainer extends React.PureComponent {
  render () {
    const { children, wrapper, x, y, offset } = this.props
    console.debug('SVGContainer rendering', wrapper);
    function setupInstance(ref) {
      if (!ref) return null;
      ref.wrapper = wrapper;
      ref.type = 'node';
      ref.style.overflow = 'visible';
      wrapper._el = ref;
    }

    console.debug('offseett', wrapper, offset, x);
    return <svg x={wrapper.x + offset.x} y={wrapper.y + offset.y} ref={setupInstance}>{children}</svg>;
  }
}

export const NodeContainer = ({ children, width, node, offset }) => (
  <SVGContainer wrapper={node} title={node.cfg.title} offset={offset}>
    <foreignObject id="main" className="sticky-node-html" width={Math.max(node.cfg.width, 60)} height="80">
      {children}
    </foreignObject>
  </SVGContainer>
);

export const Node = ({ title, width, gui, inputs, values, onChange, bgColor, wrapper, ports }) => (
  <body style={{ backgroundColor: bgColor }}>
    <header>{title}</header>
    <Section wrapper={wrapper} ports={ports}>
      <Form gui={gui} inputs={inputs} values={values} onChange={onChange} />
    </Section>
  </body>
)

export const Section = ({ children, wrapper, ports: { data_in, data_out, flow_in, flow_out } }) => (
  <section className="sticky-node-section">
    <aside className="left">
      <PortList wrapper={wrapper} type="flow" direction="in" length={flow_in} />
      <PortList wrapper={wrapper} type="data" direction="in" length={data_in} />
    </aside>
    <article>{children}</article>
    <aside className="right">
      <PortList wrapper={wrapper} type="flow" direction="out" length={flow_out} />
      <PortList wrapper={wrapper} type="data" direction="out" length={data_out} />
    </aside>
  </section>
);

const PortList = ({ wrapper, type, direction, length }) => (
  <React.Fragment>
    {_times(length, (index) => (
      <Port key={index} id={index} node={wrapper} type={type} direction={direction} />
    ))}
  </React.Fragment>
);

const Port = ({ children, id, type, direction, node }) => {
  // node._ports.{ in: [], out: [], flow_in: [], flow_out: [] };
  function setupInstance (ref) {
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

  const circleProps = { r: 7, fill: '#B8D430', stroke: 'black', strokeWidth: 2.5 };

  return (
    <svg style={{ overflow: 'visible' }}>
      <circle
        {...circleProps} 
        ref={setupInstance}
      />
    </svg>
  );
};

export default Node;