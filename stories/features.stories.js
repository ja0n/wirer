import React from 'react';
import { storiesOf } from '@storybook/react';

import { Container } from '../src/react/components';
import zoomFlows from './flows/zoom-flows.json';

import '../examples/themes/default.css';

storiesOf('Features', module)
  .add('zoom', () => (
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
      <div class="button-list">
        <ul>
          <li><button class="zoom" type="button" data-value="0.5">Zoom 0.5x</button></li>
          <li><button class="zoom" type="button" data-value="0.7">Zoom 0.7x</button></li>
          <li><button class="zoom" type="button" data-value="1">Zoom 1x</button></li>
          <li><button class="zoom" type="button" data-value="2">Zoom 2x</button></li>
          <li><button class="zoom" type="button" data-value="3">Zoom 3x</button></li>
          <li><button class="zoom" type="button" data-value="4">Zoom 4x</button></li>
        </ul>
        <ul>
          <li><button class="reset" type="button" data-value="4">Reset</button></li>
        </ul>
      </div>
    </div>
  ))
  .add('recenter', () => (
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
      <div class="button-list">
        <ul>
          <li><button class="center" type="button" data-value="[0, 0]">Center [0, 0]</button></li>
          <li><button class="center" type="button" data-value="[100, -100]">Center [100, -100]</button></li>
          <li><button class="center" type="button" data-value="[-100, -100]">Center [-100, -100]</button></li>
          <li><button class="center" type="button" data-value="[-100, 100]">Center [-100, 100]</button></li>
          <li><button class="center" type="button" data-value="[100, 100]">Center [100, 100]</button></li>
        </ul>
        <ul>
          <li><button class="reset" type="button" data-value="4">Reset</button></li>
        </ul>
      </div>
    </div>
  ))