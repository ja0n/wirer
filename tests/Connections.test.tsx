import React from 'react';
import { mount } from 'enzyme';
import Wirer from '../src/Wirer';
import { Container, Connections, Wire, Line } from '../src/react/components';

describe('Connections Component', () => {
  test('last line selected behavior', () => {
  })
  test('it is respecting wire managing', () => {
    let wrapper, container;
    let canvas: Wirer;

    // no offset and no zoom
    wrapper = mount(
      <Container
        onLoad={ref => {
          canvas = ref;
        }}
      />
    );

    expect(wrapper.find(Wire)).toHaveLength(0);

    const source = canvas.createNode('SourceString', { x: 10, y: 10 });
    const alert1 = canvas.createNode('Alert', { x: 100, y: 100 });
    const alert2 = canvas.createNode('Alert', { x: 200, y: 100 });
    canvas.addNodes([source, alert1, alert2]); // add two nodes
    // add wire
    let sealed = canvas.render.sealOrDiscard(source._ports.out[0], alert1._ports.in[0]);
    wrapper.update();
    expect(sealed).toBeTruthy();
    expect(wrapper.find(Wire)).toHaveLength(1);

    // add another wire
    sealed = canvas.render.sealOrDiscard(alert1._ports.flow_out[0], alert2._ports.flow_in[0]);
    wrapper.update();
    expect(sealed).toBeTruthy();
    expect(wrapper.find(Wire)).toHaveLength(2);

    // try invalid wire seal
    sealed = canvas.render.sealOrDiscard(alert1._ports.flow_out[0], alert2._ports.in[0]);
    wrapper.update();
    expect(sealed).toBeFalsy();
    expect(wrapper.find(Wire)).toHaveLength(2);
    wrapper.unmount();
  });
});
