import React from 'react';
import Sticky from '../../Sticky';

const getRandom = (min, max) => min + (Math.random() * (max - min));

export default class Container extends React.Component {
  buildUp (ref) {
    if (!ref)
      return null;
    const { width, height } = this.props;
    const canvas = new Sticky(null, { width, height });
    canvas.render.loadContainer(ref);
    const initialBlocks = ['SourceNumber', 'SourceNumber', 'Alert', 'Sum', 'Operation', 'Operation', 'If', 'SourceString'];

    const blocks = initialBlocks.map(blockName => {
      return canvas.createBlock(blockName, {
        x: getRandom(200, 800),
        y: getRandom(200, 600),
      });
    });

    canvas.addNodes(blocks);
  }

  render () {
    const { props } = this;
    return (
      <div ref={ref => this.buildUp(ref)} />
    );
    return (
      <svg
        className="svg-content"
        preserveAspectRatio="xMidYMid meet"
        ref={ref => this.builUp(ref)}
      />
    );
  }
}

Container.defaultProps = {
  width: 800,
  height: 600,
}