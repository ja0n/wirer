import React from 'react';
import { mount } from 'enzyme';
import Sticky from '../src/Sticky';
import { Container, NodeContainer } from '../src/react/components';

describe('Container Component', () => {
  test('it is respecting node managing', () => {
    let wrapper, container;
    let canvas: Sticky;

    // no offset and no zoom
    wrapper = mount(
      <Container
        onLoad={ref => {
          canvas = ref;
        }}
      />
    );

    expect(wrapper.find(NodeContainer)).toHaveLength(0);

		canvas.clearCanvas(); // clear and add default node
		wrapper.update();
    expect(wrapper.find(NodeContainer)).toHaveLength(1); // initial start node

		canvas.clearCanvas(false); // clear all nodes
		wrapper.update();
    expect(wrapper.find(NodeContainer)).toHaveLength(0);

		const source = canvas.createNode('SourceString', { x: 10, y: 10 });
		const alert = canvas.createNode('Alert', { x: 100, y: 100 });
		canvas.addNodes([source, alert]); // add two nodes
		const sealed = canvas.render.sealOrDiscard(source._ports.out[0], alert._ports.in[0]);
		wrapper.update();

    container = wrapper.find(NodeContainer);
    expect(sealed).toBeTruthy();
    expect(container).toHaveLength(2); // two added
    wrapper.unmount()
	});

  test('grid is calculated based on zoom and offset', () => {
    let wrapper;
    let canvas: Sticky;

    // no offset and no zoom
    wrapper = mount(
      <Container
        onLoad={ref => {
          canvas = ref;
        }}
      />
    );

    wrapper.update();
		let style;

    // IMPROVE: assert against element style
		// style = wrapper.find('.svg-content').get(0).props.style;
		style = canvas.render.getGridStyle();
		expect(style).toHaveProperty('backgroundColor', Container.defaultProps.backgroundColor)
		expect(style).toHaveProperty('backgroundPositionX', '0px');
		expect(style).toHaveProperty('backgroundPositionY', '0px');
		expect(style).toHaveProperty('backgroundSize', '20px 20px');
    expect(style).toHaveProperty('backgroundImage', `linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px)`);

		canvas.render.offset = { x: 100, y: 100 };
		canvas.render.backgroundColor = 'blue';
		canvas.render.gridColor = 'green';
		canvas.render.gridSize = 50;
		wrapper.update();

		style = canvas.render.getGridStyle();
		expect(style).toHaveProperty('backgroundColor', 'blue')
		expect(style).toHaveProperty('backgroundPositionX', '100px');
		expect(style).toHaveProperty('backgroundPositionY', '100px');
		expect(style).toHaveProperty('backgroundSize', '50px 50px');
    expect(style).toHaveProperty('backgroundImage', `linear-gradient(to right, green 1px, transparent 1px), linear-gradient(to bottom, green 1px, transparent 1px)`);

		wrapper.update();
		canvas.render.zoom = 2;
		style = canvas.render.getGridStyle();
		expect(style).toHaveProperty('backgroundPositionX', '200px');
		expect(style).toHaveProperty('backgroundPositionY', '200px');
		expect(style).toHaveProperty('backgroundSize', '100px 100px');
    expect(style).toHaveProperty('backgroundImage', `linear-gradient(to right, green 2px, transparent 2px), linear-gradient(to bottom, green 2px, transparent 2px)`);

    wrapper.unmount()
	});
});
