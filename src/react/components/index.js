import React from 'react';

import Form from './form';

export const Node = ({ title, width, gui, inputs, values, onChange, bgColor }) => (
  <foreignObject id="main" className="sticky-block-html" width={Math.max(width, 60)} >
    <body style={{ backgroundColor: bgColor }}>
      <header>{title}</header>
      <section>
        <Form gui={gui} inputs={inputs} values={values} onChange={onChange} />
      </section>
    </body>
  </foreignObject>
)
