import React from 'react';

import SplitSection from './SplitSection';
import Form from './Form';

const Node = (props) => {
  const {
    title, width, bgColor, zoom,
    gui, inputs, ports,
    values, onChange, wrapper
  } = props;

  return (
    <article style={{ backgroundColor: bgColor }} className="glowing-box">
      <header className="node__header shine-container chrome">
        <span className="node__header-title">{title}</span>
      </header>

      <SplitSection wrapper={wrapper} ports={ports} zoom={zoom}>
        <Form
          gui={gui}
          inputs={inputs}
          values={values}
          onChange={onChange}
        />
      </SplitSection>
    </article>
  );
};

export default Node;
