import React from 'react';
import _findIndex from 'lodash/findIndex';

import Form from './form';
import { DataPort, FlowPort } from './../../ports.js';

export class SVGContainer extends React.PureComponent {
  render () {
    const { children, wrapper } = this.props
    console.debug('SVGContainer rendering', wrapper);
    function setupInstance(ref) {
      if (!ref) return null;
      ref.wrapper = wrapper;
      ref.type = 'block';
      ref.style.overflow = 'visible';
      wrapper._el = ref;
    }

    return <svg x={wrapper.x} y={wrapper.y} ref={setupInstance}>{children}</svg>;
  }
}

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
  // brick._ports.{ in: [], out: [], flow_in: [], flow_out: [] };
  function setupInstance (ref) {
    if (!ref) return null;
    const types = {
      'data': { constructor: DataPort, key: `${direction}` },
      'flow': { constructor: FlowPort, key: `flow_${direction}` },
    };

    if (!types[type])
      throw `Port of type "${type}" not found`;

    const { constructor, key } = types[type];
    const port = new constructor({ id, brick, direction, ref });
    const currentIndex = _findIndex(brick._ports[key], { id })
    if (currentIndex != -1)
      brick._ports[key][currentIndex] = port;
    else
      brick._ports[key].push(port);
  }

  return (
    <svg style={{ overflow: 'visible' }}>
      <circle ref={setupInstance}></circle>
    </svg>
  );
};

export default Node;