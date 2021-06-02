import React from 'react';
import { mount } from 'enzyme';
import Sticky from '../src/Sticky';
import { Container, Connections, Wire, Line } from '../src/react/components';

describe('Connections Component', () => {
  test('last line selected behavior', () => {
  })
  test('it is respecting wire managing', () => {
    let canvas = new Sticky();

    // no offset and no zoom
    canvas.clearCanvas(false);

    expect(canvas.nodes).toHaveLength(0);

    const source = canvas.createNode('SourceString', { x: 10, y: 10 });
    const alert1 = canvas.createNode('Alert', { x: 100, y: 100 });
    const alert2 = canvas.createNode('Alert', { x: 200, y: 100 });
    canvas.addNodes([source, alert1, alert2]); // add two nodes
    // add wire
    expect(source.getPorts('in')).toHaveLength(0);
    expect(source.getPorts('out')).toHaveLength(1);
    expect(source.getPorts('flow_in')).toHaveLength(0);
    expect(source.getPorts('flow_out')).toHaveLength(0);

    expect(alert1.getPorts('in')).toHaveLength(1);
    expect(alert1.getPorts('out')).toHaveLength(0);
    expect(alert1.getPorts('flow_in')).toHaveLength(1);
    expect(alert1.getPorts('flow_out')).toHaveLength(1);

    let sealed = canvas.render.sealOrDiscard(source.getPort('out', 0), alert1.getPort('in', 0));
    expect(sealed).toBeTruthy();
    expect(canvas.render._wires).toHaveLength(1);

    // add another wire
    sealed = canvas.render.sealOrDiscard(alert1._ports.flow_out[0], alert2._ports.flow_in[0]);
    expect(sealed).toBeTruthy();
    expect(canvas.render._wires).toHaveLength(2);

    // try invalid wire seal
    sealed = canvas.render.sealOrDiscard(alert1._ports.flow_out[0], alert2._ports.in[0]);
    expect(sealed).toBeFalsy();
    expect(canvas.render._wires).toHaveLength(2);
  });
});
