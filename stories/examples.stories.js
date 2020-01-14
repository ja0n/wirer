import React from 'react';
import { storiesOf } from '@storybook/react';

import { Container } from '../src/react/components';
import alertFlows from './flows/alert-flows.json';

import '../examples/themes/default.css';

const getRandom = (min, max) => min + (Math.random() * (max - min));

storiesOf('Examples', module)
  .add('Alert', () => (
    <div id="container">
      <div id="test">
        <Container
          onLoad={canvas => {
            const initialNodes = ['SourceNumber', 'SourceNumber', 'Alert', 'Sum', 'Operation', 'Operation', 'If', 'SourceString'];


            document.getElementById('run').onclick = function() {
              canvas.run();
            };

            document.getElementById('random').onclick = function() {
              randomNodes();
            }

            function loadExample (id) {
              canvas.loadJSON(alertFlows[id]);
            };

            function onLoad (event) {
              loadExample(event.target.dataset.index);
            }

            for (let button of document.getElementsByClassName('load')) {
              button.addEventListener('click', onLoad);
            }

            function randomNodes () {
              const nodes = initialNodes.map(nodeName => {
                const [x, y] = [getRandom(30, 700), getRandom(30, 500)];
                return canvas.createNode(nodeName, { x, y });
              });
              canvas.clearCanvas();
              canvas.addNodes(nodes);
            }

            window.setTimeout(() => {
              loadExample('1');
            }, 0);
          }}
        />
      </div>
      <ul className="button-list">
        <li><button id="run" type="button">run</button></li>
        <li><button id="random" type="button">random</button></li>
        <li className="separator"></li>
        <li><button className="load" type="button" data-index="0">load 1</button></li>
        <li><button className="load" type="button" data-index="1">load 2</button></li>
      </ul>
    </div>
  ))
