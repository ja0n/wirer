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

describe('LeaderLine support', () => {
  test('leader-line', () => {
    let canvas = null;
    const wrapper = mount(
      <Container
        onLoad={ref => {
          canvas.render.internalRender = false;
          canvas = ref;
        }}
      />
    );

    const source = canvas.createNode('SourceString', { x: 10, y: 10 });
    const alert = canvas.createNode('Alert', { x: 100, y: 100 });
    canvas.addNodes([source, alert]);
    debugger;
    const sealed = canvas.render.sealOrDiscard(source._ports.out[0], alert._ports.in[0]);

    // const connections = wrapper.find('.leader-line');
    const connections = wrapper.find('.leader-line');
    expect(connections).toHaveLength(1);
  });

});
