import { Container } from '../src/react/components';

class SVGPathElement extends SVGElement {}
window.SVGPathElement = SVGPathElement;

class SVGRectElement extends SVGElement {}
window.SVGRectElement = SVGRectElement;

class SVGCircleElement extends SVGElement {}
window.SVGCircleElement = SVGCircleElement;

class SVGEllipseElement extends SVGElement {}
window.SVGEllipseElement = SVGEllipseElement;

class SVGLineElement extends SVGElement {}
window.SVGLineElement = SVGLineElement;

class SVGPolylineElement extends SVGElement {}
window.SVGPolylineElement = SVGPolylineElement;

class SVGPolygonElement extends SVGElement {}
window.SVGPolygonElement = SVGPolygonElement;

describe('Port Class', () => {
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
