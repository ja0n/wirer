import React from 'react';
import { mount } from 'enzyme';
import Wirer from '../src/Wirer';
import { NodeContainer, SVGContainer } from '../src/react/components';

// TODO: Add tests related to WirerContext

describe('NodeContainer Component', () => {
  test('position is calculated based on zoom and offset', () => {
    let canvas = new Wirer();
    const start = canvas.createNode('start', { x: 100, y: 100 });
    let wrapper, container, props;

    // no offset and no zoom
    wrapper = mount(
      <NodeContainer
        node={start}
        zoom={1}
        offset={{ x: 0, y: 0 }}
      />
    );
    container = wrapper.find(SVGContainer);
    props = container.props();
    expect(props.zoom).toBe(1)
    expect(props.x).toBe(100)
    expect(props.y).toBe(100)
    expect(props.offset).toStrictEqual({ x: 0, y: 0 })
    wrapper.unmount()

    // offset with no zoom
    wrapper = mount(
      <NodeContainer
        node={start}
        zoom={1}
        offset={{ x: 100, y: 100 }}
      />
    );
    container = wrapper.find(SVGContainer);
    props = container.props();
    expect(props.zoom).toBe(1)
    expect(props.x).toBe(200)
    expect(props.y).toBe(200)
    expect(props.offset).toStrictEqual({ x: 100, y: 100 })
    wrapper.unmount()

    // offset with zoom
    wrapper = mount(
      <NodeContainer
        node={start}
        zoom={2}
        offset={{ x: 100, y: 100 }}
      />
    );
    container = wrapper.find(SVGContainer);
    props = container.props();
    expect(props.zoom).toBe(2)
    // assert position is normalized: (position + offset) * zoom
    expect(props.x).toBe(400)
    expect(props.y).toBe(400)
    // offset should remain raw
    expect(props.offset).toStrictEqual({ x: 100, y: 100 })
    wrapper.unmount()

    // wrapper = mount(
    //     <NodeContainer
    //       node={start}
    //       zoom={2}
    //       offset={{ x: 0, y: 0 }}
    //     />
    // );
    // wrapper.unmount()

    // const sealed = canvas.render.sealOrDiscard(source._ports.out[0], alert._ports.in[0]);
    // expect(sealed).toBeTruthy();
    // const connections = wrapper.find('.leader-line');

    // const connections = wrapper.find('.wirer-node-html');
    // expect(svgContainers).toHaveLength(4);
  });

});
