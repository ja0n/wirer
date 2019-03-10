export function getParentSvg(el) {
  if (!el.parentNode) return null;
  if (el.parentNode.nodeName === 'svg')
    return el.parentNode;
  return getParentSvg(el.parentNode);
}

export function createElement(name, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', name);

  for (let key in attrs) el.setAttribute(key, attrs[key]);

  return el;
}

