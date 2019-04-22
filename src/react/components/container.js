import React from 'react';
import Sticky from '../../Sticky';
import { NodeList } from './index'

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

    if (typeof(this.props.onLoad) == 'function')
      this.props.onLoad(canvas);
  }

  renderNodes () {
    const { canvas, props } = this;
    console.debug('canvas', canvas);
    if (!canvas)
      return null;

    const { wrapper } = canvas.render.config;
    console.debug('canvas offset', canvas.render.offset);

    return (
      <NodeList
        nodes={wrapper.nodes}
        renderNode={props.renderNode}
        offset={canvas.render.offset}
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