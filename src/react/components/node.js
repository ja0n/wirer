import React from 'react';

import Form from './form';
import { DataPort, FlowPort } from './../../ports.js';

export const Node = ({ title, width, gui, inputs, values, onChange, bgColor, wrapper, ports }) => (
  <foreignObject id="main" className="sticky-block-html" width={Math.max(width, 60)} height="80">
    <body style={{ backgroundColor: bgColor }}>
      <header>{title}</header>
      <Section wrapper={wrapper} ports={ports}>
        <Form gui={gui} inputs={inputs} values={values} onChange={onChange} />
      </Section>
    </body>
  </foreignObject>
)

const Section = ({ children, wrapper, ports: { data_in, data_out, flow_in, flow_out } }) => (
  <section className="sticky-block-section">
    <aside className="left">
      {(new Array(flow_in)).fill(null).map((_, index) => (
        <Port key={index} id={index} direction={'in'} brick={wrapper} type="flow" />
      ))}
      {(new Array(data_in)).fill(null).map((_, index) => (
        <Port key={index} id={index} direction={'in'} brick={wrapper} type="data" />
      ))}
    </aside>
    <article>{children}</article>
    <aside className="right">
      {(new Array(flow_out)).fill(null).map((_, index) => (
        <Port key={index} id={index} direction={'out'} brick={wrapper} type="flow" />
      ))}
      {(new Array(data_out)).fill(null).map((_, index) => (
        <Port key={index} id={index} direction={'out'} brick={wrapper} type="data" />
      ))}
    </aside>
  </section>
);


const Port = ({ children, id, type, direction, brick }) => {
  // brick._ports.in = [];
  // brick._ports.out = [];
  // brick._ports.flow_in = [];
  // brick._ports.flow_out = [];

  function setupInstance (ref) {
    if (type == 'data') {
      let port = new DataPort({ id, brick, dir: direction, ref });
      brick._ports[direction].push(port);
    }
    if (type == 'flow') {
      let port = new FlowPort({ id, brick, dir: direction, ref });
      brick._ports[`flow_${direction}`].push(port);
    }
  }

  return (
    <svg style={{ overflow: 'visible' }}>
      <circle ref={setupInstance}></circle>
    </svg>
  );
};

export default Node;