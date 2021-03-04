import React from 'react';
import { storiesOf } from '@storybook/react';
import { Container } from '../src/react/components';
import firmataFlows from './flows/firmata-flows.json';
const Firmata = require('firmata-io').Firmata;
const SerialPort = require('./browser-serialport');

const getRandom = (min, max) => min + (Math.random() * (max - min));

const nodeConfig = {
  'digitalWrite': {
    fill: '#F5E867',
    ports: { data_in: 2, data_out: 0, flow_in: 1, flow_out: 1 },
    title: 'digitalWrite',
    gui: {
      port: { label: 'port', type: 'number' },
      value: { label: 'value', type: 'select', options: [true, false] },
    },
    behavior (findById, { board }) {
      let port = this.inputs.port;
      const portConn = this._ports['in'][0].connections[0];
      const portNode = portConn && findById(portConn.nodeId);
      if (portNode) {
        port = portNode.behavior(findById)[portConn.id];
      }

      let value = JSON.parse(this.inputs.value);
      const valueConn = this._ports['in'][1].connections[0];
      const valueNode = valueConn && findById(valueConn.nodeId);
      if (valueNode) {
        value = valueNode.behavior(findById)[valueConnid];
      }

      board.digitalWrite(port, value)
      return 0;
    }
  },
  'analogRead': {
    fill: '#FF8D4F',
    ports: { data_in: 1, data_out: 0, flow_in: 1, flow_out: 1 },
    title: 'analogRead',
    gui: {
      port: { label: 'port', type: 'number' },
    },
    async behavior (findById, { board }) {
      let port = this.inputs.port;
      const portConn = this._ports['in'][0].connections[0];
      const portNode = findById(portConn.nodeId);
      if (portNode) {
        port = portNode.behavior(findById)[portConn.id];
      }

      return new Promise(resolve => board.analogRead(port, resolve))
    }
  },
};

storiesOf('Examples', module)
  .add('Firmata', () => (
    <div id="container">
      <div id="test">
        <div id="status"></div>
        <Container
          onLoad={canvas => {
            const initialNodes = ['SourceNumber', 'SourceNumber', 'Alert', 'Operation', 'If', 'analogRead', 'digitalWrite', 'digitalWrite', 'delay', 'delay'];
            let board
            globalThis.canvas = canvas
            Object.keys(nodeConfig).forEach(key => canvas.registerNode(key, nodeConfig[key]));

            document.getElementById('setup').onclick = function() {
              if (!board) board = new Firmata(new SerialPort("/dev/ttyACM0", { baudRate: 57600, autoOpen: true }));

              board.on("ready", () => {
                // Arduino is ready to communicate
                console.log('ready')
                document.getElementById('run').removeAttribute('disabled')
                // setInterval(() => {
                //   pinValue = !pinValue                                                                                                                                                                                                                    
                //   board.digitalWrite(13, pinValue)
                //   document.querySelector('#status').innerHTML = pinValue.toString()
                // }, 1000)
              });
            }

            document.getElementById('run').onclick = function() {
              canvas.run({ board });

            };

            document.getElementById('export').onclick = function() {
              const json = canvas.toJSON();
              navigator.clipboard.writeText(JSON.stringify(json, null, 2));
            };

            document.getElementById('random').onclick = function() {
              randomNodes();
            }

            function loadExample (id) {
              canvas.loadJSON(firmataFlows[id]);
            };

            function onLoad (event) {
              loadExample(event.target.dataset.index);
            }

            for (let button of document.getElementsByClassName('load')) {
              button.addEventListener('click', onLoad);
            }

            function randomNodes () {
              const nodes = initialNodes.map(nodeName => {
                const [x, y] = [getRandom(30, 500), getRandom(30, 300)];
                return canvas.createNode(nodeName, { x, y });
              });
              canvas.clearCanvas();
              canvas.addNodes(nodes);
            }

            window.setTimeout(() => {
              // loadExample('0');
            }, 0);
          }}
        />
      </div>
      <ul className="button-list">
        <li><button id="setup" type="button">setup</button></li>
        <li><button id="run" type="button" disabled>run</button></li>
        <li><button id="random" type="button">random</button></li>
        <li><button id="export" type="export">export</button></li>
        <li className="separator"></li>
        <li><button className="load" type="button" data-index="0">load 1</button></li>
        <li><button className="load" type="button" data-index="1">load 2</button></li>
      </ul>
    </div>
  ))
