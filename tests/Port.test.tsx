import React from 'react';
import { mount } from 'enzyme';
import { Container } from '../src/react/components';
import Wirer from '../src/Wirer';

describe('Port Class', () => {

  test('attach', () => {
    let canvas: Wirer = null;
    const wrapper = mount(
      <Container
        onLoad={ref => {
          canvas = ref;
        }}
      />
    );

    const source = canvas.createNode('SourceString', { x: 10, y: 10 });
    const operation = canvas.createNode('Operation', { x: 100, y: 100 });
    canvas.addNodes([source, operation]);

    // check if connection is empty
    expect(source._ports.out[0].connections.length).toBe(0);
    expect(operation._ports.in[0].connections.length).toBe(0);

    // try invalid port
    expect(
      canvas.render.sealOrDiscard(source._ports.out[0], operation._ports.out[0])
    ).toBeFalsy();

    // check if connection is still empty
    expect(source._ports.out[0].connections.length).toBe(0);
    expect(operation._ports.in[0].connections.length).toBe(0);

    // attach valid port
    expect(
      canvas.render.sealOrDiscard(source._ports.out[0], operation._ports.in[0])
    ).toBeTruthy();

    // check if connection is increased
    expect(source._ports.out[0].connections.length).toBe(1);
    expect(operation._ports.in[0].connections.length).toBe(1);

    // attach valid port again
    expect(
      canvas.render.sealOrDiscard(source._ports.out[0], operation._ports.in[0])
    ).toBeFalsy();

    // check if connection didn't increase
    expect(source._ports.out[0].connections.length).toBe(1);
    expect(operation._ports.in[0].connections.length).toBe(1);

  });

  test('attach maxConnections', () => {
    let canvas = null;
    const wrapper = mount(
      <Container
        onLoad={ref => {
          canvas = ref;
        }}
      />
    );

    const sourceA = canvas.createNode('SourceString', { x: 10, y: 10 });
    const sourceB = canvas.createNode('SourceString', { x: 30, y: 30 });
    const operation = canvas.createNode('Operation', { x: 100, y: 100 });
    canvas.addNodes([sourceA, sourceB, operation]);

    const operationPort = operation._ports.in[0];
    const sourceAPort = sourceA._ports.out[0];
    const sourceBPort = sourceB._ports.out[0];

    // assert with 1
    operationPort.maxConnections = 1;

    expect(
      canvas.render.sealOrDiscard(sourceAPort, operationPort)
    ).toBeTruthy()
    expect(sourceAPort.connections.length).toBe(1);
    expect(operationPort.connections.length).toBe(1);
    expect(sourceBPort.connections.length).toBe(0);

    expect(
      canvas.render.sealOrDiscard(sourceBPort, operationPort)
    ).toBeFalsy()
    expect(sourceAPort.connections.length).toBe(1);
    expect(operationPort.connections.length).toBe(1);
    expect(sourceBPort.connections.length).toBe(0);

    // assert with 2
    operationPort.maxConnections = 2;

    expect(
      canvas.render.sealOrDiscard(sourceBPort, operationPort)
    ).toBeTruthy()
    expect(sourceAPort.connections.length).toBe(1);
    expect(operationPort.connections.length).toBe(2);
    expect(sourceBPort.connections.length).toBe(1);
  });

  test('dettach', () => {
    let canvas = null;
    const wrapper = mount(
      <Container
        onLoad={ref => {
          canvas = ref;
        }}
      />
    );

    const source = canvas.createNode('SourceString', { x: 10, y: 10 });
    const operation = canvas.createNode('Operation', { x: 100, y: 100 });
    canvas.addNodes([source, operation]);

    // check if connection is empty
    expect(source._ports.out[0].connections.length).toBe(0);
    expect(operation._ports.in[0].connections.length).toBe(0);

    const sealed = canvas.render.sealOrDiscard(source._ports.out[0], operation._ports.in[0]);
    expect(sealed).toBeTruthy();

    // check if connection is increased
    expect(source._ports.out[0].connections.length).toBe(1);
    expect(operation._ports.in[0].connections.length).toBe(1);

    // dettach invalid ports
    source._ports.out[0].dettach(operation._ports.in[1])
    // source._ports.out[0].dettach(operation._ports.flow_out[0])
    source._ports.out[0].dettach(operation._ports.out[0])

    // assert that no connection was destroyed
    expect(source._ports.out[0].connections.length).toBe(1);
    expect(operation._ports.in[0].connections.length).toBe(1);

    // dettach valid port
    source._ports.out[0].dettach(operation._ports.in[0])

    // assert that the connection was destroyed
    expect(source._ports.out[0].connections.length).toBe(0);
    expect(operation._ports.in[0].connections.length).toBe(0);
  });

});
