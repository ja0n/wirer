export default function createElement(name, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', name);

  for (let key in attrs) el.setAttribute(key, attrs[key]);

  return el;
}

