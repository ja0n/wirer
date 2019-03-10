import { createElement } from './utils';

const _identity = v => v;

export function buildForm (gui, getValue, onChange = _identity) {
  const form = document.createElement('form');
  form.xmlns = 'http://www.w3.org/1999/xhtml';
  // form.style.margin = '0';

  Object.entries(gui).forEach(([id, input]) => {
    const { label, type, options } = input;
    let element;

    const createHandler = (f = _identity)  => event => {
      onChange({ event, id, value: f(event.target.value) });
    };

    switch (type) {
      case 'number': {
        element = createLabel(label, type, getValue(id), createHandler(Number));
        break;
      }
      case 'text': {
        element = createLabel(label, type, getValue(id), createHandler());
        break;
      }
      case 'select': {
        element = createSelect(label, options, getValue(id), createHandler());
        break;
      }
    }

    form.appendChild(element);
  });

  return form;
}

const createLabel = (_label, type, value, onChange) => {
  const label = document.createElement('label');
  const txt = document.createTextNode(`${_label}: `);
  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  input.addEventListener('change', onChange);
  onChange({ target: input });
  // input.style.width = '100%';

  label.appendChild(txt);
  label.appendChild(input);

  return label;
};

const createSelect = (_label, options, value, onChange) => {
  const label = document.createElement('label');
  const txt = document.createTextNode(`${_label}: `);
  const select = document.createElement('select');
  options.forEach(value => {
    const option = document.createElement('option');
    option.value = option.text = value;

    select.add(option, null);
  });
  select.value = value;
  select.addEventListener('change', onChange);
  onChange({ target: select });
  label.appendChild(txt);
  label.appendChild(select);

  return label;
};