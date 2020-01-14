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

storiesOf('Custom Node', module)
  .add('default', () => (
    <Container
      onLoad={onLoad}
    />
  ))
  .add('SplitSection', () => {
    const Node = ({ title, bgColor, wrapper, ports }) => (
      <main style={{ backgroundColor: bgColor }}>
        <header> {title} </header>
        <SplitSection wrapper={wrapper} ports={ports}>

        </SplitSection>
      </main>
    );

    const CustomNode = ({ title, bgColor, wrapper, ports }) => (
      <main style={{ backgroundColor: bgColor }}>
        <header> {title} </header>
        <section>

        </section>
      </main>
    );

    return (
      <React.Fragment>
        <p><strong>SplitSection</strong> splits the section and position the ports on the nodes</p>

        <p>With SplitSection</p>
        <Container
          renderNode={Node}
          width={120}
          height={120}
          onLoad={canvas => canvas.clearCanvas()}
        />
        <p>Without SplitSection</p>
        <Container
          renderNode={CustomNode}
          width={120}
          height={120}
          onLoad={canvas => canvas.clearCanvas()}
        />
      </React.Fragment>
    );
  })
  .add('Square Node', () => {
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
  .add('Text Node', () => {
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

import alertFlows from './flows/alert-flows.json';

storiesOf('Custom Lines', module)
  .add('leader-line', () => (
    <Container
      onLoad={canvas => {
        canvas.render.internalRender = false;
        window.setTimeout(function () {
          canvas.loadJSON(alertFlows[0])
        }, 0);
      }}
    />
  ))
