import React from 'react';
import _findIndex from 'lodash/findIndex';
import _times from 'lodash/times';

import Form from './form';
import { DataPort, FlowPort } from './../../ports.js';

export class SVGContainer extends React.Component {
  shouldComponentUpdate(nextProps) {
    const hasZoomChanged = () => {
      return this.props.zoom !== nextProps.zoom;
    }
    const hasPositionChanged = () => {
      return this.props.x !== nextProps.x || this.props.y !== nextProps.y;
    }

    const hasOffsetChanged = () => {
      if (!this.props.offset || !nextProps.offset) return false;
      return this.props.offset.x !== nextProps.offset.x || this.props.offset.y !== nextProps.offset.y;
    }

    if (!this.ref) return false;

    if (hasPositionChanged()) {
      this.ref.setAttribute('x', nextProps.x);
      this.ref.setAttribute('y', nextProps.y);
    }

    if (hasPositionChanged() || hasOffsetChanged()) {
      this.props.wrapper.updateWires(nextProps.offset);
    }

    if (hasZoomChanged())
      return true

    return false;
  }

  render () {
    const { children, wrapper, x, y, offset } = this.props
    console.debug('SVGContainer rendering', wrapper, offset);

    const setupInstance = ref => {
      this.ref = ref;
      if (!ref) return null;
      ref.wrapper = wrapper;
      ref.type = 'node';
      ref.style.overflow = 'visible';
      wrapper._el = ref;
    }

    return (
      <svg x={x} y={y} ref={setupInstance}>
        {children}
      </svg>
    );
  }
}

export const NodeContainer = ({ children, width, node, zoom, offset }) => {
  const x = (node.x + offset.x) * zoom;
  const y = (node.y + offset.y) * zoom;
  const style = {
    transform: `scale(${zoom})`,
    width: Math.max(node.cfg.width, 60),
    height: 80,
  }
  const lOffset = { x: offset.x * zoom, y: offset.y * zoom };
  return (
    <SVGContainer wrapper={node} title={node.cfg.title} x={x} y={y} offset={lOffset} zoom={zoom}>
      <foreignObject id="main" className="sticky-node-html" style={style}>
        {children}
      </foreignObject>
    </SVGContainer>
  );

}

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