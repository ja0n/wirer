import React from 'react';

import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';

import { Welcome } from '@storybook/react/demo';
import { Container, Section } from '../src/react/components';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

const getRandom = (min, max) => min + (Math.random() * (max - min));
const onLoad = canvas => {
  const initialNodes = [
    'SourceString', 'SourceNumber', 'Alert',
  ];
  const nodes = initialNodes.map(nodeName => {
    return canvas.createNode(nodeName, {
      x: getRandom(100, 600),
      y: getRandom(100, 400),
    });
  });

  canvas.addNodes(nodes);
}

storiesOf('Sticky', module)
  .add('default', () => (
    <Container
      onLoad={canvas => {
        const initialNodes = [
          'SourceNumber', 'SourceNumber', 'Alert',
          'Sum', 'Operation', 'Operation', 'If',
          'SourceString',
        ];
        const nodes = initialNodes.map(nodeName => {
          return canvas.createNode(nodeName, {
            x: getRandom(100, 600),
            y: getRandom(100, 400),
          });
        });

        canvas.addNodes(nodes);
      }}
    />
  ))
  .add('custom Node', () => {
    const style = {
      padding: 15,
      border: '3px solid black',
    }
    const Node = ({ title, bgColor }) => (
      <article style={{ ...style, backgroundColor: bgColor }}>
        <h3>{title}</h3>
      </article>
    );
    return (
      <Container
        renderNode={Node}
        onLoad={onLoad}
      />
    );
  })
  .add('custom Node with Section', () => {
    const style = {
      border: '3px solid black',
    }
    const Node = ({ title, bgColor, wrapper, ports }) => (
      <article style={{ ...style, backgroundColor: bgColor }}>
        <header style={{ backgroundColor: 'grey', color: 'white' }}>
          {title}
        </header>
        <Section wrapper={wrapper} ports={ports}>

        </Section>
      </article>
    );
    return (
      <Container
        renderNode={Node}
        onLoad={onLoad}
      />
    );
  })
  .add('custom Node Text', () => {
    const Text = ({ title, bgColor }) => (
      <h1 style={{ backgroundColor: bgColor }}>{title}</h1>
    );
    return (
      <Container
        renderNode={Text}
        onLoad={onLoad}
      />
    );
  })
  ;