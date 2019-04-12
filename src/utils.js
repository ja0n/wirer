export function getParentSvg(el) {
  if (!el.parentNode) return null;
  if (el.parentNode.nodeName === 'svg')
    return el.parentNode;
  return getParentSvg(el.parentNode);
}

export function createElement(name, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (let key in attrs)
    el.setAttribute(key, attrs[key]);
  return el;
}

export const colors = [
  "#B8D430", "#3AB745", "#029990", "#3501CB",
  "#2E2C75", "#673A7E", "#CC0071", "#F80120",
  "#F35B20", "#FB9A00", "#FFCC00", "#FEF200",
];
