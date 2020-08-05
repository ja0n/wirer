import React from 'react';
import Sticky from '../../Sticky';
import { GlobalStyle } from '../../globalStyles';
import { ChromeStyle } from '../../themes/chrome';
import { NodeList, Connections } from './index'

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
    console.debug('Sticky::canvas', canvas);

    if (!canvas)
      return null;

    return (
      <NodeList
        nodes={canvas.nodes}
        renderNode={props.renderNode}
        offset={canvas.render.offset}
        zoom={canvas.render.zoom}
      />
    );
  }

  renderConnections () {
    const { canvas } = this;

    if (!canvas)
      return null;

    return (
      <Connections
        canvas={canvas}
        connections={canvas.render.getConnections()}
        offset={canvas.render.offset}
        zoom={canvas.render.zoom}
      />
    );
  }

  render () {
    const offset = this.canvas && this.canvas.render.offset;
    let style = {};

    if (offset) {
      style = {
        backgroundPosition: `${offset.x}px ${offset.y}px`,
      }
    }
    const linesStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    }
    return (
      <div className="sticky__container">
        <GlobalStyle />
        <ChromeStyle />
        <div className="sticky__canvas">
          <svg style={style} className="svg-content" preserveAspectRatio="xMidYMid meet" ref={ref => this.buildUp(ref)} >
            {this.renderNodes()}
            {this.renderConnections()}
          </svg>
        </div>
      </div>
    );
  }
}

Container.defaultProps = {
  width: 800,
  height: 600,
  onLoad: null,
};
