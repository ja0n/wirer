import React from 'react';
import Sticky from '../../Sticky';
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
    console.debug('canvas', canvas);

    if (!canvas)
      return null;

    const { wrapper } = canvas.render.config;
    console.debug('canvas offset', canvas.render.offset);

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
    const { canvas, props } = this;
    console.debug('canvas', canvas);
    if (!canvas)
      return null;

    const { wrapper } = canvas.render.config;
    console.debug('canvas offset', canvas.render.offset);

    return (
      <Connections
        canvas={canvas}
        connections={canvas.render._wires}
        offset={canvas.render.offset}
        zoom={canvas.render.zoom}
        onLoad={
          (line, lineElement) => {
            window.setTimeout(() => {
              this.linesContainer.appendChild(lineElement);
            }, 1000)
          }
        }
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
        <div className="sticky__canvas">
          <svg style={style} className="svg-content" preserveAspectRatio="xMidYMid meet" ref={ref => this.buildUp(ref)} >
            {this.renderNodes()}
            {this.renderConnections()}
          </svg>
        </div>
        <div className="sticky__connections" style={linesStyle} ref={ ref => { this.linesContainer = ref } }>
        </div>
      </div>
    );
  }
}

Container.defaultProps = {
  width: 800,
  height: 600,
  onLoad: null,
  }