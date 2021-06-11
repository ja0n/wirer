import React from 'react';
import { NodeModel, Zoom } from '../../types';
import { WirerContext } from './Container';
import splitPorts from './splitPorts';

const SplitSection = ({ children, node }: { children: React.ReactChild; node: NodeModel }) => {
  const [inputPorts, outputPorts] = splitPorts({ node });
  const wirer = React.useContext(WirerContext);
  const themeStyles = wirer.render.themeStyles;
  return (
    <section className="wirer-node-section" style={themeStyles.nodeSection}>
      <aside className="left" style={{ ...themeStyles.nodeSectionAside, ...themeStyles.nodeSectionAsideLeft}}>
        {inputPorts}
      </aside>
      <article style={themeStyles.nodeSectionContent}>
        {children}
      </article>
      <aside className="right" style={{ ...themeStyles.nodeSectionAside, ...themeStyles.nodeSectionAsideRight}}>
        {outputPorts}
      </aside>
    </section>
  );
}

export default SplitSection;
