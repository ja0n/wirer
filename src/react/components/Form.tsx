import React from 'react';
import invoke from 'lodash/invoke';
import { GuiConfig } from '../../Node'
import { WirerContext } from './Container';
import { themeStyles } from '../themeStyles';

type Props = {
  gui: GuiConfig;
  values: Record<string, any>;
  onChange?: Function;
}

export const Form = ({ gui, values, onChange }: Props) => (
  <form>
    {Object.entries(gui).map(( [id, input] ) => {
      const { label, type, options } = input;
      const createHandler = (f = v => v)  => event => {
        const value  = f(event.target.value);
        onChange?.({ event, id, value });
      };
      const props = {
        key: id,
        label,
        type,
        options,
        value: values[id],
      };
      const inputTypes = {
        'number': (props) => <Input {...props} onChange={createHandler(Number)} />,
        'text': (props) => <Input {...props} onChange={createHandler(Number)} />,
        'select': (props) => <Select {...props} onChange={createHandler()} />,
      };

      return invoke(inputTypes, [type], props);
    })}
  </form>
);

const Input = ({ label, type, value, onChange }) => {
  const wirer = React.useContext(WirerContext);
  const themeStyles = wirer.render.themeStyles;

  return (
    <label style={themeStyles.nodeInputLabel}>
      <span>{label}</span>
      <input
        type={type}
        defaultValue={value}
        onChange={onChange}
        style={{ ...themeStyles.nodeInput, ...themeStyles.nodeInputPadding }}
      />
    </label>
  )
};

const Select = ({ label, options, value, onChange }) => {
  const wirer = React.useContext(WirerContext);

  return (
    <label style={themeStyles.nodeInputLabel}>
      <span>{label}</span>
      <select value={value} onChange={onChange} style={themeStyles.nodeInput}>
        {options.map(option => (
          <option key={option} value={option}>{option.toString()}</option>
        ))}
      </select>
    </label>
  )
};

export default Form;
