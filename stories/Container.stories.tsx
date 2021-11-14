import React from 'react';
import { Container as ContainerComponent } from '../src/react/components';
import { getRandom, randomizeNodes } from './utils';

export default {
  title: 'Components/Container',
  component: ContainerComponent,
  argTypes: {
    backgroundColor: { control: 'color' },
    gridColor: { control: 'color' },
  },
};

const initialNodes = [
  'SourceString', 'SourceNumber', 'Alert',
];
const onLoad = randomizeNodes(initialNodes);

export const Container = (args) => (
    <ContainerComponent
      {...args}
      onLoad={onLoad}
    />
)