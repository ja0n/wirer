import React from 'react';
import ReactDOM from 'react-dom';
import { createElement } from './utils/dom';
import { NodeGraph } from './react/components';
import { Config } from './Render';
import Wirer from './Wirer';


function WirerStandalone (id: string, config: Config) {
  // const { wrapper, Component } = this.config;
  const manager = new Wirer(config);
  const svg = createElement('svg', { class: 'svg-content', preserveAspectRatio: "xMidYMid meet" });
  manager.render.loadContainer(svg);

  const element = document.getElementById(id);
  element.classList.add('wirer__canvas');
  element.appendChild(svg);

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