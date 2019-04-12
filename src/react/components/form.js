import React from 'react';
import set from 'lodash/set';
import invoke from 'lodash/invoke';

const _identity = v => v;

export const Form = ({ gui, inputs, values, onChange = _identity }) => (
  <form>
    {Object.entries(gui).map(( [id, input] ) => {
      const { label, type, options } = input;
      const createHandler = (f = _identity)  => event => {
        const value  = f(event.target.value);
        onChange({ event, id, value });
      };
      const props = {
        key: id,
        label,
        type,
        options,
        value: inputs[id],
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
  // onChange({ target: input });

  return (
    <label>
      {label}
      <input type={type} defaultValue={value} onChange={onChange} />
    </label>
  )
};

const Select = ({ label, options, value, onChange }) => {
  // onChange({ target: select });

  return (
    <label>
      {label}
      <select defaultValue={value} onChange={onChange}>
        {options.map(value => (
          <option key={value} defaultValue={value}>{value}</option>
        ))}
      </select>
    </label>
  )
};

export default Form;