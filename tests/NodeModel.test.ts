import { prototypeMap } from '../src/nodes/prototype';
import Wirer from '../src/Wirer';

describe('Wirer', () => {
  test('it is respecting wire managing', () => {
    let canvas = new Wirer();

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

  test('prototype nodes behavior', () => {
    let canvas = new Wirer();
    canvas.clearCanvas(false);
    expect(canvas.nodes).toHaveLength(0);

    const getInstance = canvas.createNode('getInstance', { x: 10, y: 10 });
    const actInstance = canvas.createNode('actInstance', { x: 200, y: 100 });
    const number1 = canvas.createNode('SourceNumber', { x: 100, y: 100, inputs: { number: 100 } });
    const number2 = canvas.createNode('SourceNumber', { x: 100, y: 200, inputs: { number: 200 } });


    canvas.addNodes([
      getInstance, actInstance, number1, number2
    ]);

    actInstance.onChange({ id: 'method', value: 'strokeRect' });
    const prototypeData = prototypeMap['CanvasRenderingContext2D'];
    let parametersCount = prototypeData.prototype['strokeRect'].parameters.length;

    // assert that number of port is matching, excluding the instance one
    expect(parametersCount).toBe(actInstance._ports.in.length - 1)
    canvas.render.sealOrDiscard(getInstance.getPort('out', 0), actInstance.getPort('in', 0));
    canvas.render.sealOrDiscard(number1.getPort('out', 0), actInstance.getPort('in', 1));
    canvas.render.sealOrDiscard(number1.getPort('out', 0), actInstance.getPort('in', 2));
    canvas.render.sealOrDiscard(number2.getPort('out', 0), actInstance.getPort('in', 3));
    canvas.render.sealOrDiscard(number2.getPort('out', 0), actInstance.getPort('in', 4));
    expect(canvas.render.getConnections().length).toBe(5);
    expect(actInstance.wires.length).toBe(5);
    expect(actInstance._ports.in[0].connections.length).toBe(1);
    expect(actInstance._ports.in[1].connections.length).toBe(1);
    expect(actInstance._ports.in[2].connections.length).toBe(1);
    expect(actInstance._ports.in[3].connections.length).toBe(1);
    expect(actInstance._ports.in[4].connections.length).toBe(1);
    expect(number1.wires.length).toBe(2);
    expect(number2.wires.length).toBe(2);
    expect(number1._ports.out[0].connections.length).toBe(2);
    expect(number2._ports.out[0].connections.length).toBe(2);

    const methodName = 'closePath'
    actInstance.onChange({ id: 'method', value: methodName });
    parametersCount = prototypeData.prototype[methodName].parameters.length;
    expect(parametersCount).toBe(actInstance._ports.in.length - 1)

    // assert connections were properly removed after changing port configuration
    expect(canvas.render.getConnections().length).toBe(1);
    expect(actInstance.wires.length).toBe(1);
    expect(actInstance._ports.in[0].connections.length).toBe(0);
    expect(actInstance._ports.in[1].connections.length).toBe(0);
    expect(actInstance._ports.in[2].connections.length).toBe(0);
    expect(actInstance._ports.in[3].connections.length).toBe(0);
    expect(actInstance._ports.in[4].connections.length).toBe(0);
    expect(number1.wires.length).toBe(0);
    expect(number2.wires.length).toBe(0);
    expect(number1._ports.out[0].connections.length).toBe(0);
    expect(number2._ports.out[0].connections.length).toBe(0);
  })
});
