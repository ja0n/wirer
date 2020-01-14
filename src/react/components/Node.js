import React from 'react';

import SplitSection from './SplitSection';
import Form from './Form';

const Node = ({ title, width, gui, inputs, values, onChange, bgColor, wrapper, ports }) => (
  <main style={{ backgroundColor: bgColor }}>
    <header>{title}</header>
    <SplitSection wrapper={wrapper} ports={ports}>
      <Form gui={gui} inputs={inputs} values={values} onChange={onChange} />
    </SplitSection>
  </main>
);

export default Node;
