import React from 'react';
import ReactDOM from 'react-dom';
import { createElement } from './utils/dom';
import { NodeGraph } from './react/components';
import { Config } from './Render';
import Sticky from './Sticky';


function StickyStandalone (id: string, config: Config) {
  // const { wrapper, Component } = this.config;
  const manager = new Sticky(config);
  const svg = createElement('svg', { class: 'svg-content', preserveAspectRatio: "xMidYMid meet" });
  this.loadContainer(svg);

  const element = document.getElementById(id);
  element.classList.add('sticky__canvas');
  element.appendChild(this._svg);

  ReactDOM.render(
    <NodeGraph
      ref={ref => { this.react = ref }}
      getNodes={() => manager.nodes}
      getOffset={() => manager.render.offset}
      getZoom={() => manager.render.zoom}
    />,
    svg
  );
}