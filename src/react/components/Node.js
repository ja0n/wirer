import React from 'react';

import SplitSection from './SplitSection';
import Form from './Form';

const Node = ({ title, width, gui, inputs, values, onChange, bgColor, wrapper, ports }) => (
  <body style={{ backgroundColor: bgColor }} xmlns="http://www.w3.org/1999/xhtml">
    <header>{title}</header>
    <SplitSection wrapper={wrapper} ports={ports}>
      <Form gui={gui} inputs={inputs} values={values} onChange={onChange} />
    </SplitSection>
  </body>
)

export default Node;
