import React from 'react';
import { storiesOf } from '@storybook/react';

import { Container } from '../src/react/components';
import zoomFlows from './flows/zoom-flows.json';

import '../examples/themes/default.css';

import 'leader-line';

storiesOf('Features', module)
  .add('Zoom In and Out', () => (
    <div id="container">
      <div id="test">
        <Container
          onLoad={canvas => {
            canvas.render.disableDragging = true;
            canvas.loadJSON(zoomFlows[0]);

            function setZoom (event) {
              const { value } = event.target.dataset;
              canvas.render.setZoom(value);
            };

            for (let button of document.getElementsByClassName('zoom')) {
              button.addEventListener('click', setZoom);
            }

            function setReset () {
              canvas.render.setZoom(1);
              canvas.render.setCenterPoint([0, 0]);
            };
            for (let button of document.getElementsByClassName('reset')) {
              button.addEventListener('click', setReset);
            }

            canvas.render.setCenterPoint([0, 0]);
          }}
        />
      </div>
      <div className="button-list">
        <ul>
          <li><button className="zoom" type="button" data-value="0.5">0.5x</button></li>
          <li><button className="zoom" type="button" data-value="0.7">0.7x</button></li>
          <li><button className="zoom" type="button" data-value="1">1.0x</button></li>
          <li><button className="zoom" type="button" data-value="2">2.0x</button></li>
          <li><button className="zoom" type="button" data-value="3">3.0x</button></li>
          <li><button className="zoom" type="button" data-value="4">4.0x</button></li>
        </ul>
        <ul>
          <li><button className="reset" type="button" data-value="4">Reset</button></li>
        </ul>
      </div>
    </div>
  ))
  .add('Center position', () => (
    <div id="container">
      <div id="test">
        <Container
          onLoad={canvas => {
            canvas.render.disableDragging = true;
            canvas.loadJSON(zoomFlows[0]);

            function setCenter (event) {
              const { value } = event.target.dataset;
              canvas.render.setCenterPoint(canvas.render._p.parse(value));
            };
            for (let button of document.getElementsByClassName('center')) {
              button.addEventListener('click', setCenter);
            }
            function setReset () {
              canvas.render.setZoom(1);
              canvas.render.setCenterPoint([0, 0]);
            };
            for (let button of document.getElementsByClassName('reset')) {
              button.addEventListener('click', setReset);
            }

            canvas.render.setCenterPoint([0, 0]);
          }}
        />
      </div>
      <div className="button-list">
        <ul>
          <li><button className="center" type="button" data-value="[0, 0]">[0, 0]</button></li>
          <li><button className="center" type="button" data-value="[100, -100]">[100, -100]</button></li>
          <li><button className="center" type="button" data-value="[-100, -100]">[-100, -100]</button></li>
          <li><button className="center" type="button" data-value="[-100, 100]">[-100, 100]</button></li>
          <li><button className="center" type="button" data-value="[100, 100]">[100, 100]</button></li>
        </ul>
        <ul>
          <li><button className="reset" type="button" data-value="4">Reset</button></li>
        </ul>
      </div>
    </div>
  ))
