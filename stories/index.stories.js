import React from 'react';

import { storiesOf } from '@storybook/react';

import { Container, SplitSection } from '../src/react/components';

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

storiesOf('Custom', module)
  .add('default', () => (
    <Container
      onLoad={onLoad}
    />
  ))
  .add('square Node', () => {
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
  .add('custom Node with SplitSection', () => {
    const style = {
      border: '3px solid black',
    }
    const Node = ({ title, bgColor, wrapper, ports }) => (
      <article style={{ ...style, backgroundColor: bgColor }}>
        <header style={{ backgroundColor: 'grey', color: 'white' }}>
          {title}
        </header>
        <SplitSection wrapper={wrapper} ports={ports}>

        </SplitSection>
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