import React from 'react';
import SplitPorts from './SplitPorts';

const SplitSection = ({ children, wrapper, ports, zoom }) => (
  <SplitPorts node={wrapper} ports={ports} zoom={zoom}>
    {
      ({ InputPorts, OutputPorts }) => (
        <section className="sticky-node-section">
          <aside className="left">
            {InputPorts}
          </aside>
          <article>
            {children}
          </article>
          <aside className="right">
            {OutputPorts}
          </aside>
        </section>
      )
    }
  </SplitPorts>
);

export default SplitSection;
