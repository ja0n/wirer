import React from 'react';
import Sticky from '../../Sticky';
import { NodeGraph } from './index'

const getRandom = (min, max) => min + (Math.random() * (max - min));

const initialBlocks = ['SourceNumber', 'SourceNumber', 'Alert', 'Sum', 'Operation', 'Operation', 'If', 'SourceString'];

export default class Container extends React.Component {
  buildUp (ref) {
    if (!ref)
      return null;

    if (this.canvas)
      return null;

    const { width, height } = this.props;
    const canvas = new Sticky(null, { width, height });
    canvas.render.loadContainer(ref);
    canvas.render.react = this;
    ref.wrapper = canvas;
    this.canvas = canvas;

    const blocks = initialBlocks.map(blockName => {
      return canvas.createBlock(blockName, {
        x: getRandom(100, 600),
        y: getRandom(100, 400),
      });
    });

    canvas.addNodes(blocks);

    if (typeof(this.props.onLoad) == 'function')
      this.props.onLoad(canvas);
  }

  renderNodes () {
    const { canvas } = this;
    console.debug('canvas', canvas);
    if (!canvas)
      return null;

    const { wrapper } = canvas.render.config;

    return (
      <NodeGraph
        nodes={wrapper.nodes}
      />
    );
  }

  render () {
    return (
      <div className="sticky__canvas">
        <svg className="svg-content" preserveAspectRatio="xMidYMid meet" ref={ref => this.buildUp(ref)} >
          {this.renderNodes()}
        </svg>
      </div>
    );
  }
}

Container.defaultProps = {
  width: 800,
  height: 600,
  onLoad: null,
}