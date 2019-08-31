import React from 'react';

import { storiesOf } from '@storybook/react';

import { Container } from '../src/react/components';
import alertFlows from './flows/alert-flows.json';

import '../examples/themes/default.css';

storiesOf('Examples', module)
  .add('alert', () => (
    <div id="container">
      <div id="test">
        <Container
          onLoad={canvas => {
            const initialNodes = ['SourceNumber', 'SourceNumber', 'Alert', 'Sum', 'Operation', 'Operation', 'If', 'SourceString'];
            const getRandom = (min, max) => min + (Math.random() * (max - min));
            const nodes = initialNodes.map(nodeName => {
              const [x, y] = [getRandom(200, 800), getRandom(200, 600)];
              return canvas.createNode(nodeName, { x, y });
            });

            canvas.addNodes(nodes);

            document.getElementById('run').onclick = function() {
              canvas.run();
            };

            function loadExample (event) {
              canvas.loadJSON(alertFlows[event.target.dataset.index]);
            };

            for (let button of document.getElementsByClassName('load')) {
              button.addEventListener('click', loadExample);
            }
          }}
        />
      </div>
      <ul className="button-list">
        <li><button id="run" type="button">run</button></li>
        <li className="separator"></li>
        <li><button className="load" type="button" data-index="0">load 1</button></li>
        <li><button className="load" type="button" data-index="1">load 2</button></li>
      </ul>
    </div>
  ))