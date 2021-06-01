import React from 'react';
import Sticky from '../../Sticky';
import { GlobalStyle } from '../../globalStyles';
import { ChromeStyle } from '../../themes/chrome';
import { NodeList, Connections } from './index'

interface Props {
  width?: number;
  height?: number;
  gridSize?: number;
  gridColor?: string;
  backgroundColor?: string;
  onLoad?: (canvas?: Sticky) => void;
  renderNode?: () => JSX.Element;
}

export default class Container extends React.Component<Props> {
  canvas?: Sticky;

  static defaultProps = {
    width: 800,
    height: 600,
    backgroundColor: '#CCCCCC75',
    gridColor: 'grey',
    gridSize: '20',
    onLoad: null,
  }

  buildUp (ref) {
    if (!ref)
      return null;

    if (this.canvas)
      return null;

    const { width, height, gridSize, gridColor, backgroundColor } = this.props;
    const canvas = new Sticky({ width, height });
    canvas.render.loadContainer(ref);
    canvas.render.react = this;
    canvas.render.gridColor = gridColor;
    canvas.render.backgroundColor = backgroundColor;
    canvas.render.gridSize = gridSize;
    ref.wrapper = canvas;
    this.canvas = canvas;

    if (typeof(this.props.onLoad) == 'function')
      this.props.onLoad(canvas);
  }

  render () {
    const { canvas, props } = this;
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
          <svg style={canvas?.render.getGridStyle()} className="svg-content" preserveAspectRatio="xMidYMid meet" ref={ref => this.buildUp(ref)} >
            {canvas && (
              <>
                <NodeList
                  nodes={canvas.nodes}
                  renderNode={props.renderNode}
                  offset={canvas.render.offset}
                  zoom={canvas.render.zoom}
                />
                <Connections
                  canvas={canvas}
                  connections={canvas.render.getConnections()}
                  offset={canvas.render.offset}
                  zoom={canvas.render.zoom}
                />
              </>
            )}
          </svg>
        </div>
      </div>
    );
  }
}

  