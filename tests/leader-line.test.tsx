import React from 'react';
import { mount } from 'enzyme';
import { Container } from '../src/react/components';

class SVGPathElement extends SVGElement {}

class SVGRectElement extends SVGElement {}

class SVGCircleElement extends SVGElement {}

class SVGEllipseElement extends SVGElement {}

class SVGLineElement extends SVGElement {}

class SVGPolylineElement extends SVGElement {}

class SVGPolygonElement extends SVGElement {}

// Mock needed SVGElements to render
Object.assign(window, {
  SVGPathElement,
  SVGRectElement,
  SVGCircleElement,
  SVGEllipseElement,
  SVGLineElement,
  SVGPolylineElement,
  SVGPolygonElement,
})

describe('LeaderLine support', () => {
  test('leader-line', () => {
    let canvas = null;
    const wrapper = mount(
      <Container
        onLoad={ref => {
          canvas = ref;
          canvas.render.internalRender = false;
        }}
      />
    );

    const source = canvas.createNode('SourceString', { x: 10, y: 10 });
    const alert = canvas.createNode('Alert', { x: 100, y: 100 });
    canvas.addNodes([source, alert]);
    const sealed = canvas.render.sealOrDiscard(source._ports.out[0], alert._ports.in[0]);
    expect(sealed).toBeTruthy();
    wrapper.update();
    // const connections = wrapper.find('.leader-line');
    const connections = wrapper.find('.leader-line');
    expect(connections).toHaveLength(1);
  });

});
