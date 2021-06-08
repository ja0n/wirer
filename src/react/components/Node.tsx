import React from 'react';

import SplitSection from './SplitSection';
import Form from './Form';
import NodeModel, { GuiConfig, PortCount } from '../../Node'
import { StickyContext } from './Container';

type Props = {
  wrapper: NodeModel;
  title: string;
  bgColor: string;
  gui?: GuiConfig;
  className?: string;
  inputs:  Record<string, any>;
  onChange: Function;
}

const Node = (props: Props) => {
  const {
    title, bgColor, gui,
    inputs, onChange, wrapper,
    className
  } = props;
  const sticky = React.useContext(StickyContext);
  const themeStyles = sticky.render.themeStyles;
  let headerStyle = themeStyles.nodeHeader;
  if (sticky.render.lastSelected === wrapper) {
    headerStyle = { ...headerStyle, ...themeStyles.nodeHeaderSelected };
  }

  return (
    <article style={{ ...themeStyles.nodeContainer, backgroundColor: bgColor }} className={className}>
      <header style={headerStyle} className="node__header chrome">
        <span style={themeStyles.nodeHeaderName}>{title}</span>
        <a style={themeStyles.nodeHeaderDelete} onClick={() => sticky.removeNode(wrapper, true)}>{'X'}</a>
      </header>
      <SplitSection node={wrapper}>
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
