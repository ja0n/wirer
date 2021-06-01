import React from 'react';

import SplitSection from './SplitSection';
import Form from './Form';
import NodeModel, { GuiConfig, PortCount } from '../../Node'
import { StickyContext } from './Container';

type Props = {
  wrapper: NodeModel;
  title: string;
  width?: number
  bgColor: string;
  zoom: number;
  gui?: GuiConfig;
  className?: string;
  ports?: PortCount;
  inputs:  Record<string, any>;
  onChange: Function;
}

const Node = (props: Props) => {
  const {
    title, width, bgColor, zoom,
    gui, inputs, ports,
    onChange, wrapper,
    className
  } = props;
  const sticky = React.useContext(StickyContext);

  return (
    <article style={{ backgroundColor: bgColor }} className={className}>
      <header className="node__header shine-container chrome">
        <span className="node__header-title">{title}</span>
        <a className="node__header-delete" onClick={() => sticky.removeNode(wrapper, true)}>{'X'}</a>
      </header>

      <SplitSection wrapper={wrapper} ports={ports} zoom={zoom}>
        <Form
          gui={gui}
          values={inputs}
          onChange={onChange}
        />
      </SplitSection>
    </article>
  );
};

export default Node;
